import React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RefreshCw, SkipForward } from 'lucide-react';
import { useConversationPlayer } from '../hooks/useConversationPlayer';
import { PracticeCard, SecondaryButton, SoftBadge } from './practiceUi';

const ROLE_STYLE = {
  doctor: { bubble: 'bg-sky-50 border-sky-100', badge: 'bg-sky-100 text-sky-800', align: 'start' },
  nurse: { bubble: 'bg-violet-50 border-violet-100', badge: 'bg-violet-100 text-violet-800', align: 'start' },
  receptionist: { bubble: 'bg-emerald-50 border-emerald-100', badge: 'bg-emerald-100 text-emerald-800', align: 'start' },
  a: { bubble: 'bg-teal-50 border-teal-100', badge: 'bg-teal-100 text-teal-900', align: 'end' },
  b: { bubble: 'bg-slate-50 border-slate-200', badge: 'bg-slate-200 text-slate-800', align: 'start' },
  partner: { bubble: 'bg-slate-50 border-slate-200', badge: 'bg-slate-200 text-slate-800', align: 'start' },
  patient: { bubble: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-900', align: 'end' },
  learner: { bubble: 'bg-teal-50 border-teal-100', badge: 'bg-teal-100 text-teal-900', align: 'end' },
};

function roleStyle(role) {
  const r = String(role || '').toLowerCase();
  if (ROLE_STYLE[r]) return ROLE_STYLE[r];
  if (/doctor|physician|partner|tutor|teacher|nurse|reception|^b$/.test(r)) {
    return ROLE_STYLE.b;
  }
  if (/patient|learner|student|^a$/.test(r)) return ROLE_STYLE.a;
  return {
    bubble: 'bg-[#f8fafc] border-[#e2e8f0]',
    badge: 'bg-[#f1f5f9] text-[#475569]',
    align: 'start',
  };
}

export default function ConversationPlayer({
  turns = [],
  title,
  coverage = null,
  onGenerateAnother,
  generating = false,
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
    setIndex,
  } = useConversationPlayer(turns);

  if (!turns.length) return null;

  return (
    <PracticeCard className="overflow-hidden">
      <div className="px-5 pt-5 sm:px-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {title && (
            <div className="text-[16px] font-semibold text-[#0f172a] truncate">{title}</div>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <SoftBadge tone="slate">2 voix</SoftBadge>
            <span className="text-[11px] text-[#94a3b8]">session seule</span>
          </div>
        </div>
        {onGenerateAnother && (
          <SecondaryButton onClick={onGenerateAnother} disabled={generating || playing}>
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            Nouveau
          </SecondaryButton>
        )}
      </div>

      {coverage && (
        <div className="mx-5 sm:mx-6 mt-3 rounded-xl bg-gradient-to-r from-teal-50/80 to-sky-50/60 border border-teal-100/80 px-3.5 py-2.5 text-[12px]">
          <span className="font-semibold text-teal-900">
            Vocab : {coverage.required - (coverage.missing?.length || 0)}/{coverage.required}
          </span>
          {coverage.padded > 0 && (
            <span className="text-teal-700/80"> · +{coverage.padded} tours</span>
          )}
          {!!coverage.missing?.length && (
            <div className="mt-1 text-[#c5221f]">
              Manque : {coverage.missing.join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="px-4 sm:px-5 py-4 space-y-2.5 max-h-[22rem] overflow-y-auto">
        {turns.map((turn, i) => {
          const style = roleStyle(turn.role);
          const active = i === index;
          const isEnd = style.align === 'end';
          return (
            <button
              key={turn.id || i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-full flex ${isEnd ? 'justify-end' : 'justify-start'} text-left group`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl border px-3.5 py-2.5 transition-all ${
                  style.bubble
                } ${
                  active
                    ? 'ring-2 ring-teal-400/50 shadow-sm scale-[1.01]'
                    : 'opacity-90 group-hover:opacity-100'
                } ${isEnd ? 'rounded-br-md' : 'rounded-bl-md'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${style.badge}`}
                  >
                    {turn.role}
                  </span>
                  {active && (
                    <span className="text-[10px] font-semibold text-teal-700">en cours</span>
                  )}
                </div>
                <div className="text-[14px] sm:text-[15px] text-[#0f172a] leading-snug">
                  {turn.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-0 border-t border-[#e2e8f0] bg-white/95 backdrop-blur px-4 sm:px-5 py-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={index <= 0 || playing}
          className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-[#475569] disabled:opacity-40 hover:bg-[#e2e8f0]"
          aria-label="Tour précédent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {playing ? (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-teal-600 text-white text-[13px] font-semibold px-4 shadow-sm"
          >
            <Pause className="w-4 h-4" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={playCurrent}
            disabled={!current}
            className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 text-white text-[13px] font-semibold px-4 shadow-sm disabled:opacity-40"
          >
            <Play className="w-4 h-4" />
            Lire
          </button>
        )}

        <button
          type="button"
          onClick={playContinuous}
          disabled={playing}
          className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[#f1f5f9] text-[#334155] text-[13px] font-semibold px-3 disabled:opacity-40 hover:bg-[#e2e8f0]"
        >
          <SkipForward className="w-4 h-4" />
          Continu
        </button>

        <button
          type="button"
          onClick={next}
          disabled={index >= turns.length - 1 || playing}
          className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-[#475569] disabled:opacity-40 hover:bg-[#e2e8f0]"
          aria-label="Tour suivant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="text-[12px] font-medium text-[#94a3b8] ml-auto tabular-nums">
          {index + 1} / {turns.length}
        </span>
      </div>
    </PracticeCard>
  );
}
