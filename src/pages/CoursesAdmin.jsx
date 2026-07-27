import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, Download, FileJson, AlertCircle, Check, LogOut, RefreshCw, BookOpen,
  Plus, Trash2, ChevronUp, ChevronDown, Copy, ClipboardPaste
} from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import AdminAuth from '../components/vocabs/admin/AdminAuth';
import courseStorage from '../services/courseStorage';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';
import {
  localize,
  summarizePack,
  validateCoursePack,
  validateLessonContentPayload,
  validateExercisesPayload,
  buildLessonContentTemplate,
  buildExercisesTemplate,
  buildCoursePackTemplate,
  EXERCISE_TYPES,
  EXERCISE_TYPE_LABELS,
  findLessonInPack,
} from '../data/coursePackSchema';
import {
  addLevel,
  addChapter,
  addLessonStub,
  updateLevelMeta,
  updateChapterMeta,
  updateLessonMeta,
  deleteLevel,
  deleteChapter,
  deleteLesson,
  moveLevel,
  moveChapter,
  moveLesson,
  emptyI18n,
} from '../data/coursePackMutations';
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

function I18nFields({ value, onChange, label }) {
  const v = value || emptyI18n();
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-lh-faint">{label}</p>
      {['fr', 'en', 'mg'].map((l) => (
        <input
          key={l}
          value={v[l] || ''}
          onChange={(e) => onChange({ ...v, [l]: e.target.value })}
          placeholder={l.toUpperCase()}
          className="w-full h-10 px-3 rounded-xl border border-lh-border bg-lh-muted text-[13px]"
        />
      ))}
    </div>
  );
}

