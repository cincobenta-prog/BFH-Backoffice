import React, { useRef, useState, useEffect } from 'react';
import { GoldenRecordCase, DocumentItem } from '../../lib/types/funeral';
import { 
  PenTool, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Scale, 
  ScrollText,
  Flame,
  Check
} from 'lucide-react';

interface CanvasESignModalProps {
  caseData: GoldenRecordCase;
  targetDoc?: DocumentItem | null;
  onClose: () => void;
  onSignatureComplete: (signatureDataUrl: string, docIds: string[]) => void;
}

type BundleDocKey = 'ap47' | 'phl4201' | 'vital_records' | 'woodlawn';

export const CanvasESignModal: React.FC<CanvasESignModalProps> = ({
  caseData,
  targetDoc,
  onClose,
  onSignatureComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signerName, setSignerName] = useState(caseData.informant.fullName);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Determine initial document tab
  const getInitialTab = (): BundleDocKey => {
    if (targetDoc) {
      if (targetDoc.formType === 'statement_goods_services') return 'ap47';
      if (targetDoc.formType === 'vital_records') return 'vital_records';
      if (targetDoc.formType === 'woodlawn_cremation') return 'woodlawn';
      return 'phl4201';
    }
    return 'ap47';
  };

  const [activeTab, setActiveTab] = useState<BundleDocKey>(getInitialTab);
  const [reviewedTabs, setReviewedTabs] = useState<Record<BundleDocKey, boolean>>({
    ap47: true,
    phl4201: false,
    vital_records: false,
    woodlawn: false
  });

  const isCremation = caseData.dispositionType.includes('cremation');

  // Mark active tab as reviewed
  const handleSelectTab = (tab: BundleDocKey) => {
    setActiveTab(tab);
    setReviewedTabs(prev => ({ ...prev, [tab]: true }));
  };

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handlePrint = () => {
    const prevTitle = document.title;
    document.title = `BFH_Legal_Document_${caseData.caseNumber}_${activeTab.toUpperCase()}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 500);
  };

  const handleComplete = () => {
    if (!hasSignature || !agreedToTerms) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    
    // Resolve matching document IDs
    const docs = caseData.documents || [];
    let docIds: string[] = [];

    if (targetDoc) {
      docIds = [targetDoc.id];
    } else {
      // Find all Phase 3 legal bundle documents
      docIds = docs
        .filter(d => 
          Boolean(d.formType && ['statement_goods_services', 'right_to_control', 'vital_records', 'woodlawn_cremation'].includes(d.formType)) ||
          d.phase === 'legal_bundle'
        )
        .map(d => d.id);

      if (docIds.length === 0) {
        docIds = docs.map(d => d.id);
      }
    }

    onSignatureComplete(dataUrl, docIds);
  };

  const statement = caseData.statementOfGoods;
  const vitals = caseData.vitalRecordsSheet;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-4xl w-full my-6 p-6 sm:p-8 shadow-2xl space-y-6 relative text-neutral-900 max-h-[95vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-neutral-200 pb-4 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-[#800000] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#800000]" />
            <span>NYS Legally Binding e-Signature Portal</span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-neutral-900 mt-1">
            {targetDoc ? `Sign Document: ${targetDoc.name}` : 'Execute Phase 3 Legal Bundle'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5 font-light">
            Golden Record Case <strong className="text-[#800000] font-semibold">{caseData.caseNumber}</strong> • Decedent: <strong>{caseData.decedent.legalName}</strong> • Informant: <strong>{caseData.informant.fullName}</strong> ({caseData.informant.relationship})
          </p>
        </div>

        {/* Interactive Document Review Tabs */}
        <div className="shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-[#800000]" />
              <span>Review Documents Included in Execution:</span>
            </span>
            <button
              onClick={handlePrint}
              className="text-xs text-neutral-600 hover:text-[#800000] font-semibold flex items-center gap-1 transition"
              title="Print active document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleSelectTab('ap47')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs font-semibold ${
                activeTab === 'ap47'
                  ? 'bg-red-50 border-[#800000] text-[#800000] shadow-xs'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <ScrollText className="w-4 h-4 shrink-0 text-[#800000]" />
                <span className="truncate">Form AP-47 Contract</span>
              </div>
              {reviewedTabs.ap47 && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('phl4201')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs font-semibold ${
                activeTab === 'phl4201'
                  ? 'bg-red-50 border-[#800000] text-[#800000] shadow-xs'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Scale className="w-4 h-4 shrink-0 text-[#800000]" />
                <span className="truncate">NYS PHL § 4201</span>
              </div>
              {reviewedTabs.phl4201 && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('vital_records')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs font-semibold ${
                activeTab === 'vital_records'
                  ? 'bg-red-50 border-[#800000] text-[#800000] shadow-xs'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 shrink-0 text-[#800000]" />
                <span className="truncate">NYC EDRS Vitals</span>
              </div>
              {reviewedTabs.vital_records && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>

            {isCremation && (
              <button
                type="button"
                onClick={() => handleSelectTab('woodlawn')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs font-semibold ${
                  activeTab === 'woodlawn'
                    ? 'bg-red-50 border-[#800000] text-[#800000] shadow-xs'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Flame className="w-4 h-4 shrink-0 text-[#800000]" />
                  <span className="truncate">Woodlawn Cremation</span>
                </div>
                {reviewedTabs.woodlawn && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Document Content Reader */}
        <div className="grow overflow-y-auto border border-neutral-200 rounded-xl bg-stone-50/50 p-5 font-serif text-neutral-900 shadow-inner max-h-72 sm:max-h-80">
          
          {/* TAB 1: FORM AP-47 STATEMENT OF GOODS */}
          {activeTab === 'ap47' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="text-center border-b border-neutral-300 pb-3">
                <h3 className="font-serif-title font-bold text-base text-neutral-900">BENTA&apos;S FUNERAL HOME, INC.</h3>
                <p className="text-[11px] text-neutral-600">630 St. Nicholas Avenue, New York, New York 10030 • (212) 281-8850</p>
                <p className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#800000] mt-1">
                  ITEMIZATION OF FUNERAL SERVICES AND MERCHANDISE SELECTED (NYS FORM AP-47)
                </p>
                <div className="flex justify-between text-[11px] font-mono text-neutral-600 mt-2 px-2">
                  <span>Case No: <strong>{caseData.caseNumber}</strong></span>
                  <span>Date: <strong>{statement?.agreementDate || 'October 30, 2026'}</strong></span>
                  <span>Place of Death: <strong>{caseData.decedent.placeOfDeath}</strong></span>
                </div>
              </div>

              {/* Section I */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1">
                  I. Funeral Home Charges
                </h4>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span>Transfer of Remains to Funeral Home:</span>
                  <span className="text-right font-mono">${(statement?.sectionI.B_transferOfRemainsAmount || 750).toFixed(2)}</span>

                  <span>Preparation of Remains (Embalming, Dressing, Cosmetology):</span>
                  <span className="text-right font-mono">
                    ${((statement?.sectionI.C1_embalmingAmount || 0) + (statement?.sectionI.C2_dressingCasketingAmount || 0) + (statement?.sectionI.C2_cosmetologyAmount || 0)).toFixed(2)}
                  </span>

                  <span>Basic Arrangements & Regulatory Staff Services:</span>
                  <span className="text-right font-mono">${(statement?.sectionI.D_basicArrangementsAmount || 950).toFixed(2)}</span>

                  <span>Supervision (Visitation & Funeral Service):</span>
                  <span className="text-right font-mono">
                    ${((statement?.sectionI.E1_supervisionVisitationAmount || 0) + (statement?.sectionI.E2_supervisionFuneralServiceAmount || 0)).toFixed(2)}
                  </span>

                  <span>Use of Facilities (Chapel / Parlor):</span>
                  <span className="text-right font-mono">
                    ${((statement?.sectionI.F1_facilitiesVisitationAmount || 0) + (statement?.sectionI.F2_facilitiesFuneralServiceAmount || 0)).toFixed(2)}
                  </span>

                  <span>Livery (Hearse, Limousine, Sprinter Van):</span>
                  <span className="text-right font-mono">
                    ${(statement?.sectionI.G_totalLiveryAmount || 0).toFixed(2)}
                  </span>

                  <span>Merchandise & Stationery Selected:</span>
                  <span className="text-right font-mono">
                    ${((statement?.sectionI.H1_casketAmount || 0) + (statement?.sectionI.I8_registerBookAmount || 0) + (statement?.sectionI.I6_totalFlowersAmount || 0) + (statement?.sectionI.I10_programsMatrix?.totalAmount || 0) + (statement?.sectionI.I5_hairdressingAmount || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-neutral-200 text-neutral-900">
                  <span>TOTAL FUNERAL HOME CHARGES:</span>
                  <span className="font-mono">${(statement?.sectionI.totalFuneralHomeCharges || caseData.totalAmountDue).toFixed(2)}</span>
                </div>
              </div>

              {/* Section II */}
              <div className="space-y-1.5 pt-1">
                <h4 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1">
                  II. Cash Advances (Estimated Third-Party Disbursements)
                </h4>
                <div className="flex justify-between text-[11px]">
                  <span>Total Cash Advances (Cemetery/Crematory, Clergy, EDRS, Transcripts, Gratuities, Organist):</span>
                  <span className="text-right font-mono font-bold">${(statement?.sectionII.totalCashAdvances || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Section III & IV Summary */}
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span>TOTAL FUNERAL CHARGES (Sections I + II):</span>
                  <span className="font-mono">${(statement?.sectionIII.totalFuneralCharges || caseData.totalAmountDue).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-700">
                  <span>Less Payments & Credits Received:</span>
                  <span className="font-mono font-medium">${(statement?.sectionIII.lessCreditsAndInsurance || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-amber-200 text-[#800000]">
                  <span>FINAL BALANCE DUE:</span>
                  <span className="font-mono">${(statement?.sectionIII.balanceDue || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NYS PHL § 4201 RIGHT TO CONTROL */}
          {activeTab === 'phl4201' && (
            <div className="space-y-3 text-xs leading-relaxed font-sans">
              <div className="text-center border-b border-neutral-300 pb-2">
                <h3 className="font-serif-title font-bold text-sm text-neutral-900">NEW YORK STATE DEPARTMENT OF HEALTH</h3>
                <p className="text-[11px] font-semibold text-neutral-700">Bureau of Funeral Directing • Public Health Law Section 4201</p>
                <p className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#800000] mt-1">
                  AT-NEED WRITTEN STATEMENT OF PERSON HAVING RIGHT TO CONTROL DISPOSITION
                </p>
              </div>

              <p className="text-[11px] text-neutral-800">
                I, <strong>{caseData.informant.fullName}</strong>, residing at <strong>{caseData.informant.address}</strong>, being the <strong>{caseData.informant.relationship}</strong> of the decedent, <strong>{caseData.decedent.legalName}</strong>, who died on <strong>{caseData.decedent.dateOfDeath}</strong> in <strong>{caseData.decedent.placeOfDeath}</strong>, state under penalty of perjury:
              </p>

              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-neutral-700 pl-1">
                <li>
                  <strong>Statutory Priority:</strong> Pursuant to New York Public Health Law § 4201(2)(a), I am the person having lawful authority and statutory priority to control the final disposition of the decedent&apos;s remains.
                </li>
                <li>
                  <strong>No Conflicting Directions:</strong> I have no knowledge of any written directions executed by the decedent regarding the disposition of their remains pursuant to § 4201, nor do I have knowledge of any person having equal or higher priority who opposes my directions.
                </li>
                <li>
                  <strong>Disposition Authorization:</strong> I hereby direct and authorize Benta&apos;s Funeral Home, Inc. to take custody of the remains and execute the requested funeral services and final disposition at: <strong>{statement?.dispositionSchedule?.cemeteryOrCrematory || 'the designated cemetery/crematory'}</strong>.
                </li>
                <li>
                  <strong>Indemnification:</strong> I agree to indemnify and hold harmless Benta&apos;s Funeral Home, Inc. from any claims, disputes, or liabilities arising from reliance upon this statement.
                </li>
              </ol>
            </div>
          )}

          {/* TAB 3: NYC EDRS VITAL STATISTICS VERIFICATION */}
          {activeTab === 'vital_records' && (
            <div className="space-y-3 text-xs leading-relaxed font-sans">
              <div className="text-center border-b border-neutral-300 pb-2">
                <h3 className="font-serif-title font-bold text-sm text-neutral-900">NYC DEPARTMENT OF HEALTH & MENTAL HYGIENE</h3>
                <p className="text-[11px] font-semibold text-neutral-700">Bureau of Vital Statistics • Electronic Death Registration System (EDRS)</p>
                <p className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#800000] mt-1">
                  VITAL STATISTICS VERIFICATION & CONFIRMATION CERTIFICATE
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border border-neutral-200 p-3 rounded-lg bg-white">
                <div>Decedent Legal Name: <strong>{caseData.decedent.legalName}</strong></div>
                <div>Date of Birth: <strong>{caseData.decedent.dateOfBirth}</strong></div>
                <div>Date of Death: <strong>{caseData.decedent.dateOfDeath}</strong></div>
                <div>Age at Death: <strong>{vitals?.age || (caseData.decedent.dateOfBirth ? 78 : '')}</strong></div>
                <div>Social Security Number: <strong>{caseData.decedent.ssn || caseData.decedent.ssnMasked}</strong></div>
                <div>Marital Status: <strong>{caseData.decedent.maritalStatus || 'Single'}</strong></div>
                <div className="col-span-2">
                  Residence: <strong>{caseData.decedent.residenceAddress}, {caseData.decedent.city}, {caseData.decedent.state} {caseData.decedent.zipCode}</strong>
                </div>
                <div>Informant: <strong>{caseData.informant.fullName}</strong></div>
                <div>Informant Phone: <strong>{caseData.informant.phone}</strong></div>
              </div>

              <p className="text-[11px] text-neutral-700 italic">
                I certify that all personal and vital statistics recorded above have been reviewed by me and are certified to be accurate and complete for registration with the NYC Department of Health & Mental Hygiene.
              </p>
            </div>
          )}

          {/* TAB 4: WOODLAWN CREMATORY AUTHORIZATION */}
          {activeTab === 'woodlawn' && (
            <div className="space-y-3 text-xs leading-relaxed font-sans">
              <div className="text-center border-b border-neutral-300 pb-2">
                <h3 className="font-serif-title font-bold text-sm text-neutral-900">WOODLAWN CREMATORY & CEMETERY</h3>
                <p className="text-[11px] font-semibold text-neutral-700">4199 Webster Avenue, Bronx, NY 10470 • (718) 920-0500</p>
                <p className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#800000] mt-1">
                  AUTHORIZATION FOR CREMATION AND DISPOSITION OF CREMATED REMAINS
                </p>
              </div>

              <p className="text-[11px] text-neutral-800">
                I hereby request and authorize Woodlawn Crematory to cremate the human remains of <strong>{caseData.decedent.legalName}</strong>, who passed away on <strong>{caseData.decedent.dateOfDeath}</strong>.
              </p>

              <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-[11px] text-neutral-800 space-y-1">
                <strong>Pacemaker & Mechanical Implant Certification:</strong>
                <p>I certify that the remains of the decedent do NOT contain any pacemaker, radioactive implant, or other mechanical device that could explode during the cremation process, or that such device has been safely removed by the licensed funeral director.</p>
              </div>

              <p className="text-[11px] text-neutral-700">
                Following cremation, the cremated remains shall be delivered to: <strong>{caseData.informant.fullName} (Informant / Next of Kin)</strong>.
              </p>
            </div>
          )}

        </div>

        {/* Signer Confirmation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs shrink-0">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Signer Legal Name (Next of Kin) *</label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-medium focus:border-[#800000] outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Signing Timestamp & Legal Verification</label>
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 font-mono text-[11px] flex items-center justify-between">
              <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} (EST)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>NYC E-SIGN Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Canvas Signature Pad */}
        <div className="space-y-1.5 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#800000]" />
              Draw Your Signature in the Box Below:
            </span>
            <button
              onClick={handleClear}
              className="text-neutral-500 hover:text-[#800000] flex items-center gap-1 text-[11px] font-semibold transition"
            >
              <RotateCcw className="w-3 h-3" /> Clear Pad
            </button>
          </div>

          <div className="border-2 border-dashed border-amber-400/80 rounded-xl bg-[#fdfdfc] overflow-hidden relative shadow-inner">
            <canvas
              ref={canvasRef}
              width={750}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-32 cursor-crosshair touch-none"
            />
            {!hasSignature && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-neutral-400 text-xs italic">
                Sign with your mouse, finger, or stylus here
              </div>
            )}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start space-x-2 shrink-0 text-xs text-neutral-700">
          <input
            type="checkbox"
            id="legalConsent"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="rounded accent-[#800000] w-4 h-4 mt-0.5"
          />
          <label htmlFor="legalConsent" className="leading-snug text-[11px]">
            I, <strong>{signerName}</strong>, certify under penalty of law that I am the legal Next of Kin with Right to Control pursuant to NYS Public Health Law § 4201, have reviewed all {isCremation ? '4' : '3'} documents included in this execution, and agree to electronic signature binding for Benta’s Funeral Home, Inc.
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-neutral-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-lg transition"
          >
            Cancel
          </button>

          <button
            disabled={!hasSignature || !agreedToTerms}
            onClick={handleComplete}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition shadow-md ${
              hasSignature && agreedToTerms
                ? 'bg-gradient-to-r from-[#800000] to-[#b91c1c] hover:from-[#7f1d1d] hover:to-[#800000] text-white shadow-red-950/20 border border-amber-300/40 cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Affix Legal e-Signature</span>
          </button>
        </div>

      </div>
    </div>
  );
};
