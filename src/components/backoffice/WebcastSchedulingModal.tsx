import React, { useState } from 'react';
import { 
  GoldenRecordCase, 
  WebcastScheduleInfo, 
  BroadcastVenueId,
  ServicePartnerContact
} from '../../lib/types/funeral';
import { 
  Video,
  Clock, 
  Calendar, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Phone, 
  Copy, 
  Check, 
  X
} from 'lucide-react';

interface WebcastSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: GoldenRecordCase;
  cases: GoldenRecordCase[];
  partners: ServicePartnerContact[];
  onSaveWebcast: (updatedWebcast: WebcastScheduleInfo) => void;
  onDispatchSMS: (recipient: string, message: string) => void;
}

export const WebcastSchedulingModal: React.FC<WebcastSchedulingModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  cases: _cases,
  partners,
  onSaveWebcast,
  onDispatchSMS
}) => {
  const currentWebcast = activeCase.webcastSchedule;

  const [isEnabled, setIsEnabled] = useState<boolean>(currentWebcast?.isEnabled ?? true);
  const [venueId, setVenueId] = useState<BroadcastVenueId>(currentWebcast?.venueId || 'chapel_1');
  const [streamStatus, setStreamStatus] = useState<WebcastScheduleInfo['streamStatus']>(currentWebcast?.streamStatus || 'scheduled');
  const [broadcastDate, setBroadcastDate] = useState<string>(currentWebcast?.broadcastDate || activeCase.serviceSelections.serviceDate || '2026-09-22');
  const [broadcastStartTime, setBroadcastStartTime] = useState<string>(currentWebcast?.broadcastStartTime || '10:30 AM');
  const [broadcastEndTime, setBroadcastEndTime] = useState<string>(currentWebcast?.broadcastEndTime || '01:00 PM');
  const [assignedDirector, setAssignedDirector] = useState<string>(currentWebcast?.assignedDirector || activeCase.assignedDirector || 'Jason Benta, LFD');
  
  const avPartners = partners.filter(p => p.category === 'broadcast_av_tech');
  const [assignedAvTech, setAssignedAvTech] = useState<string>(
    currentWebcast?.assignedAvTech || (avPartners[0]?.fullName ? `${avPartners[0].fullName} (${avPartners[0].organization || 'AV Lead'})` : 'Marcus Vance (Harlem Media AV)')
  );
  const [avTechPhone, setAvTechPhone] = useState<string>(currentWebcast?.avTechPhone || avPartners[0]?.phone || '(212) 555-4920');

  const [streamUrl, setStreamUrl] = useState<string>(currentWebcast?.streamUrl || `https://broadcast.e-bfh.com/live/${activeCase.caseNumber}`);
  const [isPinProtected, setIsPinProtected] = useState<boolean>(currentWebcast?.isPinProtected ?? true);
  const [securityPin, setSecurityPin] = useState<string>(currentWebcast?.securityPin || '1928');
  const [audioBoardVerified, setAudioBoardVerified] = useState<boolean>(currentWebcast?.audioBoardVerified ?? true);
  const [recordingArchived, setRecordingArchived] = useState<boolean>(currentWebcast?.recordingArchived ?? false);
  const [notes, setNotes] = useState<string>(currentWebcast?.notes || '4K PTZ Camera array active. Sanctuary soundboard direct feed calibrated.');
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [dispatchedAlert, setDispatchedAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const venueOptions = [
    {
      id: 'chapel_1' as BroadcastVenueId,
      name: 'Chapel 1 (Main Sanctuary)',
      seats: '120 Seats',
      setup: 'Dual 4K PTZ Camera Array • Pipe Organ/Piano Audio Feed • Pulpit Presets',
      badge: 'Primary Sanctuary Broadcast',
      color: 'border-[#800000] bg-red-50/50'
    },
    {
      id: 'chapel_2' as BroadcastVenueId,
      name: 'Chapel 2 (Harlem Sanctuary)',
      seats: '110 Seats',
      setup: 'Dual 4K PTZ Array • 360° Digi-Tribute Screens • Floral Alcove Cam',
      badge: 'Sanctuary Broadcast',
      color: 'border-amber-500 bg-amber-50/50'
    },
    {
      id: 'repast_room' as BroadcastVenueId,
      name: 'The Repast Room (Hospitality & Reception)',
      seats: '75 Seats',
      setup: 'Podium Camera • Ambient Dining Feed • Reception Remarks Mic',
      badge: 'Repast & Fellowship Broadcast',
      color: 'border-emerald-500 bg-emerald-50/50'
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSave = () => {
    const selectedVenue = venueOptions.find(v => v.id === venueId);
    const updatedWebcast: WebcastScheduleInfo = {
      isEnabled,
      venueId,
      venueName: selectedVenue?.name || 'Chapel 1 (Main Sanctuary)',
      streamStatus,
      broadcastDate,
      broadcastStartTime,
      broadcastEndTime,
      assignedDirector,
      assignedAvTech,
      avTechPhone,
      streamUrl,
      isPinProtected,
      securityPin: isPinProtected ? securityPin : undefined,
      cameraPresets: venueId === 'repast_room' 
        ? ['Podium Remarks', 'Family Head Table', 'Buffet Area Ambient', 'Wide Dining View']
        : ['Pulpit Sanctuary Wide', 'Casket & Floral Alcove', 'Choir & Pipe Organ', 'Family Pew Front View'],
      audioBoardVerified,
      recordingArchived,
      notes
    };

    onSaveWebcast(updatedWebcast);
    onClose();
  };

  const handleDispatchStaffSMS = () => {
    const selectedVenue = venueOptions.find(v => v.id === venueId);
    const message = `BENTA WEBCAST CALL: Service for ${activeCase.decedent.legalName} (${activeCase.caseNumber}) is scheduled to broadcast LIVE from ${selectedVenue?.name} on ${broadcastDate} at ${broadcastStartTime}. Assigned Director: ${assignedDirector}. AV Tech: ${assignedAvTech}. Stream: ${streamUrl} (PIN: ${isPinProtected ? securityPin : 'None'}). Please confirm soundboard feed and PTZ presets 45 mins prior.`;
    
    onDispatchSMS(avTechPhone, message);
    setDispatchedAlert(`SMS dispatched to ${assignedAvTech} at ${avTechPhone}`);
    setTimeout(() => setDispatchedAlert(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-amber-400 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-red-100 text-[#800000] rounded-xl">
                <Video className="w-5 h-5" />
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-neutral-900">
                Webcast & Live Broadcast Scheduler
              </h3>
            </div>
            <p className="text-xs text-neutral-600">
              Schedule live 4K sanctuary webcasting for <strong>{activeCase.decedent.legalName}</strong> (Case #{activeCase.caseNumber}).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hardware Location Constraint Notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-[#b45309] font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Facility Broadcast Hardware Constraints</span>
          </div>
          <p className="text-neutral-700 leading-relaxed">
            Hardware multi-camera streaming and direct master audio feeds are installed and supported <strong>strictly in Chapel 1, Chapel 2, and The Repast Room</strong>. Other parlors and offsite chapels require external mobile A/V rigs.
          </p>
        </div>

        {/* Form Body */}
        <div className="space-y-6">

          {/* Webcasting Enabled Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div>
              <div className="text-sm font-bold text-neutral-900">Enable Live Webcasting for this Service</div>
              <div className="text-xs text-neutral-500">Activates family viewing portal, live stream server, and guest invite links</div>
            </div>
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isEnabled ? 'bg-[#800000]' : 'bg-neutral-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${isEnabled ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>

          {isEnabled && (
            <>
              {/* 1. BROADCAST VENUE SELECTION (Strictly Chapel 1, Chapel 2, Repast Room) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Select Broadcast Production Venue *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {venueOptions.map((v) => {
                    const isSelected = venueId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setVenueId(v.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#800000] bg-red-50/70 shadow-md ring-2 ring-red-200' 
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#800000] text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                            {v.seats}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#800000]" />}
                        </div>
                        <h4 className="font-bold text-neutral-900 text-sm mt-2">{v.name}</h4>
                        <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{v.setup}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. DATE & BROADCAST TIME WINDOW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Broadcast Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={broadcastDate}
                      onChange={(e) => setBroadcastDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Live Start (Pre-Roll)</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={broadcastStartTime}
                      onChange={(e) => setBroadcastStartTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Live End Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={broadcastEndTime}
                      onChange={(e) => setBroadcastEndTime(e.target.value)}
                      placeholder="e.g. 01:00 PM"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. STAFF & A/V TECHNICIAN ASSIGNMENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Assigned Funeral Director</label>
                  <input
                    type="text"
                    value={assignedDirector}
                    onChange={(e) => setAssignedDirector(e.target.value)}
                    placeholder="e.g. Jason Benta, LFD"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Broadcast Sound & AV Engineer</label>
                  <select
                    value={assignedAvTech}
                    onChange={(e) => {
                      setAssignedAvTech(e.target.value);
                      const matched = avPartners.find(p => e.target.value.includes(p.fullName));
                      if (matched) setAvTechPhone(matched.phone);
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#800000]"
                  >
                    {avPartners.map(p => (
                      <option key={p.id} value={`${p.fullName} (${p.organization || 'AV Tech'})`}>
                        {p.fullName} — {p.roleTitle}
                      </option>
                    ))}
                    <option value="Marcus Vance (Harlem Media AV)">Marcus Vance (Harlem Media AV)</option>
                    <option value="Jasmine Thorne (Metro Stream)">Jasmine Thorne (Metro Stream)</option>
                  </select>
                </div>
              </div>

              {/* Broadcast Status & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Live Broadcast Status</label>
                  <select
                    value={streamStatus}
                    onChange={(e) => setStreamStatus(e.target.value as WebcastScheduleInfo['streamStatus'])}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:border-[#800000]"
                  >
                    <option value="scheduled">Scheduled (Awaiting Service Day)</option>
                    <option value="pre_roll">Pre-Roll Active (15-Min Buffer)</option>
                    <option value="live">🔴 Live Now (Broadcasting)</option>
                    <option value="archived">Archived & On-Demand Replay Ready</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">Engineering & Staging Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 4K PTZ Camera array active. Sanctuary soundboard direct feed."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              {/* 4. STREAM URL & SECURITY PIN */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-neutral-800">Family Stream URL & PIN Protection</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPinProtected(!isPinProtected)}
                    className="text-xs text-[#800000] font-bold hover:underline"
                  >
                    {isPinProtected ? 'Disable PIN (Public Stream)' : 'Enable Private PIN'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-[11px] text-neutral-500">Live Broadcast Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono text-neutral-800 outline-none"
                      />
                      <button
                        onClick={() => handleCopy(streamUrl)}
                        className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition"
                        title="Copy Link"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-600" />}
                      </button>
                    </div>
                  </div>

                  {isPinProtected && (
                    <div className="space-y-1">
                      <label className="block text-[11px] text-neutral-500">Access PIN Code</label>
                      <div className="relative">
                        <Key className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={securityPin}
                          onChange={(e) => setSecurityPin(e.target.value)}
                          placeholder="e.g. 1928"
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-neutral-900 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Hardware Checklist Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={audioBoardVerified}
                      onChange={(e) => setAudioBoardVerified(e.target.checked)}
                      className="rounded text-[#800000] focus:ring-0"
                    />
                    <span className="text-neutral-700">Soundboard Direct XLR Audio Feed Verified</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recordingArchived}
                      onChange={(e) => setRecordingArchived(e.target.checked)}
                      className="rounded text-[#800000] focus:ring-0"
                    />
                    <span className="text-neutral-700">Automatic 4K Master Cloud Recording</span>
                  </label>
                </div>
              </div>

              {/* 5. SMS DISPATCH TO DIRECTOR & AV TECH */}
              <div className="p-4 rounded-2xl bg-brass-50 border border-brass-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-brass-900 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-brass-700" />
                    <span>Send Automated Dispatch to Production Crew</span>
                  </div>
                  <p className="text-brass-700">
                    Sends SMS with call time, venue ({venueOptions.find(v => v.id === venueId)?.name}), and stream credentials to <strong>{assignedAvTech}</strong> ({avTechPhone}).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDispatchStaffSMS}
                  className="bg-brass-700 hover:bg-brass-800 text-white font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-brass-200" />
                  <span>Dispatch Crew SMS</span>
                </button>
              </div>

              {dispatchedAlert && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dispatchedAlert}</span>
                </div>
              )}

            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center border-t border-neutral-200 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-950/20 flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>Save & Update Webcast Schedule</span>
          </button>
        </div>

      </div>
    </div>
  );
};
