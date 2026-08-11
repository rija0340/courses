import React, { useEffect, useMemo, useState } from 'react';
import {
  Check, ChevronDown, ClipboardPaste, Copy, Download, Upload
} from 'lucide-react';
import vocabStorage from '../../../services/vocabStorage';
import {
  buildExportPayload,
  categoryItemsTemplateToPrettyJson,
  downloadJsonFile,
  downloadTextFile,
  filterItemsForDataScope,
  findTextDuplicates,
  isItemsOnlyImport,
  itemsToCsv,
  mergeVocabItems,
  pickItemFields,
  validateItemsOnlyImport,
  VOCAB_DOMAIN_VERSION,
} from '../../../data/vocabs/vocabDomainSchema';
import ImportPreviewModal from './ImportPreviewModal';

const SCOPES = [
  { id: 'tab', label: 'Cet onglet' },
  { id: 'category', label: 'Tous les onglets' },
  { id: 'domain', label: 'Tout le domaine' },
];

function scopeToTemplateMode(scope) {
  if (scope === 'domain') return 'domain';
  if (scope === 'category') return 'all-tabs';
  return 'single-tab';
}

function scopeFilenamePart(scope, categoryId, tab) {
  if (scope === 'domain') return 'domaine';
  if (scope === 'category') return `cat-${categoryId || 'sans-id'}`;
  return `cat-${categoryId || 'sans-id'}-tab-${tab || 'sans-tab'}`;
}

