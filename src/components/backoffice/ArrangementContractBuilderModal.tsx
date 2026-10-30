import React, { useState } from 'react';
import { 
  GoldenRecordCase, 
  StatementOfGoodsData, 
  ServiceTypeAP47,
  FloralArrangementItem,
  CustomLiveryVehicleItem,
  ContractRevisionArchiveRecord,
  FullVitalRecordInformationSheet
} from '../../lib/types/funeral';
import { 
  BFH_GPL_2026, 
  CATALOG_VAULTS, 
  calculateAP47Totals, 
  getDefaultStatementOfGoodsForCase,
  computeContractDiffs
} from '../../lib/data/generalPriceList';
import {
  ALL_UNIFIED_MERCHANDISE,
  BATESVILLE_CASKETS,
  MILSO_CASKETS,
  ManufacturerFilter,
  searchMerchandise
} from '../../lib/data/casketCatalog';
import {
  BFH_FLORAL_CATALOG,
  DANIELAS_ORIGINAL_CATALOG,
  OTHER_FLORAL_CATALOG,
  DANIELAS_CATEGORIES,
  OTHER_FLORAL_CATEGORIES,
  FloralBookType,
  FloralCategory,
  FloralSize,
  getFloralByCode
} from '../../lib/data/floralCatalog';
import { CashAdvanceCheckPrinterModal } from './CashAdvanceCheckPrinterModal';
import { 
  CemeterySelectionModal, 
  SelectedCemeteryPayload 
} from './CemeterySelectionModal';
import { ContractRevisionArchiveModal } from './ContractRevisionArchiveModal';
import { 
  FileText, 
  Printer, 
  Save, 
  CheckCircle2, 
  Heart, 
  Package, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ChevronRight, 
  X, 
  BookOpen, 
  Building2, 
  Copy, 
  Sparkles, 
  Layers, 
  Tag, 
  Image as ImageIcon, 
  HandCoins, 
  Key, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users,
  History
} from 'lucide-react';



interface ArrangementContractBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData?: GoldenRecordCase;
  activeCase?: GoldenRecordCase;
  onSaveContract?: (caseId: string, updatedStatement: StatementOfGoodsData) => void;
  onUpdateCase?: (updatedCase: GoldenRecordCase) => void;
  onSendNotification?: (notif: any) => void;
}

