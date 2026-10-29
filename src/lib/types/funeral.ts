export type UserRole = 'manager' | 'director' | 'staff' | 'accounting' | 'family';

export type CasePhase =
  | 'intake_removal'
  | 'arrangements'
  | 'legal_bundle'
  | 'permits_logistics'
  | 'finalization_aftercare';

export type DispositionType =
  | 'direct_cremation'
  | 'cremation_memorial'
  | 'full_cremation'
  | 'direct_burial'
  | 'full_burial'
  | 'pre_need'
  | 'undecided';

export type DocumentStatus = 'pending' | 'generated' | 'sent' | 'signed' | 'approved' | 'completed' | 'urgent';

export type BFHFormType =
  | 'vital_records'
  | 'statement_goods_services'
  | 'right_to_control'
  | 'engagement_financial'
  | 'clothing_transmittal'
  | 'client_production'
  | 'nyc_authority'
  | 'woodlawn_cremation'
  | 'edrs_permit'
  | 'service_sheet'
  | 'general_document'
  | 'ssa_721'
  | 'va_military_packet';

export interface DocumentItem {
  id: string;
  name: string;
  formType?: BFHFormType;
  phase: CasePhase;
  triggerTiming: string;
  destinationRecipient: string;
  deliveryMethod: 'Email/Fax' | 'Email' | 'Digital Link' | 'Digital Portal' | 'Physical/PDF' | 'eSign Portal' | 'Email/SMS' | 'Online Portal' | 'Physical Pickup' | 'Email/Portal';
  status: DocumentStatus;
  lastUpdated?: string;
  signedTimestamp?: string;
  signatureDataUrl?: string;
  fileUrl?: string;
  followUpAction: string;
  isUrgent?: boolean;
}

export interface DecedentInfo {
  legalName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  dateOfDeath: string;
  placeOfDeath: string;
  facilityName?: string;
  ssn?: string;
  ssnMasked?: string;
  maritalStatus: 'married' | 'single' | 'widowed' | 'divorced';
  residenceAddress: string;
  city: string;
  state: string;
  zipCode: string;
  veteran: boolean;
  branchOfService?: string;
  occupation: string;
  industry: string;
  educationLevel?: string;
  fatherName: string;
  motherMaidenName: string;
}

export interface InformantInfo {
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  isNextOfKin: boolean;
  hasRightToControl: boolean;
}

export interface MedicalCertifierInfo {
  physicianName: string;
  licenseNumber: string;
  hospitalFacility: string;
  phone: string;
  edrsStatus: 'pending' | 'certified' | 'rejected' | 'submitted';
  edrsPermitNumber?: string;
}

export interface ServiceSelections {
  dispositionType: DispositionType;
  packageTitle: string;
  basePackagePrice: number;
  casketOrUrnSelected: string;
  casketPrice: number;
  viewingParlor:
    | 'Chapel 1 (Main Sanctuary - Seats 150)'
    | 'Chapel 2 (Memorial Chapel - Seats 100)'
    | 'Parlor A (Seats 120)'
    | 'Parlor B (Seats 110)'
    | 'Parlor C (Seats 80)'
    | 'Parlor R (Repast Room)'
    | 'Church / External Venue'
    | 'Direct / No Viewing'
    | string;
  serviceVenueName?: string;
  serviceDate?: string;
  serviceTime?: string;
  crematoryOrCemeteryName: string;
  officiantName?: string;
  officiantPhone?: string;
  organistName?: string;
  specialRequests?: string;
}

export interface CommunityContribution {
  id: string;
  contributorName: string;
  contributorEmail?: string;
  contributorPhone?: string;
  relationship?: string;
  amount: number;
  message?: string;
  date: string;
  paymentMethod: 'Apple Pay' | 'Google Pay' | 'Card' | 'ACH' | 'Cash / Check';
  transactionId: string;
  isAnonymous?: boolean;
}

export interface SplitBillingItem {
  id?: string;
  payerType: 'Family ACH Direct' | 'Life Insurance Assignment' | 'Credit Card' | 'County/Grant Aid' | 'Cash / Certified Bank Check';
  payerName?: string;
  payerEmail?: string;
  payerPhone?: string;
  relationshipToDecedent?: string;
  providerName?: string;
  policyNumber?: string;
  amountAllocated: number;
  amountPaid?: number;
  status: 'pending_verification' | 'verified_active' | 'funded' | 'processing';
  itemAssigned?: string;
  notes?: string;
  inviteSentAt?: string;
  paidAt?: string;
  transactionReference?: string;
  receiptNumber?: string;
  shareableToken?: string;
}

export interface FamilySplitPayConfig {
  enabled: boolean;
  communityContributionsEnabled: boolean;
  communityGoalAmount?: number;
  communityDescription?: string;
  shareableLinkCode?: string;
  contributions?: CommunityContribution[];
  allowCustomAmounts?: boolean;
  passThroughSponsorshipsEnabled?: boolean;
}

export interface AftercareScheduleItem {
  id: string;
  milestoneTitle: string;
  triggerDaysPostService: number;
  targetDate: string;
  status: 'scheduled' | 'sent' | 'responded';
  templateName: string;
}

export interface FactLedgerItem {
  id: string;
  detail: string;
  source: string;
  tag: 'confirmed' | 'unconfirmed' | 'private' | 'omitted';
  category?: 'identity' | 'dates' | 'family' | 'career' | 'stories' | 'private';
}

export interface TributePhotoItem {
  id: string;
  caption: string;
  placement: 'Front Cover' | 'Inside Spread' | 'Obituary Column' | 'Back Keepsake';
  url: string;
}

export interface ObituaryPackageData {
  spokespersonName: string;
  spokespersonRelation: string;
  spokespersonEmail: string;
  consentGranted: boolean;

  // Step 2: Oral History
  ordinaryHabits: string;
  signaturePhrase: string;
  definingStory: string;

  // Step 3: Chronology
  birthDetails: string;
  passingDetails: string;
  educationCareer: string;

  // Step 4: Family & Services
  survivors: string;
  predeceased: string;
  serviceDetails: string;
  memorialDonations: string;

  // Step 5 & 6: Dual Drafts
  voiceTone: 'warm' | 'stately';
  fullObituaryDraft: string;
  shortNoticeDraft: string;

  // Step 2 & Ledger
  factLedger: FactLedgerItem[];

  // Step 7 & 8: Fraud Shield
  fraudShieldPassed: boolean;
  ageInsteadOfBirthdate: boolean;
  chapelAddressProtected: boolean;
  relativeHometownsProtected: boolean;

  // Step 9: 4-Gate Review & Signoff
  reviewGate1Facts: boolean;
  reviewGate2Names: boolean;
  reviewGate3Tone: boolean;
  reviewGate4Privacy: boolean;
  isSignedOff: boolean;
  signedOffAt?: string;
  signedOffBy?: string;

  // Photos
  photos: TributePhotoItem[];
}

export interface JewelryItemSpec {
  id: string;
  item: string;
  description?: string;
  checked: boolean;
  disposition: 'remain_on_decedent' | 'return_to_family';
}

export interface ClothingChecklistData {
  socks: boolean;
  socksNotes?: string;
  pants: boolean;
  pantsNotes?: string;
  shirt: boolean;
  shirtNotes?: string;
  underwear: boolean;
  underwearNotes?: string;
  shoes: boolean;
  shoesNotes?: string;
  dress: boolean; // "deass"
  dressNotes?: string;
  panties: boolean; // "pantes"
  pantiesNotes?: string;
  wig: boolean;
  wigNotes?: string;
  jacket: boolean;
  jacketNotes?: string;
  tie: boolean;
  tieNotes?: string;
  pocketSquare: boolean;
  pocketSquareNotes?: string;
  jewelryList: JewelryItemSpec[];
  customItems?: Array<{
    id: string;
    name: string;
    checked: boolean;
    notes?: string;
  }>;
  casketNumber?: string;
  casketName?: string;
  namePlate?: boolean;
  hairdresserAssigned?: boolean;
  hairdresserName?: string;
  cosmeticsNotes?: string;
  glassesInstruction?: 'on_for_viewing_remove_before_burial' | 'remain_on_decedent' | 'return_to_family' | 'none';
  deliveredBy?: string;
  deliveredByPhone?: string;
  receivedByDirector?: string;
  dateReceived?: string;
  isCompleted?: boolean;
  lastUpdated?: string;
}

export interface GoldenRecordCase {
  id: string;
  caseNumber: string;
  createdAt: string;
  currentPhase: CasePhase;
  dispositionType: DispositionType;
  safeArrivalStatus: 'pending_removal' | 'in_transit' | 'safe_arrival_confirmed';
  safeArrivalTimestamp?: string;
  removalReadiness?: RemovalReadinessStatus;
  removalReadinessNotes?: string;
  assignedDirector: string;
  assignedDirectorId?: string;
  caseClaimStatus?: 'unclaimed' | 'claimed' | 'reassigned';
  appointmentScheduled?: boolean;
  appointmentDate?: string;
  appointmentTime?: string;

