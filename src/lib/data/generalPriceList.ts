import { 
  StatementOfGoodsData, 
  GoldenRecordCase,
  ServiceTypeAP47,
  CustomLiveryVehicleItem,
  FloralArrangementItem,
  ContractRevisionArchiveRecord,
  ContractAdjustmentDiff
} from '../types/funeral';
export * from './partnerCatalogs';

// -------------------------------------------------------------
// OFFICIAL BENTA'S FUNERAL HOME GENERAL PRICE LIST (APRIL 13, 2026)
// -------------------------------------------------------------

export const BFH_GPL_2026 = {
  effectiveDate: 'April 13, 2026',
  establishment: "Benta's Funeral Home, Inc.",
  address: "630 St. Nicholas Avenue, New York, NY 10030",
  phone: "(212) 281-8850-1-2-3",
  website: "www.e-bfh.com",

  // Section I.A Alternative Services (Flat Rates)
  directCremation: {
    withCustomerContainer: 2084.00,
    withAlternativeContainer: 2214.00,
  },
  directBurial: {
    withCustomerContainer: 2084.00,
    withAlternativeContainer: 2484.00,
  },

  // Section I.B Transfer of Remains
  transferOfRemainsLocalNYC: 750.00,
  excessMilesPerMileRate: 5.00,

  // Section I.C Preparation of Remains
  embalming: 900.00,
  topicalDisinfection: 400.00,
  custodialCareDailyRate: 50.00, // Charged after 24h
  dressingCasketing: 250.00,
  cosmetology: 100.00,
  restoration: 400.00,
  refrigerationDailyRate: 50.00,

  // Section I.D Arrangements
  basicArrangements: 950.00,

  // Section I.E Supervision
  supervisionVisitation: 550.00,
  supervisionVisitationAfterHours: 750.00,
  supervisionFuneralService: 550.00,
  supervisionFuneralServiceAfterHours: 750.00,
  supervisionCemeteryCrematory: 550.00,
  supervisionMemorialService: 550.00,
  supervisionGravesideCeremony: 550.00,
  supervisionDisinterment: 2500.00,
  consulateFilingFee: 200.00,

  // Section I.F Facilities
  facilitiesVisitation: 550.00,
  facilitiesFuneralService: 550.00,
  facilitiesMemorialService: 550.00,
  prepRoomCeremonialLegal: 275.00,
  repastRoomBase: 1400.00,

  // Combined Supervision & Facilities
  combinedVisitation: 1100.00,
  combinedFuneralService: 1100.00,
  combinedMemorialService: 1100.00,
  combinedVisitationAfterHours: 1300.00,
  combinedFuneralServiceAfterHours: 1300.00,

  // Section I.G Livery Rates
  livery: {
    hearseLocalNYC: 655.00,
    hearseCalverton: 755.00,
    alternativeVehicleLocal: 484.00,
    flowerVehicleLocal: 655.00,
    limousine7PaxLocal: 715.00,
    limousine7PaxCalverton: 825.00,
    sprinterVan: 1300.00, // Mercedes Sprinter Van
    sprinter10PaxLocal: 1035.00,
    sprinter10PaxCalverton: 1195.00,
    sprinter14PaxLocal: 1155.00,
    sprinter14PaxCalverton: 1315.00,
    utilityVanEscortedWithFamily: 650.00,
    utilityVanEscortedWithoutFamily: 484.00,
    overtimeHourlyRateHearseAndLimo: 120.00, // after 5h local / 6h long distance
    overtimeHourlyRateSprinter: 175.00,
  },

  // Section I.H Merchandise Ranges
  merchandiseRanges: {
    casketsMin: 130.00,
    casketsMax: 41340.00,
    outerReceptaclesMin: 895.00,
    outerReceptaclesMax: 14580.00,
    rentalCasket: 1100.00,
    urnsMin: 150.00,
    urnsMax: 6000.00,
  },

  // Section I.I Additional Services & Stationery Matrix
  stationery: {
    memorialCardsPlain50: 145.00,
    memorialCardsWithPhoto50: 200.00,
    serviceAnnouncements10: 25.00,
    stockThankYouCards25: 20.00,
    standardBiFold50: 250.00,
    largeBiFold50: 325.00,
    premiumDesigner50: 325.00,
    standardBooklet50: 655.00,
    largeBooklet50: 755.00,
    productionLateFee: 125.00, // < 48 hours
    videoTribute40Photos: 135.00,
    registerBookBase: 50.00,
    registerBookDeluxe: 85.00,
    casketPlateBase: 100.00,
    casketPlateEngraved: 150.00,
    casketEngraving: 250.00,
    capPanels: 250.00,
    easelPhotos: 25.00,
    hairdressing: 50.00,
    burialClothingMin: 30.00,
    burialClothingMax: 375.00,
    urnKeepsakeTransferEach: 25.00, // after first 1
    equipmentSetup: 375.00,
  },

  // Section I.J Limited Services
  forwardingRemainsLocal: 2084.00,
  receivingRemainsLocal: 2084.00,

  // Section II Cash Advances Defaults
  cashAdvances: {
    nycDeathCertificateTranscriptRate: 15.00, // NYC DOH rate per copy
    eVitalFilingFee: 45.00,
    nycCorrectionFee: 40.00,
  }
};

// Standard Catalog Caskets (Batesville, Matthews Aurora / Milso, BFH Collection)
export const CATALOG_CASKETS = [
  // Batesville Casket Company
  {
    supplier: "Batesville Casket Company",
    model: "The Promethean 48 oz. Solid Bronze (Gold Hardware)",
    material: "48 oz. Solid Bronze Semi-Precious Metal",
    interior: "Pearl Champagne Tufted Velvet",
    price: 14500.00
  },
  {
    supplier: "Batesville Casket Company",
    model: "Classic Gold 48 oz. Solid Bronze",
    material: "48 oz. Solid Bronze with Brushed Highlights",
    interior: "Almond Tailored Velvet",
    price: 9800.00
  },
  {
    supplier: "Batesville Casket Company",
    model: "Autumn Cherry Solid American Hardwood",
    material: "Solid Cherry Appalachian Hardwood",
    interior: "Champagne Velvet Sunburst",
    price: 4800.00
  },
  {
    supplier: "Batesville Casket Company",
    model: "Ocean Blue 18-Gauge Protective Gasketed Steel",
    material: "18-Gauge Steel (Dual-Tone Shaded Ocean Blue)",
    interior: "Light Blue Tailored Crepe",
    price: 3450.00
  },
  {
    supplier: "Batesville Casket Company",
    model: "Primrose 18-Gauge Protective Steel",
    material: "18-Gauge Steel (Antique White with Rose Shading)",
    interior: "Moss Pink Embroidered Velvet",
    price: 3200.00
  },
  {
    supplier: "Batesville Casket Company",
    model: "Gemini 20-Gauge Non-Gasketed Steel",
    material: "20-Gauge Steel (Silver / Copper Finish)",
    interior: "Rosetan Crepe Interior",
    price: 1850.00
  },

  // Matthews Aurora / Milso Casket Company
  {
    supplier: "Matthews Aurora / Milso",
    model: "Newport Topaz Brushed Stainless Steel",
    material: "Rust-Resistant Stainless Steel Alloy",
    interior: "Champagne Velvet with Cathodic Protection",
    price: 4150.00
  },
  {
    supplier: "Matthews Aurora / Milso",
    model: "Montgomery Solid American Ash Hardwood",
    material: "Solid American Ash Timber (Satin Finish)",
    interior: "Almond Velvet with Wooden Inlay Swing Bars",
    price: 3750.00
  },
  {
    supplier: "Matthews Aurora / Milso",
    model: "Sterling Storm Blue 18-Gauge Steel",
    material: "18-Gauge Gasketed Steel (Storm Blue & Platinum)",
    interior: "Spruce Blue Crepe",
    price: 2650.00
  },
  {
    supplier: "Matthews Aurora / Milso",
    model: "Sierra Hardwood Warm Walnut Satin",
    material: "Select North American Hardwood Timber",
    interior: "Rosetan Crepe",
    price: 2850.00
  },

  // BFH Ceremonial & Alternative Containers
  {
    supplier: "Benta's Rental Fleet",
    model: "The Woodlawn Ceremonial Oak Rental Casket",
    material: "Solid Appalachian Oak (With Removable Insert)",
    interior: "Champagne Velvet",
    price: 1100.00
  },
  {
    supplier: "BFH Direct Essentials",
    model: "Trayview Alternative Cremation Cardboard Container",
    material: "Heavy-Duty Corrugated Alternative Cardboard",
    interior: "Natural Kraft Unfinished Crepe Bedding",
    price: 250.00
  },
  {
    supplier: "BFH Direct Essentials",
    model: "The BFH Unfinished Pine Alternative Burial Container",
    material: "Unfinished Pine Wood",
    interior: "Pillow and Lining",
    price: 400.00
  }
];

