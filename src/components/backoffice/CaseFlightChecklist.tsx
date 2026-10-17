import React, { useState } from 'react';
import {
  GoldenRecordCase,
  CasePhase,
  CaseFlightPhaseProgress,
  CaseFlightChecklistItem,
  FlightChecklistActionType
} from '../../lib/types/funeral';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Layers,
  Clock,
  Play
} from 'lucide-react';

interface CaseFlightChecklistProps {
  caseItem: GoldenRecordCase;
  currentPhase: CasePhase;
  checklistProgress: CaseFlightPhaseProgress[];
  onTriggerAction: (actionType: FlightChecklistActionType) => void;
  onAdvancePhase?: (caseId: string, nextPhase: CasePhase) => void;
  onToggleItemCompletion?: (itemId: string) => void;
}

export const CaseFlightChecklist: React.FC<CaseFlightChecklistProps> = ({
  caseItem,
  currentPhase,
  checklistProgress,
  onTriggerAction,
  onAdvancePhase,
  onToggleItemCompletion
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPhaseView, setSelectedPhaseView] = useState<CasePhase>(currentPhase);
  const [gatekeeperAlert, setGatekeeperAlert] = useState<string | null>(null);

  const phaseOrder: CasePhase[] = [
    'intake_removal',
    'arrangements',
    'legal_bundle',
    'permits_logistics',
    'finalization_aftercare'
  ];

  const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
  const activePhaseProgress = checklistProgress.find(p => p.phase === selectedPhaseView) || checklistProgress[0];

  // Calculate overall case completion percentage across all 5 phases
  const allItems = checklistProgress.flatMap(p => p.items);
  const completedItemsCount = allItems.filter(i => i.isCompleted).length;
  const overallPercentage = Math.round((completedItemsCount / (allItems.length || 1)) * 100);

  // Check if current phase mandatory items are satisfied
  const currentPhaseData = checklistProgress.find(p => p.phase === currentPhase);
  const incompleteMandatoryItems = currentPhaseData?.items.filter(i => i.isMandatoryForPhaseAdvance && !i.isCompleted) || [];
  const canAdvanceCurrentPhase = incompleteMandatoryItems.length === 0;

  const handleAdvanceClick = () => {
    if (!canAdvanceCurrentPhase) {
      setGatekeeperAlert(
        `Stage Gatekeeper: You have ${incompleteMandatoryItems.length} mandatory requirement(s) pending in this phase: "${incompleteMandatoryItems.map(i => i.title).join('", "')}". Complete or verify them before advancing.`
      );
      setTimeout(() => setGatekeeperAlert(null), 8000);
      return;
    }

    if (onAdvancePhase && currentPhaseIndex < phaseOrder.length - 1) {
      const next = phaseOrder[currentPhaseIndex + 1];
      onAdvancePhase(caseItem.id, next);
      setSelectedPhaseView(next);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-red-900/20 shadow-md overflow-hidden transition-all text-neutral-900">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c1a1a] via-[#241f1a] to-[#1c1a1a] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-amber-400/80">
        
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#800000] text-white flex items-center justify-center font-bold shadow-sm border border-amber-300">
            <Layers className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                DIRECTOR FLIGHT CHECKLIST & GATEKEEPER
              </span>
              <span className="text-xs text-neutral-300 font-mono">
                Case #{caseItem.caseNumber}
              </span>
            </div>
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-white tracking-wide">
              {caseItem.decedent.legalName} • Compliance & Execution Flight Plan
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Progress Pill */}
          <div className="text-right">
            <div className="text-[11px] text-neutral-300 font-medium">
              Overall Progress: <strong className="text-amber-300 font-mono font-bold">{completedItemsCount}/{allItems.length} Tasks ({overallPercentage}%)</strong>
            </div>
            <div className="w-36 sm:w-48 bg-neutral-700/80 h-2 rounded-full overflow-hidden mt-1 border border-neutral-600">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 transition text-xs font-bold flex items-center gap-1"
            title={isExpanded ? 'Collapse Flight Checklist' : 'Expand Flight Checklist'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Gatekeeper Alert Notice */}
      {gatekeeperAlert && (
        <div className="bg-amber-50 border-b border-amber-300 p-3 px-5 text-xs text-amber-950 flex items-start gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-[#800000] shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{gatekeeperAlert}</div>
          <button
            onClick={() => setGatekeeperAlert(null)}
            className="text-amber-800 hover:text-amber-950 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* 5-Phase Navigation Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            {checklistProgress.map((phase) => {
              const isCurrent = phase.phase === currentPhase;
              const isSelected = phase.phase === selectedPhaseView;
              const phaseIndex = phaseOrder.indexOf(phase.phase);
              const isPast = phaseIndex < currentPhaseIndex;
              const phaseCompletedCount = phase.items.filter(i => i.isCompleted).length;
              const allPhaseCompleted = phaseCompletedCount === phase.items.length;

              return (
                <button
                  key={phase.phase}
                  onClick={() => setSelectedPhaseView(phase.phase)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-50/90 border-[#800000] ring-2 ring-red-500/20 shadow-sm'
                      : isPast || allPhaseCompleted
                      ? 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-50 text-emerald-950'
                      : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      isCurrent
                        ? 'bg-[#800000] text-white'
                        : isPast || allPhaseCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      Stage {phase.phaseNumber}
                    </span>

                    {allPhaseCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#800000] animate-ping" />
                    ) : (
                      <Clock className="w-3 h-3 text-neutral-400" />
                    )}
                  </div>

                  <div>
                    <span className={`text-xs font-bold block truncate ${
                      isSelected ? 'text-[#800000]' : isPast ? 'text-emerald-950' : 'text-neutral-800'
                    }`}>
                      {phase.title.split(':')[1]?.trim() || phase.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {phaseCompletedCount}/{phase.items.length} Completed
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Items Checklist Matrix */}
          <div className="bg-neutral-50/80 p-4 sm:p-5 rounded-2xl border border-neutral-200 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <h4 className="font-serif-title font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2">
                  <span>{activePhaseProgress.title}</span>
                  {selectedPhaseView === currentPhase && (
                    <span className="bg-red-100 text-[#800000] border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Current Active Phase
                    </span>
                  )}
                </h4>
                <p className="text-xs text-neutral-500 font-light">
                  Execute statutory NYS requirements, verify state paperwork, and ensure high-touch family service.
                </p>
              </div>

              {/* Advance Phase Button */}
              {selectedPhaseView === currentPhase && currentPhaseIndex < phaseOrder.length - 1 && (
                <button
                  onClick={handleAdvanceClick}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0 ${
                    canAdvanceCurrentPhase
                      ? 'bg-[#800000] hover:bg-[#6a0509] text-white border border-amber-300/40'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                  }`}
                  title={canAdvanceCurrentPhase ? 'Advance to next phase' : 'Mandatory tasks pending'}
                >
                  {canAdvanceCurrentPhase ? (
                    <>
                      <span>Complete Stage & Advance ➔</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{incompleteMandatoryItems.length} Mandatory Task(s) Pending</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Checklist Task Rows */}
            <div className="space-y-3">
              {activePhaseProgress.items.map((item: CaseFlightChecklistItem) => (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200 text-neutral-900'
                      : 'bg-white border-neutral-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    
                    {/* Completion Checkbox Button */}
                    <button
                      onClick={() => onToggleItemCompletion && onToggleItemCompletion(item.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                        item.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-neutral-400 hover:border-[#800000] bg-white'
                      }`}
                      title={item.isCompleted ? 'Mark task pending' : 'Mark task completed'}
                    >
                      {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <strong className={`text-xs sm:text-sm font-bold ${
                          item.isCompleted ? 'text-emerald-950 line-through decoration-emerald-500/50' : 'text-neutral-900'
                        }`}>
                          {item.title}
                        </strong>

                        {item.isMandatoryForPhaseAdvance && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 text-[#800000] border border-red-200 px-1.5 py-0.2 rounded">
                            Mandatory Gate
                          </span>
                        )}

                        {item.statutoryReference && (
                          <span className="text-[10px] text-neutral-500 font-mono hidden md:inline">
                            [{item.statutoryReference}]
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-600 font-light">
                        {item.description}
                      </p>

                      {item.isCompleted && item.completedAt && (
                        <div className="text-[10px] text-emerald-700 font-mono pt-0.5">
                          ✓ Completed: {item.completedAt} {item.completedBy ? `by ${item.completedBy}` : ''}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* 1-Click Action Launcher */}
                  <div className="flex items-center space-x-2 shrink-0 sm:self-center pl-8 sm:pl-0">
                    <button
                      onClick={() => onTriggerAction(item.actionType)}
                      className="px-3.5 py-1.5 bg-neutral-900 hover:bg-[#800000] text-white font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1.5 border border-amber-400/30"
                    >
                      <Play className="w-3 h-3 text-amber-300" />
                      <span>{item.actionLabel}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Zero Transcription Assurance Footer */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between text-xs text-amber-950 gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#800000] shrink-0" />
              <span>
                <strong>Compliance Engine Note:</strong> All statutory actions link directly to the Golden Record. Data entered once syncs automatically into state filing sheets and vendor dispatch tickets.
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-800 font-semibold">
              NYS DOH Part 77 • FTC Funeral Rule Verified
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
