import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function FullscreenLightbox({ src, alt = '', onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src}
        alt={alt}
        className="relative z-[1] max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