  quickbooksSync?: {
    invoiceNumber?: string;
    syncStatus: 'not_synced' | 'synced' | 'pending';
    lastSyncedAt?: string;
    qboInvoiceId?: string;
    balanceRemaining?: number;
    totalAmount?: number;
    billsGenerated?: Array<{
      vendorName: string;
      category: string;
      amount: number;
      billNumber: string;
      status: 'synced' | 'pending';
    }>;
  };

  docusignEnvelope?: {
    envelopeId?: string;
    status: 'not_sent' | 'sent' | 'delivered' | 'id_verified' | 'completed' | 'declined';
    nokIdVerified: boolean;
    idVerificationMethod?: 'Govt ID + SMS OTP' | 'Knowledge-Based (KBA)' | 'Direct eSign';
    sentAt?: string;
    completedAt?: string;
    certificateUrl?: string;
    documentsIncluded?: string[];
  };

  decedent: DecedentInfo;
  informant: InformantInfo;
  medicalCertifier: MedicalCertifierInfo;
  serviceSelections: ServiceSelections;
  documents: DocumentItem[];
  splitBilling: SplitBillingItem[];
  totalAmountDue: number;
  totalPaid: number;
  aftercare: AftercareScheduleItem[];
  liveryHolds?: VehicleHoldRequest[];
  partnerRequests?: PartnerScheduleRequest[];
  obituaryData?: ObituaryPackageData;
  friendTributeShares?: FriendTributeShare[];
  webcastSchedule?: WebcastScheduleInfo;
  webcastShares?: WebcastShareInvite[];
  removalSchedule?: RemovalScheduleInfo;
  cortegeRoute?: LiveryCortegeRoute;
  funeralAnnouncement?: FuneralAnnouncementData;
  statementOfGoods?: StatementOfGoodsData;
  vitalRecordsSheet?: FullVitalRecordInformationSheet;
  contractRevisions?: ContractRevisionArchiveRecord[];
  clothingSubmittal?: ClothingChecklistData;
  familySplitPayConfig?: FamilySplitPayConfig;
  vipItinerary?: DayOfServiceVIPItinerary;
  arrangementAppointment?: ArrangementAppointmentInfo;
  intakePathway?: IntakePathwayType;
  proofApproval?: FamilyProofApprovalRecord;
  discrepancyAudit?: DiscrepancyAuditReport;
  dayOfServiceHUD?: DayOfServiceHUDData;
  firstCallNotes?: string;
  ssa721Filing?: SSA721Filing;
  militaryHonors?: VAMilitaryHonorsData;
  notes: Array<{
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }>;
}

export type IntakePathwayType =
  | 'unexpected_removal_first'
  | 'scheduled_arrangement_first'
  | 'imminent_hospice';

export type RemovalReadinessStatus =
  | 'pending_hospital_release'
  | 'family_consultation_hold'
  | 'ready_immediate_removal'
  | 'in_custody';

export interface FirstCallIntakeFormData {
  callerName: string;
  callerRelationship: string;
  callerPhone: string;
  callerEmail: string;
  callerAddress: string;
  hasRightToControl: boolean;
  
  // Decedent Names
  decedentLegalName: string;
  decedentFirstName?: string;
  decedentMiddleName?: string;
  decedentLastName?: string;
  otherKnownNames?: string;
  
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  age?: number | string;
  birthPlaceCityStateCountry?: string;
  dateOfDeath: string;
  isExpectedDeath: boolean;
  ssn?: string;
  ssnLast4?: string;
  maritalStatus?: 'married' | 'separated' | 'never_married' | 'widowed' | 'divorced' | 'single';
  race?: string;
  educationLevel?: string;
  occupationTitle?: string;
  typeOfBusiness?: string;
  militaryStatus?: 'active' | 'veteran' | 'none';
  militaryBranch?: string;
  
  // Parents & Spouse
  fatherName?: string;
  motherMaidenName?: string;
  motherFirstAndMaidenName?: string;
  spouseFirstAndMaidenName?: string;
  spouseDateOfBirth?: string;
  
  // Residence & Death Location
  residenceAddress?: string;
  residenceStreet?: string;
  residenceApt?: string;
  residenceCity?: string;
  residenceState?: string;
  residenceZip?: string;
  placeOfDeathFacilityOrLocation?: string;
  placeOfDeathCity?: string;
  placeOfDeathStateOrCountry?: string;
  
  // Informant Extra Phones & Address Breakdown
  informantPhoneHome?: string;
  informantPhoneCell?: string;
  informantPhoneAlt?: string;
  informantAddressStreet?: string;
  informantAddressApt?: string;
  informantAddressCityStateCountry?: string;
  informantAddressZip?: string;
  
  // Cemetery Deed & Previous Interment
  deedOwnerName?: string;
  deedOwnerAddress?: string;
  previousIntermentWho?: string;
  previousIntermentWhen?: string;
  previousIntermentRelation?: string;
  
  // Verification
  reviewedOrProvidedBy?: string;
  verifiedOnDate?: string;
  
  // Full Vital Record Information Sheet (Pre-packaged if provided)
  vitalRecordsSheet?: FullVitalRecordInformationSheet;
  
  // Removal Readiness Triage
  removalReadiness: RemovalReadinessStatus;
  removalReadinessNotes?: string;
  
  locationType: RemovalLocationType;
  facilityName: string;
  facilityAddress: string;
  facilityFloorRoom: string;
  facilityContactPhone: string;
  morgueAttendantOrNurse: string;
  
  physicianName: string;
  physicianPhone: string;
  physicianLicenseNumber?: string;
  
  dispositionType: DispositionType;
  viewingParlor:
    | 'Chapel 1 (Main Sanctuary - Seats 150)'
    | 'Chapel 2 (Memorial Chapel - Seats 100)'
    | 'Parlor A (Seats 120)'
    | 'Parlor B (Seats 110)'
    | 'Parlor C (Seats 80)'
    | 'Parlor R (Repast Room)'
    | 'Church / External Venue'
    | 'Direct / No Viewing'
    | string;
  targetServiceDate?: string;
  
  // Arrangement Appointment Scheduling
  scheduledAppointmentDate?: string;
  scheduledAppointmentTime?: string;
  scheduledAppointmentVenue?: string;
  attendingFamilyCount?: number;
  sendConfirmationEmail?: boolean;
  sendConfirmationSms?: boolean;
  
  assignedDirectorId: string;
  assignedDirectorName: string;
  intakePathway: IntakePathwayType;
  urgency: RemovalUrgency;
  specialInstructions?: string;
  specialEquipment: string[];
}

export type BackOfficeTab =
  | 'dashboard'
  | 'pipeline'
  | 'golden_record'
  | 'documents'
  | 'calendar'
  | 'reports'
  | 'dispatch'
  | 'partners'
  | 'finances'
  | 'aftercare'
  | 'manager'
  | 'preneed';

export interface PreNeedTrustAccount {
  id: string;
  clientName: string;
  purchaserName: string;
  relationship: string;
  clientDob: string;
  clientSsnMasked: string;
  phone: string;
  email: string;
  address: string;
  trustType: 'irrevocable_medicaid' | 'revocable_standard';
  escrowDepository: 'PrePlan (NYSFDA Trust)' | 'M&T Bank Escrow' | 'Flagstar / Signature Bank Escrow' | 'Amalgamated Bank NY';
  accountNumber: string;
  depositDate: string;
  initialPrincipal: number;
  accumulatedInterest: number;
  adminFeeRate: number;
  currentTotalBalance: number;
  medicaidSpendDownCertified: boolean;
  medicaidNoticeNumber?: string;
  status: 'active_accumulating' | 'converted_at_need' | 'revoked_refunded';
  selectedServices: {
    dispositionType: DispositionType;
    servicePackageName: string;
    servicePackagePrice: number;
    casketName?: string;
    casketPrice?: number;
    outerBurialVault?: string;
    vaultPrice?: number;
    cashAdvancesTotal: number;
    totalContractPrice: number;
  };
  assignedDirector: string;
  lastTaxYear1099Issued?: number;
  notes?: string;
  convertedCaseId?: string;
  convertedAt?: string;
}

