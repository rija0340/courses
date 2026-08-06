/**
 * Admin form for vocab items.
 * - symptoms / conditions → optional mini-example (patient + doctor)
 * - scenarios → multi-turn dialogue editor
 */
import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { flattenTree } from '../../utils/categoryTree';
import {
  emptyExample,
  emptyDialogueTurn,
  emptySpeakerLine,
} from '../../utils/vocabDialogue';

const EXAMPLE_TABS = new Set(['symptoms', 'conditions', 'maladies']);
const SCENARIO_TABS = new Set(['scenarios']);

function normalizeExample(raw) {
  const base = emptyExample();
  if (!raw || typeof raw !== 'object') return base;
  return {
    patient: { ...emptySpeakerLine(), ...(raw.patient || {}) },
    doctor: { ...emptySpeakerLine(), ...(raw.doctor || {}) },
  };
}

function normalizeDialogue(raw) {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [emptyDialogueTurn('patient'), emptyDialogueTurn('doctor')];
  }
  return raw.map((t) => ({
    role: t.role === 'doctor' ? 'doctor' : 'patient',
    en: t.en || '',
    fr: t.fr || '',
    mg: t.mg || '',
  }));
}

/** Strip empty example / dialogue before save so DB stays clean. */
function cleanExampleForSave(example) {
  if (!example) return null;
  const hasContent = ['patient', 'doctor'].some((side) => {
    const s = example[side];
    return s && (s.en?.trim() || s.fr?.trim() || s.mg?.trim());
  });
  if (!hasContent) return null;
  return {
    patient: {
      en: example.patient?.en?.trim() || '',
      fr: example.patient?.fr?.trim() || '',
      mg: example.patient?.mg?.trim() || '',
    },
    doctor: {
      en: example.doctor?.en?.trim() || '',
      fr: example.doctor?.fr?.trim() || '',
      mg: example.doctor?.mg?.trim() || '',
    },
  };
}

function cleanDialogueForSave(dialogue) {
  if (!Array.isArray(dialogue)) return null;
  const turns = dialogue
    .map((t) => ({
      role: t.role === 'doctor' ? 'doctor' : 'patient',
      en: t.en?.trim() || '',
      fr: t.fr?.trim() || '',
      mg: t.mg?.trim() || '',
    }))
    .filter((t) => t.en || t.fr || t.mg);
  return turns.length ? turns : null;
}