// Standard Catalog Vaults
export const CATALOG_VAULTS = [
  {
    supplier: "Wilbert Vault Co.",
    model: "Wilbert Bronze® Triple-Reinforced Burial Vault",
    material: "Bronze Inner Liner & ABS Marbelon® / Concrete",
    price: 14580.00
  },
  {
    supplier: "Wilbert Vault Co.",
    model: "Wilbert Copper Triune® Dual-Reinforced Vault",
    material: "Solid Copper Inner Liner / Concrete",
    price: 6850.00
  },
  {
    supplier: "Wilbert Vault Co.",
    model: "Wilbert Venetian® Heavy Concrete Reinforced Vault",
    material: "ABS Fiberlon® / 3000 PSI Concrete",
    price: 2850.00
  },
  {
    supplier: "NYC Metropolitan Receptacles",
    model: "Standard Concrete Graveliner (NYC/Woodlawn Minimum)",
    material: "Poured Reinforced Concrete",
    price: 895.00
  }
];

// Standard Catalog Urns
export const CATALOG_URNS = [
  {
    supplier: "Benta Cremation Arts",
    model: "The Harlem Jazz Living Memorial Bronze Urn",
    material: "Hand-Spun Solid Bronze with Gold Leaf Patina",
    price: 1250.00
  },
  {
    supplier: "Benta Cremation Arts",
    model: "The St. Nicholas Engraved Rosewood Keepsake Urn",
    material: "Hand-Carved Solid Indian Rosewood",
    price: 650.00
  },
  {
    supplier: "Metropolitan Urn Guild",
    model: "The Cloisters White Carrara Marble Urn",
    material: "Natural Solid Carrara Marble",
    price: 850.00
  },
  {
    supplier: "Earth Memorials",
    model: "Eco-Friendly Biodegradable Scattering Urn",
    material: "100% Recycled Mulberry Bark & Plant Fibers",
    price: 275.00
  }
];

// Standard Floral Catalog Presets (Barbara's Flowers & Daniela's Flowers)
export const CATALOG_FLOWERS: Array<{
  supplier?: string;
  type: FloralArrangementItem['type'];
  description: string;
  price: number;
}> = [
  // Barbara's Flowers (Harlem)
  {
    supplier: "Barbara's Flowers (Harlem)",
    type: 'casket_spray',
    description: "Grand Harlem Casket Spray (Red Roses, White Oriental Lilies & Italian Ruscus)",
    price: 450.00
  },
  {
    supplier: "Barbara's Flowers (Harlem)",
    type: 'heart_wreath',
    description: "Solid Heart of Devotion Standing Wreath (White Carnations & Crimson Rose Cluster)",
    price: 375.00
  },
  {
    supplier: "Barbara's Flowers (Harlem)",
    type: 'heart_wreath',
    description: "Broken Heart Tribute Wreath (White Carnations with Red Rose Path)",
    price: 425.00
  },
  {
    supplier: "Barbara's Flowers (Harlem)",
    type: 'church_basket',
    description: "Altar Tribute Pedestal Baskets (Pair of Large Gladioli & Hydrangeas)",
    price: 225.00
  },
  {
    supplier: "Barbara's Flowers (Harlem)",
    type: 'casket_spray',
    description: "Cremation Urn Floral Garden Surround (Orchids & Miniature Roses)",
    price: 195.00
  },

  // Daniela's Flower Shop (Broadway / Manhattan)
  {
    supplier: "Daniela's Flower Shop (Manhattan)",
    type: 'standing_spray',
    description: "Classic White Peace Standing Spray (Calla Lilies, Dendrobium Orchids & Palms)",
    price: 295.00
  },
  {
    supplier: "Daniela's Flower Shop (Manhattan)",
    type: 'cross_wreath',
    description: "Eternal Remembrance Floral Cross (White Cushion Mums & Lavender Tea Roses)",
    price: 385.00
  },
  {
    supplier: "Daniela's Flower Shop (Manhattan)",
    type: 'casket_spray',
    description: "Garden of Memories Pastel Casket Spray (Blush Garden Roses & Eucalyptus)",
    price: 395.00
  },
  {
    supplier: "Daniela's Flower Shop (Manhattan)",
    type: 'church_basket',
    description: "Celebration of Life Table Tribute (Hydrangeas & Ivory Roses)",
    price: 125.00
  },
  {
    supplier: "BFH Floral Studio",
    type: 'boutonniere_corsage',
    description: "Honorary Pallbearer Boutonnières & Family Corsages (Set of 6 Pieces)",
    price: 120.00
  }
];

// -------------------------------------------------------------
// TOTALS CALCULATION ENGINE FOR FORM AP-47
// -------------------------------------------------------------

