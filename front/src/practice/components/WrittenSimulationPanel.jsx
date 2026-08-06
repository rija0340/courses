import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Loader2, MessageSquare, Send, RotateCcw, Mic, Square } from 'lucide-react';
import { AppContext } from '../../App';
import { writtenSimulationService } from '../services/writtenSimulationService';
import { simulationService } from '../services/simulationService';
import { usesRemoteLlm } from '../config';
import { flattenTree } from '../../utils/categoryTree';
import TopicVocabPicker, { resolveSelectedTopicWords } from './TopicVocabPicker';
import {
  loadWrittenSimulationSession,
  saveWrittenSimulationSession,
  clearWrittenSimulationSession
} from '../domain/writtenSimulationSession';
import WrittenFeedbackPanel from './WrittenFeedbackPanel';
import { speechService } from '../services/speechService';
import { useMicTranscript } from '../hooks/useMicTranscript';
import { simulationUi } from '../data/simulationUiCopy';

export default function WrittenSimulationPanel({
  defaultTheme = '',
  categories = [],
  items = [],
  defaultCategoryId = ''
}) {
  const { lang } = useContext(AppContext);
  const ui = useMemo(() => simulationUi(lang), [lang]);
  const presets = useMemo(() => simulationService.listPresets(), []);
  const topicOptions = useMemo(
    () => flattenTree(categories, lang),
    [categories, lang]
  );

  const saved = useMemo(() => loadWrittenSimulationSession(), []);

  const [mode, setMode] = useState(saved?.mode || (defaultCategoryId ? 'topic' : 'preset'));
  const [promptId, setPromptId] = useState(saved?.promptId || presets[0]?.id || '');
  const [categoryId, setCategoryId] = useState(saved?.categoryId || defaultCategoryId || '');
  const [topicTab, setTopicTab] = useState(saved?.topicTab || 'vocab');
  const [selectedWordIds, setSelectedWordIds] = useState(saved?.selectedWordIds || []);
  const [theme, setTheme] = useState(saved?.theme || defaultTheme || presets[0]?.theme || '');
  const [customPrompt, setCustomPrompt] = useState(saved?.customPrompt || '');
  const [learnerRole, setLearnerRole] = useState(saved?.learnerRole || 'patient');
  const [history, setHistory] = useState(saved?.history || []);
  const [lastFeedback, setLastFeedback] = useState(saved?.lastFeedback || null);
  const [draft, setDraft] = useState('');
  const [started, setStarted] = useState(saved?.started || false);
  const [done, setDone] = useState(saved?.done || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mic = useMicTranscript({ language: 'en' });

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

  const learnerTurnCount = history.filter((t) => t.role === learnerRole).length;

  useEffect(() => {
    saveWrittenSimulationSession({
      mode,
      promptId,
      categoryId,
      topicTab,
      selectedWordIds,
      theme,
      customPrompt,
      learnerRole,
      history,
      lastFeedback,
      started,
      done
    });
  }, [mode, promptId, categoryId, topicTab, selectedWordIds, theme, customPrompt, learnerRole, history, lastFeedback, started, done]);

  const buildArgs = (learnerText, turnIndex) => {
    const useTopic = mode === 'topic' && categoryId;
    const useCustom = mode === 'custom';
    return {
      theme: theme.trim() || topicSelection.topicLabel || selected?.theme,
      locale: 'en',
      level: selected?.level || 'beginner',
      learnerRole,
      learnerText,
      history,
      vocabulary: useTopic ? topicSelection.words : [],
      topicLabel: useTopic ? topicSelection.topicLabel : null,
      customPrompt: useCustom || (useTopic && customPrompt.trim()) ? customPrompt.trim() : null,
      turnIndex
    };
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    setHistory([]);
    setLastFeedback(null);
    setDone(false);
    try {
      const result = await writtenSimulationService.submitTurn(buildArgs('', 0));
      const partner = result.partnerTurn;
      setHistory([{ role: partner.role, text: partner.text, id: `turn-${Date.now()}` }]);
      setLastFeedback(result.feedback);
      setStarted(true);
      setDone(result.done);
    } catch (err) {
      setError(err.message || 'Impossible de démarrer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || loading || done) return;

    setLoading(true);
    setError(null);
    const learnerEntry = { role: learnerRole, text, id: `learner-${Date.now()}` };
    const nextHistory = [...history, learnerEntry];

    try {
      const result = await writtenSimulationService.submitTurn(
        buildArgs(text, learnerTurnCount)
      );
      const partner = result.partnerTurn;
      setHistory([
        ...nextHistory,
        { role: partner.role, text: partner.text, id: `partner-${Date.now()}` }
      ]);
      setLastFeedback(result.feedback);
      setDraft('');
      setDone(result.done);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearWrittenSimulationSession();
    setHistory([]);
    setLastFeedback(null);
    setDraft('');
    setStarted(false);
    setDone(false);
    setError(null);
    mic.reset();
  };

  const handleMicToggle = async () => {
    if (mic.status === 'recording') {
      const text = await mic.stop();
      if (text) {
        setDraft((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      }
      return;
    }
    if (mic.status === 'transcribing' || loading) return;
    setError(null);
    await mic.start();
  };

  const handleSpeakReformulation = () => {
    if (lastFeedback?.reformulation) {
      speechService.speak(lastFeedback.reformulation);
    }
  };

  const label = (preset) =>
    preset.title?.[lang] || preset.title?.en || preset.theme;

  const canStart = !!theme.trim() && !(mode === 'topic' && !topicSelection.words.length);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#dadce0] bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202124]">{ui.writtenTitle}</h2>
            <p className="text-[13px] text-[#5f6368] mt-1">
              {ui.writtenHint}
              {usesRemoteLlm() ? ' · Groq' : ' · mock'}
            </p>
          </div>
          <MessageSquare className="w-5 h-5 text-[#1a73e8] shrink-0" />
        </div>

        {!started && (
          <>
            <div className="flex flex-wrap gap-2">
              <ModeChip active={mode === 'preset'} onClick={() => setMode('preset')}>{ui.preset}</ModeChip>
              <ModeChip active={mode === 'topic'} onClick={() => setMode('topic')} disabled={!topicOptions.length}>
                {ui.topicVocab}
              </ModeChip>
              <ModeChip active={mode === 'custom'} onClick={() => setMode('custom')}>{ui.customPrompt}</ModeChip>
            </div>

            {mode === 'preset' && (
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setPromptId(p.id); setTheme(p.theme); }}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                      promptId === p.id
                        ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                        : 'bg-white border-[#dadce0] text-[#5f6368]'
                    }`}
                  >
                    {label(p)}
                  </button>
                ))}
              </div>
            )}

            {mode === 'topic' && (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-[12px] font-semibold text-[#5f6368]">{ui.topicCategory}</span>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setCategoryId(id);
                      const opt = topicOptions.find((t) => t.id === id);
                      if (opt) setTheme(`Conversation about ${opt.label}`);
                    }}
                    className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] bg-white"
                  >
                    <option value="">{ui.selectTopic}</option>
                    {topicOptions.map((t) => (
                      <option key={t.id} value={t.id}>{'—'.repeat(t.depth)} {t.label}</option>
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
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
                placeholder={ui.customInstructions}
                className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] resize-y"
              />
            )}

            <label className="block">
              <span className="text-[12px] font-semibold text-[#5f6368]">{ui.theme}</span>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8]"
              />
            </label>

            <div>
              <span className="text-[12px] font-semibold text-[#5f6368]">Votre rôle</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {[
                  { id: 'patient', label: 'Patient' },
                  { id: 'doctor', label: 'Médecin' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLearnerRole(opt.id)}
                    className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                      learnerRole === opt.id
                        ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
                        : 'bg-white border-[#dadce0] text-[#5f6368]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={loading || !canStart}
              className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#1557b0] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              Commencer la conversation
            </button>
          </>
        )}

        {started && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] text-[#5f6368]">
              Rôle : <strong>{learnerRole === 'patient' ? 'Patient' : 'Médecin'}</strong>
              {done && ' · Conversation terminée'}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#5f6368] hover:text-[#202124]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Recommencer
            </button>
          </div>
        )}

        {error && <div className="text-[13px] text-[#c5221f]">{error}</div>}
        {mic.error && <div className="text-[13px] text-[#c5221f]">{mic.error}</div>}
      </div>

      {started && (
        <>
          <div className="rounded-2xl border border-[#dadce0] bg-white p-4 space-y-3 max-h-[360px] overflow-y-auto">
            {history.map((turn) => {
              const isLearner = turn.role === learnerRole;
              return (
                <div
                  key={turn.id}
                  className={`flex ${isLearner ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] ${
                      isLearner
                        ? 'bg-[#1a73e8] text-white rounded-br-md'
                        : 'bg-[#f1f3f4] text-[#202124] rounded-bl-md'
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mb-0.5">
                      {turn.role}
                    </p>
                    <p>{turn.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {!done && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder={`Écrivez ou dictez votre réponse en tant que ${learnerRole === 'patient' ? 'patient' : 'médecin'}…`}
                  className="w-full rounded-xl border border-[#dadce0] px-3 py-2 pr-14 text-[14px] outline-none focus:border-[#1a73e8] resize-y"
                />
                <button
                  type="button"
                  onClick={handleMicToggle}
                  disabled={loading || mic.status === 'transcribing'}
                  title={mic.status === 'recording' ? 'Arrêter et transcrire' : 'Dicter au micro'}
                  className={`absolute right-2 bottom-2 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${
                    mic.status === 'recording'
                      ? 'bg-[#EA4335] text-white animate-pulse'
                      : mic.status === 'transcribing'
                        ? 'bg-[#f1f3f4] text-[#9aa0a6]'
                        : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368]'
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
              <p className="text-[12px] text-[#9aa0a6]">
                {mic.status === 'recording'
                  ? 'Enregistrement… appuyez pour arrêter.'
                  : mic.status === 'transcribing'
                    ? 'Transcription en cours…'
                    : 'Écrivez au clavier ou utilisez le micro, puis envoyez.'}
              </p>
              <button
                type="submit"
                disabled={loading || !draft.trim() || mic.status === 'recording' || mic.status === 'transcribing'}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#1557b0] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Envoyer et obtenir le retour
              </button>
            </form>
          )}

          {lastFeedback && (
            <WrittenFeedbackPanel
              feedback={lastFeedback}
              onSpeakReformulation={lastFeedback.reformulation ? handleSpeakReformulation : null}
            />
          )}
        </>
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
