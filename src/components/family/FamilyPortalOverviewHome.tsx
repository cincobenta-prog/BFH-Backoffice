import React, { useState } from 'react';
import { GoldenRecordCase, SimulatedNotification } from '../../lib/types/funeral';
import { 
  Sparkles, 
  Video, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  ArrowRight, 
  Award, 
  Building, 
  ChevronRight,
  BookOpenText,
  Mic,
  MessagesSquare,
  FileSignature,
  ScrollText,
  Images,
  Church,
  BadgeCheck,
  Lightbulb
} from 'lucide-react';
import { Surface, SurfaceTile, SurfaceDark, IconChip, Badge } from '../ui/primitives';

interface FamilyPortalOverviewHomeProps {
  activeCase: GoldenRecordCase;
  onNavigateTab: (tab: 'obituary' | 'tribute' | 'webcast' | 'concierge' | 'arrangements' | 'documents' | 'photos') => void;
  onOpenESignModal?: () => void;
  onUpdateCase?: (updatedCase: GoldenRecordCase) => void;
  onSendNotification?: (notif: SimulatedNotification) => void;
  onOpenGuidedTour?: () => void;
}

export const FamilyPortalOverviewHome: React.FC<FamilyPortalOverviewHomeProps> = ({
  activeCase,
  onNavigateTab,
  onOpenESignModal: _onOpenESignModal,
  onUpdateCase: _onUpdateCase,
  onSendNotification: _onSendNotification,
  onOpenGuidedTour
}) => {
  const [toastMessage] = useState<string | null>(null);

  const pendingDocsCount = activeCase.documents.filter(d => d.status !== 'completed').length;

  const portalOfferings = [
    {
      id: 'obituary' as const,
      tab: 'obituary' as const,
      title: '9-Part Obituary & Life Story Studio',
      subtitle: 'Harlem Legacy Biographical Method',
      icon: BookOpenText,
      badge: 'Interactive Story Studio',
      badgeTone: 'brand' as const,
      description: 'Craft a timeless tribute using our guided 9-part interview. Generates polished narratives in 3 literary voices (Poetic, Traditional Faith, Journalistic) with zero AI hallucination.',
      highlights: [
        'Guided family voice & text interview questions',
        'Verified Fact Ledger cross-check against vital records',
        'Direct 1-click proof sign-off & print-ready typesetting'
      ],
      buttonText: 'Open Obituary Studio',
    },
    {
      id: 'tribute' as const,
      tab: 'tribute' as const,
      title: 'Digital Tribute',
      subtitle: `"Preserving our community's legacy" • Family Legacy Archived at Benta's Funeral Home and the Schaumburg Research Library`,
      icon: Mic,
      badge: 'Living Voice Keepsakes',
      badgeTone: 'brand' as const,
      description: 'Collect living voice memories from relatives, church elders, and lifelong friends worldwide. Curated stories are formatted into poetic stanzas and preserved in the museum-grade Heirloom Coffee Table Book.',
      highlights: [
        'Voice prompt cards across Joy, Pain, Sacrifice & Action reflections',
        'AI Poetic Stanza Formatter with audio playback preview',
        'Heirloom Coffee Table Book Volume with scan-to-stream QR codes'
      ],
      buttonText: 'Open Digital Tribute Studio',
    },
    {
      id: 'webcast' as const,
      tab: 'webcast' as const,
      title: '4K HD Live Sanctuary Webcasting & Guest Sharing',
      subtitle: 'Open Access Broadcast • No PIN Required for Out-of-Town Guests',
      icon: Video,
      badge: '4K Multi-Camera Live Stream',
      badgeTone: 'brand' as const,
      description: 'Join the sanctuary celebration of life from anywhere in the world. Features multi-angle 4K PTZ cameras and direct audio. All family, friends, and community members can access the stream directly with zero PIN required.',
      highlights: [
        'Open access stream link for instant SMS/WhatsApp sharing',
        'Multi-angle sanctuary PTZ cameras & pipe organ audio feed',
        '1-Page printable service bulletin with direct stream QR code'
      ],
      buttonText: 'Watch Webcast & Share',
    },
    {
      id: 'concierge' as const,
      tab: 'concierge' as const,
      title: '24/7 Family Care Concierge',
      subtitle: 'Live Director & Care Assistant',
      icon: MessagesSquare,
      badge: '24/7 Live Care Chat',
      badgeTone: 'brand' as const,
      description: 'Direct conversational chat with our family care assistant and funeral directors for answers about service arrangements, schedules, and guidance.',
      highlights: [
        'Instant conversational answers to questions about your case',
        'Immediate guidance on memorial schedules & service details',
        'Direct connection to Benta family care staff'
      ],
      buttonText: 'Chat with 24/7 Concierge',
    },
    {
      id: 'documents' as const,
      tab: 'documents' as const,
      title: 'Legal Authorizations & Digital eSign Suite',
      subtitle: 'State-Mandated Disposition Consents',
      icon: FileSignature,
      badge: pendingDocsCount > 0 ? `${pendingDocsCount} Action Required` : 'All Documents Signed',
      badgeTone: (pendingDocsCount > 0 ? 'action' : 'success') as 'action' | 'success',
      description: 'Review and legally sign required documents from any phone or computer with interactive preview, drawn signature pad, and instant PDF download.',
      highlights: [
        'NYC EDRS Vital Statistics authorization & permit release',
        'Form AP-47 Statement of Goods and NYS PHL § 4201 consents',
        'Interactive signature pad with certified timestamp certificate'
      ],
      buttonText: 'Review & eSign Documents',
    },
    {
      id: 'arrangements' as const,
      tab: 'arrangements' as const,
      title: 'Arrangement Summary & Transparent Accounting',
      subtitle: 'Itemized Statement of Goods & Split-Pay Ledger',
      icon: ScrollText,
      badge: 'Transparent Ledger',
      badgeTone: 'brand' as const,
      description: 'Clear itemized review of your selected service package, ceremonial casket or urn, chapel parlor reservation, and split-billing insurance/card payments.',
      highlights: [
        'Complete breakdown conforming to NYS General Price List (GPL)',
        'Direct online family split-payment contribution links',
        'Order of service schedule & cemetery/crematory destination'
      ],
      buttonText: 'View Arrangement Summary',
    },
    {
      id: 'photos' as const,
      tab: 'photos' as const,
      title: 'Memorial Photo Gallery & Announcement Studio',
      subtitle: 'High-Resolution Portrait Archives & Shareable Graphics',
      icon: Images,
      badge: 'Social & Text Graphics',
      badgeTone: 'brand' as const,
      description: 'Upload high-resolution family portraits and generate shareable digital funeral announcements for mobile text messaging and social media.',
      highlights: [
        'Designated placement tags: Front Cover, Inside Spread, Memorial Keepsake',
        'Custom themed digital announcements formatted for SMS and Instagram',
        'Safe cloud archive preserved for the family'
      ],
      buttonText: 'Upload Memorial Photos',
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. DIGNIFIED WELCOME HERO BANNER */}
      <SurfaceDark className="p-6 sm:p-10 shadow-xl">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-brass-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-4 opacity-[0.08] pointer-events-none hidden lg:block">
          <Building className="w-64 h-64 text-brass-300" />
        </div>

        <div className="max-w-3xl space-y-4 relative z-10">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="brand" className="bg-brass-400/15 text-brass-200 border-brass-400/40 px-3.5 py-1 text-[11px]">
              <Award className="w-3.5 h-3.5 text-brass-300" />
              <span>Benta's Private Family Care Portal</span>
            </Badge>
            <Badge tone="live" className="bg-emerald-500/15 text-emerald-200 border-emerald-400/40 px-3 py-1 text-[11px]">
              <span>Resting Safely in Care at 630 St. Nicholas Ave</span>
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-neutral-300 uppercase tracking-widest font-semibold">
              Welcoming {activeCase.informant.fullName} ({activeCase.informant.relationship}) & The Family
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
              In Loving Memory of<br />
              <strong className="text-amber-300">{activeCase.decedent.legalName}</strong>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-light italic">
              {activeCase.decedent.dateOfBirth} — {activeCase.decedent.dateOfDeath} • Case #{activeCase.caseNumber}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed max-w-2xl">
            This private portal is your family’s dedicated, 24/7 digital center to craft your loved one's story, invite friends to share voice tributes, review legal documents, watch the live sanctuary broadcast, and explore financial benefits with complete transparency.
          </p>

          {/* Quick Stats / Highlights Ribbon */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              {
                icon: Church,
                label: 'Sanctuary Service',
                value: activeCase.serviceSelections.serviceDate || 'Sep 22, 2026',
                note: activeCase.serviceSelections.viewingParlor
              },
              {
                icon: Video,
                label: '4K Live Webcast',
                value: 'Chapel 1 & 2 Active',
                note: 'Open Access • No PIN'
              },
              {
                icon: FileSignature,
                label: 'Legal eSign',
                value: pendingDocsCount > 0 ? `${pendingDocsCount} Pending Review` : 'All Completed',
                note: 'NYC EDRS Verified'
              },
              {
                icon: Phone,
                label: 'Director Hotline',
                value: '(212) 281-8850',
                note: 'Jason Benta, LFD'
              }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.07] backdrop-blur-sm p-3 rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <IconChip icon={stat.icon} size="sm" onDark />
                  <span className="text-[10px] text-brass-200 font-bold uppercase">{stat.label}</span>
                </div>
                <div className="font-bold text-white text-xs">{stat.value}</div>
                <div className="text-[10px] text-neutral-300">{stat.note}</div>
              </div>
            ))}
          </div>

          {/* Interactive Tutorial Launcher Banner */}
          {onOpenGuidedTour && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenGuidedTour}
                className="inline-flex items-center space-x-2 bg-brass-500 hover:bg-brass-600 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition transform hover:scale-[1.02] cursor-pointer"
                title="Start the 6-step interactive family portal guide"
              >
                <Sparkles className="w-4 h-4 text-neutral-950 animate-pulse" />
                <span>Start Interactive Family Guide (6 Comfort Steps)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-brass-200/90 italic">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>Guided walkthrough of your obituary suite, floral gifts, live webcast & legal vault</span>
              </span>
            </div>
          )}

        </div>
      </SurfaceDark>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1c1a1a] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* 1.5 CONFIRMATION OF COMPLETED ARRANGEMENT & ACTIVE MEMORIAL SERVICE */}
      <Surface className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <IconChip icon={BadgeCheck} size="sm" className="bg-emerald-50 text-emerald-700" />
              <span className="eyebrow-label text-emerald-700">
                Official Arrangement Confirmed • Benta's Funeral Home
              </span>
            </div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-neutral-900">
              Arrangements Finalized: Celebration of Life for {activeCase.decedent.legalName}
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Your binding funeral arrangements have been completed with Licensed Funeral Director Jason Benta. Your private Family Portal is active with all memorial tools below.
            </p>
          </div>

          <div>
            <Badge tone="success" className="px-3.5 py-1.5 text-xs gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Arrangement Completed &amp; Locked</span>
            </Badge>
          </div>
        </div>

        {/* 4-Card Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <SurfaceTile className="p-4 space-y-1">
            <span className="eyebrow-label text-neutral-500 block">Assigned Funeral Director</span>
            <strong className="text-[#800000] text-sm block font-serif-title">{activeCase.assignedDirector || 'Jason Benta, LFD #08850'}</strong>
            <span className="text-neutral-600 text-[11px] block">(212) 281-8850 • Direct Line</span>
          </SurfaceTile>

          <SurfaceTile className="p-4 space-y-1">
            <span className="eyebrow-label text-neutral-500 block">Statement of Goods (AP-47)</span>
            <strong className="text-emerald-700 text-sm block font-serif-title">Itemized &amp; Finalized</strong>
            <span className="text-neutral-600 text-[11px] block">NYS PHL § 3440-a Compliant</span>
          </SurfaceTile>

          <SurfaceTile className="p-4 space-y-1">
            <span className="eyebrow-label text-neutral-500 block">Sanctuary Service &amp; Chapel</span>
            <strong className="text-neutral-900 text-sm block font-serif-title">{activeCase.serviceSelections.viewingParlor || 'Chapel Sanctuary'}</strong>
            <span className="text-neutral-600 text-[11px] block">{activeCase.serviceSelections.serviceDate || 'Scheduled with Family'}</span>
          </SurfaceTile>

          <SurfaceTile className="p-4 space-y-1">
            <span className="eyebrow-label text-neutral-500 block">Family Access Credentials</span>
            <strong className="text-[#800000] text-sm block font-mono font-bold">PIN: 1948 (Unlocked)</strong>
            <span className="text-neutral-600 text-[11px] block">Universal Manager PIN: 3995</span>
          </SurfaceTile>

        </div>

      </Surface>

      {/* 2. "WHERE TO START" RECOMMENDED ACTION ROADMAP */}
      <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-[#800000]">
            <CheckCircle2 className="w-5 h-5 text-[#800000]" />
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900">
              Where Should Your Family Begin? (Recommended Journey)
            </h3>
          </div>
          <Badge tone="action" className="px-3 py-1">4-Step Priority Guide</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div 
            onClick={() => onNavigateTab('obituary')}
            className="surface-card surface-card-hover p-4 cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-brass-600/10 text-[#800000] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <BookOpenText className="w-4 h-4 text-brass-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-neutral-900">Tell Their Life Story</div>
            <p className="text-[11px] text-neutral-600 leading-snug">
              Answer 9 guided biographical questions to craft the official printed obituary and program bio.
            </p>
            <div className="text-[11px] text-[#800000] font-bold flex items-center space-x-1 group-hover:underline">
              <span>Start Story Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('documents')}
            className="surface-card surface-card-hover p-4 cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-brass-600/10 text-[#800000] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <FileSignature className="w-4 h-4 text-brass-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-neutral-900">eSign Authorizations</div>
            <p className="text-[11px] text-neutral-600 leading-snug">
              Review and sign state-required cremation, embalming, and vital records permits from your phone.
            </p>
            <div className="text-[11px] text-[#800000] font-bold flex items-center space-x-1 group-hover:underline">
              <span>Open eSign Pad</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('tribute')}
            className="surface-card surface-card-hover p-4 cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-brass-600/10 text-[#800000] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <Mic className="w-4 h-4 text-brass-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-neutral-900">Digital Tribute</div>
            <p className="text-[11px] text-neutral-600 leading-snug">
              Share voice tribute prompts so relatives can record living memories preserved in the Heirloom Book.
            </p>
            <div className="text-[11px] text-[#800000] font-bold flex items-center space-x-1 group-hover:underline">
              <span>Open Tribute Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('webcast')}
            className="surface-card surface-card-hover p-4 cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-brass-600/10 text-[#800000] font-bold text-xs flex items-center justify-center">
                4
              </span>
              <Video className="w-4 h-4 text-brass-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-neutral-900">Share Live Webcast Link</div>
            <p className="text-[11px] text-neutral-600 leading-snug">
              Send the live 4K sanctuary webcast link with zero PIN required for out-of-town mourners worldwide.
            </p>
            <div className="text-[11px] text-[#800000] font-bold flex items-center space-x-1 group-hover:underline">
              <span>View Webcast Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

      {/* 3. "WHAT THIS PORTAL OFFERS" COMPLETE 7-MODULE DIRECTORY */}
      <div className="space-y-4">
        
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-neutral-900">
              What This Portal Offers Your Family
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Explore the purpose-built studios and suites available inside your private Benta portal.
            </p>
          </div>
        </div>

        {/* 7-Card Grid (2 columns on large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portalOfferings.map((offering) => {
            const Icon = offering.icon;
            return (
              <Surface
                key={offering.id}
                hover
                className="p-6 sm:p-7 flex flex-col justify-between space-y-5 group"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center space-x-3">
                      <IconChip icon={Icon} size="lg" className="group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="font-serif-title text-lg font-bold text-neutral-900 leading-snug">
                          {offering.title}
                        </h3>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {offering.subtitle}
                        </span>
                      </div>
                    </div>

                    <Badge tone={offering.badgeTone} className="shrink-0">
                      {offering.badge}
                    </Badge>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {offering.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <SurfaceTile className="p-3.5 space-y-1.5 text-xs">
                    {offering.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-brass-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="text-[11px] leading-tight">{h}</span>
                      </div>
                    ))}
                  </SurfaceTile>

                </div>

                {/* Card Action Button */}
                <button
                  onClick={() => onNavigateTab(offering.tab)}
                  className="w-full bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm group-hover:shadow-md"
                >
                  <span>{offering.buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

              </Surface>
            );
          })}
        </div>

      </div>

      {/* 4. SECURITY, PRIVACY & LEGAL COMPLIANCE FOOTER CARD */}
      <SurfaceDark className="p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-4">
          <IconChip icon={ShieldCheck} size="lg" onDark className="p-3.5" />
          <div className="space-y-1">
            <h4 className="font-serif-title text-base sm:text-lg font-bold text-white">
              Bank-Grade Security & New York State Regulatory Compliance
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
              All electronic signatures are cryptographically sealed and comply with <strong>NYS Public Health Law § 4201</strong> and <strong>FTC Funeral Rules</strong>. Pre-need financial funds are held in 100% FDIC-insured trust escrow under NY GBL § 453.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:2122818850"
            className="px-5 py-3 bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs rounded-xl transition flex items-center space-x-2 shadow-sm"
          >
            <Phone className="w-4 h-4 text-brass-300" />
            <span>Call Director: (212) 281-8850</span>
          </a>
        </div>

      </SurfaceDark>

    </div>
  );
};
