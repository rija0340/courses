/**
 * Scenario card: long patient↔doctor dialogue for the scenarios tab.
 * Uses DialogueLangLines for FR/EN/MG badges, TTS EN, oral practice per turn.
 */
import React, { useState } from 'react';
import { ChevronDown, MessagesSquare, Volume2 } from 'lucide-react';
import { hasText } from '../../utils/vocabDialogue';
import DialogueLangLines from './DialogueLangLines';
import { speechService } from '../../practice/services/speechService';

function TurnBubble({ turn }) {
  const role = turn.role === 'doctor' ? 'doctor' : 'patient';
  const isDoctor = role === 'doctor';
  if (!hasText(turn.en) && !hasText(turn.fr) && !hasText(turn.mg)) return null;

  return (
    <div className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`w-full max-w-[100%] sm:max-w-[95%] rounded-2xl px-3 py-2.5 ${
          isDoctor
            ? 'bg-[#e8f0fe] rounded-br-md'
            : 'bg-[#f1f3f4] rounded-bl-md'
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6] mb-1.5 px-1.5">
          {isDoctor ? 'Doctor' : 'Patient'}
        </p>
        <DialogueLangLines line={turn} />
      </div>
    </div>
  );
}

export default function ScenarioCard({ item, lang = 'fr' }) {
  const [open, setOpen] = useState(false);
  const [titlePlaying, setTitlePlaying] = useState(false);
  const turns = Array.isArray(item.dialogue) ? item.dialogue : [];
  const title =
    lang === 'en' ? item.en : lang === 'mg' ? (item.mg || item.fr || item.en) : (item.fr || item.en);

  const handleTitleSpeak = async (e) => {
    e.stopPropagation();
    if (titlePlaying || !item.en?.trim()) return;
    setTitlePlaying(true);
    try {
      await speechService.speak(item.en.trim());
    } finally {
      setTitlePlaying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#dadce0] bg-white hover:shadow-md transition-all p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex-1 min-w-0 min-h-[48px] flex items-start justify-between gap-3 text-left"
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
            {/* Title translations with lang cues when not the active lang */}
            {lang !== 'en' && hasText(item.en) && (
              <p className="text-[13px] text-[#5f6368] mt-1">
                <span className="font-bold text-[#9aa0a6] mr-1">EN</span>
                {item.en}
              </p>
            )}
            {lang !== 'fr' && hasText(item.fr) && (
              <p className="text-[13px] text-[#5f6368] mt-0.5">
                <span className="font-bold text-[#9aa0a6] mr-1">FR</span>
                {item.fr}
              </p>
            )}
            {hasText(item.mg) && lang !== 'mg' && (
              <p className="text-[13px] text-[#3c4043] mt-0.5">
                <span className="font-bold text-[#9aa0a6] mr-1">MG</span>
                {item.mg}
              </p>
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

        {hasText(item.en) && (
          <button
            type="button"
            onClick={handleTitleSpeak}
            disabled={titlePlaying}
            title="Écouter le titre (anglais)"
            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              titlePlaying
                ? 'bg-[#1a73e8] text-white'
                : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368]'
            }`}
          >
            {titlePlaying ? (
              <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 ml-[1px]" />
            )}
          </button>
        )}
      </div>

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
