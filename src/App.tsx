import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  Search,
  Crown,
  ShieldCheck,
  Sparkles,
  ZoomIn,
  ArrowUpRight,
  ArrowUp,
  X,
  AlertTriangle,
  ShieldAlert,
  Ban,
  Megaphone,
  Palette,
  Copy,
  Check,
  Code2,
  Image as ImageIcon,
  Users,
  BookOpen,
  Globe,
  ChevronDown,
  Radio,
  MicOff,
  UserX,
  MessageSquareWarning,
  Eye,
} from 'lucide-react';
import {
  DEFAULT_FAMILY_INFO,
  OWNER_MEMBER,
  QUOTA_POSTER_URL,
  ROLE_HOLDERS,
  ROLE_ORDER,
  RULES_POSTER_URL,
} from './data/defaultFamily';
import { TRANSLATIONS, Language } from './data/translations';
import { FamilyMember, FamilyRole } from './types/family';
import { MemberAvatar } from './components/MemberAvatar';
import { MemberModal } from './components/MemberModal';
import { DeveloperModal } from './components/DeveloperModal';
import { ImageLightbox } from './components/ImageLightbox';
import {
  type LightboxImage,
  memberToLightbox,
} from './utils/lightbox';

type RosterFilter = 'All' | FamilyRole;
type PageSection = 'roster' | 'quota' | 'rules' | 'panel' | 'violations';

const SECTION_IDS: PageSection[] = ['roster', 'quota', 'rules', 'panel', 'violations'];

const SECTION_PATHS: Record<PageSection, string> = {
  roster: '/',
  quota: '/quota',
  rules: '/rules',
  panel: '/panel',
  violations: '/violations',
};

function getSectionFromLocation(): PageSection {
  if (typeof window === 'undefined') return 'roster';
  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const rawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const candidate = rawPath !== '/' ? rawPath.slice(1) : rawHash;
  if (candidate === 'quota' || candidate === 'quota-policy') return 'quota';
  if (candidate === 'rules' || candidate === 'official-rules') return 'rules';
  if (candidate === 'panel' || candidate === 'panel-rules') return 'panel';
  if (candidate === 'violations' || candidate === 'violations-policy') return 'violations';
  return 'roster';
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem('tno_language');
    if (saved === 'en' || saved === 'tl') return saved;
  } catch {
    // Ignore storage access errors
  }
  return 'en';
}

const ROLE_FILTER_VALUES: RosterFilter[] = [
  'All',
  'Owner',
  'Head Founder',
  'Founder',
  'Manager',
  'Head Admin',
  'Admin',
  'Editor',
  'Bigo Host',
];

interface QuickJumpMatch {
  id: string;
  label: string;
  sublabel: string;
  section: PageSection;
  targetElementId: string;
  filterRole?: RosterFilter;
}

