/**
 * Client TTS audio cache (memory + IndexedDB) keyed by model|text.
 * Used to avoid re-billing Deepgram on simulation replay.
 */

const DB_NAME = 'practice-tts-cache';
const STORE = 'audio';
const DB_VERSION = 1;
const memory = new Map();

function cacheKey(model, text) {
  const normalized = String(text || '').trim().replace(/\s+/g, ' ');
  return `${model || 'default'}|${normalized}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function idbGet(key) {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readonly');
      const store = tx.objectStore(STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export const ttsCache = {
  async get(text, model) {
    const key = cacheKey(model, text);
    if (memory.has(key)) return memory.get(key);
    const stored = await idbGet(key);
    if (stored?.audioBase64) {
      memory.set(key, stored);
      return stored;
    }
    return null;
  },

  async set(text, model, payload) {
    if (!payload?.audioBase64) return;
    const key = cacheKey(model, text);
    const value = {
      audioBase64: payload.audioBase64,
      mimeType: payload.mimeType || 'audio/mpeg',
      provider: payload.provider || 'deepgram',
      cachedAt: new Date().toISOString()
    };
    memory.set(key, value);
    await idbSet(key, value);
  }
};
