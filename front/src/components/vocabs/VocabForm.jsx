/**
 * Admin form for vocab items.
 * - With itemStructure: EN required; langs + structured fields from root config
 * - Without (MediVocabs): classic FR/EN/MG + example/dialogue by tab
 */
import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { flattenTree } from '../../utils/categoryTree';
import {
  emptyExample,
  emptyDialogueTurn,
  emptySpeakerLine,
} from '../../utils/vocabDialogue';
import {
  emptyI18nEntry,
  normalizeI18nValue,
  normalizeListField,
  structureFieldLabel,
  structureHeadLangs,
} from '../../data/vocabs/vocabItemStructure';

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

function listToForm(value, translate) {
  const list = normalizeListField(value, translate);
  if (!translate) return list.join('; ');
  return list.map((e) => ({ ...emptyI18nEntry(), ...e }));
}

function i18nToForm(value) {
  return { ...emptyI18nEntry(), ...(normalizeI18nValue(value) || {}) };
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
  lockTab = false,
  itemStructure = null,
}) {
  const isEdit = !!item;
  const structured = Boolean(itemStructure);
  const headLangs = structureHeadLangs(itemStructure);
  const structureFields = itemStructure?.fields || [];

  const buildEmpty = () => {
    const base = {
      id: '',
      en: '',
      fr: '',
      mg: '',
      category: 'Organe',
      tab: defaultTab || 'vocab',
      categoryId: defaultCategoryId || '',
      phonetic: '',
      example: emptyExample(),
      dialogue: [emptyDialogueTurn('patient'), emptyDialogueTurn('doctor')],
      _listForms: {},
      _i18nForms: {},
    };
    structureFields.forEach((f) => {
      if (f.type === 'list') {
        base._listForms[f.id] = f.translate ? [] : '';
      } else if (f.translate) {
        base._i18nForms[f.id] = emptyI18nEntry();
      } else {
        base[f.id] = '';
      }
    });
    return base;
  };

  const [form, setForm] = useState(buildEmpty);

  useEffect(() => {
    if (item) {
      const next = {
        id: item.id || '',
        en: item.en || '',
        fr: item.fr || '',
        mg: item.mg || '',
        category: item.category || 'Organe',
        tab: item.tab || defaultTab || 'vocab',
        categoryId: item.categoryId || defaultCategoryId || '',
        phonetic: item.phonetic || '',
        example: normalizeExample(item.example),
        dialogue: normalizeDialogue(item.dialogue),
        _listForms: {},
        _i18nForms: {},
      };
      structureFields.forEach((f) => {
        if (f.type === 'list') {
          next._listForms[f.id] = listToForm(item[f.id], f.translate);
        } else if (f.translate) {
          next._i18nForms[f.id] = i18nToForm(item[f.id]);
        } else {
          next[f.id] = item[f.id] || '';
        }
      });
      setForm(next);
    } else {
      const tab = defaultTab || 'vocab';
      const next = buildEmpty();
      next.tab = tab;
      next.category = SCENARIO_TABS.has(tab) ? 'Scénario' : 'Organe';
      setForm(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, defaultCategoryId, defaultTab, itemStructure]);

  const flatCategories = useMemo(() => flattenTree(categories, 'fr'), [categories]);
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const showExampleEditor = !structured && EXAMPLE_TABS.has(form.tab);
  const showDialogueEditor = !structured && SCENARIO_TABS.has(form.tab);

  const canSubmit = structured
    ? Boolean(form.en?.trim())
    : Boolean(form.en?.trim() && form.fr?.trim() && form.mg?.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      id: form.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      en: form.en.trim(),
      fr: form.fr.trim(),
      mg: form.mg.trim(),
      category: form.category,
      tab: form.tab,
      categoryId: form.categoryId || null,
      phonetic: form.phonetic?.trim() || '',
      example: showExampleEditor ? cleanExampleForSave(form.example) : null,
      dialogue: showDialogueEditor ? cleanDialogueForSave(form.dialogue) : null,
    };

    if (showDialogueEditor) payload.example = null;
    if (showExampleEditor) payload.dialogue = null;

    structureFields.forEach((f) => {
      if (f.type === 'list') {
        const raw = form._listForms[f.id];
        payload[f.id] = f.translate
          ? normalizeListField(raw, true)
          : normalizeListField(typeof raw === 'string' ? raw : [], false);
      } else if (f.translate) {
        payload[f.id] = normalizeI18nValue(form._i18nForms[f.id]);
      } else {
        payload[f.id] = String(form[f.id] || '').trim();
      }
    });

    onSave(payload);
  };

  const defaultTabs = [
    { id: 'vocab', label: { fr: 'Vocabulaire' } },
    { id: 'symptoms', label: { fr: 'Symptômes' } },
    { id: 'conditions', label: { fr: 'Maladies' } },
    { id: 'scenarios', label: { fr: 'Scénarios' } },
  ];
  const activeTabs = tabs?.length ? tabs : defaultTabs;

  const addListEntry = (fieldId) => {
    setForm((prev) => ({
      ...prev,
      _listForms: {
        ...prev._listForms,
        [fieldId]: [...(prev._listForms[fieldId] || []), emptyI18nEntry()],
      },
    }));
  };

  const updateListEntry = (fieldId, index, lang, value) => {
    setForm((prev) => {
      const list = [...(prev._listForms[fieldId] || [])];
      list[index] = { ...list[index], [lang]: value };
      return { ...prev, _listForms: { ...prev._listForms, [fieldId]: list } };
    });
  };

  const removeListEntry = (fieldId, index) => {
    setForm((prev) => ({
      ...prev,
      _listForms: {
        ...prev._listForms,
        [fieldId]: (prev._listForms[fieldId] || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-[17px] text-[#202124]">
              {isEdit ? 'Modifier le mot' : 'Nouveau mot'}
            </h3>
            <p className="text-[12px] text-[#9aa0a6] mt-0.5">
              {structured
                ? 'EN requis — traductions et colonnes selon la structure de la racine'
                : 'FR · EN · MG requis (titre)'}
            </p>
          </div>
          <button type="button" onClick={onCancel} className="w-11 h-11 rounded-full bg-[#f1f3f4] flex items-center justify-center hover:bg-[#e8eaed]">
            <X className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="English *" value={form.en} onChange={(v) => handleChange('en', v)} placeholder="happy" autoFocus />

          {structured ? (
            headLangs.map((code) => (
              <FormField
                key={code}
                label={`${code.toUpperCase()} (opt.)`}
                value={form[code] || ''}
                onChange={(v) => handleChange(code, v)}
                placeholder={code}
              />
            ))
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Français" value={form.fr} onChange={(v) => handleChange('fr', v)} placeholder="heureux" />
              <FormField label="Malagasy" value={form.mg} onChange={(v) => handleChange('mg', v)} placeholder="faly" />
            </div>
          )}

          {!structured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">Type</label>
                <input
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none"
                />
              </div>
              <SelectField label="Onglet" value={form.tab} onChange={(v) => handleChange('tab', v)} disabled={lockTab && !isEdit}>
                {activeTabs.map((t) => (
                  <option key={t.id} value={t.id}>{t.label?.fr || t.id}</option>
                ))}
              </SelectField>
            </div>
          )}

          {structured && activeTabs.length > 1 && (
            <SelectField label="Onglet" value={form.tab} onChange={(v) => handleChange('tab', v)} disabled={lockTab && !isEdit}>
              {activeTabs.map((t) => (
                <option key={t.id} value={t.id}>{t.label?.fr || t.id}</option>
              ))}
            </SelectField>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">Catégorie</label>
            <select
              value={form.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              disabled={lockCategory && !isEdit}
              className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none disabled:opacity-60"
            >
              <option value="">— Aucune —</option>
              {flatCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {'\u00A0\u00A0'.repeat(c.depth)}{c.depth > 0 ? '└ ' : ''}{c.label}
                </option>
              ))}
            </select>
          </div>

          {structureFields.map((f) => {
            const label = structureFieldLabel(f.id, 'fr');
            if (f.type === 'list' && f.translate) {
              const entries = form._listForms[f.id] || [];
              return (
                <section key={f.id} className="rounded-xl border border-[#dadce0] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-[#202124]">{label}</p>
                    <button type="button" onClick={() => addListEntry(f.id)} className="h-9 px-2.5 rounded-lg bg-[#f1f3f4] text-[12px] font-semibold inline-flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Ajouter
                    </button>
                  </div>
                  {entries.map((entry, index) => (
                    <div key={`${f.id}-${index}`} className="rounded-lg bg-[#f8f9fa] p-2.5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#9aa0a6]">#{index + 1}</span>
                        <button type="button" onClick={() => removeListEntry(f.id, index)} className="text-red-600 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <FormField label="EN" value={entry.en || ''} onChange={(v) => updateListEntry(f.id, index, 'en', v)} />
                      {headLangs.map((code) => (
                        <FormField
                          key={code}
                          label={`${code.toUpperCase()} (opt.)`}
                          value={entry[code] || ''}
                          onChange={(v) => updateListEntry(f.id, index, code, v)}
                        />
                      ))}
                    </div>
                  ))}
                </section>
              );
            }
            if (f.type === 'list') {
              return (
                <FormField
                  key={f.id}
                  label={`${label} (séparés par ;)`}
                  value={form._listForms[f.id] || ''}
                  onChange={(v) => setForm((prev) => ({
                    ...prev,
                    _listForms: { ...prev._listForms, [f.id]: v },
                  }))}
                  placeholder="joyful; cheerful"
                />
              );
            }
            if (f.translate) {
              const val = form._i18nForms[f.id] || emptyI18nEntry();
              return (
                <section key={f.id} className="rounded-xl border border-[#dadce0] p-3 space-y-2">
                  <p className="text-[13px] font-semibold text-[#202124]">{label}</p>
                  <FormField
                    label="EN"
                    value={val.en}
                    onChange={(v) => setForm((prev) => ({
                      ...prev,
                      _i18nForms: { ...prev._i18nForms, [f.id]: { ...val, en: v } },
                    }))}
                  />
                  {headLangs.map((code) => (
                    <FormField
                      key={code}
                      label={`${code.toUpperCase()} (opt.)`}
                      value={val[code] || ''}
                      onChange={(v) => setForm((prev) => ({
                        ...prev,
                        _i18nForms: { ...prev._i18nForms, [f.id]: { ...val, [code]: v } },
                      }))}
                    />
                  ))}
                </section>
              );
            }
            return (
              <FormField
                key={f.id}
                label={label}
                value={form[f.id] || ''}
                onChange={(v) => handleChange(f.id, v)}
              />
            );
          })}

          {!structured && !showDialogueEditor && (
            <FormField label="Phonétique (optionnel)" value={form.phonetic} onChange={(v) => handleChange('phonetic', v)} placeholder="/aɪ/" />
          )}

          {showExampleEditor && (
            <section className="rounded-xl border border-[#dadce0] p-3.5 space-y-3">
              <h4 className="text-[13px] font-semibold">Exemple patient / docteur</h4>
              {['patient', 'doctor'].map((speaker) => (
                <div key={speaker} className="space-y-2">
                  <p className="text-[11px] font-bold uppercase text-[#9aa0a6]">{speaker}</p>
                  {['en', 'fr', 'mg'].map((lang) => (
                    <FormField
                      key={lang}
                      label={lang.toUpperCase()}
                      value={form.example[speaker][lang]}
                      onChange={(v) => setForm((prev) => ({
                        ...prev,
                        example: {
                          ...prev.example,
                          [speaker]: { ...prev.example[speaker], [lang]: v },
                        },
                      }))}
                    />
                  ))}
                </div>
              ))}
            </section>
          )}

          {showDialogueEditor && (
            <section className="rounded-xl border border-[#dadce0] p-3.5 space-y-3">
              <div className="flex justify-between">
                <h4 className="text-[13px] font-semibold">Conversation</h4>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({
                    ...prev,
                    dialogue: [...prev.dialogue, emptyDialogueTurn(prev.dialogue.at(-1)?.role === 'patient' ? 'doctor' : 'patient')],
                  }))}
                  className="h-9 px-2 rounded-lg bg-[#f1f3f4] text-[12px] font-semibold"
                >
                  + Tour
                </button>
              </div>
              {form.dialogue.map((turn, index) => (
                <div key={`turn-${index}`} className="rounded-xl bg-[#f8f9fa] p-3 space-y-2">
                  <select
                    value={turn.role}
                    onChange={(e) => setForm((prev) => ({
                      ...prev,
                      dialogue: prev.dialogue.map((t, i) => (i === index ? { ...t, role: e.target.value } : t)),
                    }))}
                    className="h-10 rounded-lg bg-white border border-[#dadce0] px-2 text-[13px]"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                  {['en', 'fr', 'mg'].map((lang) => (
                    <FormField
                      key={lang}
                      label={lang.toUpperCase()}
                      value={turn[lang]}
                      onChange={(v) => setForm((prev) => ({
                        ...prev,
                        dialogue: prev.dialogue.map((t, i) => (i === index ? { ...t, [lang]: v } : t)),
                      }))}
                    />
                  ))}
                </div>
              ))}
            </section>
          )}

          <div className="flex gap-2 pt-2 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[14px]">
              Annuler
            </button>
            <button type="submit" disabled={!canSubmit} className="flex-1 h-11 rounded-xl bg-[#1a73e8] text-white font-semibold text-[14px] disabled:opacity-40">
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none placeholder:text-[#9aa0a6]"
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
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-11 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none disabled:opacity-60"
      >
        {children}
      </select>
    </div>
  );
}
