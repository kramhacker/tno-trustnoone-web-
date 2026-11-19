import { useEffect, useState } from 'react';
import {
  X,
  Crown,
  ShieldCheck,
  Sparkles,
  Palette,
  ZoomIn,
  Copy,
  Check,
} from 'lucide-react';
import { FamilyMember } from '../types/family';
import { TRANSLATIONS, Language } from '../data/translations';
import { MemberAvatar } from './MemberAvatar';

interface MemberModalProps {
  member: FamilyMember | null;
  language?: Language;
  onClose: () => void;
  onEnlargePhoto: (member: FamilyMember) => void;
}

export function MemberModal({
  member,
  language = 'en',
  onClose,
  onEnlargePhoto,
}: MemberModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setCopiedId(false);
  }, [member?.id]);

  useEffect(() => {
    if (!member) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [member, onClose]);

  const handleCopyBigoId = (bigoId: string) => {
    navigator.clipboard?.writeText(bigoId).catch(() => {});
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  if (!member) return null;

  const localizedMember = t.memberText[member.id];
  const memberBio = localizedMember?.bio ?? member.bio;
  const memberSpecialty = localizedMember?.specialty ?? member.specialty;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/84 p-4 overflow-y-auto tno-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md my-auto tno-modal-frame tno-modal-enter"
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
                  {member.role === 'Owner' ? (
                    <Crown size={14} className="text-[#EF4444]" aria-hidden="true" />
                  ) : member.role === 'Editor' ? (
                    <Palette size={14} className="text-[#FCD34D]" aria-hidden="true" />
                  ) : member.role === 'Head Founder' ||
                    member.role === 'Founder' ||
                    member.role === 'Manager' ||
                    member.role === 'Head Admin' ||
                    member.role === 'Admin' ? (
                    <ShieldCheck size={14} className="text-[#EF4444]" aria-hidden="true" />
                  ) : (
                    <Sparkles size={14} aria-hidden="true" />
                  )}
                  <span>{t.roleLabels[member.role]}</span>
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
                    onClick={() => onEnlargePhoto(member)}
                    className="group relative shrink-0 rounded-xl cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                    aria-label={member.name}
                    title={t.modals.clickToEnlarge}
                  >
                    <div className="p-[2px] rounded-xl tno-portrait-ring">
                      <div className="relative z-10 rounded-[10px] overflow-hidden bg-[#070507]">
                        <MemberAvatar
                          src={member.avatarUrl}
                          name={member.name}
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
                    <p className="text-xs font-medium text-[#EF4444]">
                      {t.roleLabels[member.role]}
                    </p>
                    <h2
                      id="member-modal-title"
                      className="text-xl font-bold tracking-tight truncate tno-gold-shimmer"
                    >
                      {member.name}
                    </h2>
                    <p className="text-xs text-[#B8A9A3] truncate">{memberSpecialty}</p>
                  </div>
                </div>

                <div className="border-t border-[#24181A] pt-4 space-y-3.5">
                  <div>
                    <p className="text-[11px] font-medium text-[#8E7D78] mb-1">
                      {t.modals.roleOverview}
                    </p>
                    <p className="text-xs sm:text-sm text-[#E5DBD2] leading-relaxed">
                      {memberBio}
                    </p>
                  </div>

                  <div
                    className={`grid gap-3 ${
                      member.bigoId ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'
                    }`}
                  >
                    <div className="p-3 rounded-lg bg-[#090608]/90 border border-[#24181A]">
                      <p className="text-[11px] text-[#8E7D78] mb-0.5">
                        {t.modals.roleLabel}
                      </p>
                      <p className="text-xs font-medium text-[#F5EFE6]">
                        {t.roleLabels[member.role]}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#090608]/90 border border-[#24181A]">
                      <p className="text-[11px] text-[#8E7D78] mb-0.5">
                        {t.modals.specialtyLabel}
                      </p>
                      <p className="text-xs font-medium text-[#F5EFE6] truncate">
                        {memberSpecialty}
                      </p>
                    </div>
                    {member.bigoId && (
                      <button
                        type="button"
                        onClick={() => handleCopyBigoId(member.bigoId!)}
                        className="p-3 rounded-lg bg-[#090608]/90 border border-[#D4AF37]/35 hover:border-[#FCD34D]/75 text-left transition-colors cursor-pointer group/copy"
                        title={t.roster.copyTitle}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[11px] text-[#8E7D78]">
                            {t.modals.bigoIdLabel}
                          </span>
                          {copiedId ? (
                            <Check size={11} className="text-[#34D399]" aria-hidden="true" />
                          ) : (
                            <Copy
                              size={11}
                              className="text-[#8E7D78] group-hover/copy:text-[#FCD34D] transition-colors"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <p className="text-xs font-mono font-semibold text-[#FCD34D] truncate">
                          {copiedId ? t.modals.copied : member.bigoId}
                        </p>
                      </button>
                    )}
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
