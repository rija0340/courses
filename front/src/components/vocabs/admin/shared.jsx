import React from 'react';
import { X } from 'lucide-react';
import ImageUploader from '../ImageUploader';
import FullscreenLightbox from '../FullscreenLightbox';

export const TYPE_COLORS = {
  Organe: 'bg-[#E8F0FE] text-[#1967D2]',
  Maladie: 'bg-[#FCE8E6] text-[#C5221F]',
  Symptôme: 'bg-[#FEF7E0] text-[#E37400]',
  Expression: 'bg-[#E6F4EA] text-[#137333]',
  Traitement: 'bg-[#F3E8FD] text-[#7627BB]',
  Diagnostic: 'bg-[#E8F0FE] text-[#1967D2]',
};

export function Panel({ title, action, icon: Icon, children }) {
  return (
    <div className="bg-white border border-[#dadce0] rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#202124] flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#1a73e8]" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="bg-white border border-dashed border-[#dadce0] rounded-2xl px-6 py-14 text-center">
      <Icon className="w-10 h-10 text-[#dadce0] mx-auto mb-3" />
      <p className="text-[15px] font-medium text-[#3c4043]">{title}</p>
      {text && <p className="text-[13px] text-[#9aa0a6] mt-1 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function ConfirmModal({ title, text, onCancel, onConfirm, confirmText, danger }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5">
        <h3 className="font-semibold text-[16px] text-[#202124] mb-2">{title}</h3>
        <p className="text-[13px] text-[#5f6368] mb-5">{text}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px] hover:bg-[#e8eaed]">Annuler</button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-xl text-white font-semibold text-[13px] ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1a73e8] hover:bg-[#1b66c9]'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageModal({ title, currentImage, onSave, onDelete, onClose }) {
  const [previewFullscreen, setPreviewFullscreen] = React.useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px] text-[#202124] truncate pr-2">{title}</h3>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center hover:bg-[#e8eaed] shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          {currentImage && (
            <button
              type="button"
              onClick={() => setPreviewFullscreen(true)}
              className="w-full mb-3 rounded-xl overflow-hidden border border-[#dadce0] cursor-zoom-in hover:opacity-90 transition-opacity"
            >
              <img src={currentImage} alt="" className="w-full max-h-40 object-contain bg-[#f8f9fa]" />
              <p className="text-[11px] text-[#1a73e8] font-medium py-1.5 bg-[#f8f9fa]">Aperçu plein écran</p>
            </button>
          )}
          <ImageUploader
            currentImage={currentImage}
            onSave={onSave}
            onDelete={currentImage ? onDelete : null}
          />
        </div>
      </div>
      {previewFullscreen && currentImage && (
        <FullscreenLightbox
          src={currentImage}
          alt={title}
          onClose={() => setPreviewFullscreen(false)}
        />
      )}
    </>
  );
}
