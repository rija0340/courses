import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, X, Filter, Image as ImageIcon, Volume2, BookOpen, Eye, HelpCircle, Link2, Check, Languages, MoreHorizontal, Sparkles } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import { CompactMenu, MenuButton, MenuTrigger } from '../components/CompactMenu';
import VocabCard from '../components/vocabs/VocabCard';
import CategoryTree from '../components/vocabs/CategoryTree';
import VocabTabBar from '../components/vocabs/VocabTabBar';
import FullscreenLightbox from '../components/vocabs/FullscreenLightbox';
import useVocabDomain from '../hooks/useVocabDomain';
import useVocabUrlState from '../hooks/useVocabUrlState';
import vocabStorage from '../services/vocabStorage';
import { filterVocabItems } from '../utils/vocabFilters';
import { VOCAB_GUIDE, getGuideText } from '../data/vocabs/vocabGuideContent';
import { isPracticeEnabled } from '../practice/config';
import {
  getPath,
  getDescendantIds,
  countItemsInTree,
  findNodeById
} from '../utils/categoryTree';

export default function VocabsView() {
  const { domainId } = useParams();
  const { lang } = useContext(AppContext);
  const { domain, items, error, loading } = useVocabDomain(domainId);

  const org = domain?.organization;
  const tabs = useMemo(() => org?.tabs || [], [org]);
  const meta = domain?.meta;
  const categories = useMemo(() => org?.categories || [], [org]);
  const domainReady = !loading && !!domain;

  const {
    activeCategory,
    activeTab,
    viewMode,
    revisionLang,
    search,
    expandedIds: urlExpandedIds,
    setActiveCategory,
    setActiveTab,
    setViewMode,
    setRevisionLang,
    setSearch,
    clearFilters,
    buildUrl
  } = useVocabUrlState({ domainId, categories, tabs, ready: domainReady });

  const [revealAll, setRevealAll] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [catImages, setCatImages] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  const drawerRef = useRef(null);
  const buttonRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [drawerPos, setDrawerPos] = useState({ top: 0, left: 0, width: 280 });

  useEffect(() => {
    if (mobileDrawerOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = Math.min(window.innerWidth - 16, 360);
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      setDrawerPos({ top: rect.bottom + 8, left, width });
    }
  }, [mobileDrawerOpen]);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileDrawerOpen]);

  useEffect(() => {
    if (viewMode !== 'revision') setRevealAll(false);
  }, [viewMode]);

  const urlExpandedKey = urlExpandedIds.join(',');

  useEffect(() => {
    if (urlExpandedIds.length) {
      setExpandedIds(prev => [...new Set([...urlExpandedIds, ...prev])]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- expand tree from URL path segments
  }, [urlExpandedKey]);

  useEffect(() => {
    async function loadImages() {
      const imgs = {};
      const walk = async (nodes) => {
        for (const n of nodes) {
          const img = await vocabStorage.getCategoryImage(domainId, n.id);
          if (img) imgs[n.id] = img;
          if (n.children?.length) await walk(n.children);
        }
      };
      await walk(categories);
      setCatImages(imgs);
    }
    if (categories.length) loadImages();
  }, [categories, domainId]);

  const toggleExpand = (id) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectCategory = (id) => {
    setActiveCategory(id);
    const node = findNodeById(categories, id);
    const isLeaf = !node?.children?.length;
    if (isLeaf) {
      setMobileDrawerOpen(false);
    }
  };

  const handleSearchSubmit = (e, inputRef) => {
    e.preventDefault();
    inputRef?.current?.blur();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const counts = useMemo(
    () => countItemsInTree(categories, items),
    [categories, items]
  );

  const isTextMode = viewMode === 'lecture' || viewMode === 'revision';

  const filteredItems = useMemo(() => filterVocabItems(items, {
    categories,
    activeCategory,
    activeTab,
    search
  }), [items, categories, activeCategory, activeTab, search]);

  /** Category-scoped items for tab counts (ignore search + active tab). */
  const tabCountItems = useMemo(() => filterVocabItems(items, {
    categories,
    activeCategory,
    activeTab: null,
    search: ''
  }), [items, categories, activeCategory]);

  const getLabel = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.fr || '';
  };

  const guideT = (obj) => getGuideText(obj, lang);
  const modeHint = guideT(VOCAB_GUIDE.microHints[viewMode]);

  const categoryPath = useMemo(
    () => activeCategory ? getPath(categories, activeCategory) : [],
    [categories, activeCategory]
  );

  const subcategoriesToRender = useMemo(() => {
    if (!activeCategory) return categories;
    const node = findNodeById(categories, activeCategory);
    return node?.children || [];
  }, [categories, activeCategory]);

  const activeCategoryItems = useMemo(() => {
    if (!activeCategory) return [];
    const ids = getDescendantIds(categories, activeCategory);
    return items.filter(item => item.categoryId && ids.includes(item.categoryId));
  }, [items, categories, activeCategory]);

  const breadcrumbItems = [
    {
      label: getLabel(meta?.title) || domainId,
      path: buildUrl({ categoryId: null, categoryPath: [] })
    }
  ];
  categoryPath.forEach((node, idx) => {
    const isLast = idx === categoryPath.length - 1;
    breadcrumbItems.push({
      label: getLabel(node.label),
      ...(isLast ? {} : { path: buildUrl({ categoryId: node.id }) })
    });
  });

  const openLightbox = (src, alt) => setLightbox({ src, alt });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-20 flex justify-center">
        <div className="w-9 h-9 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="p-12 text-center text-[#5f6368]">Erreur : {error}</div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="max-w-lg mx-auto px-6 pt-16 text-center">
        <p className="text-[18px] font-medium text-[#202124] mb-2">Domaine pas encore initialisé</p>
        <p className="text-[14px] text-[#5f6368] mb-6">
          Connecte-toi à l’admin pour créer les données dans Supabase (une seule fois).
        </p>
        <Link
          to={`/vocabs/${domainId}/admin`}
          className="inline-flex h-11 px-5 items-center rounded-xl bg-[#1a73e8] text-white text-[14px] font-semibold hover:bg-[#1b66c9]"
        >
          Ouvrir l’admin
        </Link>
      </div>
    );
  }

  const hasSidebar = categories.length > 0;

  const sidebarContent = (
    <div>
      <CategoryTree
        nodes={categories}
        activeId={activeCategory}
        expandedIds={expandedIds}
        onToggle={toggleExpand}
        onSelect={selectCategory}
        counts={counts}
        images={catImages}
        getLabel={getLabel}
        lang={lang}
      />
      {!activeCategory && (
        <button
          onClick={() => { clearFilters(); }}
          className="w-full text-left px-3 py-2.5 rounded-lg text-[15px] font-medium bg-[#1a73e8] text-white mt-1"
        >
          Tous les mots
        </button>
      )}
      {activeCategory && (
        <button
          onClick={() => { clearFilters(); }}
          className="w-full text-left px-3 py-2 mt-2 rounded-lg text-[14px] text-[#5f6368] hover:bg-[#f1f3f4]"
        >
          ← Tous les mots
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6 sm:mb-8 mt-3 sm:mt-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] leading-tight min-w-0">
            {getLabel(meta?.title)}
          </h1>
          <div className="flex items-center gap-1.5 shrink-0 pt-1">
            <Link
              to={`/vocabs/${domainId}/guide`}
              className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] sm:text-[13px] font-semibold text-[#3c4043] hover:bg-[#f8f9fa] transition-all"
              title={guideT(VOCAB_GUIDE.pageTitle)}
            >
              <HelpCircle className="w-4 h-4 text-[#1a73e8]" />
              <span>Guide</span>
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[13px] font-semibold text-[#3c4043] hover:bg-[#f8f9fa] transition-all"
              title="Copier le lien de cette page"
            >
              {shareCopied ? (
                <Check className="w-4 h-4 text-[#137333]" />
              ) : (
                <Link2 className="w-4 h-4 text-[#1a73e8]" />
              )}
              {shareCopied ? 'Copié !' : 'Partager'}
            </button>
            <CompactMenu
              className="sm:hidden"
              trigger={(open) => <MenuTrigger icon={MoreHorizontal} label="Plus d'actions" open={open} />}
            >
              <MenuButton onClick={handleShare}>
                {shareCopied ? (
                  <Check size={15} className="text-[#137333]" />
                ) : (
                  <Link2 size={15} className="text-[#1a73e8]" />
                )}
                {shareCopied ? 'Lien copié !' : 'Copier le lien'}
              </MenuButton>
            </CompactMenu>
          </div>
        </div>
        <p className="text-lg sm:text-xl text-[#5f6368] leading-relaxed">{getLabel(meta?.description)}</p>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        {/* Row 1: modes + simulation + revision controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-[2px] p-[2px] bg-[#f1f3f4] rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('lecture')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all ${
                viewMode === 'lecture'
                  ? 'bg-white text-[#1a73e8] shadow-sm'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Lecture</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('revision')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all ${
                viewMode === 'revision'
                  ? 'bg-white text-[#1a73e8] shadow-sm'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Révision</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('image')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all ${
                viewMode === 'image'
                  ? 'bg-white text-[#1a73e8] shadow-sm'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Image</span>
            </button>
          </div>

          {isPracticeEnabled() && (
            <Link
              to={`/vocabs/${domainId}/practice/simulation`}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-[#dadce0] bg-white text-[12px] sm:text-[13px] font-semibold text-[#1a73e8] hover:bg-[#e8f0fe] shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulation</span>
            </Link>
          )}

          {viewMode === 'revision' && (
            <>
              <CompactMenu
                className="sm:hidden shrink-0"
                trigger={(open) => (
                  <MenuTrigger icon={Languages} label="Langue de révision" open={open} badge={revisionLang} />
                )}
              >
                {[
                  { id: 'fr', label: 'Français' },
                  { id: 'en', label: 'English' },
                  { id: 'mg', label: 'Malagasy' }
                ].map(l => (
                  <MenuButton key={l.id} active={revisionLang === l.id} onClick={() => setRevisionLang(l.id)}>
                    <span className="w-7 text-[11px] font-bold uppercase text-[#9aa0a6]">{l.id}</span>
                    {l.label}
                  </MenuButton>
                ))}
              </CompactMenu>
              <div className="hidden sm:flex gap-[2px] p-[2px] bg-[#f1f3f4] rounded-xl shrink-0">
                {['fr', 'en', 'mg'].map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setRevisionLang(code)}
                    className={`px-3 h-9 rounded-lg text-[12px] font-bold uppercase transition-all ${
                      revisionLang === code
                        ? 'bg-white text-[#1a73e8] shadow-sm'
                        : 'text-[#5f6368] hover:text-[#202124]'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRevealAll(v => !v)}
                className={`h-9 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-[12px] font-semibold transition-all shrink-0 ${
                  revealAll
                    ? 'bg-[#E8F0FE] text-[#1967D2]'
                    : 'bg-white border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
                }`}
              >
                <span className="sm:hidden">{revealAll ? 'Masquer' : 'Révéler'}</span>
                <span className="hidden sm:inline">{revealAll ? 'Masquer tout' : 'Tout révéler'}</span>
              </button>
            </>
          )}
        </div>

        {modeHint && (
          <p className="text-[13px] text-[#5f6368]">{modeHint}</p>
        )}

        {/* Row 2: search + mobile categories */}
        <div className="flex flex-wrap items-center gap-2">
          {isTextMode && (
            <form
              onSubmit={(e) => handleSearchSubmit(e, desktopSearchRef)}
              className="hidden md:flex relative flex-1 items-center min-w-[220px]"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6] pointer-events-none" />
              <input
                ref={desktopSearchRef}
                type="search"
                enterKeyHint="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:shadow-sm outline-none text-[15px] transition-all placeholder:text-[#9aa0a6]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 rounded-full hover:bg-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>
          )}

          {hasSidebar && (
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white border border-[#dadce0] text-[13px] font-semibold text-[#3c4043] shadow-sm hover:bg-[#f8f9fa] transition-all shrink-0"
            >
              <Filter className="w-4 h-4 text-[#5f6368]" />
              <span className="max-w-[140px] truncate">
                {activeCategory
                  ? categoryPath.map(n => getLabel(n.label)).join(' > ')
                  : 'Catégories'}
              </span>
              {activeCategory && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={e => { e.stopPropagation(); clearFilters(); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); clearFilters(); } }}
                  className="ml-0.5 p-0.5 rounded-full bg-[#e8eaed] hover:bg-[#dadce0]"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          )}
        </div>

        {isTextMode && (
          <form
            onSubmit={(e) => handleSearchSubmit(e, mobileSearchRef)}
            className="md:hidden relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6] pointer-events-none" />
            <input
              ref={mobileSearchRef}
              type="search"
              enterKeyHint="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher : eye, maso, yeux..."
              className="w-full h-11 pl-9 pr-8 rounded-xl bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:shadow-sm outline-none text-[15px] transition-all placeholder:text-[#9aa0a6]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 rounded-full hover:bg-zinc-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>
        )}
      </div>

      {mobileDrawerOpen && (
        <>
          <div className="fixed inset-0 z-[55]" onClick={() => setMobileDrawerOpen(false)} />
          <div
            ref={drawerRef}
            className="fixed z-[60] bg-white border border-[#dadce0] rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
            style={{
              top: drawerPos.top,
              left: drawerPos.left,
              width: drawerPos.width,
              maxHeight: '70vh'
            }}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#dadce0]">
              <p className="font-medium text-[16px] text-[#202124]">Catégories</p>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-full hover:bg-[#f1f3f4]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {sidebarContent}
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {hasSidebar && (
          <div className="hidden md:block w-[240px] shrink-0">
            <div className="sticky top-20 bg-white border border-[#dadce0] rounded-2xl p-4">
              <p className="text-[13px] font-bold text-[#9aa0a6] uppercase tracking-wider mb-4 px-1">
                Catégories
              </p>
              {sidebarContent}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isTextMode && tabs.length > 0 && (
            <VocabTabBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              getLabel={getLabel}
              items={tabCountItems}
              sectionLabel={guideT(VOCAB_GUIDE.tabSectionLabel)}
            />
          )}

          {isTextMode && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <VocabCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    mode={viewMode}
                    revisionLang={revisionLang}
                    revealAll={revealAll}
                    onImageClick={openLightbox}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f1f3f4] flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-[#9aa0a6]" />
                  </div>
                  <p className="text-lg font-normal text-[#202124]">Aucun résultat</p>
                  <p className="text-sm text-[#5f6368] mt-2">Essayez "maso", "eye" ou "oreille"</p>
                </div>
              )}
            </>
          )}

          {viewMode === 'image' && (
            <div className="space-y-8">
              {activeCategory && catImages[activeCategory] && (
                <div>
                  <p className="text-[13px] font-bold text-[#9aa0a6] uppercase tracking-wider mb-3">
                    Schéma de la catégorie
                  </p>
                  <button
                    type="button"
                    onClick={() => openLightbox(
                      catImages[activeCategory],
                      getLabel(findNodeById(categories, activeCategory)?.label)
                    )}
                    className="w-full rounded-2xl border border-[#dadce0] overflow-hidden bg-white cursor-zoom-in hover:shadow-md transition-shadow"
                  >
                    <img
                      src={catImages[activeCategory]}
                      alt={getLabel(findNodeById(categories, activeCategory)?.label)}
                      className="w-full max-h-[400px] object-contain bg-[#f8f9fa]"
                    />
                  </button>
                </div>
              )}

              {subcategoriesToRender.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold text-[#9aa0a6] uppercase tracking-wider mb-4 px-1">
                    {activeCategory ? 'Sous-catégories' : 'Catégories'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subcategoriesToRender.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className="group relative rounded-2xl border border-[#dadce0] bg-white overflow-hidden hover:shadow-md transition-all text-left"
                      >
                        <div
                          className="aspect-square relative bg-[#f8f9fa] flex items-center justify-center overflow-hidden"
                          onClick={(e) => {
                            if (catImages[cat.id]) {
                              e.stopPropagation();
                              openLightbox(catImages[cat.id], getLabel(cat.label));
                            }
                          }}
                          role={catImages[cat.id] ? 'button' : undefined}
                        >
                          {catImages[cat.id] ? (
                            <img src={catImages[cat.id]} alt={getLabel(cat.label)} className="w-full h-full object-cover cursor-zoom-in" />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[28px] font-bold text-white shadow-sm bg-[#dadce0]">
                              {(getLabel(cat.label) || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-[15px] font-semibold text-[#202124] truncate">{getLabel(cat.label)}</p>
                          <p className="text-[12px] text-[#5f6368] mt-0.5">{counts[cat.id] || 0} mot{counts[cat.id] !== 1 ? 's' : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeCategory && activeCategoryItems.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-bold text-[#9aa0a6] uppercase tracking-wider mb-4 px-1">
                    Mots dans cette catégorie
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeCategoryItems.map(item => {
                      const activeWord = lang === 'en' ? item.en : lang === 'mg' ? item.mg : item.fr;
                      const playAudio = (e) => {
                        e.stopPropagation();
                        if (!item.en) return;
                        const utterance = new SpeechSynthesisUtterance(item.en);
                        utterance.lang = 'en-US';
                        speechSynthesis.speak(utterance);
                      };
                      return (
                        <div
                          key={item.id}
                          onClick={playAudio}
                          className="group relative rounded-2xl border border-[#dadce0] bg-white overflow-hidden hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
                          title="Cliquez pour écouter la prononciation anglaise"
                        >
                          <div
                            className="aspect-square relative bg-[#f8f9fa] flex items-center justify-center overflow-hidden"
                            onClick={(e) => {
                              if (item.image) {
                                e.stopPropagation();
                                openLightbox(item.image, activeWord);
                              }
                            }}
                          >
                            {item.image ? (
                              <img src={item.image} alt={activeWord} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in" />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] font-bold text-[#9aa0a6] bg-[#f1f3f4] group-hover:scale-105 transition-transform duration-300">
                                {activeWord.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                              <Volume2 className="w-3.5 h-3.5 text-[#1a73e8]" />
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-[15px] font-semibold text-[#202124] truncate">{activeWord}</p>
                            <p className="text-[12px] text-[#5f6368] mt-0.5">{item.en} · {item.mg}</p>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white mt-2 ${
                              item.category === 'Organe' ? 'bg-[#2563EB]' :
                              item.category === 'Maladie' ? 'bg-[#EA4335]' :
                              item.category === 'Symptôme' ? 'bg-[#FBBC05]' :
                              'bg-[#34A853]'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {subcategoriesToRender.length === 0 && activeCategoryItems.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f1f3f4] flex items-center justify-center mb-4">
                    <ImageIcon className="w-6 h-6 text-[#9aa0a6]" />
                  </div>
                  <p className="text-lg font-normal text-[#202124]">Aucun visuel</p>
                  <p className="text-sm text-[#5f6368] mt-2">Ajoutez des images ou des mots depuis le backoffice</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <FullscreenLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
