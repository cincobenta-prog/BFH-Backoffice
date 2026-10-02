import React from 'react';
import { Phone, Sparkles, MapPin, Clock, Award, Mic, BookOpen, Video, ShieldCheck, ArrowRight, Key, Lock } from 'lucide-react';

interface PublicHeroProps {
  onOpenArranger: () => void;
  onExploreServices: () => void;
  onOpenNotable: () => void;
  onOpenFamilyPortal?: () => void;
  onOpenDirectorPortal?: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  onOpenArranger,
  onOpenNotable,
  onOpenFamilyPortal,
  onOpenDirectorPortal
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffffff] via-[#f7fdfa] to-[#f0fdf4] py-14 md:py-20 border-b border-emerald-900/10">
      {/* Background Decorative Gold & Green Grid and Ambient Lights */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Dual Portal Access Bar */}
        <div className="bg-white/90 backdrop-blur-md border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Key className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Client & Staff Access
                </span>
                <span className="text-xs text-neutral-500">Universal Master PIN: <strong className="font-mono text-emerald-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 font-bold">3995</strong></span>
              </div>
              <p className="text-xs font-medium text-neutral-700 mt-0.5">
                Access your family's 360 Living Voice Archive, Keepsake Book, and funeral schedule.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenFamilyPortal && (
              <button
                type="button"
                onClick={onOpenFamilyPortal}
                className="bg-[#065f46] hover:bg-[#064e3b] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-950/20 flex items-center space-x-2 border border-amber-400/40"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Family Portal (PIN: 3995)</span>
              </button>
            )}

            {onOpenDirectorPortal && (
              <button
                type="button"
                onClick={onOpenDirectorPortal}
                className="bg-neutral-900 hover:bg-black text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm border border-neutral-700 flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Director BackOffice</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs text-[#065f46] font-bold shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Harlem's Historic Funeral Home • Continuous Service Since 1928</span>
            </div>

            <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-tight">
              Honoring Life with <br />
              <span className="green-gradient-text">Dignity, Heritage & Grace</span>
            </h1>

            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              For nearly a century, Benta's Funeral Home has guided families through life's most sacred moments. 
              Located at 630 Saint Nicholas Avenue in Harlem, we offer personalized celebrations of life, direct and full cremation, traditional church services, and pre-need guidance with absolute transparent care.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenArranger}
                className="bg-gradient-to-r from-[#065f46] to-[#047857] hover:from-[#064e3b] hover:to-[#065f46] text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30 transition flex items-center space-x-2.5 border border-amber-400/40"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Complete Vital Records & Request Appointment</span>
              </button>

              <a
                href="tel:+12122818850"
                className="bg-white hover:bg-emerald-50 text-neutral-900 font-semibold text-sm px-6 py-3.5 rounded-xl border border-neutral-300 hover:border-[#065f46] transition flex items-center space-x-2 shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#065f46]" />
                <span>Immediate Assistance (212) 281-8850</span>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 text-xs">
              <div className="space-y-1">
                <span className="font-serif-title text-xl font-bold text-[#065f46]">98 Years</span>
                <p className="text-neutral-600 font-medium">Harlem Community Trust</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif-title text-xl font-bold text-[#b45309]">100%</span>
                <p className="text-neutral-600 font-medium">Transparent FTC Pricing</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif-title text-xl font-bold text-[#065f46]">2 Chapels</span>
                <p className="text-neutral-600 font-medium">Seats 120 & 110 for Services</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card / Facility Preview */}
          <div className="lg:col-span-5">
            <div className="relative glass-card-light p-4 rounded-3xl border border-emerald-100 shadow-xl">
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200">
                <div 
                  className="w-full h-full bg-cover bg-center transition duration-700 hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(6,78,59,0.88) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%), url('https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md text-[#065f46] text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/50 flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3 h-3 text-[#065f46]" />
                    Harlem • 630 Saint Nicholas Ave
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-100 shadow-md">
                  <p className="text-xs text-[#065f46] font-bold uppercase tracking-wider">A Sanctuary of Comfort</p>
                  <p className="text-sm font-medium text-neutral-900 mt-0.5">
                    Two warm, comfortable parlors designed for intimate family viewings and grand memorial celebrations.
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200 text-xs">
                    <span className="text-neutral-600 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#b45309]" /> Mon–Fri 9am–5pm (24/7 on call)
                    </span>
                    <button 
                      onClick={onOpenNotable}
                      className="text-[#065f46] hover:text-emerald-900 font-bold underline underline-offset-4"
                    >
                      Notable Services →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Card Showcase: New Memorial Features for Families */}
        <div className="pt-6 border-t border-emerald-900/10">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60">
              Modern Family Innovations
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-neutral-900">
              New Memorial Features Available to Every Family
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Preserving stories, uniting distant relatives, and ensuring absolute transparency every step of the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Feature 1: 360 Living Voice Archive */}
            <div className="bg-white border border-emerald-100 hover:border-emerald-500/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#065f46]">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">
                🎙️ 360 Living Voice Archive
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Relatives record spoken memories guided by reflective prompts across Joy, Pain, Sacrifice, and Action.
              </p>
              <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 pt-1">
                <span>AI Poetic Stanza Formatter</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 2: Heirloom Coffee Table Book */}
            <div className="bg-white border border-emerald-100 hover:border-emerald-500/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">
                📖 Keepsake Coffee Table Volume
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Curated stories formatted into gold-bordered poetic stanzas with scannable QR audio streaming pills.
              </p>
              <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1 pt-1">
                <span>Museum-Grade Keepsake</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 3: Live Multi-Cam Webcast */}
            <div className="bg-white border border-emerald-100 hover:border-emerald-500/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#065f46]">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">
                📹 Ultra-HD Live Webcast
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Broadcast private services globally with multi-angle chapel cameras, live virtual guestbook, and recording vault.
              </p>
              <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 pt-1">
                <span>Worldwide Family Access</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Feature 4: Transparent Ledger & Split-Billing */}
            <div className="bg-white border border-emerald-100 hover:border-emerald-500/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#065f46]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">
                🧾 Transparent Price Ledger & Split-Pay
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Itemized Form AP-47 accounting where siblings and relatives can securely contribute individual shares.
              </p>
              <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 pt-1">
                <span>100% FTC Compliance</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

