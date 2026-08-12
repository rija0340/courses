import { getDomainSeed } from '../../data/vocabs';
import { sanitizeItemPhonetic } from '../../data/vocabs/vocabItemStructure';

const DOMAIN_KEY = (id) => `medi_vocabs_domain_${id}`;
const IMAGE_KEY = (domainId, itemId) => `medi_vocabs_img_${domainId}_${itemId}`;
const CAT_IMAGE_KEY = (domainId, categoryId) => `medi_vocabs_catimg_${domainId}_${categoryId}`;
const SEEDED_KEY = (id) => `medi_vocabs_seeded_${id}`;

function migrateDomain(domain) {
  if (!domain) return domain;
  const org = domain.organization || {};
  const hasNew = Array.isArray(org.categories);
  const hasOld = org.filter?.groups;

  let migrated = { ...domain };
  if (!hasNew && hasOld) {
    const categories = org.filter.groups.map(g => ({
      id: g.id,
      label: g.label,
      children: (g.children || []).map(c => ({
        id: c.id,
        label: c.label,
        children: []
      }))
    }));
    migrated.organization = {
      tabs: org.tabs || [],
      categories
    };
  }
  if (Array.isArray(migrated.items)) {
    migrated.items = migrated.items.map(item => {
      let next = item;
      if (!item.categoryId) {
        let categoryId = null;
        if (item.sub) categoryId = item.sub;
        else if (item.part) categoryId = item.part;
        const { part, sub, ...rest } = item;
        next = { ...rest, categoryId };
      }
      return sanitizeItemPhonetic(next);
    });
  }
  return migrated;
}

const localStorageProvider = {
  async getDomain(domainId) {
    const raw = localStorage.getItem(DOMAIN_KEY(domainId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return migrateDomain(parsed);
  },

  async saveDomain(domainId, data) {
    const payload = data && Array.isArray(data.items)
      ? { ...data, items: data.items.map(sanitizeItemPhonetic) }
      : data;
    localStorage.setItem(DOMAIN_KEY(domainId), JSON.stringify(payload));
  },

  async initDomain(domainId) {
    if (localStorage.getItem(SEEDED_KEY(domainId))) return;
    const seed = getDomainSeed(domainId);
    if (!seed) throw new Error(`No seed for domain: ${domainId}`);
    await this.saveDomain(domainId, seed);
    localStorage.setItem(SEEDED_KEY(domainId), 'true');
  },

  async getOrganization(domainId) {
    const domain = await this.getDomain(domainId);
    return domain?.organization || null;
  },

  async updateOrganization(domainId, organization) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');
    domain.organization = organization;
    await this.saveDomain(domainId, domain);
  },

  async updateCategories(domainId, categories) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');
    domain.organization = { ...(domain.organization || {}), categories };
    await this.saveDomain(domainId, domain);
  },

  async updateMeta(domainId, meta) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');
    domain.meta = meta;
    await this.saveDomain(domainId, domain);
  },

  async getItems(domainId) {
    const domain = await this.getDomain(domainId);
    return domain?.items || [];
  },

  async createItem(domainId, item) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');
    const newItem = sanitizeItemPhonetic({
      ...item,
      id: item.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    });
    domain.items.push(newItem);
    await this.saveDomain(domainId, domain);
    return newItem;
  },

  async updateItem(domainId, id, data) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');
    const idx = domain.items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    domain.items[idx] = sanitizeItemPhonetic({ ...domain.items[idx], ...data });
    await this.saveDomain(domainId, domain);
    return domain.items[idx];
  },

  async deleteItem(domainId, id) {
    const domain = await this.getDomain(domainId);
    if (!domain) throw new Error('Domain not found');
    domain.items = domain.items.filter(i => i.id !== id);
    await this.saveDomain(domainId, domain);
    localStorage.removeItem(IMAGE_KEY(domainId, id));
  },

  async getImage(domainId, itemId) {
    return localStorage.getItem(IMAGE_KEY(domainId, itemId));
  },

  async saveImage(domainId, itemId, base64) {
    localStorage.setItem(IMAGE_KEY(domainId, itemId), base64);
    return base64;
  },

  async deleteImage(domainId, itemId) {
    localStorage.removeItem(IMAGE_KEY(domainId, itemId));
  },

  async getCategoryImage(domainId, categoryId) {
    return localStorage.getItem(CAT_IMAGE_KEY(domainId, categoryId));
  },

  async saveCategoryImage(domainId, categoryId, base64) {
    localStorage.setItem(CAT_IMAGE_KEY(domainId, categoryId), base64);
    return base64;
  },

  async deleteCategoryImage(domainId, categoryId) {
    localStorage.removeItem(CAT_IMAGE_KEY(domainId, categoryId));
  },

  async exportAll(domainId) {
    return this.getDomain(domainId);
  },

  async resetDomain(domainId) {
    localStorage.removeItem(DOMAIN_KEY(domainId));
    localStorage.removeItem(SEEDED_KEY(domainId));
    const imagesPrefix = `medi_vocabs_img_${domainId}_`;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(imagesPrefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  },

  async listDomains() {
    const domains = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('medi_vocabs_domain_')) continue;
      const id = key.slice('medi_vocabs_domain_'.length);
      const domain = await this.getDomain(id);
      if (domain) {
        domains.push({
          id,
          meta: domain.meta,
          organization: domain.organization,
          itemCount: domain.items?.length || 0,
          updatedAt: null
        });
      }
    }
    return domains.sort((a, b) => a.id.localeCompare(b.id));
  },

  async createDomain(domainId, { meta, organization }) {
    const existing = await this.getDomain(domainId);
    if (existing) throw new Error(`Le domaine « ${domainId} » existe déjà`);
    await this.saveDomain(domainId, {
      id: domainId,
      version: 2,
      meta,
      organization,
      items: []
    });
    return { id: domainId, meta, organization };
  },

  async deleteDomain(domainId) {
    await this.resetDomain(domainId);
    const catPrefix = `medi_vocabs_catimg_${domainId}_`;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(catPrefix)) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
};

export default localStorageProvider;
