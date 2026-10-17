import { 
  PreNeedTrustAccount, 
  InsuranceAssignmentClaim, 
  GoldenRecordCase,
  CasePhase,
  FullVitalRecordInformationSheet
} from '../types/funeral';
import { INITIAL_DOCUMENT_TEMPLATES } from './mockCases';
import { getDefaultStatementOfGoodsForCase } from './generalPriceList';

export const INITIAL_PRE_NEED_ACCOUNTS: PreNeedTrustAccount[] = [
  {
    id: 'PNT-2026-881',
    clientName: 'Mrs. Clara Mae Washington',
    purchaserName: 'Mrs. Clara Mae Washington',
    relationship: 'Self (Pre-Planning Beneficiary)',
    clientDob: '1944-03-12',
    clientSsnMasked: '***-**-4192',
    phone: '(212) 690-3341',
    email: 'clara.washington@harlemmail.com',
    address: '145 W 138th St, Apt 4B, New York, NY 10030',
    trustType: 'irrevocable_medicaid',
    escrowDepository: 'PrePlan (NYSFDA Trust)',
    accountNumber: 'PRP-NY-902814',
    depositDate: '2023-05-14',
    initialPrincipal: 11500,
    accumulatedInterest: 948.75,
    adminFeeRate: 0.75,
    currentTotalBalance: 12448.75,
    medicaidSpendDownCertified: true,
    medicaidNoticeNumber: 'NYC-HRA-MED-774920',
    status: 'active_accumulating',
    selectedServices: {
      dispositionType: 'full_burial',
      servicePackageName: 'Traditional Homegoing Sanctuary Service (Chapel 1)',
      servicePackagePrice: 5850,
      casketName: 'Batesville Promethean Bronze (Velvet Interior)',
      casketPrice: 3800,
      outerBurialVault: 'Milso Venetian Triune Concrete Burial Vault',
      vaultPrice: 1650,
      cashAdvancesTotal: 1148.75,
      totalContractPrice: 12448.75
    },
    assignedDirector: 'Jason Benta',
    lastTaxYear1099Issued: 2025,
    notes: 'Irrevocable trust established for Medicaid qualification prior to Amsterdam Nursing Home admission. All assets fully protected under NY GBL § 453.'
  },
  {
    id: 'PNT-2026-882',
    clientName: 'Deacon Harold J. Thorne',
    purchaserName: 'Evelyn Thorne (Spouse)',
    relationship: 'Spouse',
    clientDob: '1947-08-22',
    clientSsnMasked: '***-**-7821',
    phone: '(212) 234-8890',
    email: 'deacon.thorne@abyssinian.org',
    address: '409 Edgecombe Ave, Apt 11C, New York, NY 10032',
    trustType: 'revocable_standard',
    escrowDepository: 'M&T Bank Escrow',
    accountNumber: 'MT-ESC-559102',
    depositDate: '2024-02-10',
    initialPrincipal: 9800,
    accumulatedInterest: 412.30,
    adminFeeRate: 0.75,
    currentTotalBalance: 10212.30,
    medicaidSpendDownCertified: false,
    status: 'active_accumulating',
    selectedServices: {
      dispositionType: 'full_burial',
      servicePackageName: 'Church Sanctuary Service & Committal Procession',
      servicePackagePrice: 5200,
      casketName: 'Batesville Golden Rose 18-Gauge Steel',
      casketPrice: 3100,
      outerBurialVault: 'Milso Standard Concrete Box',
      vaultPrice: 950,
      cashAdvancesTotal: 962.30,
      totalContractPrice: 10212.30
    },
    assignedDirector: 'Jason Benta',
    lastTaxYear1099Issued: 2025,
    notes: 'Standard revocable pre-need agreement. Family holds right to revoke or transfer under NYS regulations.'
  },
  {
    id: 'PNT-2026-883',
    clientName: 'Ms. Gladys Robinson',
    purchaserName: 'Anthony Robinson (Son)',
    relationship: 'Son (Power of Attorney)',
    clientDob: '1939-11-05',
    clientSsnMasked: '***-**-1934',
    phone: '(646) 555-0144',
    email: 'anthony.robinson@nyc.rr.com',
    address: '2280 Frederick Douglass Blvd, New York, NY 10027',
    trustType: 'irrevocable_medicaid',
    escrowDepository: 'PrePlan (NYSFDA Trust)',
    accountNumber: 'PRP-NY-883011',
    depositDate: '2022-09-18',
    initialPrincipal: 7800,
    accumulatedInterest: 894.20,
    adminFeeRate: 0.75,
    currentTotalBalance: 8694.20,
    medicaidSpendDownCertified: true,
    medicaidNoticeNumber: 'NYC-HRA-MED-902148',
    status: 'active_accumulating',
    selectedServices: {
      dispositionType: 'cremation_memorial',
      servicePackageName: 'Memorial Chapel Service & Woodlawn Cremation',
      servicePackagePrice: 4200,
      casketName: 'Batesville Delray Hardwood Rental / Ceremonial Unit',
      casketPrice: 1450,
      outerBurialVault: 'Milso Aegean Urn Vault (Cultured Marble)',
      vaultPrice: 650,
      cashAdvancesTotal: 2394.20,
      totalContractPrice: 8694.20
    },
    assignedDirector: 'Marcus Sterling',
    lastTaxYear1099Issued: 2025,
    notes: 'Irrevocable Medicaid spend-down certification filed with NYC Department of Social Services. Protected against nursing home look-back.'
  },
  {
    id: 'PNT-2026-884',
    clientName: 'Arthur Sterling',
    purchaserName: 'Arthur Sterling',
    relationship: 'Self',
    clientDob: '1951-06-19',
    clientSsnMasked: '***-**-6045',
    phone: '(212) 862-7711',
    email: 'asterling51@gmail.com',
    address: '555 Edgecombe Ave, New York, NY 10032',
    trustType: 'irrevocable_medicaid',
    escrowDepository: 'Flagstar / Signature Bank Escrow',
    accountNumber: 'FSB-TR-339182',
    depositDate: '2021-11-04',
    initialPrincipal: 13500,
    accumulatedInterest: 1420.50,
    adminFeeRate: 0.75,
    currentTotalBalance: 14920.50,
    medicaidSpendDownCertified: true,
    medicaidNoticeNumber: 'NYC-HRA-MED-649012',
    status: 'active_accumulating',
    selectedServices: {
      dispositionType: 'full_burial',
      servicePackageName: 'Full Harlem Honors Sanctuary & 4-Car Cortège to Woodlawn',
      servicePackagePrice: 6800,
      casketName: 'Batesville Harrison Bronze 32oz',
      casketPrice: 4900,
      outerBurialVault: 'Milso Copper Triune Protective Vault',
      vaultPrice: 2100,
      cashAdvancesTotal: 1120.50,
      totalContractPrice: 14920.50
    },
    assignedDirector: 'Jason Benta',
    lastTaxYear1099Issued: 2025,
    notes: 'Sugar Hill resident. Irrevocable Medicaid Trust with full Woodlawn cemetery plot prepay voucher attached.'
  }
];

