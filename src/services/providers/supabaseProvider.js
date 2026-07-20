import { supabase } from '../supabaseClient';
import { getDomainSeed } from '../../data/vocabs';
import {
  IMAGE_BUCKET,
  dataUrlToBlob,
  resolveImageSrc,
  itemImagePath,
  categoryImagePath,
  isAcceptedImageType,
} from '../imageUpload';
import { requireAuthSession } from '../supabaseHealth';

function mapItem(item) {
  return {
    id: item.id,
    en: item.en,
    fr: item.fr,
    mg: item.mg,
    category: item.category,
    tab: item.tab,
    categoryId: item.category_id,
    phonetic: item.phonetic,
    image: resolveImageSrc(item),
  };
}

function mapItemRow(item, domainId) {
  return {
    id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    domain_id: domainId,
    en: item.en || '',
    fr: item.fr || '',
    mg: item.mg || '',
    category: item.category || '',
    tab: item.tab || '',
    category_id: item.categoryId || null,
    phonetic: item.phonetic || null,
    // Prefer URL if caller already has a Storage URL; keep legacy base64 only as fallback
    image_url: item.image_url || (isHttpUrl(item.image) ? item.image : null),
    image: isHttpUrl(item.image) ? null : (item.image || null),
  };
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function friendlyStorageError(error) {
  const msg = error?.message || String(error || 'Échec upload Storage');
  const lower = msg.toLowerCase();
  if (lower.includes('row-level security') || lower.includes('rls') || lower.includes('not authorized') || lower.includes('jwt')) {
    return 'Accès Storage refusé. Connectez-vous en admin, et vérifiez que le bucket vocab-images + ses policies existent (supabase_schema.sql).';
  }
  if (lower.includes('bucket') && (lower.includes('not found') || lower.includes('does not exist'))) {
    return 'Bucket vocab-images introuvable. Exécutez la section Storage de supabase_schema.sql dans le SQL Editor.';
  }
  if (lower.includes('mime') || lower.includes('type')) {
    return `Type de fichier refusé par le bucket: ${msg}. Formats: JPG, PNG, WebP, GIF, SVG.`;
  }
  return msg;
}

async function uploadToBucket(path, blob, mime) {
  if (!isAcceptedImageType(mime)) {
    throw new Error(`Format non supporté: ${mime}. Utilisez JPG, PNG, WebP, GIF ou SVG.`);
  }

  await requireAuthSession();

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, {
      upsert: true,
      contentType: mime === 'image/jpg' ? 'image/jpeg' : mime,
      cacheControl: '3600',
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(friendlyStorageError(error));
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error('Upload OK mais URL publique introuvable — vérifiez que le bucket est public.');
  }
  return data.publicUrl;
}

async function removeFromBucket(paths) {
  const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean);
  if (!list.length) return;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(list);
  if (error) {
    // Non-fatal: DB row may still be cleared
    console.warn('Storage remove warning:', error.message);
  }
}

/** Best-effort remove of previous object(s) for an item/category (all extensions). */
async function removeExistingVariants(prefixPathWithoutExt) {
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  await removeFromBucket(exts.map(ext => `${prefixPathWithoutExt}.${ext}`));
}

