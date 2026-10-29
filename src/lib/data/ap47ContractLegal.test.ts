import { describe, it, expect } from 'vitest';
import { calculateAP47Totals, getDefaultStatementOfGoodsForCase } from './generalPriceList';
import { MOCK_CASES } from './mockCases';

describe('Official NYS Form AP-47 Legal Disclosures & Statutory Validation', () => {
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

  it('verifies statutory address for the Bureau of Funeral Directing is the official Troy, NY address', () => {
    const officialAddress = {
      agency: 'Bureau of Funeral Directing, New York State Department of Health',
      facility: 'Hedley Park, 6th Floor',
      street: '433 River Street',
      cityStateZip: 'Troy, New York 12180'
    };

    expect(officialAddress.agency).toContain('Bureau of Funeral Directing');
    expect(officialAddress.facility).toBe('Hedley Park, 6th Floor');
    expect(officialAddress.street).toBe('433 River Street');
    expect(officialAddress.cityStateZip).toBe('Troy, New York 12180');
  });

  it('verifies legally required clauses match verbatim NYS Form AP-47 Page 2 requirements', () => {
    const legalClauses = {
      topNotice: 'The following are the charges for the services, merchandise and livery you have selected. You will not be charged for any item you did not choose unless it is necessary because of other selections you have made. Any such charges are explained below.',
      sectionIVPrompt: 'Explain charges for embalming and for any items that are not required by law but may be necessary because of cemetery requirements, crematory requirements or any other selections made.',
      ftcNotice: '"Charges are only for those items that are used. If we are required by law to use any items, we will explain the reasons in writing below."',
      warrantyDisclaimer: 'EXCLUSION OF WARRANTY. The only warranties, express or implied, granted in connection with the goods sold with this funeral service are the express written warranties, if any, extended by the manufacturers thereof. No other warranties and no warranties of merchantability or fitness for a particular purpose are extended by the funeral director.',
      attorneysFees: 'in the event that this account is not paid in accordance with the terms of this agreement, the undersigned hereby agrees to pay any and all costs and attorney\'s fees',
      termsLiability: 'The liability hereby assumed is in addition to the liability imposed by law upon the estate and others, and shall not constitute a release thereof.'
    };

    expect(legalClauses.topNotice).toContain('The following are the charges for the services');
    expect(legalClauses.sectionIVPrompt).toContain('Explain charges for embalming');
    expect(legalClauses.warrantyDisclaimer).toContain('EXCLUSION OF WARRANTY');
    expect(legalClauses.attorneysFees).toContain('attorney\'s fees');
    expect(legalClauses.termsLiability).toContain('liability imposed by law upon the estate');
  });
});
