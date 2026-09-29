import React, { useState } from 'react';
import { Heart, Sparkles, ChevronDown, ChevronUp, Phone } from 'lucide-react';

export const GriefHealingSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const griefTopics = [
    {
      title: 'Physical Symptoms of Grief',
      excerpt: 'Grief is not only emotional—it takes a profound toll on the body.',
      content: 'Common physical symptoms include overwhelming fatigue, insomnia, chest tightness, shortness of breath, sudden changes in appetite, and muscle tension. Recognizing that these physical reactions are normal is the first step toward self-compassion and gentle healing.'
    },
    {
      title: 'Healing a Broken Heart',
      excerpt: 'As Anne Lamott wrote: "You will lose someone you can’t live without, and your heart will be badly broken..."',
      content: 'The healing journey is neither linear nor instantaneous. At Benta’s, we encourage families to give themselves permission to mourn at their own pace, embrace cherished memories, and lean on community resilience in Harlem.'
    },
    {
      title: 'Social Security & Veterans Benefits (DD-214)',
      excerpt: 'Guiding you through government survivor benefits and military honors.',
      content: 'We assist families with filing Social Security lump-sum death benefits ($255 for eligible spouses) and verify military honors with DD-214 discharge papers for free military honors, flag presentation, and presidential memorial certificates.'
    },
    {
      title: 'Day 7 & 30 Bereavement Wellness Support',
      excerpt: 'Our care does not conclude after the funeral service.',
      content: 'Every family served by Benta’s is enrolled in our continuous bereavement outreach program, receiving scheduled wellness checks, curated grief literature, and referrals to licensed NYC grief counselors.'
    }
  ];

  return (
    <section id="grief" className="py-20 bg-[#fafafa] border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-[#065f46] font-bold tracking-wide uppercase">
            <Heart className="w-3.5 h-3.5 text-[#065f46]" />
            <span>Compassionate Aftercare</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-neutral-900">
            Grief, Healing & Family Resilience
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
            Navigating loss is one of life’s deepest challenges. We provide continuous resources, affirmations, and practical assistance to sustain you and your family.
          </p>
        </div>

        {/* 2-Column Content: Left Quotes / Helpline & Right Expandable Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Anne Lamott Quote Box */}
            <div className="bg-white p-7 rounded-2xl border border-emerald-200/80 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full pointer-events-none" />
              <Sparkles className="w-6 h-6 text-[#b45309] mb-3" />
              <blockquote className="text-sm text-neutral-700 italic leading-relaxed font-light">
                "You will lose someone you can’t live without, and your heart will be badly broken, and the bad news is that you never completely get over the loss of your beloved. But this is also the good news. They live forever in your broken heart that doesn’t seal back up. And you come through. It’s like having a broken leg that never heals perfectly... but you learn to dance with a limp."
              </blockquote>
              <p className="text-xs text-[#065f46] font-bold mt-4 text-right uppercase tracking-wider">
                — Anne Lamott
              </p>
            </div>

            {/* 24/7 Helpline Card: Emerald Green Background */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#065f46] via-[#047857] to-[#065f46] text-white border border-amber-300/40 flex items-center justify-between shadow-lg shadow-emerald-950/20">
              <div className="space-y-1">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Need to speak with someone?</span>
                <p className="text-base font-bold text-white">Benta’s 24/7 Careline</p>
                <p className="text-xs text-emerald-100 font-light">We are always here to listen and assist.</p>
              </div>
              <a
                href="tel:+12122818850"
                className="bg-white hover:bg-amber-100 text-[#065f46] font-bold p-3.5 rounded-full shadow-md transition transform active:scale-95"
                aria-label="Call 24/7 Careline"
              >
                <Phone className="w-5 h-5 text-[#065f46]" />
              </a>
            </div>
          </div>

          {/* Right Column: Accordion Topics */}
          <div className="lg:col-span-7 space-y-4">
            {griefTopics.map((topic, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 transition"
                  >
                    <div>
                      <h3 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5 font-light">
                        {topic.excerpt}
                      </p>
                    </div>
                    <div className="p-1.5 rounded-full bg-neutral-100 text-[#065f46]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 font-light">
                      {topic.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
