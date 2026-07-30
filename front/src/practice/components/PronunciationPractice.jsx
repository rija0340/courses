import React from 'react';
import { Mic, Square, RotateCcw, Volume2 } from 'lucide-react';
import { usePronunciation } from '../hooks/usePronunciation';
import { speechService } from '../services/speechService';

export default function PronunciationPractice({ targetText, phonetic }) {
  const { status, result, error, start, stop, reset } = usePronunciation(targetText);
  const [listening, setListening] = React.useState(false);

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

  return (
    <div
      className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-800">
          Oral practice
        </div>
        <button
          type="button"
          onClick={handleModel}
          disabled={listening || !targetText}
          className="inline-flex items-center gap-1 text-[12px] text-emerald-800 hover:text-emerald-950 disabled:opacity-50"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Model
        </button>
      </div>

      {phonetic && (
        <div className="text-[12px] text-[#5f6368] mb-2 font-medium">{phonetic}</div>
      )}

      <div className="flex items-center gap-2">
        {status !== 'recording' ? (
          <button
            type="button"
            onClick={start}
            disabled={status === 'scoring' || !targetText}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Mic className="w-3.5 h-3.5" />
            {status === 'scoring' ? 'Scoring…' : 'Speak'}
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
            Retry
          </button>
        )}
        {status === 'recording' && (
          <span className="text-[12px] text-[#ea4335] font-medium animate-pulse">Recording…</span>
        )}
      </div>

      {error && (
        <div className="mt-2 text-[12px] text-[#c5221f]">{error}</div>
      )}

      {result && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`text-[18px] font-bold ${
                result.score >= 85
                  ? 'text-emerald-700'
                  : result.score >= 60
                    ? 'text-amber-600'
                    : 'text-[#c5221f]'
              }`}
            >
              {result.score}%
            </div>
            <div className="text-[12px] text-[#5f6368]">intelligibility</div>
          </div>
          <div className="text-[12px] text-[#3c4043]">
            <span className="text-[#9aa0a6]">Heard: </span>
            {result.heardText || '—'}
          </div>
          {!!result.wordFeedback?.length && (
            <div className="flex flex-wrap gap-1">
              {result.wordFeedback.map((w, i) => (
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
          {result.tips?.slice(0, 2).map((tip) => (
            <div key={tip} className="text-[12px] text-[#5f6368]">
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
