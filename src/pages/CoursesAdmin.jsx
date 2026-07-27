import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, Download, FileJson, AlertCircle, Check, LogOut, RefreshCw, BookOpen,
  Plus, Trash2, ChevronUp, ChevronDown, Copy, ClipboardPaste, Eye
} from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import AdminAuth from '../components/vocabs/admin/AdminAuth';
import LessonSections from '../components/lesson/LessonSections';
import ExerciseQuestion from '../components/lesson/ExerciseQuestion';
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
  buildSectionExample,
  buildExerciseExample,
  EXERCISE_TYPES,
  EXERCISE_TYPE_LABELS,
  SECTION_TYPES,
  SECTION_TYPE_LABELS,
  SAMPLE_LESSON_STYLES,
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

const LESSON_TABS = [
  { id: 'meta', label: 'Métadonnées' },
  { id: 'content', label: 'Contenu' },
  { id: 'exercises', label: 'Exercices' },
  { id: 'preview', label: 'Aperçu' },
];

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function prettySnippet(obj, max = 140) {
  const raw = JSON.stringify(obj, null, 0);
  if (raw.length <= max) return raw;
  return `${raw.slice(0, max)}…`;
}

function I18nFields({ value, onChange, label }) {
  const v = value || emptyI18n();
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-wider text-lh-faint">{label}</p>
      {['fr', 'en', 'mg'].map((l) => (
        <input
          key={l}
          value={v[l] || ''}
          onChange={(e) => onChange({ ...v, [l]: e.target.value })}
          placeholder={l.toUpperCase()}
          className="w-full h-11 px-3 rounded-xl border border-lh-border bg-lh-muted text-sm"
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
  onLoadCurrent,
  onValidateFile,
  onApply,
  onValidateLive,
  mode,
  setMode,
  showMode,
  preview,
  saving,
}) {
  return (
    <div className="border border-lh-border rounded-2xl p-4 sm:p-5 space-y-3 bg-lh-card">
      <h3 className="font-medium text-base text-lh-text">{title}</h3>
      {typesHint}
      <div className="flex flex-wrap gap-2">
        {onLoadCurrent && (
          <button type="button" onClick={onLoadCurrent} className="h-10 px-3 rounded-xl border border-lh-border text-sm inline-flex items-center gap-1.5">
            <Eye size={14} /> Contenu actuel
          </button>
        )}
        <button type="button" onClick={onLoadTemplate} className="h-10 px-3 rounded-xl border border-lh-border text-sm inline-flex items-center gap-1.5">
          <FileJson size={14} /> Modèle complet
        </button>
        <button type="button" onClick={onCopyTemplate} className="h-10 px-3 rounded-xl border border-lh-border text-sm inline-flex items-center gap-1.5">
          <Copy size={14} /> Copier modèle
        </button>
        <button type="button" onClick={onDownloadTemplate} className="h-10 px-3 rounded-xl border border-lh-border text-sm inline-flex items-center gap-1.5">
          <Download size={14} /> Télécharger
        </button>
        <label className="h-10 px-3 rounded-xl bg-[#1a73e8] text-white text-sm inline-flex items-center gap-1.5 cursor-pointer">
          <Upload size={14} /> Fichier
          <input type="file" accept="application/json,.json" className="hidden" onChange={onValidateFile} />
        </label>
      </div>
      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        onBlur={() => onValidateLive?.(paste)}
        rows={14}
        spellCheck={false}
        className="w-full rounded-xl border border-lh-border bg-[#f8f9fa] dark:bg-[#1e1f20] p-4 text-sm font-mono leading-relaxed text-lh-text"
        placeholder="Collez ou éditez le JSON ici…"
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
        <div className={`text-sm rounded-xl p-3 ${preview.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
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
        className="h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-2"
      >
        <ClipboardPaste size={15} /> Appliquer
      </button>
    </div>
  );
}

function TemplateGallery({ kind, onInsert }) {
  const items = kind === 'section'
    ? SECTION_TYPES.map((type) => ({
      type,
      label: SECTION_TYPE_LABELS[type] || type,
      example: buildSectionExample(type),
    }))
    : EXERCISE_TYPES.map((type) => ({
      type,
      label: EXERCISE_TYPE_LABELS[type] || type,
      example: buildExerciseExample(type, 'demo'),
    }));

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium text-base text-lh-text">
          {kind === 'section' ? 'Modèles de sections' : 'Modèles d’exercices'}
        </h3>
        <p className="text-sm text-lh-secondary mt-0.5">
          Cliquez sur Insérer pour ajouter un exemple visible dans l’éditeur JSON.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(({ type, label, example }) => (
          <div key={type} className="rounded-xl border border-lh-border bg-lh-muted/60 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-lh-text">{label}</p>
                <p className="text-xs font-mono text-lh-faint mt-0.5">{type}</p>
              </div>
              <button
                type="button"
                onClick={() => onInsert(type, example)}
                className="shrink-0 h-9 px-3 rounded-lg bg-[#1a73e8] text-white text-sm inline-flex items-center gap-1"
              >
                <Plus size={14} /> Insérer
              </button>
            </div>
            <pre className="text-[11px] leading-snug font-mono text-lh-secondary overflow-x-auto whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
              {prettySnippet(example, 220)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonPreviewPanel({ lesson, lang, courseId }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setAnswers({});
  }, [lesson?.id]);

  if (!lesson) return null;

  const hasSections = Array.isArray(lesson.sections) && lesson.sections.length > 0;
  const hasExercises = Array.isArray(lesson.exercises) && lesson.exercises.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-medium text-lh-text">{localize(lesson.title, lang)}</h3>
          {lesson.introduction && (
            <p className="text-sm text-lh-secondary mt-1 leading-relaxed">
              {localize(lesson.introduction, lang)}
            </p>
          )}
        </div>
        <Link
          to={`/course/${courseId}/lesson/${lesson.id}`}
          className="h-10 px-3 rounded-xl border border-lh-border text-sm text-lh-accent inline-flex items-center gap-1.5"
        >
          <BookOpen size={14} /> Page élève →
        </Link>
      </div>

      {!hasSections && !hasExercises && (
        <p className="text-sm text-lh-secondary rounded-xl border border-dashed border-lh-border p-6 text-center">
          Aucun contenu à prévisualiser — importez des sections ou des exercices.
        </p>
      )}

      {hasSections && (
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-lh-faint mb-4">Sections</p>
          <LessonSections
            sections={lesson.sections}
            styles={lesson.styles || SAMPLE_LESSON_STYLES}
            lang={lang}
          />
        </div>
      )}

      {hasExercises && (
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-lh-faint">Exercices</p>
          {lesson.exercises.map((ex) => (
            <div key={ex.id} className="rounded-2xl border border-lh-border bg-white dark:bg-[#202124] p-4 sm:p-5">
              <p className="text-xs font-mono text-lh-faint mb-3">
                {ex.id} · {EXERCISE_TYPE_LABELS[ex.type] || ex.type} · {ex.points ?? 1} pt
              </p>
              <ExerciseQuestion
                exercise={ex}
                lang={lang}
                value={answers[ex.id]}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [ex.id]: v }))}
              />
            </div>
          ))}
        </div>
      )}
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
  const [selection, setSelection] = useState(null);

  const [lessonTab, setLessonTab] = useState('meta');
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

  useEffect(() => {
    setLessonTab('meta');
    setLessonPaste('');
    setExPaste('');
    setLessonPreview(null);
    setExPreview(null);
  }, [selection?.lessonId, selection?.type]);

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

  const renderTree = () => {
    const levels = pack?.levels || [];
    return (
      <div className="space-y-3">
        {levels.map((level, levelIdx) => (
          <div key={level.id} className="border border-lh-border rounded-xl overflow-hidden bg-lh-card">
            <div
              className={`flex items-center gap-1 px-2 py-2.5 ${selection?.type === 'level' && selection.levelId === level.id ? 'bg-lh-accent-soft' : ''}`}
            >
              <button type="button" className="flex-1 text-left text-base font-medium px-2 py-1.5" onClick={() => setSelection({ type: 'level', levelId: level.id })}>
                {level.cefr || localize(level.title, lang)} <span className="text-lh-faint text-sm font-normal">({level.id})</span>
              </button>
              {levelIdx > 0 && (
                <button type="button" className="p-1.5" title="Monter" onClick={() => persist(moveLevel(pack, level.id, -1))}><ChevronUp size={16} /></button>
              )}
              {levelIdx < levels.length - 1 && (
                <button type="button" className="p-1.5" title="Descendre" onClick={() => persist(moveLevel(pack, level.id, 1))}><ChevronDown size={16} /></button>
              )}
              <button type="button" className="p-1.5 text-red-600" onClick={() => { if (window.confirm('Supprimer ce niveau ?')) persist(deleteLevel(pack, level.id), 'Niveau supprimé'); }}><Trash2 size={15} /></button>
            </div>
            <div className="pl-3 pb-3 space-y-1.5">
              {(level.chapters || []).map((ch, chIdx) => {
                const chapters = level.chapters || [];
                return (
                  <div key={ch.id}>
                    <div className={`flex items-center gap-1 rounded-lg ${selection?.type === 'chapter' && selection.chapterId === ch.id ? 'bg-lh-accent-soft' : ''}`}>
                      <button type="button" className="flex-1 text-left text-sm px-2 py-2" onClick={() => setSelection({ type: 'chapter', levelId: level.id, chapterId: ch.id })}>
                        └ {localize(ch.title, lang)}
                      </button>
                      {chIdx > 0 && (
                        <button type="button" className="p-1.5" title="Monter" onClick={() => persist(moveChapter(pack, level.id, ch.id, -1))}><ChevronUp size={14} /></button>
                      )}
                      {chIdx < chapters.length - 1 && (
                        <button type="button" className="p-1.5" title="Descendre" onClick={() => persist(moveChapter(pack, level.id, ch.id, 1))}><ChevronDown size={14} /></button>
                      )}
                      <button type="button" className="p-1.5 text-red-600" onClick={() => { if (window.confirm('Supprimer ce chapitre ?')) persist(deleteChapter(pack, level.id, ch.id)); }}><Trash2 size={14} /></button>
                    </div>
                    <div className="pl-4 space-y-0.5">
                      {(ch.lessons || []).map((lesson, lessonIdx) => {
                        const lessons = ch.lessons || [];
                        return (
                          <div key={lesson.id} className={`flex items-center gap-1 rounded-lg ${selection?.type === 'lesson' && selection.lessonId === lesson.id ? 'bg-lh-accent-soft' : ''}`}>
                            <button type="button" className="flex-1 text-left text-sm px-2 py-2 text-lh-secondary" onClick={() => setSelection({ type: 'lesson', levelId: level.id, chapterId: ch.id, lessonId: lesson.id })}>
                              • {localize(lesson.title, lang)}
                              <span className="text-lh-faint ml-1 text-xs">({lesson.exercises?.length || 0} exo)</span>
                            </button>
                            {lessonIdx > 0 && (
                              <button type="button" className="p-1.5" title="Monter" onClick={() => persist(moveLesson(pack, lesson.id, -1))}><ChevronUp size={14} /></button>
                            )}
                            {lessonIdx < lessons.length - 1 && (
                              <button type="button" className="p-1.5" title="Descendre" onClick={() => persist(moveLesson(pack, lesson.id, 1))}><ChevronDown size={14} /></button>
                            )}
                            <button type="button" className="p-1.5 text-red-600" onClick={() => { if (window.confirm('Supprimer cette leçon ?')) persist(deleteLesson(pack, lesson.id)); }}><Trash2 size={14} /></button>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        className="text-sm text-lh-accent px-2 py-1.5 inline-flex items-center gap-1"
                        onClick={() => persist(addLessonStub(pack, level.id, ch.id), 'Leçon ajoutée')}
                      >
                        <Plus size={14} /> Leçon
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                className="text-sm text-lh-accent px-2 py-1.5 inline-flex items-center gap-1"
                onClick={() => persist(addChapter(pack, level.id), 'Chapitre ajouté')}
              >
                <Plus size={14} /> Chapitre
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="w-full h-11 rounded-xl border border-dashed border-lh-border text-sm text-lh-accent inline-flex items-center justify-center gap-1"
          onClick={() => persist(addLevel(pack, { cefr: 'A1' }), 'Niveau ajouté')}
        >
          <Plus size={15} /> Niveau
        </button>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selection || !pack) {
      return <p className="text-base text-lh-secondary">Sélectionnez un niveau, chapitre ou leçon dans l’arbre.</p>;
    }

    if (selection.type === 'level') {
      const level = pack.levels.find((l) => l.id === selection.levelId);
      if (!level) return null;
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Niveau</h2>
          <label className="block text-sm text-lh-faint">CEFR
            <input className="mt-1.5 w-full h-11 px-3 rounded-xl border border-lh-border bg-lh-muted text-sm" value={level.cefr || ''} onChange={(e) => setPack(updateLevelMeta(pack, level.id, { cefr: e.target.value }))} />
          </label>
          <I18nFields label="Titre" value={level.title} onChange={(title) => setPack(updateLevelMeta(pack, level.id, { title }))} />
          <label className="block text-sm text-lh-faint">Cover URL
            <input className="mt-1.5 w-full h-11 px-3 rounded-xl border border-lh-border bg-lh-muted text-sm" value={level.coverImage || ''} onChange={(e) => setPack(updateLevelMeta(pack, level.id, { coverImage: e.target.value }))} />
          </label>
          <button type="button" disabled={saving} onClick={() => persist(pack)} className="h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm">Enregistrer</button>
        </div>
      );
    }

    if (selection.type === 'chapter') {
      const level = pack.levels.find((l) => l.id === selection.levelId);
      const chapter = level?.chapters?.find((c) => c.id === selection.chapterId);
      if (!chapter) return null;
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Chapitre</h2>
          <I18nFields label="Titre" value={chapter.title} onChange={(title) => setPack(updateChapterMeta(pack, level.id, chapter.id, { title }))} />
          <I18nFields label="Description" value={chapter.description} onChange={(description) => setPack(updateChapterMeta(pack, level.id, chapter.id, { description }))} />
          <button type="button" disabled={saving} onClick={() => persist(pack)} className="h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm">Enregistrer</button>
        </div>
      );
    }

    const found = selectedLesson;
    if (!found) return null;
    const lesson = found.lesson;
    const lessonId = lesson.id;

    const validateLessonLive = (text) => {
      if (!text?.trim()) {
        setLessonPreview(null);
        return;
      }
      try {
        const parsed = JSON.parse(text);
        setLessonPreview(validateLessonContentPayload(parsed, { expectedLessonId: lessonId }));
      } catch (err) {
        setLessonPreview({ ok: false, errors: [err.message] });
      }
    };

    const validateExLive = (text) => {
      if (!text?.trim()) {
        setExPreview(null);
        return;
      }
      try {
        const parsed = JSON.parse(text);
        setExPreview(validateExercisesPayload(parsed, { expectedLessonId: lessonId }));
      } catch (err) {
        setExPreview({ ok: false, errors: [err.message] });
      }
    };

    const loadCurrentContent = () => {
      const payload = {
        id: lessonId,
        introduction: lesson.introduction || emptyI18n(),
        sections: lesson.sections || [],
        styles: lesson.styles || {},
        title: lesson.title,
        description: lesson.description,
        coverImage: lesson.coverImage,
        estimatedMinutes: lesson.estimatedMinutes,
      };
      const text = JSON.stringify(payload, null, 2);
      setLessonPaste(text);
      validateLessonLive(text);
      showToast('Contenu actuel chargé');
    };

    const loadCurrentExercises = () => {
      const payload = { lessonId, exercises: lesson.exercises || [] };
      const text = JSON.stringify(payload, null, 2);
      setExPaste(text);
      validateExLive(text);
      showToast('Exercices actuels chargés');
    };

    const loadLessonTpl = () => {
      const tpl = buildLessonContentTemplate(lessonId);
      const text = JSON.stringify(tpl, null, 2);
      setLessonPaste(text);
      validateLessonLive(text);
      showToast('Modèle leçon chargé (tous les types de sections)');
    };

    const loadExTpl = () => {
      const tpl = buildExercisesTemplate(lessonId);
      const text = JSON.stringify(tpl, null, 2);
      setExPaste(text);
      validateExLive(text);
      showToast('Modèle exercices chargé (tous les types)');
    };

    const insertSection = (type) => {
      try {
        let parsed = lessonPaste.trim()
          ? JSON.parse(lessonPaste)
          : {
            id: lessonId,
            introduction: lesson.introduction || emptyI18n(),
            sections: [...(lesson.sections || [])],
            styles: { ...(lesson.styles || {}), ...SAMPLE_LESSON_STYLES },
          };
        if (!Array.isArray(parsed.sections)) parsed.sections = [];
        parsed.sections.push(buildSectionExample(type));
        if (!parsed.styles || typeof parsed.styles !== 'object') parsed.styles = {};
        parsed.styles = { ...SAMPLE_LESSON_STYLES, ...parsed.styles };
        if (!parsed.id) parsed.id = lessonId;
        const text = JSON.stringify(parsed, null, 2);
        setLessonPaste(text);
        validateLessonLive(text);
        showToast(`Section « ${SECTION_TYPE_LABELS[type] || type} » insérée`);
      } catch (err) {
        showToast(err.message || 'JSON invalide — corrigez avant d’insérer', 'error');
      }
    };

    const insertExercise = (type) => {
      try {
        let parsed = exPaste.trim()
          ? JSON.parse(exPaste)
          : { lessonId, exercises: [...(lesson.exercises || [])] };
        if (!Array.isArray(parsed.exercises)) parsed.exercises = [];
        const used = new Set(parsed.exercises.map((e) => e.id));
        let suffix = String(parsed.exercises.length + 1);
        let example = buildExerciseExample(type, suffix);
        let n = 1;
        while (used.has(example.id) && n < 100) {
          n += 1;
          example = buildExerciseExample(type, `${suffix}-${n}`);
        }
        parsed.exercises.push(example);
        if (!parsed.lessonId) parsed.lessonId = lessonId;
        const text = JSON.stringify(parsed, null, 2);
        setExPaste(text);
        validateExLive(text);
        showToast(`Exercice « ${EXERCISE_TYPE_LABELS[type] || type} » inséré`);
      } catch (err) {
        showToast(err.message || 'JSON invalide — corrigez avant d’insérer', 'error');
      }
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-medium">Leçon</h2>
          <Link to={`/course/${courseId}/lesson/${lessonId}`} className="text-sm text-lh-accent">Voir →</Link>
        </div>

        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-lh-muted border border-lh-border">
          {LESSON_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLessonTab(tab.id)}
              className={`h-10 px-3 sm:px-4 rounded-lg text-sm transition-colors ${
                lessonTab === tab.id
                  ? 'bg-white dark:bg-[#303134] text-lh-text shadow-sm font-medium'
                  : 'text-lh-secondary hover:text-lh-text'
              }`}
            >
              {tab.label}
              {tab.id === 'exercises' && lesson.exercises?.length > 0 && (
                <span className="ml-1.5 text-xs text-lh-faint">({lesson.exercises.length})</span>
              )}
            </button>
          ))}
        </div>

        {lessonTab === 'meta' && (
          <div className="space-y-4">
            <label className="block text-sm text-lh-faint">Id
              <input className="mt-1.5 w-full h-11 px-3 rounded-xl border border-lh-border bg-lh-muted font-mono text-sm" value={lesson.id} onChange={(e) => setPack(updateLessonMeta(pack, lessonId, { id: e.target.value }))} />
            </label>
            <I18nFields label="Titre" value={lesson.title} onChange={(title) => setPack(updateLessonMeta(pack, lessonId, { title }))} />
            <I18nFields label="Description" value={lesson.description} onChange={(description) => setPack(updateLessonMeta(pack, lessonId, { description }))} />
            <label className="block text-sm text-lh-faint">Minutes
              <input type="number" className="mt-1.5 w-full h-11 px-3 rounded-xl border border-lh-border bg-lh-muted text-sm" value={lesson.estimatedMinutes || ''} onChange={(e) => setPack(updateLessonMeta(pack, lessonId, { estimatedMinutes: Number(e.target.value) || 0 }))} />
            </label>
            <label className="block text-sm text-lh-faint">Cover URL
              <input className="mt-1.5 w-full h-11 px-3 rounded-xl border border-lh-border bg-lh-muted text-sm" value={lesson.coverImage || ''} onChange={(e) => setPack(updateLessonMeta(pack, lessonId, { coverImage: e.target.value }))} />
            </label>
            <button type="button" disabled={saving} onClick={() => persist(pack)} className="h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm">Enregistrer métadonnées</button>
          </div>
        )}

        {lessonTab === 'content' && (
          <div className="space-y-6">
            <TemplateGallery kind="section" onInsert={(type) => insertSection(type)} />
            <JsonImportPanel
              title="Contenu leçon (JSON)"
              paste={lessonPaste}
              setPaste={setLessonPaste}
              preview={lessonPreview}
              saving={saving}
              onLoadCurrent={loadCurrentContent}
              onLoadTemplate={loadLessonTpl}
              onValidateLive={validateLessonLive}
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
                  validateLessonLive(ev.target.result);
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
                  setLessonTab('preview');
                } catch (err) {
                  showToast(err.message, 'error');
                }
              }}
            />
          </div>
        )}

        {lessonTab === 'exercises' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-lh-border bg-lh-muted/40 p-3">
              <p className="text-sm text-lh-secondary">
                {(lesson.exercises || []).length} exercice(s) enregistré(s)
                {(lesson.exercises || []).length > 0 && (
                  <span className="text-lh-faint"> — {(lesson.exercises || []).map((ex) => EXERCISE_TYPE_LABELS[ex.type] || ex.type).join(', ')}</span>
                )}
              </p>
            </div>
            <TemplateGallery kind="exercise" onInsert={(type) => insertExercise(type)} />
            <JsonImportPanel
              title="Exercices (JSON)"
              showMode
              mode={exMode}
              setMode={setExMode}
              paste={exPaste}
              setPaste={setExPaste}
              preview={exPreview}
              saving={saving}
              onLoadCurrent={loadCurrentExercises}
              onLoadTemplate={loadExTpl}
              onValidateLive={validateExLive}
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
                  validateExLive(ev.target.result);
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
                  setLessonTab('preview');
                } catch (err) {
                  showToast(err.message, 'error');
                }
              }}
            />
          </div>
        )}

        {lessonTab === 'preview' && (
          <LessonPreviewPanel lesson={lesson} lang={lang} courseId={courseId} />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24">
      <Breadcrumb items={[{ label: 'Admin', path: '/admin' }, { label: 'Cours' }]} />

      <div className="flex flex-wrap items-start justify-between gap-3 mt-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-lh-text">Admin cours</h1>
          <p className="text-sm text-lh-secondary mt-1">Hiérarchie + JSON leçon / exercices · {ACTIVE_PROVIDER}</p>
        </div>
        {needsAuth && (
          <button type="button" onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full border border-lh-border text-sm text-lh-secondary">
            <LogOut size={14} /> Déconnexion
          </button>
        )}
      </div>

      {toast && (
        <div className={`mb-4 p-3 rounded-xl text-sm flex gap-2 ${toast.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
          {toast.text}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="h-11 px-3 rounded-xl border border-lh-border bg-lh-card text-sm"
        >
          {courseOptions.map((c) => (
            <option key={c.id} value={c.id}>{localize(c.title, lang, c.id)}</option>
          ))}
        </select>
        <button type="button" onClick={() => loadPack()} className="h-11 px-3 rounded-xl border border-lh-border text-sm inline-flex items-center gap-1.5"><RefreshCw size={14} /> Recharger</button>
        <Link to={`/course/${courseId}`} className="h-11 px-3 rounded-xl bg-lh-accent-soft text-lh-accent text-sm inline-flex items-center gap-1.5"><BookOpen size={14} /> Voir</Link>
        {seededIds.includes(courseId) && (
          <button type="button" className="h-11 px-3 rounded-xl border border-amber-200 text-amber-800 text-sm" onClick={async () => {
            if (!window.confirm('Reset seed ?')) return;
            try {
              setPack(await courseStorage.resetToSeed(courseId));
              showToast('Seed restauré');
            } catch (err) {
              showToast(err.message, 'error');
            }
          }}>Reset seed</button>
        )}
        <button type="button" className="h-11 px-3 rounded-xl border border-lh-border text-sm" onClick={() => setShowAdvanced((v) => !v)}>
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
              <p className="text-sm text-lh-faint">{label}</p>
            </div>
          ))}
        </div>
      )}

      {showAdvanced && (
        <div className="mb-6 border border-lh-border rounded-2xl p-4 space-y-2 bg-lh-card">
          <p className="text-sm font-medium">Import pack complet (backup)</p>
          <textarea value={packPaste} onChange={(e) => setPackPaste(e.target.value)} rows={5} className="w-full font-mono text-sm rounded-xl border border-lh-border bg-lh-muted p-3" />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="h-10 px-3 rounded-xl border text-sm" onClick={() => setPackPaste(JSON.stringify(buildCoursePackTemplate(courseId), null, 2))}>Charger modèle pack</button>
            <button type="button" className="h-10 px-3 rounded-xl border text-sm" onClick={() => pack && downloadJson(pack, `${courseId}-pack.json`)}>Exporter pack</button>
            <button type="button" className="h-10 px-3 rounded-xl bg-[#1a73e8] text-white text-sm" onClick={async () => {
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
              return <p className={`text-sm ${r.ok ? 'text-green-700' : 'text-red-700'}`}>{r.ok ? 'Pack valide' : r.errors[0]}</p>;
            } catch (e) {
              return <p className="text-sm text-red-700">{e.message}</p>;
            }
          })()}
        </div>
      )}

      {loading ? (
        <p className="text-lh-secondary">Chargement…</p>
      ) : (
        <div className="grid lg:grid-cols-[minmax(300px,360px)_1fr] gap-6 lg:gap-8 items-start">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lh-faint mb-3">Structure</h2>
            {renderTree()}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lh-faint mb-3">Détail</h2>
            <div className="bg-lh-card border border-lh-border rounded-2xl p-4 sm:p-6">
              {renderDetail()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
