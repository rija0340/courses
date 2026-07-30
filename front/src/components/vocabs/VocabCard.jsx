import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import RevealableLangRow, { LangRow } from './RevealableLangRow';
import PronunciationPractice from '../../practice/components/PronunciationPractice';
import { isPracticeEnabled } from '../../practice/config';
import { speechService } from '../../practice/services/speechService';

const CATEGORY_COLORS = {
  Organe: { bg: '#2563EB', accent: '#2563EB' },
  Maladie: { bg: '#EF4444', accent: '#EF4444' },
  'Symptôme': { bg: '#F59E0B', accent: '#F59E0B' },
  Expression: { bg: '#10B981', accent: '#10B981' }
};

const LANG_ROWS = [
  { code: 'FR', key: 'fr', field: 'fr' },
  { code: 'EN', key: 'en', field: 'en' },
  { code: 'MG', key: 'mg', field: 'mg' }
];

export default function VocabCard({
  item,
  lang,
  mode = 'lecture',
  revisionLang = 'en',
  revealAll = false,
  onImageClick
}) {
  const [playing, setPlaying] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  const handleSpeak = async (e) => {
    e.stopPropagation();
    if (playing) return;
    if (!item.en) return;
    setPlaying(true);
    try {
      await speechService.speak(item.en);
    } finally {
      setPlaying(false);
    }
  };

  const colors = CATEGORY_COLORS[item.category] || { bg: '#6B7280', accent: '#6B7280' };
  const activeWord = lang === 'en' ? item.en : lang === 'mg' ? item.mg : item.fr;
  const isRevision = mode === 'revision';
  const canPractice =
    isPracticeEnabled() &&
    (item.category === 'Expression' || item.tab === 'expressions') &&
    !!item.en;

  return (
    <div className="group rounded-2xl border border-[#dadce0] bg-white hover:shadow-md transition-all p-5 flex gap-4 items-start">
      {item.image && (
        <button
          type="button"
          onClick={() => onImageClick?.(item.image, activeWord)}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#dadce0]/50 bg-[#f8f9fa] cursor-zoom-in"
        >
          <img
            src={item.image}
            alt={activeWord}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[20px] font-semibold text-[#202124] leading-tight">
              {isRevision
                ? (revisionLang === 'en' ? item.en : revisionLang === 'mg' ? item.mg : item.fr)
                : activeWord}
            </div>
            {item.phonetic && (
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[9px] font-semibold uppercase tracking-wide text-[#dadce0] select-none"
                  title="Prononciation anglaise (IPA)"
                >
                  pron.
                </span>
                <span className="text-[13px] text-[#9aa0a6] font-medium">
                  {item.phonetic}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {canPractice && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPractice((v) => !v);
                }}
                title="Oral practice"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  showPractice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368]'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSpeak}
              title="Écouter la prononciation anglaise"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                playing
                  ? 'bg-[#1a73e8] text-white scale-110'
                  : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368]'
              }`}
            >
              {playing ? (
                <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 ml-[1px]" />
              )}
            </button>
          </div>
        </div>

        <div className="h-px bg-[#dadce0]/60 mb-3" />

        <div className="space-y-2.5">
          {LANG_ROWS.map(({ code, key, field }) =>
            isRevision ? (
              <RevealableLangRow
                key={key}
                code={code}
                text={item[field]}
                langKey={key}
                revisionLang={revisionLang}
                forceRevealed={revealAll}
                isActive={lang === key}
              />
            ) : (
              <LangRow key={key} code={code} text={item[field]} isActive={lang === key} />
            )
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wide"
            style={{ background: colors.bg }}
          >
            {item.category}
          </span>
        </div>

        {canPractice && showPractice && (
          <PronunciationPractice targetText={item.en} phonetic={item.phonetic} />
        )}
      </div>
    </div>
  );
}
