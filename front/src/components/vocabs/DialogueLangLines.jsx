/**
 * Language lines inside dialogue bubbles (examples & scenarios).
 * Same visual language as VocabCard LangRow: FR / EN / MG badges + readable text.
 * EN gets TTS (speaker) and optional oral practice (mic → PronunciationPractice).
 */
import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { LANG_STYLES } from './RevealableLangRow';
import PronunciationPractice from '../../practice/components/PronunciationPractice';
import { isPracticeEnabled } from '../../practice/config';
import { speechService } from '../../practice/services/speechService';
import { hasText, highlightCollocation } from '../../utils/vocabDialogue';
import { coerceDisplayText } from '../../data/vocabs/vocabItemStructure';

const ROWS = [
  { code: 'EN', key: 'en' },
  { code: 'FR', key: 'fr' },
  { code: 'MG', key: 'mg' },
];

/**
 * @param {{ en?: string, fr?: string, mg?: string }} line
 * @param {{ en?: string, fr?: string, mg?: string }} [highlightTerms] — collocation to mark (examples)
 * @param {boolean} [enablePractice=true] — show mic when practice flag is on
 */
export default function DialogueLangLines({
  line,
  highlightTerms = null,
  enablePractice = true,
}) {
  const [playing, setPlaying] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);

  if (!line) return null;

  const en = coerceDisplayText(line.en);
  const canPractice = enablePractice && isPracticeEnabled() && !!en;

  const handleSpeak = async (e) => {
    e.stopPropagation();
    if (playing || !en) return;
    setPlaying(true);
    try {
      await speechService.speak(en);
    } finally {
      setPlaying(false);
    }
  };

  const rows = ROWS.filter(({ key }) => hasText(coerceDisplayText(line[key])));
  if (rows.length === 0) return null;

  return (
    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
      {rows.map(({ code, key }) => {
        const text = coerceDisplayText(line[key]);
        const style = LANG_STYLES[code];
        const term = coerceDisplayText(highlightTerms?.[key]);
        const isEn = key === 'en';

        return (
          <div
            key={code}
            className="flex items-start gap-2 rounded-lg px-1.5 py-1"
          >
            <span
              className="w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: style.badgeBg, color: style.badgeText }}
            >
              {code}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] leading-snug text-[#202124]">
                {term ? highlightCollocation(text, term) : text}
              </p>
            </div>
            {isEn && (
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSpeak}
                  disabled={playing}
                  title="Écouter (anglais)"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    playing
                      ? 'bg-[#1a73e8] text-white'
                      : 'bg-white/80 hover:bg-white text-[#5f6368] border border-[#dadce0]'
                  }`}
                >
                  {playing ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4 ml-[1px]" />
                  )}
                </button>
                {canPractice && (
                  <button
                    type="button"
                    onClick={() => setPracticeOpen((v) => !v)}
                    title="Oral practice"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      practiceOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/80 hover:bg-white text-[#5f6368] border border-[#dadce0]'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {canPractice && practiceOpen && (
        <PronunciationPractice targetText={en} />
      )}
    </div>
  );
}
