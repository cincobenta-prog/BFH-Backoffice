import React, { useState } from 'react';
import { GoldenRecordCase, SSA721Filing } from '../../lib/types/funeral';
import { 
  createInitialSSA721FromCase, 
  simulateSSA721ElectronicTransmission, 
  NYC_SSA_FIELD_OFFICES 
} from '../../lib/data/govFilingsAndVeteransData';
import { 
  CheckCircle2, 
  Send, 
  Printer, 
  X, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check 
} from 'lucide-react';

interface SSA721FilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: GoldenRecordCase;
  cases: GoldenRecordCase[];
  onSelectCase?: (caseId: string) => void;
  onSaveFiling: (filing: SSA721Filing) => void;
}

export const SSA721FilingModal: React.FC<SSA721FilingModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  cases,
  onSelectCase,
  onSaveFiling
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCase.id);
  const currentCase = cases.find(c => c.id === selectedCaseId) || activeCase;

  // Initialize or hydrate filing state
  const [filing, setFiling] = useState<SSA721Filing>(() => {
    return currentCase.ssa721Filing || createInitialSSA721FromCase(currentCase);
  });

  const [activeTab, setActiveTab] = useState<'form' | 'transmission' | 'preview' | 'survivor_guide'>('form');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state if user changes selected case
  const handleCaseChange = (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    if (onSelectCase) onSelectCase(newCaseId);
    const targetCase = cases.find(c => c.id === newCaseId) || activeCase;
    setFiling(targetCase.ssa721Filing || createInitialSSA721FromCase(targetCase));
  };

  const handleTransmitEFile = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      const updated = simulateSSA721ElectronicTransmission(filing);
      setFiling(updated);
      onSaveFiling(updated);
      setIsTransmitting(false);
    }, 1200);
  };

  const handleCopyAck = () => {
    if (filing.ssaConfirmationNumber) {
      navigator.clipboard.writeText(filing.ssaConfirmationNumber);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF9F6] border border-[#E8E3DA] rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-[#2B1B17] via-[#3E1C14] to-[#241f1a] text-white px-6 py-4.5 flex items-center justify-between border-b border-[#D4AF37]/30 shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-[#800000]/40 rounded-xl border border-[#D4AF37]/50 shadow-inner">
              <Building2 className="w-6 h-6 text-[#E6C65B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-serif font-bold text-[#F5F2EB] tracking-wide">
                  Social Security Administration • Form SSA-721
                </h2>
                <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  OMB No. 0960-0142
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Statement of Death by Funeral Director • Direct Electronic EDRS Clearing & $255 Lump-Sum Benefit Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Case Quick Switcher */}
            <div className="hidden sm:flex items-center bg-black/40 border border-white/20 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-neutral-400 mr-2">Target Case:</span>
              <select
                value={selectedCaseId}
                onChange={(e) => handleCaseChange(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                    {c.caseNumber} • {c.decedent.legalName}
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'form'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              1. Statutory Form & Vitals
            </button>
            <button
              onClick={() => setActiveTab('transmission')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'transmission'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <span>2. Electronic Clearing (E-File)</span>
              {filing.status === 'acknowledged_cleared' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'preview'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              3. Official Document Preview
            </button>
            <button
              onClick={() => setActiveTab('survivor_guide')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'survivor_guide'
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              4. Surviving Spouse $255 Advisory
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-500 font-medium">SSA Transmission Status:</span>
            {filing.status === 'acknowledged_cleared' ? (
              <span className="flex items-center space-x-1 text-emerald-800 bg-emerald-100 border border-emerald-300 font-semibold px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cleared & Acknowledged</span>
              </span>
            ) : filing.status === 'transmitted' ? (
              <span className="flex items-center space-x-1 text-brass-800 bg-brass-100 border border-brass-300 font-semibold px-2.5 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-brass-600 animate-spin" />
                <span>Transmission Pending</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-800 bg-amber-100 border border-amber-300 font-semibold px-2.5 py-0.5 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Ready for E-Filing</span>
              </span>
            )}
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FBF9F5]">

          {/* TAB 1: INTERACTIVE STATUTORY FORM */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              
              {/* Guidance Notice */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start space-x-3.5 text-xs text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 mb-0.5">
                    Statutory Funeral Director Obligation • Social Security Act § 205
                  </h4>
                  <p className="leading-relaxed">
                    Under federal regulations, prompt filing of Form SSA-721 protects the deceased's estate from monthly benefit overpayment clawbacks (Treasury electronic debit reclamation) and secures the surviving widow/widower’s priority claim for the <strong>$255 Lump-Sum Death Benefit (LSDP)</strong>.
                  </p>
                </div>
              </div>

              {/* SECTION 1: DECEASED'S INFORMATION */}
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-bold font-mono">1</span>
                    <h3 className="font-serif font-bold text-neutral-900 text-sm">
                      Deceased Person's Information (Extracted from Golden Record)
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    NYC EVERS Synchronized
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={filing.decedentFullName}
                      onChange={(e) => setFiling({ ...filing, decedentFullName: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Social Security Number</label>
                    <input
                      type="text"
                      value={filing.ssnMasked}
                      onChange={(e) => setFiling({ ...filing, ssnMasked: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-mono font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Sex</label>
                    <select
                      value={filing.sex}
                      onChange={(e) => setFiling({ ...filing, sex: e.target.value as any })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={filing.dateOfBirth}
                      onChange={(e) => setFiling({ ...filing, dateOfBirth: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Date of Death</label>
                    <input
                      type="date"
                      value={filing.dateOfDeath}
                      onChange={(e) => setFiling({ ...filing, dateOfDeath: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Place of Death</label>
                    <input
                      type="text"
                      readOnly
                      value={currentCase.decedent.placeOfDeath}
                      className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-600 bg-neutral-100"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SURVIVING WIDOW / WIDOWER */}
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-bold font-mono">2</span>
                    <h3 className="font-serif font-bold text-neutral-900 text-sm">
                      Surviving Widow or Widower (Claimant for $255 Lump-Sum Death Payment)
                    </h3>
                  </div>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filing.hasSurvivingSpouse}
                      onChange={(e) => setFiling({ ...filing, hasSurvivingSpouse: e.target.checked })}
                      className="rounded text-[#800000] focus:ring-[#800000]"
                    />
                    <span>Surviving Spouse Exists</span>
                  </label>
                </div>

                {filing.hasSurvivingSpouse ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Spouse Full Name</label>
                      <input
                        type="text"
                        value={filing.spouseFullName || ''}
                        onChange={(e) => setFiling({ ...filing, spouseFullName: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Spouse SSN</label>
                      <input
                        type="text"
                        value={filing.spouseSsnMasked || ''}
                        onChange={(e) => setFiling({ ...filing, spouseSsnMasked: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-mono font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Spouse Date of Birth</label>
                      <input
                        type="date"
                        value={filing.spouseDob || ''}
                        onChange={(e) => setFiling({ ...filing, spouseDob: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-500 font-medium mb-1">Spouse Residential Address</label>
                      <input
                        type="text"
                        value={filing.spouseAddress || ''}
                        onChange={(e) => setFiling({ ...filing, spouseAddress: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-500 font-medium mb-1">Telephone Contact</label>
                      <input
                        type="text"
                        value={filing.spousePhone || ''}
                        onChange={(e) => setFiling({ ...filing, spousePhone: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </div>

                    <div className="sm:col-span-3 bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-emerald-700" />
                        <div>
                          <span className="font-bold text-emerald-950">Lump-Sum Death Payment (LSDP) Entitlement:</span>
                          <span className="text-emerald-800 ml-1.5 font-medium">
                            $255.00 Federal Death Benefit Voucher Reserved
                          </span>
                        </div>
                      </div>
                      <label className="flex items-center space-x-2 font-medium text-emerald-950 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filing.livingTogetherAtDeath}
                          onChange={(e) => setFiling({ ...filing, livingTogetherAtDeath: e.target.checked })}
                          className="rounded text-emerald-700 focus:ring-emerald-600"
                        />
                        <span>Living with deceased at time of death</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500 italic p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    No surviving spouse indicated. In the absence of a spouse, the $255 LSDP may be payable to an eligible dependent child who is under age 18, or disabled before age 22.
                  </div>
                )}
              </div>

              {/* SECTION 4: FUNERAL ESTABLISHMENT CERTIFICATION */}
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-4">
                <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-bold font-mono">4</span>
                  <h3 className="font-serif font-bold text-neutral-900 text-sm">
                    Funeral Establishment Certification & Disposition Jurat
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Establishment Name</label>
                    <input
                      type="text"
                      readOnly
                      value={filing.funeralHomeName}
                      className="w-full border border-neutral-200 rounded-lg p-2 font-semibold bg-neutral-100 text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">NYS Registration Number</label>
                    <input
                      type="text"
                      readOnly
                      value={filing.funeralHomeLicense}
                      className="w-full border border-neutral-200 rounded-lg p-2 font-mono font-semibold bg-neutral-100 text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Certifying Funeral Director</label>
                    <input
                      type="text"
                      value={filing.certifyingDirector}
                      onChange={(e) => setFiling({ ...filing, certifyingDirector: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Director License #</label>
                    <input
                      type="text"
                      value={filing.directorLicenseNumber}
                      onChange={(e) => setFiling({ ...filing, directorLicenseNumber: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-mono font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Disposition Type</label>
                    <input
                      type="text"
                      value={filing.dispositionType}
                      onChange={(e) => setFiling({ ...filing, dispositionType: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-medium mb-1">Cemetery / Crematory</label>
                    <input
                      type="text"
                      value={filing.cemeteryOrCrematoryName}
                      onChange={(e) => setFiling({ ...filing, cemeteryOrCrematoryName: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-medium bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE / TRANSMIT ACTIONS */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSaveFiling(filing);
                    onClose();
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-100 text-xs font-semibold cursor-pointer transition"
                >
                  Save Draft & Exit
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="px-4 py-2 bg-white border border-brass-400 text-neutral-900 rounded-xl text-xs font-semibold hover:bg-brass-50 cursor-pointer transition flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4 text-neutral-700" />
                    <span>View Official PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('transmission')}
                    className="px-5 py-2.5 bg-[#800000] text-white rounded-xl text-xs font-bold hover:bg-[#660000] shadow-md cursor-pointer transition flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4 text-[#D4AF37]" />
                    <span>Proceed to Electronic E-File ➔</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ELECTRONIC TRANSMISSION GATEWAY */}
          {activeTab === 'transmission' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-6 shadow-2xs space-y-6">
                <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-brass-50 text-brass-700 rounded-xl border border-brass-200">
                      <Send className="w-6 h-6 text-brass-600" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-neutral-900">
                        SSA Electronic Death Registration & E-File Gateway
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Direct automated interface with the Social Security Administration clearinghouse via NYC EVERS.
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-neutral-400 block">TRANSMISSION TARGET</span>
                    <span className="text-xs font-bold text-neutral-800">SSA Central Index & OASI Trust</span>
                  </div>
                </div>

                {/* Gateway Connection Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-neutral-400 font-medium block mb-0.5">Target District Office:</span>
                    <span className="font-semibold text-neutral-800">
                      {filing.ssaFieldOffice || 'Harlem District Field Office'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium block mb-0.5">Clearing Protocol:</span>
                    <span className="font-semibold text-neutral-800">
                      FH-EVERS v4.2 JSON/SOAP Encrypted
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium block mb-0.5">Est. Benefit Halt Time:</span>
                    <span className="font-semibold text-emerald-700">
                      Immediate (&lt; 2 Business Hours)
                    </span>
                  </div>
                </div>

                {/* STATUS & ACKNOWLEDGEMENT CARD */}
                {filing.status === 'acknowledged_cleared' ? (
                  <div className="bg-gradient-to-br from-emerald-50 to-brass-50 border border-emerald-300 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <div>
                          <h4 className="font-bold text-emerald-950 text-sm">
                            Filing Successfully Acknowledged by Social Security Administration
                          </h4>
                          <p className="text-xs text-emerald-800">
                            Death has been officially posted to the federal database. Benefit payments have been frozen.
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-200 text-emerald-900 border border-emerald-400">
                        CLEARED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 p-3.5 rounded-lg border border-emerald-200">
                      <div>
                        <span className="text-neutral-500 block">SSA Confirmation / Acknowledgment Number:</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-mono font-bold text-neutral-900 text-sm">
                            {filing.ssaConfirmationNumber}
                          </span>
                          <button
                            onClick={handleCopyAck}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-800 transition"
                            title="Copy confirmation number"
                          >
                            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-neutral-500 block">Batch Transmission ID:</span>
                        <span className="font-mono font-medium text-neutral-800 block mt-0.5">
                          {filing.transmissionBatchId}
                        </span>
                      </div>

                      <div>
                        <span className="text-neutral-500 block">Transmission Timestamp:</span>
                        <span className="font-medium text-neutral-800 block mt-0.5">
                          {filing.transmittedAt}
                        </span>
                      </div>

                      <div>
                        <span className="text-neutral-500 block">Surviving Spouse LSDP Claim Ticket:</span>
                        <span className="font-bold text-emerald-700 block mt-0.5">
                          $255 Lump-Sum Death Benefit Voucher Active
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-neutral-300 rounded-xl p-8 text-center space-y-4 bg-neutral-50/50">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-neutral-900 text-sm">
                        Ready to Transmit Electronic SSA-721 Notice
                      </h4>
                      <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                        Transmitting this record will instantly transmit the verified death certificate details to the Social Security Administration to prevent bank reclamation issues.
                      </p>
                    </div>

                    <button
                      onClick={handleTransmitEFile}
                      disabled={isTransmitting}
                      className="px-6 py-3 bg-[#800000] text-white rounded-xl text-xs font-bold hover:bg-[#660000] shadow-md cursor-pointer transition flex items-center space-x-2 mx-auto disabled:opacity-50"
                    >
                      {isTransmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-[#D4AF37]" />
                          <span>Establishing Secure SSA Connection...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#D4AF37]" />
                          <span>Transmit Electronic SSA-721 Notice Now</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Local Field Offices Directory */}
                <div className="border-t border-neutral-100 pt-5 space-y-3">
                  <h4 className="font-bold text-neutral-800 text-xs">
                    Designated Local Social Security Field Offices for Harlem & Manhattan Cases:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {NYC_SSA_FIELD_OFFICES.map((office) => (
                      <div
                        key={office.id}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          office.isPrimary
                            ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-200'
                            : 'bg-white border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-900">{office.name}</span>
                          {office.isPrimary && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.2 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 text-[11px]">{office.address}</p>
                        <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-500">
                          <span>{office.phone}</span>
                          <span>{office.distance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: OFFICIAL PRINT-READY SSA-721 PDF PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  Official Federal Reproduction • Form SSA-721 (04-2019)
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition flex items-center space-x-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certified Form SSA-721</span>
                </button>
              </div>

              {/* PRINT SHEET SIMULATION */}
              <div className="bg-white border-2 border-neutral-300 rounded-lg p-8 max-w-3xl mx-auto shadow-md text-neutral-900 font-sans space-y-6">
                
                {/* FORM HEADER */}
                <div className="border-b-2 border-black pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider block text-neutral-600">
                      SOCIAL SECURITY ADMINISTRATION
                    </span>
                    <h2 className="text-lg font-black tracking-tight uppercase">
                      Statement of Death by Funeral Director
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold block">Form SSA-721</span>
                    <span className="text-[10px] text-neutral-500 block">OMB No. 0960-0142</span>
                  </div>
                </div>

                {/* SECTION 1 */}
                <div className="border border-black p-3 space-y-2">
                  <div className="bg-neutral-200 font-bold text-xs uppercase px-1 py-0.5 tracking-wide">
                    1. Deceased Person's Information
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">a. Name of Deceased:</span>
                      <span className="font-semibold text-sm">{filing.decedentFullName}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">b. Social Security Number:</span>
                      <span className="font-mono font-bold text-sm">{filing.ssnMasked}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">c. Date of Birth:</span>
                      <span className="font-semibold">{filing.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">d. Date of Death:</span>
                      <span className="font-semibold">{filing.dateOfDeath}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">e. Sex of Deceased:</span>
                      <span className="font-semibold">{filing.sex}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 2 */}
                <div className="border border-black p-3 space-y-2">
                  <div className="bg-neutral-200 font-bold text-xs uppercase px-1 py-0.5 tracking-wide">
                    2. Surviving Widow or Widower
                  </div>
                  {filing.hasSurvivingSpouse ? (
                    <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <span className="font-bold text-[10px] block text-neutral-600 uppercase">a. Name of Surviving Spouse:</span>
                        <span className="font-semibold text-sm">{filing.spouseFullName}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[10px] block text-neutral-600 uppercase">b. Social Security Number:</span>
                        <span className="font-mono font-bold text-sm">{filing.spouseSsnMasked || 'XXX-XX-4819'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-[10px] block text-neutral-600 uppercase">c. Address & Telephone:</span>
                        <span className="font-semibold">{filing.spouseAddress} • {filing.spousePhone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-[10px] block text-neutral-600 uppercase">d. Living with Deceased at Death?</span>
                        <span className="font-semibold">{filing.livingTogetherAtDeath ? 'YES (Living in same household)' : 'NO'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs italic py-2 text-neutral-600">
                      No surviving spouse reported on record.
                    </div>
                  )}
                </div>

                {/* SECTION 3 */}
                <div className="border border-black p-3 space-y-2">
                  <div className="bg-neutral-200 font-bold text-xs uppercase px-1 py-0.5 tracking-wide">
                    3. Surviving Dependent Children (Under 18 or Disabled Before 22)
                  </div>
                  <div className="text-xs text-neutral-600 italic">
                    None reported.
                  </div>
                </div>

                {/* SECTION 4 */}
                <div className="border border-black p-3 space-y-2">
                  <div className="bg-neutral-200 font-bold text-xs uppercase px-1 py-0.5 tracking-wide">
                    4. Certification & Signature of Funeral Director
                  </div>
                  <p className="text-[10px] text-neutral-700 leading-tight">
                    I certify that I am a licensed funeral director and that I attended to the disposition of the remains of the deceased person named above.
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                    <div>
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">Name & Address of Funeral Home:</span>
                      <span className="font-bold block">Benta's Funeral Home, Inc.</span>
                      <span className="text-neutral-600 block">630 Saint Nicholas Ave, New York, NY 10030</span>
                      <span className="text-neutral-600 block">(212) 281-8850 • NYS Reg #08850</span>
                    </div>

                    <div>
                      <span className="font-bold text-[10px] block text-neutral-600 uppercase">Disposition Details:</span>
                      <span className="font-semibold block">{filing.dispositionType} on {filing.dispositionDate}</span>
                      <span className="text-neutral-600 block">{filing.cemeteryOrCrematoryName}</span>
                    </div>

                    <div className="col-span-2 border-t border-neutral-300 pt-2 flex items-end justify-between">
                      <div>
                        <div className="font-serif italic text-lg font-bold text-[#800000]">
                          {filing.certifyingDirector}
                        </div>
                        <span className="text-[10px] text-neutral-600 block">
                          Signature of Licensed Funeral Director (License #{filing.directorLicenseNumber})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">DATE CERTIFIED:</span>
                        <span className="font-semibold text-xs">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER BARCODE / TRANSMISSION SEAL */}
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-8 h-8 text-neutral-700" />
                    <div>
                      <span className="font-mono block font-bold text-neutral-800">
                        {filing.ssaConfirmationNumber || 'SSA-EVERS-PENDING'}
                      </span>
                      <span>Verified Digital Transmission</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span>New York State Electronic Death Registration System (EVERS)</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: SURVIVING SPOUSE $255 ADVISORY GUIDE */}
          {activeTab === 'survivor_guide' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-emerald-900 to-brass-900 text-white rounded-xl p-6 shadow-md space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-emerald-100">
                      Surviving Spouse Social Security Benefit Guide & Checklist
                    </h3>
                    <p className="text-xs text-neutral-300">
                      Prepared by Benta's Funeral Home for {filing.spouseFullName || 'the Surviving Next of Kin'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
                  Benta's Funeral Home has officially notified the Social Security Administration of the passing of <strong>{filing.decedentFullName}</strong> via Form SSA-721. Below is what the surviving family must know to claim federal benefits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card 1: $255 Lump-Sum Death Payment */}
                <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-sm">1. $255 Lump-Sum Death Benefit (LSDP)</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    A one-time federal payment of <strong>$255.00</strong> can be paid to the surviving spouse who was living in the same household with the deceased at the time of death.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-3 text-xs space-y-1.5 border border-neutral-200">
                    <div className="font-bold text-neutral-800">How to apply:</div>
                    <p className="text-neutral-600">
                      Call SSA at <strong>1-800-772-1213</strong> (TTY 1-800-325-0778) between 8:00 AM and 7:00 PM, or visit the <strong>Harlem Field Office at 55 W 125th St</strong>. You cannot apply online for the lump-sum payment.
                    </p>
                  </div>
                </div>

                {/* Card 2: Ongoing Survivor Benefits */}
                <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-3">
                  <div className="flex items-center space-x-2 text-brass-800">
                    <UserCheck className="w-5 h-5 text-brass-600" />
                    <h4 className="font-bold text-sm">2. Monthly Survivor Benefits</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Surviving spouses may be eligible to transition to the deceased spouse's monthly retirement benefit if that amount is higher than their own benefit:
                  </p>
                  <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside">
                    <li>At age 60 or older (or age 50 if disabled).</li>
                    <li>At any age if caring for the deceased’s child who is under 16.</li>
                    <li>Unmarried children up to age 18 (or 19 if in high school).</li>
                  </ul>
                </div>

              </div>

              {/* Checklist Table */}
              <div className="bg-white rounded-xl border border-[#E8E3DA] p-5 shadow-2xs space-y-3">
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                  Documents Needed When Contacting Social Security:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Certified NYC Death Certificate (Provided by BFH)</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Surviving Spouse's Social Security Card & Birth Certificate</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Marriage Certificate (Proof of Legal Marriage)</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Deceased's Most Recent W-2 or Self-Employment Tax Return</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct Deposit Bank Account & Routing Information</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>BFH Form SSA-721 Acknowledgment Copy</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-white border-t border-[#E8E3DA] px-6 py-3.5 flex items-center justify-between text-xs">
          <div className="text-neutral-500">
            Filing for: <span className="font-bold text-neutral-900">{currentCase.decedent.legalName}</span> ({currentCase.caseNumber})
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
                onSaveFiling(filing);
                onClose();
              }}
              className="px-5 py-2 bg-[#800000] text-white hover:bg-[#660000] rounded-xl font-bold cursor-pointer shadow-xs transition"
            >
              Save to Case & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
