import React, { useState } from 'react';
import { 
  PreNeedTrustAccount, 
  GoldenRecordCase 
} from '../../lib/types/funeral';
import { 
  calculatePreNeedAccrual, 
  convertPreNeedToAtNeedCase 
} from '../../lib/data/preNeedAndInsuranceData';
import { 
  ShieldCheck, 
  Landmark, 
  FileText, 
  Plus, 
  Search, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  X, 
  Sparkles,
  Lock,
  Building2,
  Percent,
  Download
} from 'lucide-react';

interface PreNeedTrustVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: PreNeedTrustAccount[];
  onUpdateAccounts: (updated: PreNeedTrustAccount[]) => void;
  cases: GoldenRecordCase[];
  onAddCase: (newCase: GoldenRecordCase) => void;
  onSelectCase: (caseItem: GoldenRecordCase) => void;
}

export const PreNeedTrustVaultModal: React.FC<PreNeedTrustVaultModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onUpdateAccounts,
  cases,
  onAddCase,
  onSelectCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'irrevocable_medicaid' | 'revocable_standard' | 'converted_at_need'>('all');
  const [selectedAccount, setSelectedAccount] = useState<PreNeedTrustAccount | null>(accounts[0] || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'medicaid_shield' | 'interest_1099' | 'services'>('overview');
  
  // New Account Wizard State
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newPurchaserName, setNewPurchaserName] = useState('');
  const [newRelationship, setNewRelationship] = useState('Self');
  const [newDob, setNewDob] = useState('1950-01-01');
  const [newSsnLast4, setNewSsnLast4] = useState('');
  const [newPhone, setNewPhone] = useState('(212) 555-0100');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('New York, NY 10030');
  const [newTrustType, setNewTrustType] = useState<PreNeedTrustAccount['trustType']>('irrevocable_medicaid');
  const [newDepository, setNewDepository] = useState<PreNeedTrustAccount['escrowDepository']>('PrePlan (NYSFDA Trust)');
  const [newPrincipal, setNewPrincipal] = useState<number>(10000);
  const [newDisposition, setNewDisposition] = useState<'full_burial' | 'cremation_memorial'>('full_burial');
  const [newCasket, setNewCasket] = useState('Batesville Promethean Bronze');
  const [newCasketPrice, setNewCasketPrice] = useState(3800);
  const [newVault, setNewVault] = useState('Milso Venetian Triune Concrete Burial Vault');
  const [newVaultPrice, setNewVaultPrice] = useState(1650);
  const [newServicePrice, setNewServicePrice] = useState(4550);

  // Conversion Confirmation Dialog
  const [isConversionConfirmOpen, setIsConversionConfirmOpen] = useState(false);
  const [conversionSuccessMessage, setConversionSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.purchaserName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'converted_at_need') return acc.status === 'converted_at_need';
    return acc.trustType === filterType && acc.status !== 'converted_at_need';
  });

  // Portfolio aggregates
  const totalPrincipal = accounts.reduce((sum, a) => sum + a.initialPrincipal, 0);
  const totalBalance = accounts.reduce((sum, a) => sum + a.currentTotalBalance, 0);
  const totalInterest = accounts.reduce((sum, a) => sum + a.accumulatedInterest, 0);
  const medicaidProtectedCount = accounts.filter(a => a.trustType === 'irrevocable_medicaid' && a.status === 'active_accumulating').length;

  // Handle 1-Click At-Need Conversion
  const handleConvertAccount = () => {
    if (!selectedAccount) return;
    const { updatedAccount, newCase } = convertPreNeedToAtNeedCase(selectedAccount, cases.length);

    // Update accounts list
    const updatedList = accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a);
    onUpdateAccounts(updatedList);
    setSelectedAccount(updatedAccount);

    // Add case to main system
    onAddCase(newCase);
    setIsConversionConfirmOpen(false);

    setConversionSuccessMessage(`✓ Successfully converted Pre-Need Trust to Active Case ${newCase.caseNumber} with $${updatedAccount.currentTotalBalance.toLocaleString()} applied to Statement of Goods!`);
    
    // Select the newly created case
    onSelectCase(newCase);
  };

  // Handle Create New Pre-Need Account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PNT-2026-${String(accounts.length + 885).padStart(3, '0')}`;
    const dateToday = new Date().toISOString().split('T')[0];
    const totalContract = newPrincipal;

    const newAcc: PreNeedTrustAccount = {
      id: newId,
      clientName: newClientName,
      purchaserName: newPurchaserName || newClientName,
      relationship: newRelationship,
      clientDob: newDob,
      clientSsnMasked: newSsnLast4 ? `***-**-${newSsnLast4}` : '***-**-0000',
      phone: newPhone,
      email: newEmail,
      address: newAddress,
      trustType: newTrustType,
      escrowDepository: newDepository,
      accountNumber: `${newDepository.slice(0, 3).toUpperCase()}-NY-${Math.floor(100000 + Math.random() * 900000)}`,
      depositDate: dateToday,
      initialPrincipal: newPrincipal,
      accumulatedInterest: 0,
      adminFeeRate: 0.75,
      currentTotalBalance: newPrincipal,
      medicaidSpendDownCertified: newTrustType === 'irrevocable_medicaid',
      medicaidNoticeNumber: newTrustType === 'irrevocable_medicaid' ? `NYC-HRA-MED-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      status: 'active_accumulating',
      selectedServices: {
        dispositionType: newDisposition,
        servicePackageName: 'Harlem Sanctuary Traditional Service',
        servicePackagePrice: newServicePrice,
        casketName: newCasket,
        casketPrice: newCasketPrice,
        outerBurialVault: newVault,
        vaultPrice: newVaultPrice,
        cashAdvancesTotal: Math.max(0, totalContract - (newServicePrice + newCasketPrice + newVaultPrice)),
        totalContractPrice: totalContract
      },
      assignedDirector: 'Jason Benta',
      notes: `${newTrustType === 'irrevocable_medicaid' ? 'Irrevocable Medicaid Trust' : 'Revocable Trust'} established on ${dateToday}. Deposited in ${newDepository} pursuant to NY GBL § 453.`
    };

    onUpdateAccounts([newAcc, ...accounts]);
    setSelectedAccount(newAcc);
    setIsNewAccountModalOpen(false);
  };

  const selectedAccrual = selectedAccount ? calculatePreNeedAccrual(selectedAccount.initialPrincipal, selectedAccount.depositDate) : null;

  return (
    <div className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-[#fcfbf9] w-full max-w-7xl h-[92vh] rounded-2xl border border-neutral-300 shadow-2xl flex flex-col overflow-hidden text-neutral-900">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-[#1a1412] via-[#2d1210] to-[#12161f] text-neutral-100 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 flex items-center justify-center shadow-lg border border-amber-300/40">
              <Landmark className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 tracking-tight">
                  NYS Pre-Need Trust & Medicaid Spend-Down Vault
                </h2>
                <span className="bg-amber-400 text-neutral-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  NY GBL § 453 Compliant
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-light mt-0.5">
                100% Escrow Trust Custody • Irrevocable Medicaid / SSI Asset Protection • 1-Click At-Need Conversion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewAccountModalOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-md border border-amber-300"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Trust</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METRICS BANNER */}
        <div className="bg-white border-b border-neutral-200 px-6 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800 border border-amber-200">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 uppercase font-semibold">Total Escrow Vault</span>
              <div className="font-mono text-base font-bold text-neutral-900">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <span className="text-[10px] text-neutral-400">Principal: ${totalPrincipal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 uppercase font-semibold">Medicaid Shielded</span>
              <div className="font-mono text-base font-bold text-emerald-700">{medicaidProtectedCount} Active Trusts</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brass-50 rounded-xl text-brass-800 border border-brass-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 uppercase font-semibold">Accrued Net Interest</span>
              <div className="font-mono text-base font-bold text-brass-700">+${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brass-50 rounded-xl text-brass-800 border border-brass-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 uppercase font-semibold">NYS Depositories</span>
              <div className="font-bold text-neutral-900 text-xs">PrePlan • M&T • Flagstar</div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {conversionSuccessMessage && (
          <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              <span>{conversionSuccessMessage}</span>
            </div>
            <button 
              onClick={() => setConversionSuccessMessage(null)}
              className="text-emerald-100 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MAIN BODY: 2 COLUMN WORKSPACE */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT COLUMN: ACCOUNTS LIST & FILTERS */}
          <div className="w-full md:w-80 lg:w-96 border-r border-neutral-200 bg-white flex flex-col">
            
            {/* Search & Filters */}
            <div className="p-4 border-b border-neutral-200 space-y-3 bg-[#faf9f5]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search client, ID, trust #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-amber-600 outline-none"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterType === 'all' ? 'bg-[#800000] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All ({accounts.length})
                </button>
                <button
                  onClick={() => setFilterType('irrevocable_medicaid')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                    filterType === 'irrevocable_medicaid' ? 'bg-emerald-700 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>Medicaid Shield</span>
                </button>
                <button
                  onClick={() => setFilterType('revocable_standard')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterType === 'revocable_standard' ? 'bg-brass-700 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Revocable
                </button>
                <button
                  onClick={() => setFilterType('converted_at_need')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterType === 'converted_at_need' ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Converted
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
              {filteredAccounts.map(account => {
                const isSelected = selectedAccount?.id === account.id;
                const isConverted = account.status === 'converted_at_need';

                return (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className={`p-4 transition cursor-pointer ${
                      isSelected ? 'bg-amber-50/70 border-l-4 border-amber-600' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-neutral-500 font-bold">{account.id}</span>
                      {isConverted ? (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                          Converted At-Need
                        </span>
                      ) : account.trustType === 'irrevocable_medicaid' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Medicaid Shield
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                          Revocable Trust
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-neutral-900 truncate">
                      {account.clientName}
                    </h4>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-[11px] text-neutral-500 truncate max-w-[130px]">
                        {account.escrowDepository}
                      </span>
                      <span className="font-mono font-bold text-neutral-900">
                        ${account.currentTotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredAccounts.length === 0 && (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No pre-need trust accounts match this filter.
                </div>
              )}
            </div>

            {/* List Footer */}
            <div className="p-3 border-t border-neutral-200 text-[11px] text-neutral-500 bg-neutral-50 text-center">
              Displaying {filteredAccounts.length} of {accounts.length} trust accounts
            </div>
          </div>

          {/* RIGHT COLUMN: ACCOUNT DETAIL & ACTION PANELS */}
          {selectedAccount ? (
            <div className="flex-1 flex flex-col overflow-y-auto bg-white">
              
              {/* Account Detail Header */}
              <div className="p-6 border-b border-neutral-200 bg-gradient-to-b from-[#fcfbf9] to-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 px-2.5 py-0.5 bg-amber-100 rounded-md border border-amber-300">
                        {selectedAccount.id}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        Deposited: {selectedAccount.depositDate}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-600 font-medium">
                        Depository Account: <strong className="font-mono">{selectedAccount.accountNumber}</strong>
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl lg:text-3xl font-bold text-neutral-900 mt-1">
                      {selectedAccount.clientName}
                    </h3>

                    <p className="text-xs text-neutral-600 mt-1">
                      Purchaser: <strong>{selectedAccount.purchaserName}</strong> ({selectedAccount.relationship}) • Phone: {selectedAccount.phone} • Residence: {selectedAccount.address}
                    </p>
                  </div>

                  {/* Big Action: Convert to At-Need */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    {selectedAccount.status !== 'converted_at_need' ? (
                      <button
                        onClick={() => setIsConversionConfirmOpen(true)}
                        className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg border border-amber-300/40 transition group"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                        <span>Convert to Active At-Need Case</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </button>
                    ) : (
                      <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-3 text-xs text-neutral-600">
                        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Active Case Generated</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Converted on {selectedAccount.convertedAt}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-2 mt-6 border-b border-neutral-200 pb-0 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'overview' 
                        ? 'border-[#800000] text-[#800000]' 
                        : 'border-transparent text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Trust Balance & Ledger</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('medicaid_shield')}
                    className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'medicaid_shield' 
                        ? 'border-emerald-600 text-emerald-700' 
                        : 'border-transparent text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Medicaid Spend-Down Shield</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('interest_1099')}
                    className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'interest_1099' 
                        ? 'border-brass-600 text-brass-700' 
                        : 'border-transparent text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Interest & 1099-INT Tax</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('services')}
                    className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === 'services' 
                        ? 'border-amber-600 text-amber-700' 
                        : 'border-transparent text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Pre-Selected Merchandise</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Trust Balance & Ledger */}
              {activeTab === 'overview' && (
                <div className="p-6 space-y-6">
                  
                  {/* Balance Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <span className="text-[11px] uppercase font-semibold text-neutral-500">Initial Principal Deposited</span>
                      <div className="font-mono text-xl font-bold text-neutral-900 mt-1">
                        ${selectedAccount.initialPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-neutral-400">100% Escrow deposit</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] uppercase font-semibold text-emerald-700">Accumulated Net Interest</span>
                      <div className="font-mono text-xl font-bold text-emerald-800 mt-1">
                        +${selectedAccount.accumulatedInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-emerald-600">After 0.75% statutory admin fee</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-300">
                      <span className="text-[11px] uppercase font-semibold text-amber-900">Current Total Trust Asset</span>
                      <div className="font-mono text-2xl font-black text-[#800000] mt-1">
                        ${selectedAccount.currentTotalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-amber-800 font-medium">Available for At-Need settlement</span>
                    </div>
                  </div>

                  {/* Trust Details & Legal Jurat */}
                  <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-3">
                    <h4 className="font-serif font-bold text-base text-neutral-900 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-amber-700" />
                      <span>Statutory Escrow Depository Verification</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-500">Master Trust Institution:</span>
                        <div className="font-bold text-neutral-900">{selectedAccount.escrowDepository}</div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Escrow Account Number:</span>
                        <div className="font-mono font-bold text-neutral-900">{selectedAccount.accountNumber}</div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Legal Trust Classification:</span>
                        <div className="font-bold text-neutral-900">
                          {selectedAccount.trustType === 'irrevocable_medicaid' 
                            ? 'Irrevocable Pre-Funded Trust (Medicaid / SSI Protected)' 
                            : 'Revocable Pre-Funded Trust'}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Supervising Licensed Director:</span>
                        <div className="font-bold text-neutral-900">{selectedAccount.assignedDirector}</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-500 italic pt-2 border-t border-neutral-100">
                      {selectedAccount.notes}
                    </p>
                  </div>

                  {/* NYS GBL 453 Statutory Notice */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-neutral-700 space-y-1">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>New York General Business Law § 453 Disclosure</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      New York State law requires 100% of all pre-need funeral funds to be deposited in an interest-bearing escrow account within 10 business days of receipt. All principal and accrued interest remain the property of the purchaser/beneficiary until services are delivered.
                    </p>
                  </div>

                </div>
              )}

              {/* Tab 2: Medicaid Spend-Down Shield */}
              {activeTab === 'medicaid_shield' && (
                <div className="p-6 space-y-6">
                  
                  {/* Status Banner */}
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                    selectedAccount.trustType === 'irrevocable_medicaid'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className={`p-2 rounded-xl text-white ${
                      selectedAccount.trustType === 'irrevocable_medicaid' ? 'bg-emerald-700' : 'bg-amber-700'
                    }`}>
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-lg">
                          {selectedAccount.trustType === 'irrevocable_medicaid' 
                            ? 'Medicaid & SSI Asset Protection Shield Active' 
                            : 'Standard Revocable Trust (Not Shielded for Medicaid)'}
                        </h4>
                        {selectedAccount.medicaidNoticeNumber && (
                          <span className="font-mono text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                            Notice: {selectedAccount.medicaidNoticeNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">
                        {selectedAccount.trustType === 'irrevocable_medicaid'
                          ? 'This account has been irrevocably assigned pursuant to New York Social Services Law § 141 and General Business Law § 453. The funds held in this trust ($' + selectedAccount.currentTotalBalance.toLocaleString() + ') are an EXEMPT ASSET and CANNOT be counted toward Medicaid eligibility or nursing home spend-down.'
                          : 'This is currently a revocable trust. To protect these funds from Medicaid nursing home spend-down or SSI look-backs, the agreement must be converted to an Irrevocable Trust agreement.'}
                      </p>
                    </div>
                  </div>

                  {/* Printable Medicaid Verification Certificate Box */}
                  <div className="p-6 rounded-2xl border-2 border-neutral-300 bg-[#fffdfa] shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-neutral-200">
                      <div>
                        <h5 className="font-serif font-bold text-base text-neutral-900">
                          Official NYS Irrevocable Trust Verification Certificate
                        </h5>
                        <p className="text-[11px] text-neutral-500">
                          For submission to NYC Human Resources Administration (HRA) Medicaid Caseworker or Skilled Nursing Facility
                        </p>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-800 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Verification for HRA</span>
                      </button>
                    </div>

                    <div className="text-xs space-y-3 font-serif leading-relaxed text-neutral-800 p-4 bg-white rounded-xl border border-neutral-200">
                      <p className="font-bold text-center uppercase tracking-wider text-sm text-[#7f1d1d]">
                        CERTIFICATE OF IRREVOCABLE PRE-NEED TRUST CREATION
                      </p>
                      <p>
                        This is to certify that <strong>{selectedAccount.clientName}</strong> (SSN: {selectedAccount.clientSsnMasked}), residing at {selectedAccount.address}, has established an <strong>Irrevocable Pre-Need Funeral Trust</strong> with Benta's Funeral Home, Inc. (630 Saint Nicholas Ave, New York, NY 10030) in the principal amount of <strong>${selectedAccount.initialPrincipal.toLocaleString()}</strong>.
                      </p>
                      <p>
                        Deposited with Trustee: <strong>{selectedAccount.escrowDepository}</strong> under Account Number <strong>{selectedAccount.accountNumber}</strong>.
                      </p>
                      <p className="text-[11px] italic bg-neutral-50 p-2.5 rounded border border-neutral-200">
                        "Pursuant to New York General Business Law Section 453 and New York Social Services Law Section 141, this agreement is IRREVOCABLE and cannot be refunded, withdrawn, or used for any purpose other than funeral and burial goods and services. Said funds are an exempt resource for Medicaid and Supplemental Security Income (SSI) eligibility determination."
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 3: Interest & 1099-INT Tax */}
              {activeTab === 'interest_1099' && (
                <div className="p-6 space-y-6">
                  
                  {/* Calculation Details */}
                  {selectedAccrual && (
                    <div className="p-5 rounded-2xl bg-brass-50/50 border border-brass-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-brass-950 flex items-center gap-2">
                          <Percent className="w-4 h-4 text-brass-700" />
                          <span>Compound Interest & Trustee Administration Breakdown</span>
                        </h4>
                        <span className="text-xs font-mono font-bold text-brass-900 bg-brass-100 px-2 py-0.5 rounded">
                          {selectedAccrual.diffYears} Years on Deposit
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-brass-200">
                          <span className="text-neutral-500">Gross Annual Rate:</span>
                          <div className="font-mono font-bold text-neutral-900 text-sm">3.25% APY</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-brass-200">
                          <span className="text-neutral-500">NYS Trustee Fee (0.75%):</span>
                          <div className="font-mono font-bold text-neutral-900 text-sm">-${selectedAccrual.annualAdminFee}/yr</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-brass-200">
                          <span className="text-neutral-500">Net APY Growth:</span>
                          <div className="font-mono font-bold text-emerald-700 text-sm">2.50% Net</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-brass-200">
                          <span className="text-neutral-500">Net Growth to Date:</span>
                          <div className="font-mono font-bold text-brass-800 text-sm">+${selectedAccrual.compoundInterest}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1099-INT Statements */}
                  <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-neutral-900">Annual IRS Form 1099-INT Reporting</h5>
                        <p className="text-[11px] text-neutral-500">IRS tax notices generated automatically by Master Trustee</p>
                      </div>
                      <button 
                        onClick={() => alert(`1099-INT tax year summary downloaded for ${selectedAccount.clientName}`)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download 1099-INT</span>
                      </button>
                    </div>

                    <div className="border rounded-xl divide-y text-xs">
                      <div className="p-3 flex items-center justify-between bg-neutral-50">
                        <span className="font-bold">Tax Year 2025 (Issued by PrePlan)</span>
                        <span className="font-mono text-emerald-700 font-bold">+$321.40 Interest Reported</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="font-bold">Tax Year 2024 (Issued by PrePlan)</span>
                        <span className="font-mono text-emerald-700 font-bold">+$310.80 Interest Reported</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 4: Pre-Selected Merchandise */}
              {activeTab === 'services' && (
                <div className="p-6 space-y-4">
                  <h4 className="font-serif font-bold text-base text-neutral-900">
                    Pre-Funded Merchandise & Funeral Package Specifications
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                      <span className="text-neutral-500 font-semibold uppercase text-[10px]">Service Package Selection</span>
                      <div className="font-bold text-neutral-900 text-sm">{selectedAccount.selectedServices.servicePackageName}</div>
                      <div className="font-mono text-neutral-700">${selectedAccount.selectedServices.servicePackagePrice.toLocaleString()}</div>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                      <span className="text-neutral-500 font-semibold uppercase text-[10px]">Casket Selection</span>
                      <div className="font-bold text-neutral-900 text-sm">{selectedAccount.selectedServices.casketName || 'To Be Selected'}</div>
                      <div className="font-mono text-neutral-700">${(selectedAccount.selectedServices.casketPrice || 0).toLocaleString()}</div>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                      <span className="text-neutral-500 font-semibold uppercase text-[10px]">Outer Burial Container / Vault</span>
                      <div className="font-bold text-neutral-900 text-sm">{selectedAccount.selectedServices.outerBurialVault || 'Standard Concrete'}</div>
                      <div className="font-mono text-neutral-700">${(selectedAccount.selectedServices.vaultPrice || 0).toLocaleString()}</div>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                      <span className="text-neutral-500 font-semibold uppercase text-[10px]">Cash Advance Reserve</span>
                      <div className="font-bold text-neutral-900 text-sm">Cemetery, Clergy, Permits & Transcripts</div>
                      <div className="font-mono text-neutral-700">${selectedAccount.selectedServices.cashAdvancesTotal.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-950">Total Pre-Funded Contract Guarantee:</span>
                    <span className="font-mono font-black text-base text-[#800000]">
                      ${selectedAccount.selectedServices.totalContractPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-neutral-400">
              Select an account from the left ledger to view details.
            </div>
          )}

        </div>

      </div>

      {/* CONFIRMATION MODAL: 1-CLICK AT-NEED CONVERSION */}
      {isConversionConfirmOpen && selectedAccount && (
        <div className="fixed inset-0 z-[9995] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-neutral-300 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#800000] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Convert to Active At-Need Case?
              </h3>
              <p className="text-xs text-neutral-600">
                You are converting <strong>{selectedAccount.clientName}</strong> ({selectedAccount.id}) into an active at-need funeral case.
              </p>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1 text-neutral-800">
              <div className="flex justify-between">
                <span>Trust Balance Transferred:</span>
                <strong className="font-mono text-emerald-700">${selectedAccount.currentTotalBalance.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Merchandise & Package:</span>
                <strong>{selectedAccount.selectedServices.servicePackageName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Pre-Need Escrow Depository:</span>
                <strong>{selectedAccount.escrowDepository}</strong>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 italic text-center">
              A new case will be added to the active cases pipeline with all vital details and trust credit applied to Form AP-47.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConversionConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConvertAccount}
                className="px-5 py-2.5 bg-[#800000] hover:bg-[#6a0509] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Confirm & Open Case</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PRE-NEED ENROLLMENT WIZARD MODAL */}
      {isNewAccountModalOpen && (
        <div className="fixed inset-0 z-[9995] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-neutral-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Enroll New NYS Pre-Need Funeral Trust
                </h3>
              </div>
              <button onClick={() => setIsNewAccountModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400 hover:text-neutral-700" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              
              {/* Beneficiary Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Beneficiary Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Mary Jackson"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Purchaser & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Purchaser Name</label>
                  <input
                    type="text"
                    placeholder="Leave blank if self"
                    value={newPurchaserName}
                    onChange={(e) => setNewPurchaserName(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Relationship</label>
                  <input
                    type="text"
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">SSN (Last 4)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="4 digits"
                    value={newSsnLast4}
                    onChange={(e) => setNewSsnLast4(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700 font-mono"
                  />
                </div>
              </div>

              {/* Contact & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Residence Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Merchandise Allocation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Casket Selection</label>
                  <input
                    type="text"
                    value={newCasket}
                    onChange={(e) => setNewCasket(e.target.value)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Casket Price ($)</label>
                  <input
                    type="number"
                    value={newCasketPrice}
                    onChange={(e) => setNewCasketPrice(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Outer Vault ($)</label>
                  <input
                    type="number"
                    value={newVaultPrice}
                    onChange={(e) => setNewVaultPrice(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700 font-mono"
                  />
                </div>
              </div>
              <div className="hidden">
                <input value={newVault} onChange={(e) => setNewVault(e.target.value)} />
                <input value={newServicePrice} onChange={(e) => setNewServicePrice(Number(e.target.value))} />
              </div>

              {/* Trust Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Trust Legal Type *</label>
                  <select
                    value={newTrustType}
                    onChange={(e) => setNewTrustType(e.target.value as any)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  >
                    <option value="irrevocable_medicaid">Irrevocable Medicaid / SSI Spend-Down Shield</option>
                    <option value="revocable_standard">Revocable Trust (Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Master Depository *</label>
                  <select
                    value={newDepository}
                    onChange={(e) => setNewDepository(e.target.value as any)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  >
                    <option value="PrePlan (NYSFDA Trust)">PrePlan (NYSFDA Master Trust)</option>
                    <option value="M&T Bank Escrow">M&T Bank Escrow</option>
                    <option value="Flagstar / Signature Bank Escrow">Flagstar / Signature Bank Escrow</option>
                    <option value="Amalgamated Bank NY">Amalgamated Bank NY</option>
                  </select>
                </div>
              </div>

              {/* Deposit Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Initial Principal Deposit ($) *</label>
                  <input
                    type="number"
                    required
                    value={newPrincipal}
                    onChange={(e) => setNewPrincipal(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-neutral-900 font-mono text-sm outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Disposition Preference</label>
                  <select
                    value={newDisposition}
                    onChange={(e) => setNewDisposition(e.target.value as any)}
                    className="w-full border rounded-lg p-2 text-neutral-900 outline-none focus:border-amber-700"
                  >
                    <option value="full_burial">Full Traditional Burial</option>
                    <option value="cremation_memorial">Cremation with Memorial</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewAccountModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#800000] hover:bg-[#6a0509] text-white rounded-xl font-bold shadow-md"
                >
                  Register & Create Trust Escrow
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
