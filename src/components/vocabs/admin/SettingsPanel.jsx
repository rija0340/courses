import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, FileCode, Upload, Download, Copy, Check, ChevronsUpDown,
  RefreshCw, Database, HelpCircle
} from 'lucide-react';
import vocabStorage from '../../../services/vocabStorage';
import {
  buildExportPayload,
  buildImportTemplate,
  buildItemsOnlyImportTemplate,
  getSchemaFieldDocs,
  templateToPrettyJson,
  validateImportPayload,
  VOCAB_DOMAIN_VERSION,
} from '../../../data/vocabs/vocabDomainSchema';
import { checkSupabaseHealth } from '../../../services/supabaseHealth';
import TabEditor from './TabEditor';
import { Panel } from './shared';

function SupabaseConnectionPanel() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const runCheck = async () => {
    setLoading(true);
    try {
      const h = await checkSupabaseHealth();
      setHealth(h);
    } catch (err) {
      setHealth({
        configured: false,
        ready: false,
        canUploadImages: false,
        errors: [err.message],
        tables: {},
        storage: { ok: false },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runCheck(); }, []);

  const StatusDot = ({ ok }) => (
    <span className={`inline-block w-2 h-2 rounded-full ${ok ? 'bg-[#34A853]' : ok === false ? 'bg-[#EA4335]' : 'bg-[#9aa0a6]'}`} />
  );

  return (
    <Panel
      title="Connexion Supabase"
      icon={Database}
      action={
        <button
          type="button"
          onClick={runCheck}
          disabled={loading}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Vérifier
        </button>
      }
    >
      {loading && !health ? (
        <p className="text-[13px] text-[#9aa0a6]">Diagnostic en cours…</p>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl px-3 py-2.5 text-[13px] font-medium border ${
            health?.ready
              ? 'bg-[#E6F4EA] border-[#34A853]/30 text-[#137333]'
              : 'bg-[#FCE8E6] border-red-200 text-[#C5221F]'
          }`}>
            {health?.ready
              ? (health.canUploadImages
                ? 'Prêt — DB + Storage OK, session active (upload images possible).'
                : 'DB OK — connectez-vous pour pouvoir uploader des images.')
              : 'Pas prêt — suivez les étapes ci-dessous.'}
          </div>
          <ul className="space-y-1.5 text-[12px] text-[#3c4043]">
            <li className="flex items-center gap-2">
              <StatusDot ok={health?.configured} />
              Provider: <code className="bg-[#f1f3f4] px-1 rounded">{health?.provider || '—'}</code>
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={!!health?.session} />
              Session: {health?.session?.email || 'non connecté'}
            </li>
            {Object.entries(health?.tables || {}).map(([name, ok]) => (
              <li key={name} className="flex items-center gap-2">
                <StatusDot ok={ok} />
                Table <code className="bg-[#f1f3f4] px-1 rounded">{name}</code>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <StatusDot ok={health?.storage?.ok} />
              Bucket <code className="bg-[#f1f3f4] px-1 rounded">vocab-images</code>
            </li>
          </ul>
          {(health?.errors || []).length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[12px] text-red-700 space-y-1">
              {health.errors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function ImportPreviewModal({ preview, importMode, setImportMode, onCancel, onConfirm }) {
  const { result, fileName } = preview;
  const ok = result?.ok;
  const data = result?.data;
  const stats = result?.stats;
  const isItemsOnly = result?.importType === 'items_only';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        <h3 className="font-semibold text-[16px] text-[#202124] mb-1">Importer JSON</h3>
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

            {!isItemsOnly && (
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

export default function SettingsPanel({ domain, updateMeta, updateOrganization, showToast, refresh }) {
  const [meta, setMeta] = useState(domain?.meta || { title: { fr: '', en: '', mg: '' }, description: { fr: '', en: '', mg: '' } });
  const [org, setOrg] = useState(domain?.organization || { tabs: [], categories: [] });
  const [dirty, setDirty] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('merge');
  const [showFields, setShowFields] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  const schemaDocs = useMemo(() => getSchemaFieldDocs(), []);
  const templateJson = useMemo(() => templateToPrettyJson(domain), [domain]);
  const items = domain?.items || [];

  useEffect(() => {
    if (domain) {
      setMeta(domain.meta || { title: { fr: '', en: '', mg: '' }, description: { fr: '', en: '', mg: '' } });
      setOrg(domain.organization || { tabs: [], categories: [] });
      setDirty(false);
    }
  }, [domain]);

  const handleMetaChange = (field, l, value) => {
    setMeta(prev => ({ ...prev, [field]: { ...(prev[field] || {}), [l]: value } }));
    setDirty(true);
  };

  const handleTabsChange = (tabs) => {
    setOrg(prev => ({ ...prev, tabs }));
    setDirty(true);
  };

  const handleSave = async () => {
    await updateMeta(meta);
    await updateOrganization(org);
    setDirty(false);
    showToast('Paramètres sauvegardés');
  };

  const downloadJson = (payload, filename) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleExport = async () => {
    try {
      const data = await vocabStorage.exportAll(domain.id);
      downloadJson(buildExportPayload(data), `${domain.id}-vocabs.json`);
      showToast('Export réussi');
    } catch (err) {
      showToast(`Erreur d'export: ${err.message}`, 'error');
    }
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(templateJson);
      setCopied(true);
      showToast('Modèle copié');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    const tpl = buildImportTemplate(domain);
    const { _comment, ...clean } = tpl;
    downloadJson(clean, `${domain.id || 'domain'}-import-template.json`);
    showToast('Modèle téléchargé');
  };

  const handleDownloadItemsTemplate = () => {
    const tpl = buildItemsOnlyImportTemplate(domain);
    const { _comment, ...clean } = tpl;
    downloadJson(clean, `${domain.id || 'domain'}-items-only-template.json`);
    showToast('Modèle mots seulement téléchargé');
  };

  const handleImportSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const result = validateImportPayload(parsed, domain);
        setImportPreview({ raw: parsed, result, fileName: file.name });
        setImportMode(result.importType === 'items_only' ? 'merge' : 'merge');
        if (!result.ok) showToast(result.errors[0] || 'JSON invalide', 'error');
      } catch (err) {
        showToast(`JSON invalide: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const mergeItems = (currentItems, importedItems) => {
    const mergedItems = [...currentItems];
    importedItems.forEach(item => {
      const idx = mergedItems.findIndex(i => i.id === item.id);
      if (idx !== -1) mergedItems[idx] = { ...mergedItems[idx], ...item };
      else mergedItems.push(item);
    });
    return mergedItems;
  };

  const executeImport = async () => {
    if (!importPreview?.result?.ok || !importPreview.result.data) return;
    const { data, importType, stats } = importPreview.result;
    try {
      if (importType === 'items_only') {
        const mergedItems = mergeItems(domain.items || [], data.items);
        await vocabStorage.saveDomain(domain.id, {
          version: VOCAB_DOMAIN_VERSION,
          meta: domain.meta,
          organization: domain.organization,
          items: mergedItems,
        });
        showToast(`Import OK — ${stats?.added || 0} nouveau(x), ${stats?.updated || 0} mis à jour`);
      } else if (importMode === 'overwrite') {
        await vocabStorage.saveDomain(domain.id, data);
        showToast(`Import OK — ${data.items.length} mots (écrasement)`);
      } else {
        const mergedItems = mergeItems(domain.items || [], data.items);
        const tabMap = new Map((domain.organization?.tabs || []).map(t => [t.id, t]));
        (data.organization.tabs || []).forEach(t => {
          tabMap.set(t.id, { ...(tabMap.get(t.id) || {}), ...t, label: { ...(tabMap.get(t.id)?.label || {}), ...t.label } });
        });
        await vocabStorage.saveDomain(domain.id, {
          version: VOCAB_DOMAIN_VERSION,
          meta: {
            title: { ...(domain.meta?.title || {}), ...data.meta.title },
            description: { ...(domain.meta?.description || {}), ...data.meta.description },
          },
          organization: {
            tabs: Array.from(tabMap.values()),
            categories: data.organization.categories?.length
              ? data.organization.categories
              : (domain.organization?.categories || []),
          },
          items: mergedItems,
        });
        showToast(`Fusion OK — ${stats?.added || 0} nouveau(x), ${stats?.updated || 0} mis à jour`);
      }
      setImportPreview(null);
      if (refresh) await refresh();
    } catch (err) {
      showToast(`Erreur d'import: ${err.message}`, 'error');
    }
  };

  return (
    <section className="pb-20">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-[#5f6368]">
          Métadonnées, onglets et import/export JSON.
        </p>
        {domain?.id && (
          <Link
            to={`/vocabs/${domain.id}/admin/guide`}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a73e8] hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guide admin — import & paramètres
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Panel title="Informations du domaine">
            <div className="space-y-4">
              {['title', 'description'].map(field => (
                <div key={field}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-2 block">
                    {field === 'title' ? 'Titre' : 'Description'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['fr', 'en', 'mg'].map(code => (
                      <input
                        key={code}
                        value={meta[field]?.[code] || ''}
                        onChange={e => handleMetaChange(field, code, e.target.value)}
                        placeholder={code.toUpperCase()}
                        className="h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[13px] outline-none"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Onglets du domaine">
            <p className="text-[12px] text-[#5f6368] mb-3">
              L’ordre des onglets ici est reflété dans le front et l’admin catégories.
            </p>
            <TabEditor
              tabs={org.tabs || []}
              onChange={handleTabsChange}
              items={items}
              showReorder
            />
          </Panel>
        </div>

        <div className="space-y-4">
          <SupabaseConnectionPanel />

          <Panel
            title="Import / Export JSON"
            icon={FileCode}
            action={
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#E8F0FE] text-[#1967D2]">
                schéma v{VOCAB_DOMAIN_VERSION}
              </span>
            }
          >
            <div className="rounded-xl border border-[#E8F0FE] bg-[#E8F0FE]/40 p-3.5 mb-3 text-[13px] text-[#1967D2] leading-relaxed">
              <p className="font-semibold mb-1">Ajouter des mots sans tout réimporter</p>
              <p className="text-[#3c4043]">
                Téléchargez le modèle <strong>Mots seulement</strong>, remplissez le tableau <code className="bg-white/80 px-1 rounded text-[12px]">items</code>, puis importez.
                Les mots existants sont conservés — même <code className="bg-white/80 px-1 rounded text-[12px]">id</code> = mise à jour, nouvel <code className="bg-white/80 px-1 rounded text-[12px]">id</code> = ajout.
              </p>
            </div>

            <div className="rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-3.5 mb-3">
              <p className="text-[12px] font-semibold text-[#202124] mb-2">Modèles JSON</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleDownloadItemsTemplate} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1a73e8] text-white text-[12px] font-semibold hover:bg-[#1b66c9]">
                  <Download className="w-3.5 h-3.5" /> Mots seulement
                </button>
                <button type="button" onClick={handleDownloadTemplate} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold hover:bg-[#f1f3f4]">
                  <Download className="w-3.5 h-3.5" /> Modèle complet
                </button>
                <button type="button" onClick={handleCopyTemplate} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold hover:bg-[#f1f3f4]">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copié' : 'Copier complet'}
                </button>
                <button type="button" onClick={() => setShowTemplate(v => !v)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#1a73e8] hover:bg-[#E8F0FE]">
                  <ChevronsUpDown className="w-3.5 h-3.5" />
                  {showTemplate ? 'Masquer' : 'Aperçu complet'}
                </button>
              </div>
              {showTemplate && (
                <pre className="mt-3 max-h-56 overflow-auto rounded-xl bg-[#202124] text-[#E8EAED] text-[11px] p-3 font-mono">
                  {templateJson}
                </pre>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFields(v => !v)}
              className="w-full flex items-center justify-between h-10 px-3 rounded-xl border border-[#dadce0] text-[12px] font-semibold text-[#5f6368] hover:bg-[#f8f9fa] mb-3"
            >
              <span>Champs du schéma (items)</span>
              <ChevronsUpDown className="w-3.5 h-3.5" />
            </button>
            {showFields && (
              <div className="mb-3 rounded-xl border border-[#dadce0] overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-[#f8f9fa] text-[#9aa0a6]">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Champ</th>
                      <th className="px-3 py-2 font-semibold">Req.</th>
                      <th className="px-3 py-2 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f3f4]">
                    {schemaDocs.items.map(f => (
                      <tr key={f.key}>
                        <td className="px-3 py-2 font-mono text-[#1967D2]">{f.key}</td>
                        <td className="px-3 py-2">{f.required ? 'oui' : '—'}</td>
                        <td className="px-3 py-2 text-[#5f6368]">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button type="button" onClick={handleExport} className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[#dadce0] text-[13px] font-semibold hover:bg-[#f8f9fa]">
                <Download className="w-4 h-4" /> Exporter
              </button>
              <label className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#1a73e8] text-[13px] font-semibold text-white hover:bg-[#1b66c9] cursor-pointer">
                <Upload className="w-4 h-4" /> Importer
                <input type="file" accept=".json,application/json" onChange={handleImportSelect} className="hidden" />
              </label>
            </div>
          </Panel>
        </div>
      </div>

      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-200 ${dirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-[#1a73e8] text-white font-semibold text-[14px] shadow-lg shadow-[#1a73e8]/30 hover:bg-[#1b66c9]"
        >
          <Save className="w-4 h-4" />
          Enregistrer les modifications
        </button>
      </div>

      {importPreview && (
        <ImportPreviewModal
          preview={importPreview}
          importMode={importMode}
          setImportMode={setImportMode}
          onCancel={() => setImportPreview(null)}
          onConfirm={executeImport}
        />
      )}
    </section>
  );
}
