/**
 * Root-category item structure: langs + configurable columns.
 * Preset catalog remains; fields can be custom (rename / add / remove).
 */
import { getPath } from '../../utils/categoryTree';

export const STRUCTURE_LANG_OPTIONS = ['fr', 'mg'];

export const STRUCTURE_FIELD_CATALOG = {
  phonetic: {
    id: 'phonetic',
    type: 'text',
    label: { fr: 'Phonétique', en: 'Phonetic', mg: 'Fonetika' },
    defaultTranslate: false,
  },
  synonyms: {
    id: 'synonyms',
    type: 'list',
    label: { fr: 'Synonymes', en: 'Synonyms', mg: 'Mitovy hevitra' },
    defaultTranslate: true,
  },
  antonyms: {
    id: 'antonyms',
    type: 'list',
    label: { fr: 'Antonymes', en: 'Antonyms', mg: 'Mifanohitra' },
    defaultTranslate: true,
  },
  context: {
    id: 'context',
    type: 'text',
    label: { fr: 'Contexte', en: 'Context', mg: 'Toe-javatra' },
    defaultTranslate: true,
  },
  particle: {
    id: 'particle',
    type: 'text',
    label: { fr: 'Particule', en: 'Particle', mg: 'Partikula' },
    defaultTranslate: false,
  },
  pattern: {
    id: 'pattern',
    type: 'text',
    label: { fr: 'Schéma', en: 'Pattern', mg: 'Lamina' },
    defaultTranslate: false,
  },
  register: {
    id: 'register',
    type: 'text',
    label: { fr: 'Registre', en: 'Register', mg: 'Haavo fiteny' },
    defaultTranslate: false,
  },
  notes: {
    id: 'notes',
    type: 'text',
    label: { fr: 'Notes', en: 'Notes', mg: 'Fanamarihana' },
    defaultTranslate: true,
  },
};

export const STRUCTURE_FIELD_IDS = Object.keys(STRUCTURE_FIELD_CATALOG);

const FIELD_ID_RE = /^[a-z][a-z0-9_]{0,39}$/;

const ATTR_RESERVED = new Set([
  'id', 'en', 'fr', 'mg', 'category', 'tab', 'categoryId', 'category_id',
  'phonetic', 'example', 'dialogue', 'image', 'image_url', 'attrs',
  'domain_id', 'created_at', 'updated_at',
]);

export function emptyI18nEntry() {
  return { en: '', fr: '', mg: '' };
}

export function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim() !== '[object Object]';
}

const OBJECT_OBJECT_RE = /^\[object Object\]$/i;

/**
 * Extract a displayable string from nested i18n / JSON / corrupted objects.
 * Never returns the literal "[object Object]".
 */
export function coerceDisplayText(value, preferredKeys = ['en', 'fr', 'mg'], depth = 0) {
  if (value == null || value === '' || depth > 6) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'string') {
    const t = value.trim();
    if (!t || OBJECT_OBJECT_RE.test(t)) return '';
    if ((t.startsWith('{') || t.startsWith('[')) && t.includes(':')) {
      try {
        return coerceDisplayText(JSON.parse(t), preferredKeys, depth + 1);
      } catch {
        return t;
      }
    }
    return t;
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => coerceDisplayText(v, preferredKeys, depth + 1))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    for (const key of preferredKeys) {
      if (value[key] == null) continue;
      const t = coerceDisplayText(value[key], preferredKeys, depth + 1);
      if (t) return t;
    }
    for (const key of ['ipa', 'phonetic', 'text', 'value', 'label']) {
      if (value[key] == null) continue;
      const t = coerceDisplayText(value[key], preferredKeys, depth + 1);
      if (t) return t;
    }
    for (const v of Object.values(value)) {
      const t = coerceDisplayText(v, preferredKeys, depth + 1);
      if (t) return t;
    }
  }
  return '';
}

/** Prefer UI lang, then fr / en / mg. Always a string (never a React child object). */
export function pickLangText(value, lang = 'fr') {
  const order = [lang, 'fr', 'en', 'mg'].filter((k, i, arr) => arr.indexOf(k) === i);
  return coerceDisplayText(value, order);
}

/**
 * IPA column is always a plain string (EN-first).
 * Accepts "/ˈhæpi/", { en: "/ˈhæpi/" }, nested objects, JSON strings.
 * Rejects the corrupted literal "[object Object]".
 */
export function coercePhoneticString(value) {
  return coerceDisplayText(value, ['en', 'ipa', 'phonetic', 'fr', 'mg']);
}

/** Normalize string columns that must never be objects. */
export function sanitizeItemPhonetic(item) {
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    en: coerceDisplayText(item.en) || '',
    fr: coerceDisplayText(item.fr),
    mg: coerceDisplayText(item.mg),
    phonetic: coercePhoneticString(item.phonetic) || null,
  };
}

