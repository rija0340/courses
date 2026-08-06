/**
 * Single source of truth for vocab domain JSON (import / export / template).
 * Change fields here → template, validation, and export pickers update automatically.
 */

export const VOCAB_DOMAIN_VERSION = 3;

export const I18N_LANGS = ['fr', 'en', 'mg'];

/** @typedef {'string'|'number'|'boolean'|'object'|'array'|'i18n'|'any'} FieldType */

/**
 * @typedef {Object} FieldDef
 * @property {FieldType} type
 * @property {boolean} [required]
 * @property {boolean} [exportable] - included in export / template (default true)
 * @property {boolean} [importable] - accepted on import (default true)
 * @property {*} [example]
 * @property {*} [default]
 * @property {string} [description]
 */

/** Localized string { fr, en, mg } */
export const I18N_FIELD = /** @type {FieldDef} */ ({
  type: 'i18n',
  required: true,
  example: { fr: '', en: '', mg: '' },
  default: { fr: '', en: '', mg: '' },
  description: 'Texte localisé FR / EN / MG',
});

/** Item (vocabulary word) fields */
export const ITEM_FIELDS = /** @type {Record<string, FieldDef>} */ ({
  id: {
    type: 'string',
    required: true,
    example: 'eye',
    description: 'Identifiant unique du mot',
  },
  en: {
    type: 'string',
    required: true,
    example: 'Eye',
    description: 'Mot en anglais',
  },
  fr: {
    type: 'string',
    required: true,
    example: 'Œil',
    description: 'Mot en français',
  },
  mg: {
    type: 'string',
    required: true,
    example: 'Maso',
    description: 'Mot en malgache',
  },
  category: {
    type: 'string',
    required: false,
    example: 'Organe',
    default: '',
    description: 'Type libre (Organe, Maladie, Symptôme…)',
  },
  tab: {
    type: 'string',
    required: false,
    example: 'vocab',
    default: '',
    description: 'Id d’onglet (doit exister dans organization.tabs)',
  },
  categoryId: {
    type: 'string',
    required: false,
    example: 'yeux',
    default: null,
    description: 'Id d’un nœud dans organization.categories',
  },
  phonetic: {
    type: 'string',
    required: false,
    example: '/aɪ/',
    default: null,
    description: 'Prononciation (optionnel)',
  },
  // Mini-dialogue (symptoms / conditions) — patient + doctor, 2 tours
  example: {
    type: 'object',
    required: false,
    default: null,
    example: {
      patient: { en: 'I have blurry vision.', fr: "J'ai une vision floue.", mg: '' },
      doctor: { en: 'How long have you had it?', fr: 'Depuis combien de temps ?', mg: '' },
    },
    description: 'Mini-exemple patient/docteur (onglets symptoms & conditions). mg optionnel.',
  },
  // Conversation longue (onglet scenarios)
  dialogue: {
    type: 'array',
    required: false,
    default: null,
    example: [
      { role: 'patient', en: 'My vision has been blurry for two weeks.', fr: 'Ma vision est floue depuis deux semaines.', mg: '' },
      { role: 'doctor', en: 'Does it affect one eye or both?', fr: 'Un œil ou les deux ?', mg: '' },
    ],
    description: 'Tours de dialogue patient/docteur (onglet scenarios). mg optionnel par tour.',
  },
  // Images are managed via Storage upload — not part of bulk JSON import by default
  image: {
    type: 'string',
    required: false,
    exportable: false,
    importable: false,
    example: null,
    description: 'Legacy base64 (non utilisé dans le modèle JSON)',
  },
  image_url: {
    type: 'string',
    required: false,
    exportable: false,
    importable: false,
    example: null,
    description: 'URL Storage (gérée via upload, pas via JSON)',
  },
});