export default function App() {
  const familyInfo = DEFAULT_FAMILY_INFO;
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<PageSection>(getSectionFromLocation);
  const [roleFilter, setRoleFilter] = useState<RosterFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<LightboxImage | null>(null);
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const langContainerRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    import('./services/visitCounter')
      .then(({ recordWebsiteVisit, subscribeWebsiteVisits }) => {
        if (!active) return;
        unsubscribe = subscribeWebsiteVisits(
          (count) => {
            if (active) setVisitCount(count);
          },
          () => {
            // Handled cleanly inside service error logger
          }
        );

        recordWebsiteVisit()
          .then((count) => {
            if (active) setVisitCount(count);
          })
          .catch(() => {
            // Keep UI resilient if offline or blocked
          });
      })
      .catch(() => {
        // Keep UI resilient if module load fails
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem('tno_language', language);
    } catch {
      // Ignore storage access errors
    }
  }, [language]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveSection(getSectionFromLocation());
      setIsSearchOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        langContainerRef.current &&
        !langContainerRef.current.contains(e.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyId = (
    e: ReactMouseEvent<HTMLButtonElement>,
    memberId: string,
    bigoId: string
  ) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(bigoId).catch(() => {});
    setCopiedMemberId(memberId);
    setTimeout(() => {
      setCopiedMemberId((prev) => (prev === memberId ? null : prev));
    }, 1600);
  };

  const sortedRoleHolders = useMemo(() => {
    return [...ROLE_HOLDERS].sort((a, b) => {
      const orderDiff = ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const allPeople = useMemo(() => {
    return [OWNER_MEMBER, ...sortedRoleHolders];
  }, [sortedRoleHolders]);

  const filteredRoleHolders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (roleFilter === 'Owner') {
      return [];
    }
    return sortedRoleHolders.filter((m) => {
      const matchesRole =
        roleFilter === 'All' ||
        m.role === roleFilter ||
        (m.secondaryRoles?.includes(roleFilter) ?? false);
      if (!matchesRole) return false;
      if (!q) return true;
      const locSpecialty = t.memberText[m.id]?.specialty ?? m.specialty;
      return (
        m.name.toLowerCase().includes(q) ||
        t.roleLabels[m.role].toLowerCase().includes(q) ||
        locSpecialty.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        (m.bigoId?.toLowerCase().includes(q) ?? false) ||
        (m.secondaryRoles?.some((sr) => t.roleLabels[sr].toLowerCase().includes(q)) ??
          false)
      );
    });
  }, [sortedRoleHolders, roleFilter, searchQuery, t]);

  const showOwnerSection = useMemo(() => {
    const matchesRole =
      roleFilter === 'All' ||
      roleFilter === 'Owner' ||
      (OWNER_MEMBER.secondaryRoles?.includes(roleFilter) ?? false);
    if (!matchesRole) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const locSpecialty = t.memberText[OWNER_MEMBER.id]?.specialty ?? OWNER_MEMBER.specialty;
    return (
      OWNER_MEMBER.name.toLowerCase().includes(q) ||
      t.roleLabels[OWNER_MEMBER.role].toLowerCase().includes(q) ||
      locSpecialty.toLowerCase().includes(q) ||
      OWNER_MEMBER.specialty.toLowerCase().includes(q) ||
      (OWNER_MEMBER.bigoId?.toLowerCase().includes(q) ?? false) ||
      (OWNER_MEMBER.secondaryRoles?.some((sr) =>
        t.roleLabels[sr].toLowerCase().includes(q)
      ) ??
        false) ||
      'owner'.includes(q)
    );
  }, [roleFilter, searchQuery, t]);

  const quickJumpMatches = useMemo<QuickJumpMatch[]>(() => {
    if (!isSearchOpen && !searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    const matches: QuickJumpMatch[] = [];

    for (const person of allPeople) {
      const roleLabel = t.roleLabels[person.role];
      const specialty = t.memberText[person.id]?.specialty ?? person.specialty;
      if (
        !q ||
        person.name.toLowerCase().includes(q) ||
        roleLabel.toLowerCase().includes(q) ||
        specialty.toLowerCase().includes(q) ||
        person.specialty.toLowerCase().includes(q) ||
        (person.bigoId?.toLowerCase().includes(q) ?? false)
      ) {
        matches.push({
          id: `jump-${person.id}`,
          label: person.name,
          sublabel: person.bigoId
            ? `${roleLabel} · ${specialty} · ID: ${person.bigoId}`
            : `${roleLabel} · ${specialty}`,
          section: 'roster',
          targetElementId: person.role === 'Owner' ? 'owner-card' : `card-${person.id}`,
          filterRole: person.role,
        });
      }
    }

    const sectionMatches: QuickJumpMatch[] = [
      {
        id: 'jump-section-owner',
        label: t.nav.roster,
        sublabel: `${t.nav.roster} · Sakura`,
        section: 'roster',
        targetElementId: 'owner',
        filterRole: 'All',
      },
      {
        id: 'jump-section-roles',
        label: t.roster.rolesHeading,
        sublabel: t.nav.roster,
        section: 'roster',
        targetElementId: 'roles-roster',
        filterRole: 'All',
      },
      {
        id: 'jump-section-quota',
        label: t.quota.heading,
        sublabel: t.quota.eyebrow,
        section: 'quota',
        targetElementId: 'quota-policy',
      },
      {
        id: 'jump-section-rules',
        label: t.rules.heading,
        sublabel: t.rules.eyebrow,
        section: 'rules',
        targetElementId: 'official-rules',
      },
      {
        id: 'jump-section-panel',
        label: t.panelRules.heading,
        sublabel: t.panelRules.eyebrow,
        section: 'panel',
        targetElementId: 'panel-rules',
      },
      {
        id: 'jump-section-violations',
        label: t.violations.heading,
        sublabel: t.violations.eyebrow,
        section: 'violations',
        targetElementId: 'violations-policy',
      },
    ];

    for (const sec of sectionMatches) {
      if (
        !q ||
        sec.label.toLowerCase().includes(q) ||
        sec.sublabel.toLowerCase().includes(q)
      ) {
        matches.push(sec);
      }
    }

    if (q) {
      for (const rule of t.rules.items) {
        const joinedPoints = rule.points.join(' ').toLowerCase();
        if (
          rule.title.toLowerCase().includes(q) ||
          joinedPoints.includes(q) ||
          rule.number.includes(q)
        ) {
          matches.push({
            id: `jump-rule-${rule.number}`,
            label: `${rule.number} · ${rule.title}`,
            sublabel: t.nav.rules,
            section: 'rules',
            targetElementId: `rule-${rule.number}`,
          });
        }
      }

      for (const pRule of t.panelRules.items) {
        if (
          pRule.title.toLowerCase().includes(q) ||
          pRule.description.toLowerCase().includes(q) ||
          'panel'.includes(q) ||
          'mute'.includes(q) ||
          'kick'.includes(q) ||
          'basag'.includes(q) ||
          'bomba'.includes(q) ||
          'insult'.includes(q)
        ) {
          matches.push({
            id: `jump-panel-${pRule.number}`,
            label: `${pRule.number} · ${pRule.title}`,
            sublabel: t.nav.panel,
            section: 'panel',
            targetElementId: `panel-rule-${pRule.number}`,
          });
        }
      }

      for (const tier of t.violations.tiers) {
        if (
          tier.offense.toLowerCase().includes(q) ||
          tier.penalty.toLowerCase().includes(q) ||
          'violation'.includes(q) ||
          'paglabag'.includes(q)
        ) {
          matches.push({
            id: `jump-tier-${tier.offense}`,
            label: `${tier.offense}: ${tier.penalty}`,
            sublabel: t.nav.violations,
            section: 'violations',
            targetElementId: 'violations-policy',
          });
        }
      }
    }

    return matches.slice(0, 8);
  }, [allPeople, isSearchOpen, searchQuery, t]);

  const syncSectionUrl = (section: PageSection) => {
    try {
      const nextPath = SECTION_PATHS[section];
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ section }, '', nextPath);
      }
    } catch {
      // Ignore history API restrictions
    }
  };

  const switchSection = (section: PageSection, resetFilter = false) => {
    setActiveSection(section);
    syncSectionUrl(section);
    setIsSearchOpen(false);
    if (resetFilter) {
      setRoleFilter('All');
    }
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  };

  const jumpToTarget = (
    section: PageSection,
    elementId: string,
    filterToApply?: RosterFilter
  ) => {
    setIsSearchOpen(false);
    setActiveSection(section);
    syncSectionUrl(section);
    if (filterToApply) {
      setRoleFilter(filterToApply);
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
        setHighlightedId(elementId);
        setTimeout(() => {
          setHighlightedId((prev) => (prev === elementId ? null : prev));
        }, 1200);
      } else if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    });
  };

  const handleTopFilterClick = (val: RosterFilter) => {
    setActiveSection('roster');
    syncSectionUrl('roster');
    setRoleFilter(val);
    if (
      val === 'Owner' ||
      (val !== 'All' && (OWNER_MEMBER.secondaryRoles?.includes(val) ?? false))
    ) {
      requestAnimationFrame(() => {
        document.getElementById('owner')?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      });
    } else if (val !== 'All') {
      requestAnimationFrame(() => {
        document.getElementById('roles-roster')?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      });
    }
  };

  const totalDisplayedCount =
    (showOwnerSection ? 1 : 0) + filteredRoleHolders.length;
  const totalAllCount = 1 + sortedRoleHolders.length;

  return (
    <div className="min-h-screen bg-[#070507] text-[#F5EFE6] flex flex-col relative overflow-x-hidden">
        {/* Static GPU-Cached Faded Website Emblem Background (Zero Scroll Repaint) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden [contain:strict] [transform:translateZ(0)]"
        >
          <img
            src="/assets/aistudio/thumbs/tno_emblem_bg.webp"
            alt=""
            referrerPolicy="no-referrer"
            decoding="async"
            className="w-[min(92vw,720px)] h-[min(92vw,720px)] object-contain opacity-[0.24] saturate-[0.9] select-none"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,5,7,0.72)_54%,#070507_72%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_66%_52%_at_50%_-15%,rgba(239,68,68,0.16),rgba(212,175,55,0.07)_55%,transparent_100%)]" />
        </div>

        {/* Top Bar Contract: 3 zones separated by gap-4/6 */}
        <header className="sticky top-0 z-40 bg-[#070507] border-b border-[#24181A]">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-5 h-14 flex items-center justify-between gap-2 sm:gap-5">
            <button
              type="button"
              onClick={() => switchSection('roster', true)}
              className="font-display text-sm sm:text-base font-bold tracking-wider tno-gold-shimmer whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {familyInfo.name}
            </button>

            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-1 p-1 bg-[#100B0E] border border-[#24181A] rounded-lg"
            >
              {SECTION_IDS.map((tabId) => {
                const isActive = activeSection === tabId;
                const label = t.nav[tabId];
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => switchSection(tabId)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-[#FFF6D6] font-semibold'
                        : 'text-[#CEC2BA] hover:text-[#FCD34D]'
                    }`}
                  >
                    {tabId === 'roster' && <Users size={13} aria-hidden="true" />}
                    {tabId === 'quota' && <Megaphone size={13} aria-hidden="true" />}
                    {tabId === 'rules' && <BookOpen size={13} aria-hidden="true" />}
                    {tabId === 'panel' && <Radio size={13} aria-hidden="true" />}
                    {tabId === 'violations' && (
                      <AlertTriangle size={13} aria-hidden="true" />
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Language Switcher: strictly English & Tagalog */}
              <div ref={langContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#140D11] border border-[#322124] hover:border-[#D4AF37]/60 text-[11px] sm:text-xs font-medium text-[#E5DBD2] hover:text-[#FCD34D] active:scale-95 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  aria-haspopup="menu"
                  aria-expanded={isLangOpen}
                  aria-label={t.nav.languageLabel}
                  title={t.nav.languageLabel}
                >
                  <Globe size={14} className="text-[#FCD34D]" aria-hidden="true" />
                  <span className="sm:hidden">{language === 'en' ? 'EN' : 'TL'}</span>
                  <span className="hidden sm:inline">
                    {language === 'en' ? 'English' : 'Tagalog'}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-[#B8A9A3] transition-transform duration-150 ${
                      isLangOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isLangOpen && (
                  <div
                    role="menu"
                    aria-label={t.nav.languageLabel}
                    className="absolute right-0 mt-2 w-36 bg-[#120C10] border border-[#3B2527] rounded-xl overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,0,0,0.92)] z-50 p-1"
                  >
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === 'en'}
                      onClick={() => {
                        setLanguage('en');
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        language === 'en'
                          ? 'bg-[#DC2626]/20 text-[#FCD34D]'
                          : 'text-[#E5DBD2] hover:bg-[#1B1216]'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && (
                        <Check size={13} className="text-[#FCD34D]" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === 'tl'}
                      onClick={() => {
                        setLanguage('tl');
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        language === 'tl'
                          ? 'bg-[#DC2626]/20 text-[#FCD34D]'
                          : 'text-[#E5DBD2] hover:bg-[#1B1216]'
                      }`}
                    >
                      <span>Tagalog</span>
                      {language === 'tl' && (
                        <Check size={13} className="text-[#FCD34D]" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsDevModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#140D11] border border-[#D4AF37]/40 text-[11px] sm:text-xs font-medium text-[#FCD34D] hover:border-[#FCD34D] hover:bg-[#1D1216] active:scale-95 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label="Website Developer — Zenji"
                title="Developer: Zenji"
              >
                <Code2 size={14} aria-hidden="true" />
                <span>{t.nav.developer}</span>
              </button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="h-[1.5px] w-full bg-gradient-to-r from-[#DC2626]/70 via-[#FCD34D]/80 to-[#DC2626]/70"
          />
        </header>

        <main className="flex-1 relative z-10">
          {/* Top Section Switcher (Mobile/Tablet) + Search + Role Filter Bar */}
          <section
            aria-label="Section navigation, search, and role filters"
            className="border-b border-[#1E1416] bg-[#0B0709]/92"
          >
            <div className="max-w-[1040px] mx-auto px-5 py-4 space-y-3">
              {/* Mobile/Tablet Section Navigation Strip */}
              <div
                className="flex lg:hidden items-center gap-1 p-1 bg-[#100B0E] border border-[#24181A] rounded-lg overflow-x-auto no-scrollbar max-w-full"
                role="tablist"
                aria-label="Navigate sections"
              >
                {SECTION_IDS.map((tabId) => {
                  const isActive = activeSection === tabId;
                  const label = t.nav[tabId];
                  return (
                    <button
                      key={tabId}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => switchSection(tabId)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-[#FFF6D6] font-semibold'
                          : 'text-[#CEC2BA] hover:text-[#FCD34D]'
                      }`}
                    >
                      {tabId === 'roster' && <Users size={12} aria-hidden="true" />}
                      {tabId === 'quota' && <Megaphone size={12} aria-hidden="true" />}
                      {tabId === 'rules' && <BookOpen size={12} aria-hidden="true" />}
                      {tabId === 'panel' && <Radio size={12} aria-hidden="true" />}
                      {tabId === 'violations' && (
                        <AlertTriangle size={12} aria-hidden="true" />
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div ref={searchContainerRef} className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FCD34D]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder={t.search.placeholder}
                  aria-label={t.search.placeholder}
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#100B0E] border border-[#322124] rounded-xl text-[#F5EFE6] placeholder-[#8E7D78] focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_22px_-6px_rgba(212,175,55,0.42)] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E7D78] hover:text-[#F5EFE6] cursor-pointer"
                    aria-label={t.search.clearLabel}
                  >
                    <X size={14} />
                  </button>
                )}

                {isSearchOpen && (
                  <div className="absolute left-0 right-0 mt-2 z-30 bg-[#120C10] border border-[#3B2527] rounded-xl overflow-hidden shadow-[0_20px_44px_-10px_rgba(0,0,0,0.92)] tno-modal-backdrop">
                    {quickJumpMatches.length > 0 ? (
                      <ul className="divide-y divide-[#221719] max-h-72 overflow-y-auto">
                        {quickJumpMatches.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() =>
                                jumpToTarget(
                                  item.section,
                                  item.targetElementId,
                                  item.filterRole
                                )
                              }
                              className="w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-[#1B1216] transition-colors cursor-pointer group/jump"
                            >
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-[#F5EFE6] group-hover/jump:text-[#FCD34D] transition-colors truncate">
                                  {item.label}
                                </p>
                                <p className="text-[11px] text-[#B8A9A3] truncate">
                                  {item.sublabel}
                                </p>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#FCD34D] whitespace-nowrap shrink-0">
                                {t.search.openAction}
                                <ArrowUpRight
                                  size={12}
                                  className="transition-transform duration-150 group-hover/jump:translate-x-0.5 group-hover/jump:-translate-y-0.5"
                                  aria-hidden="true"
                                />
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-4 text-xs text-[#8E7D78] text-center">
                        {t.search.noMatches}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Clickable Role Tabs + Count (only shown in Owner & Roles view) */}
              {activeSection === 'roster' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div
                    className="flex items-center gap-1 p-1 bg-[#100B0E] border border-[#24181A] rounded-lg overflow-x-auto no-scrollbar max-w-full"
                    role="tablist"
                    aria-label="Filter by role"
                  >
                    {ROLE_FILTER_VALUES.map((val) => {
                      const isActive = roleFilter === val;
                      const label = val === 'All' ? t.roster.allLabel : t.roleLabels[val];
                      return (
                        <button
                          key={val}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => handleTopFilterClick(val)}
                          className={`px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white font-semibold'
                              : 'text-[#B8A9A3] hover:text-[#F5EFE6]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#CEC2BA] tabular-nums">
                      <Eye size={13} className="text-[#EF4444]" aria-hidden="true" />
                      <span>{t.footer.visitsLabel}:</span>
                      <strong className="font-mono font-semibold text-[#FCD34D]">
                        {visitCount !== null
                          ? visitCount.toLocaleString()
                          : t.footer.visitsLoading}
                      </strong>
                    </span>
                    <span className="text-[#342124]" aria-hidden="true">
                      |
                    </span>
                    <p className="text-xs text-[#B8A9A3] tabular-nums">
                      {t.roster.showingCount(totalDisplayedCount, totalAllCount)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {activeSection === 'roster' && (
            <div key="section-roster" className="tno-panel-enter">
              {/* Section 1: Family Owner at the Top */}
              {showOwnerSection && (
                <section id="owner">
                  <div className="max-w-[1040px] mx-auto px-5 py-10 lg:py-12 space-y-7">
                    <div className="space-y-2.5 max-w-2xl">
                      <p className="text-xs font-semibold tracking-wider text-[#EF4444]">
                        {t.roster.kicker} <span aria-hidden="true">·</span> {familyInfo.region}
                      </p>
                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight tno-gold-shimmer text-balance">
                        {familyInfo.headline}
                      </h1>
                      <p className="text-sm sm:text-[15px] text-[#CEC2BA] leading-relaxed">
                        {t.roster.description}
                      </p>
                    </div>

                {/* Signature GPU-Composited Rotating Gold & Crimson Frame for Owner */}
                <div
                  id="owner-card"
                  onClick={() => setSelectedMember(OWNER_MEMBER)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMember(OWNER_MEMBER);
                    }
                  }}
                  className={`group tno-owner-border-wrap cursor-pointer hover:-translate-y-1 active:scale-[0.992] transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                    highlightedId === 'owner-card' ? 'tno-target-flash' : ''
                  }`}
                >
                  <div className="tno-sheen-surface tno-owner-inner-bg relative z-10 rounded-[13px] overflow-hidden">
                    {/* Animated top gold-crimson light sweep */}
                    <div
                      aria-hidden="true"
                      className="relative h-[2px] w-full bg-[#24181A] overflow-hidden"
                    >
                      <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#FCD34D] to-[#EF4444] animate-shimmer-line" />
                    </div>

                    {/* Subtle Imperial Gold Corner Accents */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-[#D4AF37]/55 group-hover:border-[#FCD34D] transition-colors rounded-tl-[2px]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-[#D4AF37]/55 group-hover:border-[#FCD34D] transition-colors rounded-tr-[2px]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-[#EF4444]/45 group-hover:border-[#EF4444] transition-colors rounded-bl-[2px]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-[#EF4444]/45 group-hover:border-[#EF4444] transition-colors rounded-br-[2px]"
                    />

                    <div className="p-5 sm:p-7 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                        {/* Counter-rotating GPU portrait ring + halo */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEnlargedImage(memberToLightbox(OWNER_MEMBER, language));
                          }}
                          className="group/pic relative shrink-0 self-start sm:self-center rounded-xl cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                          aria-label={OWNER_MEMBER.name}
                          title={t.modals.clickToEnlarge}
                        >
                          <div className="relative p-[2px] rounded-xl tno-portrait-ring">
                            <div className="relative z-10 rounded-[10px] overflow-hidden bg-[#070507]">
                              <MemberAvatar
                                src={OWNER_MEMBER.avatarUrl}
                                name={OWNER_MEMBER.name}
                                eager
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-[10px] group-hover/pic:scale-[1.06] transition-transform duration-200"
                              />
                              <span className="absolute inset-0 bg-black/45 opacity-0 group-hover/pic:opacity-100 transition-opacity flex items-center justify-center text-[#FCD34D]">
                                <ZoomIn size={20} aria-hidden="true" />
                              </span>
                            </div>
                          </div>
                        </button>

                        <div className="min-w-0 flex-1 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#FCD34D]">
                              <Crown
                                size={14}
                                className="text-[#EF4444]"
                                aria-hidden="true"
                              />
                              <span>{t.roleLabels[OWNER_MEMBER.role]}</span>
                            </span>

                            {OWNER_MEMBER.bigoId && (
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleCopyId(
                                    e,
                                    OWNER_MEMBER.id,
                                    OWNER_MEMBER.bigoId!
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#160D11] border border-[#D4AF37]/35 hover:border-[#FCD34D]/75 text-[11px] tracking-wide transition-colors cursor-pointer"
                                title={t.roster.copyTitle}
                              >
                                <span className="text-[#B8A9A3] font-medium">
                                  {t.roster.bigoIdLabel}
                                </span>
                                <span className="font-mono font-semibold text-[#FCD34D]">
                                  {copiedMemberId === OWNER_MEMBER.id
                                    ? t.roster.copiedLabel
                                    : OWNER_MEMBER.bigoId}
                                </span>
                                {copiedMemberId === OWNER_MEMBER.id ? (
                                  <Check
                                    size={11}
                                    className="text-[#34D399]"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Copy
                                    size={11}
                                    className="text-[#B8A9A3]"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            )}
                          </div>

                          <div>
                            <h2 className="text-2xl sm:text-[1.85rem] font-extrabold tracking-wide tno-gold-shimmer">
                              {OWNER_MEMBER.name}
                            </h2>
                            <p className="text-xs font-semibold text-[#EF4444] mt-0.5">
                              {t.memberText[OWNER_MEMBER.id]?.specialty ?? OWNER_MEMBER.specialty}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                            <p className="text-xs sm:text-sm text-[#CEC2BA] leading-relaxed">
                              {t.memberText[OWNER_MEMBER.id]?.bio ?? OWNER_MEMBER.bio}
                            </p>

                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#FCD34D] opacity-85 group-hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
                              {t.roster.viewProfile}
                              <ArrowUpRight
                                size={13}
                                className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="tno-section-divider" />
            </section>
          )}

          {/* Section 2: Leadership, Staff & Bigo Hosts */}
          {roleFilter !== 'Owner' && (
            <section id="roles-roster">
              <div className="max-w-[1040px] mx-auto px-5 py-10 lg:py-12 space-y-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold tracking-wider text-[#EF4444]">
                    {t.roster.leadershipEyebrow}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5EFE6]">
                    {t.roster.rolesHeading}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#B8A9A3]">
                    {t.roster.rolesSubheading}
                  </p>
                </div>

                {filteredRoleHolders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredRoleHolders.map((member) => {
                      const locSpecialty =
                        t.memberText[member.id]?.specialty ?? member.specialty;
                      const locBio = t.memberText[member.id]?.bio ?? member.bio;
                      const isLeader =
                        member.role === 'Head Founder' ||
                        member.role === 'Founder' ||
                        member.role === 'Manager' ||
                        member.role === 'Head Admin' ||
                        member.role === 'Admin';
                      const cardDomId = `card-${member.id}`;
                      return (
                        <div
                          id={cardDomId}
                          key={member.id}
                          onClick={() => setSelectedMember(member)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedMember(member);
                            }
                          }}
                          className={`group tno-role-border-wrap cursor-pointer hover:-translate-y-1 active:scale-[0.988] transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                            highlightedId === cardDomId ? 'tno-target-flash' : ''
                          }`}
                        >
                          <div className="tno-sheen-surface relative z-10 h-full bg-[#0F0A0D] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between gap-4">
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#D4AF37]/45 group-hover:border-[#FCD34D] transition-colors rounded-tl-[2px]"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#D4AF37]/45 group-hover:border-[#FCD34D] transition-colors rounded-tr-[2px]"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#EF4444]/40 group-hover:border-[#EF4444] transition-colors rounded-bl-[2px]"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#EF4444]/40 group-hover:border-[#EF4444] transition-colors rounded-br-[2px]"
                            />
                            <div className="flex items-start gap-4 relative z-10">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEnlargedImage(memberToLightbox(member, language));
                                }}
                                className="group/pic relative shrink-0 rounded-xl p-[1.5px] bg-gradient-to-br from-[#D4AF37]/55 via-[#EF4444]/40 to-[#382527] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                                aria-label={member.name}
                                title={t.modals.clickToEnlarge}
                              >
                                <div className="relative rounded-[10px] overflow-hidden bg-[#070507]">
                                  <MemberAvatar
                                    src={member.avatarUrl}
                                    name={member.name}
                                    className="w-[70px] h-[70px] rounded-[10px] group-hover/pic:scale-[1.07] transition-transform duration-200"
                                  />
                                  <span className="absolute inset-0 bg-black/45 opacity-0 group-hover/pic:opacity-100 transition-opacity flex items-center justify-center text-[#FCD34D]">
                                    <ZoomIn size={16} aria-hidden="true" />
                                  </span>
                                </div>
                              </button>

                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-semibold">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {member.role === 'Editor' ? (
                                      <Palette
                                        size={12}
                                        className="text-[#FCD34D] shrink-0"
                                        aria-hidden="true"
                                      />
                                    ) : isLeader ? (
                                      <ShieldCheck
                                        size={12}
                                        className="text-[#EF4444] shrink-0"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <Sparkles
                                        size={12}
                                        className="text-[#FCD34D] shrink-0"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <span
                                      className={
                                        isLeader || member.role === 'Editor'
                                          ? 'text-[#FCD34D]'
                                          : 'text-[#EF4444]'
                                      }
                                    >
                                      {t.roleLabels[member.role]}
                                    </span>
                                  </div>

                                  {member.bigoId && (
                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handleCopyId(e, member.id, member.bigoId!)
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#160D11] border border-[#D4AF37]/30 hover:border-[#FCD34D]/75 text-[10px] tracking-wide transition-colors cursor-pointer shrink-0"
                                      title={t.roster.copyTitle}
                                    >
                                      <span className="text-[#B8A9A3] font-medium">
                                        {t.roster.bigoIdLabel}
                                      </span>
                                      <span className="font-mono font-semibold text-[#FCD34D]">
                                        {copiedMemberId === member.id
                                          ? t.roster.copiedLabel
                                          : member.bigoId}
                                      </span>
                                      {copiedMemberId === member.id ? (
                                        <Check
                                          size={10}
                                          className="text-[#34D399]"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <Copy
                                          size={10}
                                          className="text-[#B8A9A3]"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </button>
                                  )}
                                </div>
                                <h3 className="text-lg font-bold text-[#F5EFE6] tracking-tight truncate group-hover:text-[#FCD34D] transition-colors">
                                  {member.name}
                                </h3>
                                <p className="text-xs text-[#9C8B85] truncate">
                                  {locSpecialty}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs sm:text-[13px] text-[#CEC2BA] leading-relaxed line-clamp-2 relative z-10">
                              {locBio}
                            </p>

                            <div className="pt-2.5 border-t border-[#24181A] flex items-center justify-between gap-2 text-[11px] text-[#8E7D78] relative z-10">
                              <span className="truncate">{t.roleLabels[member.role]}</span>
                              <span className="inline-flex items-center gap-1 text-[#E5DBD2] group-hover:text-[#FCD34D] transition-colors whitespace-nowrap shrink-0">
                                {t.roster.viewDetails}
                                <ArrowUpRight
                                  size={12}
                                  className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 px-5 text-center bg-[#100B0E] border border-[#261A1C] rounded-xl space-y-2.5">
                    <p className="text-sm font-medium text-[#F5EFE6]">
                      {t.roster.noRoleHolders}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRoleFilter('All');
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-1.5 text-xs font-medium bg-[#1C1216] text-[#F5EFE6] rounded-lg hover:bg-[#281A1F] transition-colors cursor-pointer"
                    >
                      {t.roster.showAllRoles}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
            </div>
          )}

          {activeSection === 'quota' && (
            <section
              key="section-quota"
              id="quota-policy"
              className="tno-panel-enter"
            >
                <div className="max-w-[1040px] mx-auto px-5 py-10 lg:py-12 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#EF4444]">
                        <Megaphone size={13} aria-hidden="true" />
                        <span>{t.quota.eyebrow}</span>
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight tno-gold-shimmer">
                        {t.quota.heading}
                      </h1>
                      <p className="text-xs sm:text-sm text-[#CEC2BA] leading-relaxed">
                        {t.quota.intro}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setEnlargedImage({
                          src: QUOTA_POSTER_URL,
                          title: t.quota.posterTitle,
                          subtitle: t.quota.posterSubtitle,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FCD34D] bg-[#120C10] border border-[#D4AF37]/35 rounded-lg hover:border-[#FCD34D]/80 active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <ImageIcon size={13} aria-hidden="true" />
                      {t.quota.viewPoster}
                    </button>
                  </div>

                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${
                      highlightedId === 'quota-policy' ? 'tno-target-flash rounded-xl' : ''
                    }`}
                  >
                    <div className="lg:col-span-7 tno-role-border-wrap hover:-translate-y-0.5 transition-transform duration-200">
                      <div className="tno-sheen-surface relative z-10 h-full bg-[#0F0A0D] rounded-[12px] p-5 sm:p-6 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#FCD34D] relative z-10">
                          {t.quota.requirementsTitle}
                        </p>
                        <ul className="space-y-3.5 relative z-10">
                          {t.quota.points.map((point, idx) => (
                            <li
                              key={point}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#E5DBD2] leading-relaxed"
                            >
                              <span className="font-mono text-xs font-bold text-[#EF4444] tabular-nums pt-0.5 shrink-0">
                                0{idx + 1}.
                              </span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:col-span-5 tno-role-border-wrap hover:-translate-y-0.5 transition-transform duration-200">
                      <div className="tno-sheen-surface relative z-10 h-full bg-[#0F0A0D] rounded-[12px] p-5 sm:p-6 flex flex-col justify-between gap-4">
                        <div className="space-y-3 relative z-10">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#EF4444]">
                            {t.quota.reminderTitle}
                          </p>
                          <div className="space-y-2.5 text-xs sm:text-[13px] text-[#CEC2BA] leading-relaxed">
                            {t.quota.reminders.map((note) => (
                              <p key={note}>{note}</p>
                            ))}
                          </div>
                        </div>
                        <p className="pt-3 border-t border-[#24181A] text-[11px] font-semibold text-[#FCD34D] relative z-10">
                          {t.quota.footerNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'rules' && (
              <section
                key="section-rules"
                id="official-rules"
                className="py-10 lg:py-12 tno-panel-enter"
              >
                <div className="max-w-[1040px] mx-auto px-5 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#FCD34D]">
                        <BookOpen size={13} aria-hidden="true" />
                        <span>{t.rules.eyebrow}</span>
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight tno-gold-shimmer">
                        {t.rules.heading}
                      </h1>
                      <p className="text-xs sm:text-sm text-[#CEC2BA]">
                        {t.rules.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => switchSection('panel')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#E5DBD2] bg-[#140D11] border border-[#342124] rounded-lg hover:border-[#D4AF37]/60 hover:text-[#FCD34D] active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Radio size={13} aria-hidden="true" />
                        {t.rules.viewPanelRules}
                      </button>

                      <button
                        type="button"
                        onClick={() => switchSection('violations')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#EF4444] bg-[#140B0E] border border-[#EF4444]/35 rounded-lg hover:border-[#EF4444]/80 hover:bg-[#1C0F13] active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <AlertTriangle size={13} aria-hidden="true" />
                        {t.rules.viewViolations}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEnlargedImage({
                            src: RULES_POSTER_URL,
                            title: t.rules.posterTitle,
                            subtitle: t.rules.posterSubtitle,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FCD34D] bg-[#120C10] border border-[#D4AF37]/35 rounded-lg hover:border-[#FCD34D]/80 active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <ImageIcon size={13} aria-hidden="true" />
                        {t.rules.viewPoster}
                      </button>
                    </div>
                  </div>

                  {/* 01 - 07 Official Rules */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.rules.items.map((rule) => {
                      const ruleDomId = `rule-${rule.number}`;
                      return (
                        <div
                          key={rule.number}
                          id={ruleDomId}
                          className={`tno-role-border-wrap hover:-translate-y-0.5 transition-transform duration-200 ${
                            highlightedId === ruleDomId ? 'tno-target-flash' : ''
                          }`}
                        >
                          <div className="tno-sheen-surface relative z-10 h-full bg-[#0F0A0D] rounded-[12px] p-4 sm:p-5 space-y-2.5">
                            <div className="flex items-baseline gap-2.5 relative z-10">
                              <span className="font-mono text-xs font-bold text-[#EF4444] tabular-nums shrink-0">
                                {rule.number}
                              </span>
                              <h2 className="text-sm sm:text-[15px] font-bold text-[#FCD34D] tracking-tight">
                                {rule.title}
                              </h2>
                            </div>
                            <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#CEC2BA] leading-relaxed relative z-10">
                              {rule.points.map((pt) => (
                                <li key={pt} className="flex items-start gap-2">
                                  <span
                                    aria-hidden="true"
                                    className="text-[#EF4444] mt-0.5 shrink-0"
                                  >
                                    ·
                                  </span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'panel' && (
              <section
                key="section-panel"
                id="panel-rules"
                className="py-10 lg:py-12 tno-panel-enter"
              >
                <div className="max-w-[1040px] mx-auto px-5 space-y-7">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#EF4444]">
                        <Radio size={13} aria-hidden="true" />
                        <span>{t.panelRules.eyebrow}</span>
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight tno-gold-shimmer">
                        {t.panelRules.heading}
                      </h1>
                      <p className="text-xs sm:text-sm text-[#CEC2BA] leading-relaxed">
                        {t.panelRules.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => switchSection('rules')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#E5DBD2] bg-[#140D11] border border-[#342124] rounded-lg hover:border-[#D4AF37]/60 hover:text-[#FCD34D] active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <BookOpen size={13} aria-hidden="true" />
                        {t.panelRules.ctaRules}
                      </button>

                      <button
                        type="button"
                        onClick={() => switchSection('violations')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#EF4444] bg-[#140B0E] border border-[#EF4444]/35 rounded-lg hover:border-[#EF4444]/80 hover:bg-[#1C0F13] active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <AlertTriangle size={13} aria-hidden="true" />
                        {t.panelRules.ctaViolations}
                      </button>
                    </div>
                  </div>

                  {/* Highlight Notice */}
                  <div
                    className={`tno-owner-border-wrap ${
                      highlightedId === 'panel-rules' ? 'tno-target-flash' : ''
                    }`}
                  >
                    <div className="tno-owner-inner-bg relative z-10 rounded-[13px] p-5 sm:p-6 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#1A1013] border border-[#EF4444]/40 flex items-center justify-center shrink-0">
                        <ShieldAlert
                          size={19}
                          className="text-[#EF4444]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-[#FCD34D] uppercase tracking-wider">
                          {t.panelRules.noticeTitle}
                        </p>
                        <p className="text-xs sm:text-sm text-[#CEC2BA] leading-relaxed">
                          {t.panelRules.noticeBody}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 01 - 05 Panel Rules */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.panelRules.items.map((item, idx) => {
                      const panelRuleDomId = `panel-rule-${item.number}`;
                      const PanelIcon =
                        idx === 0
                          ? MicOff
                          : idx === 1
                          ? Ban
                          : idx === 2
                          ? UserX
                          : idx === 3
                          ? ShieldAlert
                          : MessageSquareWarning;
                      return (
                        <div
                          key={item.number}
                          id={panelRuleDomId}
                          className={`tno-role-border-wrap hover:-translate-y-0.5 transition-transform duration-200 ${
                            idx === t.panelRules.items.length - 1 ? 'md:col-span-2' : ''
                          } ${highlightedId === panelRuleDomId ? 'tno-target-flash' : ''}`}
                        >
                          <div className="tno-sheen-surface relative z-10 h-full bg-[#0F0A0D] rounded-[12px] p-4 sm:p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#1A1013] border border-[#342124] flex items-center justify-center shrink-0 relative z-10">
                              <PanelIcon
                                size={18}
                                className="text-[#EF4444]"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="space-y-1.5 relative z-10 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono text-xs font-bold text-[#EF4444] tabular-nums shrink-0">
                                  {item.number}
                                </span>
                                <h2 className="text-sm sm:text-[15px] font-bold text-[#FCD34D] tracking-tight">
                                  {item.title}
                                </h2>
                              </div>
                              <p className="text-xs sm:text-[13px] text-[#CEC2BA] leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'violations' && (
              <section
                key="section-violations"
                id="violations-policy"
                className="py-10 lg:py-12 tno-panel-enter"
              >
                <div className="max-w-[1040px] mx-auto px-5 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#EF4444]">
                        <AlertTriangle size={13} aria-hidden="true" />
                        <span>{t.violations.eyebrow}</span>
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight tno-gold-shimmer">
                        {t.violations.heading}
                      </h1>
                      <p className="text-xs sm:text-sm text-[#CEC2BA] leading-relaxed">
                        {t.violations.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => switchSection('rules')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#E5DBD2] bg-[#140D11] border border-[#342124] rounded-lg hover:border-[#D4AF37]/60 hover:text-[#FCD34D] active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <BookOpen size={13} aria-hidden="true" />
                        {t.violations.readRules}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEnlargedImage({
                            src: RULES_POSTER_URL,
                            title: t.violations.posterTitle,
                            subtitle: t.violations.posterSubtitle,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FCD34D] bg-[#120C10] border border-[#D4AF37]/35 rounded-lg hover:border-[#FCD34D]/80 active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <ImageIcon size={13} aria-hidden="true" />
                        {t.violations.viewPoster}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${
                      highlightedId === 'violations-policy'
                        ? 'tno-target-flash rounded-xl'
                        : ''
                    }`}
                  >
                    {t.violations.tiers.map((tier) => (
                      <div
                        key={tier.offense}
                        className="tno-role-border-wrap hover:-translate-y-0.5 transition-transform duration-200"
                      >
                        <div className="tno-sheen-surface relative z-10 h-full bg-[#0F0A0D] rounded-[12px] p-5 flex items-center gap-4">
                          <div className="w-11 h-11 rounded-lg bg-[#1A1013] border border-[#342124] flex items-center justify-center shrink-0 relative z-10">
                            {tier.tone === 'warning' ? (
                              <AlertTriangle
                                size={19}
                                className="text-[#FCD34D]"
                                aria-hidden="true"
                              />
                            ) : tier.tone === 'suspension' ? (
                              <ShieldAlert
                                size={19}
                                className="text-[#FB923C]"
                                aria-hidden="true"
                              />
                            ) : (
                              <Ban
                                size={19}
                                className="text-[#EF4444]"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <div className="relative z-10">
                            <p className="text-xs font-medium text-[#8E7D78]">
                              {tier.offense}
                            </p>
                            <p
                              className={`text-base font-bold mt-0.5 ${
                                tier.tone === 'warning'
                                  ? 'text-[#FCD34D]'
                                  : tier.tone === 'suspension'
                                  ? 'text-[#FB923C]'
                                  : 'text-[#EF4444]'
                              }`}
                            >
                              {tier.penalty}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Reference to Core Family Values */}
                  <div className="tno-role-border-wrap">
                    <div className="tno-sheen-surface relative z-10 bg-[#0F0A0D] rounded-[12px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 relative z-10">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#FCD34D]">
                          {t.violations.calloutTitle}
                        </p>
                        <p className="text-xs sm:text-sm text-[#CEC2BA]">
                          {t.violations.calloutBody}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => switchSection('roster', true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FFF6D6] bg-[#DC2626] rounded-lg hover:bg-[#EF4444] active:scale-95 transition-colors duration-100 whitespace-nowrap shrink-0 cursor-pointer relative z-10"
                      >
                        {t.violations.contactLeadership}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
        </main>

        <footer className="relative z-10">
          <div aria-hidden="true" className="tno-section-divider" />
          <div className="max-w-[1040px] mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9C8B85]">
            <p>
              {familyInfo.name} <span aria-hidden="true">·</span> {familyInfo.region}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <p>{t.footer.tagline}</p>
              <span className="hidden sm:inline text-[#342124]" aria-hidden="true">
                |
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#CEC2BA] tabular-nums">
                <Eye size={13} className="text-[#EF4444]" aria-hidden="true" />
                <span>{t.footer.visitsLabel}:</span>
                <strong className="font-mono font-semibold text-[#FCD34D]">
                  {visitCount !== null
                    ? visitCount.toLocaleString()
                    : t.footer.visitsLoading}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FCD34D] hover:text-[#FFF6D6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.footer.backToTop}
              <ArrowUp size={13} aria-hidden="true" />
            </button>
          </div>
        </footer>

        <MemberModal
          member={selectedMember}
          language={language}
          onClose={() => setSelectedMember(null)}
          onEnlargePhoto={(member) => {
            setSelectedMember(null);
            setEnlargedImage(memberToLightbox(member, language));
          }}
        />

        <DeveloperModal
          isOpen={isDevModalOpen}
          language={language}
          onClose={() => setIsDevModalOpen(false)}
          onEnlargePhoto={(img) => {
            setIsDevModalOpen(false);
            setEnlargedImage(img);
          }}
        />

        <ImageLightbox image={enlargedImage} onClose={() => setEnlargedImage(null)} />
      </div>
  );
}
