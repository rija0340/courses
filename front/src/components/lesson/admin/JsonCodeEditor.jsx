import React, { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import {
  Maximize2, Minimize2, Check, AlertCircle, Copy, Download, Upload, ClipboardPaste
} from 'lucide-react';

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Sublime-like JSON editor: syntax highlight, fold, search (Ctrl/Cmd+F), fullscreen.
 */
export default function JsonCodeEditor({
  title = 'JSON',
  value,
  onChange,
  validate,
  onApply,
  onLoadCurrent,
  onLoadFullDump,
  dumpLabel = 'Dump complet',
  filename = 'data.json',
  applyLabel = 'Appliquer',
  saving = false,
  height = '420px',
  footerExtra = null,
}) {
  const [text, setText] = useState(value || '');
  const [fullscreen, setFullscreen] = useState(false);
  const [status, setStatus] = useState({ ok: true, errors: [], warnings: [] });

  useEffect(() => {
    setText(value || '');
  }, [value]);

  useEffect(() => {
    if (!text?.trim()) {
      setStatus({ ok: false, errors: ['JSON vide'], warnings: [] });
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof validate === 'function') {
        const result = validate(parsed);
        setStatus({
          ok: !!result?.ok,
          errors: result?.errors || [],
          warnings: result?.warnings || [],
          data: result?.data ?? parsed,
        });
      } else {
        setStatus({ ok: true, errors: [], warnings: [], data: parsed });
      }
    } catch (err) {
      setStatus({ ok: false, errors: [`JSON invalide : ${err.message}`], warnings: [] });
    }
  }, [text, validate]);

  const extensions = useMemo(
    () => [
      json(),
      EditorView.theme({
        '&': { fontSize: '13px' },
        '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
        '.cm-gutters': { backgroundColor: '#1e1f20', color: '#9aa0a6', border: 'none' },
      }),
    ],
    []
  );

  const editor = (
    <CodeMirror
      value={text}
      height={fullscreen ? 'calc(100vh - 180px)' : height}
      theme="dark"
      extensions={extensions}
      onChange={(val) => {
        setText(val);
        onChange?.(val);
      }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        searchKeymap: true,
        history: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
      }}
    />
  );

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      {onLoadCurrent && (
        <button type="button" onClick={onLoadCurrent} className="h-9 px-3 rounded-lg border border-lh-border text-xs font-medium">
          Contenu actuel
        </button>
      )}
      {onLoadFullDump && (
        <button type="button" onClick={onLoadFullDump} className="h-9 px-3 rounded-lg border border-lh-border text-xs font-medium inline-flex items-center gap-1">
          <Copy size={13} /> {dumpLabel}
        </button>
      )}
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
        }}
        className="h-9 px-3 rounded-lg border border-lh-border text-xs font-medium inline-flex items-center gap-1"
      >
        <Copy size={13} /> Copier
      </button>
      <button
        type="button"
        onClick={() => downloadText(text, filename)}
        className="h-9 px-3 rounded-lg border border-lh-border text-xs font-medium inline-flex items-center gap-1"
      >
        <Download size={13} /> Télécharger
      </button>
      <label className="h-9 px-3 rounded-lg bg-[#1a73e8] text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer">
        <Upload size={13} /> Fichier
        <input
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              const next = String(ev.target.result || '');
              setText(next);
              onChange?.(next);
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
      </label>
      <button
        type="button"
        onClick={() => setFullscreen((v) => !v)}
        className="h-9 px-3 rounded-lg border border-lh-border text-xs font-medium inline-flex items-center gap-1 ml-auto"
        title="Plein écran"
      >
        {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        {fullscreen ? 'Quitter' : 'Plein écran'}
      </button>
    </div>
  );

  const statusBar = (
    <div
      className={`rounded-xl px-3 py-2.5 text-sm border flex items-start gap-2 ${
        status.ok
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 text-green-800 dark:text-green-300'
          : 'bg-red-50 dark:bg-red-950/30 border-red-200 text-red-700 dark:text-red-300'
      }`}
    >
      {status.ok ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
      <div className="min-w-0">
        {status.ok ? (
          <p className="font-medium">JSON valide</p>
        ) : (
          <ul className="list-disc pl-4 space-y-0.5">
            {(status.errors || []).slice(0, 8).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {(status.warnings || []).length > 0 && (
          <ul className="mt-1 text-amber-700 dark:text-amber-300 list-disc pl-4">
            {status.warnings.slice(0, 4).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const body = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium text-base text-lh-text">{title}</h3>
        <p className="text-[11px] text-lh-faint hidden sm:block">Ctrl/Cmd+F pour rechercher</p>
      </div>
      {toolbar}
      <div className="rounded-xl overflow-hidden border border-[#3c4043] shadow-sm">{editor}</div>
      {statusBar}
      {footerExtra}
      {onApply && (
        <button
          type="button"
          disabled={saving || !status.ok}
          onClick={() => onApply(status.data, text)}
          className="h-11 px-4 rounded-xl bg-[#1a73e8] text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-2"
        >
          <ClipboardPaste size={15} /> {applyLabel}
        </button>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[80] bg-[#121314] p-4 sm:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">{body}</div>
      </div>
    );
  }

  return <div className="border border-lh-border rounded-2xl p-4 sm:p-5 bg-lh-card space-y-3">{body}</div>;
}
