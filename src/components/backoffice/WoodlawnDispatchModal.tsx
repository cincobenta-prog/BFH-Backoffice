import React, { useState } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { Flame, Send, CheckCircle, MapPin, X } from 'lucide-react';

interface WoodlawnDispatchModalProps {
  caseData: GoldenRecordCase;
  onClose: () => void;
  onDispatchConfirmed: () => void;
}

export const WoodlawnDispatchModal: React.FC<WoodlawnDispatchModalProps> = ({
  caseData,
  onClose,
  onDispatchConfirmed
}) => {
  const [dispatchSlot, setDispatchSlot] = useState('2026-09-22 09:30 AM');
  const [vehicleId, setVehicleId] = useState('BFH Coach Van #2 (NY Lic: FUN-882)');
  const [contactPerson, setContactPerson] = useState('Woodlawn Dispatch Desk');
  const [notes, setNotes] = useState('Pacemaker removed by BFH prep staff. EDRS permit #NYC-EDRS-2026-44910 attached.');
  const [dispatched, setDispatched] = useState(false);

  const handleSendDispatch = () => {
    setDispatched(true);
    setTimeout(() => {
      onDispatchConfirmed();
    }, 1500);
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
            <Flame className="w-4 h-4 text-[#800000]" />
            <span>Woodlawn Crematory & Cemetery Logistics</span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-neutral-900 mt-1">
            Dispatch Packet & Drop-Off Confirmation
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            Case <strong className="text-[#800000] font-semibold">{caseData.caseNumber}</strong> • {caseData.decedent.legalName}
          </p>
        </div>

        {dispatched ? (
          <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-300 rounded-xl animate-fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif-title text-lg font-bold text-emerald-900">
              Woodlawn Dispatch Confirmed & Logged
            </h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto font-light">
              Automated packet sent to Woodlawn Crematory with certified EDRS permit and signed cremation authorization bundle. Vehicle scheduled for drop-off.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Facility Card */}
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-200/80 flex items-start space-x-3 text-xs">
              <MapPin className="w-5 h-5 text-[#800000] shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 text-sm block">Woodlawn Cemetery & Crematory</strong>
                <p className="text-neutral-600 font-light">517 E 233rd St, Bronx, NY 10470 • Priority Partner of Benta’s Funeral Home</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Requested Drop-off Window *</label>
                <input
                  type="text"
                  value={dispatchSlot}
                  onChange={(e) => setDispatchSlot(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-medium focus:border-[#800000] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Transport Coach / Vehicle *</label>
                <input
                  type="text"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-medium focus:border-[#800000] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Woodlawn Receiving Contact</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-medium focus:border-[#800000] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">EDRS NYC Permit Attachment</label>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-emerald-800 font-mono text-[11px] flex items-center justify-between">
                  <span>{caseData.medicalCertifier.edrsPermitNumber || 'Permit Auto-Attached'}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold">VERIFIED</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-medium text-xs mb-1">Crematory Instructions & Special Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#800000] outline-none"
              />
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
                onClick={handleSendDispatch}
                className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-6 py-2.5 rounded-lg flex items-center space-x-1.5 transition shadow-md shadow-red-950/20 border border-amber-300/40"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Confirm & Transmit Dispatch Packet</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
