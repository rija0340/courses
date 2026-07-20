import { getPath, findNodeById } from './categoryTree';

export const VIEW_MODES = ['lecture', 'revision', 'image'];
export const REVISION_LANGS = ['fr', 'en', 'mg'];

const DEFAULT_MODE = 'lecture';
const DEFAULT_REVISION_LANG = 'en';

/** @param {string} wildcard - splat from react-router params['*'] */
export function splitCategoryPath(wildcard) {
  if (!wildcard || typeof wildcard !== 'string') return [];
  return wildcard.split('/').filter(Boolean);
}

/**
 * Validate category path segments against the tree.
 * Returns the deepest valid category id and the valid prefix segments.
 */
export function parseCategoryPath(categories, segments) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return { categoryId: null, validSegments: [] };
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    return { categoryId: null, validSegments: [] };
  }

  let currentLevel = categories;
  const validSegments = [];

  for (const seg of segments) {
    const node = currentLevel.find(n => n.id === seg);
    if (!node) break;
    validSegments.push(seg);
    currentLevel = node.children || [];
  }

  const categoryId = validSegments.length ? validSegments[validSegments.length - 1] : null;
  return { categoryId, validSegments };
}

export function categoryToPathSegments(categories, categoryId) {
  if (!categoryId || !Array.isArray(categories)) return [];
  return getPath(categories, categoryId).map(n => n.id);
}

export function parseVocabSearchParams(searchParams, { defaultTab = 'vocab' } = {}) {
  const rawMode = searchParams.get('mode') || DEFAULT_MODE;
  const mode = VIEW_MODES.includes(rawMode) ? rawMode : DEFAULT_MODE;

  const rawLang = searchParams.get('lang') || DEFAULT_REVISION_LANG;
  const lang = REVISION_LANGS.includes(rawLang) ? rawLang : DEFAULT_REVISION_LANG;

  const tab = searchParams.get('tab') || defaultTab;
  const q = searchParams.get('q') || '';

  return { tab, mode, lang, q };
}

export function serializeVocabSearchParams(
  { tab, mode, lang, q },
  { defaultTab = 'vocab' } = {}
) {
  const params = new URLSearchParams();
  if (tab && tab !== defaultTab) params.set('tab', tab);
  if (mode && mode !== DEFAULT_MODE) params.set('mode', mode);
  if (mode === 'revision' && lang && lang !== DEFAULT_REVISION_LANG) params.set('lang', lang);
  if (q && q.trim()) params.set('q', q.trim());
  return params.toString();
}

export function buildVocabViewUrl(
  domainId,
  { categoryId, categoryPath, tab, mode, lang, q } = {},
  categories,
  { defaultTab = 'vocab' } = {}
) {
  let segments = categoryPath;
  if (!segments?.length && categoryId && categories) {
    segments = categoryToPathSegments(categories, categoryId);
  }

  let path = `/vocabs/${domainId}`;
  if (segments?.length) {
    path += `/${segments.join('/')}`;
  }

  const query = serializeVocabSearchParams(
    { tab, mode, lang, q },
    { defaultTab }
  );
  return query ? `${path}?${query}` : path;
}

export function parseAdminSearchParams(searchParams) {
  const tab = searchParams.get('tab') || 'categories';
  const cat = searchParams.get('cat') || null;
  const orgTab = searchParams.get('orgTab') || '';
  const q = searchParams.get('q') || '';
  return { tab, cat, orgTab, q };
}

export function buildAdminUrl(domainId, { tab, cat, orgTab, q } = {}) {
  const params = new URLSearchParams();
  if (tab && tab !== 'categories') params.set('tab', tab);
  if (cat) params.set('cat', cat);
  if (orgTab) params.set('orgTab', orgTab);
  if (q?.trim()) params.set('q', q.trim());
  const query = params.toString();
  const base = `/vocabs/${domainId}/admin`;
  return query ? `${base}?${query}` : base;
}

/** Expand tree nodes along a category path for sidebar open state */
export function pathSegmentsToExpandedIds(segments) {
  if (!segments?.length) return [];
  return segments.slice(0, -1);
}

export function validateCategoryId(categories, categoryId) {
  if (!categoryId) return null;
  return findNodeById(categories, categoryId) ? categoryId : null;
}
