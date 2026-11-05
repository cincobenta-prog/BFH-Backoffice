/**
 * Server-only helpers for the Digi Tribute API. Files in api/_lib are not exposed as routes.
 * Uses the Supabase REST API with the service role key. That key must only exist in server env vars
 * (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). Never prefix it with VITE_.
 */
import { createHash, randomBytes } from 'node:crypto';

const URL_ = () => (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function configured(): boolean {
  return Boolean(URL_() && KEY());
}

export function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

export function newToken(): string {
  return randomBytes(24).toString('base64url');
}

export async function rest(path: string, init: { method?: string; body?: unknown; prefer?: string } = {}) {
  const r = await fetch(`${URL_()}/rest/v1/${path}`, {
    method: init.method || 'GET',
    headers: {
      apikey: KEY(),
      Authorization: `Bearer ${KEY()}`,
      'Content-Type': 'application/json',
      Prefer: init.prefer || 'return=representation'
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body)
  });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${text.slice(0, 200)}`);
  return data;
}

export async function signUpload(bucket: string, objectPath: string): Promise<string> {
  const r = await fetch(`${URL_()}/storage/v1/object/upload/sign/${bucket}/${objectPath}`, {
    method: 'POST',
    headers: { apikey: KEY(), Authorization: `Bearer ${KEY()}`, 'Content-Type': 'application/json' },
    body: '{}'
  });
  const j: any = await r.json();
  if (!r.ok || !j.url) throw new Error(`Storage sign failed: ${r.status}`);
  return `${URL_()}/storage/v1${j.url}`;
}

export async function signDownload(bucket: string, objectPath: string, seconds = 3600): Promise<string | null> {
  const r = await fetch(`${URL_()}/storage/v1/object/sign/${bucket}/${objectPath}`, {
    method: 'POST',
    headers: { apikey: KEY(), Authorization: `Bearer ${KEY()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: seconds })
  });
  const j: any = await r.json();
  return r.ok && j.signedURL ? `${URL_()}/storage/v1${j.signedURL}` : null;
}

/** Staff check: the caller sends a Supabase Auth access token whose app_metadata.role is manager, director or staff. */
export async function requireStaff(req: any): Promise<{ id: string; email: string; role: string } | null> {
  const h = String(req.headers?.authorization || '');
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  const r = await fetch(`${URL_()}/auth/v1/user`, { headers: { apikey: KEY(), Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const u: any = await r.json();
  const role = u?.app_metadata?.role;
  return ['manager', 'director', 'staff'].includes(role) ? { id: u.id, email: u.email, role } : null;
}

export function body(req: any): any {
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
}

export async function audit(actor: string, action: string, caseId?: string, itemId?: string, detail: object = {}) {
  try {
    await rest('tribute_audit', { method: 'POST', body: { actor, action, case_id: caseId, item_id: itemId, detail }, prefer: 'return=minimal' });
  } catch { /* audit failure must not block the request */ }
}
