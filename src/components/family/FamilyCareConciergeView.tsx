import React, { useState, useRef, useEffect } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  DollarSign, 
  Heart, 
  FileText, 
  Scale, 
  Flag, 
  ArrowRight, 
  AlertCircle, 
  UserCheck, 
  RefreshCw,
  Info,
  PhoneCall
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citation?: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    actionKey: string;
  }>;
}

interface FamilyCareConciergeViewProps {
  activeCase: GoldenRecordCase;
  onNavigateTab?: (tab: 'obituary' | 'tribute' | 'arrangements' | 'documents' | 'photos' | 'status') => void;
}

export const FamilyCareConciergeView: React.FC<FamilyCareConciergeViewProps> = ({
  activeCase,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'chat' | 'financial' | 'laws' | 'crisis'>('chat');
  const [selectedState, setSelectedState] = useState<'NY' | 'NJ' | 'CT'>('NY');
  
  // Chat state
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-init',
    sender: 'bot',
    text: `Hello ${activeCase.informant.fullName || 'Family'}, I am your **Benta 24/7 Family Care Concierge** for **${activeCase.decedent.legalName}** (Case #${activeCase.caseNumber}). 

I am here day and night to answer questions regarding **financial assistance (NYC HRA & VA Benefits)**, **New York funeral laws & Right of Disposition (PHL § 4201)**, **interstate transport logistics**, or to connect you directly with **Director Jason Benta**.

How may I gently assist you right now?`,
    citation: "Benta's Funeral Home Care Desk • Serving Families Since 1928",
    timestamp: 'Just now',
    suggestedActions: [
      { label: '💰 Financial & Veteran Benefits', actionKey: 'financial' },
      { label: '📜 NY State Law & Right to Control (PHL § 4201)', actionKey: 'laws' },
      { label: '🚗 Interstate Transport & Woodlawn Logistics', actionKey: 'interstate' },
      { label: '🕊️ Grief Support & 24/7 Counselors', actionKey: 'grief' }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Knowledge Base Query Engine (Matching BFH Chatbot app.js)
  const generateBotResponse = (query: string): { text: string; citation: string; actions?: any[] } => {
    const q = query.toLowerCase();

    // 1. Veteran & Military Honors
    if (q.includes('veteran') || q.includes('va') || q.includes('military') || q.includes('dd-214') || q.includes('dd214') || q.includes('armed forces') || q.includes('flag') || q.includes('taps')) {
      return {
        text: `Honoring our nation's service members is a sacred duty at Benta's Funeral Home. ${activeCase.decedent.veteran ? `Since ${activeCase.decedent.legalName} served in the ${activeCase.decedent.branchOfService || 'U.S. Armed Forces'}, your family is entitled to full federal honors:` : 'Honorably discharged veterans are entitled to meaningful federal benefits:'}

1. **Free Cemetery Plot & Burial:** In any VA National Cemetery (such as Calverton National, Long Island National, or BG William C. Doyle NJ). This includes opening/closing, a government headstone, and perpetual care.
2. **Military Funeral Honors:** A ceremonial 2-person uniform honor guard, the playing of *Taps*, and the official presentation of the folded American Burial Flag.
3. **Presidential Memorial Certificate:** An engraved parchment signed by the President of the United States.
4. **VA Burial Allowance:** Between **$893 and $2,000+** depending on service-connected status.

**Required:** The Veteran's **DD-214 Form** (Discharge Certificate). If you cannot locate it, Benta's will help expedite military records retrieval directly with the National Personnel Records Center.`,
        citation: "U.S. Department of Veterans Affairs (VA.gov) 38 CFR § 3.1700",
        actions: [
          { label: 'View Financial Benefits Cards', actionKey: 'open_financial_tab' },
          { label: 'Speak with Director on VA Filing', actionKey: 'call_director' }
        ]
      };
    }

    // 2. Financial Assistance (NYC HRA, Social Security, OVS, Medicaid)
    if (q.includes('hra') || q.includes('financial') || q.includes('assistance') || q.includes('aid') || q.includes('help pay') || q.includes('cost') || q.includes('money') || q.includes('social security') || q.includes('255') || q.includes('ovs')) {
      return {
        text: `Several government assistance programs are available to help families offset funeral costs:

• **NYC HRA Burial Assistance:** Low-income NYC residents can receive up to **$1,700** toward funeral or cremation expenses, provided total costs remain under the qualifying cap ($3,400). Applications are open up to 120 days after death.
• **Social Security Lump-Sum Death Benefit:** A one-time payment of **$255** is payable to a surviving spouse or eligible dependent child (filed via Form SSA-721).
• **NYS Office of Victim Services (OVS):** Up to **$6,000** in funeral reimbursement if the loss resulted from a violent crime or fatal traffic incident.
• **Medicaid Pre-Need Spend-Down:** Irrevocable funeral trusts (like NYS PrePlan) protect assets during Medicaid qualification.

Benta's Funeral Home will directly prepare the itemized invoices and documentation required for HRA and Social Security claims.`,
        citation: "NYC Human Resources Administration & SSA § 402(i)",
        actions: [
          { label: 'Explore Financial Benefits Section', actionKey: 'open_financial_tab' },
          { label: 'View Legal Documents & eSign', actionKey: 'nav_docs' }
        ]
      };
    }

    // 3. Legal Right of Disposition & State Law (PHL § 4201)
    if (q.includes('law') || q.includes('right to control') || q.includes('4201') || q.includes('next of kin') || q.includes('nok') || q.includes('who can sign') || q.includes('hierarchy') || q.includes('spouse') || q.includes('children')) {
      return {
        text: `Under **New York Public Health Law § 4201**, authority to control funeral and final disposition decisions follows a strict statutory priority hierarchy:

1. **Designated Agent:** Named in a signed, witnessed NYS Disposition of Remains form.
2. **Surviving Spouse:** Or legally recognized domestic partner (*verified for ${activeCase.informant.fullName}*).
3. **Surviving Adult Children:** (Age 18 and older, majority consensus).
4. **Surviving Parents:** Either surviving biological or adoptive parent.
5. **Surviving Adult Siblings:** Brothers and sisters (majority consensus).
6. **Court-Appointed Administrator / Guardian:** Of the decedent's estate.

*Note on Embalming:* Embalming is **NOT mandatory** under New York law (10 NYCRR § 77.7). Families have the complete legal right to select direct cremation, direct burial, or refrigeration without embalming.`,
        citation: "NY Public Health Law § 4201 & 10 NYCRR § 77.7",
        actions: [
          { label: 'Compare Tri-State Laws (NY / NJ / CT)', actionKey: 'open_laws_tab' },
          { label: 'Review Right to Control Legal Form', actionKey: 'nav_docs' }
        ]
      };
    }

    // 4. Interstate Transport, Transit Permits & Woodlawn
    if (q.includes('interstate') || q.includes('transport') || q.includes('transfer') || q.includes('repatriation') || q.includes('woodlawn') || q.includes('crematory') || q.includes('across state') || q.includes('airline') || q.includes('flight')) {
      return {
        text: `When transferring a loved one across state lines (such as NY, NJ, CT, PA, or internationally) or to Woodlawn Crematory:

1. **Burial-Transit Permit:** The local registrar of vital statistics in the place of death must issue a certified Transit Permit before the decedent can cross state borders.
2. **Regional Ground Transfer:** For neighboring states (NY, NJ, CT, PA), private climate-controlled ground transfer by Benta's specialized cortege vehicle is customary, dignified, and cost-effective.
3. **Airline & Global Repatriation:** For long distances, TSA Known-Shipper protocols, consular clearances, and apostilles apply. Benta's coordinates all flights and receiving funeral home handoffs directly.
4. **Woodlawn Crematory Escort:** For **${activeCase.decedent.legalName}**, cortege departure from 630 St. Nicholas Ave includes full licensed director escort to Woodlawn (Bronx, NY).`,
        citation: "NYS DOH Interstate Transit & TSA Known-Shipper Guidelines",
        actions: [
          { label: 'Check Live Livery & Custody Status', actionKey: 'nav_status' }
        ]
      };
    }

    // 5. Obituary & Digital Tribute Suite
    if (q.includes('obituary') || q.includes('story') || q.includes('draft') || q.includes('tribute') || q.includes('voice') || q.includes('qr') || q.includes('friends') || q.includes('record')) {
      return {
        text: `Your Family Portal includes two powerful commemorative tools:

1. **🕊️ 9-Part Trauma-Informed Obituary Studio:** Walks you step-by-step through ordinary habits, signature sayings, and milestones without overwhelming timelines. Automatically produces a **Full Memorial Program draft** and a **Short Newspaper Notice**.
2. **🎙️ Digi-Tribute 2.0 & Keepsake Volume:** Collects living acoustic voice memories, video tributes, and reflections from family and friends. Formats them into poetic stanzas bound in a museum-grade Coffee Table Keepsake Book with scan-to-stream QR audio codes.`,
        citation: "Benta's Trauma-Informed Memory Suite",
        actions: [
          { label: 'Open 9-Part Obituary Studio', actionKey: 'nav_obit' },
          { label: 'Open Digi-Tribute & Keepsake Studio', actionKey: 'nav_tribute' }
        ]
      };
    }

    // 6. Grief, Bereavement & Crisis Counseling
    if (q.includes('grief') || q.includes('sad') || q.includes('crying') || q.includes('pain') || q.includes('lonely') || q.includes('support') || q.includes('counseling') || q.includes('help')) {
      return {
        text: `Please know that what you are feeling right now is completely natural. Grief touches us emotionally, physically, and spiritually in unpredictable waves.

• **Be Gentle with Yourself:** There is no correct timeline, and no 'right' way to grieve.
• **For Children & Teens:** Use honest, gentle words. Reassure them that they are loved and safe.
• **Free 24/7 Crisis Support:** Call or text **988** anytime to speak with a compassionate crisis counselor, or call the **Grief Recovery Helpline** at **1-800-445-3834**.

The Benta family is holding you close. Director Jason Benta and our care team are always just a phone call away.`,
        citation: "BFH Bereavement Care & American Psychological Association",
        actions: [
          { label: 'Call 24/7 Benta Director Line', actionKey: 'call_director' }
        ]
      };
    }

    // Default Fallback
    return {
      text: `Thank you for your question regarding **${activeCase.decedent.legalName}** (Case #${activeCase.caseNumber}). 

We have recorded your inquiry. You can explore the **Financial Benefits** tab for NYC HRA / VA details, review the **State Law** guide for Right of Disposition rules, or contact Director Jason Benta directly at **(212) 281-8850** for immediate personal assistance.`,
      citation: "Benta's Care Concierge • Harlem, NY",
      actions: [
        { label: '💰 View Financial Benefits', actionKey: 'open_financial_tab' },
        { label: '⚖️ View NY / NJ / CT Laws', actionKey: 'open_laws_tab' }
      ]
    };
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || userInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateBotResponse(textToSend);
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: responseData.text,
        citation: responseData.citation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: responseData.actions
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (actionKey: string) => {
    switch (actionKey) {
      case 'financial':
      case 'open_financial_tab':
        setActiveSection('financial');
        break;
      case 'laws':
      case 'open_laws_tab':
        setActiveSection('laws');
        break;
      case 'crisis':
      case 'open_crisis_tab':
        setActiveSection('crisis');
        break;
      case 'interstate':
        handleSendMessage(undefined, 'How does interstate transfer and transport to Woodlawn Crematory work?');
        break;
      case 'grief':
        handleSendMessage(undefined, 'What grief support and bereavement counseling resources are available?');
        break;
      case 'nav_docs':
        if (onNavigateTab) onNavigateTab('documents');
        break;
      case 'nav_obit':
        if (onNavigateTab) onNavigateTab('obituary');
        break;
      case 'nav_tribute':
        if (onNavigateTab) onNavigateTab('tribute');
        break;
      case 'nav_status':
        if (onNavigateTab) onNavigateTab('status');
        break;
      case 'call_director':
        alert("Connecting to Director Jason Benta's 24/7 Family Line: (212) 281-8850");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Concierge Hero Banner */}
      <div className="bg-gradient-to-br from-[#141b2b] via-[#1f2a42] to-[#2b1810] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="inline-flex items-center space-x-1.5 bg-amber-400/20 border border-amber-400/50 text-amber-200 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>24/7 Family Care Concierge & Legal Assistant</span>
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Compassionate Answers for {activeCase.decedent.legalName}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Immediate 24/7 guidance on government financial assistance (NYC HRA & VA), New York statutory rights (PHL § 4201), transparent itemized pricing, and crisis support.
          </p>
        </div>
        <div className="absolute right-6 -bottom-6 text-9xl text-white/5 font-serif select-none pointer-events-none">
          ⚖️
        </div>
      </div>

      {/* Concierge Sub-Navigation Pills */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-1.5 shadow-sm flex items-center justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSection('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition ${
            activeSection === 'chat'
              ? 'bg-[#991b1b] text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>💬 Live Care Chat & Assistant</span>
        </button>

        <button
          onClick={() => setActiveSection('financial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition ${
            activeSection === 'financial'
              ? 'bg-[#991b1b] text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>💰 Financial & Veteran Benefits</span>
        </button>

        <button
          onClick={() => setActiveSection('laws')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition ${
            activeSection === 'laws'
              ? 'bg-[#991b1b] text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-blue-400" />
          <span>⚖️ Tri-State Funeral Laws (NY/NJ/CT)</span>
        </button>

        <button
          onClick={() => setActiveSection('crisis')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition ${
            activeSection === 'crisis'
              ? 'bg-[#991b1b] text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>🚨 First Steps & Passing Guide</span>
        </button>
      </div>

      {/* SUB-TAB 1: LIVE CONVERSATIONAL CHAT */}
      {activeSection === 'chat' && (
        <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[640px]">
          
          {/* Chat Header */}
          <div className="bg-[#141b2b] text-white p-4 px-6 flex flex-wrap justify-between items-center gap-3 border-b border-amber-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#991b1b] flex items-center justify-center font-bold text-xs border border-amber-400/50 shadow-sm">
                BFH
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif-title font-bold text-sm">
                    Benta Family Care Assistant
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-amber-200/90">
                  Case #{activeCase.caseNumber} • Dedicated to {activeCase.decedent.legalName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="tel:2122818850"
                className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>Call Director: (212) 281-8850</span>
              </a>
            </div>
          </div>

          {/* Chat Scroll View */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-neutral-50/50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                >
                  <div className={`max-w-2xl rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-sm text-xs ${
                    isBot 
                      ? 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm' 
                      : 'bg-[#991b1b] text-white rounded-tr-sm shadow-md shadow-red-950/20'
                  }`}>
                    
                    {/* Message Body */}
                    <div className="leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Citation Tag */}
                    {msg.citation && (
                      <div className="text-[10px] text-neutral-500 font-mono border-t border-neutral-100 pt-2 flex items-center space-x-1">
                        <Info className="w-3 h-3 text-[#b45309]" />
                        <span>Source: {msg.citation}</span>
                      </div>
                    )}

                    {/* Action Suggestion Buttons */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
                        {msg.suggestedActions.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(btn.actionKey)}
                            className="bg-amber-50 hover:bg-amber-100 text-[#b45309] border border-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition flex items-center space-x-1"
                          >
                            <span>{btn.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className={`text-[9px] block text-right ${isBot ? 'text-neutral-400' : 'text-red-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl p-3 px-4 flex items-center space-x-2 text-xs text-neutral-500 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#991b1b]" />
                  <span>Consulting Benta Care Knowledge Base...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Preset Quick Query Suggestions */}
          <div className="bg-neutral-100/80 border-t border-neutral-200 p-2.5 px-4 flex items-center space-x-2 overflow-x-auto text-[11px]">
            <span className="font-bold text-neutral-500 shrink-0">Popular:</span>
            <button
              onClick={() => handleSendMessage(undefined, 'What VA veteran burial benefits and military honors are available?')}
              className="bg-white hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-lg border border-neutral-300 font-medium whitespace-nowrap transition"
            >
              🎖️ VA Veteran Benefits
            </button>
            <button
              onClick={() => handleSendMessage(undefined, 'How do we apply for NYC HRA $1,700 burial assistance?')}
              className="bg-white hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-lg border border-neutral-300 font-medium whitespace-nowrap transition"
            >
              💰 NYC HRA $1,700 Aid
            </button>
            <button
              onClick={() => handleSendMessage(undefined, 'Who has legal Right to Control funeral decisions under NY law (PHL 4201)?')}
              className="bg-white hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-lg border border-neutral-300 font-medium whitespace-nowrap transition"
            >
              ⚖️ NY Right to Control
            </button>
            <button
              onClick={() => handleSendMessage(undefined, 'How does interstate transport to Woodlawn Crematory work?')}
              className="bg-white hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-lg border border-neutral-300 font-medium whitespace-nowrap transition"
            >
              🚗 Woodlawn Transfer
            </button>
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about financial aid, NY laws, VA benefits, service times, or logistics..."
              className="flex-1 bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-[#991b1b]"
            />
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="bg-[#991b1b] hover:bg-red-800 disabled:opacity-40 text-white p-3 rounded-2xl font-bold text-xs transition flex items-center justify-center shadow-md shadow-red-950/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: FINANCIAL BENEFITS & VETERAN SUPPORT (Matching #financial-benefits) */}
      {activeSection === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[#b45309] text-[11px] font-bold uppercase tracking-widest block mb-1">
                Government Grants & Assistance Programs
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-neutral-900">
                Financial Benefits & Veteran Support Center
              </h3>
              <p className="text-xs text-neutral-600 max-w-3xl mt-1">
                Benta's Funeral Home assists families in securing all eligible public benefits, veteran entitlements, and insurance claims to minimize out-of-pocket expenses.
              </p>
            </div>

            {/* Benefit Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Featured Card: Veteran Military Honors & VA Benefits */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#330b0f] via-[#24070a] to-[#160305] text-white p-6 sm:p-8 rounded-3xl border-2 border-red-500/40 shadow-xl space-y-5 relative overflow-hidden">
                <div className="flex flex-wrap justify-between items-start gap-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ed1c24] to-[#ad1118] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                      <Flag className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <span className="bg-red-500/30 text-red-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-red-500/40">
                        United States Armed Forces
                      </span>
                      <h4 className="font-serif-title text-lg sm:text-xl font-bold text-white mt-1">
                        Veteran Military Honors & VA National Cemetery Benefits
                      </h4>
                    </div>
                  </div>

                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full">
                    {activeCase.decedent.veteran ? 'Active Veteran Case' : 'Federal Entitlement'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-200 relative z-10">
                  <ul className="space-y-2.5">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>Free VA National Cemetery Plot:</strong> Calverton, Long Island National, or BG William C. Doyle NJ with perpetual care.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>Military Funeral Honors:</strong> 2-person uniform honor guard, live folding of the American burial flag, and playing of *Taps*.</span>
                    </li>
                  </ul>

                  <ul className="space-y-2.5">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>Presidential Memorial Certificate:</strong> Gold-embossed parchment signed by the President of the United States.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">★</span>
                      <span><strong>VA Burial Allowance:</strong> Cash allowance between <strong>$893 and $2,000+</strong> based on service qualifications.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-950/60 border border-red-500/30 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-red-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span><strong>Required Document:</strong> Military Discharge Certificate (Form DD-214). BFH will assist with record requests if lost.</span>
                  </div>
                  <button
                    onClick={() => handleSendMessage(undefined, 'How do we request DD-214 military honors for Arthur Vance?')}
                    className="bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow-sm"
                  >
                    Request Honors Coordination
                  </button>
                </div>
              </div>

              {/* Card 2: NYC HRA Burial Assistance */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-[#991b1b] flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider">NYC Department of Social Services</span>
                      <h4 className="font-serif-title font-bold text-base text-neutral-900">
                        NYC HRA Burial Assistance (Up to $1,700)
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Low-income NYC residents can receive up to <strong>$1,700</strong> toward funeral or cremation expenses, provided overall costs remain under the statutory cap ($3,400).
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>Applications accepted within 120 days from date of death.</li>
                    <li>BFH provides certified itemized bill formatted for HRA audit.</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSendMessage(undefined, 'Can BFH provide the itemized bill for NYC HRA Burial Assistance?')}
                  className="w-full bg-white hover:bg-neutral-100 text-[#991b1b] border border-red-200 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Generate HRA Packet Info
                </button>
              </div>

              {/* Card 3: Social Security Lump-Sum Benefit */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Social Security Administration</span>
                      <h4 className="font-serif-title font-bold text-base text-neutral-900">
                        Social Security $255 Lump-Sum (SSA-721)
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    A one-time federal payment of <strong>$255</strong> is disbursed to a surviving spouse or eligible dependent children under Social Security Act § 402(i).
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>BFH transmits the Electronic Statement of Death (SSA-721).</li>
                    <li>Funds are wired directly to the surviving spouse's account.</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSendMessage(undefined, 'How is the Social Security $255 lump sum death payment processed?')}
                  className="w-full bg-white hover:bg-neutral-100 text-blue-900 border border-blue-200 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Check SSA-721 Filing Status
                </button>
              </div>

              {/* Card 4: NYS Office of Victim Services (OVS) */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Crime Victim Compensation</span>
                      <h4 className="font-serif-title font-bold text-base text-neutral-900">
                        NYS OVS Funeral Aid (Up to $6,000)
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    If the loss resulted from a violent crime or vehicular crime, the NYS Office of Victim Services reimburses up to <strong>$6,000</strong> for funeral and burial expenses.
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>No out-of-pocket maximum restriction.</li>
                    <li>BFH advocates on your family's behalf with police/investigators.</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSendMessage(undefined, 'How do we apply for NYS Office of Victim Services OVS reimbursement?')}
                  className="w-full bg-white hover:bg-neutral-100 text-purple-900 border border-purple-200 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Learn About OVS Claims
                </button>
              </div>

              {/* Card 5: Medicaid Pre-Need Spend-Down & Trust */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#b45309] flex items-center justify-center font-bold">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider">Asset Protection & PrePlan</span>
                      <h4 className="font-serif-title font-bold text-base text-neutral-900">
                        Medicaid Spend-Down & 100% Trust Escrow
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Under NYS General Business Law § 453, 100% of pre-need funds are deposited in state-audited escrow trusts (NYS PrePlan) and are 100% exempt from Medicaid asset clawback.
                  </p>
                  <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>FDIC-insured and earns compounded interest.</li>
                    <li>Protects family legacy before long-term healthcare spend-down.</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSendMessage(undefined, 'Tell me about Medicaid spend-down rules and NYS PrePlan funeral trusts.')}
                  className="w-full bg-white hover:bg-neutral-100 text-[#b45309] border border-amber-200 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Explore PrePlan Trusts
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TRI-STATE FUNERAL LAWS (NY / NJ / CT) */}
      {activeSection === 'laws' && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[#b45309] text-[11px] font-bold uppercase tracking-widest block mb-1">
                Consumer Protection & Statutory Transparency
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-neutral-900">
                Tri-State Funeral Law & Legal Rights Guide
              </h3>
              <p className="text-xs text-neutral-600">
                Understand your statutory rights regarding Right to Control (Next-of-Kin), Embalming disclosures, and 100% Pre-Need Trust security.
              </p>
            </div>

            {/* State Selector Tabs */}
            <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-bold">
              {(['NY', 'NJ', 'CT'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-4 py-1.5 rounded-lg transition ${
                    selectedState === st
                      ? 'bg-[#991b1b] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {st === 'NY' ? 'New York (NYS)' : st === 'NJ' ? 'New Jersey (NJ)' : 'Connecticut (CT)'}
                </button>
              ))}
            </div>
          </div>

          {/* New York Law Explorer */}
          {selectedState === 'NY' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NY Right of Disposition */}
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-3">
                  <div className="flex items-center space-x-2 text-[#991b1b]">
                    <UserCheck className="w-5 h-5" />
                    <h4 className="font-serif-title font-bold text-base text-neutral-900">
                      Legal Right of Disposition (NY PHL § 4201)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Under New York Public Health Law § 4201, authority to control funeral and final disposition decisions follows a strict statutory hierarchy:
                  </p>
                  <ol className="text-xs text-neutral-800 space-y-1.5 list-decimal list-inside bg-white p-4 rounded-2xl border border-neutral-200">
                    <li><strong>Designated Agent:</strong> Named in signed NYS form.</li>
                    <li><strong>Surviving Spouse / Domestic Partner.</strong></li>
                    <li><strong>Surviving Adult Children:</strong> (Majority vote).</li>
                    <li><strong>Surviving Biological or Adoptive Parents.</strong></li>
                    <li><strong>Surviving Adult Siblings.</strong></li>
                    <li><strong>Court-Appointed Estate Administrator.</strong></li>
                  </ol>
                  <span className="text-[10px] text-neutral-400 block font-mono">NY Public Health Law § 4201</span>
                </div>

                {/* NY Embalming Rules */}
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#b45309]">
                      <ShieldCheck className="w-5 h-5" />
                      <h4 className="font-serif-title font-bold text-base text-neutral-900">
                        Embalming Consent (10 NYCRR § 77.7)
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600">
                      <strong>Embalming is NOT mandatory by New York law</strong> for all decedents. Families have the full legal right to select direct cremation, direct burial, or refrigeration without chemical embalming.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                      <strong>Mandatory Rule:</strong> Funeral directors MUST obtain oral or written consent before performing embalming care.
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">10 NYCRR § 77.7 & NY DOH Directives</span>
                </div>

                {/* NY 100% Pre-Need Trust Law */}
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800">
                    <DollarSign className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-serif-title font-bold text-base text-neutral-900">
                      100% Pre-Need Trust Escrow (NYS GBL § 453)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    New York enforces the nation's strictest pre-need law: 100% of consumer funds must remain in interest-bearing escrow trusts (NYS PrePlan).
                  </p>
                  <ul className="text-xs text-neutral-800 space-y-1 list-disc list-inside">
                    <li>100% of principal plus interest belongs to consumer.</li>
                    <li>Revocable trusts are 100% refundable on demand.</li>
                    <li>Irrevocable trusts qualify for Medicaid spend-downs.</li>
                  </ul>
                  <span className="text-[10px] text-neutral-400 block font-mono">NYS General Business Law § 453</span>
                </div>

                {/* FTC Funeral Rule & Price List */}
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <FileText className="w-5 h-5 text-blue-700" />
                    <h4 className="font-serif-title font-bold text-base text-neutral-900">
                      FTC Funeral Rule (16 CFR Part 453)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    You have the right to select individual goods and services. Funeral homes are prohibited from charging handling fees for third-party caskets or urns.
                  </p>
                  <ul className="text-xs text-neutral-800 space-y-1 list-disc list-inside">
                    <li>Written General Price List (GPL) required.</li>
                    <li>Zero mark-up on government cash advances.</li>
                  </ul>
                  <span className="text-[10px] text-neutral-400 block font-mono">FTC 16 CFR Part 453</span>
                </div>

              </div>
            </div>
          )}

          {/* New Jersey Law Explorer */}
          {selectedState === 'NJ' && (
            <div className="space-y-4 text-xs text-neutral-700">
              <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-3">
                <h4 className="font-serif-title font-bold text-base text-neutral-900">
                  New Jersey Right to Control (NJSA 45:27-22)
                </h4>
                <p>In New Jersey, custody and control priority starts with the <strong>Appointed Executor named in the Will</strong>, followed by Surviving Spouse/Partner, then majority of Adult Children.</p>
                <span className="text-[10px] font-mono text-neutral-400">NJSA 45:27-22 / NJAC 13:36</span>
              </div>
            </div>
          )}

          {/* Connecticut Law Explorer */}
          {selectedState === 'CT' && (
            <div className="space-y-4 text-xs text-neutral-700">
              <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-3">
                <h4 className="font-serif-title font-bold text-base text-neutral-900">
                  Connecticut Disposition Rights (CT Gen Stat § 45a-318)
                </h4>
                <p>Connecticut enforces a mandatory 48-hour waiting period and Medical Examiner Cremation Certificate ($150 fee) prior to cremation disposition.</p>
                <span className="text-[10px] font-mono text-neutral-400">CT General Statutes § 45a-318 & § 19a-323</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 4: FIRST STEPS & CRISIS PASSING GUIDE */}
      {activeSection === 'crisis' && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[#b45309] text-[11px] font-bold uppercase tracking-widest block mb-1">
              Immediate Guidance for Families
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-neutral-900">
              First Steps Following a Passing
            </h3>
            <p className="text-xs text-neutral-600">
              Clear, step-by-step procedures based on where the passing occurred.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-3">
              <h4 className="font-serif-title font-bold text-base text-neutral-900 flex items-center space-x-2">
                <span>🏥</span>
                <span>Hospital or Hospice Facility Passing</span>
              </h4>
              <ol className="space-y-2 list-decimal list-inside text-neutral-700">
                <li>Attending physician or nurse completes official Pronouncement of Death.</li>
                <li>Inform the charge nurse that **Benta's Funeral Home (212-281-8850)** is your chosen provider.</li>
                <li>Sign the hospital release authorization (can be completed via eSign in our portal).</li>
                <li>BFH transfer team arrives within 60–90 minutes into dignified custody.</li>
              </ol>
            </div>

            <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 space-y-3">
              <h4 className="font-serif-title font-bold text-base text-neutral-900 flex items-center space-x-2">
                <span>🏠</span>
                <span>Home or Sudden Passing (OCME)</span>
              </h4>
              <ol className="space-y-2 list-decimal list-inside text-neutral-700">
                <li>If under hospice care, call hospice nurse first. Otherwise call 911 for emergency response.</li>
                <li>If police/OCME respond, obtain the **Medical Examiner Case Number**.</li>
                <li>Call Benta's Funeral Home. We interface directly with OCME for case tracking.</li>
                <li>Sign electronic OCME Release and custody transfer authorization.</li>
              </ol>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
