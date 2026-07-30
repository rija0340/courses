import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, FileCode, Download,
  RefreshCw, Database, HelpCircle, Cpu, Activity, Sparkles
} from 'lucide-react';
import { runVocabIngest } from '../../../lib/ragClient';
import vocabStorage from '../../../services/vocabStorage';
import {
  buildExportPayload,
  downloadJsonFile,
  itemsToCsv,
  downloadTextFile,
  VOCAB_DOMAIN_VERSION,
} from '../../../data/vocabs/vocabDomainSchema';
import { checkSupabaseHealth } from '../../../services/supabaseHealth';
import { checkAiProvidersHealth } from '../../../practice/services/aiHealth';
import { LLM_PROVIDER, SPEECH_PROVIDER } from '../../../practice/config';
import { getAiUsage, resetAiUsage, totalCalls } from '../../../practice/services/aiUsage';
import TabEditor from './TabEditor';
import { Panel } from './shared';

const SETTINGS_TABS = [
  { id: 'domaine', label: 'Domaine' },
  { id: 'connexions', label: 'Connexions' },
  { id: 'consommation', label: 'Consommation IA' },
  { id: 'donnees', label: 'Données' }
];

function RagIngestPanel({ domainId }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (domainId !== 'medi-vocabs') {
    return (
      <Panel title="Index RAG (embeddings)" icon={Sparkles}>
        <p className="text-[13px] text-[#5f6368]">
          L’indexation embeddings (gte-small) est limitée à <code className="text-[12px] bg-[#f1f3f4] px-1 rounded">medi-vocabs</code> pour le moment.
        </p>
      </Panel>
    );
  }

  const handleIngest = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const data = await runVocabIngest(domainId);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Échec indexation');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title="Index RAG (embeddings EN)" icon={Sparkles}>
      <p className="text-[13px] text-[#5f6368] mb-3">
        Génère les vecteurs <code className="text-[12px] bg-[#f1f3f4] px-1 rounded">gte-small</code> (anglais uniquement)
        dans <code className="text-[12px] bg-[#f1f3f4] px-1 rounded">vocab_embeddings</code> pour le chatbot.
      </p>
      <button
        type="button"
        onClick={handleIngest}
        disabled={busy}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9] disabled:opacity-50"
      >
        {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {busy ? 'Indexation…' : 'Ré-indexer medi-vocabs'}
      </button>
      {error && (
        <p className="mt-3 text-[12px] text-red-600">{error}</p>
      )}
      {result && (
        <p className="mt-3 text-[12px] text-[#137333]">
          OK — {result.processed}/{result.total} traités
          {result.errorCount ? ` · ${result.errorCount} erreur(s)` : ''}
        </p>
      )}
    </Panel>
  );
}

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

