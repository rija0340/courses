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
import {
  getScenarioProfile,
  partnerRoleFor,
  roleLabel,
} from '../data/scenarioProfiles';
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
  SecondaryButton,
  SoftBadge,
} from './practiceUi';
import { pickLangText } from '../../data/vocabs/vocabItemStructure';

export default function WrittenSimulationPanel({
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

  const saved = useMemo(() => loadWrittenSimulationSession(), []);

  const [mode, setMode] = useState(saved?.mode || (defaultCategoryId ? 'topic' : 'preset'));
  const [promptId, setPromptId] = useState(saved?.promptId || presets[0]?.id || '');
  const [categoryId, setCategoryId] = useState(saved?.categoryId || defaultCategoryId || '');
  const [topicTab, setTopicTab] = useState(saved?.topicTab || 'vocab');
  const [selectedWordIds, setSelectedWordIds] = useState(saved?.selectedWordIds || []);
  const [theme, setTheme] = useState(saved?.theme || defaultTheme || presets[0]?.theme || '');
  const [customPrompt, setCustomPrompt] = useState(saved?.customPrompt || '');
  const profile = useMemo(
    () => getScenarioProfile(domainId, mode === 'preset' ? promptId : null),
    [domainId, mode, promptId]
  );
  const ui = useMemo(() => simulationUi(lang, profile.kind), [lang, profile.kind]);
  const validSavedRole = profile.roles.some((r) => r.id === saved?.learnerRole)
    ? saved.learnerRole
    : profile.defaultLearnerRole;
  const [learnerRole, setLearnerRole] = useState(validSavedRole);

  useEffect(() => {
    if (!presets.some((p) => p.id === promptId) && presets[0]) {
      setPromptId(presets[0].id);
      if (!theme) setTheme(presets[0].theme);
    }
  }, [presets, promptId, theme]);
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

  useEffect(() => {
    const stillValid = profile.roles.some((r) => r.id === learnerRole);
    if (!stillValid) setLearnerRole(profile.defaultLearnerRole);
  }, [profile, learnerRole]);

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
      partnerRole: partnerRoleFor(profile, learnerRole),
      learnerText,
      history,
      vocabulary: useTopic ? topicSelection.words : [],
      topicLabel: useTopic ? topicSelection.topicLabel : null,
      customPrompt: useCustom || (useTopic && customPrompt.trim()) ? customPrompt.trim() : null,
      turnIndex,
      domainId,
      scenarioKind: profile.kind,
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
    pickLangText(preset.title, lang) || preset.theme;

  const canStart = !!theme.trim() && !(mode === 'topic' && !topicSelection.words.length);

  return (
    <div className="space-y-5">
      <PracticeCard className="pb-5 sm:pb-6">
        <PracticeCardHeader
          title={ui.writtenTitle}
          hint={`${ui.writtenHint}${usesRemoteLlm() ? ' · Groq' : ' · mock'}`}
          icon={<MessageSquare className="w-5 h-5" />}
          badge={
            <SoftBadge tone={profile.kind === 'medical' ? 'sky' : 'teal'}>
              {profile.kind === 'medical' ? 'Médical' : 'Général'}
            </SoftBadge>
          }
        />

        <div className="px-5 sm:px-6 mt-4 space-y-4">
          {!started && (
            <>
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
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <ChoicePill
                      key={p.id}
                      active={promptId === p.id}
                      onClick={() => { setPromptId(p.id); setTheme(p.theme); }}
                    >
                      {label(p)}
                    </ChoicePill>
                  ))}
                </div>
              )}

              {mode === 'topic' && (
                <div className="space-y-3">
                  <label className="block">
                    <FieldLabel>{ui.topicCategory}</FieldLabel>
                    <PracticeSelect
                      value={categoryId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setCategoryId(id);
                        const opt = topicOptions.find((t) => t.id === id);
                        if (opt) setTheme(`Conversation about ${opt.label}`);
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

              {mode === 'custom' && (
                <PracticeTextarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={2}
                  placeholder={ui.customInstructions}
                />
              )}

              <label className="block">
                <FieldLabel>{ui.theme}</FieldLabel>
                <PracticeInput
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </label>

              <div>
                <FieldLabel>{ui.yourRole}</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {profile.roles.map((opt) => (
                    <ChoicePill
                      key={opt.id}
                      active={learnerRole === opt.id}
                      onClick={() => setLearnerRole(opt.id)}
                    >
                      {roleLabel(profile, opt.id, lang)}
                    </ChoicePill>
                  ))}
                </div>
              </div>

              <PrimaryButton
                onClick={handleStart}
                disabled={loading || !canStart}
                className="w-full sm:w-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                Commencer la conversation
              </PrimaryButton>
            </>
          )}

          {started && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] text-[#64748b]">
                Rôle : <strong className="text-[#0f172a]">{roleLabel(profile, learnerRole, lang)}</strong>
                {done && ' · Conversation terminée'}
              </p>
              <SecondaryButton onClick={handleReset}>
                <RotateCcw className="w-3.5 h-3.5" />
                Recommencer
              </SecondaryButton>
            </div>
          )}

          {error && <div className="text-[13px] text-[#c5221f]">{error}</div>}
          {mic.error && <div className="text-[13px] text-[#c5221f]">{mic.error}</div>}
        </div>
      </PracticeCard>

      {started && (
        <>
          <PracticeCard className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
            {history.map((turn) => {
              const isLearner = turn.role === learnerRole;
              return (
                <div
                  key={turn.id}
                  className={`flex ${isLearner ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] border ${
                      isLearner
                        ? 'bg-gradient-to-br from-teal-600 to-sky-600 text-white border-transparent rounded-br-md'
                        : 'bg-[#f8fafc] text-[#0f172a] border-[#e2e8f0] rounded-bl-md'
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mb-0.5">
                      {turn.role}
                    </p>
                    <p className="leading-snug">{turn.text}</p>
                  </div>
                </div>
              );
            })}
          </PracticeCard>

          {!done && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <PracticeTextarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder={`Écrivez ou dictez votre réponse en tant que ${roleLabel(profile, learnerRole, lang)}…`}
                  className="pr-14"
                />
                <button
                  type="button"
                  onClick={handleMicToggle}
                  disabled={loading || mic.status === 'transcribing'}
                  title={mic.status === 'recording' ? 'Arrêter et transcrire' : 'Dicter au micro'}
                  className={`absolute right-2 bottom-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 ${
                    mic.status === 'recording'
                      ? 'bg-[#EA4335] text-white animate-pulse'
                      : mic.status === 'transcribing'
                        ? 'bg-[#f1f5f9] text-[#94a3b8]'
                        : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b]'
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
              <p className="text-[12px] text-[#94a3b8]">
                {mic.status === 'recording'
                  ? 'Enregistrement… appuyez pour arrêter.'
                  : mic.status === 'transcribing'
                    ? 'Transcription en cours…'
                    : 'Écrivez au clavier ou utilisez le micro, puis envoyez.'}
              </p>
              <PrimaryButton
                type="submit"
                disabled={loading || !draft.trim() || mic.status === 'recording' || mic.status === 'transcribing'}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Envoyer et obtenir le retour
              </PrimaryButton>
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
