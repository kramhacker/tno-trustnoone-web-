import { FamilyInfo, FamilyMember, FamilyRole } from '../types/family';

export const RULES_POSTER_URL = '/assets/aistudio/received_1557431486160387_20d2ee1a.jpeg';
export const QUOTA_POSTER_URL = '/assets/aistudio/received_989194310446134_f7ad912c.jpeg';

export const ROLE_ORDER: Record<FamilyRole, number> = {
  Owner: 0,
  'Head Founder': 1,
  Founder: 2,
  Manager: 3,
  'Head Admin': 4,
  Admin: 5,
  Editor: 6,
  'Bigo Host': 7,
};

export const ROLE_LABELS: Record<FamilyRole, string> = {
  Owner: 'Owner',
  'Head Founder': 'Head Founder',
  Founder: 'Founder',
  Manager: 'Manager',
  'Head Admin': 'Head Admin',
  Admin: 'Admin',
  Editor: 'Editor',
  'Bigo Host': 'Bigo Host',
};

export interface OfficialRuleItem {
  number: string;
  title: string;
  points: string[];
}

export interface ViolationTier {
  offense: string;
  penalty: string;
  tone: 'warning' | 'suspension' | 'removal';
}

export const OFFICIAL_RULES: OfficialRuleItem[] = [
  {
    number: '01',
    title: 'Respect',
    points: [
      'Respect everyone — owner, admins, hosts, and members.',
      'No disrespect, backstabbing, or bringing drama inside the Fam.',
    ],
  },
  {
    number: '02',
    title: 'Be Open (Communication Is Key)',
    points: [
      'If there is an issue, speak directly to the owner or admin.',
      'Do not bottle up issues or spread negativity to others.',
    ],
  },
  {
    number: '03',
    title: 'No to Sensitivity / Drama',
    points: [
      'Do not get offended or sulk over minor matters.',
      'Be mature and learn how to handle feedback and corrections.',
    ],
  },
  {
    number: '04',
    title: 'Consistency & Activeness',
    points: [
      'Do not treat the TNO Fam like a temporary vacation spot.',
      'Stay active in streams, group chats, and events.',
    ],
  },
  {
    number: '05',
    title: 'No Unauthorized Changes',
    points: [
      'Do not change your Avatar (AVA) or Tag Name without permission.',
      'Maintain your identity as part of the Fam.',
    ],
  },
  {
    number: '06',
    title: 'Relationship Rule',
    points: [
      'Do not enter a relationship if you cannot handle it properly.',
      'No drama, jealousy, or arguments that could affect the Fam.',
    ],
  },
  {
    number: '07',
    title: 'Loyalty',
    points: [
      'No backdoor dealings or transferring to another Fam without proper notice.',
      'Respect the team you belong to.',
    ],
  },
];

export const VIOLATION_TIERS: ViolationTier[] = [
  {
    offense: '1st Offense',
    penalty: 'Warning',
    tone: 'warning',
  },
  {
    offense: '2nd Offense',
    penalty: 'Suspension',
    tone: 'suspension',
  },
  {
    offense: '3rd Offense',
    penalty: 'Removal from the Fam',
    tone: 'removal',
  },
];

export const QUOTA_POLICY_INTRO =
  'Please take your PKs and Quotas seriously. Not everyone will always be able to cover for PKs you miss. We all have responsibilities, so please do your part.';

export const QUOTA_POLICY_POINTS: string[] = [
  'Be active and make sure to complete your required live activity.',
  'Make sure to attend your assigned PKs.',
  'Ensure that you have a stable and reliable internet connection.',
  'Please cooperate and follow the arranged PK agreements. Do not be irresponsible when it is your turn.',
];

export const QUOTA_REMINDERS: string[] = [
  'You may not realize how much effort and stress our manager goes through just to arrange and coordinate your PKs. It is unfair when the manager puts in the effort organizing everything, only for some hosts not to show up.',
  'Please understand that your absence does not just affect you; it also affects the manager and the entire team.',
  'Let us practice Responsibility, Cooperation, and Respect for everyone’s effort.',
];

export const DEFAULT_FAMILY_INFO: FamilyInfo = {
  name: 'TNO · Trust No One',
  kicker: 'Official Bigo Family',
  headline: 'TNO · Trust No One',
  description:
    'One Family. One Goal. No Drama. Just Loyalty. Meet our Agency Owner, leadership roles, Bigo Hosts, official Quota Policy, and Family Rules.',
  region: 'Philippines',
};