export function emptyItemStructure() {
  return { langs: [], fields: [] };
}

export function isValidFieldId(id) {
  return typeof id === 'string' && FIELD_ID_RE.test(id) && !ATTR_RESERVED.has(id);
}

function normalizeFieldLabel(raw, fallbackId, catalogMeta) {
  const base = catalogMeta?.label
    ? { fr: catalogMeta.label.fr || '', en: catalogMeta.label.en || '', mg: catalogMeta.label.mg || '' }
    : { fr: fallbackId, en: fallbackId, mg: '' };
  if (!raw || typeof raw !== 'object') return base;
  return {
    fr: coerceDisplayText(raw.fr, ['fr', 'en', 'mg']) || base.fr,
    en: coerceDisplayText(raw.en, ['en', 'fr', 'mg']) || base.en || base.fr,
    mg: coerceDisplayText(raw.mg, ['mg', 'fr', 'en']) || base.mg || '',
  };
}

export function normalizeItemStructure(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const langs = Array.isArray(raw.langs)
    ? raw.langs.map(String).filter((l) => STRUCTURE_LANG_OPTIONS.includes(l))
    : [];
  const fields = [];
  const seen = new Set();
  const list = Array.isArray(raw.fields) ? raw.fields : [];
  list.forEach((f) => {
    if (!f || typeof f !== 'object') return;
    let id = String(f.id || '').trim();
    if (!id || seen.has(id)) return;
    const catalogMeta = STRUCTURE_FIELD_CATALOG[id] || null;
    // Allow catalog ids OR custom valid ids (not reserved)
    if (!catalogMeta && !isValidFieldId(id)) return;
    if (ATTR_RESERVED.has(id) && id !== 'phonetic') return;
    // phonetic is special: allowed as structure field but stored in column
    seen.add(id);
    const type = f.type === 'list' || catalogMeta?.type === 'list' ? 'list' : 'text';
    // phonetic is always a plain string column — never translate/i18n
    const translate = id === 'phonetic' ? false : f.translate === true;
    fields.push({
      id,
      type: id === 'phonetic' ? 'text' : type,
      translate,
      label: normalizeFieldLabel(f.label, id, catalogMeta),
    });
  });
  if (!langs.length && !fields.length) return null;
  return { langs, fields };
}

export function createFieldFromPreset(presetId) {
  const meta = STRUCTURE_FIELD_CATALOG[presetId];
  if (!meta) return null;
  return {
    id: meta.id,
    type: meta.type,
    translate: !!meta.defaultTranslate,
    label: { ...meta.label },
  };
}

export function createCustomField({ id, type = 'text', translate = false, labelFr = '' }) {
  const source = String(id || labelFr || '').trim();
  const cleanId = source
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!isValidFieldId(cleanId)) return null;
  const fr = String(labelFr || '').trim() || cleanId;
  return {
    id: cleanId,
    type: type === 'list' ? 'list' : 'text',
    translate: !!translate,
    label: { fr, en: fr, mg: '' },
  };
}

/** True when payload may carry attrs (custom/preset columns). */
export function hasItemAttrPayload(data = {}) {
  return Object.keys(data || {}).some((key) => {
    if (key.startsWith('_')) return false;
    if (ATTR_RESERVED.has(key)) return false;
    return true;
  }) || STRUCTURE_FIELD_IDS.some((k) => k !== 'phonetic' && data[k] !== undefined);
}

export function isRootCategory(categories, categoryId) {
  if (!categoryId || !Array.isArray(categories)) return false;
  return categories.some((n) => n.id === categoryId);
}

export function resolveRootCategory(categories, categoryId) {
  if (!categoryId) return null;
  const path = getPath(categories, categoryId);
  return path[0] || null;
}

export function resolveItemStructure(categories, categoryId) {
  const root = resolveRootCategory(categories, categoryId);
  if (!root) return null;
  return normalizeItemStructure(root.itemStructure);
}

export function getStructureFieldMeta(fieldId) {
  return STRUCTURE_FIELD_CATALOG[fieldId] || null;
}

/** Accept field def object, id string, or a raw `{fr,en,mg}` label. Always a string. */
export function structureFieldLabel(fieldOrId, lang = 'fr') {
  if (fieldOrId && typeof fieldOrId === 'object') {
    const fromLabel = pickLangText(fieldOrId.label, lang);
    if (fromLabel) return fromLabel;
    if (typeof fieldOrId.label === 'string' && fieldOrId.label.trim()) return fieldOrId.label.trim();
    const fromSelf = pickLangText(fieldOrId, lang);
    if (fromSelf) return fromSelf;
    return typeof fieldOrId.id === 'string' ? fieldOrId.id : '';
  }
  const meta = getStructureFieldMeta(fieldOrId);
  if (!meta) return typeof fieldOrId === 'string' ? fieldOrId : '';
  return pickLangText(meta.label, lang) || (typeof fieldOrId === 'string' ? fieldOrId : '');
}

