import { 
  GoldenRecordCase, 
  DocumentItem, 
  FacilityRoom, 
  RoomScheduleEvent, 
  SimulatedNotification, 
  VehicleHoldRequest,
  ServicePartnerContact,
  PartnerScheduleRequest,
  CaseFlightPhaseProgress,
  DirectorProfile,
  ServiceDirectorAssignment,
  Director1099Voucher
} from '../types/funeral';

export const INITIAL_DOCUMENT_TEMPLATES: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Vital Record Information',
    formType: 'vital_records',
    phase: 'intake_removal',
    triggerTiming: 'Initial Intake',
    destinationRecipient: 'Next of Kin / Informant',
    deliveryMethod: 'Digital Portal',
    status: 'completed',
    followUpAction: 'NYC EDRS Vital Statistics data capture & informant verification',
    lastUpdated: '2026-09-18 10:15 AM'
  },
  {
    id: 'doc-2',
    name: "NYC Dept of Hospitals - Funeral Director's Statement of Authority",
    formType: 'nyc_authority',
    phase: 'intake_removal',
    triggerTiming: 'At Removal / Pickup',
    destinationRecipient: 'Hospital / Health Care Facility',
    deliveryMethod: 'Physical/PDF',
    status: 'completed',
    followUpAction: 'Release of death certificate and physical custody of remains',
    lastUpdated: '2026-09-18 10:45 AM'
  },
  {
    id: 'doc-3',
    name: 'Engagement of Services & Financial Responsibility Affidavit',
    formType: 'engagement_financial',
    phase: 'intake_removal',
    triggerTiming: 'Upon Removal Authorization',
    destinationRecipient: 'Next of Kin / Person Engaging',
    deliveryMethod: 'eSign Portal',
    status: 'completed',
    followUpAction: 'Financial engagement binding & removal custody jurat',
    lastUpdated: '2026-09-18 11:30 AM'
  },
  {
    id: 'doc-4',
    name: 'Safe Arrival Confirmation & Custody Receipt',
    formType: 'general_document',
    phase: 'intake_removal',
    triggerTiming: 'Upon arrival at 630 St Nicholas',
    destinationRecipient: 'Next of Kin (NOK)',
    deliveryMethod: 'Email/SMS',
    status: 'completed',
    followUpAction: 'Immediate peace of mind for family upon arrival at BFH',
    lastUpdated: '2026-09-18 12:00 PM'
  },
  {
    id: 'doc-5',
    name: 'Itemization of Funeral Services & Merchandise Selected (Statement of Goods & Services)',
    formType: 'statement_goods_services',
    phase: 'arrangements',
    triggerTiming: 'Arrangement Conference',
    destinationRecipient: 'Next of Kin (NOK)',
    deliveryMethod: 'eSign Portal',
    status: 'generated',
    followUpAction: 'FTC General Price List compliance & itemized charge agreement',
    lastUpdated: '2026-09-18 01:15 PM'
  },
  {
    id: 'doc-6',
    name: 'Clothing Transmittal Form',
    formType: 'clothing_transmittal',
    phase: 'arrangements',
    triggerTiming: 'Garment Delivery',
    destinationRecipient: 'Preparation Suite / Hairdresser',
    deliveryMethod: 'Physical/PDF',
    status: 'generated',
    followUpAction: 'Log 12 clothing items, casket specs, and hairdresser assignment',
    lastUpdated: '2026-09-18 01:45 PM'
  },
  {
    id: 'doc-7',
    name: 'Client Production Package Overview (DVD, Programs, Prayer Cards)',
    formType: 'client_production',
    phase: 'arrangements',
    triggerTiming: 'Arrangement Conference',
    destinationRecipient: 'Digiprint / Media Production',
    deliveryMethod: 'Digital Portal',
    status: 'generated',
    followUpAction: 'Print order, DVD slideshow, photo placement & prayer card verse',
    lastUpdated: '2026-09-18 02:30 PM'
  },
  {
    id: 'doc-8',
    name: 'At-Need Written Statement of Person Having Right to Control Disposition (NYS § 4201)',
    formType: 'right_to_control',
    phase: 'legal_bundle',
    triggerTiming: 'Post-Consultation',
    destinationRecipient: 'Next of Kin (NOK)',
    deliveryMethod: 'eSign Portal',
    status: 'signed',
    followUpAction: 'NYS Public Health Law § 4201 statutory priority compliance',
    lastUpdated: '2026-09-18 03:00 PM',
    isUrgent: true
  },
  {
    id: 'doc-9',
    name: 'Woodlawn Crematory Authorization & Dispatch Packet',
    formType: 'woodlawn_cremation',
    phase: 'legal_bundle',
    triggerTiming: 'Pre-Cremation',
    destinationRecipient: 'Woodlawn Crematory (Bronx, NY)',
    deliveryMethod: 'eSign Portal',
    status: 'urgent',
    followUpAction: 'Required prior to booking crematory witness slot',
    isUrgent: true
  },
  {
    id: 'doc-10',
    name: 'NYC EDRS Certified Death Certificate & Burial/Cremation Permit',
    formType: 'edrs_permit',
    phase: 'permits_logistics',
    triggerTiming: 'Post-Physician Certification',
    destinationRecipient: 'NYC Dept of Health & Mental Hygiene',
    deliveryMethod: 'Online Portal',
    status: 'approved',
    followUpAction: 'EDRS Permit #NYC-EDRS-2026-44910 synced to Golden Record'
  },
  {
    id: 'doc-11',
    name: 'Service Logistics Info Sheet (Officiant & Organist)',
    formType: 'service_sheet',
    phase: 'permits_logistics',
    triggerTiming: '72hrs Before Service',
    destinationRecipient: 'Officiant / Musician / Pallbearers',
    deliveryMethod: 'Email/SMS',
    status: 'sent',
    followUpAction: 'Vendor confirmation logged in Partner SMS queue'
  },
  {
    id: 'doc-12',
    name: 'Final Itemized Statement of Account & Payment Receipt',
    formType: 'statement_goods_services',
    phase: 'finalization_aftercare',
    triggerTiming: 'Post-Service Finalization',
    destinationRecipient: 'Next of Kin / Estate',
    deliveryMethod: 'Email/Portal',
    status: 'pending',
    followUpAction: 'ACH verification & insurance assignment payout release'
  },
  {
    id: 'doc-13',
    name: 'Day 7 / 30 Bereavement Care Guide & Certificate of Completed Disposition',
    formType: 'general_document',
    phase: 'finalization_aftercare',
    triggerTiming: '7 Days Post-Service',
    destinationRecipient: 'Next of Kin (NOK)',
    deliveryMethod: 'Email/Portal',
    status: 'pending',
    followUpAction: 'Aftercare check-in & Digi-Tribute memory archive access'
  }
];