export interface InsuranceAssignmentClaim {
  id: string;
  caseId: string;
  caseNumber: string;
  decedentName: string;
  carrierName: string;
  policyNumber: string;
  policyFaceValue: number;
  fundingIntermediary: 'C&J Financial' | 'Express Funeral Funding' | 'Beta Capital';
  beneficiaryName: string;
  beneficiaryRelationship: string;
  beneficiaryPhone: string;
  beneficiaryEmail: string;
  funeralHomeContractTotal: number;
  factoringFeePercentage: number;
  factoringFeeAmount: number;
  wireProcessingFee: number;
  netFuneralHomeWire: number;
  familySurplusRefund: number;
  claimStatus: 'draft' | 'submitted_for_verification' | 'carrier_in_review' | 'approved_wire_pending' | 'funds_cleared_in_bfh' | 'surplus_disbursed' | 'declined';
  verificationChecklist: {
    policyInForceVerified: boolean;
    pastTwoYearContestability: boolean;
    noCollateralAssignments: boolean;
    beneficiariesConfirmed: boolean;
    deathCertificateUploaded: boolean;
    assignmentFormSigned: boolean;
  };
  signedAssignmentDate?: string;
  wireDispatchedTimestamp?: string;
  wireReferenceCode?: string;
  notes?: string;
}

export type RoomId =
  | 'chapel_1'
  | 'chapel_2'
  | 'repast_room'
  | 'family_suite_1'
  | 'family_suite_2'
  | 'parlor_a'
  | 'parlor_b'
  | 'parlor_c'
  | 'parlor_ab'
  | 'parlor_abc'
  | 'church'
  | 'other';

export interface FacilityRoom {
  id: RoomId;
  name: string;
  code: string;
  capacity: number;
  type: 'chapel' | 'parlor' | 'suite' | 'repast' | 'offsite';
  features: string[];
  color: string;
}

export interface RoomScheduleEvent {
  id: string;
  roomId: RoomId;
  caseId: string;
  caseNumber: string;
  decedentName: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  serviceType: 'Memorial Service' | 'Viewing / Wake' | 'Family Visitation' | 'Arrangement Conference' | 'Preparation / Restorative' | 'Pre-Need Consultation' | 'Repast Gathering';
  assignedDirector: string;
  assignedDirectorId?: string;
  officiantName?: string;
  organistOrMusic?: string;
  livestreamActive?: boolean;
  woodlawnDepartureTime?: string;
  estimatedGuests: number;
  notes?: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'tentative';
}

export type VehicleType = 'Limo Bus' | 'Limo' | 'Hearse' | 'Flower Car' | 'Lead Car' | 'Sprinter Van' | 'SUV Escort' | 'Other';
export type VehicleSize = 'Limo 6-seater' | 'Limo 7-seater' | 'Limo 8-seater' | 'Limo 10-seater' | 'Sprinter 10-seater' | 'Sprinter 14-seater' | 'Limo Bus 10-seater' | 'Limo Bus 16-seater' | 'Cadillac Coach 2-pax' | 'Escalade 6-seater' | 'Custom / Standard';

export interface VehicleHoldRequest {
  id: string;
  caseId: string;
  caseNumber: string;
  familyReferenceName: string;
  vendorName: string;
  vendorPhone: string;
  vehicleType: VehicleType;
  vehicleSize: VehicleSize;
  quantity: number;
  serviceDate: string;
  serviceTime?: string;
  status: 'hold_requested' | 'vendor_confirmed' | 'route_48h_dispatched' | 'service_completed' | 'cancelled';
  notice48HrAcknowledged: boolean;
  notes?: string;
  pickupAddressDraft?: string;
  dropoffAddressDraft?: string;
  requestedAt: string;
  confirmedAt?: string;
  reminderSchedule: {
    reminder48h: { scheduledDate: string; sent: boolean };
    reminder24h: { scheduledDate: string; sent: boolean };
    morningAlert: { scheduledDate: string; sent: boolean };
  };
}

export type NotificationChannel = 'sms' | 'email' | 'push';

export type NotificationType =
  | 'safe_arrival'
  | 'portal_access_invite'
  | 'tribute_share_invite'
  | 'webcast_invite'
  | 'esign_request'
  | 'service_schedule'
  | 'woodlawn_departure'
  | 'aftercare_checkin'
  | 'payment_receipt'
  | 'custom_director_sms'
  | 'portal_update'
  | 'partner_dispatch';

export interface FriendTributeShare {
  id: string;
  recipientName: string;
  recipientContact: string;
  channel: 'sms' | 'email';
  personalNote?: string;
  sentAt: string;
  status: 'sent' | 'opened' | 'voice_recorded';
}

export interface SimulatedNotification {
  id: string;
  caseId: string;
  decedentName: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  channel: NotificationChannel;
  type: NotificationType;
  title: string;
  bodyText: string;
  sentAt: string; // formatted timestamp e.g. "Today 2:14 PM"
  status: 'delivered' | 'read' | 'failed' | 'queued';
  actionUrl?: string;
  actionButtonText?: string;
  metadata?: {
    carrier?: string;
    deliveryLatencyMs?: number;
    twilioMessageSid?: string;
    readReceiptTimestamp?: string;
  };
}

export type PartnerCategory =
  | 'hairdresser_barber'
  | 'outside_director'
  | 'pallbearer'
  | 'musician_organist'
  | 'minister_clergy'
  | 'broadcast_av_tech'
  | 'livery_transport'
  | 'other_vendor';

export interface ServicePartnerContact {
  id: string;
  fullName: string;
  roleTitle: string; // e.g., "Master Restorative Barber", "Lead Organist", "Trade Funeral Director", "Live Webcast Broadcast Engineer"
  category: PartnerCategory;
  phone: string; // SMS phone
  email?: string;
  organization?: string; // e.g., "Apollo Grooming Studio", "Harlem Gospel Ensemble", "NYS Licensed Trade Guild", "Harlem Broadcast AV Techs"
  status: 'active' | 'on_call' | 'unavailable';
  rateInfo?: string; // e.g. "$200 / service", "$350 / day"
  notes?: string;
  avatarInitials?: string;
}

export type PartnerRequestStatus =
  | 'pending_sms'
  | 'sms_sent'
  | 'reminder_1_sent'
  | 'reminder_2_sent'
  | 'overdue_unconfirmed'
  | 'confirmed'
  | 'declined'
  | 'completed';

export interface PartnerScheduleRequest {
  id: string;
  caseId: string;
  caseNumber: string;
  familyReferenceName: string;
  decedentName: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  category: PartnerCategory;
  roleTitle: string;
  serviceDate: string;
  callTime: string;
  serviceEndTime?: string;
  venueLocation: string; // e.g., "630 St. Nicholas Ave - Prep Suite", "Chapel 1", "Chapel 2", "The Repast Room"
  specialInstructions: string;
  honorariumFee?: string;
  status: PartnerRequestStatus;
  requestedAt: string;
  confirmedAt?: string;
  remindersCount: number;
  lastReminderAt?: string;
  recurringIntervalMinutes: number;
  smsMessageDraft: string;
  threadMessages?: VendorSmsThreadMessage[];
  vendorNotes?: string;
  adjustedArrivalTime?: string;
  declineReason?: string;
  
  // SLA & Director Follow-Up Escalation Fields
  responseDeadline?: string; // e.g. "Today 2:00 PM" or "2026-09-18 14:00"
  isOverdue?: boolean;
  overdueMinutes?: number;
  urgencyLevel?: 'normal' | 'urgent' | 'critical';
  directorFollowUpRequired?: boolean;
  directorFollowUpNotes?: string;
  directorCalledAt?: string;
  standbyBackupPartnerId?: string;
  standbyBackupPartnerName?: string;
  standbyBackupPartnerPhone?: string;
  standbyBackupRoleTitle?: string;
  escalationStatus?: 'normal' | 'overdue_director_alert' | 'escalated_to_director' | 'backup_cascaded' | 'director_phone_confirmed';
}

export interface VendorSmsThreadMessage {
  id: string;
  sender: 'bfh_dispatch' | 'vendor';
  senderName: string;
  senderPhone: string;
  body: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  quickActionTriggered?: 'accept_confirm' | 'time_adjustment' | 'decline' | 'custom_reply';
}

// -------------------------------------------------------------
// FAMILY ARRANGEMENT CONFERENCE APPOINTMENT SCHEDULING TYPES
// -------------------------------------------------------------
export type AppointmentMeetingFormat = 'in_person_office' | 'virtual_video' | 'family_residence';

export type AppointmentStatus = 'proposed_options_sent' | 'confirmed' | 'rescheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface ProposedTimeSlot {
  id: string;
  date: string; // e.g. "2026-09-21"
  dateLabel: string; // e.g. "Monday, Sept 21, 2026"
  time: string; // e.g. "10:00 AM", "01:30 PM", "04:00 PM"
  durationMinutes: number; // e.g. 90
  isAvailable: boolean;
  selectedByFamily?: boolean;
}

export interface ArrangementAppointmentInfo {
  id: string;
  caseId: string;
  caseNumber: string;
  decedentName: string;
  informantName: string;
  informantPhone: string;
  informantEmail: string;
  
  status: AppointmentStatus;
  meetingFormat: AppointmentMeetingFormat;
  locationVenue: string; // e.g., "630 St. Nicholas Ave - Arrangement Suite A" or "630 St. Nicholas Ave - Executive Boardroom"
  