export function structureHeadLangs(structure) {
  return structure?.langs || [];
}

export function normalizeI18nValue(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const t = coerceDisplayText(value);
    if (!t) return null;
    return { en: t, fr: '', mg: '' };
  }
  if (typeof value !== 'object' || Array.isArray(value)) return null;
  const out = {
    en: coerceDisplayText(value.en),
    fr: coerceDisplayText(value.fr),
    mg: coerceDisplayText(value.mg),
  };
  if (!hasText(out.en) && !hasText(out.fr) && !hasText(out.mg)) return null;
  return out;
}

export function pickI18nText(value, preferredLang = 'en') {
  const n = normalizeI18nValue(value);
  if (!n) return '';
  if (hasText(n[preferredLang])) return n[preferredLang].trim();
  for (const code of ['en', 'fr', 'mg']) {
    if (hasText(n[code])) return n[code].trim();
  }
  return '';
}

export function normalizeListField(value, translate) {
  if (!Array.isArray(value)) {
    if (typeof value === 'string' && value.trim()) {
      return normalizeListField(
        value.split(/[;,]/).map((s) => s.trim()).filter(Boolean),
        translate
      );
    }
    return [];
  }
  if (!translate) {
    return value
      .map((v) => {
        if (typeof v === 'string') return coerceDisplayText(v);
        if (v && typeof v === 'object') return coerceDisplayText(v);
        return '';
      })
      .filter(Boolean);
  }
  return value
    .map((v) => {
      if (typeof v === 'string') {
        const t = v.trim();
        return t ? { en: t, fr: '', mg: '' } : null;
      }
      return normalizeI18nValue(v);
    })
    .filter(Boolean)
    .filter((e) => hasText(e.en) || hasText(e.fr) || hasText(e.mg));
}

export function listEntryPrimary(entry) {
  if (typeof entry === 'string') return entry;
  return pickI18nText(entry, 'en');
}

export function summarizeListField(value, translate, limit = 3) {
  const list = normalizeListField(value, translate);
  const labels = list.map(listEntryPrimary).filter(Boolean);
  if (!labels.length) return '';
  const head = labels.slice(0, limit).join(', ');
  return labels.length > limit ? `${head}…` : head;
}

export function fieldHasContent(item, fieldDef) {
  if (!item || !fieldDef) return false;
  const raw = item[fieldDef.id];
  if (fieldDef.type === 'list') {
    return normalizeListField(raw, fieldDef.translate).length > 0;
  }
  if (fieldDef.translate) {
    return Boolean(pickI18nText(raw));
  }
  return hasText(typeof raw === 'string' ? raw : coerceDisplayText(raw));
}

/** Persist any non-core keys (presets + custom) into attrs. */
export function pickItemAttrs(item = {}) {
  const out = {};
  Object.keys(item || {}).forEach((key) => {
    if (ATTR_RESERVED.has(key)) return;
    if (key.startsWith('_')) return;
    out[key] = item[key];
  });
  // phonetic stays in column; catalog extras without being reserved
  STRUCTURE_FIELD_IDS.forEach((key) => {
    if (key === 'phonetic') return;
    if (item[key] !== undefined) out[key] = item[key];
  });
  return out;
}

export function mergeAttrsIntoItem(row) {
  const attrs = row?.attrs && typeof row.attrs === 'object' ? row.attrs : {};
  return { ...attrs };
}

export function sampleFieldValue(fieldDef) {
  if (!fieldDef) return null;
  if (fieldDef.type === 'list') {
    if (fieldDef.translate) {
      return [{ en: 'example', fr: 'exemple', mg: '' }];
    }
    return ['example'];
  }
  if (fieldDef.translate) {
    return { en: 'Example sentence.', fr: 'Phrase exemple.', mg: '' };
  }
  if (fieldDef.id === 'phonetic') return '/ˈɛɡzæmpl/';
  if (fieldDef.id === 'particle') return 'up';
  if (fieldDef.id === 'pattern') return 'make a decision';
  if (fieldDef.id === 'register') return 'formal';
  return '';
}

export function buildSampleItemFromStructure(structure, { categoryId, tab = 'vocab' } = {}) {
  const langs = structureHeadLangs(structure);
  const item = {
    id: 'nouveau-mot',
    en: 'happy',
    fr: langs.includes('fr') ? 'heureux' : '',
    mg: langs.includes('mg') ? 'faly' : '',
    category: '',
    tab,
    categoryId: categoryId || undefined,
  };
  (structure?.fields || []).forEach((f) => {
    item[f.id] = sampleFieldValue(f);
  });
  return item;
}
