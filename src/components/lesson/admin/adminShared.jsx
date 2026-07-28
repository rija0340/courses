import React, { useState } from 'react';
import { I18N_LANGS } from '../../../data/coursePackSchema';
import { emptyI18n } from '../../../data/coursePackMutations';

export function LangTabs({ lang, onChange }) {
  return (
    <div className="inline-flex p-0.5 rounded-lg bg-lh-muted border border-lh-border">
      {I18N_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`h-8 px-2.5 rounded-md text-[11px] font-bold uppercase ${
            lang === code ? 'bg-white dark:bg-[#303134] text-lh-accent shadow-sm' : 'text-lh-secondary'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/** Edit one language at a time for an i18n object. */
export function I18nLangField({
  label,
  value,
  onChange,
  lang,
  multiline = false,
  rows = 3,
  placeholder = '',
}) {
  const v = value && typeof value === 'object' ? value : emptyI18n(typeof value === 'string' ? value : '');
  const current = v[lang] || '';

  const setCurrent = (next) => onChange({ ...v, [lang]: next });

  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-lh-faint mb-1.5">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full rounded-xl border border-lh-border bg-lh-muted px-3 py-2 text-sm outline-none focus:border-lh-accent resize-y"
        />
      ) : (
        <input
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 rounded-xl border border-lh-border bg-lh-muted px-3 text-sm outline-none focus:border-lh-accent"
        />
      )}
    </div>
  );
}

export function useEditLang(defaultLang = 'fr') {
  const [editLang, setEditLang] = useState(defaultLang);
  return [editLang, setEditLang];
}
