import React, { useState } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { 
  X, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw, 
  Receipt, 
  Building2, 
  CreditCard
} from 'lucide-react';

interface QuickBooksSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase?: GoldenRecordCase;
  caseItem?: GoldenRecordCase;
  onUpdateCase?: (updated: GoldenRecordCase) => void;
  onSaveSync?: (syncData: any) => void;
  onSendNotification?: (notif: any) => void;
}

export const QuickBooksSyncModal: React.FC<QuickBooksSyncModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  caseItem: propCaseItem,
  onUpdateCase,
  onSaveSync,
  onSendNotification
}) => {
  const caseItem = activeCase || propCaseItem;
  if (!isOpen || !caseItem) return null;

  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'invoice' | 'bills' | 'reconciliation'>('invoice');

  const qbo = caseItem.quickbooksSync || {
    invoiceNumber: `INV-${caseItem.caseNumber}`,
    syncStatus: 'not_synced',
    totalAmount: caseItem.totalAmountDue,
    balanceRemaining: caseItem.totalAmountDue - caseItem.totalPaid,
    billsGenerated: [
      { vendorName: 'Woodlawn Cemetery & Crematory', category: 'Crematory Cash Advance', amount: 595, billNumber: `BILL-WD-${caseItem.caseNumber.slice(-3)}`, status: 'synced' },
      { vendorName: 'Harlem Livery & Transport Fleet', category: 'Hearse & Limousine Fleet', amount: 950, billNumber: `BILL-LIV-${caseItem.caseNumber.slice(-3)}`, status: 'synced' },
      { vendorName: 'Harlem Florist Guild', category: 'Floral Standing Spray', amount: 350, billNumber: `BILL-FL-${caseItem.caseNumber.slice(-3)}`, status: 'pending' }
    ]
  };

  const handleSyncInvoice = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const updatedSync = {
        ...qbo,
        invoiceNumber: qbo.invoiceNumber || `INV-${caseItem.caseNumber}`,
        syncStatus: 'synced' as const,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qboInvoiceId: `QBO-${Math.floor(10000 + Math.random() * 90000)}`,
        totalAmount: caseItem.totalAmountDue,
        balanceRemaining: caseItem.totalAmountDue - caseItem.totalPaid
      };

      const updated: GoldenRecordCase = {
        ...caseItem,
        quickbooksSync: updatedSync,
        notes: [
          {
            id: `note-${Date.now()}`,
            author: 'QuickBooks Online Sync Hub',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `AP-47 Statement itemization ($${caseItem.totalAmountDue.toLocaleString()}) synced to QuickBooks Online as Invoice #${qbo.invoiceNumber}.`
          },
          ...caseItem.notes
        ]
      };
      onUpdateCase?.(updated);
      onSaveSync?.(updatedSync);
      onSendNotification?.({
        id: `notif-${Date.now()}`,
        caseId: caseItem.id,
        decedentName: caseItem.decedent.legalName,
        recipientName: 'Accounting / Finance',
        recipientPhone: '(212) 281-8850',
        channel: 'sms',
        type: 'portal_update',
        title: '📊 QuickBooks Invoice Synced',
        bodyText: `Invoice #${qbo.invoiceNumber} ($${caseItem.totalAmountDue.toFixed(2)}) synced with Intuit QuickBooks Online.`,
        sentAt: 'Just now',
        status: 'delivered'
      });
    }, 800);
  };

  const handleGenerateVendorBill = (vendorName: string) => {
    const updatedBills = (qbo.billsGenerated || []).map(b => {
      if (b.vendorName === vendorName) {
        return { ...b, status: 'synced' as const };
      }
      return b;
    });

    const updatedSync = {
      ...qbo,
      billsGenerated: updatedBills
    };

    const updated: GoldenRecordCase = {
      ...caseItem,
      quickbooksSync: updatedSync,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'QuickBooks Online Sync Hub',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Generated 1099 Accounts Payable Vendor Bill in QuickBooks for ${vendorName}.`
        },
        ...caseItem.notes
      ]
    };
    onUpdateCase?.(updated);
    onSaveSync?.(updatedSync);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-neutral-300">
        
        {/* Modal Header */}
        <div className="bg-[#107c41] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-sm border-b border-emerald-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <DollarSign className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif-title font-bold text-lg tracking-wide text-white">
                  Intuit QuickBooks® Online Accounting Hub
                </h2>
                <span className="px-2 py-0.5 bg-emerald-900/60 border border-emerald-300 text-emerald-200 text-[10px] font-bold uppercase rounded-md flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>QBO Live Sync Active</span>
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Automated Form AP-47 Invoicing, 1099 Trade Vendor Disbursements & ACH Bank Reconciliation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-6 pt-3 flex space-x-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`pb-2.5 px-2 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'invoice'
                ? 'border-[#107c41] text-[#107c41]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>1. Customer Invoice (AP-47 Statement)</span>
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className={`pb-2.5 px-2 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'bills'
                ? 'border-[#107c41] text-[#107c41]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>2. 1099 Vendor Bills & Cash Advances</span>
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`pb-2.5 px-2 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'reconciliation'
                ? 'border-[#107c41] text-[#107c41]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. ACH & Payment Reconciliation</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-neutral-50/50">
          
          {/* Active Case Financial Summary */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-500">Case:</span>
                <span className="font-bold text-sm text-neutral-900">{caseItem.caseNumber}</span>
                <span className="text-xs font-medium text-neutral-600">• {caseItem.decedent.legalName}</span>
              </div>
              <div className="text-xs text-neutral-600 flex items-center space-x-2">
                <span>Account Payer: <strong>{caseItem.informant.fullName}</strong></span>
                <span>•</span>
                <span>Assigned Director: {caseItem.assignedDirector}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-[11px] font-bold text-neutral-500">Total Statement:</div>
                <div className="text-base font-bold text-neutral-900">${caseItem.totalAmountDue.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-neutral-500">Paid / Synced:</div>
                <div className="text-base font-bold text-emerald-700">${caseItem.totalPaid.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-neutral-500">Balance:</div>
                <div className="text-base font-bold text-[#991b1b]">${(caseItem.totalAmountDue - caseItem.totalPaid).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* TAB 1: Customer Invoice (AP-47 Statement) */}
          {activeTab === 'invoice' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-[#107c41]" />
                    <span>QuickBooks Online Customer Invoice #{qbo.invoiceNumber}</span>
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    qbo.syncStatus === 'synced'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-[#b45309] border border-amber-300'
                  }`}>
                    {qbo.syncStatus === 'synced' ? '✓ Synced with QBO' : 'Pending QBO Push'}
                  </span>
                </div>

                {/* Line Items Breakdown */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                      <tr>
                        <th className="p-3">QBO Item / Account</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="p-3 font-semibold text-neutral-900">4010 · Professional Funeral Services</td>
                        <td className="p-3 text-neutral-600">Basic Arrangements & Supervision (NYS § 77.8)</td>
                        <td className="p-3 text-right font-bold text-neutral-900">$3,450.00</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-900">4020 · Merchandise & Casket/Urn</td>
                        <td className="p-3 text-neutral-600">{caseItem.serviceSelections.casketOrUrnSelected}</td>
                        <td className="p-3 text-right font-bold text-neutral-900">${caseItem.serviceSelections.casketPrice.toLocaleString()}.00</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-900">2010 · Cash Advances (Disbursements)</td>
                        <td className="p-3 text-neutral-600">Woodlawn Crematory/Cemetery & Certified Death Certificates</td>
                        <td className="p-3 text-right font-bold text-neutral-900">$1,200.00</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-neutral-900">4030 · Livery Fleet & Facilities</td>
                        <td className="p-3 text-neutral-600">{caseItem.serviceSelections.viewingParlor} & Hearse Transport</td>
                        <td className="p-3 text-right font-bold text-neutral-900">$1,800.00</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-neutral-50 font-bold text-xs border-t border-neutral-200">
                      <tr>
                        <td colSpan={2} className="p-3 text-right">Total Invoice Amount:</td>
                        <td className="p-3 text-right text-sm text-[#107c41] font-extrabold">${caseItem.totalAmountDue.toLocaleString()}.00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 1-Click Sync Trigger */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-neutral-500">
                    {qbo.lastSyncedAt ? `Last Synced: ${qbo.lastSyncedAt} (ID: ${qbo.qboInvoiceId})` : 'Ready to push to QuickBooks'}
                  </div>
                  <button
                    onClick={handleSyncInvoice}
                    disabled={isSyncing}
                    className="bg-[#107c41] hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 transition"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                        <span>Syncing to QuickBooks...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 text-emerald-200" />
                        <span>{qbo.syncStatus === 'synced' ? 'Re-Sync AP-47 Invoice' : '1-Click Sync to QuickBooks'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 1099 Vendor Bills & Cash Advances */}
          {activeTab === 'bills' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#107c41]" />
                    <span>QuickBooks Accounts Payable 1099 Vendor Bills</span>
                  </h3>
                  <span className="text-xs text-neutral-500">Automated Cash Advance & Trade Disbursements</span>
                </div>

                <div className="space-y-3">
                  {(qbo.billsGenerated || []).map((bill, index) => (
                    <div key={index} className="flex flex-wrap items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs gap-3">
                      <div>
                        <div className="font-bold text-neutral-900">{bill.vendorName}</div>
                        <div className="text-[11px] text-neutral-500">{bill.category} • Bill #{bill.billNumber}</div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-neutral-900">${bill.amount.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          bill.status === 'synced'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {bill.status === 'synced' ? '✓ Synced in QBO' : 'Pending Sync'}
                        </span>
                        {bill.status !== 'synced' && (
                          <button
                            onClick={() => handleGenerateVendorBill(bill.vendorName)}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                          >
                            Push Bill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACH & Payment Reconciliation */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#107c41]" />
                    <span>ACH Bank & Life Insurance Split Payment Reconciliation</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-700">Bank Feed Matched</span>
                </div>

                <div className="space-y-3">
                  {caseItem.splitBilling.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-neutral-900 block">{item.payerType}</span>
                        <span className="text-[11px] text-neutral-500">{item.providerName || 'Direct Payment'} {item.policyNumber ? `(Policy #${item.policyNumber})` : ''}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-neutral-900">${item.amountAllocated.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          item.status === 'funded'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {item.status === 'funded' ? '✓ Reconciled & Funded' : 'Pending Bank Clear'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-100 border-t border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-neutral-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Connected to Benta's Funeral Home Intuit QuickBooks Online Account</span>
          </div>
          <button
            onClick={onClose}
            className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Close QuickBooks Hub
          </button>
        </div>

      </div>
    </div>
  );
};
