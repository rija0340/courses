import React from 'react';

/** Shared practice chrome — modern, light, teal accent (not medical-blue only). */

export function PracticePageShell({ children }) {
  return (
    <div className="relative min-h-[70vh]">
      <div
        className="pointer-events-none absolute inset-x-0 -top-6 h-56 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(13,148,136,0.12), transparent 60%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(14,165,233,0.10), transparent 55%)',
        }}
        aria-hidden
      />
      <div className="relative max-w-3xl mx-auto px-4 py-6 sm:py-8">{children}</div>
    </div>
  );
}

export function PracticeCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-[#e5e7eb] bg-white/95 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

export function PracticeCardHeader({ title, hint, icon, badge }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-1 sm:px-6 sm:pt-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-[#0f172a]">
            {title}
          </h2>
          {badge}
        </div>
        {hint && (
          <p className="text-[13px] text-[#64748b] mt-1.5 leading-snug max-w-xl">{hint}</p>
        )}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-100/80 flex items-center justify-center text-teal-700 shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}

export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div
      className={`inline-flex p-1 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] gap-0.5 ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={opt.disabled}
            onClick={() => onChange(opt.id)}
            className={`relative flex-1 min-w-0 px-3 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all disabled:opacity-40 ${
              active
                ? 'bg-white text-teal-800 shadow-sm ring-1 ring-black/5'
                : 'text-[#64748b] hover:text-[#334155]'
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
      {children}
    </span>
  );
}

export function PracticeInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3.5 text-[14px] text-[#0f172a] outline-none transition-colors placeholder:text-[#94a3b8] focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${className}`}
    />
  );
}

export function PracticeSelect({ className = '', children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3.5 text-[14px] text-[#0f172a] outline-none transition-colors focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${className}`}
    >
      {children}
    </select>
  );
}

export function PracticeTextarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5 text-[14px] text-[#0f172a] outline-none transition-colors resize-y placeholder:text-[#94a3b8] focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 ${className}`}
    />
  );
}

export function ChoicePill({ active, onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-[12px] font-semibold px-3.5 py-2 rounded-xl border transition-all disabled:opacity-40 ${
        active
          ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-sm'
          : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
      }`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 text-white text-[13px] font-semibold shadow-sm shadow-teal-600/20 hover:from-teal-700 hover:to-sky-700 disabled:opacity-45 disabled:shadow-none transition-all ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-40 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function SoftBadge({ children, tone = 'teal' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-800 border-teal-100',
    sky: 'bg-sky-50 text-sky-800 border-sky-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <span className={`inline-flex text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${tones[tone] || tones.teal}`}>
      {children}
    </span>
  );
}
