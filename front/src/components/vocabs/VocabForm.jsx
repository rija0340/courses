import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { flattenTree } from '../../utils/categoryTree';

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
    categoryId: defaultCategoryId || '', phonetic: ''
  });

  useEffect(() => {
    if (item) {
      setForm({
        id: item.id || '', en: item.en || '', fr: item.fr || '', mg: item.mg || '',
        category: item.category || 'Organe', tab: item.tab || defaultTab || 'vocab',
        categoryId: item.categoryId || defaultCategoryId || '', phonetic: item.phonetic || ''
      });
    } else {
      setForm({
        id: '', en: '', fr: '', mg: '',
        category: 'Organe', tab: defaultTab || 'vocab',
        categoryId: defaultCategoryId || '', phonetic: ''
      });
    }
  }, [item, defaultCategoryId, defaultTab]);

  const flatCategories = useMemo(() => flattenTree(categories, 'fr'), [categories]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.en.trim() || !form.fr.trim() || !form.mg.trim()) return;
    onSave({
      ...form,
      id: form.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      en: form.en.trim(), fr: form.fr.trim(), mg: form.mg.trim()
    });
  };

  const defaultTabs = [
    { id: 'vocab', label: { fr: 'Vocabulaire' } },
    { id: 'maladies', label: { fr: 'Maladies' } },
    { id: 'expressions', label: { fr: 'Expressions' } }
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
              {isEdit ? 'Modifier le mot' : 'Nouveau mot'}
            </h3>
            <p className="text-[12px] text-[#9aa0a6] mt-0.5">FR · EN · MG requis</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-[#f1f3f4] flex items-center justify-center hover:bg-[#e8eaed] transition-colors"
          >
            <X className="w-4 h-4 text-[#5f6368]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Français" value={form.fr} onChange={v => handleChange('fr', v)} placeholder="Œil" autoFocus />
            <FormField label="English" value={form.en} onChange={v => handleChange('en', v)} placeholder="Eye" />
            <FormField label="Malagasy" value={form.mg} onChange={v => handleChange('mg', v)} placeholder="Maso" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5">Type</label>
              <input
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                placeholder="ex: Organe, Maladie…"
                list="category-types-list"
                className="w-full h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all"
              />
              <datalist id="category-types-list">
                {['Organe', 'Maladie', 'Symptôme', 'Expression', 'Traitement', 'Diagnostic'].map(c => (
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
              Catégorie
            </label>
            <select
              value={form.categoryId}
              onChange={e => handleChange('categoryId', e.target.value)}
              disabled={lockCategory && !isEdit}
              className="w-full h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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

          <FormField label="Phonétique (optionnel)" value={form.phonetic} onChange={v => handleChange('phonetic', v)} placeholder="/aɪ/" />

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
        className="w-full h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all placeholder:text-[#9aa0a6]"
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
        className="w-full h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[14px] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {children}
      </select>
    </div>
  );
}
