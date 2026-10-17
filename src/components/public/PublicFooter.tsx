import React from 'react';
import { Phone, MapPin, Mail, Lock } from 'lucide-react';

interface PublicFooterProps {
  onOpenPortal: () => void;
  onOpenFamilyPortal?: () => void;
  onNavigate: (section: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenPortal, onOpenFamilyPortal, onNavigate }) => {
  const linkClass = 'block text-left py-1 text-[#b3a79c] hover:text-[#e7cfa6] transition cursor-pointer';

  return (
    <footer className="bg-[#22140f] text-[#b3a79c] text-[13px]">
      <div className="max-w-[1200px] mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h4 className="font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white mb-4">
              Benta's Funeral Home, Inc.
            </h4>
            <p className="leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#c2a465]" />
              <span>630 Saint Nicholas Avenue<br />New York, NY 10030</span>
            </p>
            <p className="mt-3 flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-[#c2a465]" />
              <a href="tel:+12122818850" className="hover:text-[#e7cfa6] transition">(212) 281-8850</a>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-[#c2a465]" />
              <a href="mailto:info@e-bfh.com" className="hover:text-[#e7cfa6] transition">info@e-bfh.com</a>
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white mb-4">Explore</h4>
            <button onClick={() => onNavigate('history')} className={linkClass}>Our History</button>
            <button onClick={() => onNavigate('facility')} className={linkClass}>Facility</button>
            <button onClick={() => onNavigate('notable')} className={linkClass}>Notable Services</button>
            <button onClick={() => onNavigate('obituaries')} className={linkClass}>Obituaries</button>
            <button onClick={() => onNavigate('contact')} className={linkClass}>Contact</button>
          </div>

          {/* Plan Ahead */}
          <div>
            <h4 className="font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white mb-4">Plan Ahead</h4>
            <button onClick={() => onNavigate('preplan')} className={linkClass}>Plan Ahead</button>
            <button onClick={() => onNavigate('preplan')} className={linkClass}>Preplanning Checklist</button>
            <button onClick={() => onNavigate('services')} className={linkClass}>Service Options</button>
            <button onClick={() => onNavigate('grief')} className={linkClass}>Grief and Healing</button>
            <button onClick={() => onNavigate('faqs')} className={linkClass}>FAQs</button>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white mb-4">Portals</h4>
            {onOpenFamilyPortal && (
              <button
                onClick={onOpenFamilyPortal}
                className="btn-benta btn-benta--outline border-white/40 text-white hover:bg-white hover:text-[#22140f] w-full mb-2 cursor-pointer"
              >
                Family Portal
              </button>
            )}
            <button
              onClick={onOpenPortal}
              className="btn-benta w-full cursor-pointer inline-flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Director / Staff Portal
            </button>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-[#8d8177]">
          <span>© {new Date().getFullYear()} Benta's Funeral Home, Inc. All rights reserved.</span>
          <span>Site design by Kreative House</span>
        </div>
      </div>
    </footer>
  );
};
