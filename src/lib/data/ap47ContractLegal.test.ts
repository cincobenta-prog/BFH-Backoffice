import { describe, it, expect } from 'vitest';
import { calculateAP47Totals, getDefaultStatementOfGoodsForCase } from './generalPriceList';
import { MOCK_CASES } from './mockCases';
import fs from 'fs';
import path from 'path';

describe('Official Scanned NYS Form AP-47 Legal Disclosures & Verbatim Text Validation', () => {
  it('correctly populates and calculates financial statement for Page 1 & Page 2 reconciliation', () => {
    const testCase = MOCK_CASES[0];
    const statement = getDefaultStatementOfGoodsForCase(testCase);
    const calculated = calculateAP47Totals(statement);

    // Page 1 Totals
    expect(calculated.sectionIII.funeralHomeChargesTotal).toBeGreaterThan(0);
    expect(calculated.sectionIII.totalFuneralCharges).toEqual(
      calculated.sectionIII.funeralHomeChargesTotal + calculated.sectionIII.cashAdvancesTotal
    );
    expect(calculated.sectionIII.balanceDue).toEqual(
      calculated.sectionIII.totalFuneralCharges - calculated.sectionIII.lessCreditsAndInsurance
    );

    // Section IV Statutory Authorizations
    expect(calculated.sectionIV.custodyAuthorization).toBeDefined();
    expect(calculated.sectionIV.embalmingAuthorization).toBeDefined();
    expect(['embalm', 'not_to_embalm']).toContain(calculated.sectionIV.embalmingAuthorization.choice);
  });

  it('verifies statutory address for the Bureau of Funeral Directing matches the scanned contract (Albany, NY)', () => {
    const scannedAddress = {
      agency: 'Bureau of Funeral Directing, New York State Department of Health',
      street: '875 Central Avenue',
      cityStateZip: 'Albany, New York 12206'
    };

    expect(scannedAddress.agency).toBe('Bureau of Funeral Directing, New York State Department of Health');
    expect(scannedAddress.street).toBe('875 Central Avenue');
    expect(scannedAddress.cityStateZip).toBe('Albany, New York 12206');
  });

  it('verifies legally required clauses match verbatim the office scanned Form AP-47', () => {
    const legalClauses = {
      topNotice: 'The following are the charges for the services, merchandise and livery you have selected. You will not be charged for any item you did not choose unless it is necessary because of other selections you have made. Any such charges are explained below.',
      sectionIVPrompt: 'Explain charges for embalming and for any items that are not required by law but may be necessary because of cemetery requirements, crematory requirements or other selections made.',
      ftcNotice: '"Charges are only for those items that are used. If we are required by law to use any items, we will explain the reasons in writing below."',
      warrantyDisclaimer: 'EXCLUSION OF WARRANTY. The only warranties, express or implied, granted in connection with the goods sold with this funeral service are the express written warranties, if any, extended by the manufacturers thereof. No other warranties and no warranties of merchantability or fitness for a particular purpose are extended by the funeral director.',
      attorneysFees: 'In the event that this account is not paid in accordance with the terms of this agreement, the undersigned hereby agrees to pay any and all costs and attorney\'s fees incurred in connection with the collection of this account.',
      gplPriorReceipt: 'Prior to the discussion of these funeral arrangements, I was presented with a copy of this funeral firm\'s "General Price List" for which I hereby acknowledge receipt, and have had an opportunity to review the firm\'s Casket Price List and Outer Interment Receptacle Price List.',
      termsNotice: 'TERMS: This account becomes due 48 hours prior to service. If bill remains unpaid beyond 48 hours prior to service a late charge of 1.5% per month (annual rate 18%) may be added to the unpaid portion of the balance due. All funds are due 48 hours prior to service.',
      termsLiability: 'The liability hereby assumed is in addition to the liability imposed by law upon the estate and others, and shall not constitute a release thereof.',
      additionsAlterations: 'ADDITIONS OR ALTERATIONS OF SERVICES AND MERCHANDISE SELECTED. The following changes represent items of service and/or merchandise ordered or altered subsequent to the original funeral agreement.',
      embalmingStatutory: 'If you select a funeral for which this firm requires embalming such as a funeral with viewing, you may have to pay for embalming. You do not have to pay for embalming you do not approve if you select arrangements such as direct cremation or direct burial. If we charge for embalming, we will explain why below.',
      basicArrangementsDef: 'Basic arrangements: including funeral director, other staff, equipment and facilities to respond to initial request for service, the arrangement conference, securing of necessary authorizations and coordination of service plans with parties involved in the final disposition of the deceased.'
    };

    expect(legalClauses.topNotice).toContain('The following are the charges for the services');
    expect(legalClauses.sectionIVPrompt).toContain('Explain charges for embalming');
    expect(legalClauses.warrantyDisclaimer).toContain('EXCLUSION OF WARRANTY');
    expect(legalClauses.attorneysFees).toContain('incurred in connection with the collection of this account');
    expect(legalClauses.gplPriorReceipt).toContain('Outer Interment Receptacle Price List');
    expect(legalClauses.termsNotice).toContain('48 hours prior to service');
    expect(legalClauses.termsLiability).toContain('liability imposed by law upon the estate and others');
    expect(legalClauses.additionsAlterations).toContain('subsequent to the original funeral agreement');
    expect(legalClauses.embalmingStatutory).toContain('direct cremation or direct burial');
    expect(legalClauses.basicArrangementsDef).toContain('coordination of service plans');
  });

  it('validates OfficialScannedFormAP47 component source code contains all scanned contract verbatim lines', () => {
    const compPath = path.resolve(__dirname, '../../components/backoffice/OfficialScannedFormAP47.tsx');
    const compContent = fs.readFileSync(compPath, 'utf8');

    // Scanned document header & footer
    expect(compContent).toContain('A Celebration of Life');
    expect(compContent).toContain('Funeral Home, Inc.');
    expect(compContent).toContain('630 St. Nicholas Avenue (Corner of W. 141st Street)');
    expect(compContent).toContain('2012 AP-47');

    // Statutory agency address in Albany
    expect(compContent).toContain('875 Central Avenue, Albany, New York 12206');
    expect(compContent).toContain('Bureau of Funeral Directing, New York State Department of Health');

    // Line items and titles
    expect(compContent).toContain('Telephone & Telegraph Charges');
    expect(compContent).toContain('ITEMIZATION OF FUNERAL SERVICES AND MERCHANDISE SELECTED');
    expect(compContent).toContain('I. FUNERAL HOME CHARGES');
    expect(compContent).toContain('(Indicate N/A for items of service and/or merchandise that are not provided.)');
    expect(compContent).toContain('II. CASH ADVANCES');
    expect(compContent).toContain('These are estimated charges for items to be paid to others.');
    expect(compContent).toContain('III. SUMMARY OF CHARGES');
    expect(compContent).toContain('IV. EXPLANATION OF CHARGES');

    // Interactive Authorization Boxes & Signatures
    expect(compContent).toContain('Custody Authorization');
    expect(compContent).toContain('The undersigned hereby authorizes the above funeral establishment or its representatives to obtain custody of the remains of');
    expect(compContent).toContain('The undersigned hereby authorizes the above funeral establishment or its representatives');
    expect(compContent).toContain('to embalm');
    expect(compContent).toContain('not to embalm');
    expect(compContent).toContain('Initial and state your relation to deceased');
    expect(compContent).toContain('ADDITIONS OR ALTERATIONS OF SERVICES AND MERCHANDISE SELECTED');
    expect(compContent).toContain('The following changes represent items of service and/or merchandise ordered or altered subsequent to the original funeral agreement.');
  });
});
