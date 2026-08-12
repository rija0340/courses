import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Trash2, Pencil, ChevronDown, Search, Image as ImageIcon,
  Folder, FolderOpen, X, HelpCircle
} from 'lucide-react';
import vocabStorage from '../../../services/vocabStorage';
import { findItemNavigation } from '../../../utils/vocabFilters';
import {
  removeNode, addChildToNode, updateNode,
  findNodeById, getPath
} from '../../../utils/categoryTree';
import CategoryItemsPanel from './CategoryItemsPanel';
import CategoryDataTransfer from './CategoryDataTransfer';
import FullscreenLightbox from '../FullscreenLightbox';
import { EmptyState, ImageModal } from './shared';

export default function CategoriesHub({
  categories,
  items,
  tabs,
  getLabel,
  updateCategories,
  showToast,
  domainId,
  domain,
  addItem,
  updateItem,
  deleteItem,
  deleteItems,
  refresh,
  urlCategoryId,
  urlOrgTab,
  urlSearch,
  onNavChange
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [catImages, setCatImages] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState({ fr: '', en: '', mg: '' });
  const [addingChild, setAddingChild] = useState(false);
  const [newLabel, setNewLabel] = useState({ fr: '', en: '', mg: '' });
  const [imageModalId, setImageModalId] = useState(null);
  const [rootDraft, setRootDraft] = useState('');
  const [activeOrgTab, setActiveOrgTab] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (tabs.length && !tabs.find(t => t.id === activeOrgTab)) {
      setActiveOrgTab(tabs[0]?.id || '');
    }
  }, [tabs, activeOrgTab]);

  useEffect(() => {
    if (urlCategoryId === undefined) return;
    if (urlCategoryId !== selectedId) {
      setSelectedId(urlCategoryId);
      if (urlCategoryId) {
        const path = getPath(categories, urlCategoryId);
        setExpanded(path.slice(0, -1).map(n => n.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL-driven selection sync
  }, [urlCategoryId, categories]);

  useEffect(() => {
    if (urlOrgTab && tabs.find(t => t.id === urlOrgTab)) {
      setActiveOrgTab(urlOrgTab);
    }
  }, [urlOrgTab, tabs]);

  useEffect(() => {
    if (urlSearch !== undefined && urlSearch !== globalSearch) {
      setGlobalSearch(urlSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL-driven search sync
  }, [urlSearch]);

  useEffect(() => {
    async function load() {
      const map = {};
      const walk = async (nodes) => {
        for (const n of nodes) {
          const img = await vocabStorage.getCategoryImage(domainId, n.id);
          if (img) map[n.id] = img;
          if (n.children?.length) await walk(n.children);
        }
      };
      await walk(categories);
      setCatImages(map);
    }
    if (categories.length) load();
  }, [categories, domainId]);

  const toggleExpand = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectNode = (id) => {
    setSelectedId(id);
    setIsEditing(false);
    setAddingChild(false);
    onNavChange?.({ cat: id || null });
  };

  const handleGlobalSearch = (value) => {
    setGlobalSearch(value);
    const nav = findItemNavigation(items, value);
    if (nav?.categoryId) {
      setSelectedId(nav.categoryId);
      if (nav.tab) setActiveOrgTab(nav.tab);
      const path = getPath(categories, nav.categoryId);
      setExpanded(path.slice(0, -1).map(n => n.id));
      onNavChange?.({ cat: nav.categoryId, orgTab: nav.tab || activeOrgTab, q: value });
    } else {
      onNavChange?.({ q: value });
    }
  };

  const selectedNode = selectedId ? findNodeById(categories, selectedId) : null;
  const selectedPath = selectedId ? getPath(categories, selectedId) : [];

  const countDirect = (id) => items.filter(i => i.categoryId === id).length;
  const countTotal = (node) => {
    if (!node) return 0;
    let c = countDirect(node.id);
    (node.children || []).forEach(ch => { c += countTotal(ch); });
    return c;
  };

  const handleSaveLabel = async () => {
    if (!editLabel.fr.trim()) return;
    const updated = updateNode(categories, selectedId, (n) => ({
      ...n, label: { ...n.label, ...editLabel }
    }));
    await updateCategories(updated);
    showToast('Nom mis à jour');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedNode) return;
    if (countTotal(selectedNode) > 0) {
      showToast('Déplacez d’abord les mots de cette catégorie.', 'error');
      return;
    }
    const updated = removeNode(categories, selectedId);
    await updateCategories(updated);
    await vocabStorage.deleteCategoryImage(domainId, selectedId);
    showToast('Catégorie supprimée');
    setSelectedId(null);
    setIsEditing(false);
  };

  const makeCat = (label) => ({
    id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    label: {
      fr: label.fr,
      en: label.en || label.fr,
      mg: label.mg || label.fr
    },
    children: []
  });

  const handleAddChild = async () => {
    if (!newLabel.fr.trim() || !selectedId) return;
    const updated = addChildToNode(categories, selectedId, makeCat(newLabel));
    await updateCategories(updated);
    showToast('Sous-catégorie ajoutée');
    setAddingChild(false);
    setNewLabel({ fr: '', en: '', mg: '' });
    setExpanded(prev => [...prev, selectedId]);
  };

  const handleAddRoot = async () => {
    const fr = rootDraft.trim();
    if (!fr) return;
    const updated = addChildToNode(categories, null, makeCat({ fr, en: fr, mg: fr }));
    await updateCategories(updated);
    showToast('Catégorie ajoutée');
    setRootDraft('');
  };

  const handleSaveImage = async (id, dataUrl) => {
    try {
      const url = await vocabStorage.saveCategoryImage(domainId, id, dataUrl);
      setCatImages(prev => ({ ...prev, [id]: url || dataUrl }));
      showToast('Image sauvegardée');
      setImageModalId(null);
    } catch (err) {
      showToast(err.message || 'Échec sauvegarde image', 'error');
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await vocabStorage.deleteCategoryImage(domainId, id);
      setCatImages(prev => { const c = { ...prev }; delete c[id]; return c; });
      showToast('Image supprimée');
      setImageModalId(null);
    } catch (err) {
      showToast(err.message || 'Échec suppression image', 'error');
    }
  };

  const renderTree = (nodes, depth = 0) => nodes.map(node => {
    const isSel = selectedId === node.id;
    const isExp = expanded.includes(node.id);
    const hasCh = node.children?.length > 0;
    return (
      <div key={node.id}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => selectNode(node.id)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') selectNode(node.id); }}
          className={`w-full flex items-center gap-2 rounded-xl text-left cursor-pointer transition-all py-2 text-[13px] ${
            isSel ? 'bg-[#E8F0FE] text-[#1967D2]' : 'hover:bg-[#f1f3f4] text-[#3c4043]'
          }`}
          style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: 8 }}
        >
          {hasCh ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-transform ${isExp ? '' : '-rotate-90'} ${isSel ? 'text-[#1967D2]' : 'text-[#9aa0a6]'}`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="w-5 shrink-0" />
          )}
          {catImages[node.id] ? (
            <img src={catImages[node.id]} alt="" className="w-6 h-6 rounded-md object-cover shrink-0 border border-[#dadce0]" />
          ) : (
            <Folder className={`w-4 h-4 shrink-0 ${isSel ? 'text-[#1967D2]' : 'text-[#9aa0a6]'}`} />
          )}
          <span className="truncate flex-1 font-medium">{getLabel(node.label)}</span>
          <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-md shrink-0 ${isSel ? 'bg-white/80 text-[#1967D2]' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
            {countTotal(node)}
          </span>
        </div>
        {hasCh && isExp && <div>{renderTree(node.children, depth + 1)}</div>}
      </div>
    );
  });

  const tabCounts = useMemo(() => {
    if (!selectedId) return {};
    const counts = {};
    tabs.forEach(t => {
      counts[t.id] = items.filter(i => i.categoryId === selectedId && i.tab === t.id).length;
    });
    return counts;
  }, [selectedId, items, tabs]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-[#5f6368]">
          Hub catégories — arbre, recherche globale et édition inline.
        </p>
        <Link
          to={`/vocabs/${domainId}/admin/guide`}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a73e8] hover:underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Guide admin
        </Link>
      </div>
      <div className="bg-white border border-[#dadce0] rounded-2xl p-3 sm:p-4 mb-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
          <input
            value={globalSearch}
            onChange={e => handleGlobalSearch(e.target.value)}
            placeholder="Rechercher un mot (FR, EN, MG) — sélectionne catégorie et onglet…"
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[14px]"
          />
          {globalSearch && (
            <button type="button" onClick={() => { setGlobalSearch(''); onNavChange?.({ q: '' }); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#e8eaed]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-[300px] shrink-0">
          <div className="bg-white border border-[#dadce0] rounded-2xl p-3 sm:p-4 sticky top-[7.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">Arbre</p>
              {selectedId && (
                <button type="button" onClick={() => { setSelectedId(null); setIsEditing(false); setAddingChild(false); onNavChange?.({ cat: null }); }} className="text-[11px] text-[#1a73e8] font-medium hover:underline">
                  Effacer
                </button>
              )}
            </div>
            <div className="space-y-0.5 max-h-[50vh] overflow-y-auto pr-0.5">
              {renderTree(categories)}
              {categories.length === 0 && (
                <p className="text-[13px] text-[#9aa0a6] text-center py-8">Aucune catégorie</p>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-[#f1f3f4]">
              <div className="flex gap-1.5">
                <input
                  value={rootDraft}
                  onChange={e => setRootDraft(e.target.value)}
                  placeholder="Nouvelle catégorie…"
                  className="flex-1 h-9 rounded-xl bg-[#f8f9fa] border border-transparent focus:border-[#1a73e8] focus:bg-white px-3 text-[13px] outline-none"
                  onKeyDown={e => { if (e.key === 'Enter') handleAddRoot(); }}
                />
                <button
                  type="button"
                  onClick={handleAddRoot}
                  disabled={!rootDraft.trim()}
                  className="h-9 w-9 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center hover:bg-[#1b66c9] disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {selectedNode ? (
            <div className="bg-white border border-[#dadce0] rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-1 text-[12px] text-[#9aa0a6] mb-4 flex-wrap">
                {selectedPath.map((n, i) => (
                  <React.Fragment key={n.id}>
                    {i > 0 && <span className="text-[#dadce0]">/</span>}
                    <span className={i === selectedPath.length - 1 ? 'text-[#202124] font-medium' : ''}>
                      {getLabel(n.label)}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative w-full sm:w-44 shrink-0">
                  <button
                    type="button"
                    onClick={() => catImages[selectedId]
                      ? setLightbox({ src: catImages[selectedId], alt: getLabel(selectedNode.label) })
                      : setImageModalId(selectedId)}
                    className="relative w-full aspect-video sm:aspect-square rounded-xl overflow-hidden bg-[#f8f9fa] border border-[#dadce0] flex items-center justify-center group"
                  >
                    {catImages[selectedId] ? (
                      <img src={catImages[selectedId]} alt="" className="w-full h-full object-cover cursor-zoom-in" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-[#9aa0a6]">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-[11px]">Image</span>
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageModalId(selectedId)}
                    className="mt-1.5 w-full text-[11px] font-medium text-[#1a73e8] hover:underline"
                  >
                    {catImages[selectedId] ? 'Changer l’image' : 'Ajouter une image'}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        {['fr', 'en', 'mg'].map(code => (
                          <div key={code} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold w-7 text-[#9aa0a6] uppercase">{code}</span>
                            <input
                              value={editLabel[code]}
                              onChange={e => setEditLabel(p => ({ ...p, [code]: e.target.value }))}
                              className="flex-1 h-9 rounded-xl bg-[#f8f9fa] border border-[#dadce0] px-3 text-[14px] outline-none focus:border-[#1a73e8]"
                            />
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <button type="button" onClick={handleSaveLabel} className="h-9 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]">Enregistrer</button>
                          <button type="button" onClick={() => setIsEditing(false)} className="h-9 px-4 rounded-xl bg-[#f1f3f4] text-[#5f6368] text-[13px] font-semibold">Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-[20px] font-medium text-[#202124]">{getLabel(selectedNode.label)}</h2>
                          <p className="text-[11px] text-[#9aa0a6] font-mono mt-0.5">{selectedNode.id}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(true);
                            setEditLabel({
                              fr: selectedNode.label?.fr || '',
                              en: selectedNode.label?.en || '',
                              mg: selectedNode.label?.mg || ''
                            });
                          }}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed]"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Renommer
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { n: countDirect(selectedId), l: 'Ici' },
                      { n: countTotal(selectedNode), l: 'Total' },
                      { n: selectedNode.children?.length || 0, l: 'Enfants' },
                    ].map(s => (
                      <div key={s.l} className="rounded-xl bg-[#f8f9fa] px-2 py-2.5 text-center">
                        <p className="text-[18px] font-semibold text-[#202124] tabular-nums">{s.n}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa0a6]">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!addingChild && (
                      <button
                        type="button"
                        onClick={() => { setAddingChild(true); setNewLabel({ fr: '', en: '', mg: '' }); }}
                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
                      >
                        <Plus className="w-4 h-4" /> Sous-catégorie
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-red-50 text-red-600 text-[13px] font-semibold hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>

                  {addingChild && (
                    <div className="mt-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0]/60 p-3.5">
                      <p className="text-[13px] font-medium text-[#202124] mb-2">Nouvelle sous-catégorie</p>
                      <div className="space-y-2 mb-3">
                        {['fr', 'en', 'mg'].map(code => (
                          <div key={code} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold w-7 text-[#9aa0a6] uppercase">{code}</span>
                            <input
                              value={newLabel[code]}
                              onChange={e => setNewLabel(p => ({ ...p, [code]: e.target.value }))}
                              placeholder={{ fr: 'Français', en: 'English', mg: 'Malagasy' }[code]}
                              className="flex-1 h-9 rounded-lg bg-white border border-[#dadce0] px-3 text-[13px] outline-none focus:border-[#1a73e8]"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={handleAddChild} disabled={!newLabel.fr.trim()} className="flex-1 h-9 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold disabled:opacity-40">Ajouter</button>
                        <button type="button" onClick={() => setAddingChild(false)} className="h-9 px-4 rounded-xl bg-white border border-[#dadce0] text-[13px] font-semibold text-[#5f6368]">Annuler</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {tabs.length > 0 && (
                <>
                  <CategoryDataTransfer
                    domain={domain}
                    items={items}
                    categoryId={selectedId}
                    activeOrgTab={activeOrgTab || tabs[0]?.id}
                    tabs={tabs}
                    getLabel={getLabel}
                    showToast={showToast}
                    refresh={refresh}
                  />

                  <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#f1f3f4]">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => { setActiveOrgTab(tab.id); onNavChange?.({ orgTab: tab.id }); }}
                        className={`h-10 px-4 rounded-lg text-[13px] font-semibold transition-all ${
                          activeOrgTab === tab.id
                            ? 'bg-[#E8F0FE] text-[#1967D2] ring-1 ring-[#1a73e8]/30'
                            : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                        }`}
                      >
                        {getLabel(tab.label)}
                        <span className="ml-1.5 text-[11px] tabular-nums opacity-70">
                          ({tabCounts[tab.id] || 0})
                        </span>
                      </button>
                    ))}
                  </div>

                  {activeOrgTab && (
                    <CategoryItemsPanel
                      items={items}
                      categories={categories}
                      tabs={tabs}
                      categoryId={selectedId}
                      activeOrgTab={activeOrgTab}
                      domainId={domainId}
                      addItem={addItem}
                      updateItem={updateItem}
                      deleteItem={deleteItem}
                      deleteItems={deleteItems}
                      showToast={showToast}
                      getLabel={getLabel}
                    />
                  )}
                </>
              )}

              {tabs.length === 0 && (
                <p className="mt-6 text-[13px] text-[#9aa0a6]">
                  Aucun onglet configuré — ajoutez-en dans Paramètres.
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="Sélectionnez une catégorie"
              text="Choisissez un nœud dans l’arbre pour gérer les mots par onglet, illustrer ou ajouter des sous-catégories."
            />
          )}
        </div>
      </div>

      {imageModalId && (
        <ImageModal
          title="Image de catégorie"
          currentImage={catImages[imageModalId] || null}
          onSave={(b64) => handleSaveImage(imageModalId, b64)}
          onDelete={() => handleDeleteImage(imageModalId)}
          onClose={() => setImageModalId(null)}
        />
      )}

      {lightbox && (
        <FullscreenLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
