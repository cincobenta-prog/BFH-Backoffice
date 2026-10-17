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
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-[#1c1a1a] text-neutral-300 transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:z-30 lg:w-[272px] lg:translate-x-0`}
        aria-label="Staff navigation"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <img
            src="/images/ebfh/BENTA_logo.png"
            alt="Benta's Funeral Home"
            className="h-10 w-auto shrink-0 rounded-lg bg-white px-1.5 py-1 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/ebfh/Benta-Flame-MN.png';
            }}
          />
          <div className="min-w-0">
            <div className="font-serif-title text-[15px] font-semibold leading-tight text-white">
              Benta's Funeral Home
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300">
              Est. 1928 · Harlem, NYC
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
                const isActive = !!link.tab && activeTab === link.tab;
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
              BFH
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-white">{roleLabels[currentRole]}</div>
              <div className="text-[11px] text-neutral-500">Signed in · NYS Reg #08850</div>
            </div>
          </div>
          <button
            onClick={onExitBackOffice}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 text-[12.5px] font-semibold text-neutral-200 transition hover:bg-white/[0.12]"
          >
            <ArrowLeft className="h-4 w-4" />
            Public website
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

      <div className="flex min-h-screen flex-col lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 px-4 py-2.5 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg border border-neutral-300 p-2 text-neutral-700 transition hover:border-[#800000] hover:text-[#800000] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={onOpenNewCase}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#800000] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#680000]"
            >
              <PlusCircle className="h-4 w-4 text-amber-300" />
              <span className="hidden sm:inline">New case</span>
            </button>

            {onOpenFirstCallIntake && (
              <button
                onClick={onOpenFirstCallIntake}
                className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-[#E5D5AC] bg-[#FAF3E0] px-3.5 py-2 text-xs font-bold text-[#8C6B2D] transition hover:bg-[#F5EAD0] md:flex"
              >
                <PhoneCall className="h-4 w-4" />
                Phone intake
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
                className="flex max-w-full items-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-left transition hover:border-[#800000]"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
                    Working case
                  </span>
                  <span className="block truncate text-[13px] font-semibold text-neutral-900">
                    {activeCase.caseNumber} · {activeCase.decedent.legalName}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
              </button>

              {caseMenuOpen && (
                <div
                  className="absolute left-0 top-[calc(100%+8px)] z-40 w-[min(90vw,420px)] rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative mb-1 px-1 pt-1">
                    <Search className="pointer-events-none absolute left-3 top-[17px] h-4 w-4 text-neutral-400" />
                    <input
                      value={caseQuery}
                      onChange={(e) => setCaseQuery(e.target.value)}
                      placeholder="Filter cases"
                      aria-label="Filter cases"
                      className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-[13px] text-neutral-900"
                    />
                  </div>
                  <div className="max-h-[280px] overflow-y-auto">
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
              className="relative shrink-0 rounded-xl border border-neutral-300 bg-white p-2.5 text-neutral-700 transition hover:border-[#800000] hover:text-[#800000]"
              aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ''}`}
            >
              <Bell className="h-[18px] w-[18px]" />
              {notificationCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#800000] px-1 text-[10px] font-bold text-white">
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
                className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white p-1.5 pr-2.5 transition hover:border-[#800000]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#800000] text-[11px] font-bold text-white">
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

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
};
