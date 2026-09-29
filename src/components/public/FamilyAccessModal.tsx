import React, { useState } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  UserCheck, 
  ArrowRight, 
  X, 
  Heart, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

interface FamilyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: GoldenRecordCase[];
  onAuthenticateFamily: (targetCase: GoldenRecordCase) => void;
  onOpenDirectorPortal: () => void;
}

export const FamilyAccessModal: React.FC<FamilyAccessModalProps> = ({
  isOpen,
  onClose,
  cases,
  onAuthenticateFamily,
  onOpenDirectorPortal
}) => {
  const [caseNumberInput, setCaseNumberInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCaseNum = caseNumberInput.trim().toUpperCase();

    if (!cleanCaseNum) {
      setErrorMessage('Please enter your BFH Case Number (e.g. BFH-2026-0891).');
      return;
    }

    // Lookup case
    const matched = cases.find(c => 
      c.caseNumber.toUpperCase() === cleanCaseNum ||
      c.id.toLowerCase() === cleanCaseNum.toLowerCase() ||
      c.decedent.legalName.toLowerCase().includes(cleanCaseNum.toLowerCase()) ||
      c.informant.fullName.toLowerCase().includes(cleanCaseNum.toLowerCase())
    );

    if (matched) {
      onAuthenticateFamily(matched);
      onClose();
    } else {
      setErrorMessage(`No active case found matching "${caseNumberInput}". Please check your service arrangement packet or SMS invitation.`);
    }
  };

  const handleSelectPreVerifiedFamily = (targetCase: GoldenRecordCase) => {
    onAuthenticateFamily(targetCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-neutral-900 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#065f46] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6 text-[#065f46]" />
          </div>
          <h2 className="font-serif-title font-bold text-2xl text-neutral-900">
            Private Family Portal Vault
          </h2>
          <p className="text-xs text-neutral-600 max-w-md mx-auto font-light leading-relaxed">
            Enter your confidential <strong>Case Number & Access Code</strong> provided during your arrangement conference to access your family's private obituary studio, legal documents, and tribute wall.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center gap-2.5 text-[11px] text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Isolated Family Security:</strong> Families only have access to their own loved one's arrangements, vital statistics, and memorial gallery.
          </span>
        </div>

        {/* Manual Lookup Form */}
        <form onSubmit={handleLookup} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              BFH Case Number or Decedent Name *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={caseNumberInput}
                onChange={(e) => setCaseNumberInput(e.target.value)}
                placeholder="e.g. BFH-2026-0891 or Eleanor Vance"
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 font-bold text-neutral-900 outline-none focus:border-[#065f46] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Family Security PIN / Access Code (Optional in Preview)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="4-Digit Security PIN (Default: 1928)"
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 font-mono text-neutral-900 outline-none focus:border-[#065f46] shadow-2xs"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#065f46] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs border border-amber-300/30"
          >
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>Unlock My Family Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick-Access Verified Demo Families */}
        <div className="pt-2 border-t border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Active Family Case Vaults (Quick Access)
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
              Instant Verify
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectPreVerifiedFamily(c)}
                className="p-3 bg-neutral-50 hover:bg-emerald-50/50 hover:border-[#065f46] border border-neutral-200 rounded-xl text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-[#065f46] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-mono">
                    {c.caseNumber}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-neutral-300 group-hover:text-emerald-500 transition" />
                </div>
                <div className="mt-1.5">
                  <div className="font-serif-title font-bold text-xs text-neutral-900 group-hover:text-[#065f46] transition leading-tight">
                    {c.decedent.legalName}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-light truncate">
                    NOK: {c.informant.fullName} ({c.informant.relationship})
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Director Portal Link */}
        <div className="pt-2 border-t border-neutral-100 text-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDirectorPortal();
            }}
            className="text-[11px] text-neutral-500 hover:text-[#065f46] transition font-medium flex items-center justify-center gap-1 mx-auto"
          >
            <Lock className="w-3 h-3 text-neutral-400" />
            <span>Are you a BFH Licensed Director or Staff? Access Back-Office Console →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
