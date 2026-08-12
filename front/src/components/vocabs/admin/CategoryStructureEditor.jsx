import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import {
  STRUCTURE_FIELD_CATALOG,
  STRUCTURE_FIELD_IDS,
  STRUCTURE_LANG_OPTIONS,
  normalizeItemStructure,
  emptyItemStructure,
  createFieldFromPreset,
  createCustomField,
  structureFieldLabel,
} from '../../../data/vocabs/vocabItemStructure';

/**
 * Edit itemStructure on a root category:
 * langs + fields (add preset/custom, rename, reorder, translate, delete).
 */
export default function CategoryStructureEditor({ value, onChange }) {
  const structure = useMemo(
    () => normalizeItemStructure(value) || emptyItemStructure(),
    [value]
  );

  const activeIds = new Set((structure.fields || []).map((f) => f.id));
  const availablePresets = STRUCTURE_FIELD_IDS.filter((id) => !activeIds.has(id));

  const [presetToAdd, setPresetToAdd] = useState('');
  const [customId, setCustomId] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [customType, setCustomType] = useState('text');
  const [customTranslate, setCustomTranslate] = useState(false);
  const [customError, setCustomError] = useState('');

  const emit = (next) => {
    onChange(normalizeItemStructure(next));
  };

  const toggleLang = (code) => {
    const langs = structure.langs.includes(code)
      ? structure.langs.filter((l) => l !== code)
      : [...structure.langs, code];
    emit({ ...structure, langs });
  };

  const addPreset = () => {
    const id = presetToAdd || availablePresets[0];
    if (!id || activeIds.has(id)) return;
    const field = createFieldFromPreset(id);
    if (!field) return;
    emit({ ...structure, fields: [...structure.fields, field] });
    setPresetToAdd('');
  };

  const addCustom = () => {
    setCustomError('');
    const field = createCustomField({
      id: customId,
      type: customType,
      translate: customTranslate,
      labelFr: customLabel,
    });
    if (!field) {
      setCustomError('Id invalide (a-z, 0-9, _) ou réservé / déjà pris');
      return;
    }
    if (activeIds.has(field.id)) {
      setCustomError('Cet id existe déjà dans la structure');
      return;
    }
    emit({ ...structure, fields: [...structure.fields, field] });
    setCustomId('');
    setCustomLabel('');
    setCustomType('text');
    setCustomTranslate(false);
  };

  const removeField = (id) => {
    emit({
      ...structure,
      fields: structure.fields.filter((f) => f.id !== id),
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

  const setLabelFr = (id, fr) => {
    emit({
      ...structure,
      fields: structure.fields.map((f) =>
        f.id === id
          ? { ...f, label: { ...(f.label || {}), fr, en: f.label?.en || fr } }
          : f
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

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
          Colonnes actives
        </p>
        {structure.fields.length === 0 && (
          <p className="text-[13px] text-[#9aa0a6]">Aucune colonne — ajoutez un modèle ou une colonne custom.</p>
        )}
        {structure.fields.map((f, index) => (
          <div
            key={f.id}
            className="rounded-lg bg-white border border-[#dadce0] px-2.5 py-2 space-y-2"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-col">
                <button type="button" onClick={() => moveField(index, -1)} disabled={index === 0} className="p-0.5 text-[#5f6368] disabled:opacity-30" aria-label="Monter">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => moveField(index, 1)} disabled={index === structure.fields.length - 1} className="p-0.5 text-[#5f6368] disabled:opacity-30" aria-label="Descendre">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold uppercase text-[#9aa0a6] mb-0.5">
                  Libellé · <span className="font-mono normal-case text-[#9aa0a6]">{f.id}</span>
                </label>
                <input
                  value={f.label?.fr || ''}
                  onChange={(e) => setLabelFr(f.id, e.target.value)}
                  className="w-full h-9 rounded-lg border border-[#dadce0] bg-[#f8f9fa] px-2.5 text-[13px] outline-none focus:border-[#1a73e8] focus:bg-white"
                  placeholder={structureFieldLabel(f, 'fr')}
                />
              </div>
              <span className="text-[10px] uppercase text-[#9aa0a6] px-1.5 py-0.5 rounded bg-[#f1f3f4]">
                {f.type}
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
              <button
                type="button"
                onClick={() => removeField(f.id)}
                className="w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center"
                aria-label="Supprimer la colonne"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-[#dadce0] bg-white p-3 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
          Ajouter depuis un modèle
        </p>
        <div className="flex flex-wrap gap-2">
          <select
            value={presetToAdd}
            onChange={(e) => setPresetToAdd(e.target.value)}
            disabled={availablePresets.length === 0}
            className="flex-1 min-w-[160px] h-10 rounded-xl border border-[#dadce0] px-3 text-[13px] bg-white disabled:opacity-50"
          >
            <option value="">
              {availablePresets.length ? 'Choisir…' : 'Tous les modèles sont déjà ajoutés'}
            </option>
            {availablePresets.map((id) => (
              <option key={id} value={id}>
                {STRUCTURE_FIELD_CATALOG[id].label.fr}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addPreset}
            disabled={availablePresets.length === 0}
            className="h-10 px-3 rounded-xl bg-[#E8F0FE] text-[#1967D2] text-[13px] font-semibold inline-flex items-center gap-1 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Modèle
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-[#dadce0] bg-white p-3 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
          Ajouter une colonne custom
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Libellé (ex. Nuance)"
            className="h-10 rounded-xl border border-[#dadce0] px-3 text-[13px] outline-none focus:border-[#1a73e8]"
          />
          <input
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            placeholder="id (ex. nuance)"
            className="h-10 rounded-xl border border-[#dadce0] px-3 text-[13px] font-mono outline-none focus:border-[#1a73e8]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="h-10 rounded-xl border border-[#dadce0] px-3 text-[13px]"
          >
            <option value="text">Texte</option>
            <option value="list">Liste</option>
          </select>
          <label className="inline-flex items-center gap-1.5 text-[12px] text-[#5f6368]">
            <input
              type="checkbox"
              checked={customTranslate}
              onChange={(e) => setCustomTranslate(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#dadce0] text-[#1a73e8]"
            />
            Traductions
          </label>
          <button
            type="button"
            onClick={addCustom}
            className="h-10 px-3 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Custom
          </button>
        </div>
        {customError && (
          <p className="text-[12px] text-red-600">{customError}</p>
        )}
      </div>
    </div>
  );
}
