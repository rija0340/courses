import React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RefreshCw, SkipForward } from 'lucide-react';
import { useConversationPlayer } from '../hooks/useConversationPlayer';

const ROLE_STYLE = {
  doctor: 'bg-sky-100 text-sky-800',
  nurse: 'bg-violet-100 text-violet-800',
  patient: 'bg-amber-100 text-amber-900',
  learner: 'bg-amber-100 text-amber-900',
  receptionist: 'bg-emerald-100 text-emerald-800',
  partner: 'bg-slate-100 text-slate-700'
};

function roleClass(role) {
  const r = String(role || '').toLowerCase();
  if (ROLE_STYLE[r]) return ROLE_STYLE[r];
  if (/doctor|physician/.test(r)) return ROLE_STYLE.doctor;
  if (/patient|learner/.test(r)) return ROLE_STYLE.patient;
  return 'bg-[#f1f3f4] text-[#5f6368]';
}

export default function ConversationPlayer({
  turns = [],
  title,
  coverage = null,
  onGenerateAnother,
  generating = false
}) {
  const {
    index,
    current,
    playing,
    playCurrent,
    playContinuous,
    next,
    prev,
    stop,
    setIndex
  } = useConversationPlayer(turns);

  if (!turns.length) return null;

  return (
    <div className="rounded-2xl border border-[#dadce0] bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && (
            <div className="text-[13px] font-semibold text-[#202124]">{title}</div>
          )}
          <div className="text-[11px] text-[#9aa0a6] mt-0.5">
            Two voices: doctor ≠ patient · session only
          </div>
        </div>
        {onGenerateAnother && (
          <button
            type="button"
            onClick={onGenerateAnother}
            disabled={generating || playing}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dadce0] bg-white text-[12px] font-semibold px-3 py-1.5 text-[#1a73e8] hover:bg-[#e8f0fe] disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            New dialogue
          </button>
        )}
      </div>

      {coverage && (
        <div className="rounded-xl bg-[#f8f9fa] border border-[#dadce0] px-3 py-2 text-[12px]">
          <span className="font-semibold text-[#3c4043]">
            Vocab covered: {coverage.required - (coverage.missing?.length || 0)}/
            {coverage.required}
          </span>
          {coverage.padded > 0 && (
            <span className="text-[#5f6368]"> · padded {coverage.padded} turns</span>
          )}
          {!!coverage.missing?.length && (
            <div className="mt-1 text-[#c5221f]">
              Still missing: {coverage.missing.join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {turns.map((turn, i) => (
          <button
            key={turn.id || i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-full text-left rounded-xl px-3 py-2 transition-colors ${
              i === index
                ? 'bg-[#e8f0fe] border border-[#1a73e8]/30'
                : 'bg-[#f8f9fa] hover:bg-[#f1f3f4]'
            }`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${roleClass(turn.role)}`}
              >
                {turn.role}
              </span>
            </div>
            <div className="text-[14px] text-[#202124]">{turn.text}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={index <= 0 || playing}
          className="w-9 h-9 rounded-full bg-[#f1f3f4] flex items-center justify-center disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {playing ? (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2"
          >
            <Pause className="w-4 h-4" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={playCurrent}
            disabled={!current}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1a73e8] text-white text-[13px] font-semibold px-4 py-2 disabled:opacity-40"
          >
            <Play className="w-4 h-4" />
            Play turn
          </button>
        )}

        <button
          type="button"
          onClick={playContinuous}
          disabled={playing}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f3f4] text-[#3c4043] text-[13px] font-semibold px-3 py-2 disabled:opacity-40"
        >
          <SkipForward className="w-4 h-4" />
          Continuous
        </button>

        <button
          type="button"
          onClick={next}
          disabled={index >= turns.length - 1 || playing}
          className="w-9 h-9 rounded-full bg-[#f1f3f4] flex items-center justify-center disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="text-[12px] text-[#9aa0a6] ml-auto">
          {index + 1} / {turns.length}
        </span>
      </div>
    </div>
  );
}