export const calculateAP47Totals = (data: StatementOfGoodsData): StatementOfGoodsData => {
  const s1 = { ...data.sectionI };
  const s2 = { ...data.sectionII };
  const s3 = { ...data.sectionIII };

  // Calculate Livery Total
  const liveryTotal = (s1.G_vehicles || []).reduce((acc, v) => acc + (v.count * v.unitPrice), 0);
  s1.G_totalLiveryAmount = liveryTotal;

  // Calculate Merchandise Total (Casket + Outer Receptacle + Urn)
  const casketTotal = s1.H1_casketSelected ? s1.H1_casketAmount : 0;
  const outerTotal = s1.H2_outerReceptacleSelected ? s1.H2_outerReceptacleAmount : 0;
  const urnTotal = s1.H3_urnSelected ? s1.H3_urnAmount : 0;

  // Calculate Flowers Total
  const flowersTotal = (!s1.I6_noFlowersRequested && s1.I6_flowersSelected)
    ? (s1.I6_flowerItems || []).reduce((acc, f) => acc + (f.quantity * f.unitPrice), 0)
    : 0;
  s1.I6_totalFlowersAmount = flowersTotal;

  // Calculate Programs Matrix Total
  const programsTotal = s1.I10_programsMatrix.quantity > 0 
    ? s1.I10_programsMatrix.unitPrice + (s1.I10_programsMatrix.lateFeeApplied ? s1.I10_programsMatrix.lateFeeAmount : 0)
    : 0;
  s1.I10_programsMatrix.totalAmount = programsTotal;

  // Transfer of Remains excess miles
  const excessMilesTotal = s1.B_excessMilesCount * s1.B_excessMilesRate;
  s1.B_excessMilesAmount = excessMilesTotal;

  // Custodial Care & Refrigeration
  const custodialTotal = s1.C2_custodialCareDays * s1.C2_custodialCareRatePerDay;
  s1.C2_custodialCareAmount = custodialTotal;
  const refrigerationTotal = s1.C2_refrigerationDays * s1.C2_refrigerationRatePerDay;
  s1.C2_refrigerationAmount = refrigerationTotal;

  // Register Book calculation
  const regBookUnit = s1.I8_registerBookUnitPrice || BFH_GPL_2026.stationery.registerBookBase;
  const regBookQty = s1.I8_registerBookQty !== undefined ? s1.I8_registerBookQty : (s1.I8_registerBookAmount > 0 ? Math.round(s1.I8_registerBookAmount / regBookUnit) : 0);
  s1.I8_registerBookQty = regBookQty;
  s1.I8_registerBookUnitPrice = regBookUnit;
  s1.I8_registerBookAmount = regBookQty * regBookUnit;

  // Calculate Section I: Funeral Home Charges Total
  const aOther = s1.A_otherAmount || 0;
  const bOther = s1.B_otherAmount || 0;
  const cOther = (s1.C2_otherAmount || 0) + (s1.C_otherAmount || 0);
  const dOther = s1.D_otherAmount || 0;
  const eOther = (s1.E3_otherSupervisionAmount || 0) + (s1.E_otherAmount || 0);
  const fOther = (s1.F_otherAmount || 0) + (s1.F3_otherFacilitiesAmount || 0);
  const gOther = s1.G_otherAmount || 0;
  const hOther = s1.H_otherAmount || 0;
  const iOther = (s1.I_otherAmount || 0) + (s1.I12_otherAmount || 0) +
                 (s1.I_other2Amount || 0) + (s1.I12_other2Amount || 0) +
                 (s1.I_other3Amount || 0) + (s1.I12_other3Amount || 0);
  const jOther = s1.J_otherAmount || 0;

  let sectionITotal = 0;
  if (data.serviceType === 'direct_cremation' || data.serviceType === 'direct_burial') {
    sectionITotal = s1.A_alternativeServicesAmount + aOther + excessMilesTotal + bOther + custodialTotal + refrigerationTotal + cOther + dOther + eOther + fOther +
      casketTotal + outerTotal + urnTotal + hOther + flowersTotal + programsTotal + s1.I1_memorialCardsAmount +
      s1.I2_acknowledgementCardsAmount + s1.I3_casketPlateAmount + s1.I8_registerBookAmount +
      s1.I11_videoTributeAmount + s1.I12_capPanelsAmount + s1.I12_easelPhotosAmount +
      s1.I12_casketEngravingAmount + s1.I12_urnKeepsakeTransfersAmount + s1.I12_equipmentSetupAmount + iOther;
  } else if (data.serviceType === 'cremation_memorial') {
    // Cremation and Memorial Service (Direct Cremation Base + Memorial Supervision & Facilities + Variables)
    sectionITotal = s1.A_alternativeServicesAmount + aOther + s1.E3_supervisionMemorialAmount + eOther + s1.F3_facilitiesMemorialServiceAmount +
      s1.F3_repastRoomAmount + fOther + excessMilesTotal + bOther + custodialTotal + refrigerationTotal + cOther + dOther +
      urnTotal + hOther + flowersTotal + programsTotal + s1.I1_memorialCardsAmount +
      s1.I2_acknowledgementCardsAmount + s1.I3_casketPlateAmount + s1.I8_registerBookAmount +
      s1.I11_videoTributeAmount + s1.I12_capPanelsAmount + s1.I12_easelPhotosAmount +
      s1.I12_casketEngravingAmount + s1.I12_urnKeepsakeTransfersAmount + s1.I12_equipmentSetupAmount + iOther + liveryTotal + gOther;
  } else if (data.serviceType === 'forwarding_remains') {
    sectionITotal = s1.J1_forwardingRemainsAmount + jOther + excessMilesTotal + bOther + casketTotal + hOther;
  } else if (data.serviceType === 'receiving_remains') {
    sectionITotal = s1.J2_receivingRemainsAmount + jOther + excessMilesTotal + bOther + casketTotal + hOther;
  } else {
    // Traditional Service and Burial / Funeral Service with Cremation
    sectionITotal = 
      s1.B_transferOfRemainsAmount + excessMilesTotal + bOther +
      (s1.C1_embalmingSelected ? s1.C1_embalmingAmount : 0) +
      s1.C2_topicalDisinfectionAmount + custodialTotal + s1.C2_dressingCasketingAmount +
      s1.C2_cosmetologyAmount + s1.C2_restorationAmount + refrigerationTotal + cOther +
      s1.D_basicArrangementsAmount + dOther +
      s1.E1_supervisionVisitationAmount + s1.E2_supervisionFuneralServiceAmount +
      s1.E3_supervisionCemeteryCrematoryAmount + s1.E3_supervisionGravesideAmount +
      s1.E3_supervisionMemorialAmount + s1.E3_supervisionDisintermentAmount +
      s1.E3_consulateFilingFeeAmount + eOther +
      s1.F1_facilitiesVisitationAmount + s1.F2_facilitiesFuneralServiceAmount +
      s1.F3_facilitiesMemorialServiceAmount + s1.F3_prepRoomCeremonialAmount +
      s1.F3_repastRoomAmount + fOther +
      (s1.F_combinedSupervisionAndFacilitiesSelected ? s1.F_combinedSupervisionAndFacilitiesAmount : 0) +
      liveryTotal + gOther +
      casketTotal + outerTotal + urnTotal + hOther +
      s1.I1_memorialCardsAmount + s1.I2_acknowledgementCardsAmount + s1.I3_casketPlateAmount +
      s1.I4_crucifixCrossAmount + s1.I5_hairdressingAmount + flowersTotal +
      s1.I7_clothingBurialGarmentsAmount + s1.I8_registerBookAmount + s1.I9_deathNoticesAmount +
      programsTotal + s1.I11_videoTributeAmount + s1.I12_capPanelsAmount + s1.I12_easelPhotosAmount +
      s1.I12_casketEngravingAmount + s1.I12_urnKeepsakeTransfersAmount + s1.I12_equipmentSetupAmount + iOther +
      aOther + jOther;
  }

  s1.totalFuneralHomeCharges = sectionITotal;

  // Calculate Section II: Cash Advances
  // Veterans get 3 free death certificates:
  const isVet = data.isVeteran || s2.isVeteranDiscountApplied || false;
  const freeVetTranscripts = isVet ? Math.min(3, s2.deathCertificateTranscriptsCount) : 0;
  s2.isVeteranDiscountApplied = isVet;
  s2.freeVeteranTranscriptsCount = freeVetTranscripts;
  const billableTranscriptsCount = Math.max(0, s2.deathCertificateTranscriptsCount - freeVetTranscripts);
  const transcriptsTotal = billableTranscriptsCount * s2.deathCertificatePricePerCopy;
  s2.deathCertificateTranscriptsAmount = transcriptsTotal;

  const customCashTotal = (s2.customCashAdvances || []).reduce((acc, c) => acc + c.amount, 0);
  const otherCashAdvanceTotal = (s2.otherCashAdvanceAmount || 0) +
                                (s2.otherCashAdvance2Amount || 0) +
                                (s2.otherCashAdvance3Amount || 0);

  const sectionIITotal = 
    s2.cemeteryOrCrematoryAmount +
    s2.clergyHonorariaAmount +
    transcriptsTotal +
    s2.liveryCashAdvanceAmount +
    s2.pallbearersAmount +
    s2.publicTransportationShippingAmount +
    s2.gratuitiesLiveryAndStaffAmount +
    s2.bridgeAndRoadTollsAmount +
    s2.organistMusicianAmount +
    s2.eVitalFilingFeeAmount +
    s2.nycCorrectionFeeAmount +
    s2.cateringReceptionAmount +
    otherCashAdvanceTotal +
    customCashTotal;

  s2.totalCashAdvances = sectionIITotal;

  // Calculate Section III: Summary
  const grandTotal = sectionITotal + sectionIITotal;
  s3.funeralHomeChargesTotal = sectionITotal;
  s3.cashAdvancesTotal = sectionIITotal;
  s3.totalFuneralCharges = grandTotal;
  s3.balanceDue = Math.max(0, grandTotal - s3.lessCreditsAndInsurance);

  return {
    ...data,
    sectionI: s1,
    sectionII: s2,
    sectionIII: s3,
  };
};

// -------------------------------------------------------------
// DEFAULT GENERATOR FOR A GIVEN CASE
// -------------------------------------------------------------

