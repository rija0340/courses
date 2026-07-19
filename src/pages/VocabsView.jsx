import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, X, Filter, Image as ImageIcon, Type, Volume2 } from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import VocabCard from '../components/vocabs/VocabCard';
import CategoryTree from '../components/vocabs/CategoryTree';
import useVocabDomain from '../hooks/useVocabDomain';
import vocabStorage from '../services/vocabStorage';
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

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('vocab');
  const [mode, setMode] = useState('text');
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [catImages, setCatImages] = useState({});

  const drawerRef = useRef(null);
  const buttonRef = useRef(null);
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

  const org = domain?.organization;
  const tabs = org?.tabs || [];
  const meta = domain?.meta;
  const categories = useMemo(() => org?.categories || [], [org]);

  // Load category images
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
    // Pas d'auto-fermeture du panneau mobile
  };

  const clearFilters = () => setActiveCategory(null);

  const counts = useMemo(
    () => countItemsInTree(categories, items),
    [categories, items]
  );

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategory) {
      const ids = getDescendantIds(categories, activeCategory);
      result = result.filter(i => i.categoryId && ids.includes(i.categoryId));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.en.toLowerCase().includes(q) ||
        i.fr.toLowerCase().includes(q) ||
        i.mg.toLowerCase().includes(q)
      );
    } else if (activeTab) {
      result = result.filter(i => i.tab === activeTab);
    }
    return result;
  }, [items, categories, activeCategory, activeTab, search]);

  const getLabel = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.fr || '';
  };

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

  // Breadcrumb avec catégories cliquables
  const breadcrumbItems = [
    {
      label: getLabel(meta?.title) || domainId,
      onClick: () => { clearFilters(); }
    }
  ];
  categoryPath.forEach((node, idx) => {
    const isLast = idx === categoryPath.length - 1;
    breadcrumbItems.push({
      label: getLabel(node.label),
      ...(isLast
        ? {}  // dernier = page actuelle, pas cliquable
        : { onClick: () => setActiveCategory(node.id) }
      )
    });
  });

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

      <div className="mb-8 sm:mb-12 mt-3 sm:mt-4">
        <h1 className="text-4xl font-normal text-[#202124] mb-4 leading-tight">
          {getLabel(meta?.title)}
        </h1>
        <p className="text-xl text-[#5f6368] leading-relaxed">{getLabel(meta?.description)}</p>
      </div>

      {/* === BARRE DE CONTRÔLE COMPACTE === */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Ligne 1 : Toggle + Search (desktop inline) + Categories */}
        <div className="flex gap-2 items-center">
          {/* Toggle Texte/Image */}
          <div className="flex gap-[2px] p-[2px] bg-[#f1f3f4] rounded-xl shrink-0">
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] font-semibold transition-all ${
                mode === 'text'
                  ? 'bg-white text-[#1a73e8] shadow-sm'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Texte</span>
            </button>
            <button
              onClick={() => setMode('image')}
              className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] font-semibold transition-all ${
                mode === 'image'
                  ? 'bg-white text-[#1a73e8] shadow-sm'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Image</span>
            </button>
          </div>

          {/* Search: desktop inline */}
          {mode === 'text' && (
            <div className="hidden md:flex relative flex-1 items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:shadow-sm outline-none text-[15px] transition-all placeholder:text-[#9aa0a6]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 rounded-full hover:bg-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Categories button: mobile */}
          {hasSidebar && (
            <button
              ref={buttonRef}
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white border border-[#dadce0] text-[13px] font-semibold text-[#3c4043] shadow-sm hover:bg-[#f8f9fa] transition-all shrink-0"
            >
              <Filter className="w-4 h-4 text-[#5f6368]" />
              <span className="max-w-[120px] truncate">
                {activeCategory
                  ? categoryPath.map(n => getLabel(n.label)).join(' > ')
                  : 'Catégories'}
              </span>
              {activeCategory && (
                <span
                  onClick={e => { e.stopPropagation(); clearFilters(); }}
                  className="ml-0.5 p-0.5 rounded-full bg-[#e8eaed] hover:bg-[#dadce0]"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          )}
        </div>

        {/* Search: mobile only */}
        {mode === 'text' && (
          <div className="md:hidden relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher : eye, maso, yeux..."
              className="w-full h-11 pl-9 pr-8 rounded-xl bg-white border border-[#dadce0] focus:border-[#1a73e8] focus:shadow-sm outline-none text-[15px] transition-all placeholder:text-[#9aa0a6]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 rounded-full hover:bg-zinc-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile categories drawer */}
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
          {/* TABS — uniquement dans la zone de contenu */}
          {mode === 'text' && tabs.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-10 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-[#202124] shadow-sm ring-1 ring-[#dadce0]'
                      : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed] hover:text-[#202124]'
                  }`}
                >
                  {getLabel(tab.label)}
                </button>
              ))}
            </div>
          )}

          {/* === Mode TEXT === */}
          {mode === 'text' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <VocabCard key={item.id} item={item} lang={lang} />
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

          {/* === Mode IMAGE === */}
          {mode === 'image' && (
            <div className="space-y-8">
              {/* Categories / Subcategories Grid */}
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
                        <div className="aspect-square relative bg-[#f8f9fa] flex items-center justify-center overflow-hidden">
                          {catImages[cat.id] ? (
                            <img src={catImages[cat.id]} alt={getLabel(cat.label)} className="w-full h-full object-cover" />
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

              {/* Vocabulary Items Grid */}
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
                          <div className="aspect-square relative bg-[#f8f9fa] flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={activeWord} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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

              {/* Diagram */}
              {activeCategory && catImages[activeCategory] && (
                <div className="mt-6">
                  <p className="text-[13px] font-bold text-[#9aa0a6] uppercase tracking-wider mb-3">
                    Schéma de la catégorie
                  </p>
                  <div className="rounded-2xl border border-[#dadce0] overflow-hidden bg-white">
                    <img
                      src={catImages[activeCategory]}
                      alt={getLabel(findNodeById(categories, activeCategory)?.label)}
                      className="w-full max-h-[400px] object-contain bg-[#f8f9fa]"
                    />
                  </div>
                </div>
              )}

              {/* Empty state */}
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
    </div>
  );
}