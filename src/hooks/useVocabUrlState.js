import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  splitCategoryPath,
  parseCategoryPath,
  categoryToPathSegments,
  parseVocabSearchParams,
  buildVocabViewUrl,
  pathSegmentsToExpandedIds
} from '../utils/vocabUrlState';

/**
 * Sync VocabsView UI state with URL (path = category breadcrumb, query = filters).
 */
export default function useVocabUrlState({ domainId, categories, tabs, ready }) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const wildcard = params['*'] || '';
  const searchKey = searchParams.toString();
  const defaultTab = tabs[0]?.id || 'vocab';
  const categorySegments = splitCategoryPath(wildcard);

  const urlState = useMemo(() => {
    if (!ready) return null;
    const { categoryId, validSegments } = parseCategoryPath(categories, categorySegments);
    const query = parseVocabSearchParams(searchParams, { defaultTab });
    const resolvedTab = tabs.find(t => t.id === query.tab) ? query.tab : defaultTab;
    return {
      categoryId,
      validSegments,
      tab: resolvedTab,
      mode: query.mode,
      lang: query.lang,
      q: query.q
    };
  }, [ready, categories, categorySegments, searchParams, defaultTab, tabs]);

  const correctedRef = useRef(false);
  useEffect(() => {
    if (!urlState || !ready) return;
    const pathMismatch =
      urlState.validSegments.join('/') !== categorySegments.join('/');
    const tabMismatch = urlState.tab !== (searchParams.get('tab') || defaultTab)
      && !tabs.find(t => t.id === (searchParams.get('tab') || defaultTab));
    if ((pathMismatch || tabMismatch) && !correctedRef.current) {
      correctedRef.current = true;
      const url = buildVocabViewUrl(
        domainId,
        {
          categoryPath: urlState.validSegments,
          tab: urlState.tab,
          mode: urlState.mode,
          lang: urlState.lang,
          q: urlState.q
        },
        categories,
        { defaultTab }
      );
      navigate(url, { replace: true });
    }
  }, [urlState, ready, categorySegments, searchParams, defaultTab, tabs, domainId, categories, navigate]);

  useEffect(() => {
    correctedRef.current = false;
  }, [domainId, wildcard, searchKey]);

  const navigateTo = useCallback((patch) => {
    const current = urlState || {
      validSegments: [],
      tab: defaultTab,
      mode: 'lecture',
      lang: 'en',
      q: ''
    };
    const nextCategoryId = patch.categoryId !== undefined ? patch.categoryId : current.categoryId;
    const nextSegments = patch.categoryPath !== undefined
      ? patch.categoryPath
      : (nextCategoryId
        ? categoryToPathSegments(categories, nextCategoryId)
        : []);

    const url = buildVocabViewUrl(
      domainId,
      {
        categoryPath: nextSegments,
        tab: patch.tab !== undefined ? patch.tab : current.tab,
        mode: patch.mode !== undefined ? patch.mode : current.mode,
        lang: patch.lang !== undefined ? patch.lang : current.lang,
        q: patch.q !== undefined ? patch.q : current.q
      },
      categories,
      { defaultTab }
    );
    navigate(url, { replace: true });
  }, [urlState, defaultTab, categories, domainId, navigate]);

  const setActiveCategory = useCallback((id) => {
    navigateTo({ categoryId: id, categoryPath: id ? categoryToPathSegments(categories, id) : [] });
  }, [navigateTo, categories]);

  const setActiveTab = useCallback((tab) => navigateTo({ tab }), [navigateTo]);
  const setViewMode = useCallback((mode) => navigateTo({ mode }), [navigateTo]);
  const setRevisionLang = useCallback((lang) => navigateTo({ lang }), [navigateTo]);
  const setSearch = useCallback((q) => navigateTo({ q }), [navigateTo]);
  const clearFilters = useCallback(() => navigateTo({ categoryId: null, categoryPath: [], q: '' }), [navigateTo]);

  const expandedIds = useMemo(
    () => pathSegmentsToExpandedIds(urlState?.validSegments || []),
    [urlState?.validSegments]
  );

  return {
    ready: !!urlState,
    activeCategory: urlState?.categoryId ?? null,
    activeTab: urlState?.tab ?? defaultTab,
    viewMode: urlState?.mode ?? 'lecture',
    revisionLang: urlState?.lang ?? 'en',
    search: urlState?.q ?? '',
    expandedIds,
    setActiveCategory,
    setActiveTab,
    setViewMode,
    setRevisionLang,
    setSearch,
    clearFilters,
    buildUrl: (patch) => buildVocabViewUrl(
      domainId,
      {
        categoryPath: urlState?.validSegments,
        categoryId: urlState?.categoryId,
        tab: urlState?.tab,
        mode: urlState?.mode,
        lang: urlState?.lang,
        q: urlState?.q,
        ...patch
      },
      categories,
      { defaultTab }
    )
  };
}
