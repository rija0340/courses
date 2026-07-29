import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Trash2, Pencil, Search, Image as ImageIcon, ImageOff,
  LayoutGrid, List, BookOpen, Copy, Check, ClipboardPaste, Upload, ChevronDown
} from 'lucide-react';
import VocabForm from '../VocabForm';
import vocabStorage from '../../../services/vocabStorage';
import { filterVocabItems } from '../../../utils/vocabFilters';
import {
  categoryItemsTemplateToPrettyJson,
  isItemsOnlyImport,
  mergeVocabItems,
  validateItemsOnlyImport,
  VOCAB_DOMAIN_VERSION,
} from '../../../data/vocabs/vocabDomainSchema';
import { EmptyState, ConfirmModal, ImageModal, TYPE_COLORS } from './shared';
import ImportPreviewModal from './ImportPreviewModal';
import FullscreenLightbox from '../FullscreenLightbox';

export default function CategoryItemsPanel({
  items,
  categories,
  tabs,
  categoryId,
  activeOrgTab,
  domainId,
  domain,
  addItem,
  updateItem,
  deleteItem,
  showToast,
  getLabel,
  refresh,
}) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [itemImages, setItemImages] = useState({});
  const [imageItemId, setImageItemId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [pasteJson, setPasteJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('merge');

  useEffect(() => {
    async function load() {
      const map = {};
      for (const item of items) {
        const img = item.image || await vocabStorage.getImage(domainId, item.id);
        if (img) map[item.id] = img;
      }
      setItemImages(map);
    }
    load();
  }, [items, domainId]);

  useEffect(() => {
    setShowJsonImport(false);
    setPasteJson('');
    setImportPreview(null);
  }, [categoryId, activeOrgTab]);

  const filtered = useMemo(() => {
    const base = filterVocabItems(items, {
      categories,
      activeCategory: categoryId,
      activeTab: activeOrgTab,
      search,
      directCategoryOnly: true
    });
    return base;
  }, [items, categories, categoryId, activeOrgTab, search]);

  const importScope = useMemo(
    () => ({ categoryId, tab: activeOrgTab }),
    [categoryId, activeOrgTab]
  );

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await updateItem(editItem.id, data);
        showToast('Mot mis à jour');
      } else {
        await addItem(data);
        showToast('Mot ajouté');
      }
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      showToast('Mot supprimé');
      setConfirmDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleImageSave = async (itemId, dataUrl) => {
    try {
      const url = await vocabStorage.saveImage(domainId, itemId, dataUrl);
      setItemImages(prev => ({ ...prev, [itemId]: url || dataUrl }));
      showToast('Image sauvegardée');
      setImageItemId(null);
    } catch (err) {
      showToast(err.message || 'Échec sauvegarde image', 'error');
    }
  };

  const handleImageDelete = async (itemId) => {
    try {
      await vocabStorage.deleteImage(domainId, itemId);
      setItemImages(prev => {
        const c = { ...prev };
        delete c[itemId];
        return c;
      });
      showToast('Image supprimée');
      setImageItemId(null);
    } catch (err) {
      showToast(err.message || 'Échec suppression image', 'error');
    }
  };

  const handleCopyTemplate = async () => {
    const json = categoryItemsTemplateToPrettyJson(domain, importScope);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      showToast('Modèle JSON copié (catégorie + onglet préremplis)');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier', 'error');
    }
  };

  const processImportText = (text, sourceLabel) => {
    try {
      const parsed = JSON.parse(text);
      if (!isItemsOnlyImport(parsed)) {
        showToast('Utilisez un JSON { "items": [...] } pour cette catégorie', 'error');
        return;
      }
      const result = validateItemsOnlyImport(parsed, domain, {
        forceCategoryId: categoryId,
        forceTab: activeOrgTab,
      });
      setImportPreview({ raw: parsed, result, fileName: sourceLabel });
      setImportMode('merge');
      if (!result.ok) showToast(result.errors[0] || 'JSON invalide', 'error');
    } catch (err) {
      showToast(`JSON invalide: ${err.message}`, 'error');
    }
  };

  const handleImportSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processImportText(event.target.result, file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePasteImport = () => {
    if (!pasteJson.trim()) {
      showToast('Collez un JSON d’abord', 'error');
      return;
    }
    processImportText(pasteJson, 'Collé');
  };

  const executeImport = async () => {
    if (!importPreview?.result?.ok || !importPreview.result.data || !domain?.id) return;
    const { data, stats } = importPreview.result;
    try {
      const mergedItems = mergeVocabItems(domain.items || items || [], data.items);
      await vocabStorage.saveDomain(domain.id, {
        version: VOCAB_DOMAIN_VERSION,
        meta: domain.meta,
        organization: domain.organization,
        items: mergedItems,
      });
      showToast(`Import OK — ${stats?.added || 0} nouveau(x), ${stats?.updated || 0} mis à jour`);
      setImportPreview(null);
      setPasteJson('');
      setShowJsonImport(false);
      if (refresh) await refresh();
    } catch (err) {
      showToast(`Erreur d'import: ${err.message}`, 'error');
    }
  };

  const activeTabLabel = tabs.find(t => t.id === activeOrgTab);

  return (
    <div className="mt-5 pt-5 border-t border-[#f1f3f4]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-[#202124]">
            Mots — {getLabel(activeTabLabel?.label) || activeOrgTab}
          </h3>
          <p className="text-[12px] text-[#9aa0a6] mt-0.5">{filtered.length} mot{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-[#202124] font-semibold text-[13px] hover:bg-[#f1f3f4]"
            title="Copier un modèle JSON avec categoryId et tab préremplis"
          >
            {copied ? <Check className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié' : 'Copier modèle'}
          </button>
          <button
            type="button"
            onClick={() => setShowJsonImport(v => !v)}
            className={`inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border font-semibold text-[13px] ${
              showJsonImport
                ? 'bg-[#E8F0FE] border-[#1a73e8]/40 text-[#1967D2]'
                : 'bg-white border-[#dadce0] text-[#202124] hover:bg-[#f1f3f4]'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            Importer JSON
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showJsonImport ? 'rotate-180' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => { setEditItem(null); setShowForm(true); }}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white font-semibold text-[13px] hover:bg-[#1b66c9] shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter un mot
          </button>
        </div>
      </div>

      {showJsonImport && (
        <div className="mb-4 rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-4 space-y-3">
          <div>
            <p className="text-[13px] font-semibold text-[#202124]">JSON pour cette catégorie</p>
            <p className="text-[12px] text-[#5f6368] mt-0.5">
              Les mots seront importés dans <code className="bg-white px-1 rounded text-[11px]">{categoryId}</code>
              {' · '}onglet <code className="bg-white px-1 rounded text-[11px]">{activeOrgTab}</code>
              {' '}(forcé à l’import). Copiez le modèle, éditez-le, puis collez-le ici.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold hover:bg-[#f1f3f4]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#137333]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié' : 'Copier modèle'}
            </button>
            <label className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold hover:bg-[#f1f3f4] cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Fichier .json
              <input type="file" accept=".json,application/json" onChange={handleImportSelect} className="hidden" />
            </label>
          </div>
          <textarea
            value={pasteJson}
            onChange={(e) => setPasteJson(e.target.value)}
            placeholder={`{\n  "items": [\n    { "id": "…", "fr": "…", "en": "…", "mg": "…", "categoryId": "${categoryId}", "tab": "${activeOrgTab}" }\n  ]\n}`}
            rows={7}
            className="w-full rounded-xl border border-[#dadce0] bg-white px-3 py-2 text-[12px] font-mono text-[#202124] outline-none focus:border-[#1a73e8] resize-y"
          />
          <button
            type="button"
            onClick={handlePasteImport}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
          >
            <ClipboardPaste className="w-4 h-4" />
            Importer le texte collé
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrer dans cet onglet…"
            className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[13px]"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#e8eaed]">
              <span className="sr-only">Effacer</span>
              ×
            </button>
          )}
        </div>
        <div className="inline-flex p-0.5 rounded-xl bg-[#f1f3f4]">
          <button type="button" onClick={() => setView('list')} className={`w-9 h-9 rounded-lg flex items-center justify-center ${view === 'list' ? 'bg-white shadow-sm text-[#1a73e8]' : 'text-[#5f6368]'}`}>
            <List className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setView('grid')} className={`w-9 h-9 rounded-lg flex items-center justify-center ${view === 'grid' ? 'bg-white shadow-sm text-[#1a73e8]' : 'text-[#5f6368]'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucun mot dans cet onglet"
          text="Ajoutez un mot ou importez un JSON — catégorie et onglet seront pré-remplis."
          action={
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => { setEditItem(null); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
              >
                <Plus className="w-4 h-4" /> Ajouter un mot
              </button>
              <button
                type="button"
                onClick={() => setShowJsonImport(true)}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-[#dadce0] text-[13px] font-semibold hover:bg-[#f1f3f4]"
              >
                <ClipboardPaste className="w-4 h-4" /> Importer JSON
              </button>
            </div>
          }
        />
      ) : view === 'list' ? (
        <div className="rounded-xl border border-[#dadce0] overflow-hidden">
          <ul className="divide-y divide-[#f1f3f4]">
            {filtered.map(item => {
              const img = itemImages[item.id];
              const typeClass = TYPE_COLORS[item.category] || 'bg-[#f1f3f4] text-[#5f6368]';
              return (
                <li key={item.id} className="group hover:bg-[#f8f9fa]/80 transition-colors">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => img ? setLightbox({ src: img, alt: item.fr }) : setImageItemId(item.id)}
                      className="w-11 h-11 rounded-xl overflow-hidden bg-[#f1f3f4] border border-[#dadce0]/80 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#1a73e8]/30"
                    >
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover cursor-zoom-in" />
                      ) : (
                        <ImageOff className="w-4 h-4 text-[#9aa0a6]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#202124] truncate">{item.fr}</p>
                      <p className="text-[12px] text-[#5f6368] truncate">{item.en} · {item.mg}</p>
                    </div>
                    {item.category && (
                      <span className={`hidden sm:inline text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${typeClass}`}>{item.category}</span>
                    )}
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => setImageItemId(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed]">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed]">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(item => {
            const img = itemImages[item.id];
            const typeClass = TYPE_COLORS[item.category] || 'bg-[#f1f3f4] text-[#5f6368]';
            return (
              <article key={item.id} className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl overflow-hidden flex flex-col">
                <button
                  type="button"
                  onClick={() => img ? setLightbox({ src: img, alt: item.fr }) : setImageItemId(item.id)}
                  className="relative aspect-[16/10] bg-[#f1f3f4] flex items-center justify-center group"
                >
                  {img ? (
                    <img src={img} alt={item.fr} className="w-full h-full object-cover cursor-zoom-in" />
                  ) : (
                    <ImageOff className="w-6 h-6 text-[#9aa0a6]" />
                  )}
                </button>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-medium truncate">{item.fr}</h4>
                      <p className="text-[12px] text-[#5f6368] truncate">{item.en} · {item.mg}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(item)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {item.category && <span className={`mt-2 self-start text-[10px] font-semibold px-2 py-0.5 rounded-md ${typeClass}`}>{item.category}</span>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showForm && (
        <VocabForm
          item={editItem}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          categories={categories}
          tabs={tabs}
          defaultCategoryId={categoryId}
          defaultTab={activeOrgTab}
          lockCategory={!editItem}
          lockTab={!editItem}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Supprimer ce mot ?"
          text={`« ${confirmDelete.fr} » (${confirmDelete.en}) sera définitivement supprimé.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete.id)}
          confirmText="Supprimer"
          danger
        />
      )}

      {imageItemId && (
        <ImageModal
          title={`Image — ${items.find(i => i.id === imageItemId)?.fr || imageItemId}`}
          currentImage={itemImages[imageItemId] || null}
          onSave={(b64) => handleImageSave(imageItemId, b64)}
          onDelete={() => handleImageDelete(imageItemId)}
          onClose={() => setImageItemId(null)}
        />
      )}

      {lightbox && (
        <FullscreenLightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {importPreview && (
        <ImportPreviewModal
          preview={importPreview}
          importMode={importMode}
          setImportMode={setImportMode}
          onCancel={() => setImportPreview(null)}
          onConfirm={executeImport}
          title="Importer dans cette catégorie"
          hideModePicker
        />
      )}
    </div>
  );
}
