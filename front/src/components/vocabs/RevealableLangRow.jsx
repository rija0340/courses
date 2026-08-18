import React, { useState } from 'react';

const LANG_STYLES = {
  FR: { badgeBg: '#E8F0FE', badgeText: '#1a73e8', border: '#1a73e8' },
  EN: { badgeBg: '#F1F3F4', badgeText: '#5f6368', border: '#5f6368' },
  MG: { badgeBg: '#E6F4EA', badgeText: '#10B981', border: '#10B981' }
};

const LANG_CODE_MAP = { fr: 'FR', en: 'EN', mg: 'MG' };

export default function RevealableLangRow({
  code,
  text,
  langKey,
  revisionLang,
  forceRevealed = false,
  isActive = false
}) {
  const [revealed, setRevealed] = useState(false);
  const isTarget = langKey === revisionLang;
  const hidden = !isTarget && !revealed && !forceRevealed;
  const style = LANG_STYLES[code];

  return (
    <div
      className={`vocab-language-row relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
        isTarget || isActive ? 'bg-[#f8f9fa]' : ''
      }`}
    >
      <span
        className="w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0"
        style={{ background: style.badgeBg, color: style.badgeText }}
      >
        {code}
      </span>
      <div className="flex-1 min-w-0 relative">
        <span
          className={`text-[15px] leading-snug block transition-all ${
            isTarget || isActive ? 'font-semibold text-[#202124]' : 'text-[#3c4043]'
          } ${hidden ? 'blur-sm select-none' : ''}`}
        >
          {text}
        </span>
        {hidden && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="absolute inset-0 flex items-center justify-start pl-0 text-[11px] font-semibold text-[#1a73e8] hover:text-[#1b66c9] cursor-pointer"
          >
            Cliquer pour révéler
          </button>
        )}
      </div>
    </div>
  );
}

export function LangRow({ code, text, isActive }) {
  const style = LANG_STYLES[code];
  return (
    <div className={`vocab-language-row flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${isActive ? 'bg-[#f8f9fa]' : ''}`}>
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

export { LANG_CODE_MAP, LANG_STYLES };
