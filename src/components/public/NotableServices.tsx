import React from 'react';
import { Award, Sparkles, BookOpen, Music, Star } from 'lucide-react';

export const NotableServices: React.FC = () => {
  const notables = [
    {
      name: 'Cicely Tyson',
      title: 'Legendary Academy Award-Nominated Actress & Cultural Icon',
      year: '1924 – 2021',
      description: 'Benta’s Funeral Home had the sacred honor of preparing the funeral arrangements and memorial program for Harlem’s own Cicely Tyson, followed by private services at Abyssinian Baptist Church.',
      icon: Star,
      tag: 'Cultural Icon'
    },
    {
      name: 'Ornette Coleman',
      title: 'Pioneering Jazz Innovator & Pulitzer Prize Laureate',
      year: '1930 – 2015',
      description: 'The alto saxophonist who revolutionized modern music. Benta’s coordinated arrangements honoring this polarizing, brilliant figure in American jazz history.',
      icon: Music,
      tag: 'Jazz Pioneer'
    },
    {
      name: 'James Baldwin',
      title: 'Acclaimed Essayist, Playwright & Civil Rights Voice',
      year: '1924 – 1987',
      description: 'One of the twentieth century’s greatest literary figures and Harlem native, whose final journey and community farewell were entrusted to the care of Benta’s.',
      icon: BookOpen,
      tag: 'Literary Giant'
    },
    {
      name: 'Alvin Ailey',
      title: 'Visionary Choreographer & Founder, Alvin Ailey Dance Theater',
      year: '1931 – 1989',
      description: 'Whose transformative work enriched world culture. Benta’s assisted the family and dance community in celebrating his immortal artistry.',
      icon: Sparkles,
      tag: 'Master Choreographer'
    },
    {
      name: 'Langston Hughes',
      title: 'Leader of the Harlem Renaissance & Poet Laureate',
      year: '1901 – 1967',
      description: 'The poet laureate of Harlem. His community arrangements were prepared with timeless dignity at 630 Saint Nicholas Avenue.',
      icon: Award,
      tag: 'Renaissance Leader'
    },
    {
      name: 'Count Basie',
      title: 'Iconic Big Band Leader, Pianist & Jazz Royal',
      year: '1904 – 1984',
      description: 'Bringing the swing era to the world stage. Entrusted to Benta’s for dignified funeral coordination.',
      icon: Music,
      tag: 'Jazz Royalty'
    }
  ];

  return (
    <section id="notable" className="py-20 bg-white border-b border-emerald-900/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-[#065f46] font-bold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5 text-[#b45309]" />
            <span>A Legacy of Reverence</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-neutral-900">
            Notable Services & Memorials
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
            For generations, the most distinguished leaders of arts, culture, civil rights, and community life—along with everyday families across New York—have entrusted Benta's Funeral Home to celebrate their lives with majesty and care.
          </p>
        </div>

        {/* Notables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notables.map((person, idx) => {
            const Icon = person.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none group-hover:bg-emerald-100 transition" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#065f46] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {person.tag}
                  </span>
                  <span className="text-xs text-[#b45309] font-mono font-bold">{person.year}</span>
                </div>

                <h3 className="font-serif-title text-xl font-bold text-neutral-900 group-hover:text-[#065f46] transition">
                  {person.name}
                </h3>
                
                <p className="text-xs text-[#b45309] font-semibold mt-1 mb-3">
                  {person.title}
                </p>

                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {person.description}
                </p>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center text-[11px] text-neutral-500 group-hover:text-[#065f46] transition font-medium">
                  <Icon className="w-3.5 h-3.5 mr-1.5 text-[#b45309]" />
                  <span>Arranged by Benta's Funeral Home</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote banner: Emerald Green & Gold */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#065f46] via-[#047857] to-[#065f46] text-white border border-amber-400/40 text-center max-w-4xl mx-auto shadow-xl shadow-emerald-950/20">
          <p className="font-serif-title text-lg sm:text-xl text-amber-200 italic font-medium leading-relaxed">
            "In 1928, George A. Benta recognized a need in the Harlem Community and in a small way, he tried to fulfill it... We continue this sacred trust today."
          </p>
          <p className="text-xs text-amber-300 uppercase tracking-widest mt-3 font-bold">
            — Benta's Historic Commitment
          </p>
        </div>

      </div>
    </section>
  );
};
