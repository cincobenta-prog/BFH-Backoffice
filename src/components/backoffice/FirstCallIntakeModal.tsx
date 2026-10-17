import React, { useState } from 'react';
import {
  IntakePathwayType,
  FirstCallIntakeFormData,
  RemovalLocationType,
  RemovalUrgency,
  DispositionType,
  DirectorProfile,
  RemovalReadinessStatus,
  FullVitalRecordInformationSheet
} from '../../lib/types/funeral';
import { 
  TRI_STATE_HOSPITALS_DIRECTORY, 
  TRI_STATE_NURSING_HOMES_DIRECTORY 
} from '../../lib/data/partnerCatalogs';
import { 
  formatPhoneNumbersOnly, 
  isValidEmailFormat 
} from '../../lib/utils/inputValidation';
import {
  PhoneCall,
  User,
  Calendar,
  Building2,
  Truck,
  Sparkles,
  X,
  Info,
  Mail,
  Printer,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Copy,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Award,
  Heart,
  MapPin,
  Building
} from 'lucide-react';

interface FirstCallIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIntake: (
    formData: FirstCallIntakeFormData, 
    nextAction: 'open_removal' | 'open_appointment' | 'save_only'
  ) => void;
  directorProfiles?: DirectorProfile[];
  currentDirectorId?: string;
}

