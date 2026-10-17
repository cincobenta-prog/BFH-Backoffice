import React, { useState } from 'react';
import { 
  ServicePartnerContact, 
  PartnerScheduleRequest, 
  PartnerCategory, 
  GoldenRecordCase 
} from '../../lib/types/funeral';
import { 
  Users, 
  Scissors, 
  Music, 
  Church, 
  UserCheck, 
  Send, 
  Sparkles, 
  X
} from 'lucide-react';

interface PartnerScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: GoldenRecordCase;
  partners: ServicePartnerContact[];
  onAddRequest: (newReq: PartnerScheduleRequest) => void;
}

export const PartnerScheduleModal: React.FC<PartnerScheduleModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  partners,
  onAddRequest
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PartnerCategory>('hairdresser_barber');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    partners.find(p => p.category === 'hairdresser_barber')?.id || partners[0]?.id || ''
  );
  const [serviceDate, setServiceDate] = useState<string>(activeCase.serviceSelections.serviceDate || '2026-09-22');
  const [callTime, setCallTime] = useState<string>('09:30 AM');
  const [endTime, setEndTime] = useState<string>('12:00 PM');
  const [venue, setVenue] = useState<string>('630 St. Nicholas Ave - Restorative Suite');
  const [instructions, setInstructions] = useState<string>('Please arrive in formal attire. Reference family portrait photo in digital portal.');
  const [fee, setFee] = useState<string>('$200.00');

  if (!isOpen) return null;

  const categoryPartners = partners.filter(p => p.category === selectedCategory);
  const activePartner = partners.find(p => p.id === selectedPartnerId) || categoryPartners[0] || partners[0];

  const generatedSms = `BFH SERVICE REQUEST: Dear ${activePartner?.fullName || 'Partner'}, Benta's Funeral Home requests your ${activePartner?.roleTitle || 'services'} for the ${activeCase.informant.fullName.split(' ')[1] || 'Family'} (${activeCase.decedent.legalName}, Case #${activeCase.caseNumber}) on ${serviceDate} at ${callTime}. Location: ${venue}. Notes: ${instructions}. Compensation: ${fee}. Reply YES to confirm or NO if unavailable.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePartner) return;

    const newReq: PartnerScheduleRequest = {
      id: `req-${Date.now()}`,
      caseId: activeCase.id,
      caseNumber: activeCase.caseNumber,
      familyReferenceName: `${activeCase.informant.fullName.split(' ')[1] || 'Family'} Family`,
      decedentName: activeCase.decedent.legalName,
      partnerId: activePartner.id,
      partnerName: activePartner.fullName,
      partnerPhone: activePartner.phone,
      category: activePartner.category,
      roleTitle: activePartner.roleTitle,
      serviceDate: serviceDate,
      callTime: callTime,
      serviceEndTime: endTime,
      venueLocation: venue,
      specialInstructions: instructions,
      honorariumFee: fee,
      status: 'sms_sent',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      remindersCount: 0,
      recurringIntervalMinutes: 240,
      smsMessageDraft: generatedSms
    };

    onAddRequest(newReq);
    onClose();
  };

  const categoriesList: Array<{ id: PartnerCategory; label: string; icon: any; defaultVenue: string; defaultFee: string }> = [
    { id: 'hairdresser_barber', label: 'Hairdresser / Barber', icon: Scissors, defaultVenue: '630 St. Nicholas Ave - Restorative Suite', defaultFee: '$175.00' },
    { id: 'musician_organist', label: 'Organist / Musician', icon: Music, defaultVenue: 'Chapel 1 (Main Sanctuary, 120 Guests)', defaultFee: '$300.00' },
    { id: 'minister_clergy', label: 'Minister / Clergy', icon: Church, defaultVenue: 'Chapel 1 (Main Sanctuary, 120 Guests)', defaultFee: '$350.00' },
    { id: 'pallbearer', label: 'Pallbearer Corps', icon: Users, defaultVenue: 'Chapel 1 to Woodlawn Crematory', defaultFee: '$600.00' },
    { id: 'outside_director', label: 'Outside Trade FD', icon: UserCheck, defaultVenue: '630 St. Nicholas Ave & Cortege Escort', defaultFee: '$400.00' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl text-neutral-900 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#800000]" />
            <div>
              <h3 className="font-serif-title font-bold text-lg text-neutral-900">
                Schedule Service Partner via SMS Dispatch
              </h3>
              <p className="text-xs text-neutral-500 font-light">
                Case #{activeCase.caseNumber} • {activeCase.decedent.legalName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector Chips */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-2">Select Service Role to Dispatch:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVenue(cat.defaultVenue);
                    setFee(cat.defaultFee);
                    const matching = partners.filter(p => p.category === cat.id);
                    if (matching[0]) setSelectedPartnerId(matching[0].id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-red-50/90 border-[#800000] ring-2 ring-red-500/20 text-[#800000] font-bold shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#800000]' : 'text-neutral-500'}`} />
                  <span className="text-xs">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Partner Dropdown */}
          <div>
            <label className="block text-neutral-700 font-bold mb-1">Select Professional / Guild Partner *</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => {
                setSelectedPartnerId(e.target.value);
                const p = partners.find(part => part.id === e.target.value);
                if (p?.rateInfo) setFee(p.rateInfo);
              }}
              className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold text-neutral-900 outline-none focus:border-[#800000]"
            >
              {categoryPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} — {p.roleTitle} ({p.phone}) [{p.rateInfo || 'Standard'}]
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Service Date *</label>
              <input
                type="date"
                required
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 font-bold text-neutral-900 outline-none focus:border-[#800000]"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Call Time *</label>
              <input
                type="text"
                required
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                placeholder="e.g. 09:30 AM"
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 text-neutral-900 outline-none focus:border-[#800000]"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Est. End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 12:00 PM"
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 text-neutral-900 outline-none focus:border-[#800000]"
              />
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Reporting Venue / Suite *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 text-neutral-900 outline-none focus:border-[#800000]"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Agreed Fee / Honorarium</label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 text-neutral-900 outline-none focus:border-[#800000]"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-neutral-700 font-medium mb-1">Special Attire / Preparation Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Reference family portrait photo in digital portal. Bring styling kit."
              className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 text-neutral-900 outline-none focus:border-[#800000]"
            />
          </div>

          {/* Live SMS Preview */}
          <div className="p-3 bg-neutral-900 text-white rounded-xl space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-neutral-400 text-[10px]">
              <span>SMS Preview to: {activePartner?.phone}</span>
              <span>Twilio Verified</span>
            </div>
            <p className="text-neutral-200">
              "{generatedSms}"
            </p>
            <div className="text-[10px] text-amber-300 pt-1 border-t border-neutral-800">
              ⚡ Recurring reminders will automatically trigger every 4 hours until partner confirms with "YES".
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-sm border border-amber-300/40 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>Dispatch SMS Booking Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
