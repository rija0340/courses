import React from 'react';
import { Mic, Square, RotateCcw, Volume2, Keyboard } from 'lucide-react';
import { usePronunciation } from '../hooks/usePronunciation';
import { speechService } from '../services/speechService';
import { scorePronunciation } from '../domain/pronunciation';
import { coercePhoneticString } from '../../data/vocabs/vocabItemStructure';

/**
 * Oral (mic) + typed practice against targetText, with score feedback.
 */
export default function PronunciationPractice({ targetText, phonetic }) {
  const { status, result, error, start, stop, reset } = usePronunciation(targetText);
  const [listening, setListening] = React.useState(false);
  const [mode, setMode] = React.useState('speak'); // speak | type
  const [typed, setTyped] = React.useState('');
  const [typedResult, setTypedResult] = React.useState(null);

  const ipa = coercePhoneticString(phonetic);
  const displayResult = mode === 'type' ? typedResult : result;

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

  const handleTypedCheck = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!targetText || !typed.trim()) return;
    setTypedResult(scorePronunciation(targetText, typed.trim()));
  };

  const handleTypedReset = () => {
    setTyped('');
    setTypedResult(null);
  };

  const switchMode = (next) => {
    setMode(next);
    if (next === 'speak') handleTypedReset();
    else reset();
  };

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
              disabled={status === 'scoring' || !targetText}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              <Mic className="w-3.5 h-3.5" />
              {status === 'scoring' ? 'Score…' : 'Parler'}
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
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={`Taper « ${targetText || ''} »`}
            className="w-full h-10 rounded-lg border border-[#dadce0] bg-white px-3 text-[14px] outline-none focus:border-emerald-500"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!targetText || !typed.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              Vérifier
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
            <div className="text-[12px] text-[#5f6368]">intelligibilité</div>
          </div>
          <div className="text-[12px] text-[#3c4043]">
            <span className="text-[#9aa0a6]">{mode === 'type' ? 'Saisi : ' : 'Entendu : '}</span>
            {displayResult.heardText || '—'}
          </div>
          {!!displayResult.wordFeedback?.length && (
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
          {displayResult.tips?.slice(0, 2).map((tip) => (
            <div key={tip} className="text-[12px] text-[#5f6368]">
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
