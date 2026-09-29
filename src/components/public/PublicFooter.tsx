import React from 'react';
import { Phone, MapPin, Mail, Lock } from 'lucide-react';

interface PublicFooterProps {
  onOpenPortal: () => void;
  onOpenFamilyPortal?: () => void;
  onNavigate: (section: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenPortal, onOpenFamilyPortal, onNavigate }) => {
  return (
    <footer className="bg-[#1c1917] text-neutral-300 border-t-2 border-[#065f46] text-xs">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#065f46] to-amber-600 p-0.5">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className="font-serif-title font-bold text-[#065f46] text-sm">BFH</span>
                </div>
              </div>
              <span className="font-serif-title text-base font-bold text-white tracking-wide">
                BENTA'S FUNERAL HOME, INC.
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed font-light">
              Providing personalized, professional, and deeply compassionate funeral and cremation services to Harlem and the Greater New York community continuously since 1928.
            </p>
            <div className="pt-2 text-[11px] text-amber-400 font-semibold">
              George A. Benta (Founder) • Jason Benta (Director in Charge)
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-white uppercase tracking-wider">
              Services & Planning
            </h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400 transition">
                  Direct Cremation & Memorials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400 transition">
                  Traditional Earth Burial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400 transition">
                  Pre-Need Planning & Trusts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notable')} className="hover:text-amber-400 transition">
                  Notable Services (Cicely Tyson, etc.)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('obituaries')} className="hover:text-amber-400 transition">
                  Recent Obituaries & Digi-Tributes
                </button>
              </li>
            </ul>
          </div>

          {/* Grief & Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-white uppercase tracking-wider">
              Healing & Care
            </h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <button onClick={() => onNavigate('grief')} className="hover:text-amber-400 transition">
                  Grief & Resilience
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grief')} className="hover:text-amber-400 transition">
                  Physical Grief Symptoms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grief')} className="hover:text-amber-400 transition">
                  Honoring Veterans (DD-214)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grief')} className="hover:text-amber-400 transition">
                  Social Security Guidance
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Facility */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-title text-sm font-bold text-white uppercase tracking-wider">
              Harlem Location
            </h4>
            <div className="space-y-2.5 text-neutral-300">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>630 Saint Nicholas Avenue<br />New York, NY 10030</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+12122818850" className="hover:text-amber-400 transition font-bold text-white">
                  (212) 281-8850 (24/7)
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:info@e-bfh.com" className="hover:text-amber-400 transition">
                  info@e-bfh.com
                </a>
              </p>
            </div>

            <div className="pt-2 space-y-2">
              {onOpenFamilyPortal && (
                <button
                  onClick={onOpenFamilyPortal}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition text-xs shadow-md border border-amber-400/40"
                >
                  <span>🕊️ Access Private Family Portal (Vault)</span>
                </button>
              )}
              <button
                onClick={onOpenPortal}
                className="w-full bg-[#065f46] hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition text-xs shadow-md border border-emerald-700/50"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Licensed Funeral Director Portal</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-[#0c0a09] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Benta's Funeral Home, Inc. All rights reserved. Registered NYS Funeral Establishment.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer">FTC General Price List</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy & Terms</span>
            <span className="hover:text-white cursor-pointer">NYS Dept. of Health Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
