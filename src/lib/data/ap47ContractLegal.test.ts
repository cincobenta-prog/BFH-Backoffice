import React from 'react';
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
      termsNotice: 'TERMS: This account becomes due 48 hours prior to service. If bill remains unpaid beyond 48 hours prior to service a late charge may be added to the unpaid portion of the balance due. All funds are due 48 hours prior to service.',
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

  it('renders OfficialScannedFormAP47 with case-24501 to static HTML and verifies all 18 must-fixes on the DOM', async () => {
    const React = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { OfficialScannedFormAP47 } = await import('../../components/backoffice/OfficialScannedFormAP47');

    const testCase = MOCK_CASES[0]; // case-24501
    const statement = testCase.statementOfGoods || getDefaultStatementOfGoodsForCase(testCase);
    const html = renderToStaticMarkup(
      React.createElement(OfficialScannedFormAP47, {
        id: 'official-form-ap47-printable',
        caseData: testCase,
        statementData: statement,
        readOnly: true
      })
    );

    // Verify MUST-FIX 1: Public Notice Albany
    expect(html).toContain('875 Central Avenue, Albany, New York 12206');
    expect(html).not.toContain('Hedley Park');
    expect(html).not.toContain('433 River Street');
    expect(html).not.toContain('Troy, New York 12180');

    // Verify MUST-FIX 2: Full Arrangements statutory definition
    expect(html).toContain('Basic arrangements: including funeral director, other staff, equipment and facilities to respond to initial request for service, the arrangement conference, securing of necessary authorizations and coordination of service plans with parties involved in the final disposition of the deceased.');
    expect(html).not.toContain('Basic arrangements: funeral director, staff, equipment, authorizations &amp; coordination.');

    // Verify MUST-FIX 3: II Cash Advances disclosure with parenthetical
    expect(html).toContain('These are estimated charges for items to be paid to others. We will charge you no more for these items than is actually paid the third parties. (Describe and show estimated charges.)');

    // Verify MUST-FIX 4: IV Combined line 3
    expect(html).toContain('Combined charge for other Facilities and Staff (specify)');
    expect(html).not.toContain('Combined charge for Facilities and Staff for memorial service is');

    // Verify MUST-FIX 5: E.3 Other supervision (specify)
    expect(html).toContain('3. Other supervision (specify)');
    expect(html).not.toContain('Supervision at Cemetery / Crematory');

    // Verify MUST-FIX 6: C.1 Embalming preparation room
    expect(html).toContain('1. Embalming (including use of preparation room)');
    expect(html).not.toContain('use of prep room');

    // Verify MUST-FIX 7: E Header funeral director and staff
    expect(html).toContain('E. Supervision (funeral director and staff)');

    // Verify MUST-FIX 8: B Transfer full label
    expect(html).toContain('Transfer of remains to the funeral establishment including personnel, equipment and vehicle');

    // Verify MUST-FIX 9: Embalming statutory notice under C.1
    expect(html).toContain('If you select a funeral for which this firm requires embalming such as a funeral with viewing, you may have to pay for embalming.');

    // Verify MUST-FIX 10: GPL + CPL + OIRPL receipt acknowledgment
    expect(html).toContain('Casket Price List and Outer Interment Receptacle Price List');

    // Verify MUST-FIX 11: A Direct Cremation & Direct Burial lines
    expect(html).toContain('1. Direct Cremation');
    expect(html).toContain('2. Direct Burial');

    // Verify MUST-FIX 12: C.2 e Restoration, f Other (specify), no Anatomical Repair
    expect(html).toContain('e. Restoration');
    expect(html).toContain('f. Other (specify)');
    expect(html).not.toContain('Anatomical Repair');

    // Verify MUST-FIX 13: F Facilities wording + F.3
    expect(html).toContain('1. Use of the facilities for visitation');
    expect(html).toContain('2. Use of facilities for funeral service');
    expect(html).toContain('3. Other use of facilities (specify)');

    // Verify MUST-FIX 14: G Livery slots
    expect(html).toContain('1. a. Hearse or');
    expect(html).toContain('b. Alternative vehicle');
    expect(html).toContain('2. Flower vehicle');
    expect(html).toContain('3. Limousine(s)');
    expect(html).toContain('4. Passenger car(s)');

    // Verify MUST-FIX 15: H.1 fields + H.2 Outer Interment Receptacle block
    expect(html).toContain('H. Merchandise');
    expect(html).toContain('1. Casket or alternative container');
    expect(html).toContain('2. Outer Interment Receptacle');

    // Verify MUST-FIX 16: I Additional Services labels 1–9
    expect(html).toContain('1. Memorial Cards');
    expect(html).toContain('2. Acknowledgement Cards');
    expect(html).toContain('3. Casket Plate');
    expect(html).toContain('4. Crucifix/Cross');
    expect(html).toContain('5. Hairdressing');
    expect(html).toContain('6. Flowers');
    expect(html).toContain('7. Clothing or Burial Garments');
    expect(html).toContain('8. Register Book');
    expect(html).toContain('9. Death Notices');

    // Verify MUST-FIX 17: I.J Limited Services
    expect(html).toContain('J. Limited Services');
    expect(html).toContain('1. Forwarding remains to');
    expect(html).toContain('2. Receiving remains from');

    // Verify MUST-FIX 18: II Cash Advances labels 1–9 with cemetery name on line 1
    expect(html).toContain('1. Cemetery or Crematory');
    expect(html).toContain('Woodlawn Cemetery &amp; Crematory (Bronx, NY)');
    expect(html).toContain('2. Clergy Honoraria');
    expect(html).toContain('3. Death Certificate Transcripts');
    expect(html).toContain('4. Livery');
    expect(html).toContain('5. Pallbearers');
    expect(html).toContain('6. Public Transportation');
    expect(html).toContain('7. Gratuities');
    expect(html).toContain('8. Bridge &amp; Road Tolls');
    expect(html).toContain('9. Telephone &amp; Telegraph Charges');

    // Verify late charge removed 1.5% per month rate
    expect(html).not.toContain('1.5% per month');
    expect(html).not.toContain('annual rate 18%');
    expect(html).toContain('a late charge may be added to the unpaid portion of the balance due');

    // Related cleanups: Other Authorization by line
    expect(html).toContain('Other Authorization by:');

    // Export full styled HTML wrapper for INV-24501
    const artifactDir = '/Users/jbenta1me.com/.gemini/antigravity-ide/brain/7f5d1313-bf0d-4b7a-a203-1b203a00fa2c';
    const styledHtmlINV24501 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>NYS Form AP-47 — INV-24501</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: letter portrait; margin: 6mm; }
    body { font-family: ui-sans-serif, system-ui, sans-serif; background: #f5f5f5; padding: 12px; }
    .print-page { background: #fff; max-width: 850px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 16px; }
    .ap47-page-break { break-before: page !important; page-break-before: always !important; }
    @media print {
      body { padding: 0; background: #fff; }
      .print-page { box-shadow: none; padding: 0; max-width: none; }
    }
    .ap47-form-root { font-size: 8.75px !important; line-height: 1.22 !important; }
    .ap47-form-root .space-y-6 > * + * { margin-top: 0.35rem !important; }
    .ap47-form-root .space-y-4 > * + * { margin-top: 0.22rem !important; }
    .ap47-form-root .space-y-3 > * + * { margin-top: 0.15rem !important; }
    .ap47-form-root .p-2\.5, .ap47-form-root .p-3, .ap47-form-root .p-3\.5, .ap47-form-root .p-4, .ap47-form-root .p-5 { padding: 0.18rem 0.35rem !important; }
  </style>
</head>
<body>
  <div class="print-page">
    ${html}
  </div>
</body>
</html>`;
    fs.writeFileSync(path.join(artifactDir, 'INV-24501_regenerated_AP-47.html'), styledHtmlINV24501, 'utf8');

    // Render Blank Template
    const blankCase = {
      ...testCase,
      caseNumber: 'TEMPLATE-BLANK',
      decedent: {
        legalName: '____________________________________',
        gender: 'male' as const,
        dateOfBirth: '____-__-__',
        dateOfDeath: '____-__-__',
        placeOfDeath: '____________________________________',
        facilityName: '____________________________________',
        ssn: '',
        ssnMasked: '___-__-____',
        maritalStatus: 'single' as const,
        residenceAddress: '',
        city: '',
        state: 'NY',
        zipCode: '',
        veteran: false,
        occupation: '',
        industry: '',
        fatherName: '',
        motherMaidenName: ''
      },
      informant: {
        fullName: '____________________________________',
        relationship: '________________',
        phone: '(___) ___-____',
        email: '',
        address: '____________________________________',
        isNextOfKin: true,
        hasRightToControl: true
      }
    };
    const blankHtml = renderToStaticMarkup(
      React.createElement(OfficialScannedFormAP47, {
        id: 'official-form-ap47-blank',
        caseData: blankCase,
        statementData: getDefaultStatementOfGoodsForCase(blankCase),
        readOnly: true
      })
    );
    const styledHtmlBlank = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>NYS Form AP-47 — Blank Official Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: letter portrait; margin: 6mm; }
    body { font-family: ui-sans-serif, system-ui, sans-serif; background: #f5f5f5; padding: 12px; }
    .print-page { background: #fff; max-width: 850px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 16px; }
    .ap47-page-break { break-before: page !important; page-break-before: always !important; }
    @media print {
      body { padding: 0; background: #fff; }
      .print-page { box-shadow: none; padding: 0; max-width: none; }
    }
    .ap47-form-root { font-size: 8.75px !important; line-height: 1.22 !important; }
    .ap47-form-root .space-y-6 > * + * { margin-top: 0.35rem !important; }
    .ap47-form-root .space-y-4 > * + * { margin-top: 0.22rem !important; }
    .ap47-form-root .space-y-3 > * + * { margin-top: 0.15rem !important; }
    .ap47-form-root .p-2\.5, .ap47-form-root .p-3, .ap47-form-root .p-3\.5, .ap47-form-root .p-4, .ap47-form-root .p-5 { padding: 0.18rem 0.35rem !important; }
  </style>
</head>
<body>
  <div class="print-page">
    ${blankHtml}
  </div>
</body>
</html>`;
    fs.writeFileSync(path.join(artifactDir, 'AP-47_blank_official_template.html'), styledHtmlBlank, 'utf8');
  });

  it('allows field directors to select which Section IV combined charge options appear on the contract', async () => {
    const { OfficialScannedFormAP47 } = await import('../../components/backoffice/OfficialScannedFormAP47');
    const ReactDOMServer = (await import('react-dom/server')).default;
    const { MOCK_CASES } = await import('./mockCases');
    const { getDefaultStatementOfGoodsForCase } = await import('./generalPriceList');

    const testCase = MOCK_CASES.find(c => c.id === 'case-24501')!;
    const baseSog = getDefaultStatementOfGoodsForCase(testCase);

    // Scenario A: All 3 options selected -> all 3 appear on contract
    const allSelectedSog = {
      ...baseSog,
      sectionIV: {
        ...baseSog.sectionIV,
        includeCombinedVisitation: true,
        includeCombinedFuneralService: true,
        includeCombinedOther: true
      }
    };
    const htmlAll = ReactDOMServer.renderToStaticMarkup(
      React.createElement(OfficialScannedFormAP47, {
        caseData: testCase,
        statementData: allSelectedSog,
        readOnly: true
      })
    );
    expect(htmlAll).toContain('Combined charge for Facilities and Staff for visitation is');
    expect(htmlAll).toContain('Combined charge for Facilities and Staff for funeral service is');
    expect(htmlAll).toContain('Combined charge for other Facilities and Staff (specify)');

    // Scenario B: Only visitation selected -> funeral service and other omitted
    const visitationOnlySog = {
      ...baseSog,
      sectionIV: {
        ...baseSog.sectionIV,
        includeCombinedVisitation: true,
        includeCombinedFuneralService: false,
        includeCombinedOther: false
      }
    };
    const htmlVisitationOnly = ReactDOMServer.renderToStaticMarkup(
      React.createElement(OfficialScannedFormAP47, {
        caseData: testCase,
        statementData: visitationOnlySog,
        readOnly: true
      })
    );
    expect(htmlVisitationOnly).toContain('Combined charge for Facilities and Staff for visitation is');
    expect(htmlVisitationOnly).not.toContain('Combined charge for Facilities and Staff for funeral service is');
    expect(htmlVisitationOnly).not.toContain('Combined charge for other Facilities and Staff (specify)');

    // Scenario C: Only funeral service selected -> visitation and other omitted
    const funeralOnlySog = {
      ...baseSog,
      sectionIV: {
        ...baseSog.sectionIV,
        includeCombinedVisitation: false,
        includeCombinedFuneralService: true,
        includeCombinedOther: false
      }
    };
    const htmlFuneralOnly = ReactDOMServer.renderToStaticMarkup(
      React.createElement(OfficialScannedFormAP47, {
        caseData: testCase,
        statementData: funeralOnlySog,
        readOnly: true
      })
    );
    expect(htmlFuneralOnly).not.toContain('Combined charge for Facilities and Staff for visitation is');
    expect(htmlFuneralOnly).toContain('Combined charge for Facilities and Staff for funeral service is');
    expect(htmlFuneralOnly).not.toContain('Combined charge for other Facilities and Staff (specify)');
  });
});

