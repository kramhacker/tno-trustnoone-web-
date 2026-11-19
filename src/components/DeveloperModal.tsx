import { useEffect } from 'react';
import { X, Code2, Layers, Sparkles, Cpu, ZoomIn } from 'lucide-react';
import { MemberAvatar } from './MemberAvatar';
import { LightboxImage } from './ImageLightbox';
import { TRANSLATIONS, Language } from '../data/translations';

interface DeveloperModalProps {
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  onEnlargePhoto: (image: LightboxImage) => void;
}

const DEVELOPER_THUMB_URL = '/assets/aistudio/thumbs/1791841136579_d6fc9626.webp';
const DEVELOPER_PHOTO_URL = '/assets/aistudio/1791841136579_d6fc9626.jpg';

const SKILL_ICONS = [Code2, Sparkles, Layers, Cpu];

export function DeveloperModal({
  isOpen,
  language = 'en',
  onClose,
  onEnlargePhoto,
}: DeveloperModalProps) {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/84 p-4 overflow-y-auto tno-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="developer-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg my-auto tno-modal-frame tno-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tno-owner-inner-bg relative z-10 rounded-[12px] overflow-hidden">
              <div
                aria-hidden="true"
                className="relative h-[2px] w-full bg-[#24181A] overflow-hidden"
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#FCD34D] to-[#EF4444] animate-shimmer-line" />
              </div>

              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#24181A]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FCD34D]">
                  <Code2 size={14} className="text-[#EF4444]" aria-hidden="true" />
                  <span>{t.modals.developerHeader}</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-[#B8A9A3] hover:text-[#F5EFE6] rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label={t.modals.close}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      onEnlargePhoto({
                        src: DEVELOPER_PHOTO_URL,
                        title: 'Zenji',
                        subtitle: t.modals.developerRoleTitle,
                      })
                    }
                    className="group relative shrink-0 rounded-xl cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                    aria-label="Zenji"
                    title={t.modals.clickToEnlarge}
                  >
                    <div className="p-[2px] rounded-xl tno-portrait-ring">
                      <div className="relative z-10 rounded-[10px] overflow-hidden bg-[#070507]">
                        <MemberAvatar
                          src={DEVELOPER_THUMB_URL}
                          name="Zenji"
                          eager
                          className="w-20 h-20 rounded-[10px] group-hover:scale-[1.06] transition-transform duration-200"
                        />
                        <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#FCD34D]">
                          <ZoomIn size={18} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#EF4444]">
                      {t.modals.developerCreator}
                    </p>
                    <h2
                      id="developer-modal-title"
                      className="text-xl sm:text-2xl font-bold tracking-tight truncate tno-gold-shimmer"
                    >
                      Zenji
                    </h2>
                    <p className="text-xs text-[#B8A9A3] truncate">
                      {t.modals.developerRoleTitle}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#24181A] pt-4 space-y-3">
                  <p className="text-xs sm:text-sm text-[#E5DBD2] leading-relaxed">
                    {t.modals.developerBio}
                  </p>

                  <div className="space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FCD34D]">
                      {t.modals.developerSkillsHeading}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {t.modals.developerSkills.map((skill, idx) => {
                        const Icon = SKILL_ICONS[idx] ?? Code2;
                        return (
                          <div
                            key={skill.title}
                            className="p-3 rounded-lg bg-[#090608] border border-[#24181A] space-y-1"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5EFE6]">
                              <Icon
                                size={13}
                                className="text-[#EF4444] shrink-0"
                                aria-hidden="true"
                              />
                              <span>{skill.title}</span>
                            </div>
                            <p className="text-[11px] text-[#B8A9A3] leading-snug">
                              {skill.detail}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-[#24181A] pt-3.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 text-xs font-semibold bg-[#DC2626] text-white rounded-lg hover:bg-[#EF4444] tno-cta cursor-pointer"
                  >
                    {t.modals.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
