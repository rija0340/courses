/**
 * Root-category item structure: langs + configurable columns.
 * Children inherit via resolveItemStructure(categories, categoryId).
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

/** Attrs keys stored in vocab_items.attrs */
export const STRUCTURE_ATTR_KEYS = STRUCTURE_FIELD_IDS;

export function emptyI18nEntry() {
  return { en: '', fr: '', mg: '' };
}

export function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function emptyItemStructure() {
  return { langs: [], fields: [] };
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
    const id = String(f.id || '');
    if (!STRUCTURE_FIELD_CATALOG[id] || seen.has(id)) return;
    seen.add(id);
    const meta = STRUCTURE_FIELD_CATALOG[id];
    fields.push({
      id,
      type: meta.type,
      translate: f.translate === true,
    });
  });
  if (!langs.length && !fields.length) return null;
  return { langs, fields };
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

/**
 * Structure for a category: from its root ancestor's itemStructure, or null (legacy MediVocabs).
 */
export function resolveItemStructure(categories, categoryId) {
  const root = resolveRootCategory(categories, categoryId);
  if (!root) return null;
  return normalizeItemStructure(root.itemStructure);
}

export function getStructureFieldMeta(fieldId) {
  return STRUCTURE_FIELD_CATALOG[fieldId] || null;
}

export function structureFieldLabel(fieldId, lang = 'fr') {
  const meta = getStructureFieldMeta(fieldId);
  if (!meta) return fieldId;
  return meta.label?.[lang] || meta.label?.fr || fieldId;
}

/** Headword translation langs for a structure (never includes en). */
export function structureHeadLangs(structure) {
  return structure?.langs || [];
}

export function normalizeI18nValue(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const t = value.trim();
    if (!t) return null;
    return { en: t, fr: '', mg: '' };
  }
  if (typeof value !== 'object') return null;
  const out = {
    en: value.en != null ? String(value.en) : '',
    fr: value.fr != null ? String(value.fr) : '',
    mg: value.mg != null ? String(value.mg) : '',
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

/**
 * Normalize a list field value.
 * translate=false → string[]
 * translate=true → {en,fr,mg}[]
 */
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
        if (typeof v === 'string') return v.trim();
        if (v && typeof v === 'object') return String(v.en || v.fr || v.mg || '').trim();
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
  return hasText(raw);
}

export function pickItemAttrs(item = {}) {
  const out = {};
  STRUCTURE_ATTR_KEYS.forEach((key) => {
    if (item[key] !== undefined) out[key] = item[key];
  });
  return out;
}

export function mergeAttrsIntoItem(row) {
  const attrs = row?.attrs && typeof row.attrs === 'object' ? row.attrs : {};
  const extra = {};
  STRUCTURE_ATTR_KEYS.forEach((key) => {
    if (attrs[key] !== undefined) extra[key] = attrs[key];
  });
  return extra;
}

/** Sample value for JSON template based on field def. */
export function sampleFieldValue(fieldDef) {
  if (!fieldDef) return null;
  if (fieldDef.type === 'list') {
    if (fieldDef.translate) {
      return [
        { en: 'example', fr: 'exemple', mg: '' },
      ];
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
