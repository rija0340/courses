import { getDescendantIds } from './categoryTree';

/**
 * Filter vocab items by category tree, search query, and/or tab.
 * Search takes precedence over tab filtering (matches front behavior).
 */
export function filterVocabItems(items, { categories, activeCategory, activeTab, search, directCategoryOnly = false }) {
  let result = items || [];

  if (activeCategory) {
    if (directCategoryOnly) {
      result = result.filter(i => i.categoryId === activeCategory);
    } else {
      const ids = getDescendantIds(categories, activeCategory);
      result = result.filter(i => i.categoryId && ids.includes(i.categoryId));
    }
  }

  if (search?.trim()) {
    const q = search.toLowerCase();
    result = result.filter(i =>
      i.en?.toLowerCase().includes(q) ||
      i.fr?.toLowerCase().includes(q) ||
      i.mg?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q)
    );
  } else if (activeTab) {
    result = result.filter(i => i.tab === activeTab);
  }

  return result;
}

/** Find first item matching search and return navigation hints. */
export function findItemNavigation(items, search) {
  if (!search?.trim()) return null;
  const q = search.toLowerCase();
  const match = items.find(i =>
    i.en?.toLowerCase().includes(q) ||
    i.fr?.toLowerCase().includes(q) ||
    i.mg?.toLowerCase().includes(q)
  );
  if (!match) return null;
  return { categoryId: match.categoryId, tab: match.tab, itemId: match.id };
}