export const FirstCallIntakeModal: React.FC<FirstCallIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmitIntake,
  directorProfiles = [],
  currentDirectorId = 'dir-fd-1'
}) => {
  if (!isOpen) return null;

  const dateToday = new Date().toISOString().split('T')[0];
  const activeDirectorObj = directorProfiles.find(d => d.id === currentDirectorId) || directorProfiles[0];

  // Multi-Step Navigation State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // 1. Pathway Selector State
  const intakePathway: IntakePathwayType = 'scheduled_arrangement_first';

  // 2. Caller / Informant State (Captured from Phone Call) - Clean slate without stale data
  const [callerName, setCallerName] = useState('');
  const [callerRelationship, setCallerRelationship] = useState('Spouse / Surviving Partner');
  const [callerPhone, setCallerPhone] = useState('');
  const [callerEmail, setCallerEmail] = useState('');
  const [callerAddress, setCallerAddress] = useState('');
  const [hasRightToControl, setHasRightToControl] = useState(true);

  // Informant Additional Contacts Breakdown
  const [informantPhoneHome, setInformantPhoneHome] = useState('');
  const [informantPhoneCell, setInformantPhoneCell] = useState('');
  const [informantPhoneAlt, setInformantPhoneAlt] = useState('');
  const [informantAddressStreet, setInformantAddressStreet] = useState('');
  const [informantAddressApt, setInformantAddressApt] = useState('');
  const [informantAddressCityStateCountry, setInformantAddressCityStateCountry] = useState('');
  const [informantAddressZip, setInformantAddressZip] = useState('');

  // 3. Decedent & Vital Records State (Official 2-Page Vital Record Sheet) - Clean slate
  const [decedentFirstName, setDecedentFirstName] = useState('');
  const [decedentMiddleName, setDecedentMiddleName] = useState('');
  const [decedentLastName, setDecedentLastName] = useState('');
  const [decedentLegalName, setDecedentLegalName] = useState('');
  const [otherKnownNames, setOtherKnownNames] = useState('');

  const [residenceStreet, setResidenceStreet] = useState('');
  const [residenceApt, setResidenceApt] = useState('');
  const [residenceCity, setResidenceCity] = useState('');
  const [residenceState, setResidenceState] = useState('');
  const [residenceZip, setResidenceZip] = useState('');
  const [residenceAddress, setResidenceAddress] = useState('');

  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [educationLevel, setEducationLevel] = useState('');

  const [placeOfDeathFacility, setPlaceOfDeathFacility] = useState('');
  const [placeOfDeathCity, setPlaceOfDeathCity] = useState('');
  const [placeOfDeathStateCountry, setPlaceOfDeathStateCountry] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const [dateOfDeath, setDateOfDeath] = useState(dateToday);
  const isExpectedDeath = false;

  const [maritalStatus, setMaritalStatus] = useState<'married' | 'separated' | 'never_married' | 'widowed' | 'divorced'>('married');
  const [ssn, setSsn] = useState('');
  const [race, setRace] = useState('');

  // Occupation & Industry
  const [occupationTitle, setOccupationTitle] = useState('');
  const [typeOfBusiness, setTypeOfBusiness] = useState('');

  // Military Status & Branch
  const [isVeteran, setIsVeteran] = useState(false);
  const [isActiveDuty, setIsActiveDuty] = useState(false);
  const [militaryBranch, setMilitaryBranch] = useState('');

  // Parents & Spouse
  const [fatherName, setFatherName] = useState('');
  const [motherFirstAndMaidenName, setMotherFirstAndMaidenName] = useState('');
  const [spouseFirstAndMaidenName, setSpouseFirstAndMaidenName] = useState('');
  const [spouseDateOfBirth, setSpouseDateOfBirth] = useState('');

  // Cemetery Deed & Previous Interment
  const [deedOwnerName, setDeedOwnerName] = useState('');
  const [deedOwnerAddress, setDeedOwnerAddress] = useState('');
  const [previousIntermentWho, setPreviousIntermentWho] = useState('');
  const [previousIntermentWhen, setPreviousIntermentWhen] = useState('');
  const [previousIntermentRelation, setPreviousIntermentRelation] = useState('');

  // Verification Jurat
  const [reviewedOrProvidedBy, setReviewedOrProvidedBy] = useState('');
  const [verifiedOnDate, setVerifiedOnDate] = useState(dateToday);

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

  // 4. Removal Readiness & Location Triage - Clean slate
  const [removalReadiness, setRemovalReadiness] = useState<RemovalReadinessStatus>('pending_hospital_release');
  const [removalReadinessNotes, setRemovalReadinessNotes] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('custom');
  const [locationType, setLocationType] = useState<RemovalLocationType>('hospital_morgue');
  const [facilityName, setFacilityName] = useState('');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityFloorRoom, setFacilityFloorRoom] = useState('');
  const [facilityContactPhone, setFacilityContactPhone] = useState('');
  const [morgueAttendantOrNurse, setMorgueAttendantOrNurse] = useState('');

  // Physician & Medical Certifier
  const [physicianName, setPhysicianName] = useState('');
  const [physicianPhone, setPhysicianPhone] = useState('');
  const [physicianLicenseNumber, setPhysicianLicenseNumber] = useState('');

  // 5. Service Preferences & Assignment
  const [dispositionType, setDispositionType] = useState<DispositionType>('full_burial');
  const viewingParlor = 'Parlor A (Seats 120)';
  const targetServiceDate = '';
  const [assignedDirectorId, setAssignedDirectorId] = useState(activeDirectorObj?.id || 'dir-fd-1');
  const [assignedDirectorName, setAssignedDirectorName] = useState(activeDirectorObj?.name || 'Jason Benta');
  const [urgency, setUrgency] = useState<RemovalUrgency>('scheduled_window');
  const specialInstructions = '';
  const [specialEquipment] = useState<string[]>([
    'Standard Mortuary Cot & Transfer Pouch',
    'Tamper-Evident Personal Effects Security Bag'
  ]);

  // 6. Arrangement Appointment Scheduling State
  const defaultApptDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [scheduledAppointmentDate, setScheduledAppointmentDate] = useState(defaultApptDate);
  const [scheduledAppointmentTime, setScheduledAppointmentTime] = useState('10:00 AM');
  const [scheduledAppointmentVenue, setScheduledAppointmentVenue] = useState('630 St. Nicholas Ave - Arrangement Suite 1 (Ground Floor)');
  const [attendingFamilyCount, setAttendingFamilyCount] = useState(2);
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(true);
  const [sendConfirmationSms, setSendConfirmationSms] = useState(true);

  // Copy Feedback Toast
  const [copiedEmailText, setCopiedEmailText] = useState(false);

  // Validation Error State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Quick Facility Lookup Handler
  const handleFacilitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedFacilityId(val);

    if (val === 'custom') {
      setLocationType('residence');
      setFacilityName('Private Residence');
      setFacilityAddress('');
      setFacilityFloorRoom('Apt / Room');
      setFacilityContactPhone('');
      return;
    }

    // Search in hospitals
    const hosp = TRI_STATE_HOSPITALS_DIRECTORY.find(h => h.id === val);
    if (hosp) {
      setLocationType('hospital_morgue');
      setFacilityName(hosp.name);
      setFacilityAddress(`${hosp.address}, ${hosp.city}, ${hosp.state} ${hosp.zip}`);
      setFacilityFloorRoom('Hospital Pathology Morgue');
      setFacilityContactPhone(hosp.morgueOrPathologyPhone || hosp.mainPhone);
      setMorgueAttendantOrNurse('Morgue Custodial Officer');
      return;
    }

    // Search in nursing homes
    const nh = TRI_STATE_NURSING_HOMES_DIRECTORY.find(n => n.id === val);
    if (nh) {
      setLocationType('nursing_home');
      setFacilityName(nh.name);
      setFacilityAddress(`${nh.address}, ${nh.city}, ${nh.state} ${nh.zip}`);
      setFacilityFloorRoom(nh.securityOrDockInstructions ? `Floor / Dock: ${nh.securityOrDockInstructions}` : 'Nursing Station');
      setFacilityContactPhone(nh.nursingStationPhone || nh.mainPhone);
      setMorgueAttendantOrNurse('Charge Nurse / Nursing Supervisor');
      return;
    }
  };

  const handleDirectorChange = (id: string) => {
    setAssignedDirectorId(id);
    const d = directorProfiles.find(p => p.id === id);
    if (d) setAssignedDirectorName(d.name);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!callerName.trim()) {
      errors.callerName = 'Informant / Caller full name is required.';
    }
    const rawCallerPhone = (callerPhone || informantPhoneCell).replace(/\D/g, '');
    if (!rawCallerPhone || rawCallerPhone.length < 10) {
      errors.callerPhone = 'Valid 10-digit caller phone number is required for SMS confirmation.';
    }
    if (callerEmail.trim() && !isValidEmailFormat(callerEmail)) {
      errors.callerEmail = 'Please provide a valid email format (e.g. name@domain.com) for confirmation packet.';
    }
    const constructedLegalName = [decedentFirstName, decedentMiddleName, decedentLastName]
      .filter(Boolean)
      .join(' ')
      .trim() || decedentLegalName.trim();
    if (!constructedLegalName) {
      errors.decedentLegalName = 'Decedent legal full name is required.';
    }
    if (!facilityName.trim()) {
      errors.facilityName = 'Place or facility where loved one is resting is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Copy email text summary
  const handleCopyEmailText = () => {
    const emailBody = `SUBJECT: Appointment Confirmation & Arrangement Preparation Guide — Benta's Funeral Home

Dear ${callerName || 'Family Representative'},

Thank you for contacting Benta's Funeral Home. We extend our deepest condolences to you and your family on the passing of ${decedentLegalName || 'your loved one'}.

=======================================================
ARRANGEMENT CONFERENCE APPOINTMENT DETAILS
=======================================================
• Date & Time: ${scheduledAppointmentDate} at ${scheduledAppointmentTime}
• Location: Benta's Funeral Home, 630 Saint Nicholas Avenue, New York, NY 10030
• Meeting Room: ${scheduledAppointmentVenue}
• Assigned Funeral Director: ${assignedDirectorName} (212) 281-8850

=======================================================
CURRENT STATUS & CUSTODY NOTICE
=======================================================
• Loved One: ${decedentLegalName || 'Loved One'}
• Current Resting Location: ${facilityName} (${facilityFloorRoom})
• Removal Readiness Status: ${
  removalReadiness === 'pending_hospital_release' 
    ? 'Pending Hospital / Attending Physician Release' 
    : removalReadiness === 'family_consultation_hold'
    ? 'Family Consultation First (Hold Removal)'
    : 'Ready for Immediate Transfer Dispatch'
}

=======================================================
WHAT TO BRING TO YOUR ARRANGEMENT CONFERENCE
=======================================================
Please gather the following items and documentation:

1. VITAL STATISTICS INFORMATION:
   ✓ Full Legal Name and Social Security Number
   ✓ Exact Date and Place of Birth (City, State / Country)
   ✓ Father's Full Name & Mother's Maiden Name
   ✓ Highest Level of Education Completed & Primary Occupation
   ✓ Military Veteran Discharge Papers (Form DD-214), if applicable

2. CLOTHING & PERSONAL ARTICLES:
   ✓ Full set of clothing including undergarments, stockings/socks, dress/suit, shoes
   ✓ Eyeglasses & jewelry instructions (specify if items stay on or return to family)
   ✓ Recent photograph for natural hairdressing and cosmetic reference

3. LEGAL, INSURANCE & CEMETERY RECORDS:
   ✓ Government-Issued Photo ID of Next of Kin / Authorized Informant
   ✓ Right to Control Remains Documentation (NYS PHL § 4201)
   ✓ Life Insurance Policy documents (if assigning proceeds for funeral costs)
   ✓ Existing Cemetery Deed / Crypt Certificate (if family owns a plot)

4. MEMORIAL PROGRAM & TRIBUTE MATERIALS:
   ✓ 25 to 50 family photographs for the 360° Digital Tribute Video and 4-Panel Bulletin
   ✓ List of surviving and predeceased family members for the official obituary

=======================================================
DIGITAL PRE-FILL & FAMILY PORTAL ACCESS
=======================================================
You may review or complete your vital statistics sheet online in advance:
• Online Pre-Fill: https://bentasfuneralhome.com/portal/pre-fill
• Confidential Family Portal: https://bentasfuneralhome.com/portal (PIN: 3995)

If you have any questions or need immediate assistance, our 24/7 Careline is always available at (212) 281-8850.

Warmly and with dignity,
Jason Benta & The Staff of Benta's Funeral Home
EST. 1928 • HARLEM, NYC`;

    navigator.clipboard.writeText(emailBody);
    setCopiedEmailText(true);
    setTimeout(() => setCopiedEmailText(false), 3000);
  };

  // Submission handler
  const handleSubmit = (nextAction: 'open_removal' | 'open_appointment' | 'save_only') => {
    if (!validateForm()) {
      setCurrentStep(1);
      return;
    }

    const constructedLegalName = [decedentFirstName, decedentMiddleName, decedentLastName]
      .filter(Boolean)
      .join(' ')
      .trim() || decedentLegalName;

    const fullResidence = [residenceStreet, residenceApt, residenceCity, residenceState, residenceZip]
      .filter(Boolean)
      .join(', ');

    const vitalSheet: FullVitalRecordInformationSheet = {
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
      sex: gender === 'female' ? 'female' : 'male',
      educationLevel,
      placeOfDeathFacilityOrLocation: placeOfDeathFacility || facilityName,
      placeOfDeathCity: placeOfDeathCity || (facilityAddress.split(',')[1]?.trim() || ''),
      placeOfDeathStateOrCountry: placeOfDeathStateCountry,
      dateOfBirth,
      age: age ? Number(age) || age : '',
      birthPlaceCityStateCountry: birthPlace,
      maritalStatus: maritalStatus === 'never_married' ? 'never_married' : maritalStatus,
      ssn: ssn.trim(),
      race,
      occupationTitle,
      typeOfBusiness,
      militaryBranch,
      militaryStatus: isVeteran ? 'veteran' : (isActiveDuty ? 'active' : 'none'),
      fatherName,
      motherFirstAndMaidenName,
      spouseFirstAndMaidenName,
      spouseDateOfBirth,

      informantName: callerName,
      informantRelationship: callerRelationship,
      informantPhoneHome: informantPhoneHome || callerPhone,
      informantPhoneCell: informantPhoneCell || callerPhone,
      informantPhoneAlt: informantPhoneAlt,
      informantEmail: callerEmail,
      informantAddressStreet: informantAddressStreet || callerAddress,
      informantAddressApt: informantAddressApt,
      informantAddressCityStateCountry: informantAddressCityStateCountry || callerAddress,
      informantAddressZip: informantAddressZip,

      deedOwnerName,
      deedOwnerAddress,
      previousIntermentWho,
      previousIntermentWhen,
      previousIntermentRelation,

      reviewedOrProvidedBy: reviewedOrProvidedBy || callerName,
      verifiedOnDate: verifiedOnDate || dateToday,

      authPostObituaryWebsite: true,
      authLiveStreamService: true,
      authLiveStreamType: 'public'
    };

    const formData: FirstCallIntakeFormData = {
      callerName,
      callerRelationship,
      callerPhone,
      callerEmail: callerEmail || 'family@bentasfuneralhome.org',
      callerAddress: callerAddress || informantAddressStreet || fullResidence,
      hasRightToControl,
      
      decedentLegalName: constructedLegalName,
      decedentFirstName,
      decedentMiddleName,
      decedentLastName,
      otherKnownNames,

      gender,
      dateOfBirth,
      age,
      birthPlaceCityStateCountry: birthPlace,
      dateOfDeath,
      isExpectedDeath,
      ssn: ssn.trim(),
      ssnLast4: ssn.replace(/\D/g, '').slice(-4),
      maritalStatus,
      race,
      educationLevel,
      occupationTitle,
      typeOfBusiness,
      militaryStatus: isVeteran ? 'veteran' : (isActiveDuty ? 'active' : 'none'),
      militaryBranch,
      
      fatherName,
      motherMaidenName: motherFirstAndMaidenName,
      motherFirstAndMaidenName,
      spouseFirstAndMaidenName,
      spouseDateOfBirth,
      
      residenceAddress: fullResidence || residenceAddress || callerAddress,
      residenceStreet,
      residenceApt,
      residenceCity,
      residenceState,
      residenceZip,
      placeOfDeathFacilityOrLocation: placeOfDeathFacility || facilityName,
      placeOfDeathCity,
      placeOfDeathStateOrCountry: placeOfDeathStateCountry,

      informantPhoneHome,
      informantPhoneCell: informantPhoneCell || callerPhone,
      informantPhoneAlt,
      informantAddressStreet,
      informantAddressApt,
      informantAddressCityStateCountry,
      informantAddressZip,

      deedOwnerName,
      deedOwnerAddress,
      previousIntermentWho,
      previousIntermentWhen,
      previousIntermentRelation,

      reviewedOrProvidedBy,
      verifiedOnDate,

      vitalRecordsSheet: vitalSheet,
      
      removalReadiness,
      removalReadinessNotes,
      
      locationType,
      facilityName: placeOfDeathFacility || facilityName,
      facilityAddress,
      facilityFloorRoom,
      facilityContactPhone,
      morgueAttendantOrNurse,
      
      physicianName,
      physicianPhone,
      physicianLicenseNumber,
      
      dispositionType,
      viewingParlor,
      targetServiceDate,
      
      scheduledAppointmentDate,
      scheduledAppointmentTime,
      scheduledAppointmentVenue,
      attendingFamilyCount,
      sendConfirmationEmail,
      sendConfirmationSms,
      
      assignedDirectorId,
      assignedDirectorName,
      intakePathway,
      urgency,
      specialInstructions,
      specialEquipment
    };

    onSubmitIntake(formData, nextAction);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-[#800000] text-white border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Universal Staff Intake Console
                </span>
                <span className="text-[10px] text-neutral-300 font-mono">
                  Incoming Family Phone Intake & Appointment Scheduler
                </span>
              </div>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-white tracking-wide">
                First Call Phone Intake, Vital Records & Arrangement Scheduler
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-STEP WIZARD PROGRESS BAR */}
        <div className="bg-neutral-100 px-4 sm:px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0 text-xs font-semibold">
          {[
            { step: 1, title: '1. Phone Call & Vital Statistics', icon: PhoneCall },
            { step: 2, title: '2. Removal Readiness & Location', icon: Truck },
            { step: 3, title: '3. Appointment Scheduling', icon: Calendar },
            { step: 4, title: '4. Family Email & What-to-Bring Guide', icon: Mail }
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step as any)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#800000] text-white shadow-xs font-bold'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.title}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-neutral-50/60 text-xs text-neutral-900 font-sans">
          
          {/* ======================================================== */}
          {/* STEP 1: PHONE CALL & VITAL STATISTICS (MATCHING SHEET)    */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Notice Banner */}
              <div className="bg-amber-50/90 border border-amber-300 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500 text-neutral-950 rounded-xl font-bold shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-amber-950 block text-xs">Universal Staff Call-In Protocol (NYS PHL § 4201):</strong>
                    <p className="text-[11px] text-amber-900 font-light">
                      Capture caller contact info and decedent vital statistics over the phone. All details pre-populate the Vital Records Sheet and the Family Arrangement Packet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informant & Caller Section */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-serif-title font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#800000]" />
                    <span>Caller & Authorized Informant (Right to Control Remains)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Captures Email for What-to-Bring Packet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Caller / Informant Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Robert Vance"
                      value={callerName}
                      onChange={(e) => {
                        setCallerName(e.target.value);
                        if (validationErrors.callerName) setValidationErrors(prev => ({ ...prev, callerName: '' }));
                      }}
                      className={`w-full bg-[#fbfbfd] border rounded-xl p-2.5 font-bold outline-none transition ${
                        validationErrors.callerName ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#800000]'
                      }`}
                    />
                    {validationErrors.callerName && (
                      <span className="text-[10px] text-red-600 font-semibold block mt-0.5">{validationErrors.callerName}</span>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Relationship to Deceased</label>
                    <select
                      value={callerRelationship}
                      onChange={(e) => setCallerRelationship(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                    >
                      <option value="Spouse / Surviving Partner">Spouse / Surviving Partner</option>
                      <option value="Adult Child (Son / Daughter)">Adult Child (Son / Daughter)</option>
                      <option value="Parent (Father / Mother)">Parent (Father / Mother)</option>
                      <option value="Sibling (Brother / Sister)">Sibling (Brother / Sister)</option>
                      <option value="Grandchild / Niece / Nephew">Grandchild / Niece / Nephew</option>
                      <option value="Designated Healthcare Agent">Designated Healthcare Agent</option>
                      <option value="Estate Executor / Legal Fiduciary">Estate Executor / Legal Fiduciary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Cell / Mobile Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(212) 555-0198"
                      value={callerPhone}
                      onChange={(e) => {
                        const formatted = formatPhoneNumbersOnly(e.target.value);
                        setCallerPhone(formatted);
                        setInformantPhoneCell(formatted);
                        if (validationErrors.callerPhone) setValidationErrors(prev => ({ ...prev, callerPhone: '' }));
                      }}
                      className={`w-full bg-[#fbfbfd] border rounded-xl p-2.5 font-bold font-mono outline-none transition ${
                        validationErrors.callerPhone ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#800000]'
                      }`}
                    />
                    {validationErrors.callerPhone && (
                      <span className="text-[10px] text-red-600 font-semibold block mt-0.5">{validationErrors.callerPhone}</span>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Email Address (for What-to-Bring Packet) <span className="text-[#800000]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="robert.vance@example.com"
                      value={callerEmail}
                      onChange={(e) => {
                        setCallerEmail(e.target.value);
                        if (validationErrors.callerEmail) setValidationErrors(prev => ({ ...prev, callerEmail: '' }));
                      }}
                      className={`w-full bg-[#fbfbfd] border rounded-xl p-2.5 outline-none transition font-semibold ${
                        validationErrors.callerEmail ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#800000]'
                      }`}
                    />
                    {validationErrors.callerEmail && (
                      <span className="text-[10px] text-red-600 font-semibold block mt-0.5">{validationErrors.callerEmail}</span>
                    )}
                  </div>
                </div>

                {/* Additional Informant Contact Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3.5 pt-1">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1 text-xs">Home Phone</label>
                    <input
                      type="tel"
                      placeholder="(212) 555-0122"
                      value={informantPhoneHome}
                      onChange={(e) => setInformantPhoneHome(formatPhoneNumbersOnly(e.target.value))}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 font-mono text-xs outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1 text-xs">Alternate Phone</label>
                    <input
                      type="tel"
                      placeholder="(917) 555-0144"
                      value={informantPhoneAlt}
                      onChange={(e) => setInformantPhoneAlt(formatPhoneNumbersOnly(e.target.value))}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 font-mono text-xs outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-neutral-700 mb-1 text-xs">Informant Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 125 W 138th St"
                      value={informantAddressStreet || callerAddress}
                      onChange={(e) => {
                        setInformantAddressStreet(e.target.value);
                        setCallerAddress(e.target.value);
                      }}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1 text-xs">Apt / Suite</label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      value={informantAddressApt}
                      onChange={(e) => setInformantAddressApt(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1 text-xs">City, State / Zip</label>
                    <input
                      type="text"
                      placeholder="New York, NY 10030"
                      value={informantAddressCityStateCountry || (informantAddressZip ? `New York, NY ${informantAddressZip}` : '')}
                      onChange={(e) => {
                        setInformantAddressCityStateCountry(e.target.value);
                        const zipMatch = e.target.value.match(/\d{5}/);
                        if (zipMatch) setInformantAddressZip(zipMatch[0]);
                      }}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="rightToControlCheckbox"
                    checked={hasRightToControl}
                    onChange={(e) => setHasRightToControl(e.target.checked)}
                    className="w-4 h-4 accent-[#800000] cursor-pointer"
                  />
                  <label htmlFor="rightToControlCheckbox" className="text-[11px] text-amber-950 font-semibold cursor-pointer">
                    Caller certifies legal authority to control funeral arrangements under NYS Public Health Law § 4201.
                  </label>
                </div>
              </div>

              {/* Decedent Vital Statistics Section (Exact match to Vital Records Sheet) */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-serif-title font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#800000]" />
                    <span>Decedent Vital Statistics (NYS DOH Form AP-47 / EDRS Legal Record)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                    Official 2-Page Vital Record Sheet
                  </span>
                </div>

                {/* 1. Decedent Names & AKAs */}
                <div className="space-y-3 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block">
                    1. Decedent Legal Name & Other Known Names
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Eleanor"
                        value={decedentFirstName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDecedentFirstName(val);
                          setDecedentLegalName([val, decedentMiddleName, decedentLastName].filter(Boolean).join(' '));
                          if (validationErrors.decedentLegalName) setValidationErrors(prev => ({ ...prev, decedentLegalName: '' }));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Mae"
                        value={decedentMiddleName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDecedentMiddleName(val);
                          setDecedentLegalName([decedentFirstName, val, decedentLastName].filter(Boolean).join(' '));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vance"
                        value={decedentLastName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDecedentLastName(val);
                          setDecedentLegalName([decedentFirstName, decedentMiddleName, val].filter(Boolean).join(' '));
                          if (validationErrors.decedentLegalName) setValidationErrors(prev => ({ ...prev, decedentLegalName: '' }));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Any Other Known Names of Deceased (AKAs / Aliases)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ellie Vance, Mae Vance"
                      value={otherKnownNames}
                      onChange={(e) => setOtherKnownNames(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                {/* 2. Residence of Loved One */}
                <div className="space-y-3 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#800000]" />
                    <span>2. Residence of Loved One</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block font-bold text-neutral-700 mb-1">Street & Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 145 W 138th St"
                        value={residenceStreet}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResidenceStreet(val);
                          setResidenceAddress([val, residenceApt, residenceCity, residenceState, residenceZip].filter(Boolean).join(', '));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Apt # / Other</label>
                      <input
                        type="text"
                        placeholder="e.g. Apt 4B"
                        value={residenceApt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResidenceApt(val);
                          setResidenceAddress([residenceStreet, val, residenceCity, residenceState, residenceZip].filter(Boolean).join(', '));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={residenceCity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResidenceCity(val);
                          setResidenceAddress([residenceStreet, residenceApt, val, residenceState, residenceZip].filter(Boolean).join(', '));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="NY"
                        value={residenceState}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResidenceState(val);
                          setResidenceAddress([residenceStreet, residenceApt, residenceCity, val, residenceZip].filter(Boolean).join(', '));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        placeholder="10030"
                        value={residenceZip}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResidenceZip(val);
                          setResidenceAddress([residenceStreet, residenceApt, residenceCity, residenceState, val].filter(Boolean).join(', '));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Vital Demographics, Dates & Place of Death */}
                <div className="space-y-3 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block">
                    3. Vital Demographics, Dates & Place of Death
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Date of Death</label>
                      <input
                        type="date"
                        value={dateOfDeath}
                        onChange={handleDodChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Sex</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other / Non-Binary</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1">Education (Highest Level Completed)</label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                      >
                        <option value="">Select Education Level...</option>
                        <option value="8th grade or less">8th grade or less</option>
                        <option value="9th - 12th grade, no diploma">9th - 12th grade, no diploma</option>
                        <option value="High school graduate or GED completed">High school graduate or GED completed</option>
                        <option value="Some college credit, but no degree">Some college credit, but no degree</option>
                        <option value="Associate degree (e.g., AA, AS)">Associate degree (e.g., AA, AS)</option>
                        <option value="Bachelor's degree (e.g., BA, AB, BS)">Bachelor's degree (e.g., BA, AB, BS)</option>
                        <option value="Master's degree (e.g., MA, MS, MEng, MEd, MSW, MBA)">Master's degree (e.g., MA, MS, MEng, MEd, MSW, MBA)</option>
                        <option value="Doctorate (e.g., PhD, EdD) or Professional (e.g., MD, DDS, DVM, LLB, JD)">Doctorate (e.g., PhD, EdD) or Professional (e.g., MD, DDS, DVM, LLB, JD)</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Place of Death (Facility / Location)</label>
                      <input
                        type="text"
                        placeholder="e.g. Mount Sinai Morningside / Residence"
                        value={placeOfDeathFacility}
                        onChange={(e) => setPlaceOfDeathFacility(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Place of Death City</label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={placeOfDeathCity}
                        onChange={(e) => setPlaceOfDeathCity(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">State or Foreign Country</label>
                      <input
                        type="text"
                        placeholder="NY, USA"
                        value={placeOfDeathStateCountry}
                        onChange={(e) => setPlaceOfDeathStateCountry(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={handleDobChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Age (Years)</label>
                      <input
                        type="text"
                        placeholder="e.g. 78"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1">Birth Place (City, State or Foreign Country)</label>
                      <input
                        type="text"
                        placeholder="e.g. Charleston, SC, USA"
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Marital Status</label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value as any)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                      >
                        <option value="widowed">Widowed / Widower</option>
                        <option value="married">Married</option>
                        <option value="separated">Separated</option>
                        <option value="never_married">Never Married (Single)</option>
                        <option value="divorced">Divorced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        Social Security Number <span className="text-[10px] text-[#800000] font-mono">(9 Digits)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="123-45-6789"
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
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Race / Ethnicity</label>
                      <input
                        type="text"
                        placeholder="e.g. Black / African American"
                        value={race}
                        onChange={(e) => setRace(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Occupation, Industry & Military Heritage */}
                <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 block flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#800000]" />
                    <span>4. Occupation, Industry & Military Heritage</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Occupation Title (Primary Lifetime Career)</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Registered Nurse, Transit Motorman"
                        value={occupationTitle}
                        onChange={(e) => setOccupationTitle(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Type of Business / Industry</label>
                      <input
                        type="text"
                        placeholder="e.g. Healthcare / NYC Health + Hospitals, NYC Transit"
                        value={typeOfBusiness}
                        onChange={(e) => setTypeOfBusiness(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-amber-200/60">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Military Status</label>
                      <div className="flex items-center space-x-3 pt-1">
                        <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-neutral-800">
                          <input
                            type="checkbox"
                            checked={isVeteran}
                            onChange={(e) => {
                              setIsVeteran(e.target.checked);
                              if (e.target.checked) setIsActiveDuty(false);
                            }}
                            className="w-4 h-4 accent-[#800000]"
                          />
                          <span>U.S. Veteran</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-neutral-800">
                          <input
                            type="checkbox"
                            checked={isActiveDuty}
                            onChange={(e) => {
                              setIsActiveDuty(e.target.checked);
                              if (e.target.checked) setIsVeteran(false);
                            }}
                            className="w-4 h-4 accent-[#800000]"
                          />
                          <span>Active Duty</span>
                        </label>
                      </div>
                    </div>

                    {(isVeteran || isActiveDuty) && (
                      <div>
                        <label className="block font-bold text-neutral-700 mb-1">Military Branch</label>
                        <select
                          value={militaryBranch}
                          onChange={(e) => setMilitaryBranch(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                        >
                          <option value="">Select Military Branch...</option>
                          <option value="U.S. Army">U.S. Army</option>
                          <option value="U.S. Navy">U.S. Navy</option>
                          <option value="U.S. Air Force">U.S. Air Force</option>
                          <option value="U.S. Marine Corps">U.S. Marine Corps</option>
                          <option value="U.S. Coast Guard">U.S. Coast Guard</option>
                          <option value="U.S. Space Force">U.S. Space Force</option>
                          <option value="Army National Guard">Army National Guard</option>
                          <option value="Air National Guard">Air National Guard</option>
                          <option value="Merchant Marine (WWII)">Merchant Marine (WWII)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Parents & Spouse */}
                <div className="space-y-3 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#800000]" />
                    <span>5. Parents & Spouse Information</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Father's Full Legal Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Arthur Vance Sr."
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Mother's First & Maiden Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Mildred Hayes"
                        value={motherFirstAndMaidenName}
                        onChange={(e) => setMotherFirstAndMaidenName(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1">Name of Spouse (First & Maiden)</label>
                      <input
                        type="text"
                        placeholder="e.g. Robert William Vance"
                        value={spouseFirstAndMaidenName}
                        onChange={(e) => setSpouseFirstAndMaidenName(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Spouse Date of Birth</label>
                      <input
                        type="date"
                        value={spouseDateOfBirth}
                        onChange={(e) => setSpouseDateOfBirth(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Cemetery Deed & Previous Interment */}
                <div className="space-y-3 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 block flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#800000]" />
                    <span>6. Cemetery Deed & Previous Interment in Grave</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Deed Owner Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Robert Vance"
                        value={deedOwnerName}
                        onChange={(e) => setDeedOwnerName(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Deed Owner Address</label>
                      <input
                        type="text"
                        placeholder="e.g. 145 W 138th St, Apt 4B, New York, NY 10030"
                        value={deedOwnerAddress}
                        onChange={(e) => setDeedOwnerAddress(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Previous Interment: Who</label>
                      <input
                        type="text"
                        placeholder="e.g. Arthur Vance Sr."
                        value={previousIntermentWho}
                        onChange={(e) => setPreviousIntermentWho(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">When Interred (Year / Date)</label>
                      <input
                        type="text"
                        placeholder="e.g. 1998"
                        value={previousIntermentWhen}
                        onChange={(e) => setPreviousIntermentWhen(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">How Related to Decedent</label>
                      <input
                        type="text"
                        placeholder="e.g. Father"
                        value={previousIntermentRelation}
                        onChange={(e) => setPreviousIntermentRelation(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Verification Jurat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-100/80 p-3.5 rounded-xl border border-neutral-200">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Vital Information Reviewed / Provided By</label>
                    <input
                      type="text"
                      placeholder="e.g. Robert Vance"
                      value={reviewedOrProvidedBy}
                      onChange={(e) => setReviewedOrProvidedBy(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Verified On Date</label>
                    <input
                      type="date"
                      value={verifiedOnDate}
                      onChange={(e) => setVerifiedOnDate(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: REMOVAL READINESS & RESTING LOCATION TRIAGE       */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Removal Readiness Assessment Card */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-serif-title font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#800000]" />
                    <span>Removal Readiness Status (Is Loved One Ready for Removal?)</span>
                  </h4>
                  <span className="text-[10px] text-neutral-500">
                    Physical Transfer Coordination
                  </span>
                </div>

                {/* 4 Status Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Option 1: Pending Hospital / Doctor Release */}
                  <div
                    onClick={() => {
                      setRemovalReadiness('pending_hospital_release');
                      setRemovalReadinessNotes('Loved one is resting at facility. Removal pending physician/morgue clearance.');
                      setUrgency('pending_physician_release');
                    }}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      removalReadiness === 'pending_hospital_release'
                        ? 'bg-amber-50/90 border-amber-600 shadow-md ring-2 ring-amber-200'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        🟡 Not Ready for Removal
                      </span>
                      {removalReadiness === 'pending_hospital_release' && (
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-900 text-sm">
                        Pending Hospital / Doctor Release
                      </h5>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                        Loved one has died at the hospital/facility, but is <strong>NOT yet cleared</strong> for physical removal (e.g. physician certificate, autopsy, or morgue release pending).
                      </p>
                    </div>
                    <div className="text-[10px] text-amber-900 font-semibold pt-1 border-t border-amber-200/60">
                      ✓ Does NOT stall arrangement appointment booking
                    </div>
                  </div>

                  {/* Option 2: Family Arrangement Consultation First */}
                  <div
                    onClick={() => {
                      setRemovalReadiness('family_consultation_hold');
                      setRemovalReadinessNotes('Family requested in-person arrangement conference before initiating physical transport.');
                      setUrgency('scheduled_window');
                    }}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      removalReadiness === 'family_consultation_hold'
                        ? 'bg-brass-50/90 border-brass-700 shadow-md ring-2 ring-brass-200'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-brass-100 text-brass-900 border border-brass-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        🟠 Family Consultation First
                      </span>
                      {removalReadiness === 'family_consultation_hold' && (
                        <CheckCircle2 className="w-4 h-4 text-brass-700" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-900 text-sm">
                        Arrangement Consultation First (Hold Removal)
                      </h5>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                        Family wants to meet for the arrangement conference first to finalize details before authorizing physical removal from the facility.
                      </p>
                    </div>
                    <div className="text-[10px] text-brass-900 font-semibold pt-1 border-t border-brass-200/60">
                      ✓ Coordinates removal timing after arrangement conference
                    </div>
                  </div>

                  {/* Option 3: Ready for Immediate Removal Dispatch */}
                  <div
                    onClick={() => {
                      setRemovalReadiness('ready_immediate_removal');
                      setRemovalReadinessNotes('Facility release verified. Ready for immediate transport dispatch.');
                      setUrgency('stat_immediate');
                    }}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      removalReadiness === 'ready_immediate_removal'
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-200'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        🟢 Ready for Immediate Removal
                      </span>
                      {removalReadiness === 'ready_immediate_removal' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-900 text-sm">
                        Ready for Immediate Removal Dispatch
                      </h5>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                        Facility has released the decedent. First Call transfer van will be dispatched to secure physical custody immediately.
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-900 font-semibold pt-1 border-t border-emerald-200/60">
                      ✓ Instant custody logging & Safe Arrival tracking
                    </div>
                  </div>

                  {/* Option 4: Already in BFH Custody */}
                  <div
                    onClick={() => {
                      setRemovalReadiness('in_custody');
                      setRemovalReadinessNotes('Decedent safely arrived and resting at Benta Funeral Home.');
                    }}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      removalReadiness === 'in_custody'
                        ? 'bg-brass-50/90 border-brass-600 shadow-md ring-2 ring-brass-200'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-brass-100 text-brass-900 border border-brass-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        🔵 Already in Custody
                      </span>
                      {removalReadiness === 'in_custody' && (
                        <CheckCircle2 className="w-4 h-4 text-brass-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-900 text-sm">
                        Already in BFH Custody (630 St. Nicholas)
                      </h5>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                        Loved one is already safely present at Benta's Funeral Home. Focus directly on the upcoming arrangement conference.
                      </p>
                    </div>
                    <div className="text-[10px] text-brass-900 font-semibold pt-1 border-t border-brass-200/60">
                      ✓ Safe Arrival confirmed
                    </div>
                  </div>

                </div>
              </div>

              {/* Facility & Pickup Location Details */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-serif-title font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#800000]" />
                    <span>Facility / Hospital / Morgue Where Deceased is Resting</span>
                  </h4>
                  <select
                    value={selectedFacilityId}
                    onChange={handleFacilitySelect}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#800000]"
                  >
                    <option value="custom">🏠 Private Residence / Custom Facility</option>
                    <optgroup label="Tri-State Hospitals">
                      {TRI_STATE_HOSPITALS_DIRECTORY.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Nursing Homes & Hospices">
                      {TRI_STATE_NURSING_HOMES_DIRECTORY.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Facility / Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={facilityName}
                      onChange={(e) => {
                        setFacilityName(e.target.value);
                        if (validationErrors.facilityName) setValidationErrors(prev => ({ ...prev, facilityName: '' }));
                      }}
                      className={`w-full bg-[#fbfbfd] border rounded-xl p-2.5 font-bold outline-none transition ${
                        validationErrors.facilityName ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#800000]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Floor / Room / Morgue Bay</label>
                    <input
                      type="text"
                      value={facilityFloorRoom}
                      onChange={(e) => setFacilityFloorRoom(e.target.value)}
                      placeholder="e.g. Pathology / Morgue Bay 2"
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Facility Address</label>
                    <input
                      type="text"
                      value={facilityAddress}
                      onChange={(e) => setFacilityAddress(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Facility Phone</label>
                    <input
                      type="tel"
                      value={facilityContactPhone}
                      onChange={(e) => setFacilityContactPhone(formatPhoneNumbersOnly(e.target.value))}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Attending Physician / Certifier</label>
                    <input
                      type="text"
                      value={physicianName}
                      onChange={(e) => setPhysicianName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins, MD"
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Physician Phone</label>
                    <input
                      type="tel"
                      value={physicianPhone}
                      onChange={(e) => setPhysicianPhone(formatPhoneNumbersOnly(e.target.value))}
                      placeholder="(212) 555-0100"
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Physician License #</label>
                    <input
                      type="text"
                      value={physicianLicenseNumber}
                      onChange={(e) => setPhysicianLicenseNumber(e.target.value)}
                      placeholder="e.g. NY-284910"
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-mono outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Removal Readiness Notes</label>
                    <input
                      type="text"
                      value={removalReadinessNotes}
                      onChange={(e) => setRemovalReadinessNotes(e.target.value)}
                      placeholder="e.g. Awaiting pathology clearance"
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: ARRANGEMENT APPOINTMENT SCHEDULING               */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="font-serif-title font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#800000]" />
                    <span>In-Person or Virtual Arrangement Conference Scheduler</span>
                  </h4>
                  <span className="text-[10px] text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    630 St. Nicholas Ave
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={scheduledAppointmentDate}
                      onChange={(e) => setScheduledAppointmentDate(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold font-mono outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Appointment Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduledAppointmentTime}
                      onChange={(e) => setScheduledAppointmentTime(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#800000]"
                    >
                      <option value="09:00 AM">09:00 AM (Morning Slot)</option>
                      <option value="10:00 AM">10:00 AM (Primary Morning)</option>
                      <option value="11:30 AM">11:30 AM (Midday Slot)</option>
                      <option value="01:00 PM">01:00 PM (Early Afternoon)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon Slot)</option>
                      <option value="04:00 PM">04:00 PM (Late Afternoon)</option>
                      <option value="05:30 PM">05:30 PM (Evening Consultation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Meeting Venue / Suite</label>
                    <select
                      value={scheduledAppointmentVenue}
                      onChange={(e) => setScheduledAppointmentVenue(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                    >
                      <option value="630 St. Nicholas Ave - Arrangement Suite 1 (Ground Floor)">
                        Arrangement Suite 1 (Ground Floor)
                      </option>
                      <option value="630 St. Nicholas Ave - Arrangement Suite 2 (Executive Room)">
                        Arrangement Suite 2 (Executive Room)
                      </option>
                      <option value="Virtual Video Conference (Secure Zoom)">
                        Virtual Video Conference (Secure Zoom)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Lead Licensed Director</label>
                    <select
                      value={assignedDirectorId}
                      onChange={(e) => handleDirectorChange(e.target.value)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold outline-none focus:border-[#800000]"
                    >
                      {directorProfiles.filter(d => d.canMakeArrangements !== false && !d.isIndependentContractor).map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.title})</option>
                      ))}
                      {directorProfiles.length === 0 && (
                        <option value="dir-mgr-1">Jason Benta (Director in Charge / Managing LFD)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Expected Attending Family Members</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={attendingFamilyCount}
                        onChange={(e) => setAttendingFamilyCount(Number(e.target.value))}
                        className="w-24 bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-bold text-center outline-none focus:border-[#800000]"
                      />
                      <span className="text-neutral-500 text-xs">
                        Spokesperson: <strong>{callerName || 'Informant'}</strong> ({callerRelationship})
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Preliminary Service Type</label>
                    <select
                      value={dispositionType}
                      onChange={(e) => setDispositionType(e.target.value as any)}
                      className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 font-semibold outline-none focus:border-[#800000]"
                    >
                      <option value="undecided">To Be Determined / Consultation with Director</option>
                      <option value="full_cremation">Full Cremation with Chapel Viewing</option>
                      <option value="cremation_memorial">Cremation Memorial Service</option>
                      <option value="direct_cremation">Direct Cremation</option>
                      <option value="full_burial">Traditional Sanctuary Burial</option>
                      <option value="direct_burial">Direct Burial</option>
                    </select>
                  </div>
                </div>

                {/* Dispatch Toggles */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendConfirmationEmail}
                        onChange={(e) => setSendConfirmationEmail(e.target.checked)}
                        className="w-4 h-4 accent-[#800000] rounded"
                      />
                      <span className="font-bold text-neutral-800">
                        📧 Send Email Confirmation Packet to <strong className="text-[#800000]">{callerEmail || 'Caller Email'}</strong>
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendConfirmationSms}
                        onChange={(e) => setSendConfirmationSms(e.target.checked)}
                        className="w-4 h-4 accent-[#800000] rounded"
                      />
                      <span className="font-bold text-neutral-800">
                        📱 Send Instant SMS Confirmation to <strong className="text-[#800000]">{callerPhone || 'Caller Phone'}</strong>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: EMAIL PACKET & "WHAT TO BRING" GUIDE PREVIEW      */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-[#800000] flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-serif-title font-bold text-sm text-neutral-900">
                      Family Confirmation & "What to Bring" Packet Preview
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Dispatched immediately to <strong className="text-[#800000]">{callerEmail || 'informant@example.com'}</strong> and SMS to <strong className="text-neutral-800">{callerPhone || '(212) 555-0198'}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyEmailText}
                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs transition border border-neutral-300 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedEmailText ? '✓ Copied to Clipboard!' : 'Copy Email Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl text-xs transition border border-neutral-300 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Appointment Slip</span>
                  </button>
                </div>
              </div>

              {/* LIVE EMAIL RENDER CONTAINER */}
              <div className="bg-white border border-neutral-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
                
                {/* Brand Header */}
                <div className="border-b-2 border-[#800000] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center space-x-3 justify-center sm:justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#800000] text-white flex items-center justify-center font-serif-title font-bold text-xl border-2 border-amber-400/60 shadow-md">
                      BFH
                    </div>
                    <div>
                      <h3 className="font-serif-title font-bold text-xl text-[#800000]">
                        BENTA'S FUNERAL HOME
                      </h3>
                      <p className="text-[10px] text-[#b45309] font-bold uppercase tracking-widest">
                        Four Generations of Compassion & Dignity • EST. 1928
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-neutral-500 font-light">
                    <p className="font-semibold text-neutral-800">630 Saint Nicholas Avenue</p>
                    <p>New York, NY 10030</p>
                    <p className="text-[#800000] font-bold">24/7 Careline: (212) 281-8850</p>
                  </div>
                </div>

                {/* Email Salutation */}
                <div className="space-y-2 text-xs leading-relaxed text-neutral-700">
                  <p className="font-bold text-neutral-900 text-sm">
                    Dear {callerName || 'Family Representative'},
                  </p>
                  <p>
                    Thank you for calling Benta's Funeral Home. We extend our deepest sympathy to you and your loved ones on the passing of <strong className="text-neutral-900">{decedentLegalName || 'your beloved'}</strong>. We are honored to care for your family during this sacred time.
                  </p>
                </div>

                {/* Stately Appointment Card */}
                <div className="bg-gradient-to-br from-red-50/90 via-[#fffcf9] to-amber-50/90 border-2 border-red-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-red-200 pb-2">
                    <span className="font-serif-title font-bold text-xs uppercase tracking-wider text-[#800000] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#800000]" />
                      <span>Confirmed Arrangement Conference Details</span>
                    </span>
                    <span className="bg-[#800000] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Confirmed Appointment
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">Date & Time:</span>
                      <strong className="text-sm text-neutral-900 font-serif-title">
                        {new Date(scheduledAppointmentDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {scheduledAppointmentTime}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">Location / Meeting Venue:</span>
                      <p className="text-neutral-900 font-semibold">{scheduledAppointmentVenue}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">Lead Licensed Director:</span>
                      <p className="text-neutral-900 font-semibold">{assignedDirectorName} (NYS LFD Reg. #08850)</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">Attending Family:</span>
                      <p className="text-neutral-900 font-semibold">{callerName} ({callerRelationship}) + {attendingFamilyCount - 1} Guests</p>
                    </div>
                  </div>
                </div>

                {/* Loved One Location & Removal Status Banner */}
                <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-3 ${
                  removalReadiness === 'pending_hospital_release'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : removalReadiness === 'family_consultation_hold'
                    ? 'bg-brass-50/90 border-brass-300 text-brass-950'
                    : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                }`}>
                  <div className={`p-2 rounded-xl text-white font-bold shrink-0 ${
                    removalReadiness === 'pending_hospital_release' ? 'bg-amber-600' : removalReadiness === 'family_consultation_hold' ? 'bg-brass-700' : 'bg-emerald-600'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold">
                      Current Resting Status: {facilityName} ({facilityFloorRoom})
                    </strong>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {removalReadiness === 'pending_hospital_release' && (
                        <span>Your loved one is currently resting safely at {facilityName}. Our direct transport team will coordinate release with the pathology/morgue desk once physician paperwork clears.</span>
                      )}
                      {removalReadiness === 'family_consultation_hold' && (
                        <span>As requested, physical removal will be coordinated immediately following our in-person arrangement conference.</span>
                      )}
                      {removalReadiness === 'ready_immediate_removal' && (
                        <span>Our transport crew has been dispatched to secure physical custody at {facilityName}.</span>
                      )}
                      {removalReadiness === 'in_custody' && (
                        <span>Your loved one is safely present at Benta's Funeral Home under our care.</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* 4-PART "WHAT TO BRING" INTERACTIVE CHECKLIST              */}
                {/* ========================================================= */}
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-1">
                    <h4 className="font-serif-title font-bold text-sm text-[#800000] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>What to Bring to Your Arrangement Conference</span>
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-light">
                      Please bring as many of the following items as possible to ensure seamless legal filings:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Item Category 1 */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                      <span className="font-bold text-[#800000] text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>1. Vital Records & State Statistics</span>
                      </span>
                      <ul className="text-[11px] text-neutral-700 space-y-1.5 list-disc list-inside">
                        <li>Full legal name and full Social Security Number</li>
                        <li>Exact date & city/state of birth</li>
                        <li>Father’s full name & Mother’s full maiden name</li>
                        <li>Highest education level & primary occupation/industry</li>
                        <li>Military Discharge papers (Form DD-214) if veteran</li>
                      </ul>
                    </div>

                    {/* Item Category 2 */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                      <span className="font-bold text-[#b45309] text-xs flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>2. Clothing, Grooming & Cosmetics</span>
                      </span>
                      <ul className="text-[11px] text-neutral-700 space-y-1.5 list-disc list-inside">
                        <li>Complete outfit from inside out (undergarments, suit/dress)</li>
                        <li>Shoes, stockings/socks, belt & accessories</li>
                        <li>Eyeglasses, rosaries, or masonic/veteran pins</li>
                        <li>Jewelry instructions (indicate if items stay or return)</li>
                        <li>Recent color photograph for natural hairstyling reference</li>
                      </ul>
                    </div>

                    {/* Item Category 3 */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                      <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>3. Legal, Insurance & Cemetery Deeds</span>
                      </span>
                      <ul className="text-[11px] text-neutral-700 space-y-1.5 list-disc list-inside">
                        <li>Government-issued photo ID of Next of Kin / Informant</li>
                        <li>NYS PHL § 4201 Right of Disposition paperwork</li>
                        <li>Life Insurance policies (for direct assignment/funding)</li>
                        <li>Existing Cemetery Deed / Plot certificate (if owned)</li>
                      </ul>
                    </div>

                    {/* Item Category 4 */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                      <span className="font-bold text-brass-900 text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-brass-700" />
                        <span>4. Memorial & Tribute Materials</span>
                      </span>
                      <ul className="text-[11px] text-neutral-700 space-y-1.5 list-disc list-inside">
                        <li>25 to 50 family photos for 360° Tribute & 4-panel program</li>
                        <li>Written list of surviving and predeceased family members</li>
                        <li>Special musical selections, scripture verses, or hymns</li>
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Action Links Buttons */}
                <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-3 items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#800000] text-white px-3.5 py-2 rounded-xl font-bold inline-flex items-center gap-1 shadow-xs">
                      <span>✓ Pre-Fill Vital Records Sheet Online</span>
                    </span>
                    <span className="bg-neutral-100 text-neutral-800 px-3.5 py-2 rounded-xl font-bold inline-flex items-center gap-1 border border-neutral-300">
                      <span>🔒 Access Family Vault (PIN: 3995)</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-neutral-500 italic">
                    Benta’s Funeral Home Careline: (212) 281-8850
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER: NAVIGATION & FINAL SUBMISSION */}
        <div className="px-6 py-4 bg-white border-t border-neutral-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          
          <div className="flex items-center space-x-2 text-neutral-500 text-xs">
            <Info className="w-4 h-4 text-[#800000]" />
            <span>Step {currentStep} of 4 • Case auto-generates with complete Golden Record.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1) {
                    if (!validateForm()) return;
                  }
                  setCurrentStep((currentStep + 1) as any);
                }}
                className="px-5 py-2.5 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 border border-amber-400/40"
              >
                <span>Continue to {currentStep === 1 ? 'Removal Readiness' : currentStep === 2 ? 'Appointment' : 'Email Preview'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit('save_only')}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold rounded-xl text-xs transition shadow-2xs"
                >
                  Save to Hub Only
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit('open_appointment')}
                  className="px-5 py-2.5 bg-[#800000] hover:bg-[#6a0509] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 border border-amber-400/40 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-300" />
                  <span>Create Case & Dispatch Preparation Packet ➔</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