export const MOCK_CASES: GoldenRecordCase[] = [];

export const FACILITY_ROOMS: FacilityRoom[] = [
  {
    id: 'chapel_1',
    name: 'Chapel 1 (Main Sanctuary)',
    code: 'CHAP-1',
    capacity: 120,
    type: 'chapel',
    features: ['120 Guest Capacity', 'HD Live-Stream Cameras', 'Pipe Organ & Steinway Piano', 'Private Family Alcove', 'ADA Accessible'],
    color: 'border-red-500 bg-red-50/50 text-[#991b1b]'
  },
  {
    id: 'chapel_2',
    name: 'Chapel 2 (Harlem Sanctuary)',
    code: 'CHAP-2',
    capacity: 110,
    type: 'chapel',
    features: ['110 Guest Capacity', '360° Digi-Tribute Screens', 'Dedicated Family Lounge', 'Dedicated Floral Staging', 'Surround Audio'],
    color: 'border-amber-500 bg-amber-50/50 text-[#b45309]'
  },
  {
    id: 'repast_room',
    name: 'Repast Room (Hospitality & Dining)',
    code: 'REPAST',
    capacity: 75,
    type: 'repast',
    features: ['75 Seated Dining', 'Catering Warming Kitchen', 'Family Reception Buffet', 'Beverage Bar', 'Audio Visual Display'],
    color: 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
  },
  {
    id: 'family_suite_1',
    name: 'Family Suite 1 (Comfort & Intake)',
    code: 'SUITE-1',
    capacity: 15,
    type: 'suite',
    features: ['15 Guest Seating', 'Golden Record Intake Terminal', 'Private Restroom', 'Refreshment Station', 'Acoustic Privacy'],
    color: 'border-blue-500 bg-blue-50/50 text-blue-800'
  },
  {
    id: 'family_suite_2',
    name: 'Family Suite 2 (Consultation & Pre-Need)',
    code: 'SUITE-2',
    capacity: 10,
    type: 'suite',
    features: ['10 Guest Seating', 'Pre-Need Planning Terminal', 'Legal eSign Pad Station', 'FDIC Trust Review'],
    color: 'border-purple-500 bg-purple-50/50 text-purple-800'
  },
  {
    id: 'parlor_a',
    name: 'Parlor A (North Salon)',
    code: 'PARL-A',
    capacity: 60,
    type: 'parlor',
    features: ['60 Guest Capacity', 'Intimate Viewing Staging', 'Digital Photo Tribute Screen', 'Plush Parlor Seating'],
    color: 'border-rose-400 bg-rose-50/50 text-rose-800'
  },
  {
    id: 'parlor_b',
    name: 'Parlor B (Central Salon)',
    code: 'PARL-B',
    capacity: 50,
    type: 'parlor',
    features: ['50 Guest Capacity', 'Candlelit Viewing Alcove', 'Surround Sound Music', 'Floral Displays'],
    color: 'border-amber-400 bg-amber-50/50 text-amber-800'
  },
  {
    id: 'parlor_c',
    name: 'Parlor C (South Salon)',
    code: 'PARL-C',
    capacity: 40,
    type: 'parlor',
    features: ['40 Guest Capacity', 'Quiet Family Vigils', 'Private Visitation', 'Historic Mahogany Millwork'],
    color: 'border-teal-500 bg-teal-50/50 text-teal-800'
  },
  {
    id: 'parlor_ab',
    name: 'Parlor AB (Combined Salons A+B)',
    code: 'PARL-AB',
    capacity: 110,
    type: 'parlor',
    features: ['110 Guest Capacity', 'Double Salon Layout', 'Dual Viewing Areas', 'Broad Family Reception Area'],
    color: 'border-orange-500 bg-orange-50/50 text-orange-800'
  },
  {
    id: 'parlor_abc',
    name: 'Parlor ABC (Grand Combined Suite)',
    code: 'PARL-ABC',
    capacity: 150,
    type: 'parlor',
    features: ['150 Guest Capacity', 'Full Floor Parlor Suite', 'Triple Display Screens', 'Grand Cortege Staging'],
    color: 'border-red-600 bg-red-100/50 text-red-900 font-bold'
  },
  {
    id: 'church',
    name: 'Church (Offsite Sanctuary Cortege)',
    code: 'CHURCH',
    capacity: 500,
    type: 'offsite',
    features: ['Cathedral / Church Service', 'Director Escort & Pallbearers', 'Hearse & Livery Procession Staging'],
    color: 'border-indigo-500 bg-indigo-50/50 text-indigo-800'
  },
  {
    id: 'other',
    name: 'Other (Crematory / Graveside)',
    code: 'OTHER',
    capacity: 100,
    type: 'offsite',
    features: ['Woodlawn Crematory Witness Room', 'Cemetery Graveside Pavilion', 'External Logistics'],
    color: 'border-slate-500 bg-slate-50/50 text-slate-800'
  }
];





export const INITIAL_CALENDAR_EVENTS: RoomScheduleEvent[] = [];

export const INITIAL_LIVERY_HOLDS: VehicleHoldRequest[] = [];

export const INITIAL_NOTIFICATIONS: SimulatedNotification[] = [];

