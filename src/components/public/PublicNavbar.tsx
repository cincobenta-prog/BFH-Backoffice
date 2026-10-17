import React, { useState } from 'react';
import { Phone, Lock } from 'lucide-react';

interface PublicNavbarProps {
  onOpenPortal: () => void;
  onOpenFamilyPortal?: () => void;
  onOpenArranger: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenPortal,
  onOpenFamilyPortal,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavItem[] = [
    {
      id: 'home',
      label: 'BFH',
      children: [
        { id: 'home', label: 'Home' },
        { id: 'history', label: 'Our History' },
        { id: 'facility', label: 'Facility' },
        { id: 'notable', label: 'Notable Services' },
      ],
    },
    { id: 'history', label: 'Legacy' },
    { id: 'obituaries', label: 'Obituaries' },
    {
      id: 'preplan',
      label: 'Pre-Plan',
      children: [
        { id: 'preplan', label: 'Plan Ahead' },
        { id: 'preplan', label: 'Preplanning Checklist' },
        { id: 'preplan', label: 'Where to Begin' },
      ],
    },
    { id: 'services', label: 'Services' },
    {
      id: 'grief',
      label: 'Resources',
      children: [
        { id: 'grief', label: 'Grief and Healing' },
        { id: 'grief', label: 'Quotes and Affirmations' },
        { id: 'faqs', label: 'FAQs' },
      ],
    },
    { id: 'faqs', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const go = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 text-neutral-800">
      {/* Maroon notice bar */}
      <div className="bg-[#43060a] text-[#f0e3d5] text-[11.5px] tracking-wide">
        <div className="max-w-[1200px] mx-auto px-5 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span>630 Saint Nicholas Avenue, New York, NY 10030</span>
          <span className="flex items-center gap-3">
            <a href="tel:+12122818850" className="inline-flex items-center gap-1.5 hover:text-white">
              <Phone className="w-3 h-3" />
              (212) 281-8850
            </a>
            <span className="hidden sm:inline opacity-60">·</span>
            <span className="hidden sm:inline">Serving Harlem families since 1928</span>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-[1200px] mx-auto px-5 py-3.5 flex items-center justify-between gap-6">
        {/* Logo */}
        <button onClick={() => go('home')} className="shrink-0 cursor-pointer" aria-label="Benta's Funeral Home home">
          <img
            src="/images/ebfh/BENTA_logo.png"
            alt="Benta's Funeral Home, Inc."
            className="h-11 sm:h-12 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/ebfh/Benta-Flame-MN.png';
            }}
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center">
            {navLinks.map((item) => (
              <li key={item.label} className="relative group">
                <button
                  onClick={() => go(item.id)}
                  className="px-3 py-2 font-display text-[12.5px] font-medium uppercase tracking-[0.11em] text-neutral-600 hover:text-[#a0080e] transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  {item.label}
                  {item.children && (
                    <span className="block w-1 h-1 border-r border-b border-current rotate-45 translate-y-[-1px]" />
                  )}
                </button>
                {item.children && (
                  <div className="absolute left-0 top-full hidden group-hover:block min-w-[230px] bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(60,20,25,0.12)] py-2 z-50">
                    {item.children.map((child, i) => (
                      <button
                        key={`${child.label}-${i}`}
                        onClick={() => go(child.id)}
                        className="block w-full text-left px-5 py-2 text-[13.5px] text-neutral-600 hover:bg-[#e7e4dc] hover:text-[#a0080e] cursor-pointer"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {onOpenFamilyPortal && (
            <button onClick={onOpenFamilyPortal} className="btn-benta btn-benta--outline text-[11px] px-4 py-2.5 cursor-pointer">
              Family Portal
            </button>
          )}
          <button onClick={onOpenPortal} className="btn-benta text-[11px] px-4 py-2.5 cursor-pointer inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Staff Portal
          </button>
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-700 hover:text-[#a0080e] cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-5 py-3">
          {navLinks.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => go(item.id)}
                className="block w-full text-left px-2 py-2.5 font-display text-[13px] uppercase tracking-[0.1em] text-neutral-700 hover:text-[#a0080e] cursor-pointer"
              >
                {item.label}
              </button>
              {item.children && (
                <div className="pl-4 border-l border-neutral-200 ml-2">
                  {item.children.map((child, i) => (
                    <button
                      key={`${child.label}-m-${i}`}
                      onClick={() => go(child.id)}
                      className="block w-full text-left px-2 py-1.5 text-[13px] text-neutral-500 hover:text-[#a0080e] cursor-pointer"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 mt-2 border-t border-neutral-200 flex flex-col gap-2">
            {onOpenFamilyPortal && (
              <button onClick={onOpenFamilyPortal} className="btn-benta btn-benta--outline cursor-pointer">
                Family Portal
              </button>
            )}
            <button onClick={onOpenPortal} className="btn-benta cursor-pointer">
              Director / Staff Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