function JsonImportPanel({
  title,
  typesHint,
  paste,
  setPaste,
  onLoadTemplate,
  onCopyTemplate,
  onDownloadTemplate,
  onValidateFile,
  onApply,
  mode,
  setMode,
  showMode,
  preview,
  saving,
}) {
  return (
    <div className="border border-lh-border rounded-2xl p-4 space-y-3 bg-lh-card">
      <h3 className="font-medium text-lh-text">{title}</h3>
      {typesHint}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onLoadTemplate} className="h-9 px-3 rounded-xl border border-lh-border text-xs inline-flex items-center gap-1">
          <FileJson size={13} /> Charger modèle
        </button>
        <button type="button" onClick={onCopyTemplate} className="h-9 px-3 rounded-xl border border-lh-border text-xs inline-flex items-center gap-1">
          <Copy size={13} /> Copier modèle
        </button>
        <button type="button" onClick={onDownloadTemplate} className="h-9 px-3 rounded-xl border border-lh-border text-xs inline-flex items-center gap-1">
          <Download size={13} /> Télécharger
        </button>
        <label className="h-9 px-3 rounded-xl bg-[#1a73e8] text-white text-xs inline-flex items-center gap-1 cursor-pointer">
          <Upload size={13} /> Fichier
          <input type="file" accept="application/json,.json" className="hidden" onChange={onValidateFile} />
        </label>
      </div>
      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-lh-border bg-lh-muted p-3 text-[12px] font-mono"
        placeholder="Collez le JSON ici…"
      />
      {showMode && (
        <div className="flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={mode === 'merge'} onChange={() => setMode('merge')} /> Fusionner
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={mode === 'replace'} onChange={() => setMode('replace')} /> Remplacer
          </label>
        </div>
      )}
      {preview && (
        <div className={`text-xs rounded-xl p-3 ${preview.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
          {preview.ok ? '✓ JSON valide' : `✗ ${preview.errors?.[0]}`}
          {preview.warnings?.length > 0 && (
            <ul className="mt-1 list-disc ml-4">{preview.warnings.slice(0, 3).map((w) => <li key={w}>{w}</li>)}</ul>
          )}
        </div>
      )}
      <button
        type="button"
        disabled={saving}
        onClick={onApply}
        className="h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-2"
      >
        <ClipboardPaste size={14} /> Appliquer
      </button>
    </div>
  );
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
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [selection, setSelection] = useState(null); // { type, levelId, chapterId, lessonId }

  const [lessonPaste, setLessonPaste] = useState('');
  const [exPaste, setExPaste] = useState('');
  const [lessonPreview, setLessonPreview] = useState(null);
  const [exPreview, setExPreview] = useState(null);
  const [exMode, setExMode] = useState('replace');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [packPaste, setPackPaste] = useState('');

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
      setPack(data || { courseId: id, version: 1, levels: [] });
    } catch (err) {
      showToast(err.message || 'Erreur chargement', 'error');
      setPack({ courseId: id, version: 1, levels: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkingAuth) return;
    if (needsAuth && !session) return;
    loadPack(courseId);
    setSelection(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, checkingAuth, session, needsAuth]);

  const persist = async (next, msg = 'Enregistré') => {
    setSaving(true);
    try {
      const saved = await courseStorage.savePack(courseId, next);
      setPack(saved);
      showToast(msg);
      return saved;
    } catch (err) {
      showToast(err.message || 'Erreur sauvegarde', 'error');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const selectedLesson = useMemo(() => {
    if (!pack || selection?.type !== 'lesson') return null;
    return findLessonInPack(pack, selection.lessonId);
  }, [pack, selection]);

  const summary = pack ? summarizePack(pack) : null;

  if (checkingAuth) return <div className="p-12 text-center text-lh-secondary">…</div>;

  if (needsAuth && !session) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10">
        <Breadcrumb items={[{ label: 'Admin', path: '/admin' }, { label: 'Cours' }]} />
        <div className="mt-6"><AdminAuth onLoginSuccess={setSession} /></div>
      </div>
    );
  }

  const renderTree = () => (
    <div className="space-y-2">
      {(pack?.levels || []).map((level) => (
        <div key={level.id} className="border border-lh-border rounded-xl overflow-hidden bg-lh-card">
          <div
            className={`flex items-center gap-1 px-2 py-2 ${selection?.type === 'level' && selection.levelId === level.id ? 'bg-lh-accent-soft' : ''}`}
          >
            <button type="button" className="flex-1 text-left text-sm font-medium px-2 py-1" onClick={() => setSelection({ type: 'level', levelId: level.id })}>
              {level.cefr || localize(level.title, lang)} <span className="text-lh-faint text-xs">({level.id})</span>
            </button>
            <button type="button" className="p-1.5" title="Monter" onClick={() => persist(moveLevel(pack, level.id, -1))}><ChevronUp size={14} /></button>
            <button type="button" className="p-1.5" title="Descendre" onClick={() => persist(moveLevel(pack, level.id, 1))}><ChevronDown size={14} /></button>
            <button type="button" className="p-1.5 text-red-600" onClick={() => { if (window.confirm('Supprimer ce niveau ?')) persist(deleteLevel(pack, level.id), 'Niveau supprimé'); }}><Trash2 size={14} /></button>
          </div>
          <div className="pl-3 pb-2 space-y-1">
            {(level.chapters || []).map((ch) => (
              <div key={ch.id}>
                <div className={`flex items-center gap-1 rounded-lg ${selection?.type === 'chapter' && selection.chapterId === ch.id ? 'bg-lh-accent-soft' : ''}`}>
                  <button type="button" className="flex-1 text-left text-[13px] px-2 py-1.5" onClick={() => setSelection({ type: 'chapter', levelId: level.id, chapterId: ch.id })}>
                    └ {localize(ch.title, lang)}
                  </button>
                  <button type="button" className="p-1" onClick={() => persist(moveChapter(pack, level.id, ch.id, -1))}><ChevronUp size={12} /></button>
                  <button type="button" className="p-1" onClick={() => persist(moveChapter(pack, level.id, ch.id, 1))}><ChevronDown size={12} /></button>
                  <button type="button" className="p-1 text-red-600" onClick={() => { if (window.confirm('Supprimer ce chapitre ?')) persist(deleteChapter(pack, level.id, ch.id)); }}><Trash2 size={12} /></button>
                </div>
                <div className="pl-4 space-y-0.5">
                  {(ch.lessons || []).map((lesson) => (
                    <div key={lesson.id} className={`flex items-center gap-1 rounded-lg ${selection?.type === 'lesson' && selection.lessonId === lesson.id ? 'bg-lh-accent-soft' : ''}`}>
                      <button type="button" className="flex-1 text-left text-[12px] px-2 py-1.5 text-lh-secondary" onClick={() => setSelection({ type: 'lesson', levelId: level.id, chapterId: ch.id, lessonId: lesson.id })}>
                        • {localize(lesson.title, lang)}
                        <span className="text-lh-faint ml-1">({lesson.exercises?.length || 0} exo)</span>
                      </button>
                      <button type="button" className="p-1" onClick={() => persist(moveLesson(pack, lesson.id, -1))}><ChevronUp size={12} /></button>
                      <button type="button" className="p-1" onClick={() => persist(moveLesson(pack, lesson.id, 1))}><ChevronDown size={12} /></button>
                      <button type="button" className="p-1 text-red-600" onClick={() => { if (window.confirm('Supprimer cette leçon ?')) persist(deleteLesson(pack, lesson.id)); }}><Trash2 size={12} /></button>
                    </div>
                  ))}
                  <button type="button" className="text-[11px] text-lh-accent px-2 py-1 inline-flex items-center gap-1" onClick={() => persist(addLessonStub(pack, level.id, ch.id), 'Leçon ajoutée')}>
                    <Plus size={12} /> Leçon
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="text-[11px] text-lh-accent px-2 py-1 inline-flex items-center gap-1" onClick={() => persist(addChapter(pack, level.id), 'Chapitre ajouté')}>
              <Plus size={12} /> Chapitre
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="w-full h-10 rounded-xl border border-dashed border-lh-border text-sm text-lh-accent inline-flex items-center justify-center gap-1"
        onClick={() => persist(addLevel(pack, { cefr: 'A1' }), 'Niveau ajouté')}
      >
        <Plus size={14} /> Niveau
      </button>
    </div>
  );

  const renderDetail = () => {
    if (!selection || !pack) {
      return <p className="text-sm text-lh-secondary">Sélectionnez un niveau, chapitre ou leçon dans l’arbre.</p>;
    }

    if (selection.type === 'level') {
      const level = pack.levels.find((l) => l.id === selection.levelId);
      if (!level) return null;
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Niveau</h2>
          <label className="block text-xs text-lh-faint">CEFR
            <input className="mt-1 w-full h-10 px-3 rounded-xl border border-lh-border bg-lh-muted" value={level.cefr || ''} onChange={(e) => setPack(updateLevelMeta(pack, level.id, { cefr: e.target.value }))} />
          </label>
          <I18nFields label="Titre" value={level.title} onChange={(title) => setPack(updateLevelMeta(pack, level.id, { title }))} />
          <label className="block text-xs text-lh-faint">Cover URL
            <input className="mt-1 w-full h-10 px-3 rounded-xl border border-lh-border bg-lh-muted" value={level.coverImage || ''} onChange={(e) => setPack(updateLevelMeta(pack, level.id, { coverImage: e.target.value }))} />
          </label>
          <button type="button" disabled={saving} onClick={() => persist(pack)} className="h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-sm">Enregistrer</button>
        </div>
      );
    }

    if (selection.type === 'chapter') {
      const level = pack.levels.find((l) => l.id === selection.levelId);
      const chapter = level?.chapters?.find((c) => c.id === selection.chapterId);
      if (!chapter) return null;
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Chapitre</h2>
          <I18nFields label="Titre" value={chapter.title} onChange={(title) => setPack(updateChapterMeta(pack, level.id, chapter.id, { title }))} />
          <I18nFields label="Description" value={chapter.description} onChange={(description) => setPack(updateChapterMeta(pack, level.id, chapter.id, { description }))} />
          <button type="button" disabled={saving} onClick={() => persist(pack)} className="h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-sm">Enregistrer</button>
        </div>
      );
    }

    // lesson
    const found = selectedLesson;
    if (!found) return null;
    const lesson = found.lesson;
    const lessonId = lesson.id;

    const loadLessonTpl = () => {
      const tpl = buildLessonContentTemplate(lessonId);
      setLessonPaste(JSON.stringify(tpl, null, 2));
      setLessonPreview(null);
      showToast('Modèle leçon chargé dans la zone');
    };
    const loadExTpl = () => {
      const tpl = buildExercisesTemplate(lessonId);
      setExPaste(JSON.stringify(tpl, null, 2));
      setExPreview(null);
      showToast('Modèle exercices chargé (tous les types)');
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-medium">Leçon</h2>
          <Link to={`/course/${courseId}/lesson/${lessonId}`} className="text-sm text-lh-accent">Voir →</Link>
        </div>
        <label className="block text-xs text-lh-faint">Id
          <input className="mt-1 w-full h-10 px-3 rounded-xl border border-lh-border bg-lh-muted font-mono text-sm" value={lesson.id} onChange={(e) => setPack(updateLessonMeta(pack, lessonId, { id: e.target.value }))} />
        </label>
        <I18nFields label="Titre" value={lesson.title} onChange={(title) => setPack(updateLessonMeta(pack, lessonId, { title }))} />
        <I18nFields label="Description" value={lesson.description} onChange={(description) => setPack(updateLessonMeta(pack, lessonId, { description }))} />
        <label className="block text-xs text-lh-faint">Minutes
          <input type="number" className="mt-1 w-full h-10 px-3 rounded-xl border border-lh-border bg-lh-muted" value={lesson.estimatedMinutes || ''} onChange={(e) => setPack(updateLessonMeta(pack, lessonId, { estimatedMinutes: Number(e.target.value) || 0 }))} />
        </label>
        <label className="block text-xs text-lh-faint">Cover URL
          <input className="mt-1 w-full h-10 px-3 rounded-xl border border-lh-border bg-lh-muted" value={lesson.coverImage || ''} onChange={(e) => setPack(updateLessonMeta(pack, lessonId, { coverImage: e.target.value }))} />
        </label>
        <button type="button" disabled={saving} onClick={() => persist(pack)} className="h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-sm">Enregistrer métadonnées</button>

        <JsonImportPanel
          title="Contenu leçon (JSON)"
          paste={lessonPaste}
          setPaste={setLessonPaste}
          preview={lessonPreview}
          saving={saving}
          onLoadTemplate={loadLessonTpl}
          onCopyTemplate={async () => {
            const tpl = buildLessonContentTemplate(lessonId);
            await navigator.clipboard.writeText(JSON.stringify(tpl, null, 2));
            showToast('Modèle copié');
          }}
          onDownloadTemplate={() => downloadJson(buildLessonContentTemplate(lessonId), `${lessonId}-content.json`)}
          onValidateFile={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              setLessonPaste(ev.target.result);
              try {
                const parsed = JSON.parse(ev.target.result);
                setLessonPreview(validateLessonContentPayload(parsed, { expectedLessonId: lessonId }));
              } catch (err) {
                setLessonPreview({ ok: false, errors: [err.message] });
              }
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
          onApply={async () => {
            try {
              const parsed = JSON.parse(lessonPaste);
              const preview = validateLessonContentPayload(parsed, { expectedLessonId: lessonId });
              setLessonPreview(preview);
              if (!preview.ok) {
                showToast(preview.errors[0], 'error');
                return;
              }
              const result = await courseStorage.importLessonContent(courseId, lessonId, parsed);
              if (!result.ok) {
                showToast(result.errors[0], 'error');
                return;
              }
              setPack(result.pack);
              showToast('Contenu leçon importé');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }}
        />

        <div className="border border-lh-border rounded-2xl p-4 bg-lh-card space-y-3">
          <h3 className="font-medium">Exercices liés ({lesson.exercises?.length || 0})</h3>
          <div className="flex flex-wrap gap-1.5">
            {EXERCISE_TYPES.map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-lh-muted text-lh-secondary">{EXERCISE_TYPE_LABELS[t] || t}</span>
            ))}
          </div>
          <ul className="text-xs text-lh-secondary space-y-1">
            {(lesson.exercises || []).map((ex) => (
              <li key={ex.id}>{ex.id} · {ex.type} · {ex.points ?? 1} pt</li>
            ))}
            {!lesson.exercises?.length && <li>Aucun exercice — importez un JSON.</li>}
          </ul>
        </div>

        <JsonImportPanel
          title="Exercices (JSON séparé)"
          showMode
          mode={exMode}
          setMode={setExMode}
          paste={exPaste}
          setPaste={setExPaste}
          preview={exPreview}
          saving={saving}
          typesHint={null}
          onLoadTemplate={loadExTpl}
          onCopyTemplate={async () => {
            const tpl = buildExercisesTemplate(lessonId);
            await navigator.clipboard.writeText(JSON.stringify(tpl, null, 2));
            showToast('Modèle exercices copié');
          }}
          onDownloadTemplate={() => downloadJson(buildExercisesTemplate(lessonId), `${lessonId}-exercises.json`)}
          onValidateFile={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              setExPaste(ev.target.result);
              try {
                const parsed = JSON.parse(ev.target.result);
                setExPreview(validateExercisesPayload(parsed, { expectedLessonId: lessonId }));
              } catch (err) {
                setExPreview({ ok: false, errors: [err.message] });
              }
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
          onApply={async () => {
            try {
              const parsed = JSON.parse(exPaste);
              const result = await courseStorage.importLessonExercises(courseId, lessonId, parsed, { mode: exMode });
              setExPreview(result);
              if (!result.ok) {
                showToast(result.errors[0], 'error');
                return;
              }
              setPack(result.pack);
              showToast(exMode === 'replace' ? 'Exercices remplacés' : 'Exercices fusionnés');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumb items={[{ label: 'Admin', path: '/admin' }, { label: 'Cours' }]} />

      <div className="flex flex-wrap items-start justify-between gap-3 mt-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-lh-text">Admin cours</h1>
          <p className="text-sm text-lh-secondary mt-1">Hiérarchie + JSON leçon / exercices séparés · {ACTIVE_PROVIDER}</p>
        </div>
        {needsAuth && (
          <button type="button" onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-lh-border text-sm text-lh-secondary">
            <LogOut size={14} /> Déconnexion
          </button>
        )}
      </div>

      {toast && (
        <div className={`mb-4 p-3 rounded-xl text-[13px] flex gap-2 ${toast.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
          {toast.text}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="h-10 px-3 rounded-xl border border-lh-border bg-lh-card text-sm"
        >
          {courseOptions.map((c) => (
            <option key={c.id} value={c.id}>{localize(c.title, lang, c.id)}</option>
          ))}
        </select>
        <button type="button" onClick={() => loadPack()} className="h-10 px-3 rounded-xl border border-lh-border text-sm inline-flex items-center gap-1"><RefreshCw size={14} /> Recharger</button>
        <Link to={`/course/${courseId}`} className="h-10 px-3 rounded-xl bg-lh-accent-soft text-lh-accent text-sm inline-flex items-center gap-1"><BookOpen size={14} /> Voir</Link>
        {seededIds.includes(courseId) && (
          <button type="button" className="h-10 px-3 rounded-xl border border-amber-200 text-amber-800 text-sm" onClick={async () => {
            if (!window.confirm('Reset seed ?')) return;
            try {
              setPack(await courseStorage.resetToSeed(courseId));
              showToast('Seed restauré');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }}>Reset seed</button>
        )}
        <button type="button" className="h-10 px-3 rounded-xl border border-lh-border text-sm" onClick={() => setShowAdvanced((v) => !v)}>
          {showAdvanced ? 'Masquer avancé' : 'Avancé (pack complet)'}
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            ['Niveaux', summary.levels],
            ['Chapitres', summary.chapters],
            ['Leçons', summary.lessons],
            ['Exercices', summary.exercises],
          ].map(([label, value]) => (
            <div key={label} className="bg-lh-card border border-lh-border rounded-xl p-3 text-center">
              <p className="text-xl font-medium text-lh-accent">{value}</p>
              <p className="text-[11px] text-lh-faint">{label}</p>
            </div>
          ))}
        </div>
      )}

      {showAdvanced && (
        <div className="mb-6 border border-lh-border rounded-2xl p-4 space-y-2 bg-lh-card">
          <p className="text-sm font-medium">Import pack complet (backup)</p>
          <textarea value={packPaste} onChange={(e) => setPackPaste(e.target.value)} rows={5} className="w-full font-mono text-xs rounded-xl border border-lh-border bg-lh-muted p-3" />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="h-9 px-3 rounded-xl border text-xs" onClick={() => setPackPaste(JSON.stringify(buildCoursePackTemplate(courseId), null, 2))}>Charger modèle pack</button>
            <button type="button" className="h-9 px-3 rounded-xl border text-xs" onClick={() => pack && downloadJson(pack, `${courseId}-pack.json`)}>Exporter pack</button>
            <button type="button" className="h-9 px-3 rounded-xl bg-[#1a73e8] text-white text-xs" onClick={async () => {
              try {
                const parsed = JSON.parse(packPaste);
                const result = await courseStorage.importPack(courseId, parsed, { mode: 'merge' });
                if (!result.ok) { showToast(result.errors[0], 'error'); return; }
                setPack(result.pack);
                showToast('Pack fusionné');
              } catch (err) {
                showToast(err.message, 'error');
              }
            }}>Fusionner pack</button>
          </div>
          {packPaste && (() => {
            try {
              const r = validateCoursePack(JSON.parse(packPaste), { expectedCourseId: courseId });
              return <p className={`text-xs ${r.ok ? 'text-green-700' : 'text-red-700'}`}>{r.ok ? 'Pack valide' : r.errors[0]}</p>;
            } catch (e) {
              return <p className="text-xs text-red-700">{e.message}</p>;
            }
          })()}
        </div>
      )}

      {loading ? (
        <p className="text-lh-secondary">Chargement…</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lh-faint mb-3">Structure</h2>
            {renderTree()}
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lh-faint mb-3">Détail</h2>
            <div className="bg-lh-card border border-lh-border rounded-2xl p-4 sm:p-5">
              {renderDetail()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
