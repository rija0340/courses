import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const panelClass =
  'absolute top-full mt-1.5 min-w-[160px] py-1 bg-white border border-[#dadce0] rounded-xl shadow-lg z-[70] animate-fade-in';

export function CompactMenu({ trigger, children, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div onClick={() => setOpen(v => !v)}>{trigger(open)}</div>
      {open && (
        <div
          className={`${panelClass} ${align === 'right' ? 'right-0' : 'left-0'}`}
          role="menu"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

const itemClass = (active) =>
  `w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
    active ? 'bg-[#E8F0FE] text-[#1967D2]' : 'text-[#3c4043] hover:bg-[#f1f3f4]'
  }`;

export function MenuButton({ children, onClick, active }) {
  return (
    <button type="button" className={itemClass(active)} onClick={onClick} role="menuitem">
      {children}
    </button>
  );
}

export function MenuLink({ to, children, active }) {
  return (
    <Link to={to} className={itemClass(active)} role="menuitem">
      {children}
    </Link>
  );
}

/** Shared icon-only trigger button for compact mobile menus */
export function MenuTrigger({ icon: Icon, label, open, badge }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      title={label}
      className={`inline-flex items-center gap-1 h-9 rounded-full border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#5f6368] shadow-sm shrink-0 transition-all ${
        badge ? 'pl-2.5 pr-2' : 'w-9 justify-center'
      } ${open ? 'ring-2 ring-[#1a73e8]/25 border-[#1a73e8]/40' : ''}`}
    >
      <Icon size={16} className="shrink-0" />
      {badge && (
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#3c4043] pr-0.5">
          {badge}
        </span>
      )}
    </button>
  );
}
