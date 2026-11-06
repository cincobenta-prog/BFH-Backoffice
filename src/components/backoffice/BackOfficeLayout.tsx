import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  UserRole,
  GoldenRecordCase,
  BackOfficeTab
} from '../../lib/types/funeral';
import {
  LayoutGrid,
  Calendar,
  Truck,
  ScrollText,
  PenTool,
  Flame,
  HeartHandshake,
  Layers,
  FileText,
  CheckCircle2,
  Users,
  UserCheck,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Zap,
  Compass,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  Lock,
  ArrowLeft,
  Menu,
  X,
  PlusCircle,
  PhoneCall,
  Building2
} from 'lucide-react';

interface BackOfficeLayoutProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeCase: GoldenRecordCase;
  cases: GoldenRecordCase[];
  onSelectCase: (caseItem: GoldenRecordCase) => void;
  activeTab: BackOfficeTab;
  onChangeTab: (tab: BackOfficeTab) => void;
  onExitBackOffice: () => void;
  onOpenNewCase: () => void;
  onOpenNotifications?: () => void;
  notificationCount?: number;
  onOpenLiveryModal?: () => void;
  onOpenESignModal?: () => void;
  onOpenWoodlawnModal?: () => void;
  onOpenPartnerModal?: () => void;
  onOpenRemovalModal?: () => void;
  onOpenContractModal?: () => void;
  onOpenPrintAP47?: () => void;
  onAdvancePhase?: (caseId: string, nextPhase: any) => void;
  onOpenTwoWaySmsModal?: (requestId?: string) => void;
  onOpenTwilioGatewayModal?: () => void;
  onOpenDocuSignModal?: () => void;
  onOpenCloudModal?: () => void;
  onOpenAIModal?: () => void;
  onOpenPressModal?: () => void;
  onOpenWebcastModal?: () => void;
  onOpenStripeModal?: () => void;
  onOpenQuickBooks?: () => void;
  onOpenQuickBooksModal?: () => void;
  onOpenIntegrationsCenter?: () => void;
  onOpenSimulationModal?: () => void;
  onOpenFirstCallIntake?: () => void;
  onOpenDiscrepancyGuardrail?: () => void;
  onOpenDirectorDayOfServiceHUD?: () => void;
  onOpenFamilyProofApproval?: () => void;
  onOpenCheckPrinter?: () => void;
  onOpenGuidedTour?: () => void;
  onLockManagerSuite?: () => void;
  currentDirectorId?: string;
  onChangeDirectorId?: (id: string) => void;
  directorProfiles?: any[];
  partnerRequests?: any[];
  onOpenPreNeedModal?: () => void;
  onOpenInsuranceFundingModal?: () => void;
  onOpenSSA721Modal?: () => void;
  onOpenVAHonorsModal?: () => void;
  children?: ReactNode;
}

interface NavLink {
  label: string;
  icon: any;
  tab?: BackOfficeTab;
  action?: () => void;
  modal?: boolean;
}

