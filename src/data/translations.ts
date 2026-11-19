import { FamilyRole } from '../types/family';
import { OfficialRuleItem, ViolationTier } from './defaultFamily';

export type Language = 'en' | 'tl';

export interface PanelRuleItem {
  number: string;
  title: string;
  description: string;
}

export interface TranslationContent {
  nav: {
    roster: string;
    quota: string;
    rules: string;
    panel: string;
    violations: string;
    developer: string;
    languageLabel: string;
  };
  search: {
    placeholder: string;
    noMatches: string;
    openAction: string;
    clearLabel: string;
  };
  roster: {
    allLabel: string;
    showingCount: (displayed: number, total: number) => string;
    kicker: string;
    description: string;
    viewProfile: string;
    leadershipEyebrow: string;
    rolesHeading: string;
    rolesSubheading: string;
    viewDetails: string;
    noRoleHolders: string;
    showAllRoles: string;
    bigoIdLabel: string;
    copiedLabel: string;
    copyTitle: string;
  };
  quota: {
    eyebrow: string;
    heading: string;
    intro: string;
    viewPoster: string;
    posterTitle: string;
    posterSubtitle: string;
    requirementsTitle: string;
    points: string[];
    reminderTitle: string;
    reminders: string[];
    footerNote: string;
  };
  rules: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    viewPanelRules: string;
    viewViolations: string;
    viewPoster: string;
    posterTitle: string;
    posterSubtitle: string;
    items: OfficialRuleItem[];
  };
  panelRules: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    noticeTitle: string;
    noticeBody: string;
    items: PanelRuleItem[];
    ctaRules: string;
    ctaViolations: string;
  };
  violations: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    readRules: string;
    viewPoster: string;
    posterTitle: string;
    posterSubtitle: string;
    tiers: ViolationTier[];
    calloutTitle: string;
    calloutBody: string;
    contactLeadership: string;
  };
  modals: {
    close: string;
    roleOverview: string;
    roleLabel: string;
    specialtyLabel: string;
    bigoIdLabel: string;
    copied: string;
    clickToEnlarge: string;
    developerHeader: string;
    developerCreator: string;
    developerRoleTitle: string;
    developerBio: string;
    developerSkillsHeading: string;
    developerSkills: Array<{ title: string; detail: string }>;
  };
  footer: {
    tagline: string;
    backToTop: string;
    visitsLabel: string;
    visitsLoading: string;
  };
  memberText: Record<string, { specialty: string; bio: string }>;
  roleLabels: Record<FamilyRole, string>;
}