/** Tab definition fields */
export const TAB_FIELDS = /** @type {Record<string, FieldDef>} */ ({
  id: {
    type: 'string',
    required: true,
    example: 'vocab',
    description: 'Identifiant de l’onglet',
  },
  label: {
    ...I18N_FIELD,
    example: { fr: 'Vocabulaire', en: 'Vocabulary', mg: 'Voaboly' },
    description: 'Libellé localisé de l’onglet',
  },
});

/** Category tree node fields (recursive via children) */
export const CATEGORY_FIELDS = /** @type {Record<string, FieldDef>} */ ({
  id: {
    type: 'string',
    required: true,
    example: 'yeux',
    description: 'Identifiant du nœud',
  },
  label: {
    ...I18N_FIELD,
    example: { fr: 'Yeux', en: 'Eyes', mg: 'Maso' },
    description: 'Libellé localisé',
  },
  image: {
    type: 'any',
    required: false,
    exportable: true,
    importable: true,
    example: null,
    default: null,
    description: 'Réservé (null recommandé ; images via upload)',
  },
  visuals: {
    type: 'array',
    required: false,
    example: [],
    default: [],
    description: 'Visuels additionnels (tableau)',
  },
  children: {
    type: 'array',
    required: false,
    example: [],
    default: [],
    description: 'Sous-catégories (même structure récursive)',
  },
});

/** Top-level domain document */
export const DOMAIN_ROOT_FIELDS = /** @type {Record<string, FieldDef>} */ ({
  version: {
    type: 'number',
    required: true,
    example: VOCAB_DOMAIN_VERSION,
    description: 'Version du format JSON',
  },
  meta: {
    type: 'object',
    required: true,
    description: 'Titre et description du domaine',
  },
  organization: {
    type: 'object',
    required: true,
    description: 'Onglets + arbre de catégories',
  },
  items: {
    type: 'array',
    required: true,
    description: 'Liste des mots',
  },
});

export const META_FIELDS = /** @type {Record<string, FieldDef>} */ ({
  title: { ...I18N_FIELD, example: { fr: 'Mon domaine', en: 'My domain', mg: 'Ny domainiko' } },
  description: {
    ...I18N_FIELD,
    required: false,
    example: { fr: 'Description…', en: 'Description…', mg: 'Description…' },
    default: { fr: '', en: '', mg: '' },
  },
});

function emptyI18n() {
  return Object.fromEntries(I18N_LANGS.map(l => [l, '']));
}

function exampleFromFields(fields) {
  const out = {};
  for (const [key, def] of Object.entries(fields)) {
    if (def.exportable === false) continue;
    if (def.example !== undefined) out[key] = structuredClone(def.example);
    else if (def.default !== undefined) out[key] = structuredClone(def.default);
    else if (def.type === 'i18n') out[key] = emptyI18n();
    else if (def.type === 'array') out[key] = [];
    else if (def.type === 'object') out[key] = {};
    else out[key] = null;
  }
  return out;
}

/** Exportable / importable item keys derived from ITEM_FIELDS */
export function getItemExportKeys() {
  return Object.entries(ITEM_FIELDS)
    .filter(([, def]) => def.exportable !== false)
    .map(([k]) => k);
}

export function getItemImportKeys() {
  return Object.entries(ITEM_FIELDS)
    .filter(([, def]) => def.importable !== false)
    .map(([k]) => k);
}

export function pickItemFields(item) {
  const keys = getItemExportKeys();
  const out = {};
  for (const key of keys) {
    if (item[key] !== undefined) out[key] = item[key];
  }
  return out;
}

/**
 * Build a ready-to-copy JSON template.
 * Optionally seed tabs/categories/items from the current domain so the model stays contextual.
 */