  assignedDirectorName: string; // e.g., "Jason Benta, LFD #08850"
  assignedDirectorPhone: string; // e.g., "(212) 281-8850"
  assignedDirectorEmail?: string;
  
  proposedSlots: ProposedTimeSlot[];
  confirmedSlot?: {
    date: string;
    dateLabel: string;
    time: string;
    durationMinutes: number;
  };
  confirmedAt?: string;
  
  attendingFamilyCount: number;
  attendingFamilyNames?: string[];
  specialAccommodationsNotes?: string;
  
  invitationChannel: 'sms' | 'email' | 'both';
  invitationSentAt: string;
  invitationExpiresAt?: string;
  
  smsConfirmationSent: boolean;
  emailConfirmationSent: boolean;
  calendarEventId?: string;
}

// -------------------------------------------------------------
// CASE FLIGHT CHECKLIST & STAGE GATEKEEPER TYPES
// -------------------------------------------------------------
export type FlightChecklistActionType = 
  | 'open_removal'
  | 'open_appointment'
  | 'open_contract'
  | 'open_print_ap47'
  | 'open_calendar'
  | 'open_edrs'
  | 'open_esign'
  | 'open_memorial_program'
  | 'open_chapel_qr'
  | 'open_webcast'
  | 'open_woodlawn'
  | 'open_livery'
  | 'open_partner_sms'
  | 'open_finances'
  | 'open_aftercare'
  | 'open_cash_advance_checks';

export interface CaseFlightChecklistItem {
  id: string;
  phase: CasePhase;
  code: string; // e.g. "PHL-4201", "AP-47", "EDRS-72H", "PRINT-4P", "SPLIT-BILL"
  title: string;
  description: string;
  isMandatoryForPhaseAdvance: boolean;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  actionType: FlightChecklistActionType;
  actionLabel: string;
  statutoryReference?: string;
}

export interface CaseFlightPhaseProgress {
  phase: CasePhase;
  phaseNumber: number;
  title: string;
  items: CaseFlightChecklistItem[];
  isUnlocked: boolean;
  isCompleted: boolean;
}

// -------------------------------------------------------------
// WEBCAST & SERVICE BROADCASTING TYPES (Chapel 1, Chapel 2, Repast Room)
// -------------------------------------------------------------
export type BroadcastVenueId = 'chapel_1' | 'chapel_2' | 'repast_room';

export interface WebcastScheduleInfo {
  isEnabled: boolean;
  venueId: BroadcastVenueId;
  venueName: string; // 'Chapel 1 (Main Sanctuary)' | 'Chapel 2 (Harlem Sanctuary)' | 'The Repast Room'
  streamStatus: 'scheduled' | 'pre_roll' | 'live' | 'archived' | 'offline';
  broadcastDate: string;
  broadcastStartTime: string;
  broadcastEndTime: string;
  assignedDirector: string;
  assignedAvTech: string;
  avTechPhone: string;
  streamUrl: string;
  isPinProtected: boolean;
  securityPin?: string;
  cameraPresets: string[];
  audioBoardVerified: boolean;
  recordingArchived: boolean;
  archiveDownloadUrl?: string;
  estimatedViewers?: number;
  notes?: string;
}

export interface WebcastShareInvite {
  id: string;
  caseId: string;
  recipientName: string;
  recipientContact: string;
  channel: 'sms' | 'email' | 'whatsapp';
  sentAt: string;
  status: 'sent' | 'delivered' | 'opened' | 'watching';
  viewerLocation?: string;
}

// -------------------------------------------------------------
// FIRST CALL REMOVAL, CUSTODY AFFIDAVIT & SMS CONFIRMATIONS
// -------------------------------------------------------------
export type RemovalLocationType =
  | 'hospital_morgue'
  | 'residence'
  | 'hospice_facility'
  | 'nursing_home'
  | 'medical_examiner_ocme'
  | 'airport_cargo'
  | 'other';

export type RemovalUrgency = 'stat_immediate' | 'standard_2h' | 'scheduled_window' | 'pending_physician_release';

export type RemovalVehicleType =
  | 'First Call Custom Van (BFH-1)'
  | 'Transfer Sprinter Unit (BFH-2)'
  | 'Suburban Executive Escort'
  | 'Cadillac Funeral Coach';

export interface PersonalEffectsItem {
  id: string;
  category: 'Jewelry / Rings' | 'Clothing / Shoes' | 'Watch / Electronics' | 'Documents / ID' | 'Wallet / Currency' | 'Dentures / Eyeglasses' | 'Religious Items' | 'Other';
  description: string;
  releasedBy: string; // e.g. "Nurse M. Hernandez / Mount Sinai Morgue Attendant"
  custodyReceived: boolean;
}

export interface RemovalAffidavit {
  id: string;
  caseId: string;
  caseNumber: string;
  affidavitNumber: string; // e.g. "AFF-REM-2026-0891"
  decedentName: string;
  dateOfPassing: string;
  timeOfPassing: string;
  placeOfPassing: string;
  facilityMrnOrTag?: string;
  assignedDirectorName: string;
  directorLicenseNumber: string; // e.g. "NYS LFD #08850"
  directorPhone: string;
  crewMembers: string[];
  vehicleId: string;
  vehiclePlate: string;
  
  // Informant Authority Jurat (NYS PHL § 4201)
  informantName: string;
  informantRelation: string;
  informantPhone: string;
  informantAddress: string;
  authorizationType: 'Verbal Telephone Jurat' | 'Digital Portal eSign' | 'Written Signed Affidavit';
  authorizationTimestamp: string;
  
  // Facility Custody Release
  facilityName: string;
  facilityAddress: string;
  facilityFloorRoom?: string;
  releasingAttendantName: string;
  releasingAttendantTitle: string;
  custodyReleaseTimestamp: string;
  
  // Physical Condition & Custody Verification
  bodyTagConfirmed: boolean;
  tagNumber: string;
  weightCategory: 'Standard (< 250 lbs)' | 'Heavy (250-350 lbs)' | 'Bariatric (350+ lbs)';
  equipmentUsed: string[];
  personalEffects: PersonalEffectsItem[];
  personalEffectsTotalCount: number;
  
  // Safe Arrival & Chain of Custody
  safeArrivalTimestamp?: string;
  intakeAttendantName?: string;
  status: 'draft' | 'dispatched' | 'custody_acquired' | 'safe_arrival_completed' | 'signed_verified';
  
  // Signatures
  directorSignatureDataUrl?: string;
  directorSignedAt?: string;
  facilityAttendantSignatureDataUrl?: string;
  facilitySignedAt?: string;
}

export interface RemovalScheduleInfo {
  id: string;
  caseId: string;
  status: 'pending_dispatch' | 'dispatched_en_route' | 'on_scene' | 'custody_acquired_in_transit' | 'safe_arrival_completed';
  locationType: RemovalLocationType;
  facilityName: string;
  facilityAddress: string;
  facilityFloorRoom: string;
  facilityContactPhone: string;
  morgueAttendantOrNurse: string;
  morgueReleaseHours?: string;
  
  urgency: RemovalUrgency;
  targetCallTime: string; // e.g. "Today 2:30 PM"
  estimatedArrivalMinutes: number; // e.g. 35
  
  assignedDirector: string;
  directorLicenseNumber: string;
  directorPhone: string;
  secondaryCrewMember?: string;
  vehicleType: RemovalVehicleType;
  vehiclePlate: string;
  
  specialEquipment: string[]; // e.g. ["Bariatric Cot", "Stair Chair", "PPE Isolation Kit", "Locking Seal Pouch"]
  specialInstructions?: string;
  
  // SMS Notifications
  directorSmsDispatched: boolean;
  directorSmsSentAt?: string;
  directorConfirmedAt?: string;
  
  facilitySmsDispatched: boolean;
  facilitySmsSentAt?: string;
  
  familySmsDispatched: boolean;
  familySmsSentAt?: string;
  
  // Associated Removal Affidavit
  affidavit?: RemovalAffidavit;
}

export interface LiveryCortegeRoute {
  id: string;
  caseId: string;
  
  // Step 1: Family Pick-up
  pickupLocationName: string; // e.g. "Vance Family Residence"
  pickupAddress: string; // e.g. "409 Edgecombe Ave, Apt 6B, New York, NY 10032"
  pickupContactName: string;
  pickupContactPhone: string;
  pickupTime: string; // e.g. "09:30 AM"
  pickupFloorApt?: string;
  pickupSpecialInstructions?: string; // e.g. "Wheelchair elevator access in rear lobby. 2 flower baskets accompanying cortege."

  // Step 2: Sanctuary / Chapel Service
  serviceVenueName: string; // e.g. "Benta's Funeral Home - Chapel 1 (Main Sanctuary)"
  serviceVenueAddress: string; // e.g. "630 Saint Nicholas Ave, New York, NY 10030"
  serviceTime: string; // e.g. "11:00 AM"

