import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import RevealableLangRow, { LangRow } from './RevealableLangRow';
import PronunciationPractice from '../../practice/components/PronunciationPractice';
import { isPracticeEnabled } from '../../practice/config';
import { speechService } from '../../practice/services/speechService';
import ExampleCollapse from './ExampleCollapse';
import { hasExample } from '../../utils/vocabDialogue';
import {
  getItemDisplayWord,
  getFilledLangRows,
  getProfileExtraFields,
  ITEM_PROFILE_FIELD_META,
  normalizeStringList,
  pickI18nText,
  profileFieldHasContent,
  hasText,
} from '../../data/vocabs/vocabItemProfiles';

const CATEGORY_COLORS = {
  Organe: { bg: '#2563EB', accent: '#2563EB' },
  Maladie: { bg: '#EF4444', accent: '#EF4444' },
  'Symptôme': { bg: '#F59E0B', accent: '#F59E0B' },
  Expression: { bg: '#10B981', accent: '#10B981' },
  Scénario: { bg: '#7c3aed', accent: '#7c3aed' },
  Adjectif: { bg: '#8B5CF6', accent: '#8B5CF6' },
};

function ProfileSection({ label, children }) {
  return (
    <div className="mt-3 pt-3 border-t border-[#dadce0]/60">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6] mb-1.5">
        {label}
      </p>
      <div className="text-[14px] text-[#3c4043] leading-relaxed">{children}</div>
    </div>
  );
}

function renderProfileField(item, fieldKey, lang) {
  if (!profileFieldHasContent(item, fieldKey)) return null;
  const meta = ITEM_PROFILE_FIELD_META[fieldKey];
  const label = meta?.label?.fr || fieldKey;

  if (meta?.input === 'tags') {
    const tags = normalizeStringList(item[fieldKey]);
    return (
      <ProfileSection key={fieldKey} label={label}>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex text-[12px] font-medium px-2 py-0.5 rounded-lg bg-[#f1f3f4] text-[#3c4043]"
            >
              {tag}
            </span>
          ))}
        </div>
      </ProfileSection>
    );
  }

  if (meta?.input === 'i18n') {
    const text = pickI18nText(item[fieldKey], lang);
    if (!text) return null;
    return (
      <ProfileSection key={fieldKey} label={label}>
        <p className="italic">{text}</p>
      </ProfileSection>
    );
  }

  if (!hasText(item[fieldKey])) return null;
  return (
    <ProfileSection key={fieldKey} label={label}>
      {String(item[fieldKey]).trim()}
    </ProfileSection>
  );
}

export default function VocabCard({
  item,
  lang,
  mode = 'lecture',
  revisionLang = 'en',
  revealAll = false,
  onImageClick,
  itemProfile = 'basic',
}) {
  const [playing, setPlaying] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  const displayWord = getItemDisplayWord(item, lang);
  const revisionWord = getItemDisplayWord(item, revisionLang);
  const filledLangs = getFilledLangRows(item, lang);

  const otherLangRows = (() => {
    if (mode === 'revision') return filledLangs;
    if (filledLangs.length <= 1) return [];
    const title = displayWord.trim().toLowerCase();
    return filledLangs.filter((r) => (item[r.field] || '').trim().toLowerCase() !== title);
  })();

  const handleSpeak = async (e) => {
    e.stopPropagation();
    if (playing) return;
    const speakText = item.en?.trim() || displayWord;
    if (!speakText) return;
    setPlaying(true);
    try {
      await speechService.speak(speakText);
    } finally {
      setPlaying(false);
    }
  };

  const colors = CATEGORY_COLORS[item.category] || { bg: '#6B7280', accent: '#6B7280' };
  const isRevision = mode === 'revision';
  const canPractice =
    isPracticeEnabled() &&
    (item.category === 'Expression' || item.tab === 'expressions') &&
    !!item.en;

  const extraFields = getProfileExtraFields(itemProfile).filter((k) => k !== 'phonetic');
  // phonetic shown under title if present
  const showPhonetic = hasText(item.phonetic);

  return (
    <div className="group rounded-2xl border border-[#dadce0] bg-white hover:shadow-md transition-all p-5 flex gap-4 items-start">
      {item.image && (
        <button
          type="button"
          onClick={() => onImageClick?.(item.image, displayWord)}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#dadce0]/50 bg-[#f8f9fa] cursor-zoom-in"
        >
          <img
            src={item.image}
            alt={displayWord}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[20px] font-semibold text-[#202124] leading-tight">
              {isRevision ? revisionWord : displayWord}
            </div>
            {showPhonetic && (
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[9px] font-semibold uppercase tracking-wide text-[#dadce0] select-none"
                  title="Prononciation (IPA)"
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
            {(item.en || displayWord) && (
              <button
                type="button"
                onClick={handleSpeak}
                title="Écouter"
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
            )}
          </div>
        </div>

        {otherLangRows.length > 0 && (
          <>
            <div className="h-px bg-[#dadce0]/60 mb-3" />
            <div className="space-y-2.5">
              {otherLangRows.map(({ code, key, field }) =>
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
          </>
        )}

        {item.category && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wide"
              style={{ background: colors.bg }}
            >
              {item.category}
            </span>
          </div>
        )}

        <div className="flex flex-col">
          {extraFields.map((fieldKey) => renderProfileField(item, fieldKey, lang))}
        </div>

        {hasExample(item.example) && (
          <ExampleCollapse example={item.example} item={item} />
        )}

        {canPractice && showPractice && (
          <PronunciationPractice targetText={item.en} phonetic={item.phonetic} />
        )}
      </div>
    </div>
  );
}
