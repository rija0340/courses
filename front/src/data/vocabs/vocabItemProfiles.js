/**
 * Item field profiles per theme (category).
 * Core langs (en/fr/mg) are always available but optional.
 * Profile only gates “extra” columns shown in form / card.
 */
import { getPath } from '../../utils/categoryTree';

export const DEFAULT_ITEM_PROFILE = 'basic';

/** Extra fields controlled by profile (not core langs / ids). */
export const ITEM_PROFILE_FIELD_META = {
  phonetic: {
    label: { fr: 'Phonétique', en: 'Phonetic', mg: 'Fonetika' },
    input: 'string',
    placeholder: '/ˈhæpi/',
  },
  synonyms: {
    label: { fr: 'Synonymes', en: 'Synonyms', mg: 'Mitovy hevitra' },
    input: 'tags',
    placeholder: 'joyful; cheerful',
  },
  antonyms: {
    label: { fr: 'Antonymes', en: 'Antonyms', mg: 'Mifanohitra' },
    input: 'tags',
    placeholder: 'sad; miserable',
  },
  context: {
    label: { fr: 'Contexte', en: 'Context', mg: 'Toe-javatra' },
    input: 'i18n',
    placeholder: { en: 'She felt happy after the news.', fr: 'Elle était heureuse…', mg: '' },
  },
  particle: {
    label: { fr: 'Particule', en: 'Particle', mg: 'Partikula' },
    input: 'string',
    placeholder: 'up / out / off',
  },
  pattern: {
    label: { fr: 'Schéma', en: 'Pattern', mg: 'Lamina' },
    input: 'string',
    placeholder: 'make a decision',
  },
  register: {
    label: { fr: 'Registre', en: 'Register', mg: 'Haavo fiteny' },
    input: 'string',
    placeholder: 'formal / informal',
  },
  notes: {
    label: { fr: 'Notes', en: 'Notes', mg: 'Fanamarihana' },
    input: 'i18n',
    placeholder: { en: 'Usage tip…', fr: 'Astuce…', mg: '' },
  },
};

export const ITEM_PROFILES = {
  basic: {
    id: 'basic',
    label: { fr: 'Basique', en: 'Basic', mg: 'Fototra' },
    description: { fr: 'Mot + traductions optionnelles', en: 'Word + optional translations', mg: '' },
    fields: ['phonetic'],
  },
  adjective: {
    id: 'adjective',
    label: { fr: 'Adjectif', en: 'Adjective', mg: 'Mpamaritra' },
    description: { fr: 'Synonymes, antonymes, contexte', en: 'Synonyms, antonyms, context', mg: '' },
    fields: ['phonetic', 'synonyms', 'antonyms', 'context'],
  },
  phrasalVerb: {
    id: 'phrasalVerb',
    label: { fr: 'Phrasal verb', en: 'Phrasal verb', mg: 'Phrasal verb' },
    description: { fr: 'Particule + exemple', en: 'Particle + example', mg: '' },
    fields: ['phonetic', 'particle', 'context'],
  },
  collocation: {
    id: 'collocation',
    label: { fr: 'Collocation', en: 'Collocation', mg: 'Collocation' },
    description: { fr: 'Schéma, registre, contexte', en: 'Pattern, register, context', mg: '' },
    fields: ['pattern', 'register', 'context', 'notes'],
  },
};

export const ITEM_PROFILE_OPTIONS = Object.values(ITEM_PROFILES);

export function isValidItemProfile(id) {
  return Boolean(id && ITEM_PROFILES[id]);
}

export function getItemProfile(id) {
  return ITEM_PROFILES[id] || ITEM_PROFILES[DEFAULT_ITEM_PROFILE];
}

/** Extra field keys for a profile id. */
export function getProfileExtraFields(profileId) {
  return getItemProfile(profileId).fields.slice();
}

/**
 * Resolve profile for a category: nearest ancestor with itemProfile, else basic.
 */
export function resolveItemProfile(categories, categoryId) {
  if (!categoryId) return DEFAULT_ITEM_PROFILE;
  const path = getPath(categories, categoryId);
  for (let i = path.length - 1; i >= 0; i -= 1) {
    const id = path[i]?.itemProfile;
    if (isValidItemProfile(id)) return id;
  }
  return DEFAULT_ITEM_PROFILE;
}

export function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** At least one of en / fr / mg. */
export function hasAnyLanguage(item) {
  if (!item) return false;
  return hasText(item.en) || hasText(item.fr) || hasText(item.mg);
}

/**
 * Head word for display: prefer app lang, else first filled.
 */
export function getItemDisplayWord(item, preferredLang = 'en') {
  if (!item) return '';
  const order = [preferredLang, 'en', 'fr', 'mg'].filter(
    (v, i, a) => a.indexOf(v) === i
  );
  for (const code of order) {
    if (hasText(item[code])) return item[code].trim();
  }
  return item.id || '';
}

/** Lang rows that have content (for conditional labels). */
export function getFilledLangRows(item, preferredLang = 'en') {
  const rows = [
    { code: 'FR', key: 'fr', field: 'fr' },
    { code: 'EN', key: 'en', field: 'en' },
    { code: 'MG', key: 'mg', field: 'mg' },
  ];
  const filled = rows.filter((r) => hasText(item?.[r.field]));
  // Prefer putting preferred lang first among filled
  filled.sort((a, b) => {
    if (a.key === preferredLang) return -1;
    if (b.key === preferredLang) return 1;
    return 0;
  });
  return filled;
}

export function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function stringListToFormValue(list) {
  return (list || []).join('; ');
}

export function normalizeOptionalI18n(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const t = value.trim();
    if (!t) return null;
    return { fr: t, en: t, mg: t };
  }
  if (typeof value !== 'object') return null;
  const out = {
    fr: value.fr != null ? String(value.fr) : '',
    en: value.en != null ? String(value.en) : '',
    mg: value.mg != null ? String(value.mg) : '',
  };
  if (!out.fr.trim() && !out.en.trim() && !out.mg.trim()) return null;
  return out;
}

/** Prefer preferred lang, else first filled i18n string. */
export function pickI18nText(value, preferredLang = 'en') {
  const n = normalizeOptionalI18n(value);
  if (!n) return '';
  if (hasText(n[preferredLang])) return n[preferredLang].trim();
  for (const code of ['en', 'fr', 'mg']) {
    if (hasText(n[code])) return n[code].trim();
  }
  return '';
}

export function hasI18nContent(value) {
  return Boolean(pickI18nText(value));
}

export function profileFieldHasContent(item, fieldKey) {
  if (!item) return false;
  const meta = ITEM_PROFILE_FIELD_META[fieldKey];
  if (!meta) return hasText(item[fieldKey]);
  if (meta.input === 'tags') return normalizeStringList(item[fieldKey]).length > 0;
  if (meta.input === 'i18n') return hasI18nContent(item[fieldKey]);
  return hasText(item[fieldKey]);
}
