import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { emptyI18n } from '../../../data/coursePackMutations';
import { I18nLangField, LangTabs } from './adminShared';

export default function ExerciseEditor({ exercise, onChange, editLang, onEditLangChange }) {
  const ex = exercise || { type: 'multiple-choice' };
  const patch = (p) => onChange({ ...ex, ...p });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-lh-faint">{ex.type}</p>
          <input
            value={ex.id || ''}
            onChange={(e) => patch({ id: e.target.value })}
            className="h-8 w-40 rounded-lg border border-lh-border bg-lh-muted px-2 text-xs font-mono"
            title="id"
          />
        </div>
        <LangTabs lang={editLang} onChange={onEditLangChange} />
      </div>

      <I18nLangField label="Consigne / question" value={ex.prompt} onChange={(prompt) => patch({ prompt })} lang={editLang} multiline rows={2} />

      <label className="block text-[11px] font-semibold uppercase text-lh-faint">
        Points
        <input
          type="number"
          min={0}
          value={ex.points ?? 1}
          onChange={(e) => patch({ points: Number(e.target.value) || 0 })}
          className="mt-1 h-10 w-28 rounded-xl border border-lh-border bg-lh-muted px-3 text-sm block"
        />
      </label>

      {(ex.type === 'multiple-choice' || ex.type === 'multi-select') && (
        <ChoicesEditor
          choices={ex.choices || []}
          multi={ex.type === 'multi-select'}
          correctId={ex.correctChoiceId}
          correctIds={ex.correctChoiceIds || []}
          editLang={editLang}
          onChangeChoices={(choices) => patch({ choices })}
          onChangeCorrectId={(correctChoiceId) => patch({ correctChoiceId })}
          onChangeCorrectIds={(correctChoiceIds) => patch({ correctChoiceIds })}
        />
      )}

      {ex.type === 'true-false' && (
        <div className="flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={ex.correct === true} onChange={() => patch({ correct: true })} /> Vrai
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={ex.correct === false} onChange={() => patch({ correct: false })} /> Faux
          </label>
        </div>
      )}

      {(ex.type === 'fill-blank' || ex.type === 'short-answer' || ex.type === 'error-correction' || ex.type === 'transform') && (
        <>
          {(ex.type === 'fill-blank' || ex.type === 'error-correction' || ex.type === 'transform') && (
            <I18nLangField
              label={ex.type === 'fill-blank' ? 'Phrase (avec ___ )' : 'Source'}
              value={ex.type === 'fill-blank' ? ex.sentence : ex.source}
              onChange={(val) => patch(ex.type === 'fill-blank' ? { sentence: val } : { source: val })}
              lang={editLang}
              multiline
              rows={2}
            />
          )}
          <AnswersList
            answers={ex.acceptedAnswers || []}
            onChange={(acceptedAnswers) => patch({ acceptedAnswers })}
            editLang={editLang}
          />
        </>
      )}

      {ex.type === 'match' && (
        <PairsEditor pairs={ex.pairs || []} onChange={(pairs) => patch({ pairs })} editLang={editLang} />
      )}

      {ex.type === 'reorder' && (
        <ReorderEditor
          items={ex.items || []}
          correctOrder={ex.correctOrder || []}
          onChangeItems={(items) => patch({ items })}
          onChangeOrder={(correctOrder) => patch({ correctOrder })}
          editLang={editLang}
        />
      )}

      {ex.type === 'categorize' && (
        <CategorizeEditor
          categories={ex.categories || []}
          items={ex.items || []}
          onChangeCategories={(categories) => patch({ categories })}
          onChangeItems={(items) => patch({ items })}
          editLang={editLang}
        />
      )}

      {ex.type === 'cloze' && (
        <>
          <I18nLangField
            label="Texte (trous {{0}}, {{1}}…)"
            value={ex.text}
            onChange={(text) => patch({ text })}
            lang={editLang}
            multiline
            rows={3}
          />
          <ClozeBlanksEditor blanks={ex.blanks || []} onChange={(blanks) => patch({ blanks })} editLang={editLang} />
        </>
      )}
    </div>
  );
}

function ChoicesEditor({
  choices, multi, correctId, correctIds, editLang,
  onChangeChoices, onChangeCorrectId, onChangeCorrectIds,
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase text-lh-faint">Choix</p>
      {choices.map((c, i) => (
        <div key={c.id || i} className="rounded-xl border border-lh-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            {multi ? (
              <input
                type="checkbox"
                checked={correctIds.includes(c.id)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...correctIds, c.id]
                    : correctIds.filter((id) => id !== c.id);
                  onChangeCorrectIds(next);
                }}
              />
            ) : (
              <input
                type="radio"
                name="correct-choice"
                checked={correctId === c.id}
                onChange={() => onChangeCorrectId(c.id)}
              />
            )}
            <span className="text-xs text-lh-secondary">Bonne réponse</span>
            <button
              type="button"
              className="ml-auto text-lh-faint hover:text-red-500"
              onClick={() => onChangeChoices(choices.filter((_, j) => j !== i))}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <I18nLangField
            value={c.text}
            onChange={(text) => {
              const next = choices.map((ch, j) => (j === i ? { ...ch, text } : ch));
              onChangeChoices(next);
            }}
            lang={editLang}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChangeChoices([
            ...choices,
            { id: `c${Date.now().toString(36)}`, text: emptyI18n() },
          ])
        }
        className="h-9 px-3 rounded-lg bg-lh-muted text-xs font-semibold inline-flex items-center gap-1"
      >
        <Plus size={12} /> Option
      </button>
    </div>
  );
}