export const OWNER_MEMBER: FamilyMember = {
  id: 'member-owner-1',
  name: 'Sakura',
  role: 'Owner',
  secondaryRoles: ['Bigo Host'],
  avatarUrl: '/assets/aistudio/thumbs/img_20261119_063440_12cb278b.webp',
  fullAvatarUrl: '/assets/aistudio/img_20261119_063440_12cb278b.jpeg',
  bio: 'Agency Owner and official Bigo Host of TNO (Trust No One) Family.',
  specialty: 'Agency Owner & Bigo Host',
  bigoId: 'TRUSTNOONE25_26',
};

export const ROLE_HOLDERS: FamilyMember[] = [
  {
    id: 'member-headfounder-yuri',
    name: 'Yuri',
    role: 'Head Founder',
    secondaryRoles: ['Bigo Host'],
    avatarUrl: '/assets/aistudio/thumbs/img_20261119_130248_25275f38.webp',
    fullAvatarUrl: '/assets/aistudio/img_20261119_130248_25275f38.jpeg',
    bio: 'Head Founder and official Bigo Host of TNO (Trust No One) Family.',
    specialty: 'Head Founder & Bigo Host',
    bigoId: 'milky14White',
  },
  {
    id: 'member-founder-ken',
    name: 'Ken',
    role: 'Founder',
    avatarUrl: '/assets/aistudio/thumbs/file_000000001f5c8211a2e9ccbfd76b3da1_f32d6eeb.webp',
    fullAvatarUrl: '/assets/aistudio/file_000000001f5c8211a2e9ccbfd76b3da1_f32d6eeb.png',
    bio: 'Founder of TNO (Trust No One) Family.',
    specialty: 'TNO Family Founder',
    bigoId: 'Ninja.assasin',
  },
  {
    id: 'member-manager-master',
    name: 'Master',
    role: 'Manager',
    avatarUrl: '/assets/aistudio/thumbs/file_000000006f3082118660960a538159cb_9bf9510e.webp',
    fullAvatarUrl: '/assets/aistudio/file_000000006f3082118660960a538159cb_9bf9510e.png',
    bio: 'Official Manager coordinating PK schedules and host operations for TNO (Trust No One) Family.',
    specialty: 'TNO Family Manager',
    bigoId: '782614935',
  },
  {
    id: 'member-admin-gaizer',
    name: 'Gaizer',
    role: 'Head Admin',
    secondaryRoles: ['Bigo Host'],
    avatarUrl: '/assets/aistudio/thumbs/file_0000000066608211b97ee3eb6d1674de_17c45c75.webp',
    fullAvatarUrl: '/assets/aistudio/file_0000000066608211b97ee3eb6d1674de_17c45c75.png',
    bio: 'Head Admin and official Bigo Host of TNO (Trust No One) Family.',
    specialty: 'Head Admin & Bigo Host',
    bigoId: 'leslymain',
  },
  {
    id: 'member-admin-zai',
    name: 'Zai',
    role: 'Admin',
    avatarUrl: '/assets/aistudio/thumbs/file_000000007a6c8211aef7adab10036926_eeba3a2f.webp',
    fullAvatarUrl: '/assets/aistudio/file_000000007a6c8211aef7adab10036926_eeba3a2f.png',
    bio: 'Official Admin of TNO (Trust No One) Family.',
    specialty: 'TNO Family Admin',
    bigoId: 'Queen...Sanchez',
  },
  {
    id: 'member-editor-kazuto',
    name: 'Kazuto',
    role: 'Editor',
    avatarUrl: '/assets/aistudio/thumbs/file_000000008434821184593fd6428196de_4cdb3c7f.webp',
    fullAvatarUrl: '/assets/aistudio/file_000000008434821184593fd6428196de_4cdb3c7f.png',
    bio: 'Official Editor creating custom avatars and visuals for TNO (Trust No One) Family.',
    specialty: 'Avatar & Graphic Design',
    bigoId: 'zoren.H020101',
  },
  {
    id: 'member-host-mac',
    name: 'Mac',
    role: 'Bigo Host',
    avatarUrl: '/assets/aistudio/thumbs/img_20261119_142709_b68c468d.webp',
    fullAvatarUrl: '/assets/aistudio/img_20261119_142709_b68c468d.jpeg',
    bio: 'Official Bigo Host of TNO (Trust No One) Family.',
    specialty: 'Official Bigo Host',
    bigoId: 'Only_Father',
  },
  {
    id: 'member-host-henyo',
    name: 'Henyo',
    role: 'Bigo Host',
    avatarUrl: '/assets/aistudio/thumbs/img_20261119_142356_01c4924b.webp',
    fullAvatarUrl: '/assets/aistudio/img_20261119_142356_01c4924b.jpeg',
    bio: 'Official Bigo Host of TNO (Trust No One) Family.',
    specialty: 'Official Bigo Host',
    bigoId: 'kaiser2004',
  },
];