export const INITIAL_SERVICE_PARTNERS: ServicePartnerContact[] = [
  // --- HAIR / RESTORATIVE GROOMING ---
  {
    id: 'sp-hair-01',
    fullName: 'Kelvin Brooks',
    roleTitle: 'Master Restorative Barber & Stylist',
    category: 'hairdresser_barber',
    phone: '(646) 508-3474',
    email: 'kbrooks@harlemhaircare.com',
    organization: 'Brooks Restorative Grooming Lounge',
    status: 'active',
    rateInfo: '$175 / styling session',
    notes: 'Harlem master barber. Precision hairlines, restorative facial grooming, and cosmetic presentation.',
    avatarInitials: 'KB'
  },
  {
    id: 'sp-hair-02',
    fullName: 'Tanisha Carey',
    roleTitle: 'Licensed Cosmetologist & Hair Stylist',
    category: 'hairdresser_barber',
    phone: '(347) 605-8707',
    email: 'tcarey@studiocareynyc.com',
    organization: 'Carey Hair & Cosmetology Studio',
    status: 'active',
    rateInfo: '$225 / full service',
    notes: 'Specializes in textured hair artistry, custom wigs, silk press, and delicate cosmetic styling.',
    avatarInitials: 'TC'
  },
  {
    id: 'sp-hair-03',
    fullName: 'Renee- Zomelia Thomas',
    roleTitle: 'Senior Hair Stylist & Cosmetologist',
    category: 'hairdresser_barber',
    phone: '(646) 285-2851',
    email: 'rzthomas@harlembeauty.nyc',
    organization: 'Zomelia Thomas Hair Design',
    status: 'active',
    rateInfo: '$200 / styling session',
    notes: 'Expert cosmetologist for funeral and memorial presentations, wig maintenance, and cosmetic care.',
    avatarInitials: 'RT'
  },
  {
    id: 'sp-001',
    fullName: 'Marcus "Cuts" Jenkins',
    roleTitle: 'Master Restorative Barber & Grooming Specialist',
    category: 'hairdresser_barber',
    phone: '(212) 555-0419',
    email: 'marcus@harlemcuts.com',
    organization: 'Apollo Grooming & Barber Lounge (Harlem)',
    status: 'active',
    rateInfo: '$175 / session (Styling & Shave)',
    notes: '25 years experience in Harlem. Specialized in restorative facial grooming, precision hairlines, and peaceful cosmetic styling.',
    avatarInitials: 'MJ'
  },
  {
    id: 'sp-002',
    fullName: 'Danielle St. Claire',
    roleTitle: 'Licensed Cosmetologist & Hairdresser',
    category: 'hairdresser_barber',
    phone: '(917) 555-8842',
    email: 'danielle@stclaireglamour.nyc',
    organization: 'St. Claire Beauty Suite & Restorative Care',
    status: 'active',
    rateInfo: '$250 / service (Full Hair, Crown & Nails)',
    notes: 'Specializes in textured hair styling, custom wigs, press & curl, and delicate nail artistry.',
    avatarInitials: 'DS'
  },

  // --- MINISTERS & CLERGY ---
  {
    id: 'sp-min-01',
    fullName: 'Rev. James Logan',
    roleTitle: 'Senior Pastor & Homegoing Minister',
    category: 'minister_clergy',
    phone: '(201) 274-4430',
    email: 'revjlogan@harlemministries.org',
    organization: 'Metropolitan Clergy Council',
    status: 'active',
    rateInfo: '$300 Honorarium',
    notes: 'Experienced in comforting family scripture reading, prayers of comfort, and celebratory eulogies.',
    avatarInitials: 'JL'
  },
  {
    id: 'sp-min-02',
    fullName: 'Pas. Terrance Kennedy',
    roleTitle: 'Pastor & Liturgical Celebrant',
    category: 'minister_clergy',
    phone: '(917) 763-6714',
    email: 'pastorkennedy@harlemgospel.org',
    organization: 'New Life Christian Fellowship',
    status: 'active',
    rateInfo: '$300 Honorarium',
    notes: 'Provides pastoral leadership, family homegoing eulogies, and scripture liturgy.',
    avatarInitials: 'TK'
  },
  {
    id: 'sp-min-03',
    fullName: 'Pas. Gooding',
    roleTitle: 'Pastor & Eulogist',
    category: 'minister_clergy',
    phone: '(917) 769-4449',
    email: 'pasgooding@faithharlem.org',
    organization: 'Harlem Faith Community Alliance',
    status: 'active',
    rateInfo: '$300 Honorarium',
    notes: 'Specializes in uplifting homegoing sermons and interfaith prayers of comfort.',
    avatarInitials: 'PG'
  },
  {
    id: 'sp-min-04',
    fullName: 'Rev. Eric Turner',
    roleTitle: 'Senior Clergy & Memorial Celebrant',
    category: 'minister_clergy',
    phone: '(347) 490-6847',
    email: 'revericturner@turnerministries.org',
    organization: 'Turner Fellowship Ministries',
    status: 'active',
    rateInfo: '$300 Honorarium',
    notes: 'Orator and pastor providing comforting funeral liturgies and memorial celebrations.',
    avatarInitials: 'ET'
  },
  {
    id: 'sp-009',
    fullName: 'Rev. Dr. Calvin O. Butts IV',
    roleTitle: 'Senior Clergy & Memorial Eulogist',
    category: 'minister_clergy',
    phone: '(212) 555-8833',
    email: 'cbutts@harlemfaithalliance.org',
    organization: 'Harlem Interfaith Clergy Council',
    status: 'active',
    rateInfo: '$350 Honorarium',
    notes: 'Renowned Harlem pastor and orator. Experienced in comforting families across Christian, Baptist, Methodist, and non-denominational backgrounds.',
    avatarInitials: 'CB'
  },
  {
    id: 'sp-010',
    fullName: 'Pastor Thomas Wright',
    roleTitle: 'Senior Pastor & Homegoing Celebrant',
    category: 'minister_clergy',
    phone: '(917) 555-9912',
    email: 'pastor.wright@canaanharlem.org',
    organization: 'Canaan Baptist Church of Christ',
    status: 'active',
    rateInfo: '$300 Honorarium',
    notes: 'Provides compassionate pre-service family prayer, scripture reading, and inspiring eulogies.',
    avatarInitials: 'TW'
  },
  {
    id: 'sp-011',
    fullName: 'Elder Janice Montgomery',
    roleTitle: 'Certified Interfaith Funeral Celebrant & Life Story Eulogist',
    category: 'minister_clergy',
    phone: '(212) 555-6670',
    email: 'janice@celebrantnyc.com',
    organization: 'NYC Certified Celebrants Network',
    status: 'active',
    rateInfo: '$350 / customized celebration of life',
    notes: 'Specializes in personalized non-denominational, spiritual, and customized biographical celebrations of life.',
    avatarInitials: 'JM'
  },

  // --- ORGANISTS & MUSICIANS ---
  {
    id: 'sp-mus-01',
    fullName: 'Brvon Neal',
    roleTitle: 'Principal Sanctuary Organist & Pianist',
    category: 'musician_organist',
    phone: '(347) 993-5579',
    email: 'bneal@harlemmusic.org',
    organization: 'Harlem Music Ministry',
    status: 'active',
    rateInfo: '$250 / service (Prelude, Hymns, Postlude)',
    notes: 'Master pipe organist and classical accompanist for church and chapel celebrations.',
    avatarInitials: 'BN'
  },
  {
    id: 'sp-mus-02',
    fullName: 'Fabian Ralph',
    roleTitle: 'Concert Organist & Vocal Accompanist',
    category: 'musician_organist',
    phone: '(646) 245-9791',
    email: 'fralph@metrogospelmusic.com',
    organization: 'Metropolitan Gospel Organists Guild',
    status: 'active',
    rateInfo: '$275 / service',
    notes: 'Renowned organist specializing in traditional hymns, gospel anthems, and prelude interludes.',
    avatarInitials: 'FR'
  },
  {
    id: 'sp-mus-03',
    fullName: 'Pas. Terrance Kennedy (Organist)',
    roleTitle: 'Minister of Music & Sanctuary Organist',
    category: 'musician_organist',
    phone: '(917) 763-6714',
    email: 'pastorkennedy.music@harlemgospel.org',
    organization: 'New Life Christian Fellowship',
    status: 'active',
    rateInfo: '$250 / service',
    notes: 'Dual ministry: Hammond B3 gospel organist and musical accompanist.',
    avatarInitials: 'TK'
  },
  {
    id: 'sp-mus-04',
    fullName: 'Rev. Eric Turner (Organist)',
    roleTitle: 'Liturgical Organist & Pianist',
    category: 'musician_organist',
    phone: '(347) 490-6847',
    email: 'revericturner.music@turnerministries.org',
    organization: 'Turner Fellowship Ministries',
    status: 'active',
    rateInfo: '$250 / service',
    notes: 'Sanctuary pipe and electronic organist for sacred services.',
    avatarInitials: 'ET'
  },
  {
    id: 'sp-007',
    fullName: 'Marcus Roberts',
    roleTitle: 'Principal Sanctuary Organist & Concert Pianist',
    category: 'musician_organist',
    phone: '(212) 555-3920',
    email: 'mroberts@harlemclassical.org',
    organization: 'Abyssinian Music Ministry / Harlem Choral Trust',
    status: 'active',
    rateInfo: '$300 / service (Prelude, 3 Hymns, Solo, Postlude)',
    notes: 'Master of classical pipe organ, Hammond B3 gospel organ, and classical piano accompaniments.',
    avatarInitials: 'MR'
  },
  {
    id: 'sp-008',
    fullName: 'Sister Angela Davis-Thorpe',
    roleTitle: 'Gospel Soloist & Vocal Choral Director',
    category: 'musician_organist',
    phone: '(646) 555-1178',
    email: 'angela.soloist@faithharlem.org',
    organization: 'Harlem Gospel Heritage Vocalists',
    status: 'active',
    rateInfo: '$225 / 2 solo pieces ("Precious Lord", "Going Up Yonder")',
    notes: 'Acclaimed gospel vocalist. Specializes in traditional African American spirituals and modern gospel anthems.',
    avatarInitials: 'AD'
  },

  // --- FUNERAL DIRECTORS (TRADE DIRECTORS) ---
  {
    id: 'sp-trade-01',
    fullName: 'Curvelle Larcque',
    roleTitle: 'Licensed Trade Funeral Director',
    category: 'outside_director',
    phone: '(347) 724-1998',
    email: 'clarcque@nytradefuneral.org',
    organization: 'New York State Licensed Trade Directors Guild',
    status: 'active',
    rateInfo: '$350 / 4-hour chapel service • $550 full day',
    notes: 'Licensed trade director available for chapel services, church liturgies, and cemetery transfers.',
    avatarInitials: 'CL'
  },
  {
    id: 'sp-trade-02',
    fullName: 'Pierre Cobb',
    roleTitle: 'Licensed Trade Funeral Director',
    category: 'outside_director',
    phone: '(718) 350-1441',
    email: 'pcobb@nytradefuneral.org',
    organization: 'New York State Licensed Trade Directors Guild',
    status: 'active',
    rateInfo: '$350 / 4-hour chapel service • $550 full day',
    notes: 'Licensed trade director specializing in cortege coordination and family ceremonies.',
    avatarInitials: 'PC'
  },
  {
    id: 'sp-trade-03',
    fullName: 'Cory Vaughn-Daniels',
    roleTitle: 'Licensed Trade Funeral Director',
    category: 'outside_director',
    phone: '(646) 701-1966',
    email: 'cvdaniels@nytradefuneral.org',
    organization: 'Harlem Independent Funeral Directing Services',
    status: 'active',
    rateInfo: '$350 / 4-hour chapel service • $550 full day',
    notes: 'Licensed trade director with extensive experience in Harlem memorials and cemetery committals.',
    avatarInitials: 'CD'
  },
  {
    id: 'sp-trade-04',
    fullName: 'Sylvia Saxton',
    roleTitle: 'Licensed Trade Funeral Director',
    category: 'outside_director',
    phone: '(862) 368-4706',
    email: 'ssaxton@nytradefuneral.org',
    organization: 'New York State Licensed Trade Directors Guild',
    status: 'active',
    rateInfo: '$350 / 4-hour chapel service • $550 full day',
    notes: 'Licensed trade director skilled in arrangement protocol, family care, and service direction.',
    avatarInitials: 'SS'
  },
  {
    id: 'sp-trade-05',
    fullName: 'Delyce Edwards',
    roleTitle: 'Licensed Trade Funeral Director',
    category: 'outside_director',
    phone: '(646) 408-3350',
    email: 'dedwards@nytradefuneral.org',
    organization: 'New York State Licensed Trade Directors Guild',
    status: 'active',
    rateInfo: '$350 / 4-hour chapel service • $550 full day',
    notes: 'Licensed trade director for chapel viewings, church ceremonies, and graveside committals.',
    avatarInitials: 'DE'
  },
  {
    id: 'sp-003',
    fullName: 'Anthony R. Washington, LFD',
    roleTitle: 'Senior Trade Funeral Director (NYS Lic #14892)',
    category: 'outside_director',
    phone: '(646) 555-3310',
    email: 'anthony.washington.lfd@metroguild.org',
    organization: 'New York State Licensed Trade Directors Guild',
    status: 'active',
    rateInfo: '$400 / 4-hour chapel coverage • $600 / full day & cortege',
    notes: 'Available for per diem director coverage, evening wakes, Woodlawn crematory cortege management, and graveside committals.',
    avatarInitials: 'AW'
  },
  {
    id: 'sp-004',
    fullName: 'Cheryl Robinson, LFD',
    roleTitle: 'Per Diem Funeral Director & Service Escort',
    category: 'outside_director',
    phone: '(212) 555-7791',
    email: 'crobinson.director@gmail.com',
    organization: 'Harlem Independent Funeral Directing Services',
    status: 'on_call',
    rateInfo: '$350 / 4-hour service',
    notes: 'Expert in Baptist & Episcopal liturgy protocols, family greeting, and VIP dignitary escorts.',
    avatarInitials: 'CR'
  },

  // --- PALLBEARERS & CORTEGE GUILD ---
  {
    id: 'sp-005',
    fullName: 'Harlem Dignified Bearers Guild (Lead: Jamal Hayes)',
    roleTitle: 'Guild Lead & 6-Member Active Pallbearer Corps',
    category: 'pallbearer',
    phone: '(347) 555-9011',
    email: 'cortege@harlembearers.org',
    organization: 'Harlem Formal Pallbearer & Cortege Guild',
    status: 'active',
    rateInfo: '$600 for complete 6-member squad (White Gloves & Black Suits)',
    notes: 'Professional uniformed pallbearers. Synchronized marching, military cadence step, hearse transfer, and graveside carrying.',
    avatarInitials: 'HB'
  },
  {
    id: 'sp-006',
    fullName: 'Derrick "Doc" Vance',
    roleTitle: 'Professional Pallbearer & Cortege Marshal',
    category: 'pallbearer',
    phone: '(917) 555-2248',
    email: 'dvance.bearer@gmail.com',
    organization: 'Independent Bearer Corps',
    status: 'active',
    rateInfo: '$125 / service',
    notes: 'Experienced lead bearer and church usher coordinator.',
    avatarInitials: 'DV'
  },

  // --- BROADCAST AV & STREAMING ---
  {
    id: 'sp-012',
    fullName: 'Marcus Vance',
    roleTitle: 'Lead Sanctuary Live Webcast & Sound Engineer',
    category: 'broadcast_av_tech',
    phone: '(212) 555-4920',
    email: 'marcus@harlembroadcasting.tv',
    organization: 'Harlem Live Media & Sanctuary AV Systems',
    status: 'active',
    rateInfo: '$250 / service (4K PTZ Multi-Cam, Direct Soundboard & Cloud Stream)',
    notes: 'Certified operator for Benta Chapel 1, Chapel 2, and Repast Room PTZ camera arrays. Manages RTMP feeds, private family PIN security, and instant 4K master archival.',
    avatarInitials: 'MV'
  },
  {
    id: 'sp-013',
    fullName: 'Jasmine Thorne',
    roleTitle: 'Live Stream Producer & Repast Overflow Specialist',
    category: 'broadcast_av_tech',
    phone: '(917) 555-6670',
    email: 'jasmine@metrostream.nyc',
    organization: 'Metro Sanctuary Streaming Solutions',
    status: 'active',
    rateInfo: '$225 / service',
    notes: 'Expert in multi-angle live switching, virtual guest chat moderation, hymn lyrics overlay, and Repast Room overflow feeds.',
    avatarInitials: 'JT'
  }
];