export const BackOfficeLayout = ({
  currentRole,
  onChangeRole,
  activeCase,
  cases,
  onSelectCase,
  activeTab,
  onChangeTab,
  onExitBackOffice,
  onOpenNewCase,
  onOpenNotifications,
  notificationCount = 0,
  onOpenESignModal,
  onOpenWoodlawnModal,
  onOpenRemovalModal,
  onOpenContractModal,
  onOpenIntegrationsCenter,
  onOpenSimulationModal,
  onOpenFirstCallIntake,
  onOpenGuidedTour,
  onLockManagerSuite,
  children
}: BackOfficeLayoutProps) => {
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

  const roleLabels: Record<UserRole, string> = {
    manager: 'Managing Director & Admin',
    director: 'Licensed Funeral Director',
    staff: 'Field & Transport Staff',
    accounting: 'Accounting & Finance',
    family: 'Family Portal View'
  };

  const go = (link: NavLink) => {
    if (link.action) link.action();
    else if (link.tab) onChangeTab(link.tab);
    setDrawerOpen(false);
  };

  const navGroups: { title: string; links: NavLink[] }[] = [
    {
      title: 'Today',
      links: [
        { label: 'Active Cases', icon: LayoutGrid, tab: 'dashboard' },
        { label: 'Schedule', icon: Calendar, tab: 'calendar' }
      ]
    },
    {
      title: 'Case Work',
      links: [
        { label: 'Intake & Removal', icon: Truck, action: () => onOpenRemovalModal && onOpenRemovalModal(), modal: true },
        { label: 'Arrangements & AP-47', icon: ScrollText, action: () => onOpenContractModal && onOpenContractModal(), modal: true },
        { label: 'Legal Authorizations', icon: PenTool, action: () => onOpenESignModal && onOpenESignModal(), modal: true },
        { label: 'Permits & Dispatch', icon: Flame, action: () => onOpenWoodlawnModal && onOpenWoodlawnModal(), modal: true },
        { label: 'Finances & Aftercare', icon: HeartHandshake, tab: 'finances' },
        { label: '5-Phase Pipeline', icon: Layers, tab: 'pipeline' }
      ]
    },
    {
      title: 'Records',
      links: [
        { label: 'Golden Record', icon: FileText, tab: 'golden_record' },
        { label: 'Documents', icon: CheckCircle2, tab: 'documents' }
      ]
    },
    {
      title: 'People',
      links: [
        { label: 'Partners & Clergy', icon: Users, tab: 'partners' },
        { label: 'Staff Roster', icon: UserCheck, tab: 'manager' }
      ]
    },
    {
      title: 'Business',
      links: [
        { label: 'Billing & Insurance', icon: CreditCard, tab: 'finances' },
        { label: 'Pre-Need Vault', icon: ShieldCheck, tab: 'preneed' },
        { label: 'Aftercare & Nurture', icon: HeartHandshake, tab: 'aftercare' },
        { label: 'Reports', icon: BarChart3, tab: 'reports' }
      ]
    },
    {
      title: 'Admin',
      links: [
        { label: 'Integrations', icon: Zap, action: () => onOpenIntegrationsCenter && onOpenIntegrationsCenter(), modal: true },
        { label: 'Guided Tour', icon: Compass, action: () => onOpenGuidedTour && onOpenGuidedTour(), modal: true },
        { label: 'Lifecycle Simulator', icon: Sparkles, action: () => onOpenSimulationModal && onOpenSimulationModal(), modal: true }
      ]
    }
  ];

  const filteredCases = cases.filter((c) => {
    const q = caseQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.caseNumber.toLowerCase().includes(q) ||
      c.decedent.legalName.toLowerCase().includes(q) ||
      (c.assignedDirector || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col text-neutral-300 transition-transform duration-200 border-r border-[#d4af37]/25 shadow-[4px_0_30px_rgba(0,0,0,0.6)] print:hidden no-print ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:z-30 lg:w-[272px] lg:translate-x-0`}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.12), transparent 55%), radial-gradient(circle at bottom left, rgba(128, 0, 0, 0.2), transparent 60%), linear-gradient(180deg, #1d1918 0%, #111010 100%)'
        }}
        aria-label="Staff navigation"
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
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/ebfh/BENTA_logo.png';
                }}
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-serif-title text-[15px] font-bold leading-tight tracking-wide text-white drop-shadow-xs">
              Benta's Funeral Home
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300">
              <span>Est. 1928</span>
              <span className="text-amber-400/60 font-mono">✦</span>
              <span>Harlem, NYC</span>
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
                  const isActive = !!link.tab && activeTab === link.tab;
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

        {/* Sidebar Footer with Director Badge & Heritage Registration */}
        <div className="border-t border-amber-400/20 bg-black/25 p-3.5 backdrop-blur-xs">
          <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.04] p-2">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/60 bg-gradient-to-br from-[#800000] to-[#500000] text-[12px] font-black text-amber-200 shadow-sm">
              BFH
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-bold text-white">{roleLabels[currentRole]}</div>
              <div className="flex items-center gap-1 text-[10.5px] text-amber-300/80">
                <span className="font-mono text-[9px]">🏛</span>
                <span>NYS Reg #08850</span>
              </div>
            </div>
          </div>
          <button
            onClick={onExitBackOffice}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-white/[0.05] px-3 py-2 text-[12px] font-bold text-neutral-200 shadow-2xs transition-all duration-200 hover:border-amber-400/60 hover:bg-white/[0.12] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-amber-300" />
            Public Showroom &amp; Website
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden print:hidden no-print"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-h-screen flex-col lg:pl-[272px] print:pl-0 print:min-h-0 print:block">
        <header className="sticky top-0 z-30 border-b border-amber-400/20 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:px-6 print:hidden no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl border border-neutral-300 p-2 text-neutral-700 transition hover:border-[#800000] hover:text-[#800000] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={onOpenNewCase}
              className="btn-luxury-crimson flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold text-white shadow-md cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-amber-300 drop-shadow-xs" />
              <span className="hidden sm:inline tracking-wide">New Case</span>
            </button>

            {onOpenFirstCallIntake && (
              <button
                onClick={onOpenFirstCallIntake}
                className="btn-luxury-brass hidden shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold md:flex cursor-pointer"
              >
                <PhoneCall className="h-4 w-4 text-amber-700" />
                <span>Phone Intake</span>
              </button>
            )}

            <div className="relative min-w-0 flex-1">
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
                    <span>Working Case</span>
                  </span>
                  <span className="block truncate text-[13px] font-bold text-neutral-900 group-hover:text-[#800000] transition-colors">
                    <span className="text-[#800000] font-mono mr-1.5 font-bold">{activeCase.caseNumber}</span>
                    · {activeCase.decedent.legalName}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 group-hover:text-amber-500" />
              </button>

              {caseMenuOpen && (
                <div
                  className="absolute left-0 top-[calc(100%+8px)] z-40 w-[min(90vw,420px)] rounded-2xl border border-amber-400/30 bg-white p-2 shadow-2xl backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative mb-1 px-1 pt-1">
                    <Search className="pointer-events-none absolute left-3 top-[17px] h-4 w-4 text-amber-500" />
                    <input
                      value={caseQuery}
                      onChange={(e) => setCaseQuery(e.target.value)}
                      placeholder="Filter active cases..."
                      aria-label="Filter cases"
                      className="w-full rounded-xl border border-neutral-300 py-2 pl-9 pr-3 text-[13px] text-neutral-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none"
                    />
                  </div>
                  <div className="max-h-[280px] overflow-y-auto space-y-1 pt-1">
                    {filteredCases.length === 0 && (
                      <div className="px-3 py-6 text-center text-[13px] text-neutral-500">
                        No cases match "{caseQuery}"
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
                          className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all ${
                            selected
                              ? 'bg-gradient-to-r from-[#fdf0f0] to-[#fbf5eb] border border-amber-400/40 shadow-xs'
                              : 'hover:bg-neutral-50 border border-transparent'
                          }`}
                        >
                          <span className="shrink-0 rounded-lg border border-[#f3d4d4] bg-[#fdf0f0] px-2 py-1 text-[10.5px] font-bold text-[#800000] font-mono">
                            {c.caseNumber.replace('BFH-2026-', '#')}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-bold text-neutral-900">
                              {c.decedent.legalName}
                            </span>
                            <span className="block truncate text-[11px] text-neutral-500">
                              {c.assignedDirector} · {c.dispositionType.replace('_', ' ')}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenNotifications}
              className="relative shrink-0 rounded-xl border border-neutral-200/90 bg-white p-2.5 text-neutral-700 shadow-2xs transition-all duration-200 hover:border-amber-400/60 hover:text-[#800000] hover:shadow-xs group cursor-pointer"
              aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ''}`}
            >
              <Bell className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
              {notificationCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-[#800000] to-[#b00810] px-1 text-[10px] font-black text-white shadow-sm animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

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
                  JB
                </span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] z-40 w-[min(92vw,320px)] rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <div className="text-[13px] font-semibold text-neutral-900">Jason Benta</div>
                    <div className="text-[11px] text-neutral-500">{roleLabels[currentRole]}</div>
                  </div>
                  <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                    Switch role (demo)
                  </div>
                  {(['manager', 'director', 'staff', 'accounting', 'family'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setUserMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] transition ${
                        currentRole === r ? 'bg-[#fdf3f3] font-semibold text-[#800000]' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{roleLabels[r]}</span>
                      {r === 'manager' && <Lock className="h-3 w-3 text-amber-500" />}
                    </button>
                  ))}
                  {onLockManagerSuite && currentRole === 'manager' && (
                    <button
                      onClick={() => {
                        onLockManagerSuite();
                        setUserMenuOpen(false);
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-neutral-100 px-3 py-2 pt-2.5 text-left text-[13px] font-semibold text-[#800000] transition hover:bg-red-50"
                    >
                      <Lock className="h-4 w-4" />
                      Lock manager suite
                    </button>
                  )}
                  {(onOpenIntegrationsCenter || onOpenSimulationModal) && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onOpenIntegrationsCenter) onOpenIntegrationsCenter();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <Building2 className="h-4 w-4 text-neutral-400" />
                      Enterprise integrations
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="min-w-0 flex-1 print:block print:w-full">{children}</div>
      </div>
    </>
  );
};