function AnswersList({ answers, onChange, editLang }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase text-lh-faint">Réponses acceptées</p>
      {answers.map((ans, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <I18nLangField
              value={typeof ans === 'object' ? ans : emptyI18n(String(ans))}
              onChange={(val) => {
                const next = answers.map((a, j) => (j === i ? val : a));
                onChange(next);
              }}
              lang={editLang}
            />
          </div>
          <button type="button" onClick={() => onChange(answers.filter((_, j) => j !== i))} className="text-lh-faint hover:text-red-500 mt-2">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...answers, emptyI18n()])}
        className="text-xs font-semibold text-lh-accent"
      >
        + Réponse
      </button>
    </div>
  );
}

function PairsEditor({ pairs, onChange, editLang }) {
  return (
    <div className="space-y-2">
      {pairs.map((p, i) => (
        <div key={p.id || i} className="grid sm:grid-cols-2 gap-2 rounded-xl border border-lh-border p-3">
          <I18nLangField
            label="Gauche"
            value={p.left}
            onChange={(left) => onChange(pairs.map((x, j) => (j === i ? { ...x, left } : x)))}
            lang={editLang}
          />
          <I18nLangField
            label="Droite"
            value={p.right}
            onChange={(right) => onChange(pairs.map((x, j) => (j === i ? { ...x, right } : x)))}
            lang={editLang}
          />
          <button type="button" className="text-xs text-red-600 sm:col-span-2" onClick={() => onChange(pairs.filter((_, j) => j !== i))}>
            Supprimer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...pairs, { id: `p${Date.now().toString(36)}`, left: emptyI18n(), right: emptyI18n() }])}
        className="text-xs font-semibold text-lh-accent"
      >
        + Paire
      </button>
    </div>
  );
}

function ReorderEditor({ items, correctOrder, onChangeItems, onChangeOrder, editLang }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id || i} className="flex gap-2 items-start">
          <div className="flex-1">
            <I18nLangField
              value={item.text}
              onChange={(text) => onChangeItems(items.map((it, j) => (j === i ? { ...it, text } : it)))}
              lang={editLang}
            />
          </div>
          <button type="button" onClick={() => {
            const id = item.id;
            onChangeItems(items.filter((_, j) => j !== i));
            onChangeOrder((correctOrder || []).filter((x) => x !== id));
          }} className="text-lh-faint hover:text-red-500 mt-2">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const id = `it${Date.now().toString(36)}`;
          onChangeItems([...items, { id, text: emptyI18n() }]);
          onChangeOrder([...(correctOrder || []), id]);
        }}
        className="text-xs font-semibold text-lh-accent"
      >
        + Élément
      </button>
      <p className="text-[11px] text-lh-faint">Ordre correct = ordre de la liste (ids : {(correctOrder || []).join(', ') || '—'})</p>
    </div>
  );
}

function CategorizeEditor({ categories, items, onChangeCategories, onChangeItems, editLang }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase text-lh-faint mb-2">Catégories</p>
        {categories.map((cat, i) => (
          <div key={cat.id || i} className="flex gap-2 mb-2">
            <div className="flex-1">
              <I18nLangField
                value={cat.label}
                onChange={(label) => onChangeCategories(categories.map((c, j) => (j === i ? { ...c, label } : c)))}
                lang={editLang}
              />
            </div>
            <button type="button" onClick={() => onChangeCategories(categories.filter((_, j) => j !== i))} className="text-lh-faint hover:text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChangeCategories([...categories, { id: `cat${Date.now().toString(36)}`, label: emptyI18n() }])}
          className="text-xs font-semibold text-lh-accent"
        >
          + Catégorie
        </button>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase text-lh-faint mb-2">Items</p>
        {items.map((item, i) => (
          <div key={item.id || i} className="grid sm:grid-cols-2 gap-2 mb-2 rounded-xl border border-lh-border p-2">
            <I18nLangField
              value={item.text}
              onChange={(text) => onChangeItems(items.map((it, j) => (j === i ? { ...it, text } : it)))}
              lang={editLang}
            />
            <select
              value={item.categoryId || ''}
              onChange={(e) => onChangeItems(items.map((it, j) => (j === i ? { ...it, categoryId: e.target.value } : it)))}
              className="h-10 rounded-xl border border-lh-border bg-lh-muted px-2 text-sm"
            >
              <option value="">Catégorie…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.id}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChangeItems([...items, { id: `ci${Date.now().toString(36)}`, text: emptyI18n(), categoryId: categories[0]?.id || '' }])}
          className="text-xs font-semibold text-lh-accent"
        >
          + Item
        </button>
      </div>
    </div>
  );
}

function ClozeBlanksEditor({ blanks, onChange, editLang }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase text-lh-faint">Trous</p>
      {blanks.map((b, i) => (
        <div key={i} className="rounded-xl border border-lh-border p-3 space-y-2">
          <p className="text-xs text-lh-faint">Trou {`{{${i}}}`}</p>
          <AnswersList
            answers={b.acceptedAnswers || []}
            onChange={(acceptedAnswers) => onChange(blanks.map((x, j) => (j === i ? { ...x, acceptedAnswers } : x)))}
            editLang={editLang}
          />
          <button type="button" className="text-xs text-red-600" onClick={() => onChange(blanks.filter((_, j) => j !== i))}>
            Supprimer trou
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...blanks, { acceptedAnswers: [emptyI18n()] }])}
        className="text-xs font-semibold text-lh-accent"
      >
        + Trou
      </button>
    </div>
  );
}
