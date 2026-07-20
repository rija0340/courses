import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { AppContext } from '../../App';
import { simulationService } from '../services/simulationService';
import ConversationPlayer from './ConversationPlayer';
import { usesRemoteLlm } from '../config';
import { flattenTree } from '../../utils/categoryTree';
import { collectTopicVocabulary } from '../domain/topicVocabulary';
import { suggestTurnCount } from '../domain/vocabCoverage';
import {
  loadSimulationSession,
  saveSimulationSession
} from '../domain/simulationSession';
import { stopPlayback } from '../services/speechService';

export default function SimulationPanel({
  defaultTheme = '',
  categories = [],
  items = [],
  defaultCategoryId = ''
}) {
  const { lang } = useContext(AppContext);
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
  const [categoryId, setCategoryId] = useState(saved?.categoryId || defaultCategoryId || '');
  const [theme, setTheme] = useState(
    saved?.theme || defaultTheme || presets[0]?.theme || ''
  );
  const [customPrompt, setCustomPrompt] = useState(saved?.customPrompt || '');
  const [length, setLength] = useState(saved?.length || 'long');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [script, setScript] = useState(saved?.script || null);

  const selected = presets.find((p) => p.id === promptId);

  const topicVocab = useMemo(
    () => collectTopicVocabulary(items, categories, categoryId),
    [items, categories, categoryId]
  );

  useEffect(() => {
    saveSimulationSession({
      mode,
      promptId,
      categoryId,
      theme,
      customPrompt,
      length,
      script
    });
  }, [mode, promptId, categoryId, theme, customPrompt, length, script]);

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
    const vocabulary = useTopic ? topicVocab.words : [];
    return {
      theme: theme.trim() || topicVocab.topicLabel || selected?.theme,
      locale: 'en',
      promptId: useCustom || useTopic ? null : promptId,
      customPrompt:
        useCustom || (useTopic && customPrompt.trim()) ? customPrompt.trim() : null,
      turns: suggestTurnCount(vocabulary.length, length),
      level: selected?.level || 'beginner',
      vocabulary,
      topicLabel: useTopic ? topicVocab.topicLabel : null,
      length
    };
  };

  const handleGenerate = async () => {
    stopPlayback();
    setLoading(true);
    setError(null);
    try {
      const result = await simulationService.generate(buildGenerateArgs());
      setScript(result);
    } catch (err) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = async () => {
    await handleGenerate();
  };

  const label = (preset) =>
    preset.title?.[lang] || preset.title?.en || preset.theme;

  const canGenerate =
    !!theme.trim() && !(mode === 'topic' && !topicVocab.words.length);

  const coverage = script?.meta?.vocabularyCoverage || null;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#dadce0] bg-white p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold text-[#202124]">Simulation</h2>
            <p className="text-[13px] text-[#5f6368] mt-1">
              Longer doctor ↔ patient dialogue, dual voices, full topic vocab. Session only
              (no DB).
              {usesRemoteLlm() ? ' · Groq' : ' · mock'}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-[#1a73e8] shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2">
          <ModeChip active={mode === 'preset'} onClick={() => setMode('preset')}>
            Preset
          </ModeChip>
          <ModeChip
            active={mode === 'topic'}
            onClick={() => setMode('topic')}
            disabled={!topicOptions.length}
          >
            Topic vocab
          </ModeChip>
          <ModeChip active={mode === 'custom'} onClick={() => setMode('custom')}>
            Custom prompt
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
                Topic / category
              </span>
              <select
                value={categoryId}
                onChange={(e) => handleTopicChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] bg-white"
              >
                <option value="">Select a topic…</option>
                {topicOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {'—'.repeat(t.depth)} {t.label}
                  </option>
                ))}
              </select>
            </label>
            {categoryId && (
              <div className="rounded-xl bg-[#f8f9fa] border border-[#dadce0] p-3">
                <div className="text-[12px] font-semibold text-[#5f6368] mb-2">
                  {topicVocab.words.length} word{topicVocab.words.length !== 1 ? 's' : ''} — all
                  will be included
                </div>
                {topicVocab.words.length === 0 ? (
                  <p className="text-[13px] text-[#c5221f]">
                    No vocabulary for this topic.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {topicVocab.words.map((w) => (
                      <span
                        key={w.en}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#dadce0] text-[#3c4043]"
                      >
                        {w.en}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'custom' && (
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5f6368]">Custom instructions</span>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. Only eye anatomy, patient describes blurry vision…"
              className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8] resize-y"
            />
          </label>
        )}

        <label className="block">
          <span className="text-[12px] font-semibold text-[#5f6368]">Theme / title</span>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. Eye exam at the clinic"
            className="mt-1 w-full rounded-xl border border-[#dadce0] px-3 py-2 text-[14px] outline-none focus:border-[#1a73e8]"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-semibold text-[#5f6368]">Length</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {[
              { id: 'short', label: 'Short' },
              { id: 'medium', label: 'Medium' },
              { id: 'long', label: 'Long' }
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
              Extra instructions (optional)
            </span>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={2}
              placeholder="e.g. Beginner level…"
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
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generating…' : script ? 'Generate new dialogue' : 'Generate dialogue'}
        </button>

        {error && <div className="text-[13px] text-[#c5221f]">{error}</div>}
      </div>

      {script && (
        <ConversationPlayer
          turns={script.turns}
          title={script.theme || 'Generated simulation'}
          coverage={coverage}
          onGenerateAnother={handleGenerateAnother}
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