  // Step 3: Destination / Cemetery / Crematory Drop-off
  dropoffLocationName: string; // e.g. "Woodlawn Cemetery & Crematory"
  dropoffAddress: string; // e.g. "4199 Webster Ave, Bronx, NY 10470"
  dropoffTime?: string; // e.g. "01:30 PM"
  dropoffSpecialInstructions?: string; // e.g. "Assemble at Woolworth Chapel Gatehouse for processional drive"

  // Step 4: Optional Repast or Return Destination
  returnLocationName?: string; // e.g. "Vance Family Residence & Repast Gathering"
  returnAddress?: string; // e.g. "409 Edgecombe Ave, New York, NY 10032"
  returnRequired: boolean;

  // Passenger & Fleet Info
  totalPassengers: number;
  vehiclesAllocated: Array<{
    vehicleType: string;
    vehicleSize: string;
    quantity: number;
    assignedDriver?: string;
    driverPhone?: string;
    plateNumber?: string;
  }>;

  // Confirmation & 10-Hour Policy
  isConfirmedByFamily: boolean;
  confirmedAt?: string;
  confirmedBy?: string;
  lastModifiedAt?: string;

  serviceDateTime: string; // e.g. "2026-09-24 11:00 AM"
  cutoffHours: number; // 10
  isLockedBy10HourRule?: boolean;
}

export interface ServiceMilestoneItem {
  id: string;
  timeLabel: string;
  title: string;
  category: 'pickup' | 'viewing' | 'service' | 'motorcade' | 'committal' | 'repast' | 'custom';
  venueName: string;
  address: string;
  gpsCoordinates?: { lat: number; lng: number };
  directionsUrl?: string;
  contactPerson?: string;
  contactPhone?: string;
  specialInstructions?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  badgeLabel?: string;
  iconName?: string;
  keyDetails?: Array<{ label: string; value: string }>;
}

export interface DayOfServiceVIPItinerary {
  caseId: string;
  caseNumber: string;
  decedentName: string;
  serviceDate: string;
  directorName: string;
  directorPhone: string;
  directorEmail?: string;
  directorLicense?: string;
  limousineLeadChauffeur?: string;
  limousinePhone?: string;
  limousinePlate?: string;
  pallbearers?: Array<{ name: string; type: 'active' | 'honorary'; role?: string }>;
  milestones: ServiceMilestoneItem[];
  cortegeInstructions: string[];
  repastInfo?: {
    venue: string;
    address: string;
    time: string;
    notes?: string;
  };
  shareableToken?: string;
}

export type AnnouncementTheme = 
  | 'harlem_obsidian_gold' 
  | 'sanctuary_crimson_ivory' 
  | 'serenity_white_silver' 
  | 'heavenly_clouds_lilies';

export type AnnouncementAspectRatio = 
  | 'mobile_story_9_16' 
  | 'social_square_1_1' 
  | 'landscape_banner_16_9' 
  | 'printable_flyer_letter';

export interface FuneralAnnouncementData {
  id: string;
  caseId: string;
  theme: AnnouncementTheme;
  aspectRatio: AnnouncementAspectRatio;
  headlineTitle: string; // e.g. "Homegoing Celebration & Celebration of Life"
  decedentLegalName: string;
  lifeDates: string; // e.g. "August 14, 1944 — September 17, 2026"
  portraitUrl: string;
  portraitFrameStyle: 'arched_gold_foil' | 'oval_classic' | 'square_crest';
  
  // Ceremony Timings & Details
  visitationInfo: string;
  visitationVenue: string;
  serviceInfo: string;
  serviceVenue: string;
  serviceAddress: string;
  officiantInfo?: string;
  committalInfo: string;
  
  // Broadcast & Memorial Contributions
  webcastUrl?: string;
  webcastPin?: string;
  memorialDonationsNote?: string;
  familyMessage?: string;
  
  // Share Tracking
  totalSocialShares?: number;
  totalSmsDispatches?: number;
  lastSharedAt?: string;
}

// -------------------------------------------------------------
// FORM AP-47 / BFH GENERAL PRICE LIST STATEMENT OF GOODS TYPES
// -------------------------------------------------------------

export type ServiceTypeAP47 = 
  | 'direct_cremation' 
  | 'cremation_memorial'
  | 'cremation_with_service' 
  | 'direct_burial' 
  | 'burial_with_service' 
  | 'forwarding_remains' 
  | 'receiving_remains';

export interface LovedOneBiographyInterview {
  whoWereThey: string;
  passionsAndHobbies: string;
  faithAndSpiritualTradition: string;
  specialAccomplishments: string;
  familyLegacyNotes: string;
}

export interface FloralArrangementItem {
  id: string;
  type: 
    | 'casket_spray' 
    | 'combo'
    | 'standing_spray' 
    | 'wreath' 
    | 'heart' 
    | 'cross' 
    | 'basket' 
    | 'urn_surround' 
    | 'inside_casket' 
    | 'boutonniere_corsage' 
    | 'letter_tribute' 
    | 'danielas' 
    | 'heart_wreath' 
    | 'church_basket' 
    | 'cross_wreath' 
    | 'family_urn_surround' 
    | 'custom';
  code?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'standard';
  ribbonText?: string;
  imageUrl?: string;
  dimensions?: string;
  floristPartner?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}


export interface CustomLiveryVehicleItem {
  id: string;
  vehicleType: string; // e.g. "Cadillac Hearse", "7-Passenger Limousine", "Mercedes Sprinter Van", "Lead Escort SUV", "Transfer/Utility Van"
  rateType: 'local_nyc' | 'calverton_long_distance' | 'custom';
  escortType?: 'with_family' | 'without_family' | 'none'; // Notation: escorted with or without family
  count: number;
  unitPrice: number;
  totalAmount: number;
}

export interface FullVitalRecordInformationSheet {
  // Page 1: Decedent Information
  decedentFirstName?: string;
  decedentMiddleName?: string;
  decedentLastName?: string;
  otherKnownNames?: string;
  residenceStreet?: string;
  residenceApt?: string;
  residenceCity?: string;
  residenceState?: string;
  residenceZip?: string;
  dateOfDeath?: string;
  sex?: 'male' | 'female';
  educationLevel?: string;
  placeOfDeathFacilityOrLocation?: string;
  placeOfDeathCity?: string;
  placeOfDeathStateOrCountry?: string;
  dateOfBirth?: string;
  age?: number | string;
  birthPlaceCityStateCountry?: string;
  maritalStatus?: 'married' | 'separated' | 'never_married' | 'widowed' | 'divorced';
  ssn?: string;
  race?: string;
  occupationTitle?: string;
  typeOfBusiness?: string;
  militaryBranch?: string;
  militaryStatus?: 'active' | 'veteran' | 'none';
  fatherName?: string;
  motherFirstAndMaidenName?: string;
  spouseFirstAndMaidenName?: string;
  spouseDateOfBirth?: string;

  // Informant (Legal Next of Kin)
  informantName?: string;
  informantRelationship?: string;
  informantPhoneHome?: string;
  informantPhoneCell?: string;
  informantPhoneAlt?: string;
  informantEmail?: string;
  informantAddressStreet?: string;
  informantAddressApt?: string;
  informantAddressCityStateCountry?: string;
  informantAddressZip?: string;

  // Cemetery Deed & Previous Interment
  deedOwnerName?: string;
  deedOwnerAddress?: string;
  previousIntermentWho?: string;
  previousIntermentWhen?: string;
  previousIntermentRelation?: string;

  // Review & Verification
  reviewedOrProvidedBy?: string;
  verifiedOnDate?: string;

  // Page 2: Authorizations
  authPostObituaryWebsite?: boolean;
  authLiveStreamService?: boolean;
  authLiveStreamType?: 'public' | 'private';

  // Section To Be Completed By Funeral Director
  directorViewingDate?: string;
  directorViewingTime?: string;
  directorViewingPlace?: string;
  directorWakeDate?: string;
  directorWakeHoursFrom?: string;
  directorWakeHoursTo?: string;
  directorWakeLocation?: string;
  directorFuneralDate?: string;
  directorFuneralHour?: string;
  directorFuneralLocation?: string;
  directorFuneralAddress?: string;
  directorDispositionDate?: string;
  directorDispositionDueTime?: string;
  directorDispositionMode?: 'burial' | 'cremation' | 'entombment';
  directorCemeteryCrematory?: string;
  directorCemeteryLocation?: string;
  directorSection?: string;
  directorPlot?: string;
  directorRange?: string;
  directorGraveNum?: string;
  directorLot?: string;

  // Additional Story Information
  organizationsAssociations?: string;
  favoriteColor?: string;
  favoriteMusicType?: string;
  interests?: string;
  knownFor?: string;
  favoriteQuote?: string;
  proudestAccomplishment?: string;
  historicalMilestoneWitnessed?: string;
}

