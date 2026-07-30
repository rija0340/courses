import { getDescendantIds, findNodeById } from '../../utils/categoryTree';

/**
 * Collect vocabulary lines for a topic (category + descendants).
 * Used to ground LLM simulations in domain words (e.g. eyes).
 */
export function collectTopicVocabulary(items, categories, categoryId, { limit = 80 } = {}) {
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

  const words = [];
  const seen = new Set();

  for (const item of items) {
    const inTree = item.categoryId && ids.has(item.categoryId);
    const labelMatch =
      !item.categoryId &&
      String(item.category || '').toLowerCase() === String(topicLabel).toLowerCase();
    if (!inTree && !labelMatch) continue;

    const en = String(item.en || '').trim();
    if (!en) continue;
    const key = en.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    words.push({
      en,
      fr: String(item.fr || '').trim() || null,
      mg: String(item.mg || '').trim() || null,
      phonetic: item.phonetic || null
    });
    if (words.length >= limit) break;
  }

  return { topicLabel, words };
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
