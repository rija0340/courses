import React, { useEffect, useMemo, useState } from 'react';
import { coerceDisplayText } from '../../../data/vocabs/vocabItemStructure';

/**
 * Shared preview modal for vocab JSON import (items-only or full domain).
 * Supports excluding text duplicates (en/fr lowercase match) before confirm.
 */
export default function ImportPreviewModal({
  preview,
  importMode,
  setImportMode,
  onCancel,
  onConfirm,
  title = 'Importer JSON',
  hideModePicker = false,
}) {
  const { result, fileName, duplicates } = preview;
  const ok = result?.ok;
  const data = result?.data;
  const stats = result?.stats;
  const isItemsOnly = result?.importType === 'items_only';
  const showModePicker = !hideModePicker && !isItemsOnly;
  const items = data?.items || [];
  const itemCount = items.length;
  const groups = duplicates?.groups || [];
  const duplicateIndexes = useMemo(
    () => new Set(duplicates?.duplicateImportIndexes || []),
    [duplicates]
  );

  const [includedIndexes, setIncludedIndexes] = useState(() => new Set());

  useEffect(() => {
    if (!ok) return;
    const next = new Set();
    for (let index = 0; index < itemCount; index += 1) {
      if (!duplicateIndexes.has(index)) next.add(index);
    }
    setIncludedIndexes(next);
  }, [ok, itemCount, duplicateIndexes, fileName]);

  const existingById = useMemo(() => {
    const map = new Map();
    (duplicates?.currentItems || []).forEach((item) => {
      if (item?.id) map.set(item.id, item);
    });
    return map;
  }, [duplicates]);

  const includedCount = includedIndexes.size;
  const excludedDupes = [...duplicateIndexes].filter((i) => !includedIndexes.has(i)).length;

  const toggleInclude = (index) => {
    setIncludedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const excludeAllDuplicates = () => {
    setIncludedIndexes((prev) => {
      const next = new Set(prev);
      duplicateIndexes.forEach((i) => next.delete(i));
      return next;
    });
  };

  const includeAll = () => {
    setIncludedIndexes(new Set(items.map((_, i) => i)));
  };

  const handleConfirm = () => {
    const selectedItems = items.filter((_, index) => includedIndexes.has(index));
    onConfirm(selectedItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        <h3 className="font-semibold text-[16px] text-[#202124] mb-1">{title}</h3>
        <p className="text-[12px] text-[#9aa0a6] mb-1 truncate">{fileName}</p>
        {ok && (
          <p className="text-[12px] font-medium text-[#1967D2] mb-3">
            {isItemsOnly ? 'Import mots seulement' : 'Import complet du domaine'}
          </p>
        )}
        {!ok ? (
          <div className="mb-4">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[13px] mb-3">
              <ul className="list-disc pl-4 space-y-0.5">
                {(result.errors || []).map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
            <button type="button" onClick={onCancel} className="w-full h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px]">Fermer</button>
          </div>
        ) : (
          <>
            {stats && (
              <div className={`grid gap-2 mb-4 ${duplicates?.duplicateCount ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                <div className="rounded-xl bg-[#E6F4EA] p-2.5 text-center">
                  <p className="text-[18px] font-semibold tabular-nums text-[#137333]">{stats.added}</p>
                  <p className="text-[10px] font-semibold uppercase text-[#137333]">Nouveaux</p>
                </div>
                <div className="rounded-xl bg-[#E8F0FE] p-2.5 text-center">
                  <p className="text-[18px] font-semibold tabular-nums text-[#1967D2]">{stats.updated}</p>
                  <p className="text-[10px] font-semibold uppercase text-[#1967D2]">Mis à jour</p>
                </div>
                <div className="rounded-xl bg-[#f8f9fa] p-2.5 text-center">
                  <p className="text-[18px] font-semibold tabular-nums">{stats.total}</p>
                  <p className="text-[10px] font-semibold uppercase text-[#9aa0a6]">Dans le fichier</p>
                </div>
                {duplicates?.duplicateCount > 0 && (
                  <div className="rounded-xl bg-[#FCE8E6] p-2.5 text-center">
                    <p className="text-[18px] font-semibold tabular-nums text-[#C5221F]">{duplicates.duplicateCount}</p>
                    <p className="text-[10px] font-semibold uppercase text-[#C5221F]">Doublons texte</p>
                  </div>
                )}
              </div>
            )}

            {stats?.byTab && Object.keys(stats.byTab).length > 0 && (
              <div className="mb-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0]/60 p-3">
                <p className="text-[11px] font-semibold uppercase text-[#9aa0a6] mb-2">Répartition par onglet</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(stats.byTab).map(([tabId, count]) => (
                    <span
                      key={tabId}
                      className="inline-flex items-center gap-1 h-7 px-2 rounded-lg bg-white border border-[#dadce0] text-[12px] text-[#202124]"
                    >
                      <span className="font-medium">{tabId}</span>
                      <span className="tabular-nums text-[#5f6368]">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isItemsOnly && data?.organization && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-xl bg-[#f8f9fa] p-2.5 text-center">
                  <p className="text-[16px] font-semibold tabular-nums">{data.organization.tabs?.length || 0}</p>
                  <p className="text-[10px] font-semibold uppercase text-[#9aa0a6]">Onglets</p>
                </div>
                <div className="rounded-xl bg-[#f8f9fa] p-2.5 text-center">
                  <p className="text-[16px] font-semibold tabular-nums">{data.organization.categories?.length || 0}</p>
                  <p className="text-[10px] font-semibold uppercase text-[#9aa0a6]">Cat. racine</p>
                </div>
              </div>
            )}

            {(result.warnings || []).length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-[#FEF7E0] border border-[#F9AB00]/40 text-[#E37400] text-[12px] max-h-32 overflow-y-auto">
                <p className="font-semibold mb-1">{result.warnings.length} avertissement(s)</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {result.warnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {groups.length > 0 && (
              <div className="mb-4 rounded-xl border border-[#F9AB00]/50 bg-[#FEF7E0]/60 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-[13px] font-semibold text-[#202124]">Doublons EN/FR</p>
                    <p className="text-[11px] text-[#5f6368] mt-0.5">
                      Correspondance exacte (minuscules) sur en ou fr. Décochés par défaut.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={excludeAllDuplicates}
                      className="h-7 px-2 rounded-lg bg-white border border-[#dadce0] text-[11px] font-semibold text-[#5f6368] hover:bg-[#f1f3f4]"
                    >
                      Exclure tous les doublons
                    </button>
                    <button
                      type="button"
                      onClick={includeAll}
                      className="h-7 px-2 rounded-lg bg-white border border-[#dadce0] text-[11px] font-semibold text-[#5f6368] hover:bg-[#f1f3f4]"
                    >
                      Tout inclure
                    </button>
                  </div>
                </div>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {groups.map((group) => (
                    <li key={group.key} className="rounded-lg bg-white border border-[#dadce0]/80 p-2.5">
                      <p className="text-[12px] font-semibold text-[#202124] mb-1.5">
                        {group.field.toUpperCase()} « {group.value} »
                      </p>
                      {group.existingIds.length > 0 && (
                        <p className="text-[11px] text-[#5f6368] mb-1.5">
                          Déjà en base :{' '}
                          {group.existingIds.map((id) => {
                            const ex = existingById.get(id);
                            return ex
                              ? `${coerceDisplayText(ex.en) || '—'} / ${coerceDisplayText(ex.fr) || '—'}`
                              : id;
                          }).join(' · ')}
                        </p>
                      )}
                      <div className="space-y-1">
                        {group.importedIndexes.map((index) => {
                          const item = items[index];
                          if (!item) return null;
                          return (
                            <label
                              key={`${group.key}-${index}`}
                              className="flex items-start gap-2 text-[12px] text-[#202124] cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={includedIndexes.has(index)}
                                onChange={() => toggleInclude(index)}
                                className="mt-0.5 w-3.5 h-3.5 rounded border-[#dadce0] text-[#1a73e8] focus:ring-[#1a73e8]"
                              />
                              <span>
                                Inclure « {coerceDisplayText(item.en) || '—'} » / « {coerceDisplayText(item.fr) || '—'} »
                                <span className="text-[#9aa0a6]"> · id {item.id || '?'}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showModePicker && (
              <div className="space-y-2 mb-5">
                {[
                  { id: 'merge', title: 'Fusionner (recommandé)', desc: 'Ajoute les nouveaux mots et met à jour ceux avec le même id. Conserve le reste.', danger: false },
                  { id: 'overwrite', title: 'Écraser tout', desc: 'Remplace meta, onglets, catégories et mots par le fichier.', danger: true },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      importMode === opt.id
                        ? opt.danger ? 'border-red-400 bg-red-50/60' : 'border-[#1a73e8] bg-[#E8F0FE]'
                        : 'border-[#dadce0] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <input type="radio" name="importMode" checked={importMode === opt.id} onChange={() => setImportMode(opt.id)} className="mt-1" />
                    <div>
                      <p className={`text-[14px] font-semibold ${opt.danger ? 'text-red-600' : 'text-[#202124]'}`}>{opt.title}</p>
                      <p className="text-[12px] text-[#5f6368] mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {isItemsOnly && (
              <p className="text-[13px] text-[#5f6368] mb-5 rounded-xl bg-[#f8f9fa] p-3 border border-[#dadce0]/60">
                Les mots existants seront conservés. Seuls les nouveaux ids seront ajoutés ; les ids déjà présents seront mis à jour.
                {groups.length > 0 && (
                  <> {includedCount} mot{includedCount !== 1 ? 's' : ''} seront importé{includedCount !== 1 ? 's' : ''}
                    {excludedDupes > 0 ? ` (${excludedDupes} doublon${excludedDupes !== 1 ? 's' : ''} exclu${excludedDupes !== 1 ? 's' : ''})` : ''}.
                  </>
                )}
              </p>
            )}

            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px]">Annuler</button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={includedCount === 0}
                className={`flex-1 h-11 rounded-xl text-white font-semibold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed ${
                  importMode === 'overwrite' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1a73e8] hover:bg-[#1b66c9]'
                }`}
              >
                Confirmer ({includedCount})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
