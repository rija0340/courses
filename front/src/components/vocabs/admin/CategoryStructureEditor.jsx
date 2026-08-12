import React, { useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  STRUCTURE_FIELD_CATALOG,
  STRUCTURE_FIELD_IDS,
  STRUCTURE_LANG_OPTIONS,
  normalizeItemStructure,
  emptyItemStructure,
} from '../../../data/vocabs/vocabItemStructure';

/**
 * Edit itemStructure on a root category: langs + fields (enable/order/translate).
 */
export default function CategoryStructureEditor({ value, onChange }) {
  const structure = useMemo(
    () => normalizeItemStructure(value) || emptyItemStructure(),
    [value]
  );

  const activeIds = new Set((structure.fields || []).map((f) => f.id));

  const emit = (next) => {
    const normalized = normalizeItemStructure(next);
    onChange(normalized);
  };

  const toggleLang = (code) => {
    const langs = structure.langs.includes(code)
      ? structure.langs.filter((l) => l !== code)
      : [...structure.langs, code];
    emit({ ...structure, langs });
  };

  const toggleField = (id) => {
    if (activeIds.has(id)) {
      emit({
        ...structure,
        fields: structure.fields.filter((f) => f.id !== id),
      });
      return;
    }
    const meta = STRUCTURE_FIELD_CATALOG[id];
    emit({
      ...structure,
      fields: [
        ...structure.fields,
        { id, type: meta.type, translate: !!meta.defaultTranslate },
      ],
    });
  };

  const setTranslate = (id, translate) => {
    emit({
      ...structure,
      fields: structure.fields.map((f) =>
        f.id === id ? { ...f, translate } : f
      ),
    });
  };

  const moveField = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= structure.fields.length) return;
    const fields = [...structure.fields];
    const tmp = fields[index];
    fields[index] = fields[target];
    fields[target] = tmp;
    emit({ ...structure, fields });
  };

  return (
    <div className="rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-3 space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">
          Langues de traduction (en plus de EN)
        </p>
        <div className="flex flex-wrap gap-2">
          {STRUCTURE_LANG_OPTIONS.map((code) => {
            const on = structure.langs.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggleLang(code)}
                className={`h-9 px-3 rounded-lg text-[12px] font-semibold uppercase ${
                  on
                    ? 'bg-[#E8F0FE] text-[#1967D2] ring-1 ring-[#1a73e8]/30'
                    : 'bg-white border border-[#dadce0] text-[#5f6368]'
                }`}
              >
                {code}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-[#9aa0a6] mt-1.5">
          EN reste toujours requis pour le mot. FR/MG optionnels si activés.
        </p>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">
          Colonnes
        </p>
        <div className="space-y-1.5 mb-3">
          {STRUCTURE_FIELD_IDS.map((id) => {
            const meta = STRUCTURE_FIELD_CATALOG[id];
            const on = activeIds.has(id);
            return (
              <label
                key={id}
                className="flex items-center gap-2 rounded-lg bg-white border border-[#dadce0] px-3 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleField(id)}
                  className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8]"
                />
                <span className="text-[13px] font-medium text-[#202124] flex-1">
                  {meta.label.fr}
                </span>
                <span className="text-[10px] uppercase text-[#9aa0a6]">{meta.type}</span>
              </label>
            );
          })}
        </div>

        {structure.fields.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
              Ordre &amp; traductions
            </p>
            {structure.fields.map((f, index) => {
              const meta = STRUCTURE_FIELD_CATALOG[f.id];
              return (
                <div
                  key={f.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg bg-white border border-[#dadce0] px-2.5 py-2"
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => moveField(index, -1)}
                      disabled={index === 0}
                      className="p-0.5 text-[#5f6368] disabled:opacity-30"
                      aria-label="Monter"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveField(index, 1)}
                      disabled={index === structure.fields.length - 1}
                      className="p-0.5 text-[#5f6368] disabled:opacity-30"
                      aria-label="Descendre"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[13px] font-medium text-[#202124] flex-1 min-w-[100px]">
                    {meta.label.fr}
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-[12px] text-[#5f6368]">
                    <input
                      type="checkbox"
                      checked={!!f.translate}
                      onChange={(e) => setTranslate(f.id, e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#dadce0] text-[#1a73e8]"
                    />
                    Traductions
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
