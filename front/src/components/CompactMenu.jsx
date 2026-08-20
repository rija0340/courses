import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const panelClass =
  'absolute top-full mt-1.5 min-w-[160px] w-max max-w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden py-1 bg-lh-card border border-lh-border rounded-xl shadow-lh z-[100] animate-fade-in';

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
    <div className={`relative ${open ? 'z-[80]' : ''} ${className}`} ref={ref}>
      <div onClick={() => setOpen((v) => !v)} className="relative z-[1]">{trigger(open)}</div>
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
  `w-full min-w-0 flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
    active
      ? 'bg-lh-accent-soft text-lh-accent-text'
      : 'text-lh-text hover:bg-lh-muted'
  }`;

export function MenuButton({ children, onClick, active }) {
  return (
    <button type="button" className={itemClass(active)} onClick={onClick} role="menuitem">
      <span className="min-w-0 flex-1 truncate flex items-center gap-2.5">{children}</span>
    </button>
  );
}

export function MenuLink({ to, children, active }) {
  return (
    <Link to={to} className={itemClass(active)} role="menuitem">
      <span className="min-w-0 flex-1 truncate flex items-center gap-2.5">{children}</span>
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
      className={`inline-flex items-center gap-1 h-9 rounded-full border border-lh-border bg-lh-card hover:bg-lh-muted text-lh-secondary shadow-lh shrink-0 transition-all ${
        badge ? 'pl-2.5 pr-2' : 'w-9 justify-center'
      } ${open ? 'ring-2 ring-lh-accent/25 border-lh-accent/40' : ''}`}
    >
      <Icon size={16} className="shrink-0" />
      {badge && (
        <span className="text-[11px] font-bold uppercase tracking-wide text-lh-text pr-0.5">
          {badge}
        </span>
      )}
    </button>
  );
}
