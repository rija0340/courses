import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { emptyI18n } from '../../../data/coursePackMutations';
import { I18nLangField, LangTabs } from './adminShared';

function ensureI18n(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') return emptyI18n(value, value, value);
  return emptyI18n();
}

export default function SectionEditor({ section, onChange, editLang, onEditLangChange }) {
  const s = section || { type: 'tip' };
  const patch = (p) => onChange({ ...s, ...p });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-mono text-lh-faint">{s.type}</p>
        <LangTabs lang={editLang} onChange={onEditLangChange} />
      </div>

      {['core-concept', 'rules', 'image', 'gallery', 'dialogue', 'tip', 'example'].includes(s.type) && (
        <I18nLangField
          label="Titre"
          value={s.title}
          onChange={(title) => patch({ title })}
          lang={editLang}
        />
      )}

      {s.type === 'tip' && (
        <I18nLangField label="Texte" value={s.text} onChange={(text) => patch({ text })} lang={editLang} multiline />
      )}

      {s.type === 'example' && (
        <>
          <I18nLangField label="Exemple" value={s.text} onChange={(text) => patch({ text })} lang={editLang} multiline />
          <I18nLangField label="Traduction" value={s.translation} onChange={(translation) => patch({ translation })} lang={editLang} multiline rows={2} />
        </>
      )}

      {s.type === 'image' && (
        <>
          <label className="block text-[11px] font-semibold uppercase text-lh-faint mb-1.5">URL image
            <input
              value={s.src || ''}
              onChange={(e) => patch({ src: e.target.value })}
              className="mt-1 w-full h-10 rounded-xl border border-lh-border bg-lh-muted px-3 text-sm"
            />
          </label>
          <I18nLangField label="Légende" value={s.caption} onChange={(caption) => patch({ caption })} lang={editLang} />
        </>
      )}

      {s.type === 'gallery' && (
        <GalleryEditor images={s.images || []} onChange={(images) => patch({ images })} editLang={editLang} />
      )}

      {s.type === 'dialogue' && (
        <DialogueEditor lines={s.lines || []} onChange={(lines) => patch({ lines })} editLang={editLang} />
      )}

      {s.type === 'rules' && (
        <>
          <RulesSpansEditor content={s.content || []} onChange={(content) => patch({ content })} />
          <I18nLangField label="Note" value={s.notes} onChange={(notes) => patch({ notes })} lang={editLang} multiline rows={2} />
        </>
      )}

      {s.type === 'core-concept' && (
        <CoreConceptEditor content={s.content || []} onChange={(content) => patch({ content })} editLang={editLang} />
      )}

      {!['tip', 'example', 'image', 'gallery', 'dialogue', 'rules', 'core-concept'].includes(s.type) && (
        <RawJsonFallback value={s} onChange={onChange} />
      )}
    </div>
  );
}