export const INITIAL_INSURANCE_CLAIMS: InsuranceAssignmentClaim[] = [
  {
    id: 'INS-CLM-9041',
    caseId: 'case-1',
    caseNumber: 'BFH-2026-089',
    decedentName: 'Mrs. Eleanor Vance',
    carrierName: 'MetLife / Brighthouse Financial',
    policyNumber: 'MET-88492019-B',
    policyFaceValue: 25000,
    fundingIntermediary: 'C&J Financial',
    beneficiaryName: 'Cheryl Vance',
    beneficiaryRelationship: 'Daughter (Designated Beneficiary)',
    beneficiaryPhone: '(212) 555-0199',
    beneficiaryEmail: 'cheryl.vance@gmail.com',
    funeralHomeContractTotal: 8450,
    factoringFeePercentage: 3.75,
    factoringFeeAmount: 316.88,
    wireProcessingFee: 50,
    netFuneralHomeWire: 8450,
    familySurplusRefund: 16183.12,
    claimStatus: 'funds_cleared_in_bfh',
    verificationChecklist: {
      policyInForceVerified: true,
      pastTwoYearContestability: true,
      noCollateralAssignments: true,
      beneficiariesConfirmed: true,
      deathCertificateUploaded: true,
      assignmentFormSigned: true
    },
    signedAssignmentDate: '2026-09-19',
    wireDispatchedTimestamp: '2026-09-20 11:42 AM',
    wireReferenceCode: 'FED-WIRE-CJ-994821',
    notes: '24-hour wire cleared in BFH Chase operating account. Family surplus of $16,183.12 direct-deposited to Cheryl Vance.'
  },
  {
    id: 'INS-CLM-9042',
    caseId: 'case-2',
    caseNumber: 'BFH-2026-090',
    decedentName: 'Mr. James Abernathy',
    carrierName: 'New York Life Insurance Company',
    policyNumber: 'NYL-44019283-WL',
    policyFaceValue: 50000,
    fundingIntermediary: 'Express Funeral Funding',
    beneficiaryName: 'Dorothy Abernathy',
    beneficiaryRelationship: 'Spouse',
    beneficiaryPhone: '(917) 555-0122',
    beneficiaryEmail: 'dorothy.abernathy@yahoo.com',
    funeralHomeContractTotal: 9200,
    factoringFeePercentage: 3.5,
    factoringFeeAmount: 322.00,
    wireProcessingFee: 50,
    netFuneralHomeWire: 9200,
    familySurplusRefund: 40428.00,
    claimStatus: 'approved_wire_pending',
    verificationChecklist: {
      policyInForceVerified: true,
      pastTwoYearContestability: true,
      noCollateralAssignments: true,
      beneficiariesConfirmed: true,
      deathCertificateUploaded: true,
      assignmentFormSigned: true
    },
    signedAssignmentDate: '2026-09-21',
    wireDispatchedTimestamp: '2026-09-22 09:15 AM',
    wireReferenceCode: 'FED-WIRE-EFF-772910',
    notes: 'Carrier underwriter approved claim. Direct Federal Reserve wire scheduled for 2:00 PM EST.'
  },
  {
    id: 'INS-CLM-9043',
    caseId: 'case-3',
    caseNumber: 'BFH-2026-091',
    decedentName: 'Rev. Marcus Thorne',
    carrierName: 'Prudential Financial',
    policyNumber: 'PRU-10928471-TL',
    policyFaceValue: 15000,
    fundingIntermediary: 'C&J Financial',
    beneficiaryName: 'Kenneth Thorne',
    beneficiaryRelationship: 'Son',
    beneficiaryPhone: '(646) 555-8941',
    beneficiaryEmail: 'kthorne@columbia.edu',
    funeralHomeContractTotal: 7800,
    factoringFeePercentage: 3.75,
    factoringFeeAmount: 292.50,
    wireProcessingFee: 50,
    netFuneralHomeWire: 7800,
    familySurplusRefund: 6857.50,
    claimStatus: 'carrier_in_review',
    verificationChecklist: {
      policyInForceVerified: true,
      pastTwoYearContestability: true,
      noCollateralAssignments: true,
      beneficiariesConfirmed: true,
      deathCertificateUploaded: false,
      assignmentFormSigned: true
    },
    signedAssignmentDate: '2026-09-22',
    notes: 'Awaiting NYC EDRS certified death certificate permit for final wire release from Prudential.'
  }
];

