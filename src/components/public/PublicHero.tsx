import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PublicHeroProps {
  onOpenArranger: () => void;
  onExploreServices: () => void;
  onOpenNotable: () => void;
  onOpenFamilyPortal?: () => void;
  onOpenDirectorPortal?: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  onExploreServices,
  onOpenNotable,
  onOpenFamilyPortal,
  onOpenDirectorPortal,
}) => {
  return (
    <section className="relative min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden text-center text-white">
      <img
        src="/images/ebfh/hero-sunset.jpg"
        alt="Field of red poppies at sunset"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#28080c]/30 to-[#28080c]/55" />

      <div className="relative z-10 max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.12] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
          Celebrating 98 Years of Service
        </h1>
        <p className="font-display text-lg sm:text-xl md:text-2xl font-normal mt-4 drop-shadow-[0_1px_16px_rgba(0,0,0,0.5)]">
          Continuing to Celebrate Life and Heal Hearts
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={onExploreServices} className="btn-benta btn-benta--light cursor-pointer">
            Learn More
          </button>
          {onOpenFamilyPortal && (
            <button
              onClick={onOpenFamilyPortal}
              className="btn-benta btn-benta--outline border-white text-white hover:bg-white hover:text-[#2f2f22] cursor-pointer inline-flex items-center gap-2"
            >
              Family Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-white/90">
          <button onClick={onOpenNotable} className="hover:text-white underline-offset-4 hover:underline cursor-pointer">
            Notable Services
          </button>
          <span className="hidden sm:inline opacity-50">·</span>
          <a href="tel:+12122818850" className="hover:text-white underline-offset-4 hover:underline">
            Immediate assistance: (212) 281-8850
          </a>
          {onOpenDirectorPortal && (
            <>
              <span className="hidden sm:inline opacity-50">·</span>
              <button onClick={onOpenDirectorPortal} className="hover:text-white underline-offset-4 hover:underline cursor-pointer">
                Director / Staff Portal
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
