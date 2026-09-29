import React, { useState } from 'react';
import { GoldenRecordCase, SplitBillingItem } from '../../lib/types/funeral';
import { generateCashAdvanceChecks } from '../../lib/utils/checkGenerator';
import { CashAdvanceCheckPrinterModal } from './CashAdvanceCheckPrinterModal';
import { FamilySplitPaymentPortal } from '../family/FamilySplitPaymentPortal';
import { 
  CheckCircle, 
  Plus, 
  Calculator, 
  FileCheck2, 
  HandCoins, 
  Printer,
  Users,
  Layers
} from 'lucide-react';

interface FinancialVerificationCenterProps {
  caseData: GoldenRecordCase;
  onUpdateBilling: (updatedBilling: SplitBillingItem[]) => void;
  onOpenQuickBooks?: (targetCase: GoldenRecordCase) => void;
  onOpenCheckPrinter?: (targetCase: GoldenRecordCase) => void;
}

export const FinancialVerificationCenter: React.FC<FinancialVerificationCenterProps> = ({
  caseData,
  onUpdateBilling,
  onOpenQuickBooks,
  onOpenCheckPrinter
}) => {
  const [financialTab, setFinancialTab] = useState<'matrix' | 'family_split_portal'>('matrix');
  const [showAddPayer, setShowAddPayer] = useState(false);
  const [isCheckPrinterOpen, setIsCheckPrinterOpen] = useState(false);
  const [payerType, setPayerType] = useState<SplitBillingItem['payerType']>('Life Insurance Assignment');
  const [providerName, setProviderName] = useState('C&J Financial / Mutual of Omaha');
  const [policyNumber, setPolicyNumber] = useState('MO-449102');
  const [amount, setAmount] = useState<number>(3500);

  // Life Insurance Assignment Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);
  const [carrierName, setCarrierName] = useState('MetLife / Brighthouse Financial');
  const [policyFaceValue, setPolicyFaceValue] = useState<number>(15000);
  const [beneficiaryName, setBeneficiaryName] = useState(caseData.informant.fullName);
  const [assignmentFeeRate, setAssignmentFeeRate] = useState<number>(3.75); // 3.75% standard assignment fee
  const [fundingAssignmentAdded, setFundingAssignmentAdded] = useState(false);

  // Calculations
  const contractTotal = caseData.totalAmountDue;
  const assignmentFeeAmount = Math.round(contractTotal * (assignmentFeeRate / 100));
  const totalAssignedFromPolicy = contractTotal + assignmentFeeAmount;
  const excessRefundToBeneficiary = Math.max(0, policyFaceValue - totalAssignedFromPolicy);
  const netBfhPayout = contractTotal;

  const handleAddSplitItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: SplitBillingItem = {
      payerType,
      providerName,
      policyNumber: payerType === 'Life Insurance Assignment' ? policyNumber : undefined,
      amountAllocated: amount,
      status: 'pending_verification',
      notes: 'Added to split billing allocation matrix'
    };

    onUpdateBilling([...caseData.splitBilling, newItem]);
    setShowAddPayer(false);
  };

  const handleApplyInsuranceAssignment = () => {
    const newItem: SplitBillingItem = {
      payerType: 'Life Insurance Assignment',
      providerName: `${carrierName} (via C&J Funding)`,
      policyNumber: `POL-${Date.now().toString().slice(-6)}`,
      amountAllocated: contractTotal,
      status: 'verified_active',
      notes: `Verified face value: $${policyFaceValue.toLocaleString()}. Assignment fee ($${assignmentFeeAmount.toLocaleString()}) factored. Estimated family excess refund: $${excessRefundToBeneficiary.toLocaleString()}.`
    };

    onUpdateBilling([...caseData.splitBilling, newItem]);
    setFundingAssignmentAdded(true);
    setTimeout(() => setFundingAssignmentAdded(false), 3000);
  };

  const handleVerifyItem = (index: number) => {
    const copy = [...caseData.splitBilling];
    copy[index].status = 'verified_active';
    copy[index].notes = 'Verified active with insurance carrier / ACH clearance confirmed';
    onUpdateBilling(copy);
  };

  const totalAllocated = caseData.splitBilling.reduce((acc, curr) => acc + curr.amountAllocated, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-neutral-900 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif-title text-xl font-bold text-neutral-900">
              Financial Verification & Life Insurance Funding Hub
            </h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              ACH & Insurance Assignment
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 font-light">
            Managing insurance assignments, ACH direct bank transfers, and split payments for Case <strong className="text-[#991b1b] font-semibold">{caseData.caseNumber}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenQuickBooks && (
            <button
              onClick={() => onOpenQuickBooks(caseData)}
              className="bg-[#2ca01c] hover:bg-[#238016] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition shadow-sm"
              title="Sync Invoices and Bills directly with QuickBooks Online"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>
                {caseData.quickbooksSync?.syncStatus === 'synced' ? 'QuickBooks: Synced ✓' : 'QuickBooks Online Sync'}
              </span>
            </button>
          )}

          <button
            onClick={() => setShowAddPayer(true)}
            className="bg-[#991b1b] hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition shadow-sm border border-amber-400/40"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Add Split Payer / Source</span>
          </button>
        </div>
      </div>

      {/* Financial Center Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-100 p-2 rounded-2xl border border-neutral-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFinancialTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              financialTab === 'matrix'
                ? 'bg-[#991b1b] text-white shadow-md'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Insurance Assignment & Split Matrix</span>
          </button>

          <button
            onClick={() => setFinancialTab('family_split_portal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              financialTab === 'family_split_portal'
                ? 'bg-emerald-800 text-white shadow-md ring-2 ring-amber-400'
                : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Family Split-Pay & Contribution Portal ({caseData.splitBilling.length} Payers)</span>
          </button>
        </div>

        {financialTab === 'matrix' && (
          <button
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
            className="text-xs text-neutral-600 hover:text-neutral-900 font-bold px-3 py-1.5 rounded-lg bg-white border border-neutral-200 transition"
          >
            {isCalculatorOpen ? 'Hide Insurance Calculator' : 'Show Insurance Calculator'}
          </button>
        )}
      </div>

      {/* Render Selected View */}
      {financialTab === 'family_split_portal' ? (
        <FamilySplitPaymentPortal
          caseData={caseData}
          onUpdateBilling={onUpdateBilling}
          onOpenQuickBooks={onOpenQuickBooks}
          isStaffMode={true}
        />
      ) : (
        <>
          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Total Contract Due</span>
              <p className="font-serif-title text-2xl font-bold text-neutral-900">${caseData.totalAmountDue.toLocaleString()}</p>
              <span className="text-[10px] text-neutral-400">100% Itemized NYS Form AP-47</span>
            </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Allocated & Verified</span>
          <p className="font-serif-title text-2xl font-bold text-emerald-700">${totalAllocated.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600">Covered by Insurance Assignment / ACH</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">Unallocated Balance</span>
          <p className="font-serif-title text-2xl font-bold text-[#991b1b]">
            ${Math.max(0, caseData.totalAmountDue - totalAllocated).toLocaleString()}
          </p>
          <span className="text-[10px] text-neutral-400">Remaining to be settled before service</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LIFE INSURANCE ASSIGNMENT & FUNDING CALCULATOR             */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-[#fcfbfa] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#991b1b]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-title text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Life Insurance Claim Assignment & Direct Funding Calculator
              </h3>
              <p className="text-[11px] text-neutral-500 font-light">
                Calculate insurance assignment clearinghouse fees, net funeral home payout, and beneficiary refund.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
            className="text-xs text-[#991b1b] font-bold hover:underline"
          >
            {isCalculatorOpen ? 'Collapse Calculator ▲' : 'Open Calculator ▼'}
          </button>
        </div>

        {isCalculatorOpen && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Input Configuration */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Insurance Carrier / Provider</label>
                <select
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#991b1b]"
                >
                  <option value="MetLife / Brighthouse Financial">MetLife / Brighthouse Financial</option>
                  <option value="Prudential Financial">Prudential Financial</option>
                  <option value="New York Life Insurance Company">New York Life Insurance Company</option>
                  <option value="Lincoln Heritage Life Insurance">Lincoln Heritage Life Insurance</option>
                  <option value="Mutual of Omaha">Mutual of Omaha</option>
                  <option value="Northwestern Mutual">Northwestern Mutual</option>
                  <option value="Globe Life & Accident">Globe Life & Accident</option>
                  <option value="Other Verified Carrier">Other Carrier (Direct Assignment)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Verified Policy Face Value ($)</label>
                  <input
                    type="number"
                    value={policyFaceValue}
                    onChange={(e) => setPolicyFaceValue(Number(e.target.value))}
                    className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold text-neutral-900 outline-none focus:border-[#991b1b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Assignment Fee Rate (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.25"
                      value={assignmentFeeRate}
                      onChange={(e) => setAssignmentFeeRate(Number(e.target.value))}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold text-neutral-900 outline-none focus:border-[#991b1b]"
                    />
                    <span className="text-neutral-500 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Primary Policy Beneficiary</label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. Marcus Vance (Son & Beneficiary)"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#991b1b]"
                />
              </div>

              {/* Assignment Checklist */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5 text-[11px] text-neutral-600">
                <span className="font-bold text-neutral-900 block">Required Assignment Documents:</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Certified Copy of Death Certificate (NYS Form VR-45)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Irrevocable Assignment of Proceeds Agreement Form</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Original Policy Document or Lost Policy Affidavit</span>
                </div>
              </div>
            </div>

            {/* Right: Live Calculation Output Card */}
            <div className="lg:col-span-6 bg-[#fbfbfd] border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold text-neutral-700">Funeral Contract Amount Due:</span>
                  <strong className="font-mono text-sm text-neutral-900">${contractTotal.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                  <span className="text-xs text-neutral-600">
                    C&J Assignment Processing Fee ({assignmentFeeRate}%):
                  </span>
                  <strong className="font-mono text-xs text-amber-800">+${assignmentFeeAmount.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold text-neutral-900">
                    Total Assigned from Policy:
                  </span>
                  <strong className="font-mono text-sm text-[#991b1b] font-bold">${totalAssignedFromPolicy.toLocaleString()}</strong>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-950">Net Payout to Benta's Funeral Home:</span>
                    <strong className="font-mono text-base text-emerald-800">${netBfhPayout.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-900 pt-1 border-t border-emerald-200/60">
                    <span>Excess Proceeds Returned to {beneficiaryName}:</span>
                    <strong className="font-mono font-bold text-emerald-700">${excessRefundToBeneficiary.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {fundingAssignmentAdded ? (
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Insurance Assignment Applied to Split Billing!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleApplyInsuranceAssignment}
                    className="w-full bg-[#991b1b] hover:bg-red-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2 border border-amber-300/40"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-300" />
                    <span>Apply Insurance Assignment to Split Billing</span>
                  </button>
                )}
                <span className="text-[10px] text-neutral-400 block text-center">
                  Direct electronic assignment authorization via C&J Financial clearinghouse.
                </span>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Split Billing Allocation Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
          <h3 className="font-serif-title text-sm font-bold text-neutral-900 uppercase tracking-wider">
            Split Payment Allocations & Carrier Verification Status
          </h3>
          <span className="text-xs text-neutral-500 font-medium">{caseData.splitBilling.length} Funding Sources</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {caseData.splitBilling.map((item, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-neutral-50/80 transition">
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-neutral-900 text-sm">{item.payerType}</span>
                  <span className="text-neutral-500">• {item.providerName}</span>
                </div>
                {item.policyNumber && (
                  <p className="text-[11px] text-[#991b1b] font-mono font-medium">
                    Policy / Claim Number: {item.policyNumber} (Assignment to Benta's Funeral Home)
                  </p>
                )}
                {item.notes && (
                  <p className="text-[11px] text-neutral-500 italic font-light">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-neutral-900">${item.amountAllocated.toLocaleString()}</span>
                  <span className={`block text-[10px] font-bold uppercase ${
                    item.status === 'funded' || item.status === 'verified_active'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                {item.status === 'pending_verification' && (
                  <button
                    onClick={() => handleVerifyItem(idx)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Verify Policy</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION II CASH ADVANCE PASS-THROUGH CHECKS LEDGER       */}
      {/* ========================================================= */}
      {(() => {
        const checks = caseData.statementOfGoods?.cashAdvanceChecks && caseData.statementOfGoods.cashAdvanceChecks.length > 0
          ? caseData.statementOfGoods.cashAdvanceChecks
          : generateCashAdvanceChecks(caseData);
        const totalChecksAmount = checks.reduce((sum, c) => sum + c.amount, 0);

        return (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#991b1b]">
                  <HandCoins className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-serif-title text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Form AP-47 Section II Pass-Through Checks & Accounts Payable Ledger
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-light">
                    100% Pass-through disbursements paid to third-party vendors on family's behalf (0% BFH markup).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[#991b1b] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  Total: ${totalChecksAmount.toFixed(2)} ({checks.length} checks)
                </span>
                <button
                  onClick={() => onOpenCheckPrinter ? onOpenCheckPrinter(caseData) : setIsCheckPrinterOpen(true)}
                  className="bg-[#991b1b] hover:bg-red-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm border border-amber-300/40"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open 3-Part Check Printer</span>
                </button>
              </div>
            </div>

            {checks.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">
                No active cash advance disbursements generated for this case.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {checks.map((check) => (
                  <div key={check.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-neutral-50/80 transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-300 text-[11px]">
                          {check.checkNumber}
                        </span>
                        <span className="font-bold text-neutral-900 text-sm">{check.payeeName}</span>
                        <span className="text-neutral-500">• {check.categoryLabel}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px]">
                        <span className="text-neutral-500 font-medium">MEMO:</span>
                        <code className="bg-amber-50 text-[#991b1b] px-1.5 py-0.5 rounded font-mono text-[10px] border border-amber-200">
                          {check.memo}
                        </code>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Drawn on: {check.bankAccount} • Service Date: {check.serviceDate}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-neutral-900">
                          ${check.amount.toFixed(2)}
                        </span>
                        <span className={`block text-[10px] font-bold uppercase ${
                          check.status === 'hand_delivered_at_service' || check.status === 'reconciled_cleared'
                            ? 'text-emerald-700'
                            : check.status === 'check_printed'
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }`}>
                          {check.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenCheckPrinter ? onOpenCheckPrinter(caseData) : setIsCheckPrinterOpen(true)}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-lg border border-neutral-300 transition text-[11px] flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3 text-neutral-600" />
                        <span>View Voucher</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
      </>
      )}

      {/* 3-Part Check Voucher Printer Modal */}
      {isCheckPrinterOpen && (
        <CashAdvanceCheckPrinterModal
          isOpen={isCheckPrinterOpen}
          onClose={() => setIsCheckPrinterOpen(false)}
          caseData={caseData}
        />
      )}

      {/* Add Payer Modal */}
      {showAddPayer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-neutral-900">
            <h3 className="font-serif-title font-bold text-lg text-neutral-900">
              Add Split Billing / Insurance Source
            </h3>

            <form onSubmit={handleAddSplitItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Funding Type</label>
                <select
                  value={payerType}
                  onChange={(e) => setPayerType(e.target.value as any)}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#991b1b] outline-none"
                >
                  <option value="Cash / Certified Bank Check">Cash / Certified Bank Check (BFH Office Receipt)</option>
                  <option value="Life Insurance Assignment">Life Insurance Assignment (C&J Financial)</option>
                  <option value="Family ACH Direct">Family ACH Direct Bank Transfer</option>
                  <option value="County/Grant Aid">County / Social Services Burial Grant</option>
                  <option value="Credit Card">Credit Card / Split Pay</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Provider / Carrier Name</label>
                <input
                  type="text"
                  required
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Lincoln Heritage, New York Life, Chase ACH"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#991b1b] outline-none"
                />
              </div>

              {payerType === 'Life Insurance Assignment' && (
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Policy / Certificate Number</label>
                  <input
                    type="text"
                    required
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    placeholder="e.g. NYL-882019"
                    className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#991b1b] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Amount Allocated ($)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#991b1b] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPayer(false)}
                  className="px-3.5 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#991b1b] hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg transition shadow-sm border border-amber-300/40"
                >
                  Save Funding Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
