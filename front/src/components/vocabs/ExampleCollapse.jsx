/**
 * Collapsible mini patient/doctor example on VocabCard (symptoms & conditions).
 * Mobile-first: large tap target, collapsed by default. MG lines hidden if empty.
 */
import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { hasExample, hasText, highlightCollocation } from '../../utils/vocabDialogue';

function SpeakerBlock({ label, side, align = 'start', highlightTerms }) {
  if (!side) return null;
  const en = side.en?.trim();
  const fr = side.fr?.trim();
  const mg = side.mg?.trim();
  if (!en && !fr && !mg) return null;

  const isDoctor = align === 'end';

  return (
    <div className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
          isDoctor
            ? 'bg-[#e8f0fe] rounded-br-md'
            : 'bg-[#f1f3f4] rounded-bl-md'
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6] mb-1">
          {label}
        </p>
        {hasText(en) && (
          <p className="text-[14px] text-[#202124] leading-snug">
            {highlightCollocation(en, highlightTerms?.en)}
          </p>
        )}
        {hasText(fr) && (
          <p className="text-[13px] text-[#5f6368] italic mt-1 leading-snug">
            {highlightCollocation(fr, highlightTerms?.fr)}
          </p>
        )}
        {hasText(mg) && (
          <p className="text-[12px] text-[#0d9488] mt-1 leading-snug">
            {highlightCollocation(mg, highlightTerms?.mg)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExampleCollapse({ example, item }) {
  const [open, setOpen] = useState(false);

  if (!hasExample(example)) return null;

  const terms = { en: item?.en, fr: item?.fr, mg: item?.mg };

  return (
    <div className="mt-3 border-t border-[#dadce0]/60 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full min-h-[44px] inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] transition-colors text-left"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1a73e8]">
          <MessageCircle className="w-4 h-4 shrink-0" />
          Exemple / dialogue
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#5f6368] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-2.5">
          <SpeakerBlock
            label="Patient"
            side={example.patient}
            align="start"
            highlightTerms={terms}
          />
          <SpeakerBlock
            label="Doctor"
            side={example.doctor}
            align="end"
            highlightTerms={terms}
          />
        </div>
      )}
    </div>
  );
}
