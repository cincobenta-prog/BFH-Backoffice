import React from 'react';
import { Phone, Sparkles, MapPin, Clock, Award } from 'lucide-react';

interface PublicHeroProps {
  onOpenArranger: () => void;
  onExploreServices: () => void;
  onOpenNotable: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  onOpenArranger,
  onOpenNotable
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffffff] via-[#f7fdfa] to-[#f0fdf4] py-16 md:py-24 border-b border-emerald-900/10">
      {/* Background Decorative Gold & Green Grid and Ambient Lights */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                className="bg-gradient-to-r from-[#065f46] to-[#047857] hover:from-[#064e3b] hover:to-[#065f46] text-white font-bold text-sm px-7 py-3.5 rounded-lg shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30 transition flex items-center space-x-2.5 border border-amber-400/40"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Begin Arrangement Online</span>
              </button>

              <a
                href="tel:+12122818850"
                className="bg-white hover:bg-emerald-50 text-neutral-900 font-semibold text-sm px-6 py-3.5 rounded-lg border border-neutral-300 hover:border-[#065f46] transition flex items-center space-x-2 shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#065f46]" />
                <span>Immediate Assistance (24/7)</span>
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
            <div className="relative glass-card-light p-4 rounded-2xl border border-neutral-200 shadow-xl">
              <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
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
      </div>
    </section>
  );
};
