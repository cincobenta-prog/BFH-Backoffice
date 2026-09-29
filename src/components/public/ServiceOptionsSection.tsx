import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, ArrowRight, DollarSign, Sparkles, BookOpen, Music, Car, Utensils } from 'lucide-react';

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
      price: '$1,995',
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
      price: '$3,195',
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
      price: '$4,850',
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
      price: '$2,750',
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
      price: '$5,950',
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
      price: 'Custom Pre-Plan',
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
    <section id="services" className="py-20 bg-[#fafafa] border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-[#065f46] font-bold tracking-wide uppercase">
            <DollarSign className="w-3.5 h-3.5 text-[#b45309]" />
            <span>Honest & FTC-Compliant Pricing</span>
          </div>
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
                  ? 'bg-[#065f46] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#065f46] border border-neutral-200'
              }`}
            >
              All Options ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab('cremation')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'cremation'
                  ? 'bg-[#065f46] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#065f46] border border-neutral-200'
              }`}
            >
              Cremation Services (3)
            </button>
            <button
              onClick={() => setActiveTab('burial')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'burial'
                  ? 'bg-[#065f46] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#065f46] border border-neutral-200'
              }`}
            >
              Burial Services (2)
            </button>
            <button
              onClick={() => setActiveTab('preneed')}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                activeTab === 'preneed'
                  ? 'bg-[#065f46] text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:text-[#065f46] border border-neutral-200'
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
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.recommended
                  ? 'bg-white border-2 border-[#065f46] shadow-xl transform lg:-translate-y-2 ring-2 ring-emerald-400/20'
                  : 'bg-white border border-neutral-200 hover:border-emerald-200 shadow-sm hover:shadow-md'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#065f46] to-[#047857] text-white font-bold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-amber-300/40">
                  {pkg.badge}
                </div>
              )}

              <div>
                {!pkg.recommended && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#065f46] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block mb-3">
                    {pkg.badge}
                  </span>
                )}

                <h3 className="font-serif-title text-xl font-bold text-neutral-900 mt-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  {pkg.subtitle}
                </p>

                <div className="mb-6 pb-6 border-b border-neutral-100">
                  <span className="text-3xl font-bold font-serif-title text-[#065f46]">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-neutral-500 block mt-1">
                    *Excludes third-party crematory/cemetery cash advances & certified death certificate transcript fees
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Included Services & Care:
                  </p>
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-[#065f46] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectService(pkg.id)}
                className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                  pkg.recommended
                    ? 'bg-[#065f46] hover:bg-emerald-800 text-white shadow-md shadow-emerald-950/20 border border-amber-300/30'
                    : 'bg-neutral-100 hover:bg-emerald-50 text-neutral-800 hover:text-[#065f46] border border-neutral-200'
                }`}
              >
                <span>Select & Customize Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* CUSTOMIZABLE VARIABLES & ADD-ON SUITE */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase text-[#065f46] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Personalized Touch & Flexibility</span>
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-neutral-900">
              Available Customization Variables & Add-Ons
            </h3>
            <p className="text-xs text-neutral-600 font-light">
              Every service can be tailored with transparent itemized options to honor your loved one's specific traditions and family wishes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            
            {/* 1. Printing & Stationery */}
            <div className="p-5 rounded-2xl bg-[#fcfbfa] border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#065f46] border border-emerald-200 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-neutral-900">
                1. Custom Printing Suite
              </h4>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                4-Panel bi-fold programs, tri-fold bulletins, multi-page tribute booklets, and laminated prayer/memorial cards with photo.
              </p>
              <div className="text-[11px] font-mono text-[#b45309] font-semibold pt-1">
                GPL Range: $145.00 – $755.00
              </div>
            </div>

            {/* 2. Clergy & Musical Accompaniment */}
            <div className="p-5 rounded-2xl bg-[#fcfbfa] border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b45309] border border-amber-200 flex items-center justify-center font-bold">
                <Music className="w-5 h-5" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-neutral-900">
                2. Clergy & Organist
              </h4>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Officiant honorarium, sanctuary pipe organist, gospel pianist, soloist accompaniment, and scripture readers.
              </p>
              <div className="text-[11px] font-mono text-[#b45309] font-semibold pt-1">
                Cash Advance: $300.00 – $350.00
              </div>
            </div>

            {/* 3. Vehicle Transportation */}
            <div className="p-5 rounded-2xl bg-[#fcfbfa] border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-neutral-900">
                3. Vehicle Transportation
              </h4>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                7-Passenger Cadillac family limousines, 10/14-passenger Mercedes Sprinter vans, flower vehicles, and lead cortege escort.
              </p>
              <div className="text-[11px] font-mono text-[#b45309] font-semibold pt-1">
                GPL Range: $484.00 – $1,315.00
              </div>
            </div>

            {/* 4. Repast Room & Reception */}
            <div className="p-5 rounded-2xl bg-[#fcfbfa] border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-neutral-900">
                4. Repast Room & Fellowship
              </h4>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Reservation of BFH’s private 2nd-floor Repast Room for post-service family fellowship, tables, seating, and catering coordination.
              </p>
              <div className="text-[11px] font-mono text-[#b45309] font-semibold pt-1">
                Facility Base: $1,400.00
              </div>
            </div>

          </div>
        </div>

        {/* General Price List (GPL) Download Notice */}
        <div className="mt-12 text-center text-xs text-neutral-600 bg-white p-4 rounded-xl border border-neutral-200 max-w-2xl mx-auto flex items-center justify-center space-x-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#b45309] shrink-0" />
          <span>
            Benta’s Funeral Home provides itemized General Price Lists (GPL) in compliance with FTC Federal Regulations and NYS Department of Health.
          </span>
        </div>

      </div>
    </section>
  );
};