export default function CategoryDataTransfer({
  domain,
  items,
  categoryId,
  activeOrgTab,
  tabs,
  getLabel,
  showToast,
  refresh,
}) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState('category');
  const [pasteJson, setPasteJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('merge');

  useEffect(() => {
    setPasteJson('');
    setImportPreview(null);
  }, [categoryId, activeOrgTab, scope]);

  const activeTabMeta = tabs.find((t) => t.id === activeOrgTab);
  const activeTabLabel = getLabel?.(activeTabMeta?.label) || activeOrgTab || '—';

  const scopedItems = useMemo(
    () => filterItemsForDataScope(items || domain?.items || [], {
      scope,
      categoryId,
      tab: activeOrgTab,
    }),
    [items, domain?.items, scope, categoryId, activeOrgTab]
  );

  const templateScope = useMemo(
    () => ({
      categoryId,
      tab: activeOrgTab,
      mode: scopeToTemplateMode(scope),
    }),
    [categoryId, activeOrgTab, scope]
  );

  const scopeHint = useMemo(() => {
    if (scope === 'domain') {
      return 'Import / export de tous les mots du domaine. tab et categoryId doivent exister.';
    }
    if (scope === 'category') {
      return `Tous les onglets de cette catégorie. categoryId forcé sur « ${categoryId} » ; le champ tab est conservé.`;
    }
    return `Uniquement l’onglet « ${activeTabLabel} ». categoryId et tab sont forcés à l’import.`;
  }, [scope, categoryId, activeTabLabel]);

  const handleCopyTemplate = async () => {
    const json = categoryItemsTemplateToPrettyJson(domain, templateScope);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      showToast('Modèle JSON copié');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier', 'error');
    }
  };

  const validationOptions = useMemo(() => {
    if (scope === 'tab') {
      return {
        forceCategoryId: categoryId,
        forceTab: activeOrgTab,
        strictTabs: true,
        strictCategoryIds: true,
      };
    }
    if (scope === 'category') {
      return {
        forceCategoryId: categoryId,
        strictTabs: true,
        strictCategoryIds: true,
      };
    }
    return {
      strictTabs: true,
      strictCategoryIds: true,
    };
  }, [scope, categoryId, activeOrgTab]);

  const processImportText = (text, sourceLabel) => {
    try {
      const parsed = JSON.parse(text);
      if (!isItemsOnlyImport(parsed)) {
        showToast('Utilisez un JSON { "items": [...] }', 'error');
        return;
      }
      const result = validateItemsOnlyImport(parsed, domain, validationOptions);
      const currentItems = domain?.items || items || [];
      const duplicates = result.ok
        ? {
            ...findTextDuplicates(result.data?.items || [], currentItems),
            currentItems,
          }
        : null;
      setImportPreview({ raw: parsed, result, fileName: sourceLabel, duplicates });
      setImportMode('merge');
      if (!result.ok) showToast(result.errors[0] || 'JSON invalide', 'error');
      else if (duplicates?.duplicateCount > 0) {
        showToast(`${duplicates.duplicateCount} doublon(s) EN/FR détecté(s) — vérifiez avant d’importer`);
      }
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

  const executeImport = async (selectedItems) => {
    if (!importPreview?.result?.ok || !importPreview.result.data || !domain?.id) return;
    const toImport = Array.isArray(selectedItems)
      ? selectedItems
      : (importPreview.result.data.items || []);
    if (toImport.length === 0) {
      showToast('Aucun mot à importer', 'error');
      return;
    }
    try {
      const mergedItems = mergeVocabItems(domain.items || items || [], toImport);
      const currentIds = new Set((domain.items || items || []).map((i) => i.id));
      let added = 0;
      let updated = 0;
      toImport.forEach((item) => {
        if (currentIds.has(item.id)) updated += 1;
        else added += 1;
      });
      await vocabStorage.saveDomain(domain.id, {
        version: VOCAB_DOMAIN_VERSION,
        meta: domain.meta,
        organization: domain.organization,
        items: mergedItems,
      });
      showToast(`Import OK — ${added} nouveau(x), ${updated} mis à jour`);
      setImportPreview(null);
      setPasteJson('');
      if (refresh) await refresh();
    } catch (err) {
      showToast(`Erreur d'import: ${err.message}`, 'error');
    }
  };

  const fileStem = `${domain?.id || 'vocabs'}-${scopeFilenamePart(scope, categoryId, activeOrgTab)}`;

  const handleExportCsv = () => {
    const csv = itemsToCsv(scopedItems);
    downloadTextFile(csv, `${fileStem}.csv`, 'text/csv;charset=utf-8');
    showToast(`CSV exporté — ${scopedItems.length} mot(s)`);
  };

  const handleExportJson = () => {
    if (scope === 'domain') {
      downloadJsonFile(buildExportPayload(domain), `${fileStem}.json`);
    } else {
      downloadJsonFile(
        { items: scopedItems.map(pickItemFields) },
        `${fileStem}-items.json`
      );
    }
    showToast(`JSON exporté — ${scopedItems.length} mot(s)`);
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#f1f3f4]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 h-11 px-3.5 rounded-xl border text-left transition-colors ${
          open
            ? 'bg-[#E8F0FE] border-[#1a73e8]/40 text-[#1967D2]'
            : 'bg-[#f8f9fa] border-[#dadce0] text-[#202124] hover:bg-[#f1f3f4]'
        }`}
      >
        <span className="text-[13px] font-semibold">Import / Export JSON & CSV</span>
        <span className="inline-flex items-center gap-2 text-[12px] text-[#5f6368]">
          <span className="tabular-nums">{scopedItems.length} mot{scopedItems.length !== 1 ? 's' : ''}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-[#dadce0] bg-white p-4 space-y-4">
          <div>
            <p className="text-[12px] font-semibold text-[#202124] mb-2">Portée</p>
            <div className="flex flex-wrap gap-2">
              {SCOPES.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id)}
                  className={`h-9 px-3 rounded-xl text-[12px] font-semibold transition-all ${
                    scope === opt.id
                      ? 'bg-[#E8F0FE] text-[#1967D2] ring-1 ring-[#1a73e8]/30'
                      : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                  }`}
                >
                  {opt.label}
                  {opt.id === 'tab' ? ` · ${activeTabLabel}` : ''}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-[#5f6368] mt-2 leading-relaxed">{scopeHint}</p>
          </div>

          <div className="rounded-xl border border-[#dadce0]/80 bg-[#f8f9fa] p-3.5 space-y-3">
            <p className="text-[12px] font-semibold text-[#202124]">Importer (JSON)</p>
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
              placeholder='{ "items": [ ... ] }'
              rows={7}
              className="w-full rounded-xl border border-[#dadce0] bg-white px-3 py-2 text-[12px] font-mono text-[#202124] outline-none focus:border-[#1a73e8] resize-y"
            />
            <button
              type="button"
              onClick={handlePasteImport}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
            >
              <ClipboardPaste className="w-4 h-4" />
              Valider et prévisualiser
            </button>
          </div>

          <div className="rounded-xl border border-[#dadce0]/80 bg-[#f8f9fa] p-3.5 space-y-3">
            <p className="text-[12px] font-semibold text-[#202124]">
              Exporter · {scopedItems.length} mot{scopedItems.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1a73e8] text-white text-[12px] font-semibold hover:bg-[#1b66c9]"
              >
                <Download className="w-3.5 h-3.5" />
                CSV (Excel)
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold hover:bg-[#f1f3f4]"
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {importPreview && (
        <ImportPreviewModal
          preview={importPreview}
          importMode={importMode}
          setImportMode={setImportMode}
          onCancel={() => setImportPreview(null)}
          onConfirm={executeImport}
          title="Importer JSON"
          hideModePicker
        />
      )}
    </div>
  );
}
