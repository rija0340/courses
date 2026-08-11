import { useState, useEffect, useCallback, useRef } from 'react';
import vocabStorage from '../services/vocabStorage';

export default function useVocabDomain(domainId) {
  const [domain, setDomain] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    hasLoadedRef.current = false;
    async function load() {
      if (!domainId) {
        setDomain(null);
        setItems([]);
        setLoading(false);
        hasLoadedRef.current = false;
        return;
      }
      if (!hasLoadedRef.current) {
        setLoading(true);
      }
      setError(null);
      try {
        await vocabStorage.initDomain(domainId);
        const d = await vocabStorage.getDomain(domainId);
        if (!cancelled) {
          setDomain(d);
          setItems(d?.items || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) {
          hasLoadedRef.current = true;
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [domainId, refreshKey]);

  const addItem = useCallback(async (item) => {
    const created = await vocabStorage.createItem(domainId, item);
    setItems(prev => [...prev, created]);
    return created;
  }, [domainId]);

  const updateItem = useCallback(async (id, data) => {
    const updated = await vocabStorage.updateItem(domainId, id, data);
    setItems(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  }, [domainId]);

  const deleteItem = useCallback(async (id) => {
    await vocabStorage.deleteItem(domainId, id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, [domainId]);

  const deleteItems = useCallback(async (ids) => {
    const idList = [...new Set((ids || []).filter(Boolean))];
    if (idList.length === 0) return;
    for (const id of idList) {
      await vocabStorage.deleteItem(domainId, id);
    }
    const removed = new Set(idList);
    setItems(prev => prev.filter(i => !removed.has(i.id)));
  }, [domainId]);

  const updateOrganization = useCallback(async (organization) => {
    await vocabStorage.updateOrganization(domainId, organization);
    setDomain(prev => prev ? { ...prev, organization } : prev);
  }, [domainId]);

const updateCategories = useCallback(async (categories) => {
    await vocabStorage.updateCategories(domainId, categories);
    setDomain(prev => prev ? {
      ...prev,
      organization: { ...(prev.organization || {}), categories }
    } : prev);
  }, [domainId]);

  const updateMeta = useCallback(async (meta) => {
    await vocabStorage.updateMeta(domainId, meta);
    setDomain(prev => prev ? { ...prev, meta } : prev);
  }, [domainId]);

  return {
    domain,
    items,
    loading,
    error,
    refresh,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    updateOrganization,
    updateCategories,
    updateMeta
  };
}
