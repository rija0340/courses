import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Loader2, Brain, Send, RotateCcw, Mic, Square, CheckCircle2, XCircle } from 'lucide-react';
import { AppContext } from '../../App';
import { flattenTree } from '../../utils/categoryTree';
import { collectTopicVocabulary } from '../domain/topicVocabulary';
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

export default function QuizPracticePanel({
  defaultTheme = '',
  categories = [],
  items = [],
  defaultCategoryId = ''
}) {
  const { lang } = useContext(AppContext);
  const topicOptions = useMemo(() => flattenTree(categories, lang), [categories, lang]);
  const saved = useMemo(() => loadQuizSession(), []);
  const mic = useMicTranscript({ language: 'en' });

  const [source, setSource] = useState(saved?.source || (defaultCategoryId ? 'topic' : 'free'));
  const [categoryId, setCategoryId] = useState(saved?.categoryId || defaultCategoryId || '');
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

  const topicVocab = useMemo(
    () => collectTopicVocabulary(items, categories, categoryId),
    [items, categories, categoryId]
  );

  const current = deck[index] || null;

  useEffect(() => {
    saveQuizSession({
      source,
      categoryId,
      theme,
      selectedTypes,
      deck,
      index,
      started,
      lastResult,
      scoreboard
    });
  }, [source, categoryId, theme, selectedTypes, deck, index, started, lastResult, scoreboard]);

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
      if (!topicVocab.words.length) {
        setError('Aucun vocabulaire pour ce sujet.');
        return;
      }
      nextDeck = buildQuizDeck({
        words: topicVocab.words.map((w) => ({
          id: w.en,
          en: w.en,
          fr: w.fr,
          mg: w.mg,
          phonetic: w.phonetic
        })),
        types: selectedTypes,
        limit: Math.min(10, topicVocab.words.length)
      });
      if (!theme.trim()) setTheme(topicVocab.topicLabel || '');
    } else {
      if (!theme.trim()) {
        setError('Indiquez un thème libre.');
        return;
      }
      nextDeck = buildFreeThemeDeck(theme.trim(), selectedTypes, 6);
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
        theme: theme || topicVocab.topicLabel || '',
        vocabulary: source === 'topic' ? topicVocab.words : [],
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
    (source === 'free' ? !!theme.trim() : !!categoryId && topicVocab.words.length > 0);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202124] dark:text-[#e8eaed]">Quiz / exercices</h2>
            <p className="text-[13px] text-[#5f6368] dark:text-[#9aa0a6] mt-1">
              Mémorisation active avec retour pédagogique riche.
              {usesRemoteLlm() ? ' · Groq' : ' · mock'}
            </p>
          </div>
          <Brain className="w-5 h-5 text-[#1a73e8] shrink-0" />
        </div>

        {!started && (
          <>
            <div className="flex flex-wrap gap-2">
              <ModeChip active={source === 'topic'} onClick={() => setSource('topic')} disabled={!topicOptions.length}>
                Par sujet
              </ModeChip>
              <ModeChip active={source === 'free'} onClick={() => setSource('free')}>
                Thème libre
              </ModeChip>
            </div>

            {source === 'topic' && (
              <label className="block">
                <span className="text-[12px] font-semibold text-[#5f6368]">Sujet / catégorie</span>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setCategoryId(id);
                    const opt = topicOptions.find((t) => t.id === id);
                    if (opt) setTheme(opt.label);
                  }}
                  className="mt-1 w-full rounded-xl border border-[#dadce0] dark:border-[#5f6368] dark:bg-[#303134] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] bg-white"
                >
                  <option value="">Choisir…</option>
                  {topicOptions.map((t) => (
                    <option key={t.id} value={t.id}>{'—'.repeat(t.depth)} {t.label}</option>
                  ))}
                </select>
                {categoryId && (
                  <p className="text-[12px] text-[#5f6368] mt-1">{topicVocab.words.length} mots disponibles</p>
                )}
              </label>
            )}

            <label className="block">
              <span className="text-[12px] font-semibold text-[#5f6368]">Thème</span>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#dadce0] dark:border-[#5f6368] dark:bg-[#303134] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8]"
              />
            </label>

            <div>
              <span className="text-[12px] font-semibold text-[#5f6368]">Types d’exercices</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {EXERCISE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleType(t.id)}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                      selectedTypes.includes(t.id)
                        ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                        : 'bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#5f6368] text-[#5f6368]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#1557b0] disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              Commencer le quiz
            </button>
          </>
        )}

        {started && (
          <div className="flex items-center justify-between gap-2 text-[13px] text-[#5f6368]">
            <p>
              Question {index + 1}/{deck.length}
              {scoreboard.total > 0 && (
                <span className="ml-2 tabular-nums">
                  · Score {scoreboard.correct}/{scoreboard.total}
                </span>
              )}
            </p>
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-1 font-semibold hover:text-[#202124]">
              <RotateCcw className="w-3.5 h-3.5" />
              Recommencer
            </button>
          </div>
        )}

        {error && <div className="text-[13px] text-[#c5221f]">{error}</div>}
        {mic.error && <div className="text-[13px] text-[#c5221f]">{mic.error}</div>}
      </div>

      {started && current && (
        <>
          <div className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] p-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
              {EXERCISE_TYPES.find((t) => t.id === current.exerciseType)?.label || current.exerciseType}
            </p>
            <p className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed] leading-relaxed">
              {current.prompt}
            </p>
            {current.hint && (
              <p className="text-[12px] text-[#9aa0a6]">Indice : {current.hint}</p>
            )}
          </div>

          {!lastResult && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Écrivez ou dictez votre réponse…"
                  className="w-full rounded-xl border border-[#dadce0] dark:border-[#5f6368] dark:bg-[#303134] px-3 py-2 pr-14 text-[14px] outline-none focus:border-[#1a73e8] resize-y"
                />
                <button
                  type="button"
                  onClick={handleMicToggle}
                  disabled={loading || mic.status === 'transcribing'}
                  className={`absolute right-2 bottom-2 w-10 h-10 rounded-full flex items-center justify-center ${
                    mic.status === 'recording'
                      ? 'bg-[#EA4335] text-white animate-pulse'
                      : 'bg-[#f1f3f4] dark:bg-[#3c4043] text-[#5f6368]'
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
              <button
                type="submit"
                disabled={loading || !draft.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Vérifier
              </button>
            </form>
          )}

          {lastResult && (
            <div className="space-y-4">
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
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2"
              >
                {index + 1 >= deck.length ? 'Terminer' : 'Question suivante'}
              </button>
            </div>
          )}
        </>
      )}

      {!started && scoreboard.total > 0 && (
        <p className="text-[13px] text-[#5f6368]">
          Dernière session : {scoreboard.correct}/{scoreboard.total} correctes.
        </p>
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
          : 'bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#5f6368] text-[#5f6368] hover:bg-[#f8f9fa]'
      }`}
    >
      {children}
    </button>
  );
}
