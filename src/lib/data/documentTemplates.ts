import { DocumentItem } from '../types/funeral';

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
    followUpAction: 'EDRS Permit synced to Golden Record'
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
