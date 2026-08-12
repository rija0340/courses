import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Trash2, Pencil, Search, Image as ImageIcon, ImageOff,
  LayoutGrid, List, BookOpen, Copy, Check
} from 'lucide-react';
import VocabForm from '../VocabForm';
import vocabStorage from '../../../services/vocabStorage';
import { filterVocabItems } from '../../../utils/vocabFilters';
import { itemsToEnFrTsv } from '../../../data/vocabs/vocabDomainSchema';
import {
  structureFieldLabel,
  summarizeListField,
  pickI18nText,
  fieldHasContent,
} from '../../../data/vocabs/vocabItemStructure';
import { EmptyState, ConfirmModal, ImageModal } from './shared';
import FullscreenLightbox from '../FullscreenLightbox';

export default function CategoryItemsPanel({
  items,
  categories,
  tabs,
  categoryId,
  activeOrgTab,
  itemStructure = null,
  domainId,
  addItem,
  updateItem,
  deleteItem,
  deleteItems,
  showToast,
  getLabel,
}) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [copied, setCopied] = useState(false);
  const [itemImages, setItemImages] = useState({});
  const [imageItemId, setImageItemId] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [categoryId, activeOrgTab, search]);

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

  const filteredIds = useMemo(() => filtered.map((i) => i.id), [filtered]);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someFilteredSelected = filteredIds.some((id) => selectedIds.has(id));

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filteredIds));
  };

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
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast('Mot supprimé');
      setConfirmDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    try {
      if (deleteItems) {
        await deleteItems(ids);
      } else {
        for (const id of ids) {
          await deleteItem(id);
        }
      }
      showToast(`${ids.length} mot${ids.length !== 1 ? 's' : ''} supprimé${ids.length !== 1 ? 's' : ''}`);
      setSelectedIds(new Set());
      setConfirmBulkDelete(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCopyEnFr = async (mode = 'auto') => {
    const source = mode === 'all' || selectedIds.size === 0
      ? filtered
      : filtered.filter((item) => selectedIds.has(item.id));
    if (source.length === 0) {
      showToast('Aucun mot à copier', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(itemsToEnFrTsv(source));
      setCopied(true);
      showToast(`${source.length} mot${source.length !== 1 ? 's' : ''} copié${source.length !== 1 ? 's' : ''} (EN/FR)`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier', 'error');
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

  const activeTabLabel = tabs.find(t => t.id === activeOrgTab);
  const selectedCount = selectedIds.size;
  const structured = Boolean(itemStructure);
  const structureFields = itemStructure?.fields || [];
  const headLangs = itemStructure?.langs || [];

  const cellValue = (item, fieldDef) => {
    if (!fieldDef) return '';
    if (fieldDef.type === 'list') {
      return summarizeListField(item[fieldDef.id], fieldDef.translate);
    }
    if (fieldDef.translate) return pickI18nText(item[fieldDef.id], 'en');
    return item[fieldDef.id] || '';
  };

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
            onClick={() => handleCopyEnFr(selectedCount > 0 ? 'selected' : 'all')}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-white border border-[#dadce0] text-[#202124] font-semibold text-[13px] hover:bg-[#f1f3f4]"
            title={selectedCount > 0 ? 'Copier la sélection (EN/FR)' : 'Copier tous les mots de cet onglet (EN/FR)'}
          >
            {copied ? <Check className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4" />}
            {selectedCount > 0 ? `Copier (${selectedCount})` : 'Copier EN/FR'}
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

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrer…"
            className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[13px]"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#e8eaed]">
              ×
            </button>
          )}
        </div>
        {!structured && (
          <div className="inline-flex p-0.5 rounded-xl bg-[#f1f3f4]">
            <button type="button" onClick={() => setView('list')} className={`w-9 h-9 rounded-lg flex items-center justify-center ${view === 'list' ? 'bg-white shadow-sm text-[#1a73e8]' : 'text-[#5f6368]'}`}>
              <List className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setView('grid')} className={`w-9 h-9 rounded-lg flex items-center justify-center ${view === 'grid' ? 'bg-white shadow-sm text-[#1a73e8]' : 'text-[#5f6368]'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="sticky top-0 z-10 mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#1a73e8]/30 bg-[#E8F0FE] px-3 py-2">
          <span className="text-[13px] font-semibold text-[#1967D2] tabular-nums">
            {selectedCount} sélectionné{selectedCount !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => handleCopyEnFr('selected')}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-white border border-[#dadce0] text-[12px] font-semibold text-[#202124] hover:bg-[#f1f3f4]"
          >
            <Copy className="w-3.5 h-3.5" />
            Copier EN/FR
          </button>
          <button
            type="button"
            onClick={() => setConfirmBulkDelete(true)}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-red-50 border border-red-200 text-[12px] font-semibold text-red-600 hover:bg-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="inline-flex items-center h-8 px-2.5 rounded-lg text-[12px] font-semibold text-[#5f6368] hover:bg-white/80"
          >
            Désélectionner
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucun mot"
          text="Ajoutez un mot, ou importez via JSON / CSV."
          action={
            <button
              type="button"
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
            >
              <Plus className="w-4 h-4" /> Ajouter un mot
            </button>
          }
        />
      ) : structured ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-[#dadce0] overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                <tr>
                  <th className="px-3 py-2 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => { if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected; }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8]"
                    />
                  </th>
                  <th className="px-3 py-2 font-semibold text-[#5f6368]">EN</th>
                  {headLangs.map((l) => (
                    <th key={l} className="px-3 py-2 font-semibold text-[#5f6368] uppercase">{l}</th>
                  ))}
                  {structureFields.map((f) => (
                    <th key={f.id} className="px-3 py-2 font-semibold text-[#5f6368]">
                      {structureFieldLabel(f, 'fr')}
                    </th>
                  ))}
                  <th className="px-3 py-2 w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                {filtered.map((item) => (
                  <tr key={item.id} className={selectedIds.has(item.id) ? 'bg-[#E8F0FE]/40' : 'hover:bg-[#f8f9fa]'}>
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8]"
                      />
                    </td>
                    <td className="px-3 py-2.5 font-medium text-[#202124]">{item.en}</td>
                    {headLangs.map((l) => (
                      <td key={l} className="px-3 py-2.5 text-[#3c4043]">{item[l] || '—'}</td>
                    ))}
                    {structureFields.map((f) => (
                      <td key={f.id} className="px-3 py-2.5 text-[#3c4043] max-w-[160px] truncate">
                        {cellValue(item, f) || '—'}
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1 justify-end">
                        <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-8 h-8 rounded-lg hover:bg-[#e8eaed] flex items-center justify-center text-[#5f6368]">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(item)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className={`rounded-xl border p-4 ${selectedIds.has(item.id) ? 'border-[#1a73e8]/40 bg-[#E8F0FE]/30' : 'border-[#dadce0] bg-white'}`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 mt-1 rounded border-[#dadce0] text-[#1a73e8]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-semibold text-[#202124]">{item.en}</p>
                    {headLangs.map((l) => item[l] ? (
                      <p key={l} className="text-[13px] text-[#5f6368]">
                        <span className="uppercase text-[10px] font-bold text-[#9aa0a6] mr-1">{l}</span>
                        {item[l]}
                      </p>
                    ) : null)}
                  </div>
                  <div className="flex gap-0.5">
                    <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-9 h-9 rounded-lg hover:bg-[#f1f3f4] flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-[#5f6368]" />
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(item)} className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 border-t border-[#f1f3f4] pt-3">
                  {structureFields.filter((f) => fieldHasContent(item, f)).map((f) => (
                    <div key={f.id}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">
                        {structureFieldLabel(f, 'fr')}
                      </p>
                      <p className="text-[13px] text-[#3c4043]">{cellValue(item, f)}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : view === 'list' ? (
        <div className="rounded-xl border border-[#dadce0] overflow-hidden">
          <div className="flex items-center gap-3 px-3 py-2 bg-[#f8f9fa] border-b border-[#dadce0]">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              ref={(el) => { if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected; }}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8]"
              aria-label="Tout sélectionner"
            />
            <button type="button" onClick={toggleSelectAll} className="text-[12px] font-semibold text-[#5f6368]">
              {allFilteredSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
          <ul className="divide-y divide-[#f1f3f4]">
            {filtered.map((item) => {
              const img = itemImages[item.id];
              const isSelected = selectedIds.has(item.id);
              return (
                <li key={item.id} className={`group ${isSelected ? 'bg-[#E8F0FE]/50' : 'hover:bg-[#f8f9fa]/80'}`}>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8]" />
                    <button type="button" onClick={() => (img ? setLightbox({ src: img, alt: item.fr || item.en }) : setImageItemId(item.id))} className="w-11 h-11 rounded-xl overflow-hidden bg-[#f1f3f4] border border-[#dadce0]/80 flex items-center justify-center shrink-0">
                      {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <ImageOff className="w-4 h-4 text-[#9aa0a6]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#202124] truncate">{item.en || item.fr}</p>
                      <p className="text-[12px] text-[#5f6368] truncate">{[item.fr, item.mg].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => setImageItemId(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed]"><ImageIcon className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed]"><Pencil className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => setConfirmDelete(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => {
            const img = itemImages[item.id];
            const isSelected = selectedIds.has(item.id);
            return (
              <article key={item.id} className={`border rounded-xl overflow-hidden ${isSelected ? 'bg-[#E8F0FE]/40 border-[#1a73e8]/40' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>
                <div className="p-3 flex items-start gap-2">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="w-4 h-4 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-medium truncate">{item.en || item.fr}</h4>
                    <p className="text-[12px] text-[#5f6368] truncate">{[item.fr, item.mg].filter(Boolean).join(' · ')}</p>
                  </div>
                  <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setConfirmDelete(item)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {img && <img src={img} alt="" className="w-full aspect-[16/10] object-cover" />}
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
          itemStructure={itemStructure}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Supprimer ce mot ?"
          text={`« ${confirmDelete.en || confirmDelete.fr || confirmDelete.id} » sera définitivement supprimé.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete.id)}
          confirmText="Supprimer"
          danger
        />
      )}

      {confirmBulkDelete && (
        <ConfirmModal
          title={`Supprimer ${selectedCount} mot${selectedCount !== 1 ? 's' : ''} ?`}
          text="Les mots sélectionnés seront définitivement supprimés."
          onCancel={() => setConfirmBulkDelete(false)}
          onConfirm={handleBulkDelete}
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
    </div>
  );
}
