import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, BookOpen, Music, Car, Utensils, AlertCircle } from 'lucide-react';
import { DispositionType, GoldenRecordCase } from '../../lib/types/funeral';
import { INITIAL_DOCUMENT_TEMPLATES } from '../../lib/data/mockCases';
import { getDefaultStatementOfGoodsForCase, BFH_GPL_2026 } from '../../lib/data/generalPriceList';
import { 
  formatPhoneNumbersOnly, 
  isValidEmailFormat, 
  validateLifeDates 
} from '../../lib/utils/inputValidation';

interface ArrangerWizardProps {
  onClose: () => void;
  onCaseCreated: (newCase: GoldenRecordCase) => void;
  initialService?: string;
}

export const ArrangerWizard: React.FC<ArrangerWizardProps> = ({
  onClose,
  onCaseCreated,
  initialService = 'cremation_memorial'
}) => {
  const [step, setStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Form State
  const [disposition, setDisposition] = useState<DispositionType>(
    (initialService === 'full_cremation' || initialService === 'cremation_memorial' || initialService === 'direct_cremation' || initialService === 'full_burial' || initialService === 'direct_burial')
      ? (initialService as DispositionType)
      : 'cremation_memorial'
  );
  const [viewingChoice, setViewingChoice] = useState<'Parlor A (Seats 120)' | 'Parlor B (Seats 110)' | 'Church / External Venue' | 'Direct / No Viewing'>('Parlor A (Seats 120)');
  
  // Customizable Variables / Add-ons
  const [includePrograms, setIncludePrograms] = useState(true);
  const [includePrayerCards, setIncludePrayerCards] = useState(true);
  const [includeClergyOrganist, setIncludeClergyOrganist] = useState(true);
  const [includeLimousine, setIncludeLimousine] = useState(false);
  const [includeRepast, setIncludeRepast] = useState(false);

  // Decedent Info
  const [decedentName, setDecedentName] = useState('');
  const [decedentDob, setDecedentDob] = useState('');
  const [decedentDod, setDecedentDod] = useState('');
  const [placeOfDeath, setPlaceOfDeath] = useState('Mount Sinai Morningside Hospital, NYC');
  const [isVeteran, setIsVeteran] = useState(false);
  const [residence, setResidence] = useState('');
  
  // Informant / Next of Kin
  const [informantName, setInformantName] = useState('');
  const [informantRelation, setInformantRelation] = useState('Spouse');
  const [informantPhone, setInformantPhone] = useState('');
  const [informantEmail, setInformantEmail] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'insurance' | 'ach' | 'credit'>('insurance');
  const [insuranceCarrier] = useState('Lincoln National Life / C&J Financial');
  const [policyNum] = useState('LN-992014');

  // Pricing Calculation
  const basePrices: Record<DispositionType, number> = {
    direct_cremation: 1995,
    cremation_memorial: 3195,
    full_cremation: 4850,
    direct_burial: 2750,
    full_burial: 5950,
    pre_need: 3500
  };

  const programsPrice = includePrograms ? 325 : 0;
  const prayerCardsPrice = includePrayerCards ? 200 : 0;
  const clergyOrganistPrice = includeClergyOrganist ? 650 : 0;
  const limousinePrice = includeLimousine ? 715 : 0;
  const repastPrice = includeRepast ? 1400 : 0;

  const currentBasePrice = basePrices[disposition] || 3195;
  const variablesTotal = programsPrice + prayerCardsPrice + clergyOrganistPrice + limousinePrice + repastPrice;
  const totalPrice = currentBasePrice + variablesTotal;

  const handleNextStep = () => {
    setValidationError(null);

    if (step === 2) {
      if (!decedentName.trim()) {
        setValidationError('Please enter the full legal name of your loved one.');
        return;
      }
      if (!decedentDod) {
        setValidationError('Please enter the Date of Passing (Date of Death).');
        return;
      }
      // Date of birth cannot exceed date of death validation
      const dateCheck = validateLifeDates(decedentDob, decedentDod);
      if (!dateCheck.isValid) {
        setValidationError(dateCheck.error || 'Date of Birth entered cannot exceed the Date of Passing (Date of Death).');
        return;
      }
    }

    if (step === 3) {
      if (!informantName.trim()) {
        setValidationError('Please enter your full name as the primary arranger.');
        return;
      }
      if (!informantPhone.trim()) {
        setValidationError('Please enter your mobile phone number.');
        return;
      }
      if (informantPhone.replace(/\D/g, '').length < 10) {
        setValidationError('Please enter a valid 10-digit phone number (numbers only).');
        return;
      }
      if (!informantEmail.trim() || !isValidEmailFormat(informantEmail)) {
        setValidationError('Please enter a valid email address format (e.g. name@example.com).');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict validation
    const dateCheck = validateLifeDates(decedentDob, decedentDod);
    if (!dateCheck.isValid) {
      setValidationError(dateCheck.error || 'Date of Birth entered cannot exceed the Date of Passing (Date of Death).');
      setStep(2);
      return;
    }

    if (informantEmail && !isValidEmailFormat(informantEmail)) {
      setValidationError('Please enter a valid email address format (e.g. name@example.com).');
      setStep(3);
      return;
    }
    
    const newCaseNumber = `BFH-2026-09${Math.floor(Math.random() * 90 + 10)}`;
    const newCase: GoldenRecordCase = {
      id: `case-${Date.now()}`,
      caseNumber: newCaseNumber,
      createdAt: new Date().toISOString(),
      currentPhase: 'intake_removal',
      dispositionType: disposition,
      safeArrivalStatus: 'pending_removal',
      assignedDirector: 'Jason Benta (Director in Charge)',
      decedent: {
        legalName: decedentName || 'Beloved Family Member',
        gender: 'male',
        dateOfBirth: decedentDob || '1952-05-14',
        dateOfDeath: decedentDod || new Date().toISOString().split('T')[0],
        placeOfDeath: placeOfDeath,
        ssnMasked: 'XXX-XX-4819',
        maritalStatus: 'married',
        residenceAddress: residence || 'Harlem, New York, NY 10030',
        city: 'New York',
        state: 'NY',
        zipCode: '10030',
        veteran: isVeteran,
        occupation: 'Educator & Community Leader',
        industry: 'Education',
        fatherName: 'Family Patriarch',
        motherMaidenName: 'Family Matriarch'
      },
      informant: {
        fullName: informantName || 'Next of Kin',
        relationship: informantRelation,
        phone: informantPhone || '(212) 555-0198',
        email: informantEmail || 'family@harlem.org',
        address: residence || 'Harlem, New York, NY 10030',
        isNextOfKin: true,
        hasRightToControl: true
      },
      medicalCertifier: {
        physicianName: 'Attending Physician, MD',
        licenseNumber: 'NY-MED-992019',
        hospitalFacility: placeOfDeath,
        phone: '(212) 555-4000',
        edrsStatus: 'pending'
      },
      serviceSelections: {
        dispositionType: disposition,
        packageTitle: disposition === 'full_cremation' 
          ? 'Funeral Service with Cremation'
          : disposition === 'cremation_memorial'
          ? 'Cremation and Memorial Service'
          : disposition === 'full_burial'
          ? 'Traditional Service and Burial'
          : disposition === 'direct_cremation'
          ? 'Direct Cremation'
          : 'Direct Earth Burial',
        basePackagePrice: currentBasePrice,
        casketOrUrnSelected: disposition.includes('cremation') ? 'Handcrafted Solid Bronze Urn' : 'The St. Nicholas Heritage Casket',
        casketPrice: 0,
        viewingParlor: viewingChoice,
        crematoryOrCemeteryName: disposition.includes('cremation') 
          ? 'Woodlawn Crematory (Bronx, NY)'
          : 'Woodlawn Cemetery (Bronx, NY)',
        officiantName: includeClergyOrganist ? 'Senior Officiant' : undefined,
        organistName: includeClergyOrganist ? 'Master Sanctuary Organist' : undefined,
        specialRequests: isVeteran ? 'Military flag presentation requested.' : undefined
      },
      documents: INITIAL_DOCUMENT_TEMPLATES,
      splitBilling: [
        {
          payerType: paymentMethod === 'insurance' 
            ? 'Life Insurance Assignment' 
            : paymentMethod === 'cash'
            ? 'Cash / Certified Bank Check'
            : paymentMethod === 'credit'
            ? 'Credit Card'
            : 'Family ACH Direct',
          providerName: paymentMethod === 'insurance' 
            ? insuranceCarrier 
            : paymentMethod === 'cash'
            ? "In-Person Cash / Certified Bank Check (Benta's 630 St. Nicholas Ave)"
            : paymentMethod === 'credit'
            ? 'Credit Card / Split Pay'
            : 'Direct ACH Bank Transfer',
          policyNumber: paymentMethod === 'insurance' ? policyNum : undefined,
          amountAllocated: totalPrice,
          status: 'pending_verification',
          notes: paymentMethod === 'cash'
            ? "Cash / Certified Check scheduled in-person at arrangement conference. Official BFH itemized receipt to be issued."
            : paymentMethod === 'insurance'
            ? "Direct assignment via C&J Financial clearinghouse."
            : undefined
        }
      ],
      totalAmountDue: totalPrice,
      totalPaid: 0,
      aftercare: [
        {
          id: 'ac-1',
          milestoneTitle: 'Day 7 Family Wellness Check & Grief Guide',
          triggerDaysPostService: 7,
          targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'scheduled',
          templateName: 'Harlem Grief & Resilience Outreach'
        }
      ],
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Online Intake Portal (Golden Record Hub)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Arrangement inquiry initiated online by ${informantName || 'Next of Kin'}. Selected ${disposition.replace('_', ' ')} with total estimated at $${totalPrice.toLocaleString()}.`
        }
      ]
    };
    
    // Generate statement of goods
    const sog = getDefaultStatementOfGoodsForCase(newCase);
    if (includeRepast) {
      sog.sectionI.F3_repastRoomAmount = BFH_GPL_2026.repastRoomBase;
    }
    if (!includePrograms) {
      sog.sectionI.I10_programsMatrix.quantity = 0;
      sog.sectionI.I10_programsMatrix.totalAmount = 0;
    }
    if (!includePrayerCards) {
      sog.sectionI.I1_memorialCardsAmount = 0;
    }
    if (!includeClergyOrganist) {
      sog.sectionII.clergyHonorariaAmount = 0;
      sog.sectionII.organistMusicianAmount = 0;
    }
    newCase.statementOfGoods = sog;

    onCaseCreated(newCase);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-neutral-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
          aria-label="Close Arranger"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="mb-6 pb-4 border-b border-neutral-200">
          <div className="flex items-center space-x-2 text-xs text-[#065f46] font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-[#065f46]" />
            <span>Self-Guided Digital Arranger • Step {step} of 4</span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-neutral-900 mt-1">
            Begin Funeral Arrangements with Benta’s
          </h2>
          <p className="text-xs text-neutral-600 font-light">
            Enter information once into our Golden Record Engine. We will guide you with complete pricing clarity and zero pressure.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {['Service Type', 'Loved One Info', 'Arranger Info', 'Variables & Review'].map((label, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`h-1.5 rounded-full ${step >= idx + 1 ? 'bg-[#065f46]' : 'bg-neutral-200'}`} />
              <p className={`text-[10px] font-bold ${step >= idx + 1 ? 'text-[#065f46]' : 'text-neutral-400'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Step 1: Select Service Option */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              Select Desired Service Category:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'cremation_memorial',
                  title: 'Cremation and Memorial Service',
                  price: '$3,195',
                  desc: 'Direct cremation followed by chapel memorial celebration with urn present, guestbook, and staff supervision.'
                },
                {
                  id: 'full_cremation',
                  title: 'Funeral Service with Cremation',
                  price: '$4,850',
                  desc: 'Full visitation & funeral ceremony in Chapel with ceremonial rental casket, followed by cremation at Woodlawn.'
                },
                {
                  id: 'direct_cremation',
                  title: 'Direct Cremation',
                  price: '$1,995',
                  desc: 'Simple, direct transfer and cremation with return of remains to family.'
                },
                {
                  id: 'full_burial',
                  title: 'Traditional Service and Burial',
                  price: '$5,950',
                  desc: 'Full church or chapel ceremony, hearse cortege, family limousine escort, and committal at cemetery.'
                },
                {
                  id: 'direct_burial',
                  title: 'Direct Earth Burial',
                  price: '$2,750',
                  desc: 'Direct transfer and burial at cemetery without formal chapel ceremonies.'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDisposition(item.id as DispositionType)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    disposition === item.id
                      ? 'bg-emerald-50/80 border-[#065f46] ring-2 ring-[#065f46]/20 shadow-sm'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-serif-title font-bold text-sm text-neutral-900">{item.title}</h4>
                    <span className="text-[#065f46] font-bold text-xs">{item.price}</span>
                  </div>
                  <p className="text-xs text-neutral-500 font-light">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-neutral-800 mb-2">
                Viewing / Gathering Location Preference:
              </label>
              <select
                value={viewingChoice}
                onChange={(e) => setViewingChoice(e.target.value as any)}
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-3 text-xs text-neutral-900 focus:border-[#065f46] outline-none shadow-sm"
              >
                <option value="Parlor A (Seats 120)">Parlor A (Saint Nicholas Main Chapel - Seats 120)</option>
                <option value="Parlor B (Seats 110)">Parlor B (Harlem Memorial Chapel - Seats 110)</option>
                <option value="Church / External Venue">Church / External Sanctuary (e.g. Abyssinian Baptist)</option>
                <option value="Direct / No Viewing">Direct Service (No Formal Viewing)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Loved One (Decedent) Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              Information for the Golden Record:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">Full Legal Name of Loved One *</label>
                <input
                  type="text"
                  required
                  value={decedentName}
                  onChange={(e) => {
                    setValidationError(null);
                    setDecedentName(e.target.value);
                  }}
                  placeholder="e.g. Arthur Robinson"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={decedentDob}
                  onChange={(e) => {
                    setValidationError(null);
                    setDecedentDob(e.target.value);
                  }}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">Date of Passing (Date of Death) *</label>
                <input
                  type="date"
                  required
                  value={decedentDod}
                  onChange={(e) => {
                    setValidationError(null);
                    setDecedentDod(e.target.value);
                  }}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">Place of Death / Hospital Facility *</label>
                <input
                  type="text"
                  required
                  value={placeOfDeath}
                  onChange={(e) => {
                    setValidationError(null);
                    setPlaceOfDeath(e.target.value);
                  }}
                  placeholder="e.g. Mount Sinai Morningside or Harlem Hospital"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-600 font-medium mb-1">Last Residence Address in NYC</label>
              <input
                type="text"
                value={residence}
                onChange={(e) => {
                  setValidationError(null);
                  setResidence(e.target.value);
                }}
                placeholder="e.g. 240 W 138th St, New York, NY 10030"
                className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="veteranCheck"
                checked={isVeteran}
                onChange={(e) => setIsVeteran(e.target.checked)}
                className="rounded text-[#065f46] focus:ring-[#065f46]"
              />
              <label htmlFor="veteranCheck" className="text-xs text-neutral-700 cursor-pointer font-medium">
                Honorably Served in the U.S. Armed Forces (Eligible for Flag & Honors)
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Primary Arranger Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              Primary Arranger / Next of Kin Contact:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={informantName}
                  onChange={(e) => {
                    setValidationError(null);
                    setInformantName(e.target.value);
                  }}
                  placeholder="e.g. Eleanor Vance-Holloway"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">Relationship to Loved One</label>
                <select
                  value={informantRelation}
                  onChange={(e) => setInformantRelation(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                >
                  <option value="Spouse">Spouse / Domestic Partner</option>
                  <option value="Child / Son / Daughter">Child (Son / Daughter)</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling (Brother / Sister)</option>
                  <option value="Executor / Legal Rep">Executor / Legal Representative</option>
                  <option value="Friend / Other">Friend / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">
                  Mobile Phone (Numbers Only) *
                </label>
                <input
                  type="tel"
                  required
                  value={informantPhone}
                  onChange={(e) => {
                    setValidationError(null);
                    setInformantPhone(formatPhoneNumbersOnly(e.target.value));
                  }}
                  placeholder="(212) 555-0198"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 font-medium mb-1">
                  Email Address (Email Format Required) *
                </label>
                <input
                  type="email"
                  required
                  value={informantEmail}
                  onChange={(e) => {
                    setValidationError(null);
                    setInformantEmail(e.target.value);
                  }}
                  placeholder="eleanor.vance@gmail.com"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#065f46] outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#065f46]">
              <span className="font-bold">Privacy Promise:</span> We never sell your contact information. This creates your private, secure Golden Record so you can review details without re-entering them.
            </div>
          </div>
        )}

        {/* Step 4: Review & Variables Selection */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              Customize Service Variables & Review Estimate:
            </h3>

            {/* Variables Add-On Selectors */}
            <div className="bg-[#fcfbfa] p-4 rounded-2xl border border-neutral-200 space-y-3 text-xs">
              <span className="font-bold text-neutral-900 block border-b border-neutral-200 pb-2">
                Select Add-On Service Variables:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Programs */}
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border bg-white cursor-pointer hover:border-[#065f46] transition">
                  <input
                    type="checkbox"
                    checked={includePrograms}
                    onChange={(e) => setIncludePrograms(e.target.checked)}
                    className="rounded text-[#065f46]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#065f46]" />
                      <span>Custom Memorial Programs</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">4-Panel large bifold suite (+ $325)</div>
                  </div>
                </label>

                {/* Prayer Cards */}
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border bg-white cursor-pointer hover:border-[#065f46] transition">
                  <input
                    type="checkbox"
                    checked={includePrayerCards}
                    onChange={(e) => setIncludePrayerCards(e.target.checked)}
                    className="rounded text-[#065f46]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#065f46]" />
                      <span>Photo Prayer Cards (50 pk)</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">Laminated with portrait (+ $200)</div>
                  </div>
                </label>

                {/* Clergy & Organist */}
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border bg-white cursor-pointer hover:border-[#065f46] transition">
                  <input
                    type="checkbox"
                    checked={includeClergyOrganist}
                    onChange={(e) => setIncludeClergyOrganist(e.target.checked)}
                    className="rounded text-[#065f46]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Clergy Honorarium & Organist</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">Officiant + pipe organist (+ $650)</div>
                  </div>
                </label>

                {/* Limousine */}
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border bg-white cursor-pointer hover:border-[#065f46] transition">
                  <input
                    type="checkbox"
                    checked={includeLimousine}
                    onChange={(e) => setIncludeLimousine(e.target.checked)}
                    className="rounded text-[#065f46]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-blue-700" />
                      <span>7-Passenger Cadillac Limousine</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">Family motorcade escort (+ $715)</div>
                  </div>
                </label>

                {/* Repast Room */}
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border bg-white cursor-pointer hover:border-[#065f46] transition sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={includeRepast}
                    onChange={(e) => setIncludeRepast(e.target.checked)}
                    className="rounded text-[#065f46]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                      <span>BFH 2nd-Floor Repast Room (Repass Fellowship)</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">Private reception room reservation, tables, seating & setup (+ $1,400)</div>
                  </div>
                </label>

              </div>
            </div>

            {/* Itemized Calculation Summary */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-700">
                <span>Selected Service Package:</span>
                <span className="font-bold text-neutral-900">${currentBasePrice.toLocaleString()}</span>
              </div>
              {variablesTotal > 0 && (
                <div className="flex justify-between text-neutral-700">
                  <span>Selected Variables (Printing, Music, Limousine, Repast):</span>
                  <span className="font-semibold text-neutral-900">+ ${variablesTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-700">
                <span>Venue & Facility Allocation:</span>
                <span className="text-neutral-900 font-medium">{viewingChoice}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-[#065f46]">
                <span>Estimated Total (FTC Itemized):</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-800">
                Select Preferred Payment / Financing Method:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs transition ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-50 border-[#065f46] ring-2 ring-[#065f46]/20 font-bold text-[#065f46]'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-bold">Cash / Bank Check</p>
                  <p className="text-[11px] text-neutral-500 mt-1 font-light">In-person at office with receipt</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('insurance')}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs transition ${
                    paymentMethod === 'insurance'
                      ? 'bg-emerald-50 border-[#065f46] ring-2 ring-[#065f46]/20 font-bold text-[#065f46]'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-bold">Life Insurance Claim</p>
                  <p className="text-[11px] text-neutral-500 mt-1 font-light">Direct assignment (C&J Financial)</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('ach')}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs transition ${
                    paymentMethod === 'ach'
                      ? 'bg-emerald-50 border-[#065f46] ring-2 ring-[#065f46]/20 font-bold text-[#065f46]'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-bold">ACH Direct Transfer</p>
                  <p className="text-[11px] text-neutral-500 mt-1 font-light">Zero-fee bank transfer</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs transition ${
                    paymentMethod === 'credit'
                      ? 'bg-emerald-50 border-[#065f46] ring-2 ring-[#065f46]/20 font-bold text-[#065f46]'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-bold">Credit / Split Pay</p>
                  <p className="text-[11px] text-neutral-500 mt-1 font-light">Split across family</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Error Alert Banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-xs text-red-800 font-medium flex items-center space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-neutral-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setValidationError(null);
                setStep(step - 1);
              }}
              className="flex items-center space-x-1 text-xs text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-lg font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center space-x-1.5 bg-[#065f46] hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-md shadow-emerald-950/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#065f46] to-emerald-700 hover:from-[#064e3b] hover:to-[#065f46] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg shadow-emerald-950/20 transition border border-amber-300/40"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Submit & Open Golden Record Hub</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
