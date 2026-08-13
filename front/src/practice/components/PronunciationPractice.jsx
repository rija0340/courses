import React from 'react';
import { Mic, Square, RotateCcw, Volume2, Keyboard } from 'lucide-react';
import { usePronunciation } from '../hooks/usePronunciation';
import { speechService } from '../services/speechService';
import { scorePronunciation } from '../domain/pronunciation';
import { collectCardLexicon } from '../domain/cardUtterance';
import { cardUtteranceService } from '../services/cardUtteranceService';
import { coercePhoneticString } from '../../data/vocabs/vocabItemStructure';
import WrittenFeedbackPanel from './WrittenFeedbackPanel';

const DIM_LABELS = [
  { key: 'contextUse', label: 'Contexte' },
  { key: 'grammar', label: 'Grammaire' },
  { key: 'naturalness', label: 'Naturel' },
  { key: 'sentenceLevel', label: 'Niveau' },
];

function dimColor(n) {
  if (n >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
  if (n >= 55) return 'text-amber-700 bg-amber-50 border-amber-100';
  return 'text-red-700 bg-red-50 border-red-100';
}

/**
 * Oral (mic) + typed practice.
 * - Default: repeat targetText (dialogue lines).
 * - With `item`: produce a sentence using the card lexicon (headword / syn / ant).
 */
export default function PronunciationPractice({
  targetText,
  phonetic,
  item = null,
  itemStructure = null,
}) {
  const utteranceMode = Boolean(item && targetText);
  const assessUtterance = React.useCallback(
    (text) => cardUtteranceService.assess({ learnerText: text, item, itemStructure }),
    [item, itemStructure]
  );
  const { status, result, error, start, stop, reset } = usePronunciation(
    targetText,
    utteranceMode ? { assess: assessUtterance } : {}
  );
  const [listening, setListening] = React.useState(false);
  const [mode, setMode] = React.useState('speak');
  const [typed, setTyped] = React.useState('');
  const [typedResult, setTypedResult] = React.useState(null);
  const [typedChecking, setTypedChecking] = React.useState(false);

  const ipa = coercePhoneticString(phonetic);
  const displayResult = mode === 'type' ? typedResult : result;
  const lexicon = utteranceMode ? collectCardLexicon(item, itemStructure) : null;
  const relatedHint = (lexicon?.related || []).slice(0, 4).map((r) => r.word).join(', ');

  const handleModel = async (e) => {
    e.stopPropagation();
    if (listening || !targetText) return;
    setListening(true);
    try {
      await speechService.speak(targetText);
    } finally {
      setListening(false);
    }
  };

  const handleTypedCheck = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!targetText || !typed.trim()) return;
    if (utteranceMode) {
      setTypedChecking(true);
      try {
        setTypedResult(await assessUtterance(typed.trim()));
      } catch (err) {
        setTypedResult({
          score: 0,
          heardText: typed.trim(),
          tips: [err.message || 'Évaluation indisponible'],
        });
      } finally {
        setTypedChecking(false);
      }
      return;
    }
    setTypedResult(scorePronunciation(targetText, typed.trim()));
  };

  const handleTypedReset = () => {
    setTyped('');
    setTypedResult(null);
    setTypedChecking(false);
  };

  const switchMode = (next) => {
    setMode(next);
    if (next === 'speak') handleTypedReset();
    else reset();
  };

  const busy = status === 'scoring' || typedChecking;

  return (
    <div
      className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-800">
          Pratiquer
        </div>
        <button
          type="button"
          onClick={handleModel}
          disabled={listening || !targetText}
          className="inline-flex items-center gap-1 text-[12px] text-emerald-800 hover:text-emerald-950 disabled:opacity-50"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Modèle
        </button>
      </div>

      {utteranceMode && (
        <p className="text-[12px] text-[#3c4043] leading-snug mb-2">
          Inventez une phrase anglaise avec « {targetText} »
          {relatedHint ? ` (ou ${relatedHint})` : ' (synonyme / antonyme de la carte OK)'}.
          L’exemple n’est pas obligatoire — le juge vérifie surtout le <strong>bon contexte</strong>, puis grammaire, naturel et niveau.
        </p>
      )}

      <div className="flex gap-1 mb-2.5 p-0.5 rounded-lg bg-white/70 border border-emerald-100">
        <button
          type="button"
          onClick={() => switchMode('speak')}
          className={`flex-1 h-8 rounded-md text-[12px] font-semibold inline-flex items-center justify-center gap-1 ${
            mode === 'speak' ? 'bg-emerald-600 text-white' : 'text-[#5f6368]'
          }`}
        >
          <Mic className="w-3.5 h-3.5" /> Oral
        </button>
        <button
          type="button"
          onClick={() => switchMode('type')}
          className={`flex-1 h-8 rounded-md text-[12px] font-semibold inline-flex items-center justify-center gap-1 ${
            mode === 'type' ? 'bg-emerald-600 text-white' : 'text-[#5f6368]'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" /> Texte
        </button>
      </div>

      {ipa && (
        <div className="text-[12px] text-[#5f6368] mb-2 font-medium">{ipa}</div>
      )}

      {mode === 'speak' ? (
        <div className="flex items-center gap-2">
          {status !== 'recording' ? (
            <button
              type="button"
              onClick={start}
              disabled={busy || !targetText}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              <Mic className="w-3.5 h-3.5" />
              {status === 'scoring' ? 'Analyse…' : 'Parler'}
            </button>
          ) : (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#ea4335] text-white text-[12px] font-semibold px-3 py-1.5"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop
            </button>
          )}
          {(status === 'done' || status === 'error') && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-[12px] text-[#5f6368] hover:text-[#202124]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rejouer
            </button>
          )}
          {status === 'recording' && (
            <span className="text-[12px] text-[#ea4335] font-medium animate-pulse">Enregistrement…</span>
          )}
        </div>
      ) : (
        <form onSubmit={handleTypedCheck} className="space-y-2">
          {utteranceMode ? (
            <textarea
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`Ex. I woke up with a bad ${targetText || '…'}.`}
              rows={3}
              className="w-full rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[14px] outline-none focus:border-emerald-500 resize-y min-h-[4.5rem]"
              autoComplete="off"
              spellCheck={false}
            />
          ) : (
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`Taper « ${targetText || ''} »`}
              className="w-full h-10 rounded-lg border border-[#dadce0] bg-white px-3 text-[14px] outline-none focus:border-emerald-500"
              autoComplete="off"
              spellCheck={false}
            />
          )}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!targetText || !typed.trim() || typedChecking}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              {typedChecking ? 'Analyse…' : 'Vérifier'}
            </button>
            {typedResult && (
              <button
                type="button"
                onClick={handleTypedReset}
                className="inline-flex items-center gap-1 text-[12px] text-[#5f6368] hover:text-[#202124]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Rejouer
              </button>
            )}
          </div>
        </form>
      )}

      {mode === 'speak' && error && (
        <div className="mt-2 text-[12px] text-[#c5221f]">{error}</div>
      )}

      {displayResult && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`text-[18px] font-bold ${
                displayResult.score >= 85
                  ? 'text-emerald-700'
                  : displayResult.score >= 60
                    ? 'text-amber-600'
                    : 'text-[#c5221f]'
              }`}
            >
              {displayResult.score}%
            </div>
            <div className="text-[12px] text-[#5f6368]">
              {utteranceMode ? 'phrase (contexte pondéré)' : 'intelligibilité'}
            </div>
          </div>

          {utteranceMode && displayResult.dimensions && (
            <div className="grid grid-cols-2 gap-1.5">
              {DIM_LABELS.map(({ key, label }) => {
                const n = displayResult.dimensions[key] ?? 0;
                return (
                  <div
                    key={key}
                    className={`rounded-lg border px-2 py-1.5 ${dimColor(n)}`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      {label}
                    </div>
                    <div className="text-[14px] font-bold tabular-nums">{n}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-[12px] text-[#3c4043]">
            <span className="text-[#9aa0a6]">{mode === 'type' ? 'Saisi : ' : 'Entendu : '}</span>
            {displayResult.heardText || displayResult.learnerText || '—'}
          </div>

          {!utteranceMode && !!displayResult.wordFeedback?.length && (
            <div className="flex flex-wrap gap-1">
              {displayResult.wordFeedback.map((w, i) => (
                <span
                  key={`${i}-${w.word}`}
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    w.ok
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
          )}

          {!utteranceMode &&
            displayResult.tips?.slice(0, 2).map((tip) => (
              <div key={tip} className="text-[12px] text-[#5f6368]">
                {tip}
              </div>
            ))}

          {utteranceMode && displayResult.feedback && (
            <WrittenFeedbackPanel
              feedback={displayResult.feedback}
              onSpeakReformulation={
                displayResult.feedback.reformulation
                  ? () => speechService.speak(displayResult.feedback.reformulation)
                  : undefined
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