// Calculation helper for Pre-Need interest
export function calculatePreNeedAccrual(
  initialPrincipal: number,
  depositDate: string,
  annualInterestRate: number = 3.25,
  adminFeeRate: number = 0.75
) {
  const deposit = new Date(depositDate);
  const now = new Date();
  const diffYears = Math.max(0.1, (now.getTime() - deposit.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  
  // Net interest after NYS statutory 0.75% administration fee (NYS GBL § 453)
  const netRate = Math.max(0, (annualInterestRate - adminFeeRate) / 100);
  const compoundInterest = initialPrincipal * (Math.pow(1 + netRate, diffYears) - 1);
  const totalBalance = initialPrincipal + compoundInterest;

  return {
    diffYears: Number(diffYears.toFixed(2)),
    compoundInterest: Number(compoundInterest.toFixed(2)),
    totalBalance: Number(totalBalance.toFixed(2)),
    annualGrossInterest: Number((initialPrincipal * (annualInterestRate / 100)).toFixed(2)),
    annualAdminFee: Number((initialPrincipal * (adminFeeRate / 100)).toFixed(2))
  };
}

// 1-Click Conversion: Pre-Need Trust -> Active At-Need Golden Record Case
export function convertPreNeedToAtNeedCase(
  account: PreNeedTrustAccount,
  existingCasesCount: number
): { updatedAccount: PreNeedTrustAccount; newCase: GoldenRecordCase } {
  const now = new Date();
  const dateToday = now.toISOString().split('T')[0];
  const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const year = now.getFullYear();
  const caseNumber = `BFH-${year}-${String(existingCasesCount + 101).padStart(3, '0')}`;
  const caseId = `case-${Date.now()}`;

  // Build full vital records sheet
  const nameParts = account.clientName.replace(/^(Mrs\.|Mr\.|Ms\.|Dr\.|Rev\.|Deacon)\s+/i, '').split(' ');
  const firstName = nameParts[0] || 'Client';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Estate';
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  const vitalSheet: FullVitalRecordInformationSheet = {
    decedentFirstName: firstName,
    decedentMiddleName: middleName,
    decedentLastName: lastName,
    ssn: account.clientSsnMasked,
    dateOfBirth: account.clientDob,
    dateOfDeath: dateToday,
    sex: 'female',
    maritalStatus: 'widowed',
    residenceStreet: account.address,
    residenceCity: 'New York',
    residenceState: 'NY',
    residenceZip: '10030',
    birthPlaceCityStateCountry: 'Harlem, NY, USA',
    fatherName: 'Late Father',
    motherFirstAndMaidenName: 'Late Mother',
    militaryStatus: 'none',
    educationLevel: 'High school graduate or GED completed',
    occupationTitle: 'Retired Civil Servant',
    typeOfBusiness: 'Municipal Services',
    informantName: account.purchaserName,
    informantRelationship: account.relationship,
    informantPhoneAlt: account.phone,
    informantEmail: account.email,
    directorCemeteryCrematory: 'Woodlawn Cemetery (Bronx, NY)',
    organizationsAssociations: `Converted from Pre-Need Trust ${account.id} (${account.escrowDepository}). Pre-funded contract balance: $${account.currentTotalBalance.toLocaleString()}.`
  };

  const initialDocuments = INITIAL_DOCUMENT_TEMPLATES.map((doc) => ({
    ...doc,
    lastUpdated: `${dateToday} ${timeNow}`
  }));

  const newCase: GoldenRecordCase = {
    id: caseId,
    caseNumber,
    currentPhase: 'arrangements' as CasePhase,
    dispositionType: account.selectedServices.dispositionType,
    safeArrivalStatus: 'safe_arrival_confirmed',
    safeArrivalTimestamp: `${dateToday} ${timeNow}`,
    assignedDirector: account.assignedDirector || 'Jason Benta',
    createdAt: `${dateToday} ${timeNow}`,
    decedent: {
      legalName: account.clientName,
      gender: 'female',
      dateOfBirth: account.clientDob,
      dateOfDeath: dateToday,
      placeOfDeath: 'Harlem Hospital Center, 506 Lenox Ave, New York, NY 10037',
      facilityName: 'Harlem Hospital Center',
      ssnMasked: account.clientSsnMasked,
      maritalStatus: 'widowed',
      residenceAddress: account.address,
      city: 'New York',
      state: 'NY',
      zipCode: '10030',
      veteran: false,
      occupation: 'Retired Civil Servant',
      industry: 'Municipal Services',
      educationLevel: 'High school graduate or GED completed',
      fatherName: 'Late Father',
      motherMaidenName: 'Late Mother'
    },
    informant: {
      fullName: account.purchaserName,
      relationship: account.relationship,
      phone: account.phone,
      email: account.email,
      address: account.address,
      isNextOfKin: true,
      hasRightToControl: true
    },
    medicalCertifier: {
      physicianName: 'Dr. Sarah Jenkins, MD',
      licenseNumber: 'NY-MED-284910',
      hospitalFacility: 'Harlem Hospital Center',
      phone: '(212) 939-1000',
      edrsStatus: 'certified',
      edrsPermitNumber: `NYC-EDRS-2026-${Math.floor(10000 + Math.random() * 90000)}`
    },
    totalPaid: account.selectedServices.totalContractPrice,
    aftercare: [],
    vitalRecordsSheet: vitalSheet,
    removalSchedule: {
      id: `rem-${Date.now()}`,
      caseId,
      status: 'safe_arrival_completed',
      locationType: 'hospital_morgue',
      facilityName: 'Harlem Hospital Center Morgue',
      facilityAddress: '506 Lenox Ave, New York, NY 10037',
      facilityFloorRoom: 'Sub-Basement Pathology',
      facilityContactPhone: '(212) 939-1000',
      morgueAttendantOrNurse: 'Security Officer Jackson',
      urgency: 'scheduled_window',
      targetCallTime: `${dateToday} 14:00`,
      estimatedArrivalMinutes: 20,
      assignedDirector: account.assignedDirector || 'Jason Benta',
      directorLicenseNumber: 'NY-FD-01844',
      directorPhone: '(212) 281-8850',
      vehicleType: 'First Call Custom Van (BFH-1)',
      vehiclePlate: 'NY-COM-8821',
      specialEquipment: ['Standard Cot', 'Locking Pouch'],
      directorSmsDispatched: true,
      facilitySmsDispatched: true,
      familySmsDispatched: true
    },
    serviceSelections: {
      dispositionType: account.selectedServices.dispositionType,
      packageTitle: account.selectedServices.servicePackageName,
      basePackagePrice: account.selectedServices.servicePackagePrice,
      casketOrUrnSelected: account.selectedServices.casketName || 'Batesville Promethean Bronze',
      casketPrice: account.selectedServices.casketPrice || 3800,
      viewingParlor: 'Chapel 1 (Main Sanctuary - Seats 150)',
      crematoryOrCemeteryName: 'Woodlawn Cemetery (Bronx, NY)',
      specialRequests: 'Pre-Need Contract Terms Honored in Full'
    },
    statementOfGoods: {} as any,
    splitBilling: [
      {
        id: `split-${Date.now()}-trust`,
        payerType: 'Family ACH Direct',
        payerName: `${account.escrowDepository} Pre-Need Trust (${account.accountNumber})`,
        providerName: account.escrowDepository,
        policyNumber: account.accountNumber,
        amountAllocated: account.currentTotalBalance,
        amountPaid: account.currentTotalBalance,
        status: 'funded',
        itemAssigned: `NYS GBL § 453 Pre-Need Escrow Trust Payout (Principal $${account.initialPrincipal} + Interest $${account.accumulatedInterest})`,
        notes: `Funds transferred from Pre-Need Trust ${account.id}. Medicaid spend-down compliant.`
      }
    ],
    documents: initialDocuments,
    totalAmountDue: account.selectedServices.totalContractPrice,
    notes: [
      {
        id: `note-${Date.now()}`,
        author: 'Pre-Need Conversion System',
        timestamp: `${dateToday} ${timeNow}`,
        text: `★ CONVERTED PRE-NEED CASE: Established on ${account.depositDate} under NYS Pre-Need Trust ${account.id} (${account.trustType === 'irrevocable_medicaid' ? 'Irrevocable Medicaid Shield' : 'Revocable Trust'}). Total trust funds applied: $${account.currentTotalBalance.toLocaleString()}.`
      }
    ]
  };

  newCase.statementOfGoods = getDefaultStatementOfGoodsForCase(newCase);

  const updatedAccount: PreNeedTrustAccount = {
    ...account,
    status: 'converted_at_need',
    convertedCaseId: caseId,
    convertedAt: `${dateToday} ${timeNow}`,
    notes: `${account.notes} \n[CONVERTED TO AT-NEED CASE ${caseNumber} on ${dateToday} ${timeNow} by ${account.assignedDirector}]`
  };

  return { updatedAccount, newCase };
}

// Insurance Assignment Calculator
export function calculateInsuranceFactoring(
  contractTotal: number,
  policyFaceValue: number,
  factoringRate: number = 3.75,
  wireFee: number = 50
) {
  const factoringFeeAmount = Number((contractTotal * (factoringRate / 100)).toFixed(2));
  const totalAssignedFromPolicy = Number((contractTotal + factoringFeeAmount + wireFee).toFixed(2));
  const familySurplusRefund = Math.max(0, Number((policyFaceValue - totalAssignedFromPolicy).toFixed(2)));
  const netFuneralHomeWire = contractTotal;

  return {
    contractTotal,
    policyFaceValue,
    factoringRate,
    wireFee,
    factoringFeeAmount,
    totalAssignedFromPolicy,
    netFuneralHomeWire,
    familySurplusRefund,
    hasSufficientFaceValue: policyFaceValue >= totalAssignedFromPolicy
  };
}
