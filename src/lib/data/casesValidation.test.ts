import { describe, it, expect } from 'vitest';
import { MOCK_CASES, INITIAL_CALENDAR_EVENTS, INITIAL_SERVICE_ASSIGNMENTS } from './mockCases';
import { TEST_CASE_AP47_FIXTURE } from './testFixtures';

describe('Active Real Cases Verification — Live Operation Mode', () => {
  it('contains 5 active real cases in back office system for operational review', () => {
    expect(MOCK_CASES).toHaveLength(5);
    const caseNumbers = MOCK_CASES.map(c => c.caseNumber);
    expect(caseNumbers).toEqual(expect.arrayContaining(['24508', '24507', '24506', '24502', '24500']));
  });

  it('contains active calendar events and service assignments for operational review', () => {
    expect(INITIAL_CALENDAR_EVENTS.length).toBeGreaterThan(0);
    expect(INITIAL_SERVICE_ASSIGNMENTS.length).toBeGreaterThan(0);
  });

  it('preserves complete test fixture for legal AP-47 validation suite', () => {
    expect(TEST_CASE_AP47_FIXTURE).toBeDefined();
    expect(TEST_CASE_AP47_FIXTURE.caseNumber).toBe('24501');
    expect(TEST_CASE_AP47_FIXTURE.vitalRecordsSheet).toBeDefined();
    expect(TEST_CASE_AP47_FIXTURE.statementOfGoods).toBeDefined();
    expect(TEST_CASE_AP47_FIXTURE.statementOfGoods?.sectionI.totalFuneralHomeCharges).toBeGreaterThan(0);
  });
});