export default function VocabForm({
  item,
  onSave,
  onCancel,
  categories,
  tabs,
  defaultCategoryId = '',
  defaultTab = '',
  lockCategory = false,
  lockTab = false
}) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    id: '', en: '', fr: '', mg: '',
    category: 'Organe', tab: defaultTab || 'vocab',
    categoryId: defaultCategoryId || '', phonetic: '',
    example: emptyExample(),
    dialogue: [emptyDialogueTurn('patient'), emptyDialogueTurn('doctor')],
  });

  useEffect(() => {
    if (item) {
      setForm({
        id: item.id || '', en: item.en || '', fr: item.fr || '', mg: item.mg || '',
        category: item.category || 'Organe', tab: item.tab || defaultTab || 'vocab',
        categoryId: item.categoryId || defaultCategoryId || '', phonetic: item.phonetic || '',
        example: normalizeExample(item.example),
        dialogue: normalizeDialogue(item.dialogue),
      });
    } else {
      const tab = defaultTab || 'vocab';
      setForm({
        id: '', en: '', fr: '', mg: '',
        category: SCENARIO_TABS.has(tab) ? 'Scénario' : 'Organe',
        tab,
        categoryId: defaultCategoryId || '', phonetic: '',
        example: emptyExample(),
        dialogue: [emptyDialogueTurn('patient'), emptyDialogueTurn('doctor')],
      });
    }
  }, [item, defaultCategoryId, defaultTab]);

  const flatCategories = useMemo(() => flattenTree(categories, 'fr'), [categories]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const showExampleEditor = EXAMPLE_TABS.has(form.tab);
  const showDialogueEditor = SCENARIO_TABS.has(form.tab);

  const handleExampleLine = (speaker, lang, value) => {
    setForm((prev) => ({
      ...prev,
      example: {
        ...prev.example,
        [speaker]: { ...prev.example[speaker], [lang]: value },
      },
    }));
  };

  const handleDialogueTurn = (index, field, value) => {
    setForm((prev) => {
      const dialogue = prev.dialogue.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      );
      return { ...prev, dialogue };
    });
  };

  const addDialogueTurn = () => {
    setForm((prev) => {
      const lastRole = prev.dialogue[prev.dialogue.length - 1]?.role;
      const nextRole = lastRole === 'patient' ? 'doctor' : 'patient';
      return { ...prev, dialogue: [...prev.dialogue, emptyDialogueTurn(nextRole)] };
    });
  };

  const removeDialogueTurn = (index) => {
    setForm((prev) => ({
      ...prev,
      dialogue: prev.dialogue.length <= 1
        ? prev.dialogue
        : prev.dialogue.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.en.trim() || !form.fr.trim() || !form.mg.trim()) return;

    const payload = {
      ...form,
      id: form.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      en: form.en.trim(),
      fr: form.fr.trim(),
      mg: form.mg.trim(),
      example: showExampleEditor ? cleanExampleForSave(form.example) : null,
      dialogue: showDialogueEditor ? cleanDialogueForSave(form.dialogue) : null,
    };

    // Scenarios always carry dialogue; clear leftover example
    if (showDialogueEditor) payload.example = null;
    if (showExampleEditor) payload.dialogue = null;

    onSave(payload);
  };

  const defaultTabs = [
    { id: 'vocab', label: { fr: 'Vocabulaire' } },
    { id: 'symptoms', label: { fr: 'Symptômes' } },
    { id: 'conditions', label: { fr: 'Maladies' } },
    { id: 'scenarios', label: { fr: 'Scénarios' } },
  ];
  const activeTabs = tabs?.length ? tabs : defaultTabs;
  const canSubmit = form.en.trim() && form.fr.trim() && form.mg.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-[17px] text-[#202124]">
              {isEdit
                ? (showDialogueEditor ? 'Modifier le scénario' : 'Modifier le mot')
                : (showDialogueEditor ? 'Nouveau scénario' : 'Nouveau mot')}
            </h3>
            <p className="text-[12px] text-[#9aa0a6] mt-0.5">FR · EN · MG requis (titre)</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-11 h-11 rounded-full bg-[#f1f3f4] flex items-center justify-center hover:bg-[#e8eaed] transition-colors"
          >
            <X className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Français" value={form.fr} onChange={v => handleChange('fr', v)} placeholder={showDialogueEditor ? 'Consultation…' : 'Œil'} autoFocus />
            <FormField label="English" value={form.en} onChange={v => handleChange('en', v)} placeholder={showDialogueEditor ? 'Checkup…' : 'Eye'} />
            <FormField label="Malagasy" value={form.mg} onChange={v => handleChange('mg', v)} placeholder="Maso" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">Type</label>
              <input
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                placeholder="ex: Organe, Symptôme…"
                list="category-types-list"
                className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all"
              />
              <datalist id="category-types-list">
                {['Organe', 'Maladie', 'Symptôme', 'Scénario', 'Traitement', 'Diagnostic'].map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <SelectField label="Onglet" value={form.tab} onChange={v => handleChange('tab', v)} disabled={lockTab && !isEdit}>
              {activeTabs.map(t => (
                <option key={t.id} value={t.id}>{t.label?.fr || t.id}</option>
              ))}
            </SelectField>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">
              Catégorie {showDialogueEditor ? '(thème du scénario)' : ''}
            </label>
            <select
              value={form.categoryId}
              onChange={e => handleChange('categoryId', e.target.value)}
              disabled={lockCategory && !isEdit}
              className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">— Aucune —</option>
              {flatCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {'\u00A0\u00A0'.repeat(c.depth)}{c.depth > 0 ? '└ ' : ''}{c.label}
                </option>
              ))}
            </select>
            {form.categoryId && (
              <p className="text-[11px] text-[#9aa0a6] mt-1.5">
                {flatCategories.find(c => c.id === form.categoryId)?.path}
              </p>
            )}
          </div>

          {!showDialogueEditor && (
            <FormField label="Phonétique (optionnel)" value={form.phonetic} onChange={v => handleChange('phonetic', v)} placeholder="/aɪ/" />
          )}

          {/* --- Mini-example editor (symptoms / conditions) --- */}
          {showExampleEditor && (
            <section className="rounded-xl border border-[#dadce0] p-3.5 space-y-3">
              <div>
                <h4 className="text-[13px] font-semibold text-[#202124]">Exemple patient / docteur</h4>
                <p className="text-[11px] text-[#9aa0a6] mt-0.5">Court (2 répliques). MG optionnel — laisser vide pour masquer.</p>
              </div>
              {['patient', 'doctor'].map((speaker) => (
                <div key={speaker} className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">
                    {speaker === 'patient' ? 'Patient' : 'Doctor'}
                  </p>
                  <FormField
                    label="EN"
                    value={form.example[speaker].en}
                    onChange={(v) => handleExampleLine(speaker, 'en', v)}
                    placeholder={speaker === 'patient' ? 'I have blurry vision.' : 'How long have you had it?'}
                  />
                  <FormField
                    label="FR"
                    value={form.example[speaker].fr}
                    onChange={(v) => handleExampleLine(speaker, 'fr', v)}
                    placeholder={speaker === 'patient' ? "J'ai une vision floue." : 'Depuis combien de temps ?'}
                  />
                  <FormField
                    label="MG (optionnel)"
                    value={form.example[speaker].mg}
                    onChange={(v) => handleExampleLine(speaker, 'mg', v)}
                    placeholder=""
                  />
                </div>
              ))}
            </section>
          )}

          {/* --- Dialogue editor (scenarios) --- */}
          {showDialogueEditor && (
            <section className="rounded-xl border border-[#dadce0] p-3.5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-[13px] font-semibold text-[#202124]">Conversation</h4>
                  <p className="text-[11px] text-[#9aa0a6] mt-0.5">Tours patient ↔ docteur. MG optionnel par réplique.</p>
                </div>
                <button
                  type="button"
                  onClick={addDialogueTurn}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-xl bg-[#f1f3f4] text-[12px] font-semibold text-[#3c4043] hover:bg-[#e8eaed]"
                >
                  <Plus className="w-3.5 h-3.5" /> Tour
                </button>
              </div>

              {form.dialogue.map((turn, index) => (
                <div key={`turn-${index}`} className="rounded-xl bg-[#f8f9fa] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={turn.role}
                      onChange={(e) => handleDialogueTurn(index, 'role', e.target.value)}
                      className="h-10 rounded-lg bg-white border border-[#dadce0] px-2 text-[13px] font-semibold"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeDialogueTurn(index)}
                      disabled={form.dialogue.length <= 1}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-[#C5221F] hover:bg-red-50 disabled:opacity-30"
                      aria-label="Supprimer le tour"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <FormField label="EN" value={turn.en} onChange={(v) => handleDialogueTurn(index, 'en', v)} placeholder="English line…" />
                  <FormField label="FR" value={turn.fr} onChange={(v) => handleDialogueTurn(index, 'fr', v)} placeholder="Ligne française…" />
                  <FormField label="MG (optionnel)" value={turn.mg} onChange={(v) => handleDialogueTurn(index, 'mg', v)} placeholder="" />
                </div>
              ))}
            </section>
          )}

          <div className="flex gap-2 pt-2 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[14px] hover:bg-[#e8eaed] transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 h-11 rounded-xl bg-[#1a73e8] text-white font-semibold text-[14px] hover:bg-[#1b66c9] transition-all shadow-sm disabled:opacity-40"
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, autoFocus }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all placeholder:text-[#9aa0a6]"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, children, disabled }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {children}
      </select>
    </div>
  );
}
