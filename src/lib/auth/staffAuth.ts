/**
 * Staff session logic (pure helpers + one hook). The role comes from app_metadata.role, which only the
 * server can set. A signed-in user without a staff role is treated as NOT authorized.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, STAFF_ROLES, StaffRole } from './supabaseClient';

export const IDLE_MINUTES = 30;

export function roleFromSession(session: Session | null): StaffRole | null {
  const r = (session?.user?.app_metadata as any)?.role;
  return STAFF_ROLES.includes(r) ? (r as StaffRole) : null;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'unauthorized'; email: string }
  | { status: 'ready'; email: string; role: StaffRole; accessToken: string };

export function useStaffAuth() {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const sb = getSupabase();
  const idleTimer = useRef<number | undefined>(undefined);

  const apply = useCallback((session: Session | null) => {
    if (!session) return setState({ status: 'signedOut' });
    const role = roleFromSession(session);
    const email = session.user.email || '';
    setState(role ? { status: 'ready', email, role, accessToken: session.access_token } : { status: 'unauthorized', email });
  }, []);

  useEffect(() => {
    if (!sb) return setState({ status: 'signedOut' });
    sb.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => apply(session));
    return () => sub.subscription.unsubscribe();
  }, [sb, apply]);

  // Sign out after IDLE_MINUTES without activity (shared tablets).
  useEffect(() => {
    if (state.status !== 'ready' || !sb) return;
    const reset = () => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => { sb.auth.signOut(); }, IDLE_MINUTES * 60 * 1000);
    };
    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { events.forEach((e) => window.removeEventListener(e, reset)); window.clearTimeout(idleTimer.current); };
  }, [state.status, sb]);

  const sendLink = useCallback(async (email: string) => {
    if (!sb) return { ok: false, message: 'Sign-in is not configured (missing Supabase URL or key).' };
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin }
    });
    // Same message either way, so the form does not reveal which emails are staff accounts.
    if (error && /rate|limit|too many/i.test(error.message)) return { ok: false, message: 'Too many requests. Wait a minute and try again.' };
    if (error && (!(error as any).status || /fetch|network/i.test(error.message))) return { ok: false, message: 'Could not reach the sign-in service. Check your connection and try again.' };
    return { ok: true, message: 'If that email belongs to a staff account, a sign-in link has been sent.' };
  }, [sb]);

  const signOut = useCallback(() => { sb?.auth.signOut(); }, [sb]);

  return { state, sendLink, signOut };
}
