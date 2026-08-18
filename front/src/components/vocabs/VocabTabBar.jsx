import React from 'react';
import { countItemsForTab } from '../../utils/tabOrder';

export default function VocabTabBar({
  tabs,
  activeTab,
  onTabChange,
  getLabel,
  sectionLabel,
  items = []
}) {
  if (!tabs?.length) return null;

  return (
    <div className="vocab-tabs w-full mb-5">
      {sectionLabel && (
        <div className="mb-2 px-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
            {sectionLabel}
          </p>
        </div>
      )}
      <div className="vocab-tabs-list flex flex-wrap gap-2 w-full">
        {tabs.map(tab => {
          const itemCount = countItemsForTab(items, tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`vocab-tab flex-1 min-w-[100px] sm:min-w-[120px] h-10 px-3 rounded-lg text-[13px] font-semibold transition-all truncate ${
                activeTab === tab.id
                  ? 'bg-white text-[#202124] shadow-sm ring-1 ring-[#dadce0]'
                  : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed] hover:text-[#202124]'
              }`}
            >
              <span className="truncate">{getLabel(tab.label)}</span>
              {itemCount > 0 && (
                <span className="ml-1 text-[10px] font-medium text-[#9aa0a6] tabular-nums">
                  ({itemCount})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