const supabaseProvider = {
  async getDomain(domainId) {
    if (!supabase) return null;

    const { data: domain, error: domainErr } = await supabase
      .from('vocab_domains')
      .select('*')
      .eq('id', domainId)
      .maybeSingle();

    if (domainErr) {
      console.error('Error fetching domain:', domainErr);
      throw new Error(domainErr.message);
    }
    if (!domain) return null;

    const { data: items, error: itemsErr } = await supabase
      .from('vocab_items')
      .select('*')
      .eq('domain_id', domainId)
      .order('created_at', { ascending: true });

    if (itemsErr) {
      console.error('Error fetching items:', itemsErr);
      throw new Error(itemsErr.message);
    }

    return {
      id: domain.id,
      meta: domain.meta,
      organization: domain.organization,
      items: (items || []).map(mapItem),
    };
  },

  async saveDomain(domainId, data) {
    if (!supabase) return;

    const { error: domainErr } = await supabase
      .from('vocab_domains')
      .upsert({
        id: domainId,
        meta: data.meta,
        organization: data.organization,
        updated_at: new Date().toISOString(),
      });

    if (domainErr) {
      console.error('Error saving domain:', domainErr);
      throw new Error(domainErr.message);
    }

    if (data.items) {
      const mappedItems = data.items.map(item => ({
        ...mapItemRow(item, domainId),
        updated_at: new Date().toISOString(),
      }));

      const { error: deleteErr } = await supabase
        .from('vocab_items')
        .delete()
        .eq('domain_id', domainId);

      if (deleteErr) {
        console.error('Error cleaning up items during saveDomain:', deleteErr);
        throw new Error(deleteErr.message);
      }

      if (mappedItems.length > 0) {
        const { error: insertErr } = await supabase
          .from('vocab_items')
          .insert(mappedItems);

        if (insertErr) {
          console.error('Error inserting items during saveDomain:', insertErr);
          throw new Error(insertErr.message);
        }
      }
    }
  },

  async initDomain(domainId) {
    if (!supabase) return { seeded: false, reason: 'no-client' };

    const { data: domainExists, error: checkErr } = await supabase
      .from('vocab_domains')
      .select('id')
      .eq('id', domainId)
      .maybeSingle();

    if (checkErr) {
      console.error('Error checking domain status:', checkErr);
      throw new Error(checkErr.message);
    }

    if (domainExists) return { seeded: false, reason: 'already-exists' };

    // Seeding inserts rows — RLS requires an authenticated session.
    // Public readers must not trigger INSERT (that caused the RLS error).
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { seeded: false, reason: 'needs-auth' };
    }

    const seed = getDomainSeed(domainId);
    if (!seed) throw new Error(`No seed for domain: ${domainId}`);

    const { error: domainInsertErr } = await supabase
      .from('vocab_domains')
      .insert({
        id: domainId,
        meta: seed.meta,
        organization: seed.organization,
      });

    if (domainInsertErr) {
      console.error('Error seeding domain metadata:', domainInsertErr);
      // Race: another tab may have inserted — treat unique violation as OK
      if (!/duplicate|unique/i.test(domainInsertErr.message || '')) {
        throw new Error(domainInsertErr.message);
      }
      return { seeded: false, reason: 'already-exists' };
    }

    if (seed.items && seed.items.length > 0) {
      const mappedItems = seed.items.map(item => mapItemRow(item, domainId));

      const { error: itemsInsertErr } = await supabase
        .from('vocab_items')
        .insert(mappedItems);

      if (itemsInsertErr) {
        console.error('Error seeding domain items:', itemsInsertErr);
        throw new Error(itemsInsertErr.message);
      }
    }

    return { seeded: true, reason: 'ok' };
  },

  async getOrganization(domainId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('vocab_domains')
      .select('organization')
      .eq('id', domainId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data?.organization || null;
  },

  async updateOrganization(domainId, organization) {
    if (!supabase) return;
    const { error } = await supabase
      .from('vocab_domains')
      .update({
        organization,
        updated_at: new Date().toISOString(),
      })
      .eq('id', domainId);

    if (error) throw new Error(error.message);
  },

  async updateCategories(domainId, categories) {
    if (!supabase) return;
    const org = (await this.getOrganization(domainId)) || {};
    org.categories = categories;
    await this.updateOrganization(domainId, org);
  },

  async updateMeta(domainId, meta) {
    if (!supabase) return;
    const { error } = await supabase
      .from('vocab_domains')
      .update({
        meta,
        updated_at: new Date().toISOString(),
      })
      .eq('id', domainId);

    if (error) throw new Error(error.message);
  },

  async getItems(domainId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('vocab_items')
      .select('*')
      .eq('domain_id', domainId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(mapItem);
  },

  async createItem(domainId, item) {
    if (!supabase) return null;
    const newItem = mapItemRow(item, domainId);

    const { error } = await supabase
      .from('vocab_items')
      .insert(newItem);

    if (error) throw new Error(error.message);
    return { ...item, id: newItem.id, image: resolveImageSrc(newItem) };
  },

  async updateItem(domainId, id, data) {
    if (!supabase) return null;

    const updateData = {};
    if (data.en !== undefined) updateData.en = data.en;
    if (data.fr !== undefined) updateData.fr = data.fr;
    if (data.mg !== undefined) updateData.mg = data.mg;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tab !== undefined) updateData.tab = data.tab;
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
    if (data.phonetic !== undefined) updateData.phonetic = data.phonetic;
    if (data.image !== undefined) {
      if (isHttpUrl(data.image)) {
        updateData.image_url = data.image;
        updateData.image = null;
      } else {
        updateData.image = data.image;
      }
    }
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('vocab_items')
      .update(updateData)
      .eq('id', id);

    if (error) throw new Error(error.message);

    const { data: updated, error: fetchErr } = await supabase
      .from('vocab_items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr) throw new Error(fetchErr.message);
    return mapItem(updated);
  },

  async deleteItem(domainId, id) {
    if (!supabase) return;
    await removeExistingVariants(`items/${domainId}/${id}`);
    const { error } = await supabase
      .from('vocab_items')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getImage(domainId, itemId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('vocab_items')
      .select('image_url, image')
      .eq('id', itemId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return resolveImageSrc(data);
  },

  /**
   * Upload image to Supabase Storage, store public URL in image_url.
   * @param {string} dataUrl - data:image/...;base64,... from ImageUploader
   * @returns {Promise<string>} public URL
   */
  async saveImage(domainId, itemId, dataUrl) {
    if (!supabase) return null;

    await requireAuthSession();
    const { blob, mime } = dataUrlToBlob(dataUrl);
    await removeExistingVariants(`items/${domainId}/${itemId}`);
    const path = itemImagePath(domainId, itemId, mime);
    const publicUrl = await uploadToBucket(path, blob, mime);

    const { data, error } = await supabase
      .from('vocab_items')
      .update({
        image_url: publicUrl,
        image: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select('id')
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) {
      throw new Error(`Mot introuvable (${itemId}) — créez/sauvegardez le mot avant d’ajouter une image.`);
    }
    return publicUrl;
  },

  async deleteImage(domainId, itemId) {
    if (!supabase) return;
    await requireAuthSession();
    await removeExistingVariants(`items/${domainId}/${itemId}`);
    const { error } = await supabase
      .from('vocab_items')
      .update({
        image_url: null,
        image: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (error) throw new Error(error.message);
  },

  async getCategoryImage(domainId, categoryId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('vocab_category_images')
      .select('image_url, image')
      .eq('category_id', categoryId)
      .maybeSingle();

    if (error) {
      console.error('Error getting category image:', error);
      return null;
    }
    return resolveImageSrc(data);
  },

  async saveCategoryImage(domainId, categoryId, dataUrl) {
    if (!supabase) return null;

    await requireAuthSession();
    const { blob, mime } = dataUrlToBlob(dataUrl);
    await removeExistingVariants(`categories/${domainId}/${categoryId}`);
    const path = categoryImagePath(domainId, categoryId, mime);
    const publicUrl = await uploadToBucket(path, blob, mime);

    const { error } = await supabase
      .from('vocab_category_images')
      .upsert({
        category_id: categoryId,
        domain_id: domainId,
        image_url: publicUrl,
        image: null,
        updated_at: new Date().toISOString(),
      });

    if (error) throw new Error(error.message);
    return publicUrl;
  },

  async deleteCategoryImage(domainId, categoryId) {
    if (!supabase) return;
    await requireAuthSession();
    await removeExistingVariants(`categories/${domainId}/${categoryId}`);
    const { error } = await supabase
      .from('vocab_category_images')
      .delete()
      .eq('category_id', categoryId);

    if (error) throw new Error(error.message);
  },

  async exportAll(domainId) {
    return this.getDomain(domainId);
  },

  async resetDomain(domainId) {
    if (!supabase) return;
    const { error } = await supabase
      .from('vocab_domains')
      .delete()
      .eq('id', domainId);

    if (error) throw new Error(error.message);
    await this.initDomain(domainId);
  },

  async listDomains() {
    if (!supabase) return [];

    const { data: domains, error } = await supabase
      .from('vocab_domains')
      .select('id, meta, organization, updated_at')
      .order('id');

    if (error) throw new Error(error.message);

    const { data: items, error: itemsErr } = await supabase
      .from('vocab_items')
      .select('domain_id');

    if (itemsErr) throw new Error(itemsErr.message);

    const counts = {};
    (items || []).forEach(row => {
      counts[row.domain_id] = (counts[row.domain_id] || 0) + 1;
    });

    return (domains || []).map(d => ({
      id: d.id,
      meta: d.meta,
      organization: d.organization,
      itemCount: counts[d.id] || 0,
      updatedAt: d.updated_at
    }));
  },

  async createDomain(domainId, { meta, organization }) {
    if (!supabase) throw new Error('Supabase non configuré');
    await requireAuthSession();

    const { data: existing } = await supabase
      .from('vocab_domains')
      .select('id')
      .eq('id', domainId)
      .maybeSingle();

    if (existing) throw new Error(`Le domaine « ${domainId} » existe déjà`);

    const { error } = await supabase
      .from('vocab_domains')
      .insert({
        id: domainId,
        meta,
        organization,
        updated_at: new Date().toISOString()
      });

    if (error) throw new Error(error.message);
    return { id: domainId, meta, organization };
  },

  async deleteDomain(domainId) {
    if (!supabase) return;
    await requireAuthSession();

    const { error: itemsErr } = await supabase
      .from('vocab_items')
      .delete()
      .eq('domain_id', domainId);

    if (itemsErr) throw new Error(itemsErr.message);

    const { error: domainErr } = await supabase
      .from('vocab_domains')
      .delete()
      .eq('id', domainId);

    if (domainErr) throw new Error(domainErr.message);
  },
};

export default supabaseProvider;
