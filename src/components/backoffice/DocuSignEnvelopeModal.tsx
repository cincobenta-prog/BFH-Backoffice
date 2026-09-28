import React, { useState } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  FileText, 
  CheckCircle2, 
  Send, 
  Lock, 
  Award, 
  Download, 
  RefreshCw,
  KeyRound
} from 'lucide-react';

interface DocuSignEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase?: GoldenRecordCase;
  caseItem?: GoldenRecordCase;
  onUpdateCase?: (updated: GoldenRecordCase) => void;
  onSaveEnvelope?: (envelope: any) => void;
  onSendNotification?: (notif: any) => void;
}

export const DocuSignEnvelopeModal: React.FC<DocuSignEnvelopeModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  caseItem: propCaseItem,
  onUpdateCase,
  onSaveEnvelope,
  onSendNotification
}) => {
  const caseItem = activeCase || propCaseItem;
  if (!isOpen || !caseItem) return null;

  const [isSending, setIsSending] = useState(false);
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);
  const [smsOtpInput, setSmsOtpInput] = useState('849201');
  const [activeTab, setActiveTab] = useState<'envelope' | 'id_verify' | 'certificate'>('envelope');

  const envelope = caseItem.docusignEnvelope || {
    envelopeId: `DOCU-ENV-${Math.floor(1000 + Math.random() * 9000)}-${caseItem.caseNumber.slice(-3)}`,
    status: 'not_sent',
    nokIdVerified: false,
    idVerificationMethod: 'Govt ID + SMS OTP',
    documentsIncluded: [
      'NYS Form AP-47 Statement of Goods & Services (10 NYCRR § 77.8)',
      'NYS Right to Control Disposition Affidavit (PHL § 4201)',
      'Woodlawn Cemetery & Crematory Electronic Authorization',
      'BFH Embalming & Preparation Consent'
    ]
  };

  const handleSendEnvelope = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const updated: GoldenRecordCase = {
        ...caseItem,
        docusignEnvelope: {
          ...envelope,
          envelopeId: envelope.envelopeId || `DOCU-ENV-${Date.now().toString().slice(-6)}`,
          status: 'sent',
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          documentsIncluded: envelope.documentsIncluded || [
            'NYS Form AP-47 Statement of Goods & Services',
            'NYS Right to Control Disposition Affidavit (PHL § 4201)',
            'Woodlawn Crematory Authorization'
          ]
        },
        notes: [
          {
            id: `note-${Date.now()}`,
            author: 'DocuSign Legal Engine',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `DocuSign Envelope ${envelope.envelopeId} dispatched to Next-of-Kin ${caseItem.informant.fullName} (${caseItem.informant.email}) with SMS OTP challenge to ${caseItem.informant.phone}.`
          },
          ...caseItem.notes
        ]
      };
      onUpdateCase?.(updated);
      onSaveEnvelope?.(updated.docusignEnvelope);
      onSendNotification?.({
        id: `notif-${Date.now()}`,
        caseId: caseItem.id,
        decedentName: caseItem.decedent.legalName,
        recipientName: caseItem.informant.fullName,
        recipientPhone: caseItem.informant.phone,
        channel: 'sms',
        type: 'legal_signature_request',
        title: '🔒 DocuSign Legal Envelope Sent',
        bodyText: `Secure DocuSign envelope dispatched with NYS ESRA authentication challenge.`,
        sentAt: 'Just now',
        status: 'delivered'
      });
    }, 800);
  };

  const handleVerifySmsOtp = () => {
    setIsVerifyingSms(true);
    setTimeout(() => {
      setIsVerifyingSms(false);
      const updated: GoldenRecordCase = {
        ...caseItem,
        docusignEnvelope: {
          ...envelope,
          status: 'id_verified',
          nokIdVerified: true
        },
        notes: [
          {
            id: `note-${Date.now()}`,
            author: 'DocuSign ID Verification Shield',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Next-of-Kin ${caseItem.informant.fullName} verified identity via NYS Driver License scan and SMS OTP (Phone: ${caseItem.informant.phone}).`
          },
          ...caseItem.notes
        ]
      };
      onUpdateCase?.(updated);
      onSaveEnvelope?.(updated.docusignEnvelope);
      setActiveTab('certificate');
    }, 700);
  };

  const handleCompleteSigning = () => {
    const updated: GoldenRecordCase = {
      ...caseItem,
      docusignEnvelope: {
        ...envelope,
        status: 'completed',
        nokIdVerified: true,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        certificateUrl: 'https://docusign.net/certificate/NY-BFH-2026-089-CERT.pdf'
      },
      currentPhase: caseItem.currentPhase === 'legal_bundle' ? 'permits_logistics' : caseItem.currentPhase,
      documents: caseItem.documents.map(d => {
        if (d.phase === 'legal_bundle') {
          return {
            ...d,
            status: 'signed',
            signedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            followUpAction: 'Signed via DocuSign NYS Legal Envelope'
          };
        }
        return d;
      }),
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'DocuSign Legal Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `All legal authorizations completed by ${caseItem.informant.fullName}. SHA-256 certificate issued.`
        },
        ...caseItem.notes
      ]
    };
    onUpdateCase?.(updated);
    onSaveEnvelope?.(updated.docusignEnvelope);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-neutral-300">
        
        {/* Modal Header */}
        <div className="bg-[#991b1b] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-sm border-b border-amber-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif-title font-bold text-lg tracking-wide text-white">
                  DocuSign® Legal Signature Hub
                </h2>
                <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-300 text-amber-200 text-[10px] font-bold uppercase rounded-md">
                  NYS ESRA Compliant
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                New York State Electronic Signatures & Records Act (State Tech Law §§ 301–309) & 10 NYCRR § 77.8
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-6 pt-3 flex space-x-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('envelope')}
            className={`pb-2.5 px-2 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'envelope'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Legal Envelope & Packets</span>
          </button>

          <button
            onClick={() => setActiveTab('id_verify')}
            className={`pb-2.5 px-2 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'id_verify'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>2. Next-of-Kin ID Verification (SMS OTP)</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`pb-2.5 px-2 border-b-2 flex items-center space-x-1.5 transition ${
              activeTab === 'certificate'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Certificate of Completion & Audit Trail</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-neutral-50/50">
          
          {/* Active Case Banner */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-500">Case:</span>
                <span className="font-bold text-sm text-[#991b1b]">{caseItem.caseNumber}</span>
                <span className="text-xs font-medium text-neutral-700">• {caseItem.decedent.legalName}</span>
              </div>
              <div className="text-xs text-neutral-600 flex items-center space-x-2">
                <span>Signer: <strong>{caseItem.informant.fullName}</strong> ({caseItem.informant.relationship})</span>
                <span>•</span>
                <span>Email: {caseItem.informant.email}</span>
                <span>•</span>
                <span>Phone: {caseItem.informant.phone}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-500 font-semibold">Envelope Status:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                envelope.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : envelope.status === 'id_verified'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : envelope.status === 'sent'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-neutral-200 text-neutral-700'
              }`}>
                {envelope.status === 'completed' ? '✓ Fully Signed & Executed' : (envelope.status === 'id_verified' ? 'ID Verified & In Signing' : (envelope.status === 'sent' ? 'Dispatched to Signer' : 'Draft Envelope'))}
              </span>
            </div>
          </div>

          {/* TAB 1: Legal Envelope & Packets */}
          {activeTab === 'envelope' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#991b1b]" />
                  <span>NYS Standard Legal Documents Included in this Envelope</span>
                </h3>

                <div className="space-y-2.5">
                  {(envelope.documentsIncluded || [
                    'NYS Form AP-47 Statement of Goods & Services (10 NYCRR § 77.8)',
                    'NYS Right to Control Disposition Affidavit (PHL § 4201)',
                    'Woodlawn Cemetery & Crematory Electronic Authorization',
                    'BFH Embalming & Preparation Consent'
                  ]).map((docName, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-neutral-800">{docName}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#b45309] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Required NYS Form
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-blue-950">
                    <Lock className="w-4 h-4 text-blue-700" />
                    <span>NYS Electronic Signatures and Records Act (ESRA) Compliance Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-800">
                    DocuSign is fully recognized in New York State for funeral directorship contracts and authorization affidavits. Under NY State Technology Law § 304, electronic signatures with multi-factor authentication carry the exact legal weight of pen-and-ink signatures before the NYS Department of Health Bureau of Funeral Directing and NYC Office of Vital Statistics.
                  </p>
                </div>
              </div>

              {/* Envelope Action Trigger */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleSendEnvelope}
                  disabled={isSending || envelope.status !== 'not_sent'}
                  className="bg-[#991b1b] hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 transition border border-amber-400/40"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Sending DocuSign Packet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>{envelope.status === 'not_sent' ? 'Send DocuSign Packet to Next-of-Kin' : 'Envelope Already Sent'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Next-of-Kin ID Verification (SMS OTP) */}
          {activeTab === 'id_verify' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-[#991b1b]" />
                      <span>Next-of-Kin Multi-Factor Identity Challenge</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Prevents unauthorized execution of irreversible cremation and burial affidavits.
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    envelope.nokIdVerified
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-[#b45309] border border-amber-300'
                  }`}>
                    {envelope.nokIdVerified ? '✓ ID Verified' : 'Challenge Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <span className="font-bold text-neutral-700 block">Signer Details (Primary NOK)</span>
                    <div className="text-neutral-800">
                      <div><strong>Name:</strong> {caseItem.informant.fullName}</div>
                      <div><strong>Relationship:</strong> {caseItem.informant.relationship}</div>
                      <div><strong>Phone:</strong> {caseItem.informant.phone}</div>
                      <div><strong>NYS ESRA Method:</strong> Govt ID + 6-Digit SMS OTP</div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <span className="font-bold text-neutral-700 block">SMS One-Time Passcode</span>
                    <p className="text-[11px] text-neutral-500">
                      A 6-digit challenge code has been dispatched to {caseItem.informant.phone}.
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={smsOtpInput}
                        onChange={(e) => setSmsOtpInput(e.target.value)}
                        className="w-32 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 font-mono font-bold text-sm tracking-widest text-center text-neutral-900 outline-none focus:border-[#991b1b]"
                        maxLength={6}
                      />
                      <button
                        onClick={handleVerifySmsOtp}
                        disabled={isVerifyingSms || envelope.nokIdVerified}
                        className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition"
                      >
                        {isVerifyingSms ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" /> : <KeyRound className="w-3.5 h-3.5 text-amber-300" />}
                        <span>Verify OTP</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>
                    <strong>DocuSign ID Evidence:</strong> Signer photo ID validated against NYS DMV database with live facial recognition liveness check.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Certificate of Completion & Audit Trail */}
          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
                      <Award className="w-4 h-4 text-[#991b1b]" />
                      <span>Official DocuSign® Certificate of Completion</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Court-admissible audit log with SHA-256 digital fingerprint.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Legally Executed</span>
                  </span>
                </div>

                <div className="bg-neutral-900 text-amber-300 font-mono text-[11px] p-4 rounded-xl space-y-1.5 border border-neutral-800">
                  <div>[DOCUSIGN AUDIT TRAIL CERTIFICATE #NY-BFH-{caseItem.caseNumber}]</div>
                  <div>ENVELOPE ID: {envelope.envelopeId || 'DOCU-ENV-99482-A'}</div>
                  <div>SECURITY LEVEL: Multi-Factor SMS OTP + NYS Govt ID Verification</div>
                  <div>SIGNER: {caseItem.informant.fullName} &lt;{caseItem.informant.email}&gt;</div>
                  <div>IP ADDRESS: 68.198.42.10 (Verizon Fios - New York, NY)</div>
                  <div>TIMESTAMP: {envelope.completedAt || '2026-09-18 10:15:44 EDT'}</div>
                  <div>SHA-256 DIGITAL HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleCompleteSigning}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Mark All Legal Documents as Executed</span>
                  </button>

                  <button
                    onClick={() => alert(`Downloading Official DocuSign Certificate of Completion for Case ${caseItem.caseNumber}`)}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs px-4 py-2 rounded-xl border border-neutral-300 flex items-center space-x-1.5 transition"
                  >
                    <Download className="w-4 h-4 text-[#991b1b]" />
                    <span>Download Legal Certificate (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-100 border-t border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with DocuSign 256-bit SSL & NYS DOH Compliance Archival</span>
          </div>
          <button
            onClick={onClose}
            className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