function AiProvidersPanel() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const runCheck = async () => {
    setLoading(true);
    try {
      const h = await checkAiProvidersHealth();
      setHealth(h);
    } catch (err) {
      setHealth({
        ready: false,
        llm: { ok: false, message: err.message },
        stt: { ok: false, message: err.message },
        tts: { ok: false, message: err.message },
        errors: [err.message]
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
      title="Services IA (LLM / STT / TTS)"
      icon={Cpu}
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
              ? 'Services IA accessibles via la passerelle API.'
              : 'Un ou plusieurs services IA ne sont pas prêts.'}
          </div>
          <ul className="space-y-1.5 text-[12px] text-[#3c4043]">
            <li className="flex items-center gap-2">
              <StatusDot ok={LLM_PROVIDER === 'mock' ? null : health?.llm?.ok} />
              LLM: <code className="bg-[#f1f3f4] px-1 rounded">{LLM_PROVIDER}</code>
              {health?.llm?.message && <span className="text-[#9aa0a6]">— {health.llm.message}</span>}
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={SPEECH_PROVIDER === 'mock' ? null : health?.stt?.ok} />
              STT: <code className="bg-[#f1f3f4] px-1 rounded">{SPEECH_PROVIDER}</code>
              {health?.stt?.message && <span className="text-[#9aa0a6]">— {health.stt.message}</span>}
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={SPEECH_PROVIDER === 'mock' ? null : health?.tts?.ok} />
              TTS: <code className="bg-[#f1f3f4] px-1 rounded">{SPEECH_PROVIDER}</code>
              {health?.tts?.message && <span className="text-[#9aa0a6]">— {health.tts.message}</span>}
            </li>
            {health?.client?.gatewayUrl && (
              <li className="text-[#9aa0a6]">
                Passerelle: <code className="bg-[#f1f3f4] px-1 rounded">{health.client.gatewayUrl}</code>
              </li>
            )}
          </ul>
          {(LLM_PROVIDER === 'mock' || SPEECH_PROVIDER === 'mock') && (
            <p className="text-[12px] text-[#9aa0a6]">
              Mode mock actif côté client — configurez REACT_APP_LLM_PROVIDER=remote et REACT_APP_SPEECH_PROVIDER=remote pour utiliser Groq / Deepgram.
            </p>
          )}
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

function AiUsagePanel() {
  const [usage, setUsage] = useState(() => getAiUsage());

  useEffect(() => {
    const refresh = () => setUsage(getAiUsage());
    window.addEventListener('ai-usage-updated', refresh);
    const id = setInterval(refresh, 2000);
    return () => {
      window.removeEventListener('ai-usage-updated', refresh);
      clearInterval(id);
    };
  }, []);

  const rows = [
    { key: 'tts', label: 'TTS (parole)' },
    { key: 'stt', label: 'STT (transcription)' },
    { key: 'llmGenerate', label: 'LLM simulation (écoute)' },
    { key: 'llmWritten', label: 'LLM écrit / oral' },
    { key: 'llmQuiz', label: 'LLM quiz' }
  ];

  return (
    <Panel
      title="Consommation IA (session)"
      icon={Activity}
      action={
        <button
          type="button"
          onClick={() => { resetAiUsage(); setUsage(getAiUsage()); }}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed]"
        >
          Réinitialiser
        </button>
      }
    >
      <p className="text-[12px] text-[#5f6368] mb-3">
        Compteurs locaux pour cet onglet navigateur uniquement — pas la facturation Groq/Deepgram.
        Total appels : <strong className="tabular-nums">{totalCalls(usage)}</strong>
      </p>
      <div className="overflow-hidden rounded-xl border border-[#dadce0]">
        <table className="w-full text-[13px]">
          <thead className="bg-[#f8f9fa] text-[#9aa0a6] text-[11px] uppercase tracking-wider">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Service</th>
              <th className="text-right px-3 py-2 font-semibold">OK</th>
              <th className="text-right px-3 py-2 font-semibold">Échecs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f4]">
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="px-3 py-2 text-[#3c4043]">{row.label}</td>
                <td className="px-3 py-2 text-right tabular-nums text-[#137333] font-semibold">
                  {usage[row.key]?.ok || 0}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-[#C5221F] font-semibold">
                  {usage[row.key]?.fail || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(usage.tokens?.total > 0) && (
        <p className="mt-3 text-[12px] text-[#5f6368]">
          Tokens Groq estimés (session) : prompt {usage.tokens.prompt} · completion {usage.tokens.completion} · total {usage.tokens.total}
        </p>
      )}
      {(usage.errors || []).length > 0 && (
        <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3 text-[12px] text-red-700 space-y-1">
          <p className="font-semibold mb-1">Dernières erreurs</p>
          {usage.errors.map((e, i) => (
            <p key={i}>• [{e.code}] {e.message}</p>
          ))}
        </div>
      )}
    </Panel>
  );
}

export default function SettingsPanel({ domain, updateMeta, updateOrganization, showToast }) {
  const [meta, setMeta] = useState(domain?.meta || { title: { fr: '', en: '', mg: '' }, description: { fr: '', en: '', mg: '' } });
  const [org, setOrg] = useState(domain?.organization || { tabs: [], categories: [] });
  const [dirty, setDirty] = useState(false);
  const [settingsTab, setSettingsTab] = useState('domaine');

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

  const handleExportJson = async () => {
    try {
      const data = await vocabStorage.exportAll(domain.id);
      downloadJsonFile(buildExportPayload(data), `${domain.id}-vocabs.json`);
      showToast('Export JSON réussi');
    } catch (err) {
      showToast(`Erreur d'export: ${err.message}`, 'error');
    }
  };

  const handleExportCsv = async () => {
    try {
      const data = await vocabStorage.exportAll(domain.id);
      const csv = itemsToCsv(data.items || []);
      downloadTextFile(csv, `${domain.id}-vocabs.csv`, 'text/csv;charset=utf-8');
      showToast(`CSV exporté — ${(data.items || []).length} mot(s)`);
    } catch (err) {
      showToast(`Erreur d'export: ${err.message}`, 'error');
    }
  };

  return (
    <section className="pb-20">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-[#5f6368]">
          Paramètres du domaine, connexions et données.
        </p>
        {domain?.id && (
          <Link
            to={`/vocabs/${domain.id}/admin/guide`}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a73e8] hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guide admin
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSettingsTab(tab.id)}
            className={`text-[13px] font-semibold px-3.5 py-2 rounded-full border transition-colors ${
              settingsTab === tab.id
                ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {settingsTab === 'domaine' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
      )}

      {settingsTab === 'connexions' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SupabaseConnectionPanel />
          <AiProvidersPanel />
          <RagIngestPanel domainId={domain?.id} />
        </div>
      )}

      {settingsTab === 'consommation' && (
        <div className="max-w-2xl">
          <AiUsagePanel />
        </div>
      )}

      {settingsTab === 'donnees' && (
        <div className="max-w-3xl">
          <Panel
            title="Export & données"
            icon={FileCode}
            action={
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#E8F0FE] text-[#1967D2]">
                schéma v{VOCAB_DOMAIN_VERSION}
              </span>
            }
          >
            <div className="rounded-xl border border-[#E8F0FE] bg-[#E8F0FE]/40 p-3.5 mb-4 text-[13px] text-[#1967D2] leading-relaxed">
              <p className="font-semibold mb-1">Import JSON</p>
              <p className="text-[#3c4043]">
                L’import se fait dans l’onglet <strong>Catégories</strong> (bloc Import / Export),
                par onglet, tous les onglets, ou tout le domaine — avec validation avant confirmation.
              </p>
              {domain?.id && (
                <Link
                  to={`/vocabs/${domain.id}/admin?tab=categories`}
                  className="inline-flex mt-2 text-[12px] font-semibold text-[#1a73e8] hover:underline"
                >
                  Ouvrir Catégories
                </Link>
              )}
            </div>

            <p className="text-[13px] text-[#5f6368] mb-3">
              Export rapide de tout le domaine ({items.length} mot{items.length !== 1 ? 's' : ''}).
              Pour un export filtré (catégorie / onglet), utilisez aussi le bloc dans Catégories.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#1a73e8] text-[13px] font-semibold text-white hover:bg-[#1b66c9]"
              >
                <Download className="w-4 h-4" /> Exporter CSV
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[#dadce0] text-[13px] font-semibold hover:bg-[#f8f9fa]"
              >
                <Download className="w-4 h-4" /> Exporter JSON
              </button>
            </div>
          </Panel>
        </div>
      )}

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
    </section>
  );
}
