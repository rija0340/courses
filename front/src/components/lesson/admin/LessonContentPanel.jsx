import React, { useState } from 'react';
import { Plus, Save, Code2, LayoutTemplate } from 'lucide-react';
import {
  localize,
  SECTION_TYPE_LABELS,
  buildSectionExample,
  buildLessonContentTemplate,
  SAMPLE_LESSON_STYLES,
  validateLessonContentPayload,
} from '../../../data/coursePackSchema';
import { emptyI18n } from '../../../data/coursePackMutations';
import LessonSections from '../LessonSections';
import SectionEditor from './SectionEditor';
import AddBlockPalette, { EmptyBlocksHint, CardChrome } from './AddBlockPalette';
import JsonCodeEditor from './JsonCodeEditor';
import { I18nLangField, LangTabs } from './adminShared';

function moveItem(arr, index, dir) {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

export default function LessonContentPanel({
  lesson,
  lessonId,
  lang,
  saving,
  onSave,
  onToast,
}) {
  const [mode, setMode] = useState('blocks'); // blocks | code
  const [editLang, setEditLang] = useState(lang || 'fr');
  const [editingIndex, setEditingIndex] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [introduction, setIntroduction] = useState(lesson?.introduction || emptyI18n());
  const [sections, setSections] = useState(() => [...(lesson?.sections || [])]);
  const [styles, setStyles] = useState(() => ({ ...SAMPLE_LESSON_STYLES, ...(lesson?.styles || {}) }));
  const [jsonText, setJsonText] = useState('');

  // Sync when lesson id changes
  React.useEffect(() => {
    setIntroduction(lesson?.introduction || emptyI18n());
    setSections([...(lesson?.sections || [])]);
    setStyles({ ...SAMPLE_LESSON_STYLES, ...(lesson?.styles || {}) });
    setDirty(false);
    setEditingIndex(null);
    setMode('blocks');
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const mark = (nextSections, nextIntro, nextStyles) => {
    if (nextSections != null) setSections(nextSections);
    if (nextIntro != null) setIntroduction(nextIntro);
    if (nextStyles != null) setStyles(nextStyles);
    setDirty(true);
  };

  const buildPayload = () => ({
    id: lessonId,
    introduction,
    sections,
    styles,
    title: lesson?.title,
    description: lesson?.description,
    coverImage: lesson?.coverImage,
    estimatedMinutes: lesson?.estimatedMinutes,
  });

  const openCode = () => {
    setJsonText(JSON.stringify(buildPayload(), null, 2));
    setMode('code');
  };

  const handleSave = async () => {
    try {
      await onSave(buildPayload());
      setDirty(false);
      onToast?.('Contenu enregistré');
    } catch (err) {
      onToast?.(err.message, 'error');
    }
  };

  const handleAdd = (type) => {
    const example = buildSectionExample(type);
    const next = [...sections, example];
    mark(next, null, { ...SAMPLE_LESSON_STYLES, ...styles });
    setEditingIndex(next.length - 1);
    setPaletteOpen(false);
    onToast?.(`Section « ${SECTION_TYPE_LABELS[type] || type} » ajoutée`);
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
        <div className="space-y-4">
          <div className="rounded-2xl border border-lh-border bg-lh-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-lh-text">Introduction</h3>
              <LangTabs lang={editLang} onChange={setEditLang} />
            </div>
            <I18nLangField
              value={introduction}
              onChange={(v) => mark(null, v, null)}
              lang={editLang}
              multiline
              rows={3}
            />
          </div>

          {sections.length === 0 ? (
            <EmptyBlocksHint kind="section" onAddClick={() => setPaletteOpen(true)} />
          ) : (
            <div className="space-y-3">
              {sections.map((section, index) => {
                const editing = editingIndex === index;
                const label = SECTION_TYPE_LABELS[section.type] || section.type;
                const title = localize(section.title, editLang) || label;
                return (
                  <CardChrome
                    key={`${section.type}-${index}`}
                    index={index}
                    total={sections.length}
                    title={title}
                    subtitle={label}
                    editing={editing}
                    onMoveUp={() => mark(moveItem(sections, index, -1))}
                    onMoveDown={() => mark(moveItem(sections, index, 1))}
                    onEdit={() => setEditingIndex(editing ? null : index)}
                    onDuplicate={() => {
                      const next = [...sections];
                      next.splice(index + 1, 0, structuredClone(section));
                      mark(next);
                    }}
                    onDelete={() => {
                      if (!window.confirm('Supprimer cette section ?')) return;
                      mark(sections.filter((_, i) => i !== index));
                      setEditingIndex(null);
                    }}
                  >
                    {editing ? (
                      <SectionEditor
                        section={section}
                        editLang={editLang}
                        onEditLangChange={setEditLang}
                        onChange={(updated) => {
                          const next = sections.map((s, i) => (i === index ? updated : s));
                          mark(next);
                        }}
                      />
                    ) : (
                      <div className="pointer-events-none opacity-95 scale-[0.98] origin-top max-h-64 overflow-hidden">
                        <LessonSections
                          sections={[section]}
                          styles={styles}
                          lang={editLang}
                          introduction={null}
                        />
                      </div>
                    )}
                  </CardChrome>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="w-full h-12 rounded-2xl border border-dashed border-lh-border text-sm font-semibold text-lh-secondary hover:border-lh-accent hover:text-lh-accent inline-flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Ajouter une section
          </button>
        </div>
      )}

      {mode === 'code' && (
        <JsonCodeEditor
          title="Contenu leçon (JSON)"
          value={jsonText}
          onChange={setJsonText}
          filename={`${lessonId}-content.json`}
          dumpLabel="Dump tous types"
          onLoadCurrent={() => {
            const text = JSON.stringify(buildPayload(), null, 2);
            setJsonText(text);
          }}
          onLoadFullDump={() => {
            setJsonText(JSON.stringify(buildLessonContentTemplate(lessonId), null, 2));
          }}
          validate={(parsed) => validateLessonContentPayload(parsed, { expectedLessonId: lessonId })}
          saving={saving}
          onApply={async (data) => {
            try {
              await onSave(data);
              setIntroduction(data.introduction || emptyI18n());
              setSections([...(data.sections || [])]);
              setStyles({ ...SAMPLE_LESSON_STYLES, ...(data.styles || {}) });
              setDirty(false);
              setMode('blocks');
              onToast?.('Contenu appliqué depuis le JSON');
            } catch (err) {
              onToast?.(err.message, 'error');
            }
          }}
        />
      )}

      {paletteOpen && (
        <AddBlockPalette kind="section" onAdd={handleAdd} onClose={() => setPaletteOpen(false)} />
      )}
    </div>
  );
}