export interface StationeryProgramMatrix {
  programType: 'standard_bifold_50' | 'large_bifold_50' | 'premium_designer_50' | 'standard_booklet_50' | 'large_booklet_50' | 'custom';
  quantity: number;
  unitPrice: number;
  lateFeeApplied: boolean;
  lateFeeAmount: number;
  totalAmount: number;
}

export interface FormAP47AdditionsOrAlterations {
  id: string;
  itemDescription: string;
  authorizationInitial: string;
  amount: number;
}

export interface StatementOfGoodsSectionI {
  // A. Alternative Services
  A_alternativeServicesTitle?: string;
  A_alternativeServicesAmount: number;
  directCremationOption?: 'customer_container' | 'alternative_container';
  directBurialOption?: 'customer_container' | 'alternative_container';
  A_otherSpecify?: string;
  A_otherAmount?: number;

  // B. Transfer of Remains
  B_transferOfRemainsAmount: number;
  B_excessMilesCount: number;
  B_excessMilesRate: number;
  B_excessMilesAmount: number;
  B_otherSpecify?: string;
  B_otherAmount?: number;

  // C. Preparation of Remains
  C1_embalmingAmount: number;
  C1_embalmingSelected: boolean;
  C2_topicalDisinfectionAmount: number;
  C2_custodialCareDays: number;
  C2_custodialCareRatePerDay: number;
  C2_custodialCareAmount: number;
  C2_dressingCasketingAmount: number;
  C2_cosmetologyAmount: number;
  C2_restorationAmount: number;
  C2_refrigerationDays: number;
  C2_refrigerationRatePerDay: number;
  C2_refrigerationAmount: number;
  C2_otherSpecify?: string;
  C2_otherAmount: number;
  C_otherSpecify?: string;
  C_otherAmount?: number;

  // D. Arrangements
  D_basicArrangementsAmount: number;
  D_otherSpecify?: string;
  D_otherAmount?: number;

  // E. Supervision
  E1_supervisionVisitationAmount: number;
  E1_isAfterHours: boolean;
  E2_supervisionFuneralServiceAmount: number;
  E2_isAfterHours: boolean;
  E3_supervisionCemeteryCrematoryAmount: number;
  E3_supervisionGravesideAmount: number;
  E3_supervisionMemorialAmount: number;
  E3_supervisionDisintermentAmount: number;
  E3_consulateFilingFeeAmount: number;
  E3_otherSupervisionSpecify?: string;
  E3_otherSupervisionAmount: number;
  E_otherSpecify?: string;
  E_otherAmount?: number;

  // F. Use of Facilities
  F1_facilitiesVisitationAmount: number;
  F2_facilitiesFuneralServiceAmount: number;
  F3_facilitiesMemorialServiceAmount: number;
  F3_prepRoomCeremonialAmount: number;
  F3_repastRoomAmount: number;
  F_combinedSupervisionAndFacilitiesSelected: boolean;
  F_combinedSupervisionAndFacilitiesAmount: number;
  F_otherSpecify?: string;
  F_otherAmount?: number;
  F3_otherFacilitiesSpecify?: string;
  F3_otherFacilitiesAmount?: number;

  // G. Livery
  G_vehicles: CustomLiveryVehicleItem[];
  G_totalLiveryAmount: number;
  G_otherSpecify?: string;
  G_otherAmount?: number;

  // H. Merchandise
  H1_casketSelected: boolean;
  H1_casketSupplier: string;
  H1_casketModelNameOrNumber: string;
  H1_casketMaterialSpeciesOrGauge: string;
  H1_casketInterior: string;
  H1_casketAmount: number;
  H1_isRentalCasket: boolean;

  H2_outerReceptacleSelected: boolean;
  H2_outerReceptacleSupplier: string;
  H2_outerReceptacleModelName: string;
  H2_outerReceptacleMaterial: string;
  H2_outerReceptacleAmount: number;

  H3_urnSelected: boolean;
  H3_urnSupplier: string;
  H3_urnModelName: string;
  H3_urnMaterial: string;
  H3_urnAmount: number;

  H_otherSpecify?: string;
  H_otherAmount?: number;

  // I. Additional Services and Merchandise Selected
  I1_memorialCardsAmount: number;
  I1_memorialCardsType: 'plain_50' | 'with_photo_50' | 'custom' | 'none';
  I1_memorialCardsQty: number;

  I2_acknowledgementCardsAmount: number;
  I2_acknowledgementCardsQty: number;

  I3_casketPlateAmount: number;
  I3_casketPlateEngravingText?: string;

  I4_crucifixCrossAmount: number;
  I5_hairdressingAmount: number;
  I5_hairStylistName?: string;

  I6_flowersSelected: boolean;
  I6_noFlowersRequested: boolean;
  I6_flowerItems: FloralArrangementItem[];
  I6_totalFlowersAmount: number;

  I7_clothingBurialGarmentsAmount: number;
  I7_clothingDescription?: string;

  I8_registerBookAmount: number;
  I8_registerBookType?: string;
  I8_registerBookQty?: number;
  I8_registerBookUnitPrice?: number;

  I9_deathNoticesAmount: number;
  I9_deathNoticesPublications?: string;

  I10_programsMatrix: StationeryProgramMatrix;
  I11_videoTributeAmount: number;
  I11_videoTributePhotoCount: number;

  I12_capPanelsAmount: number;
  I12_easelPhotosAmount: number;
  I12_casketEngravingAmount: number;
  I12_urnKeepsakeTransfersAmount: number;
  I12_equipmentSetupAmount: number;
  I12_otherSpecify?: string;
  I12_otherAmount?: number;
  I12_other2Specify?: string;
  I12_other2Amount?: number;
  I12_other3Specify?: string;
  I12_other3Amount?: number;
  I_otherSpecify?: string;
  I_otherAmount?: number;
  I_other2Specify?: string;
  I_other2Amount?: number;
  I_other3Specify?: string;
  I_other3Amount?: number;

  // J. Limited Services
  J1_forwardingRemainsAmount: number;
  J1_forwardingDestination?: string;
  J2_receivingRemainsAmount: number;
  J2_receivingOrigin?: string;
  J_otherSpecify?: string;
  J_otherAmount?: number;

  totalFuneralHomeCharges: number;
}

export interface StatementOfGoodsSectionII {
  cemeteryOrCrematoryName: string;
  cemeteryOrCrematoryAmount: number;
  clergyChurchName: string;
  clergyHonorariaAmount: number;
  deathCertificateTranscriptsCount: number;
  deathCertificatePricePerCopy: number;
  deathCertificateTranscriptsAmount: number;
  isVeteranDiscountApplied?: boolean;
  freeVeteranTranscriptsCount?: number;
  liveryCashAdvanceAmount: number;
  pallbearersCount: number;
  pallbearersAmount: number;
  publicTransportationShippingAmount: number;
  gratuitiesLiveryAndStaffAmount: number;
  bridgeAndRoadTollsAmount: number;
  organistMusicianName: string;
  organistMusicianAmount: number;
  eVitalFilingFeeAmount: number;
  nycCorrectionFeeAmount: number;
  dispositionPermitAmount?: number;
  dispositionPermitType?: string;
  insuranceFunderFeeAmount?: number;
  cateringReceptionAmount: number;
  otherCashAdvanceSpecify?: string;
  otherCashAdvanceAmount?: number;
  otherCashAdvance2Specify?: string;
  otherCashAdvance2Amount?: number;
  otherCashAdvance3Specify?: string;
  otherCashAdvance3Amount?: number;
  customCashAdvances: Array<{ id: string; description: string; amount: number }>;
  totalCashAdvances: number;
}

export interface StatementOfGoodsSectionIII {
  funeralHomeChargesTotal: number;
  cashAdvancesTotal: number;
  totalFuneralCharges: number;
  lessCreditsAndInsurance: number;
  balanceDue: number;
}

export interface StatementOfGoodsSectionIV {
  embalmingExplanation: string;
  cemeteryRequirementsExplanation: string;
  combinedChargesExplanation: string;
  combinedVisitationCharge: number;
  combinedFuneralServiceCharge: number;
  combinedOtherCharge: number;

  custodyAuthorization: {
    authorized: boolean;
    relationToDeceased: string;
    authorizedAt: string;
  };

  embalmingAuthorization: {
    choice: 'embalm' | 'not_to_embalm';
    relationToDeceased: string;
    reasonNotes?: string;
  };

  termsAcknowledgement: {
    gplAcknowledged: boolean;
    casketListAcknowledged: boolean;
    outerReceptacleAcknowledged: boolean;
    acknowledgedByName: string;
    acknowledgedRelation: string;
    acknowledgedDate: string;
  };

  licensedFuneralDirector: {
    name: string;
    licenseNumber: string;
    signatureDate: string;
  };

