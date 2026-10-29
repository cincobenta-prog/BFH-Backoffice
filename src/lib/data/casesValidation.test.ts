import { describe, it, expect } from 'vitest';
import { MOCK_CASES, INITIAL_CALENDAR_EVENTS, INITIAL_SERVICE_ASSIGNMENTS, INITIAL_1099_VOUCHERS } from './mockCases';

describe('Real Cases Verification', () => {
  it('contains exactly 10 real cases and no legacy cases', () => {
    expect(MOCK_CASES).toHaveLength(10);
    const caseNumbers = MOCK_CASES.map(c => c.caseNumber);
    expect(caseNumbers).toEqual([
      '24501',
      '24499',
      '24502',
      '24486',
      '24483',
      '24485',
      '24503',
      '24505',
      '24506',
      '24458'
    ]);
  });

  it('all cases have complete vitalRecordsSheet and statementOfGoods', () => {
    MOCK_CASES.forEach(c => {
      expect(c.vitalRecordsSheet).toBeDefined();
      expect(c.vitalRecordsSheet?.decedentFirstName).toBeTruthy();
      expect(c.vitalRecordsSheet?.informantName).toBeTruthy();
      expect(c.statementOfGoods).toBeDefined();
      expect(c.statementOfGoods?.sectionI.totalFuneralHomeCharges).toBeGreaterThan(0);
      expect(c.statementOfGoods?.sectionIII.totalFuneralCharges).toBeGreaterThan(0);
    });
  });

  it('Arthur Mayfield has zero balance due with $14,261.50 in credits', () => {
    const mayfield = MOCK_CASES.find(c => c.caseNumber === '24502');
    expect(mayfield).toBeDefined();
    expect(mayfield?.totalAmountDue).toBe(14261.50);
    expect(mayfield?.totalPaid).toBe(14261.50);
    expect(mayfield?.statementOfGoods?.sectionIII.balanceDue).toBe(0);
  });

  it('Donna Marie Green has $500 courtesy discount applied', () => {
    const green = MOCK_CASES.find(c => c.caseNumber === '24458');
    expect(green).toBeDefined();
    expect(green?.totalAmountDue).toBe(9937.10);
    expect(green?.totalPaid).toBe(500.00);
    expect(green?.statementOfGoods?.sectionIII.balanceDue).toBe(9437.10);
  });

  it('no previous mock case names remain in calendar or assignments', () => {
    INITIAL_CALENDAR_EVENTS.forEach(evt => {
      expect(evt.caseId.startsWith('case-24')).toBe(true);
    });
    INITIAL_SERVICE_ASSIGNMENTS.forEach(asgn => {
      expect(asgn.caseId.startsWith('case-24')).toBe(true);
    });
    INITIAL_1099_VOUCHERS.forEach(vch => {
      expect(vch.caseNumber.startsWith('24')).toBe(true);
    });
  });
});
