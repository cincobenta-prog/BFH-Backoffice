import React, { useRef, useState, useEffect } from 'react';
import { GoldenRecordCase, DocumentItem } from '../../lib/types/funeral';
import { PenTool, X, RotateCcw, ShieldCheck, FileCheck, Lock } from 'lucide-react';

interface CanvasESignModalProps {
  caseData: GoldenRecordCase;
  targetDoc?: DocumentItem | null;
  onClose: () => void;
  onSignatureComplete: (signatureDataUrl: string, docIds: string[]) => void;
}

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

  const handleComplete = () => {
    if (!hasSignature || !agreedToTerms) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const docIds = targetDoc ? [targetDoc.id] : ['doc-7', 'doc-8', 'doc-9'];
    onSignatureComplete(dataUrl, docIds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-neutral-900">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-neutral-200 pb-4">
          <div className="flex items-center space-x-2 text-xs text-[#800000] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#800000]" />
            <span>NYS Legally Binding e-Signature Portal</span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-neutral-900 mt-1">
            {targetDoc ? `Sign: ${targetDoc.name}` : 'Execute Phase 3 Legal Bundle'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5 font-light">
            Golden Record Case <strong className="text-[#800000] font-semibold">{caseData.caseNumber}</strong> • Decedent: {caseData.decedent.legalName}
          </p>
        </div>

        {/* Document Legal Bundle Scope */}
        <div className="bg-red-50/60 p-4 rounded-xl border border-red-200/80 space-y-2 text-xs text-neutral-800">
          <p className="font-bold text-[#800000] flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-[#800000]" />
            <span>Documents Included in this Single e-Sign Execution:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-1 text-[11px] font-medium">
            <li>Itemized Funeral & Goods Agreement (${caseData.totalAmountDue.toLocaleString()} Total)</li>
            <li>NYS Public Health Law § 4201 Right to Control Disposition Authorization</li>
            {caseData.dispositionType.includes('cremation') && (
              <li>Woodlawn Crematory Authorization & Pacemaker / Mechanical Device Waiver</li>
            )}
            <li>Vital Statistics Verification Certification for NYC EDRS</li>
          </ul>
        </div>

        {/* Signer Confirmation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-medium mb-1">Signer Legal Name (Next of Kin) *</label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-medium focus:border-[#800000] outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-medium mb-1">Signing Timestamp & IP Verification</label>
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 font-mono text-[11px]">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} (EST) • NYC E-SIGN Verified
            </div>
          </div>
        </div>

        {/* Interactive Canvas Signature Pad */}
        <div className="space-y-2">
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
              width={600}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 cursor-crosshair touch-none"
            />
            {!hasSignature && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-neutral-400 text-xs italic">
                Sign with your mouse, finger, or stylus here
              </div>
            )}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start space-x-2 pt-1 text-xs text-neutral-700">
          <input
            type="checkbox"
            id="legalConsent"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="rounded accent-[#800000] w-4 h-4 mt-0.5"
          />
          <label htmlFor="legalConsent" className="leading-snug text-[11px]">
            I, <strong>{signerName}</strong>, certify under penalty of law that I am the legal Next of Kin with Right to Control pursuant to NYS Public Health Law § 4201, and agree to electronic signature execution for Benta’s Funeral Home, Inc.
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
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
                ? 'bg-gradient-to-r from-[#800000] to-[#b91c1c] hover:from-[#7f1d1d] hover:to-[#800000] text-white shadow-red-950/20 border border-amber-300/40'
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
