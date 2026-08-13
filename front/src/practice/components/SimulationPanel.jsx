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
import {
  PracticeCard,
  PracticeCardHeader,
  SegmentedControl,
  FieldLabel,
  PracticeInput,
  PracticeSelect,
  PracticeTextarea,
  ChoicePill,
  PrimaryButton,
  SoftBadge,
} from './practiceUi';
import { pickLangText } from '../../data/vocabs/vocabItemStructure';

export default function SimulationPanel({
  defaultTheme = '',
  categories = [],
  items = [],
  defaultCategoryId = '',
  domainId = null,
}) {
  const { lang } = useContext(AppContext);
  const presets = useMemo(() => simulationService.listPresets(domainId), [domainId]);

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

  const profile = useMemo(
    () => simulationService.getProfile(domainId, mode === 'preset' ? promptId : null),
    [domainId, mode, promptId]
  );
  const ui = useMemo(() => simulationUi(lang, profile.kind), [lang, profile.kind]);

  useEffect(() => {
    if (!presets.some((p) => p.id === promptId) && presets[0]) {
      setPromptId(presets[0].id);
      setTheme((t) => t || presets[0].theme);
    }
  }, [presets, promptId]);

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
      domainId,
      scenarioKind: profile.kind,
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
    pickLangText(preset.title, lang) || preset.theme;

  const canGenerate =
    !!theme.trim() &&
    !(mode === 'topic' && !topicSelection.words.length);

  const coverage = script?.meta?.vocabularyCoverage || null;

  return (
    <div className="space-y-5">
      <PracticeCard className="pb-5 sm:pb-6">
        <PracticeCardHeader
          title={ui.simulation}
          hint={`${ui.simulationHint}${usesRemoteLlm() ? ' · Groq' : ' · mock'}`}
          icon={<Sparkles className="w-5 h-5" />}
          badge={
            <SoftBadge tone={profile.kind === 'medical' ? 'sky' : 'teal'}>
              {profile.kind === 'medical' ? 'Médical' : 'Général'}
            </SoftBadge>
          }
        />

        <div className="px-5 sm:px-6 mt-4 space-y-4">
          <SegmentedControl
            className="w-full"
            value={mode}
            onChange={setMode}
            options={[
              { id: 'preset', label: ui.preset },
              { id: 'topic', label: ui.topicVocab, disabled: !topicOptions.length },
              { id: 'custom', label: ui.customPrompt },
            ]}
          />

          {mode === 'preset' && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <ChoicePill
                    key={p.id}
                    active={promptId === p.id}
                    onClick={() => handlePresetChange(p.id)}
                  >
                    {label(p)}
                  </ChoicePill>
                ))}
              </div>
              {selected?.description && (
                <p className="text-[13px] text-[#64748b] leading-relaxed rounded-xl bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2.5">
                  {pickLangText(selected.description, lang)}
                </p>
              )}
            </div>
          )}

          {mode === 'topic' && (
            <div className="space-y-3">
              <label className="block">
                <FieldLabel>{ui.topicCategory}</FieldLabel>
                <PracticeSelect
                  value={categoryId}
                  onChange={(e) => handleTopicChange(e.target.value)}
                >
                  <option value="">{ui.selectTopic}</option>
                  {topicOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {'—'.repeat(t.depth)} {t.label}
                    </option>
                  ))}
                </PracticeSelect>
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
              <FieldLabel>{ui.customInstructions}</FieldLabel>
              <PracticeTextarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </label>
          )}

          <label className="block">
            <FieldLabel>{ui.theme}</FieldLabel>
            <PracticeInput
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </label>

          <div>
            <FieldLabel>{ui.length}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'short', label: ui.short },
                { id: 'medium', label: ui.medium },
                { id: 'long', label: ui.long },
              ].map((opt) => (
                <ChoicePill
                  key={opt.id}
                  active={length === opt.id}
                  onClick={() => setLength(opt.id)}
                >
                  {opt.label}
                </ChoicePill>
              ))}
            </div>
          </div>

          {mode === 'topic' && (
            <label className="block">
              <FieldLabel>{ui.extraInstructions}</FieldLabel>
              <PracticeTextarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
              />
            </label>
          )}

          <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
            <PrimaryButton
              onClick={handleGenerate}
              disabled={loading || !canGenerate}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? ui.generating : script ? ui.generateNew : ui.generate}
            </PrimaryButton>
            {error && (
              <p className="text-[13px] text-[#c5221f] sm:flex-1">{error}</p>
            )}
          </div>
        </div>
      </PracticeCard>

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