export const getDefaultStatementOfGoodsForCase = (c: GoldenRecordCase): StatementOfGoodsData => {
  const isCremation = c.dispositionType === 'direct_cremation' || c.dispositionType === 'cremation_memorial' || c.dispositionType === 'full_cremation';
  let serviceType: ServiceTypeAP47 = 'burial_with_service';
  if (c.dispositionType === 'direct_cremation') serviceType = 'direct_cremation';
  else if (c.dispositionType === 'cremation_memorial') serviceType = 'cremation_memorial';
  else if (c.dispositionType === 'full_cremation') serviceType = 'cremation_with_service';
  else if (c.dispositionType === 'direct_burial') serviceType = 'direct_burial';
  else serviceType = 'burial_with_service';

  const defaultLiveryVehicles: CustomLiveryVehicleItem[] = [
    {
      id: 'liv-1',
      vehicleType: 'Cadillac Professional Funeral Hearse',
      rateType: 'local_nyc',
      escortType: 'none',
      count: 0,
      unitPrice: BFH_GPL_2026.livery.hearseLocalNYC,
      totalAmount: 0
    },
    {
      id: 'liv-2',
      vehicleType: '7-Passenger Cadillac Family Limousine',
      rateType: 'local_nyc',
      escortType: 'with_family',
      count: 0,
      unitPrice: BFH_GPL_2026.livery.limousine7PaxLocal,
      totalAmount: 0
    },
    {
      id: 'liv-3',
      vehicleType: 'Mercedes Sprinter Van (14-Passenger)',
      rateType: 'local_nyc',
      escortType: 'with_family',
      count: 0,
      unitPrice: BFH_GPL_2026.livery.sprinterVan,
      totalAmount: 0
    },
    {
      id: 'liv-4',
      vehicleType: 'Transfer / Utility Van',
      rateType: 'local_nyc',
      escortType: 'without_family',
      count: 0,
      unitPrice: BFH_GPL_2026.livery.utilityVanEscortedWithoutFamily,
      totalAmount: 0
    },
    {
      id: 'liv-5',
      vehicleType: 'Lead Director / NYPD Escort Vehicle',
      rateType: 'local_nyc',
      escortType: 'none',
      count: 0,
      unitPrice: BFH_GPL_2026.livery.alternativeVehicleLocal,
      totalAmount: 0
    }
  ];

  const defaultFloralItems: FloralArrangementItem[] = [];

  const rawData: StatementOfGoodsData = {
    id: `sog-${c.id}`,
    caseId: c.id,
    invoiceNumber: `${c.caseNumber}-AP47`,
    agreementDate: c.serviceSelections.serviceDate || '2026-09-22',
    serviceType: serviceType,
    isVeteran: c.decedent.veteran || false,
    lovedOneBiography: {
      whoWereThey: `${c.decedent.legalName}, beloved parent, educator, and community pillar in Harlem. Born in ${c.decedent.dateOfBirth?.split('-')[0] || '1944'}, dedicated to civic education, music, and family.`,
      passionsAndHobbies: "Jazz concerts at Apollo Theater, classic literature, Harlem history preservation, church choir.",
      faithAndSpiritualTradition: "Baptist / Abyssinian Baptist Church Tradition.",
      specialAccomplishments: "Retired Dean of Humanities, Columbia University; Lifetime Member NAACP.",
      familyLegacyNotes: `Surviving spouse ${c.informant.fullName} and 3 loving children and grandchildren.`
    },
    vitalRecordsSheet: c.vitalRecordsSheet ? { ...c.vitalRecordsSheet } : {
      decedentFirstName: c.decedent.legalName?.split(' ')[0] || '',
      decedentMiddleName: c.decedent.legalName?.split(' ').length > 2 ? c.decedent.legalName.split(' ')[1] : '',
      decedentLastName: c.decedent.legalName?.split(' ').slice(-1)[0] || '',
      otherKnownNames: '',
      residenceStreet: c.decedent.residenceAddress || '',
      residenceApt: '',
      residenceCity: c.decedent.city || '',
      residenceState: c.decedent.state || 'NY',
      residenceZip: c.decedent.zipCode || '',
      dateOfDeath: c.decedent.dateOfDeath || '',
      sex: c.decedent.gender === 'female' ? 'female' : 'male',
      educationLevel: '',
      placeOfDeathFacilityOrLocation: c.decedent.placeOfDeath || '',
      placeOfDeathCity: c.decedent.city || '',
      placeOfDeathStateOrCountry: 'NY, USA',
      dateOfBirth: c.decedent.dateOfBirth || '',
      age: c.decedent.dateOfBirth && c.decedent.dateOfDeath ? (new Date(c.decedent.dateOfDeath).getFullYear() - new Date(c.decedent.dateOfBirth).getFullYear()) : '',
      birthPlaceCityStateCountry: '',
      maritalStatus: c.decedent.maritalStatus === 'married' ? 'married' : (c.decedent.maritalStatus === 'widowed' ? 'widowed' : (c.decedent.maritalStatus === 'divorced' ? 'divorced' : 'never_married')),
      ssn: c.decedent.ssn || c.decedent.ssnMasked || '',
      race: '',
      occupationTitle: c.decedent.occupation || '',
      typeOfBusiness: c.decedent.industry || '',
      militaryBranch: c.decedent.branchOfService || '',
      militaryStatus: c.decedent.veteran ? 'veteran' : 'none',
      fatherName: c.decedent.fatherName || '',
      motherFirstAndMaidenName: c.decedent.motherMaidenName || '',
      spouseFirstAndMaidenName: c.informant.relationship?.toLowerCase().includes('spouse') || c.informant.relationship?.toLowerCase().includes('wife') || c.informant.relationship?.toLowerCase().includes('husband') ? c.informant.fullName : '',
      spouseDateOfBirth: '',

      informantName: c.informant.fullName || '',
      informantRelationship: c.informant.relationship || '',
      informantPhoneHome: c.informant.phone || '',
      informantPhoneCell: c.informant.phone || '',
      informantPhoneAlt: '',
      informantEmail: c.informant.email || '',
      informantAddressStreet: c.informant.address || '',
      informantAddressApt: '',
      informantAddressCityStateCountry: '',
      informantAddressZip: '',

      deedOwnerName: '',
      deedOwnerAddress: '',
      previousIntermentWho: '',
      previousIntermentWhen: '',
      previousIntermentRelation: '',

      reviewedOrProvidedBy: c.informant.fullName ? `${c.informant.fullName}${c.informant.relationship ? ` (${c.informant.relationship})` : ''}` : '',
      verifiedOnDate: c.serviceSelections?.serviceDate || new Date().toISOString().split('T')[0],

      authPostObituaryWebsite: true,
      authLiveStreamService: true,
      authLiveStreamType: 'public',

      directorViewingDate: c.serviceSelections.serviceDate || '2026-09-22',
      directorViewingTime: '10:00 AM',
      directorViewingPlace: c.serviceSelections.viewingParlor || 'Chapel 1 (Main Sanctuary)',
      directorWakeDate: '',
      directorWakeHoursFrom: '04:00 PM',
      directorWakeHoursTo: '08:00 PM',
      directorWakeLocation: 'Chapel 1 (Main Sanctuary)',
      directorFuneralDate: c.serviceSelections.serviceDate || '2026-09-22',
      directorFuneralHour: c.serviceSelections.serviceTime || '11:00 AM',
      directorFuneralLocation: c.serviceSelections.serviceVenueName || "Benta's Funeral Home - Chapel 1",
      directorFuneralAddress: '630 St. Nicholas Ave, New York, NY 10030',
      directorDispositionDate: c.serviceSelections.serviceDate || '2026-09-22',
      directorDispositionDueTime: '01:30 PM',
      directorDispositionMode: isCremation ? 'cremation' : 'burial',
      directorCemeteryCrematory: c.serviceSelections.crematoryOrCemeteryName || 'The Woodlawn Cemetery & Crematory',
      directorCemeteryLocation: 'Bronx, NY',
      directorSection: 'Oak Crest',
      directorPlot: 'Lot 14',
      directorRange: 'Range B',
      directorGraveNum: 'Grave 4',
      directorLot: 'Lot 14B',

      organizationsAssociations: 'Alpha Phi Alpha Fraternity, Harlem Historical Society, NAACP Lifetime Member',
      favoriteColor: 'Royal Blue & Gold',
      favoriteMusicType: 'Classic Gospel, Traditional Hymns & Bebop Jazz',
      interests: 'Reading, mentoring Harlem youth, gardening, piano',
      knownFor: 'Warm wisdom, unconditional kindness, brilliant lectures, community leadership',
      favoriteQuote: 'To whom much is given, much is required.',
      proudestAccomplishment: 'Mentoring three generations of Harlem scholars and seeing all his children graduate college.',
      historicalMilestoneWitnessed: '1963 March on Washington & 2008 Presidential Inauguration'
    },
    dispositionSchedule: {
      sequence: 'same_day',
      dateOfDisposition: c.serviceSelections.serviceDate || '2026-09-22',
      dueTimeForDisposition: '01:30 PM',
      modeOfDisposition: isCremation ? 'cremation' : 'burial',
      cemeteryOrCrematory: c.serviceSelections.crematoryOrCemeteryName || 'The Woodlawn Cemetery & Crematory',
      locationCityState: 'Bronx, NY',
      section: 'Section 48',
      plot: 'Plot 12',
      range: 'Range A',
      graveNumber: 'Grave 2',
      lot: 'Lot 8'
    },
    sectionI: {
      A_alternativeServicesTitle: 'N/A (Full Service Selected)',
      A_alternativeServicesAmount: 0,
      directCremationOption: undefined,
      directBurialOption: undefined,
      A_otherSpecify: '',
      A_otherAmount: 0,

      B_transferOfRemainsAmount: BFH_GPL_2026.transferOfRemainsLocalNYC,
      B_excessMilesCount: 0,
      B_excessMilesRate: BFH_GPL_2026.excessMilesPerMileRate,
      B_excessMilesAmount: 0,
      B_otherSpecify: '',
      B_otherAmount: 0,

      C1_embalmingAmount: BFH_GPL_2026.embalming,
      C1_embalmingSelected: false,
      C2_topicalDisinfectionAmount: 0,
      C2_custodialCareDays: 0,
      C2_custodialCareRatePerDay: BFH_GPL_2026.custodialCareDailyRate,
      C2_custodialCareAmount: 0,
      C2_dressingCasketingAmount: 0,
      C2_cosmetologyAmount: 0,
      C2_restorationAmount: 0,
      C2_refrigerationDays: 0,
      C2_refrigerationRatePerDay: BFH_GPL_2026.refrigerationDailyRate,
      C2_refrigerationAmount: 0,
      C2_otherSpecify: '',
      C2_otherAmount: 0,
      C_otherSpecify: '',
      C_otherAmount: 0,

      D_basicArrangementsAmount: BFH_GPL_2026.basicArrangements,
      D_otherSpecify: '',
      D_otherAmount: 0,

      E1_supervisionVisitationAmount: 0,
      E1_isAfterHours: false,
      E2_supervisionFuneralServiceAmount: 0,
      E2_isAfterHours: false,
      E3_supervisionCemeteryCrematoryAmount: 0,
      E3_supervisionGravesideAmount: 0,
      E3_supervisionMemorialAmount: 0,
      E3_supervisionDisintermentAmount: 0,
      E3_consulateFilingFeeAmount: 0,
      E3_otherSupervisionSpecify: '',
      E3_otherSupervisionAmount: 0,
      E_otherSpecify: '',
      E_otherAmount: 0,

      F1_facilitiesVisitationAmount: 0,
      F2_facilitiesFuneralServiceAmount: 0,
      F3_facilitiesMemorialServiceAmount: 0,
      F3_prepRoomCeremonialAmount: 0,
      F3_repastRoomAmount: 0,
      F_combinedSupervisionAndFacilitiesSelected: false,
      F_combinedSupervisionAndFacilitiesAmount: 0,
      F_otherSpecify: '',
      F_otherAmount: 0,
      F3_otherFacilitiesSpecify: '',
      F3_otherFacilitiesAmount: 0,

      G_vehicles: defaultLiveryVehicles,
      G_totalLiveryAmount: 0,
      G_otherSpecify: '',
      G_otherAmount: 0,

      H1_casketSelected: false,
      H1_casketSupplier: 'Batesville / BFH Reserve',
      H1_casketModelNameOrNumber: c.serviceSelections.casketOrUrnSelected || 'The Harlem Heritage Imperial Bronze',
      H1_casketMaterialSpeciesOrGauge: '32oz Solid Bronze with Gold Leaf Trim',
      H1_casketInterior: 'Pearl Champagne Velvet with Sunburst Cap Panel',
      H1_casketAmount: 0,
      H1_isRentalCasket: false,

      H2_outerReceptacleSelected: false,
      H2_outerReceptacleSupplier: 'Wilbert Vault Co.',
      H2_outerReceptacleModelName: 'Wilbert Venetian® Heavy Concrete Reinforced Vault',
      H2_outerReceptacleMaterial: 'ABS Fiberlon® / 3000 PSI Concrete (NYC Requirement)',
      H2_outerReceptacleAmount: 0,

      H3_urnSelected: false,
      H3_urnSupplier: 'Benta Cremation Arts',
      H3_urnModelName: 'The Harlem Jazz Living Memorial Bronze Urn',
      H3_urnMaterial: 'Hand-Spun Solid Bronze with Gold Leaf Patina',
      H3_urnAmount: 0,

      H_otherSpecify: '',
      H_otherAmount: 0,

      I1_memorialCardsAmount: 0,
      I1_memorialCardsType: 'with_photo_50',
      I1_memorialCardsQty: 0,

      I2_acknowledgementCardsAmount: 0,
      I2_acknowledgementCardsQty: 0,

      I3_casketPlateAmount: 0,
      I3_casketPlateEngravingText: `${c.decedent.legalName} • 1944 — 2026`,

      I4_crucifixCrossAmount: 0,
      I5_hairdressingAmount: 0,
      I5_hairStylistName: 'Harlem Master Stylist',

      I6_flowersSelected: false,
      I6_noFlowersRequested: false,
      I6_flowerItems: defaultFloralItems,
      I6_totalFlowersAmount: 0,

      I7_clothingBurialGarmentsAmount: 0,
      I8_registerBookAmount: 0,
      I8_registerBookQty: 0,
      I8_registerBookUnitPrice: BFH_GPL_2026.stationery.registerBookBase,
      I8_registerBookType: 'Leatherette Keepsake Register Book with Gold Benta Crest ($50.00)',

      I9_deathNoticesAmount: 0,
      I10_programsMatrix: {
        programType: 'large_bifold_50',
        quantity: 0,
        unitPrice: BFH_GPL_2026.stationery.largeBiFold50,
        lateFeeApplied: false,
        lateFeeAmount: 0,
        totalAmount: 0
      },

      I11_videoTributeAmount: 0,
      I11_videoTributePhotoCount: 0,

      I12_capPanelsAmount: 0,
      I12_easelPhotosAmount: 0,
      I12_casketEngravingAmount: 0,
      I12_urnKeepsakeTransfersAmount: 0,
      I12_equipmentSetupAmount: 0,
      I12_otherSpecify: '',
      I12_otherAmount: 0,
      I12_other2Specify: '',
      I12_other2Amount: 0,
      I12_other3Specify: '',
      I12_other3Amount: 0,
      I_otherSpecify: '',
      I_otherAmount: 0,
      I_other2Specify: '',
      I_other2Amount: 0,
      I_other3Specify: '',
      I_other3Amount: 0,

      J1_forwardingRemainsAmount: 0,
      J2_receivingRemainsAmount: 0,
      J_otherSpecify: '',
      J_otherAmount: 0,

      totalFuneralHomeCharges: 0
    },
    sectionII: {
      cemeteryOrCrematoryName: c.serviceSelections.crematoryOrCemeteryName || 'Woodlawn Cemetery & Crematory (Bronx, NY)',
      cemeteryOrCrematoryAmount: isCremation ? 525.00 : 1850.00,
      clergyChurchName: 'Abyssinian Baptist Church / Sanctuary Staff',
      clergyHonorariaAmount: 350.00,
      deathCertificateTranscriptsCount: 6,
      deathCertificatePricePerCopy: BFH_GPL_2026.cashAdvances.nycDeathCertificateTranscriptRate,
      deathCertificateTranscriptsAmount: (c.decedent.veteran ? 3 : 6) * BFH_GPL_2026.cashAdvances.nycDeathCertificateTranscriptRate,
      isVeteranDiscountApplied: c.decedent.veteran || false,
      freeVeteranTranscriptsCount: c.decedent.veteran ? 3 : 0,
      liveryCashAdvanceAmount: 0,
      pallbearersCount: 0,
      pallbearersAmount: 400.00,
      publicTransportationShippingAmount: 0,
      gratuitiesLiveryAndStaffAmount: 100.00,
      bridgeAndRoadTollsAmount: 125.00,
      organistMusicianName: 'Sanctuary Master Organist',
      organistMusicianAmount: 300.00,
      eVitalFilingFeeAmount: BFH_GPL_2026.cashAdvances.eVitalFilingFee,
      nycCorrectionFeeAmount: 0,
      cateringReceptionAmount: 0,
      otherCashAdvanceSpecify: '',
      otherCashAdvanceAmount: 0,
      otherCashAdvance2Specify: '',
      otherCashAdvance2Amount: 0,
      otherCashAdvance3Specify: '',
      otherCashAdvance3Amount: 0,
      customCashAdvances: [],
      totalCashAdvances: 0
    },
    sectionIII: {
      funeralHomeChargesTotal: 0,
      cashAdvancesTotal: 0,
      totalFuneralCharges: 0,
      lessCreditsAndInsurance: c.totalPaid || 0,
      balanceDue: 0
    },
    sectionIV: {
      embalmingExplanation: 'Embalming is performed in accordance with family request for open casket public viewing and sanctuary memorial celebration pursuant to 10 NYCRR § 77.7.',
      cemeteryRequirementsExplanation: isCremation 
        ? 'Crematory requires rigid leak-proof container.' 
        : 'Cemetery regulations require outer interment receptacle (graveliner/vault) to prevent grave sinking.',
      combinedChargesExplanation: 'Separate itemized charges are indicated for facilities and supervision as per BFH General Price List.',
      combinedVisitationCharge: 1100.00,
      combinedFuneralServiceCharge: 1100.00,
      combinedOtherCharge: 0,

      custodyAuthorization: {
        authorized: true,
        relationToDeceased: `${c.informant.relationship} (${c.informant.fullName})`,
        authorizedAt: 'Verified by Informant Jurat'
      },

      embalmingAuthorization: {
        choice: 'embalm',
        relationToDeceased: `${c.informant.relationship} (${c.informant.fullName})`,
        reasonNotes: 'Approved for public viewing and sanctuary service.'
      },

      termsAcknowledgement: {
        gplAcknowledged: true,
        casketListAcknowledged: true,
        outerReceptacleAcknowledged: true,
        acknowledgedByName: c.informant.fullName,
        acknowledgedRelation: c.informant.relationship,
        acknowledgedDate: '2026-09-18'
      },

      licensedFuneralDirector: {
        name: c.assignedDirector || 'Jason Benta',
        licenseNumber: 'NYS LFD Reg. #08850',
        signatureDate: '2026-09-19'
      },

      additionsOrAlterations: [],
      termsLateChargePercent: 1.5
    }
  };

  const calculated = calculateAP47Totals(rawData);

  // Initialize Baseline v1.0 Revision Archive Snapshot if not present
  const baselineRevision: ContractRevisionArchiveRecord = {
    id: `REV-${c.caseNumber.replace(/[^a-zA-Z0-9]/g, '')}-00`,
    revisionNumber: 1,
    versionLabel: 'v1.0 (Original Baseline Contract)',
    savedAt: new Date().toISOString(),
    savedAtFormatted: 'Baseline Original Contract Creation',
    savedByDirector: {
      id: 'dir-01',
      name: c.assignedDirector || 'Jason Benta, LFD #08850',
      licenseNumber: 'NYS LFD Reg. #08850',
      role: 'Managing Funeral Director'
    },
    reasonNotes: 'Initial arrangement conference agreement & GPL baseline itemization.',
    informantApprovalName: `${c.informant.fullName} (${c.informant.relationship})`,
    previousGrandTotal: calculated.sectionIII.totalFuneralCharges,
    newGrandTotal: calculated.sectionIII.totalFuneralCharges,
    netAdjustmentAmount: 0,
    adjustmentsSummary: [],
    snapshotStatement: JSON.parse(JSON.stringify(calculated)),
    isBaselineOriginal: true
  };

  calculated.contractRevisions = [baselineRevision];
  return calculated;
};

