import { FamilyMember } from '../types/family';
import { TRANSLATIONS, Language } from '../data/translations';

export interface LightboxImage {
  src: string;
  title: string;
  subtitle: string;
  meta?: string;
}

export function memberToLightbox(
  member: FamilyMember,
  language: Language = 'en'
): LightboxImage {
  const t = TRANSLATIONS[language];
  return {
    src: member.fullAvatarUrl ?? member.avatarUrl,
    title: member.name,
    subtitle: t.roleLabels[member.role],
    meta: t.memberText[member.id]?.specialty ?? member.specialty,
  };
}
