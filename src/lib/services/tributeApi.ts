/**
 * Browser client for the Digi Tribute server functions (api/tribute/*).
 * Staff calls send the Supabase access token. Family calls send only the private link token.
 * No secrets live here.
 */
import { getSupabase } from '../auth/supabaseClient';

export function isoDateOrNull(v?: string): string | null {
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

async function staffHeaders(): Promise<Record<string, string>> {
  const sb = getSupabase();
  const { data } = sb ? await sb.auth.getSession() : { data: { session: null } as any };
  const t = data?.session?.access_token;
  if (!t) throw new Error('Please sign in as staff first.');
  return { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
}

async function json(res: Response) {
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || `Request failed (${res.status})`);
  return j;
}

export interface TributeItemRow {
  id: string;
  contributor_name: string;
  contributor_relation?: string | null;
  media_type: 'voice' | 'video' | 'written' | 'photo';
  caption?: string | null;
  raw_transcript?: string | null;
  status: 'pending' | 'approved' | 'featured' | 'archived';
  created_at: string;
  mediaUrl?: string | null;
}

export async function createInvite(p: {
  caseId: string; displayName: string; dateOfBirth?: string; dateOfDeath?: string;
  recipientName: string; recipientContact?: string; channel: 'sms' | 'email' | 'whatsapp'; personalNote?: string;
}): Promise<{ inviteId: string; link: string; expiresAt: string }> {
  return json(await fetch('/api/tribute/invite', {
    method: 'POST', headers: await staffHeaders(),
    body: JSON.stringify({ ...p, dateOfBirth: isoDateOrNull(p.dateOfBirth), dateOfDeath: isoDateOrNull(p.dateOfDeath) })
  }));
}

export async function listItems(caseId: string): Promise<TributeItemRow[]> {
  const j = await json(await fetch(`/api/tribute/moderate?caseId=${encodeURIComponent(caseId)}`, { headers: await staffHeaders() }));
  return j.items as TributeItemRow[];
}

export async function moderateItem(itemId: string, status: TributeItemRow['status']) {
  return json(await fetch('/api/tribute/moderate', { method: 'POST', headers: await staffHeaders(), body: JSON.stringify({ itemId, status }) }));
}

export async function setPublished(caseId: string, publish: boolean, publicSlug?: string) {
  return json(await fetch('/api/tribute/moderate', { method: 'POST', headers: await staffHeaders(), body: JSON.stringify({ caseId, publish, publicSlug }) }));
}

// ---- family (no account) ----
export async function familyInfo(token: string) {
  return json(await fetch(`/api/tribute/family?token=${encodeURIComponent(token)}`));
}

export async function familySubmit(p: {
  token: string; contributorName: string; relation?: string; mediaType: 'written' | 'photo' | 'voice' | 'video';
  text?: string; caption?: string; storagePath?: string; consent: boolean;
}) {
  return json(await fetch('/api/tribute/family', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'submit', ...p }) }));
}

/** Uploads one file: asks the server for a signed URL, then sends the file straight to storage. Returns the storage path. */
export async function familyUpload(token: string, mediaType: 'photo' | 'voice' | 'video', file: File): Promise<string> {
  const signed = await json(await fetch('/api/tribute/family', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'sign', token, mediaType, contentType: file.type, fileName: file.name })
  }));
  if (file.size > (signed.maxBytes || 15728640)) throw new Error('That file is too large (15 MB maximum).');
  const put = await fetch(signed.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
  if (!put.ok) throw new Error('The upload did not finish. Please try again.');
  return signed.storagePath as string;
}

/** Reads the private link token from a path like /u/<token>. */
export function tokenFromPath(path: string): string | null {
  const m = /^\/u\/([A-Za-z0-9_-]{20,})\/?$/.exec(path);
  return m ? m[1] : null;
}
