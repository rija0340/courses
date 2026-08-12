import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import RevealableLangRow, { LangRow } from './RevealableLangRow';
import PronunciationPractice from '../../practice/components/PronunciationPractice';
import { isPracticeEnabled } from '../../practice/config';
import { speechService } from '../../practice/services/speechService';
import ExampleCollapse from './ExampleCollapse';
import { hasExample } from '../../utils/vocabDialogue';
import {
  structureFieldLabel,
  structureHeadLangs,
  normalizeListField,
  pickI18nText,
  fieldHasContent,
  hasText,
  listEntryPrimary,
} from '../../data/vocabs/vocabItemStructure';

const CATEGORY_COLORS = {
  Organe: { bg: '#2563EB' },
  Maladie: { bg: '#EF4444' },
  'Symptôme': { bg: '#F59E0B' },
  Expression: { bg: '#10B981' },
  Scénario: { bg: '#7c3aed' },
};

const LANG_ROWS = [
  { code: 'FR', key: 'fr', field: 'fr' },
  { code: 'EN', key: 'en', field: 'en' },
  { code: 'MG', key: 'mg', field: 'mg' },
];

function Section({ label, children }) {
  return (
    <div className="mt-3 pt-3 border-t border-[#dadce0]/60">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6] mb-1.5">{label}</p>
      <div className="text-[14px] text-[#3c4043] leading-relaxed">{children}</div>
    </div>
  );
}

export default function VocabCard({
  item,
  lang,
  mode = 'lecture',
  revisionLang = 'en',
  revealAll = false,
  onImageClick,
  itemStructure = null,
}) {
  const [playing, setPlaying] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  const structured = Boolean(itemStructure);
  const headLangs = structured ? ['en', ...structureHeadLangs(itemStructure)] : ['fr', 'en', 'mg'];
  const displayWord = (() => {
    if (hasText(item[lang]) && headLangs.includes(lang)) return item[lang].trim();
    if (hasText(item.en)) return item.en.trim();
    for (const code of headLangs) {
      if (hasText(item[code])) return item[code].trim();
    }
    return item.id || '';
  })();

  const filledLangRows = LANG_ROWS.filter((r) => {
    if (!hasText(item[r.field])) return false;
    if (structured && r.key !== 'en' && !structureHeadLangs(itemStructure).includes(r.key) && r.key !== 'en') {
      // still show if has text for legacy
      return structureHeadLangs(itemStructure).includes(r.key) || r.key === 'en';
    }
    if (structured) {
      if (r.key === 'en') return false; // shown as title
      return structureHeadLangs(itemStructure).includes(r.key);
    }
    return true;
  });

  // Lecture: hide title language from rows when unstructured too
  const otherLangRows = mode === 'revision'
    ? (structured
      ? LANG_ROWS.filter((r) => hasText(item[r.field]) && (r.key === 'en' || structureHeadLangs(itemStructure).includes(r.key) || !structured))
      : LANG_ROWS.filter((r) => hasText(item[r.field])))
    : filledLangRows.filter((r) => (item[r.field] || '').trim().toLowerCase() !== displayWord.trim().toLowerCase());

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

  const colors = CATEGORY_COLORS[item.category] || { bg: '#6B7280' };
  const isRevision = mode === 'revision';
  const canPractice =
    isPracticeEnabled() &&
    (item.category === 'Expression' || item.tab === 'expressions') &&
    !!item.en;

  const revisionWord = hasText(item[revisionLang])
    ? item[revisionLang]
    : displayWord;

  return (
    <div className="group rounded-2xl border border-[#dadce0] bg-white hover:shadow-md transition-all p-5 flex gap-4 items-start">
      {item.image && (
        <button
          type="button"
          onClick={() => onImageClick?.(item.image, displayWord)}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#dadce0]/50 bg-[#f8f9fa] cursor-zoom-in"
        >
          <img src={item.image} alt={displayWord} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[20px] font-semibold text-[#202124] leading-tight">
              {isRevision ? revisionWord : displayWord}
            </div>
            {hasText(item.phonetic) && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-semibold uppercase tracking-wide text-[#dadce0]">pron.</span>
                <span className="text-[13px] text-[#9aa0a6] font-medium">{item.phonetic}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {canPractice && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowPractice((v) => !v); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${showPractice ? 'bg-emerald-600 text-white' : 'bg-[#f1f3f4] text-[#5f6368]'}`}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            {(item.en || displayWord) && (
              <button
                type="button"
                onClick={handleSpeak}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${playing ? 'bg-[#1a73e8] text-white' : 'bg-[#f1f3f4] text-[#5f6368]'}`}
              >
                {playing ? <div className="w-4 h-4 rounded-full bg-white animate-pulse" /> : <Volume2 className="w-4 h-4 ml-[1px]" />}
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
          <div className="mt-4">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: colors.bg }}>
              {item.category}
            </span>
          </div>
        )}

        {structured && (itemStructure.fields || []).map((f) => {
          if (f.id === 'phonetic') return null;
          if (!fieldHasContent(item, f)) return null;
          const label = structureFieldLabel(f.id, lang);
          if (f.type === 'list') {
            const entries = normalizeListField(item[f.id], f.translate);
            return (
              <Section key={f.id} label={label}>
                <div className="flex flex-wrap gap-1.5">
                  {entries.map((entry, i) => {
                    const primary = listEntryPrimary(entry);
                    const extra = f.translate && typeof entry === 'object'
                      ? structureHeadLangs(itemStructure)
                        .map((c) => entry[c])
                        .filter(hasText)
                        .join(' · ')
                      : '';
                    return (
                      <span key={`${f.id}-${i}`} className="inline-flex flex-col text-[12px] px-2 py-1 rounded-lg bg-[#f1f3f4]">
                        <span className="font-medium">{primary}</span>
                        {extra && <span className="text-[#5f6368]">{extra}</span>}
                      </span>
                    );
                  })}
                </div>
              </Section>
            );
          }
          if (f.translate) {
            return (
              <Section key={f.id} label={label}>
                <p className="italic">{pickI18nText(item[f.id], lang)}</p>
              </Section>
            );
          }
          return (
            <Section key={f.id} label={label}>
              {String(item[f.id]).trim()}
            </Section>
          );
        })}

        {hasExample(item.example) && <ExampleCollapse example={item.example} item={item} />}
        {canPractice && showPractice && (
          <PronunciationPractice targetText={item.en} phonetic={item.phonetic} />
        )}
      </div>
    </div>
  );
}
