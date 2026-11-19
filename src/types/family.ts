export type FamilyRole = 'Owner' | 'Head Founder' | 'Founder' | 'Manager' | 'Head Admin' | 'Admin' | 'Editor' | 'Bigo Host';

export interface FamilyMember {
  id: string;
  name: string;
  role: FamilyRole;
  secondaryRoles?: FamilyRole[];
  avatarUrl: string;
  fullAvatarUrl?: string;
  bio: string;
  specialty: string;
  bigoId?: string;
}

export interface FamilyInfo {
  name: string;
  kicker: string;
  headline: string;
  description: string;
  region: string;
}
