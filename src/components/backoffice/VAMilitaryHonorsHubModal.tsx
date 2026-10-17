import React, { useState } from 'react';
import { 
  GoldenRecordCase, 
  VAMilitaryHonorsData, 
  MilitaryBranch, 
  MilitaryDischargeType 
} from '../../lib/types/funeral';
import { 
  createInitialVAMilitaryHonorsFromCase,
  dispatchHonorGuardRequest,
  reserveNationalCemeterySlot,
  NYC_METRO_MILITARY_HONOR_GUARDS,
  NY_VA_NATIONAL_CEMETERIES
} from '../../lib/data/govFilingsAndVeteransData';
import { 
  Award, 
  CheckCircle2, 
  Shield, 
  Flag, 
  MapPin, 
  FileText, 
  X, 
  Clock, 
  DollarSign, 
  Check, 
  Send, 
  Users
} from 'lucide-react';

interface VAMilitaryHonorsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: GoldenRecordCase;
  cases: GoldenRecordCase[];
  onSelectCase?: (caseId: string) => void;
  onSaveHonors: (honors: VAMilitaryHonorsData) => void;
}

export const VAMilitaryHonorsHubModal: React.FC<VAMilitaryHonorsHubModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  cases,
  onSelectCase,
  onSaveHonors
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCase.id);
  const currentCase = cases.find(c => c.id === selectedCaseId) || activeCase;

  // Initialize or hydrate honors state
  const [honors, setHonors] = useState<VAMilitaryHonorsData>(() => {
    return currentCase.militaryHonors || createInitialVAMilitaryHonorsFromCase(currentCase);
  });

  const [activeTab, setActiveTab] = useState<'dd214' | 'honor_guard' | 'flag' | 'headstone' | 'cemetery'>('honor_guard');
  const [isDispatching, setIsDispatching] = useState(false);

  // Sync state if user changes selected case
  const handleCaseChange = (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    if (onSelectCase) onSelectCase(newCaseId);
    const targetCase = cases.find(c => c.id === newCaseId) || activeCase;
    setHonors(targetCase.militaryHonors || createInitialVAMilitaryHonorsFromCase(targetCase));
  };

  const currentUnit = NYC_METRO_MILITARY_HONOR_GUARDS.find(u => u.branch === honors.militaryBranch) || NYC_METRO_MILITARY_HONOR_GUARDS[0];

  const handleDispatchHonorGuard = () => {
    setIsDispatching(true);
    setTimeout(() => {
      const updated = dispatchHonorGuardRequest(honors, honors.detailType, honors.tapsType);
      setHonors(updated);
      onSaveHonors(updated);
      setIsDispatching(false);
    }, 1200);
  };

  const handleCemeterySelect = (cemeteryName: any) => {
    const updated = reserveNationalCemeterySlot(honors, cemeteryName);
    setHonors(updated);
    onSaveHonors(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF9F6] border border-[#E8E3DA] rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-[#1c1a1a] via-[#241f1a] to-[#800000] text-white px-6 py-4.5 flex items-center justify-between border-b border-[#D4AF37]/40 shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-brass-950/60 rounded-xl border border-[#D4AF37]/50 shadow-inner">
              <Award className="w-6 h-6 text-[#E6C65B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-serif font-bold text-[#F5F2EB] tracking-wide">
                  VA Military Honors & Veterans Memorial Benefits Hub
                </h2>
                <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brass-900/80 text-brass-200 border border-brass-400/30">
                  DoD Directive 1300.15
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Military Funeral Honors Detail • VA Headstones (Form 40-1330) • Burial Flag (Form 27-2008) • National Cemetery Scheduling
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Case Quick Switcher */}
            <div className="hidden sm:flex items-center bg-black/40 border border-white/20 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-neutral-400 mr-2">Veteran Case:</span>
              <select
                value={selectedCaseId}
                onChange={(e) => handleCaseChange(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                    {c.caseNumber} • {c.decedent.legalName} {c.decedent.veteran ? '🎖️' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUBHEADER: METRICS & NAVIGATION TABS */}
        <div className="bg-white border-b border-[#E8E3DA] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dd214')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dd214'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              1. DD-214 Vault & Service
            </button>
            <button
              onClick={() => setActiveTab('honor_guard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'honor_guard'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <span>2. Honor Guard Detail</span>
              {honors.honorGuardStatus === 'confirmed' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('flag')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'flag'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              3. Burial Flag (VA 27-2008)
            </button>
            <button
              onClick={() => setActiveTab('headstone')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'headstone'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              4. Headstone & Inscription (VA 40-1330)
            </button>
            <button
              onClick={() => setActiveTab('cemetery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'cemetery'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              5. National Cemetery (NCA) & Benefits
            </button>
          </div>

          {/* Quick Veteran Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-500 font-medium">Service Branch:</span>
            <span className="bg-brass-100 text-brass-900 font-bold px-2.5 py-0.5 rounded-full border border-brass-300">
              {honors.militaryBranch} • {honors.serviceEra}
            </span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FBF9F5]">

          {/* TAB 1: DD-214 VAULT & SERVICE VERIFICATION */}
          {activeTab === 'dd214' && (
            <div className="space-y-6">
              
              <div className="bg-brass-50/80 border border-brass-200 rounded-xl p-4 flex items-start space-x-3.5 text-xs text-brass-950">
                <Shield className="w-5 h-5 text-brass-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brass-950 mb-0.5">
                    DD-214 Certificate of Release or Discharge from Active Duty
                  </h4>
                  <p className="leading-relaxed">
                    Federal law guarantees military funeral honors and national cemetery interment to any service member who died while on active duty or served on active duty and was discharged under other than dishonorable conditions.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif font-bold text-neutral-900 text-sm">
                    Military Service Record & Discharge Jurat
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DD-214 Verified On File</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Branch of Service</label>
                    <select
                      value={honors.militaryBranch}
                      onChange={(e) => setHonors({ ...honors, militaryBranch: e.target.value as MilitaryBranch })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass-600"
                    >
                      <option value="U.S. Army">U.S. Army</option>
                      <option value="U.S. Navy">U.S. Navy</option>
                      <option value="U.S. Marine Corps">U.S. Marine Corps</option>
                      <option value="U.S. Air Force">U.S. Air Force</option>
                      <option value="U.S. Coast Guard">U.S. Coast Guard</option>
                      <option value="U.S. Space Force">U.S. Space Force</option>
                      <option value="Merchant Marine (WWII)">Merchant Marine (WWII)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">War or Conflict Era</label>
                    <select
                      value={honors.serviceEra}
                      onChange={(e) => setHonors({ ...honors, serviceEra: e.target.value as any })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass-600"
                    >
                      <option value="WWII">WWII</option>
                      <option value="Korean War">Korean War</option>
                      <option value="Vietnam Era">Vietnam Era</option>
                      <option value="Persian Gulf / Desert Storm">Persian Gulf / Desert Storm</option>
                      <option value="OEF / OIF">OEF / OIF</option>
                      <option value="GWOT">GWOT</option>
                      <option value="Peacetime">Peacetime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Highest Rank Achieved</label>
                    <input
                      type="text"
                      value={honors.highestRankAchieved}
                      onChange={(e) => setHonors({ ...honors, highestRankAchieved: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass-600"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Military Service # / SSN</label>
                    <input
                      type="text"
                      value={honors.serviceNumberOrSSN}
                      onChange={(e) => setHonors({ ...honors, serviceNumberOrSSN: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-mono font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass-600"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Active Duty Entry Date</label>
                    <input
                      type="date"
                      value={honors.entryDate || ''}
                      onChange={(e) => setHonors({ ...honors, entryDate: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass-600"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Separation Date</label>
                    <input
                      type="date"
                      value={honors.separationDate || ''}
                      onChange={(e) => setHonors({ ...honors, separationDate: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brass-600"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Character of Discharge</label>
                    <select
                      value={honors.dischargeType}
                      onChange={(e) => setHonors({ ...honors, dischargeType: e.target.value as MilitaryDischargeType })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-semibold text-emerald-800 bg-emerald-50 focus:bg-white focus:outline-none"
                    >
                      <option value="honorable">Honorable Discharge (Full Entitlements)</option>
                      <option value="general_under_honorable">General Under Honorable Conditions</option>
                      <option value="other_than_honorable">Other Than Honorable (Requires VA Case Review)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-500 font-medium mb-1">DD-214 Electronic Document ID</label>
                    <input
                      type="text"
                      readOnly
                      value={honors.dd214DocNumber || 'DD214-RECORD-VAULT'}
                      className="w-full border border-neutral-200 rounded-lg p-2 font-mono text-neutral-700 bg-neutral-100"
                    />
                  </div>
                </div>

                {/* Valor Awards Chips */}
                <div className="border-t border-neutral-100 pt-3">
                  <label className="block text-neutral-500 font-medium text-xs mb-1.5">
                    Decorations, Medals, Badges & Campaign Ribbons Awarded:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {honors.valorAwards?.map((award, idx) => (
                      <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>{award}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MILITARY FUNERAL HONORS DETAIL (DOD DIRECTIVE 1300.15) */}
          {activeTab === 'honor_guard' && (
            <div className="space-y-6">
              
              {/* Branch Casualty Assistance Banner */}
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-brass-100 text-brass-900 rounded-xl">
                      <Users className="w-6 h-6 text-brass-800" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-neutral-900 text-sm">
                        Designated Honor Guard Detachment for {honors.militaryBranch}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {currentUnit.unitName} • {currentUnit.installation}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {honors.honorGuardStatus.toUpperCase()}
                  </span>
                </div>

                {/* Coordinator Direct Contact Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-neutral-400 font-medium block">Lead Casualty Officer:</span>
                    <span className="font-bold text-neutral-800">{currentUnit.leadCoordinator}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium block">Command Phone:</span>
                    <span className="font-bold text-neutral-800">{currentUnit.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium block">Required Advance Notice:</span>
                    <span className="font-bold text-brass-800">{currentUnit.advanceNoticeRequirement}</span>
                  </div>
                </div>

                {/* CEREMONIAL DETAIL SPECIFICATIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Ceremony Detail Type</label>
                    <select
                      value={honors.detailType}
                      onChange={(e) => setHonors({ ...honors, detailType: e.target.value as any })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                    >
                      <option value="2_person_standard">2-Person Uniformed Detail (Statutory Minimum)</option>
                      <option value="full_firing_party_7_person">Full 7-Person Firing Party (Rifle Volley + Flag)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Rendering of Taps</label>
                    <select
                      value={honors.tapsType}
                      onChange={(e) => setHonors({ ...honors, tapsType: e.target.value as any })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                    >
                      <option value="live_bugler">Live Bugler (Armed Forces Musician)</option>
                      <option value="ceremonial_electronic_bugle">Ceremonial Electronic Bugle (Silver Bell Insert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Flag Folding & Presentation</label>
                    <div className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-900 rounded-lg font-semibold flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Presented to Next of Kin</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Ceremony Date</label>
                    <input
                      type="date"
                      value={honors.ceremonyDate || ''}
                      onChange={(e) => setHonors({ ...honors, ceremonyDate: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Ceremony Time</label>
                    <input
                      type="text"
                      value={honors.ceremonyTime || '11:00 AM'}
                      onChange={(e) => setHonors({ ...honors, ceremonyTime: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Location of Rendering</label>
                    <input
                      type="text"
                      value={honors.ceremonyLocation || "Benta's Main Sanctuary Chapel"}
                      onChange={(e) => setHonors({ ...honors, ceremonyLocation: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* DISPATCH ACTION & CONFIRMATION BOX */}
                <div className="bg-gradient-to-r from-neutral-900 to-brass-950 text-white rounded-xl p-4.5 flex flex-wrap items-center justify-between gap-4 mt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brass-300 tracking-wider block">
                      DOD CASUALTY DISPATCH CONFIRMATION
                    </span>
                    <span className="font-mono text-sm font-bold text-[#E6C65B]">
                      {honors.honorGuardConfirmationCode || 'DOD-HON-NYC-PENDING'}
                    </span>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      Flag presentation statement: <em className="text-neutral-200">"On behalf of the President of the United States, the {honors.militaryBranch}, and a grateful nation..."</em>
                    </p>
                  </div>

                  <button
                    onClick={handleDispatchHonorGuard}
                    disabled={isDispatching}
                    className="px-5 py-2.5 bg-brass-600 hover:bg-brass-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isDispatching ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin text-white" />
                        <span>Confirming Dispatch with Unit...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#D4AF37]" />
                        <span>Dispatch Honors Request ⚡</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BURIAL FLAG (VA FORM 27-2008) */}
          {activeTab === 'flag' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Flag className="w-5 h-5 text-red-700" />
                    <h3 className="font-serif font-bold text-neutral-900 text-sm">
                      VA Form 27-2008 • Application for United States Flag for Burial Purposes
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-brass-700 bg-brass-50 px-2.5 py-0.5 rounded-full border border-brass-200">
                    Complimentary Federal Honor
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  An official <strong>5 ft. x 9.5 ft. cotton United States Burial Flag</strong> is provided at no cost by the Department of Veterans Affairs to drape the casket or accompany the urn of an eligible veteran. After the ceremony, the flag is formally folded into the sacred tricorn fold and presented to the next of kin.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
                    <span className="font-bold text-neutral-800 block text-xs">Designated Flag Recipient (Next of Kin):</span>
                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={honors.flagRecipientName || currentCase.informant.fullName}
                        onChange={(e) => setHonors({ ...honors, flagRecipientName: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Relationship to Veteran</label>
                      <input
                        type="text"
                        value={honors.flagRecipientRelationship || currentCase.informant.relationship}
                        onChange={(e) => setHonors({ ...honors, flagRecipientRelationship: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
                    <span className="font-bold text-neutral-800 block text-xs">Flag Issuing Post Office / VA Station:</span>
                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Local Issuing Facility</label>
                      <input
                        type="text"
                        value={honors.flagIssuedByPostOffice || 'USPS Hamilton Grange Post Office (521 W 146th St, NY 10031)'}
                        onChange={(e) => setHonors({ ...honors, flagIssuedByPostOffice: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-500 pt-1">
                      BFH staff physically collects the flag from USPS Hamilton Grange station with certified DD-214 copy prior to visitation.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: HEADSTONE & INSCRIPTION (VA FORM 40-1330) */}
          {activeTab === 'headstone' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-neutral-700" />
                    <h3 className="font-serif font-bold text-neutral-900 text-sm">
                      VA Form 40-1330 • Claim for Standard Government Headstone or Marker
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    100% Free Headstone & Inscription
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Customizer Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Marker Type</label>
                      <select
                        value={honors.headstoneMarkerType}
                        onChange={(e) => setHonors({ ...honors, headstoneMarkerType: e.target.value as any })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                      >
                        <option value="bronze_niche">Bronze Niche Marker (Columbarium Wall)</option>
                        <option value="upright_marble">Upright Marble Headstone (Traditional National Cemetery)</option>
                        <option value="flat_granite">Flat Granite Marker (Private or National Cemetery)</option>
                        <option value="flat_bronze">Flat Bronze Marker with Base</option>
                        <option value="bronze_medallion">Bronze Medallion (Attached to Existing Private Headstone)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Emblem of Belief (Inscribed at Top)</label>
                      <select
                        value={honors.emblemOfBelief}
                        onChange={(e) => setHonors({ ...honors, emblemOfBelief: e.target.value as any })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none"
                      >
                        <option value="latin_cross">Latin Cross (Christian)</option>
                        <option value="star_of_david">Star of David (Jewish)</option>
                        <option value="crescent_and_star">Crescent and Star (Islamic)</option>
                        <option value="buddhist_wheel">Wheel of Righteousness (Buddhist)</option>
                        <option value="none">No Religious Emblem</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Line 1: Legal Name & Military Rank</label>
                      <input
                        type="text"
                        value={honors.inscriptionLine1}
                        onChange={(e) => setHonors({ ...honors, inscriptionLine1: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 uppercase focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Line 2: Service Branch & War/Conflict Era</label>
                      <input
                        type="text"
                        value={honors.inscriptionLine2}
                        onChange={(e) => setHonors({ ...honors, inscriptionLine2: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 uppercase focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Line 3: Birth and Death Dates</label>
                      <input
                        type="text"
                        value={honors.inscriptionLine3}
                        onChange={(e) => setHonors({ ...honors, inscriptionLine3: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 uppercase focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Line 4: Valor Awards or Family Inscription</label>
                      <input
                        type="text"
                        value={honors.inscriptionLine4 || ''}
                        onChange={(e) => setHonors({ ...honors, inscriptionLine4: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Right: Live Visual Headstone Render */}
                  <div className="flex flex-col items-center justify-center bg-neutral-100 p-6 rounded-xl border border-neutral-300">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                      OFFICIAL VA INSCRIPTION PREVIEW
                    </span>

                    <div className="bg-gradient-to-b from-[#2B1B17] to-[#1C1412] text-[#D4AF37] border-4 border-[#8B7355] rounded-t-2xl p-6 w-full max-w-xs shadow-xl text-center space-y-2.5 font-serif min-h-[220px] flex flex-col justify-center">
                      <div className="text-xl font-bold tracking-widest text-amber-200/90">
                        {honors.emblemOfBelief === 'latin_cross' && '✝'}
                        {honors.emblemOfBelief === 'star_of_david' && '✡'}
                        {honors.emblemOfBelief === 'crescent_and_star' && '☪'}
                        {honors.emblemOfBelief === 'buddhist_wheel' && '☸'}
                      </div>
                      
                      <div className="text-sm font-bold tracking-wider uppercase text-amber-100">
                        {honors.inscriptionLine1 || 'NAME & RANK'}
                      </div>

                      <div className="text-xs font-semibold tracking-wider uppercase text-amber-200/80">
                        {honors.inscriptionLine2 || 'BRANCH • WAR'}
                      </div>

                      <div className="text-xs tracking-wider uppercase text-amber-200/80">
                        {honors.inscriptionLine3 || 'YEARS'}
                      </div>

                      {honors.inscriptionLine4 && (
                        <div className="text-[10px] tracking-wider uppercase text-amber-300/90 pt-1 border-t border-amber-900/50">
                          {honors.inscriptionLine4}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-neutral-500 mt-3 text-center">
                      Inscribed by National Cemetery Administration Gravemarker Logistics Hub (Indianapolis, IN)
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 5: NATIONAL CEMETERY (NCA) & BURIAL BENEFITS */}
          {activeTab === 'cemetery' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-serif font-bold text-neutral-900 text-sm">
                      National Cemetery Administration (NCA) Reservation
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    100% Free Plot & Perpetual Care
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {NY_VA_NATIONAL_CEMETERIES.map((cem, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCemeterySelect(cem.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition text-xs space-y-2 flex flex-col justify-between ${
                        honors.nationalCemeterySelected === cem.name
                          ? 'bg-brass-50/80 border-brass-400 ring-2 ring-brass-300 shadow-sm'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-neutral-900 text-sm">{cem.name}</h4>
                          {honors.nationalCemeterySelected === cem.name && (
                            <CheckCircle2 className="w-4 h-4 text-brass-700" />
                          )}
                        </div>
                        <p className="text-neutral-500 text-[11px] mt-0.5">{cem.address}, {cem.cityStateZip}</p>
                        <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                          ✓ {cem.status}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                        <span>Transit from Harlem: {cem.transitDrivingTimeFromHarlem}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CURRENT RESERVATION STATUS */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 font-medium block mb-0.5">Selected National Cemetery:</span>
                    <span className="font-bold text-neutral-900">{honors.nationalCemeterySelected || 'None Selected'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium block mb-0.5">NCA Confirmation Code:</span>
                    <span className="font-mono font-bold text-brass-800">{honors.ncaConfirmationNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium block mb-0.5">Allocated Plot/Niche:</span>
                    <span className="font-semibold text-neutral-800">{honors.ncaSectionPlotNumber}</span>
                  </div>
                </div>

                {/* VA 21P-530EZ REIMBURSEMENT ESTIMATOR */}
                <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-4.5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-950">
                      <DollarSign className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm">VA Form 21P-530EZ • VA Burial Allowance Reimbursement</h4>
                    </div>
                    <span className="font-bold text-emerald-800 text-sm">
                      Est. ${honors.estimatedReimbursementAmount.toLocaleString()} Benefit
                    </span>
                  </div>
                  <p className="text-emerald-900/90 leading-relaxed">
                    VA provides monetary reimbursements for burial and funeral costs. Qualified non-service-connected deaths receive <strong>$948 burial allowance + $948 plot allowance</strong>. Service-connected deaths receive up to <strong>$2,000</strong>. Benta's handles itemized receipts for submission.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-white border-t border-[#E8E3DA] px-6 py-3.5 flex items-center justify-between text-xs">
          <div className="text-neutral-500">
            Honors for: <span className="font-bold text-neutral-900">{currentCase.decedent.legalName}</span> ({honors.militaryBranch})
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-xl font-medium cursor-pointer transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSaveHonors(honors);
                onClose();
              }}
              className="px-5 py-2 bg-[#800000] text-white hover:bg-brass-900 rounded-xl font-bold cursor-pointer shadow-xs transition"
            >
              Save Veterans Record & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