// -------------------------------------------------------------
// CONTRACT ADJUSTMENTS & AUDIT REVISION DIFF ENGINE
// -------------------------------------------------------------

export const computeContractDiffs = (
  prev: StatementOfGoodsData,
  next: StatementOfGoodsData
): ContractAdjustmentDiff[] => {
  const diffs: ContractAdjustmentDiff[] = [];
  let counter = 1;

  // 1. Livery Vehicles
  const prevVehicles = prev.sectionI.G_vehicles || [];
  const nextVehicles = next.sectionI.G_vehicles || [];
  const handledNextIds = new Set<string>();

  prevVehicles.forEach((pv) => {
    const nv = nextVehicles.find(v => v.id === pv.id || v.vehicleType === pv.vehicleType);
    if (!nv) {
      diffs.push({
        id: `diff-${Date.now()}-${counter++}`,
        category: 'Livery',
        itemDescription: pv.vehicleType,
        fieldChanged: 'Removed Vehicle from Contract',
        oldValue: `${pv.count}x ($${(pv.count * pv.unitPrice).toFixed(2)})`,
        newValue: '0x ($0.00)',
        deltaAmount: -(pv.count * pv.unitPrice)
      });
    } else {
      handledNextIds.add(nv.id);
      if (pv.count !== nv.count || pv.unitPrice !== nv.unitPrice) {
        const oldTotal = pv.count * pv.unitPrice;
        const newTotal = nv.count * nv.unitPrice;
        diffs.push({
          id: `diff-${Date.now()}-${counter++}`,
          category: 'Livery',
          itemDescription: nv.vehicleType,
          fieldChanged: pv.count !== nv.count ? 'Count / Qty Adjusted' : 'Unit Rate Adjusted',
          oldValue: `${pv.count}x @ $${pv.unitPrice.toFixed(2)}`,
          newValue: `${nv.count}x @ $${nv.unitPrice.toFixed(2)}`,
          deltaAmount: newTotal - oldTotal
        });
      }
    }
  });

  nextVehicles.forEach((nv) => {
    if (!handledNextIds.has(nv.id) && !prevVehicles.some(v => v.vehicleType === nv.vehicleType)) {
      diffs.push({
        id: `diff-${Date.now()}-${counter++}`,
        category: 'Livery',
        itemDescription: nv.vehicleType,
        fieldChanged: 'Added Vehicle to Fleet',
        oldValue: '0x ($0.00)',
        newValue: `${nv.count}x @ $${nv.unitPrice.toFixed(2)}`,
        deltaAmount: nv.count * nv.unitPrice
      });
    }
  });

  // 2. Florals
  const prevFlowers = prev.sectionI.I6_flowerItems || [];
  const nextFlowers = next.sectionI.I6_flowerItems || [];
  const handledNextFlowerIds = new Set<string>();

  prevFlowers.forEach((pf) => {
    const nf = nextFlowers.find(f => f.id === pf.id || (f.code && f.code === pf.code) || f.description === pf.description);
    if (!nf) {
      diffs.push({
        id: `diff-${Date.now()}-${counter++}`,
        category: 'Florals',
        itemDescription: pf.name || pf.description,
        fieldChanged: 'Removed Floral Tribute',
        oldValue: `${pf.quantity}x ($${(pf.quantity * pf.unitPrice).toFixed(2)})`,
        newValue: '0x ($0.00)',
        deltaAmount: -(pf.quantity * pf.unitPrice)
      });
    } else {
      handledNextFlowerIds.add(nf.id);
      if (pf.quantity !== nf.quantity || pf.unitPrice !== nf.unitPrice) {
        const oldTotal = pf.quantity * pf.unitPrice;
        const newTotal = nf.quantity * nf.unitPrice;
        diffs.push({
          id: `diff-${Date.now()}-${counter++}`,
          category: 'Florals',
          itemDescription: nf.name || nf.description,
          fieldChanged: 'Quantity / Rate Adjusted',
          oldValue: `${pf.quantity}x @ $${pf.unitPrice.toFixed(2)}`,
          newValue: `${nf.quantity}x @ $${nf.unitPrice.toFixed(2)}`,
          deltaAmount: newTotal - oldTotal
        });
      }
    }
  });

  nextFlowers.forEach((nf) => {
    if (!handledNextFlowerIds.has(nf.id) && !prevFlowers.some(f => (f.code && f.code === nf.code) || f.description === nf.description)) {
      diffs.push({
        id: `diff-${Date.now()}-${counter++}`,
        category: 'Florals',
        itemDescription: nf.name || nf.description,
        fieldChanged: 'Added Floral Tribute',
        oldValue: '0x ($0.00)',
        newValue: `${nf.quantity}x @ $${nf.unitPrice.toFixed(2)}`,
        deltaAmount: nf.quantity * nf.unitPrice
      });
    }
  });

  // 3. Merchandise (Casket, Urn, Vault)
  if (prev.sectionI.H1_casketAmount !== next.sectionI.H1_casketAmount || prev.sectionI.H1_casketModelNameOrNumber !== next.sectionI.H1_casketModelNameOrNumber) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Merchandise',
      itemDescription: `Casket: ${next.sectionI.H1_casketModelNameOrNumber || 'Selected Casket'}`,
      fieldChanged: 'Casket Model / Amount',
      oldValue: `$${prev.sectionI.H1_casketAmount.toFixed(2)}`,
      newValue: `$${next.sectionI.H1_casketAmount.toFixed(2)}`,
      deltaAmount: next.sectionI.H1_casketAmount - prev.sectionI.H1_casketAmount
    });
  }

  if (prev.sectionI.H2_outerReceptacleAmount !== next.sectionI.H2_outerReceptacleAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Merchandise',
      itemDescription: `Vault: ${next.sectionI.H2_outerReceptacleModelName || 'Burial Vault'}`,
      fieldChanged: 'Vault / Receptacle Selection',
      oldValue: `$${prev.sectionI.H2_outerReceptacleAmount.toFixed(2)}`,
      newValue: `$${next.sectionI.H2_outerReceptacleAmount.toFixed(2)}`,
      deltaAmount: next.sectionI.H2_outerReceptacleAmount - prev.sectionI.H2_outerReceptacleAmount
    });
  }

  if (prev.sectionI.H3_urnAmount !== next.sectionI.H3_urnAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Merchandise',
      itemDescription: `Urn: ${next.sectionI.H3_urnModelName || 'Memorial Urn'}`,
      fieldChanged: 'Urn / Keepsake Selection',
      oldValue: `$${prev.sectionI.H3_urnAmount.toFixed(2)}`,
      newValue: `$${next.sectionI.H3_urnAmount.toFixed(2)}`,
      deltaAmount: next.sectionI.H3_urnAmount - prev.sectionI.H3_urnAmount
    });
  }

  // 4. Stationery & Programs
  if (prev.sectionI.I10_programsMatrix.quantity !== next.sectionI.I10_programsMatrix.quantity || prev.sectionI.I10_programsMatrix.unitPrice !== next.sectionI.I10_programsMatrix.unitPrice) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Stationery',
      itemDescription: 'Printed Memorial Programs & Booklets',
      fieldChanged: 'Print Quantity Adjusted',
      oldValue: `${prev.sectionI.I10_programsMatrix.quantity} qty ($${prev.sectionI.I10_programsMatrix.totalAmount.toFixed(2)})`,
      newValue: `${next.sectionI.I10_programsMatrix.quantity} qty ($${next.sectionI.I10_programsMatrix.totalAmount.toFixed(2)})`,
      deltaAmount: next.sectionI.I10_programsMatrix.totalAmount - prev.sectionI.I10_programsMatrix.totalAmount
    });
  }

  if (prev.sectionI.I1_memorialCardsQty !== next.sectionI.I1_memorialCardsQty || prev.sectionI.I1_memorialCardsAmount !== next.sectionI.I1_memorialCardsAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Stationery',
      itemDescription: 'Memorial / Prayer Cards (50 pk)',
      fieldChanged: 'Cards Quantity Adjusted',
      oldValue: `${prev.sectionI.I1_memorialCardsQty || 0} cards ($${prev.sectionI.I1_memorialCardsAmount.toFixed(2)})`,
      newValue: `${next.sectionI.I1_memorialCardsQty || 0} cards ($${next.sectionI.I1_memorialCardsAmount.toFixed(2)})`,
      deltaAmount: next.sectionI.I1_memorialCardsAmount - prev.sectionI.I1_memorialCardsAmount
    });
  }

  if (prev.sectionI.I2_acknowledgementCardsQty !== next.sectionI.I2_acknowledgementCardsQty || prev.sectionI.I2_acknowledgementCardsAmount !== next.sectionI.I2_acknowledgementCardsAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Stationery',
      itemDescription: 'Acknowledgement Thank You Cards',
      fieldChanged: 'Quantity Adjusted',
      oldValue: `${prev.sectionI.I2_acknowledgementCardsQty || 0} cards ($${prev.sectionI.I2_acknowledgementCardsAmount.toFixed(2)})`,
      newValue: `${next.sectionI.I2_acknowledgementCardsQty || 0} cards ($${next.sectionI.I2_acknowledgementCardsAmount.toFixed(2)})`,
      deltaAmount: next.sectionI.I2_acknowledgementCardsAmount - prev.sectionI.I2_acknowledgementCardsAmount
    });
  }

  // 5. Facilities & Repast
  if (prev.sectionI.F3_repastRoomAmount !== next.sectionI.F3_repastRoomAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Facilities',
      itemDescription: 'BFH Historic Repast Room Reservation',
      fieldChanged: next.sectionI.F3_repastRoomAmount > 0 ? 'Added Repast Room' : 'Removed Repast Room',
      oldValue: `$${prev.sectionI.F3_repastRoomAmount.toFixed(2)}`,
      newValue: `$${next.sectionI.F3_repastRoomAmount.toFixed(2)}`,
      deltaAmount: next.sectionI.F3_repastRoomAmount - prev.sectionI.F3_repastRoomAmount
    });
  }

  // 6. Cash Advances
  if (prev.sectionII.cemeteryOrCrematoryAmount !== next.sectionII.cemeteryOrCrematoryAmount || prev.sectionII.cemeteryOrCrematoryName !== next.sectionII.cemeteryOrCrematoryName) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Cash Advances',
      itemDescription: `Cemetery/Crematory: ${next.sectionII.cemeteryOrCrematoryName || 'Interment/Cremation Fee'}`,
      fieldChanged: 'Cemetery Fee Adjusted',
      oldValue: `$${prev.sectionII.cemeteryOrCrematoryAmount.toFixed(2)}`,
      newValue: `$${next.sectionII.cemeteryOrCrematoryAmount.toFixed(2)}`,
      deltaAmount: next.sectionII.cemeteryOrCrematoryAmount - prev.sectionII.cemeteryOrCrematoryAmount
    });
  }

  if (prev.sectionII.deathCertificateTranscriptsCount !== next.sectionII.deathCertificateTranscriptsCount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Cash Advances',
      itemDescription: 'NYC Certified Death Certificate Transcripts',
      fieldChanged: 'Transcripts Count Adjusted',
      oldValue: `${prev.sectionII.deathCertificateTranscriptsCount} copies ($${prev.sectionII.deathCertificateTranscriptsAmount.toFixed(2)})`,
      newValue: `${next.sectionII.deathCertificateTranscriptsCount} copies ($${next.sectionII.deathCertificateTranscriptsAmount.toFixed(2)})`,
      deltaAmount: next.sectionII.deathCertificateTranscriptsAmount - prev.sectionII.deathCertificateTranscriptsAmount
    });
  }

  if (prev.sectionII.clergyHonorariaAmount !== next.sectionII.clergyHonorariaAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Cash Advances',
      itemDescription: 'Clergy Honoraria / Church Officiant',
      fieldChanged: 'Honorarium Amount Adjusted',
      oldValue: `$${prev.sectionII.clergyHonorariaAmount.toFixed(2)}`,
      newValue: `$${next.sectionII.clergyHonorariaAmount.toFixed(2)}`,
      deltaAmount: next.sectionII.clergyHonorariaAmount - prev.sectionII.clergyHonorariaAmount
    });
  }

  if (prev.sectionII.pallbearersAmount !== next.sectionII.pallbearersAmount) {
    diffs.push({
      id: `diff-${Date.now()}-${counter++}`,
      category: 'Cash Advances',
      itemDescription: 'Professional Pallbearers Crew',
      fieldChanged: 'Pallbearers Fee Adjusted',
      oldValue: `$${prev.sectionII.pallbearersAmount.toFixed(2)}`,
      newValue: `$${next.sectionII.pallbearersAmount.toFixed(2)}`,
      deltaAmount: next.sectionII.pallbearersAmount - prev.sectionII.pallbearersAmount
    });
  }

  // 7. Section I & II "Other" Custom Fields
  const otherChecks = [
    { cat: 'Alternative Services', name: 'Other Alternative Services', prevSpec: prev.sectionI.A_otherSpecify, nextSpec: next.sectionI.A_otherSpecify, prevAmt: prev.sectionI.A_otherAmount || 0, nextAmt: next.sectionI.A_otherAmount || 0 },
    { cat: 'Transfer of Remains', name: 'Other Transfer of Remains', prevSpec: prev.sectionI.B_otherSpecify, nextSpec: next.sectionI.B_otherSpecify, prevAmt: prev.sectionI.B_otherAmount || 0, nextAmt: next.sectionI.B_otherAmount || 0 },
    { cat: 'Preparation of Remains', name: 'Other Preparation', prevSpec: prev.sectionI.C2_otherSpecify || prev.sectionI.C_otherSpecify, nextSpec: next.sectionI.C2_otherSpecify || next.sectionI.C_otherSpecify, prevAmt: (prev.sectionI.C2_otherAmount || 0) + (prev.sectionI.C_otherAmount || 0), nextAmt: (next.sectionI.C2_otherAmount || 0) + (next.sectionI.C_otherAmount || 0) },
    { cat: 'Arrangements', name: 'Other Arrangements', prevSpec: prev.sectionI.D_otherSpecify, nextSpec: next.sectionI.D_otherSpecify, prevAmt: prev.sectionI.D_otherAmount || 0, nextAmt: next.sectionI.D_otherAmount || 0 },
    { cat: 'Supervision', name: 'Other Supervision', prevSpec: prev.sectionI.E3_otherSupervisionSpecify || prev.sectionI.E_otherSpecify, nextSpec: next.sectionI.E3_otherSupervisionSpecify || next.sectionI.E_otherSpecify, prevAmt: (prev.sectionI.E3_otherSupervisionAmount || 0) + (prev.sectionI.E_otherAmount || 0), nextAmt: (next.sectionI.E3_otherSupervisionAmount || 0) + (next.sectionI.E_otherAmount || 0) },
    { cat: 'Facilities', name: 'Other Facilities', prevSpec: prev.sectionI.F_otherSpecify || prev.sectionI.F3_otherFacilitiesSpecify, nextSpec: next.sectionI.F_otherSpecify || next.sectionI.F3_otherFacilitiesSpecify, prevAmt: (prev.sectionI.F_otherAmount || 0) + (prev.sectionI.F3_otherFacilitiesAmount || 0), nextAmt: (next.sectionI.F_otherAmount || 0) + (next.sectionI.F3_otherFacilitiesAmount || 0) },
    { cat: 'Livery', name: 'Other Livery', prevSpec: prev.sectionI.G_otherSpecify, nextSpec: next.sectionI.G_otherSpecify, prevAmt: prev.sectionI.G_otherAmount || 0, nextAmt: next.sectionI.G_otherAmount || 0 },
    { cat: 'Merchandise', name: 'Other Merchandise', prevSpec: prev.sectionI.H_otherSpecify, nextSpec: next.sectionI.H_otherSpecify, prevAmt: prev.sectionI.H_otherAmount || 0, nextAmt: next.sectionI.H_otherAmount || 0 },
    { cat: 'Additional Services', name: 'Other Additional Services/Merchandise (Line 1)', prevSpec: prev.sectionI.I_otherSpecify || prev.sectionI.I12_otherSpecify, nextSpec: next.sectionI.I_otherSpecify || next.sectionI.I12_otherSpecify, prevAmt: (prev.sectionI.I_otherAmount || 0) + (prev.sectionI.I12_otherAmount || 0), nextAmt: (next.sectionI.I_otherAmount || 0) + (next.sectionI.I12_otherAmount || 0) },
    { cat: 'Additional Services', name: 'Other Additional Services/Merchandise (Line 2)', prevSpec: prev.sectionI.I_other2Specify || prev.sectionI.I12_other2Specify, nextSpec: next.sectionI.I_other2Specify || next.sectionI.I12_other2Specify, prevAmt: (prev.sectionI.I_other2Amount || 0) + (prev.sectionI.I12_other2Amount || 0), nextAmt: (next.sectionI.I_other2Amount || 0) + (next.sectionI.I12_other2Amount || 0) },
    { cat: 'Additional Services', name: 'Other Additional Services/Merchandise (Line 3)', prevSpec: prev.sectionI.I_other3Specify || prev.sectionI.I12_other3Specify, nextSpec: next.sectionI.I_other3Specify || next.sectionI.I12_other3Specify, prevAmt: (prev.sectionI.I_other3Amount || 0) + (prev.sectionI.I12_other3Amount || 0), nextAmt: (next.sectionI.I_other3Amount || 0) + (next.sectionI.I12_other3Amount || 0) },
    { cat: 'Cash Advances', name: 'Other Cash Advance (Line 1)', prevSpec: prev.sectionII.otherCashAdvanceSpecify, nextSpec: next.sectionII.otherCashAdvanceSpecify, prevAmt: prev.sectionII.otherCashAdvanceAmount || 0, nextAmt: next.sectionII.otherCashAdvanceAmount || 0 },
    { cat: 'Cash Advances', name: 'Other Cash Advance (Line 2)', prevSpec: prev.sectionII.otherCashAdvance2Specify, nextSpec: next.sectionII.otherCashAdvance2Specify, prevAmt: prev.sectionII.otherCashAdvance2Amount || 0, nextAmt: next.sectionII.otherCashAdvance2Amount || 0 },
    { cat: 'Cash Advances', name: 'Other Cash Advance (Line 3)', prevSpec: prev.sectionII.otherCashAdvance3Specify, nextSpec: next.sectionII.otherCashAdvance3Specify, prevAmt: prev.sectionII.otherCashAdvance3Amount || 0, nextAmt: next.sectionII.otherCashAdvance3Amount || 0 },
  ];

  for (const oc of otherChecks) {
    if (oc.prevAmt !== oc.nextAmt || oc.prevSpec !== oc.nextSpec) {
      diffs.push({
        id: `diff-${Date.now()}-${counter++}`,
        category: oc.cat as any,
        itemDescription: `${oc.name}: ${oc.nextSpec || oc.prevSpec || 'Custom Item'}`,
        fieldChanged: oc.prevAmt === 0 && oc.nextAmt > 0 ? 'Added Other Item' : oc.nextAmt === 0 ? 'Removed Other Item' : 'Other Item Amount/Description Modified',
        oldValue: `${oc.prevSpec ? `"${oc.prevSpec}" ` : ''}$${oc.prevAmt.toFixed(2)}`,
        newValue: `${oc.nextSpec ? `"${oc.nextSpec}" ` : ''}$${oc.nextAmt.toFixed(2)}`,
        deltaAmount: oc.nextAmt - oc.prevAmt
      });
    }
  }

  return diffs;
};

