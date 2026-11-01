import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download,
  HandCoins,
  ShieldCheck
} from 'lucide-react';
import { GoldenRecordCase, StatementOfGoodsData } from '../../lib/types/funeral';
import { getDefaultStatementOfGoodsForCase } from '../../lib/data/generalPriceList';
import { CashAdvanceCheckPrinterModal } from './CashAdvanceCheckPrinterModal';
import { OfficialScannedFormAP47 } from './OfficialScannedFormAP47';

interface PrintableFormAP47ModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: GoldenRecordCase;
  onOpenCheckPrinter?: (targetCase: GoldenRecordCase) => void;
  onSaveContract?: (caseId: string, updatedStatement: StatementOfGoodsData) => void;
}

export const PrintableFormAP47Modal: React.FC<PrintableFormAP47ModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onOpenCheckPrinter,
  onSaveContract
}) => {
  const [isInternalCheckPrinterOpen, setIsInternalCheckPrinterOpen] = useState(false);
  const [statementData, setStatementData] = useState<StatementOfGoodsData>(() => {
    return caseData.statementOfGoods || getDefaultStatementOfGoodsForCase(caseData);
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    const prevTitle = document.title;
    document.title = '\u00A0';
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 500);
  };

  const handleOpenChecks = () => {
    if (onOpenCheckPrinter) {
      onOpenCheckPrinter(caseData);
    } else {
      setIsInternalCheckPrinterOpen(true);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(statementData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NYS_Form_AP47_${caseData.caseNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUpdateStatement = (updated: StatementOfGoodsData) => {
    setStatementData(updated);
    if (onSaveContract) {
      onSaveContract(caseData.id, updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 print:p-0 font-sans animate-fadeIn contract-print-modal-backdrop print:static print:bg-white print:overflow-visible print:block print:w-full">
      
      {/* Modal Container */}
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden contract-print-modal-container print:max-w-none print:max-h-none print:border-none print:shadow-none print:rounded-none print:overflow-visible print:block print:w-full print:m-0 print:p-0">
        
        {/* Screen-Only Header Bar */}
        <div className="p-3.5 sm:p-4 bg-neutral-900 text-white flex items-center justify-between shrink-0 print:hidden no-print">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#800000] text-white flex items-center justify-center font-bold text-xs border border-amber-400/40">
              AP47
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-neutral-100">
                  Official Statement of Goods &amp; Services Selected (Form AP-47)
                </h3>
                <span className="hidden md:inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Office Scanned Form Matched
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-light">
                10 NYCRR &sect; 77.8 &bull; NYS Public Health Law &sect; 3440-a &bull; Case <strong className="text-amber-300 font-mono">{caseData.caseNumber}</strong> &bull; All funds due 48 hours prior to service
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenChecks}
              className="bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition border border-amber-400/40 cursor-pointer"
              title="Print 3-Part Cash Advance Check Vouchers"
            >
              <HandCoins className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Pass-Through Checks</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-sm border border-amber-400/40 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition border border-neutral-700 cursor-pointer"
              title="Download JSON Export"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body Rendering Authentic Scanned Form AP-47 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-100 text-neutral-900 contract-print-modal-body print:p-0 print:bg-white print:overflow-visible">
          <OfficialScannedFormAP47
            id="official-form-ap47-printable"
            caseData={caseData}
            statementData={statementData}
            onChangeStatementData={handleUpdateStatement}
            readOnly={false}
          />
        </div>

      </div>

      {/* 3-Part Cash Advance Check Printer Modal */}
      {isInternalCheckPrinterOpen && (
        <CashAdvanceCheckPrinterModal
          isOpen={isInternalCheckPrinterOpen}
          onClose={() => setIsInternalCheckPrinterOpen(false)}
          caseData={caseData}
        />
      )}

    </div>
  );
};
