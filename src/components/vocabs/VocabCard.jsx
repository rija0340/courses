import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

const CATEGORY_COLORS = {
  Organe: { bg: '#2563EB', accent: '#2563EB' },
  Maladie: { bg: '#EF4444', accent: '#EF4444' },
  'Symptôme': { bg: '#F59E0B', accent: '#F59E0B' },
  Expression: { bg: '#10B981', accent: '#10B981' }
};

const LANG_STYLES = {
  FR: { badgeBg: '#E8F0FE', badgeText: '#1a73e8', border: '#1a73e8' },
  EN: { badgeBg: '#F1F3F4', badgeText: '#5f6368', border: '#5f6368' },
  MG: { badgeBg: '#E6F4EA', badgeText: '#10B981', border: '#10B981' }
};

export default function VocabCard({ item, lang }) {
  const [playing, setPlaying] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (playing) return;
    if (!item.en) return;
    const utterance = new SpeechSynthesisUtterance(item.en);
    utterance.lang = 'en-US';
    utterance.onend = () => setPlaying(false);
    setPlaying(true);
    speechSynthesis.speak(utterance);
  };

  const colors = CATEGORY_COLORS[item.category] || { bg: '#6B7280', accent: '#6B7280' };
  const activeWord = lang === 'en' ? item.en : lang === 'mg' ? item.mg : item.fr;

  return (
    <div className="group rounded-2xl border border-[#dadce0] bg-white hover:shadow-md transition-all p-5 flex gap-4 items-start">
      {item.image && (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#dadce0]/50 bg-[#f8f9fa]">
          <img src={item.image} alt={activeWord} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {/* Header: active word + audio */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[20px] font-semibold text-[#202124] leading-tight">
              {activeWord}
            </div>
            {item.phonetic && (
              <div className="text-[13px] text-[#9aa0a6] mt-1 font-medium">
                {item.phonetic}
              </div>
            )}
          </div>
          <button
            onClick={handleSpeak}
            title="Écouter la prononciation anglaise"
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
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
  
        {/* Divider */}
        <div className="h-px bg-[#dadce0]/60 mb-3" />
  
        {/* Language rows */}
        <div className="space-y-2.5">
          <LangRow code="FR" text={item.fr} isActive={lang === 'fr'} />
          <LangRow code="EN" text={item.en} isActive={lang === 'en'} />
          <LangRow code="MG" text={item.mg} isActive={lang === 'mg'} />
        </div>
  
        {/* Category badge */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wide"
            style={{ background: colors.bg }}
          >
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}

function LangRow({ code, text, isActive }) {
  const style = LANG_STYLES[code];
  return (
    <div className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${isActive ? 'bg-[#f8f9fa]' : ''}`}>
      <span
        className="w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0"
        style={{ background: style.badgeBg, color: style.badgeText }}
      >
        {code}
      </span>
      <span className={`text-[15px] leading-snug ${isActive ? 'font-semibold text-[#202124]' : 'text-[#3c4043]'}`}>
        {text}
      </span>
    </div>
  );
}