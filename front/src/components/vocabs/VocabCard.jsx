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
  Organe: { bg: '#2563EB', soft: '#EFF6FF', accent: '#3B82F6' },
  Maladie: { bg: '#EF4444', soft: '#FEF2F2', accent: '#F87171' },
  Symptôme: { bg: '#F59E0B', soft: '#FFFBEB', accent: '#FBBF24' },
  Expression: { bg: '#10B981', soft: '#ECFDF5', accent: '#34D399' },
  Scénario: { bg: '#7c3aed', soft: '#F5F3FF', accent: '#A78BFA' },
};

const FIELD_SOFT = {
  synonyms: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  antonyms: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  context: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  notes: { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  particle: { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  pattern: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  register: { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1' },
};

const DEFAULT_FIELD_SOFT = { bg: '#F8FAFC', text: '#334155', border: '#E2E8F0' };

const LANG_ROWS = [
  { code: 'FR', key: 'fr', field: 'fr' },
  { code: 'EN', key: 'en', field: 'en' },
  { code: 'MG', key: 'mg', field: 'mg' },
];

function Section({ label, children, soft }) {
  const tone = soft || DEFAULT_FIELD_SOFT;
  return (
    <div className="mt-2.5 pt-2.5 border-t border-[#e8eaed]">
      <p
        className="text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{ color: tone.text }}
      >
        {label}
      </p>
      <div className="text-[14px] sm:text-[15px] text-[#3c4043] leading-snug">{children}</div>
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
  const structureLangs = structured ? structureHeadLangs(itemStructure) : ['fr', 'mg'];

  // Lecture: English is always the title (lexique EN-first).
  const titleEn = hasText(item.en) ? item.en.trim() : '';
  const fallbackTitle = (() => {
    if (hasText(item[lang])) return item[lang].trim();
    for (const code of ['fr', 'mg']) {
      if (hasText(item[code])) return item[code].trim();
    }
    return item.id || '';
  })();

  const isRevision = mode === 'revision';
  const revisionWord = hasText(item[revisionLang])
    ? item[revisionLang].trim()
    : (titleEn || fallbackTitle);
  const displayTitle = isRevision ? revisionWord : (titleEn || fallbackTitle);

  // Image / alt: prefer EN
  const imageAlt = titleEn || displayTitle;

  const otherLangRows = LANG_ROWS.filter((r) => {
    if (!hasText(item[r.field])) return false;
    if (isRevision) {
      // Show all available langs (including EN) for reveal practice
      if (structured && r.key !== 'en' && !structureLangs.includes(r.key)) return false;
      return true;
    }
    // Lecture: EN is title → hide from rows
    if (r.key === 'en') return false;
    if (structured) return structureLangs.includes(r.key);
    return true; // MediVocabs: FR + MG under EN title
  });

  const handleSpeak = async (e) => {
    e.stopPropagation();
    if (playing) return;
    const speakText = titleEn || displayTitle;
    if (!speakText) return;
    setPlaying(true);
    try {
      await speechService.speak(speakText);
    } finally {
      setPlaying(false);
    }
  };

  const colors = CATEGORY_COLORS[item.category] || {
    bg: '#6B7280',
    soft: '#F9FAFB',
    accent: '#9CA3AF',
  };

  const canPractice =
    isPracticeEnabled() &&
    (item.category === 'Expression' || item.tab === 'expressions') &&
    !!item.en;

  return (
    <div
      className="group rounded-xl border border-[#dadce0] bg-white hover:shadow-sm transition-all p-3.5 sm:p-4 flex gap-3 items-start"
    >
      {item.image && (
        <button
          type="button"
          onClick={() => onImageClick?.(item.image, imageAlt)}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-[#dadce0]/50 bg-[#f8f9fa] cursor-zoom-in"
        >
          <img
            src={item.image}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <div className="text-[18px] sm:text-[19px] font-semibold text-[#202124] leading-tight tracking-tight">
              {displayTitle}
            </div>
            {hasText(item.phonetic) && (
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#6366F1]/80">
                  IPA
                </span>
                <span className="text-[14px] sm:text-[15px] text-[#4F46E5] font-medium leading-snug">
                  {item.phonetic}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {canPractice && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowPractice((v) => !v); }}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${showPractice ? 'bg-emerald-600 text-white' : 'bg-[#f1f3f4] text-[#5f6368]'}`}
                aria-label="Pratique orale"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            {(titleEn || displayTitle) && (
              <button
                type="button"
                onClick={handleSpeak}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${playing ? 'bg-[#1a73e8] text-white' : 'bg-[#f1f3f4] text-[#5f6368]'}`}
                aria-label="Écouter"
              >
                {playing ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                ) : (
                  <Volume2 className="w-4 h-4 ml-[1px]" />
                )}
              </button>
            )}
          </div>
        </div>

        {item.category && (
          <span
            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md text-white mb-2"
            style={{ background: colors.bg }}
          >
            {item.category}
          </span>
        )}

        {otherLangRows.length > 0 && (
          <div className="space-y-1 rounded-lg bg-[#f8f9fa]/80 px-1 py-0.5">
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
        )}

        {structured && (itemStructure.fields || []).map((f) => {
          if (f.id === 'phonetic') return null;
          if (!fieldHasContent(item, f)) return null;
          const label = structureFieldLabel(f, lang);
          const soft = FIELD_SOFT[f.id] || DEFAULT_FIELD_SOFT;
          if (f.type === 'list') {
            const entries = normalizeListField(item[f.id], f.translate);
            return (
              <Section key={f.id} label={label} soft={soft}>
                <div className="flex flex-wrap gap-1.5">
                  {entries.map((entry, i) => {
                    const primary = listEntryPrimary(entry);
                    const extra = f.translate && typeof entry === 'object'
                      ? structureLangs
                        .map((c) => entry[c])
                        .filter(hasText)
                        .join(' · ')
                      : '';
                    return (
                      <span
                        key={`${f.id}-${i}`}
                        className="inline-flex flex-col text-[13px] sm:text-[14px] px-2 py-1 rounded-md border"
                        style={{
                          background: soft.bg,
                          color: soft.text,
                          borderColor: soft.border,
                        }}
                      >
                        <span className="font-medium leading-snug">{primary}</span>
                        {extra && (
                          <span className="text-[12px] opacity-80 leading-snug">{extra}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </Section>
            );
          }
          if (f.translate) {
            return (
              <Section key={f.id} label={label} soft={soft}>
                <p
                  className="italic px-2 py-1.5 rounded-md border leading-snug"
                  style={{ background: soft.bg, borderColor: soft.border }}
                >
                  {pickI18nText(item[f.id], lang)}
                </p>
              </Section>
            );
          }
          return (
            <Section key={f.id} label={label} soft={soft}>
              <span
                className="inline-block px-2 py-1 rounded-md border leading-snug"
                style={{ background: soft.bg, borderColor: soft.border, color: soft.text }}
              >
                {String(item[f.id]).trim()}
              </span>
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
