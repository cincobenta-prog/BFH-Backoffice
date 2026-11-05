/**
 * Supabase browser client for STAFF sign-in only.
 * Uses the public URL and the publishable (anon) key. Never put a service role key here.
 * Sign-in is switched on with VITE_AUTH_MODE=supabase. When the flag is off the app behaves as before.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const AUTH_MODE: 'supabase' | 'legacy' = env.VITE_AUTH_MODE === 'supabase' ? 'supabase' : 'legacy';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = (env.VITE_SUPABASE_URL || '').trim();
  const key = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
    });
  }
  return client;
}

export type StaffRole = 'manager' | 'director' | 'staff' | 'accounting';
export const STAFF_ROLES: StaffRole[] = ['manager', 'director', 'staff', 'accounting'];
