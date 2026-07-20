import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { moveTab, countItemsForTab } from '../../../utils/tabOrder';

export default function TabEditor({
  tabs,
  onChange,
  items = [],
  showReorder = true,
  compact = false
}) {
  const handleTabChange = (index, field, value) => {
    const updated = [...tabs];
    if (!updated[index]) return;
    if (field === 'id') {
      updated[index] = { ...updated[index], id: value };
    } else {
      updated[index] = {
        ...updated[index],
        label: { ...updated[index].label, [field]: value }
      };
    }
    onChange(updated);
  };

  const addTab = () => {
    onChange([...(tabs || []), { id: `tab_${Date.now()}`, label: { fr: '', en: '', mg: '' } }]);
  };

  const removeTab = (index) => {
    onChange(tabs.filter((_, i) => i !== index));
  };

  const reorder = (index, direction) => {
    onChange(moveTab(tabs, index, direction));
  };

  return (
    <div className="space-y-2">
      {(tabs || []).map((tab, idx) => {
        const itemCount = countItemsForTab(items, tab.id);
        return (
          <div
            key={`${tab.id}-${idx}`}
            className={`flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#f8f9fa] rounded-xl ${compact ? 'p-1.5' : 'p-2'}`}
          >
            {showReorder && (
              <div className="flex flex-col shrink-0">
                <button
                  type="button"
                  onClick={() => reorder(idx, 'up')}
                  disabled={idx === 0}
                  className="w-7 h-5 rounded-md flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] disabled:opacity-30"
                  title="Monter"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => reorder(idx, 'down')}
                  disabled={idx === tabs.length - 1}
                  className="w-7 h-5 rounded-md flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] disabled:opacity-30"
                  title="Descendre"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <input
              value={tab.id}
              onChange={e => handleTabChange(idx, 'id', e.target.value)}
              placeholder="id"
              className="w-full sm:w-24 h-9 rounded-lg bg-white border border-[#dadce0] px-2.5 text-[12px] outline-none font-mono"
            />
            {['fr', 'en', 'mg'].map(code => (
              <input
                key={code}
                value={tab.label?.[code] || ''}
                onChange={e => handleTabChange(idx, code, e.target.value)}
                placeholder={code.toUpperCase()}
                className="flex-1 min-w-[70px] h-9 rounded-lg bg-white border border-[#dadce0] px-2.5 text-[12px] outline-none"
              />
            ))}
            {itemCount > 0 && (
              <span className="text-[10px] text-[#9aa0a6] tabular-nums shrink-0 px-1.5" title="Mots utilisant cet onglet">
                {itemCount} mot{itemCount !== 1 ? 's' : ''}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeTab(idx)}
              className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        );
      })}
      {(!tabs || tabs.length === 0) && (
        <p className="text-[13px] text-[#9aa0a6] text-center py-4">Aucun onglet</p>
      )}
      <button
        type="button"
        onClick={addTab}
        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed]"
      >
        <Plus className="w-3.5 h-3.5" /> Ajouter un onglet
      </button>
    </div>
  );
}
