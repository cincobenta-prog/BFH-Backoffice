import React from 'react';
import {
  UserRole,
  GoldenRecordCase,
  BackOfficeTab,
  CasePhase,
  DirectorProfile
} from '../../lib/types/funeral';
import {
  DollarSign,
  FileText,
  Layers,
  Flame,
  HeartHandshake,
  PlusCircle,
  Bell,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  BarChart3,
  Smartphone,
  Car,
  PenTool,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Truck,
  Users,
  LayoutDashboard,
  ScrollText,
  UserCheck,
  Lock,
  Printer,
  FileCheck,
  Landmark
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
  onAdvancePhase?: (caseId: string, nextPhase: CasePhase) => void;
  onOpenTwoWaySmsModal?: (requestId?: string) => void;
  onOpenDocuSignModal?: () => void;
  onOpenQuickBooksModal?: () => void;
  onOpenCheckPrinter?: () => void;
  currentDirectorId?: string;
  onChangeDirectorId?: (id: string) => void;
  directorProfiles?: DirectorProfile[];
}

export const BackOfficeLayout: React.FC<BackOfficeLayoutProps> = ({
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
  notificationCount = 5,
  onOpenLiveryModal,
  onOpenESignModal,
  onOpenWoodlawnModal,
  onOpenPartnerModal,
  onOpenRemovalModal,
  onOpenContractModal,
  onOpenPrintAP47,
  onAdvancePhase,
  onOpenTwoWaySmsModal,
  onOpenDocuSignModal,
  onOpenQuickBooksModal,
  onOpenCheckPrinter,
  currentDirectorId,
  onChangeDirectorId,
  directorProfiles
}) => {
  const roleBadges: Record<UserRole, { label: string; color: string; desc: string }> = {
    manager: {
      label: 'Managing Director & Administration',
      color: 'bg-purple-50 text-purple-900 border-purple-200',
      desc: 'Licensed Director scheduling, In-House vs Outsourced trade optimizer, 1099 disbursements'
    },
    director: {
      label: 'Funeral Director (Full Control)',
      color: 'bg-red-50 text-[#991b1b] border-red-200',
      desc: 'Full case authorization, Legal bundles, Woodlawn dispatch, EDRS'
    },
    staff: {
      label: 'Field / Transport Staff',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Physical removal, Safe Arrival triggers, custodial logging'
    },
    accounting: {
      label: 'Accounting & Finance',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'ACH Bank transfers, Life insurance claim verification, split billing'
    },
    family: {
      label: 'Family Portal (Next of Kin)',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      desc: 'Arrangement review, e-Signatures, 360° Digi-Tribute uploads'
    }
  };

  const navItems: Array<{ id: BackOfficeTab; label: string; icon: any }> = [
    { id: 'dashboard', label: 'Director Active Cases', icon: LayoutDashboard },
    { id: 'manager', label: 'Director Scheduling & Roster', icon: UserCheck },
    { id: 'pipeline', label: '5-Phase Case Pipeline', icon: Layers },
    { id: 'golden_record', label: 'Golden Record Hub', icon: FileText },
    { id: 'calendar', label: 'Facility & Room Calendar', icon: Calendar },
    { id: 'partners', label: 'Service Partners & SMS', icon: Users },
    { id: 'documents', label: 'Document Delivery Matrix', icon: CheckCircle2 },
    { id: 'dispatch', label: 'Woodlawn & Logistics Dispatch', icon: Flame },
    { id: 'finances', label: 'ACH & Insurance Financing', icon: DollarSign },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'aftercare', label: 'Aftercare & CRM Nurture', icon: HeartHandshake }
  ];

  const phaseOrder: CasePhase[] = ['intake_removal', 'arrangements', 'legal_bundle', 'permits_logistics', 'finalization_aftercare'];
  const currentPhaseIndex = phaseOrder.indexOf(activeCase.currentPhase);

  const PHASES_LIST: Array<{
    id: CasePhase;
    stepNum: number;
    label: string;
    subLabel: string;
    targetTab: BackOfficeTab;
    icon: any;
  }> = [
      { id: 'intake_removal', stepNum: 1, label: '1. Intake & Removal', subLabel: 'Physical Custody', targetTab: 'golden_record', icon: Truck },
      { id: 'arrangements', stepNum: 2, label: '2. Arrangements & Contract', subLabel: 'Form AP-47 & 12 Spaces', targetTab: 'golden_record', icon: ScrollText },
      { id: 'legal_bundle', stepNum: 3, label: '3. Legal Authorizations', subLabel: 'NOK e-Signatures', targetTab: 'documents', icon: PenTool },
      { id: 'permits_logistics', stepNum: 4, label: '4. Permits & Dispatch', subLabel: 'NYC EDRS & Woodlawn', targetTab: 'dispatch', icon: Flame },
      { id: 'finalization_aftercare', stepNum: 5, label: '5. Finances & Aftercare', subLabel: 'ACH / Ins & Nurture', targetTab: 'finances', icon: HeartHandshake }
    ];

  return (
    <div className="bg-white text-neutral-900 flex flex-col font-sans border-b border-neutral-200 shadow-sm">

      {/* Top Universal Back-Office Header: White & Crimson */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Brand & Active Case Identifier */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onExitBackOffice}
              className="flex items-center space-x-1.5 text-xs text-neutral-700 hover:text-[#991b1b] bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-300 font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <span className="font-serif-title font-bold text-[#991b1b] text-base tracking-wide">
                BFH Backoffice
              </span>
              <span className="text-[11px] bg-amber-100 text-[#b45309] px-2 py-0.5 rounded uppercase tracking-widest font-bold hidden md:inline border border-amber-300">
                Version 2
              </span>
            </div>
          </div>

          {/* Active Case Selector Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-neutral-500 font-medium hidden lg:inline">Active Case:</span>
            <select
              value={activeCase.id}
              onChange={(e) => {
                const found = cases.find(c => c.id === e.target.value);
                if (found) onSelectCase(found);
              }}
              className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:border-[#991b1b] shadow-sm"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} • {c.decedent.legalName} ({c.dispositionType.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>

            <button
              onClick={onOpenNewCase}
              className="bg-[#991b1b] hover:bg-red-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-sm border border-amber-400/40"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Case</span>
            </button>

            {onOpenRemovalModal && (
              <button
                onClick={onOpenRemovalModal}
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-xs"
                title="Schedule First Call Removal & Custody Affidavit"
              >
                <Truck className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden md:inline">Removal</span>
              </button>
            )}

            {onOpenContractModal && (
              <button
                onClick={onOpenContractModal}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-xs"
                title="Open Arrangement Conference & AP-47 Contract Studio"
              >
                <ScrollText className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">AP-47 Contract</span>
              </button>
            )}
          </div>

          {/* RBAC Role Switcher & Family SMS Dispatch Launcher */}
          <div className="flex items-center space-x-2.5">

            {/* Livery Hold Modal Launcher */}
            <button
              onClick={onOpenLiveryModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#b45309] border border-amber-300/80 rounded-xl text-xs font-bold transition shadow-2xs group"
              title="Open Livery & Transport Vendor Vehicle Hold Engine"
            >
              <Car className="w-3.5 h-3.5 text-[#b45309] group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">Livery Fleet</span>
            </button>

            {/* 2-Way Vendor SMS Dispatch Launcher */}
            {onOpenTwoWaySmsModal && (
              <button
                onClick={() => onOpenTwoWaySmsModal()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold transition shadow-2xs group"
                title="Open Two-Way Service Partner SMS Dispatch & Carrier Confirmation Hub"
              >
                <Users className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Vendor SMS</span>
              </button>
            )}

            {/* DocuSign Legal eSign Modal Launcher */}
            {onOpenDocuSignModal && (
              <button
                onClick={onOpenDocuSignModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21409a]/10 hover:bg-[#21409a]/20 text-[#21409a] border border-[#21409a]/30 rounded-xl text-xs font-bold transition shadow-2xs group"
                title="Open DocuSign NYS ESRA Legal E-Signature Hub"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#21409a] group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">DocuSign Hub</span>
              </button>
            )}

            {/* QuickBooks Online Sync Modal Launcher */}
            {onOpenQuickBooksModal && (
              <button
                onClick={onOpenQuickBooksModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2ca01c]/10 hover:bg-[#2ca01c]/20 text-[#2ca01c] border border-[#2ca01c]/30 rounded-xl text-xs font-bold transition shadow-2xs group"
                title="Open QuickBooks Online Accounting & Invoicing Integration"
              >
                <Landmark className="w-3.5 h-3.5 text-[#2ca01c] group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">QuickBooks Sync</span>
              </button>
            )}

            {/* Print Form AP-47 Quick Action */}
            {onOpenPrintAP47 && (
              <button
                onClick={onOpenPrintAP47}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#991b1b] hover:bg-red-800 text-white border border-amber-300/40 rounded-xl text-xs font-bold transition shadow-2xs group"
                title="Print Official Form AP-47 Statement of Goods & Services (10 NYCRR § 77.8)"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Print AP-47</span>
              </button>
            )}

            {/* Pass-Through Checks Quick Action */}
            {onOpenCheckPrinter && (
              <button
                onClick={onOpenCheckPrinter}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition shadow-2xs group"
                title="Print 3-Part Pass-Through Cash Advance Checks (10 NYCRR § 77.8)"
              >
                <Printer className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Pass-Through Checks</span>
              </button>
            )}

            {/* Live Family SMS Simulator Quick Button */}
            <button
              onClick={onOpenNotifications}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#991b1b] border border-red-300/80 rounded-xl text-xs font-bold transition shadow-2xs group"
              title="Open Live Family SMS & Alert Dispatch Hub"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#991b1b] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Family SMS Hub</span>
              {notificationCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#991b1b] text-white text-[10px] font-mono rounded-full font-bold">
                  {notificationCount}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
              {(['manager', 'director', 'staff', 'accounting', 'family'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeRole(r)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${currentRole === r
                      ? 'bg-[#991b1b] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                    }`}
                >
                  {r === 'manager' ? (
                    <>
                      <span>Manager</span>
                      <Lock className="w-2.5 h-2.5 text-amber-300" />
                    </>
                  ) : r === 'director' ? 'Director' : r === 'staff' ? 'Staff' : r === 'accounting' ? 'Finance' : 'Family'}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#991b1b] relative border border-neutral-200 transition"
              title="View Alert Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#991b1b] rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#991b1b] rounded-full" />
            </button>
          </div>

        </div>
      </header>

      {/* Role Context Bar */}
      <div className="bg-[#fafafa] border-b border-neutral-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-0.5 rounded border text-[11px] font-bold ${roleBadges[currentRole].color}`}>
            {roleBadges[currentRole].label}
          </span>
          <span className="text-neutral-600 text-[11px] hidden md:inline font-light">
            — {roleBadges[currentRole].desc}
          </span>
        </div>

        {/* Live Director Persona & Golden Record Status */}
        <div className="flex flex-wrap items-center space-x-3 text-[11px] text-neutral-600 font-medium">
          {directorProfiles && onChangeDirectorId && (
            <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-neutral-300 shadow-2xs">
              <span className="text-neutral-500 font-semibold">Active Director:</span>
              <select
                value={currentDirectorId || 'dir-fd-1'}
                onChange={(e) => onChangeDirectorId(e.target.value)}
                className="bg-transparent font-bold text-neutral-900 text-xs outline-none cursor-pointer"
              >
                <optgroup label="Licensed Funeral Directors (Case Claiming)">
                  {directorProfiles.filter(d => d.roleType === 'funeral_director').map((d) => (
                    <option key={d.id} value={d.id}>
                      👔 {d.name} ({d.activeCasesCount || 0} cases)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Executive Managers (Override Authority)">
                  {directorProfiles.filter(d => d.roleType === 'manager').map((d) => (
                    <option key={d.id} value={d.id}>
                      👑 [Manager] {d.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          <span className="hidden sm:inline text-neutral-300">|</span>
          <span className="hidden md:inline">
            Director in Charge: <strong className="text-neutral-900">{activeCase.assignedDirector}</strong>
          </span>
        </div>
      </div>

      {/* DISTINCT LINEAR 5-PHASE PROGRESSION TRACKER ("GOLDEN PATH NAVIGATOR") */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col space-y-2">

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-neutral-900 font-serif-title flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#991b1b]" />
                Linear Process Progression:
              </span>
              <span className="text-[#b45309] font-bold">
                {activeCase.decedent.legalName} ({activeCase.caseNumber})
              </span>
            </div>

            <span className="text-[11px] text-neutral-500 font-mono">
              Stage {currentPhaseIndex + 1} of 5 • {Math.round(((currentPhaseIndex + 1) / 5) * 100)}% Complete
            </span>
          </div>

          {/* 5-Step Connected Progress Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 pt-1">
            {PHASES_LIST.map((phase, idx) => {
              const Icon = phase.icon;
              const isPast = idx < currentPhaseIndex;
              const isCurrent = idx === currentPhaseIndex;

              return (
                <button
                  key={phase.id}
                  onClick={() => {
                    if (phase.id === 'arrangements' && onOpenContractModal) {
                      onOpenContractModal();
                    } else {
                      onChangeTab(phase.targetTab);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2.5 relative group ${isCurrent
                      ? 'bg-red-50/90 border-[#991b1b] ring-2 ring-red-500/20 shadow-sm'
                      : isPast
                        ? 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-50 text-emerald-950'
                        : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100 text-neutral-500'
                    }`}
                  title={phase.id === 'arrangements' ? 'Open Arrangement Conference & AP-47 Contract Studio' : `Go to ${phase.label}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${isCurrent
                      ? 'bg-[#991b1b] text-white'
                      : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}>
                    {isPast ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs font-bold truncate ${isCurrent ? 'text-[#991b1b]' : isPast ? 'text-emerald-950' : 'text-neutral-700'
                        }`}>
                        {phase.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block truncate font-light">
                      {isPast ? '✓ Completed' : isCurrent ? '👉 Current Active Stage' : phase.subLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* GUIDED "NEXT STEP TO ASSIST" CO-PILOT BAR */}
          <div className="mt-2 p-3 bg-gradient-to-r from-red-50 via-white to-amber-50 rounded-xl border border-red-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start md:items-center space-x-2.5">
              <div className="p-1.5 bg-[#991b1b] text-white rounded-lg shrink-0 mt-0.5 md:mt-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div>
                <span className="font-bold text-[#991b1b] uppercase tracking-wider text-[10px] block">
                  Director Guided Next Step:
                </span>
                <p className="text-neutral-800 text-xs font-medium">
                  {activeCase.currentPhase === 'intake_removal' && (
                    <span>Log physical arrival at 630 St. Nicholas Ave and send instant peace-of-mind confirmation SMS to {activeCase.informant.fullName}.</span>
                  )}
                  {activeCase.currentPhase === 'arrangements' && (
                    <span>Conduct Family Arrangement Conference to select Service Type, Casket/Vault, Livery Fleet, Flowers, Programs & Pass-Through Cash Advances into Form AP-47, and reserve facility space.</span>
                  )}
                  {activeCase.currentPhase === 'legal_bundle' && (
                    <span>Request Next of Kin legal e-signatures on the NYC EDRS worksheet and Woodlawn Crematory authorization.</span>
                  )}
                  {activeCase.currentPhase === 'permits_logistics' && (
                    <span>Transmit verified NYC EDRS permit and certified cremation authorization packet to Woodlawn Crematory & officiants.</span>
                  )}
                  {activeCase.currentPhase === 'finalization_aftercare' && (
                    <span>Verify ACH bank transfer / C&J Life Insurance funding and activate Day 7/30/365 grief support touchpoints.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick 1-Click Action Triggers */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {activeCase.currentPhase === 'intake_removal' && (
                <>
                  <button
                    onClick={() => onChangeTab('golden_record')}
                    className="px-3 py-1.5 bg-[#991b1b] hover:bg-red-800 text-white font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5"
                  >
                    <span>Log Safe Arrival at BFH</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onOpenNotifications}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-bold rounded-lg text-xs transition"
                  >
                    Send Arrival SMS
                  </button>
                </>
              )}

              {activeCase.currentPhase === 'arrangements' && (
                <>
                  {onOpenContractModal && (
                    <button
                      onClick={onOpenContractModal}
                      className="px-3.5 py-1.5 bg-[#991b1b] hover:bg-red-800 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center gap-1.5 border border-amber-300/40"
                    >
                      <ScrollText className="w-3.5 h-3.5 text-amber-300" />
                      <span>📜 Open AP-47 Arrangement Studio</span>
                    </button>
                  )}
                  {onOpenPrintAP47 && (
                    <button
                      onClick={onOpenPrintAP47}
                      className="px-3.5 py-1.5 bg-red-950 hover:bg-red-900 text-amber-300 font-bold rounded-lg text-xs transition shadow-md flex items-center gap-1.5 border border-amber-400/60"
                      title="Print Official Form AP-47 Contract (10 NYCRR § 77.8)"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>🖨️ Print Form AP-47</span>
                    </button>
                  )}
                  <button
                    onClick={() => onChangeTab('calendar')}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-bold rounded-lg text-xs transition flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                    <span>12-Room Calendar</span>
                  </button>
                  <button
                    onClick={onOpenLiveryModal}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#b45309] border border-amber-300 font-bold rounded-lg text-xs transition flex items-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Livery Hold</span>
                  </button>
                  <button
                    onClick={onOpenPartnerModal || (() => onChangeTab('partners'))}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5 border border-amber-400/30"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    <span>Partner SMS</span>
                  </button>
                </>
              )}

              {activeCase.currentPhase === 'legal_bundle' && (
                <>
                  <button
                    onClick={onOpenESignModal}
                    className="px-3 py-1.5 bg-[#991b1b] hover:bg-red-800 text-white font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open Legal eSign Pad</span>
                  </button>
                  <button
                    onClick={onOpenNotifications}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-bold rounded-lg text-xs transition"
                  >
                    Send eSign SMS Link
                  </button>
                </>
              )}

              {activeCase.currentPhase === 'permits_logistics' && (
                <button
                  onClick={onOpenWoodlawnModal}
                  className="px-3 py-1.5 bg-[#991b1b] hover:bg-red-800 text-white font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open Woodlawn Dispatch</span>
                </button>
              )}

              {activeCase.currentPhase === 'finalization_aftercare' && (
                <button
                  onClick={() => onChangeTab('finances')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Verify Split Billing</span>
                </button>
              )}

              {onAdvancePhase && currentPhaseIndex < phaseOrder.length - 1 && (
                <button
                  onClick={() => onAdvancePhase(activeCase.id, phaseOrder[currentPhaseIndex + 1])}
                  className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-bold rounded-lg text-xs transition flex items-center gap-1 hover:border-neutral-400"
                  title="Advance case to next linear stage"
                >
                  <span>Advance Stage ➔</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <nav className="bg-white border-b border-neutral-200 px-4 sm:px-6 flex overflow-x-auto no-scrollbar">
        <div className="flex space-x-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${isActive
                    ? 'bg-red-50 text-[#991b1b] border border-red-200 shadow-sm'
                    : 'text-neutral-600 hover:text-[#991b1b] hover:bg-neutral-50'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#991b1b]' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
};
