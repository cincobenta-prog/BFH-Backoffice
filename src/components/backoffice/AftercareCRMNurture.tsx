import React, { useState } from 'react';
import { GoldenRecordCase, AftercareScheduleItem } from '../../lib/types/funeral';
import { Send, CheckCircle, Star } from 'lucide-react';

interface AftercareCRMNurtureProps {
  caseData: GoldenRecordCase;
  onUpdateAftercare: (updatedAftercare: AftercareScheduleItem[]) => void;
}

export const AftercareCRMNurture: React.FC<AftercareCRMNurtureProps> = ({
  caseData,
  onUpdateAftercare
}) => {
  const [activePreview, setActivePreview] = useState<AftercareScheduleItem | null>(null);

  const handleTriggerMilestone = (index: number) => {
    const copy = [...caseData.aftercare];
    copy[index].status = 'sent';
    onUpdateAftercare(copy);
  };

  const defaultTemplates: Record<string, { subject: string; body: string }> = {
    'Harlem Grief & Resilience Outreach': {
      subject: "Thinking of You and Your Family — Benta's Funeral Home",
      body: `Dear ${caseData.informant.fullName},\n\nSeven days have passed since the services honoring ${caseData.decedent.legalName}. We know this transition can feel quiet and overwhelming. The Benta family and staff remain by your side.\n\nWe have prepared our Harlem Bereavement & Physical Healing guide for you, accessible anytime through your family portal. If you need a listening ear or practical assistance, our careline is always open at (212) 281-8850.\n\nWith warm regard and deepest sympathy,\nJason Benta & The Staff of Benta's Funeral Home`
    },
    'Community Support Group Connections': {
      subject: "30-Day Check-in & Harlem Bereavement Support Resources",
      body: `Dear ${caseData.informant.fullName},\n\nAs you navigate this month of remembrance, we want to remind you that grief has no timetable. We partner with several compassionate counseling groups in Harlem and Greater New York if you or your family would benefit from community grief circles.\n\nPlease know you remain in our prayers.`
    },
    'Eternal Flame Remembrance': {
      subject: "Remembering " + caseData.decedent.legalName + " on their Anniversary",
      body: `Dear ${caseData.informant.fullName},\n\nToday, on the first anniversary of ${caseData.decedent.legalName}'s passing, Benta's Funeral Home lights an eternal digital candle in their honor. Their legacy lives on brightly in our Harlem community.`
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-neutral-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif-title text-xl font-bold text-neutral-900">
              Compassionate Aftercare & Family Nurture Engine
            </h2>
            <span className="bg-red-50 text-[#800000] text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200">
              Automated CRM Touchpoints
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 font-light">
            Nurturing long-term relationships with Next of Kin <strong className="text-[#800000] font-semibold">{caseData.informant.fullName}</strong> following the service.
          </p>
        </div>
      </div>

      {/* Touchpoint Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {caseData.aftercare.map((item, idx) => {
          const isSent = item.status === 'sent';
          const template = defaultTemplates[item.templateName] || { subject: item.milestoneTitle, body: 'Personalized family message.' };

          return (
            <div
              key={item.id}
              className={`bg-white p-6 rounded-2xl border flex flex-col justify-between transition shadow-sm ${
                isSent
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-neutral-200 hover:border-red-200 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#800000] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    Day {item.triggerDaysPostService} Post-Service
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    isSent ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-serif-title text-base font-bold text-neutral-900">
                  {item.milestoneTitle}
                </h3>

                <p className="text-xs text-neutral-500 font-light">
                  Target Dispatch: <strong className="text-neutral-900 font-mono font-bold">{item.targetDate}</strong>
                </p>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-800 space-y-1">
                  <span className="font-bold text-[#800000] block">{template.subject}</span>
                  <p className="line-clamp-3 text-neutral-600 font-light">{template.body}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 mt-4 flex gap-2">
                <button
                  onClick={() => setActivePreview(item)}
                  className="w-1/2 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition border border-neutral-200"
                >
                  Preview Email
                </button>
                
                {!isSent ? (
                  <button
                    onClick={() => handleTriggerMilestone(idx)}
                    className="w-1/2 py-2 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 shadow-sm border border-amber-300/30"
                  >
                    <Send className="w-3 h-3 text-amber-300" />
                    <span>Send Now</span>
                  </button>
                ) : (
                  <div className="w-1/2 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1 border border-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-700" />
                    <span>Dispatched</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Review & Feedback Section: Cream & Gold */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50/70 via-amber-50/70 to-red-50/70 border border-amber-300/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-[#b45309] text-xs font-bold uppercase tracking-wider">
            <Star className="w-4 h-4 fill-[#b45309] text-[#b45309]" />
            <span>Google Reviews & Harlem Trust Engine</span>
          </div>
          <h4 className="font-serif-title text-lg font-bold text-neutral-900">
            Reputation & Review Generation Automation
          </h4>
          <p className="text-xs text-neutral-600 max-w-xl font-light">
            After the Day 7 wellness check is acknowledged, families receive an optional invitation to share their experience on Google and memorial forums, bolstering Benta’s 98-year reputation.
          </p>
        </div>

        <button
          onClick={() => alert('Automated 5-star review outreach scheduled for Day 14.')}
          className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-5 py-2.5 rounded-lg whitespace-nowrap transition shadow-md shadow-red-950/20 border border-amber-300/40"
        >
          Trigger Review Request
        </button>
      </div>

      {/* Email Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-neutral-900">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="font-serif-title font-bold text-base text-neutral-900">
                Email Preview: {activePreview.milestoneTitle}
              </h3>
              <button
                onClick={() => setActivePreview(null)}
                className="text-neutral-500 hover:text-neutral-900 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 bg-[#fbfbfd] rounded-xl border border-neutral-200 text-xs space-y-3 font-sans">
              <p className="text-neutral-600"><strong>To:</strong> {caseData.informant.fullName} &lt;{caseData.informant.email}&gt;</p>
              <p className="text-neutral-600"><strong>From:</strong> Jason Benta &lt;care@e-bfh.com&gt;</p>
              <p className="text-[#800000] font-bold"><strong>Subject:</strong> {defaultTemplates[activePreview.templateName]?.subject}</p>
              <div className="border-t border-neutral-200 pt-3 text-neutral-700 whitespace-pre-line leading-relaxed font-light">
                {defaultTemplates[activePreview.templateName]?.body}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActivePreview(null)}
                className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-5 py-2 rounded-lg transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
