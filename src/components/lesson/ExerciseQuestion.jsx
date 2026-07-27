import React, { useEffect, useMemo, useState } from 'react';
import { localize } from '../../data/coursePackSchema';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeAnswer(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function getExerciseMaxPoints(exercise) {
  return typeof exercise.points === 'number' ? exercise.points : 1;
}

export function gradeExercise(exercise, answer) {
  const max = getExerciseMaxPoints(exercise);
  switch (exercise.type) {
    case 'multiple-choice':
      return { correct: answer === exercise.correctChoiceId, score: answer === exercise.correctChoiceId ? max : 0, max };
    case 'true-false':
      return { correct: answer === exercise.correct, score: answer === exercise.correct ? max : 0, max };
    case 'fill-blank': {
      const ok = (exercise.acceptedAnswers || []).some(
        (a) => normalizeAnswer(a) === normalizeAnswer(answer)
      );
      return { correct: ok, score: ok ? max : 0, max };
    }
    case 'match': {
      const pairs = exercise.pairs || [];
      if (!answer || typeof answer !== 'object') return { correct: false, score: 0, max };
      const allOk = pairs.every((p) => answer[p.id] === p.id);
      return { correct: allOk, score: allOk ? max : 0, max };
    }
    case 'reorder': {
      const expected = exercise.correctOrder || [];
      const given = Array.isArray(answer) ? answer : [];
      const ok =
        expected.length === given.length && expected.every((id, i) => id === given[i]);
      return { correct: ok, score: ok ? max : 0, max };
    }
    default:
      return { correct: false, score: 0, max };
  }
}

function ChoiceButton({ selected, onClick, children, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left min-h-[48px] px-4 py-3 rounded-xl border text-[15px] transition-all ${
        selected
          ? 'border-[#1a73e8] bg-[#e8f0fe] text-[#174ea6] dark:bg-[#1a3a5c] dark:text-[#aecbfa]'
          : 'border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] text-[#202124] dark:text-[#e8eaed] hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043]'
      } disabled:opacity-60`}
    >
      {children}
    </button>
  );
}

export default function ExerciseQuestion({ exercise, lang, value, onChange, disabled }) {
  const shuffledRights = useMemo(() => {
    if (exercise.type !== 'match') return [];
    return shuffle((exercise.pairs || []).map((p) => ({ id: p.id, text: p.right })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const [reorderItems, setReorderItems] = useState(() => {
    if (exercise.type !== 'reorder') return [];
    return shuffle(exercise.items || []);
  });

  useEffect(() => {
    if (exercise.type !== 'reorder') return;
    if (value) return;
    onChange(reorderItems.map((it) => it.id));
    // intentionally only on mount / exercise change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  if (exercise.type === 'multiple-choice') {
    return (
      <div className="space-y-2.5">
        {(exercise.choices || []).map((c) => (
          <ChoiceButton
            key={c.id}
            selected={value === c.id}
            disabled={disabled}
            onClick={() => onChange(c.id)}
          >
            {localize(c.text, lang)}
          </ChoiceButton>
        ))}
      </div>
    );
  }

  if (exercise.type === 'true-false') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton selected={value === true} disabled={disabled} onClick={() => onChange(true)}>
          {lang === 'en' ? 'True' : lang === 'mg' ? 'Marina' : 'Vrai'}
        </ChoiceButton>
        <ChoiceButton selected={value === false} disabled={disabled} onClick={() => onChange(false)}>
          {lang === 'en' ? 'False' : lang === 'mg' ? 'Diso' : 'Faux'}
        </ChoiceButton>
      </div>
    );
  }

  if (exercise.type === 'fill-blank') {
    return (
      <div>
        <p className="text-[16px] text-[#3c4043] dark:text-[#dadce0] mb-4 font-medium">
          {localize(exercise.sentence, lang)}
        </p>
        <input
          type="text"
          value={value || ''}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] text-[#202124] dark:text-[#e8eaed] outline-none focus:border-[#1a73e8]"
          placeholder={lang === 'en' ? 'Your answer' : lang === 'mg' ? 'Valiny' : 'Votre réponse'}
        />
      </div>
    );
  }

  if (exercise.type === 'match') {
    const mapping = value || {};
    return (
      <div className="space-y-3">
        {(exercise.pairs || []).map((pair) => (
          <div key={pair.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl bg-[#f1f3f4] dark:bg-[#303134] text-[14px] font-medium">
              {localize(pair.left, lang)}
            </div>
            <select
              disabled={disabled}
              value={mapping[pair.id] || ''}
              onChange={(e) => onChange({ ...mapping, [pair.id]: e.target.value })}
              className="flex-1 h-11 px-3 rounded-xl border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] text-[14px]"
            >
              <option value="">—</option>
              {shuffledRights.map((r) => (
                <option key={r.id} value={r.id}>
                  {localize(r.text, lang)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  if (exercise.type === 'reorder') {
    const move = (from, to) => {
      if (to < 0 || to >= reorderItems.length) return;
      const next = [...reorderItems];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      setReorderItems(next);
      onChange(next.map((it) => it.id));
    };

    return (
      <div className="space-y-2">
        {reorderItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 bg-white dark:bg-[#303134] border border-[#dadce0] dark:border-[#5f6368] rounded-xl px-3 py-2"
          >
            <span className="flex-1 text-[15px]">{localize(item.text, lang)}</span>
            <button
              type="button"
              disabled={disabled || index === 0}
              onClick={() => move(index, index - 1)}
              className="w-10 h-10 rounded-lg border border-[#dadce0] dark:border-[#5f6368] disabled:opacity-40"
              aria-label="Up"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={disabled || index === reorderItems.length - 1}
              onClick={() => move(index, index + 1)}
              className="w-10 h-10 rounded-lg border border-[#dadce0] dark:border-[#5f6368] disabled:opacity-40"
              aria-label="Down"
            >
              ↓
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className="text-sm text-[#5f6368]">
      Type non supporté: {exercise.type}
    </p>
  );
}
