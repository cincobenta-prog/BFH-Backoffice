import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Phone, 
  UserCheck, 
  Building, 
  Heart, 
  Award, 
  Globe, 
  MapPin, 
  Clock,
  Eye,
  Layers,
  Search
} from 'lucide-react';
import { DispositionType, GoldenRecordCase, FullVitalRecordInformationSheet, FloralArrangementItem } from '../../lib/types/funeral';
import { INITIAL_DOCUMENT_TEMPLATES } from '../../lib/data/mockCases';
import { getDefaultStatementOfGoodsForCase, calculateAP47Totals } from '../../lib/data/generalPriceList';
import { 
  BFH_FLORAL_CATALOG, 
  DANIELAS_ORIGINAL_CATALOG,
  OTHER_FLORAL_CATALOG,
  DANIELAS_CATEGORIES,
  OTHER_FLORAL_CATEGORIES,
  FloralBookType,
  getFloralByCode, 
  FloralSize 
} from '../../lib/data/floralCatalog';

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
  const [vitalPageTab, setVitalPageTab] = useState<'page1' | 'page2'>('page1');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdCaseNumber, setCreatedCaseNumber] = useState<string>('');
  
  // ==========================================
  // PAGE 1: VITAL RECORD INFORMATION (CLEAN STATE)
  // ==========================================
  const [decedentFirstName, setDecedentFirstName] = useState('');
  const [decedentMiddleName, setDecedentMiddleName] = useState('');
  const [decedentLastName, setDecedentLastName] = useState('');
  const [otherKnownNames, setOtherKnownNames] = useState('');

  const [residenceStreet, setResidenceStreet] = useState('');
  const [residenceApt, setResidenceApt] = useState('');
  const [residenceCity, setResidenceCity] = useState('');
  const [residenceState, setResidenceState] = useState('NY');
  const [residenceZip, setResidenceZip] = useState('');

  const [dateOfDeath, setDateOfDeath] = useState('');
  const [sex, setSex] = useState<'female' | 'male'>('female');
  const [educationLevel, setEducationLevel] = useState('');
  const [ssn, setSsn] = useState('');

  const [placeOfDeathFacility, setPlaceOfDeathFacility] = useState('');
  const [placeOfDeathCity, setPlaceOfDeathCity] = useState('');
  const [placeOfDeathStateCountry, setPlaceOfDeathStateCountry] = useState('NY, USA');
  const [floorOrRoom, setFloorOrRoom] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<'married' | 'separated' | 'never_married' | 'widowed' | 'divorced'>('never_married');
  const [race, setRace] = useState('');

  // Occupation & Industry (Specifically requested)
  const [occupationTitle, setOccupationTitle] = useState('');
  const [typeOfBusiness, setTypeOfBusiness] = useState('');

  // Military Status
  const [militaryBranch, setMilitaryBranch] = useState('');
  const [isVeteran, setIsVeteran] = useState(false);
  const [isActiveDuty, setIsActiveDuty] = useState(false);

  // Parents & Spouse
  const [fatherName, setFatherName] = useState('');
  const [motherFirstAndMaidenName, setMotherFirstAndMaidenName] = useState('');
  const [spouseFirstAndMaidenName, setSpouseFirstAndMaidenName] = useState('');
  const [spouseDateOfBirth, setSpouseDateOfBirth] = useState('');

  // Informant / Next of Kin
  const [informantName, setInformantName] = useState('');
  const [informantRelationship, setInformantRelationship] = useState('');
  const [informantPhoneHome, setInformantPhoneHome] = useState('');
  const [informantPhoneCell, setInformantPhoneCell] = useState('');
  const [informantPhoneAlt, setInformantPhoneAlt] = useState('');
  const [informantEmail, setInformantEmail] = useState('');
  const [informantAddressStreet, setInformantAddressStreet] = useState('');
  const [informantAddressApt, setInformantAddressApt] = useState('');
  const [informantAddressCityStateCountry, setInformantAddressCityStateCountry] = useState('');
  const [informantAddressZip, setInformantAddressZip] = useState('');

  // Cemetery Deed & Previous Interments
  const [deedOwnerName, setDeedOwnerName] = useState('');
  const [deedOwnerAddress, setDeedOwnerAddress] = useState('');
  const [previousIntermentWho, setPreviousIntermentWho] = useState('');
  const [previousIntermentWhen, setPreviousIntermentWhen] = useState('');
  const [previousIntermentRelation, setPreviousIntermentRelation] = useState('');

  // Verification Jurat
  const [reviewedOrProvidedBy, setReviewedOrProvidedBy] = useState('');
  const [verifiedOnDate, setVerifiedOnDate] = useState(new Date().toISOString().split('T')[0]);

  // ==========================================
  // PAGE 2: AUTHORIZATIONS & DIRECTOR LOGISTICS & STORY
  // ==========================================
  const [authPostObituaryWebsite, setAuthPostObituaryWebsite] = useState(true);
  const [authLiveStreamService, setAuthLiveStreamService] = useState(true);
  const [authLiveStreamType, setAuthLiveStreamType] = useState<'public' | 'private'>('public');

  // Director Logistics
  const [directorViewingDate, setDirectorViewingDate] = useState('');
  const [directorViewingTime, setDirectorViewingTime] = useState('');
  const [directorViewingPlace, setDirectorViewingPlace] = useState('');
  const [directorWakeDate, setDirectorWakeDate] = useState('');
  const [directorWakeHoursFrom, setDirectorWakeHoursFrom] = useState('');
  const [directorWakeHoursTo, setDirectorWakeHoursTo] = useState('');
  const [directorWakeLocation, setDirectorWakeLocation] = useState('');
  const [directorFuneralDate, setDirectorFuneralDate] = useState('');
  const [directorFuneralHour, setDirectorFuneralHour] = useState('');
  const [directorFuneralLocation, setDirectorFuneralLocation] = useState('');
  const [directorFuneralAddress, setDirectorFuneralAddress] = useState('');
  const [directorDispositionDate, setDirectorDispositionDate] = useState('');
  const [directorDispositionDueTime, setDirectorDispositionDueTime] = useState('');
  const [directorDispositionMode, setDirectorDispositionMode] = useState<'burial' | 'cremation' | 'entombment'>('cremation');
  const [directorCemeteryCrematory, setDirectorCemeteryCrematory] = useState('');
  const [directorCemeteryLocation, setDirectorCemeteryLocation] = useState('');
  const [directorSection, setDirectorSection] = useState('');
  const [directorPlot, setDirectorPlot] = useState('');
  const [directorRange, setDirectorRange] = useState('');
  const [directorGraveNum, setDirectorGraveNum] = useState('');
  const [directorLot, setDirectorLot] = useState('');

  // Legacy Story DNA
  const [organizationsAssociations, setOrganizationsAssociations] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [favoriteMusicType, setFavoriteMusicType] = useState('');
  const [interests, setInterests] = useState('');
  const [knownFor, setKnownFor] = useState('');
  const [favoriteQuote, setFavoriteQuote] = useState('');
  const [proudestAccomplishment, setProudestAccomplishment] = useState('');
  const [historicalMilestoneWitnessed, setHistoricalMilestoneWitnessed] = useState('');

  // ==========================================
  // STEP 2: SERVICE PREFERENCE & APPOINTMENT
  // ==========================================
  const [disposition, setDisposition] = useState<DispositionType>(
    (initialService === 'full_cremation' || initialService === 'cremation_memorial' || initialService === 'direct_cremation' || initialService === 'full_burial' || initialService === 'direct_burial')
      ? (initialService as DispositionType)
      : 'cremation_memorial'
  );
  const [appointmentFormat, setAppointmentFormat] = useState<'in_person_office' | 'virtual_video'>('in_person_office');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState('10:00 AM');
  const [familyNotes, setFamilyNotes] = useState('');

  // ==========================================
  // FLORAL TRIBUTE SELECTION (OPTIONAL)
  // ==========================================
  const [includeFlowers, setIncludeFlowers] = useState<boolean>(true);
  const [selectedFloralBook, setSelectedFloralBook] = useState<FloralBookType>('danielas_original');
  const [selectedFloralCat, setSelectedFloralCat] = useState<string>('all');
  const [selectedFloralCode, setSelectedFloralCode] = useState<string>('BFH-CC-001');
  const [selectedFloralSize, setSelectedFloralSize] = useState<FloralSize>('medium');
  const [floralRibbonText, setFloralRibbonText] = useState<string>('Loving Family');
  const [floralQuantity, setFloralQuantity] = useState<number>(1);
  const [showFloralPhotoGallery, setShowFloralPhotoGallery] = useState<boolean>(false);
  const [floralSearchTerm, setFloralSearchTerm] = useState<string>('');

  // Auto calculate age when DOB and DOD change
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setDateOfBirth(dob);
    if (dob && dateOfDeath) {
      const bYear = new Date(dob).getFullYear();
      const dYear = new Date(dateOfDeath).getFullYear();
      if (!isNaN(bYear) && !isNaN(dYear) && dYear >= bYear) {
        setAge(String(dYear - bYear));
      }
    }
  };

  const handleDodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dod = e.target.value;
    setDateOfDeath(dod);
    if (dateOfBirth && dod) {
      const bYear = new Date(dateOfBirth).getFullYear();
      const dYear = new Date(dod).getFullYear();
      if (!isNaN(bYear) && !isNaN(dYear) && dYear >= bYear) {
        setAge(String(dYear - bYear));
      }
    }
  };

  // Pricing Calculation
  const basePrices: Record<DispositionType, number> = {
    direct_cremation: 2084,
    cremation_memorial: 3184,
    full_cremation: 4800,
    direct_burial: 2084,
    full_burial: 5800,
    pre_need: 3500,
    undecided: 0
  };

  const currentBasePrice = basePrices[disposition] ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCaseId = `case-${Date.now()}`;
    const newCaseNumber = `BFH-2026-09${Math.floor(Math.random() * 90 + 10)}`;
    setCreatedCaseNumber(newCaseNumber);

    const constructedLegalName = [decedentFirstName, decedentMiddleName, decedentLastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    const fullVitalSheet: FullVitalRecordInformationSheet = {
      // Page 1
      decedentFirstName,
      decedentMiddleName,
      decedentLastName,
      otherKnownNames,
      residenceStreet,
      residenceApt,
      residenceCity,
      residenceState,
      residenceZip,
      dateOfDeath,
      sex,
      educationLevel,
      placeOfDeathFacilityOrLocation: placeOfDeathFacility,
      placeOfDeathCity,
      placeOfDeathStateOrCountry: placeOfDeathStateCountry,
      dateOfBirth,
      age: age ? Number(age) || age : '',
      birthPlaceCityStateCountry: birthPlace,
      maritalStatus,
      ssn,
      race,
      occupationTitle,
      typeOfBusiness,
      militaryBranch,
      militaryStatus: isVeteran ? 'veteran' : (isActiveDuty ? 'active' : 'none'),
      fatherName,
      motherFirstAndMaidenName,
      spouseFirstAndMaidenName,
      spouseDateOfBirth,

      informantName,
      informantRelationship,
      informantPhoneHome,
      informantPhoneCell,
      informantPhoneAlt,
      informantEmail,
      informantAddressStreet,
      informantAddressApt,
      informantAddressCityStateCountry,
      informantAddressZip,

      deedOwnerName,
      deedOwnerAddress,
      previousIntermentWho,
      previousIntermentWhen,
      previousIntermentRelation,

      reviewedOrProvidedBy: reviewedOrProvidedBy || informantName,
      verifiedOnDate: verifiedOnDate || new Date().toISOString().split('T')[0],

      // Page 2
      authPostObituaryWebsite,
      authLiveStreamService,
      authLiveStreamType,

      directorViewingDate,
      directorViewingTime,
      directorViewingPlace,
      directorWakeDate,
      directorWakeHoursFrom,
      directorWakeHoursTo,
      directorWakeLocation,
      directorFuneralDate,
      directorFuneralHour,
      directorFuneralLocation,
      directorFuneralAddress,
      directorDispositionDate,
      directorDispositionDueTime,
      directorDispositionMode,
      directorCemeteryCrematory,
      directorCemeteryLocation,
      directorSection,
      directorPlot,
      directorRange,
      directorGraveNum,
      directorLot,

      organizationsAssociations,
      favoriteColor,
      favoriteMusicType,
      interests,
      knownFor,
      favoriteQuote,
      proudestAccomplishment,
      historicalMilestoneWitnessed
    };

    const primaryPhone = informantPhoneCell || informantPhoneHome || informantPhoneAlt || '';
    const fullResidence = [residenceStreet, residenceApt, residenceCity, residenceState, residenceZip]
      .filter(Boolean)
      .join(', ');

    const newCase: GoldenRecordCase = {
      id: newCaseId,
      caseNumber: newCaseNumber,
      createdAt: new Date().toISOString(),
      currentPhase: 'intake_removal',
      dispositionType: disposition,
      safeArrivalStatus: 'pending_removal',
      assignedDirector: 'Jason Benta (Licensed Funeral Director in Charge)',
      vitalRecordsSheet: fullVitalSheet,
      decedent: {
        legalName: constructedLegalName,
        gender: sex,
        dateOfBirth: dateOfBirth,
        dateOfDeath: dateOfDeath || new Date().toISOString().split('T')[0],
        placeOfDeath: placeOfDeathFacility,
        ssn: ssn,
        ssnMasked: ssn,
        maritalStatus: maritalStatus === 'never_married' ? 'single' : (maritalStatus === 'separated' ? 'married' : maritalStatus),
        residenceAddress: fullResidence,
        city: residenceCity || 'New York',
        state: residenceState || 'NY',
        zipCode: residenceZip || '10030',
        veteran: isVeteran,
        branchOfService: militaryBranch,
        occupation: occupationTitle,
        industry: typeOfBusiness,
        fatherName: fatherName,
        motherMaidenName: motherFirstAndMaidenName,
        facilityName: placeOfDeathFacility
      },
      informant: {
        fullName: informantName,
        relationship: informantRelationship,
        phone: primaryPhone,
        email: informantEmail,
        address: [informantAddressStreet, informantAddressApt, informantAddressCityStateCountry, informantAddressZip].filter(Boolean).join(', ') || fullResidence,
        isNextOfKin: true,
        hasRightToControl: true
      },
      medicalCertifier: {
        physicianName: 'Attending Physician, MD',
        licenseNumber: 'NY-MED-REGISTERED',
        hospitalFacility: placeOfDeathFacility,
        phone: '(212) 523-4000',
        edrsStatus: 'pending'
      },
      // Automatically port appointment details to Arrangement Schedule Queue
      arrangementAppointment: {
        id: `appt-${Date.now()}`,
        caseId: newCaseId,
        caseNumber: newCaseNumber,
        decedentName: constructedLegalName,
        informantName: informantName,
        informantPhone: primaryPhone,
        informantEmail: informantEmail,
        status: 'proposed_options_sent',
        assignedDirectorName: 'Jason Benta, LFD #08850',
        assignedDirectorPhone: '(212) 281-8850',
        meetingFormat: appointmentFormat,
        locationVenue: appointmentFormat === 'in_person_office' 
          ? "Benta's Arrangement Suite A (630 Saint Nicholas Ave)"
          : "Secure BFH Virtual Video Conference",
        proposedSlots: [
          {
            id: `slot-req-${Date.now()}`,
            date: appointmentDate,
            dateLabel: `Requested: ${appointmentDate}`,
            time: appointmentTimeSlot,
            durationMinutes: 90,
            isAvailable: true,
            selectedByFamily: true
          }
        ],
        attendingFamilyCount: 2,
        invitationChannel: 'both',
        invitationSentAt: new Date().toISOString(),
        smsConfirmationSent: true,
        emailConfirmationSent: true,
        specialAccommodationsNotes: familyNotes
      },
      // Automatically port vital records to Removal Queue
      removalSchedule: {
        id: `rem-${Date.now()}`,
        caseId: newCaseId,
        status: 'pending_dispatch',
        locationType: 'hospital_morgue',
        facilityName: placeOfDeathFacility,
        facilityAddress: placeOfDeathFacility,
        facilityFloorRoom: floorOrRoom,
        facilityContactPhone: '(212) 281-8850',
        morgueAttendantOrNurse: 'Custody Attendant / Administrator',
        urgency: 'stat_immediate',
        targetCallTime: 'Within 45 Mins',
        estimatedArrivalMinutes: 30,
        assignedDirector: 'Jason Benta, LFD',
        directorLicenseNumber: 'NYS LFD #08850',
        directorPhone: '(212) 281-8850',
        secondaryCrewMember: 'Mortuary Transport Crew',
        vehicleType: 'First Call Custom Van (BFH-1)',
        vehiclePlate: 'BFH-CUSTODY-1',
        specialEquipment: [
          'Mortuary Cot & Transfer Pouch',
          'Tamper-Evident Personal Effects Bag',
          'NYS PHL § 4201 Release Verification'
        ],
        specialInstructions: `Release authorized by ${informantName} (${informantRelationship}). Ported from Vital Records Intake.`,
        directorSmsDispatched: true,
        facilitySmsDispatched: false,
        familySmsDispatched: true
      },
      serviceSelections: {
        dispositionType: disposition,
        packageTitle: disposition === 'undecided'
          ? 'To Be Finalized with Licensed Funeral Director'
          : disposition === 'full_cremation' 
          ? 'Funeral Service with Cremation'
          : disposition === 'cremation_memorial'
          ? 'Cremation and Memorial Service'
          : disposition === 'full_burial'
          ? 'Traditional Service and Burial'
          : disposition === 'direct_cremation'
          ? 'Direct Cremation'
          : 'Direct Earth Burial',
        basePackagePrice: currentBasePrice,
        casketOrUrnSelected: disposition === 'undecided' ? 'To Be Selected During Consultation' : disposition.includes('cremation') ? 'Handcrafted Solid Bronze Urn' : 'The St. Nicholas Heritage Casket',
        casketPrice: 0,
        viewingParlor: 'Chapel 1 (Main Sanctuary - Seats 150)',
        crematoryOrCemeteryName: disposition.includes('cremation') 
          ? 'Woodlawn Crematory (Bronx, NY)'
          : 'Woodlawn Cemetery (Bronx, NY)'
      },
      documents: INITIAL_DOCUMENT_TEMPLATES,
      splitBilling: [
        {
          payerType: 'Cash / Certified Bank Check',
          providerName: "In-Person Arrangement Conference (Benta's 630 St. Nicholas Ave)",
          amountAllocated: currentBasePrice,
          status: 'pending_verification',
          notes: "Final Statement of Goods to be executed during appointment with Funeral Director."
        }
      ],
      totalAmountDue: currentBasePrice,
      totalPaid: 0,
      aftercare: [
        {
          id: `ac-${Date.now()}`,
          milestoneTitle: 'Day 7 Family Wellness & Keepsake Delivery',
          triggerDaysPostService: 7,
          targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'scheduled',
          templateName: 'Harlem Grief & Resilience Outreach'
        }
      ],
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Pre-Arrangement Vital Records Intake',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Vital Records completed by ${informantName} (${informantRelationship}). Information ported to Removal Queue & Arrangement Schedule Queue for ${appointmentDate} at ${appointmentTimeSlot}.`
        }
      ]
    };
    
    // Generate base statement of goods for review during conference
    let initialSog = getDefaultStatementOfGoodsForCase(newCase);

    if (includeFlowers) {
      const product = getFloralByCode(selectedFloralCode) || BFH_FLORAL_CATALOG[0];
      const unitPrice = product.pricing[selectedFloralSize] ?? product.pricing.medium;
      const sizeLabel = selectedFloralSize === 'small' 
        ? 'Small (36" Half Casket)' 
        : selectedFloralSize === 'medium' 
        ? 'Medium (48" Full Casket)' 
        : 'Large (60" Grand Full Casket)';

      const floralItem: FloralArrangementItem = {
        id: `fl-${Date.now()}`,
        type: product.category as any,
        code: product.code,
        description: `${product.name} (${product.categoryLabel}) — ${sizeLabel}`,
        size: selectedFloralSize,
        dimensions: product.dimensions[selectedFloralSize],
        ribbonText: floralRibbonText.trim(),
        quantity: Math.max(1, floralQuantity),
        unitPrice: unitPrice,
        totalAmount: unitPrice * Math.max(1, floralQuantity),
        imageUrl: product.imageUrl,
        floristPartner: product.floristPartner || "Benta's Master Florist Studio"
      };

      initialSog.sectionI.I6_flowerItems = [floralItem];
      initialSog = calculateAP47Totals(initialSog);
      newCase.totalAmountDue = initialSog.sectionIII.totalFuneralCharges;
    }

    newCase.statementOfGoods = initialSog;

    onCaseCreated(newCase);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-none max-w-4xl w-full p-5 sm:p-8 shadow-2xl relative my-6 text-neutral-900 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-neutral-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-none bg-[#a0080e] text-white flex items-center justify-center font-serif-title font-bold text-lg shadow-md">
              B
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-title font-bold text-lg sm:text-xl text-neutral-900">
                  New Case Intake & Vital Records Sheet
                </h3>
                <span className="text-[10px] bg-benta-100 text-[#a0080e] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-benta-200">
                  Official 2-Page Form
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                Benta's Funeral Home, Inc. • 630 St. Nicholas Ave, Harlem, NY 10030
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-none hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-4 my-auto">
            <div className="w-16 h-16 bg-benta-100 text-benta-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-benta-700">
                VITAL RECORDS CAPTURED & CASE CREATED
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-neutral-900">
                Case #{createdCaseNumber} Initialized
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto pt-1">
                Vital statistics and arrangement preferences have been saved with full 2-page document fidelity into the BFH Golden Record.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="bg-[#a0080e] hover:bg-benta-800 text-white font-bold text-xs px-8 py-3 rounded-none shadow-md transition cursor-pointer"
              >
                Done • View Active Case
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 text-xs">
            
            {/* Primary Step Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-none mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`py-2 px-3 rounded-none font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  step === 1 ? 'bg-white text-[#a0080e] shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Vital Records Information Sheet (2-Page Original)</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`py-2 px-3 rounded-none font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  step === 2 ? 'bg-white text-[#a0080e] shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>2. Service Preference & Appointment</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-5">
              
              {/* ======================================================== */}
              {/* STEP 1: VITAL RECORDS INFORMATION SHEET                  */}
              {/* ======================================================== */}
              {step === 1 && (
                <div className="space-y-4">
                  
                  {/* Sub-Tabs: Page 1 vs Page 2 of the Uploaded Sheet */}
                  <div className="flex items-center justify-between bg-brass-50/80 border border-brass-200/80 px-4 py-2.5 rounded-none">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#8C6B2D]" />
                      <span className="font-bold text-neutral-800 text-xs">
                        Official Benta Document Section:
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVitalPageTab('page1')}
                        className={`px-3 py-1.5 rounded-none font-bold text-xs transition cursor-pointer ${
                          vitalPageTab === 'page1'
                            ? 'bg-[#a0080e] text-white shadow-xs'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        Page 1: Vital Record Information
                      </button>
                      <button
                        type="button"
                        onClick={() => setVitalPageTab('page2')}
                        className={`px-3 py-1.5 rounded-none font-bold text-xs transition cursor-pointer ${
                          vitalPageTab === 'page2'
                            ? 'bg-[#a0080e] text-white shadow-xs'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        Page 2: Authorizations, Director Log & Story
                      </button>
                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* PAGE 1 CONTENT                                      */}
                  {/* -------------------------------------------------- */}
                  {vitalPageTab === 'page1' && (
                    <div className="space-y-4">
                      
                      {/* Section 1: Name of Decedent & Aliases */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <UserCheck className="w-4 h-4 text-[#a0080e]" />
                          <span>1. Name of Decedent & Aliases</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">First Name *</label>
                            <input
                              type="text"
                              required
                              value={decedentFirstName}
                              onChange={(e) => setDecedentFirstName(e.target.value)}
                              placeholder="e.g. Eleanor"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Middle Name</label>
                            <input
                              type="text"
                              value={decedentMiddleName}
                              onChange={(e) => setDecedentMiddleName(e.target.value)}
                              placeholder="e.g. Marie"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Last Name *</label>
                            <input
                              type="text"
                              required
                              value={decedentLastName}
                              onChange={(e) => setDecedentLastName(e.target.value)}
                              placeholder="e.g. Vance"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">Any Other Known Names of Deceased (Aliases / Maiden / Nicknames)</label>
                          <input
                            type="text"
                            value={otherKnownNames}
                            onChange={(e) => setOtherKnownNames(e.target.value)}
                            placeholder="e.g. Eleanor Hayes, 'Ellie'"
                            className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                          />
                        </div>
                      </div>

                      {/* Section 2: Residence of Loved One */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <MapPin className="w-4 h-4 text-[#a0080e]" />
                          <span>2. Residence of Loved One</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-neutral-700 mb-1">Street & Number</label>
                            <input
                              type="text"
                              value={residenceStreet}
                              onChange={(e) => setResidenceStreet(e.target.value)}
                              placeholder="e.g. 630 St. Nicholas Avenue"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Apt # / Other</label>
                            <input
                              type="text"
                              value={residenceApt}
                              onChange={(e) => setResidenceApt(e.target.value)}
                              placeholder="e.g. Apt 4B"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">City</label>
                            <input
                              type="text"
                              value={residenceCity}
                              onChange={(e) => setResidenceCity(e.target.value)}
                              placeholder="e.g. New York"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">State</label>
                            <input
                              type="text"
                              value={residenceState}
                              onChange={(e) => setResidenceState(e.target.value)}
                              placeholder="NY"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Zip Code</label>
                            <input
                              type="text"
                              value={residenceZip}
                              onChange={(e) => setResidenceZip(e.target.value)}
                              placeholder="10030"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Vitals, Demographics, Place of Death */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Building className="w-4 h-4 text-[#a0080e]" />
                          <span>3. Vital Statistics, Place of Death & Demographics</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Date of Death</label>
                            <input
                              type="date"
                              value={dateOfDeath}
                              onChange={handleDodChange}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Sex</label>
                            <select
                              value={sex}
                              onChange={(e) => setSex(e.target.value as any)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            >
                              <option value="female">Female</option>
                              <option value="male">Male</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-neutral-700 mb-1">Education Level</label>
                            <input
                              type="text"
                              value={educationLevel}
                              onChange={(e) => setEducationLevel(e.target.value)}
                              placeholder="e.g. Master's Degree / Bachelor's / High School"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-neutral-700 mb-1">Place of Death (Name of Facility or Location)</label>
                            <input
                              type="text"
                              value={placeOfDeathFacility}
                              onChange={(e) => setPlaceOfDeathFacility(e.target.value)}
                              placeholder="e.g. Mount Sinai Morningside Hospital (or Private Residence)"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Floor / Room / Bay</label>
                            <input
                              type="text"
                              value={floorOrRoom}
                              onChange={(e) => setFloorOrRoom(e.target.value)}
                              placeholder="e.g. Room 412 / Morgue"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Place of Death: City</label>
                            <input
                              type="text"
                              value={placeOfDeathCity}
                              onChange={(e) => setPlaceOfDeathCity(e.target.value)}
                              placeholder="e.g. New York"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Place of Death: State or Foreign Country</label>
                            <input
                              type="text"
                              value={placeOfDeathStateCountry}
                              onChange={(e) => setPlaceOfDeathStateCountry(e.target.value)}
                              placeholder="NY, USA"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Date of Birth</label>
                            <input
                              type="date"
                              value={dateOfBirth}
                              onChange={handleDobChange}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Age</label>
                            <input
                              type="text"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              placeholder="e.g. 72"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-neutral-700 mb-1">Birth Place (City, State or Country)</label>
                            <input
                              type="text"
                              value={birthPlace}
                              onChange={(e) => setBirthPlace(e.target.value)}
                              placeholder="e.g. Harlem, New York, USA"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Marital Status</label>
                            <select
                              value={maritalStatus}
                              onChange={(e) => setMaritalStatus(e.target.value as any)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            >
                              <option value="never_married">Never Married</option>
                              <option value="married">Married</option>
                              <option value="widowed">Widow / Widower</option>
                              <option value="separated">Separated</option>
                              <option value="divorced">Divorced</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">
                              Social Security Number <span className="text-[10px] text-[#a0080e] font-mono">(9 Digits for Death Cert)</span>
                            </label>
                            <input
                              type="text"
                              maxLength={11}
                              value={ssn}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
                                if (raw.length <= 3) {
                                  setSsn(raw);
                                } else if (raw.length <= 5) {
                                  setSsn(`${raw.slice(0, 3)}-${raw.slice(3)}`);
                                } else {
                                  setSsn(`${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5)}`);
                                }
                              }}
                              placeholder="e.g. 123-45-6789"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-mono font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Race / Ethnicity</label>
                            <input
                              type="text"
                              value={race}
                              onChange={(e) => setRace(e.target.value)}
                              placeholder="e.g. Black / African American"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Occupation, Industry & Military Status */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Award className="w-4 h-4 text-[#a0080e]" />
                          <span>4. Occupation, Business & Military Status</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Occupation Title (Line Item)</label>
                            <input
                              type="text"
                              value={occupationTitle}
                              onChange={(e) => setOccupationTitle(e.target.value)}
                              placeholder="e.g. Educator / Community Advocate"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Type of Business / Industry</label>
                            <input
                              type="text"
                              value={typeOfBusiness}
                              onChange={(e) => setTypeOfBusiness(e.target.value)}
                              placeholder="e.g. Public Education & Higher Learning"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 items-end">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Military Branch (if applicable)</label>
                            <input
                              type="text"
                              value={militaryBranch}
                              onChange={(e) => setMilitaryBranch(e.target.value)}
                              placeholder="e.g. U.S. Navy / Army / Marines"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pb-2">
                            <input
                              type="checkbox"
                              id="isVeteranBox"
                              checked={isVeteran}
                              onChange={(e) => setIsVeteran(e.target.checked)}
                              className="w-4 h-4 text-[#a0080e] rounded focus:ring-0"
                            />
                            <label htmlFor="isVeteranBox" className="font-bold text-neutral-800 cursor-pointer">
                              Honorably Discharged Veteran (3 Free DC Transcripts)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 pb-2">
                            <input
                              type="checkbox"
                              id="isActiveDutyBox"
                              checked={isActiveDuty}
                              onChange={(e) => setIsActiveDuty(e.target.checked)}
                              className="w-4 h-4 text-[#a0080e] rounded focus:ring-0"
                            />
                            <label htmlFor="isActiveDutyBox" className="font-medium text-neutral-700 cursor-pointer">
                              Active Duty Service Member
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Parents & Spouse */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Heart className="w-4 h-4 text-[#a0080e]" />
                          <span>5. Parents & Spouse Information</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Father's Full Name</label>
                            <input
                              type="text"
                              value={fatherName}
                              onChange={(e) => setFatherName(e.target.value)}
                              placeholder="e.g. Arthur Vance Sr."
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Mother's Name (First and Maiden)</label>
                            <input
                              type="text"
                              value={motherFirstAndMaidenName}
                              onChange={(e) => setMotherFirstAndMaidenName(e.target.value)}
                              placeholder="e.g. Mildred Hayes"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Name of Spouse (First and Maiden)</label>
                            <input
                              type="text"
                              value={spouseFirstAndMaidenName}
                              onChange={(e) => setSpouseFirstAndMaidenName(e.target.value)}
                              placeholder="e.g. Robert Vance"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Spouse Date of Birth</label>
                            <input
                              type="date"
                              value={spouseDateOfBirth}
                              onChange={(e) => setSpouseDateOfBirth(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 6: Informant (Legal Next of Kin) */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Phone className="w-4 h-4 text-[#a0080e]" />
                          <span>6. Informant (Legal Next of Kin) Details</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Name of Informant *</label>
                            <input
                              type="text"
                              required
                              value={informantName}
                              onChange={(e) => setInformantName(e.target.value)}
                              placeholder="e.g. Robert Vance"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Relationship to Decedent *</label>
                            <input
                              type="text"
                              required
                              value={informantRelationship}
                              onChange={(e) => setInformantRelationship(e.target.value)}
                              placeholder="e.g. Spouse / Surviving Partner / Child"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Telephone (Home)</label>
                            <input
                              type="tel"
                              value={informantPhoneHome}
                              onChange={(e) => setInformantPhoneHome(e.target.value)}
                              placeholder="(212) 000-0000"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Telephone (Cell) *</label>
                            <input
                              type="tel"
                              required
                              value={informantPhoneCell}
                              onChange={(e) => setInformantPhoneCell(e.target.value)}
                              placeholder="(212) 555-0198"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Telephone (Alternate)</label>
                            <input
                              type="tel"
                              value={informantPhoneAlt}
                              onChange={(e) => setInformantPhoneAlt(e.target.value)}
                              placeholder="(212) 000-0000"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
                            <input
                              type="email"
                              value={informantEmail}
                              onChange={(e) => setInformantEmail(e.target.value)}
                              placeholder="family@example.com"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-neutral-700 mb-1">Informant Address (Street & Number)</label>
                            <input
                              type="text"
                              value={informantAddressStreet}
                              onChange={(e) => setInformantAddressStreet(e.target.value)}
                              placeholder="e.g. 630 St. Nicholas Ave"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Apt #</label>
                            <input
                              type="text"
                              value={informantAddressApt}
                              onChange={(e) => setInformantAddressApt(e.target.value)}
                              placeholder="e.g. Apt 4B"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">City, State or Foreign Country / Zip</label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={informantAddressCityStateCountry}
                                onChange={(e) => setInformantAddressCityStateCountry(e.target.value)}
                                placeholder="New York, NY"
                                className="w-2/3 bg-white border border-neutral-300 rounded-none px-2.5 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                              />
                              <input
                                type="text"
                                value={informantAddressZip}
                                onChange={(e) => setInformantAddressZip(e.target.value)}
                                placeholder="10030"
                                className="w-1/3 bg-white border border-neutral-300 rounded-none px-2 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 7: Cemetery Deed & Previous Interments */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Building className="w-4 h-4 text-[#a0080e]" />
                          <span>7. Cemetery Deed & Previous Interment Information</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Deed Owner</label>
                            <input
                              type="text"
                              value={deedOwnerName}
                              onChange={(e) => setDeedOwnerName(e.target.value)}
                              placeholder="e.g. Eleanor Vance / Family Estate"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Deed Owner Address</label>
                            <input
                              type="text"
                              value={deedOwnerAddress}
                              onChange={(e) => setDeedOwnerAddress(e.target.value)}
                              placeholder="e.g. Same as Residence"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Previous Interment in Grave: Who</label>
                            <input
                              type="text"
                              value={previousIntermentWho}
                              onChange={(e) => setPreviousIntermentWho(e.target.value)}
                              placeholder="e.g. None (New Plot) or Relative Name"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">When</label>
                            <input
                              type="text"
                              value={previousIntermentWhen}
                              onChange={(e) => setPreviousIntermentWhen(e.target.value)}
                              placeholder="e.g. N/A or 1994"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">How Related to Current Decedent</label>
                            <input
                              type="text"
                              value={previousIntermentRelation}
                              onChange={(e) => setPreviousIntermentRelation(e.target.value)}
                              placeholder="e.g. Self / Parent"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 8: Verification Jurat */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">The above vital information was reviewed or provided by:</label>
                            <input
                              type="text"
                              value={reviewedOrProvidedBy}
                              onChange={(e) => setReviewedOrProvidedBy(e.target.value)}
                              placeholder="e.g. Robert Vance (Spouse)"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 font-bold text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">And verified on (Date):</label>
                            <input
                              type="date"
                              value={verifiedOnDate}
                              onChange={(e) => setVerifiedOnDate(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* -------------------------------------------------- */}
                  {/* PAGE 2 CONTENT                                      */}
                  {/* -------------------------------------------------- */}
                  {vitalPageTab === 'page2' && (
                    <div className="space-y-4">
                      
                      {/* Page 2 Section 1: Authorizations */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Globe className="w-4 h-4 text-[#a0080e]" />
                          <span>1. Authorizations & Public Permissions</span>
                        </h4>

                        <div className="space-y-3 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-none border border-neutral-200">
                            <div>
                              <strong className="text-neutral-900 block">1) Authorization to Post Obituary on Website:</strong>
                              <span className="text-[11px] text-neutral-500">Do you authorize Benta's Funeral Home to post the obituary and/or service information on our website?</span>
                            </div>
                            <div className="flex items-center space-x-3 shrink-0">
                              <label className="flex items-center space-x-1 font-bold text-neutral-800 cursor-pointer">
                                <input
                                  type="radio"
                                  name="authObit"
                                  checked={authPostObituaryWebsite === true}
                                  onChange={() => setAuthPostObituaryWebsite(true)}
                                  className="text-[#a0080e] focus:ring-0"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-1 font-bold text-neutral-800 cursor-pointer">
                                <input
                                  type="radio"
                                  name="authObit"
                                  checked={authPostObituaryWebsite === false}
                                  onChange={() => setAuthPostObituaryWebsite(false)}
                                  className="text-[#a0080e] focus:ring-0"
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-none border border-neutral-200">
                            <div>
                              <strong className="text-neutral-900 block">2) Live Streaming Authorization:</strong>
                              <span className="text-[11px] text-neutral-500">Do you wish to have services live streamed via the BFH Broadcast Studio?</span>
                            </div>
                            <div className="flex items-center space-x-3 shrink-0">
                              <label className="flex items-center space-x-1 font-bold text-neutral-800 cursor-pointer">
                                <input
                                  type="radio"
                                  name="authLive"
                                  checked={authLiveStreamService === true}
                                  onChange={() => setAuthLiveStreamService(true)}
                                  className="text-[#a0080e] focus:ring-0"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-1 font-bold text-neutral-800 cursor-pointer">
                                <input
                                  type="radio"
                                  name="authLive"
                                  checked={authLiveStreamService === false}
                                  onChange={() => setAuthLiveStreamService(false)}
                                  className="text-[#a0080e] focus:ring-0"
                                />
                                <span>No</span>
                              </label>

                              {authLiveStreamService && (
                                <select
                                  value={authLiveStreamType}
                                  onChange={(e) => setAuthLiveStreamType(e.target.value as any)}
                                  className="bg-neutral-100 border border-neutral-300 rounded-none px-2 py-1 text-xs text-neutral-800 font-bold"
                                >
                                  <option value="public">Public Stream</option>
                                  <option value="private">Private (PIN Protected)</option>
                                </select>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Page 2 Section 2: To Be Completed by Funeral Director */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                          <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#a0080e]" />
                            <span>2. Section to Be Completed by Funeral Director</span>
                          </h4>
                          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded-none">
                            Director Logistics
                          </span>
                        </div>

                        {/* First Viewing & Wake */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Date of First Viewing</label>
                            <input
                              type="date"
                              value={directorViewingDate}
                              onChange={(e) => setDirectorViewingDate(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Viewing Time</label>
                            <input
                              type="text"
                              value={directorViewingTime}
                              onChange={(e) => setDirectorViewingTime(e.target.value)}
                              placeholder="e.g. 10:00 AM"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Viewing Place</label>
                            <input
                              type="text"
                              value={directorViewingPlace}
                              onChange={(e) => setDirectorViewingPlace(e.target.value)}
                              placeholder="e.g. Chapel 1 (Main Sanctuary)"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Date of Wake</label>
                            <input
                              type="date"
                              value={directorWakeDate}
                              onChange={(e) => setDirectorWakeDate(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Wake Hours: From</label>
                            <input
                              type="text"
                              value={directorWakeHoursFrom}
                              onChange={(e) => setDirectorWakeHoursFrom(e.target.value)}
                              placeholder="04:00 PM"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Wake Hours: To</label>
                            <input
                              type="text"
                              value={directorWakeHoursTo}
                              onChange={(e) => setDirectorWakeHoursTo(e.target.value)}
                              placeholder="08:00 PM"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Wake Location</label>
                            <input
                              type="text"
                              value={directorWakeLocation}
                              onChange={(e) => setDirectorWakeLocation(e.target.value)}
                              placeholder="Chapel 1"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        {/* Funeral & Service Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Date of Funeral</label>
                            <input
                              type="date"
                              value={directorFuneralDate}
                              onChange={(e) => setDirectorFuneralDate(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Funeral Hour</label>
                            <input
                              type="text"
                              value={directorFuneralHour}
                              onChange={(e) => setDirectorFuneralHour(e.target.value)}
                              placeholder="11:00 AM"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Funeral Location</label>
                            <input
                              type="text"
                              value={directorFuneralLocation}
                              onChange={(e) => setDirectorFuneralLocation(e.target.value)}
                              placeholder="Benta's Chapel 1"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Funeral Address</label>
                            <input
                              type="text"
                              value={directorFuneralAddress}
                              onChange={(e) => setDirectorFuneralAddress(e.target.value)}
                              placeholder="630 St. Nicholas Ave"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        {/* Disposition Logistics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Date of Disposition</label>
                            <input
                              type="date"
                              value={directorDispositionDate}
                              onChange={(e) => setDirectorDispositionDate(e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Due Time for Disposition</label>
                            <input
                              type="text"
                              value={directorDispositionDueTime}
                              onChange={(e) => setDirectorDispositionDueTime(e.target.value)}
                              placeholder="01:30 PM"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Mode of Disposition</label>
                            <select
                              value={directorDispositionMode}
                              onChange={(e) => setDirectorDispositionMode(e.target.value as any)}
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            >
                              <option value="cremation">Cremation</option>
                              <option value="burial">Burial</option>
                              <option value="entombment">Entombment</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Cemetery / Crematory</label>
                            <input
                              type="text"
                              value={directorCemeteryCrematory}
                              onChange={(e) => setDirectorCemeteryCrematory(e.target.value)}
                              placeholder="e.g. Woodlawn Crematory / Cemetery"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Location (City, State or Country)</label>
                            <input
                              type="text"
                              value={directorCemeteryLocation}
                              onChange={(e) => setDirectorCemeteryLocation(e.target.value)}
                              placeholder="e.g. Bronx, NY"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Section</label>
                            <input
                              type="text"
                              value={directorSection}
                              onChange={(e) => setDirectorSection(e.target.value)}
                              placeholder="Section"
                              className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1.5 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Plot</label>
                            <input
                              type="text"
                              value={directorPlot}
                              onChange={(e) => setDirectorPlot(e.target.value)}
                              placeholder="Plot"
                              className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1.5 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Range</label>
                            <input
                              type="text"
                              value={directorRange}
                              onChange={(e) => setDirectorRange(e.target.value)}
                              placeholder="Range"
                              className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1.5 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Grave #</label>
                            <input
                              type="text"
                              value={directorGraveNum}
                              onChange={(e) => setDirectorGraveNum(e.target.value)}
                              placeholder="Grave #"
                              className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1.5 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Lot</label>
                            <input
                              type="text"
                              value={directorLot}
                              onChange={(e) => setDirectorLot(e.target.value)}
                              placeholder="Lot"
                              className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1.5 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Page 2 Section 3: Additional Legacy & Story DNA */}
                      <div className="bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200 space-y-3">
                        <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                          <Sparkles className="w-4 h-4 text-[#a0080e]" />
                          <span>3. Additional Information & Legacy Story DNA</span>
                        </h4>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">Organizations / Associations</label>
                          <input
                            type="text"
                            value={organizationsAssociations}
                            onChange={(e) => setOrganizationsAssociations(e.target.value)}
                            placeholder="e.g. Abyssinian Baptist Church Choir, NAACP, Delta Sigma Theta Sorority"
                            className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Favorite Color</label>
                            <input
                              type="text"
                              value={favoriteColor}
                              onChange={(e) => setFavoriteColor(e.target.value)}
                              placeholder="e.g. Royal Purple & Gold"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Favorite Type of Music</label>
                            <input
                              type="text"
                              value={favoriteMusicType}
                              onChange={(e) => setFavoriteMusicType(e.target.value)}
                              placeholder="e.g. Traditional Gospel, Harlem Jazz, Duke Ellington"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Interests & Passions</label>
                            <input
                              type="text"
                              value={interests}
                              onChange={(e) => setInterests(e.target.value)}
                              placeholder="e.g. Gardening, Culinary Arts, Mentoring Youth"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Known For</label>
                            <input
                              type="text"
                              value={knownFor}
                              onChange={(e) => setKnownFor(e.target.value)}
                              placeholder="e.g. Warm smile, Sunday family dinners, unwavering integrity"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">Favorite Quote</label>
                          <input
                            type="text"
                            value={favoriteQuote}
                            onChange={(e) => setFavoriteQuote(e.target.value)}
                            placeholder='e.g. "To whom much is given, much is required."'
                            className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Proudest Accomplishment</label>
                            <input
                              type="text"
                              value={proudestAccomplishment}
                              onChange={(e) => setProudestAccomplishment(e.target.value)}
                              placeholder="e.g. Putting 3 children through college; 40-year career in education"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Historical Milestone Witnessed</label>
                            <input
                              type="text"
                              value={historicalMilestoneWitnessed}
                              onChange={(e) => setHistoricalMilestoneWitnessed(e.target.value)}
                              placeholder="e.g. March on Washington 1963; 2008 Inauguration"
                              className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Forward to Step 2 */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#a0080e] hover:bg-[#6a0509] text-white font-bold text-xs px-6 py-2.5 rounded-none shadow-md transition flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Proceed to Step 2: Service Preference & Scheduling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 2: SERVICE PREFERENCE & APPOINTMENT SCHEDULING      */}
              {/* ======================================================== */}
              {step === 2 && (
                <div className="space-y-4">
                  
                  {/* Select Service Type */}
                  <div className="space-y-3 bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200">
                    <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                      <Sparkles className="w-4 h-4 text-[#a0080e]" />
                      <span>Select Baseline Service Package</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        {
                          id: 'cremation_memorial',
                          title: 'Cremation & Memorial Service',
                          desc: 'Full ceremonial memorial celebration with chapel supervision & keepsakes.',
                          price: '$3,184.00'
                        },
                        {
                          id: 'full_cremation',
                          title: 'Funeral Service with Cremation',
                          desc: 'Complete ceremonial gathering with chapel viewing prior to cremation.',
                          price: '$4,800.00'
                        },
                        {
                          id: 'full_burial',
                          title: 'Traditional Service & Burial',
                          desc: 'Full-service traditional earth burial with cortege, hearse & graveside rites.',
                          price: '$5,800.00'
                        },
                        {
                          id: 'direct_cremation',
                          title: 'Direct Cremation',
                          desc: 'Immediate disposition without formal visitation or ceremony.',
                          price: '$2,084.00'
                        },
                        {
                          id: 'direct_burial',
                          title: 'Direct Earth Burial',
                          desc: 'Immediate interment without formal visitation.',
                          price: '$2,084.00'
                        },
                        {
                          id: 'undecided',
                          title: 'Undecided / Custom Consultation',
                          desc: 'Review options with Licensed Funeral Director during conference.',
                          price: 'Consultation'
                        }
                      ].map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setDisposition(pkg.id as DispositionType)}
                          className={`p-3.5 rounded-none border-2 cursor-pointer transition flex flex-col justify-between ${
                            disposition === pkg.id
                              ? 'border-[#a0080e] bg-benta-50/50 shadow-xs'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-bold text-xs text-neutral-900">{pkg.title}</h5>
                              <span className="font-bold text-xs text-[#a0080e] font-mono">{pkg.price}</span>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-snug">{pkg.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* FLORAL TRIBUTES & CASKET SPRAYS SELECTION (BFH FLORIST)   */}
                  {/* ======================================================== */}
                  <div className="space-y-4 bg-gradient-to-br from-benta-50/50 via-neutral-50 to-brass-50/40 p-4 sm:p-5 rounded-none border border-benta-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-benta-200 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">💐</span>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm text-neutral-900">
                            Flowers & Floral Tributes (Benta's Florist Collection)
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-light">
                            Handcrafted by our master florist. Select by category and size with real-time pricing and visual thumbnail verification.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 bg-white px-3 py-1 rounded-none border border-neutral-200 cursor-pointer text-xs font-semibold text-neutral-700 shadow-xs">
                          <input
                            type="checkbox"
                            checked={!includeFlowers}
                            onChange={(e) => setIncludeFlowers(!e.target.checked)}
                            className="rounded text-[#a0080e] focus:ring-[#a0080e]"
                          />
                          <span>No Flowers (In Lieu of Flowers)</span>
                        </label>

                        {includeFlowers && (
                          <span className="text-xs font-bold text-[#a0080e] bg-benta-50 border border-benta-200 px-3 py-1 rounded-none font-mono">
                            Total: ${(
                              (getFloralByCode(selectedFloralCode)?.pricing[selectedFloralSize] || 350) * floralQuantity
                            ).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {includeFlowers && (
                      <div className="space-y-4 pt-1">
                        {/* Header Banner with Dual Catalog Switcher & Gallery Trigger */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gradient-to-r from-brass-50 to-benta-50 border border-brass-300/80 p-3 rounded-none text-xs text-brass-950 shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold uppercase tracking-wider text-[10px] bg-[#a0080e] text-white px-2.5 py-1 rounded-none shadow-2xs">
                              BFH FLORIST STUDIO
                            </span>
                            <span className="font-bold text-neutral-900">
                              {selectedFloralBook === 'danielas_original' 
                                ? `Daniela's. Original (${DANIELAS_ORIGINAL_CATALOG.length} Designs, #1–#192)`
                                : `Other Floral Book (${OTHER_FLORAL_CATALOG.length} General Designs)`}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Book Toggle */}
                            <div className="flex items-center bg-white p-0.5 rounded-none border border-neutral-200 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFloralBook('danielas_original');
                                  setSelectedFloralCat('all');
                                  setSelectedFloralCode('BFH-CC-001');
                                }}
                                className={`px-2.5 py-1 rounded-none text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                  selectedFloralBook === 'danielas_original'
                                    ? 'bg-[#a0080e] text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                <span>🌸 Daniela&apos;s. Original</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFloralBook('other_floral_book');
                                  setSelectedFloralCat('all');
                                  setSelectedFloralCode('BFH-CS-001');
                                }}
                                className={`px-2.5 py-1 rounded-none text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                  selectedFloralBook === 'other_floral_book'
                                    ? 'bg-[#a0080e] text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                <span>🌿 Other Floral Book</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowFloralPhotoGallery(!showFloralPhotoGallery)}
                              className="text-xs font-bold text-[#a0080e] hover:text-benta-900 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-none border border-benta-200 shadow-xs cursor-pointer transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{showFloralPhotoGallery ? 'Hide Gallery' : 'Browse Gallery'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Visual Photo Gallery Drawer */}
                        {showFloralPhotoGallery && (
                          <div className="bg-white border-2 border-[#a0080e]/30 rounded-none p-4 shadow-md space-y-3 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#a0080e]" />
                                <span className="font-bold text-xs text-neutral-900">
                                  {selectedFloralBook === 'danielas_original'
                                    ? "Daniela's. Original Gallery (192 Handcrafted Pieces)"
                                    : "Other Floral Book Gallery"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowFloralPhotoGallery(false)}
                                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold"
                              >
                                Close Gallery ✕
                              </button>
                            </div>

                            {/* Search and Category Filter Pills */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
                                <input
                                  type="text"
                                  placeholder="Search by catalog #, item code, or name..."
                                  value={floralSearchTerm}
                                  onChange={(e) => setFloralSearchTerm(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-none outline-none focus:border-[#a0080e]"
                                />
                              </div>
                            </div>

                            {/* Category Pills */}
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                              {(selectedFloralBook === 'danielas_original' ? DANIELAS_CATEGORIES : OTHER_FLORAL_CATEGORIES).map((cat) => {
                                const currentBookCatalog = selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG : OTHER_FLORAL_CATALOG;
                                const count = cat.id === 'all' 
                                  ? currentBookCatalog.length 
                                  : currentBookCatalog.filter(f => f.category === cat.id).length;
                                const isSelected = selectedFloralCat === cat.id;
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedFloralCat(cat.id)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-[#a0080e] text-white shadow-xs'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                  >
                                    <span>{cat.label.split('(')[0]}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Thumbnail Grid with Clean Price Stickers */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto p-1 bg-neutral-50 rounded-none border border-neutral-200">
                              {(() => {
                                const currentBookCatalog = selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG : OTHER_FLORAL_CATALOG;
                                return currentBookCatalog.filter(f => {
                                  const matchesCat = selectedFloralCat === 'all' || f.category === selectedFloralCat;
                                  const q = floralSearchTerm.trim().toLowerCase();
                                  const matchesSearch = !q || 
                                    f.name.toLowerCase().includes(q) || 
                                    f.code.toLowerCase().includes(q) ||
                                    (f.catalogNumber && String(f.catalogNumber).includes(q)) ||
                                    f.description.toLowerCase().includes(q);
                                  return matchesCat && matchesSearch;
                                }).map((item) => {
                                  const isItemActive = selectedFloralCode === item.code;
                                  const isFixed = item.pricing.small === item.pricing.large;
                                  return (
                                    <div
                                      key={item.code}
                                      onClick={() => {
                                        setSelectedFloralCode(item.code);
                                        if (selectedFloralCat !== 'all' && selectedFloralCat !== item.category) {
                                          setSelectedFloralCat('all');
                                        }
                                      }}
                                      className={`group rounded-none border-2 p-1.5 bg-white cursor-pointer transition flex flex-col justify-between ${
                                        isItemActive
                                          ? 'border-[#a0080e] ring-2 ring-benta-300 shadow-md'
                                          : 'border-neutral-200 hover:border-[#a0080e]/60'
                                      }`}
                                    >
                                      <div className="relative aspect-square rounded-none overflow-hidden bg-white mb-1.5 border border-neutral-100 p-1 flex items-center justify-center">
                                        <img
                                          src={item.imageUrl}
                                          alt={item.name}
                                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                                        />
                                        {item.catalogNumber && (
                                          <span className="absolute top-1 left-1 text-[9px] font-mono font-bold bg-[#a0080e] text-white px-1 py-0.2 rounded shadow-2xs">
                                            #{item.catalogNumber}
                                          </span>
                                        )}
                                        <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-gradient-to-r from-brass-600 to-brass-700 text-white px-1.5 py-0.2 rounded shadow-2xs border border-brass-400/40">
                                          {isFixed ? `$${item.pricing.medium}` : `$${item.pricing.small}–$${item.pricing.large}`}
                                        </span>
                                      </div>
                                      <div className="space-y-0.5">
                                        <div className="flex items-center justify-between text-[9px] font-mono">
                                          <span className="font-bold text-neutral-600 truncate">{item.code}</span>
                                          <span className="font-bold text-[#a0080e]">${item.pricing.medium}</span>
                                        </div>
                                        <h6 className="font-bold text-[10px] text-neutral-900 line-clamp-1 leading-tight">
                                          {item.name}
                                        </h6>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Dropdown Selectors & Visual Verification Panel */}
                        {(() => {
                          const activeProduct = getFloralByCode(selectedFloralCode, selectedFloralBook) 
                            || (selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG[0] : OTHER_FLORAL_CATALOG[0]);
                          const currentBookCatalog = selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG : OTHER_FLORAL_CATALOG;
                          const filteredCatalog = currentBookCatalog.filter(f => {
                            if (selectedFloralCat === 'all') return true;
                            return f.category === selectedFloralCat;
                          });
                          const isFixedPrice = activeProduct.pricing.small === activeProduct.pricing.large;
                          const currentUnitPrice = activeProduct.pricing[selectedFloralSize] ?? activeProduct.pricing.medium ?? 350;

                          return (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                              {/* Left Configuration (7 Cols) */}
                              <div className="lg:col-span-7 space-y-3">
                                
                                {/* 1. Category Filter Dropdown */}
                                <div>
                                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1">
                                    <span className="text-brass-700">📦</span> 1. Select Floral Category:
                                  </label>
                                  <select
                                    value={selectedFloralCat}
                                    onChange={(e) => {
                                      const newCat = e.target.value;
                                      setSelectedFloralCat(newCat);
                                      if (newCat !== 'all') {
                                        const inCat = currentBookCatalog.filter(f => f.category === newCat);
                                        if (inCat.length > 0 && !inCat.some(f => f.code === selectedFloralCode)) {
                                          setSelectedFloralCode(inCat[0].code);
                                        }
                                      }
                                    }}
                                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-[#a0080e] shadow-xs"
                                  >
                                    {(selectedFloralBook === 'danielas_original' ? DANIELAS_CATEGORIES : OTHER_FLORAL_CATEGORIES).map((cat) => {
                                      const count = cat.id === 'all' 
                                        ? currentBookCatalog.length 
                                        : currentBookCatalog.filter(f => f.category === cat.id).length;
                                      return (
                                        <option key={cat.id} value={cat.id}>
                                          {cat.label} ({count})
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>

                                {/* 2. Arrangement Dropdown */}
                                <div>
                                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                      <span className="text-brass-700">🏷️</span> 2. Select Floral Arrangement ({filteredCatalog.length} available):
                                    </span>
                                    <span className="text-[10px] text-brass-900 font-bold bg-brass-100 px-2 py-0.5 rounded border border-brass-300">
                                      {activeProduct.bookSource || "Daniela's. Original"}
                                    </span>
                                  </label>
                                  <select
                                    value={selectedFloralCode}
                                    onChange={(e) => setSelectedFloralCode(e.target.value)}
                                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-[#a0080e] shadow-xs"
                                  >
                                    {filteredCatalog.map((item) => (
                                      <option key={item.code} value={item.code}>
                                        {item.catalogNumber ? `#${item.catalogNumber} ` : ''}[{item.code}] {item.name} — (${item.categoryLabel}) — ${item.pricing.medium ? `$${item.pricing.medium}` : `$${item.pricing.small}`}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* 3. Size Selection Buttons */}
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold text-neutral-800">
                                      3. Select Size (Creates Total Price):
                                    </label>
                                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                                      {isFixedPrice ? 'Fixed Price Tribute' : 'Standard Tier Pricing (Small $300 / Med $350 / Lrg $400)'}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    {(['small', 'medium', 'large'] as FloralSize[]).map((size) => {
                                      const isSizeSelected = selectedFloralSize === size;
                                      const price = activeProduct.pricing[size] ?? activeProduct.pricing.medium;
                                      const dim = activeProduct.dimensions[size];
                                      return (
                                        <button
                                          key={size}
                                          type="button"
                                          onClick={() => setSelectedFloralSize(size)}
                                          className={`p-2.5 rounded-none border-2 transition cursor-pointer text-center flex flex-col justify-between ${
                                            isSizeSelected
                                              ? 'border-[#a0080e] bg-benta-50/70 shadow-xs'
                                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                                          }`}
                                        >
                                          <span className="text-[10px] uppercase font-bold text-neutral-600 block">
                                            {size}
                                          </span>
                                          <span className="text-sm font-bold text-[#a0080e] font-mono my-0.5">
                                            ${price}.00
                                          </span>
                                          <span className="text-[9px] text-neutral-400 block truncate">
                                            {dim}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* 4. Ribbon Text & Quantity */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                                      Ribbon / Sash Text (Optional):
                                    </label>
                                    <input
                                      type="text"
                                      value={floralRibbonText}
                                      onChange={(e) => setFloralRibbonText(e.target.value)}
                                      placeholder="e.g. Loving Family, Beloved Mother..."
                                      className="w-full bg-white border border-neutral-300 rounded-none px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-[#a0080e]"
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {['Loving Family', 'Beloved Mother', 'Beloved Father', 'To Our Beloved Papa', 'Forever in Our Hearts'].map((phrase) => (
                                        <button
                                          key={phrase}
                                          type="button"
                                          onClick={() => setFloralRibbonText(phrase)}
                                          className="text-[10px] bg-neutral-100 hover:bg-benta-50 hover:text-[#a0080e] text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200 cursor-pointer transition"
                                        >
                                          + {phrase}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                                      Quantity:
                                    </label>
                                    <div className="flex items-center border border-neutral-300 rounded-none bg-white overflow-hidden">
                                      <button
                                        type="button"
                                        onClick={() => setFloralQuantity(Math.max(1, floralQuantity - 1))}
                                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold"
                                      >
                                        -
                                      </button>
                                      <span className="flex-1 text-center font-bold text-xs text-neutral-900">
                                        {floralQuantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setFloralQuantity(floralQuantity + 1)}
                                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>

                              </div>

                              {/* Right Visual Order Verification with Clean Price Tag Seal */}
                              <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-none p-3 shadow-xs space-y-2.5">
                                <div className="flex justify-between items-center border-b border-neutral-100 pb-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brass-900 bg-brass-100 px-2 py-0.5 rounded border border-brass-300">
                                    {activeProduct.bookSource || "Daniela's. Original"}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-neutral-600">
                                    {activeProduct.catalogNumber ? `#${activeProduct.catalogNumber} • ` : ''}{activeProduct.code}
                                  </span>
                                </div>

                                <div className="relative aspect-square rounded-none overflow-hidden bg-white border border-neutral-200 flex items-center justify-center p-2 shadow-inner">
                                  <img
                                    src={activeProduct.imageUrl}
                                    alt={activeProduct.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                  
                                  {/* Professional Cleaned-up Price Sticker Badge */}
                                  <div className="absolute top-2 right-2 px-2.5 py-1 bg-gradient-to-r from-brass-600 via-brass-700 to-brass-800 text-white text-xs font-mono font-bold rounded-none shadow-md border border-brass-300/50 flex items-center gap-1">
                                    <span className="text-[10px] uppercase font-sans tracking-wider opacity-80">PRICE:</span>
                                    <span>${currentUnitPrice.toFixed(2)}</span>
                                  </div>

                                  {floralRibbonText.trim() && (
                                    <div className="absolute bottom-2 left-2 right-2 bg-[#a0080e]/95 backdrop-blur-sm text-white text-[11px] font-bold text-center py-1 px-2 rounded-none shadow-md border border-brass-400/40 truncate">
                                      🎗️ Ribbon Sash: &quot;{floralRibbonText}&quot;
                                    </div>
                                  )}
                                  <span className="absolute top-2 left-2 bg-black/80 text-brass-300 text-[10px] px-2 py-0.5 rounded-full font-semibold font-mono">
                                    {activeProduct.categoryLabel}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <h5 className="font-serif-title font-bold text-xs text-neutral-900">
                                    {activeProduct.name}
                                  </h5>
                                  <p className="text-[10px] text-neutral-500 leading-tight">
                                    {activeProduct.description}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
                                  <span className="font-bold text-neutral-700">
                                    Size: <strong className="uppercase text-[#a0080e]">{selectedFloralSize}</strong> ({activeProduct.dimensions[selectedFloralSize]})
                                  </span>
                                  <span className="font-bold text-neutral-900 font-mono">
                                    ${currentUnitPrice}.00 × {floralQuantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                      </div>
                    )}
                  </div>

                  {/* Arrangement Appointment Meeting Format */}
                  <div className="space-y-3 bg-neutral-50 p-4 sm:p-5 rounded-none border border-neutral-200">
                    <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                      <Calendar className="w-4 h-4 text-[#a0080e]" />
                      <span>Arrangement Conference Appointment Request</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div
                        onClick={() => setAppointmentFormat('in_person_office')}
                        className={`p-3.5 rounded-none border-2 cursor-pointer transition ${
                          appointmentFormat === 'in_person_office'
                            ? 'border-[#a0080e] bg-benta-50/50 shadow-xs'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <strong className="text-neutral-900 block font-bold text-xs">In-Person at Benta's Funeral Home</strong>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          630 Saint Nicholas Avenue (Corner of 141st St), Harlem, NY 10030
                        </p>
                      </div>

                      <div
                        onClick={() => setAppointmentFormat('virtual_video')}
                        className={`p-3.5 rounded-none border-2 cursor-pointer transition ${
                          appointmentFormat === 'virtual_video'
                            ? 'border-[#a0080e] bg-benta-50/50 shadow-xs'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <strong className="text-neutral-900 block font-bold text-xs">Virtual Video Conference (Zoom / Meet)</strong>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Secure digital consultation with screen-sharing of catalogs & documents.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">Preferred Appointment Date</label>
                        <input
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">Preferred Time Window</label>
                        <select
                          value={appointmentTimeSlot}
                          onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-neutral-900 outline-none focus:border-[#a0080e]"
                        >
                          <option value="10:00 AM">10:00 AM (Morning Session)</option>
                          <option value="01:00 PM">01:00 PM (Early Afternoon)</option>
                          <option value="03:30 PM">03:30 PM (Late Afternoon)</option>
                          <option value="06:00 PM">06:00 PM (Evening Consultation)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Special Accommodations / Family Notes (Optional)</label>
                      <textarea
                        rows={2}
                        value={familyNotes}
                        onChange={(e) => setFamilyNotes(e.target.value)}
                        placeholder="e.g. Any special religious rites, out-of-town family scheduling, or questions..."
                        className="w-full bg-white border border-neutral-300 rounded-none p-3 text-neutral-900 outline-none focus:border-[#a0080e] resize-none"
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Actions Footer */}
            <div className="border-t border-neutral-200 pt-4 mt-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 text-neutral-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-benta-600" />
                <span>NYS DOH Form AP-47 Compliant • BFH Golden Record</span>
              </div>

              <div className="flex items-center space-x-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-none border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 transition cursor-pointer"
                  >
                    Back to Vital Records
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-[#a0080e] hover:bg-benta-800 text-white font-bold text-xs px-6 py-2.5 rounded-none shadow-md transition flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-brass-300" />
                  <span>Create Case Record & Port Information</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
