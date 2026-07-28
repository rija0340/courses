import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, Check, LogOut, RefreshCw, BookOpen,
  Plus, Trash2, ChevronUp, ChevronDown
} from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import AdminAuth from '../components/vocabs/admin/AdminAuth';
import LessonSections from '../components/lesson/LessonSections';
import ExerciseQuestion from '../components/lesson/ExerciseQuestion';
import LessonContentPanel from '../components/lesson/admin/LessonContentPanel';
import LessonExercisesPanel from '../components/lesson/admin/LessonExercisesPanel';
import JsonCodeEditor from '../components/lesson/admin/JsonCodeEditor';
import courseStorage from '../services/courseStorage';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';
import {
  localize,
  summarizePack,
  validateCoursePack,
  buildCoursePackTemplate,
  EXERCISE_TYPE_LABELS,
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
          Aucun contenu à prévisualiser — ajoutez des sections ou des exercices.
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
              {tab.id === 'content' && lesson.sections?.length > 0 && (
                <span className="ml-1.5 text-xs text-lh-faint">({lesson.sections.length})</span>
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
          <LessonContentPanel
            key={`content-${lessonId}`}
            lesson={lesson}
            lessonId={lessonId}
            lang={lang}
            saving={saving}
            onToast={showToast}
            onSave={async (payload) => {
              const result = await courseStorage.importLessonContent(courseId, lessonId, payload);
              if (!result.ok) throw new Error(result.errors?.[0] || 'Échec enregistrement contenu');
              setPack(result.pack);
            }}
          />
        )}

        {lessonTab === 'exercises' && (
          <LessonExercisesPanel
            key={`exercises-${lessonId}`}
            lesson={lesson}
            lessonId={lessonId}
            lang={lang}
            saving={saving}
            onToast={showToast}
            onSave={async (payload, opts) => {
              const result = await courseStorage.importLessonExercises(courseId, lessonId, payload, opts);
              if (!result.ok) throw new Error(result.errors?.[0] || 'Échec enregistrement exercices');
              setPack(result.pack);
            }}
          />
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
          <p className="text-sm text-lh-secondary mt-1">Hiérarchie + édition visuelle leçon / exercices · {ACTIVE_PROVIDER}</p>
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
        <div className="mb-6">
          <JsonCodeEditor
            title="Pack complet (backup)"
            value={packPaste || (pack ? JSON.stringify(pack, null, 2) : '')}
            onChange={setPackPaste}
            height="280px"
            filename={`${courseId}-pack.json`}
            dumpLabel="Modèle pack"
            onLoadCurrent={() => {
              if (pack) setPackPaste(JSON.stringify(pack, null, 2));
            }}
            onLoadFullDump={() => {
              setPackPaste(JSON.stringify(buildCoursePackTemplate(courseId), null, 2));
            }}
            validate={(parsed) => validateCoursePack(parsed, { expectedCourseId: courseId })}
            applyLabel="Fusionner pack"
            saving={saving}
            onApply={async (data) => {
              const result = await courseStorage.importPack(courseId, data, { mode: 'merge' });
              if (!result.ok) {
                showToast(result.errors[0], 'error');
                return;
              }
              setPack(result.pack);
              showToast('Pack fusionné');
            }}
          />
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