export const INITIAL_PARTNER_REQUESTS: PartnerScheduleRequest[] = [];

export const getInitialFlightChecklist = (caseItem: GoldenRecordCase): CaseFlightPhaseProgress[] => {
  const isCremation = caseItem.dispositionType.includes('cremation');
  const hasSafeArrival = caseItem.safeArrivalStatus === 'safe_arrival_confirmed';
  const hasAP47 = !!caseItem.statementOfGoods;
  const isEdrsCertified = caseItem.medicalCertifier.edrsStatus === 'certified' || !!caseItem.medicalCertifier.edrsPermitNumber;

  return [
    {
      phase: 'intake_removal',
      phaseNumber: 1,
      title: 'Phase 1: First Call & Chain of Custody',
      isUnlocked: true,
      isCompleted: hasSafeArrival,
      items: [
        {
          id: 'fc-101',
          phase: 'intake_removal',
          code: 'NYS-PHL-4201',
          title: 'Execute First Call Physical Custody & Removal',
          description: 'Dispatch transfer unit, log pickup facility morgue release jurat, and record driver plate.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: true,
          completedAt: '2026-09-17 10:45 AM',
          completedBy: 'Jason Benta (LFD #08850)',
          actionType: 'open_removal',
          actionLabel: 'Removal & Custody Hub',
          statutoryReference: 'NYS PHL § 4201'
        },
        {
          id: 'fc-102',
          phase: 'intake_removal',
          code: 'VALUABLES-TAG',
          title: 'Itemize & Seal Personal Effects Ledger',
          description: 'Document jewelry, cash, dentures, and seal in tamper-evident pouch with witness signature.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: true,
          completedAt: '2026-09-17 10:50 AM',
          completedBy: 'Maria Santos (Pathology Attendant)',
          actionType: 'open_removal',
          actionLabel: 'View Valuables Ledger'
        },
        {
          id: 'fc-103',
          phase: 'intake_removal',
          code: 'SAFE-ARRIVE-SMS',
          title: 'Log Safe Arrival & Fire Reassurance SMS',
          description: 'Log arrival at 630 St. Nicholas Ave and send instant peace-of-mind alert to Next of Kin.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: hasSafeArrival,
          completedAt: hasSafeArrival ? caseItem.safeArrivalTimestamp : undefined,
          completedBy: hasSafeArrival ? 'System Trigger' : undefined,
          actionType: 'open_removal',
          actionLabel: 'Log Safe Arrival & SMS'
        }
      ]
    },
    {
      phase: 'arrangements',
      phaseNumber: 2,
      title: 'Phase 2: Arrangement Conference & Contract Execution',
      isUnlocked: true,
      isCompleted: hasAP47,
      items: [
        {
          id: 'fc-200',
          phase: 'arrangements',
          code: 'APPT-SCHEDULE',
          title: 'Schedule In-Person Family Arrangement Conference',
          description: 'Offer selectable dates/times via SMS/Email and confirm appointment with assigned director at 630 St. Nicholas Ave.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: !!caseItem.arrangementAppointment && caseItem.arrangementAppointment.status === 'confirmed',
          completedAt: caseItem.arrangementAppointment?.confirmedAt,
          completedBy: caseItem.arrangementAppointment?.assignedDirectorName,
          actionType: 'open_appointment',
          actionLabel: 'Schedule Conference'
        },
        {
          id: 'fc-201',
          phase: 'arrangements',
          code: 'AP-47-CONTRACT',
          title: 'Conduct Arrangement Conference & Form AP-47',
          description: 'Itemize Professional Services, Casket/Vault, 12-Variable Suite, Livery, and Section II Cash Advances.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: hasAP47,
          completedAt: hasAP47 ? '2026-09-17 02:30 PM' : undefined,
          completedBy: hasAP47 ? 'Jason Benta, LFD' : undefined,
          actionType: 'open_contract',
          actionLabel: 'Open AP-47 Contract Studio',
          statutoryReference: '10 NYCRR Part 77 / FTC Rule'
        },
        {
          id: 'fc-202',
          phase: 'arrangements',
          code: 'VENUE-RESERVE',
          title: 'Reserve 12-Space Facility & Chapel Schedule',
          description: 'Lock Chapel A / Chapel B viewing slot and optional 2nd-floor Repast Suite.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: !!caseItem.serviceSelections.serviceDate,
          completedAt: caseItem.serviceSelections.serviceDate ? '2026-09-17 03:00 PM' : undefined,
          actionType: 'open_calendar',
          actionLabel: '12-Room Facility Calendar'
        },
        {
          id: 'fc-203',
          phase: 'arrangements',
          code: 'PORTAL-INVITE',
          title: 'Dispatch Family Portal Access Link (Email + SMS)',
          description: 'Grant secure family access with passcode for obituary collaboration and digital tributes.',
          isMandatoryForPhaseAdvance: false,
          isCompleted: true,
          completedAt: '2026-09-17 03:15 PM',
          actionType: 'open_contract',
          actionLabel: 'Resend Portal Invite'
        }
      ]
    },
    {
      phase: 'legal_bundle',
      phaseNumber: 3,
      title: 'Phase 3: State Vital Registrations & Legal Authorizations',
      isUnlocked: true,
      isCompleted: isEdrsCertified,
      items: [
        {
          id: 'fc-301',
          phase: 'legal_bundle',
          code: 'EDRS-72H',
          title: 'NYC eVital / NYS EDRS 72-Hour Death Registration',
          description: 'Rapid-fill vital statistics into state portal and acquire certified burial/cremation permit number.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: isEdrsCertified,
          completedAt: isEdrsCertified ? '2026-09-18 10:00 AM' : undefined,
          actionType: 'open_edrs',
          actionLabel: 'EDRS RapidFill Assistant',
          statutoryReference: 'NYS PHL § 4140'
        },
        {
          id: 'fc-302',
          phase: 'legal_bundle',
          code: 'NOK-ESIGN-4201',
          title: 'Capture Informant Legal E-Signatures',
          description: 'Right to Control Jurat, Statement of Goods Terms, and Embalming Authorization signature.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: true,
          completedAt: '2026-09-18 11:30 AM',
          actionType: 'open_esign',
          actionLabel: 'Open Legal eSign Pad'
        },
        {
          id: 'fc-303',
          phase: 'legal_bundle',
          code: isCremation ? 'WOODLAWN-AUTH' : 'CEMETERY-AUTH',
          title: isCremation ? 'Woodlawn Crematory Authorization Packet' : 'Cemetery Interment Authorization',
          description: isCremation ? 'Affidavit of Cremation and disposition of cremated remains instructions.' : 'Plot deed and grave opening authorization.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: true,
          actionType: isCremation ? 'open_woodlawn' : 'open_esign',
          actionLabel: isCremation ? 'Woodlawn Dispatch' : 'Cemetery Authorization'
        }
      ]
    },
    {
      phase: 'permits_logistics',
      phaseNumber: 4,
      title: 'Phase 4: Logistics, Service Production & Vendor Confirmation',
      isUnlocked: true,
      isCompleted: false,
      items: [
        {
          id: 'fc-401',
          phase: 'permits_logistics',
          code: 'PRINT-BULLETIN',
          title: 'Print 4-Panel Duplex Memorial Programs',
          description: 'Format obituary, order of service, pallbearers, and print 8.5x11 duplex bifolds.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: true,
          completedAt: '2026-09-19 02:00 PM',
          actionType: 'open_memorial_program',
          actionLabel: '4-Panel Bulletin Studio'
        },
        {
          id: 'fc-402',
          phase: 'permits_logistics',
          code: 'VENDOR-2WAY-SMS',
          title: 'Two-Way Partner Dispatches (Florist, Clergy, Organist, Livery)',
          description: 'Dispatch orders to Barbara’s/Daniela’s Flowers, clergy, and organist; track two-way confirmations.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: false,
          actionType: 'open_partner_sms',
          actionLabel: 'Two-Way Partner SMS Hub'
        },
        {
          id: 'fc-403',
          phase: 'permits_logistics',
          code: 'CHAPEL-QR-EASEL',
          title: 'Stage Chapel Tribute QR Code & Easel Welcome Sign',
          description: 'Print high-contrast acrylic easel welcome sign with live QR link for digital tributes & guestbook.',
          isMandatoryForPhaseAdvance: false,
          isCompleted: true,
          actionType: 'open_chapel_qr',
          actionLabel: 'Chapel QR Easel Sign'
        },
        {
          id: 'fc-404',
          phase: 'permits_logistics',
          code: 'WEBCAST-XLR',
          title: 'Sanctuary 4K Webcast & XLR Audio Stream Schedule',
          description: 'Verify soundboard XLR direct feed and generate encrypted family viewing PIN.',
          isMandatoryForPhaseAdvance: false,
          isCompleted: caseItem.webcastSchedule?.isEnabled !== false,
          actionType: 'open_webcast',
          actionLabel: 'Webcast Scheduling'
        },
        {
          id: 'fc-405',
          phase: 'permits_logistics',
          code: 'PASS-THROUGH-CHECKS',
          title: 'Generate & Print Pass-Through Cash Advance Checks',
          description: 'Print 3-part payable check vouchers for cemetery, clergy, NYC DOHMH, and organist with deceased name & case # in memo line.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: false,
          actionType: 'open_cash_advance_checks',
          actionLabel: 'Print Cash Advance Checks',
          statutoryReference: '10 NYCRR § 77.8 Pass-Through'
        }
      ]
    },
    {
      phase: 'finalization_aftercare',
      phaseNumber: 5,
      title: 'Phase 5: Financial Settlement, Committal & 365-Day Aftercare',
      isUnlocked: true,
      isCompleted: false,
      items: [
        {
          id: 'fc-501',
          phase: 'finalization_aftercare',
          code: 'SPLIT-BILL-SETTLE',
          title: 'Reconcile Split-Billing & Life Insurance Assignments',
          description: 'Verify C&J Life Insurance assignment funding, ACH transfers, and clear contract balance.',
          isMandatoryForPhaseAdvance: true,
          isCompleted: caseItem.totalPaid >= caseItem.totalAmountDue,
          actionType: 'open_finances',
          actionLabel: 'Financial Verification Center'
        },
        {
          id: 'fc-502',
          phase: 'finalization_aftercare',
          code: 'AFTERCARE-365',
          title: 'Activate 365-Day Grief Support & Memorial Cadence',
          description: 'Schedule automated Day 7, Day 30, Day 90, and 1-Year Remembrance anniversary check-ins.',
          isMandatoryForPhaseAdvance: false,
          isCompleted: true,
          actionType: 'open_aftercare',
          actionLabel: 'Aftercare CRM Nurture'
        }
      ]
    }
  ];
};