  additionsOrAlterations: FormAP47AdditionsOrAlterations[];
  termsLateChargePercent: number;
}

export type CashAdvanceCategory =
  | 'cemetery_interment'
  | 'crematory_fee'
  | 'clergy_officiant'
  | 'death_certificates'
  | 'organist_musician'
  | 'evital_edrs_filing'
  | 'livery_tolls'
  | 'newspaper_obituary'
  | 'pallbearer_gratuity'
  | 'custom_advance';

export type CheckDisbursementStatus =
  | 'draft_queued'
  | 'check_printed'
  | 'hand_delivered_at_service'
  | 'mailed_to_vendor'
  | 'reconciled_cleared';

export interface PassThroughPayableCheck {
  id: string;
  checkNumber: string; // e.g. "CHK-10482"
  caseId: string;
  caseNumber: string; // e.g. "BFH-2026-089"
  decedentName: string; // e.g. "Dr. Marcus Aurelius Vance"
  serviceDate: string; // e.g. "2026-09-24"
  category: CashAdvanceCategory;
  categoryLabel: string; // e.g. "Cemetery Interment & Vault Opening"
  payeeName: string; // e.g. "The Woodlawn Cemetery & Crematory"
  payeeAddress?: string; // e.g. "4199 Webster Ave, Bronx, NY 10470"
  amount: number; // e.g. 1850.00
  amountInWords?: string; // e.g. "ONE THOUSAND EIGHT HUNDRED FIFTY AND 00/100 DOLLARS"
  memo: string; // e.g. "Interment: Dr. Marcus Aurelius Vance • Case #BFH-2026-089 • Svc Date: 09/24/2026"
  dateOfService: string;
  status: CheckDisbursementStatus;
  bankAccount: string; // e.g. "JPMorgan Chase Operating Pass-Through (**4892)"
  micrEncoding?: string; // e.g. "⑆021000021⑆ 9823489204⑈ 010482"
  signedByDirector: string; // e.g. "Jason Benta, LFD #08850"
  generatedAt: string;
  printedAt?: string;
  deliveredByDirector?: string;
  deliveredToRecipient?: string;
  clearedAt?: string;
  qboBillPaymentId?: string;
  notes?: string;
}

export interface ContractAdjustmentDiff {
  id: string;
  category: 'Livery' | 'Merchandise' | 'Florals' | 'Stationery' | 'Facilities' | 'Cash Advances' | 'General';
  itemDescription: string;
  fieldChanged: string; // e.g. 'Count / Qty', 'Unit Rate', 'Line Added', 'Line Removed'
  oldValue: string | number;
  newValue: string | number;
  deltaAmount: number;
}

export interface ContractRevisionArchiveRecord {
  id: string; // e.g. "REV-2026-0968-01"
  revisionNumber: number; // 1, 2, 3...
  versionLabel: string; // e.g. "v1.0 (Original Baseline Contract)", "v1.1 (Livery & Programs Adjustment)"
  savedAt: string; // ISO date
  savedAtFormatted: string; // e.g. "Oct 2, 2026 • 6:15 PM"
  savedByDirector: {
    id: string;
    name: string;
    licenseNumber: string;
    role: string;
  };
  reasonNotes?: string;
  informantApprovalName?: string;
  previousGrandTotal: number;
  newGrandTotal: number;
  netAdjustmentAmount: number;
  adjustmentsSummary: ContractAdjustmentDiff[];
  snapshotStatement: StatementOfGoodsData;
  isBaselineOriginal?: boolean;
}

export interface StatementOfGoodsData {
  id: string;
  caseId: string;
  invoiceNumber: string;
  agreementDate: string;
  serviceType: ServiceTypeAP47;
  purchaserName?: string;
  decedentName?: string;
  isVeteran?: boolean;
  lovedOneBiography: LovedOneBiographyInterview;
  vitalRecordsSheet?: FullVitalRecordInformationSheet;
  dispositionSchedule?: {
    sequence: 'same_day' | 'separate_day' | 'prior_to_service';
    dateOfDisposition?: string;
    dueTimeForDisposition?: string;
    modeOfDisposition?: 'burial' | 'cremation' | 'entombment';
    cemeteryOrCrematory?: string;
    locationCityState?: string;
    section?: string;
    plot?: string;
    range?: string;
    graveNumber?: string;
    lot?: string;
  };
  sectionI: StatementOfGoodsSectionI;
  sectionII: StatementOfGoodsSectionII;
  sectionIII: StatementOfGoodsSectionIII;
  sectionIV: StatementOfGoodsSectionIV;
  cashAdvanceChecks?: PassThroughPayableCheck[];
  contractRevisions?: ContractRevisionArchiveRecord[];
}

// ==========================================
// MANAGER & DIRECTOR SCHEDULING SUITE TYPES
// ==========================================

export type DirectorType = 'in_house' | 'outsourced';

export type DirectorAvailabilityStatus = 'available' | 'on_service' | 'scheduled_off' | 'near_overtime';

export interface DirectorColorTheme {
  name: string;
  primary: string;
  badgeBg: string;
  calendarBg: string;
  border: string;
  text: string;
}

export interface DirectorProfile {
  id: string;
  name: string;
  licenseNumber: string; // NYS LFD #
  type: DirectorType;
  roleType: 'manager' | 'funeral_director';
  title: string;
  phone: string;
  email: string;
  yearsExperience: number;
  specialties: string[];
  rating: number;
  status: DirectorAvailabilityStatus;
  colorTheme: DirectorColorTheme;
  
  // In-House Staff Specifics
  weeklyHoursLogged?: number;
  weeklyHoursCap?: number;
  hourlyOvertimeRate?: number;
  activeCasesCount?: number;
  
  // Outsourced / Trade Guild Specifics
  perDiemRate?: number; // Flat fee per funeral service (e.g. $350)
  guildAffiliation?: string; // e.g. "Harlem Funeral Directors Guild", "Tri-State Per-Diem Network"
  insuranceVerified?: boolean;
  ytdServicesCompleted?: number;
  ytdEarnings?: number;
  punctualityScore?: number; // percentage e.g. 99.4%
  
  // Capability & Operational Scope
  canMakeArrangements?: boolean; // True for in-house directors & managers who take first call & arrangement conferences
  isIndependentContractor?: boolean; // True for contractor directors assigned to funeral services only
  isManager?: boolean; // True for Managing Directors (Jason Benta, Beth Crowe, Billy McDonald)

  // Manager & Security Authentication
  securityPin?: string; // 4-digit PIN for manager / director authorization (e.g. "3995")
}

export type ServiceAssignmentStatus = 'unassigned' | 'dispatched' | 'confirmed' | 'in_progress' | 'completed' | 'declined';

export interface ServiceDirectorAssignment {
  id: string;
  caseId: string;
  caseNumber: string;
  decedentName: string;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  callTime: string;
  venueName: string;
  venueAddress: string;
  estimatedAttendance: number;
  assignedDirectorId?: string;
  assignedDirectorName?: string;
  directorType?: DirectorType;
  directorLicense?: string;
  status: ServiceAssignmentStatus;
  uniformAttireRequired: 'BFH Formal Morning Coat' | 'Dark Charcoal Suit' | 'Liturgical Vestments & White Gloves';
  vipProtocols?: string[];
  specialInstructions?: string;
  
  // Decision-Assisting Optimizer Data
  costAnalysis: {
    inHouseCost: number;
    outsourcedCost: number;
    recommendedType: DirectorType;
    recommendationReason: string;
    marginImpactSavings: number;
    fatigueRiskLevel: 'low' | 'moderate' | 'high';
  };
  
  // SMS Dispatch Thread
  dispatchSmsThread?: Array<{
    id: string;
    sender: 'manager' | 'director';
    text: string;
    timestamp: string;
  }>;
}

