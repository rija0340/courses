import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  SECTION_TYPES,
  SECTION_TYPE_LABELS,
  EXERCISE_TYPES,
  EXERCISE_TYPE_LABELS,
} from '../../../data/coursePackSchema';

export default function AddBlockPalette({ kind, onAdd, onClose }) {
  const types = kind === 'section' ? SECTION_TYPES : EXERCISE_TYPES;
  const labels = kind === 'section' ? SECTION_TYPE_LABELS : EXERCISE_TYPE_LABELS;
  const title = kind === 'section' ? 'Ajouter une section' : 'Ajouter un exercice';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-lh-card rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto border border-lh-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base text-lh-text">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm text-lh-secondary">
            Fermer
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onAdd(type)}
              className="text-left p-3 rounded-xl border border-lh-border hover:border-lh-accent hover:bg-lh-accent-soft/40 transition-colors"
            >
              <p className="text-sm font-medium text-lh-text">{labels[type] || type}</p>
              <p className="text-[11px] font-mono text-lh-faint mt-0.5">{type}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyBlocksHint({ kind, onAddClick }) {
  return (
    <div className="rounded-2xl border border-dashed border-lh-border bg-lh-muted/40 p-8 text-center">
      <p className="text-sm font-medium text-lh-text mb-1">
        {kind === 'section' ? 'Aucune section' : 'Aucun exercice'}
      </p>
      <p className="text-sm text-lh-secondary mb-4">
        Ajoutez du contenu avec des formulaires — pas besoin d’écrire du JSON.
      </p>
      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm font-medium"
      >
        <Plus size={16} /> Ajouter
      </button>
    </div>
  );
}

export function CardChrome({
  title,
  subtitle,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDuplicate,
  onDelete,
  editing,
  children,
}) {
  return (
    <div className={`rounded-2xl border bg-lh-card overflow-hidden ${editing ? 'border-lh-accent shadow-md' : 'border-lh-border'}`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-lh-border bg-lh-muted/50">
        <span className="text-[11px] font-bold text-lh-faint tabular-nums w-6">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-lh-text truncate">{title}</p>
          {subtitle && <p className="text-[11px] text-lh-faint truncate">{subtitle}</p>}
        </div>
        <button type="button" disabled={index === 0} onClick={onMoveUp} className="w-8 h-8 rounded-lg hover:bg-lh-muted disabled:opacity-30 text-lh-secondary">↑</button>
        <button type="button" disabled={index >= total - 1} onClick={onMoveDown} className="w-8 h-8 rounded-lg hover:bg-lh-muted disabled:opacity-30 text-lh-secondary">↓</button>
        <button type="button" onClick={onEdit} className="h-8 px-2.5 rounded-lg text-xs font-medium border border-lh-border hover:bg-lh-muted">
          {editing ? 'Aperçu' : 'Éditer'}
        </button>
        {onDuplicate && (
          <button type="button" onClick={onDuplicate} className="h-8 px-2.5 rounded-lg text-xs font-medium border border-lh-border hover:bg-lh-muted">
            Dupliquer
          </button>
        )}
        <button type="button" onClick={onDelete} className="w-8 h-8 rounded-lg hover:bg-red-50 text-lh-faint hover:text-red-500 inline-flex items-center justify-center">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
