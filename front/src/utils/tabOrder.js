/** Reorder array by moving item from one index to another. */
export function reorderArray(items, fromIndex, toIndex) {
  if (!Array.isArray(items) || fromIndex === toIndex) return items;
  if (fromIndex < 0 || fromIndex >= items.length) return items;
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

/** Move tab up or down in the tabs array. */
export function moveTab(tabs, index, direction) {
  if (!Array.isArray(tabs)) return tabs;
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= tabs.length) return tabs;
  return reorderArray(tabs, index, target);
}

/** Count items referencing a tab id. */
export function countItemsForTab(items, tabId) {
  return (items || []).filter(i => i.tab === tabId).length;
}
