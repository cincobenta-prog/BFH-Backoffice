import React, { useState } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { 
  Printer, 
  QrCode, 
  X, 
  Heart, 
  Camera, 
  Share2, 
  Check 
} from 'lucide-react';

interface ChapelQrSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: GoldenRecordCase;
}

export const ChapelQrSignModal: React.FC<ChapelQrSignModalProps> = ({
  isOpen,
  onClose,
  caseData
}) => {
  const [signSize, setSignSize] = useState<'8.5x11' | '8x10' | '5x7'>('8.5x11');
  const [selectedDestination, setSelectedDestination] = useState<'guestbook_tribute' | 'webcast_live' | 'full_portal'>('guestbook_tribute');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const targetUrl = selectedDestination === 'webcast_live'
    ? `https://e-bfh.com/live/${caseData.caseNumber}`
    : selectedDestination === 'guestbook_tribute'
    ? `https://e-bfh.com/tributes/${caseData.caseNumber}`
    : `https://portal.e-bfh.com/family/${caseData.caseNumber}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#fcfbfa] border border-neutral-300 rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl text-neutral-900 overflow-hidden">
        
        {/* TOP CONTROLS (Hidden during print) */}
        <div className="p-4 sm:p-5 bg-white border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#800000] shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-neutral-900">
                Chapel Welcome & Digi-Tribute QR Easel Sign
              </h3>
              <p className="text-xs text-neutral-500 font-light">
                Print-ready entrance display for <strong>{caseData.decedent.legalName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Size Selector */}
            <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setSignSize('8.5x11')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  signSize === '8.5x11' ? 'bg-white text-[#800000] shadow-xs' : 'text-neutral-600'
                }`}
              >
                8.5" x 11" Letter
              </button>
              <button
                onClick={() => setSignSize('8x10')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  signSize === '8x10' ? 'bg-white text-[#800000] shadow-xs' : 'text-neutral-600'
                }`}
              >
                8" x 10" Easel
              </button>
              <button
                onClick={() => setSignSize('5x7')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  signSize === '5x7' ? 'bg-white text-[#800000] shadow-xs' : 'text-neutral-600'
                }`}
              >
                5" x 7" Table
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-sm border border-amber-300/40"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print Easel Sign</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DESTINATION SELECTOR BAR (Hidden during print) */}
        <div className="px-6 py-2.5 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs font-medium shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-500 font-bold">QR Destination:</span>
            <button
              onClick={() => setSelectedDestination('guestbook_tribute')}
              className={`px-3 py-1 rounded-lg transition text-xs font-bold ${
                selectedDestination === 'guestbook_tribute' ? 'bg-[#800000] text-white shadow-2xs' : 'bg-white text-neutral-700 border border-neutral-300'
              }`}
            >
              📖 Guestbook & Voice Tributes
            </button>
            <button
              onClick={() => setSelectedDestination('webcast_live')}
              className={`px-3 py-1 rounded-lg transition text-xs font-bold ${
                selectedDestination === 'webcast_live' ? 'bg-[#800000] text-white shadow-2xs' : 'bg-white text-neutral-700 border border-neutral-300'
              }`}
            >
              🎥 Live 4K Webcast
            </button>
            <button
              onClick={() => setSelectedDestination('full_portal')}
              className={`px-3 py-1 rounded-lg transition text-xs font-bold ${
                selectedDestination === 'full_portal' ? 'bg-[#800000] text-white shadow-2xs' : 'bg-white text-neutral-700 border border-neutral-300'
              }`}
            >
              🕊️ Complete Memorial Portal
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="text-[11px] text-[#800000] hover:underline font-bold flex items-center gap-1 font-mono"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : targetUrl}</span>
          </button>
        </div>

        {/* PRINTABLE SIGN CANVAS */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex items-center justify-center">
          
          <div className={`bg-white border-4 border-[#800000] rounded-2xl p-8 sm:p-10 shadow-2xl text-center flex flex-col justify-between items-center space-y-6 max-w-lg w-full relative print:border-4 print:shadow-none print:m-0 print:max-w-none print:w-full print:rounded-none`}>
            
            {/* Stately Top Heritage Border & Crest */}
            <div className="space-y-2 w-full">
              <div className="w-12 h-12 rounded-full bg-[#800000] text-white flex items-center justify-center font-serif-title font-bold text-lg mx-auto shadow-md border-2 border-amber-400">
                BFH
              </div>
              <span className="font-serif-title font-bold text-xs uppercase tracking-widest text-[#b45309] block">
                Benta's Funeral Home, Inc. • Harlem, NY
              </span>
              <div className="h-0.5 w-16 bg-[#b45309] mx-auto"></div>
              <h2 className="font-serif-title font-bold text-xl sm:text-2xl text-[#800000] pt-1">
                Celebrating the Life & Memory of
              </h2>
            </div>

            {/* Decedent Portrait & Dates */}
            <div className="space-y-2">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#b45309] shadow-lg mx-auto bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                  alt={caseData.decedent.legalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="font-serif-title font-bold text-2xl text-neutral-900 leading-tight">
                {caseData.decedent.legalName}
              </h1>
              <p className="text-xs text-[#b45309] font-bold tracking-wide">
                {caseData.decedent.dateOfBirth || 'June 14, 1948'} — {caseData.decedent.dateOfDeath || 'September 18, 2026'}
              </p>
            </div>

            {/* HIGH-FIDELITY QR CODE CONTAINER */}
            <div className="p-4 bg-neutral-50 rounded-2xl border-2 border-[#b45309]/50 shadow-inner flex flex-col items-center space-y-2">
              
              {/* Dynamic SVG QR Code Illustration */}
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-neutral-300 shadow-sm flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900" fill="currentColor">
                  {/* Outer Position Markers */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#800000" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="13" width="12" height="12" rx="2" fill="#800000" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#800000" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="75" y="13" width="12" height="12" rx="2" fill="#800000" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#800000" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="75" width="12" height="12" rx="2" fill="#800000" />

                  {/* QR Matrix Pattern Dots */}
                  <rect x="38" y="8" width="6" height="6" rx="1" />
                  <rect x="48" y="8" width="6" height="6" rx="1" />
                  <rect x="58" y="14" width="6" height="6" rx="1" />
                  <rect x="38" y="20" width="6" height="6" rx="1" />
                  <rect x="48" y="26" width="6" height="6" rx="1" />
                  <rect x="58" y="32" width="6" height="6" rx="1" />

                  <rect x="8" y="38" width="6" height="6" rx="1" />
                  <rect x="20" y="38" width="6" height="6" rx="1" />
                  <rect x="32" y="38" width="6" height="6" rx="1" />
                  <rect x="44" y="38" width="6" height="6" rx="1" />
                  <rect x="56" y="38" width="6" height="6" rx="1" />
                  <rect x="68" y="38" width="6" height="6" rx="1" />
                  <rect x="80" y="38" width="6" height="6" rx="1" />

                  <rect x="38" y="48" width="6" height="6" rx="1" fill="#800000" />
                  <rect x="50" y="48" width="6" height="6" rx="1" />
                  <rect x="62" y="48" width="6" height="6" rx="1" />

                  <rect x="8" y="58" width="6" height="6" rx="1" />
                  <rect x="24" y="58" width="6" height="6" rx="1" />
                  <rect x="38" y="58" width="6" height="6" rx="1" />
                  <rect x="52" y="58" width="6" height="6" rx="1" />
                  <rect x="68" y="58" width="6" height="6" rx="1" />
                  <rect x="82" y="58" width="6" height="6" rx="1" />

                  <rect x="38" y="68" width="6" height="6" rx="1" />
                  <rect x="48" y="74" width="6" height="6" rx="1" fill="#800000" />
                  <rect x="58" y="68" width="6" height="6" rx="1" />
                  <rect x="70" y="74" width="6" height="6" rx="1" />
                  <rect x="82" y="80" width="6" height="6" rx="1" />
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-1 rounded-full shadow-md border border-red-200">
                    <Heart className="w-5 h-5 text-[#800000] fill-red-50" />
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-neutral-500 font-bold">
                SCAN WITH YOUR PHONE CAMERA
              </span>
            </div>

            {/* 3 Step Instructions for Guests */}
            <div className="space-y-1.5 text-xs text-neutral-700 max-w-sm">
              <div className="flex items-center justify-center space-x-2 font-bold text-neutral-900">
                <Camera className="w-4 h-4 text-[#800000]" />
                <span>Sign Digital Guestbook & Share Memories</span>
              </div>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
                1. Open your phone camera and point at the QR code above.<br />
                2. Tap the link to sign the family register, record an audio tribute, or view the live memorial service bulletin.
              </p>
            </div>

            {/* Bottom Footer */}
            <div className="w-full pt-3 border-t border-neutral-200 text-[10px] text-neutral-500 font-light">
              <p>630 Saint Nicholas Avenue • New York, NY 10030 • (212) 281-8850</p>
              <p className="text-[9px] text-[#b45309] font-medium pt-0.5">www.bentasfuneralhome.com</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
