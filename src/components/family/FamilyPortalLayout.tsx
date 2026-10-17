import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import {
  Home,
  ScrollText,
  Sparkles,
  Video,
  Camera,
  Calendar,
  FileText,
  MessageCircle,
  Flower2,
  Compass,
  Menu,
  X,
  ChevronDown,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Search
} from 'lucide-react';

export type FamilyPortalTab =
  | 'home'
  | 'obituary'
  | 'tribute'
  | 'webcast'
  | 'concierge'
  | 'arrangements'
  | 'documents'
  | 'photos';

interface FamilyPortalLayoutProps {
  portalTab: FamilyPortalTab;
  onChangeTab: (tab: FamilyPortalTab) => void;
  activeCase: GoldenRecordCase;
  cases: GoldenRecordCase[];
  onSelectCase: (caseItem: GoldenRecordCase) => void;
  isStaffUser?: boolean;
  onExitPortal: () => void;
  onOpenGuidedTour?: () => void;
  onOpenFloralShop?: () => void;
  children?: ReactNode;
}

interface NavLink {
  label: string;
  icon: any;
  tab?: FamilyPortalTab;
  action?: () => void;
  modal?: boolean;
}

export const FamilyPortalLayout = ({
  portalTab,
  onChangeTab,
  activeCase,
  cases,
  onSelectCase,
  isStaffUser = false,
  onExitPortal,
  onOpenGuidedTour,
  onOpenFloralShop,
  children
}: FamilyPortalLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [caseQuery, setCaseQuery] = useState('');

  useEffect(() => {
    const close = () => {
      setCaseMenuOpen(false);
      setUserMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCaseMenuOpen(false);
        setUserMenuOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (link: NavLink) => {
    if (link.action) link.action();
    else if (link.tab) onChangeTab(link.tab);
    setDrawerOpen(false);
  };

  const navGroups: { title: string; links: NavLink[] }[] = [
    {
      title: 'Overview',
      links: [
        { label: 'Welcome & Overview', icon: Home, tab: 'home' },
        { label: 'Obituary & Story Studio', icon: ScrollText, tab: 'obituary' }
      ]
    },
    {
      title: 'Tribute & Media',
      links: [
        { label: '360° Digi-Tribute', icon: Sparkles, tab: 'tribute' },
        { label: 'Live Webcast', icon: Video, tab: 'webcast' },
        { label: 'Photos & Announcement', icon: Camera, tab: 'photos' }
      ]
    },
    {
      title: 'Arrangements',
      links: [
        { label: 'Arrangements & Schedule', icon: Calendar, tab: 'arrangements' },
        { label: 'Documents & eSign', icon: FileText, tab: 'documents' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Family Care Concierge', icon: MessageCircle, tab: 'concierge' },
        { label: 'Floral Tribute Shop', icon: Flower2, action: () => onOpenFloralShop && onOpenFloralShop(), modal: true },
        { label: 'Portal Tour', icon: Compass, action: () => onOpenGuidedTour && onOpenGuidedTour(), modal: true }
      ]
    }
  ];

  const filteredCases = cases.filter((c) => {
    const q = caseQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.caseNumber.toLowerCase().includes(q) ||
      c.decedent.legalName.toLowerCase().includes(q) ||
      (c.informant?.fullName || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-[#1c1a1a] text-neutral-300 transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:z-30 lg:w-[272px] lg:translate-x-0`}
        aria-label="Family portal navigation"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <img
            src="/images/ebfh/BENTA_logo.png"
            alt="Benta's Funeral Home"
            className="h-10 w-auto shrink-0 rounded-lg bg-white px-1.5 py-1 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/ebfh/Benta-Flame-MN.png';
            }}
          />
          <div className="min-w-0">
            <div className="font-serif-title text-[15px] font-semibold leading-tight text-white">
              The Family Portal
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300">
              {activeCase.caseNumber}
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                {group.title}
              </div>
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = !!link.tab && portalTab === link.tab;
                return (
                  <button
                    key={group.title + link.label}
                    onClick={() => go(link)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition ${
                      isActive
                        ? 'bg-[#800000] font-semibold text-white'
                        : 'text-neutral-400 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <span className="min-w-0 flex-1 truncate">{link.label}</span>
                    {link.modal && (
                      <span className="text-[10px] font-semibold text-neutral-600">tool</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3.5">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-[#800000] text-[13px] font-bold text-white">
              {isStaffUser ? 'BFH' : 'FP'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-white">
                {isStaffUser ? 'Licensed Staff Console' : 'Private Family Access'}
              </div>
              <div className="truncate text-[11px] text-neutral-500">
                {activeCase.informant?.fullName || 'Authorized informant'}
              </div>
            </div>
          </div>
          <button
            onClick={onExitPortal}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[12.5px] font-semibold text-neutral-200 transition hover:bg-white/[0.12]"
          >
            {isStaffUser ? <ArrowLeft className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isStaffUser ? 'Return to Director Back-Office' : 'Sign Out of Family Vault'}
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-screen flex-col bg-[#f3f4f6] lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 px-4 py-2.5 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg border border-neutral-300 p-2 text-neutral-700 transition hover:border-[#800000] hover:text-[#800000] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative min-w-0 flex-1">
              {isStaffUser ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(false);
                    setCaseMenuOpen(!caseMenuOpen);
                  }}
                  aria-haspopup="true"
                  aria-expanded={caseMenuOpen}
                  className="flex max-w-full items-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-left transition hover:border-[#800000]"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
                      Viewing family
                    </span>
                    <span className="block truncate text-[13px] font-semibold text-neutral-900">
                      {activeCase.caseNumber} · {activeCase.decedent.legalName}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
                </button>
              ) : (
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-3 py-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
                      Confirmed family access
                    </span>
                    <span className="block truncate text-[13px] font-semibold text-neutral-900">
                      {activeCase.caseNumber} · {activeCase.decedent.legalName}
                    </span>
                  </span>
                </div>
              )}

              {isStaffUser && caseMenuOpen && (
                <div
                  className="absolute left-0 top-[calc(100%+8px)] z-40 w-[min(90vw,420px)] rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative mb-1 px-1 pt-1">
                    <Search className="pointer-events-none absolute left-3 top-[17px] h-4 w-4 text-neutral-400" />
                    <input
                      value={caseQuery}
                      onChange={(e) => setCaseQuery(e.target.value)}
                      placeholder="Filter families"
                      aria-label="Filter families"
                      className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-[13px] text-neutral-900"
                    />
                  </div>
                  <div className="max-h-[280px] overflow-y-auto">
                    {filteredCases.length === 0 && (
                      <div className="px-3 py-6 text-center text-[13px] text-neutral-500">
                        No families match "{caseQuery}"
                      </div>
                    )}
                    {filteredCases.map((c) => {
                      const selected = c.id === activeCase.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCase(c);
                            setCaseMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
                            selected ? 'bg-[#fdf3f3]' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <span className="shrink-0 rounded-md border border-[#f3d4d4] bg-[#fdf0f0] px-1.5 py-0.5 text-[10px] font-bold text-[#800000]">
                            {c.caseNumber.replace('BFH-2026-', '#')}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-semibold text-neutral-900">
                              {c.decedent.legalName}
                            </span>
                            <span className="block truncate text-[11.5px] text-neutral-500">
                              Family of {c.informant?.fullName || '—'}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {onOpenGuidedTour && (
              <button
                onClick={onOpenGuidedTour}
                className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-[#E5D5AC] bg-[#FAF3E0] px-3.5 py-2 text-xs font-bold text-[#8C6B2D] transition hover:bg-[#F5EAD0] md:flex"
              >
                <Compass className="h-4 w-4" />
                Portal Tour
              </button>
            )}

            <div className="relative shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCaseMenuOpen(false);
                  setUserMenuOpen(!userMenuOpen);
                }}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white p-1.5 pr-2.5 transition hover:border-[#800000]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#800000] text-[11px] font-bold text-white">
                  {isStaffUser ? 'JB' : 'FP'}
                </span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] z-40 w-[min(92vw,320px)] rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <div className="text-[13px] font-semibold text-neutral-900">
                      {isStaffUser ? 'Jason Benta' : activeCase.informant?.fullName || 'Family member'}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {isStaffUser ? 'Licensed Funeral Director' : 'Authorized informant'}
                    </div>
                  </div>
                  {onOpenFloralShop && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenFloralShop();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <Flower2 className="h-4 w-4 text-neutral-400" />
                      Order floral tribute
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onExitPortal();
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-neutral-100 px-3 py-2 pt-2.5 text-left text-[13px] font-semibold text-[#800000] transition hover:bg-red-50"
                  >
                    {isStaffUser ? <ArrowLeft className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {isStaffUser ? 'Return to Director Back-Office' : 'Sign Out of Family Vault'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
};
