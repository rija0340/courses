import React, { useEffect, useState } from 'react';
import { Plus, Save, Code2, LayoutTemplate } from 'lucide-react';
import {
  localize,
  EXERCISE_TYPE_LABELS,
  buildExerciseExample,
  buildExercisesTemplate,
  validateExercisesPayload,
} from '../../../data/coursePackSchema';
import ExerciseQuestion from '../ExerciseQuestion';
import ExerciseEditor from './ExerciseEditor';
import AddBlockPalette, { EmptyBlocksHint, CardChrome } from './AddBlockPalette';
import JsonCodeEditor from './JsonCodeEditor';

function moveItem(arr, index, dir) {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

function uniqueExercise(type, existing) {
  const used = new Set((existing || []).map((e) => e.id));
  let n = existing.length + 1;
  let example = buildExerciseExample(type, String(n));
  while (used.has(example.id) && n < 200) {
    n += 1;
    example = buildExerciseExample(type, String(n));
  }
  return example;
}

export default function LessonExercisesPanel({
  lesson,
  lessonId,
  lang,
  saving,
  onSave,
  onToast,
}) {
  const [mode, setMode] = useState('blocks');
  const [editLang, setEditLang] = useState(lang || 'fr');
  const [editingIndex, setEditingIndex] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [exercises, setExercises] = useState(() => [...(lesson?.exercises || [])]);
  const [jsonText, setJsonText] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setExercises([...(lesson?.exercises || [])]);
    setDirty(false);
    setEditingIndex(null);
    setAnswers({});
    setMode('blocks');
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const mark = (next) => {
    setExercises(next);
    setDirty(true);
  };

  const openCode = () => {
    setJsonText(JSON.stringify({ lessonId, exercises }, null, 2));
    setMode('code');
  };

  const handleSave = async () => {
    try {
      await onSave({ lessonId, exercises }, { mode: 'replace' });
      setDirty(false);
      onToast?.('Exercices enregistrés');
    } catch (err) {
      onToast?.(err.message, 'error');
    }
  };

  const handleAdd = (type) => {
    const example = uniqueExercise(type, exercises);
    const next = [...exercises, example];
    mark(next);
    setEditingIndex(next.length - 1);
    setPaletteOpen(false);
    onToast?.(`Exercice « ${EXERCISE_TYPE_LABELS[type] || type} » ajouté`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-lh-muted border border-lh-border">
          <button
            type="button"
            onClick={() => setMode('blocks')}
            className={`h-9 px-3 rounded-lg text-sm inline-flex items-center gap-1.5 ${mode === 'blocks' ? 'bg-white dark:bg-[#303134] shadow-sm font-medium' : 'text-lh-secondary'}`}
          >
            <LayoutTemplate size={14} /> Blocs
          </button>
          <button
            type="button"
            onClick={openCode}
            className={`h-9 px-3 rounded-lg text-sm inline-flex items-center gap-1.5 ${mode === 'code' ? 'bg-white dark:bg-[#303134] shadow-sm font-medium' : 'text-lh-secondary'}`}
          >
            <Code2 size={14} /> Code JSON
          </button>
        </div>
        {mode === 'blocks' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-lh-faint">{exercises.length} exercice(s)</span>
            {dirty && <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Non sauvé</span>}
            <button
              type="button"
              disabled={saving || !dirty}
              onClick={handleSave}
              className="h-9 px-3 rounded-lg bg-[#1a73e8] text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-1.5"
            >
              <Save size={14} /> Enregistrer
            </button>
          </div>
        )}
      </div>

      {mode === 'blocks' && (
        <div className="space-y-3">
          {exercises.length === 0 ? (
            <EmptyBlocksHint kind="exercise" onAddClick={() => setPaletteOpen(true)} />
          ) : (
            exercises.map((exercise, index) => {
              const editing = editingIndex === index;
              const label = EXERCISE_TYPE_LABELS[exercise.type] || exercise.type;
              const title = localize(exercise.prompt, editLang) || label;
              return (
                <CardChrome
                  key={exercise.id || index}
                  index={index}
                  total={exercises.length}
                  title={title}
                  subtitle={`${label} · ${exercise.id}`}
                  editing={editing}
                  onMoveUp={() => mark(moveItem(exercises, index, -1))}
                  onMoveDown={() => mark(moveItem(exercises, index, 1))}
                  onEdit={() => setEditingIndex(editing ? null : index)}
                  onDuplicate={() => {
                    const clone = structuredClone(exercise);
                    clone.id = `${exercise.id}-copy-${Date.now().toString(36).slice(-4)}`;
                    const next = [...exercises];
                    next.splice(index + 1, 0, clone);
                    mark(next);
                  }}
                  onDelete={() => {
                    if (!window.confirm('Supprimer cet exercice ?')) return;
                    mark(exercises.filter((_, i) => i !== index));
                    setEditingIndex(null);
                  }}
                >
                  {editing ? (
                    <ExerciseEditor
                      exercise={exercise}
                      editLang={editLang}
                      onEditLangChange={setEditLang}
                      onChange={(updated) => {
                        mark(exercises.map((e, i) => (i === index ? updated : e)));
                      }}
                    />
                  ) : (
                    <div className="max-h-72 overflow-auto">
                      <ExerciseQuestion
                        exercise={exercise}
                        lang={editLang}
                        value={answers[exercise.id]}
                        onChange={(val) => setAnswers((prev) => ({ ...prev, [exercise.id]: val }))}
                      />
                    </div>
                  )}
                </CardChrome>
              );
            })
          )}

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="w-full h-12 rounded-2xl border border-dashed border-lh-border text-sm font-semibold text-lh-secondary hover:border-lh-accent hover:text-lh-accent inline-flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Ajouter un exercice
          </button>
        </div>
      )}

      {mode === 'code' && (
        <JsonCodeEditor
          title="Exercices (JSON)"
          value={jsonText}
          onChange={setJsonText}
          filename={`${lessonId}-exercises.json`}
          dumpLabel="Dump tous types"
          onLoadCurrent={() => {
            setJsonText(JSON.stringify({ lessonId, exercises }, null, 2));
          }}
          onLoadFullDump={() => {
            setJsonText(JSON.stringify(buildExercisesTemplate(lessonId), null, 2));
          }}
          validate={(parsed) => validateExercisesPayload(parsed, { expectedLessonId: lessonId })}
          saving={saving}
          footerExtra={
            <p className="text-xs text-lh-secondary">
              Appliquer remplace toute la liste d’exercices de cette leçon.
            </p>
          }
          onApply={async (data) => {
            try {
              await onSave(data, { mode: 'replace' });
              setExercises([...(data.exercises || [])]);
              setDirty(false);
              setMode('blocks');
              onToast?.('Exercices appliqués depuis le JSON');
            } catch (err) {
              onToast?.(err.message, 'error');
            }
          }}
        />
      )}

      {paletteOpen && (
        <AddBlockPalette kind="exercise" onAdd={handleAdd} onClose={() => setPaletteOpen(false)} />
      )}
    </div>
  );
}
