import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { AppContext } from '../../App';
import { simulationService } from '../services/simulationService';
import ConversationPlayer from './ConversationPlayer';
import TopicVocabPicker, { resolveSelectedTopicWords } from './TopicVocabPicker';
import { usesRemoteLlm } from '../config';
import { flattenTree } from '../../utils/categoryTree';
import {
  MAX_PRACTICE_VOCAB,
  capVocabularyForGeneration,
} from '../domain/topicVocabulary';
import { suggestTurnCount } from '../domain/vocabCoverage';
import {
  loadSimulationSession,
  saveSimulationSession,
} from '../domain/simulationSession';
import { stopPlayback } from '../services/speechService';
import { simulationUi } from '../data/simulationUiCopy';

export default function SimulationPanel({
  defaultTheme = '',
  categories = [],
  items = [],
  defaultCategoryId = '',
}) {
  const { lang } = useContext(AppContext);
  const ui = useMemo(() => simulationUi(lang), [lang]);
  const presets = useMemo(() => simulationService.listPresets(), []);
  const topicOptions = useMemo(
    () => flattenTree(categories, lang),
    [categories, lang]
  );

  const saved = useMemo(() => loadSimulationSession(), []);

  const [mode, setMode] = useState(
    saved?.mode || (defaultCategoryId ? 'topic' : 'preset')
  );
  const [promptId, setPromptId] = useState(saved?.promptId || presets[0]?.id || '');
  const [categoryId, setCategoryId] = useState(
    saved?.categoryId || defaultCategoryId || ''
  );
  const [topicTab, setTopicTab] = useState(saved?.topicTab || 'vocab');
  const [selectedWordIds, setSelectedWordIds] = useState(
    saved?.selectedWordIds || []
  );
  const [theme, setTheme] = useState(
    saved?.theme || defaultTheme || presets[0]?.theme || ''
  );
  const [customPrompt, setCustomPrompt] = useState(saved?.customPrompt || '');
  const [length, setLength] = useState(saved?.length || 'long');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [script, setScript] = useState(saved?.script || null);

  const selected = presets.find((p) => p.id === promptId);

  const topicSelection = useMemo(
    () =>
      resolveSelectedTopicWords(
        items,
        categories,
        categoryId,
        topicTab,
        selectedWordIds
      ),
    [items, categories, categoryId, topicTab, selectedWordIds]
  );

  useEffect(() => {
    saveSimulationSession({
      mode,
      promptId,
      categoryId,
      topicTab,
      selectedWordIds,
      theme,
      customPrompt,
      length,
      script,
    });
  }, [
    mode,
    promptId,
    categoryId,
    topicTab,
    selectedWordIds,
    theme,
    customPrompt,
    length,
    script,
  ]);

  const handlePresetChange = (id) => {
    setPromptId(id);
    const p = presets.find((x) => x.id === id);
    if (p) setTheme(p.theme);
  };

  const handleTopicChange = (id) => {
    setCategoryId(id);
    const opt = topicOptions.find((t) => t.id === id);
    if (opt) setTheme(`Conversation about ${opt.label}`);
  };

  const buildGenerateArgs = () => {
    const useTopic = mode === 'topic' && categoryId;
    const useCustom = mode === 'custom';
    const { words: capped, truncated } = useTopic
      ? capVocabularyForGeneration(topicSelection.words, MAX_PRACTICE_VOCAB)
      : { words: [], truncated: false };

    return {
      theme: theme.trim() || topicSelection.topicLabel || selected?.theme,
      locale: 'en',
      promptId: useCustom || useTopic ? null : promptId,
      customPrompt:
        useCustom || (useTopic && customPrompt.trim())
          ? customPrompt.trim()
          : null,
      turns: suggestTurnCount(capped.length, length),
      level: selected?.level || 'beginner',
      vocabulary: capped,
      topicLabel: useTopic ? topicSelection.topicLabel : null,
      length,
      _truncated: truncated,
    };
  };

  const handleGenerate = async () => {
    if (mode === 'topic' && !topicSelection.words.length) {
      setError(ui.needWords);
      return;
    }
    stopPlayback();
    setLoading(true);
    setError(null);
    try {
      const args = buildGenerateArgs();
      const result = await simulationService.generate(args);
      setScript(result);
      if (args._truncated) {
        setError(
          ui.t('truncatedWarn', { max: MAX_PRACTICE_VOCAB, n: MAX_PRACTICE_VOCAB })
        );
      }
    } catch (err) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const label = (preset) =>
    preset.title?.[lang] || preset.title?.en || preset.theme;

  const canGenerate =
    !!theme.trim() &&
    !(mode === 'topic' && !topicSelection.words.length);

  const coverage = script?.meta?.vocabularyCoverage || null;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#dadce0] bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202124]">
              {ui.simulation}
            </h2>
            <p className="text-[13px] text-[#5f6368] mt-1">
              {ui.simulationHint}
              {usesRemoteLlm() ? ' · Groq' : ' · mock'}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-[#1a73e8] shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2">
          <ModeChip active={mode === 'preset'} onClick={() => setMode('preset')}>
            {ui.preset}
          </ModeChip>
          <ModeChip
            active={mode === 'topic'}
            onClick={() => setMode('topic')}
            disabled={!topicOptions.length}
          >
            {ui.topicVocab}
          </ModeChip>
          <ModeChip active={mode === 'custom'} onClick={() => setMode('custom')}>
            {ui.customPrompt}
          </ModeChip>
        </div>

        {mode === 'preset' && (
          <>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetChange(p.id)}
                  className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    promptId === p.id
                      ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                      : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
                  }`}
                >
                  {label(p)}
                </button>
              ))}
            </div>
            {selected?.description && (
              <p className="text-[13px] text-[#5f6368]">
                {selected.description[lang] || selected.description.en}
              </p>
            )}
          </>
        )}

        {mode === 'topic' && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-[12px] font-semibold text-[#5f6368]">
                {ui.topicCategory}
              </span>
              <select
                value={categoryId}
                onChange={(e) => handleTopicChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] bg-white"
              >
                <option value="">{ui.selectTopic}</option>
                {topicOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {'—'.repeat(t.depth)} {t.label}
                  </option>
                ))}
              </select>
            </label>
            <TopicVocabPicker
              items={items}
              categories={categories}
              categoryId={categoryId}
              topicTab={topicTab}
              onTopicTabChange={setTopicTab}
              selectedWordIds={selectedWordIds}
              onSelectedWordIdsChange={setSelectedWordIds}
              ui={ui}
            />
          </div>
        )}

        {mode === 'custom' && (
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5f6368]">
              {ui.customInstructions}
            </span>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] resize-y"
            />
          </label>
        )}

        <label className="block">
          <span className="text-[12px] font-semibold text-[#5f6368]">{ui.theme}</span>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8]"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-semibold text-[#5f6368]">{ui.length}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {[
              { id: 'short', label: ui.short },
              { id: 'medium', label: ui.medium },
              { id: 'long', label: ui.long },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLength(opt.id)}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                  length === opt.id
                    ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                    : 'bg-white border-[#dadce0] text-[#5f6368]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </label>

        {mode === 'topic' && (
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5f6368]">
              {ui.extraInstructions}
            </span>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] resize-y"
            />
          </label>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !canGenerate}
          className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#1557b0] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? ui.generating : script ? ui.generateNew : ui.generate}
        </button>

        {error && <div className="text-[13px] text-[#c5221f]">{error}</div>}
      </div>

      {script && (
        <ConversationPlayer
          turns={script.turns}
          title={script.theme || 'Generated simulation'}
          coverage={coverage}
          onGenerateAnother={handleGenerate}
          generating={loading}
        />
      )}
    </div>
  );
}

function ModeChip({ active, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 ${
        active
          ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
          : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
      }`}
    >
      {children}
    </button>
  );
}
