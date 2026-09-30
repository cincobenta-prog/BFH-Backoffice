import React, { useState } from 'react';
import { GoldenRecordCase, SimulatedNotification, NotificationType } from '../../lib/types/funeral';
import { 
  Smartphone, 
  Send, 
  CheckCheck, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Radio, 
  PhoneCall, 
  FileSignature, 
  HeartHandshake, 
  Truck, 
  Calendar, 
  CreditCard,
  Terminal,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface LiveNotificationSimulatorModalProps {
  cases: GoldenRecordCase[];
  activeCase: GoldenRecordCase;
  notifications: SimulatedNotification[];
  onClose: () => void;
  onSendNotification: (notification: SimulatedNotification) => void;
  onSelectCase: (caseItem: GoldenRecordCase) => void;
  onOpenTwilioGateway?: () => void;
}

export const LiveNotificationSimulatorModal: React.FC<LiveNotificationSimulatorModalProps> = ({
  cases,
  activeCase,
  notifications,
  onClose,
  onSendNotification,
  onSelectCase,
  onOpenTwilioGateway
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCase.id);
  const [activeTab, setActiveTab] = useState<'quick_triggers' | 'composer' | 'audit_log'>('quick_triggers');
  const [deviceSkin, setDeviceSkin] = useState<'ios' | 'android'>('ios');
  
  // Custom composer state
  const [customMsgType] = useState<NotificationType>('custom_director_sms');
  const [customTitle, setCustomTitle] = useState('Personal Update from Director Benta');
  const [customBody, setCustomBody] = useState(
    `Dear ${activeCase.informant.fullName}, this is Director Jason Benta. Please let us know if you need any adjustments for ${activeCase.decedent.legalName}'s service arrangement.`
  );
  const [customActionBtnText, setCustomActionBtnText] = useState('Open Family Portal');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);

  const currentCase = cases.find(c => c.id === selectedCaseId) || activeCase;

  // Filter notifications for active case (or global)
  const caseNotifications = notifications.filter(n => n.caseId === currentCase.id);

  // Quick Preset Dispatch Handler
  const handleDispatchPreset = (type: NotificationType) => {
    setIsSending(true);
    let title = '';
    let body = '';
    let actionText = '';
    let actionUrl = '#';

    switch (type) {
      case 'portal_access_invite':
        title = "Official Family Portal Access & 9-Part Obituary Studio";
        body = `Dear ${currentCase.informant.fullName}, your private Benta's Family Portal for ${currentCase.decedent.legalName} (Case #${currentCase.caseNumber}) is now active. Access arrangement details, collaborate on the 9-part obituary, eSign legal documents, and listen to 360° digital voice tributes here: https://portal.e-bfh.com/case/${currentCase.caseNumber} • Passcode: 1928-BFH`;
        actionText = 'Open Secure Family Portal';
        actionUrl = '#portal';
        break;
      case 'tribute_share_invite':
        title = `Digital Tribute Invitation in Memory of ${currentCase.decedent.legalName}`;
        body = `The ${currentCase.decedent.legalName.split(' ').slice(-1)[0]} Family invites you to share a voice memory or written reflection for ${currentCase.decedent.legalName}'s digital keepsake archive. Listen and record your tribute here: https://e-bfh.com/tribute/${currentCase.caseNumber}`;
        actionText = 'Record Voice Tribute';
        actionUrl = '#tribute';
        break;
      case 'safe_arrival':
        title = 'Safe Arrival Confirmation at 630 St. Nicholas Ave';
        body = `Dear ${currentCase.informant.fullName}, this is Jason Benta from Benta's Funeral Home. We want to gently let you know that your beloved ${currentCase.decedent.legalName} has safely arrived into our dignified care at 630 Saint Nicholas Ave. Our custodial team is attending to them with the utmost reverence.`;
        actionText = 'View Family Portal';
        actionUrl = '#portal';
        break;
      case 'esign_request':
        title = 'Legal Authorization Bundle Ready for E-Signature';
        body = `Benta's Care Alert: Important legal authorizations (NYC EDRS Worksheet & Woodlawn Authorization) for ${currentCase.decedent.legalName} are ready for your review and secure digital signature.`;
        actionText = 'Sign Legal Documents';
        actionUrl = '#esign';
        break;
      case 'service_schedule':
        title = 'Celebration of Life Schedule & 4K Livestream Link';
        body = `Memorial Schedule Reminder: The Celebration of Life for ${currentCase.decedent.legalName} is scheduled for ${currentCase.serviceSelections.serviceDate || 'Upcoming Sunday'} at ${currentCase.serviceSelections.serviceTime || '2:00 PM'} in ${currentCase.serviceSelections.viewingParlor}. Family & friends worldwide may join the 4K HD broadcast stream here.`;
        actionText = 'Open 4K HD Livestream';
        actionUrl = '#stream';
        break;
      case 'woodlawn_departure':
        title = 'Dignified Transport Escort to Woodlawn Crematory';
        body = `Benta's Logistics Update: Dignified cortege transport for ${currentCase.decedent.legalName} has departed 630 St. Nicholas Ave under Director Benta escort heading to Woodlawn Crematory (Bronx, NY). Estimated arrival: 45 minutes.`;
        actionText = 'Track Logistics';
        actionUrl = '#logistics';
        break;
      case 'payment_receipt':
        title = 'Financial Verification & Split-Billing Statement';
        body = `Benta's Billing Center: Payment verification completed for ${currentCase.decedent.legalName}. Total contract amount: $${currentCase.totalAmountDue.toLocaleString()}. Split billing allocations across ACH and Life Insurance verified active.`;
        actionText = 'View Itemized Receipt';
        actionUrl = '#billing';
        break;
      case 'aftercare_checkin':
        title = 'Day 7 Grief Support & Family Nurture Check-in';
        body = `Dear ${currentCase.informant.fullName}, the Benta family is holding you close in our thoughts following the services for ${currentCase.decedent.legalName}. We are here 24/7 if you need assistance with certified death certificate copies or memorial keepsakes.`;
        actionText = 'Access Grief Resources';
        actionUrl = '#aftercare';
        break;
      default:
        title = 'Benta Care Update';
        body = `Update from Benta's Funeral Home regarding ${currentCase.decedent.legalName}.`;
        actionText = 'Open Portal';
        actionUrl = '#portal';
    }

    const newNotif: SimulatedNotification = {
      id: `notif-${Date.now()}`,
      caseId: currentCase.id,
      decedentName: currentCase.decedent.legalName,
      recipientName: currentCase.informant.fullName,
      recipientPhone: currentCase.informant.phone,
      recipientEmail: currentCase.informant.email,
      channel: 'sms',
      type: type,
      title: title,
      bodyText: body,
      sentAt: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'delivered',
      actionUrl: actionUrl,
      actionButtonText: actionText,
      metadata: {
        carrier: 'Verizon Wireless (NYC 5G)',
        deliveryLatencyMs: Math.floor(Math.random() * 120) + 110,
        twilioMessageSid: `SM${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`,
        readReceiptTimestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    };

    setTimeout(() => {
      onSendNotification(newNotif);
      setIsSending(false);
      setSendSuccessToast(`SMS alert dispatched to ${currentCase.informant.phone} (${currentCase.informant.fullName})`);
      setTimeout(() => setSendSuccessToast(null), 4000);
    }, 400);
  };

  // Custom Message Dispatch Handler
  const handleSendCustomSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBody.trim()) return;

    setIsSending(true);
    const newNotif: SimulatedNotification = {
      id: `notif-${Date.now()}`,
      caseId: currentCase.id,
      decedentName: currentCase.decedent.legalName,
      recipientName: currentCase.informant.fullName,
      recipientPhone: currentCase.informant.phone,
      recipientEmail: currentCase.informant.email,
      channel: 'sms',
      type: customMsgType,
      title: customTitle,
      bodyText: customBody,
      sentAt: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'delivered',
      actionUrl: '#portal',
      actionButtonText: customActionBtnText,
      metadata: {
        carrier: 'T-Mobile US (Harlem Node)',
        deliveryLatencyMs: 145,
        twilioMessageSid: `SM${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`,
        readReceiptTimestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    };

    setTimeout(() => {
      onSendNotification(newNotif);
      setIsSending(false);
      setSendSuccessToast(`Custom SMS dispatched to ${currentCase.informant.fullName}`);
      setTimeout(() => setSendSuccessToast(null), 4000);
    }, 400);
  };

  const insertTag = (tag: string) => {
    setCustomBody(prev => `${prev} ${tag}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-6xl w-full p-5 sm:p-7 space-y-5 shadow-2xl text-neutral-900 my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-200 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#991b1b] shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-title font-bold text-xl text-neutral-900">
                  Live Family SMS & Notification Dispatch Hub
                </h3>
                {onOpenTwilioGateway ? (
                  <button
                    onClick={onOpenTwilioGateway}
                    title="Click to configure Twilio API keys, phone number, and send test SMS"
                    className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                    Twilio 5G Gateway Active
                    <span className="text-[9px] text-emerald-600 underline ml-0.5 font-normal">Configure</span>
                  </button>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                    Twilio 5G Gateway Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-light">
                Real-time interactive mobile preview of SMS text dispatches and digital touchpoints sent to Next of Kin.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Case Selector Dropdown */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Case:</span>
              <select
                value={selectedCaseId}
                onChange={(e) => {
                  setSelectedCaseId(e.target.value);
                  const found = cases.find(c => c.id === e.target.value);
                  if (found) {
                    onSelectCase(found);
                    setCustomBody(`Dear ${found.informant.fullName}, this is Director Jason Benta regarding ${found.decedent.legalName}.`);
                  }
                }}
                className="bg-[#f8fafc] border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-900 focus:border-[#991b1b] outline-none"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} • {c.decedent.legalName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {sendSuccessToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-medium animate-fadeIn shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{sendSuccessToast}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md font-mono">
              HTTP 200 OK
            </span>
          </div>
        )}

        {/* Main Content: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto">
          
          {/* LEFT COLUMN (5 cols): REALISTIC SMARTPHONE VIEWPORT */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-2 bg-[#f8fafc] rounded-2xl border border-neutral-200">
            
            {/* Skin Toggle */}
            <div className="flex items-center space-x-2 mb-2 self-end">
              <span className="text-[10px] text-neutral-400 font-medium">Device:</span>
              <button
                onClick={() => setDeviceSkin('ios')}
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${deviceSkin === 'ios' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
              >
                iOS 18
              </button>
              <button
                onClick={() => setDeviceSkin('android')}
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${deviceSkin === 'android' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
              >
                Android 15
              </button>
            </div>

            {/* Handset Outer Frame */}
            <div className="w-[320px] sm:w-[340px] h-[580px] bg-neutral-950 rounded-[48px] p-3 shadow-2xl border-4 border-neutral-800 flex flex-col relative overflow-hidden ring-1 ring-black/50">
              
              {/* Dynamic Island / Bezel Top */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mr-2"></div>
                <div className="w-2 h-2 rounded-full bg-[#991b1b]/40"></div>
              </div>

              {/* Screen Display Container */}
              <div className="w-full h-full bg-[#f2f2f7] rounded-[38px] flex flex-col overflow-hidden text-neutral-900 text-xs">
                
                {/* Phone Status Bar */}
                <div className="pt-2 px-6 pb-1 flex justify-between items-center text-[10px] font-semibold text-neutral-800 shrink-0">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-bold">5G</span>
                    <div className="w-4 h-2 rounded-sm border border-neutral-800 p-0.5 flex items-center">
                      <div className="h-full w-full bg-neutral-800 rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                {/* SMS Sender Header */}
                <div className="bg-[#ffffff]/90 backdrop-blur-md px-4 py-2.5 border-b border-neutral-300 flex items-center justify-between shrink-0 shadow-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#991b1b] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                      BFH
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-[11px] text-neutral-900">Benta's Care Alert</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono">(212) 281-8850 • Verified</span>
                    </div>
                  </div>

                  <a 
                    href="tel:2122818850"
                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-700"
                    title="Simulate Call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Chat Message Scrollable Viewport */}
                <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-gradient-to-b from-[#f2f2f7] to-[#e5e5ea]">
                  
                  {/* Encryption Badge */}
                  <div className="text-center">
                    <span className="inline-block bg-neutral-300/60 text-neutral-600 text-[9px] px-2.5 py-0.5 rounded-full font-medium shadow-2xs">
                      🔒 End-to-End Encrypted Carrier Stream
                    </span>
                  </div>

                  {caseNotifications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400 space-y-2">
                      <MessageSquare className="w-8 h-8 mx-auto stroke-1" />
                      <p className="text-[11px]">No SMS messages sent to this family yet.</p>
                      <p className="text-[9px] text-neutral-500">Use the triggers on the right to dispatch an alert.</p>
                    </div>
                  ) : (
                    caseNotifications.map((notif) => (
                      <div key={notif.id} className="space-y-1">
                        
                        {/* Date Tag */}
                        <div className="text-center">
                          <span className="text-[8px] text-neutral-400 font-medium uppercase tracking-wider">
                            {notif.sentAt}
                          </span>
                        </div>

                        {/* Incoming BFH Bubble */}
                        <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-neutral-200/80 space-y-2">
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                            <span className="font-bold text-[10px] text-[#991b1b] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#d4af37]" />
                              {notif.title}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-800 leading-relaxed font-sans">
                            {notif.bodyText}
                          </p>

                          {notif.actionButtonText && (
                            <div className="pt-1">
                              <div className="w-full py-1.5 bg-[#991b1b] hover:bg-red-800 text-white rounded-lg text-center font-bold text-[10px] flex items-center justify-center space-x-1 shadow-2xs border border-amber-300/30">
                                <span>{notif.actionButtonText}</span>
                                <ExternalLink className="w-3 h-3 text-amber-300" />
                              </div>
                            </div>
                          )}

                          {/* Delivery Receipt */}
                          <div className="flex items-center justify-end space-x-1 pt-0.5">
                            <span className="text-[8px] text-neutral-400">
                              {notif.status === 'read' ? 'Read' : 'Delivered'}
                            </span>
                            <CheckCheck className={`w-3 h-3 ${notif.status === 'read' ? 'text-blue-500' : 'text-neutral-400'}`} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Simulated Family Reply Bubble */}
                  {caseNotifications.length > 0 && (
                    <div className="flex justify-end pt-1">
                      <div className="bg-[#007aff] text-white rounded-2xl rounded-tr-sm p-2.5 max-w-[85%] shadow-sm space-y-0.5">
                        <p className="text-[10px] leading-snug">
                          Thank you Director Benta. Our family truly appreciates your swift care and respect. We are tracking everything in the portal.
                        </p>
                        <div className="flex items-center justify-end space-x-1">
                          <span className="text-[8px] text-blue-100">Delivered</span>
                          <CheckCheck className="w-2.5 h-2.5 text-blue-200" />
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Simulated Phone Input Bar */}
                <div className="p-2 bg-white/95 border-t border-neutral-200 flex items-center space-x-1.5 shrink-0">
                  <div className="flex-1 bg-neutral-100 border border-neutral-300 rounded-full px-3 py-1 text-[10px] text-neutral-400">
                    iMessage • Next of Kin
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#007aff] text-white flex items-center justify-center shadow-xs">
                    <Send className="w-3 h-3" />
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="pb-1 pt-0.5 flex justify-center bg-white shrink-0">
                  <div className="w-24 h-1 bg-neutral-900 rounded-full"></div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (7 cols): DIRECTOR CONTROLS & AUDIT ENGINE */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Recipient Snapshot Card */}
            <div className="p-4 bg-gradient-to-r from-red-50/70 via-white to-amber-50/50 rounded-2xl border border-red-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#991b1b] uppercase tracking-wider">Recipient Next of Kin</span>
                  <span className="px-2 py-0.2 text-[9px] font-bold bg-[#991b1b] text-white rounded-full">
                    {currentCase.informant.relationship}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900">
                  {currentCase.informant.fullName}
                </h4>
                <p className="text-xs text-neutral-600 font-mono">
                  📱 {currentCase.informant.phone} • ✉️ {currentCase.informant.email}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-red-200 sm:pl-4 space-y-0.5">
                <span className="text-[10px] text-neutral-500 block">Active Case</span>
                <span className="font-bold text-xs text-neutral-900 block">{currentCase.decedent.legalName}</span>
                <span className="text-[10px] text-[#991b1b] font-medium font-mono">{currentCase.caseNumber}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-200 gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('quick_triggers')}
                className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'quick_triggers'
                    ? 'border-[#991b1b] text-[#991b1b]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>One-Click Lifecycle Triggers</span>
              </button>

              <button
                onClick={() => setActiveTab('composer')}
                className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'composer'
                    ? 'border-[#991b1b] text-[#991b1b]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Custom SMS Composer</span>
              </button>

              <button
                onClick={() => setActiveTab('audit_log')}
                className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'audit_log'
                    ? 'border-[#991b1b] text-[#991b1b]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Twilio Carrier Audit Log ({caseNotifications.length})</span>
              </button>
            </div>

            {/* TAB 1: ONE-CLICK QUICK TRIGGERS */}
            {activeTab === 'quick_triggers' && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <p className="text-xs text-neutral-600 font-light">
                  Click any verified funeral lifecycle milestone to immediately dispatch an automated SMS text with secure tokenized action links:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Trigger 0A: Family Portal Access Invitation (Email & SMS) */}
                  <button
                    onClick={() => handleDispatchPreset('portal_access_invite')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-amber-50/50 border-2 border-amber-400/80 rounded-xl text-left transition space-y-1.5 shadow-sm group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-[#991b1b] text-amber-300 flex items-center justify-center font-bold text-xs">
                          ✉️
                        </div>
                        <span className="font-bold text-xs text-[#991b1b]">
                          Family Portal Access (Email + SMS)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#b45309] font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                        Dual Delivery
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Sends personalized email and SMS to {currentCase.informant.fullName} ({currentCase.informant.phone}) with login PIN for 9-part obituary studio and digital tributes.
                    </p>
                  </button>

                  {/* Trigger 0B: Digital Tribute Friend Invitation */}
                  <button
                    onClick={() => handleDispatchPreset('tribute_share_invite')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-red-50/50 border-2 border-red-300 rounded-xl text-left transition space-y-1.5 shadow-sm group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-[#b45309] text-white flex items-center justify-center font-bold text-xs">
                          🎙️
                        </div>
                        <span className="font-bold text-xs text-neutral-900 group-hover:text-[#991b1b]">
                          Digital Tribute Friend Invite (SMS/Email)
                        </span>
                      </div>
                      <span className="text-[10px] text-red-800 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        Guest Tribute
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Dispatches guest tribute link and voice recording invitation to relatives and friends for {currentCase.decedent.legalName}.
                    </p>
                  </button>

                  {/* Trigger 1: Safe Arrival */}
                  <button
                    onClick={() => handleDispatchPreset('safe_arrival')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-red-50/40 border border-neutral-200 hover:border-red-300 rounded-xl text-left transition space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-red-100/70 text-[#991b1b] flex items-center justify-center font-bold">
                        🌟
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Immediate Comfort
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 group-hover:text-[#991b1b]">
                      1. Safe Arrival at BFH
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      Reassures Next of Kin that decedent is in dignified custody at 630 St. Nicholas Ave.
                    </p>
                  </button>

                  {/* Trigger 2: eSign Request */}
                  <button
                    onClick={() => handleDispatchPreset('esign_request')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-amber-50/40 border border-neutral-200 hover:border-amber-300 rounded-xl text-left transition space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center font-bold">
                        <FileSignature className="w-4 h-4 text-[#b45309]" />
                      </div>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Legal Action Link
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 group-hover:text-[#b45309]">
                      2. Legal eSign Authorization Bundle
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      Sends direct digital link for signing EDRS worksheet and Woodlawn Cremation forms.
                    </p>
                  </button>

                  {/* Trigger 3: Service Schedule & Stream */}
                  <button
                    onClick={() => handleDispatchPreset('service_schedule')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-blue-50/40 border border-neutral-200 hover:border-blue-300 rounded-xl text-left transition space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-900 flex items-center justify-center font-bold">
                        <Calendar className="w-4 h-4 text-blue-800" />
                      </div>
                      <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        4K HD Livestream
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 group-hover:text-blue-800">
                      3. Service Schedule & Stream URL
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      Confirms Chapel A/B timing, organist, and shareable 4K streaming link for family worldwide.
                    </p>
                  </button>

                  {/* Trigger 4: Woodlawn Departure */}
                  <button
                    onClick={() => handleDispatchPreset('woodlawn_departure')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-purple-50/40 border border-neutral-200 hover:border-purple-300 rounded-xl text-left transition space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-purple-100/70 text-purple-900 flex items-center justify-center font-bold">
                        <Truck className="w-4 h-4 text-purple-800" />
                      </div>
                      <span className="text-[10px] text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Logistics Escort
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 group-hover:text-purple-800">
                      4. Woodlawn Crematory Departure
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      Transmits cortege departure alert with Director Benta escort to Bronx crematory.
                    </p>
                  </button>

                  {/* Trigger 5: Split-Billing Statement */}
                  <button
                    onClick={() => handleDispatchPreset('payment_receipt')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-emerald-50/40 border border-neutral-200 hover:border-emerald-300 rounded-xl text-left transition space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-900 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4 text-emerald-800" />
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Financial Statement
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 group-hover:text-emerald-800">
                      5. Payment & Insurance Verification
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      Dispatches verified ACH and C&J Life Insurance assignment confirmation receipts.
                    </p>
                  </button>

                  {/* Trigger 6: Aftercare Nurture */}
                  <button
                    onClick={() => handleDispatchPreset('aftercare_checkin')}
                    disabled={isSending}
                    className="p-3.5 bg-white hover:bg-rose-50/40 border border-neutral-200 hover:border-rose-300 rounded-xl text-left transition space-y-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-rose-100/70 text-rose-900 flex items-center justify-center font-bold">
                        <HeartHandshake className="w-4 h-4 text-rose-800" />
                      </div>
                      <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Grief & Nurture
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 group-hover:text-rose-800">
                      6. Day 7 / 30 Grief Support Check-in
                    </h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      Compassionate sympathy check-in with certified death certificate delivery updates.
                    </p>
                  </button>

                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM DIRECTOR SMS COMPOSER */}
            {activeTab === 'composer' && (
              <form onSubmit={handleSendCustomSMS} className="space-y-3.5 flex-1 overflow-y-auto pr-1 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Message Subject / Title</label>
                    <input
                      type="text"
                      required
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 font-bold focus:border-[#991b1b] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Action Button Text (Optional)</label>
                    <input
                      type="text"
                      value={customActionBtnText}
                      onChange={(e) => setCustomActionBtnText(e.target.value)}
                      placeholder="e.g. Open Family Portal"
                      className="w-full bg-[#f8fafc] border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:border-[#991b1b] outline-none"
                    />
                  </div>
                </div>

                {/* Merge Tag Insert Quick Buttons */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1.5">Insert Dynamic Merge Tags:</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertTag(currentCase.informant.fullName)}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-mono text-[10px]"
                    >
                      + {currentCase.informant.fullName} (Informant)
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag(currentCase.decedent.legalName)}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-mono text-[10px]"
                    >
                      + {currentCase.decedent.legalName} (Decedent)
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag(currentCase.serviceSelections.viewingParlor)}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-mono text-[10px]"
                    >
                      + Chapel Selection
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('https://e-bfh.com/portal')}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-mono text-[10px]"
                    >
                      + Secure Portal URL
                    </button>
                  </div>
                </div>

                {/* Body Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-neutral-700 font-medium">SMS Message Text (Twilio GSM Segment)</label>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {customBody.length} chars ({Math.ceil(customBody.length / 160)} SMS Segments)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:border-[#991b1b] outline-none leading-relaxed"
                  />
                </div>

                {/* Dispatch Button */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="bg-[#991b1b] hover:bg-red-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-sm border border-amber-300/40 flex items-center space-x-1.5"
                  >
                    {isSending ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Dispatch Custom SMS to {currentCase.informant.fullName}</span>
                  </button>
                </div>

              </form>
            )}

            {/* TAB 3: TWILIO CARRIER DELIVERY AUDIT LOG */}
            {activeTab === 'audit_log' && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 text-xs">
                <div className="p-3 bg-neutral-900 text-neutral-300 rounded-xl font-mono text-[11px] space-y-2 border border-neutral-800">
                  <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-800 pb-1.5 text-[10px]">
                    <span>TWILIO CARRIER GATEWAY LOG</span>
                    <span className="text-emerald-400">STATUS: HEALTHY (100% DELIVERABILITY)</span>
                  </div>

                  {caseNotifications.map((n, i) => (
                    <div key={n.id} className="p-2 bg-neutral-800/60 rounded-lg space-y-1 text-[10px]">
                      <div className="flex justify-between text-neutral-400">
                        <span className="text-amber-400 font-bold">[{i + 1}] {n.title}</span>
                        <span className="text-emerald-400 font-mono">{n.metadata?.twilioMessageSid}</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span>Recipient: {n.recipientName} ({n.recipientPhone})</span>
                        <span className="text-neutral-400">{n.sentAt}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500 font-mono text-[9px]">
                        <span>Carrier: {n.metadata?.carrier || 'Verizon 5G'}</span>
                        <span>Latency: {n.metadata?.deliveryLatencyMs || 180}ms • HTTP 200 OK</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-neutral-200 pt-3 flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-500 shrink-0 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All outgoing SMS messages are logged in the Golden Record audit ledger for legal compliance.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition"
          >
            Close Notification Hub
          </button>
        </div>

      </div>
    </div>
  );
};