function RulesSpansEditor({ content, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase text-lh-faint">Segments de texte</p>
      {content.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item.text || ''}
            onChange={(e) => {
              const next = content.map((c, j) => (j === i ? { ...c, text: e.target.value } : c));
              onChange(next);
            }}
            className="flex-1 h-9 rounded-lg border border-lh-border bg-lh-muted px-2 text-sm"
          />
          <select
            value={item.highlight || 'none'}
            onChange={(e) => {
              const next = content.map((c, j) => (j === i ? { ...c, highlight: e.target.value } : c));
              onChange(next);
            }}
            className="h-9 rounded-lg border border-lh-border bg-lh-muted px-2 text-xs"
          >
            {['none', 'key-term', 'emphasis'].map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <button type="button" onClick={() => onChange(content.filter((_, j) => j !== i))} className="text-lh-faint hover:text-red-500 px-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...content, { text: '', highlight: 'none' }])}
        className="text-xs font-semibold text-lh-accent inline-flex items-center gap-1"
      >
        <Plus size={12} /> Segment
      </button>
    </div>
  );
}

function CoreConceptEditor({ content, onChange, editLang }) {
  const update = (i, patch) => onChange(content.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  return (
    <div className="space-y-3">
      {content.map((block, i) => (
        <div key={i} className="rounded-xl border border-lh-border p-3 space-y-2 bg-lh-muted/40">
          <div className="flex justify-between">
            <span className="text-[11px] font-bold uppercase text-lh-faint">
              {block.type === 'definition' ? 'Définition' : 'Texte'}
            </span>
            <button type="button" onClick={() => onChange(content.filter((_, j) => j !== i))} className="text-lh-faint hover:text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
          {block.type === 'definition' ? (
            <>
              <I18nLangField
                label="Terme"
                value={ensureI18n(block.term)}
                onChange={(term) => update(i, { term })}
                lang={editLang}
              />
              <I18nLangField
                label="Définition"
                value={block.definitions}
                onChange={(definitions) => update(i, { definitions })}
                lang={editLang}
                multiline
                rows={2}
              />
            </>
          ) : (
            <I18nLangField
              label="Texte"
              value={block.text}
              onChange={(text) => update(i, { text })}
              lang={editLang}
              multiline
              rows={2}
            />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange([...content, { text: emptyI18n(), items: [] }])}
          className="h-9 px-3 rounded-lg bg-lh-muted text-xs font-semibold inline-flex items-center gap-1"
        >
          <Plus size={12} /> Texte
        </button>
        <button
          type="button"
          onClick={() => onChange([...content, { type: 'definition', term: emptyI18n(), definitions: emptyI18n(), highlight: 'emphasis' }])}
          className="h-9 px-3 rounded-lg bg-lh-muted text-xs font-semibold inline-flex items-center gap-1"
        >
          <Plus size={12} /> Définition
        </button>
      </div>
    </div>
  );
}

function GalleryEditor({ images, onChange, editLang }) {
  return (
    <div className="space-y-2">
      {images.map((img, i) => (
        <div key={i} className="rounded-xl border border-lh-border p-3 space-y-2">
          <input
            value={img.src || ''}
            onChange={(e) => {
              const next = images.map((im, j) => (j === i ? { ...im, src: e.target.value } : im));
              onChange(next);
            }}
            placeholder="URL"
            className="w-full h-9 rounded-lg border border-lh-border bg-lh-muted px-2 text-sm"
          />
          <I18nLangField
            label="Légende"
            value={img.caption}
            onChange={(caption) => {
              const next = images.map((im, j) => (j === i ? { ...im, caption } : im));
              onChange(next);
            }}
            lang={editLang}
          />
          <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="text-xs text-red-600">
            Supprimer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...images, { src: '', caption: emptyI18n() }])}
        className="text-xs font-semibold text-lh-accent"
      >
        + Image
      </button>
    </div>
  );
}

function DialogueEditor({ lines, onChange, editLang }) {
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2">
          <input
            value={line.speaker || ''}
            onChange={(e) => {
              const next = lines.map((l, j) => (j === i ? { ...l, speaker: e.target.value } : l));
              onChange(next);
            }}
            placeholder="Locuteur"
            className="w-full sm:w-24 h-9 rounded-lg border border-lh-border bg-lh-muted px-2 text-sm"
          />
          <div className="flex-1">
            <I18nLangField
              value={line.text}
              onChange={(text) => {
                const next = lines.map((l, j) => (j === i ? { ...l, text } : l));
                onChange(next);
              }}
              lang={editLang}
            />
          </div>
          <button type="button" onClick={() => onChange(lines.filter((_, j) => j !== i))} className="text-lh-faint hover:text-red-500 px-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...lines, { speaker: 'A', text: emptyI18n() }])}
        className="text-xs font-semibold text-lh-accent"
      >
        + Réplique
      </button>
    </div>
  );
}

function RawJsonFallback({ value, onChange }) {
  const [text, setText] = React.useState(() => JSON.stringify(value, null, 2));
  return (
    <textarea
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        try {
          onChange(JSON.parse(e.target.value));
        } catch {
          /* wait */
        }
      }}
      rows={8}
      className="w-full font-mono text-xs rounded-xl bg-[#202124] text-[#E8EAED] p-3"
    />
  );
}
