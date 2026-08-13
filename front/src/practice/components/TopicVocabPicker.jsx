/**
 * Topic vocab picker: choose tab (vocab / symptoms / conditions),
 * then select all or specific words for practice.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import {
  PRACTICE_TOPIC_TABS,
  MAX_PRACTICE_VOCAB,
  collectTopicVocabulary,
} from '../domain/topicVocabulary';
import { TOPIC_TAB_LABEL_KEYS } from '../data/simulationUiCopy';
import { coerceDisplayText } from '../../data/vocabs/vocabItemStructure';

export default function TopicVocabPicker({
  items,
  categories,
  categoryId,
  topicTab,
  onTopicTabChange,
  selectedWordIds,
  onSelectedWordIdsChange,
  ui,
}) {
  const available = useMemo(
    () =>
      collectTopicVocabulary(items, categories, categoryId, {
        tabs: [topicTab],
        limit: 80,
      }),
    [items, categories, categoryId, topicTab]
  );

  const availableIds = useMemo(
    () => available.words.map((w) => w.id),
    [available.words]
  );

  const poolKey = `${categoryId}|${topicTab}|${availableIds.join('|')}`;
  const prevPoolKey = useRef('');
  const didInit = useRef(false);

  // Sync selection when category/tab pool changes; keep saved selection on first mount if valid
  useEffect(() => {
    if (!categoryId) return;

    if (!didInit.current) {
      didInit.current = true;
      prevPoolKey.current = poolKey;
      const keep = (selectedWordIds || []).filter((id) => availableIds.includes(id));
      if (keep.length) {
        onSelectedWordIdsChange(keep);
        return;
      }
      onSelectedWordIdsChange(availableIds);
      return;
    }

    if (prevPoolKey.current === poolKey) return;
    prevPoolKey.current = poolKey;
    onSelectedWordIdsChange(availableIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolKey]);

  const selectedSet = useMemo(
    () => new Set(selectedWordIds || []),
    [selectedWordIds]
  );

  const selectedCount = available.words.filter((w) => selectedSet.has(w.id)).length;
  const willTruncate = selectedCount > MAX_PRACTICE_VOCAB;

  const toggle = (id) => {
    const next = new Set(selectedWordIds || []);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedWordIdsChange([...next]);
  };

  const selectAll = () => onSelectedWordIdsChange(availableIds);
  const clearAll = () => onSelectedWordIdsChange([]);

  if (!categoryId) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRACTICE_TOPIC_TABS.map((tabId) => {
          const labelKey = TOPIC_TAB_LABEL_KEYS[tabId];
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => onTopicTabChange(tabId)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                topicTab === tabId
                  ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                  : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
              }`}
            >
              {ui[labelKey] || tabId}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-[#f8f9fa] border border-[#dadce0] p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-[#5f6368]">
            {ui.selectWords} — {ui.t('selectedCount', { n: selectedCount })}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={selectAll}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#dadce0] text-[#1a73e8]"
            >
              {ui.selectAll}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#dadce0] text-[#5f6368]"
            >
              {ui.clearAll}
            </button>
          </div>
        </div>

        {available.words.length === 0 ? (
          <p className="text-[13px] text-[#c5221f]">{ui.noWords}</p>
        ) : (
          <div className="max-h-40 overflow-y-auto space-y-1">
            {available.words.map((w) => {
              const checked = selectedSet.has(w.id);
              return (
                <label
                  key={w.id}
                  className="flex items-center gap-2.5 min-h-[40px] px-2 py-1 rounded-lg hover:bg-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(w.id)}
                    className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8] focus:ring-[#1a73e8]"
                  />
                  <span className="text-[13px] text-[#202124] font-medium">{coerceDisplayText(w.en)}</span>
                  {coerceDisplayText(w.fr) && (
                    <span className="text-[12px] text-[#5f6368] truncate">{coerceDisplayText(w.fr)}</span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {willTruncate && (
          <p className="text-[12px] text-amber-700">
            {ui.t('truncatedWarn', { max: MAX_PRACTICE_VOCAB, n: MAX_PRACTICE_VOCAB })}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Resolve selected words for generate() from full item list.
 */
export function resolveSelectedTopicWords(
  items,
  categories,
  categoryId,
  topicTab,
  selectedWordIds
) {
  const { topicLabel, words } = collectTopicVocabulary(items, categories, categoryId, {
    tabs: [topicTab],
    wordIds: selectedWordIds?.length ? selectedWordIds : null,
    limit: 80,
  });
  return { topicLabel, words };
}
