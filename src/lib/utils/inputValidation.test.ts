import { describe, it, expect } from 'vitest';
import { formatSSN, isValidSSN } from './inputValidation';

describe('SSN Formatting and Validation Engine', () => {
  it('correctly auto-formats 9 digit SSNs with standard hyphens', () => {
    expect(formatSSN('123456789')).toBe('123-45-6789');
    expect(formatSSN('12345')).toBe('123-45');
    expect(formatSSN('123')).toBe('123');
    expect(formatSSN('123-45-6789')).toBe('123-45-6789');
    expect(formatSSN('abc123def45gh6789xyz')).toBe('123-45-6789');
  });

  it('restricts input to maximum 9 numeric digits', () => {
    expect(formatSSN('123456789012345')).toBe('123-45-6789');
  });

  it('validates 9-digit completeness for death certificate compliance', () => {
    expect(isValidSSN('123-45-6789')).toBe(true);
    expect(isValidSSN('123456789')).toBe(true);
    expect(isValidSSN('123-45')).toBe(false);
    expect(isValidSSN('***-**-6789')).toBe(false);
    expect(isValidSSN('000-12-3456')).toBe(false); // Invalid area number
    expect(isValidSSN('')).toBe(false);
  });
});
