/**
 * Scenario card: long patient↔doctor dialogue for the scenarios tab.
 * Filtered by categoryId upstream (same as other vocab items).
 * Mobile-first: full-width, collapsed by default, large toggle.
 */
import React, { useState } from 'react';
import { ChevronDown, MessagesSquare } from 'lucide-react';
import { hasText } from '../../utils/vocabDialogue';

function TurnBubble({ turn }) {
  const role = turn.role === 'doctor' ? 'doctor' : 'patient';
  const isDoctor = role === 'doctor';
  const en = turn.en?.trim();
  const fr = turn.fr?.trim();
  const mg = turn.mg?.trim();
  if (!en && !fr && !mg) return null;

  return (
    <div className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
          isDoctor
            ? 'bg-[#e8f0fe] rounded-br-md'
            : 'bg-[#f1f3f4] rounded-bl-md'
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6] mb-1">
          {isDoctor ? 'Doctor' : 'Patient'}
        </p>
        {hasText(en) && (
          <p className="text-[14px] text-[#202124] leading-snug">{en}</p>
        )}
        {hasText(fr) && (
          <p className="text-[13px] text-[#5f6368] italic mt-1 leading-snug">{fr}</p>
        )}
        {/* MG optional — omit entirely when empty */}
        {hasText(mg) && (
          <p className="text-[12px] text-[#0d9488] mt-1 leading-snug">{mg}</p>
        )}
      </div>
    </div>
  );
}

export default function ScenarioCard({ item, lang = 'fr' }) {
  const [open, setOpen] = useState(false);
  const turns = Array.isArray(item.dialogue) ? item.dialogue : [];
  const title =
    lang === 'en' ? item.en : lang === 'mg' ? (item.mg || item.fr || item.en) : (item.fr || item.en);

  return (
    <div className="rounded-2xl border border-[#dadce0] bg-white hover:shadow-md transition-all p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full min-h-[48px] flex items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white tracking-wide bg-[#7c3aed]">
              Scénario
            </span>
            <span className="text-[11px] text-[#9aa0a6] tabular-nums">
              {turns.length} réplique{turns.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-[17px] sm:text-[18px] font-semibold text-[#202124] leading-snug">
            {title}
          </div>
          {/* Secondary titles — hide empty MG */}
          {lang !== 'en' && hasText(item.en) && (
            <p className="text-[13px] text-[#5f6368] mt-1">{item.en}</p>
          )}
          {lang !== 'fr' && hasText(item.fr) && (
            <p className="text-[13px] text-[#5f6368] mt-0.5 italic">{item.fr}</p>
          )}
          {hasText(item.mg) && lang !== 'mg' && (
            <p className="text-[12px] text-[#0d9488] mt-0.5">{item.mg}</p>
          )}
        </div>
        <span className="shrink-0 w-11 h-11 rounded-full bg-[#f1f3f4] flex items-center justify-center">
          {open ? (
            <ChevronDown className="w-5 h-5 text-[#5f6368] rotate-180 transition-transform" />
          ) : (
            <MessagesSquare className="w-5 h-5 text-[#7c3aed]" />
          )}
        </span>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-[#dadce0]/60 space-y-2.5">
          {turns.length === 0 ? (
            <p className="text-[13px] text-[#9aa0a6] text-center py-4">
              Aucune réplique pour ce scénario.
            </p>
          ) : (
            turns.map((turn, idx) => <TurnBubble key={`${item.id}-turn-${idx}`} turn={turn} />)
          )}
        </div>
      )}
    </div>
  );
}