export function buildImportTemplate(domain = null) {
  const template = {
    version: VOCAB_DOMAIN_VERSION,
    meta: domain?.meta
      ? {
          title: { ...emptyI18n(), ...(domain.meta.title || {}) },
          description: { ...emptyI18n(), ...(domain.meta.description || {}) },
        }
      : exampleFromFields(META_FIELDS),
    organization: {
      tabs: domain?.organization?.tabs?.length
        ? domain.organization.tabs.map(t => ({
            id: t.id,
            label: { ...emptyI18n(), ...(t.label || {}) },
          }))
        : [exampleFromFields(TAB_FIELDS)],
      categories: domain?.organization?.categories?.length
        ? sanitizeCategoriesForTemplate(domain.organization.categories)
        : [
            {
              ...exampleFromFields(CATEGORY_FIELDS),
              children: [
                {
                  ...exampleFromFields(CATEGORY_FIELDS),
                  id: 'sub-example',
                  label: { fr: 'Sous-catégorie', en: 'Subcategory', mg: 'Zana-sokajy' },
                  children: [],
                },
              ],
            },
          ],
    },
    items: (() => {
      const tabs = domain?.organization?.tabs?.length
        ? domain.organization.tabs
        : [{ id: 'vocab' }, { id: 'symptoms' }, { id: 'conditions' }, { id: 'scenarios' }];
      const firstCat = domain?.organization?.categories?.[0]?.id || 'sub-example';
      return tabs.map((tab, index) => ({
        ...exampleFromFields(ITEM_FIELDS),
        id: `example-${tab.id}`,
        en: index === 0 ? 'Example word' : `Example (${tab.id})`,
        fr: index === 0 ? 'Mot exemple' : `Exemple (${tab.id})`,
        mg: index === 0 ? 'Ohatra' : `Ohatra (${tab.id})`,
        category: index % 2 === 0 ? 'Organe' : 'Maladie',
        tab: tab.id,
        categoryId: firstCat,
        phonetic: index === 0 ? '/ɪɡˈzæmpəl/' : null,
      }));
    })(),
    _comment: {
      about: 'Supprimez cette clé _comment avant import. Ce modèle suit vocabDomainSchema.js',
      version: VOCAB_DOMAIN_VERSION,
      itemFields: getItemImportKeys(),
      notes: [
        'Les images (image / image_url) se gèrent via upload, pas via ce JSON.',
        'categoryId doit référencer un id existant dans organization.categories (récursif).',
        'tab doit référencer un id dans organization.tabs.',
      ],
    },
  };

  return template;
}

function sanitizeCategoriesForTemplate(nodes) {
  return (nodes || []).map(n => ({
    id: n.id,
    label: { ...emptyI18n(), ...(n.label || {}) },
    image: null,
    visuals: Array.isArray(n.visuals) ? [] : [],
    children: sanitizeCategoriesForTemplate(n.children || []),
  }));
}

/**
 * Human-readable field list for the admin UI (auto-updates with schema).
 */
