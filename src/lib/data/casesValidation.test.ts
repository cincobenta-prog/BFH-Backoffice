import { describe, it, expect } from 'vitest';
import { MOCK_CASES, INITIAL_CALENDAR_EVENTS, INITIAL_SERVICE_ASSIGNMENTS, INITIAL_1099_VOUCHERS } from './mockCases';
import { TEST_CASE_AP47_FIXTURE } from './testFixtures';

describe('Clean State Verification — Live Operation Mode', () => {
  it('contains zero mock cases in back office system for clean live deployment', () => {
    expect(MOCK_CASES).toHaveLength(0);
  });

  it('contains zero mock calendar events, livery holds, or assignments', () => {
    expect(INITIAL_CALENDAR_EVENTS).toHaveLength(0);
    expect(INITIAL_SERVICE_ASSIGNMENTS).toHaveLength(0);
    expect(INITIAL_1099_VOUCHERS).toHaveLength(0);
  });

  it('preserves complete test fixture for legal AP-47 validation suite', () => {
    expect(TEST_CASE_AP47_FIXTURE).toBeDefined();
    expect(TEST_CASE_AP47_FIXTURE.caseNumber).toBe('24501');
    expect(TEST_CASE_AP47_FIXTURE.vitalRecordsSheet).toBeDefined();
    expect(TEST_CASE_AP47_FIXTURE.statementOfGoods).toBeDefined();
    expect(TEST_CASE_AP47_FIXTURE.statementOfGoods?.sectionI.totalFuneralHomeCharges).toBeGreaterThan(0);
  });
});
