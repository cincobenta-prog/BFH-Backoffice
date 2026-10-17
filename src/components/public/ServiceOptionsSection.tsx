import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface ServiceOptionsSectionProps {
  onSelectService: (serviceType: string) => void;
}

export const ServiceOptionsSection: React.FC<ServiceOptionsSectionProps> = ({ onSelectService }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'cremation' | 'burial' | 'preneed'>('all');

  const packages = [
    {
      id: 'direct_cremation',
      category: 'cremation',
      title: 'Direct Cremation',
      subtitle: 'Dignified immediate cremation without formal viewing or ceremonies',
      features: [
        'Local removal from hospital or residence within NYC',
        'Sheltering in climate-controlled facility at 630 St. Nicholas Ave',
        'Filing of NYC EDRS electronic death certificate & transit permits',
        'Alternative eco-friendly rigid cremation container included',
        'Transportation via funeral vehicle to Woodlawn Crematory (Bronx, NY)',
        'Return of cremated remains to Next of Kin in temporary container',
        'Instant Safe Arrival digital confirmation dispatched to family'
      ],
      badge: 'Direct Disposition',
      recommended: false
    },
    {
      id: 'cremation_memorial',
      category: 'cremation',
      title: 'Cremation and Memorial Service',
      subtitle: 'Direct cremation followed by a commemorative memorial celebration in Benta’s Chapel',
      features: [
        'All baseline services of Direct Cremation (transfer, sheltering, permits, crematory transport)',
        'Use of Chapel A (120 seats) or Chapel B (110 seats) for memorial service',
        'Full Funeral Director supervision & staff coordination of the memorial celebration',
        'Handcrafted bronze or engraved hardwood keepsake urn display arrangement',
        'Guest register book & digital condolences guestbook kiosk',
        'Full customization with printing options (programs & prayer cards)',
        'Available add-ons: Officiant & organist, limousine motorcade, and repast room'
      ],
      badge: 'Popular Choice',
      recommended: true
    },
    {
      id: 'full_cremation',
      category: 'cremation',
      title: 'Funeral Service with Cremation',
      subtitle: 'Complete traditional funeral gathering with viewing and ceremony, followed by cremation',
      features: [
        'Professional services of Licensed Funeral Director & Staff',
        'Embalming, restorative art, sanitary care, cosmetology & dressing',
        'Use of Chapel A (120 seats) or Chapel B (110 seats) for 2–3 hour visitation & service',
        'The Woodlawn Ceremonial Oak Rental Casket with custom velvet interior insert',
        'Custom printed memorial programs & thank-you acknowledgement cards',
        'Filing of all NYC EDRS legal permits & Woodlawn Crematory scheduling',
        'Choice of engraved handcrafted memorial urn',
        '360° Digi-Tribute online memorial hub & live HD chapel webcast'
      ],
      badge: 'Full Honors & Viewing',
      recommended: false
    },
    {
      id: 'direct_burial',
      category: 'burial',
      title: 'Direct Earth Burial',
      subtitle: 'Immediate, dignified interment without formal public viewing or chapel ceremonies',
      features: [
        'Prompt local transfer into Benta’s care within NYC',
        'Securing physician signature & NYC EDRS burial permit',
        'Sheltering and sanitary preparation',
        'Transportation via funeral coach to local NYC/Woodlawn cemetery',
        'Coordination with cemetery grave opening and closing officials',
        'Full itemized documentation & certified death certificate processing'
      ],
      badge: 'Direct Burial',
      recommended: false
    },
    {
      id: 'full_burial',
      category: 'burial',
      title: 'Traditional Service and Burial',
      subtitle: 'Full-service ceremonial honors, church/chapel service, motorcade cortege, and committal',
      features: [
        '24/7 staff transfer and professional restorative art preparation & embalming',
        'Two-day visitation or extended church wake (e.g. Abyssinian Baptist or BFH Chapel)',
        'Lead car, Cadillac funeral coach hearse & family limousine escort',
        'Custom programs, guest register book, photo prayer cards & floral coordination',
        'Cemetery committal service coordination at Woodlawn / Ferncliff / Calverton',
        'Military Honors coordination for eligible Veterans (DD-214)',
        'Comprehensive post-service Day-7 aftercare & grief resource pack'
      ],
      badge: 'Traditional Excellence',
      recommended: false
    },
    {
      id: 'pre_need',
      category: 'preneed',
      title: 'Pre-Need Advance Life Planning',
      subtitle: 'Lock in current market prices and spare loved ones future emotional and financial burden',
      features: [
        'Free one-on-one consultation in parlor or over secure video',
        'Pre-Funded New York Pre-Plan Trust (100% FDIC insured / NYS Law § 453)',
        'Detailed personal wishes recording (music, scripture, casket or urn preference)',
        'Life Insurance assignment evaluation & pre-qualification',
        'Transferable policy protection across all jurisdictions',
        'Peace of mind guaranteed for generations'
      ],
      badge: 'Advance Protection',
      recommended: false
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    if (activeTab === 'all') return true;
    return pkg.category === activeTab;
  });

  return (
    <section id="services" className="py-20 bg-[#faf8f3] border-b border-benta-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-neutral-900">
            Arrangement & Service Options
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
            Every family is unique. Whether you choose Direct Cremation, Cremation with a Memorial Service, Funeral Service with Cremation, Direct Earth Burial, or Traditional Service and Burial, Benta’s provides complete itemized transparency.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'all'
                  ? 'bg-[#a0080e] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#a0080e] border border-neutral-200'
              }`}
            >
              All Options ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab('cremation')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'cremation'
                  ? 'bg-[#a0080e] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#a0080e] border border-neutral-200'
              }`}
            >
              Cremation Services (3)
            </button>
            <button
              onClick={() => setActiveTab('burial')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'burial'
                  ? 'bg-[#a0080e] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#a0080e] border border-neutral-200'
              }`}
            >
              Burial Services (2)
            </button>
            <button
              onClick={() => setActiveTab('preneed')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'preneed'
                  ? 'bg-[#a0080e] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#a0080e] border border-neutral-200'
              }`}
            >
              Pre-Need Planning
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-none p-7 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.recommended
                  ? 'bg-white border-2 border-[#a0080e] shadow-xl transform lg:-translate-y-2 ring-2 ring-benta-400/20'
                  : 'bg-white border border-neutral-200 hover:border-benta-200 shadow-sm hover:shadow-md'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#a0080e] to-[#7d060b] text-white font-bold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-brass-300/40">
                  {pkg.badge}
                </div>
              )}

              <div>
                {!pkg.recommended && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#a0080e] bg-benta-50 px-2.5 py-1 rounded border border-benta-200 inline-block mb-3">
                    {pkg.badge}
                  </span>
                )}

                <h3 className="font-serif-title text-xl font-bold text-neutral-900 mt-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  {pkg.subtitle}
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Included Services & Care:
                  </p>
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-[#a0080e] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectService(pkg.id)}
                className={`w-full py-3 rounded-none text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                  pkg.recommended
                    ? 'bg-[#a0080e] hover:bg-benta-800 text-white shadow-md shadow-benta-950/20 border border-brass-300/30'
                    : 'bg-neutral-100 hover:bg-benta-50 text-neutral-800 hover:text-[#a0080e] border border-neutral-200'
                }`}
              >
                <span>Select & Customize Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* General Price List (GPL) Download Notice */}
        <div className="mt-12 text-center text-xs text-neutral-600 bg-white p-4 rounded-none border border-neutral-200 max-w-2xl mx-auto flex items-center justify-center space-x-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#9c7a30] shrink-0" />
          <span>
            Benta’s Funeral Home provides itemized General Price Lists (GPL) in compliance with FTC Federal Regulations and NYS Department of Health.
          </span>
        </div>

      </div>
    </section>
  );
};
