import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CategoryTree({
  nodes,
  activeId,
  expandedIds,
  onToggle,
  onSelect,
  counts,
  getLabel,
  lang
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map(node => (
        <CategoryNode
          key={node.id}
          node={node}
          activeId={activeId}
          expandedIds={expandedIds}
          onToggle={onToggle}
          onSelect={onSelect}
          counts={counts}
          getLabel={getLabel}
          lang={lang}
          depth={0}
        />
      ))}
    </div>
  );
}

function CategoryNode({ node, activeId, expandedIds, onToggle, onSelect, counts, getLabel, lang, depth }) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isActive = activeId === node.id;
  const count = counts?.[node.id] ?? 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(node.id);
    }
    onSelect(node.id);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-2 pr-3 rounded-lg text-left transition-all ${
          depth === 0 ? 'py-2.5 text-[15px] font-medium' : 'py-2 text-[14px]'
        } ${
          isActive
            ? 'bg-[#1a73e8] text-white'
            : depth === 0
              ? 'hover:bg-[#f1f3f4] text-[#3c4043]'
              : 'hover:bg-[#f1f3f4] text-[#5f6368]'
        }`}
        style={{ paddingLeft: `${12 + depth * 18}px` }}
      >
        {hasChildren ? (
          <ChevronRight
            className={`w-4 h-4 shrink-0 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            } ${isActive ? 'text-white' : 'text-[#9aa0a6]'}`}
          />
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span className="flex-1 truncate">{getLabel(node.label)}</span>
        <span
          className={`text-[12px] px-2 py-0.5 rounded-full shrink-0 ${
            isActive
              ? 'bg-white/30 text-white font-bold'
              : count > 0
                ? 'bg-[#f1f3f4] text-[#5f6368]'
                : 'text-[#dadce0]'
          }`}
        >
          {count}
        </span>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map(child => (
            <CategoryNode
              key={child.id}
              node={child}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              counts={counts}
              getLabel={getLabel}
              lang={lang}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}