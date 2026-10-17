import React, { useState } from 'react';
import { GoldenRecordCase, VehicleHoldRequest, VehicleType, VehicleSize, SimulatedNotification } from '../../lib/types/funeral';
import { 
  Car, 
  Send, 
  CheckCircle, 
  Clock, 
  X, 
  MapPin, 
  Smartphone, 
  Sparkles,
  CheckCheck,
  RefreshCw,
  Bell
} from 'lucide-react';

interface LiveryVehicleDispatchModalProps {
  cases: GoldenRecordCase[];
  activeCase: GoldenRecordCase;
  liveryHolds: VehicleHoldRequest[];
  onClose: () => void;
  onAddHold: (newHold: VehicleHoldRequest) => void;
  onUpdateHold: (updatedHold: VehicleHoldRequest) => void;
  onSendNotification?: (notif: SimulatedNotification) => void;
}

export const LiveryVehicleDispatchModal: React.FC<LiveryVehicleDispatchModalProps> = ({
  cases,
  activeCase,
  liveryHolds,
  onClose,
  onAddHold,
  onUpdateHold,
  onSendNotification
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCase.id);
  const [activeTab, setActiveTab] = useState<'request_hold' | 'active_fleet'>('request_hold');

  const currentCase = cases.find(c => c.id === selectedCaseId) || activeCase;
  const currentCaseHolds = liveryHolds.filter(h => h.caseId === currentCase.id);

  // Form State
  const [vendorName, setVendorName] = useState('Benta Transportation (www.bentatrans.com)');
  const [vendorPhone, setVendorPhone] = useState('(212) 281-4000');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sprinter Van');
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('Sprinter 14-seater');
  const [quantity, setQuantity] = useState(1);
  const [serviceDate, setServiceDate] = useState(currentCase.serviceSelections.serviceDate || '2026-09-22');
  const [serviceTime, setServiceTime] = useState(currentCase.serviceSelections.serviceTime || '10:30 AM');
  const [notice48Hr, setNotice48Hr] = useState(true);
  const [notes, setNotes] = useState('Extended family transport from 630 St Nicholas to Woodlawn Crematory.');
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 48-Hour Route Dispatching State for existing holds
  const [activeRouteHoldId, setActiveRouteHoldId] = useState<string | null>(null);
  const [pickupAddress, setPickupAddress] = useState('512 W 143rd St, Apt 4B, Harlem, NY 10031');
  const [dropoffAddress, setDropoffAddress] = useState('The Woodlawn Cemetery & Crematory, 4199 Webster Ave, Bronx, NY 10470');

  // Vendor Presets
  const VENDOR_PRESETS = [
    { name: 'Benta Transportation (www.bentatrans.com)', phone: '(212) 281-4000' },
    { name: 'NYC Royal Coach Livery & Funeral Cars', phone: '(718) 555-0144' },
    { name: 'Harlem Luxury Hearse & Limousine', phone: '(917) 555-0322' },
    { name: 'Empire State Funeral Coach Co.', phone: '(212) 555-0988' }
  ];

  // Live Formatted SMS Preview Text
  const familyRef = `${currentCase.decedent.legalName.split(' ').slice(-1)[0]} Family`;
  const smsBodyPreview = `VEHICLE HOLD REQUEST — Benta's Funeral Home (212) 281-8850.
Vendor: ${vendorName}
Case: ${currentCase.caseNumber} (${familyRef})
Requested: ${quantity}x ${vehicleSize} (${vehicleType})
Date: ${serviceDate} at ${serviceTime}
MANDATORY NOTICE: Final pickup and drop-off routing addresses will be provided at least 48 hours prior to service.
PLEASE REPLY "CONFIRM" TO HOLD VEHICLE.`;

  const handleSelectPresetVendor = (presetName: string) => {
    const found = VENDOR_PRESETS.find(v => v.name === presetName);
    if (found) {
      setVendorName(found.name);
      setVendorPhone(found.phone);
    } else {
      setVendorName(presetName);
    }
  };

  const handleSendVehicleHoldSMS = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const newHold: VehicleHoldRequest = {
      id: `liv-${Date.now()}`,
      caseId: currentCase.id,
      caseNumber: currentCase.caseNumber,
      familyReferenceName: familyRef,
      vendorName: vendorName,
      vendorPhone: vendorPhone,
      vehicleType: vehicleType,
      vehicleSize: vehicleSize,
      quantity: quantity,
      serviceDate: serviceDate,
      serviceTime: serviceTime,
      status: 'hold_requested',
      notice48HrAcknowledged: notice48Hr,
      notes: notes,
      requestedAt: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      reminderSchedule: {
        reminder48h: { scheduledDate: `${serviceDate} - 48h (09:00 AM)`, sent: false },
        reminder24h: { scheduledDate: `${serviceDate} - 24h (09:00 AM)`, sent: false },
        morningAlert: { scheduledDate: `${serviceDate} (07:00 AM)`, sent: false }
      }
    };

    setTimeout(() => {
      onAddHold(newHold);
      setIsSending(false);
      setSuccessToast(`Vehicle Hold SMS dispatched to ${vendorName} (${vendorPhone})`);
      setActiveTab('active_fleet');
      setTimeout(() => setSuccessToast(null), 5000);

      // Dispatch to global SMS simulation stream if callback provided
      if (onSendNotification) {
        onSendNotification({
          id: `notif-liv-${Date.now()}`,
          caseId: currentCase.id,
          decedentName: currentCase.decedent.legalName,
          recipientName: vendorName,
          recipientPhone: vendorPhone,
          channel: 'sms',
          type: 'custom_director_sms',
          title: `Livery Vehicle Hold Request: ${familyRef}`,
          bodyText: smsBodyPreview,
          sentAt: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          status: 'delivered',
          actionUrl: '#fleet',
          actionButtonText: 'Confirm Fleet Hold',
          metadata: {
            carrier: 'Twilio Fleet Transit Gateway',
            deliveryLatencyMs: 160,
            twilioMessageSid: `SM${Math.random().toString(36).substring(2, 12)}`
          }
        });
      }
    }, 450);
  };

  const handleSimulateVendorConfirmation = (hold: VehicleHoldRequest) => {
    const updated: VehicleHoldRequest = {
      ...hold,
      status: 'vendor_confirmed',
      confirmedAt: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    onUpdateHold(updated);
    setSuccessToast(`Vendor ${hold.vendorName} confirmed hold for ${hold.quantity}x ${hold.vehicleSize}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDispatch48HourRoute = (hold: VehicleHoldRequest) => {
    const updated: VehicleHoldRequest = {
      ...hold,
      status: 'route_48h_dispatched',
      pickupAddressDraft: pickupAddress,
      dropoffAddressDraft: dropoffAddress,
      notes: `${hold.notes ? hold.notes + ' • ' : ''}48-Hour Route: Pickup [${pickupAddress}] -> Dropoff [${dropoffAddress}]`
    };
    onUpdateHold(updated);
    setActiveRouteHoldId(null);
    setSuccessToast(`48-Hour Final Route dispatched to ${hold.vendorName}!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-5xl w-full p-5 sm:p-7 space-y-5 shadow-2xl text-neutral-900 my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-200 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#800000] shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-title font-bold text-xl text-neutral-900">
                  Livery & Transport Vendor Vehicle Hold Engine
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-[#800000] border border-red-300">
                  48-Hour Routing Protocol
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-light">
                Reserve limousines, hearse, and limo buses during initial arrangement with mandatory 48-hour pickup/drop-off dispatch notice.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Case Selector */}
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-[#f8fafc] border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-900 focus:border-[#800000] outline-none"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} • {c.decedent.legalName} ({c.dispositionType.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-medium animate-fadeIn shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md font-mono">
              SMS SENT & LOGGED
            </span>
          </div>
        )}

        {/* Active Case Context Bar */}
        <div className="p-3 bg-gradient-to-r from-red-50/80 via-white to-amber-50/50 rounded-2xl border border-red-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-[#800000] bg-white px-2.5 py-1 rounded-md border border-red-200 font-mono">
              {currentCase.caseNumber}
            </span>
            <div>
              <span className="font-bold text-neutral-900">{currentCase.decedent.legalName}</span>
              <span className="text-neutral-500 text-[11px] ml-2 font-mono">Family Ref: {familyRef}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-neutral-600">
            <span>Service Date: <strong className="text-neutral-900 font-bold">{currentCase.serviceSelections.serviceDate || 'Upcoming'}</strong></span>
            <span>Active Holds: <strong className="text-[#800000] font-bold">{currentCaseHolds.length} Vehicles</strong></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('request_hold')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'request_hold'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>1. Dispatch Vehicle Hold SMS to Vendor</span>
          </button>

          <button
            onClick={() => setActiveTab('active_fleet')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'active_fleet'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>2. Fleet Status & 48-Hour Route Confirmations ({currentCaseHolds.length})</span>
          </button>
        </div>

        {/* TAB 1: REQUEST NEW VEHICLE HOLD SMS */}
        {activeTab === 'request_hold' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto pr-1">
            
            {/* Form Column (7 cols) */}
            <form onSubmit={handleSendVehicleHoldSMS} className="lg:col-span-7 space-y-4 text-xs">
              
              {/* Livery Vendor Preset */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Select Livery Vendor Partner *</label>
                <select
                  value={vendorName}
                  onChange={(e) => handleSelectPresetVendor(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-neutral-300 rounded-xl p-2.5 text-neutral-900 font-bold focus:border-[#800000] outline-none"
                >
                  {VENDOR_PRESETS.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} — {v.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vendor Dispatch Phone *</label>
                  <input
                    type="text"
                    required
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#800000] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Family Reference Name</label>
                  <input
                    type="text"
                    disabled
                    value={familyRef}
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-lg p-2.5 text-neutral-600 font-bold"
                  />
                </div>
              </div>

              {/* Vehicle Type & Size Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vehicle Type *</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-bold focus:border-[#800000] outline-none"
                  >
                    <option value="Limo Bus">Limo Bus</option>
                    <option value="Limo">Limo</option>
                    <option value="Hearse">Hearse</option>
                    <option value="Flower Car">Flower Car</option>
                    <option value="Lead Car">Lead Car</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Capacity / Size *</label>
                  <select
                    value={vehicleSize}
                    onChange={(e) => setVehicleSize(e.target.value as VehicleSize)}
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-bold focus:border-[#800000] outline-none"
                  >
                    <option value="Limo Bus 16-seater">Limo Bus (16-seater)</option>
                    <option value="Limo Bus 10-seater">Limo Bus (10-seater)</option>
                    <option value="Limo 10-seater">Limo (10-seater)</option>
                    <option value="Limo 8-seater">Limo (8-seater)</option>
                    <option value="Limo 6-seater">Limo (6-seater)</option>
                    <option value="Custom / Standard">Custom / Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-bold focus:border-[#800000] outline-none"
                  />
                </div>
              </div>

              {/* Service Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Service Date *</label>
                  <input
                    type="date"
                    required
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#800000] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Initial Departure Time</label>
                  <input
                    type="text"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#800000] outline-none"
                  />
                </div>
              </div>

              {/* Mandatory 48-Hour Notice Checkbox */}
              <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="notice48"
                  required
                  checked={notice48Hr}
                  onChange={(e) => setNotice48Hr(e.target.checked)}
                  className="rounded accent-[#800000] w-4 h-4 mt-0.5"
                />
                <label htmlFor="notice48" className="text-xs text-amber-950 leading-relaxed font-medium">
                  <strong>Mandatory 48-Hour Clause:</strong> I confirm notice to vendor that the family has not yet finalized pickup/drop-off addresses and all final routing will be dispatched at least <strong>48 hours prior to service</strong>.
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Special Driver / Livery Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Family request front flower tray on hearse."
                  className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#800000] outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs py-3 rounded-xl transition shadow-md border border-amber-300/40 flex items-center justify-center space-x-2"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-amber-300" />
                )}
                <span>Dispatch Vehicle Hold SMS to {vendorName}</span>
              </button>
            </form>

            {/* Preview Column (5 cols) */}
            <div className="lg:col-span-5 bg-[#f8fafc] rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2">
                  <Smartphone className="w-4 h-4 text-[#800000]" />
                  <span className="font-bold text-xs text-neutral-900">Live SMS Dispatch Preview</span>
                </div>

                {/* SMS Bubble Preview */}
                <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 border border-neutral-200 shadow-sm space-y-2 font-mono text-[11px] leading-relaxed text-neutral-800 whitespace-pre-line">
                  {smsBodyPreview}
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Carrier: Twilio Fleet Gateway</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-Confirmation Ready
                  </span>
                </div>
              </div>

              {/* Automated Reminder Cadence Notice */}
              <div className="p-3 bg-white rounded-xl border border-neutral-200 text-[11px] space-y-1.5 text-neutral-600">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#b45309]" />
                  Automated Reminder Cadence
                </span>
                <p className="text-[10px] text-neutral-500">
                  • <strong>48 Hours Prior:</strong> System alerts director to enter pickup addresses and SMS routes to driver.<br/>
                  • <strong>24 Hours Prior:</strong> Final confirmation ping dispatched to vendor dispatcher.<br/>
                  • <strong>Day of Service (07:00 AM):</strong> Driver cortege departure alert.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE FLEET HOLDS & 48-HOUR ROUTE CONFIRMATIONS */}
        {activeTab === 'active_fleet' && (
          <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-1 text-xs">
            {currentCaseHolds.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 space-y-2">
                <Car className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs font-medium">No vehicle holds requested for this case yet.</p>
                <button
                  onClick={() => setActiveTab('request_hold')}
                  className="text-xs font-bold text-[#800000] hover:underline"
                >
                  Click here to dispatch a vehicle hold SMS
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentCaseHolds.map((hold) => (
                  <div 
                    key={hold.id}
                    className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-3 hover:border-red-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 pb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-red-50 text-[#800000] flex items-center justify-center font-bold">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900">
                            {hold.quantity}x {hold.vehicleSize} ({hold.vehicleType})
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-mono">
                            Vendor: {hold.vendorName} • {hold.vendorPhone}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {hold.status === 'hold_requested' && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                            Hold Requested (Awaiting Vendor)
                          </span>
                        )}
                        {hold.status === 'vendor_confirmed' && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Vendor Confirmed Hold
                          </span>
                        )}
                        {hold.status === 'route_48h_dispatched' && (
                          <span className="px-2.5 py-1 bg-brass-50 text-brass-800 border border-brass-300 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brass-600" />
                            48h Route Dispatched to Driver
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-600">
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Service Date & Time:</span>
                        <strong className="text-neutral-900 font-bold">{hold.serviceDate} at {hold.serviceTime}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Requested Timestamp:</span>
                        <span>{hold.requestedAt}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">48h Route Status:</span>
                        <strong className={hold.status === 'route_48h_dispatched' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                          {hold.status === 'route_48h_dispatched' ? 'Routing Dispatched' : 'Pending Family Addresses'}
                        </strong>
                      </div>
                    </div>

                    {hold.notes && (
                      <p className="text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded-lg font-light">
                        <strong>Notes:</strong> {hold.notes}
                      </p>
                    )}

                    {/* Action Triggers */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100">
                      <div className="text-[10px] text-neutral-400">
                        Reminder Cadence: 48h ({hold.reminderSchedule.reminder48h.scheduledDate})
                      </div>

                      <div className="flex items-center space-x-2">
                        {hold.status === 'hold_requested' && (
                          <button
                            onClick={() => handleSimulateVendorConfirmation(hold)}
                            className="px-3 py-1.5 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-lg text-[10px] transition flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Simulate Vendor Confirmation</span>
                          </button>
                        )}

                        {hold.status !== 'route_48h_dispatched' && (
                          <button
                            onClick={() => setActiveRouteHoldId(hold.id)}
                            className="px-3 py-1.5 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-lg text-[10px] transition flex items-center gap-1 shadow-2xs"
                          >
                            <MapPin className="w-3 h-3 text-amber-300" />
                            <span>Input & Dispatch 48h Final Route</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 48-Hour Route Input Drawer */}
                    {activeRouteHoldId === hold.id && (
                      <div className="mt-3 p-3.5 bg-red-50/50 rounded-xl border border-red-200 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#800000] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            48-Hour Final Routing Dispatch Form
                          </span>
                          <button
                            onClick={() => setActiveRouteHoldId(null)}
                            className="text-neutral-400 hover:text-neutral-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-neutral-700 font-medium mb-1">Family Pickup Address</label>
                            <input
                              type="text"
                              value={pickupAddress}
                              onChange={(e) => setPickupAddress(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-neutral-900 focus:border-[#800000] outline-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-700 font-medium mb-1">Cortege Destination / Drop-off</label>
                            <input
                              type="text"
                              value={dropoffAddress}
                              onChange={(e) => setDropoffAddress(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-neutral-900 focus:border-[#800000] outline-none font-sans"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveRouteHoldId(null)}
                            className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDispatch48HourRoute(hold)}
                            className="px-4 py-1.5 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3 text-amber-300" />
                            <span>Transmit Final Route to Vendor</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-neutral-200 pt-3 flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-500 shrink-0 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All vehicle holds and 48-hour routing dispatches synchronize with the Woodlawn Cortege Logistics Engine.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition"
          >
            Close Livery Dispatcher
          </button>
        </div>

      </div>
    </div>
  );
};