export const ArrangementContractBuilderModal: React.FC<ArrangementContractBuilderModalProps> = ({
  isOpen,
  onClose,
  caseData,
  activeCase: propsActiveCase,
  onSaveContract,
  onUpdateCase,
  onSendNotification
}) => {
  const currentCase = caseData || propsActiveCase;
  if (!isOpen || !currentCase) return null;

  const activeCase = currentCase;

  // Wizard Step State (1: Biography/Story, 2: Service Type & Baseline, 3: Variables & Custom Items, 4: Live AP-47 Contract Preview)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isFamilyPortalPinModalOpen, setIsFamilyPortalPinModalOpen] = useState(false);

  // Step 2 Master Service Schedule & Timing Coordinator State
  const [scheduleServiceDate, setScheduleServiceDate] = useState<string>(() => {
    return activeCase.serviceSelections?.serviceDate || '2026-09-22';
  });
  const [scheduleServiceTime, setScheduleServiceTime] = useState<string>(() => {
    return activeCase.serviceSelections?.serviceTime || '11:00 AM';
  });
  const [scheduleDuration, setScheduleDuration] = useState<string>('1.5 Hours (Standard)');
  const [scheduleServiceVenue, setScheduleServiceVenue] = useState<string>(() => {
    return activeCase.serviceSelections?.serviceVenueName || "Benta's Funeral Home - Chapel 1 (Main Sanctuary / Seats 140)";
  });
  const [customVenueName, setCustomVenueName] = useState<string>('');
  const [scheduleViewingOption, setScheduleViewingOption] = useState<'same_day' | 'prior_evening' | 'two_day' | 'private_only' | 'none'>(() => {
    return 'same_day';
  });
  const [scheduleViewingDate, setScheduleViewingDate] = useState<string>(() => {
    return activeCase.serviceSelections?.serviceDate || '2026-09-22';
  });
  const [scheduleViewingHours, setScheduleViewingHours] = useState<string>('10:00 AM – 11:00 AM (Pre-Service)');
  const [scheduleViewingParlor, setScheduleViewingParlor] = useState<string>(() => {
    return activeCase.serviceSelections?.viewingParlor || 'Chapel 1 (Main Sanctuary - Seats 150)';
  });
  const [scheduleCortegeLineupTime, setScheduleCortegeLineupTime] = useState<string>('12:15 PM');
  const [scheduleCortegeDepartureTime, setScheduleCortegeDepartureTime] = useState<string>('12:30 PM');
  const [scheduleCommittalArrivalTime, setScheduleCommittalArrivalTime] = useState<string>('01:30 PM');
  const [scheduleOfficiantName, setScheduleOfficiantName] = useState<string>(() => {
    return activeCase.serviceSelections?.officiantName || 'Rev. Dr. Calvin O. Butts (Officiating)';
  });
  const [scheduleOrganistName, setScheduleOrganistName] = useState<string>(() => {
    return activeCase.serviceSelections?.organistName || 'Prof. Gregory Hopkins (Organist & Musical Director)';
  });
  const [scheduleRepastVenue, setScheduleRepastVenue] = useState<string>(
    "The Repast Room at Benta's (630 St. Nicholas Ave)"
  );
  const [scheduleRepastHours, setScheduleRepastHours] = useState<string>('3:00 PM – 6:00 PM (Following Committal)');
  const [scheduleRepastEnabled, setScheduleRepastEnabled] = useState<boolean>(true);

  // Active Category in Step 3
  const [activeVariablesCategory, setActiveVariablesCategory] = useState<'livery' | 'merchandise' | 'flowers' | 'stationery' | 'facilities_repast' | 'cash_advances'>('livery');

  // Main Statement of Goods State initialized with case data
  const [statementData, setStatementData] = useState<StatementOfGoodsData>(() => {
    if (activeCase.statementOfGoods) {
      return calculateAP47Totals(activeCase.statementOfGoods);
    }
    return getDefaultStatementOfGoodsForCase(activeCase);
  });

  // Vital Record Information Sheet Tab State
  const [vitalSheetPage, setVitalSheetPage] = useState<'page1' | 'page2'>('page1');

  // Local Custom Builders in Step 3
  const [newCustomVehicleType, setNewCustomVehicleType] = useState('');
  const [newCustomVehicleCount, setNewCustomVehicleCount] = useState(1);
  const [newCustomVehiclePrice, setNewCustomVehiclePrice] = useState(650);
  const [newVehicleEscortType, setNewVehicleEscortType] = useState<'with_family' | 'without_family' | 'none'>('with_family');

  // Floral Catalog Book & Selection State
  const [selectedFloralBook, setSelectedFloralBook] = useState<FloralBookType>('danielas_original');
  const [selectedFloralCategory, setSelectedFloralCategory] = useState<FloralCategory | 'all'>('all');
  const [selectedFloralCode, setSelectedFloralCode] = useState<string>('BFH-CC-001');
  const [selectedFloralSize, setSelectedFloralSize] = useState<FloralSize>('medium');
  const [selectedFloralRibbon, setSelectedFloralRibbon] = useState<string>('Loving Family');
  const [selectedFloralQty, setSelectedFloralQty] = useState<number>(1);
  const [showVisualFloralGallery, setShowVisualFloralGallery] = useState<boolean>(true);
  const [floralSearchQuery, setFloralSearchQuery] = useState<string>('');

  const [newCustomFlowerType, setNewCustomFlowerType] = useState<FloralArrangementItem['type']>('casket_spray');
  const [newCustomFlowerDesc, setNewCustomFlowerDesc] = useState('');
  const [newCustomFlowerQty, setNewCustomFlowerQty] = useState(1);
  const [newCustomFlowerPrice, setNewCustomFlowerPrice] = useState(250);

  // Batesville & Milso Casket & Merchandise Selection State
  const [casketManufacturerFilter, setCasketManufacturerFilter] = useState<ManufacturerFilter>('all');
  const [casketSearchQuery, setCasketSearchQuery] = useState<string>('');
  const [casketCategoryFilter, setCasketCategoryFilter] = useState<string>('all');
  const [selectedCasketCatalogId, setSelectedCasketCatalogId] = useState<string>('');
  const [showFullCasketGallery, setShowFullCasketGallery] = useState<boolean>(false);

  // Urn & Keepsake Selection State
  const [urnManufacturerFilter, setUrnManufacturerFilter] = useState<ManufacturerFilter>('all');
  const [urnSearchQuery, setUrnSearchQuery] = useState<string>('');
  const [selectedUrnCatalogId, setSelectedUrnCatalogId] = useState<string>('');

  const [newCashAdvDesc, setNewCashAdvDesc] = useState('');
  const [newCashAdvAmount, setNewCashAdvAmount] = useState(150);
  const [isCheckPrinterOpen, setIsCheckPrinterOpen] = useState(false);
  const [isCemeteryModalOpen, setIsCemeteryModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contract Adjustments & Revision Archive State
  const [isRevisionArchiveOpen, setIsRevisionArchiveOpen] = useState(false);
  const [contractRevisions, setContractRevisions] = useState<ContractRevisionArchiveRecord[]>(() => {
    if (activeCase.statementOfGoods?.contractRevisions && activeCase.statementOfGoods.contractRevisions.length > 0) {
      return activeCase.statementOfGoods.contractRevisions;
    }
    if (activeCase.contractRevisions && activeCase.contractRevisions.length > 0) {
      return activeCase.contractRevisions;
    }
    const defaultSog = calculateAP47Totals(activeCase.statementOfGoods || getDefaultStatementOfGoodsForCase(activeCase));
    const baseline: ContractRevisionArchiveRecord = {
      id: `REV-${activeCase.caseNumber.replace(/[^a-zA-Z0-9]/g, '')}-00`,
      revisionNumber: 1,
      versionLabel: 'v1.0 (Original Baseline Contract)',
      savedAt: new Date().toISOString(),
      savedAtFormatted: 'Baseline Original Contract Creation',
      savedByDirector: {
        id: 'dir-01',
        name: activeCase.assignedDirector || 'Jason Benta, LFD #08850',
        licenseNumber: 'NYS LFD Reg. #08850',
        role: 'Managing Funeral Director'
      },
      reasonNotes: 'Initial arrangement conference baseline agreement & GPL itemization.',
      informantApprovalName: `${activeCase.informant.fullName} (${activeCase.informant.relationship})`,
      previousGrandTotal: defaultSog.sectionIII.totalFuneralCharges,
      newGrandTotal: defaultSog.sectionIII.totalFuneralCharges,
      netAdjustmentAmount: 0,
      adjustmentsSummary: [],
      snapshotStatement: JSON.parse(JSON.stringify(defaultSog)),
      isBaselineOriginal: true
    };
    return [baseline];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const dateObj = new Date(y, m, d);
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getQuickServiceDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleCemeterySelected = (payload: SelectedCemeteryPayload) => {
    const updated = { ...statementData };
    updated.sectionII.cemeteryOrCrematoryName = payload.cemeteryName;
    updated.sectionII.cemeteryOrCrematoryAmount = payload.feeAmount;
    setStatementData(calculateAP47Totals(updated));
    showToast(`✓ Final destination set to ${payload.cemeteryName} ($${payload.feeAmount.toFixed(2)})`);
  };


  // -------------------------------------------------------------
  // HANDLERS FOR SERVICE TYPE & FLAT RATE SWITCHING
  // -------------------------------------------------------------

  const handleSelectServiceType = (type: ServiceTypeAP47) => {
    const updated = { ...statementData, serviceType: type };

    if (type === 'direct_cremation') {
      updated.sectionI.A_alternativeServicesTitle = 'Direct Cremation (Flat Rate)';
      updated.sectionI.A_alternativeServicesAmount = BFH_GPL_2026.directCremation.withCustomerContainer;
      updated.sectionI.directCremationOption = 'customer_container';
      updated.sectionI.C1_embalmingSelected = false;
      updated.sectionI.C1_embalmingAmount = 0;
      updated.sectionI.D_basicArrangementsAmount = 0; // Included in flat rate
      updated.sectionI.B_transferOfRemainsAmount = 0; // Included in flat rate
      updated.sectionI.E1_supervisionVisitationAmount = 0;
      updated.sectionI.E2_supervisionFuneralServiceAmount = 0;
      updated.sectionI.E3_supervisionMemorialAmount = 0;
      updated.sectionI.F1_facilitiesVisitationAmount = 0;
      updated.sectionI.F2_facilitiesFuneralServiceAmount = 0;
      updated.sectionI.F3_facilitiesMemorialServiceAmount = 0;
      updated.sectionI.H1_casketSelected = false;
      updated.sectionI.H3_urnSelected = true;
    } else if (type === 'cremation_memorial') {
      // Cremation and Memorial Service
      updated.sectionI.A_alternativeServicesTitle = 'Direct Cremation Base with Memorial Service';
      updated.sectionI.A_alternativeServicesAmount = BFH_GPL_2026.directCremation.withCustomerContainer;
      updated.sectionI.directCremationOption = 'customer_container';
      updated.sectionI.C1_embalmingSelected = false;
      updated.sectionI.C1_embalmingAmount = 0;
      updated.sectionI.D_basicArrangementsAmount = 0; // Included in direct cremation base
      updated.sectionI.B_transferOfRemainsAmount = 0; // Included in direct cremation base
      updated.sectionI.E1_supervisionVisitationAmount = 0;
      updated.sectionI.E2_supervisionFuneralServiceAmount = 0;
      updated.sectionI.E3_supervisionMemorialAmount = BFH_GPL_2026.supervisionMemorialService;
      updated.sectionI.F1_facilitiesVisitationAmount = 0;
      updated.sectionI.F2_facilitiesFuneralServiceAmount = 0;
      updated.sectionI.F3_facilitiesMemorialServiceAmount = BFH_GPL_2026.facilitiesMemorialService;
      updated.sectionI.H1_casketSelected = false;
      updated.sectionI.H3_urnSelected = true;
    } else if (type === 'direct_burial') {
      updated.sectionI.A_alternativeServicesTitle = 'Direct Burial (Flat Rate)';
      updated.sectionI.A_alternativeServicesAmount = BFH_GPL_2026.directBurial.withCustomerContainer;
      updated.sectionI.directBurialOption = 'customer_container';
      updated.sectionI.C1_embalmingSelected = false;
      updated.sectionI.C1_embalmingAmount = 0;
      updated.sectionI.D_basicArrangementsAmount = 0; // Included in flat rate
      updated.sectionI.B_transferOfRemainsAmount = 0; // Included in flat rate
      updated.sectionI.E1_supervisionVisitationAmount = 0;
      updated.sectionI.E2_supervisionFuneralServiceAmount = 0;
      updated.sectionI.E3_supervisionMemorialAmount = 0;
      updated.sectionI.F1_facilitiesVisitationAmount = 0;
      updated.sectionI.F2_facilitiesFuneralServiceAmount = 0;
      updated.sectionI.F3_facilitiesMemorialServiceAmount = 0;
      updated.sectionI.H1_casketSelected = false;
    } else if (type === 'forwarding_remains') {
      updated.sectionI.A_alternativeServicesAmount = 0;
      updated.sectionI.J1_forwardingRemainsAmount = BFH_GPL_2026.forwardingRemainsLocal;
      updated.sectionI.C1_embalmingSelected = true;
      updated.sectionI.C1_embalmingAmount = BFH_GPL_2026.embalming;
    } else if (type === 'receiving_remains') {
      updated.sectionI.A_alternativeServicesAmount = 0;
      updated.sectionI.J2_receivingRemainsAmount = BFH_GPL_2026.receivingRemainsLocal;
    } else {
      // Traditional Service and Burial / Funeral Service with Cremation (Variables increase)
      updated.sectionI.A_alternativeServicesAmount = 0;
      updated.sectionI.B_transferOfRemainsAmount = BFH_GPL_2026.transferOfRemainsLocalNYC;
      updated.sectionI.D_basicArrangementsAmount = BFH_GPL_2026.basicArrangements;
      updated.sectionI.C1_embalmingSelected = true;
      updated.sectionI.C1_embalmingAmount = BFH_GPL_2026.embalming;
      updated.sectionI.C2_dressingCasketingAmount = BFH_GPL_2026.dressingCasketing;
      updated.sectionI.C2_cosmetologyAmount = BFH_GPL_2026.cosmetology;
      updated.sectionI.E1_supervisionVisitationAmount = BFH_GPL_2026.supervisionVisitation;
      updated.sectionI.E2_supervisionFuneralServiceAmount = BFH_GPL_2026.supervisionFuneralService;
      updated.sectionI.E3_supervisionCemeteryCrematoryAmount = BFH_GPL_2026.supervisionCemeteryCrematory;
      updated.sectionI.F1_facilitiesVisitationAmount = BFH_GPL_2026.facilitiesVisitation;
      updated.sectionI.F2_facilitiesFuneralServiceAmount = BFH_GPL_2026.facilitiesFuneralService;
      updated.sectionI.H1_casketSelected = type === 'burial_with_service';
      updated.sectionI.H3_urnSelected = type === 'cremation_with_service';
    }

    setStatementData(calculateAP47Totals(updated));
  };

  // Direct Cremation Container Switcher
  const handleDirectCremationContainer = (opt: 'customer_container' | 'alternative_container') => {
    const updated = { ...statementData };
    updated.sectionI.directCremationOption = opt;
    updated.sectionI.A_alternativeServicesAmount = opt === 'alternative_container'
      ? BFH_GPL_2026.directCremation.withAlternativeContainer
      : BFH_GPL_2026.directCremation.withCustomerContainer;
    setStatementData(calculateAP47Totals(updated));
  };

  // Direct Burial Container Switcher
  const handleDirectBurialContainer = (opt: 'customer_container' | 'alternative_container') => {
    const updated = { ...statementData };
    updated.sectionI.directBurialOption = opt;
    updated.sectionI.A_alternativeServicesAmount = opt === 'alternative_container'
      ? BFH_GPL_2026.directBurial.withAlternativeContainer
      : BFH_GPL_2026.directBurial.withCustomerContainer;
    setStatementData(calculateAP47Totals(updated));
  };

  // -------------------------------------------------------------
  // HANDLERS FOR LIVERY, MERCHANDISE, FLOWERS, STATIONERY, CASH ADVANCES
  // -------------------------------------------------------------

  // Vital Records Information Sheet Handlers
  const updateVitalSheet = (fields: Partial<FullVitalRecordInformationSheet>) => {
    setStatementData(prev => ({
      ...prev,
      vitalRecordsSheet: {
        ...(prev.vitalRecordsSheet || {}),
        ...fields
      }
    }));
  };

  const updateDispositionSchedule = (fields: any) => {
    setStatementData(prev => ({
      ...prev,
      dispositionSchedule: {
        ...(prev.dispositionSchedule || { sequence: 'same_day' }),
        ...fields
      }
    }));
  };

  const handleAddCustomVehicle = () => {
    if (!newCustomVehicleType.trim()) return;
    const newVehicle: CustomLiveryVehicleItem = {
      id: `veh-${Date.now()}`,
      vehicleType: newCustomVehicleType.trim(),
      rateType: 'custom',
      escortType: newVehicleEscortType,
      count: newCustomVehicleCount,
      unitPrice: newCustomVehiclePrice,
      totalAmount: newCustomVehicleCount * newCustomVehiclePrice
    };
    const updated = { ...statementData };
    updated.sectionI.G_vehicles = [...(updated.sectionI.G_vehicles || []), newVehicle];
    setStatementData(calculateAP47Totals(updated));
    setNewCustomVehicleType('');
    showToast(`🚗 Added ${newVehicle.vehicleType} to livery lineup!`);
  };

  const handleAddPresetVehicle = (type: string, unitPrice: number, escortType: 'with_family' | 'without_family' | 'none' = 'none') => {
    const existing = (statementData.sectionI.G_vehicles || []).find(v => v.vehicleType.toLowerCase().includes(type.toLowerCase().slice(0, 10)));
    if (existing) {
      handleUpdateVehicleCount(existing.id, existing.count + 1);
      showToast(`🚗 Added another ${existing.vehicleType} (Count: ${existing.count + 1})`);
      return;
    }
    const newV: CustomLiveryVehicleItem = {
      id: `veh-${Date.now()}`,
      vehicleType: type,
      rateType: 'local_nyc',
      escortType: escortType,
      count: 1,
      unitPrice: unitPrice,
      totalAmount: unitPrice
    };
    const updated = { ...statementData };
    updated.sectionI.G_vehicles = [...(updated.sectionI.G_vehicles || []), newV];
    setStatementData(calculateAP47Totals(updated));
    showToast(`🚗 Added ${type} ($${unitPrice.toFixed(2)}) to livery fleet!`);
  };

  const handleUpdateVehicleCount = (vehicleId: string, newCount: number) => {
    const count = Math.max(0, newCount);
    const updated = { ...statementData };
    updated.sectionI.G_vehicles = (updated.sectionI.G_vehicles || []).map((v) =>
      v.id === vehicleId ? { ...v, count, totalAmount: count * v.unitPrice } : v
    );
    setStatementData(calculateAP47Totals(updated));
  };

  const handleUpdateVehicleUnitPrice = (vehicleId: string, newUnitPrice: number) => {
    const unitPrice = Math.max(0, newUnitPrice);
    const updated = { ...statementData };
    updated.sectionI.G_vehicles = (updated.sectionI.G_vehicles || []).map((v) =>
      v.id === vehicleId ? { ...v, unitPrice, totalAmount: v.count * unitPrice } : v
    );
    setStatementData(calculateAP47Totals(updated));
  };

  const handleUpdateVehicleEscortType = (vehicleId: string, escortType: 'with_family' | 'without_family' | 'none') => {
    const updated = { ...statementData };
    updated.sectionI.G_vehicles = (updated.sectionI.G_vehicles || []).map((v) =>
      v.id === vehicleId ? { ...v, escortType } : v
    );
    setStatementData(calculateAP47Totals(updated));
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    const updated = { ...statementData };
    updated.sectionI.G_vehicles = (updated.sectionI.G_vehicles || []).filter(v => v.id !== vehicleId);
    setStatementData(calculateAP47Totals(updated));
  };

  // Register Book Handlers
  const handleSelectRegisterBookOption = (type: 'standard' | 'deluxe') => {
    const updated = { ...statementData };
    const unit = type === 'deluxe' ? BFH_GPL_2026.stationery.registerBookDeluxe : BFH_GPL_2026.stationery.registerBookBase;
    updated.sectionI.I8_registerBookType = type === 'deluxe' ? 'Deluxe Heirloom Memorial Register Book' : 'Standard Padded Leatherette Register Book';
    updated.sectionI.I8_registerBookUnitPrice = unit;
    if ((updated.sectionI.I8_registerBookQty || 0) === 0) {
      updated.sectionI.I8_registerBookQty = 1;
    }
    updated.sectionI.I8_registerBookAmount = (updated.sectionI.I8_registerBookQty || 1) * unit;
    setStatementData(calculateAP47Totals(updated));
    showToast(`📜 Selected ${type === 'deluxe' ? 'Deluxe ($85/ea)' : 'Standard ($50/ea)'} Register Book`);
  };

  const handleUpdateRegisterBookQty = (qty: number) => {
    const count = Math.max(0, qty);
    const updated = { ...statementData };
    const unit = updated.sectionI.I8_registerBookUnitPrice || BFH_GPL_2026.stationery.registerBookBase;
    updated.sectionI.I8_registerBookQty = count;
    updated.sectionI.I8_registerBookAmount = count * unit;
    setStatementData(calculateAP47Totals(updated));
  };

  const handleUpdateRegisterBookUnitPrice = (price: number) => {
    const unit = Math.max(0, price);
    const updated = { ...statementData };
    updated.sectionI.I8_registerBookUnitPrice = unit;
    updated.sectionI.I8_registerBookAmount = (updated.sectionI.I8_registerBookQty || 0) * unit;
    setStatementData(calculateAP47Totals(updated));
  };

  // Cash Advance Veteran Benefit Handler
  const handleToggleVeteranDeathCertDiscount = (isVet: boolean) => {
    const updated = { ...statementData };
    updated.isVeteran = isVet;
    updated.sectionII.isVeteranDiscountApplied = isVet;
    setStatementData(calculateAP47Totals(updated));
    showToast(isVet ? '🎖️ Applied 3 Free Death Certificates Veteran Benefit' : 'Removed Veteran Benefit');
  };

  const handleUpdateFlowerQuantity = (flowerId: string, newQty: number) => {
    const quantity = Math.max(1, newQty);
    const updated = { ...statementData };
    updated.sectionI.I6_flowerItems = (updated.sectionI.I6_flowerItems || []).map((f) =>
      f.id === flowerId ? { ...f, quantity, totalAmount: quantity * f.unitPrice } : f
    );
    setStatementData(calculateAP47Totals(updated));
  };

  const handleUpdateFlowerUnitPrice = (flowerId: string, newUnitPrice: number) => {
    const unitPrice = Math.max(0, newUnitPrice);
    const updated = { ...statementData };
    updated.sectionI.I6_flowerItems = (updated.sectionI.I6_flowerItems || []).map((f) =>
      f.id === flowerId ? { ...f, unitPrice, totalAmount: f.quantity * unitPrice } : f
    );
    setStatementData(calculateAP47Totals(updated));
  };

  const handleArchiveNewRevision = (reasonNotes?: string) => {
    const calculated = calculateAP47Totals(statementData);
    const latestRevision = contractRevisions.length > 0 ? contractRevisions[contractRevisions.length - 1] : null;
    const prevStatement = latestRevision ? latestRevision.snapshotStatement : statementData;
    const diffs = computeContractDiffs(prevStatement, calculated);
    const revisionNumber = contractRevisions.length + 1;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const newRevRecord: ContractRevisionArchiveRecord = {
      id: `REV-${activeCase.caseNumber.replace(/[^a-zA-Z0-9]/g, '')}-${String(revisionNumber).padStart(2, '0')}`,
      revisionNumber,
      versionLabel: `v1.${revisionNumber - 1} (${reasonNotes ? (reasonNotes.length > 25 ? reasonNotes.slice(0, 25) + '...' : reasonNotes) : 'Adjustment'})`,
      savedAt: now.toISOString(),
      savedAtFormatted: formattedDate,
      savedByDirector: {
        id: 'dir-01',
        name: 'Jason Benta, LFD #08850',
        licenseNumber: 'NYS LFD Reg. #08850',
        role: 'Managing Funeral Director'
      },
      reasonNotes: reasonNotes || 'Director adjusted quantities and line item entries.',
      informantApprovalName: `${activeCase.informant.fullName} (${activeCase.informant.relationship})`,
      previousGrandTotal: latestRevision ? latestRevision.newGrandTotal : calculated.sectionIII.totalFuneralCharges,
      newGrandTotal: calculated.sectionIII.totalFuneralCharges,
      netAdjustmentAmount: latestRevision ? (calculated.sectionIII.totalFuneralCharges - latestRevision.newGrandTotal) : 0,
      adjustmentsSummary: diffs,
      snapshotStatement: JSON.parse(JSON.stringify(calculated)),
      isBaselineOriginal: false
    };

    const updatedRevisions = [...contractRevisions, newRevRecord];
    setContractRevisions(updatedRevisions);
    calculated.contractRevisions = updatedRevisions;
    setStatementData(calculated);

    if (onSaveContract) {
      onSaveContract(activeCase.id, calculated);
    }
    showToast(`📜 Archived Contract Revision ${newRevRecord.versionLabel}!`);
  };

  const handleRestoreRevision = (snapshot: StatementOfGoodsData) => {
    const restored = calculateAP47Totals(JSON.parse(JSON.stringify(snapshot)));
    restored.contractRevisions = contractRevisions;
    setStatementData(restored);
    showToast(`✓ Restored contract snapshot successfully!`);
  };

  const handleAddBFHFloral = () => {
    const product = getFloralByCode(selectedFloralCode) || BFH_FLORAL_CATALOG[0];
    const unitPrice = product.pricing[selectedFloralSize];
    const ribbonText = selectedFloralRibbon.trim();
    
    const newFlower: FloralArrangementItem = {
      id: `fl-${product.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${Date.now()}`,
      type: product.category,
      code: product.code,
      name: product.name,
      size: selectedFloralSize,
      ribbonText: ribbonText || undefined,
      imageUrl: product.imageUrl,
      description: `${product.code} - ${product.name} (${selectedFloralSize.toUpperCase()} ${product.dimensions[selectedFloralSize]}${ribbonText ? ` • Sash: "${ribbonText}"` : ''})`,
      quantity: selectedFloralQty,
      unitPrice: unitPrice,
      totalAmount: unitPrice * selectedFloralQty
    };

    const updated = { ...statementData };
    updated.sectionI.I6_flowersSelected = true;
    updated.sectionI.I6_noFlowersRequested = false;
    updated.sectionI.I6_flowerItems = [...(updated.sectionI.I6_flowerItems || []), newFlower];
    setStatementData(calculateAP47Totals(updated));
    showToast(`💐 Added ${product.code} (${selectedFloralSize.toUpperCase()} - $${unitPrice.toFixed(2)}) to contract!`);
  };

  const handleAddCustomFlower = () => {

    if (!newCustomFlowerDesc.trim()) return;
    const newFlower: FloralArrangementItem = {
      id: `fl-${Date.now()}`,
      type: newCustomFlowerType,
      description: newCustomFlowerDesc.trim(),
      quantity: newCustomFlowerQty,
      unitPrice: newCustomFlowerPrice,
      totalAmount: newCustomFlowerQty * newCustomFlowerPrice
    };
    const updated = { ...statementData };
    updated.sectionI.I6_flowersSelected = true;
    updated.sectionI.I6_noFlowersRequested = false;
    updated.sectionI.I6_flowerItems = [...(updated.sectionI.I6_flowerItems || []), newFlower];
    setStatementData(calculateAP47Totals(updated));
    setNewCustomFlowerDesc('');
    showToast(`💐 Added ${newFlower.description} to floral tribute schedule!`);
  };

  const handleRemoveFlower = (flowerId: string) => {
    const updated = { ...statementData };
    updated.sectionI.I6_flowerItems = (updated.sectionI.I6_flowerItems || []).filter(f => f.id !== flowerId);
    setStatementData(calculateAP47Totals(updated));
  };

  const handleAddCustomCashAdvance = () => {
    if (!newCashAdvDesc.trim()) return;
    const newCash = {
      id: `cash-${Date.now()}`,
      description: newCashAdvDesc.trim(),
      amount: newCashAdvAmount
    };
    const updated = { ...statementData };
    updated.sectionII.customCashAdvances = [...(updated.sectionII.customCashAdvances || []), newCash];
    setStatementData(calculateAP47Totals(updated));
    setNewCashAdvDesc('');
    showToast(`💵 Added cash advance: ${newCash.description} ($${newCash.amount.toFixed(2)})`);
  };

  const handleRemoveCustomCashAdvance = (id: string) => {
    const updated = { ...statementData };
    updated.sectionII.customCashAdvances = (updated.sectionII.customCashAdvances || []).filter(c => c.id !== id);
    setStatementData(calculateAP47Totals(updated));
  };

  // -------------------------------------------------------------
  // SAVE & SYNC TO GOLDEN RECORD CASE
  // -------------------------------------------------------------

  const handleSaveToGoldenRecord = () => {
    const calculated = calculateAP47Totals(statementData);
    
    const effectiveVenue = (scheduleServiceVenue === 'custom' || scheduleServiceVenue === 'other' || scheduleServiceVenue === 'Other')
      ? (customVenueName.trim() || 'Other Church / Facility')
      : scheduleServiceVenue;

    // Check if contract adjustments occurred compared to latest snapshot
    const latestRev = contractRevisions.length > 0 ? contractRevisions[contractRevisions.length - 1] : null;
    const prevSnapshot = latestRev ? latestRev.snapshotStatement : calculated;
    const diffs = computeContractDiffs(prevSnapshot, calculated);

    let updatedRevisions = [...contractRevisions];
    if (diffs.length > 0) {
      const revNum = contractRevisions.length + 1;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const autoRev: ContractRevisionArchiveRecord = {
        id: `REV-${activeCase.caseNumber.replace(/[^a-zA-Z0-9]/g, '')}-${String(revNum).padStart(2, '0')}`,
        revisionNumber: revNum,
        versionLabel: `v1.${revNum - 1} (Contract Update)`,
        savedAt: now.toISOString(),
        savedAtFormatted: formattedDate,
        savedByDirector: {
          id: 'dir-01',
          name: 'Jason Benta, LFD #08850',
          licenseNumber: 'NYS LFD Reg. #08850',
          role: 'Managing Funeral Director'
        },
        reasonNotes: `Form AP-47 updated with ${diffs.length} itemized adjustment(s).`,
        informantApprovalName: `${activeCase.informant.fullName} (${activeCase.informant.relationship})`,
        previousGrandTotal: latestRev ? latestRev.newGrandTotal : calculated.sectionIII.totalFuneralCharges,
        newGrandTotal: calculated.sectionIII.totalFuneralCharges,
        netAdjustmentAmount: latestRev ? (calculated.sectionIII.totalFuneralCharges - latestRev.newGrandTotal) : 0,
        adjustmentsSummary: diffs,
        snapshotStatement: JSON.parse(JSON.stringify(calculated)),
        isBaselineOriginal: false
      };
      updatedRevisions = [...contractRevisions, autoRev];
      setContractRevisions(updatedRevisions);
    }
    calculated.contractRevisions = updatedRevisions;

    // Update Case object
    const updatedCase: GoldenRecordCase = {
      ...activeCase,
      totalAmountDue: calculated.sectionIII.totalFuneralCharges,
      statementOfGoods: calculated,
      contractRevisions: updatedRevisions,
      serviceSelections: {
        ...activeCase.serviceSelections,
        basePackagePrice: calculated.sectionI.totalFuneralHomeCharges,
        casketOrUrnSelected: calculated.sectionI.H1_casketSelected 
          ? calculated.sectionI.H1_casketModelNameOrNumber 
          : (calculated.sectionI.H3_urnSelected ? calculated.sectionI.H3_urnModelName : 'Standard Direct Container'),
        casketPrice: calculated.sectionI.H1_casketSelected ? calculated.sectionI.H1_casketAmount : (calculated.sectionI.H3_urnSelected ? calculated.sectionI.H3_urnAmount : 0),
        crematoryOrCemeteryName: calculated.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName,
        serviceDate: scheduleServiceDate,
        serviceTime: scheduleServiceTime,
        serviceVenueName: effectiveVenue,
        viewingParlor: scheduleViewingParlor,
        officiantName: scheduleOfficiantName || calculated.sectionII.clergyChurchName || activeCase.serviceSelections.officiantName,
        organistName: scheduleOrganistName || calculated.sectionII.organistMusicianName || activeCase.serviceSelections.organistName
      },
      cortegeRoute: activeCase.cortegeRoute ? {
        ...activeCase.cortegeRoute,
        serviceVenueName: effectiveVenue,
        serviceTime: scheduleServiceTime,
        dropoffTime: scheduleCommittalArrivalTime,
        dropoffLocationName: calculated.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName || activeCase.cortegeRoute.dropoffLocationName || 'Cemetery',
        returnLocationName: scheduleRepastEnabled ? scheduleRepastVenue : activeCase.cortegeRoute.returnLocationName,
        returnRequired: scheduleRepastEnabled
      } : undefined,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Jason Benta, LFD #08850',
          timestamp: 'Just now',
          text: `📜 Statement of Goods (Form AP-47) finalized & synchronized. Service scheduled for ${formatDisplayDate(scheduleServiceDate)} at ${scheduleServiceTime} (${effectiveVenue}). Total Charges: $${calculated.sectionIII.totalFuneralCharges.toLocaleString(undefined, { minimumFractionDigits: 2 })} (FH: $${calculated.sectionI.totalFuneralHomeCharges.toLocaleString(undefined, { minimumFractionDigits: 2 })}, Cash Advances: $${calculated.sectionII.totalCashAdvances.toLocaleString(undefined, { minimumFractionDigits: 2 })}). Balance Due: $${calculated.sectionIII.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}.${diffs.length > 0 ? ` [Archived Revision v1.${updatedRevisions.length - 1} with ${diffs.length} adjustment(s)]` : ''}`
        },
        ...activeCase.notes
      ]
    };

    if (onSaveContract) {
      onSaveContract(activeCase.id, calculated);
    } else if (onUpdateCase) {
      onUpdateCase(updatedCase);
    }

    if (onSendNotification) {
      onSendNotification({
        id: `notif-contract-${Date.now()}`,
        caseId: activeCase.id,
        decedentName: activeCase.decedent.legalName,
        recipientName: activeCase.informant.fullName,
        recipientPhone: activeCase.informant.phone,
        channel: 'sms',
        type: 'contract_signing',
        title: `Service Schedule & Itemized Statement (AP-47) Confirmed`,
        bodyText: `Dear ${activeCase.informant.fullName}, the service schedule for ${activeCase.decedent.legalName} is confirmed for ${formatDisplayDate(scheduleServiceDate)} at ${scheduleServiceTime} (${effectiveVenue}). Itemized Statement (Form AP-47) total: $${calculated.sectionIII.totalFuneralCharges.toFixed(2)}. Review in Family Portal: e-bfh.com/case/${activeCase.caseNumber}.`,
        sentAt: 'Just now',
        status: 'delivered'
      });
    }

    showToast('✓ Statement of Goods & Master Schedule saved & synchronized to Golden Record!');
    setIsFamilyPortalPinModalOpen(true);
  };

  const handleCopyContractSummary = () => {
    const c = calculateAP47Totals(statementData);
    const text = `BENTA'S FUNERAL HOME, INC. — STATEMENT OF GOODS AND SERVICES SELECTED (FORM AP-47)
Case Number: ${activeCase.caseNumber}
Decedent: ${activeCase.decedent.legalName}
Date of Death: ${activeCase.decedent.dateOfDeath}
Invoice To: ${activeCase.informant.fullName} (${activeCase.informant.relationship})

I. FUNERAL HOME CHARGES: $${c.sectionI.totalFuneralHomeCharges.toFixed(2)}
• Service Type: ${c.serviceType.replace(/_/g, ' ').toUpperCase()}
• Basic Arrangements: $${c.sectionI.D_basicArrangementsAmount.toFixed(2)}
• Transfer of Remains: $${c.sectionI.B_transferOfRemainsAmount.toFixed(2)}
• Preparation & Embalming: $${(c.sectionI.C1_embalmingAmount + c.sectionI.C2_dressingCasketingAmount + c.sectionI.C2_cosmetologyAmount).toFixed(2)}
• Facilities & Supervision: $${(c.sectionI.E1_supervisionVisitationAmount + c.sectionI.E2_supervisionFuneralServiceAmount + c.sectionI.F1_facilitiesVisitationAmount + c.sectionI.F2_facilitiesFuneralServiceAmount).toFixed(2)}
• Livery Lineup: $${c.sectionI.G_totalLiveryAmount.toFixed(2)}
• Merchandise (Casket/Urn/Vault): $${(c.sectionI.H1_casketAmount + c.sectionI.H2_outerReceptacleAmount + c.sectionI.H3_urnAmount).toFixed(2)}
• Stationery, Programs & Flowers: $${(c.sectionI.I6_totalFlowersAmount + c.sectionI.I10_programsMatrix.totalAmount + c.sectionI.I1_memorialCardsAmount).toFixed(2)}

II. CASH ADVANCES: $${c.sectionII.totalCashAdvances.toFixed(2)}
• Cemetery/Crematory: $${c.sectionII.cemeteryOrCrematoryAmount.toFixed(2)}
• Clergy & Church: $${c.sectionII.clergyHonorariaAmount.toFixed(2)}
• Death Certificates (${c.sectionII.deathCertificateTranscriptsCount}x): $${c.sectionII.deathCertificateTranscriptsAmount.toFixed(2)}
• Organist & Music: $${c.sectionII.organistMusicianAmount.toFixed(2)}
• Tolls, Gratuities & Pallbearers: $${(c.sectionII.bridgeAndRoadTollsAmount + c.sectionII.gratuitiesLiveryAndStaffAmount + c.sectionII.pallbearersAmount).toFixed(2)}

III. TOTAL FUNERAL CHARGES: $${c.sectionIII.totalFuneralCharges.toFixed(2)}
Less Credits/Insurance: -$${c.sectionIII.lessCreditsAndInsurance.toFixed(2)}
BALANCE DUE: $${c.sectionIII.balanceDue.toFixed(2)}

Licensed Funeral Director: Jason Benta, NYS Reg. #08850
630 St. Nicholas Ave, New York, NY 10030 • (212) 281-8850`;

    navigator.clipboard.writeText(text);
    showToast('📋 Full Form AP-47 summary copied to clipboard!');
  };

  // Safe print handler that clears document.title so browser headers do not print OS/portal titles
  const handlePrintContract = () => {
    const prevTitle = document.title;
    document.title = "";
    if (currentStep !== 4) {
      setCurrentStep(4);
      setTimeout(() => {
        window.print();
        setTimeout(() => { document.title = prevTitle; }, 500);
      }, 200);
    } else {
      window.print();
      setTimeout(() => { document.title = prevTitle; }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn contract-print-modal-backdrop print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:w-full print:border-none">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[96vh] flex flex-col shadow-2xl border-2 border-amber-400 overflow-hidden contract-print-modal-container print:max-w-none print:max-h-none print:border-none print:border-0 print:border-transparent print:shadow-none print:rounded-none print:overflow-visible print:block print:w-full print:m-0 print:p-0">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-neutral-900 via-[#181216] to-neutral-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/40 shrink-0 print:hidden contract-studio-modal-header no-print">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#800000] border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-white tracking-wide">
                  Arrangement Conference & Form AP-47 Contract Studio
                </h3>
                <span className="bg-amber-400 text-neutral-950 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  NYS DOH Form AP-47
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Case #{activeCase.caseNumber} • <strong>{activeCase.decedent.legalName}</strong> • Informant: {activeCase.informant.fullName} ({activeCase.informant.relationship})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsRevisionArchiveOpen(true)}
              className="px-3 py-1.5 bg-brass-400/20 hover:bg-brass-400/30 text-brass-300 border border-brass-400/50 text-xs rounded-xl font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="View contract revision audit timeline, diffs, and print amendment riders"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Revision Archive</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-neutral-950 rounded-full font-mono text-[10px] font-bold">
                {contractRevisions.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleArchiveNewRevision()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 text-xs rounded-xl font-bold transition flex items-center space-x-1 cursor-pointer"
              title="Archive current contract adjustments snapshot"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Archive Revision</span>
            </button>
            <button
              type="button"
              onClick={handleCopyContractSummary}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 text-xs rounded-xl font-bold transition flex items-center space-x-1 cursor-pointer"
              title="Copy text summary"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Text</span>
            </button>
            <button
              type="button"
              onClick={handleSaveToGoldenRecord}
              className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs rounded-xl font-bold transition flex items-center space-x-1 cursor-pointer border border-emerald-500/40 shadow-xs"
              title="Save & Sync adjustments to case"
            >
              <Save className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Save & Sync</span>
            </button>
            <button
              type="button"
              onClick={handlePrintContract}
              className="px-3 py-1.5 bg-[#800000] hover:bg-[#6a0509] text-white text-xs rounded-xl font-bold transition flex items-center space-x-1 cursor-pointer border border-amber-400/40 shadow-xs"
              title="Print Form AP-47"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Print Contract</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-STEP WIZARD PROGRESS BAR */}
        <div className="bg-neutral-100 px-4 sm:px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0 text-xs font-semibold print:hidden contract-studio-wizard-bar no-print">
          {[
            { step: 1, title: '1. Loved One Story & Vital Records', icon: BookOpen },
            { step: 2, title: '2. Service Type & Baseline GPL', icon: Building2 },
            { step: 3, title: '3. Variables & Custom Entries', icon: Package },
            { step: 4, title: '4. Live Form AP-47 Contract', icon: FileText }
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step as any)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
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

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="bg-emerald-700 text-white text-xs py-2 px-4 text-center font-bold animate-fadeIn shrink-0 print:hidden">
            {toastMessage}
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE CONTENT AREA) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 contract-print-modal-body print:p-0 print:m-0 print:overflow-visible print:block print:space-y-0">

          {/* ------------------------------------------------------------- */}
          {/* STEP 1: LOVED ONE STORY & VITAL RECORDS INTERVIEW */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 1 && (() => {
            const vitals = statementData.vitalRecordsSheet || {};
            return (
              <div className="space-y-6 animate-fadeIn text-xs">
                
                {/* 2-Page Digital Vital Record Sheet Document Container */}
                <div className="bg-white rounded-2xl border-2 border-neutral-300 shadow-xl overflow-hidden">
                  
                  {/* Top Header of Document */}
                  <div className="bg-gradient-to-r from-neutral-900 via-[#1f1616] to-neutral-900 text-white p-5 border-b border-amber-400/40">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#800000] border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg font-serif-title font-bold text-xl">
                          BFH
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              NYS DOH / NYC EDRS GOLDEN RECORD
                            </span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/30 font-bold">
                              EDRS #{activeCase.medicalCertifier.edrsPermitNumber || 'NYC-2026-EDRS-VERIFIED'}
                            </span>
                          </div>
                          <h3 className="font-serif-title text-lg font-bold text-white tracking-wide mt-0.5">
                            Benta's Funeral Home, Inc. • Vital Record Information Sheet
                          </h3>
                          <p className="text-[11px] text-neutral-300">
                            630 St. Nicholas Avenue, New York, NY 10030 • (212) 281-8850 • Case #{activeCase.caseNumber}
                          </p>
                        </div>
                      </div>

                      {/* Page Switcher Tabs */}
                      <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 space-x-1">
                        <button
                          type="button"
                          onClick={() => setVitalSheetPage('page1')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            vitalSheetPage === 'page1'
                              ? 'bg-[#800000] text-white shadow-xs border border-brass-400/40'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Page 1: Decedent Vitals & Informant</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVitalSheetPage('page2')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            vitalSheetPage === 'page2'
                              ? 'bg-[#800000] text-white shadow-xs border border-brass-400/40'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Page 2: Authorizations, Director & Story</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="p-6 sm:p-8 space-y-6">

                    {/* ========================================================= */}
                    {/* PAGE 1: VITAL RECORD INFORMATION */}
                    {/* ========================================================= */}
                    {vitalSheetPage === 'page1' && (
                      <div className="space-y-6 animate-fadeIn">
                        
                        {/* Section 1: Decedent Identity */}
                        <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" />
                              <span>1. Name & Identity of Decedent</span>
                            </h4>
                            <span className="text-[10px] text-neutral-500 font-mono">EDRS Legal Identification</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">First Name:</label>
                              <input
                                type="text"
                                value={vitals.decedentFirstName || ''}
                                onChange={(e) => updateVitalSheet({ decedentFirstName: e.target.value })}
                                placeholder="First Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:ring-2 focus:ring-[#800000]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Middle Name:</label>
                              <input
                                type="text"
                                value={vitals.decedentMiddleName || ''}
                                onChange={(e) => updateVitalSheet({ decedentMiddleName: e.target.value })}
                                placeholder="Middle Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:ring-2 focus:ring-[#800000]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Last Name:</label>
                              <input
                                type="text"
                                value={vitals.decedentLastName || ''}
                                onChange={(e) => updateVitalSheet({ decedentLastName: e.target.value })}
                                placeholder="Last Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:ring-2 focus:ring-[#800000]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Any Other Known Names of Deceased (Aliases / AKAs / Maiden):</label>
                              <input
                                type="text"
                                value={vitals.otherKnownNames || ''}
                                onChange={(e) => updateVitalSheet({ otherKnownNames: e.target.value })}
                                placeholder="e.g. Marie 'Mimi' Brown, Maiden: Jenkins"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-[#800000]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                                Social Security Number <span className="text-[#800000] font-mono">(9 Digits for Death Cert)</span>:
                              </label>
                              <input
                                type="text"
                                maxLength={11}
                                value={vitals.ssn || ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
                                  let formatted = raw;
                                  if (raw.length > 5) {
                                    formatted = `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5)}`;
                                  } else if (raw.length > 3) {
                                    formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
                                  }
                                  updateVitalSheet({ ssn: formatted });
                                }}
                                placeholder="123-45-6789"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900 focus:ring-2 focus:ring-[#800000]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Sex:</label>
                              <div className="flex items-center space-x-2">
                                {(['male', 'female'] as const).map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => updateVitalSheet({ sex: s })}
                                    className={`flex-1 py-1.5 px-3 rounded-xl font-bold uppercase text-[11px] border transition cursor-pointer ${
                                      vitals.sex === s
                                        ? 'bg-[#800000] text-white border-[#800000] shadow-2xs'
                                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Date of Birth:</label>
                              <input
                                type="date"
                                value={vitals.dateOfBirth || ''}
                                onChange={(e) => updateVitalSheet({ dateOfBirth: e.target.value })}
                                className="w-full p-1.5 bg-white border border-neutral-300 rounded-xl font-mono text-xs text-neutral-900"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Age (Years):</label>
                              <input
                                type="number"
                                min={0}
                                max={130}
                                value={vitals.age ?? ''}
                                placeholder="e.g. 82"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => updateVitalSheet({ age: e.target.value === '' ? '' : (parseInt(e.target.value) || 0) })}
                                className="w-full p-1.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold text-neutral-900 text-center"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Race / Ethnicity:</label>
                              <input
                                type="text"
                                value={vitals.race || ''}
                                onChange={(e) => updateVitalSheet({ race: e.target.value })}
                                placeholder="e.g. Black / African American"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Birth Place (City, State or Foreign Country):</label>
                              <input
                                type="text"
                                value={vitals.birthPlaceCityStateCountry || ''}
                                onChange={(e) => updateVitalSheet({ birthPlaceCityStateCountry: e.target.value })}
                                placeholder="e.g. Harlem, New York, USA or Kingston, Jamaica"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Education Level:</label>
                              <select
                                value={vitals.educationLevel || "Master's Degree / Higher Education"}
                                onChange={(e) => updateVitalSheet({ educationLevel: e.target.value })}
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-semibold"
                              >
                                <option value="8th Grade or Less">8th Grade or Less</option>
                                <option value="9th - 12th Grade (No Diploma)">9th - 12th Grade (No Diploma)</option>
                                <option value="High School Graduate / GED">High School Graduate / GED</option>
                                <option value="Some College Credit (No Degree)">Some College Credit (No Degree)</option>
                                <option value="Associate Degree">Associate Degree (AA, AS)</option>
                                <option value="Bachelor's Degree">Bachelor's Degree (BA, BS)</option>
                                <option value="Master's Degree / Higher Education">Master's Degree (MA, MS, MEd)</option>
                                <option value="Doctorate or Professional Degree">Doctorate or Professional Degree (PhD, EdD, MD, JD)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Residence & Place of Passing */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          
                          {/* Residence of Loved One */}
                          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] border-b border-neutral-200 pb-1">
                              2. Residence of Loved One
                            </h4>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Street & Number:</label>
                              <input
                                type="text"
                                value={vitals.residenceStreet || ''}
                                onChange={(e) => updateVitalSheet({ residenceStreet: e.target.value })}
                                placeholder="e.g. 500 W 142nd St"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-neutral-600 block mb-1">Apt # / Other:</label>
                                <input
                                  type="text"
                                  value={vitals.residenceApt || ''}
                                  onChange={(e) => updateVitalSheet({ residenceApt: e.target.value })}
                                  placeholder="Apt 4B"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-600 block mb-1">City:</label>
                                <input
                                  type="text"
                                  value={vitals.residenceCity || ''}
                                  onChange={(e) => updateVitalSheet({ residenceCity: e.target.value })}
                                  placeholder="New York"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-600 block mb-1">State & Zip:</label>
                                <div className="flex space-x-1">
                                  <input
                                    type="text"
                                    value={vitals.residenceState || 'NY'}
                                    onChange={(e) => updateVitalSheet({ residenceState: e.target.value })}
                                    className="w-12 p-2 bg-white border border-neutral-300 rounded-xl text-center text-neutral-900 font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={vitals.residenceZip || '10030'}
                                    onChange={(e) => updateVitalSheet({ residenceZip: e.target.value })}
                                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Place of Death */}
                          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] border-b border-neutral-200 pb-1">
                              3. Date & Place of Passing
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-neutral-600 block mb-1">Date of Passing:</label>
                                <input
                                  type="date"
                                  value={vitals.dateOfDeath || ''}
                                  onChange={(e) => updateVitalSheet({ dateOfDeath: e.target.value })}
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-xs text-neutral-900"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-600 block mb-1">City of Passing:</label>
                                <input
                                  type="text"
                                  value={vitals.placeOfDeathCity || 'New York'}
                                  onChange={(e) => updateVitalSheet({ placeOfDeathCity: e.target.value })}
                                  placeholder="New York"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Facility Name OR Exact Location:</label>
                              <input
                                type="text"
                                value={vitals.placeOfDeathFacilityOrLocation || ''}
                                onChange={(e) => updateVitalSheet({ placeOfDeathFacilityOrLocation: e.target.value })}
                                placeholder="e.g. Mount Sinai Morningside or Residence"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">State or Foreign Country:</label>
                              <input
                                type="text"
                                value={vitals.placeOfDeathStateOrCountry || 'New York, USA'}
                                onChange={(e) => updateVitalSheet({ placeOfDeathStateOrCountry: e.target.value })}
                                placeholder="New York, USA"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>

                        </div>

                        {/* Section 3: Marital Status, Career & Military Service */}
                        <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] border-b border-neutral-200 pb-2">
                            4. Marital Status, Career & Military Status
                          </h4>

                          {/* Marital Status Chips */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-neutral-600 block">Marital Status of Decedent:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {[
                                { id: 'married', label: 'Married' },
                                { id: 'separated', label: 'Separated' },
                                { id: 'never_married', label: 'Never Married' },
                                { id: 'widowed', label: 'Widow / Widower' },
                                { id: 'divorced', label: 'Divorced' }
                              ].map((m) => (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => updateVitalSheet({ maritalStatus: m.id as any })}
                                  className={`p-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                                    vitals.maritalStatus === m.id
                                      ? 'bg-[#800000] text-white border-[#800000] shadow-2xs'
                                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                                  }`}
                                >
                                  {m.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Occupation Title (Kind of Work):</label>
                              <input
                                type="text"
                                value={vitals.occupationTitle || ''}
                                onChange={(e) => updateVitalSheet({ occupationTitle: e.target.value })}
                                placeholder="e.g. Dean of Humanities / Professor"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Type of Business or Industry:</label>
                              <input
                                type="text"
                                value={vitals.typeOfBusiness || ''}
                                onChange={(e) => updateVitalSheet({ typeOfBusiness: e.target.value })}
                                placeholder="e.g. Higher Education & Research"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>

                          {/* Military Service */}
                          <div className="p-3.5 bg-brass-50/70 rounded-xl border border-brass-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-brass-950 text-xs flex items-center gap-1.5">
                                <span>🎖️ Military Status:</span>
                              </span>
                              <div className="flex items-center space-x-2">
                                {[
                                  { id: 'none', label: 'Non-Veteran' },
                                  { id: 'veteran', label: 'Veteran (Honorable)' },
                                  { id: 'active', label: 'Active Duty' }
                                ].map((mil) => (
                                  <button
                                    key={mil.id}
                                    type="button"
                                    onClick={() => {
                                      updateVitalSheet({ militaryStatus: mil.id as any });
                                      handleToggleVeteranDeathCertDiscount(mil.id === 'veteran' || mil.id === 'active');
                                    }}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                      vitals.militaryStatus === mil.id
                                        ? 'bg-brass-900 text-white border-brass-900 shadow-2xs'
                                        : 'bg-white text-brass-900 border-brass-300 hover:bg-brass-100'
                                    }`}
                                  >
                                    {mil.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {(vitals.militaryStatus === 'veteran' || vitals.militaryStatus === 'active') && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                <div>
                                  <label className="text-[10px] font-bold text-brass-900 block mb-1">Branch of Service:</label>
                                  <select
                                    value={vitals.militaryBranch || 'U.S. Army'}
                                    onChange={(e) => updateVitalSheet({ militaryBranch: e.target.value })}
                                    className="w-full p-1.5 bg-white border border-brass-300 rounded-lg text-brass-950 font-bold"
                                  >
                                    <option value="U.S. Army">U.S. Army</option>
                                    <option value="U.S. Navy">U.S. Navy</option>
                                    <option value="U.S. Air Force">U.S. Air Force</option>
                                    <option value="U.S. Marine Corps">U.S. Marine Corps</option>
                                    <option value="U.S. Coast Guard">U.S. Coast Guard</option>
                                    <option value="U.S. Space Force">U.S. Space Force</option>
                                    <option value="National Guard">National Guard</option>
                                  </select>
                                </div>
                                <div className="flex items-center text-[11px] text-brass-900 font-medium">
                                  <span>✓ Eligible for <strong>3 Free Official Death Certificates</strong>, VA Burial Allowance &amp; Presidential Flag.</span>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Section 4: Parents & Spouse */}
                        <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] border-b border-neutral-200 pb-2">
                            5. Parents &amp; Spouse Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Father's Name (First, Middle, Last):</label>
                              <input
                                type="text"
                                value={vitals.fatherName || ''}
                                onChange={(e) => updateVitalSheet({ fatherName: e.target.value })}
                                placeholder="Father's Full Legal Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Mother's Name (First and Maiden):</label>
                              <input
                                type="text"
                                value={vitals.motherFirstAndMaidenName || ''}
                                onChange={(e) => updateVitalSheet({ motherFirstAndMaidenName: e.target.value })}
                                placeholder="Mother's First and Maiden Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Name of Surviving / Predeceased Spouse (First, Maiden):</label>
                              <input
                                type="text"
                                value={vitals.spouseFirstAndMaidenName || ''}
                                onChange={(e) => updateVitalSheet({ spouseFirstAndMaidenName: e.target.value })}
                                placeholder="Spouse Full Name & Maiden Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Spouse Date of Birth:</label>
                              <input
                                type="date"
                                value={vitals.spouseDateOfBirth || ''}
                                onChange={(e) => updateVitalSheet({ spouseDateOfBirth: e.target.value })}
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-xs text-neutral-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 5: Informant (Legal Next of Kin) */}
                        <div className="bg-amber-50/60 p-5 rounded-2xl border-2 border-amber-300/80 space-y-4 shadow-xs">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5 font-serif-title text-sm">
                              <span>6. Authorized Informant (Legal Next of Kin / PHL § 4201 Priority)</span>
                            </h4>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                              Primary Purchaser &amp; Signatory
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Full Name of Informant:</label>
                              <input
                                type="text"
                                value={vitals.informantName || ''}
                                onChange={(e) => updateVitalSheet({ informantName: e.target.value })}
                                placeholder="Informant Full Legal Name"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Relationship to Decedent:</label>
                              <input
                                type="text"
                                value={vitals.informantRelationship || ''}
                                onChange={(e) => updateVitalSheet({ informantRelationship: e.target.value })}
                                placeholder="e.g. Surviving Spouse, Adult Daughter, Son, Sister"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Telephone (Cell):</label>
                              <input
                                type="text"
                                value={vitals.informantPhoneCell || ''}
                                onChange={(e) => updateVitalSheet({ informantPhoneCell: e.target.value })}
                                placeholder="(212) 555-0192"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Telephone (Home):</label>
                              <input
                                type="text"
                                value={vitals.informantPhoneHome || ''}
                                onChange={(e) => updateVitalSheet({ informantPhoneHome: e.target.value })}
                                placeholder="(212) 555-0100"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Telephone (Alternate):</label>
                              <input
                                type="text"
                                value={vitals.informantPhoneAlt || ''}
                                onChange={(e) => updateVitalSheet({ informantPhoneAlt: e.target.value })}
                                placeholder="Work / Work Ext"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Email Address:</label>
                              <input
                                type="email"
                                value={vitals.informantEmail || ''}
                                onChange={(e) => updateVitalSheet({ informantEmail: e.target.value })}
                                placeholder="name@domain.com"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Informant Street Address:</label>
                              <input
                                type="text"
                                value={vitals.informantAddressStreet || ''}
                                onChange={(e) => updateVitalSheet({ informantAddressStreet: e.target.value })}
                                placeholder="Street Address"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">Apt #:</label>
                              <input
                                type="text"
                                value={vitals.informantAddressApt || ''}
                                onChange={(e) => updateVitalSheet({ informantAddressApt: e.target.value })}
                                placeholder="Apt 6B"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-700 block mb-1">City, State, Zip:</label>
                              <input
                                type="text"
                                value={`${vitals.informantAddressCityStateCountry || 'New York, NY'} ${vitals.informantAddressZip || '10032'}`.trim()}
                                onChange={(e) => updateVitalSheet({ informantAddressCityStateCountry: e.target.value })}
                                placeholder="New York, NY 10032"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 6: Cemetery Deed & Previous Interment */}
                        <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] border-b border-neutral-200 pb-2">
                            7. Cemetery Deed &amp; Previous Grave Interment Record
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Cemetery Deed Owner Name:</label>
                              <input
                                type="text"
                                value={vitals.deedOwnerName || ''}
                                onChange={(e) => updateVitalSheet({ deedOwnerName: e.target.value })}
                                placeholder="e.g. Eleanor Davis Brown"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Deed Owner Address:</label>
                              <input
                                type="text"
                                value={vitals.deedOwnerAddress || ''}
                                onChange={(e) => updateVitalSheet({ deedOwnerAddress: e.target.value })}
                                placeholder="Deed Owner Street Address, City, State"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">Previous Interment in Grave (Who):</label>
                              <input
                                type="text"
                                value={vitals.previousIntermentWho || ''}
                                onChange={(e) => updateVitalSheet({ previousIntermentWho: e.target.value })}
                                placeholder="e.g. John W. Davis or None / New Grave"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">When (Date / Year of Burial):</label>
                              <input
                                type="text"
                                value={vitals.previousIntermentWhen || ''}
                                onChange={(e) => updateVitalSheet({ previousIntermentWhen: e.target.value })}
                                placeholder="e.g. October 1998"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">How Related to Current Decedent:</label>
                              <input
                                type="text"
                                value={vitals.previousIntermentRelation || ''}
                                onChange={(e) => updateVitalSheet({ previousIntermentRelation: e.target.value })}
                                placeholder="e.g. Father-in-Law"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 7: Verification & Attestation */}
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                          <div className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>8. Verification &amp; Review Sign-Off</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">The above vital information was reviewed or provided by:</label>
                              <input
                                type="text"
                                value={vitals.reviewedOrProvidedBy || ''}
                                onChange={(e) => updateVitalSheet({ reviewedOrProvidedBy: e.target.value })}
                                placeholder="Name of Person Providing Vitals"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-1">And verified on (Date):</label>
                              <input
                                type="date"
                                value={vitals.verifiedOnDate || ''}
                                onChange={(e) => updateVitalSheet({ verifiedOnDate: e.target.value })}
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl font-mono text-xs text-neutral-900"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* PAGE 2: AUTHORIZATIONS, DIRECTOR & LEGACY STORIES */}
                    {/* ========================================================= */}
                    {vitalSheetPage === 'page2' && (
                      <div className="space-y-6 animate-fadeIn">
                        
                        {/* 1. Authorizations & Consents */}
                        <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#800000] border-b border-neutral-200 pb-2">
                            1. Family Authorizations &amp; Webcast Consents
                          </h4>

                          {/* Question 1: Website Obituary */}
                          <div className="p-3.5 bg-white rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="max-w-xl">
                              <strong className="text-neutral-900 block text-xs">
                                1) Do you authorize Benta's Funeral Home to post the obituary and/or service information on our website?
                              </strong>
                              <span className="text-[10px] text-neutral-500">
                                Official digital tribute on www.e-bfh.com with guestbook and flower orders.
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {[true, false].map((val) => (
                                <button
                                  key={String(val)}
                                  type="button"
                                  onClick={() => updateVitalSheet({ authPostObituaryWebsite: val })}
                                  className={`px-4 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                                    vitals.authPostObituaryWebsite === val
                                      ? 'bg-[#800000] text-white border-[#800000] shadow-2xs'
                                      : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                                  }`}
                                >
                                  {val ? '✓ Yes (Authorized)' : '✗ No (Do Not Post)'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Question 2: Live Stream Webcasting */}
                          <div className="p-3.5 bg-white rounded-xl border border-neutral-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="max-w-xl">
                                <strong className="text-neutral-900 block text-xs">
                                  2) Do you wish to have services live streamed?
                                </strong>
                                <span className="text-[10px] text-neutral-500">
                                  HD sanctuary camera broadcast for out-of-town relatives and elders.
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {[true, false].map((val) => (
                                  <button
                                    key={String(val)}
                                    type="button"
                                    onClick={() => updateVitalSheet({ authLiveStreamService: val })}
                                    className={`px-4 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                                      vitals.authLiveStreamService === val
                                        ? 'bg-[#800000] text-white border-[#800000] shadow-2xs'
                                        : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                                    }`}
                                  >
                                    {val ? '✓ Yes' : '✗ No'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {vitals.authLiveStreamService && (
                              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-neutral-700">If answered 'YES', select privacy type:</span>
                                <div className="flex items-center space-x-2">
                                  {[
                                    { id: 'public', label: '🌐 Public (Visible on Website)' },
                                    { id: 'private', label: '🔒 Private (Family Link & PIN Protected)' }
                                  ].map((p) => (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={() => updateVitalSheet({ authLiveStreamType: p.id as any })}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                        vitals.authLiveStreamType === p.id
                                          ? 'bg-brass-600 text-white border-brass-600 shadow-2xs'
                                          : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                                      }`}
                                    >
                                      {p.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. Section To Be Completed By Funeral Director */}
                        <div className="bg-gradient-to-br from-neutral-900 via-[#181414] to-neutral-900 text-white p-5 rounded-2xl border-2 border-amber-400/60 space-y-4 shadow-xl">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-serif-title">
                              <span>⭐ THIS SECTION TO BE COMPLETED BY FUNERAL DIRECTOR ⭐</span>
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-mono">Official NYS LFD Protocols</span>
                          </div>

                          {/* Viewing & Wake Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Date of First Viewing:</label>
                              <input
                                type="date"
                                value={vitals.directorViewingDate || ''}
                                onChange={(e) => updateVitalSheet({ directorViewingDate: e.target.value })}
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Viewing Time:</label>
                              <input
                                type="text"
                                value={vitals.directorViewingTime || ''}
                                onChange={(e) => updateVitalSheet({ directorViewingTime: e.target.value })}
                                placeholder="10:00 AM – 11:00 AM"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Viewing Place / Parlor:</label>
                              <input
                                type="text"
                                value={vitals.directorViewingPlace || ''}
                                onChange={(e) => updateVitalSheet({ directorViewingPlace: e.target.value })}
                                placeholder="Chapel 1 (Main Sanctuary)"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                              />
                            </div>
                          </div>

                          {/* Wake Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Date of Wake:</label>
                              <input
                                type="date"
                                value={vitals.directorWakeDate || ''}
                                onChange={(e) => updateVitalSheet({ directorWakeDate: e.target.value })}
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Hour From:</label>
                              <input
                                type="text"
                                value={vitals.directorWakeHoursFrom || ''}
                                onChange={(e) => updateVitalSheet({ directorWakeHoursFrom: e.target.value })}
                                placeholder="04:00 PM"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Hour To:</label>
                              <input
                                type="text"
                                value={vitals.directorWakeHoursTo || ''}
                                onChange={(e) => updateVitalSheet({ directorWakeHoursTo: e.target.value })}
                                placeholder="08:00 PM"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Wake Location:</label>
                              <input
                                type="text"
                                value={vitals.directorWakeLocation || ''}
                                onChange={(e) => updateVitalSheet({ directorWakeLocation: e.target.value })}
                                placeholder="Chapel 1 / Parlor A"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                              />
                            </div>
                          </div>

                          {/* Funeral Service Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Date of Funeral:</label>
                              <input
                                type="date"
                                value={vitals.directorFuneralDate || ''}
                                onChange={(e) => updateVitalSheet({ directorFuneralDate: e.target.value })}
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Hour of Service:</label>
                              <input
                                type="text"
                                value={vitals.directorFuneralHour || ''}
                                onChange={(e) => updateVitalSheet({ directorFuneralHour: e.target.value })}
                                placeholder="11:00 AM"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Funeral Location:</label>
                              <input
                                type="text"
                                value={vitals.directorFuneralLocation || ''}
                                onChange={(e) => updateVitalSheet({ directorFuneralLocation: e.target.value })}
                                placeholder="Benta's Funeral Home - Chapel 1"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-amber-400 block mb-1">Location Address:</label>
                              <input
                                type="text"
                                value={vitals.directorFuneralAddress || ''}
                                onChange={(e) => updateVitalSheet({ directorFuneralAddress: e.target.value })}
                                placeholder="630 St. Nicholas Ave"
                                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                              />
                            </div>
                          </div>

                          {/* Final Disposition & Cemetery/Crematory Logistics */}
                          <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-amber-400 block mb-1">Date of Final Disposition:</label>
                                <input
                                  type="date"
                                  value={vitals.directorDispositionDate || ''}
                                  onChange={(e) => {
                                    updateVitalSheet({ directorDispositionDate: e.target.value });
                                    updateDispositionSchedule({ dateOfDisposition: e.target.value });
                                  }}
                                  className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-amber-400 block mb-1">Due Time for Disposition:</label>
                                <input
                                  type="text"
                                  value={vitals.directorDispositionDueTime || ''}
                                  onChange={(e) => {
                                    updateVitalSheet({ directorDispositionDueTime: e.target.value });
                                    updateDispositionSchedule({ dueTimeForDisposition: e.target.value });
                                  }}
                                  placeholder="01:30 PM (Woodlawn Cutoff)"
                                  className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-amber-400 block mb-1">Mode of Disposition:</label>
                                <div className="flex space-x-1">
                                  {[
                                    { id: 'burial', label: 'Burial' },
                                    { id: 'cremation', label: 'Cremation' },
                                    { id: 'entombment', label: 'Entombment' }
                                  ].map((mode) => (
                                    <button
                                      key={mode.id}
                                      type="button"
                                      onClick={() => {
                                        updateVitalSheet({ directorDispositionMode: mode.id as any });
                                        updateDispositionSchedule({ modeOfDisposition: mode.id as any });
                                      }}
                                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] border transition cursor-pointer ${
                                        vitals.directorDispositionMode === mode.id
                                          ? 'bg-[#800000] text-white border-brass-400 shadow-2xs'
                                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                                      }`}
                                    >
                                      {mode.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-amber-400 block mb-1">Cemetery / Crematory Destination:</label>
                                <input
                                  type="text"
                                  value={vitals.directorCemeteryCrematory || ''}
                                  onChange={(e) => updateVitalSheet({ directorCemeteryCrematory: e.target.value })}
                                  placeholder="The Woodlawn Cemetery & Crematory"
                                  className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-amber-400 block mb-1">Location (City, State or Country):</label>
                                <input
                                  type="text"
                                  value={vitals.directorCemeteryLocation || ''}
                                  onChange={(e) => updateVitalSheet({ directorCemeteryLocation: e.target.value })}
                                  placeholder="Bronx, New York, USA"
                                  className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                                />
                              </div>
                            </div>

                            {/* Grave Location Coordinates */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                              <div>
                                <label className="text-[9px] font-bold text-neutral-400 block mb-1">Section:</label>
                                <input
                                  type="text"
                                  value={vitals.directorSection || ''}
                                  onChange={(e) => updateVitalSheet({ directorSection: e.target.value })}
                                  placeholder="Sec 44"
                                  className="w-full p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-amber-300 font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-400 block mb-1">Plot:</label>
                                <input
                                  type="text"
                                  value={vitals.directorPlot || ''}
                                  onChange={(e) => updateVitalSheet({ directorPlot: e.target.value })}
                                  placeholder="Plot 102"
                                  className="w-full p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-amber-300 font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-400 block mb-1">Range:</label>
                                <input
                                  type="text"
                                  value={vitals.directorRange || ''}
                                  onChange={(e) => updateVitalSheet({ directorRange: e.target.value })}
                                  placeholder="Range C"
                                  className="w-full p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-amber-300 font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-400 block mb-1">Grave #:</label>
                                <input
                                  type="text"
                                  value={vitals.directorGraveNum || ''}
                                  onChange={(e) => updateVitalSheet({ directorGraveNum: e.target.value })}
                                  placeholder="Gr. 18"
                                  className="w-full p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-amber-300 font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-neutral-400 block mb-1">Lot:</label>
                                <input
                                  type="text"
                                  value={vitals.directorLot || ''}
                                  onChange={(e) => updateVitalSheet({ directorLot: e.target.value })}
                                  placeholder="Lot 5"
                                  className="w-full p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-amber-300 font-mono text-center"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Additional Information & Story Questions */}
                        <div className="bg-amber-50/60 p-5 rounded-2xl border-2 border-amber-300/80 space-y-4">
                          <div className="flex items-center space-x-2 text-[#800000]">
                            <Heart className="w-5 h-5 text-red-600 fill-red-100" />
                            <h4 className="font-serif-title font-bold text-base text-neutral-900">
                              3. Additional Story Information &amp; Celebration DNA
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-600">
                            These biographical details shape the eulogy, floral symbolism, obituary draft, and customized memorial programs.
                          </p>

                          <div className="space-y-3">
                            <div>
                              <label className="font-bold text-neutral-800 block mb-1">
                                Organizations / Associations / Fraternities / Sororities:
                              </label>
                              <input
                                type="text"
                                value={vitals.organizationsAssociations || ''}
                                onChange={(e) => updateVitalSheet({ organizationsAssociations: e.target.value })}
                                placeholder="e.g. NAACP Harlem Branch, Alpha Kappa Alpha Sorority, Abyssinian Senior Choir, Masonic Lodge"
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="font-bold text-neutral-800 block mb-1">Favorite Color:</label>
                                <input
                                  type="text"
                                  value={vitals.favoriteColor || ''}
                                  onChange={(e) => updateVitalSheet({ favoriteColor: e.target.value })}
                                  placeholder="e.g. Royal Purple & Gold"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-neutral-800 block mb-1">Favorite Type of Music:</label>
                                <input
                                  type="text"
                                  value={vitals.favoriteMusicType || ''}
                                  onChange={(e) => updateVitalSheet({ favoriteMusicType: e.target.value })}
                                  placeholder="e.g. Traditional Gospel, Duke Ellington Jazz, Hymn #45"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="font-bold text-neutral-800 block mb-1">Interests &amp; Passions:</label>
                                <input
                                  type="text"
                                  value={vitals.interests || ''}
                                  onChange={(e) => updateVitalSheet({ interests: e.target.value })}
                                  placeholder="e.g. Harlem history preservation, gardening, baking sweet potato pies"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-neutral-800 block mb-1">Known For (Defining Personality Traits):</label>
                                <input
                                  type="text"
                                  value={vitals.knownFor || ''}
                                  onChange={(e) => updateVitalSheet({ knownFor: e.target.value })}
                                  placeholder="e.g. Unconditional generosity, stylish Sunday church hats, sharp humor"
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="font-bold text-neutral-800 block mb-1">Favorite Quote / Motto:</label>
                              <input
                                type="text"
                                value={vitals.favoriteQuote || ''}
                                onChange={(e) => updateVitalSheet({ favoriteQuote: e.target.value })}
                                placeholder='e.g. "To whom much is given, much is required."'
                                className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900 italic"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="font-bold text-neutral-800 block mb-1">Proudest Accomplishment:</label>
                                <textarea
                                  rows={2}
                                  value={vitals.proudestAccomplishment || ''}
                                  onChange={(e) => updateVitalSheet({ proudestAccomplishment: e.target.value })}
                                  placeholder="e.g. First in family to graduate from college; putting 3 children through higher education."
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-neutral-800 block mb-1">What Historical Milestone Did They Witness?</label>
                                <textarea
                                  rows={2}
                                  value={vitals.historicalMilestoneWitnessed || ''}
                                  onChange={(e) => updateVitalSheet({ historicalMilestoneWitnessed: e.target.value })}
                                  placeholder="e.g. March on Washington 1963, inauguration of first Black mayor of NYC, Apollo Theater opening."
                                  className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                                />
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* Step 1 Navigation Bar */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Vital Records Sheet: {vitalSheetPage === 'page1' ? 'Viewing Page 1 of 2' : 'Viewing Page 2 of 2'}
                  </div>

                  <div className="flex items-center space-x-2">
                    {vitalSheetPage === 'page1' ? (
                      <button
                        type="button"
                        onClick={() => setVitalSheetPage('page2')}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
                      >
                        <span>View Page 2: Authorizations &amp; Story</span>
                        <ChevronRight className="w-4 h-4 text-amber-400" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setVitalSheetPage('page1')}
                        className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        <span>← Back to Page 1</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-red-950/20 cursor-pointer"
                    >
                      <span>Proceed to Step 2: Select Service Type</span>
                      <ChevronRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ------------------------------------------------------------- */}
          {/* STEP 2: SERVICE TYPE & BASELINE GENERAL PRICE LIST OPTIONS */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="border-b border-neutral-200 pb-2">
                <h4 className="font-serif-title text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#800000]" />
                  <span>Select Primary Service Type & Disposition Method</span>
                </h4>
                <p className="text-xs text-neutral-500">
                  Choose between Flat-Rate Direct Dispositions or a Service with Viewing/Sanctuary Ceremony where variables (flowers, vehicles, stationery matrix) increase.
                </p>
              </div>

              {/* 5 Primary Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. Traditional Service and Burial */}
                <div 
                  onClick={() => handleSelectServiceType('burial_with_service')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    statementData.serviceType === 'burial_with_service'
                      ? 'border-[#800000] bg-red-50/40 ring-2 ring-red-400/40 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      🏛️ Traditional Service and Burial
                    </span>
                    <span className="text-[10px] bg-[#800000] text-white px-2 py-0.5 rounded-full font-bold">
                      Variables Suite
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Comprehensive full-service traditional burial. Line items include basic arrangements, local transfer, embalming, facility, supervision, hearse, and cortege.
                  </p>
                  <div className="text-xs font-mono text-neutral-700 pt-1 border-t border-neutral-200 space-y-0.5">
                    <div>• Basic Arrangements: <strong>$950.00</strong></div>
                    <div>• Local Transfer: <strong>$750.00</strong> | Embalming: <strong>$900.00</strong></div>
                    <div>• Supervision & Facilities: <strong>$2,200.00</strong></div>
                  </div>
                </div>

                {/* 2. Funeral Service with Cremation */}
                <div 
                  onClick={() => handleSelectServiceType('cremation_with_service')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    statementData.serviceType === 'cremation_with_service'
                      ? 'border-[#800000] bg-red-50/40 ring-2 ring-red-400/40 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      🕊️ Funeral Service with Cremation
                    </span>
                    <span className="text-[10px] bg-[#800000] text-white px-2 py-0.5 rounded-full font-bold">
                      Variables Suite
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Full ceremonial funeral gathering with viewing in Chapel A/B prior to cremation, ceremonial rental casket option ($1,100), and living voice tribute.
                  </p>
                  <div className="text-xs font-mono text-neutral-700 pt-1 border-t border-neutral-200 space-y-0.5">
                    <div>• Basic Arrangements: <strong>$950.00</strong></div>
                    <div>• Local Transfer: <strong>$750.00</strong> | Embalming / Prep: <strong>$900.00</strong></div>
                    <div>• Supervision & Facilities: <strong>$2,200.00</strong></div>
                  </div>
                </div>

                {/* 3. Cremation and Memorial Service */}
                <div 
                  onClick={() => handleSelectServiceType('cremation_memorial')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    statementData.serviceType === 'cremation_memorial'
                      ? 'border-[#800000] bg-amber-50/50 ring-2 ring-amber-400/50 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      🕯️ Cremation and Memorial Service
                    </span>
                    <span className="text-[10px] bg-[#b45309] text-white px-2 py-0.5 rounded-full font-bold">
                      Direct + Memorial
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Direct cremation baseline with chapel facility & supervision for memorial celebration. Variables: programs, prayer cards, officiant, organist, limousine, repast.
                  </p>
                  <div className="text-xs font-mono text-neutral-700 pt-1 border-t border-neutral-200 space-y-0.5">
                    <div>• Basic Arrangements: <strong>$950.00</strong></div>
                    <div>• Local Transfer: <strong>$750.00</strong> | Shelter / Prep: <strong>$384.00</strong></div>
                    <div>• Memorial Supervision & Facilities: <strong>$1,100.00</strong></div>
                  </div>
                </div>

                {/* 4. Direct Cremation (Flat Rate) */}
                <div 
                  onClick={() => handleSelectServiceType('direct_cremation')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    statementData.serviceType === 'direct_cremation'
                      ? 'border-[#800000] bg-amber-50/50 ring-2 ring-amber-400/50 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      ⚡ Direct Cremation
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b45309]">
                      $2,084.00 – $2,214.00
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Immediate disposition without formal visitation or ceremony. Includes transfer of remains, basic arrangements, securing authorizations, and transport to crematory.
                  </p>
                  
                  {statementData.serviceType === 'direct_cremation' && (
                    <div className="pt-2 border-t border-amber-200 space-y-2 text-xs">
                      <span className="font-bold text-neutral-800 block">Select Container Option:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDirectCremationContainer('customer_container')}
                          className={`p-2 rounded-xl text-left border transition ${
                            statementData.sectionI.directCremationOption === 'customer_container'
                              ? 'bg-[#800000] text-white font-bold border-[#800000]'
                              : 'bg-white text-neutral-800 border-neutral-300'
                          }`}
                        >
                          <div>With Customer Container</div>
                          <div className="font-mono text-xs mt-0.5">$2,084.00</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectCremationContainer('alternative_container')}
                          className={`p-2 rounded-xl text-left border transition ${
                            statementData.sectionI.directCremationOption === 'alternative_container'
                              ? 'bg-[#800000] text-white font-bold border-[#800000]'
                              : 'bg-white text-neutral-800 border-neutral-300'
                          }`}
                        >
                          <div>With BFH Cardboard Box</div>
                          <div className="font-mono text-xs mt-0.5">$2,214.00</div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Direct Earth Burial (Flat Rate) */}
                <div 
                  onClick={() => handleSelectServiceType('direct_burial')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                    statementData.serviceType === 'direct_burial'
                      ? 'border-[#800000] bg-amber-50/50 ring-2 ring-amber-400/50 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      🌿 Direct Earth Burial
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b45309]">
                      $2,084.00 – $2,484.00
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Direct interment without viewing or ceremony. Includes transfer of remains, basic staff arrangements, securing burial permits, and transport to local cemetery.
                  </p>

                  {statementData.serviceType === 'direct_burial' && (
                    <div className="pt-2 border-t border-amber-200 space-y-2 text-xs">
                      <span className="font-bold text-neutral-800 block">Select Container Option:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDirectBurialContainer('customer_container')}
                          className={`p-2 rounded-xl text-left border transition ${
                            statementData.sectionI.directBurialOption === 'customer_container'
                              ? 'bg-[#800000] text-white font-bold border-[#800000]'
                              : 'bg-white text-neutral-800 border-neutral-300'
                          }`}
                        >
                          <div>With Customer Container</div>
                          <div className="font-mono text-xs mt-0.5">$2,084.00</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectBurialContainer('alternative_container')}
                          className={`p-2 rounded-xl text-left border transition ${
                            statementData.sectionI.directBurialOption === 'alternative_container'
                              ? 'bg-[#800000] text-white font-bold border-[#800000]'
                              : 'bg-white text-neutral-800 border-neutral-300'
                          }`}
                        >
                          <div>With BFH Wood Container</div>
                          <div className="font-mono text-xs mt-0.5">$2,484.00</div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* ------------------------------------------------------------- */}
              {/* STEP 2.A: MASTER SERVICE DATE, TIMING & VENUE COORDINATOR */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-gradient-to-br from-neutral-900 via-[#1f1616] to-[#120a0a] text-white p-6 rounded-2xl border-2 border-amber-500/50 shadow-xl space-y-6">
                
                {/* Header Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#800000] text-amber-300 flex items-center justify-center font-bold text-2xl shadow-lg border border-amber-400/30">
                      📅
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Step 2.A Logistics Coordinator
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Live Golden Record & Calendar Sync</span>
                        </span>
                      </div>
                      <h4 className="font-serif-title text-lg font-bold text-white mt-1 flex items-center gap-2">
                        <span>Master Service Date, Timing & Venue Coordinator</span>
                      </h4>
                      <p className="text-xs text-neutral-300">
                        Select the official ceremony date, start time, viewing hours, ceremonial sanctuary, and cortege committal timetable. Coordinates all downstream staff, livery, webcasting, and Form AP-47 schedules.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/40 px-4 py-2.5 rounded-xl border border-amber-400/30 text-right">
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Confirmed Service Window</div>
                    <div className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5 justify-end mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatDisplayDate(scheduleServiceDate)} • {scheduleServiceTime}</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Service Date, Time & Sanctuary Venue */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* Left Column: Date & Time Picker */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Funeral / Memorial Ceremony Date</span>
                      </span>
                      <span className="text-[11px] font-mono text-neutral-300 bg-white/10 px-2 py-0.5 rounded">
                        {scheduleDuration}
                      </span>
                    </div>

                    {/* Date Input with Live Day of Week Display */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={scheduleServiceDate}
                          onChange={(e) => {
                            setScheduleServiceDate(e.target.value);
                            if (scheduleViewingOption === 'same_day') {
                              setScheduleViewingDate(e.target.value);
                            }
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold focus:outline-hidden"
                        />
                      </div>

                      {/* Formatted Date Banner */}
                      <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Scheduled Day:</span>
                        <span className="font-bold text-amber-300 font-serif-title text-sm">
                          {formatDisplayDate(scheduleServiceDate)}
                        </span>
                      </div>

                      {/* Quick Date Chips */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider">Quick Preset Dates:</span>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          {[
                            { label: 'Today', days: 0 },
                            { label: 'Tomorrow', days: 1 },
                            { label: '+3 Days', days: 3 },
                            { label: '+5 Days (Harlem Standard)', days: 5 },
                            { label: '+7 Days', days: 7 }
                          ].map((preset) => {
                            const dateStr = getQuickServiceDate(preset.days);
                            const isActive = scheduleServiceDate === dateStr;
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  setScheduleServiceDate(dateStr);
                                  if (scheduleViewingOption === 'same_day') {
                                    setScheduleViewingDate(dateStr);
                                  }
                                  showToast(`📅 Service date set to ${preset.label} (${dateStr})`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                                  isActive
                                    ? 'bg-[#800000] text-white border-brass-400 shadow-xs'
                                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                                }`}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Start Time & Duration Picker */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>Ceremony Start Time:</span>
                        </span>
                        <select
                          value={scheduleDuration}
                          onChange={(e) => setScheduleDuration(e.target.value)}
                          className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2 py-1 font-sans focus:outline-hidden"
                        >
                          <option value="1 Hour">1 Hour Duration</option>
                          <option value="1.5 Hours (Standard)">1.5 Hours (Standard)</option>
                          <option value="2 Hours">2 Hours Duration</option>
                          <option value="3 Hours (Mass/Extended)">3 Hours (Solemn Mass)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={scheduleServiceTime}
                          onChange={(e) => setScheduleServiceTime(e.target.value)}
                          placeholder="e.g. 11:00 AM"
                          className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2 text-sm font-mono font-bold focus:outline-hidden"
                        />
                      </div>

                      {/* Quick Time Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {['09:30 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '06:00 PM'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setScheduleServiceTime(t);
                              showToast(`⏰ Service start time set to ${t}`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer border ${
                              scheduleServiceTime === t
                                ? 'bg-brass-400 text-neutral-950 border-brass-300'
                                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Ceremonial Sanctuary & Leadership */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>Ceremonial Sanctuary / Chapel Venue</span>
                    </span>

                    <div className="space-y-2">
                      <select
                        value={scheduleServiceVenue}
                        onChange={(e) => setScheduleServiceVenue(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden"
                      >
                        <option value="Benta's Funeral Home - Chapel 1 (Main Sanctuary / Seats 140)">
                          🏛️ Benta's Funeral Home - Chapel 1 (Main Sanctuary / Seats 140)
                        </option>
                        <option value="Benta's Funeral Home - Chapel 2 (Parlor B / Seats 90)">
                          🏛️ Benta's Funeral Home - Chapel 2 (Parlor B / Seats 90)
                        </option>
                        <option value="Abyssinian Baptist Church (132 W 138th St, Harlem)">
                          ⛪ Abyssinian Baptist Church (132 W 138th St, Harlem)
                        </option>
                        <option value="Canaan Baptist Church of Christ (132 W 116th St, Harlem)">
                          ⛪ Canaan Baptist Church of Christ (132 W 116th St, Harlem)
                        </option>
                        <option value="St. Charles Borromeo Church (211 W 141st St, Harlem)">
                          ⛪ St. Charles Borromeo Roman Catholic Church (211 W 141st St)
                        </option>
                        <option value="Mother A.M.E. Zion Church (140 W 137th St, Harlem)">
                          ⛪ Mother A.M.E. Zion Church (140 W 137th St, Harlem)
                        </option>
                        <option value="Cathedral of St. John the Divine (1047 Amsterdam Ave)">
                          ⛪ Cathedral of St. John the Divine (1047 Amsterdam Ave)
                        </option>
                        <option value="First Corinthian Baptist Church (1912 Adam Clayton Powell Jr Blvd)">
                          ⛪ First Corinthian Baptist Church (1912 ACP Blvd)
                        </option>
                        <option value="Graveside Direct (At Cemetery Gate Only)">
                          🌿 Graveside Committal Direct (At Cemetery Gate Only)
                        </option>
                        <option value="other">
                          ⛪ Other Church / Facility (Enter Below)
                        </option>
                        <option value="custom">
                          ✏️ Custom External Sanctuary / Church (Enter Below)
                        </option>
                      </select>

                      {(scheduleServiceVenue === 'other' || scheduleServiceVenue === 'custom' || scheduleServiceVenue === 'Other') && (
                        <div className="space-y-2 pt-1 border-t border-amber-400/20">
                          <div>
                            <label className="text-[11px] font-bold text-amber-300 block mb-1">
                              Church / Facility Name &amp; Street Address:
                            </label>
                            <input
                              type="text"
                              value={customVenueName}
                              onChange={(e) => {
                                setCustomVenueName(e.target.value);
                                const updated = { ...statementData };
                                updated.sectionI.F3_otherFacilitiesSpecify = e.target.value;
                                updated.sectionI.F_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              placeholder="Enter Church or Facility Name &amp; Street Address..."
                              className="w-full bg-neutral-900 border border-amber-400 text-white rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] font-bold text-amber-300">
                                Church / Facility Fee ($):
                              </label>
                              <span className="text-[10px] text-neutral-400">Section I.F Facility Line Item</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={(statementData.sectionI.F3_otherFacilitiesAmount || statementData.sectionI.F_otherAmount) === 0 ? '' : (statementData.sectionI.F3_otherFacilitiesAmount || statementData.sectionI.F_otherAmount)}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionI.F3_otherFacilitiesAmount = val;
                                    updated.sectionI.F_otherAmount = val;
                                    if (customVenueName && !updated.sectionI.F3_otherFacilitiesSpecify) {
                                      updated.sectionI.F3_otherFacilitiesSpecify = customVenueName;
                                      updated.sectionI.F_otherSpecify = customVenueName;
                                    }
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-7 pr-3 py-1.5 bg-neutral-900 border border-amber-400/80 focus:border-amber-300 text-white rounded-lg text-xs font-mono font-bold"
                                />
                              </div>
                              <div className="flex gap-1">
                                {[0, 350, 500, 750].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      const updated = { ...statementData };
                                      updated.sectionI.F3_otherFacilitiesAmount = preset;
                                      updated.sectionI.F_otherAmount = preset;
                                      if (customVenueName && !updated.sectionI.F3_otherFacilitiesSpecify) {
                                        updated.sectionI.F3_otherFacilitiesSpecify = customVenueName;
                                        updated.sectionI.F_otherSpecify = customVenueName;
                                      }
                                      setStatementData(calculateAP47Totals(updated));
                                    }}
                                    className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded text-[10px] text-neutral-300 font-mono"
                                  >
                                    {preset === 0 ? 'Free' : `${preset}`}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">
                              Automatically syncs to Form AP-47 facilities allocation &amp; contract totals.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clergy & Organist Leadership Assignments */}
                    <div className="pt-2 border-t border-white/10 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>Officiating Clergy / Minister:</span>
                        </span>
                        <input
                          type="text"
                          value={scheduleOfficiantName}
                          onChange={(e) => setScheduleOfficiantName(e.target.value)}
                          placeholder="e.g. Rev. Dr. Calvin O. Butts"
                          className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-hidden"
                        />
                        <div className="flex flex-wrap gap-1 pt-1">
                          {['Rev. Dr. Calvin O. Butts', 'Pastor Michael A. Walrond Jr.', 'Father Gregory Chisholm', 'Family Minister'].map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => setScheduleOfficiantName(name)}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] text-neutral-300 border border-white/10"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                          <span>🎹 Organist & Musical Director:</span>
                        </span>
                        <input
                          type="text"
                          value={scheduleOrganistName}
                          onChange={(e) => setScheduleOrganistName(e.target.value)}
                          placeholder="e.g. Prof. Gregory Hopkins"
                          className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-hidden"
                        />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Section 2: Public Visitation & Wake Coordinator */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span>👁️ Public Visitation & Wake Coordinator</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Select viewing schedule structure & parlor assignment
                    </span>
                  </div>

                  {/* Viewing Structure Chips */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { id: 'same_day', label: '🌅 Same-Day Pre-Service', hours: '10:00 AM – 11:00 AM (Pre-Service)' },
                      { id: 'prior_evening', label: '🌙 Prior Evening Wake', hours: '4:00 PM – 8:00 PM' },
                      { id: 'two_day', label: '🏛️ Two-Day Extended', hours: '3:00 PM – 7:00 PM & 10:00 AM Service' },
                      { id: 'private_only', label: '🔒 Private Family Only', hours: '10:30 AM – 11:00 AM (30 Mins)' },
                      { id: 'none', label: '🚫 Direct / No Viewing', hours: 'Direct Disposition' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setScheduleViewingOption(opt.id as any);
                          setScheduleViewingHours(opt.hours);
                          if (opt.id === 'prior_evening') {
                            setScheduleViewingDate(getQuickServiceDate(-1));
                          } else if (opt.id === 'same_day') {
                            setScheduleViewingDate(scheduleServiceDate);
                          }
                          showToast(`👁️ Viewing set to: ${opt.label}`);
                        }}
                        className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                          scheduleViewingOption === opt.id
                            ? 'bg-[#800000] text-white border-brass-400 shadow-md font-bold'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                        }`}
                      >
                        <div>{opt.label}</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">{opt.hours}</div>
                      </button>
                    ))}
                  </div>

                  {scheduleViewingOption !== 'none' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Viewing Date:</label>
                        <input
                          type="date"
                          value={scheduleViewingDate}
                          onChange={(e) => setScheduleViewingDate(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Viewing Hours Window:</label>
                        <input
                          type="text"
                          value={scheduleViewingHours}
                          onChange={(e) => setScheduleViewingHours(e.target.value)}
                          placeholder="e.g. 10:00 AM – 11:00 AM"
                          className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Viewing Facility / Parlor:</label>
                        <select
                          value={scheduleViewingParlor}
                          onChange={(e) => setScheduleViewingParlor(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-hidden"
                        >
                          <option value="Chapel 1 (Main Sanctuary - Seats 150)">Chapel 1 (Main Sanctuary - Seats 150)</option>
                          <option value="Chapel 2 (Memorial Chapel - Seats 100)">Chapel 2 (Memorial Chapel - Seats 100)</option>
                          <option value="Parlor A (North Salon - Seats 120)">Parlor A (Seats 120)</option>
                          <option value="Parlor B (Central Salon - Seats 110)">Parlor B (Seats 110)</option>
                          <option value="Parlor C (South Salon - Seats 80)">Parlor C (Seats 80)</option>
                          <option value="Parlor R (Repast Suite & Family Gathering)">Parlor R (Repast Room)</option>
                          <option value="Church / External Venue">Church / External Venue</option>
                          <option value="Direct / No Viewing">Direct / No Viewing</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Disposition Sequence, Cortege & Committal Timetable Coordinator */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span>🚘 Disposition Sequence &amp; Cemetery Committal Timetable</span>
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Compliant with Tri-State Cemetery Bylaws &amp; Flexible Multi-Day Scheduling</span>
                    </span>
                  </div>

                  {/* Disposition Sequence Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider block">
                      Select Disposition Sequence &amp; Logistics Workflow:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { 
                          id: 'same_day', 
                          icon: '🌅', 
                          title: 'Same-Day Immediate Disposition', 
                          desc: 'Cortege motorcade leaves sanctuary directly to cemetery / crematory on day of service.' 
                        },
                        { 
                          id: 'prior_to_service', 
                          icon: '🕊️', 
                          title: 'Disposition Prior to Service', 
                          desc: 'Direct cremation or private interment occurs first; memorial celebration held afterward with urn present.' 
                        },
                        { 
                          id: 'separate_day', 
                          icon: '📅', 
                          title: 'Separate-Day / Delayed Committal', 
                          desc: 'Funeral service occurs on one day; cemetery burial / crematory transfer occurs on a later day (e.g. Monday).' 
                        }
                      ].map((seq) => {
                        const isCurrent = (statementData.dispositionSchedule?.sequence || 'same_day') === seq.id;
                        return (
                          <button
                            key={seq.id}
                            type="button"
                            onClick={() => {
                              updateDispositionSchedule({ sequence: seq.id });
                              showToast(`📅 Disposition sequence set to: ${seq.title}`);
                            }}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                              isCurrent
                                ? 'bg-[#800000] text-white border-brass-400 shadow-md font-bold'
                                : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5 text-xs">
                              <span>{seq.icon}</span>
                              <span className="font-bold">{seq.title}</span>
                            </div>
                            <p className="text-[10px] opacity-80 leading-relaxed font-normal">{seq.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditional Timetable Controls based on Sequence */}
                  {(statementData.dispositionSchedule?.sequence || 'same_day') === 'same_day' ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
                      <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">1. Cortege Lineup:</span>
                        <input
                          type="text"
                          value={scheduleCortegeLineupTime}
                          onChange={(e) => setScheduleCortegeLineupTime(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 text-amber-300 rounded px-2 py-1 font-mono font-bold"
                        />
                        <span className="text-[10px] text-neutral-400">At Chapel / Church Entrance</span>
                      </div>

                      <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">2. Cortege Departure:</span>
                        <input
                          type="text"
                          value={scheduleCortegeDepartureTime}
                          onChange={(e) => setScheduleCortegeDepartureTime(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 text-amber-300 rounded px-2 py-1 font-mono font-bold"
                        />
                        <span className="text-[10px] text-neutral-400">Lead Car &amp; Hearse Escort</span>
                      </div>

                      <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">3. Cemetery Gate Arrival:</span>
                        <input
                          type="text"
                          value={scheduleCommittalArrivalTime}
                          onChange={(e) => setScheduleCommittalArrivalTime(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 text-amber-300 rounded px-2 py-1 font-mono font-bold"
                        />
                        <span className="text-[10px] text-neutral-400">Committal Service at Graveside</span>
                      </div>

                      <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-white/5 flex flex-col justify-between">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">4. Gate Cutoff Check:</span>
                        <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Woodlawn/Ferncliff Cutoff: 2:30 PM (OK)</span>
                        </div>
                        <span className="text-[9px] text-neutral-400 font-mono">10 NYCRR Pass-Through Certified</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-black/50 p-3.5 rounded-xl border border-amber-400/40 space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>📅 Independent Disposition Logistics Schedule:</span>
                        </span>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                          {(statementData.dispositionSchedule?.sequence === 'prior_to_service') ? 'Disposition Prior to Ceremony' : 'Separate-Day Cemetery Committal'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-300 block mb-1">Confirmed Date of Final Disposition:</label>
                          <input
                            type="date"
                            value={statementData.dispositionSchedule?.dateOfDisposition || getQuickServiceDate(2)}
                            onChange={(e) => {
                              updateDispositionSchedule({ dateOfDisposition: e.target.value });
                              updateVitalSheet({ directorDispositionDate: e.target.value });
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-300 block mb-1">Due Time for Disposition:</label>
                          <input
                            type="text"
                            value={statementData.dispositionSchedule?.dueTimeForDisposition || '10:30 AM'}
                            onChange={(e) => {
                              updateDispositionSchedule({ dueTimeForDisposition: e.target.value });
                              updateVitalSheet({ directorDispositionDueTime: e.target.value });
                            }}
                            placeholder="e.g. 10:30 AM"
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-300 block mb-1">Mode of Disposition:</label>
                          <select
                            value={statementData.dispositionSchedule?.modeOfDisposition || 'burial'}
                            onChange={(e) => {
                              updateDispositionSchedule({ modeOfDisposition: e.target.value as any });
                              updateVitalSheet({ directorDispositionMode: e.target.value as any });
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold"
                          >
                            <option value="burial">Burial (Cemetery Committal)</option>
                            <option value="cremation">Cremation (Crematory Retort)</option>
                            <option value="entombment">Entombment (Mausoleum Crypt)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Repast Gathering Toggle */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="repastCheck"
                        checked={scheduleRepastEnabled}
                        onChange={(e) => setScheduleRepastEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-[#800000] focus:ring-[#800000] bg-neutral-900 border-neutral-700"
                      />
                      <label htmlFor="repastCheck" className="font-bold text-neutral-200 cursor-pointer">
                        Include Post-Committal Repast Gathering in Schedule
                      </label>
                    </div>

                    {scheduleRepastEnabled && (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={scheduleRepastVenue}
                          onChange={(e) => setScheduleRepastVenue(e.target.value)}
                          placeholder="Repast Venue..."
                          className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-medium w-64"
                        />
                        <input
                          type="text"
                          value={scheduleRepastHours}
                          onChange={(e) => setScheduleRepastHours(e.target.value)}
                          placeholder="Repast Hours..."
                          className="bg-neutral-900 border border-neutral-700 text-amber-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold w-48"
                        />
                      </div>
                    )}
                  </div>

                </div>

                {/* Section 4: Live Master Schedule Timetable Ribbon */}
                <div className="bg-black/60 p-4 rounded-xl border border-amber-400/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Confirmed Timetable Flow for Case #{activeCase.caseNumber} ({activeCase.decedent.legalName}):</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Auto-dispatches to Staff & Family</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-0.5">
                      <div className="text-[10px] text-amber-400 font-bold uppercase">1. Visitation</div>
                      <div className="font-bold text-white text-[11px] truncate">{scheduleViewingHours}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{scheduleViewingParlor}</div>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-0.5">
                      <div className="text-[10px] text-amber-400 font-bold uppercase">2. Ceremony</div>
                      <div className="font-bold text-white text-[11px] truncate">{formatDisplayDate(scheduleServiceDate)} • {scheduleServiceTime}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{(scheduleServiceVenue === 'custom' || scheduleServiceVenue === 'other' || scheduleServiceVenue === 'Other') ? (customVenueName || 'Other Church / Facility') : scheduleServiceVenue}</div>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-0.5">
                      <div className="text-[10px] text-amber-400 font-bold uppercase">3. Committal</div>
                      <div className="font-bold text-white text-[11px] truncate">{scheduleCommittalArrivalTime} Arrival</div>
                      <div className="text-[10px] text-neutral-400 truncate">{statementData.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName || "Woodlawn Cemetery"}</div>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-0.5">
                      <div className="text-[10px] text-amber-400 font-bold uppercase">4. Repast</div>
                      <div className="font-bold text-white text-[11px] truncate">{scheduleRepastEnabled ? scheduleRepastHours : 'None Scheduled'}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{scheduleRepastEnabled ? scheduleRepastVenue : 'Direct Dismissal'}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ------------------------------------------------------------- */}
              {/* STEP 2.B: FINAL DISPOSITION DESTINATION (CEMETERY / CREMATORY) */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-red-50/40 p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#800000] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      🏛️
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                          Pass-Through Cash Advance
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          10 NYCRR § 77.8 Compliance
                        </span>
                      </div>
                      <h4 className="font-serif-title text-base font-bold text-neutral-900 mt-0.5">
                        Final Disposition Destination: Cemetery or Crematory
                      </h4>
                      <p className="text-xs text-neutral-600">
                        Select the interment cemetery, mausoleum, or crematory facility to automatically set pass-through cash advance fees, livery cortege routing, and Form AP-47 line items.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCemeteryModalOpen(true)}
                    className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-red-950/20 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-300" />
                    <span>Browse Cemetery Directory & Pricing Matrix</span>
                  </button>
                </div>

                {/* Active Cemetery Information Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1 shadow-2xs md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                        Selected Cemetery Destination:
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Payee</span>
                      </span>
                    </div>
                    <div className="font-bold text-neutral-900 text-sm">
                      {statementData.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName || "The Woodlawn Cemetery & Crematory"}
                    </div>
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#800000]" />
                      <span>Bronx, New York • Primary BFH Harlem partner facility (4199 Webster Ave)</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                        Applied Pass-Through Fee:
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        Form AP-47 Line II.1
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-neutral-100">
                      <span className="text-xs text-neutral-600 font-medium">Invoice Total:</span>
                      <span className="font-mono font-black text-base text-[#800000]">
                        ${statementData.sectionII.cemeteryOrCrematoryAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick 1-Click Select Chips for Common Harlem Destinations */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-neutral-700 block uppercase tracking-wider">
                    Quick-Select Frequent Tri-State Destinations:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { name: 'The Woodlawn Cemetery & Crematory', fee: 1850, label: 'Woodlawn (Bronx)', icon: '🏛️' },
                      { name: 'Ferncliff Cemetery & Crematory', fee: 1950, label: 'Ferncliff (Hartsdale)', icon: '🕊️' },
                      { name: 'The Green-Wood Cemetery & Crematory', fee: 2100, label: 'Green-Wood (Brooklyn)', icon: '🌳' },
                      { name: 'Calverton National Cemetery (VA / U.S. Veterans)', fee: 0, label: 'Calverton VA (FREE)', icon: '🎖️' },
                      { name: 'Trinity Church Cemetery and Mausoleum', fee: 2600, label: 'Trinity (Manhattan)', icon: '⛪' },
                      { name: 'Fresh Pond Crematory', fee: 450, label: 'Fresh Pond (Queens)', icon: '🔥' }
                    ].map((quick) => {
                      const isActive = statementData.sectionII.cemeteryOrCrematoryName?.includes(quick.label.split(' ')[0]) ||
                        (quick.fee === 0 && statementData.sectionII.cemeteryOrCrematoryAmount === 0);
                      return (
                        <button
                          key={quick.name}
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            updated.sectionII.cemeteryOrCrematoryName = quick.name;
                            updated.sectionII.cemeteryOrCrematoryAmount = quick.fee;
                            setStatementData(calculateAP47Totals(updated));
                            showToast(`✓ Selected ${quick.name} ($${quick.fee.toFixed(2)})`);
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#800000] text-white border-[#800000] shadow-xs'
                              : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                          }`}
                        >
                          <span>{quick.icon}</span>
                          <span>{quick.label}</span>
                          <span className={`font-mono text-[11px] ${isActive ? 'text-amber-300' : 'text-[#800000]'}`}>
                            {quick.fee === 0 ? '$0.00' : `$${quick.fee}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* STEP 2.C: SUBSECTION BASELINE & OTHER SERVICES (A THROUGH E) */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white p-5 rounded-2xl border-2 border-neutral-200 shadow-sm space-y-4">
                <div className="border-b border-neutral-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-red-100 text-[#800000] rounded-lg font-bold text-xs">
                      ✍️
                    </span>
                    <h4 className="font-serif-title text-base font-bold text-neutral-900">
                      Baseline Services &amp; Subsection Other Entries (Subsections A – E)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Specify custom line items and numerical dollar figures for any subsection under Section I Funeral Home Charges.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  
                  {/* Subsection A: Alternative Services Other */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-neutral-800 block">A. Other Alternative Services</span>
                      <span className="text-[10px] text-neutral-500">Custom flat-rate or special disposition package</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={statementData.sectionI.A_otherSpecify || ''}
                        placeholder="Item description..."
                        onChange={(e) => {
                          const updated = { ...statementData };
                          updated.sectionI.A_otherSpecify = e.target.value;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={statementData.sectionI.A_otherAmount === 0 ? '' : statementData.sectionI.A_otherAmount}
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.A_otherAmount = val;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection B: Transfer of Remains Other */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-neutral-800 block">B. Other Transfer / Extra Mileage</span>
                      <span className="text-[10px] text-neutral-500">Beyond 25-mile local radius, airport, or special transfer</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={statementData.sectionI.B_otherSpecify || ''}
                        placeholder="Item description..."
                        onChange={(e) => {
                          const updated = { ...statementData };
                          updated.sectionI.B_otherSpecify = e.target.value;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={statementData.sectionI.B_otherAmount === 0 ? '' : statementData.sectionI.B_otherAmount}
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.B_otherAmount = val;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection C: Preparation of Remains Other */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-neutral-800 block">C. Other Preparation</span>
                      <span className="text-[10px] text-neutral-500">Specialized restoration, hair styling, or autopsy care</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={statementData.sectionI.C_otherSpecify || statementData.sectionI.C2_otherSpecify || ''}
                        placeholder="Item description..."
                        onChange={(e) => {
                          const updated = { ...statementData };
                          updated.sectionI.C_otherSpecify = e.target.value;
                          updated.sectionI.C2_otherSpecify = e.target.value;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={(statementData.sectionI.C_otherAmount || statementData.sectionI.C2_otherAmount) === 0 ? '' : (statementData.sectionI.C_otherAmount || statementData.sectionI.C2_otherAmount)}
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.C_otherAmount = val;
                            updated.sectionI.C2_otherAmount = val;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection D: Arrangements Other */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-neutral-800 block">D. Other Arrangements / Consultation</span>
                      <span className="text-[10px] text-neutral-500">Extended arrangement conference or consular paperwork</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={statementData.sectionI.D_otherSpecify || ''}
                        placeholder="Item description..."
                        onChange={(e) => {
                          const updated = { ...statementData };
                          updated.sectionI.D_otherSpecify = e.target.value;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={statementData.sectionI.D_otherAmount === 0 ? '' : statementData.sectionI.D_otherAmount}
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.D_otherAmount = val;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection E: Supervision Other */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-neutral-800 block">E. Other Supervision</span>
                      <span className="text-[10px] text-neutral-500">Out-of-town committal, disinterment, or solemn mass staff</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={statementData.sectionI.E_otherSpecify || statementData.sectionI.E3_otherSupervisionSpecify || ''}
                        placeholder="Item description..."
                        onChange={(e) => {
                          const updated = { ...statementData };
                          updated.sectionI.E_otherSpecify = e.target.value;
                          updated.sectionI.E3_otherSupervisionSpecify = e.target.value;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={(statementData.sectionI.E_otherAmount || statementData.sectionI.E3_otherSupervisionAmount) === 0 ? '' : (statementData.sectionI.E_otherAmount || statementData.sectionI.E3_otherSupervisionAmount)}
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.E_otherAmount = val;
                            updated.sectionI.E3_otherSupervisionAmount = val;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Automatic Baseline Breakdown Notification */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">
                    Current Baseline Funeral Home Charges:
                  </span>
                  <span className="text-neutral-500">
                    Automatically itemized per BFH General Price List (Effective April 13, 2026).
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-base text-[#800000]">
                    ${statementData.sectionI.totalFuneralHomeCharges.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Step 2 Navigation Bar */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Back to Step 1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-red-950/20"
                >
                  <span>Proceed to Step 3: Variables, Catalogs & Custom Entries</span>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 3: VARIABLES, CATALOGS & CUSTOM MANUAL ENTRIES */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Category Selector Tabs */}
              <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2 overflow-x-auto text-xs font-bold">
                {[
                  { id: 'livery', label: '🚗 Livery & Vehicles', count: statementData.sectionI.G_vehicles?.length || 0 },
                  { id: 'merchandise', label: '⚰️ Caskets, Vaults & Urns', count: (statementData.sectionI.H1_casketSelected ? 1 : 0) + (statementData.sectionI.H3_urnSelected ? 1 : 0) },
                  { id: 'flowers', label: '💐 Floral Arrangements', count: statementData.sectionI.I6_flowerItems?.length || 0 },
                  { id: 'stationery', label: '📜 Printing & Stationery Matrix', count: statementData.sectionI.I10_programsMatrix.quantity },
                  { id: 'facilities_repast', label: '🍽️ Facilities & Repast Room', count: statementData.sectionI.F3_repastRoomAmount > 0 ? 1 : 0 },
                  { id: 'cash_advances', label: '💵 Cash Advances (Actual Cost)', count: 6 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveVariablesCategory(tab.id as any)}
                    className={`px-3 py-2 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                      activeVariablesCategory === tab.id
                        ? 'bg-[#800000] text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full font-mono">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* 3.A LIVERY FLEET & CUSTOM VEHICLE BUILDER */}
              {activeVariablesCategory === 'livery' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <span>🚗 Livery Fleet &amp; Motorcade Vehicle Allocation</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          Sprinter &amp; Escorted Vans Available
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-500">Standard rates per BFH General Price List (NYC Local vs Calverton National Cemetery). Notation for escorted with or without family.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#800000] bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                      Total Livery: ${statementData.sectionI.G_totalLiveryAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* 1-Click Fleet Quick-Add Preset Buttons */}
                  <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 space-y-2">
                    <span className="text-[10px] font-bold text-neutral-600 block uppercase tracking-wider">
                      Quick-Add BFH Fleet Vehicles:
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {[
                        { type: 'Cadillac Professional Funeral Hearse', price: BFH_GPL_2026.livery.hearseLocalNYC, label: 'Hearse ($655)', icon: '🚗', escort: 'none' as const },
                        { type: '7-Passenger Cadillac Family Limousine', price: BFH_GPL_2026.livery.limousine7PaxLocal, label: '7-Pax Limo ($715)', icon: '🚙', escort: 'with_family' as const },
                        { type: 'Mercedes Sprinter Van (14-Passenger)', price: BFH_GPL_2026.livery.sprinterVan, label: '🚐 Mercedes Sprinter Van ($1,300)', icon: '🚐', escort: 'with_family' as const, highlight: true },
                        { type: 'Transfer / Utility Van (Escorted with Family)', price: BFH_GPL_2026.livery.utilityVanEscortedWithFamily, label: 'Van (Escorted w/ Family - $650)', icon: '🚐', escort: 'with_family' as const },
                        { type: 'Transfer / Utility Van (Escorted without Family)', price: BFH_GPL_2026.livery.utilityVanEscortedWithoutFamily, label: 'Van (Escorted w/o Family - $484)', icon: '🚐', escort: 'without_family' as const },
                        { type: 'Lead Director / NYPD Escort Vehicle', price: BFH_GPL_2026.livery.alternativeVehicleLocal, label: 'Lead Escort Car ($484)', icon: '🚓', escort: 'none' as const },
                        { type: 'Flower Vehicle / Basket Transport', price: BFH_GPL_2026.livery.flowerVehicleLocal, label: 'Flower Car ($655)', icon: '🌸', escort: 'none' as const }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleAddPresetVehicle(preset.type, preset.price, preset.escort)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
                            preset.highlight
                              ? 'bg-brass-100 hover:bg-brass-200 text-brass-950 border-brass-400 font-extrabold ring-1 ring-amber-400/50'
                              : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                          }`}
                        >
                          <span>{preset.icon}</span>
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Vehicle Roster Table */}
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold">
                        <tr>
                          <th className="p-3">Vehicle Description</th>
                          <th className="p-3">Escort Notation</th>
                          <th className="p-3 text-center">Count / Qty</th>
                          <th className="p-3 text-right">Unit Rate ($)</th>
                          <th className="p-3 text-right">Line Total</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {(statementData.sectionI.G_vehicles || []).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-neutral-500 italic">
                              No livery vehicles selected. Use the quick-add buttons above or custom builder below to allocate motorcade vehicles.
                            </td>
                          </tr>
                        ) : (
                          (statementData.sectionI.G_vehicles || []).map((v) => (
                            <tr key={v.id} className="hover:bg-neutral-50 transition">
                              <td className="p-3">
                                <div className="font-semibold text-neutral-900">{v.vehicleType}</div>
                                <div className="text-[10px] text-neutral-500 font-mono">{v.rateType.replace(/_/g, ' ').toUpperCase()}</div>
                              </td>
                              <td className="p-3">
                                <select
                                  value={v.escortType || 'none'}
                                  onChange={(e) => handleUpdateVehicleEscortType(v.id, e.target.value as any)}
                                  className="text-xs p-1.5 bg-white border border-neutral-300 rounded-lg font-semibold text-neutral-800"
                                >
                                  <option value="with_family">👨‍👩‍👧 Escorted with Family</option>
                                  <option value="without_family">📦 Escorted without Family</option>
                                  <option value="none">➖ Standard / No Escort</option>
                                </select>
                              </td>
                              <td className="p-3 text-center">
                                <div className="inline-flex items-center space-x-1 bg-white border border-neutral-300 rounded-xl p-0.5 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateVehicleCount(v.id, Math.max(0, v.count - 1))}
                                    className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center transition cursor-pointer"
                                    title="Decrease vehicle count"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    max={20}
                                    value={v.count === 0 ? '' : v.count}
                                    placeholder="0"
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleUpdateVehicleCount(v.id, e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-12 text-center font-mono font-bold text-xs bg-transparent border-none p-1 focus:ring-0 text-neutral-900"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateVehicleCount(v.id, v.count + 1)}
                                    className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center transition cursor-pointer"
                                    title="Increase vehicle count"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="inline-flex items-center justify-end space-x-1">
                                  <span className="text-neutral-400 font-mono text-xs">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={v.unitPrice === 0 ? '' : v.unitPrice}
                                    placeholder="0.00"
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleUpdateVehicleUnitPrice(v.id, e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                                    className="w-24 text-right font-mono text-xs p-1.5 bg-white border border-neutral-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                                  />
                                </div>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-[#800000]">
                                ${(v.count * v.unitPrice).toFixed(2)}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVehicle(v.id)}
                                  className="p-1.5 text-neutral-400 hover:text-[#800000] transition cursor-pointer"
                                  title="Remove vehicle"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Custom Vehicle Manual Entry Builder */}
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                    <span className="font-bold text-xs text-neutral-800 block flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#800000]" />
                      <span>Custom Vehicle / Fleet Allocation Builder:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-neutral-500 block mb-1">Vehicle Description / Name:</label>
                        <input
                          type="text"
                          value={newCustomVehicleType}
                          onChange={(e) => setNewCustomVehicleType(e.target.value)}
                          placeholder="e.g. Mercedes Sprinter Van (14-Pax) or Flower Car"
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">Escort Notation:</label>
                        <select
                          value={newVehicleEscortType}
                          onChange={(e) => setNewVehicleEscortType(e.target.value as any)}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-800 text-xs font-semibold"
                        >
                          <option value="with_family">Escorted with Family</option>
                          <option value="without_family">Escorted without Family</option>
                          <option value="none">No Escort</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">Quantity:</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={newCustomVehicleCount === 0 ? '' : newCustomVehicleCount}
                          placeholder="1"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setNewCustomVehicleCount(e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">Unit Price ($):</label>
                        <input
                          type="number"
                          value={newCustomVehiclePrice === 0 ? '' : newCustomVehiclePrice}
                          placeholder="0.00"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setNewCustomVehiclePrice(e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomVehicle}
                      className="px-4 py-2 bg-[#800000] hover:bg-[#6a0509] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      + Add Custom Vehicle to Fleet Lineup
                    </button>
                  </div>

                  {/* Other Livery / Special Transportation */}
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                    <div>
                      <span className="font-bold text-neutral-800 block text-xs">G. Other Livery / Special Transportation:</span>
                      <span className="text-[10px] text-neutral-500">Custom motorcade escort, out-of-area coach, motorcycle cortege, or horse-drawn carriage</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={statementData.sectionI.G_otherSpecify || ''}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.G_otherSpecify = e.target.value;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          placeholder="e.g. NYPD Highway Patrol Escort or Horse-Drawn Glass Coach"
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={statementData.sectionI.G_otherAmount === 0 ? '' : statementData.sectionI.G_otherAmount}
                            placeholder="0.00"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                              const updated = { ...statementData };
                              updated.sectionI.G_otherAmount = val;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3.B MERCHANDISE: CASKET, VAULT & URN */}
              {activeVariablesCategory === 'merchandise' && (
                <div className="space-y-6">
                  
                  {/* Casket Selection & Manual Entry */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-[#800000]" />
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900 font-serif-title">
                            Casket or Alternative Container (GPL Range: $130.00 – $41,340.00)
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-normal">
                            Direct integration with official catalogs for <strong>Batesville Casket Company</strong> and <strong>Milso Industry</strong>.
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center space-x-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition">
                        <input
                          type="checkbox"
                          checked={statementData.sectionI.H1_casketSelected}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.H1_casketSelected = e.target.checked;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="rounded text-[#800000] focus:ring-[#800000]"
                        />
                        <span className="font-bold text-neutral-800">Include Casket in Contract</span>
                      </label>
                    </div>

                    {statementData.sectionI.H1_casketSelected && (
                      <div className="space-y-4 pt-1">
                        
                        {/* Manufacturer Filter Tabs */}
                        <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-[11px] text-neutral-700">Manufacturer Catalog:</span>
                              <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-[11px] font-medium">
                                <button
                                  type="button"
                                  onClick={() => setCasketManufacturerFilter('all')}
                                  className={`px-3 py-1 rounded-md transition ${
                                    casketManufacturerFilter === 'all'
                                      ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                                      : 'text-neutral-600 hover:text-neutral-900'
                                  }`}
                                >
                                  All ({ALL_UNIFIED_MERCHANDISE.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCasketManufacturerFilter('batesville')}
                                  className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
                                    casketManufacturerFilter === 'batesville'
                                      ? 'bg-[#800000] text-white shadow-2xs font-bold'
                                      : 'text-neutral-600 hover:text-neutral-900'
                                  }`}
                                >
                                  <span>Batesville Casket Co.</span>
                                  <span className="text-[10px] opacity-80 font-mono">({BATESVILLE_CASKETS.length})</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCasketManufacturerFilter('milso')}
                                  className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
                                    casketManufacturerFilter === 'milso'
                                      ? 'bg-[#15803d] text-white shadow-2xs font-bold'
                                      : 'text-neutral-600 hover:text-neutral-900'
                                  }`}
                                >
                                  <span>Milso Industry</span>
                                  <span className="text-[10px] opacity-80 font-mono">({MILSO_CASKETS.length})</span>
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowFullCasketGallery(!showFullCasketGallery)}
                              className="text-[11px] text-[#800000] hover:text-[#800000] font-bold flex items-center space-x-1 underline"
                            >
                              <span>{showFullCasketGallery ? 'Collapse Catalog Cards' : 'Browse Visual Catalog Cards'}</span>
                            </button>
                          </div>

                          {/* Search and Category Filter Controls */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                            <div className="sm:col-span-7">
                              <input
                                type="text"
                                placeholder="Search by item #, model name, material, finish, or interior..."
                                value={casketSearchQuery}
                                onChange={(e) => setCasketSearchQuery(e.target.value)}
                                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs placeholder:text-neutral-400 focus:bg-white focus:ring-1 focus:ring-[#800000]"
                              />
                            </div>
                            <div className="sm:col-span-5">
                              <select
                                value={casketCategoryFilter}
                                onChange={(e) => setCasketCategoryFilter(e.target.value)}
                                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800"
                              >
                                <option value="all">All Material Categories</option>
                                <option value="bronze">Bronze & Copper</option>
                                <option value="stainless">Stainless Steel</option>
                                <option value="steel">16, 18 & 20 Gauge Steel</option>
                                <option value="wood">Hardwoods (Cherry, Oak, Maple, Poplar, Pine, Pecan, Mahogany)</option>
                                <option value="cloth">Cloth & Alternative Containers</option>
                              </select>
                            </div>
                          </div>

                          {/* Quick Interactive Dropdown Selector */}
                          <div className="pt-2 border-t border-neutral-100">
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                              Select Item to Generate Contract Price & Details:
                            </label>
                            {(() => {
                              let filteredList = searchMerchandise(casketSearchQuery, casketManufacturerFilter, 'casket');
                              if (casketCategoryFilter !== 'all') {
                                filteredList = filteredList.filter(item => {
                                  const c = (item.category + ' ' + item.material).toLowerCase();
                                  if (casketCategoryFilter === 'bronze') return c.includes('bronze') || c.includes('copper');
                                  if (casketCategoryFilter === 'stainless') return c.includes('stainless') || c.includes('onyx') || c.includes('sapphire');
                                  if (casketCategoryFilter === 'steel') return c.includes('gauge') || c.includes('steel') || c.includes('gemini') || c.includes('apollo') || c.includes('aries') || c.includes('spectra') || c.includes('hercules') || c.includes('pisces');
                                  if (casketCategoryFilter === 'wood') return c.includes('cherry') || c.includes('oak') || c.includes('maple') || c.includes('poplar') || c.includes('pine') || c.includes('pecan') || c.includes('mahogany') || c.includes('wood') || c.includes('hardwood') || c.includes('veneer');
                                  if (casketCategoryFilter === 'cloth') return c.includes('cloth') || c.includes('doeskin') || c.includes('cardboard') || c.includes('alternative') || c.includes('unfinished');
                                  return true;
                                });
                              }

                              return (
                                <div className="space-y-2">
                                  <select
                                    value={selectedCasketCatalogId}
                                    onChange={(e) => {
                                      const id = e.target.value;
                                      setSelectedCasketCatalogId(id);
                                      const found = ALL_UNIFIED_MERCHANDISE.find(m => m.id === id);
                                      if (found) {
                                        const updated = { ...statementData };
                                        updated.sectionI.H1_casketSupplier = found.supplier;
                                        updated.sectionI.H1_casketModelNameOrNumber = found.supplier === 'Batesville Casket Company' 
                                          ? `[#${found.modelCodeOrNumber}] ${found.nameOrDescription}` 
                                          : found.nameOrDescription;
                                        updated.sectionI.H1_casketMaterialSpeciesOrGauge = found.material;
                                        updated.sectionI.H1_casketInterior = found.interior;
                                        updated.sectionI.H1_casketAmount = found.price;
                                        setStatementData(calculateAP47Totals(updated));
                                        showToast(`Selected: ${found.displayText}`);
                                      }
                                    }}
                                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                                  >
                                    <option value="">-- Choose from Catalog ({filteredList.length} items matching filter) --</option>
                                    {filteredList.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.supplier === 'Milso Industry'
                                          ? `[Milso] ${item.nameOrDescription} — $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                          : `[Batesville] [#${item.modelCodeOrNumber}] ${item.nameOrDescription} — $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                      </option>
                                    ))}
                                  </select>

                                  <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                                    <span>
                                      <strong>Format Rule:</strong> Batesville displays <em>Item number, Product Description, Proposed Display Price</em> | Milso displays <em>Item Name, Current Price</em>
                                    </span>
                                    <span className="font-mono text-neutral-600">
                                      Showing {filteredList.length} items
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Visual Catalog Grid (Collapsible or Shown) */}
                        {showFullCasketGallery && (
                          <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-neutral-700">Visual Catalog Selection Cards:</span>
                              <span className="text-[10px] text-neutral-500">Click any card to load specifications & generate price</span>
                            </div>

                            {(() => {
                              let filtered = searchMerchandise(casketSearchQuery, casketManufacturerFilter, 'casket');
                              if (casketCategoryFilter !== 'all') {
                                filtered = filtered.filter(item => {
                                  const c = (item.category + ' ' + item.material).toLowerCase();
                                  if (casketCategoryFilter === 'bronze') return c.includes('bronze') || c.includes('copper');
                                  if (casketCategoryFilter === 'stainless') return c.includes('stainless') || c.includes('onyx') || c.includes('sapphire');
                                  if (casketCategoryFilter === 'steel') return c.includes('gauge') || c.includes('steel') || c.includes('gemini') || c.includes('apollo') || c.includes('aries') || c.includes('spectra') || c.includes('hercules') || c.includes('pisces');
                                  if (casketCategoryFilter === 'wood') return c.includes('cherry') || c.includes('oak') || c.includes('maple') || c.includes('poplar') || c.includes('pine') || c.includes('pecan') || c.includes('mahogany') || c.includes('wood') || c.includes('hardwood') || c.includes('veneer');
                                  if (casketCategoryFilter === 'cloth') return c.includes('cloth') || c.includes('doeskin') || c.includes('cardboard') || c.includes('alternative') || c.includes('unfinished');
                                  return true;
                                });
                              }

                              const displayItems = filtered.slice(0, 16);

                              return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                                  {displayItems.map((item) => {
                                    const isSelected = statementData.sectionI.H1_casketModelNameOrNumber.includes(item.nameOrDescription);
                                    return (
                                      <div
                                        key={item.id}
                                        onClick={() => {
                                          setSelectedCasketCatalogId(item.id);
                                          const updated = { ...statementData };
                                          updated.sectionI.H1_casketSupplier = item.supplier;
                                          updated.sectionI.H1_casketModelNameOrNumber = item.supplier === 'Batesville Casket Company' 
                                            ? `[#${item.modelCodeOrNumber}] ${item.nameOrDescription}` 
                                            : item.nameOrDescription;
                                          updated.sectionI.H1_casketMaterialSpeciesOrGauge = item.material;
                                          updated.sectionI.H1_casketInterior = item.interior;
                                          updated.sectionI.H1_casketAmount = item.price;
                                          setStatementData(calculateAP47Totals(updated));
                                          showToast(`Generated: ${item.displayText}`);
                                        }}
                                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                                          isSelected
                                            ? 'bg-red-50/80 border-[#800000] ring-2 ring-red-400/50 shadow-xs'
                                            : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-2xs'
                                        }`}
                                      >
                                        <div className="space-y-1.5">
                                          <div className="flex items-center justify-between">
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                              item.supplier === 'Batesville Casket Company'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                            }`}>
                                              {item.supplier === 'Batesville Casket Company' ? 'Batesville' : 'Milso'}
                                            </span>
                                            <span className="text-[10px] font-mono text-neutral-500 font-semibold">
                                              #{item.modelCodeOrNumber}
                                            </span>
                                          </div>

                                          <div className="font-bold text-neutral-900 text-xs line-clamp-2">
                                            {item.nameOrDescription}
                                          </div>

                                          <div className="text-[10px] text-neutral-600 line-clamp-1">
                                            {item.material}
                                          </div>
                                          <div className="text-[10px] text-neutral-500 line-clamp-1">
                                            Interior: {item.interior}
                                          </div>
                                        </div>

                                        <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between">
                                          <div className="font-mono font-bold text-xs text-[#800000]">
                                            ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                          </div>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                                            isSelected
                                              ? 'bg-[#800000] text-white'
                                              : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200'
                                          }`}>
                                            {isSelected ? '✓ In Contract' : 'Select'}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Editable Form AP-47 Line Items */}
                        <div className="pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                              Supplier / Manufacturer:
                            </label>
                            <input
                              type="text"
                              value={statementData.sectionI.H1_casketSupplier}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H1_casketSupplier = e.target.value;
                                setStatementData(updated);
                              }}
                              placeholder="e.g. Batesville Casket Company or Milso Industry"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                              Model Name or Number:
                            </label>
                            <input
                              type="text"
                              value={statementData.sectionI.H1_casketModelNameOrNumber}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H1_casketModelNameOrNumber = e.target.value;
                                setStatementData(updated);
                              }}
                              placeholder="e.g. [#147792] F63 899 IDH Sapphire"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                              Material (Species of Wood / Gauge of Metal / Finish):
                            </label>
                            <input
                              type="text"
                              value={statementData.sectionI.H1_casketMaterialSpeciesOrGauge}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H1_casketMaterialSpeciesOrGauge = e.target.value;
                                setStatementData(updated);
                              }}
                              placeholder="e.g. Solid Cherry Hardwood / 18 Gauge Steel"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                              Interior Description & Lining:
                            </label>
                            <input
                              type="text"
                              value={statementData.sectionI.H1_casketInterior}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H1_casketInterior = e.target.value;
                                setStatementData(updated);
                              }}
                              placeholder="e.g. Almond Tailored Velvet / Rosetan Crepe"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>

                          <div className="sm:col-span-2 bg-red-50/50 p-3 rounded-xl border border-red-100 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-neutral-900 block">
                                Generated Contract Casket Price ($):
                              </label>
                              <span className="text-[10px] text-neutral-500">
                                Automatically generated from manufacturer retail schedule (Batesville Proposed Display Price / Milso Current Price)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-neutral-500">$</span>
                              <input
                                type="number"
                                value={statementData.sectionI.H1_casketAmount === 0 ? '' : statementData.sectionI.H1_casketAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.H1_casketAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-36 p-2 bg-white border border-red-300 rounded-lg text-sm font-mono font-bold text-[#800000] text-right focus:ring-2 focus:ring-[#800000]"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Outer Interment Receptacle / Vault */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#800000]" />
                        <span>Outer Interment Receptacle / Vault (GPL Range: $895.00 – $14,580.00)</span>
                      </h4>
                      <label className="flex items-center space-x-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition">
                        <input
                          type="checkbox"
                          checked={statementData.sectionI.H2_outerReceptacleSelected}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.H2_outerReceptacleSelected = e.target.checked;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="rounded text-[#800000] focus:ring-[#800000]"
                        />
                        <span className="font-bold text-neutral-800">Include Vault in Contract</span>
                      </label>
                    </div>

                    {statementData.sectionI.H2_outerReceptacleSelected && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CATALOG_VAULTS.map((v, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionI.H2_outerReceptacleSupplier = v.supplier;
                                updated.sectionI.H2_outerReceptacleModelName = v.model;
                                updated.sectionI.H2_outerReceptacleMaterial = v.material;
                                updated.sectionI.H2_outerReceptacleAmount = v.price;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className={`p-2.5 rounded-xl border text-left transition ${
                                statementData.sectionI.H2_outerReceptacleModelName === v.model
                                  ? 'bg-brass-50 border-[#800000] ring-2 ring-red-400/40 shadow-xs'
                                  : 'bg-white border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              <div className="font-bold text-neutral-900 text-[11px]">{v.model}</div>
                              <div className="text-[10px] text-neutral-500">{v.material}</div>
                              <div className="font-mono font-bold text-[#800000] text-xs mt-1">
                                ${v.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Supplier:</label>
                            <input
                              type="text"
                              value={statementData.sectionI.H2_outerReceptacleSupplier}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H2_outerReceptacleSupplier = e.target.value;
                                setStatementData(updated);
                              }}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Model Name:</label>
                            <input
                              type="text"
                              value={statementData.sectionI.H2_outerReceptacleModelName}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H2_outerReceptacleModelName = e.target.value;
                                setStatementData(updated);
                              }}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Vault Price ($):</label>
                            <input
                              type="number"
                              value={statementData.sectionI.H2_outerReceptacleAmount === 0 ? '' : statementData.sectionI.H2_outerReceptacleAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.H2_outerReceptacleAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                            />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Urns & Keepsakes Selection Studio */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-5 h-5 text-[#800000]" />
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900 font-serif-title">
                            Urn & Keepsake Merchandise (Batesville & Milso)
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-normal">
                            Cloisonne urns, cast bronze cubes, memory chimes, hardwood chests, tokens, and plaques.
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center space-x-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition">
                        <input
                          type="checkbox"
                          checked={statementData.sectionI.H3_urnSelected}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.H3_urnSelected = e.target.checked;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="rounded text-[#800000] focus:ring-[#800000]"
                        />
                        <span className="font-bold text-neutral-800">Include Urn in Contract</span>
                      </label>
                    </div>

                    {statementData.sectionI.H3_urnSelected && (
                      <div className="space-y-3 pt-1">
                        
                        <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-neutral-700">Select Urn / Keepsake Preset:</span>
                            <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-[10px] font-medium">
                              <button
                                type="button"
                                onClick={() => setUrnManufacturerFilter('all')}
                                className={`px-2.5 py-0.5 rounded-md transition ${
                                  urnManufacturerFilter === 'all'
                                    ? 'bg-white text-neutral-900 font-bold shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                All
                              </button>
                              <button
                                type="button"
                                onClick={() => setUrnManufacturerFilter('batesville')}
                                className={`px-2.5 py-0.5 rounded-md transition ${
                                  urnManufacturerFilter === 'batesville'
                                    ? 'bg-[#800000] text-white font-bold shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                Batesville
                              </button>
                              <button
                                type="button"
                                onClick={() => setUrnManufacturerFilter('milso')}
                                className={`px-2.5 py-0.5 rounded-md transition ${
                                  urnManufacturerFilter === 'milso'
                                    ? 'bg-[#15803d] text-white font-bold shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                Milso
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            <div className="sm:col-span-12">
                              <input
                                type="text"
                                placeholder="Search urns, keepsakes, medallions, cloisonne..."
                                value={urnSearchQuery}
                                onChange={(e) => setUrnSearchQuery(e.target.value)}
                                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs placeholder:text-neutral-400"
                              />
                            </div>
                          </div>

                          {(() => {
                            const urnItems = searchMerchandise(urnSearchQuery, urnManufacturerFilter, 'urn');
                            return (
                              <select
                                value={selectedUrnCatalogId}
                                onChange={(e) => {
                                  const id = e.target.value;
                                  setSelectedUrnCatalogId(id);
                                  const found = ALL_UNIFIED_MERCHANDISE.find(m => m.id === id);
                                  if (found) {
                                    const updated = { ...statementData };
                                    updated.sectionI.H3_urnSupplier = found.supplier;
                                    updated.sectionI.H3_urnModelName = found.supplier === 'Batesville Casket Company'
                                      ? `[#${found.modelCodeOrNumber}] ${found.nameOrDescription}`
                                      : found.nameOrDescription;
                                    updated.sectionI.H3_urnMaterial = found.material;
                                    updated.sectionI.H3_urnAmount = found.price;
                                    setStatementData(calculateAP47Totals(updated));
                                    showToast(`Selected: ${found.displayText}`);
                                  }
                                }}
                                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-900"
                              >
                                <option value="">-- Choose Urn / Keepsake ({urnItems.length} available) --</option>
                                {urnItems.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.supplier === 'Milso Industry'
                                      ? `[Milso] ${item.nameOrDescription} — $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                      : `[Batesville] [#${item.modelCodeOrNumber}] ${item.nameOrDescription} — $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                  </option>
                                ))}
                              </select>
                            );
                          })()}
                        </div>

                        <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Urn Supplier:</label>
                            <input
                              type="text"
                              value={statementData.sectionI.H3_urnSupplier}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H3_urnSupplier = e.target.value;
                                setStatementData(updated);
                              }}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Urn Model / Name:</label>
                            <input
                              type="text"
                              value={statementData.sectionI.H3_urnModelName}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H3_urnModelName = e.target.value;
                                setStatementData(updated);
                              }}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Urn Price ($):</label>
                            <input
                              type="number"
                              value={statementData.sectionI.H3_urnAmount === 0 ? '' : statementData.sectionI.H3_urnAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.H3_urnAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                            />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Other Merchandise Section */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                    <div>
                      <span className="font-bold text-neutral-800 block text-xs">H. Other Merchandise:</span>
                      <span className="text-[10px] text-neutral-500">Keepsake jewelry, crucifix, thumbies, vault seal warranty, flag case, or specialty goods</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={statementData.sectionI.H_otherSpecify || ''}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.H_otherSpecify = e.target.value;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          placeholder="e.g. Sterling Silver Fingerprint Keepsake Pendant & Chain"
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={statementData.sectionI.H_otherAmount === 0 ? '' : statementData.sectionI.H_otherAmount}
                            placeholder="0.00"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                              const updated = { ...statementData };
                              updated.sectionI.H_otherAmount = val;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 3.C FLOWERS & FLORAL ARRANGEMENTS */}
              {activeVariablesCategory === 'flowers' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="p-1.5 bg-red-100 text-red-800 rounded-lg">💐</span>
                        <h4 className="font-bold text-sm text-neutral-900 font-serif-title">Flowers & Floral Tributes (Benta&apos;s Florist Collection)</h4>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Handcrafted by our master florist. Select by category and size with real-time pricing and visual thumbnail verification.
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-1.5 cursor-pointer bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs transition">
                        <input
                          type="checkbox"
                          checked={statementData.sectionI.I6_noFlowersRequested}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.I6_noFlowersRequested = e.target.checked;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="rounded text-neutral-900"
                        />
                        <span className="font-bold text-neutral-800">No Flowers (In Lieu of Flowers)</span>
                      </label>
                      <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-xl">
                        <span className="text-xs font-mono font-bold text-[#800000]">
                          Total Floral: ${(statementData.sectionI.I6_totalFlowersAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!statementData.sectionI.I6_noFlowersRequested && (
                    <div className="space-y-5">
                      
                      {/* BFH Floral Arrangement Selector Box */}
                      <div className="bg-gradient-to-br from-amber-50/50 via-white to-neutral-50 p-5 rounded-2xl border-2 border-amber-300/70 shadow-xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 bg-amber-200/70 text-amber-900 border border-amber-300 rounded-md text-[11px] font-bold uppercase tracking-wider">
                              BFH Florist Studio
                            </span>
                            <span className="text-xs font-bold text-neutral-800">
                              {selectedFloralBook === 'danielas_original' 
                                ? `Daniela's. Original Catalog (${DANIELAS_ORIGINAL_CATALOG.length} Handcrafted Designs, #1–#192)`
                                : `Other Floral Book (${OTHER_FLORAL_CATALOG.length} General Sympathy Designs)`}
                            </span>
                          </div>
                          
                          {/* Dual Catalog Toggle Tabs */}
                          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFloralBook('danielas_original');
                                setSelectedFloralCategory('all');
                                setSelectedFloralCode('BFH-CC-001');
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                selectedFloralBook === 'danielas_original'
                                  ? 'bg-[#800000] text-white shadow-xs'
                                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                              }`}
                            >
                              <span>🌸</span>
                              <span>Daniela&apos;s. Original ({DANIELAS_ORIGINAL_CATALOG.length})</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFloralBook('other_floral_book');
                                setSelectedFloralCategory('all');
                                setSelectedFloralCode('BFH-CS-001');
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                selectedFloralBook === 'other_floral_book'
                                  ? 'bg-[#800000] text-white shadow-xs'
                                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                              }`}
                            >
                              <span>🌿</span>
                              <span>Other Floral Book ({OTHER_FLORAL_CATALOG.length})</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowVisualFloralGallery(!showVisualFloralGallery)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brass-50 hover:bg-brass-100 border border-brass-300 text-brass-900 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                              <span>{showVisualFloralGallery ? 'Hide Photo Gallery' : 'Browse Visual Photo Gallery'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Photo Gallery Drawer */}
                        {showVisualFloralGallery && (
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-amber-300/80 space-y-3.5 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                              <div>
                                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-600" />
                                  <span>
                                    {selectedFloralBook === 'danielas_original' ? "Daniela's. Original Gallery (192 Handcrafted Pieces)" : "Other Floral Book Gallery"}
                                  </span>
                                </span>
                                <p className="text-[11px] text-neutral-500 mt-0.5">
                                  Click any floral arrangement to view high-resolution details, select sizing tier, customize ribbon sash, and load into Form AP-47.
                                </p>
                              </div>
                              <div className="relative w-full sm:w-64">
                                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                                <input
                                  type="text"
                                  value={floralSearchQuery}
                                  onChange={(e) => setFloralSearchQuery(e.target.value)}
                                  placeholder="Search by catalog #, code, name..."
                                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-400 focus:bg-white"
                                />
                                {floralSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setFloralSearchQuery('')}
                                    className="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-700 text-xs"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs">
                              {(selectedFloralBook === 'danielas_original' ? DANIELAS_CATEGORIES : OTHER_FLORAL_CATEGORIES).map((cat) => {
                                const currentBookCatalog = selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG : OTHER_FLORAL_CATALOG;
                                const count = cat.id === 'all' 
                                  ? currentBookCatalog.length 
                                  : currentBookCatalog.filter(f => f.category === cat.id).length;
                                const isCatActive = selectedFloralCategory === cat.id;
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedFloralCategory(cat.id)}
                                    className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                                      isCatActive
                                        ? 'bg-[#800000] text-white shadow-xs'
                                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                                    }`}
                                  >
                                    <span>{cat.label.split('(')[0].trim()}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                                      isCatActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                                    }`}>
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Gallery Image Grid with Clean Professional Price Stickers */}
                            {(() => {
                              const currentBookCatalog = selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG : OTHER_FLORAL_CATALOG;
                              const galleryList = currentBookCatalog.filter(f => {
                                const matchCat = selectedFloralCategory === 'all' || f.category === selectedFloralCategory;
                                const q = floralSearchQuery.toLowerCase().trim();
                                const matchSearch = !q 
                                  || f.name.toLowerCase().includes(q) 
                                  || f.code.toLowerCase().includes(q) 
                                  || (f.catalogNumber && String(f.catalogNumber).includes(q))
                                  || f.description.toLowerCase().includes(q) 
                                  || f.categoryLabel.toLowerCase().includes(q) 
                                  || (f.floristPartner && f.floristPartner.toLowerCase().includes(q));
                                return matchCat && matchSearch;
                              });

                              if (galleryList.length === 0) {
                                return (
                                  <div className="py-8 text-center text-xs text-neutral-400">
                                    No floral arrangements match your filter query. Try clearing the search.
                                  </div>
                                );
                              }

                              return (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-96 overflow-y-auto p-1">
                                  {galleryList.map((item) => {
                                    const isSelected = selectedFloralCode === item.code;
                                    const isFixedPrice = item.pricing.small === item.pricing.large;
                                    return (
                                      <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedFloralCode(item.code);
                                        }}
                                        className={`p-2 rounded-xl border text-left transition relative group overflow-hidden cursor-pointer flex flex-col justify-between ${
                                          isSelected 
                                            ? 'border-[#800000] bg-brass-50/80 ring-2 ring-[#800000]/30 shadow-md' 
                                            : 'border-neutral-200 bg-neutral-50 hover:border-brass-400 hover:bg-white hover:shadow-xs'
                                        }`}
                                      >
                                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-1.5 relative border border-neutral-100 shadow-2xs">
                                          <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                          />
                                          {/* Catalog Number Badge */}
                                          {item.catalogNumber && (
                                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#800000] text-white text-[9px] font-bold font-mono rounded shadow-xs">
                                              #{item.catalogNumber}
                                            </span>
                                          )}
                                          
                                          {/* Professional Cleaned-up Price Sticker */}
                                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[9px] font-bold font-mono rounded shadow-xs border border-amber-400/40">
                                            {isFixedPrice ? `$${item.pricing.medium}` : `$${item.pricing.small}–$${item.pricing.large}`}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-bold text-neutral-900 line-clamp-1 leading-tight">
                                            {item.name}
                                          </div>
                                          <div className="flex items-center justify-between text-[9px] text-neutral-500 mt-0.5">
                                            <span className="font-mono font-bold text-neutral-700">{item.code}</span>
                                            <span className="font-bold text-[#800000]">
                                              ${item.pricing.medium}
                                            </span>
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Dropdown Filters & Size Selector Grid */}
                        {(() => {
                          const activeProduct = getFloralByCode(selectedFloralCode, selectedFloralBook) 
                            || (selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG[0] : OTHER_FLORAL_CATALOG[0]);
                          const currentBookCatalog = selectedFloralBook === 'danielas_original' ? DANIELAS_ORIGINAL_CATALOG : OTHER_FLORAL_CATALOG;
                          const filteredCatalog = currentBookCatalog.filter(f => {
                            const matchCat = selectedFloralCategory === 'all' || f.category === selectedFloralCategory;
                            const q = floralSearchQuery.toLowerCase().trim();
                            const matchSearch = !q 
                              || f.name.toLowerCase().includes(q) 
                              || f.code.toLowerCase().includes(q) 
                              || (f.catalogNumber && String(f.catalogNumber).includes(q))
                              || f.description.toLowerCase().includes(q) 
                              || f.categoryLabel.toLowerCase().includes(q) 
                              || (f.floristPartner && f.floristPartner.toLowerCase().includes(q));
                            return matchCat && matchSearch;
                          });

                          const currentUnitPrice = activeProduct.pricing[selectedFloralSize] || activeProduct.pricing.medium || 350;
                          const currentTotal = currentUnitPrice * selectedFloralQty;
                          const isFixedPrice = activeProduct.pricing.small === activeProduct.pricing.large;

                          return (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                              {/* Left Controls */}
                              <div className="lg:col-span-7 space-y-3.5 text-xs">
                                
                                {/* 1. Category Dropdown & Quick Search Bar */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                                      <span>1. Floral Category:</span>
                                    </label>
                                    <select
                                      value={selectedFloralCategory}
                                      onChange={(e) => {
                                        const newCat = e.target.value as FloralCategory | 'all';
                                        setSelectedFloralCategory(newCat);
                                        if (newCat !== 'all') {
                                          const inCat = currentBookCatalog.filter(f => f.category === newCat);
                                          if (inCat.length > 0 && !inCat.some(f => f.code === selectedFloralCode)) {
                                            setSelectedFloralCode(inCat[0].code);
                                          }
                                        }
                                      }}
                                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    >
                                      {(selectedFloralBook === 'danielas_original' ? DANIELAS_CATEGORIES : OTHER_FLORAL_CATEGORIES).map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                                      <Search className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Filter / Search Catalog:</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={floralSearchQuery}
                                      onChange={(e) => setFloralSearchQuery(e.target.value)}
                                      placeholder="e.g. #42, Casket, Spray, Heart, Cross..."
                                      className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                  </div>
                                </div>

                                {/* 2. Arrangement Dropdown */}
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                                      <span>2. Select Floral Arrangement ({filteredCatalog.length} available):</span>
                                    </span>
                                    <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                      {activeProduct.bookSource || "Daniela's. Original"}
                                    </span>
                                  </label>
                                  <select
                                    value={selectedFloralCode}
                                    onChange={(e) => setSelectedFloralCode(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                  >
                                    {filteredCatalog.map(item => (
                                      <option key={item.code} value={item.code}>
                                        {item.catalogNumber ? `#${item.catalogNumber} ` : ''}[{item.code}] {item.name} — (${item.categoryLabel}) — ${item.pricing.medium ? `$${item.pricing.medium}` : `$${item.pricing.small}`}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* 3. Size Selection (Generates Price) */}
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                                    <span>3. Select Size (Creates Total Price):</span>
                                    <span className="text-[10px] text-neutral-500 font-normal">
                                      {isFixedPrice ? 'Fixed Price Tribute' : 'Standard Tier Pricing (Small $300 / Med $350 / Lrg $400)'}
                                    </span>
                                  </label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {(['small', 'medium', 'large'] as FloralSize[]).map((sizeKey) => {
                                      const price = activeProduct.pricing[sizeKey] ?? activeProduct.pricing.medium;
                                      const dim = activeProduct.dimensions[sizeKey];
                                      const isSelected = selectedFloralSize === sizeKey;
                                      return (
                                        <button
                                          key={sizeKey}
                                          type="button"
                                          onClick={() => setSelectedFloralSize(sizeKey)}
                                          className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                                            isSelected
                                              ? 'border-[#800000] bg-brass-50 text-[#800000] ring-2 ring-[#800000]/20 font-bold shadow-xs'
                                              : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                                          }`}
                                        >
                                          <span className="text-xs uppercase tracking-wider">{sizeKey}</span>
                                          <span className="text-sm font-mono font-bold mt-1 text-[#800000]">${price.toFixed(2)}</span>
                                          <span className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{dim}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* 4. Ribbon / Banner Sash Text & Quantity */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                                      Ribbon / Sash Text (Optional):
                                    </label>
                                    <input
                                      type="text"
                                      value={selectedFloralRibbon}
                                      onChange={(e) => setSelectedFloralRibbon(e.target.value)}
                                      placeholder="e.g. Loving Family, Beloved Mother, Forever in Our Hearts"
                                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-400"
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {[
                                        'Loving Family',
                                        'Beloved Mother',
                                        'Beloved Father',
                                        'To Our Beloved Papa',
                                        'Beloved Grandmother',
                                        'Beloved Grandfather',
                                        'Forever in Our Hearts',
                                        'Rest in Peace',
                                        "In God's Eternal Care",
                                        'Beloved Sister',
                                        'Beloved Brother'
                                      ].map((phrase) => (
                                        <button
                                          key={phrase}
                                          type="button"
                                          onClick={() => setSelectedFloralRibbon(phrase)}
                                          className="text-[10px] px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-md transition cursor-pointer"
                                        >
                                          + {phrase}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                                      Quantity:
                                    </label>
                                    <div className="flex items-center space-x-1">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedFloralQty(Math.max(1, selectedFloralQty - 1))}
                                        className="w-8 h-9 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        min={1}
                                        value={selectedFloralQty === 0 ? '' : selectedFloralQty}
                                        placeholder="1"
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setSelectedFloralQty(e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-center"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setSelectedFloralQty(selectedFloralQty + 1)}
                                        className="w-8 h-9 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>

                              </div>

                              {/* Right Live Preview Card with Clean Price Sticker Seal */}
                              <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                      {activeProduct.bookSource || "Daniela's. Original"}
                                    </span>
                                    <span className="font-mono text-[11px] font-bold text-neutral-700">
                                      {activeProduct.catalogNumber ? `#${activeProduct.catalogNumber} • ` : ''}{activeProduct.code}
                                    </span>
                                  </div>

                                  {/* Cropped Image Preview & Clean Price Badge */}
                                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-neutral-200 mb-3 shadow-inner flex items-center justify-center p-2">
                                    <img
                                      src={activeProduct.imageUrl}
                                      alt={activeProduct.name}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                    
                                    {/* Category tag */}
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-900/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold rounded-md">
                                      {activeProduct.categoryLabel}
                                    </div>

                                    {/* Professional Cleaned-up Price Sticker Badge */}
                                    <div className="absolute top-2 right-2 px-2.5 py-1 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-mono font-bold rounded-lg shadow-md border border-amber-300/50 flex items-center gap-1">
                                      <span className="text-[10px] uppercase font-sans tracking-wider opacity-80">PRICE:</span>
                                      <span>${currentUnitPrice.toFixed(2)}</span>
                                    </div>

                                    {selectedFloralRibbon.trim() && (
                                      <div className="absolute bottom-2 left-2 right-2 bg-[#800000]/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold text-center truncate shadow-md border border-amber-300/40">
                                        🎗️ Ribbon Sash: &quot;{selectedFloralRibbon.trim()}&quot;
                                      </div>
                                    )}
                                  </div>

                                  <h5 className="font-bold text-neutral-900 text-xs line-clamp-1">{activeProduct.name}</h5>
                                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">{activeProduct.description}</p>
                                  
                                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                                    <span className="text-neutral-500 font-medium">
                                      Size: <strong className="text-neutral-800 uppercase">{selectedFloralSize}</strong> ({activeProduct.dimensions[selectedFloralSize]})
                                    </span>
                                    <span className="font-mono text-neutral-700 font-bold">
                                      ${currentUnitPrice.toFixed(2)} &times; {selectedFloralQty}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-neutral-200">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-neutral-700">Total Item Price:</span>
                                    <span className="text-base font-mono font-bold text-[#800000]">
                                      ${currentTotal.toFixed(2)}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleAddBFHFloral}
                                    className="w-full py-2.5 bg-[#800000] hover:bg-[#7f1d1d] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Add to Form AP-47 Contract &amp; Merchandise Schedule</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Active Flower List with Image Thumbnails */}
                      <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <div className="p-3 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between">
                          <span className="font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Included Floral Tribute Schedule ({(statementData.sectionI.I6_flowerItems || []).length} items):</span>
                          </span>
                          <span className="text-xs font-mono font-bold text-[#800000]">
                            Total: ${(statementData.sectionI.I6_totalFlowersAmount || 0).toFixed(2)}
                          </span>
                        </div>

                        {(statementData.sectionI.I6_flowerItems || []).length === 0 ? (
                          <div className="p-6 text-center text-xs text-neutral-400">
                            No floral arrangements added yet. Use the BFH Florist selector above to add tributes.
                          </div>
                        ) : (
                          <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold text-[11px]">
                              <tr>
                                <th className="p-3">Floral Arrangement &amp; Visual Preview</th>
                                <th className="p-3 text-center">Type</th>
                                <th className="p-3 text-center">Size / Sash</th>
                                <th className="p-3 text-center">Qty</th>
                                <th className="p-3 text-right">Unit Price</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {(statementData.sectionI.I6_flowerItems || []).map((f) => (
                                <tr key={f.id} className="hover:bg-neutral-50/80 transition">
                                  <td className="p-3">
                                    <div className="flex items-center space-x-3">
                                      {f.imageUrl ? (
                                        <img
                                          src={f.imageUrl}
                                          alt={f.description}
                                          className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0 shadow-xs"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-800 shrink-0">
                                          💐
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-semibold text-neutral-900 text-xs">
                                          {f.name || f.description}
                                        </div>
                                        {f.code && (
                                          <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono text-[10px] font-bold">
                                            {f.code}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3 text-center font-mono uppercase text-[10px] text-neutral-500">
                                    {f.type.replace(/_/g, ' ')}
                                  </td>
                                  <td className="p-3 text-center text-[11px]">
                                    {f.size && (
                                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded font-bold uppercase text-[10px] block mb-0.5">
                                        {f.size}
                                      </span>
                                    )}
                                    {f.ribbonText ? (
                                      <span className="text-red-700 italic text-[10px] block">
                                        &quot;{f.ribbonText}&quot;
                                      </span>
                                    ) : (
                                      <span className="text-neutral-400 text-[10px]">No sash</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="inline-flex items-center space-x-1 bg-white border border-neutral-300 rounded-xl p-0.5 shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateFlowerQuantity(f.id, Math.max(1, f.quantity - 1))}
                                        className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center transition cursor-pointer"
                                        title="Decrease floral qty"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={f.quantity === 0 ? '' : f.quantity}
                                        placeholder="1"
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => handleUpdateFlowerQuantity(f.id, e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-10 text-center font-mono font-bold text-xs bg-transparent border-none p-0 focus:ring-0 text-neutral-900"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateFlowerQuantity(f.id, f.quantity + 1)}
                                        className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center transition cursor-pointer"
                                        title="Increase floral qty"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="inline-flex items-center justify-end space-x-1">
                                      <span className="text-neutral-400 font-mono text-xs">$</span>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={f.unitPrice === 0 ? '' : f.unitPrice}
                                        placeholder="0.00"
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => handleUpdateFlowerUnitPrice(f.id, e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-20 text-right font-mono text-xs p-1 bg-white border border-neutral-300 rounded-lg focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                                      />
                                    </div>
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-[#800000]">${(f.quantity * f.unitPrice).toFixed(2)}</td>
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFlower(f.id)}
                                      className="p-1.5 text-neutral-400 hover:text-[#800000] transition cursor-pointer"
                                      title="Remove floral item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* Custom Flower Manual Entry */}
                      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                        <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-[#800000]" />
                          <span>Custom / Special Florist Arrangement Entry (Off-Catalog):</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Arrangement Type:</label>
                            <select
                              value={newCustomFlowerType}
                              onChange={(e) => setNewCustomFlowerType(e.target.value as FloralArrangementItem['type'])}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            >
                              <option value="casket_spray">Casket Spray</option>
                              <option value="standing_spray">Standing Spray</option>
                              <option value="heart_wreath">Heart Wreath</option>
                              <option value="church_basket">Church Basket</option>
                              <option value="boutonniere_corsage">Boutonniere / Corsage</option>
                              <option value="cross_wreath">Cross Wreath</option>
                              <option value="family_urn_surround">Urn Surround</option>
                              <option value="custom">Custom Piece</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] text-neutral-500 block mb-1">Description:</label>
                            <input
                              type="text"
                              value={newCustomFlowerDesc}
                              onChange={(e) => setNewCustomFlowerDesc(e.target.value)}
                              placeholder="e.g. Broken Heart Red Rose Wreath from Grandchildren"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Quantity:</label>
                            <input
                              type="number"
                              min={1}
                              value={newCustomFlowerQty === 0 ? '' : newCustomFlowerQty}
                              placeholder="1"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => setNewCustomFlowerQty(e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-1">Unit Price ($):</label>
                            <input
                              type="number"
                              value={newCustomFlowerPrice === 0 ? '' : newCustomFlowerPrice}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => setNewCustomFlowerPrice(e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCustomFlower}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          + Add Custom Floral Piece
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}


              {/* 3.D PRINTING & STATIONERY MATRIX */}
              {activeVariablesCategory === 'stationery' && (
                <div className="space-y-6 text-xs">
                  
                  {/* Programs & Booklets Matrix */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#800000]" />
                        <span>Memorial Programs & Booklets Matrix (Type, Size, Quantity)</span>
                      </h4>
                      <span className="font-mono font-bold text-xs text-[#800000]">
                        Total Programs: ${statementData.sectionI.I10_programsMatrix.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'standard_bifold_50', label: 'Standard Bi-Fold (50 pk)', price: BFH_GPL_2026.stationery.standardBiFold50 },
                        { id: 'large_bifold_50', label: 'Large Bi-Fold Program (50 pk)', price: BFH_GPL_2026.stationery.largeBiFold50 },
                        { id: 'premium_designer_50', label: 'Premium Designer Program (50 pk)', price: BFH_GPL_2026.stationery.premiumDesigner50 },
                        { id: 'standard_booklet_50', label: 'Standard Multi-Page Booklet (50 pk)', price: BFH_GPL_2026.stationery.standardBooklet50 },
                        { id: 'large_booklet_50', label: 'Large Deluxe Booklet (50 pk)', price: BFH_GPL_2026.stationery.largeBooklet50 }
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            updated.sectionI.I10_programsMatrix.programType = p.id as any;
                            updated.sectionI.I10_programsMatrix.unitPrice = p.price;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            statementData.sectionI.I10_programsMatrix.programType === p.id
                              ? 'bg-brass-50 border-[#800000] ring-2 ring-red-400/40 shadow-xs'
                              : 'bg-white border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          <div className="font-bold text-neutral-900 text-[11px]">{p.label}</div>
                          <div className="font-mono font-bold text-xs text-[#800000] mt-1">${p.price.toFixed(2)}</div>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-200">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-neutral-500 font-bold">Total Quantity Printed:</label>
                          <div className="flex items-center space-x-1">
                            {[-50, -25, 25, 50, 100].map(delta => (
                              <button
                                key={delta}
                                type="button"
                                onClick={() => {
                                  const updated = { ...statementData };
                                  const newQ = Math.max(0, updated.sectionI.I10_programsMatrix.quantity + delta);
                                  updated.sectionI.I10_programsMatrix.quantity = newQ;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="px-1.5 py-0.5 bg-neutral-200 hover:bg-neutral-300 rounded text-[10px] font-mono font-bold text-neutral-700 cursor-pointer"
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.I10_programsMatrix.quantity = Math.max(0, updated.sectionI.I10_programsMatrix.quantity - 25);
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="w-8 h-9 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            step={25}
                            value={statementData.sectionI.I10_programsMatrix.quantity === 0 ? '' : statementData.sectionI.I10_programsMatrix.quantity}
                            placeholder="0"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0);
                              const updated = { ...statementData };
                              updated.sectionI.I10_programsMatrix.quantity = val;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-center"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.I10_programsMatrix.quantity = updated.sectionI.I10_programsMatrix.quantity + 25;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="w-8 h-9 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">Unit Price ($):</label>
                        <input
                          type="number"
                          value={statementData.sectionI.I10_programsMatrix.unitPrice === 0 ? '' : statementData.sectionI.I10_programsMatrix.unitPrice}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.I10_programsMatrix.unitPrice = val;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-[#800000]"
                        />
                      </div>
                      <div className="flex items-center pt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={statementData.sectionI.I10_programsMatrix.lateFeeApplied}
                            onChange={(e) => {
                              const updated = { ...statementData };
                              updated.sectionI.I10_programsMatrix.lateFeeApplied = e.target.checked;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="rounded text-[#800000]"
                          />
                          <span className="font-bold text-neutral-800 text-[11px]">
                            Production Late Fee (+$125 if &lt;48h)
                          </span>
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Register Books (Memorial Guest Books) Selection Card */}
                  <div className="bg-[#fbf9f6] p-5 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg font-bold text-sm">
                          📖
                        </span>
                        <div>
                          <h4 className="font-serif-title font-bold text-sm sm:text-base text-neutral-900">
                            Register Books (Memorial Guest Attendance Logs)
                          </h4>
                          <p className="text-[11px] text-neutral-600">
                            Official Benta commemorative register book with embossed gold foil crest, attendee registry pages, family history record, and condolence log.
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">Register Books Line Total</span>
                        <span className="font-mono font-bold text-sm text-[#800000]">
                          ${statementData.sectionI.I8_registerBookAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Book Type Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectRegisterBookOption('standard')}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          statementData.sectionI.I8_registerBookUnitPrice === BFH_GPL_2026.stationery.registerBookBase && (statementData.sectionI.I8_registerBookQty || 0) > 0
                            ? 'bg-brass-50/90 border-[#800000] ring-2 ring-red-400/40 shadow-xs'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-neutral-900 text-xs">Standard Padded Leatherette Book</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">Gold foil Benta crest • Padded vinyl cover</div>
                        </div>
                        <div className="text-right font-mono font-bold text-sm text-[#800000]">
                          ${BFH_GPL_2026.stationery.registerBookBase.toFixed(2)} / book
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectRegisterBookOption('deluxe')}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          statementData.sectionI.I8_registerBookUnitPrice === BFH_GPL_2026.stationery.registerBookDeluxe && (statementData.sectionI.I8_registerBookQty || 0) > 0
                            ? 'bg-brass-50/90 border-[#800000] ring-2 ring-red-400/40 shadow-xs'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-neutral-900 text-xs">Deluxe Heirloom Hardbound Book</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">Hand-stitched leather • Gold gilded page edges</div>
                        </div>
                        <div className="text-right font-mono font-bold text-sm text-[#800000]">
                          ${BFH_GPL_2026.stationery.registerBookDeluxe.toFixed(2)} / book
                        </div>
                      </button>
                    </div>

                    {/* Quantity and Price Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60 items-center">
                      <div>
                        <label className="text-[10px] text-neutral-600 font-bold block mb-1">
                          Book Quantity (Direct Input or Stepper):
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateRegisterBookQty(Math.max(0, (statementData.sectionI.I8_registerBookQty || 0) - 1))}
                            className="w-9 h-9 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={statementData.sectionI.I8_registerBookQty === 0 ? '' : statementData.sectionI.I8_registerBookQty}
                            placeholder="0"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleUpdateRegisterBookQty(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-center text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateRegisterBookQty((statementData.sectionI.I8_registerBookQty || 0) + 1)}
                            className="w-9 h-9 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-600 font-bold block mb-1">
                          Rate per Book ($):
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-xs">$</span>
                          <input
                            type="number"
                            value={statementData.sectionI.I8_registerBookUnitPrice === 0 ? '' : statementData.sectionI.I8_registerBookUnitPrice}
                            placeholder="50.00"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleUpdateRegisterBookUnitPrice(e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full pl-6 pr-3 p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-xs text-[#800000]"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-200">
                        <span className="text-[10px] text-neutral-500 block">Calculation Preview:</span>
                        <div className="font-mono text-xs font-bold text-neutral-900 mt-0.5">
                          {statementData.sectionI.I8_registerBookQty || 0} books × ${(statementData.sectionI.I8_registerBookUnitPrice || 50).toFixed(2)} = <span className="text-[#800000]">${statementData.sectionI.I8_registerBookAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prayer Cards, Cards & Keepsakes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Prayer / Memorial Cards */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                      <span className="font-bold text-neutral-900 block">Memorial Cards (50 pk):</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            updated.sectionI.I1_memorialCardsType = 'plain_50';
                            updated.sectionI.I1_memorialCardsAmount = BFH_GPL_2026.stationery.memorialCardsPlain50;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                            statementData.sectionI.I1_memorialCardsType === 'plain_50'
                              ? 'bg-[#800000] text-white font-bold'
                              : 'bg-white hover:bg-neutral-100'
                          }`}
                        >
                          <div>Plain Text (50 pk)</div>
                          <div className={`font-mono text-xs ${statementData.sectionI.I1_memorialCardsType === 'plain_50' ? 'text-amber-300' : 'text-[#800000]'}`}>$145.00</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            updated.sectionI.I1_memorialCardsType = 'with_photo_50';
                            updated.sectionI.I1_memorialCardsAmount = BFH_GPL_2026.stationery.memorialCardsWithPhoto50;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                            statementData.sectionI.I1_memorialCardsType === 'with_photo_50'
                              ? 'bg-[#800000] text-white font-bold'
                              : 'bg-white hover:bg-neutral-100'
                          }`}
                        >
                          <div>With Photo (50 pk)</div>
                          <div className={`font-mono text-xs ${statementData.sectionI.I1_memorialCardsType === 'with_photo_50' ? 'text-amber-300' : 'text-[#800000]'}`}>$200.00</div>
                        </button>
                      </div>
                    </div>

                    {/* Acknowledgement & Thank You Cards */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                      <span className="font-bold text-neutral-900 block">Thank You Cards (25 pk - $20.00):</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            const newQty = Math.max(0, (statementData.sectionI.I2_acknowledgementCardsQty || 0) - 25);
                            updated.sectionI.I2_acknowledgementCardsQty = newQty;
                            updated.sectionI.I2_acknowledgementCardsAmount = (newQty / 25) * BFH_GPL_2026.stationery.stockThankYouCards25;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          step={25}
                          value={statementData.sectionI.I2_acknowledgementCardsQty === 0 ? '' : statementData.sectionI.I2_acknowledgementCardsQty}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const qty = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0);
                            const updated = { ...statementData };
                            updated.sectionI.I2_acknowledgementCardsQty = qty;
                            updated.sectionI.I2_acknowledgementCardsAmount = (qty / 25) * BFH_GPL_2026.stationery.stockThankYouCards25;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-20 p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            const newQty = (statementData.sectionI.I2_acknowledgementCardsQty || 0) + 25;
                            updated.sectionI.I2_acknowledgementCardsQty = newQty;
                            updated.sectionI.I2_acknowledgementCardsAmount = (newQty / 25) * BFH_GPL_2026.stationery.stockThankYouCards25;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                        <span className="text-neutral-500">cards = <strong className="text-[#800000] font-mono">${statementData.sectionI.I2_acknowledgementCardsAmount.toFixed(2)}</strong></span>
                      </div>
                    </div>

                  </div>

                  {/* Other Additional Services & Merchandise Section (3 Lines) */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-800 block text-xs">I. Other Additional Services &amp; Merchandise (3 Lines Available):</span>
                        <span className="text-[10px] text-neutral-500">Custom portrait canvas, digital livestream recording, bookmark keepsakes, crucifix, or specialty tribute items</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-[#800000]">
                        ${((statementData.sectionI.I_otherAmount || 0) + (statementData.sectionI.I_other2Amount || 0) + (statementData.sectionI.I_other3Amount || 0)).toFixed(2)}
                      </span>
                    </div>

                    {/* Line 1 */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-700 block">Line 1: Item Specification &amp; Dollar Value</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={statementData.sectionI.I_otherSpecify || statementData.sectionI.I12_otherSpecify || ''}
                            onChange={(e) => {
                              const updated = { ...statementData };
                              updated.sectionI.I_otherSpecify = e.target.value;
                              updated.sectionI.I12_otherSpecify = e.target.value;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            placeholder="e.g. 24x36 Framed Memorial Canvas Portrait & Easel Stand"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={(statementData.sectionI.I_otherAmount || statementData.sectionI.I12_otherAmount) === 0 ? '' : (statementData.sectionI.I_otherAmount || statementData.sectionI.I12_otherAmount)}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.I_otherAmount = val;
                                updated.sectionI.I12_otherAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Line 2 */}
                    <div className="space-y-1 pt-2 border-t border-neutral-200/80">
                      <label className="text-[11px] font-semibold text-neutral-700 block">Line 2: Item Specification &amp; Dollar Value</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={statementData.sectionI.I_other2Specify || statementData.sectionI.I12_other2Specify || ''}
                            onChange={(e) => {
                              const updated = { ...statementData };
                              updated.sectionI.I_other2Specify = e.target.value;
                              updated.sectionI.I12_other2Specify = e.target.value;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            placeholder="e.g. Laminated Prayer Bookmarks (Pack of 100)"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={(statementData.sectionI.I_other2Amount || statementData.sectionI.I12_other2Amount) === 0 ? '' : (statementData.sectionI.I_other2Amount || statementData.sectionI.I12_other2Amount)}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.I_other2Amount = val;
                                updated.sectionI.I12_other2Amount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Line 3 */}
                    <div className="space-y-1 pt-2 border-t border-neutral-200/80">
                      <label className="text-[11px] font-semibold text-neutral-700 block">Line 3: Item Specification &amp; Dollar Value</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={statementData.sectionI.I_other3Specify || statementData.sectionI.I12_other3Specify || ''}
                            onChange={(e) => {
                              const updated = { ...statementData };
                              updated.sectionI.I_other3Specify = e.target.value;
                              updated.sectionI.I12_other3Specify = e.target.value;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            placeholder="e.g. Traditional Solid Brass Crucifix / Keepsake Emblem"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={(statementData.sectionI.I_other3Amount || statementData.sectionI.I12_other3Amount) === 0 ? '' : (statementData.sectionI.I_other3Amount || statementData.sectionI.I12_other3Amount)}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.I_other3Amount = val;
                                updated.sectionI.I12_other3Amount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 3.E FACILITIES & REPAST ROOM (REPASS) */}
              {activeVariablesCategory === 'facilities_repast' && (
                <div className="space-y-6 text-xs">
                  
                  {/* Repast Room Reservation Card */}
                  <div className="bg-[#fcfbfa] p-5 rounded-2xl border-2 border-emerald-300/80 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                            🍽️
                          </span>
                          <h4 className="font-serif-title font-bold text-base text-neutral-900">
                            BFH 2nd-Floor Historic Repast Room (Repass Fellowship)
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1">
                          Private gathering room for family repast, fellowship meal, tables, linen, chairs, warming station & staff supervision.
                        </p>
                      </div>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-2xs">
                        <input
                          type="checkbox"
                          checked={statementData.sectionI.F3_repastRoomAmount > 0}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.F3_repastRoomAmount = e.target.checked ? BFH_GPL_2026.repastRoomBase : 0;
                            setStatementData(calculateAP47Totals(updated));
                            showToast(e.target.checked ? '🍽️ Added Repast Room Reservation ($1,400.00)' : 'Removed Repast Room');
                          }}
                          className="rounded text-emerald-700 focus:ring-emerald-700"
                        />
                        <span className="font-bold text-neutral-900 text-xs">
                          {statementData.sectionI.F3_repastRoomAmount > 0 ? '✓ Repast Reserved ($1,400)' : 'Include Repast Room ($1,400)'}
                        </span>
                      </label>
                    </div>

                    {statementData.sectionI.F3_repastRoomAmount > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <span className="text-[10px] text-neutral-500 block">Room Base Fee</span>
                          <strong className="font-mono text-sm text-[#800000]">${statementData.sectionI.F3_repastRoomAmount.toFixed(2)}</strong>
                          <span className="text-[10px] text-neutral-500 block">Per BFH GPL Section I.F3</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <span className="text-[10px] text-neutral-500 block">Seating Capacity</span>
                          <strong className="text-neutral-900 text-xs">Up to 80 Family Guests</strong>
                          <span className="text-[10px] text-neutral-500 block">Round tables & banquet buffet</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <span className="text-[10px] text-neutral-500 block">Catering / Staff Coordination</span>
                          <strong className="text-neutral-900 text-xs">Hostess / Setup Included</strong>
                          <span className="text-[10px] text-neutral-500 block">Food warming & post-event cleanup</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chapel & Visitation Facilities Breakdown */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-200 pb-3 gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">
                          Chapel Gathering, Ceremony &amp; Staff Supervision Allocation
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Manage facility usage and licensed staff supervision line items for visitations, wakes, funeral ceremonies, and memorial services.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#800000] bg-red-50 border border-red-200 px-3 py-1 rounded-lg shrink-0">
                        <span>Combined Subtotal:</span>
                        <span>
                          ${(
                            (statementData.sectionI.F1_facilitiesVisitationAmount || 0) +
                            (statementData.sectionI.E1_supervisionVisitationAmount || 0) +
                            (statementData.sectionI.F2_facilitiesFuneralServiceAmount || 0) +
                            (statementData.sectionI.E2_supervisionFuneralServiceAmount || 0) +
                            (statementData.sectionI.F3_facilitiesMemorialServiceAmount || 0) +
                            (statementData.sectionI.E3_supervisionMemorialAmount || 0) +
                            (statementData.sectionI.E3_otherSupervisionAmount || 0) +
                            (statementData.sectionI.E_otherAmount || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* 1. Visitation / Viewing Facilities */}
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-900 text-xs">Visitation / Viewing Facilities</strong>
                          <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionI.F1_facilitiesVisitationAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Use of funeral home viewing parlor / chapel facilities for family viewing, wake, or public visitation gathering.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={statementData.sectionI.F1_facilitiesVisitationAmount === 0 ? '' : statementData.sectionI.F1_facilitiesVisitationAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.F1_facilitiesVisitationAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-28 p-1.5 bg-white border border-neutral-300 rounded font-mono font-bold text-[#800000] text-xs"
                            />
                            <span className="text-[10px] text-neutral-500">Facility ($)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.F1_facilitiesVisitationAmount = BFH_GPL_2026.facilitiesVisitation || 550;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                          >
                            Set $550 GPL
                          </button>
                        </div>
                      </div>

                      {/* 2. Supervision for Visitation / Viewing */}
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-900 text-xs">Supervision for Visitation / Viewing</strong>
                          <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionI.E1_supervisionVisitationAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Licensed Funeral Director supervision and staff ushering during viewings, wakes, or visitations.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={statementData.sectionI.E1_supervisionVisitationAmount === 0 ? '' : statementData.sectionI.E1_supervisionVisitationAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.E1_supervisionVisitationAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-28 p-1.5 bg-white border border-neutral-300 rounded font-mono font-bold text-[#800000] text-xs"
                            />
                            <span className="text-[10px] text-neutral-500">Supervision ($)</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionI.E1_supervisionVisitationAmount = BFH_GPL_2026.supervisionVisitation || 550;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                            >
                              $550
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionI.E1_supervisionVisitationAmount = BFH_GPL_2026.supervisionVisitationAfterHours || 750;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                              title="After Hours Rate"
                            >
                              $750 (Eve)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 3. Funeral Service Facilities */}
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-900 text-xs">Funeral Service Facilities</strong>
                          <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionI.F2_facilitiesFuneralServiceAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Use of Chapel A (120 seats), Chapel B, or sanctuary facilities for funeral ceremony celebration.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={statementData.sectionI.F2_facilitiesFuneralServiceAmount === 0 ? '' : statementData.sectionI.F2_facilitiesFuneralServiceAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.F2_facilitiesFuneralServiceAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-28 p-1.5 bg-white border border-neutral-300 rounded font-mono font-bold text-[#800000] text-xs"
                            />
                            <span className="text-[10px] text-neutral-500">Facility ($)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.F2_facilitiesFuneralServiceAmount = BFH_GPL_2026.facilitiesFuneralService || 550;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                          >
                            Set $550 GPL
                          </button>
                        </div>
                      </div>

                      {/* 4. Supervision for Funeral Service */}
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-900 text-xs">Supervision for Funeral Service</strong>
                          <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionI.E2_supervisionFuneralServiceAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Licensed Funeral Director supervision and ceremonial staff direction for funeral service.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={statementData.sectionI.E2_supervisionFuneralServiceAmount === 0 ? '' : statementData.sectionI.E2_supervisionFuneralServiceAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.E2_supervisionFuneralServiceAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-28 p-1.5 bg-white border border-neutral-300 rounded font-mono font-bold text-[#800000] text-xs"
                            />
                            <span className="text-[10px] text-neutral-500">Supervision ($)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.E2_supervisionFuneralServiceAmount = BFH_GPL_2026.supervisionFuneralService || 550;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                          >
                            Set $550 GPL
                          </button>
                        </div>
                      </div>

                      {/* 5. Memorial Service Facilities */}
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-900 text-xs">Memorial Service Facilities (Chapel)</strong>
                          <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionI.F3_facilitiesMemorialServiceAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Use of Chapel A (120 seats) or Chapel B (110 seats) for memorial service celebration.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={statementData.sectionI.F3_facilitiesMemorialServiceAmount === 0 ? '' : statementData.sectionI.F3_facilitiesMemorialServiceAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.F3_facilitiesMemorialServiceAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-28 p-1.5 bg-white border border-neutral-300 rounded font-mono font-bold text-[#800000] text-xs"
                            />
                            <span className="text-[10px] text-neutral-500">Facility ($)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.F3_facilitiesMemorialServiceAmount = BFH_GPL_2026.facilitiesMemorialService || 550;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                          >
                            Set $550 GPL
                          </button>
                        </div>
                      </div>

                      {/* 6. Memorial Service Staff Supervision */}
                      <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-900 text-xs">Supervision for Memorial Service</strong>
                          <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionI.E3_supervisionMemorialAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Licensed Funeral Director supervision and staff ushering for memorial service.
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={statementData.sectionI.E3_supervisionMemorialAmount === 0 ? '' : statementData.sectionI.E3_supervisionMemorialAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionI.E3_supervisionMemorialAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-28 p-1.5 bg-white border border-neutral-300 rounded font-mono font-bold text-[#800000] text-xs"
                            />
                            <span className="text-[10px] text-neutral-500">Supervision ($)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...statementData };
                              updated.sectionI.E3_supervisionMemorialAmount = BFH_GPL_2026.supervisionMemorialService || 550;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="px-2 py-0.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[10px] text-neutral-600 font-mono"
                          >
                            Set $550 GPL
                          </button>
                        </div>
                      </div>

                      {/* 7. Additional Staff Supervision (Services, Wakes or Viewings) */}
                      <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2 sm:col-span-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-800 font-bold text-xs">✨ Additional Staff Supervision</span>
                            <span className="text-[10px] text-amber-900 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded font-medium">Services, Wakes &amp; Viewings Service Line Item</span>
                          </div>
                          <span className="font-mono font-bold text-xs text-[#800000]">
                            ${((statementData.sectionI.E3_otherSupervisionAmount || 0) + (statementData.sectionI.E_otherAmount || 0)).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600">
                          Professional staff supervision service offered by staff when conducting services, wakes, or viewings.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={statementData.sectionI.E3_otherSupervisionSpecify || statementData.sectionI.E_otherSpecify || ''}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.E3_otherSupervisionSpecify = e.target.value;
                                updated.sectionI.E_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              placeholder="e.g. Additional Staff Supervision for Evening Wake &amp; Viewing"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={((statementData.sectionI.E3_otherSupervisionAmount || 0) + (statementData.sectionI.E_otherAmount || 0)) === 0 ? '' : ((statementData.sectionI.E3_otherSupervisionAmount || 0) + (statementData.sectionI.E_otherAmount || 0))}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.E3_otherSupervisionAmount = val;
                                  updated.sectionI.E_otherAmount = val;
                                  if (!updated.sectionI.E3_otherSupervisionSpecify) {
                                    updated.sectionI.E3_otherSupervisionSpecify = 'Additional Staff Supervision for Wake / Viewing / Service';
                                    updated.sectionI.E_otherSpecify = 'Additional Staff Supervision for Wake / Viewing / Service';
                                  }
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-neutral-500 font-medium">Quick Presets:</span>
                          {[
                            { label: 'Wake Staff Supervision ($350)', amt: 350, desc: 'Staff Supervision for Wake & Viewing' },
                            { label: 'Evening Viewing Supervision ($450)', amt: 450, desc: 'Evening Viewing Staff Supervision' },
                            { label: 'Sanctuary Service Supervision ($550)', amt: 550, desc: 'Offsite Sanctuary Service Staff Supervision' }
                          ].map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionI.E3_otherSupervisionAmount = p.amt;
                                updated.sectionI.E_otherAmount = p.amt;
                                updated.sectionI.E3_otherSupervisionSpecify = p.desc;
                                updated.sectionI.E_otherSpecify = p.desc;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="px-2 py-0.5 bg-white border border-brass-300 hover:bg-brass-100 rounded text-[10px] text-brass-900 font-medium"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Other Facilities Section */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3">
                    <div>
                      <span className="font-bold text-neutral-800 block text-xs">F. Other Facilities:</span>
                      <span className="text-[10px] text-neutral-500">Additional visitation parlor hours, family hospitality suite, overflow sanctuary audio-visual room, or special accommodation</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={statementData.sectionI.F_otherSpecify || statementData.sectionI.F3_otherFacilitiesSpecify || ''}
                          onChange={(e) => {
                            const updated = { ...statementData };
                            updated.sectionI.F_otherSpecify = e.target.value;
                            updated.sectionI.F3_otherFacilitiesSpecify = e.target.value;
                            setStatementData(calculateAP47Totals(updated));
                          }}
                          placeholder="e.g. Additional 2-Hour Evening Parlor Viewing Block"
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(statementData.sectionI.F_otherAmount || statementData.sectionI.F3_otherFacilitiesAmount) === 0 ? '' : (statementData.sectionI.F_otherAmount || statementData.sectionI.F3_otherFacilitiesAmount)}
                            placeholder="0.00"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                              const updated = { ...statementData };
                              updated.sectionI.F_otherAmount = val;
                              updated.sectionI.F3_otherFacilitiesAmount = val;
                              setStatementData(calculateAP47Totals(updated));
                            }}
                            className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 3.F CASH ADVANCES & PASS-THROUGH AP CHECKS GENERATOR */}
              {activeVariablesCategory === 'cash_advances' && (
                <div className="space-y-4 text-xs">
                  
                  {/* Executive Pass-Through Check Generator Banner */}
                  <div className="bg-gradient-to-r from-[#1c1a1a] via-[#241f1a] to-[#1c1a1a] text-white p-4 rounded-2xl border-2 border-amber-400/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#800000] text-white flex items-center justify-center font-bold shadow border border-amber-300">
                        <HandCoins className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            100% PASS-THROUGH • 0% MARKUP
                          </span>
                          <span className="text-xs text-neutral-300 font-mono">
                            10 NYCRR § 77.8 Compliance
                          </span>
                        </div>
                        <h4 className="font-serif-title text-sm sm:text-base font-bold text-white tracking-wide">
                          Accounts Payable Pass-Through Check Generator
                        </h4>
                        <p className="text-[11px] text-neutral-300">
                          Disbursements paid to third-party vendors on family's behalf with deceased name &amp; case # in memo.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCheckPrinterOpen(true)}
                        className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md border border-brass-400/50"
                      >
                        <Printer className="w-4 h-4 text-amber-300" />
                        <span>🖨️ Preview &amp; Print Checks (${statementData.sectionII.totalCashAdvances.toFixed(2)})</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">Cash Advance Items (Actual Third-Party Invoices)</h4>
                      <p className="text-xs text-neutral-500">Edit any pass-through item. Changes dynamically update printed checks and Form AP-47.</p>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#800000]">
                      Total Cash Advances: ${statementData.sectionII.totalCashAdvances.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-xs space-y-2.5 sm:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🏛️</span>
                          <div>
                            <label className="font-bold text-xs text-neutral-900 block">
                              1. Cemetery or Crematory Fee (Pass-Through):
                            </label>
                            <span className="text-[10px] text-neutral-500">
                              Selected Cemetery: <strong className="text-neutral-900">{statementData.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName || "The Woodlawn Cemetery & Crematory"}</strong>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsCemeteryModalOpen(true)}
                          className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5 text-amber-300" />
                          <span>Select Cemetery from Directory</span>
                        </button>
                      </div>

                      {/* Quick Fee Options for Current Cemetery */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-600 block uppercase tracking-wider">
                          Quick-Select Standard Fee Schedule for this Cemetery:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-[11px]">
                          {[
                            { label: 'Ground Burial', amount: 1850, icon: '⚰️' },
                            { label: 'Cremation Retort', amount: 475, icon: '🔥' },
                            { label: 'Witness Cremation', amount: 750, icon: '👁️' },
                            { label: 'Mausoleum Crypt', amount: 2250, icon: '🏛️' },
                            { label: 'Urn Niche', amount: 650, icon: '🏺' },
                            { label: 'VA Veteran', amount: 0, icon: '🎖️' }
                          ].map((tier) => {
                            const isSelected = statementData.sectionII.cemeteryOrCrematoryAmount === tier.amount;
                            return (
                              <button
                                key={tier.label}
                                type="button"
                                onClick={() => {
                                  const updated = { ...statementData };
                                  updated.sectionII.cemeteryOrCrematoryAmount = tier.amount;
                                  setStatementData(calculateAP47Totals(updated));
                                  showToast(`Applied ${tier.label} fee: $${tier.amount.toFixed(2)}`);
                                }}
                                className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-[#800000] text-white border-[#800000] font-bold shadow-xs'
                                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                                }`}
                              >
                                <span className="text-xs">{tier.icon}</span>
                                <span className="text-[10px] truncate">{tier.label}</span>
                                <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-amber-300' : 'text-[#800000]'}`}>
                                  {tier.amount === 0 ? '$0.00' : `$${tier.amount}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Fee Input Field */}
                      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-neutral-500 italic">
                          Payee on Pass-Through Check: <strong className="text-neutral-800">{statementData.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName || "Woodlawn Cemetery & Crematory"}</strong>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-neutral-700">Custom Invoice Amount:</span>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={statementData.sectionII.cemeteryOrCrematoryAmount === 0 ? '' : statementData.sectionII.cemeteryOrCrematoryAmount}
                              placeholder="0.00"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionII.cemeteryOrCrematoryAmount = val;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-32 pl-6 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono font-bold text-xs focus:bg-white focus:ring-2 focus:ring-[#800000] focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <label className="font-bold text-neutral-800 block">2. Clergy Honoraria / Church Fee:</label>
                      <input
                        type="number"
                        value={statementData.sectionII.clergyHonorariaAmount === 0 ? '' : statementData.sectionII.clergyHonorariaAmount}
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                          const updated = { ...statementData };
                          updated.sectionII.clergyHonorariaAmount = val;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold"
                      />
                      <p className="text-[10px] text-neutral-500 italic">Payee: {statementData.sectionII.clergyChurchName || activeCase.serviceSelections.officiantName || "Abyssinian Baptist Church / Officiant"}</p>
                    </div>

                    {/* 3. NYC Certified Death Certificate Transcripts & Veteran Exemption */}
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <label className="font-bold text-neutral-800 block">3. NYC Certified Death Certificate Transcripts ($15/ea):</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...statementData };
                            const current = updated.isVeteran || updated.sectionII.isVeteranDiscountApplied || false;
                            updated.isVeteran = !current;
                            updated.sectionII.isVeteranDiscountApplied = !current;
                            if (updated.vitalRecordsSheet) {
                              updated.vitalRecordsSheet.militaryStatus = !current ? 'veteran' : 'none';
                            }
                            setStatementData(calculateAP47Totals(updated));
                            showToast(!current ? '🎖️ Veteran Benefit: First 3 Death Certificates are Free ($0.00)' : 'Standard Pricing Applied');
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition flex items-center space-x-1 ${
                            statementData.isVeteran || statementData.sectionII.isVeteranDiscountApplied
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                          }`}
                        >
                          <span>🎖️ Veteran (3 Free Copies): {statementData.isVeteran || statementData.sectionII.isVeteranDiscountApplied ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <div className="inline-flex items-center space-x-1 bg-white border border-neutral-300 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionII.deathCertificateTranscriptsCount = Math.max(0, statementData.sectionII.deathCertificateTranscriptsCount - 1);
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-7 h-7 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={statementData.sectionII.deathCertificateTranscriptsCount === 0 ? '' : statementData.sectionII.deathCertificateTranscriptsCount}
                              placeholder="0"
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const count = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0);
                                const updated = { ...statementData };
                                updated.sectionII.deathCertificateTranscriptsCount = count;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-12 text-center font-mono font-bold text-xs bg-transparent border-none p-0 focus:ring-0 text-neutral-900"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionII.deathCertificateTranscriptsCount = statementData.sectionII.deathCertificateTranscriptsCount + 1;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="w-7 h-7 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-neutral-500 font-mono text-xs">
                            copies = <strong className="text-[#800000] font-mono">${statementData.sectionII.deathCertificateTranscriptsAmount.toFixed(2)}</strong>
                          </span>
                        </div>

                        {(statementData.isVeteran || statementData.sectionII.isVeteranDiscountApplied) && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                            {Math.min(3, statementData.sectionII.deathCertificateTranscriptsCount)} Free VA Copies + {Math.max(0, statementData.sectionII.deathCertificateTranscriptsCount - 3)} Billable (${statementData.sectionII.deathCertificateTranscriptsAmount.toFixed(2)})
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 italic">Payee: NYC Dept. of Health &amp; Mental Hygiene (DOHMH)</p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <label className="font-bold text-neutral-800 block">4. Organist / Musician Accompaniment:</label>
                      <input
                        type="number"
                        value={statementData.sectionII.organistMusicianAmount === 0 ? '' : statementData.sectionII.organistMusicianAmount}
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                          const updated = { ...statementData };
                          updated.sectionII.organistMusicianAmount = val;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold"
                      />
                      <p className="text-[10px] text-neutral-500 italic">Payee: {statementData.sectionII.organistMusicianName || activeCase.serviceSelections.organistName || "Sanctuary Organist & Musician"}</p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-neutral-800 block">5. Pallbearers (Professional Crew):</label>
                        <div className="flex items-center space-x-1">
                          {[
                            { count: 0, amount: 0, label: '0' },
                            { count: 4, amount: 500, label: '4 ($500)' },
                            { count: 6, amount: 750, label: '6 ($750)' },
                            { count: 8, amount: 1000, label: '8 ($1k)' }
                          ].map(tier => (
                            <button
                              key={tier.label}
                              type="button"
                              onClick={() => {
                                const updated = { ...statementData };
                                updated.sectionII.pallbearersCount = tier.count;
                                updated.sectionII.pallbearersAmount = tier.amount;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                                statementData.sectionII.pallbearersAmount === tier.amount
                                  ? 'bg-[#800000] text-white shadow-xs'
                                  : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                              }`}
                            >
                              {tier.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        value={statementData.sectionII.pallbearersAmount === 0 ? '' : statementData.sectionII.pallbearersAmount}
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                          const updated = { ...statementData };
                          updated.sectionII.pallbearersAmount = val;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold"
                      />
                      <p className="text-[10px] text-neutral-500 italic">Payee: Harlem Professional Pallbearers Guild</p>
                    </div>

                    {/* 6. Bridge & Road Tolls (Separated) */}
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-neutral-800 block">6. Bridge &amp; Road Tolls (Pass-Through):</label>
                        <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionII.bridgeAndRoadTollsAmount.toFixed(2)}</span>
                      </div>
                      <input
                        type="number"
                        value={statementData.sectionII.bridgeAndRoadTollsAmount === 0 ? '' : statementData.sectionII.bridgeAndRoadTollsAmount}
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                          const updated = { ...statementData };
                          updated.sectionII.bridgeAndRoadTollsAmount = val;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold"
                      />
                      <p className="text-[10px] text-neutral-500 italic">Payee: MTA Bridges &amp; Tunnels / Port Authority Tolls Pool</p>
                    </div>

                    {/* 7. Livery Chauffeur & Staff Gratuities (Separated) */}
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-neutral-800 block">7. Livery Chauffeur &amp; Staff Gratuities:</label>
                        <span className="font-mono font-bold text-xs text-[#800000]">${statementData.sectionII.gratuitiesLiveryAndStaffAmount.toFixed(2)}</span>
                      </div>
                      <input
                        type="number"
                        value={statementData.sectionII.gratuitiesLiveryAndStaffAmount === 0 ? '' : statementData.sectionII.gratuitiesLiveryAndStaffAmount}
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                          const updated = { ...statementData };
                          updated.sectionII.gratuitiesLiveryAndStaffAmount = val;
                          setStatementData(calculateAP47Totals(updated));
                        }}
                        className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold"
                      />
                      <p className="text-[10px] text-neutral-500 italic">Payee: BFH Livery &amp; Chauffeur Gratuities Pool</p>
                    </div>

                    {/* 8. Other Cash Advances (3 Lines) */}
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 sm:col-span-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="font-bold text-neutral-800 block text-xs">8. Other Cash Advances (3 Dedicated Lines):</label>
                          <span className="text-[10px] text-neutral-500">Disbursed at actual third-party billing (100% pass-through, 0% markup)</span>
                        </div>
                        <span className="font-mono font-bold text-xs text-[#800000]">
                          ${((statementData.sectionII.otherCashAdvanceAmount || 0) + (statementData.sectionII.otherCashAdvance2Amount || 0) + (statementData.sectionII.otherCashAdvance3Amount || 0)).toFixed(2)}
                        </span>
                      </div>

                      {/* Line 1 */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-700 block">Line 1: Item Specification &amp; Dollar Value</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={statementData.sectionII.otherCashAdvanceSpecify || ''}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionII.otherCashAdvanceSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              placeholder="Specify other cash advance (e.g. Consular legalizations, apostille fee)..."
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionII.otherCashAdvanceAmount === 0 ? '' : statementData.sectionII.otherCashAdvanceAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionII.otherCashAdvanceAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Line 2 */}
                      <div className="space-y-1 pt-2 border-t border-neutral-200/80">
                        <label className="text-[11px] font-semibold text-neutral-700 block">Line 2: Item Specification &amp; Dollar Value</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={statementData.sectionII.otherCashAdvance2Specify || ''}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionII.otherCashAdvance2Specify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              placeholder="Specify other cash advance (e.g. Cemetery weekend/late vault surcharge)..."
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionII.otherCashAdvance2Amount === 0 ? '' : statementData.sectionII.otherCashAdvance2Amount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionII.otherCashAdvance2Amount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Line 3 */}
                      <div className="space-y-1 pt-2 border-t border-neutral-200/80">
                        <label className="text-[11px] font-semibold text-neutral-700 block">Line 3: Item Specification &amp; Dollar Value</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={statementData.sectionII.otherCashAdvance3Specify || ''}
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionII.otherCashAdvance3Specify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              placeholder="Specify other cash advance (e.g. Newspaper obituary publication fee)..."
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionII.otherCashAdvance3Amount === 0 ? '' : statementData.sectionII.otherCashAdvance3Amount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionII.otherCashAdvance3Amount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Cash Advances List */}
                  {(statementData.sectionII.customCashAdvances || []).length > 0 && (
                    <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold">
                          <tr>
                            <th className="p-3">Cash Advance Description</th>
                            <th className="p-3 text-right">Amount ($)</th>
                            <th className="p-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {statementData.sectionII.customCashAdvances.map((c) => (
                            <tr key={c.id} className="hover:bg-neutral-50">
                              <td className="p-3 font-semibold text-neutral-900">{c.description}</td>
                              <td className="p-3 text-right font-mono font-bold text-amber-700">${c.amount.toFixed(2)}</td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomCashAdvance(c.id)}
                                  className="p-1 text-neutral-400 hover:text-[#800000]"
                                  title="Remove cash advance item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Custom Cash Advance Builder */}
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                    <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#800000]" />
                      <span>Add Other Specific Cash Advance:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newCashAdvDesc}
                          onChange={(e) => setNewCashAdvDesc(e.target.value)}
                          placeholder="e.g. Consular Document Certification or Church Sexton Fee"
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={newCashAdvAmount === 0 ? '' : newCashAdvAmount}
                          placeholder="Amount ($)"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => setNewCashAdvAmount(e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold text-[#800000]"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomCashAdvance}
                      className="px-4 py-2 bg-[#800000] hover:bg-[#6a0509] text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      + Add Cash Advance
                    </button>
                  </div>

                  {/* Live Generated Checks Ledger Summary Box */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <HandCoins className="w-4 h-4 text-[#800000]" />
                        <span className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                          Auto-Generated Check Vouchers for Date of Service:
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCheckPrinterOpen(true)}
                        className="text-xs text-[#800000] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Open 3-Part Voucher Printer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-700 space-y-1">
                      <p>
                        • <strong>Memo format on each check:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[10px] text-[#800000]">{activeCase.decedent.legalName} • Case #{activeCase.caseNumber} • Svc Date: {statementData.agreementDate || '09/24/2026'}</code>
                      </p>
                      <p>
                        • <strong>Bank account:</strong> JPMorgan Chase Operating Pass-Through (**4892)
                      </p>
                      <p>
                        • <strong>Staff time saved:</strong> Automated drafting eliminates manual check writing and ensures 100% accurate delivery stubs at cemetery/church on the day of service.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Step 3 Navigation Bar */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Back to Step 2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-red-950/20"
                >
                  <span>Proceed to Step 4: Live Official Form AP-47 Contract Preview</span>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 4: LIVE OFFICIAL 2-PAGE FORM AP-47 CONTRACT PREVIEW */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Screen-Only Action Strip (Hidden in Print) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 print:hidden contract-studio-verification-banner no-print">
                <div className="flex items-center space-x-2 text-xs text-neutral-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="font-semibold text-neutral-700">Official NYS Form AP-47 Contract View</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyContractSummary}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-xl font-bold transition flex items-center space-x-1 cursor-pointer text-xs shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintContract}
                    className="px-3.5 py-1.5 bg-[#800000] hover:bg-[#6a0509] text-white rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs shadow-xs border border-amber-400/40"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Print 2-Page Contract</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToGoldenRecord}
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Save & Sync</span>
                  </button>
                </div>
              </div>

              {/* RENDERED FORM AP-47 DOCUMENT CANVAS */}
              <div 
                id="official-form-ap47-contract"
                className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-neutral-400 shadow-2xl text-neutral-900 space-y-6 text-xs font-sans print:p-0 print:border-none print:shadow-none print:rounded-none print:m-0 print:w-full print:space-y-4"
              >
                
                {/* ----------------- PAGE 1 ----------------- */}
                <div className="space-y-4 pb-8 border-b-2 border-neutral-900 print:pb-0 print:border-b-0 print:space-y-3">
                  
                  {/* Page 1 Header */}
                  <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-3">
                    <div className="space-y-0.5">
                      <div className="font-serif-title italic font-bold text-lg text-neutral-800">
                        "A Celebration of Life"
                      </div>
                      <h2 className="font-serif-title font-bold text-2xl text-[#800000] tracking-wider">
                        Benta's Funeral Home, Inc.
                      </h2>
                      <p className="text-[11px] text-neutral-600">
                        630 St. Nicholas Avenue (Corner of W. 141st Street) • New York, NY 10030 • (212) 281-8850-1-2-3
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs space-y-1">
                      <div>Number: <strong>{statementData.invoiceNumber}</strong></div>
                      <div>Date: <strong>{statementData.agreementDate}</strong></div>
                    </div>
                  </div>

                  {/* Deceased Metadata Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-300 text-[11px] print-grid-cols-4 print:grid-cols-4">
                    <div><span className="text-neutral-500 block text-[9px]">Name of Deceased:</span> <strong>{activeCase.decedent.legalName}</strong></div>
                    <div><span className="text-neutral-500 block text-[9px]">Date of Death:</span> <strong>{activeCase.decedent.dateOfDeath}</strong></div>
                    <div><span className="text-neutral-500 block text-[9px]">Place of Death:</span> <strong>{activeCase.decedent.facilityName || 'Mount Sinai Morningside'}</strong></div>
                    <div>
                      <span className="text-neutral-500 block text-[9px]">Invoice To:</span>
                      <strong>{activeCase.informant.fullName} (NOK)</strong>
                      <span className="block text-[8px] text-neutral-600 font-medium">Terms: All funds due 48 hours prior to service</span>
                    </div>
                  </div>

                  <div className="text-center font-bold text-xs uppercase tracking-wider font-serif-title text-neutral-900 py-1 bg-neutral-100 rounded">
                    ITEMIZATION OF FUNERAL SERVICES AND MERCHANDISE SELECTED
                  </div>

                  <p className="text-[10px] text-neutral-600 italic">
                    The following are the charges for the services, merchandise, and livery you have selected. You will not be charged for any item you do not choose unless it is necessary because of other selections you have made. Any such charges are explained below.
                  </p>

                  {/* SECTION I: FUNERAL HOME CHARGES (2-Column Layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] border-t border-neutral-300 pt-3 print-grid-cols-2 print:grid-cols-2 print:gap-5">
                    
                    {/* Left Column (A through E) */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-xs uppercase text-[#800000] border-b border-neutral-200 pb-1">
                        I. FUNERAL HOME CHARGES
                      </h5>

                      {/* A. Alternative Services */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">A. Alternative Services:</span>
                          <strong className="font-mono">
                            {statementData.sectionI.A_alternativeServicesAmount > 0 
                              ? `$${statementData.sectionI.A_alternativeServicesAmount.toFixed(2)}` 
                              : 'N/A'}
                          </strong>
                        </div>
                        {/* A. Other Alternative Services */}
                        {Boolean(statementData.sectionI.A_otherSpecify?.trim() || (statementData.sectionI.A_otherAmount || 0) > 0) && (
                          <div className="hidden print:flex justify-between items-center text-[10px] text-neutral-800 pt-1 border-t border-dashed border-neutral-200">
                            <span>• Other: {statementData.sectionI.A_otherSpecify || 'Alternative Service'}</span>
                            <span className="font-mono">${Number(statementData.sectionI.A_otherAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-1 print:hidden no-print">
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">A. Other Alternative Services:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.A_otherSpecify || ''}
                              placeholder="Specify other alternative service..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.A_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionI.A_otherAmount === 0 ? '' : statementData.sectionI.A_otherAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.A_otherAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* B. Transfer of Remains */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">B. Transfer of remains to funeral establishment:</span>
                          <strong className="font-mono">${statementData.sectionI.B_transferOfRemainsAmount.toFixed(2)}</strong>
                        </div>
                        {Boolean(statementData.sectionI.B_otherSpecify?.trim() || (statementData.sectionI.B_otherAmount || 0) > 0) && (
                          <div className="hidden print:flex justify-between items-center text-[10px] text-neutral-800 pt-1 border-t border-dashed border-neutral-200">
                            <span>• Extra Mileage / Special Transfer: {statementData.sectionI.B_otherSpecify || 'Transfer'}</span>
                            <span className="font-mono">${Number(statementData.sectionI.B_otherAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-1 print:hidden no-print">
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">B. Other Transfer / Extra Mileage:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.B_otherSpecify || ''}
                              placeholder="Specify other transfer / excess mileage..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.B_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionI.B_otherAmount === 0 ? '' : statementData.sectionI.B_otherAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.B_otherAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* C. Preparation of Remains */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">C. Preparation of Remains:</span>
                        </div>
                        <div className="pl-3 space-y-1 text-neutral-700 text-[10px]">
                          <div className="flex justify-between">
                            <span>1. Embalming (including use of prep room):</span>
                            <span className="font-mono font-semibold">${statementData.sectionI.C1_embalmingAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium text-neutral-800">
                            <span>2. Other Preparation:</span>
                          </div>
                          <div className="pl-3 space-y-0.5 text-neutral-600">
                            <div className="flex justify-between">
                              <span>a. Topical Disinfection:</span>
                              <span className="font-mono">${statementData.sectionI.C2_topicalDisinfectionAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>b. Custodial Care:</span>
                              <span className="font-mono">${statementData.sectionI.C2_custodialCareAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>c. Dressing/Casketing:</span>
                              <span className="font-mono">${statementData.sectionI.C2_dressingCasketingAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>d. Cosmetology:</span>
                              <span className="font-mono">${statementData.sectionI.C2_cosmetologyAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>e. Restoration / Anatomical Repair:</span>
                              <span className="font-mono">${statementData.sectionI.C2_restorationAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`pt-1.5 border-t border-dashed border-neutral-200 space-y-1 ${(!statementData.sectionI.C_otherSpecify && !statementData.sectionI.C2_otherSpecify && !statementData.sectionI.C_otherAmount && !statementData.sectionI.C2_otherAmount) ? 'print:hidden' : ''}`}>
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">C. Other Preparation:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.C_otherSpecify || statementData.sectionI.C2_otherSpecify || ''}
                              placeholder="Specify other preparation..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.C_otherSpecify = e.target.value;
                                updated.sectionI.C2_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={(statementData.sectionI.C_otherAmount || statementData.sectionI.C2_otherAmount) === 0 ? '' : (statementData.sectionI.C_otherAmount || statementData.sectionI.C2_otherAmount)}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.C_otherAmount = val;
                                  updated.sectionI.C2_otherAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* D. Arrangements */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="max-w-[70%]">
                            <span className="font-semibold text-neutral-800">D. Arrangements:</span>
                            <p className="text-[9px] text-neutral-500 leading-tight mt-0.5">
                              Basic arrangements: funeral director, staff, equipment, authorizations & coordination.
                            </p>
                          </div>
                          <strong className="font-mono">${statementData.sectionI.D_basicArrangementsAmount.toFixed(2)}</strong>
                        </div>
                        <div className={`pt-1.5 border-t border-dashed border-neutral-200 space-y-1 ${(!statementData.sectionI.D_otherSpecify && !statementData.sectionI.D_otherAmount) ? 'print:hidden' : ''}`}>
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">D. Other Arrangements / Consultation:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.D_otherSpecify || ''}
                              placeholder="Specify other arrangement service..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.D_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionI.D_otherAmount === 0 ? '' : statementData.sectionI.D_otherAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.D_otherAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* E. Supervision */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">E. Supervision (director and staff):</span>
                        </div>
                        <div className="pl-3 space-y-0.5 text-[10px] text-neutral-700">
                          <div className="flex justify-between">
                            <span>1. Supervision for visitation:</span>
                            <span className="font-mono">${statementData.sectionI.E1_supervisionVisitationAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>2. Supervision for funeral service:</span>
                            <span className="font-mono">${statementData.sectionI.E2_supervisionFuneralServiceAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>3. Supervision at Cemetery / Crematory:</span>
                            <span className="font-mono">${statementData.sectionI.E3_supervisionCemeteryCrematoryAmount.toFixed(2)}</span>
                          </div>
                          {statementData.sectionI.E3_supervisionMemorialAmount > 0 && (
                            <div className="flex justify-between">
                              <span>4. Supervision for Memorial Service:</span>
                              <span className="font-mono">${statementData.sectionI.E3_supervisionMemorialAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        <div className={`pt-1.5 border-t border-dashed border-neutral-200 space-y-1 ${(!statementData.sectionI.E_otherSpecify && !statementData.sectionI.E3_otherSupervisionSpecify && !statementData.sectionI.E_otherAmount && !statementData.sectionI.E3_otherSupervisionAmount) ? 'print:hidden' : ''}`}>
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">E. Other Supervision:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.E_otherSpecify || statementData.sectionI.E3_otherSupervisionSpecify || ''}
                              placeholder="Specify other supervision..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.E_otherSpecify = e.target.value;
                                updated.sectionI.E3_otherSupervisionSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={(statementData.sectionI.E_otherAmount || statementData.sectionI.E3_otherSupervisionAmount) === 0 ? '' : (statementData.sectionI.E_otherAmount || statementData.sectionI.E3_otherSupervisionAmount)}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.E_otherAmount = val;
                                  updated.sectionI.E3_otherSupervisionAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column (F through J) */}
                    <div className="space-y-3">
                      
                      {/* F. Use of Facilities */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">F. Use of the facilities:</span>
                        </div>
                        <div className="pl-3 space-y-0.5 text-[10px] text-neutral-700">
                          <div className="flex justify-between">
                            <span>1. Facilities for visitation:</span>
                            <span className="font-mono">${statementData.sectionI.F1_facilitiesVisitationAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>2. Facilities for funeral service:</span>
                            <span className="font-mono">${statementData.sectionI.F2_facilitiesFuneralServiceAmount.toFixed(2)}</span>
                          </div>
                          {statementData.sectionI.F3_repastRoomAmount > 0 && (
                            <div className="flex justify-between">
                              <span>3. Repast Gathering Room:</span>
                              <span className="font-mono">${statementData.sectionI.F3_repastRoomAmount.toFixed(2)}</span>
                            </div>
                          )}
                          {statementData.sectionI.F3_facilitiesMemorialServiceAmount > 0 && (
                            <div className="flex justify-between">
                              <span>4. Facilities for Memorial Service:</span>
                              <span className="font-mono">${statementData.sectionI.F3_facilitiesMemorialServiceAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        {/* F. Other Facilities */}
                        {Boolean((statementData.sectionI.F_otherSpecify || statementData.sectionI.F3_otherFacilitiesSpecify)?.trim() || (statementData.sectionI.F_otherAmount || statementData.sectionI.F3_otherFacilitiesAmount || 0) > 0) && (
                          <div className="hidden print:flex justify-between items-center text-[10px] text-neutral-800 pt-1 border-t border-dashed border-neutral-200">
                            <span>• Other Facilities: {statementData.sectionI.F_otherSpecify || statementData.sectionI.F3_otherFacilitiesSpecify || 'Special Facility'}</span>
                            <span className="font-mono">${Number(statementData.sectionI.F_otherAmount || statementData.sectionI.F3_otherFacilitiesAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-1 print:hidden no-print">
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">F. Other Facilities:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.F_otherSpecify || statementData.sectionI.F3_otherFacilitiesSpecify || ''}
                              placeholder="Specify other facilities..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.F_otherSpecify = e.target.value;
                                updated.sectionI.F3_otherFacilitiesSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={(statementData.sectionI.F_otherAmount || statementData.sectionI.F3_otherFacilitiesAmount) === 0 ? '' : (statementData.sectionI.F_otherAmount || statementData.sectionI.F3_otherFacilitiesAmount)}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.F_otherAmount = val;
                                  updated.sectionI.F3_otherFacilitiesAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* G. Livery */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">G. Livery:</span>
                          <strong className="font-mono">${statementData.sectionI.G_totalLiveryAmount.toFixed(2)}</strong>
                        </div>
                        <div className="pl-3 space-y-0.5 text-[10px] text-neutral-700">
                          {(statementData.sectionI.G_vehicles || []).map((v, i) => (
                            <div key={i} className="flex justify-between">
                              <span>• {v.vehicleType} ({v.count}x):</span>
                              <span className="font-mono">${(v.count * v.unitPrice).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {Boolean(statementData.sectionI.G_otherSpecify?.trim() || (statementData.sectionI.G_otherAmount || 0) > 0) && (
                          <div className="hidden print:flex justify-between items-center text-[10px] text-neutral-800 pt-1 border-t border-dashed border-neutral-200">
                            <span>• Other Livery: {statementData.sectionI.G_otherSpecify || 'Special Livery'}</span>
                            <span className="font-mono">${Number(statementData.sectionI.G_otherAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-1 print:hidden no-print">
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">G. Other Livery / Special Transportation:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.G_otherSpecify || ''}
                              placeholder="Specify other livery / transportation..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.G_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionI.G_otherAmount === 0 ? '' : statementData.sectionI.G_otherAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.G_otherAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* H. Merchandise */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">H. Merchandise:</span>
                        </div>
                        <div className="pl-3 space-y-0.5 text-[10px] text-neutral-700">
                          <div className="flex justify-between">
                            <span>1. Casket / Container ({statementData.sectionI.H1_casketModelNameOrNumber || 'Selected'}):</span>
                            <span className="font-mono">${statementData.sectionI.H1_casketAmount.toFixed(2)}</span>
                          </div>
                          {statementData.sectionI.H2_outerReceptacleSelected && (
                            <div className="flex justify-between">
                              <span>2. Outer Receptacle ({statementData.sectionI.H2_outerReceptacleModelName}):</span>
                              <span className="font-mono">${statementData.sectionI.H2_outerReceptacleAmount.toFixed(2)}</span>
                            </div>
                          )}
                          {statementData.sectionI.H3_urnSelected && (
                            <div className="flex justify-between">
                              <span>3. Urn ({statementData.sectionI.H3_urnModelName}):</span>
                              <span className="font-mono">${statementData.sectionI.H3_urnAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        {/* H. Other Merchandise */}
                        {Boolean(statementData.sectionI.H_otherSpecify?.trim() || (statementData.sectionI.H_otherAmount || 0) > 0) && (
                          <div className="hidden print:flex justify-between items-center text-[10px] text-neutral-700 pt-1 border-t border-dashed border-neutral-200">
                            <span>• Other: {statementData.sectionI.H_otherSpecify || 'Merchandise Item'}</span>
                            <span className="font-mono">${Number(statementData.sectionI.H_otherAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-1 print:hidden no-print">
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">H. Other Merchandise:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={statementData.sectionI.H_otherSpecify || ''}
                              placeholder="Specify other merchandise..."
                              onChange={(e) => {
                                const updated = { ...statementData };
                                updated.sectionI.H_otherSpecify = e.target.value;
                                setStatementData(calculateAP47Totals(updated));
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                            />
                            <div className="relative w-28 shrink-0">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={statementData.sectionI.H_otherAmount === 0 ? '' : statementData.sectionI.H_otherAmount}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                  const updated = { ...statementData };
                                  updated.sectionI.H_otherAmount = val;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* I. Additional Services and Merchandise */}
                      <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-neutral-800">I. Additional Services & Merchandise:</span>
                        </div>
                        <div className="pl-3 space-y-0.5 text-[10px] text-neutral-700">
                          <div className="flex justify-between">
                            <span>• Memorial / Prayer Cards ({statementData.sectionI.I1_memorialCardsQty}x):</span>
                            <span className="font-mono">${statementData.sectionI.I1_memorialCardsAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>• Printed Programs ({statementData.sectionI.I10_programsMatrix.quantity}x):</span>
                            <span className="font-mono">${statementData.sectionI.I10_programsMatrix.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>• Floral Arrangements ({statementData.sectionI.I6_flowerItems.length} items):</span>
                            <span className="font-mono">${statementData.sectionI.I6_totalFlowersAmount.toFixed(2)}</span>
                          </div>
                          {statementData.sectionI.I8_registerBookAmount > 0 && (
                            <div className="flex justify-between">
                              <span>• Register Books ({statementData.sectionI.I8_registerBookQty || 1}x @ ${(statementData.sectionI.I8_registerBookUnitPrice || 50).toFixed(2)}):</span>
                              <span className="font-mono">${statementData.sectionI.I8_registerBookAmount.toFixed(2)}</span>
                            </div>
                          )}
                          {statementData.sectionI.I11_videoTributeAmount > 0 && (
                            <div className="flex justify-between">
                              <span>• Digital Video Tribute Production:</span>
                              <span className="font-mono">${statementData.sectionI.I11_videoTributeAmount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        {/* Print View of Filled Other Additional Items */}
                        {(Boolean(statementData.sectionI.I_otherSpecify?.trim() || (statementData.sectionI.I_otherAmount || 0) > 0) ||
                          Boolean(statementData.sectionI.I_other2Specify?.trim() || (statementData.sectionI.I_other2Amount || 0) > 0) ||
                          Boolean(statementData.sectionI.I_other3Specify?.trim() || (statementData.sectionI.I_other3Amount || 0) > 0)) && (
                          <div className="hidden print:block pt-1 border-t border-dashed border-neutral-200 space-y-0.5 text-[10px] text-neutral-700">
                            {Boolean(statementData.sectionI.I_otherSpecify?.trim() || (statementData.sectionI.I_otherAmount || 0) > 0) && (
                              <div className="flex justify-between">
                                <span>• {statementData.sectionI.I_otherSpecify || statementData.sectionI.I12_otherSpecify || 'Additional Item 1'}:</span>
                                <span className="font-mono">${Number(statementData.sectionI.I_otherAmount || statementData.sectionI.I12_otherAmount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            {Boolean(statementData.sectionI.I_other2Specify?.trim() || (statementData.sectionI.I_other2Amount || 0) > 0) && (
                              <div className="flex justify-between">
                                <span>• {statementData.sectionI.I_other2Specify || statementData.sectionI.I12_other2Specify || 'Additional Item 2'}:</span>
                                <span className="font-mono">${Number(statementData.sectionI.I_other2Amount || statementData.sectionI.I12_other2Amount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            {Boolean(statementData.sectionI.I_other3Specify?.trim() || (statementData.sectionI.I_other3Amount || 0) > 0) && (
                              <div className="flex justify-between">
                                <span>• {statementData.sectionI.I_other3Specify || statementData.sectionI.I12_other3Specify || 'Additional Item 3'}:</span>
                                <span className="font-mono">${Number(statementData.sectionI.I_other3Amount || statementData.sectionI.I12_other3Amount || 0).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-2 print:hidden no-print">
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">I. Other Additional Services &amp; Merchandise (3 Lines):</span>
                          
                          {/* Line 1 */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-400 font-medium">Line 1:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionI.I_otherSpecify || statementData.sectionI.I12_otherSpecify || ''}
                                placeholder="Specify other additional item (Line 1)..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionI.I_otherSpecify = e.target.value;
                                  updated.sectionI.I12_otherSpecify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={(statementData.sectionI.I_otherAmount || statementData.sectionI.I12_otherAmount) === 0 ? '' : (statementData.sectionI.I_otherAmount || statementData.sectionI.I12_otherAmount)}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionI.I_otherAmount = val;
                                    updated.sectionI.I12_otherAmount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Line 2 */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-400 font-medium">Line 2:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionI.I_other2Specify || statementData.sectionI.I12_other2Specify || ''}
                                placeholder="Specify other additional item (Line 2)..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionI.I_other2Specify = e.target.value;
                                  updated.sectionI.I12_other2Specify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={(statementData.sectionI.I_other2Amount || statementData.sectionI.I12_other2Amount) === 0 ? '' : (statementData.sectionI.I_other2Amount || statementData.sectionI.I12_other2Amount)}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionI.I_other2Amount = val;
                                    updated.sectionI.I12_other2Amount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Line 3 */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-400 font-medium">Line 3:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionI.I_other3Specify || statementData.sectionI.I12_other3Specify || ''}
                                placeholder="Specify other additional item (Line 3)..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionI.I_other3Specify = e.target.value;
                                  updated.sectionI.I12_other3Specify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={(statementData.sectionI.I_other3Amount || statementData.sectionI.I12_other3Amount) === 0 ? '' : (statementData.sectionI.I_other3Amount || statementData.sectionI.I12_other3Amount)}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionI.I_other3Amount = val;
                                    updated.sectionI.I12_other3Amount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* J. Limited Services (Optional / Direct Dispositions / Forwarding / Receiving) */}
                      {(statementData.sectionI.J1_forwardingRemainsAmount > 0 || statementData.sectionI.J2_receivingRemainsAmount > 0 || (statementData.sectionI.J_otherAmount || 0) > 0 || statementData.sectionI.J_otherSpecify) && (
                        <div className="p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-neutral-800">J. Limited Services:</span>
                          </div>
                          <div className="pl-3 space-y-0.5 text-[10px] text-neutral-700">
                            {statementData.sectionI.J1_forwardingRemainsAmount > 0 && (
                              <div className="flex justify-between">
                                <span>1. Forwarding of Remains to another firm:</span>
                                <span className="font-mono">${statementData.sectionI.J1_forwardingRemainsAmount.toFixed(2)}</span>
                              </div>
                            )}
                            {statementData.sectionI.J2_receivingRemainsAmount > 0 && (
                              <div className="flex justify-between">
                                <span>2. Receiving Remains from another firm:</span>
                                <span className="font-mono">${statementData.sectionI.J2_receivingRemainsAmount.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          {/* J. Other Limited Services */}
                          {Boolean(statementData.sectionI.J_otherSpecify?.trim() || (statementData.sectionI.J_otherAmount || 0) > 0) && (
                            <div className="hidden print:flex justify-between items-center text-[10px] text-neutral-700 pt-1 border-t border-dashed border-neutral-200">
                              <span>• Other: {statementData.sectionI.J_otherSpecify || 'Limited Service'}</span>
                              <span className="font-mono">${Number(statementData.sectionI.J_otherAmount || 0).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="pt-1.5 border-t border-dashed border-neutral-200 space-y-1 print:hidden no-print">
                            <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">J. Other Limited Services:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionI.J_otherSpecify || ''}
                                placeholder="Specify other limited service..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionI.J_otherSpecify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={statementData.sectionI.J_otherAmount === 0 ? '' : statementData.sectionI.J_otherAmount}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionI.J_otherAmount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section I Total */}
                      <div className="flex justify-between pt-2 border-t-2 border-neutral-900 font-bold text-xs text-neutral-900">
                        <span>TOTAL OF FUNERAL HOME CHARGES:</span>
                        <span className="font-mono text-[#800000]">${statementData.sectionI.totalFuneralHomeCharges.toFixed(2)}</span>
                      </div>

                    </div>

                  </div>

                  {/* SECTION II: CASH ADVANCES & SECTION III: SUMMARY OF CHARGES (CONSOLIDATED ONTO PAGE 1) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] pt-4 border-t-2 border-neutral-900 print-grid-cols-2 print:grid-cols-2 print:gap-5 print:pt-2">
                    
                    {/* Left Column: Cash Advances */}
                    <div className="space-y-3 border border-neutral-300 rounded-xl p-3.5 print:p-2.5">
                      <div className="flex justify-between items-center border-b border-neutral-200 pb-1">
                        <h5 className="font-bold text-xs uppercase text-[#800000]">
                          II. CASH ADVANCES
                        </h5>
                        <button
                          type="button"
                          onClick={() => setIsCheckPrinterOpen(true)}
                          className="px-2.5 py-1 bg-[#800000] hover:bg-[#6a0509] text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-xs border border-brass-300/40 cursor-pointer print:hidden"
                        >
                          <Printer className="w-3 h-3 text-amber-300" />
                          <span>Print Checks (${statementData.sectionII.totalCashAdvances.toFixed(2)})</span>
                        </button>
                      </div>
                      <p className="text-[9px] text-neutral-500 italic">
                        These are estimated charges for items to be paid to others. We will charge you no more for these items than is actually paid the third parties.
                      </p>

                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span>1. Cemetery or Crematory:</span>
                          <span className="font-mono">${statementData.sectionII.cemeteryOrCrematoryAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2. Clergy Honoraria / Church:</span>
                          <span className="font-mono">${statementData.sectionII.clergyHonorariaAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3. Death Certificate Transcripts ({statementData.sectionII.deathCertificateTranscriptsCount}x{(statementData.isVeteran || statementData.sectionII.isVeteranDiscountApplied) ? ' • 3 Free VA Copies' : ''}):</span>
                          <span className="font-mono">${statementData.sectionII.deathCertificateTranscriptsAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4. Organist / Musician Accompaniment:</span>
                          <span className="font-mono">${statementData.sectionII.organistMusicianAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>5. Pallbearers (Professional Crew):</span>
                          <span className="font-mono">${statementData.sectionII.pallbearersAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>6. Bridge &amp; Road Tolls (Pass-Through):</span>
                          <span className="font-mono">${statementData.sectionII.bridgeAndRoadTollsAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>7. Livery Chauffeur &amp; Staff Gratuities:</span>
                          <span className="font-mono">${statementData.sectionII.gratuitiesLiveryAndStaffAmount.toFixed(2)}</span>
                        </div>
                        {((statementData.sectionII.dispositionPermitAmount || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>8. {statementData.sectionII.dispositionPermitType || 'NY Disposition Permit'}:</span>
                            <span className="font-mono">${(statementData.sectionII.dispositionPermitAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {((statementData.sectionII.insuranceFunderFeeAmount || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>9. Insurance Funder Fee:</span>
                            <span className="font-mono">${(statementData.sectionII.insuranceFunderFeeAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {((statementData.sectionII.eVitalFilingFeeAmount || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>10. Electronic Vital Filing Fee:</span>
                            <span className="font-mono">${(statementData.sectionII.eVitalFilingFeeAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {((statementData.sectionII.nycCorrectionFeeAmount || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>11. NYC Correction Fee:</span>
                            <span className="font-mono">${(statementData.sectionII.nycCorrectionFeeAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {((statementData.sectionII.publicTransportationShippingAmount || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>12. Shipping / Transportation:</span>
                            <span className="font-mono">${(statementData.sectionII.publicTransportationShippingAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {(statementData.sectionII.customCashAdvances || []).map((c, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{13 + idx}. {c.description}:</span>
                            <span className="font-mono">${c.amount.toFixed(2)}</span>
                          </div>
                        ))}

                        {/* Print View of Filled Other Cash Advance Items */}
                        {(Boolean(statementData.sectionII.otherCashAdvanceSpecify?.trim() || (statementData.sectionII.otherCashAdvanceAmount || 0) > 0) ||
                          Boolean(statementData.sectionII.otherCashAdvance2Specify?.trim() || (statementData.sectionII.otherCashAdvance2Amount || 0) > 0) ||
                          Boolean(statementData.sectionII.otherCashAdvance3Specify?.trim() || (statementData.sectionII.otherCashAdvance3Amount || 0) > 0)) && (
                          <div className="hidden print:block pt-1.5 border-t border-dashed border-neutral-200 space-y-0.5 text-[10px] text-neutral-800">
                            {Boolean(statementData.sectionII.otherCashAdvanceSpecify?.trim() || (statementData.sectionII.otherCashAdvanceAmount || 0) > 0) && (
                              <div className="flex justify-between">
                                <span>• {statementData.sectionII.otherCashAdvanceSpecify || 'Other Cash Advance (Line 1)'}:</span>
                                <span className="font-mono">${Number(statementData.sectionII.otherCashAdvanceAmount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            {Boolean(statementData.sectionII.otherCashAdvance2Specify?.trim() || (statementData.sectionII.otherCashAdvance2Amount || 0) > 0) && (
                              <div className="flex justify-between">
                                <span>• {statementData.sectionII.otherCashAdvance2Specify || 'Other Cash Advance (Line 2)'}:</span>
                                <span className="font-mono">${Number(statementData.sectionII.otherCashAdvance2Amount || 0).toFixed(2)}</span>
                              </div>
                            )}
                            {Boolean(statementData.sectionII.otherCashAdvance3Specify?.trim() || (statementData.sectionII.otherCashAdvance3Amount || 0) > 0) && (
                              <div className="flex justify-between">
                                <span>• {statementData.sectionII.otherCashAdvance3Specify || 'Other Cash Advance (Line 3)'}:</span>
                                <span className="font-mono">${Number(statementData.sectionII.otherCashAdvance3Amount || 0).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Screen-Only Other Cash Advance Rows (3 Lines) */}
                        <div className="pt-2 mt-2 border-t border-dashed border-neutral-200 space-y-2 print:hidden no-print">
                          <span className="font-semibold text-neutral-800 text-[10px] uppercase tracking-wider block">
                            Other Cash Advance Items (3 Lines):
                          </span>

                          {/* Line 1 */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-400 font-medium">Line 1:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionII.otherCashAdvanceSpecify || ''}
                                placeholder="Specify other cash advance (Line 1)..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionII.otherCashAdvanceSpecify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={statementData.sectionII.otherCashAdvanceAmount === 0 ? '' : statementData.sectionII.otherCashAdvanceAmount}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionII.otherCashAdvanceAmount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Line 2 */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-400 font-medium">Line 2:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionII.otherCashAdvance2Specify || ''}
                                placeholder="Specify other cash advance (Line 2)..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionII.otherCashAdvance2Specify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={statementData.sectionII.otherCashAdvance2Amount === 0 ? '' : statementData.sectionII.otherCashAdvance2Amount}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionII.otherCashAdvance2Amount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Line 3 */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-400 font-medium">Line 3:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={statementData.sectionII.otherCashAdvance3Specify || ''}
                                placeholder="Specify other cash advance (Line 3)..."
                                onChange={(e) => {
                                  const updated = { ...statementData };
                                  updated.sectionII.otherCashAdvance3Specify = e.target.value;
                                  setStatementData(calculateAP47Totals(updated));
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                              />
                              <div className="relative w-28 shrink-0">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={statementData.sectionII.otherCashAdvance3Amount === 0 ? '' : statementData.sectionII.otherCashAdvance3Amount}
                                  placeholder="0.00"
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0);
                                    const updated = { ...statementData };
                                    updated.sectionII.otherCashAdvance3Amount = val;
                                    setStatementData(calculateAP47Totals(updated));
                                  }}
                                  className="w-full pl-6 pr-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-mono text-right font-bold text-neutral-900 focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-neutral-300 font-bold text-xs text-neutral-900">
                        <span>ESTIMATED TOTAL OF CASH ADVANCES:</span>
                        <span className="font-mono">${statementData.sectionII.totalCashAdvances.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Right Column: Summary of Charges & Balances */}
                    <div className="space-y-3 bg-red-50/60 border border-red-200 rounded-xl p-3.5 print:p-2.5">
                      <h5 className="font-bold text-xs uppercase text-[#800000] border-b border-red-200 pb-1">
                        III. SUMMARY OF CHARGES
                      </h5>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span>1. Funeral Home Charges:</span>
                          <span className="font-mono font-bold">${statementData.sectionIII.funeralHomeChargesTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2. Cash Advances:</span>
                          <span className="font-mono font-bold">${statementData.sectionIII.cashAdvancesTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-red-200 text-sm font-bold text-[#800000]">
                          <span>TOTAL FUNERAL CHARGES:</span>
                          <span className="font-mono">${statementData.sectionIII.totalFuneralCharges.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-800 font-bold text-xs pt-1">
                          <span>Less Payments / Life Insurance Credit:</span>
                          <span className="font-mono">-${statementData.sectionIII.lessCreditsAndInsurance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-neutral-900 pt-1 border-t border-red-300">
                          <span>BALANCE DUE:</span>
                          <span className="font-mono text-base text-red-900">${statementData.sectionIII.balanceDue.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded-lg border border-red-200 text-[10px] text-neutral-600 space-y-0.5">
                        <div><strong>Terms:</strong> All funds are due 48 hours prior to service. Late charge of 1.5% per month applies to balances past due.</div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* ----------------- PAGE 2: STATUTORY AUTHORIZATIONS & SIGNATURES ----------------- */}
                {(() => {
                  const combinedVisitation = 
                    statementData.sectionIV.combinedVisitationCharge || 
                    ((statementData.sectionI.F1_facilitiesVisitationAmount || 0) + (statementData.sectionI.E1_supervisionVisitationAmount || 0));

                  const combinedFuneral = 
                    statementData.sectionIV.combinedFuneralServiceCharge || 
                    ((statementData.sectionI.F2_facilitiesFuneralServiceAmount || 0) + (statementData.sectionI.E2_supervisionFuneralServiceAmount || 0));

                  const combinedMemorial = 
                    statementData.sectionIV.combinedOtherCharge || 
                    ((statementData.sectionI.F3_facilitiesMemorialServiceAmount || 0) + (statementData.sectionI.E3_supervisionMemorialAmount || 0));

                  const rawAddress = activeCase.informant.address || '';
                  const addrParts = rawAddress.split(',').map((s) => s.trim()).filter(Boolean);
                  let billToStreet = rawAddress;
                  let billToCityStateZip = '';
                  if (addrParts.length >= 3) {
                    billToStreet = addrParts.slice(0, addrParts.length - 2).join(', ');
                    billToCityStateZip = addrParts.slice(addrParts.length - 2).join(', ');
                  } else if (addrParts.length === 2) {
                    billToStreet = addrParts[0];
                    billToCityStateZip = addrParts[1];
                  } else if (!rawAddress) {
                    billToStreet = '9 Dennis Lane';
                    billToCityStateZip = 'Pleasantville, NY 10570';
                  }

                  const informantInitials = activeCase.informant.fullName
                    ? activeCase.informant.fullName
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : 'MD';

                  const isEmbalmingSelected = statementData.sectionIV.embalmingAuthorization.choice === 'embalm';
                  const directorName = activeCase.assignedDirector || 'Leatrice Henry';

                  return (
                    <div className="space-y-3 pt-2 ap47-page-break print:break-before-page print:pt-3 print:space-y-2.5">
                      
                      {/* Page 2 Official Top Reference Strip */}
                      <div className="flex justify-between items-center border-b border-neutral-300 pb-1.5 text-[10px] text-neutral-600">
                        <span className="font-serif-title font-bold text-[#800000]">
                          Benta's Funeral Home, Inc. • Statement of Goods and Services Selected
                        </span>
                        <span className="font-mono text-[9.5px]">
                          Deceased: <strong>{activeCase.decedent.legalName}</strong> • Date: <strong>{statementData.agreementDate}</strong> • Inv: <strong>#{statementData.invoiceNumber}</strong>
                        </span>
                      </div>

                      {/* Top Statutory Notice Sentence */}
                      <p className="text-[9.5px] leading-snug text-neutral-800">
                        The following are the charges for the services, merchandise and livery you have selected. You will not be charged for any item you did not choose unless it is necessary because of other selections you have made. Any such charges are explained below.
                      </p>

                      {/* IV. EXPLANATION OF CHARGES Title & Mandatory Prompt */}
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-[11px] uppercase text-neutral-900 tracking-wider">
                          IV. EXPLANATION OF CHARGES
                        </h4>
                        <p className="text-[9px] leading-normal text-neutral-700">
                          Explain charges for embalming and for any items that are not required by law but may be necessary because of cemetery requirements, crematory requirements or any other selections made.
                        </p>
                      </div>

                      {/* Combined Facilities/Staff Charges (Left) & Acknowledgement of Receipt (Right) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 print-grid-cols-2 print:grid-cols-2 items-stretch">
                        
                        {/* Combined Charges Box */}
                        <div className="space-y-1.5 text-[9px] text-neutral-800 border border-neutral-800 rounded p-2.5 bg-white flex flex-col justify-between">
                          <div className="flex justify-between items-baseline border-b border-neutral-200 pb-1">
                            <span>Combined charge for Facilities and Staff for visitation is:</span>
                            <span className="font-mono font-bold shrink-0 ml-2">
                              $ {combinedVisitation > 0 ? combinedVisitation.toFixed(2) : '-'}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline border-b border-neutral-200 pb-1">
                            <span>Combined charge for Facilities and Staff for funeral service is:</span>
                            <span className="font-mono font-bold shrink-0 ml-2">
                              $ {combinedFuneral > 0 ? combinedFuneral.toFixed(2) : '-'}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span>Combined charge for Facilities and Staff for memorial service is:</span>
                            <span className="font-mono font-bold shrink-0 ml-2">
                              $ {combinedMemorial > 0 ? combinedMemorial.toFixed(2) : '-'}
                            </span>
                          </div>
                        </div>

                        {/* Acknowledgement of Receipt Box */}
                        <div className="border border-neutral-800 rounded p-2.5 bg-white space-y-1.5">
                          <div className="font-bold text-[9.5px] uppercase text-neutral-900 tracking-wider text-center border-b border-neutral-200 pb-0.5">
                            ACKNOWLEDGEMENT OF RECEIPT
                          </div>
                          <p className="text-[8.5px] text-neutral-700 leading-tight">
                            I have received this itemization of funeral services and merchandise selected.
                          </p>
                          <div className="grid grid-cols-3 gap-2 pt-1 items-end text-[8.5px]">
                            <div className="col-span-2 border-b border-neutral-800 pb-0.5 min-h-[16px]">
                              <span className="font-serif italic text-neutral-900 text-[9.5px]">
                                {activeCase.informant.fullName}
                              </span>
                            </div>
                            <div className="border-b border-neutral-800 pb-0.5 font-mono text-[9px] text-center min-h-[16px]">
                              {statementData.agreementDate}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[7.5px] text-neutral-500 uppercase tracking-wider">
                            <div className="col-span-2">Signature</div>
                            <div className="text-center">Date</div>
                          </div>
                        </div>

                      </div>

                      {/* Director Signature & Public Notice */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 print-grid-cols-2 print:grid-cols-2 items-start text-[9px]">
                        
                        {/* Left: Signature of Licensed Funeral Director */}
                        <div className="space-y-2 pt-0.5">
                          <div className="grid grid-cols-3 gap-2 items-end">
                            <div className="col-span-2 border-b border-neutral-800 pb-0.5 min-h-[18px]">
                              <span className="font-serif italic text-neutral-900 text-[10px]">
                                {directorName}
                              </span>
                            </div>
                            <div className="border-b border-neutral-800 pb-0.5 font-mono text-[9px] text-center min-h-[18px]">
                              {statementData.agreementDate}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[8px] text-neutral-600">
                            <div className="col-span-2">Signature of Licensed Funeral Director</div>
                            <div className="text-center">Date</div>
                          </div>

                          <div className="pt-1">
                            <div className="border-b border-neutral-800 pb-0.5 font-sans font-medium text-neutral-900 text-[9.5px]">
                              {directorName}
                            </div>
                            <div className="text-[8px] text-neutral-600 mt-0.5">
                              Printed or Typed Name of Funeral Director
                            </div>
                          </div>
                        </div>

                        {/* Right: Official Public Notice (Troy, NY DOH) */}
                        <div className="border border-neutral-800 rounded p-2 bg-neutral-50/50 space-y-1 text-[8.5px] leading-relaxed">
                          <div className="font-bold text-neutral-900 uppercase">
                            PUBLIC NOTICE:
                          </div>
                          <p className="text-neutral-700">
                            The New York State Department of Health is responsible for licensing and regulating New York State funeral directing under the Public Health Law. You may contact the Department at:
                          </p>
                          <div className="font-semibold text-neutral-900 pt-0.5 text-[8px] leading-tight">
                            Bureau of Funeral Directing, New York State Department of Health<br />
                            Hedley Park, 6th Floor<br />
                            433 River Street<br />
                            Troy, New York 12180
                          </div>
                        </div>

                      </div>

                      {/* Custody Authorization Box */}
                      <div className="border border-neutral-800 rounded p-2 bg-white space-y-1 text-[9px]">
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="text-neutral-800">
                            The undersigned hereby authorizes the above funeral establishment or its representatives to obtain custody of the remains of
                          </span>
                          <span className="font-bold border-b border-neutral-800 px-2 text-neutral-900 grow min-w-[180px]">
                            {activeCase.decedent.legalName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5 text-[8.5px] text-neutral-700">
                          <span>Initial and state your relation to deceased</span>
                          <span className="border border-neutral-800 px-2 py-0.2 font-bold font-mono text-neutral-900">
                            {informantInitials}
                          </span>
                          <span className="border-b border-neutral-800 px-2 font-medium text-neutral-900 grow">
                            {activeCase.informant.relationship}
                          </span>
                        </div>
                      </div>

                      {/* Embalming Authorization Box */}
                      <div className="border border-neutral-800 rounded p-2 bg-white space-y-1 text-[9px]">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-neutral-800">
                            The undersigned hereby authorizes the above funeral establishment or its representatives
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                            <span className="border border-neutral-800 px-1 py-0.2 font-mono text-[8px]">{isEmbalmingSelected ? '✓' : ' '}</span> to embalm
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                            <span className="border border-neutral-800 px-1 py-0.2 font-mono text-[8px]">{!isEmbalmingSelected ? '✓' : ' '}</span> not to embalm
                          </span>
                          <span className="text-neutral-800">the remains of</span>
                          <span className="font-bold border-b border-neutral-800 px-2 text-neutral-900 grow min-w-[160px]">
                            {activeCase.decedent.legalName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5 text-[8.5px] text-neutral-700">
                          <span>Initial and state your relation to deceased</span>
                          <span className="border border-neutral-800 px-2 py-0.2 font-bold font-mono text-neutral-900">
                            {informantInitials}
                          </span>
                          <span className="border-b border-neutral-800 px-2 font-medium text-neutral-900 grow">
                            {activeCase.informant.relationship}
                          </span>
                        </div>
                      </div>

                      {/* Two-Column: Billing Information (Left) & Exclusion of Warranty (Right) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-grid-cols-2 print:grid-cols-2 border border-neutral-800 rounded p-2.5 bg-white text-[9px]">
                        
                        {/* Left: Billing Information */}
                        <div className="space-y-1 pr-1 sm:border-r border-neutral-300">
                          <div className="font-bold uppercase tracking-wider text-neutral-900 text-[9.5px] pb-0.5 border-b border-neutral-200">
                            BILLING INFORMATION
                          </div>
                          <div className="space-y-1 pt-0.5 text-[8.5px]">
                            <div className="flex justify-between items-baseline">
                              <span className="text-neutral-600 font-medium">Bill To:</span>
                              <span className="font-semibold text-neutral-900 border-b border-neutral-400 grow ml-2 pb-0.2">
                                {activeCase.informant.fullName || 'Mary Daniels'}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-neutral-600 font-medium">Relationship to Decedent:</span>
                              <span className="font-semibold text-neutral-900 border-b border-neutral-400 grow ml-2 pb-0.2">
                                {activeCase.informant.relationship || 'Daughter'}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-neutral-600 font-medium">Address:</span>
                              <span className="font-semibold text-neutral-900 border-b border-neutral-400 grow ml-2 pb-0.2">
                                {billToStreet}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-neutral-600 font-medium">City-State-Zip:</span>
                              <span className="font-semibold text-neutral-900 border-b border-neutral-400 grow ml-2 pb-0.2">
                                {billToCityStateZip}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-neutral-600 font-medium">Phone Number:</span>
                              <span className="font-semibold font-mono text-neutral-900 border-b border-neutral-400 grow ml-2 pb-0.2">
                                {activeCase.informant.phone || '(646) 474-2377'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Exclusion of Warranty & FTC Notice */}
                        <div className="space-y-1.5 pl-0 sm:pl-2 text-[8.5px] text-neutral-800 leading-normal">
                          <div>
                            <span className="font-bold uppercase text-neutral-900">EXCLUSION OF WARRANTY. </span>
                            <span>
                              The only warranties, express or implied, granted in connection with the goods sold with this funeral service are the express written warranties, if any, extended by the manufacturers thereof. No other warranties and no warranties of merchantability or fitness for a particular purpose are extended by the funeral director.
                            </span>
                          </div>
                          <div className="italic text-neutral-700 bg-neutral-50 p-1 rounded border border-neutral-200 text-[8px] leading-tight">
                            "Charges are only for those items that are used. If we are required by law to use any items, we will explain the reasons in writing below."
                          </div>
                        </div>

                      </div>

                      {/* Payment Agreement, GPL Prior Receipt & Terms */}
                      <div className="space-y-1 text-[8.5px] text-neutral-800 leading-tight">
                        <p>
                          The foregoing statement has been read by (to) me and I hereby acknowledge receipt of a copy of same and agree to pay the above funeral account and for such additional services and materials as are ordered by me, on or before <span className="border-b border-neutral-800 px-2 font-semibold text-neutral-900 inline-block min-w-[120px]">{statementData.agreementDate || '48 hours prior to service'} (All funds due 48 hours prior to service)</span>. In the event that this account is not paid in accordance with the terms of this agreement, the undersigned hereby agrees to pay any and all costs and attorney's fees.
                        </p>
                        <p>
                          Prior to the discussion of these funeral arrangements, I was presented with a copy of this funeral firm's "General Price List" for which I hereby acknowledge receipt, and
                        </p>
                        <p>
                          <strong className="text-neutral-900">TERMS: </strong>All funds are due 48 hours prior to service. The liability hereby assumed is in addition to the liability imposed by law upon the estate and others, and shall not constitute a release thereof.
                        </p>
                      </div>

                      {/* Dual Family Signatures & By Line */}
                      <div className="space-y-1.5 pt-0.5 text-[8.5px]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print-grid-cols-2 print:grid-cols-2">
                          <div>
                            <div className="border-b border-neutral-800 pb-0.5 min-h-[18px] font-serif italic text-sm text-[#800000]">
                              {activeCase.informant.fullName} (Electronic Jurat Verified)
                            </div>
                            <div className="flex justify-between items-baseline text-[8px] text-neutral-600 mt-0.5">
                              <span>Signature of Purchaser / Next of Kin</span>
                              <span className="text-[7.5px] font-semibold text-neutral-700">Notice: All funds due 48 hours prior to service</span>
                            </div>
                            <div className="text-[8px] text-neutral-800 font-medium">
                              Relation to Deceased: <span className="border-b border-neutral-400 px-1">{activeCase.informant.relationship}</span>
                            </div>
                          </div>

                          <div>
                            <div className="border-b border-neutral-800 pb-0.5 min-h-[18px]"></div>
                            <div className="flex justify-between items-baseline text-[8px] text-neutral-600 mt-0.5">
                              <span>Signature</span>
                              <span className="text-[7.5px] font-semibold text-neutral-700">Notice: All funds due 48 hours prior to service</span>
                            </div>
                            <div className="text-[8px] text-neutral-800 font-medium">
                              Relation to Deceased: <span className="border-b border-neutral-400 px-6 inline-block"></span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-0.5 flex items-baseline gap-2 text-[8.5px]">
                          <span className="font-bold text-neutral-800 shrink-0">By</span>
                          <span className="border-b border-neutral-800 grow pb-0.2 font-medium text-neutral-900">
                            {activeCase.informant.fullName}
                          </span>
                          <span className="text-[8px] font-semibold text-neutral-700 shrink-0">
                            • Terms: All funds due 48 hours prior to service
                          </span>
                        </div>
                      </div>

                      {/* ADDITIONS OR ALTERATIONS OF SERVICES AND MERCHANDISE SELECTED Box */}
                      <div className="border border-neutral-800 rounded p-2 bg-white space-y-1 text-[8.5px]">
                        <div className="font-bold uppercase text-[9px] text-neutral-900">
                          ADDITIONS OR ALTERATIONS OF SERVICES AND MERCHANDISE SELECTED
                          <span className="block font-normal normal-case text-neutral-700 text-[8px] mt-0.2">
                            The following changes represent items of service and/or merchandise ordered or altered:
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-grid-cols-2 print:grid-cols-2 pt-0.5">
                          
                          {/* Left: Authorization Initial Rows */}
                          <div className="space-y-1">
                            <div className="text-[7.5px] font-bold uppercase tracking-wider text-neutral-600">
                              AUTHORIZATION INITIAL
                            </div>
                            <div className="space-y-0.8 text-[8px]">
                              <div className="flex items-center gap-1.5">
                                <span className="border border-neutral-800 px-1.5 py-0.2 font-mono text-[7.5px] text-neutral-400">[ &nbsp;&nbsp; ]</span>
                                <span className="border-b border-neutral-400 grow h-3"></span>
                                <span className="border-b border-neutral-400 w-14 h-3"></span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="border border-neutral-800 px-1.5 py-0.2 font-mono text-[7.5px] text-neutral-400">[ &nbsp;&nbsp; ]</span>
                                <span className="border-b border-neutral-400 grow h-3"></span>
                                <span className="border-b border-neutral-400 w-14 h-3"></span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="border border-neutral-800 px-1.5 py-0.2 font-mono text-[7.5px] text-neutral-400">[ &nbsp;&nbsp; ]</span>
                                <span className="border-b border-neutral-400 grow h-3"></span>
                                <span className="border-b border-neutral-400 w-14 h-3"></span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Adjustments Financial Reconciliation */}
                          <div className="space-y-0.5 text-[8.5px] border-t sm:border-t-0 sm:border-l border-neutral-200 sm:pl-2.5 pt-0.5 sm:pt-0">
                            <div className="flex justify-between items-baseline border-b border-neutral-200 pb-0.2">
                              <span className="text-neutral-700">Total Adjustments to Funeral Charges:</span>
                              <span className="font-mono font-medium">$ -</span>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-neutral-200 pb-0.2">
                              <span className="text-neutral-700 font-bold uppercase">ADJUSTED TOTAL:</span>
                              <span className="font-mono font-bold">${statementData.sectionIII.totalFuneralCharges.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-neutral-200 pb-0.2 text-emerald-800">
                              <span>CREDIT:</span>
                              <span className="font-mono font-medium">
                                ${statementData.sectionIII.lessCreditsAndInsurance > 0 ? statementData.sectionIII.lessCreditsAndInsurance.toFixed(2) : '-'}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline pt-0.2 text-neutral-900 font-bold">
                              <span>BALANCE DUE:</span>
                              <span className="font-mono text-[9.5px] text-red-900">${statementData.sectionIII.balanceDue.toFixed(2)}</span>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>

              {/* Step 4 Footer Navigation Bar */}
              <div className="flex justify-between pt-2 print:hidden contract-studio-footer-nav no-print">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Back to Step 3
                </button>
                <button
                  type="button"
                  onClick={handleSaveToGoldenRecord}
                  className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-8 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-red-950/20 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save & Complete Form AP-47 Statement</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3-Part Pass-Through Check Voucher Printer Modal */}
      {isCheckPrinterOpen && (
        <CashAdvanceCheckPrinterModal
          isOpen={isCheckPrinterOpen}
          onClose={() => setIsCheckPrinterOpen(false)}
          caseData={activeCase}
          customStatement={statementData}
          onUpdateChecks={(updatedChecks) => {
            const updated = { ...statementData, cashAdvanceChecks: updatedChecks };
            setStatementData(updated);
          }}
        />
      )}

      {/* Family Portal PIN & Onboarding Guidance Modal */}
      {isFamilyPortalPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200">
            
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Arrangement Finalized & Locked
                  </span>
                  <h3 className="font-serif-title text-xl font-bold text-neutral-900 pt-0.5">
                    Family Portal PIN & Benefits Guide
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsFamilyPortalPinModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                    Case Access PIN for {activeCase.informant.fullName}
                  </span>
                  <p className="text-xs text-amber-800">
                    Share this secure PIN with the family or use Master Manager PIN <code className="font-mono font-bold bg-amber-200 px-1 py-0.5 rounded">3995</code>.
                  </p>
                </div>
                <div className="bg-neutral-900 text-amber-300 font-mono text-2xl font-black px-4 py-2 rounded-xl border border-amber-400/40 tracking-widest shadow-inner">
                  1948
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`Benta's Funeral Home - Family Portal Access\nCase: ${activeCase.caseNumber} (${activeCase.decedent.legalName})\nAccess URL: https://e-bfh.com\nFamily PIN: 1948 (or Manager PIN: 3995)`);
                    showToast('✓ Family Portal credentials copied to clipboard!');
                  }}
                  className="w-full bg-brass-50 hover:bg-brass-100 text-brass-900 border border-brass-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Copy Family Credentials & Portal Link</span>
                </button>
              </div>
            </div>

            {/* Funeral Director Onboarding Steps */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Funeral Director Onboarding Checklist:
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span><strong>Hand over PIN:</strong> Provide PIN <code className="font-mono text-neutral-900">1948</code> to {activeCase.informant.fullName}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">2.</span>
                  <span><strong>Guide Through Portal:</strong> Open the Family Portal on the office tablet or family phone and demonstrate the portal's advantages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">3.</span>
                  <span><strong>Showcase 360 Voice Archive:</strong> Demonstrate the living audio studio with 4-pillar prompts (Joy, Pain, Sacrifice, Action) and AI poem formatting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">4.</span>
                  <span><strong>Preview Keepsake Volume:</strong> Show how voice stanzas and photos compile into the museum-grade Heirloom Coffee Table Book with scan-to-stream QR codes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">5.</span>
                  <span><strong>Transparent Financials:</strong> Explain that relatives can review the itemized AP-47 ledger and contribute via Split-Pay.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsFamilyPortalPinModalOpen(false);
                  onClose();
                }}
                className="bg-[#800000] hover:bg-[#6a0509] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md"
              >
                Close & Return to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tri-State Cemetery & Crematory Directory & Pricing Modal */}
      {isCemeteryModalOpen && (
        <CemeterySelectionModal
          isOpen={isCemeteryModalOpen}
          onClose={() => setIsCemeteryModalOpen(false)}
          currentCemeteryName={statementData.sectionII.cemeteryOrCrematoryName || activeCase.serviceSelections.crematoryOrCemeteryName}
          currentFeeAmount={statementData.sectionII.cemeteryOrCrematoryAmount}
          onSelectCemetery={handleCemeterySelected}
        />
      )}

      {/* Contract Adjustments & Revision Archive Modal */}
      {isRevisionArchiveOpen && (
        <ContractRevisionArchiveModal
          isOpen={isRevisionArchiveOpen}
          onClose={() => setIsRevisionArchiveOpen(false)}
          caseData={activeCase}
          currentStatement={statementData}
          revisions={contractRevisions}
          onRestoreRevision={handleRestoreRevision}
          onCreateRevision={(notes) => handleArchiveNewRevision(notes)}
        />
      )}

    </div>
  );
};
