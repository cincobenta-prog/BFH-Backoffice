import { describe, it, expect } from 'vitest';
import { isoDateOrNull, tokenFromPath } from './tributeApi';

describe('tributeApi helpers', () => {
  it('accepts only ISO dates', () => {
    expect(isoDateOrNull('1941-03-09')).toBe('1941-03-09');
    expect(isoDateOrNull('March 9, 1941')).toBeNull();
    expect(isoDateOrNull(undefined)).toBeNull();
  });
  it('reads the family token from /u/<token>', () => {
    expect(tokenFromPath('/u/abcdefghijklmnopqrstuvwx')).toBe('abcdefghijklmnopqrstuvwx');
    expect(tokenFromPath('/u/short')).toBeNull();
    expect(tokenFromPath('/other/abcdefghijklmnopqrstuvwx')).toBeNull();
    expect(tokenFromPath('/')).toBeNull();
  });
});
