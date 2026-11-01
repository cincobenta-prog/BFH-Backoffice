import React, { useState } from 'react';
import { 
  GoldenRecordCase, 
  StatementOfGoodsData 
} from '../../lib/types/funeral';
import { calculateAP47Totals } from '../../lib/data/generalPriceList';
import { CheckSquare, Square } from 'lucide-react';

interface OfficialScannedFormAP47Props {
  caseData: GoldenRecordCase;
  statementData: StatementOfGoodsData;
  onChangeStatementData?: (updated: StatementOfGoodsData) => void;
  readOnly?: boolean;
  id?: string;
  defaultLayout?: 'two_page' | 'four_column';
}

export const OfficialScannedFormAP47: React.FC<OfficialScannedFormAP47Props> = ({
  caseData,
  statementData,
  onChangeStatementData,
  readOnly = false,
  id = 'official-form-ap47-contract',
  defaultLayout = 'two_page'
}) => {
  const [layoutMode, setLayoutMode] = useState<'two_page' | 'four_column'>(defaultLayout);
  const [eSignedFamily, setESignedFamily] = useState<boolean>(true);
  const [familyInitials, setFamilyInitials] = useState<string>(() => {
    return caseData.informant.fullName
      ? caseData.informant.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()
      : 'MD';
  });

  const sog = statementData;

  const handleUpdate = (updater: (prev: StatementOfGoodsData) => StatementOfGoodsData) => {
    if (readOnly || !onChangeStatementData) return;
    const next = updater({ ...sog });
    onChangeStatementData(calculateAP47Totals(next));
  };

  const isEmbalmingSelected = sog.sectionIV.embalmingAuthorization.choice === 'embalm';

  const toggleEmbalming = (choice: 'embalm' | 'not_to_embalm') => {
    if (readOnly || !onChangeStatementData) return;
    handleUpdate(prev => {
      const updated = { ...prev };
      updated.sectionIV.embalmingAuthorization.choice = choice;
      return updated;
    });
  };

  const combinedVisitation = 
    sog.sectionIV.combinedVisitationCharge || 
    ((sog.sectionI.F1_facilitiesVisitationAmount || 0) + (sog.sectionI.E1_supervisionVisitationAmount || 0));

  const combinedFuneral = 
    sog.sectionIV.combinedFuneralServiceCharge || 
    ((sog.sectionI.F2_facilitiesFuneralServiceAmount || 0) + (sog.sectionI.E2_supervisionFuneralServiceAmount || 0));

  const combinedOther = 
    sog.sectionIV.combinedOtherCharge || 
    ((sog.sectionI.F3_facilitiesMemorialServiceAmount || 0) + (sog.sectionI.E3_supervisionMemorialAmount || 0));

  const directorName = sog.sectionIV.licensedFuneralDirector.name || caseData.assignedDirector || 'Jason Benta, LFD';
  const directorLicense = sog.sectionIV.licensedFuneralDirector.licenseNumber || '08850';

  // Format currency helper
  const fmt = (val: number | undefined, showZeroAsDash = true) => {
    if (val === undefined || val === null || val === 0) {
      return showZeroAsDash ? '-' : '$ 0.00';
    }
    return `$ ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Dot leader fill line helper
  const DotRow: React.FC<{
    label: string | React.ReactNode;
    amount?: number | string;
    sublabel?: string | React.ReactNode;
    isHeader?: boolean;
    indent?: number;
    showIfZero?: boolean;
  }> = ({ label, amount, sublabel, isHeader = false, indent = 0, showIfZero = true }) => {
    const formattedAmount = typeof amount === 'number' 
      ? fmt(amount, !showIfZero)
      : (amount || '-');

    return (
      <div className={`text-[10px] leading-tight ${indent ? `pl-${indent}` : ''}`}>
        <div className="flex items-baseline justify-between gap-1 w-full">
          <span className={`shrink-0 ${isHeader ? 'font-bold text-neutral-950' : 'text-neutral-800'}`}>
            {label}
          </span>
          <span className="grow border-b border-dotted border-neutral-400 mx-1 mb-0.5 opacity-70"></span>
          <span className="shrink-0 font-mono text-right font-medium text-neutral-900 min-w-[58px]">
            {formattedAmount}
          </span>
        </div>
        {sublabel && (
          <div className="text-[9px] text-neutral-600 pl-2 leading-snug italic">
            {sublabel}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* On-screen Layout Toggle Bar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-neutral-100 border border-neutral-300 rounded-xl text-xs print:hidden no-print">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-neutral-800">Scanned Contract Standard View:</span>
          <span className="text-neutral-500">Official NYS Form AP-47 (© 2012 AP-47)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLayoutMode('two_page')}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
              layoutMode === 'two_page'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            Official 2-Page Duplex View
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('four_column')}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer ${
              layoutMode === 'four_column'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            4-Column Panoramic View (Exact Scanned Layout)
          </button>
        </div>
      </div>

      {/* Main AP-47 Contract Document Canvas */}
      <div
        id={id}
        className="bg-white text-neutral-900 border-2 border-neutral-800 shadow-xl p-6 sm:p-8 font-serif-text text-xs leading-normal print:p-0 print:border-none print:shadow-none print:w-full"
      >
        
        {/* ============================================================== */}
        {/* PAGE 1 / COLUMNS 1 & 2: SECTION I (FUNERAL HOME CHARGES) */}
        {/* ============================================================== */}
        <div className="space-y-3 ap47-print-page ap47-page-1">
          
          {/* Header Block */}
          <div className="border-b-2 border-neutral-900 pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              
              {/* Left Letterhead */}
              <div className="space-y-0.5">
                <div className="font-serif italic font-semibold text-lg sm:text-xl text-neutral-800">
                  &ldquo;A Celebration of Life&rdquo;
                </div>
                <div className="font-serif font-bold text-2xl sm:text-3xl text-neutral-950 tracking-wide uppercase">
                  Benta&apos;s Funeral Home, Inc.
                </div>
                <div className="text-[11px] font-sans text-neutral-700">
                  630 St. Nicholas Avenue (Corner of W. 141st Street)
                </div>
                <div className="text-[11px] font-sans text-neutral-700">
                  New York, New York 10030
                </div>
                <div className="text-[11px] font-mono text-neutral-700">
                  (212) 281-8850-1-2-3
                </div>
              </div>

              {/* Right Number and Date Fields */}
              <div className="font-sans text-xs space-y-1.5 self-end sm:self-auto text-right w-full sm:w-auto">
                <div className="flex items-baseline justify-end gap-2">
                  <span className="font-bold">Number:</span>
                  <span className="font-mono font-bold border-b border-neutral-800 px-3 pb-0.5 min-w-[120px] text-left">
                    {sog.invoiceNumber || caseData.caseNumber}
                  </span>
                </div>
                <div className="flex items-baseline justify-end gap-2">
                  <span className="font-bold">Date:</span>
                  <span className="font-mono font-bold border-b border-neutral-800 px-3 pb-0.5 min-w-[120px] text-left">
                    {sog.agreementDate}
                  </span>
                </div>
              </div>

            </div>

            {/* Decedent Metadata Strip */}
            <div className="font-sans text-xs pt-3 mt-2 border-t border-neutral-300 space-y-1.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-bold shrink-0">Name of Deceased:</span>
                <span className="font-bold border-b border-neutral-800 px-2 pb-0.5 grow text-neutral-950 min-w-[200px]">
                  {caseData.decedent.legalName}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold shrink-0">Date of Death:</span>
                  <span className="border-b border-neutral-800 px-2 pb-0.5 grow font-medium">
                    {caseData.decedent.dateOfDeath}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold shrink-0">Place of Death:</span>
                  <span className="border-b border-neutral-800 px-2 pb-0.5 grow font-medium">
                    {caseData.decedent.facilityName || caseData.decedent.placeOfDeath || 'New York, NY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemization Subheader */}
            <div className="text-center pt-2.5">
              <div className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-neutral-900">
                ITEMIZATION OF FUNERAL SERVICES AND MERCHANDISE SELECTED
              </div>
              <p className="font-sans text-[9.5px] text-neutral-600 italic mt-0.5 max-w-4xl mx-auto leading-normal">
                The following are the charges for the services, merchandise, and livery you have selected. You will not be charged for any item you do not choose unless it is necessary because of other selections you have made. Any such charges are explained below.
              </p>
            </div>
          </div>

          {/* Section I Grid: 2 Columns on Page 1 (or Columns 1 & 2 in 4-column layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-xs">
            
            {/* COLUMN 1: Sections A through E */}
            <div className="space-y-3">
              <div className="border-b border-neutral-800 pb-1">
                <div className="font-bold text-[11px] uppercase tracking-wide text-neutral-900">
                  I. FUNERAL HOME CHARGES
                </div>
                <div className="text-[9px] text-neutral-500 italic">
                  (Indicate N/A for items of service and/or merchandise that are not provided.)
                </div>
              </div>

              {/* A. Alternative Services */}
              <div className="space-y-1">
                <div className="font-bold text-neutral-900 text-[10.5px]">A. Alternative Services</div>
                <DotRow 
                  label="1. Direct Cremation" 
                  amount={sog.serviceType === 'direct_cremation' ? sog.sectionI.A_alternativeServicesAmount : undefined} 
                  indent={2} 
                />
                <DotRow 
                  label="2. Direct Burial" 
                  amount={sog.serviceType === 'direct_burial' ? sog.sectionI.A_alternativeServicesAmount : undefined} 
                  indent={2} 
                />
                {Boolean(sog.sectionI.A_otherSpecify || (sog.sectionI.A_otherAmount || 0) > 0) && (
                  <DotRow 
                    label={`• Other: ${sog.sectionI.A_otherSpecify || 'Alternative Service'}`} 
                    amount={sog.sectionI.A_otherAmount} 
                    indent={2} 
                  />
                )}
              </div>

              {/* B. Transfer of Remains */}
              <div className="space-y-1">
                <DotRow 
                  label="B. Transfer of remains to the funeral establishment including personnel, equipment and vehicle" 
                  amount={sog.sectionI.B_transferOfRemainsAmount} 
                  isHeader={true}
                />
                {Boolean(sog.sectionI.B_otherSpecify || (sog.sectionI.B_otherAmount || 0) > 0) && (
                  <DotRow 
                    label={`• Excess Mileage / Other: ${sog.sectionI.B_otherSpecify || 'Transfer Special'}`} 
                    amount={sog.sectionI.B_otherAmount} 
                    indent={2} 
                  />
                )}
              </div>

              {/* C. Preparation of Remains */}
              <div className="space-y-1.5">
                <div className="font-bold text-neutral-900 text-[10.5px]">C. Preparation of Remains</div>
                
                <DotRow 
                  label="1. Embalming (including use of preparation room)" 
                  amount={sog.sectionI.C1_embalmingAmount} 
                  indent={2} 
                />
                <p className="text-[8.5px] text-neutral-600 italic leading-snug pl-2 border-l-2 border-neutral-300 my-1">
                  If you select a funeral for which this firm requires embalming such as a funeral with viewing, you may have to pay for embalming. You do not have to pay for embalming you do not approve if you select arrangements such as direct cremation or direct burial. If we charge for embalming, we will explain why below.
                </p>

                <div className="text-[10px] font-semibold text-neutral-800 pl-2">
                  2. Other Preparation (including use of preparation room but excluding embalming)
                </div>
                <DotRow label="a. Topical Disinfection" amount={sog.sectionI.C2_topicalDisinfectionAmount} indent={4} />
                <DotRow label="b. Custodial Care" amount={sog.sectionI.C2_custodialCareAmount} indent={4} />
                <DotRow label="c. Dressing/Casketing" amount={sog.sectionI.C2_dressingCasketingAmount} indent={4} />
                <DotRow label="d. Cosmetology" amount={sog.sectionI.C2_cosmetologyAmount} indent={4} />
                <DotRow label="e. Restoration" amount={sog.sectionI.C2_restorationAmount} indent={4} />
                <DotRow 
                  label={`f. Other (specify): ${sog.sectionI.C_otherSpecify || sog.sectionI.C2_otherSpecify || '________________________'}`} 
                  amount={(sog.sectionI.C_otherAmount || 0) + (sog.sectionI.C2_otherAmount || 0)} 
                  indent={4} 
                />
              </div>

              {/* D. Arrangements */}
              <div className="space-y-1">
                <DotRow 
                  label="D. Arrangements" 
                  amount={sog.sectionI.D_basicArrangementsAmount} 
                  isHeader={true}
                />
                <p className="text-[8.5px] text-neutral-600 leading-snug pl-2">
                  Basic arrangements: including funeral director, other staff, equipment and facilities to respond to initial request for service, the arrangement conference, securing of necessary authorizations and coordination of service plans with parties involved in the final disposition of the deceased.
                </p>
                {Boolean(sog.sectionI.D_otherSpecify || (sog.sectionI.D_otherAmount || 0) > 0) && (
                  <DotRow 
                    label={`• Other (specify): ${sog.sectionI.D_otherSpecify || 'Arrangements Service'}`} 
                    amount={sog.sectionI.D_otherAmount} 
                    indent={2} 
                  />
                )}
              </div>

              {/* E. Supervision */}
              <div className="space-y-1">
                <div className="font-bold text-neutral-900 text-[10.5px]">E. Supervision (funeral director and staff)</div>
                <DotRow label="1. Supervision for visitation" amount={sog.sectionI.E1_supervisionVisitationAmount} indent={2} />
                <DotRow label="2. Supervision for funeral service" amount={sog.sectionI.E2_supervisionFuneralServiceAmount} indent={2} />
                <DotRow 
                  label={`3. Other supervision (specify): ${sog.sectionI.E_otherSpecify || sog.sectionI.E3_otherSupervisionSpecify || 'Cemetery / Committal'}`} 
                  amount={(sog.sectionI.E3_supervisionCemeteryCrematoryAmount || 0) + (sog.sectionI.E3_supervisionMemorialAmount || 0) + (sog.sectionI.E_otherAmount || 0)} 
                  indent={2} 
                />
              </div>

              {/* Page 1 Bottom Tag */}
              <div className="pt-4 text-[9px] text-neutral-400 font-mono">
                &copy; 2012 AP-47
              </div>

            </div>

            {/* COLUMN 2: Sections F through J */}
            <div className="space-y-3">
              
              {/* F. Use of facilities */}
              <div className="space-y-1">
                <div className="font-bold text-neutral-900 text-[10.5px]">F. Use of the facilities</div>
                <DotRow label="1. Use of the facilities for visitation" amount={sog.sectionI.F1_facilitiesVisitationAmount} indent={2} />
                <DotRow label="2. Use of facilities for funeral service" amount={sog.sectionI.F2_facilitiesFuneralServiceAmount} indent={2} />
                <DotRow 
                  label={`3. Other use of facilities (specify): ${sog.sectionI.F_otherSpecify || sog.sectionI.F3_otherFacilitiesSpecify || 'Repast Fellowship Suite'}`} 
                  amount={(sog.sectionI.F3_repastRoomAmount || 0) + (sog.sectionI.F_otherAmount || 0) + (sog.sectionI.F3_otherFacilitiesAmount || 0)} 
                  indent={2} 
                />
              </div>

              {/* G. Livery */}
              <div className="space-y-1">
                <div className="font-bold text-neutral-900 text-[10.5px]">G. Livery</div>
                <DotRow label="1. a. Hearse or" amount={sog.sectionI.G_totalLiveryAmount > 0 ? 650 : undefined} indent={2} />
                <DotRow 
                  label="   b. Alternative vehicle (Specify type: ____________________)" 
                  amount={undefined} 
                  indent={2} 
                />
                <DotRow label="2. Flower vehicle" amount={undefined} indent={2} />
                <DotRow 
                  label="3. Limousine(s) (Specify number: 1 @ $ 650.00 /limousine)" 
                  amount={sog.sectionI.G_totalLiveryAmount > 650 ? (sog.sectionI.G_totalLiveryAmount - 650) : undefined} 
                  indent={2} 
                />
                <DotRow 
                  label="4. Passenger car(s) (Specify number: _____ @ $ _____ /car)" 
                  amount={undefined} 
                  indent={2} 
                />
              </div>

              {/* H. Merchandise */}
              <div className="space-y-1 text-[10px]">
                <div className="font-bold text-neutral-900 text-[10.5px]">H. Merchandise</div>
                
                <DotRow 
                  label="1. Casket or alternative container" 
                  amount={sog.sectionI.H1_casketAmount} 
                  indent={2} 
                />
                <div className="pl-4 text-[9px] text-neutral-700 space-y-0.5">
                  <div>a. Supplier: <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H1_casketSupplier || "Batesville Casket Company"}</span></div>
                  <div>b. Model name or number: <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H1_casketModelNameOrNumber || "The St. Nicholas Classic Cherry"}</span></div>
                  <div>c. Material: Species of wood <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H1_casketMaterialSpeciesOrGauge || "Solid Appalachian Cherry"}</span> or kind of metal <span className="border-b border-neutral-500 px-2">N/A</span> weight or gauge <span className="border-b border-neutral-500 px-2">N/A</span></div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;or alternative container (describe) <span className="border-b border-neutral-500 px-2">N/A</span></div>
                  <div>d. Interior: <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H1_casketInterior || "Champagne Velvet Tufted"}</span></div>
                </div>

                <div className="pt-1">
                  <DotRow 
                    label="2. Outer Interment Receptacle" 
                    amount={sog.sectionI.H2_outerReceptacleAmount} 
                    indent={2} 
                  />
                  <div className="pl-4 text-[9px] text-neutral-700 space-y-0.5">
                    <div>a. Supplier: <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H2_outerReceptacleSupplier || (sog.sectionI.H2_outerReceptacleSelected ? "Trigard Burial Vaults" : "N/A")}</span></div>
                    <div>b. Model name or number: <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H2_outerReceptacleModelName || (sog.sectionI.H2_outerReceptacleSelected ? "Standard Concrete Burial Vault" : "N/A")}</span></div>
                    <div>c. Material: <span className="border-b border-neutral-500 font-medium px-2">{sog.sectionI.H2_outerReceptacleMaterial || (sog.sectionI.H2_outerReceptacleSelected ? "Reinforced Concrete / Asphalt Sealed" : "N/A")}</span></div>
                  </div>
                </div>
              </div>

              {/* I. Additional Services and Merchandise Selected */}
              <div className="space-y-0.5">
                <div className="font-bold text-neutral-900 text-[10.5px]">
                  I. Additional Services and Merchandise Selected
                </div>
                <div className="text-[9px] text-neutral-500 italic pl-2">(Describe and show price)</div>
                
                <DotRow label="1. Memorial Cards" amount={sog.sectionI.I1_memorialCardsAmount} indent={2} />
                <DotRow label="2. Acknowledgement Cards" amount={sog.sectionI.I2_acknowledgementCardsAmount} indent={2} />
                <DotRow label="3. Casket Plate" amount={sog.sectionI.I3_casketPlateAmount} indent={2} />
                <DotRow label="4. Crucifix/Cross" amount={sog.sectionI.I4_crucifixCrossAmount} indent={2} />
                <DotRow label="5. Hairdressing" amount={sog.sectionI.I5_hairdressingAmount} indent={2} />
                <DotRow label="6. Flowers" amount={sog.sectionI.I6_totalFlowersAmount} indent={2} />
                <DotRow label="7. Clothing or Burial Garments" amount={sog.sectionI.I7_clothingBurialGarmentsAmount} indent={2} />
                <DotRow label="8. Register Book" amount={sog.sectionI.I8_registerBookAmount} indent={2} />
                <DotRow label="9. Death Notices" amount={sog.sectionI.I9_deathNoticesAmount} indent={2} />
                <DotRow 
                  label={`10. ${sog.sectionI.I10_programsMatrix.quantity > 0 ? `Printed Programs (${sog.sectionI.I10_programsMatrix.quantity}x)` : '____________________________________'}`} 
                  amount={sog.sectionI.I10_programsMatrix.totalAmount} 
                  indent={2} 
                />
                <DotRow 
                  label={`11. ${sog.sectionI.I11_videoTributeAmount > 0 ? 'Digital Video Tribute Production' : (sog.sectionI.I_otherSpecify || '____________________________________')}`} 
                  amount={sog.sectionI.I11_videoTributeAmount || sog.sectionI.I_otherAmount} 
                  indent={2} 
                />
                <DotRow 
                  label={`12. ${sog.sectionI.I_other2Specify || '____________________________________'}`} 
                  amount={sog.sectionI.I_other2Amount} 
                  indent={2} 
                />
              </div>

              {/* J. Limited Services */}
              <div className="space-y-1">
                <div className="font-bold text-neutral-900 text-[10.5px]">J. Limited Services</div>
                <DotRow label="1. Forwarding remains to ________________________" amount={sog.sectionI.J1_forwardingRemainsAmount} indent={2} />
                <DotRow label="2. Receiving remains from ________________________" amount={sog.sectionI.J2_receivingRemainsAmount} indent={2} />
              </div>

              {/* Total of Funeral Home Charges */}
              <div className="pt-2 border-t-2 border-neutral-900">
                <DotRow 
                  label="TOTAL OF FUNERAL HOME CHARGES" 
                  amount={sog.sectionI.totalFuneralHomeCharges} 
                  isHeader={true}
                />
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* PAGE 2 / COLUMNS 3 & 4: CASH ADVANCES, SUMMARY, DISCLOSURES, AUTHORIZATIONS & SIGNATURES */}
        {/* ============================================================== */}
        <div className="pt-6 border-t-4 border-neutral-900 ap47-page-break print:break-before-page ap47-print-page ap47-page-2">
          
          {/* Page 2 Top Reference Line */}
          <div className="flex justify-between items-center border-b border-neutral-400 pb-1 mb-3 text-[10px] text-neutral-600 font-sans">
            <span className="font-serif italic font-bold text-neutral-900">
              Benta&apos;s Funeral Home, Inc. • Statement of Goods and Services Selected (Form AP-47)
            </span>
            <span className="font-mono">
              Deceased: <strong>{caseData.decedent.legalName}</strong> • Date: <strong>{sog.agreementDate}</strong> • Inv: <strong>#{sog.invoiceNumber || caseData.caseNumber}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
            
            {/* COLUMN 3: Cash Advances, Summary, Explanation, Public Notice, Warranty */}
            <div className="space-y-4">
              
              {/* II. Cash Advances */}
              <div className="space-y-1 border border-neutral-800 p-2.5 rounded bg-white">
                <div className="font-bold text-[11px] uppercase tracking-wide text-neutral-900">
                  II. CASH ADVANCES
                </div>
                <p className="text-[8.5px] text-neutral-600 italic leading-snug">
                  These are estimated charges for items to be paid to others. We will charge you no more for these items than is actually paid the third parties. (Describe and show estimated charges.)
                </p>

                <div className="space-y-0.8 pt-1">
                  <DotRow label="1. Cemetery or Crematory" amount={sog.sectionII.cemeteryOrCrematoryAmount} indent={1} />
                  <DotRow label="2. Clergy Honoraria" amount={sog.sectionII.clergyHonorariaAmount} indent={1} />
                  <DotRow 
                    label={`3. Death Certificate Transcripts (${sog.sectionII.deathCertificateTranscriptsCount || 4}x)`} 
                    amount={sog.sectionII.deathCertificateTranscriptsAmount} 
                    indent={1} 
                  />
                  <DotRow label="4. Livery" amount={sog.sectionII.liveryCashAdvanceAmount} indent={1} />
                  <DotRow label="5. Pallbearers" amount={sog.sectionII.pallbearersAmount} indent={1} />
                  <DotRow label="6. Public Transportation" amount={sog.sectionII.publicTransportationShippingAmount} indent={1} />
                  <DotRow label="7. Gratuities" amount={sog.sectionII.gratuitiesLiveryAndStaffAmount} indent={1} />
                  <DotRow label="8. Bridge & Road Tolls" amount={sog.sectionII.bridgeAndRoadTollsAmount} indent={1} />
                  <DotRow label="9. Telephone & Telegraph Charges" amount={sog.sectionII.telephoneTelegraphAmount} indent={1} />
                  <DotRow 
                    label={`10. ${sog.sectionII.organistMusicianAmount > 0 ? 'Organist / Musician Accompaniment' : (sog.sectionII.otherCashAdvanceSpecify || '____________________________________')}`} 
                    amount={sog.sectionII.organistMusicianAmount || sog.sectionII.otherCashAdvanceAmount} 
                    indent={1} 
                  />
                  <DotRow 
                    label={`11. ${sog.sectionII.eVitalFilingFeeAmount > 0 ? 'NYC EDRS / Electronic Vital Filing Fee' : (sog.sectionII.otherCashAdvance2Specify || '____________________________________')}`} 
                    amount={sog.sectionII.eVitalFilingFeeAmount || sog.sectionII.otherCashAdvance2Amount} 
                    indent={1} 
                  />
                  {Boolean(sog.sectionII.otherCashAdvance3Specify || (sog.sectionII.otherCashAdvance3Amount || 0) > 0) && (
                    <DotRow 
                      label={`12. ${sog.sectionII.otherCashAdvance3Specify}`} 
                      amount={sog.sectionII.otherCashAdvance3Amount} 
                      indent={1} 
                    />
                  )}
                </div>

                <div className="pt-1.5 border-t border-neutral-800 mt-1">
                  <DotRow 
                    label="ESTIMATED TOTAL OF CASH ADVANCES" 
                    amount={sog.sectionII.totalCashAdvances} 
                    isHeader={true}
                  />
                </div>
              </div>

              {/* III. Summary of Charges */}
              <div className="space-y-1 border border-neutral-800 p-2.5 rounded bg-white">
                <div className="font-bold text-[11px] uppercase tracking-wide text-neutral-900 border-b border-neutral-200 pb-0.5">
                  III. SUMMARY OF CHARGES
                </div>
                <div className="space-y-1 pt-1">
                  <DotRow label="1. Funeral Home Charges" amount={sog.sectionIII.funeralHomeChargesTotal} indent={1} />
                  <DotRow label="2. Cash Advances" amount={sog.sectionIII.cashAdvancesTotal} indent={1} />
                  <div className="pt-1 border-t border-neutral-800 font-bold">
                    <DotRow label="TOTAL FUNERAL CHARGES" amount={sog.sectionIII.totalFuneralCharges} isHeader={true} />
                  </div>
                </div>
              </div>

              {/* IV. Explanation of Charges */}
              <div className="space-y-1.5 border border-neutral-800 p-2.5 rounded bg-white">
                <div className="font-bold text-[11px] uppercase tracking-wide text-neutral-900">
                  IV. EXPLANATION OF CHARGES
                </div>
                <p className="text-[8.5px] text-neutral-600 leading-snug">
                  Explain charges for embalming and for any items that are not required by law but may be necessary because of cemetery requirements, crematory requirements or other selections made.
                </p>

                <div className="space-y-1 pt-1 text-[9.5px]">
                  <DotRow label="Combined charge for Facilities and Staff for visitation is" amount={combinedVisitation} />
                  <DotRow label="Combined charge for Facilities and Staff for funeral service is" amount={combinedFuneral} />
                  <DotRow label="Combined charge for other Facilities and Staff (specify)" amount={combinedOther} />
                </div>

                {/* Licensed Funeral Director Signature */}
                <div className="pt-3 space-y-1">
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div className="col-span-2 border-b border-neutral-800 pb-0.5 min-h-[20px]">
                      <span className="font-serif italic font-bold text-neutral-900 text-xs">
                        {directorName}
                      </span>
                    </div>
                    <div className="border-b border-neutral-800 pb-0.5 font-mono text-center text-[10px]">
                      {sog.agreementDate}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[8px] text-neutral-600">
                    <div className="col-span-2">Signature of Licensed Funeral Director</div>
                    <div className="text-center">Date</div>
                  </div>
                  <div className="pt-1">
                    <div className="border-b border-neutral-800 pb-0.5 font-medium text-[9.5px]">
                      {directorName} (LFD #{directorLicense})
                    </div>
                    <div className="text-[8px] text-neutral-600">Printed or Typed Name of Funeral Director</div>
                  </div>
                </div>

                {/* Acknowledgement of Receipt */}
                <div className="pt-3 border-t border-neutral-300 space-y-1">
                  <div className="font-bold text-[9.5px] uppercase tracking-wide text-neutral-900">
                    ACKNOWLEDGEMENT OF RECEIPT
                  </div>
                  <p className="text-[8.5px] text-neutral-700 leading-tight">
                    I have received this itemization of funeral services and merchandise selected.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 items-end">
                    <div className="col-span-2 border-b border-neutral-800 pb-0.5 min-h-[20px]">
                      <span className="font-serif italic font-bold text-[#800000] text-xs">
                        {caseData.informant.fullName}
                      </span>
                    </div>
                    <div className="border-b border-neutral-800 pb-0.5 font-mono text-center text-[10px]">
                      {sog.agreementDate}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[8px] text-neutral-600">
                    <div className="col-span-2">Signature</div>
                    <div className="text-center">Date</div>
                  </div>
                </div>

              </div>

              {/* Public Notice (Official Albany DOH Address from Scanned Document) */}
              <div className="border border-neutral-800 p-2 rounded bg-neutral-50/50 space-y-1 text-[8.5px] leading-relaxed">
                <div className="font-bold text-neutral-900 uppercase">
                  PUBLIC NOTICE
                </div>
                <p className="text-neutral-700">
                  The New York State Department of Health is responsible for licensing and regulating New York State funeral directing under the Public Health Law. You may contact the Department at:
                </p>
                <div className="font-semibold text-neutral-900 pl-2">
                  Bureau of Funeral Directing, New York State Department of Health<br />
                  875 Central Avenue, Albany, New York 12206
                </div>
              </div>

              {/* Exclusion of Warranty Box */}
              <div className="border-2 border-neutral-900 p-2 rounded bg-white text-[8.5px] leading-snug">
                <span className="font-bold text-neutral-950 uppercase">EXCLUSION OF WARRANTY. </span>
                <span>
                  The only warranties, express or implied, granted in connection with the goods sold with this funeral service are the express written warranties, if any, extended by the manufacturers thereof. No other warranties and no warranties of merchantability or fitness for a particular purpose are extended by the funeral director.
                </span>
              </div>

            </div>

            {/* COLUMN 4: Invoice To, Authorizations, Terms, GPL, Signatures, Additions */}
            <div className="space-y-3.5">
              
              {/* Column 4 Top Subheader & Invoice To */}
              <div className="border-b-2 border-neutral-900 pb-1.5">
                <div className="font-bold text-center text-[11px] uppercase tracking-wide text-neutral-900">
                  STATEMENT OF GOODS AND SERVICES SELECTED
                </div>
                <div className="flex items-baseline gap-2 pt-1 text-[10px]">
                  <span className="font-bold shrink-0">INVOICE TO:</span>
                  <div className="border-b border-neutral-800 grow pb-0.5 font-medium">
                    {caseData.informant.fullName} ({caseData.informant.relationship}) • {caseData.informant.phone}
                  </div>
                </div>
              </div>

              {/* Custody Authorization Box */}
              <div className="border border-neutral-800 p-2 rounded bg-white space-y-1.5 text-[9px]">
                <div className="flex flex-wrap items-baseline gap-1 leading-snug">
                  <span>The undersigned hereby authorizes the above funeral establishment or its representatives to obtain custody of the remains of</span>
                  <span className="font-bold border-b border-neutral-800 px-2 grow text-neutral-950 min-w-[150px]">
                    {caseData.decedent.legalName}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[8.5px]">
                  <span>Initial and state your relation to deceased</span>
                  <input
                    type="text"
                    value={familyInitials}
                    disabled={readOnly}
                    onChange={(e) => setFamilyInitials(e.target.value.toUpperCase())}
                    className="w-12 text-center font-bold font-mono border border-neutral-800 px-1 py-0.5 rounded bg-neutral-50 text-neutral-900"
                    placeholder="[Init]"
                  />
                  <span className="border-b border-neutral-800 px-2 grow font-medium">
                    {caseData.informant.relationship}
                  </span>
                </div>
              </div>

              {/* Embalming Authorization Box */}
              <div className="border border-neutral-800 p-2 rounded bg-white space-y-1.5 text-[9px]">
                <div className="flex flex-wrap items-baseline gap-1.5 leading-snug">
                  <span>The undersigned hereby authorizes the above funeral establishment or its representatives</span>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => toggleEmbalming('embalm')}
                    className={`inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded border transition cursor-pointer ${
                      isEmbalmingSelected
                        ? 'border-[#800000] bg-red-50 text-[#800000]'
                        : 'border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {isEmbalmingSelected ? <CheckSquare className="w-3 h-3 text-[#800000]" /> : <Square className="w-3 h-3 text-neutral-400" />}
                    <span>to embalm</span>
                  </button>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => toggleEmbalming('not_to_embalm')}
                    className={`inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded border transition cursor-pointer ${
                      !isEmbalmingSelected
                        ? 'border-[#800000] bg-red-50 text-[#800000]'
                        : 'border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {!isEmbalmingSelected ? <CheckSquare className="w-3 h-3 text-[#800000]" /> : <Square className="w-3 h-3 text-neutral-400" />}
                    <span>not to embalm</span>
                  </button>
                  <span>the remains of</span>
                  <span className="font-bold border-b border-neutral-800 px-2 grow text-neutral-950 min-w-[140px]">
                    {caseData.decedent.legalName}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[8.5px]">
                  <span>Initial and state your relation to deceased</span>
                  <input
                    type="text"
                    value={familyInitials}
                    disabled={readOnly}
                    onChange={(e) => setFamilyInitials(e.target.value.toUpperCase())}
                    className="w-12 text-center font-bold font-mono border border-neutral-800 px-1 py-0.5 rounded bg-neutral-50 text-neutral-900"
                    placeholder="[Init]"
                  />
                  <span className="border-b border-neutral-800 px-2 grow font-medium">
                    {caseData.informant.relationship}
                  </span>
                </div>
              </div>

              {/* Other Authorization & Law Notice */}
              <div className="space-y-1 text-[9px]">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold shrink-0">Other Authorization by:</span>
                  <span className="border-b border-neutral-800 grow font-medium pb-0.5">
                    {caseData.informant.fullName} (Next of Kin / Authorized Representative)
                  </span>
                </div>
                <div className="text-[8.5px] text-neutral-600 italic bg-neutral-50 p-1.5 rounded border border-neutral-200">
                  &ldquo;Charges are only for those items that are used. If we are required by law to use any items, we will explain the reasons in writing below.&rdquo;
                </div>
              </div>

              {/* Total Funeral Charges & Date */}
              <div className="pt-1 border-t border-neutral-800 space-y-1 text-[10px]">
                <DotRow 
                  label="TOTAL FUNERAL CHARGES" 
                  amount={sog.sectionIII.totalFuneralCharges} 
                  isHeader={true}
                />
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="font-bold">Date:</span>
                  <span className="font-mono font-bold border-b border-neutral-800 px-2 pb-0.5 grow">
                    {sog.agreementDate}
                  </span>
                </div>
              </div>

              {/* Statutory Legal Jargon: Payment Agreement, GPL Prior Receipt & Terms */}
              <div className="space-y-1.5 text-[8.5px] leading-snug text-neutral-800">
                <p>
                  The foregoing statement has been read by (to) me and I hereby acknowledge receipt of a copy of same and agree to pay the above funeral account and for such additional services and materials as are ordered by me, on or before <span className="font-bold border-b border-neutral-800 px-1">48 hours prior to service</span>. In the event that this account is not paid in accordance with the terms of this agreement, the undersigned hereby agrees to pay any and all costs and attorney&apos;s fees incurred in connection with the collection of this account.
                </p>

                <p>
                  Prior to the discussion of these funeral arrangements, I was presented with a copy of this funeral firm&apos;s &ldquo;General Price List&rdquo; for which I hereby acknowledge receipt, and have had an opportunity to review the firm&apos;s Casket Price List and Outer Interment Receptacle Price List.
                </p>

                <p className="font-medium text-neutral-950">
                  <strong>TERMS: </strong>This account becomes due 48 hours prior to service. If bill remains unpaid beyond 48 hours prior to service a late charge of 1.5% per month (annual rate 18%) may be added to the unpaid portion of the balance due. All funds are due 48 hours prior to service.
                </p>

                <p>
                  The liability hereby assumed is in addition to the liability imposed by law upon the estate and others, and shall not constitute a release thereof.
                </p>
              </div>

              {/* Signatures & Relation Lines */}
              <div className="space-y-2 pt-1 text-[9px]">
                
                {/* Primary Family Signature */}
                <div>
                  <div className="flex items-end justify-between border-b border-neutral-800 pb-0.5 min-h-[22px]">
                    <span className="font-serif italic font-bold text-sm text-[#800000]">
                      {eSignedFamily ? `${caseData.informant.fullName} (eSigned & Verified)` : ''}
                    </span>
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => setESignedFamily(!eSignedFamily)}
                      className="print:hidden text-[8px] bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-2 py-0.5 rounded text-neutral-700 font-sans cursor-pointer"
                    >
                      {eSignedFamily ? 'Clear Signature' : 'Click to Sign'}
                    </button>
                  </div>
                  <div className="flex justify-between text-[8px] text-neutral-600 mt-0.5">
                    <span>Signature of Purchaser / Next of Kin</span>
                    <span className="font-medium">Terms: All funds due 48 hours prior to service</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-semibold text-[8.5px]">Relation to Deceased:</span>
                    <span className="border-b border-neutral-600 grow pb-0.2 font-medium">
                      {caseData.informant.relationship}
                    </span>
                  </div>
                </div>

                {/* Secondary Signature */}
                <div>
                  <div className="border-b border-neutral-800 pb-0.5 min-h-[18px]"></div>
                  <div className="flex justify-between text-[8px] text-neutral-600 mt-0.5">
                    <span>Signature</span>
                    <span className="font-medium">Terms: All funds due 48 hours prior to service</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-semibold text-[8.5px]">Relation to Deceased:</span>
                    <span className="border-b border-neutral-600 grow pb-0.2"></span>
                  </div>
                </div>

                {/* By Line & Director Name */}
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="font-bold">By:</span>
                  <span className="border-b border-neutral-800 grow font-medium">
                    {caseData.informant.fullName}
                  </span>
                  <span className="text-[8px] text-neutral-500 font-sans">
                    Print Name of Licensed Funeral Director: <strong className="text-neutral-900">{directorName}</strong>
                  </span>
                </div>

              </div>

              {/* ADDITIONS OR ALTERATIONS OF SERVICES AND MERCHANDISE SELECTED Box */}
              <div className="border-2 border-neutral-900 p-2.5 rounded bg-white space-y-1.5 text-[8.5px]">
                <div>
                  <div className="font-bold uppercase text-[9px] text-neutral-950">
                    ADDITIONS OR ALTERATIONS OF SERVICES AND MERCHANDISE SELECTED
                  </div>
                  <p className="text-[8px] text-neutral-600 leading-tight">
                    The following changes represent items of service and/or merchandise ordered or altered subsequent to the original funeral agreement.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Left: Authorization Initial Rows */}
                  <div className="space-y-1">
                    <div className="text-[7.5px] font-bold uppercase tracking-wider text-neutral-600">
                      AUTHORIZATION INITIAL
                    </div>
                    <div className="space-y-1 text-[8px]">
                      <div className="flex items-center gap-1.5">
                        <span className="border border-neutral-800 px-1.5 py-0.2 font-mono text-[7.5px]">[ &nbsp;&nbsp; ]</span>
                        <span className="border-b border-neutral-400 grow h-3"></span>
                        <span className="border-b border-neutral-400 w-12 h-3 font-mono text-right">$ -</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="border border-neutral-800 px-1.5 py-0.2 font-mono text-[7.5px]">[ &nbsp;&nbsp; ]</span>
                        <span className="border-b border-neutral-400 grow h-3"></span>
                        <span className="border-b border-neutral-400 w-12 h-3 font-mono text-right">$ -</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="border border-neutral-800 px-1.5 py-0.2 font-mono text-[7.5px]">[ &nbsp;&nbsp; ]</span>
                        <span className="border-b border-neutral-400 grow h-3"></span>
                        <span className="border-b border-neutral-400 w-12 h-3 font-mono text-right">$ -</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Adjusted Totals */}
                  <div className="space-y-0.8 text-[8.5px] border-t sm:border-t-0 sm:border-l border-neutral-300 sm:pl-2.5 pt-1 sm:pt-0">
                    <div className="flex justify-between items-baseline border-b border-neutral-200 pb-0.2">
                      <span className="text-neutral-700">Total Adjustments to Funeral Charges:</span>
                      <span className="font-mono font-medium">$ -</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-neutral-200 pb-0.2 font-bold">
                      <span className="text-neutral-900 uppercase">ADJUSTED TOTAL:</span>
                      <span className="font-mono">${sog.sectionIII.totalFuneralCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-neutral-200 pb-0.2 text-emerald-800 font-semibold">
                      <span>Credit:</span>
                      <span className="font-mono">
                        ${sog.sectionIII.lessCreditsAndInsurance > 0 ? sog.sectionIII.lessCreditsAndInsurance.toFixed(2) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-0.5 text-neutral-950 font-bold">
                      <span>BALANCE DUE:</span>
                      <span className="font-mono text-[10px] text-[#800000]">${sog.sectionIII.balanceDue.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
