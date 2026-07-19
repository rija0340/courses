export function findNodeById(categories, id) {
  if (!Array.isArray(categories)) return null;
  for (const node of categories) {
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }
  return null;
}

export function getDescendantIds(categories, id) {
  const node = findNodeById(categories, id);
  if (!node) return [];
  const ids = [node.id];
  const walk = (n) => {
    if (n.children) {
      n.children.forEach(c => {
        ids.push(c.id);
        walk(c);
      });
    }
  };
  walk(node);
  return ids;
}

export function getPath(categories, id) {
  if (!Array.isArray(categories)) return [];
  for (const node of categories) {
    if (node.id === id) return [node];
    const subPath = getPath(node.children, id);
    if (subPath.length) return [node, ...subPath];
  }
  return [];
}

export function flattenTree(categories, lang = 'fr', depth = 0, parentPath = '') {
  if (!Array.isArray(categories)) return [];
  const result = [];
  categories.forEach(node => {
    const label = typeof node.label === 'string' ? node.label : (node.label?.[lang] || node.label?.fr || '');
    const path = parentPath ? `${parentPath} > ${label}` : label;
    result.push({ id: node.id, label, path, depth });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, lang, depth + 1, path));
    }
  });
  return result;
}

export function updateNode(categories, id, updater) {
  if (!Array.isArray(categories)) return categories;
  return categories.map(node => {
    if (node.id === id) return updater(node);
    if (node.children?.length) {
      return { ...node, children: updateNode(node.children, id, updater) };
    }
    return node;
  });
}

export function removeNode(categories, id) {
  if (!Array.isArray(categories)) return categories;
  return categories
    .filter(node => node.id !== id)
    .map(node => node.children?.length ? { ...node, children: removeNode(node.children, id) } : node);
}

export function addChildToNode(categories, parentId, child) {
  if (!parentId) {
    return [...categories, child];
  }
  return updateNode(categories, parentId, (node) => ({
    ...node,
    children: [...(node.children || []), child]
  }));
}

export function countItemsInTree(categories, items) {
  const counts = {};
  const walk = (nodes) => {
    nodes.forEach(n => {
      const descIds = getDescendantIds([n], n.id);
      const c = items.filter(i => descIds.includes(i.categoryId)).length;
      counts[n.id] = c;
      if (n.children?.length) walk(n.children);
    });
  };
  walk(categories);
  return counts;
}