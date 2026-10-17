import React, { useState } from 'react';
import { 
  GoldenRecordCase, 
  InsuranceAssignmentClaim 
} from '../../lib/types/funeral';
import { calculateInsuranceFactoring } from '../../lib/data/preNeedAndInsuranceData';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  Building2, 
  Calculator, 
  Send, 
  Zap, 
  X, 
  Sparkles, 
  FileText, 
  RefreshCw
} from 'lucide-react';

interface InsuranceRapidFundingBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: GoldenRecordCase[];
  activeCase?: GoldenRecordCase;
  claims: InsuranceAssignmentClaim[];
  onUpdateClaims: (updated: InsuranceAssignmentClaim[]) => void;
  onApplyFundingToCase?: (caseId: string, amount: number, claimRef: string) => void;
}

export const InsuranceRapidFundingBridgeModal: React.FC<InsuranceRapidFundingBridgeModalProps> = ({
  isOpen,
  onClose,
  cases,
  activeCase,
  claims,
  onUpdateClaims,
  onApplyFundingToCase
}) => {
  // Selected Case
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCase?.id || cases[0]?.id || '');
  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0] || activeCase;

  const [fundingPartner, setFundingPartner] = useState<'C&J Financial' | 'Express Funeral Funding' | 'Beta Capital'>('C&J Financial');
  
  // Carrier & Policy Inputs
  const [carrierName, setCarrierName] = useState('MetLife / Brighthouse Financial');
  const [policyNumber, setPolicyNumber] = useState('MET-9940128-WL');
  const [policyFaceValue, setPolicyFaceValue] = useState<number>(25000);
  const [beneficiaryName, setBeneficiaryName] = useState(selectedCase?.informant.fullName || 'Cheryl Vance');
  const [beneficiaryRelationship, setBeneficiaryRelationship] = useState(selectedCase?.informant.relationship || 'Daughter');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState(selectedCase?.informant.phone || '(212) 555-0199');
  const [beneficiaryEmail, setBeneficiaryEmail] = useState(selectedCase?.informant.email || 'beneficiary@gmail.com');
  const [factoringRate, setFactoringRate] = useState<number>(3.75); // 3.75% standard
  const [wireFee] = useState<number>(50);

  // Workflow Tabs
  const [activeTab, setActiveTab] = useState<'calculator' | 'claims_pipeline' | 'legal_assignment'>('calculator');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const contractTotal = selectedCase?.totalAmountDue || 8450;
  const factoringCalc = calculateInsuranceFactoring(contractTotal, policyFaceValue, factoringRate, wireFee);

  // Find existing claim for selected case if any
  const currentCaseClaim = claims.find(c => c.caseId === selectedCase?.id);

  // Handle Submit Claim to Funding Intermediary
  const handleSubmitNewClaim = () => {
    setIsSubmittingClaim(true);

    setTimeout(() => {
      const newClaimId = `INS-CLM-${Math.floor(1000 + Math.random() * 9000)}`;
      const newClaim: InsuranceAssignmentClaim = {
        id: newClaimId,
        caseId: selectedCase.id,
        caseNumber: selectedCase.caseNumber,
        decedentName: selectedCase.decedent.legalName,
        carrierName,
        policyNumber,
        policyFaceValue,
        fundingIntermediary: fundingPartner,
        beneficiaryName,
        beneficiaryRelationship,
        beneficiaryPhone,
        beneficiaryEmail,
        funeralHomeContractTotal: contractTotal,
        factoringFeePercentage: factoringRate,
        factoringFeeAmount: factoringCalc.factoringFeeAmount,
        wireProcessingFee: wireFee,
        netFuneralHomeWire: contractTotal,
        familySurplusRefund: factoringCalc.familySurplusRefund,
        claimStatus: 'submitted_for_verification',
        verificationChecklist: {
          policyInForceVerified: true,
          pastTwoYearContestability: true,
          noCollateralAssignments: true,
          beneficiariesConfirmed: true,
          deathCertificateUploaded: true,
          assignmentFormSigned: true
        },
        signedAssignmentDate: new Date().toISOString().split('T')[0],
        wireReferenceCode: `FED-WIRE-${fundingPartner.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: `Submitted to ${fundingPartner} for 24-hr advance wire. Form AP-47 contract balance covered.`
      };

      onUpdateClaims([newClaim, ...claims]);
      setIsSubmittingClaim(false);
      setSubmissionSuccess(`✓ Claim ${newClaimId} submitted to ${fundingPartner}! Wire of $${contractTotal.toLocaleString()} guaranteed within 24–48 hours.`);

      // Automatically apply billing allocation to the case
      if (onApplyFundingToCase) {
        onApplyFundingToCase(selectedCase.id, contractTotal, newClaimId);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-[#fcfbf9] w-full max-w-6xl h-[92vh] rounded-2xl border border-neutral-300 shadow-2xl flex flex-col overflow-hidden text-neutral-900">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-[#0d1527] via-[#162238] to-[#12161f] text-neutral-100 px-6 py-4 flex items-center justify-between border-b border-brass-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-brass-600 text-white flex items-center justify-center shadow-lg border border-brass-300/40">
              <Zap className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brass-100 tracking-tight">
                  Life Insurance Rapid-Funding & Assignment Bridge
                </h2>
                <span className="bg-emerald-400 text-neutral-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 24–48 Hr Wire Disbursement
                </span>
              </div>
              <p className="text-xs text-brass-200/70 font-light mt-0.5">
                C&J Financial & Express Funeral Funding Gateway • Eliminate 8-Week Carrier Delays • 100% Contract Payout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {submissionSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              <span>{submissionSuccess}</span>
            </div>
            <button onClick={() => setSubmissionSuccess(null)} className="text-emerald-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* WORKSPACE SUB-NAV */}
        <div className="bg-white border-b border-neutral-200 px-6 py-2.5 flex items-center justify-between text-xs">
          {/* Tabs */}
          <div className="flex items-center gap-2 font-bold">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'calculator' 
                  ? 'bg-brass-900 text-white shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Factoring & Wire Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('claims_pipeline')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'claims_pipeline' 
                  ? 'bg-brass-900 text-white shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Active Claims & Wire Pipeline ({claims.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('legal_assignment')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'legal_assignment' 
                  ? 'bg-brass-900 text-white shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Irrevocable Assignment Jurat</span>
            </button>
          </div>

          {/* Partner Selector */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 text-[11px] font-semibold">Funding Intermediary:</span>
            <select
              value={fundingPartner}
              onChange={(e) => setFundingPartner(e.target.value as any)}
              className="bg-neutral-100 border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-800 outline-none focus:border-brass-600"
            >
              <option value="C&J Financial">C&J Financial (Preferred Deathcare Funder)</option>
              <option value="Express Funeral Funding">Express Funeral Funding (24-hr ACH)</option>
              <option value="Beta Capital">Beta Capital Financial</option>
            </select>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: FACTORING & WIRE CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Case Selector Banner */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-semibold">Target Case:</span>
                  <select
                    value={selectedCaseId}
                    onChange={(e) => {
                      setSelectedCaseId(e.target.value);
                      const target = cases.find(c => c.id === e.target.value);
                      if (target) {
                        setBeneficiaryName(target.informant.fullName);
                        setBeneficiaryRelationship(target.informant.relationship);
                        setBeneficiaryPhone(target.informant.phone);
                        setBeneficiaryEmail(target.informant.email);
                      }
                    }}
                    className="font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 rounded-lg px-2.5 py-1.5 outline-none"
                  >
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} — {c.decedent.legalName} (${c.totalAmountDue.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 text-neutral-600">
                  <span>Contract Balance Due: <strong className="font-mono text-[#800000] text-sm">${contractTotal.toLocaleString()}</strong></span>
                  {currentCaseClaim && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Claim {currentCaseClaim.id} on File
                    </span>
                  )}
                </div>
              </div>

              {/* TWO COLUMN GRID: Inputs vs Output Split Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Policy & Carrier Inputs */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-lg text-neutral-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brass-700" />
                    <span>Insurance Carrier & Policy Information</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">Life Insurance Carrier *</label>
                      <input
                        type="text"
                        value={carrierName}
                        onChange={(e) => setCarrierName(e.target.value)}
                        placeholder="e.g. MetLife, Prudential, New York Life..."
                        className="w-full border rounded-xl p-2.5 text-neutral-900 focus:border-brass-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Policy / Certificate # *</label>
                        <input
                          type="text"
                          value={policyNumber}
                          onChange={(e) => setPolicyNumber(e.target.value)}
                          className="w-full border rounded-xl p-2.5 font-mono text-neutral-900 focus:border-brass-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Total Policy Face Value ($) *</label>
                        <input
                          type="number"
                          value={policyFaceValue}
                          onChange={(e) => setPolicyFaceValue(Number(e.target.value))}
                          className="w-full border rounded-xl p-2.5 font-mono font-bold text-neutral-900 focus:border-brass-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Designated Beneficiary *</label>
                        <input
                          type="text"
                          value={beneficiaryName}
                          onChange={(e) => setBeneficiaryName(e.target.value)}
                          className="w-full border rounded-xl p-2.5 text-neutral-900 focus:border-brass-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Relationship</label>
                        <input
                          type="text"
                          value={beneficiaryRelationship}
                          onChange={(e) => setBeneficiaryRelationship(e.target.value)}
                          className="w-full border rounded-xl p-2.5 text-neutral-900 focus:border-brass-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Beneficiary Phone</label>
                        <input
                          type="text"
                          value={beneficiaryPhone}
                          onChange={(e) => setBeneficiaryPhone(e.target.value)}
                          className="w-full border rounded-xl p-2.5 text-neutral-900 focus:border-brass-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Beneficiary Email</label>
                        <input
                          type="email"
                          value={beneficiaryEmail}
                          onChange={(e) => setBeneficiaryEmail(e.target.value)}
                          className="w-full border rounded-xl p-2.5 text-neutral-900 focus:border-brass-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* Factoring Rate Slider */}
                    <div className="pt-2 border-t space-y-1">
                      <div className="flex justify-between text-neutral-600">
                        <span>Funder Factoring Rate:</span>
                        <strong className="font-mono text-brass-800">{factoringRate}%</strong>
                      </div>
                      <input
                        type="range"
                        min="3.0"
                        max="5.0"
                        step="0.25"
                        value={factoringRate}
                        onChange={(e) => setFactoringRate(Number(e.target.value))}
                        className="w-full accent-brass-700 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-400">
                        <span>3.0% (Prime Tier)</span>
                        <span>3.75% (Standard C&J)</span>
                        <span>5.0% (High-Risk)</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right: Real-time Split Visualization & Wire Output */}
                <div className="bg-gradient-to-br from-[#0e1726] to-[#17253b] text-neutral-100 p-6 rounded-2xl border border-brass-400/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-brass-500/20">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                          Guaranteed Direct Wire Breakdown
                        </span>
                        <h4 className="font-serif text-xl font-bold text-white mt-0.5">
                          24-Hour Settlement Disbursement
                        </h4>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                        {fundingPartner}
                      </span>
                    </div>

                    {/* Big Numbers Grid */}
                    <div className="space-y-4 my-5">
                      {/* BFH Funeral Wire */}
                      <div className="bg-black/40 p-4 rounded-2xl border border-emerald-500/40 space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-300">
                          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Wire 1: Paid to Benta's Funeral Home Operating Account
                          </span>
                          <span className="font-mono text-neutral-400">100% Contract Cleared</span>
                        </div>
                        <div className="font-mono text-3xl font-black text-emerald-300">
                          ${contractTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-[11px] text-neutral-400 font-light">
                          Covers all professional services, Batesville casket, chapel, and cash advances. Form AP-47 marked PAID IN FULL.
                        </p>
                      </div>

                      {/* Beneficiary Family Surplus Wire */}
                      <div className="bg-black/40 p-4 rounded-2xl border border-brass-500/30 space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-300">
                          <span className="flex items-center gap-1.5 font-bold text-brass-300">
                            <Sparkles className="w-4 h-4 text-brass-400" />
                            Wire 2: Excess Policy Surplus Paid Directly to Family
                          </span>
                          <span className="font-mono text-neutral-400">Direct Deposit / ACH</span>
                        </div>
                        <div className="font-mono text-3xl font-black text-brass-200">
                          ${factoringCalc.familySurplusRefund.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-[11px] text-neutral-400 font-light">
                          Remainder of the ${policyFaceValue.toLocaleString()} policy wired directly to {beneficiaryName}.
                        </p>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="bg-black/20 p-3 rounded-xl border border-neutral-700/60 text-xs space-y-1 text-neutral-300">
                        <div className="flex justify-between">
                          <span>Factoring Discount Fee ({factoringRate}%):</span>
                          <span className="font-mono">${factoringCalc.factoringFeeAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Federal Reserve Wire Processing Fee:</span>
                          <span className="font-mono">${wireFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-neutral-700 font-bold text-white">
                          <span>Total Assigned from Policy:</span>
                          <span className="font-mono">${factoringCalc.totalAssignedFromPolicy.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-4 border-t border-brass-500/20">
                    <button
                      onClick={handleSubmitNewClaim}
                      disabled={isSubmittingClaim}
                      className="w-full bg-gradient-to-r from-brass-500 via-brass-600 to-[#800000] hover:from-brass-400 hover:to-[#6a0509] text-neutral-950 font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl border border-emerald-300 transition cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingClaim ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                          <span>Dispatching Claim & Verification to {fundingPartner}...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-neutral-950" />
                          <span>Submit & Lock 24-Hour Wire Disbursement</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-neutral-400 mt-2">
                      Carrier verification runs concurrently. Funds wired within 24 to 48 hours of death certificate receipt.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ACTIVE CLAIMS & WIRE PIPELINE */}
          {activeTab === 'claims_pipeline' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between border-b pb-4 border-neutral-200">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-neutral-900">
                    Active Insurance Assignment Claims Pipeline
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Real-time status of carrier approvals, Fedwire disbursements, and family surplus transfers.
                  </p>
                </div>
              </div>

              {/* Claims Cards */}
              <div className="space-y-4">
                {claims.map(claim => {
                  return (
                    <div
                      key={claim.id}
                      className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4"
                    >
                      {/* Top Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-brass-800 bg-brass-100 px-2.5 py-0.5 rounded">
                              {claim.id}
                            </span>
                            <span className="text-xs font-bold text-neutral-900">
                              Case {claim.caseNumber}: {claim.decedentName}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            Carrier: <strong>{claim.carrierName}</strong> (Policy #{claim.policyNumber}) • Funder: <strong>{claim.fundingIntermediary}</strong>
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {claim.claimStatus === 'funds_cleared_in_bfh' ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Funds Cleared in Operating Account
                            </span>
                          ) : claim.claimStatus === 'approved_wire_pending' ? (
                            <span className="px-3 py-1 rounded-full bg-brass-100 text-brass-800 font-bold text-xs border border-brass-300 flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-brass-600" />
                              Wire Dispatched • Clearing Today
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300 flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-600" />
                              Carrier Underwriting In Review
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: 5 Step Pipeline Graphic */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-semibold">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
                          <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                          <span>1. Intake Submitted</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center">
                          <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                          <span>2. Policy Verified</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border text-center ${
                          claim.claimStatus !== 'carrier_in_review' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                        }`}>
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <span>3. Carrier Approval</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border text-center ${
                          claim.claimStatus === 'funds_cleared_in_bfh' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                        }`}>
                          <DollarSign className="w-4 h-4 mx-auto mb-1" />
                          <span>4. Wire to BFH (${claim.netFuneralHomeWire.toLocaleString()})</span>
                        </div>
                        <div className={`p-2.5 rounded-xl border text-center ${
                          claim.claimStatus === 'funds_cleared_in_bfh' ? 'bg-brass-50 text-brass-800 border-brass-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                        }`}>
                          <Sparkles className="w-4 h-4 mx-auto mb-1" />
                          <span>5. Surplus to Family (${claim.familySurplusRefund.toLocaleString()})</span>
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                        <div className="flex items-center gap-4">
                          <span>Beneficiary: <strong>{claim.beneficiaryName}</strong></span>
                          {claim.wireReferenceCode && (
                            <span className="font-mono font-bold text-neutral-800">
                              Fedwire Ref: {claim.wireReferenceCode}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-neutral-500 italic">
                          {claim.notes}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: IRREVOCABLE ASSIGNMENT JURAT */}
          {activeTab === 'legal_assignment' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-neutral-200">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-neutral-900">
                    Irrevocable Assignment of Life Insurance Proceeds
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Statutory legal assignment and limited power of attorney executed by the named beneficiary.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-800 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Print Legal Document</span>
                </button>
              </div>

              {/* Jurat Preview Box */}
              <div className="bg-white p-8 rounded-2xl border-2 border-neutral-300 shadow-sm font-serif text-xs leading-relaxed space-y-4 text-neutral-800">
                <div className="text-center space-y-1 pb-4 border-b">
                  <h4 className="font-bold text-sm tracking-widest uppercase text-[#7f1d1d]">
                    IRREVOCABLE ASSIGNMENT OF LIFE INSURANCE PROCEEDS & LIMITED POWER OF ATTORNEY
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-sans">
                    STATE OF NEW YORK • COUNTY OF NEW YORK
                  </p>
                </div>

                <p>
                  FOR VALUE RECEIVED, the undersigned Beneficiary, <strong>{beneficiaryName}</strong>, does hereby irrevocably assign, transfer, and set over unto <strong>{fundingPartner}</strong>, as servicing agent for <strong>Benta's Funeral Home, Inc.</strong>, the sum of <strong>${contractTotal.toLocaleString()}</strong>, plus applicable processing and wire fees, out of the proceeds of Life Insurance Policy Number <strong>{policyNumber}</strong>, issued by <strong>{carrierName}</strong> upon the life of the deceased, <strong>{selectedCase.decedent.legalName}</strong>.
                </p>

                <p>
                  The undersigned hereby directs the said Insurance Carrier to pay said assigned amount directly to <strong>{fundingPartner} / Benta's Funeral Home, Inc.</strong> and to remit the balance of the policy proceeds, estimated at <strong>${factoringCalc.familySurplusRefund.toLocaleString()}</strong>, directly to the undersigned beneficiary.
                </p>

                <p className="text-[11px] bg-neutral-50 p-3 rounded-xl border border-neutral-200 font-sans">
                  <strong>LIMITED POWER OF ATTORNEY:</strong> The undersigned hereby irrevocably appoints {fundingPartner} as attorney-in-fact to execute claimant statement proofs of loss, endorse checks, drafts, or warrants issued by said insurance company in payment of said policy, and apply the proceeds in accordance with this agreement.
                </p>

                <div className="pt-6 grid grid-cols-2 gap-8 font-sans text-xs">
                  <div className="border-t border-neutral-400 pt-2">
                    <span className="text-neutral-500 text-[10px]">Beneficiary Signature:</span>
                    <div className="font-serif italic text-sm text-neutral-900 mt-1">{beneficiaryName}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Date: {new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="border-t border-neutral-400 pt-2">
                    <span className="text-neutral-500 text-[10px]">Licensed Funeral Director:</span>
                    <div className="font-serif italic text-sm text-neutral-900 mt-1">Jason Benta (LFD)</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Benta's Funeral Home, Inc. • Reg # 01844</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
