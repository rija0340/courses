import { getDescendantIds, findNodeById } from '../../utils/categoryTree';

/** Tabs offered in topic practice pickers (scenarios excluded). */
export const PRACTICE_TOPIC_TABS = ['vocab', 'symptoms', 'conditions'];

/** Legacy domain may still use `maladies` / `expressions`. */
const TAB_ALIASES = {
  symptoms: ['symptoms'],
  conditions: ['conditions', 'maladies'],
  vocab: ['vocab'],
};

export const MAX_PRACTICE_VOCAB = 20;

function tabMatches(itemTab, selectedTabs) {
  if (!selectedTabs?.length) return true;
  const t = String(itemTab || '').trim();
  return selectedTabs.some((sel) => {
    const aliases = TAB_ALIASES[sel] || [sel];
    return aliases.includes(t);
  });
}

/**
 * Collect vocabulary for a topic (category + descendants).
 *
 * @param {object[]} items
 * @param {object[]} categories
 * @param {string} categoryId
 * @param {{ limit?: number, tabs?: string[]|null, wordIds?: string[]|null }} [options]
 *   - tabs: filter by item.tab (e.g. ['vocab','symptoms'])
 *   - wordIds: if set, only keep these item ids (after tab/category filter)
 */
export function collectTopicVocabulary(
  items,
  categories,
  categoryId,
  { limit = 80, tabs = null, wordIds = null } = {}
) {
  if (!categoryId || !Array.isArray(items)) {
    return { topicLabel: null, words: [] };
  }

  const node = findNodeById(categories || [], categoryId);
  const ids = new Set(getDescendantIds(categories || [], categoryId));
  const topicLabel =
    (typeof node?.label === 'string' ? node.label : null) ||
    node?.label?.en ||
    node?.label?.fr ||
    categoryId;

  const idFilter = Array.isArray(wordIds) && wordIds.length > 0
    ? new Set(wordIds)
    : null;

  const words = [];
  const seen = new Set();

  for (const item of items) {
    const inTree = item.categoryId && ids.has(item.categoryId);
    const labelMatch =
      !item.categoryId &&
      String(item.category || '').toLowerCase() === String(topicLabel).toLowerCase();
    if (!inTree && !labelMatch) continue;
    if (!tabMatches(item.tab, tabs)) continue;
    if (idFilter && !idFilter.has(item.id)) continue;

    const en = String(item.en || '').trim();
    if (!en) continue;
    const key = en.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    words.push({
      id: item.id || key,
      en,
      fr: String(item.fr || '').trim() || null,
      mg: String(item.mg || '').trim() || null,
      phonetic: item.phonetic || null,
      tab: item.tab || '',
    });
    if (words.length >= limit) break;
  }

  return { topicLabel, words };
}

/** Cap vocabulary for natural dialogue generation. */
export function capVocabularyForGeneration(words, max = MAX_PRACTICE_VOCAB) {
  const list = Array.isArray(words) ? words : [];
  return {
    words: list.slice(0, max),
    truncated: list.length > max,
    total: list.length,
  };
}

export function formatVocabularyForPrompt(words) {
  if (!words?.length) return '';
  return words
    .map((w) => {
      const bits = [w.en];
      if (w.fr) bits.push(`fr:${w.fr}`);
      if (w.phonetic) bits.push(`/${w.phonetic}/`);
      return `- ${bits.join(' | ')}`;
    })
    .join('\n');
}
