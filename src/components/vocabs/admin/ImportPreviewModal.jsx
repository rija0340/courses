import React from 'react';

/**
 * Shared preview modal for vocab JSON import (items-only or full domain).
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
  const { result, fileName } = preview;
  const ok = result?.ok;
  const data = result?.data;
  const stats = result?.stats;
  const isItemsOnly = result?.importType === 'items_only';
  const showModePicker = !hideModePicker && !isItemsOnly;

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
              <div className="grid grid-cols-3 gap-2 mb-4">
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
              </p>
            )}

            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px]">Annuler</button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 h-11 rounded-xl text-white font-semibold text-[13px] ${
                  importMode === 'overwrite' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1a73e8] hover:bg-[#1b66c9]'
                }`}
              >
                Confirmer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
