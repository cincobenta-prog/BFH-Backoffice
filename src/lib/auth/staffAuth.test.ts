import { describe, it, expect } from 'vitest';
import { roleFromSession } from './staffAuth';

const sess = (app_metadata: any, user_metadata: any = {}) => ({ user: { app_metadata, user_metadata } } as any);

describe('roleFromSession', () => {
  it('returns the role from app_metadata', () => {
    expect(roleFromSession(sess({ role: 'manager' }))).toBe('manager');
    expect(roleFromSession(sess({ role: 'director' }))).toBe('director');
  });
  it('rejects unknown roles, missing roles and no session', () => {
    expect(roleFromSession(sess({ role: 'admin' }))).toBeNull();
    expect(roleFromSession(sess({}))).toBeNull();
    expect(roleFromSession(null)).toBeNull();
  });
  it('ignores a role placed in user_metadata (user-editable)', () => {
    expect(roleFromSession(sess({}, { role: 'manager' }))).toBeNull();
  });
});
