import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import {
  ACCEPTED_IMAGE_ACCEPT,
  MAX_IMAGE_BYTES,
  isAcceptedImageType,
} from '../../services/imageUpload';

function isAllowedFile(file) {
  if (isAcceptedImageType(file.type)) return true;
  // Some browsers leave SVG mime empty — allow by extension
  return /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name || '');
}

export default function ImageUploader({ currentImage, onSave, onDelete }) {
  const [preview, setPreview] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFile = (file) => {
    if (!file) return;
    setError(null);

    if (!isAllowedFile(file)) {
      setError('Format non supporté. JPG, PNG, WebP, GIF ou SVG uniquement.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Fichier trop volumineux (max 10 Mo).');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      let result = e.target.result;
      // Force SVG mime when the browser left it empty / generic
      if (
        /\.svg$/i.test(file.name || '') &&
        typeof result === 'string' &&
        result.startsWith('data:') &&
        !result.startsWith('data:image/svg+xml')
      ) {
        const comma = result.indexOf(',');
        const header = result.slice(0, comma);
        const payload = result.slice(comma + 1);
        const b64 = /;base64/i.test(header) ? ';base64' : '';
        result = `data:image/svg+xml${b64},${payload}`;
      }
      setPreview(result);
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Impossible de lire le fichier.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (preview && preview !== currentImage) {
      onSave(preview);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    setError(null);
    onDelete?.();
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden bg-[#f8f9fa] border border-[#dadce0]">
          <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="p-2 flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-1 h-9 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[12px] hover:bg-[#e8eaed] transition-all"
            >
              Changer
            </button>
            {preview !== currentImage && (
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 h-9 rounded-xl bg-[#1a73e8] text-white font-semibold text-[12px] hover:bg-[#1b66c9] transition-all"
              >
                Sauvegarder
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#dadce0] rounded-2xl h-32 flex flex-col items-center justify-center gap-2 bg-[#f8f9fa] cursor-pointer hover:border-[#1a73e8] hover:bg-[#f1f3f4] transition-all"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-[#9aa0a6]" />
              <span className="text-[13px] text-[#5f6368]">Cliquer ou glisser une image</span>
              <span className="text-[11px] text-[#9aa0a6]">JPG, PNG, WebP, GIF, SVG — max 10 Mo</span>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="mt-2 text-[12px] text-[#d93025]">{error}</p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        onChange={e => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
