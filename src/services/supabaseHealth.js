import { supabase } from './supabaseClient';
import { IMAGE_BUCKET } from './imageUpload';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from './storageConfig';

/**
 * Runtime health check for Supabase (DB tables + Storage bucket).
 * Safe to call from the admin UI — uses the anon key already in the browser.
 */
export async function checkSupabaseHealth() {
  const result = {
    provider: ACTIVE_PROVIDER,
    configured: !!supabase,
    url: process.env.REACT_APP_SUPABASE_URL || null,
    session: null,
    tables: { vocab_domains: null, vocab_items: null, vocab_category_images: null },
    storage: { bucket: IMAGE_BUCKET, ok: null, public: null, error: null },
    errors: [],
  };

  if (!supabase) {
    result.errors.push('Client Supabase non initialisé — vérifiez REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY, puis redémarrez npm start.');
    return result;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    result.session = session
      ? { email: session.user?.email || null, role: session.user?.role || 'authenticated' }
      : null;
  } catch (err) {
    result.errors.push(`Auth: ${err.message}`);
  }

  for (const table of Object.keys(result.tables)) {
    try {
      const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        result.tables[table] = false;
        result.errors.push(`Table ${table}: ${error.message}`);
      } else {
        result.tables[table] = true;
      }
    } catch (err) {
      result.tables[table] = false;
      result.errors.push(`Table ${table}: ${err.message}`);
    }
  }

  try {
    const { data, error } = await supabase.storage.getBucket(IMAGE_BUCKET);
    if (error) {
      // getBucket often requires elevated privileges — fall back to list
      const listed = await supabase.storage.listBuckets();
      if (listed.error) {
        result.storage.ok = false;
        result.storage.error = error.message || listed.error.message;
        result.errors.push(`Bucket ${IMAGE_BUCKET}: ${result.storage.error}`);
      } else {
        const found = (listed.data || []).find(b => b.id === IMAGE_BUCKET || b.name === IMAGE_BUCKET);
        result.storage.ok = !!found;
        result.storage.public = found?.public ?? null;
        if (!found) {
          result.storage.error = 'Bucket introuvable — exécutez supabase_schema.sql';
          result.errors.push(result.storage.error);
        }
      }
    } else {
      result.storage.ok = true;
      result.storage.public = data?.public ?? null;
      if (data && data.public === false) {
        result.errors.push('Le bucket vocab-images n’est pas public — les images ne s’afficheront pas côté lecteur.');
      }
    }
  } catch (err) {
    result.storage.ok = false;
    result.storage.error = err.message;
    result.errors.push(`Storage: ${err.message}`);
  }

  result.ready =
    result.configured &&
    ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE &&
    result.tables.vocab_domains &&
    result.tables.vocab_items &&
    result.tables.vocab_category_images &&
    result.storage.ok !== false;

  result.canUploadImages = !!(result.ready && result.session);

  return result;
}

export async function requireAuthSession() {
  if (!supabase) {
    throw new Error('Supabase non configuré. Vérifiez le fichier .env et redémarrez le serveur.');
  }
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  if (!session) {
    throw new Error('Connectez-vous (admin) pour uploader des images — Storage exige un compte authentifié.');
  }
  return session;
}
