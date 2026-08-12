import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Loader2, Brain, Send, RotateCcw, Mic, Square, CheckCircle2, XCircle } from 'lucide-react';
import { AppContext } from '../../App';
import { flattenTree } from '../../utils/categoryTree';
import TopicVocabPicker, { resolveSelectedTopicWords } from './TopicVocabPicker';
import { buildQuizDeck, buildFreeThemeDeck, EXERCISE_TYPES } from '../domain/quizDeck';
import {
  loadQuizSession,
  saveQuizSession,
  clearQuizSession
} from '../domain/quizSession';
import { quizService } from '../services/quizService';
import { usesRemoteLlm } from '../config';
import { useMicTranscript } from '../hooks/useMicTranscript';
import WrittenFeedbackPanel from './WrittenFeedbackPanel';
import { speechService } from '../services/speechService';
import { simulationUi } from '../data/simulationUiCopy';
import { MAX_PRACTICE_VOCAB, capVocabularyForGeneration } from '../domain/topicVocabulary';
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

export default function QuizPracticePanel({
  defaultTheme = '',
  categories = [],
  items = [],
  defaultCategoryId = '',
  domainId = null,
}) {
  const { lang } = useContext(AppContext);
  const scenarioKind = useMemo(
    () => (domainId === 'medi-vocabs' ? 'medical' : 'general'),
    [domainId]
  );
  const ui = useMemo(() => simulationUi(lang, scenarioKind), [lang, scenarioKind]);
  const topicOptions = useMemo(() => flattenTree(categories, lang), [categories, lang]);
  const saved = useMemo(() => loadQuizSession(), []);
  const mic = useMicTranscript({ language: 'en' });

  const [source, setSource] = useState(saved?.source || (defaultCategoryId ? 'topic' : 'free'));
  const [categoryId, setCategoryId] = useState(saved?.categoryId || defaultCategoryId || '');
  const [topicTab, setTopicTab] = useState(saved?.topicTab || 'vocab');
  const [selectedWordIds, setSelectedWordIds] = useState(saved?.selectedWordIds || []);
  const [theme, setTheme] = useState(saved?.theme || defaultTheme || '');
  const [selectedTypes, setSelectedTypes] = useState(saved?.selectedTypes || ['definition_to_word', 'cloze']);
  const [deck, setDeck] = useState(saved?.deck || []);
  const [index, setIndex] = useState(saved?.index || 0);
  const [draft, setDraft] = useState('');
  const [started, setStarted] = useState(saved?.started || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(saved?.lastResult || null);
  const [scoreboard, setScoreboard] = useState(saved?.scoreboard || { correct: 0, total: 0 });

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

  const current = deck[index] || null;

  useEffect(() => {
    saveQuizSession({
      source,
      categoryId,
      topicTab,
      selectedWordIds,
      theme,
      selectedTypes,
      deck,
      index,
      started,
      lastResult,
      scoreboard
    });
  }, [source, categoryId, topicTab, selectedWordIds, theme, selectedTypes, deck, index, started, lastResult, scoreboard]);

  const toggleType = (id) => {
    setSelectedTypes((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== id);
      }
      return [...prev, id];
    });
  };

  const handleStart = () => {
    setError(null);
    setLastResult(null);
    setDraft('');
    setScoreboard({ correct: 0, total: 0 });
    setIndex(0);
    let nextDeck = [];
    if (source === 'topic') {
      if (!topicSelection.words.length) {
        setError(ui.needWords);
        return;
      }
      const { words: capped } = capVocabularyForGeneration(
        topicSelection.words,
        MAX_PRACTICE_VOCAB
      );
      nextDeck = buildQuizDeck({
        words: capped.map((w) => ({
          id: w.id || w.en,
          en: w.en,
          fr: w.fr,
          mg: w.mg,
          phonetic: w.phonetic
        })),
        types: selectedTypes,
        limit: Math.min(10, capped.length),
        scenarioKind,
      });
      if (!theme.trim()) setTheme(topicSelection.topicLabel || '');
    } else {
      if (!theme.trim()) {
        setError('Indiquez un thème libre.');
        return;
      }
      nextDeck = buildFreeThemeDeck(theme.trim(), selectedTypes, 6, scenarioKind);
    }
    setDeck(nextDeck);
    setStarted(true);
  };

  const handleMicToggle = async () => {
    if (mic.status === 'recording') {
      const text = await mic.stop();
      if (text) setDraft((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      return;
    }
    if (mic.status === 'transcribing' || loading) return;
    await mic.start();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!current || !draft.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await quizService.evaluate({
        exerciseType: current.exerciseType,
        prompt: current.prompt,
        expected: current.expected,
        learnerAnswer: draft.trim(),
        theme: theme || topicSelection.topicLabel || '',
        vocabulary: source === 'topic' ? topicSelection.words : [],
        level: 'beginner'
      });
      setLastResult(result);
      setScoreboard((prev) => ({
        correct: prev.correct + (result.correct ? 1 : 0),
        total: prev.total + 1
      }));
    } catch (err) {
      setError(err.message || 'Évaluation impossible');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setDraft('');
    setLastResult(null);
    if (index + 1 >= deck.length) {
      setStarted(false);
      setDeck([]);
      setIndex(0);
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleReset = () => {
    clearQuizSession();
    setDeck([]);
    setIndex(0);
    setDraft('');
    setStarted(false);
    setLastResult(null);
    setScoreboard({ correct: 0, total: 0 });
    setError(null);
    mic.reset();
  };

  const canStart =
    selectedTypes.length > 0 &&
    (source === 'free' ? !!theme.trim() : !!categoryId && topicSelection.words.length > 0);

  return (
    <div className="space-y-5">
      <PracticeCard className="pb-5 sm:pb-6">
        <PracticeCardHeader
          title={ui.quizTitle}
          hint={`${ui.quizHint}${usesRemoteLlm() ? ' · Groq' : ' · mock'}`}
          icon={<Brain className="w-5 h-5" />}
          badge={
            <SoftBadge tone={scenarioKind === 'medical' ? 'sky' : 'teal'}>
              {scenarioKind === 'medical' ? 'Médical' : 'Général'}
            </SoftBadge>
          }
        />

        <div className="px-5 sm:px-6 mt-4 space-y-4">
        {!started && (
          <>
            <SegmentedControl
              className="w-full"
              value={source}
              onChange={setSource}
              options={[
                { id: 'topic', label: ui.byTopic, disabled: !topicOptions.length },
                { id: 'free', label: ui.freeTheme },
              ]}
            />

            {source === 'topic' && (
              <div className="space-y-3">
                <label className="block">
                  <FieldLabel>{ui.topicCategory}</FieldLabel>
                  <PracticeSelect
                    value={categoryId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setCategoryId(id);
                      const opt = topicOptions.find((t) => t.id === id);
                      if (opt) setTheme(opt.label);
                    }}
                  >
                    <option value="">{ui.selectTopic}</option>
                    {topicOptions.map((t) => (
                      <option key={t.id} value={t.id}>{'—'.repeat(t.depth)} {t.label}</option>
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

            {source === 'free' && (
              <label className="block">
                <FieldLabel>{ui.theme}</FieldLabel>
                <PracticeInput
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="ex. Adjectives of emotion"
                />
              </label>
            )}

            <div>
              <FieldLabel>Types d’exercices</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {EXERCISE_TYPES.map((t) => (
                  <ChoicePill
                    key={t.id}
                    active={selectedTypes.includes(t.id)}
                    onClick={() => toggleType(t.id)}
                  >
                    {t.label}
                  </ChoicePill>
                ))}
              </div>
            </div>

            <PrimaryButton onClick={handleStart} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              Commencer le quiz
            </PrimaryButton>
          </>
        )}

        {started && (
          <div className="flex items-center justify-between gap-2 text-[13px] text-[#64748b]">
            <p>
              Question {index + 1}/{deck.length}
              {scoreboard.total > 0 && (
                <span className="ml-2 tabular-nums">
                  · Score {scoreboard.correct}/{scoreboard.total}
                </span>
              )}
            </p>
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-950">
              <RotateCcw className="w-3.5 h-3.5" />
              Recommencer
            </button>
          </div>
        )}

        {error && <div className="text-[13px] text-[#c5221f]">{error}</div>}
        {mic.error && <div className="text-[13px] text-[#c5221f]">{mic.error}</div>}
        </div>
      </PracticeCard>

      {started && current && (
        <>
          <PracticeCard className="p-5 sm:p-6 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {EXERCISE_TYPES.find((t) => t.id === current.exerciseType)?.label || current.exerciseType}
            </p>
            <p className="text-[16px] font-medium text-[#0f172a] leading-relaxed">
              {current.prompt}
            </p>
            {current.hint && (
              <p className="text-[12px] text-[#94a3b8]">Indice : {current.hint}</p>
            )}

          {!lastResult && (
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="relative">
                <PracticeTextarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Écrivez ou dictez votre réponse…"
                  className="pr-14"
                />
                <button
                  type="button"
                  onClick={handleMicToggle}
                  disabled={loading || mic.status === 'transcribing'}
                  className={`absolute right-2 bottom-2 w-10 h-10 rounded-xl flex items-center justify-center ${
                    mic.status === 'recording'
                      ? 'bg-[#EA4335] text-white animate-pulse'
                      : 'bg-[#f1f5f9] text-[#64748b]'
                  }`}
                >
                  {mic.status === 'transcribing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mic.status === 'recording' ? (
                    <Square className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
              <PrimaryButton type="submit" disabled={loading || !draft.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Vérifier
              </PrimaryButton>
            </form>
          )}

          {lastResult && (
            <div className="space-y-4 pt-1">
              <div className={`rounded-xl border px-3 py-2.5 text-[13px] font-semibold flex items-center gap-2 ${
                lastResult.correct
                  ? 'bg-[#E6F4EA] border-[#34A853]/30 text-[#137333]'
                  : 'bg-[#FEF7E0] border-[#F9AB00]/40 text-[#E37400]'
              }`}>
                {lastResult.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {lastResult.correct ? 'Correct' : 'À retravailler'}
                {lastResult.expectedAnswer && (
                  <span className="font-normal opacity-80">· attendu : {lastResult.expectedAnswer}</span>
                )}
              </div>
              <WrittenFeedbackPanel
                feedback={lastResult.feedback}
                onSpeakReformulation={
                  lastResult.feedback?.reformulation
                    ? () => speechService.speak(lastResult.feedback.reformulation, { prefer: 'browser' })
                    : null
                }
              />
              <PrimaryButton onClick={handleNext}>
                {index + 1 >= deck.length ? 'Terminer' : 'Question suivante'}
              </PrimaryButton>
            </div>
          )}
          </PracticeCard>
        </>
      )}

      {!started && scoreboard.total > 0 && (
        <p className="text-[13px] text-[#64748b]">
          Dernière session : {scoreboard.correct}/{scoreboard.total} correctes.
        </p>
      )}
    </div>
  );
}
