import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, ClipboardPaste, Download, FileJson, AlertCircle, Check, LogOut,
  RefreshCw, BookOpen, Layers
} from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import AdminAuth from '../components/vocabs/admin/AdminAuth';
import courseStorage from '../services/courseStorage';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';
import {
  buildCoursePackTemplate,
  summarizePack,
  validateCoursePack,
  localize,
} from '../data/coursePackSchema';
import { listSeededCourseIds } from '../data/courseSeeds';

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CoursesAdmin() {
  const { lang, dataRegistry } = useContext(AppContext);
  const courseOptions = dataRegistry.courses || [];
  const seededIds = listSeededCourseIds();

  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [courseId, setCourseId] = useState(courseOptions[0]?.id || 'english');
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pasteJson, setPasteJson] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('merge');
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const needsAuth = ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE && !!supabase;

  useEffect(() => {
    if (!needsAuth) {
      setCheckingAuth(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription?.unsubscribe();
  }, [needsAuth]);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  const loadPack = async (id = courseId) => {
    setLoading(true);
    try {
      const data = await courseStorage.getPack(id);
      setPack(data);
    } catch (err) {
      showToast(err.message || 'Erreur chargement', 'error');
      setPack(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkingAuth) return;
    if (needsAuth && !session) return;
    loadPack(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, checkingAuth, session, needsAuth]);

  const processImportText = (text, sourceLabel) => {
    try {
      const parsed = JSON.parse(text);
      const result = validateCoursePack(parsed, { expectedCourseId: courseId });
      setImportPreview({ raw: parsed, result, fileName: sourceLabel });
      setImportMode('merge');
      if (!result.ok) showToast(result.errors[0] || 'JSON invalide', 'error');
      else showToast(`Aperçu OK (${sourceLabel})`);
    } catch (err) {
      showToast(`JSON invalide: ${err.message}`, 'error');
    }
  };

  const handleImportSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => processImportText(event.target.result, file.name);
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

  const handleApplyImport = async () => {
    if (!importPreview?.result?.ok) {
      showToast('Corrigez le JSON avant d’importer', 'error');
      return;
    }
    setSaving(true);
    try {
      const result = await courseStorage.importPack(courseId, importPreview.raw, { mode: importMode });
      if (!result.ok) {
        showToast(result.errors?.[0] || 'Import échoué', 'error');
        return;
      }
      setPack(result.pack);
      setImportPreview(null);
      setPasteJson('');
      showToast(importMode === 'replace' ? 'Pack remplacé' : 'Pack fusionné');
    } catch (err) {
      showToast(err.message || 'Erreur sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!pack) {
      showToast('Rien à exporter', 'error');
      return;
    }
    downloadJson(pack, `${courseId}-course-pack.json`);
    showToast('Export téléchargé');
  };

  const handleDownloadTemplate = () => {
    downloadJson(buildCoursePackTemplate(courseId), `${courseId}-import-template.json`);
    showToast('Modèle téléchargé');
  };

  const handleResetSeed = async () => {
    if (!seededIds.includes(courseId)) {
      showToast('Pas de seed pour ce cours', 'error');
      return;
    }
    if (!window.confirm('Réinitialiser ce cours avec le seed local ?')) return;
    setSaving(true);
    try {
      const saved = await courseStorage.resetToSeed(courseId);
      setPack(saved);
      showToast('Seed restauré');
    } catch (err) {
      showToast(err.message || 'Reset impossible (connexion admin requise sur Supabase)', 'error');
    } finally {
      setSaving(false);
    }
  };

  const summary = pack ? summarizePack(pack) : null;

  if (checkingAuth) {
    return <div className="p-12 text-center text-[#5f6368]">…</div>;
  }

  if (needsAuth && !session) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10">
        <Breadcrumb items={[{ label: 'Admin cours' }]} />
        <div className="mt-6">
          <AdminAuth onLoginSuccess={setSession} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumb items={[{ label: 'Admin cours' }]} />

      <div className="flex flex-wrap items-start justify-between gap-3 mt-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] dark:text-[#e8eaed]">
            Admin cours (JSON)
          </h1>
          <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1">
            Importez ou collez un course pack. Provider: {ACTIVE_PROVIDER}
          </p>
        </div>
        {needsAuth && (
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#dadce0] dark:border-[#5f6368] text-sm text-[#5f6368]"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        )}
      </div>

      {toast && (
        <div
          className={`mb-4 p-3 rounded-xl text-[13px] flex gap-2 ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
          {toast.text}
        </div>
      )}

      <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 mb-6">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-2 block">
          Cours
        </label>
        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setImportPreview(null);
          }}
          className="w-full h-11 px-3 rounded-xl border border-[#dadce0] dark:border-[#5f6368] bg-[#f8f9fa] dark:bg-[#303134] text-[14px]"
        >
          {courseOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {localize(c.title, lang, c.id)} ({c.id})
            </option>
          ))}
        </select>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPack()}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-[#dadce0] dark:border-[#5f6368] text-sm"
          >
            <RefreshCw size={14} /> Recharger
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-[#dadce0] dark:border-[#5f6368] text-sm"
          >
            <Download size={14} /> Exporter
          </button>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-[#dadce0] dark:border-[#5f6368] text-sm"
          >
            <FileJson size={14} /> Template
          </button>
          {seededIds.includes(courseId) && (
            <button
              type="button"
              onClick={handleResetSeed}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-amber-200 text-amber-800 text-sm disabled:opacity-50"
            >
              Reset seed
            </button>
          )}
          <Link
            to={`/course/${courseId}`}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#e8f0fe] text-[#1a73e8] text-sm font-medium"
          >
            <BookOpen size={14} /> Voir le cours
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-[#5f6368] mb-6">Chargement…</p>
      ) : summary ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Niveaux', value: summary.levels },
            { label: 'Chapitres', value: summary.chapters },
            { label: 'Leçons', value: summary.lessons },
            { label: 'Exercices', value: summary.exercises },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-medium text-[#1a73e8]">{s.value}</p>
              <p className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#5f6368] mb-6">
          Aucun pack pour « {courseId} ». Importez un JSON ou utilisez le template.
        </p>
      )}

      {pack?.levels?.length > 0 && (
        <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 mb-6">
          <h2 className="text-lg font-medium text-[#202124] dark:text-[#e8eaed] mb-3 flex items-center gap-2">
            <Layers size={18} className="text-[#1a73e8]" /> Aperçu structure
          </h2>
          <ul className="space-y-3 text-sm">
            {pack.levels.map((level) => (
              <li key={level.id}>
                <p className="font-medium text-[#202124] dark:text-[#e8eaed]">
                  {level.cefr || localize(level.title, lang)} <span className="text-[#9aa0a6]">({level.id})</span>
                </p>
                <ul className="ml-3 mt-1 space-y-1 text-[#5f6368] dark:text-[#9aa0a6]">
                  {(level.chapters || []).map((ch) => (
                    <li key={ch.id}>
                      {localize(ch.title, lang)} — {(ch.lessons || []).length} leçon(s),{' '}
                      {(ch.lessons || []).reduce((n, l) => n + (l.exercises?.length || 0), 0)} exo(s)
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 space-y-4">
        <h2 className="text-lg font-medium text-[#202124] dark:text-[#e8eaed]">Import JSON</h2>

        <label className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm font-medium cursor-pointer w-full sm:w-auto justify-center">
          <Upload size={16} />
          Importer un fichier
          <input type="file" accept="application/json,.json" className="hidden" onChange={handleImportSelect} />
        </label>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-2 block">
            Ou coller le JSON
          </label>
          <textarea
            value={pasteJson}
            onChange={(e) => setPasteJson(e.target.value)}
            rows={8}
            placeholder='{ "courseId": "english", "version": 1, "levels": [...] }'
            className="w-full rounded-xl border border-[#dadce0] dark:border-[#5f6368] bg-[#f8f9fa] dark:bg-[#303134] p-3 text-[13px] font-mono outline-none focus:border-[#1a73e8]"
          />
          <button
            type="button"
            onClick={handlePasteImport}
            className="mt-2 inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#dadce0] dark:border-[#5f6368] text-sm"
          >
            <ClipboardPaste size={14} /> Valider le collage
          </button>
        </div>

        {importPreview && (
          <div className="border border-[#dadce0] dark:border-[#3c4043] rounded-xl p-4 bg-[#f8f9fa] dark:bg-[#303134]">
            <p className="text-sm font-medium mb-2">
              Aperçu — {importPreview.fileName}{' '}
              {importPreview.result.ok ? (
                <span className="text-green-700">✓ valide</span>
              ) : (
                <span className="text-red-700">✗ erreurs</span>
              )}
            </p>
            {importPreview.result.ok && (
              <p className="text-xs text-[#5f6368] mb-3">
                {JSON.stringify(summarizePack(importPreview.result.pack))}
              </p>
            )}
            {!importPreview.result.ok && (
              <ul className="text-xs text-red-700 list-disc ml-4 mb-3 space-y-1">
                {importPreview.result.errors.slice(0, 8).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
            {importPreview.result.warnings?.length > 0 && (
              <ul className="text-xs text-amber-700 list-disc ml-4 mb-3">
                {importPreview.result.warnings.slice(0, 5).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-3 items-center mb-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                Fusionner (upsert par id)
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                Remplacer tout
              </label>
            </div>

            <button
              type="button"
              disabled={!importPreview.result.ok || saving}
              onClick={handleApplyImport}
              className="h-11 px-5 rounded-xl bg-[#1a73e8] text-white text-sm font-medium disabled:opacity-40"
            >
              {saving ? 'Enregistrement…' : 'Appliquer l’import'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