export interface Director1099Voucher {
  id: string;
  voucherNumber: string;
  assignmentId: string;
  directorId: string;
  directorName: string;
  directorLicense: string;
  caseNumber: string;
  decedentName: string;
  serviceDate: string;
  serviceType: string;
  amount: number;
  status: 'pending_approval' | 'approved_for_payment' | 'paid_ach';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

// -------------------------------------------------------------
// 1. MULTI-DOCUMENT DISCREPANCY & NYS PHL § 4201 GUARDRAIL
// -------------------------------------------------------------

export type DiscrepancySeverity = 'critical' | 'warning' | 'info' | 'verified';

export interface DiscrepancyItem {
  id: string;
  category: 'decedent_name' | 'dates_of_death' | 'phl_4201_kinship' | 'ap47_purchaser' | 'edrs_vitals' | 'cemetery_deed';
  title: string;
  description: string;
  severity: DiscrepancySeverity;
  goldenRecordValue: string;
  conflictingDocumentName: string;
  conflictingValue: string;
  statutoryImpact: string;
  suggestedFix: string;
  status: 'active_mismatch' | 'rectified_synced' | 'director_exception_approved';
  rectifiedAt?: string;
  exceptionNote?: string;
}

export interface DiscrepancyAuditReport {
  alignmentScore: number; // 0 to 100 percentage
  totalChecks: number;
  discrepanciesFound: number;
  lastAuditedAt: string;
  auditedBy: string;
  items: DiscrepancyItem[];
  phl4201Validated: boolean;
  phl4201PriorityTier: number; // 1 (Designee), 2 (Spouse), 3 (Domestic Partner), 4 (Adult Children), etc.
  phl4201PriorityTitle: string;
  hasCemeteryDeedConflict: boolean;
  hasEdrsVitalsConflict: boolean;
}

// -------------------------------------------------------------
// 2. DAY-OF-SERVICE DIRECTOR POCKET HUD & CORTEGE RUN-SHEET
// -------------------------------------------------------------

export type CortegeVehicleRole = 
  | 'lead_car'
  | 'flower_car'
  | 'hearse_coach'
  | 'family_limo_1'
  | 'family_limo_2'
  | 'family_limo_3'
  | 'pallbearer_van'
  | 'police_escort';

export interface CortegeDriverDispatchItem {
  id: string;
  vehicleNumber: string;
  role: CortegeVehicleRole;
  roleLabel: string;
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  plateNumber: string;
  assignedPassengers: string[];
  capacity: number;
  status: 'standby' | 'arrived_st_nicholas' | 'family_seated' | 'rolling_in_cortege' | 'arrived_at_cemetery';
  smsDispatchedAt?: string;
  smsDelivered?: boolean;
  turnByTurnUrl: string;
  specialInstructions?: string;
}

export interface DayOfServiceReadinessItem {
  id: string;
  category: 'clergy_music' | 'floral_sanctuary' | 'pallbearers' | 'media_webcast' | 'cemetery_gate';
  title: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'confirmed_ready';
  confirmedAt?: string;
  notes?: string;
}

export interface DayOfServiceHUDData {
  serviceDate: string;
  callTime: string;
  serviceStartTime: string;
  committalDepartureTime: string;
  currentPhaseIndex: number;
  leadDirectorName: string;
  leadDirectorPhone: string;
  chapelCueUrl: string;
  drivers: CortegeDriverDispatchItem[];
  readinessChecklist: DayOfServiceReadinessItem[];
  allDriversSmsDispatched: boolean;
  lastDriverSmsBroadcastAt?: string;
}

// -------------------------------------------------------------
// 3. FAMILY PROOF APPROVAL & PRINT-LOCK PROTOCOL
// -------------------------------------------------------------

export interface FamilyProofApprovalRecord {
  status: 'draft_in_review' | 'submitted_to_family' | 'family_approved_locked' | 'reopened_for_correction';
  programApproved: boolean;
  keepsakeBookApproved: boolean;
  spellingsVerified: boolean;
  photosApproved: boolean;
  legalPrintLockAcknowledged: boolean;
  signatoryFullName: string;
  signatoryRelationship: string;
  signatoryEmail: string;
  signedAt?: string;
  signatureDataUrl?: string;
  ipAddressHash?: string;
  lockedByDirector?: string;
  lockedAt?: string;
  pressVendorDispatched?: boolean;
  pressVendorDispatchedAt?: string;
  pressOrderQuantity: {
    memorialPrograms: number;
    keepsakeVolumes: number;
  };
  pressJobTicketNumber?: string;
}

// -------------------------------------------------------------
// 4. AUTOMATED GOVERNMENT FILINGS: SSA-721 STATEMENT OF DEATH
// -------------------------------------------------------------

export type SSA721Status = 'draft' | 'verified_ready' | 'transmitted' | 'acknowledged_cleared';

export interface SSA721SurvivingChild {
  name: string;
  age: number;
  isDisabled: boolean;
  isStudent: boolean;
}

export interface SSA721Filing {
  id: string;
  caseId: string;
  status: SSA721Status;
  ombControlNumber: '0960-0142';
  
  // Section 1: Deceased Person's Information
  decedentFullName: string;
  ssnMasked: string;
  ssnRaw?: string;
  dateOfBirth: string;
  dateOfDeath: string;
  sex: 'Male' | 'Female';
  
  // Section 2: Surviving Widow / Widower
  hasSurvivingSpouse: boolean;
  spouseFullName?: string;
  spouseSsnMasked?: string;
  spouseDob?: string;
  spousePhone?: string;
  spouseAddress?: string;
  livingTogetherAtDeath: boolean;
  livingApartReason?: 'temporary_medical_facility' | 'marital_separation' | 'nursing_home' | 'other';
  eligibleForLumpSumDeathPayment: boolean; // $255 LSDP
  
  // Section 3: Surviving Dependent Children
  hasSurvivingDependentChildren: boolean;
  survivingChildren?: SSA721SurvivingChild[];
  
  // Section 4: Funeral Establishment Certification
  funeralHomeName: string;
  funeralHomeAddress: string;
  funeralHomePhone: string;
  funeralHomeLicense: string;
  certifyingDirector: string;
  directorLicenseNumber: string;
  dispositionType: string;
  dispositionDate: string;
  cemeteryOrCrematoryName: string;
  cemeteryOrCrematoryLocation: string;
  
  // Transmission metadata & clearing
  transmissionMethod: 'electronic_edrs_gateway' | 'district_office_direct' | 'certified_mail';
  transmittedAt?: string;
  transmissionBatchId?: string;
  ssaConfirmationNumber?: string;
  ssaFieldOffice?: string;
  acknowledgedAt?: string;
  notes?: string;
}

// -------------------------------------------------------------
// 5. VA MILITARY HONORS & VETERANS MEMORIAL BENEFITS HUB
// -------------------------------------------------------------

export type MilitaryBranch =
  | 'U.S. Army'
  | 'U.S. Navy'
  | 'U.S. Air Force'
  | 'U.S. Marine Corps'
  | 'U.S. Coast Guard'
  | 'U.S. Space Force'
  | 'Merchant Marine (WWII)';

export type MilitaryDischargeType =
  | 'honorable'
  | 'general_under_honorable'
  | 'other_than_honorable'
  | 'bad_conduct'
  | 'dishonorable';

export type HonorGuardStatus = 'not_requested' | 'requested' | 'confirmed' | 'dispatched' | 'completed';

export interface VAMilitaryHonorsData {
  caseId: string;
  isVeteran: boolean;
  
  // DD-214 Record Vault
  dd214Verified: boolean;
  dd214DocNumber?: string;
  militaryBranch: MilitaryBranch;
  serviceEra: 'WWII' | 'Korean War' | 'Vietnam Era' | 'Persian Gulf / Desert Storm' | 'OEF / OIF' | 'GWOT' | 'Peacetime';
  highestRankAchieved: string;
  serviceNumberOrSSN: string;
  entryDate?: string;
  separationDate?: string;
  dischargeType: MilitaryDischargeType;
  valorAwards?: string[];
  
  // VA Form 27-2008 (Burial Flag Application)
  flagRequested: boolean;
  flagIssuedByPostOffice?: string;
  flagRecipientName?: string;
  flagRecipientRelationship?: string;
  
  // Military Funeral Honors Detail (DoD Directive 1300.15)
  honorGuardStatus: HonorGuardStatus;
  honorGuardBranchDetail?: string;
  honorGuardCoordinatorName?: string;
  honorGuardCoordinatorPhone?: string;
  honorGuardConfirmationCode?: string;
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  detailType: '2_person_standard' | 'full_firing_party_7_person';
  tapsType: 'live_bugler' | 'ceremonial_electronic_bugle';
  flagFoldingRequested: boolean;
  
  // VA Form 40-1330 (Government Headstone / Marker / Medallion)
  headstoneMarkerType: 'upright_marble' | 'flat_granite' | 'flat_bronze' | 'bronze_niche' | 'bronze_medallion';
  emblemOfBelief: 'latin_cross' | 'star_of_david' | 'crescent_and_star' | 'buddhist_wheel' | 'none';
  inscriptionLine1: string; // Name & Rank
  inscriptionLine2: string; // Branch & War Era
  inscriptionLine3: string; // Dates of Birth and Death
  inscriptionLine4?: string; // Valor / Personal Inscription
  
  // National Cemetery Scheduling Administration (NCA)
  nationalCemeterySelected?: 'Calverton National Cemetery' | 'Long Island National Cemetery' | 'Cypress Hills National Cemetery' | 'Private Cemetery with VA Medallion';
  ncaConfirmationNumber?: string;
  ncaSectionPlotNumber?: string;
  spouseBurialReserved: boolean;
  
  // VA Form 21P-530EZ (Burial Allowance & Plot Allowance)
  vaBurialAllowanceStatus: 'not_filed' | 'eligible_pending' | 'submitted' | 'approved';
  estimatedReimbursementAmount: number;
  presidentialMemorialCertificateRequested: boolean;
}