export const TRANSLATIONS: Record<Language, TranslationContent> = {
  en: {
    nav: {
      roster: 'Owner & Roles',
      quota: 'Quota Policy',
      rules: 'Rules & Guides',
      panel: 'Panel Rules',
      violations: 'Violations',
      developer: 'Developer',
      languageLabel: 'Select language',
    },
    search: {
      placeholder:
        'Search owner, host, admin, Bigo ID, quota policy, rules, panel rules, or violations...',
      noMatches: 'No matching member, role, policy, rule, or violation found.',
      openAction: 'Open',
      clearLabel: 'Clear search',
    },
    roster: {
      allLabel: 'All',
      showingCount: (displayed, total) => `Showing ${displayed} of ${total} roles`,
      kicker: 'Official Bigo Family',
      description:
        'One Family. One Goal. No Drama. Just Loyalty. Meet our Agency Owner, leadership roles, Bigo Hosts, official Quota Policy, and Family Rules.',
      viewProfile: 'View Profile',
      leadershipEyebrow: 'Leadership & Performers',
      rolesHeading: 'Official Family Roles',
      rolesSubheading:
        'Click any photo to view it enlarged, copy a Bigo ID, or open a card for full details.',
      viewDetails: 'View Details',
      noRoleHolders: 'No matching role holders found',
      showAllRoles: 'Show All Roles',
      bigoIdLabel: 'Bigo ID:',
      copiedLabel: 'Copied!',
      copyTitle: 'Click to copy Bigo ID',
    },
    quota: {
      eyebrow: 'Announcement to All Bigo Hosts',
      heading: 'TNO Quota Policy',
      intro:
        'Please take your PKs and Quotas seriously. Not everyone will always be able to cover for PKs you miss. We all have responsibilities, so please do your part.',
      viewPoster: 'View Official Poster',
      posterTitle: 'TNO Quota Policy Announcement',
      posterSubtitle: 'Official Bigo Host Policy Poster',
      requirementsTitle: 'Host Requirements',
      points: [
        'Be active and make sure to complete your required live activity.',
        'Make sure to attend your assigned PKs.',
        'Ensure that you have a stable and reliable internet connection.',
        'Please cooperate and follow the arranged PK agreements. Do not be irresponsible when it is your turn.',
      ],
      reminderTitle: 'A Little Reminder to Everyone',
      reminders: [
        'You may not realize how much effort and stress our manager goes through just to arrange and coordinate your PKs. It is unfair when the manager puts in the effort organizing everything, only for some hosts not to show up.',
        'Please understand that your absence does not just affect you; it also affects the manager and the entire team.',
        'Let us practice Responsibility, Cooperation, and Respect for everyone’s effort.',
      ],
      footerNote: 'Be Active · Be Responsible · Be Part of TNO',
    },
    rules: {
      eyebrow: 'General Rules (For All Members & Hosts)',
      heading: 'Official Rules & Guidelines',
      subtitle: 'One Family · One Goal · No Drama · Just Loyalty',
      viewPanelRules: 'Panel Rules',
      viewViolations: 'View Violations',
      viewPoster: 'View Official Poster',
      posterTitle: 'TNO Family Official Rules & Guidelines',
      posterSubtitle: 'Unity · Loyalty · Respect',
      items: [
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
      ],
    },
    panelRules: {
      eyebrow: 'Live Room & Multi-Guest Conduct',
      heading: 'Panel Rules (For Co-Members Inside the Panel)',
      subtitle:
        'Strict guidelines enforced whenever TNO members and hosts are together inside a live panel.',
      noticeTitle: 'No Action Without a Valid Reason',
      noticeBody:
        'Whenever co-members are inside the panel together, everyone is expected to maintain fairness and respect. All of the actions below are strictly prohibited without a valid reason.',
      items: [
        {
          number: '01',
          title: 'No Unjustified Muting',
          description:
            'Do not mute a co-member on the panel without a clear and valid reason.',
        },
        {
          number: '02',
          title: 'No Disrupting / Wrecking',
          description:
            'Do not ruin, interrupt, or sabotage a co-member’s seat, moment, or stream without a valid reason.',
        },
        {
          number: '03',
          title: 'No Unjustified Kicking',
          description:
            'Do not kick any co-member out of the panel or live room without a valid reason.',
        },
        {
          number: '04',
          title: 'No Bombarding / Ganging Up',
          description:
            'Do not bombard, spam-attack, or gang up on a co-member inside the panel without a valid reason.',
        },
        {
          number: '05',
          title: 'No Insulting',
          description:
            'Do not insult, mock, or verbally abuse any co-member inside the panel without a valid reason.',
        },
      ],
      ctaRules: 'General Rules (01–07)',
      ctaViolations: 'View Violations',
    },
    violations: {
      eyebrow: 'Disciplinary Policy',
      heading: 'Violations & Penalties',
      subtitle:
        'Progressive disciplinary measures applied for breaches of TNO Family Rules & Guidelines.',
      readRules: 'Read Rules (01–07)',
      viewPoster: 'View Official Poster',
      posterTitle: 'TNO Family Official Rules & Violations',
      posterSubtitle: 'Unity · Loyalty · Respect',
      tiers: [
        { offense: '1st Offense', penalty: 'Warning', tone: 'warning' },
        { offense: '2nd Offense', penalty: 'Suspension', tone: 'suspension' },
        { offense: '3rd Offense', penalty: 'Removal from the Fam', tone: 'removal' },
      ],
      calloutTitle: 'One Family · One Goal · No Drama · Just Loyalty',
      calloutBody:
        'Need clarification on any rule or concern? Speak directly with the Owner or Admins in accordance with Rule 02.',
      contactLeadership: 'Contact Leadership',
    },
    modals: {
      close: 'Close',
      roleOverview: 'Role Overview',
      roleLabel: 'Role',
      specialtyLabel: 'Specialty',
      bigoIdLabel: 'Bigo ID',
      copied: 'Copied!',
      clickToEnlarge: 'Click photo to enlarge',
      developerHeader: 'Website Developer',
      developerCreator: 'Website Creator',
      developerRoleTitle: 'Full-Stack Web Developer & UI Designer',
      developerBio:
        'Designed and built the official TNO · Trust No One web experience with custom visual effects, responsive layout architecture, and smooth performance.',
      developerSkillsHeading: 'Developer Skills',
      developerSkills: [
        {
          title: 'Frontend Engineering',
          detail: 'React, TypeScript & Modern Web Architecture',
        },
        {
          title: 'UI / UX & Motion',
          detail: 'Tailwind CSS, Custom Effects & 60fps Animations',
        },
        {
          title: 'Responsive Design',
          detail: 'Mobile-First Layouts & Polished Typography',
        },
        {
          title: 'Performance Optimization',
          detail: 'GPU Compositing & Fast Interactive Rendering',
        },
      ],
    },
    footer: {
      tagline: 'Trust No One · Stay Loyal · Protect The Family',
      backToTop: 'Back to Top',
      visitsLabel: 'Website Visits',
      visitsLoading: '...',
    },
    memberText: {
      'member-owner-1': {
        specialty: 'Agency Owner & Bigo Host',
        bio: 'Agency Owner and official Bigo Host of TNO (Trust No One) Family.',
      },
      'member-headfounder-yuri': {
        specialty: 'Head Founder & Bigo Host',
        bio: 'Head Founder and official Bigo Host of TNO (Trust No One) Family.',
      },
      'member-founder-ken': {
        specialty: 'TNO Family Founder',
        bio: 'Founder of TNO (Trust No One) Family.',
      },
      'member-manager-master': {
        specialty: 'TNO Family Manager',
        bio: 'Official Manager coordinating PK schedules and host operations for TNO (Trust No One) Family.',
      },
      'member-admin-gaizer': {
        specialty: 'Head Admin & Bigo Host',
        bio: 'Head Admin and official Bigo Host of TNO (Trust No One) Family.',
      },
      'member-admin-zai': {
        specialty: 'TNO Family Admin',
        bio: 'Official Admin of TNO (Trust No One) Family.',
      },
      'member-editor-kazuto': {
        specialty: 'Avatar & Graphic Design',
        bio: 'Official Editor creating custom avatars and visuals for TNO (Trust No One) Family.',
      },
      'member-host-mac': {
        specialty: 'Official Bigo Host',
        bio: 'Official Bigo Host of TNO (Trust No One) Family.',
      },
      'member-host-henyo': {
        specialty: 'Official Bigo Host',
        bio: 'Official Bigo Host of TNO (Trust No One) Family.',
      },
    },
    roleLabels: {
      Owner: 'Owner',
      'Head Founder': 'Head Founder',
      Founder: 'Founder',
      Manager: 'Manager',
      'Head Admin': 'Head Admin',
      Admin: 'Admin',
      Editor: 'Editor',
      'Bigo Host': 'Bigo Host',
    },
  },
  tl: {
    nav: {
      roster: 'Owner at Roles',
      quota: 'Quota Policy',
      rules: 'Batas at Gabay',
      panel: 'Batas sa Panel',
      violations: 'Paglabag',
      developer: 'Developer',
      languageLabel: 'Pumili ng wika',
    },
    search: {
      placeholder:
        'Maghanap ng owner, host, admin, Bigo ID, quota policy, batas, panel rules, o paglabag...',
      noMatches: 'Walang nahanap na member, role, policy, batas, o paglabag.',
      openAction: 'Buksan',
      clearLabel: 'I-clear ang search',
    },
    roster: {
      allLabel: 'Lahat',
      showingCount: (displayed, total) => `Ipinapakita ang ${displayed} sa ${total} na roles`,
      kicker: 'Opisyal na Bigo Family',
      description:
        'Isang Pamilya. Isang Layunin. Walang Drama. Katapatan Lamang. Kilalanin ang aming Agency Owner, mga lider, Bigo Hosts, opisyal na Quota Policy, at Mga Batas ng Pamilya.',
      viewProfile: 'Tingnan ang Profile',
      leadershipEyebrow: 'Mga Lider at Host',
      rolesHeading: 'Mga Opisyal na Role sa Pamilya',
      rolesSubheading:
        'I-click ang larawan para palakihin, kopyahin ang Bigo ID, o buksan ang card para sa buong detalye.',
      viewDetails: 'Tingnan ang Detalye',
      noRoleHolders: 'Walang nahanap na may hawak ng role',
      showAllRoles: 'Ipakita Lahat ng Roles',
      bigoIdLabel: 'Bigo ID:',
      copiedLabel: 'Nakopya!',
      copyTitle: 'I-click para kopyahin ang Bigo ID',
    },
    quota: {
      eyebrow: 'Anunsyo Para sa Lahat ng Bigo Hosts',
      heading: 'TNO Quota Policy',
      intro:
        'Pakiusap, seryosohin ang inyong mga PK at Quota. Hindi sa lahat ng oras ay may sasalo sa mga PK na hindi ninyo nasipot. May kanya-kanya tayong responsibilidad, kaya gawin natin ang ating parte.',
      viewPoster: 'Tingnan ang Opisyal na Poster',
      posterTitle: 'Anunsyo ng TNO Quota Policy',
      posterSubtitle: 'Opisyal na Policy Poster ng mga Bigo Host',
      requirementsTitle: 'Mga Kailangan ng Host',
      points: [
        'Maging aktibo at siguraduhing makumpleto ang required na live activity.',
        'Siguraduhing makadalo sa mga naka-assign na PK sa iyo.',
        'Tiyaking maayos at stable ang iyong internet connection.',
        'Makisama at sumunod sa mga napagkasunduang PK. Huwag maging iresponsable kapag turno mo na.',
      ],
      reminderTitle: 'Kaunting Paalala sa Lahat',
      reminders: [
        'Hindi ninyo alam kung gaano kahirap at nakaka-stress ang ginagawa ng manager para lang ma-arrange at maayos ang mga PK ninyo. Hindi makatarungan na pinaghihirapan ng manager ayusin ang lahat tapos hindi sisipot ang ibang hosts.',
        'Unawain ninyo na ang hindi pagsipot ay hindi lang kayo ang naaapektuhan; naaapektuhan din ang manager at ang buong team.',
        'Isabuhay natin ang Responsibilidad, Kooperasyon, at Paggalang sa pagod ng bawat isa.',
      ],
      footerNote: 'Maging Aktibo · Maging Responsable · Maging Bahagi ng TNO',
    },
    rules: {
      eyebrow: 'Pangkalahatang Batas (Para sa Lahat ng Members at Hosts)',
      heading: 'Mga Opisyal na Batas at Gabay',
      subtitle: 'Isang Pamilya · Isang Layunin · Walang Drama · Katapatan Lamang',
      viewPanelRules: 'Batas sa Panel',
      viewViolations: 'Tingnan ang Paglabag',
      viewPoster: 'Tingnan ang Opisyal na Poster',
      posterTitle: 'Opisyal na Batas at Gabay ng TNO Family',
      posterSubtitle: 'Pagkakaisa · Katapatan · Paggalang',
      items: [
        {
          number: '01',
          title: 'Paggalang (Respect)',
          points: [
            'Igalang ang lahat — owner, admins, hosts, at members.',
            'Bawal ang kawalan ng respeto, paninira sa likod, o pagdadala ng drama sa loob ng Fam.',
          ],
        },
        {
          number: '02',
          title: 'Maging Bukas (Komunikasyon ang Susi)',
          points: [
            'Kung may problema, makipag-usap nang direkta sa owner o admin.',
            'Huwag kimkimin ang sama ng loob o magkalat ng negatibo sa iba.',
          ],
        },
        {
          number: '03',
          title: 'Bawal ang Pagiging Balat-Sibuyas / Drama',
          points: [
            'Huwag agad magtampo o ma-offend sa maliliit na bagay.',
            'Maging mature at matutong tumanggap ng puna at pagtatama.',
          ],
        },
        {
          number: '04',
          title: 'Pagiging Consistent at Aktibo',
          points: [
            'Huwag gawing bakasyunan lang ang TNO Fam.',
            'Manatiling aktibo sa streams, group chats, at mga event.',
          ],
        },
        {
          number: '05',
          title: 'Bawal ang Walang Paalam na Pagbabago',
          points: [
            'Huwag magpalit ng Avatar (AVA) o Tag Name nang walang pahintulot.',
            'Panatilihin ang iyong pagkakakilanlan bilang bahagi ng Fam.',
          ],
        },
        {
          number: '06',
          title: 'Batas sa Relasyon',
          points: [
            'Huwag pumasok sa relasyon kung hindi ito kayang dalhin nang maayos.',
            'Walang drama, selosan, o away na makakaapekto sa Fam.',
          ],
        },
        {
          number: '07',
          title: 'Katapatan (Loyalty)',
          points: [
            'Bawal ang patagong transaksyon o paglipat sa ibang Fam nang walang maayos na paalam.',
            'Igalang ang team na kinabibilangan mo.',
          ],
        },
      ],
    },
    panelRules: {
      eyebrow: 'Kaayusan sa Live Room at Multi-Guest Panel',
      heading: 'Mga Batas sa Panel (Para sa Magkaka-Member)',
      subtitle:
        'Mahigpit na ipinatutupad kapag magkakasama sa loob ng panel ang mga magkaka-member ng TNO.',
      noticeTitle: 'Bawal Gawin Nang Walang Valid na Dahilan',
      noticeBody:
        'Kapag nasa loob ng panel ang mga magkaka-member, dapat panatilihin ang respeto at patas na pakikitungo. Mahigpit na ipinagbabawal ang mga sumusunod kung walang valid na dahilan:',
      items: [
        {
          number: '01',
          title: 'Bawal Mag-Mute Nang Walang Valid na Dahilan',
          description:
            'Huwag i-mute ang ka-member habang nasa loob ng panel kung walang malinaw at valid na dahilan.',
        },
        {
          number: '02',
          title: 'Bawal Mambasag Nang Walang Valid na Dahilan',
          description:
            'Huwag basagin, sirain, o gambalain ang usapan, live, o moment ng ka-member nang walang valid na dahilan.',
        },
        {
          number: '03',
          title: 'Bawal Mag-Kick Nang Walang Valid na Dahilan',
          description:
            'Huwag i-kick ang sinumang ka-member mula sa panel o live room kung walang valid na dahilan.',
        },
        {
          number: '04',
          title: 'Bawal Mambomba Nang Walang Valid na Dahilan',
          description:
            'Huwag bombahan, pagtulungan, o i-spam ng negatibo ang ka-member sa loob ng panel nang walang valid na dahilan.',
        },
        {
          number: '05',
          title: 'Bawal Mang-Insulto (Insultuhan) Nang Walang Valid na Dahilan',
          description:
            'Huwag insultuhin, pagtawanan, o siraan ang pagkatao ng ka-member sa panel nang walang valid na dahilan.',
        },
      ],
      ctaRules: 'Pangkalahatang Batas (01–07)',
      ctaViolations: 'Tingnan ang Paglabag',
    },
    violations: {
      eyebrow: 'Patakaran sa Disiplina',
      heading: 'Mga Paglabag at Parusa',
      subtitle:
        'Mga hakbang na ipinapataw para sa sinumang lumabag sa Mga Batas at Gabay ng TNO Family.',
      readRules: 'Basahin ang Batas (01–07)',
      viewPoster: 'Tingnan ang Opisyal na Poster',
      posterTitle: 'Opisyal na Batas at Paglabag ng TNO Family',
      posterSubtitle: 'Pagkakaisa · Katapatan · Paggalang',
      tiers: [
        { offense: 'Unang Paglabag (1st Offense)', penalty: 'Babala (Warning)', tone: 'warning' },
        {
          offense: 'Ikalawang Paglabag (2nd Offense)',
          penalty: 'Suspensyon (Suspension)',
          tone: 'suspension',
        },
        {
          offense: 'Ikatlong Paglabag (3rd Offense)',
          penalty: 'Pagkakatanggal sa Fam (Removal)',
          tone: 'removal',
        },
      ],
      calloutTitle: 'Isang Pamilya · Isang Layunin · Walang Drama · Katapatan Lamang',
      calloutBody:
        'May katanungan o nais linawin tungkol sa anumang batas? Direktang makipag-usap sa Owner o Admins alinsunod sa Batas 02.',
      contactLeadership: 'Makipag-ugnayan sa mga Lider',
    },
    modals: {
      close: 'Isara',
      roleOverview: 'Tungkol sa Role',
      roleLabel: 'Role',
      specialtyLabel: 'Espesyalisasyon',
      bigoIdLabel: 'Bigo ID',
      copied: 'Nakopya!',
      clickToEnlarge: 'I-click ang larawan para palakihin',
      developerHeader: 'Developer ng Website',
      developerCreator: 'Gumawa ng Website',
      developerRoleTitle: 'Full-Stack Web Developer & UI Designer',
      developerBio:
        'Nagdisenyo at gumawa ng opisyal na website ng TNO · Trust No One na may custom effects, maayos na responsive layout, at mabilis na performance.',
      developerSkillsHeading: 'Mga Kasanayan ng Developer',
      developerSkills: [
        {
          title: 'Frontend Engineering',
          detail: 'React, TypeScript at Modern Web Architecture',
        },
        {
          title: 'UI / UX & Motion',
          detail: 'Tailwind CSS, Custom Effects at 60fps Animations',
        },
        {
          title: 'Responsive Design',
          detail: 'Mobile-First Layouts at Malinis na Typography',
        },
        {
          title: 'Performance Optimization',
          detail: 'GPU Compositing at Mabilis na Rendering',
        },
      ],
    },
    footer: {
      tagline: 'Trust No One · Manatiling Tapat · Protektahan ang Pamilya',
      backToTop: 'Bumalik sa Itaas',
      visitsLabel: 'Bilang ng Bisita',
      visitsLoading: '...',
    },
    memberText: {
      'member-owner-1': {
        specialty: 'Agency Owner at Bigo Host',
        bio: 'Agency Owner at opisyal na Bigo Host ng TNO (Trust No One) Family.',
      },
      'member-headfounder-yuri': {
        specialty: 'Head Founder at Bigo Host',
        bio: 'Head Founder at opisyal na Bigo Host ng TNO (Trust No One) Family.',
      },
      'member-founder-ken': {
        specialty: 'TNO Family Founder',
        bio: 'Founder ng TNO (Trust No One) Family.',
      },
      'member-manager-master': {
        specialty: 'TNO Family Manager',
        bio: 'Opisyal na Manager na nag-aayos ng mga PK schedule at operasyon ng hosts sa TNO (Trust No One) Family.',
      },
      'member-admin-gaizer': {
        specialty: 'Head Admin at Bigo Host',
        bio: 'Head Admin at opisyal na Bigo Host ng TNO (Trust No One) Family.',
      },
      'member-admin-zai': {
        specialty: 'TNO Family Admin',
        bio: 'Opisyal na Admin ng TNO (Trust No One) Family.',
      },
      'member-editor-kazuto': {
        specialty: 'Avatar at Graphic Design',
        bio: 'Opisyal na Editor na gumagawa ng mga custom avatar at disenyo para sa TNO (Trust No One) Family.',
      },
      'member-host-mac': {
        specialty: 'Opisyal na Bigo Host',
        bio: 'Opisyal na Bigo Host ng TNO (Trust No One) Family.',
      },
      'member-host-henyo': {
        specialty: 'Opisyal na Bigo Host',
        bio: 'Opisyal na Bigo Host ng TNO (Trust No One) Family.',
      },
    },
    roleLabels: {
      Owner: 'Owner',
      'Head Founder': 'Head Founder',
      Founder: 'Founder',
      Manager: 'Manager',
      'Head Admin': 'Head Admin',
      Admin: 'Admin',
      Editor: 'Editor',
      'Bigo Host': 'Bigo Host',
    },
  },
};