export function getSchemaFieldDocs() {
  return {
    version: VOCAB_DOMAIN_VERSION,
    root: Object.entries(DOMAIN_ROOT_FIELDS).map(([key, def]) => ({
      key,
      required: !!def.required,
      description: def.description || '',
    })),
    meta: Object.entries(META_FIELDS).map(([key, def]) => ({
      key,
      required: !!def.required,
      description: def.description || '',
    })),
    tabs: Object.entries(TAB_FIELDS).map(([key, def]) => ({
      key,
      required: !!def.required,
      description: def.description || '',
    })),
    categories: Object.entries(CATEGORY_FIELDS).map(([key, def]) => ({
      key,
      required: !!def.required,
      description: def.description || '',
    })),
    items: Object.entries(ITEM_FIELDS)
      .filter(([, def]) => def.importable !== false)
      .map(([key, def]) => ({
        key,
        required: !!def.required,
        description: def.description || '',
        example: def.example,
      })),
  };
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function normalizeI18n(value, fallback = '') {
  const base = emptyI18n();
  if (typeof value === 'string') {
    I18N_LANGS.forEach(l => { base[l] = value; });
    return base;
  }
  if (!isPlainObject(value)) {
    I18N_LANGS.forEach(l => { base[l] = fallback; });
    return base;
  }
  I18N_LANGS.forEach(l => {
    base[l] = value[l] != null ? String(value[l]) : (value.fr || fallback || '');
  });
  return base;
}

function normalizeCategoryNode(node, path, errors) {
  if (!isPlainObject(node)) {
    errors.push(`${path}: nœud de catégorie invalide`);
    return null;
  }
  if (!node.id || typeof node.id !== 'string') {
    errors.push(`${path}: id manquant`);
  }
  return {
    id: String(node.id || `cat_${Math.random().toString(36).slice(2, 8)}`),
    label: normalizeI18n(node.label, String(node.id || '')),
    image: node.image ?? null,
    visuals: Array.isArray(node.visuals) ? node.visuals : [],
    children: (Array.isArray(node.children) ? node.children : [])
      .map((ch, i) => normalizeCategoryNode(ch, `${path}.children[${i}]`, errors))
      .filter(Boolean),
  };
}

function normalizeItem(raw, index, errors, warnings) {
  if (!isPlainObject(raw)) {
    errors.push(`items[${index}]: objet attendu`);
    return null;
  }

  const item = {};
  const importKeys = getItemImportKeys();

  for (const key of importKeys) {
    const def = ITEM_FIELDS[key];
    if (raw[key] === undefined || raw[key] === null || raw[key] === '') {
      if (def.required) {
        errors.push(`items[${index}].${key}: requis`);
      } else if (def.default !== undefined) {
        item[key] = structuredClone(def.default);
      }
      continue;
    }
    if (def.type === 'string') item[key] = String(raw[key]);
    else item[key] = raw[key];
  }

  // Keep unknown keys as warnings only (forward-compat)
  Object.keys(raw).forEach(k => {
    if (!ITEM_FIELDS[k]) warnings.push(`items[${index}].${k}: champ inconnu (ignoré)`);
    else if (ITEM_FIELDS[k].importable === false) {
      warnings.push(`items[${index}].${k}: non importable via JSON (ignoré)`);
    }
  });

  if (!item.id) {
    item.id = `vocab_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`;
    warnings.push(`items[${index}]: id généré automatiquement (${item.id})`);
  }

  return item;
}

/**
 * Detect if JSON is an items-only import (no organization structure).
 */
export function isItemsOnlyImport(raw) {
  if (!isPlainObject(raw) || !Array.isArray(raw.items)) return false;
  if (!raw.organization) return true;
  if (!isPlainObject(raw.organization)) return false;
  const hasTabs = Array.isArray(raw.organization.tabs) && raw.organization.tabs.length > 0;
  const hasCats = Array.isArray(raw.organization.categories) && raw.organization.categories.length > 0;
  return !hasTabs && !hasCats;
}

/**
 * Compute merge stats for import preview.
 */
export function computeImportMergeStats(currentItems, importedItems) {
  const currentIds = new Set((currentItems || []).map(i => i.id));
  let added = 0;
  let updated = 0;
  (importedItems || []).forEach(item => {
    if (currentIds.has(item.id)) updated += 1;
    else added += 1;
  });
  return { added, updated, total: (importedItems || []).length };
}

/**
 * Build a minimal template with only items[] for adding new words.
 */
export function buildItemsOnlyImportTemplate(domain = null) {
  const tabs = domain?.organization?.tabs?.length
    ? domain.organization.tabs
    : [{ id: 'vocab' }];
  const firstCat = domain?.organization?.categories?.[0]?.id || '';
  const tabIds = tabs.map((t) => t.id);

  const sampleItems = tabs.map((tab, index) => {
    const existing = domain?.items?.find((item) => item.tab === tab.id);
    if (existing) {
      return pickItemFields(existing);
    }
    return {
      ...exampleFromFields(ITEM_FIELDS),
      id: `nouveau-mot-${tab.id}`,
      en: `Example word (${tab.id})`,
      fr: `Mot exemple (${tab.id})`,
      mg: `Ohatra (${tab.id})`,
      category: index % 2 === 0 ? 'Organe' : 'Maladie',
      tab: tab.id,
      categoryId: firstCat || undefined,
    };
  });

  return {
    items: sampleItems,
    _comment: {
      about: 'Import mots seulement — supprimez _comment avant import',
      notes: [
        'Seul le tableau items est requis. Les mots existants sont conservés.',
        'Même id = mise à jour ; nouvel id = ajout.',
        `Onglets disponibles dans ce domaine : ${tabIds.join(', ')}.`,
        'Chaque item doit avoir un champ tab correspondant à un onglet existant.',
        'tab et categoryId doivent exister dans le domaine.',
        'Les images se gèrent via upload admin, pas via JSON.',
      ],
    },
  };
}

/**
 * Build an items-only template for category / tab / domain import scopes.
 * @param {object|null} domain
 * @param {{ categoryId?: string, tab?: string, mode?: 'single-tab'|'all-tabs'|'domain' }} scope
 */
export function buildCategoryItemsImportTemplate(domain = null, scope = {}) {
  const mode = scope.mode || 'single-tab';
  const categoryId = scope.categoryId || domain?.organization?.categories?.[0]?.id || '';
  const tab = scope.tab || domain?.organization?.tabs?.[0]?.id || 'vocab';
  const tabs = domain?.organization?.tabs?.length
    ? domain.organization.tabs
    : [{ id: tab }];
  const tabIds = tabs.map((t) => t.id);

  const makeSample = (catId, tabId, index = 0) => ({
    ...exampleFromFields(ITEM_FIELDS),
    id: `nouveau-mot-${tabId}${catId ? `-${catId}` : ''}${index > 0 ? `-${index}` : ''}`,
    en: `Example word (${tabId})`,
    fr: `Mot exemple (${tabId})`,
    mg: `Ohatra (${tabId})`,
    category: index % 2 === 0 ? 'Organe' : 'Maladie',
    tab: tabId,
    categoryId: catId || undefined,
    phonetic: '',
  });

  let sampleItems;
  let about;
  let notes;

  if (mode === 'domain') {
    sampleItems = tabs.map((t, i) => makeSample(categoryId, t.id, i));
    about = 'Import mots — tout le domaine';
    notes = [
      'Seul le tableau items est requis.',
      `Onglets disponibles : ${tabIds.join(', ') || '(aucun)'}.`,
      'Chaque item doit avoir un tab et un categoryId valides.',
      'Même id = mise à jour ; nouvel id = ajout.',
      'Les images se gèrent via upload admin, pas via JSON.',
    ];
  } else if (mode === 'all-tabs') {
    sampleItems = tabs.map((t, i) => makeSample(categoryId, t.id, i));
    about = 'Import mots — tous les onglets de la catégorie';
    notes = [
      'Seul le tableau items est requis.',
      `categoryId est fixé sur « ${categoryId || '(vide)'} » à l’import.`,
      `Onglets disponibles : ${tabIds.join(', ') || '(aucun)'} — conservez le champ tab.`,
      'Même id = mise à jour ; nouvel id = ajout.',
      'Les images se gèrent via upload admin, pas via JSON.',
    ];
  } else {
    sampleItems = [makeSample(categoryId, tab, 0)];
    about = 'Import mots — un onglet de la catégorie';
    notes = [
      'Seul le tableau items est requis.',
      `categoryId est fixé sur « ${categoryId || '(vide)'} » à l’import.`,
      `tab est fixé sur « ${tab} » à l’import.`,
      'Même id = mise à jour ; nouvel id = ajout.',
      'Les images se gèrent via upload admin, pas via JSON.',
    ];
  }

  return {
    items: sampleItems,
    _comment: { about, notes },
  };
}

export function categoryItemsTemplateToPrettyJson(domain = null, scope = {}) {
  return JSON.stringify(buildCategoryItemsImportTemplate(domain, scope), null, 2);
}

/** CSV columns for vocab item export (Excel-friendly). */
export const VOCAB_CSV_COLUMNS = ['id', 'fr', 'en', 'mg', 'category', 'tab', 'categoryId', 'phonetic'];

/**
 * Filter items by export/import UI scope.
 * @param {object[]} items
 * @param {{ scope: 'tab'|'category'|'domain', categoryId?: string, tab?: string }} opts
 */
export function filterItemsForDataScope(items, { scope, categoryId, tab } = {}) {
  const list = items || [];
  if (scope === 'domain') return list;
  if (scope === 'category') {
    return list.filter((i) => i.categoryId === categoryId);
  }
  // tab
  return list.filter((i) => i.categoryId === categoryId && i.tab === tab);
}

function escapeCsvCell(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * Build CSV string (UTF-8 BOM for Excel) from vocab items.
 */
export function itemsToCsv(items, columns = VOCAB_CSV_COLUMNS) {
  const lines = [columns.join(',')];
  (items || []).forEach((item) => {
    lines.push(columns.map((key) => escapeCsvCell(item[key] ?? '')).join(','));
  });
  return `\uFEFF${lines.join('\n')}`;
}

/**
 * Trigger a browser download for text content.
 */
export function downloadTextFile(content, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(payload, filename) {
  downloadTextFile(
    `${JSON.stringify(payload, null, 2)}\n`,
    filename,
    'application/json;charset=utf-8'
  );
}

/**
 * Count imported items per tab (for preview).
 */
export function computeItemsByTab(items) {
  const byTab = {};
  (items || []).forEach((it) => {
    const key = it.tab || '(sans tab)';
    byTab[key] = (byTab[key] || 0) + 1;
  });
  return byTab;
}

/**
 * Merge imported items into current list (same id → update, else add).
 */
export function mergeVocabItems(currentItems, importedItems) {
  const mergedItems = [...(currentItems || [])];
  (importedItems || []).forEach((item) => {
    const idx = mergedItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) mergedItems[idx] = { ...mergedItems[idx], ...item };
    else mergedItems.push(item);
  });
  return mergedItems;
}

/**
 * Validate items-only import against current domain.
 * @param {object} raw
 * @param {object|null} currentDomain
 * @param {{ forceCategoryId?: string, forceTab?: string, strictTabs?: boolean, strictCategoryIds?: boolean }} [options]
 */
export function validateItemsOnlyImport(raw, currentDomain = null, options = {}) {
  const errors = [];
  const warnings = [];
  const {
    forceCategoryId,
    forceTab,
    strictTabs = false,
    strictCategoryIds = false,
  } = options;

  if (!isPlainObject(raw)) {
    return { ok: false, errors: ['Le JSON doit être un objet'], warnings, data: null, importType: 'items_only' };
  }
  if (!Array.isArray(raw.items)) {
    return { ok: false, errors: ['items: tableau requis'], warnings, data: null, importType: 'items_only' };
  }

  let items = raw.items
    .map((it, i) => normalizeItem(it, i, errors, warnings))
    .filter(Boolean);

  const tabIds = new Set((currentDomain?.organization?.tabs || []).map(t => t.id));
  const catIds = new Set();
  const walk = (nodes) => {
    (nodes || []).forEach(n => {
      catIds.add(n.id);
      walk(n.children);
    });
  };
  walk(currentDomain?.organization?.categories || []);

  if (forceCategoryId) {
    if (catIds.size > 0 && !catIds.has(forceCategoryId)) {
      errors.push(`categoryId forcé « ${forceCategoryId} » absent de l'arbre`);
    }
    items = items.map((it, i) => {
      if (it.categoryId && it.categoryId !== forceCategoryId) {
        warnings.push(
          `items[${i}] (${it.id}): categoryId « ${it.categoryId} » remplacé par « ${forceCategoryId} »`
        );
      }
      return { ...it, categoryId: forceCategoryId };
    });
  }

  if (forceTab) {
    if (tabIds.size > 0 && !tabIds.has(forceTab)) {
      errors.push(`tab forcé « ${forceTab} » absent du domaine`);
    }
    items = items.map((it, i) => {
      if (it.tab && it.tab !== forceTab) {
        warnings.push(`items[${i}] (${it.id}): tab « ${it.tab} » remplacé par « ${forceTab} »`);
      }
      return { ...it, tab: forceTab };
    });
  }

  items.forEach((it, i) => {
    if (!forceTab) {
      if (!it.tab) {
        const msg = `items[${i}] (${it.id}): tab requis`;
        if (strictTabs) errors.push(msg);
        else warnings.push(msg);
      } else if (tabIds.size > 0 && !tabIds.has(it.tab)) {
        const msg = `items[${i}] (${it.id}): tab "${it.tab}" absent du domaine`;
        if (strictTabs) errors.push(msg);
        else warnings.push(msg);
      }
    }
    if (!forceCategoryId) {
      if (!it.categoryId) {
        const msg = `items[${i}] (${it.id}): categoryId requis`;
        if (strictCategoryIds) errors.push(msg);
        else warnings.push(msg);
      } else if (catIds.size > 0 && !catIds.has(it.categoryId)) {
        const msg = `items[${i}] (${it.id}): categoryId "${it.categoryId}" absent de l'arbre`;
        if (strictCategoryIds) errors.push(msg);
        else warnings.push(msg);
      }
    }
  });

  if (raw._comment) {
    warnings.push('_comment: retiré automatiquement');
  }

  const stats = {
    ...computeImportMergeStats(currentDomain?.items || [], items),
    byTab: computeItemsByTab(items),
  };

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    importType: 'items_only',
    stats,
    data: { items },
  };
}

/**
 * Route import validation to full or items-only parser.
 * @param {object} raw
 * @param {object|null} currentDomain
 * @param {{ forceCategoryId?: string, forceTab?: string }} [options]
 */
export function validateImportPayload(raw, currentDomain = null, options = {}) {
  if (isItemsOnlyImport(raw)) {
    return validateItemsOnlyImport(raw, currentDomain, options);
  }
  const result = validateAndNormalizeImport(raw);
  if (result.ok && result.data) {
    result.importType = 'full';
    result.stats = computeImportMergeStats(currentDomain?.items || [], result.data.items);
  }
  return result;
}

/**
 * Validate + normalize an imported domain JSON against the current schema.
 * @returns {{ ok: boolean, errors: string[], warnings: string[], data: object|null }}
 */
export function validateAndNormalizeImport(raw) {
  const errors = [];
  const warnings = [];

  if (!isPlainObject(raw)) {
    return { ok: false, errors: ['Le JSON doit être un objet'], warnings, data: null };
  }

  if (raw.version != null && Number(raw.version) !== VOCAB_DOMAIN_VERSION) {
    warnings.push(
      `version ${raw.version} ≠ schéma actuel ${VOCAB_DOMAIN_VERSION} — normalisation appliquée`
    );
  }

  if (!isPlainObject(raw.meta)) errors.push('meta: objet requis');
  if (!isPlainObject(raw.organization)) errors.push('organization: objet requis');
  if (!Array.isArray(raw.items)) errors.push('items: tableau requis');

  if (errors.length) return { ok: false, errors, warnings, data: null };

  const tabs = Array.isArray(raw.organization.tabs)
    ? raw.organization.tabs.map((t, i) => {
        if (!isPlainObject(t)) {
          errors.push(`organization.tabs[${i}]: objet invalide`);
          return null;
        }
        if (!t.id) errors.push(`organization.tabs[${i}].id: requis`);
        return {
          id: String(t.id || `tab_${i}`),
          label: normalizeI18n(t.label, String(t.id || '')),
        };
      }).filter(Boolean)
    : [];

  const categories = (Array.isArray(raw.organization.categories) ? raw.organization.categories : [])
    .map((c, i) => normalizeCategoryNode(c, `organization.categories[${i}]`, errors))
    .filter(Boolean);

  const items = raw.items
    .map((it, i) => normalizeItem(it, i, errors, warnings))
    .filter(Boolean);

  // Referential checks (soft → warnings)
  const tabIds = new Set(tabs.map(t => t.id));
  const catIds = new Set();
  const walk = (nodes) => {
    (nodes || []).forEach(n => {
      catIds.add(n.id);
      walk(n.children);
    });
  };
  walk(categories);

  items.forEach((it, i) => {
    if (it.tab && !tabIds.has(it.tab)) {
      warnings.push(`items[${i}] (${it.id}): tab "${it.tab}" absent de organization.tabs`);
    }
    if (it.categoryId && !catIds.has(it.categoryId)) {
      warnings.push(`items[${i}] (${it.id}): categoryId "${it.categoryId}" absent de l’arbre`);
    }
  });

  if (raw._comment) {
    warnings.push('_comment: retiré automatiquement (documentation du modèle)');
  }

  const data = {
    version: VOCAB_DOMAIN_VERSION,
    meta: {
      title: normalizeI18n(raw.meta?.title, 'Sans titre'),
      description: normalizeI18n(raw.meta?.description, ''),
    },
    organization: { tabs, categories },
    items,
  };

  return { ok: errors.length === 0, errors, warnings, data };
}

/**
 * Build export payload from a live domain (fields follow schema).
 */
export function buildExportPayload(domain) {
  return {
    version: domain?.version || VOCAB_DOMAIN_VERSION,
    meta: domain?.meta || exampleFromFields(META_FIELDS),
    organization: {
      tabs: domain?.organization?.tabs || [],
      categories: sanitizeCategoriesForTemplate(domain?.organization?.categories || []),
    },
    items: (domain?.items || []).map(pickItemFields),
  };
}

export function templateToPrettyJson(domain = null) {
  return JSON.stringify(buildImportTemplate(domain), null, 2);
}

/** Reserved slugs that cannot be used as domain ids */
export const RESERVED_DOMAIN_IDS = ['admin', 'guide'];

export const DEFAULT_VOCAB_TABS = [
  { id: 'vocab', label: { fr: 'Vocabulaire', en: 'Vocabulary', mg: 'Voaboly' } }
];

export const VOCAB_TAB_PRESETS = {
  vocabOnly: DEFAULT_VOCAB_TABS,
  full: [
    { id: 'vocab', label: { fr: 'Vocabulaire', en: 'Vocabulary', mg: 'Voaboly' } },
    { id: 'symptoms', label: { fr: 'Symptômes', en: 'Symptoms', mg: 'Soritr\'aretina' } },
    { id: 'conditions', label: { fr: 'Maladies', en: 'Conditions', mg: 'Arety' } },
    { id: 'scenarios', label: { fr: 'Scénarios', en: 'Scenarios', mg: 'Sehatra' } },
  ]
};

const DOMAIN_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateDomainId(id) {
  if (!id || typeof id !== 'string') return 'Identifiant requis';
  if (!DOMAIN_ID_RE.test(id)) return 'Utilisez des minuscules, chiffres et tirets (ex. juridique-vocabs)';
  if (RESERVED_DOMAIN_IDS.includes(id)) return `« ${id} » est réservé`;
  return null;
}

export function buildDefaultOrganization(tabPreset = 'vocabOnly') {
  const tabs = VOCAB_TAB_PRESETS[tabPreset] || DEFAULT_VOCAB_TABS;
  return {
    tabs: structuredClone(tabs),
    categories: []
  };
}

export function buildDefaultDomainMeta({ title, description, icon = 'BookOpen', color = '#1a73e8' } = {}) {
  const empty = emptyI18n();
  return {
    title: title || { ...empty, fr: 'Nouveau domaine' },
    description: description || empty,
    icon,
    color,
    type: 'vocabs'
  };
}