// ==========================================
// MANAGER & DIRECTOR SCHEDULING MOCK DATA
// ==========================================





export const INITIAL_DIRECTOR_PROFILES: DirectorProfile[] = [
  // 3 Managing Directors & Licensed Funeral Directors (Dual Capacity: Executive Management & Arrangement Directing)
  {
    id: 'dir-mgr-1',
    name: 'Jason Benta',
    licenseNumber: 'NYS LFD #08850',
    type: 'in_house',
    roleType: 'manager',
    isManager: true,
    canMakeArrangements: true,
    isIndependentContractor: false,
    title: 'Director in Charge / Managing LFD',
    phone: '(212) 281-8850',
    email: 'jason.benta@bentasfuneralhome.com',
    securityPin: '3995',
    yearsExperience: 24,
    specialties: ['Managing LFD Oversight', 'Harlem Civic & Community Ceremonies', 'NYS DOH Regulatory Lead', 'Executive Administration'],
    rating: 5.0,
    status: 'available',
    colorTheme: {
      name: 'Crimson Wine',
      primary: '#991b1b',
      badgeBg: 'bg-red-100 text-red-900 border-red-300',
      calendarBg: 'bg-red-50/95 border-l-4 border-red-600 shadow-xs',
      border: 'border-red-500',
      text: 'text-[#991b1b]'
    },
    weeklyHoursLogged: 34,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 95,
    activeCasesCount: 2
  },
  {
    id: 'dir-fd-1',
    name: 'Beth Crowe',
    licenseNumber: 'NYS LFD #09412',
    type: 'in_house',
    roleType: 'manager',
    isManager: true,
    canMakeArrangements: true,
    isIndependentContractor: false,
    title: 'Managing Director & Licensed Funeral Director',
    phone: '(646) 243-8899',
    email: 'BCrowe@e-bfh.com',
    securityPin: '9412',
    yearsExperience: 14,
    specialties: ['Traditional Funeral Rites', 'Harlem Civic Services', 'DocuSign Legal Compliance', 'Executive Management'],
    rating: 4.9,
    status: 'available',
    colorTheme: {
      name: 'Royal Blue',
      primary: '#1d4ed8',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      calendarBg: 'bg-blue-50/95 border-l-4 border-blue-600 shadow-xs',
      border: 'border-blue-500',
      text: 'text-blue-700'
    },
    weeklyHoursLogged: 32,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 85,
    activeCasesCount: 2
  },
  {
    id: 'dir-fd-4',
    name: 'Billy McDonald',
    licenseNumber: 'NYS LFD #09340',
    type: 'in_house',
    roleType: 'manager',
    isManager: true,
    canMakeArrangements: true,
    isIndependentContractor: false,
    title: 'Managing Director & Licensed Funeral Director',
    phone: '(917) 519-7382',
    email: 'Bmcdonald@e-bfh.com',
    securityPin: '9340',
    yearsExperience: 18,
    specialties: ['Catholic Liturgies & Masses', 'Repast Directing', 'Veterans Military Honors', 'Executive Management'],
    rating: 4.8,
    status: 'available',
    colorTheme: {
      name: 'Amber Gold',
      primary: '#b45309',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      calendarBg: 'bg-amber-50/95 border-l-4 border-amber-600 shadow-xs',
      border: 'border-amber-500',
      text: 'text-[#b45309]'
    },
    weeklyHoursLogged: 34,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 85,
    activeCasesCount: 1
  },

  // 3 In-House Licensed Funeral Directors (Case Claiming & Arrangement Conferences)
  {
    id: 'dir-fd-2',
    name: 'Chontel Harris',
    licenseNumber: 'NYS LFD #10231',
    type: 'in_house',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: true,
    isIndependentContractor: false,
    title: 'Licensed Funeral Director',
    phone: '(917) 213-3955',
    email: 'CHarris@e-bfh.com',
    yearsExperience: 11,
    specialties: ['Family Arrangements Lead', 'Cremation Memorials', 'Repatriation Logistics', 'Aftercare Coordination'],
    rating: 4.9,
    status: 'available',
    colorTheme: {
      name: 'Emerald Green',
      primary: '#047857',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      calendarBg: 'bg-emerald-50/95 border-l-4 border-emerald-600 shadow-xs',
      border: 'border-emerald-500',
      text: 'text-emerald-700'
    },
    weeklyHoursLogged: 28,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 80,
    activeCasesCount: 1
  },
  {
    id: 'dir-fd-3',
    name: 'Leatrice Henry',
    licenseNumber: 'NYS LFD #07194',
    type: 'in_house',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: true,
    isIndependentContractor: false,
    title: 'Licensed Funeral Director',
    phone: '(347) 479-0536',
    email: 'LHenry@e-bfh.com',
    yearsExperience: 16,
    specialties: ['Baptist & Gospel Traditions', 'Large Harlem Processions', 'Senior Clergy Liaison', 'Eulogy Protocol'],
    rating: 5.0,
    status: 'available',
    colorTheme: {
      name: 'Royal Purple',
      primary: '#6d28d9',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      calendarBg: 'bg-purple-50/95 border-l-4 border-purple-600 shadow-xs',
      border: 'border-purple-500',
      text: 'text-purple-700'
    },
    weeklyHoursLogged: 30,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 85,
    activeCasesCount: 1
  },
  {
    id: 'dir-fd-5',
    name: 'Dean Wilson',
    licenseNumber: 'NYS LFD #08112',
    type: 'in_house',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: true,
    isIndependentContractor: false,
    title: 'Licensed Funeral Director',
    phone: '(631) 708-6473',
    email: 'DWilson@e-bfh.com',
    yearsExperience: 12,
    specialties: ['Transport Operations & Cortege Escorts', 'Masonic & Fraternal Rites', 'Graveside Formations', 'Tri-State Logistics'],
    rating: 4.9,
    status: 'available',
    colorTheme: {
      name: 'Ocean Teal',
      primary: '#0f766e',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      calendarBg: 'bg-teal-50/95 border-l-4 border-teal-600 shadow-xs',
      border: 'border-teal-500',
      text: 'text-teal-700'
    },
    weeklyHoursLogged: 26,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 80,
    activeCasesCount: 0
  },

  // 5 Independent Contractor Funeral Directors (Hired for Funeral Services Only - Do NOT make arrangements)
  {
    id: 'dir-trade-1',
    name: 'Curvelle Larcque',
    licenseNumber: 'NYS LFD #11048',
    type: 'outsourced',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: false,
    isIndependentContractor: true,
    title: 'Independent Contractor Licensed Funeral Director',
    phone: '(347) 724-1998',
    email: 'clarcque@nytradefuneral.org',
    yearsExperience: 10,
    specialties: ['Per Diem Chapel Directing', 'Cortege Logistics', 'Cemetery Committals', 'Funeral Services'],
    rating: 4.9,
    status: 'available',
    perDiemRate: 350,
    guildAffiliation: 'Independent Contractor LFD (Harlem Service Directing)',
    colorTheme: {
      name: 'Slate Grey',
      primary: '#475569',
      badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
      calendarBg: 'bg-slate-50/95 border-l-4 border-slate-600 shadow-xs',
      border: 'border-slate-500',
      text: 'text-slate-700'
    },
    weeklyHoursLogged: 0,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 75,
    activeCasesCount: 0
  },
  {
    id: 'dir-trade-2',
    name: 'Pierre Cobb',
    licenseNumber: 'NYS LFD #09823',
    type: 'outsourced',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: false,
    isIndependentContractor: true,
    title: 'Independent Contractor Licensed Funeral Director',
    phone: '(718) 350-1441',
    email: 'pcobb@nytradefuneral.org',
    yearsExperience: 12,
    specialties: ['Evening Wake Directing', 'Church Ceremony Protocols', 'Hearse Escort', 'Funeral Services'],
    rating: 4.8,
    status: 'available',
    perDiemRate: 350,
    guildAffiliation: 'Independent Contractor LFD (Harlem Service Directing)',
    colorTheme: {
      name: 'Indigo',
      primary: '#4338ca',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      calendarBg: 'bg-indigo-50/95 border-l-4 border-indigo-600 shadow-xs',
      border: 'border-indigo-500',
      text: 'text-indigo-700'
    },
    weeklyHoursLogged: 0,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 75,
    activeCasesCount: 0
  },
  {
    id: 'dir-trade-3',
    name: 'Cory Vaughn-Daniels',
    licenseNumber: 'NYS LFD #12049',
    type: 'outsourced',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: false,
    isIndependentContractor: true,
    title: 'Independent Contractor Licensed Funeral Director',
    phone: '(646) 701-1966',
    email: 'cvdaniels@nytradefuneral.org',
    yearsExperience: 14,
    specialties: ['Harlem Community Funerals', 'Family Assistance', 'Graveside Formations', 'Funeral Services'],
    rating: 4.9,
    status: 'available',
    perDiemRate: 350,
    guildAffiliation: 'Independent Contractor LFD (Harlem Service Directing)',
    colorTheme: {
      name: 'Forest',
      primary: '#15803d',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      calendarBg: 'bg-emerald-50/95 border-l-4 border-emerald-600 shadow-xs',
      border: 'border-emerald-500',
      text: 'text-emerald-700'
    },
    weeklyHoursLogged: 0,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 75,
    activeCasesCount: 0
  },
  {
    id: 'dir-trade-4',
    name: 'Sylvia Saxton',
    licenseNumber: 'NYS LFD #08944',
    type: 'outsourced',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: false,
    isIndependentContractor: true,
    title: 'Independent Contractor Licensed Funeral Director',
    phone: '(862) 368-4706',
    email: 'ssaxton@nytradefuneral.org',
    yearsExperience: 15,
    specialties: ['Church & Chapel Services', 'Liturgical Protocol', 'VIP Family Escort', 'Funeral Services'],
    rating: 5.0,
    status: 'available',
    perDiemRate: 350,
    guildAffiliation: 'Independent Contractor LFD (Harlem Service Directing)',
    colorTheme: {
      name: 'Rose Gold',
      primary: '#be123c',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      calendarBg: 'bg-rose-50/95 border-l-4 border-rose-600 shadow-xs',
      border: 'border-rose-500',
      text: 'text-rose-700'
    },
    weeklyHoursLogged: 0,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 75,
    activeCasesCount: 0
  },
  {
    id: 'dir-trade-5',
    name: 'Delyce Edwards',
    licenseNumber: 'NYS LFD #10924',
    type: 'outsourced',
    roleType: 'funeral_director',
    isManager: false,
    canMakeArrangements: false,
    isIndependentContractor: true,
    title: 'Independent Contractor Licensed Funeral Director',
    phone: '(646) 408-3350',
    email: 'dedwards@nytradefuneral.org',
    yearsExperience: 11,
    specialties: ['Chapel Ceremonies', 'Crematory Cortege', 'Interment Coordination', 'Funeral Services'],
    rating: 4.9,
    status: 'available',
    perDiemRate: 350,
    guildAffiliation: 'Independent Contractor LFD (Harlem Service Directing)',
    colorTheme: {
      name: 'Bronze',
      primary: '#9a3412',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      calendarBg: 'bg-orange-50/95 border-l-4 border-orange-600 shadow-xs',
      border: 'border-orange-500',
      text: 'text-orange-700'
    },
    weeklyHoursLogged: 0,
    weeklyHoursCap: 40,
    hourlyOvertimeRate: 75,
    activeCasesCount: 0
  }
];





export const INITIAL_SERVICE_ASSIGNMENTS: ServiceDirectorAssignment[] = [];

export const INITIAL_1099_VOUCHERS: Director1099Voucher[] = [];
