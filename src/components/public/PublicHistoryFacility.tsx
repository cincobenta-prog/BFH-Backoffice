import React from 'react';
import { History, Building2, Users, Shield, Check } from 'lucide-react';

export const PublicHistoryFacility: React.FC = () => {
  return (
    <section id="history" className="py-20 bg-white border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: History & Legacy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-[#065f46] font-bold tracking-wide uppercase">
              <History className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Harlem Roots Since 1928</span>
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              A Living Testament to <br />
              <span className="green-gradient-text">Harlem's Cultural History</span>
            </h2>

            <div className="space-y-4 text-neutral-600 text-sm leading-relaxed font-light">
              <p>
                In <strong>1928</strong>, George Alexander Benta recognized a vital need in the Harlem community for dignified, compassionate, and professional funeral services. Although he faced the severe obstacles of the era, his unwavering commitment established one of the premier African American-owned funeral establishments in New York.
              </p>
              <p>
                Following his passing in 1966, his son <strong>George Bernard Benta</strong> took the helm, providing steadfast leadership for decades and cementing Benta’s reputation for honoring everyday families alongside legendary cultural figures.
              </p>
              <p>
                In 2002, fourth-generation funeral director <strong>Jason Benta</strong> assumed leadership. Today, Benta's Funeral Home seamlessly unites time-honored traditions and deep spiritual respect with modern digital technology, automated family transparency, and state-of-the-art arrangement workflows.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-neutral-700 font-semibold">
              <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                <Shield className="w-4 h-4 text-[#065f46]" />
                <span>NY State Licensed & Inspected</span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                <Users className="w-4 h-4 text-[#b45309]" />
                <span>Family Owned & Operated</span>
              </div>
            </div>
          </div>

          {/* Right History Visual Timeline */}
          <div className="lg:col-span-6">
            <div className="bg-[#fcfdfc] p-6 rounded-2xl border border-emerald-200/80 shadow-md space-y-6">
              <h3 className="font-serif-title text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#065f46]" />
                Generations of Service in Harlem
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                
                <div className="relative flex items-start space-x-4 pl-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#065f46] ring-4 ring-white shrink-0 mt-1 shadow-sm" />
                  <div>
                    <span className="text-xs font-bold text-[#065f46] font-mono">1928 — FOUNDATION</span>
                    <h4 className="text-sm font-bold text-neutral-900">George A. Benta Establishes the Home</h4>
                    <p className="text-xs text-neutral-500 mt-1">Founded on St. Nicholas Avenue to provide dignified funeral care during the height of the Harlem Renaissance.</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4 pl-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#b45309] ring-4 ring-white shrink-0 mt-1 shadow-sm" />
                  <div>
                    <span className="text-xs font-bold text-[#b45309] font-mono">1966 — STEWARDSHIP</span>
                    <h4 className="text-sm font-bold text-neutral-900">George Bernard Benta Expands the Legacy</h4>
                    <p className="text-xs text-neutral-500 mt-1">Modernizing the facilities and conducting historic services for Langston Hughes, Count Basie, and Alvin Ailey.</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4 pl-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#065f46] ring-4 ring-white shrink-0 mt-1 shadow-sm" />
                  <div>
                    <span className="text-xs font-bold text-[#065f46] font-mono">2002 to PRESENT — INNOVATION</span>
                    <h4 className="text-sm font-bold text-neutral-900">Jason Benta & Digital Modernization</h4>
                    <p className="text-xs text-neutral-500 mt-1">Introducing 360° Digi-Tributes, the Golden Record Data Architecture, and orchestrating memorials for Cicely Tyson.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: 630 Saint Nicholas Facility Tour */}
        <div className="mt-16 pt-16 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#065f46] font-bold tracking-wide uppercase">
              <Building2 className="w-3.5 h-3.5 text-[#065f46]" />
              <span>Our Sanctuary</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-neutral-900">
              The Facility at 630 Saint Nicholas Avenue
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-light">
              Thoughtfully curated to accommodate intimate family viewings as well as grand memorial celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Parlor A / Main Chapel */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-title text-lg font-bold text-neutral-900">Parlor A (Saint Nicholas Main Chapel)</h4>
                <span className="text-xs bg-emerald-50 text-[#065f46] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Seats 120 Guests
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Our grand main sanctuary featuring warm mahogany appointments, plush seating for up to 120 guests, integrated audio/video live-streaming screens, and private family alcoves.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 font-medium pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#065f46]" /> HD Live Streaming</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#065f46]" /> Piano / Organ Audio</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#065f46]" /> Handicap Accessible</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#065f46]" /> Climate Controlled</span>
              </div>
            </div>

            {/* Parlor B / Second Chapel */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-title text-lg font-bold text-neutral-900">Parlor B (Harlem Memorial Chapel)</h4>
                <span className="text-xs bg-amber-50 text-[#b45309] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                  Seats 110 Guests
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Our stately second chapel seating up to 110 guests, tailored for extended family vigils, celebration-of-life multimedia presentations, and traditional viewing ceremonies.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 font-medium pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#b45309]" /> Digi-Tribute 360° Screens</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#b45309]" /> Private Family Lounge</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#b45309]" /> Dedicated Floral Staging</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#b45309]" /> WiFi & Guest Registry</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
