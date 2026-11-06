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
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col text-neutral-300 transition-transform duration-200 border-r border-[#d4af37]/25 shadow-[4px_0_30px_rgba(0,0,0,0.6)] ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:z-30 lg:w-[272px] lg:translate-x-0`}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.12), transparent 55%), radial-gradient(circle at bottom left, rgba(128, 0, 0, 0.2), transparent 60%), linear-gradient(180deg, #1d1918 0%, #111010 100%)'
        }}
        aria-label="Family portal navigation"
      >
        {/* Brand Crest Header with Animated Flame Aura */}
        <div className="relative flex items-center gap-3 border-b border-amber-400/20 px-4 py-4 backdrop-blur-xs">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-500/30 via-red-600/25 to-amber-400/30 blur-xs flame-animated pointer-events-none" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/50 bg-gradient-to-b from-white to-neutral-100 p-1 shadow-[0_2px_10px_rgba(212,175,55,0.35)] transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/ebfh/Benta-Flame-MN.png"
                alt="Benta Eternal Flame"
                className="h-8 w-auto object-contain flame-animated"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/ebfh/BENTA_logo.png';
                }}
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-serif-title text-[15px] font-bold leading-tight tracking-wide text-white drop-shadow-xs">
              The Family Portal
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-300">
              <span>{activeCase.caseNumber}</span>
              <span className="text-amber-400/60 font-mono">✦</span>
              <span>Secure Vault</span>
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

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-1.5 px-3 pb-1.5 pt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-neutral-400">
                <span className="h-1 w-1 rounded-full bg-amber-400/70" />
                <span>{group.title}</span>
              </div>
              <div className="space-y-0.5">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = !!link.tab && portalTab === link.tab;
                  return (
                    <button
                      key={group.title + link.label}
                      onClick={() => go(link)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#800000] via-[#8c080e] to-[#6a0509] font-bold text-white border-l-[3px] border-amber-400 shadow-[0_3px_14px_rgba(128,0,0,0.5)] translate-x-0.5'
                          : 'text-neutral-400 font-medium hover:bg-white/[0.08] hover:text-white hover:translate-x-1'
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                          isActive ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]' : 'text-neutral-400 group-hover:text-amber-300'
                        }`}
                      />
                      <span className="min-w-0 flex-1 truncate">{link.label}</span>
                      {link.modal && (
                        <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                          tool
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Family Portal Footer with Vault Access Status */}
        <div className="border-t border-amber-400/20 bg-black/25 p-3.5 backdrop-blur-xs">
          <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.04] p-2">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/60 bg-gradient-to-br from-[#800000] to-[#500000] text-[12px] font-black text-amber-200 shadow-sm">
              {isStaffUser ? 'BFH' : 'FP'}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-bold text-white">
                {isStaffUser ? 'Licensed Staff Console' : 'Private Family Access'}
              </div>
              <div className="truncate text-[11px] text-amber-300/80">
                {activeCase.informant?.fullName || 'Authorized Informant'}
              </div>
            </div>
          </div>
          <button
            onClick={onExitPortal}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-white/[0.05] px-3 py-2 text-[12px] font-bold text-neutral-200 shadow-2xs transition-all duration-200 hover:border-amber-400/60 hover:bg-white/[0.12] hover:text-white cursor-pointer"
          >
            {isStaffUser ? <ArrowLeft className="h-3.5 w-3.5 text-amber-300" /> : <Lock className="h-3.5 w-3.5 text-amber-300" />}
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
        <header className="sticky top-0 z-30 border-b border-amber-400/20 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl border border-neutral-300 p-2 text-neutral-700 transition hover:border-[#800000] hover:text-[#800000] lg:hidden"
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
                  className="group flex max-w-full items-center gap-3 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-1.5 text-left shadow-2xs transition-all duration-200 hover:border-amber-500/60 hover:shadow-md hover:bg-neutral-50/50 cursor-pointer"
                >
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-400/40 bg-gradient-to-br from-[#800000] to-[#500000] text-[10.5px] font-black text-amber-100 shadow-xs">
                    {activeCase.decedent.legalName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                  </div>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-neutral-400">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Viewing Family Portal</span>
                    </span>
                    <span className="block truncate text-[13px] font-bold text-neutral-900 group-hover:text-[#800000] transition-colors">
                      <span className="text-[#800000] font-mono mr-1.5 font-bold">{activeCase.caseNumber}</span>
                      · {activeCase.decedent.legalName}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 group-hover:text-amber-500" />
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/40 px-3.5 py-1.5 shadow-2xs">
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-400/60 bg-emerald-600 text-[11px] font-black text-white shadow-xs">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Confirmed Private Family Access</span>
                    </span>
                    <span className="block truncate text-[13px] font-bold text-neutral-900">
                      <span className="text-[#800000] font-mono mr-1.5 font-bold">{activeCase.caseNumber}</span>
                      · {activeCase.decedent.legalName}
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
                className="btn-luxury-brass hidden shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold md:flex cursor-pointer"
              >
                <Compass className="h-4 w-4 text-amber-700 animate-spin-slow" />
                <span>Portal Tour</span>
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
                className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-gradient-to-b from-white to-neutral-50 p-1.5 pr-2.5 shadow-2xs transition-all duration-200 hover:border-amber-500/60 hover:shadow-xs cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/50 bg-gradient-to-br from-[#800000] to-[#500000] text-[11px] font-black text-amber-200 shadow-xs">
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
