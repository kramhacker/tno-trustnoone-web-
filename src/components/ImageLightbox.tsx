import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { LightboxImage } from '../utils/lightbox';

export type { LightboxImage };

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!image) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 p-4 tno-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged photo of ${image.title}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#100B0E] border border-[#D4AF37]/45 rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(239,68,68,0.4)] tno-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-black/70 text-[#F5EFE6] border border-white/15 hover:border-[#D4AF37]/70 hover:text-[#FCD34D] transition-colors cursor-pointer"
          aria-label="Close photo"
        >
          <X size={16} />
        </button>

        <div className="max-h-[75vh] w-full bg-[#070507] overflow-hidden flex items-center justify-center">
          <img
            src={image.src}
            alt={image.title}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[75vh] object-contain"
          />
        </div>

        <div className="px-4 py-3 border-t border-[#2A1C1E] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#F5EFE6] truncate">
              {image.title}
            </p>
            <p className="text-xs text-[#FCD34D] truncate">{image.subtitle}</p>
          </div>
          {image.meta && (
            <span className="text-[11px] text-[#B8A9A3] truncate">
              {image.meta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
