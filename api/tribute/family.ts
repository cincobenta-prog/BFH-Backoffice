/**
 * Family upload by magic link (no account).
 * GET  /api/tribute/family?token=...                      -> invite and case summary
 * POST /api/tribute/family  { token, action: 'sign', mediaType, contentType, fileName }
 *                                                          -> signed upload URL (photo, voice or video)
 * POST /api/tribute/family  { token, action: 'submit', contributorName, relation, caption?, text?, mediaType, storagePath?, consent }
 *                                                          -> saves a PENDING item for director approval
 * The token is hashed and looked up; expired, revoked or exhausted links are refused.
 */
import { configured, rest, sha256, body, signUpload, audit } from '../_lib/supabase';

const ALLOWED: Record<string, string[]> = {
  photo: ['image/jpeg', 'image/png', 'image/webp'],
  voice: ['audio/mpeg', 'audio/mp4', 'audio/webm'],
  video: ['video/mp4', 'video/webm']
};

async function findInvite(token: string) {
  if (!token || token.length < 20) return null;
  const rows = await rest(`tribute_invites?token_hash=eq.${sha256(token)}&select=*`);
  const inv = rows?.[0];
  if (!inv || inv.revoked_at || new Date(inv.expires_at) < new Date() || inv.uploads_used >= inv.max_uploads) return null;
  return inv;
}

export default async function handler(req: any, res: any) {
  if (!configured()) return res.status(503).json({ error: 'Server is not configured.' });
  try {
    if (req.method === 'GET') {
      const inv = await findInvite(String(req.query?.token || ''));
      if (!inv) return res.status(404).json({ error: 'This link is not valid or has expired.' });
      const [c] = await rest(`tribute_cases?case_id=eq.${encodeURIComponent(inv.case_id)}&select=display_name,date_of_birth,date_of_death,chapel_name`);
      if (!inv.opened_at) await rest(`tribute_invites?id=eq.${inv.id}`, { method: 'PATCH', body: { status: 'opened', opened_at: new Date().toISOString() }, prefer: 'return=minimal' });
      return res.status(200).json({ recipientName: inv.recipient_name, personalNote: inv.personal_note, case: c, remainingUploads: inv.max_uploads - inv.uploads_used });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use GET or POST.' });
    const b = body(req);
    const inv = await findInvite(String(b.token || ''));
    if (!inv) return res.status(404).json({ error: 'This link is not valid or has expired.' });

    if (b.action === 'sign') {
      const allowed = ALLOWED[b.mediaType];
      if (!allowed || !allowed.includes(b.contentType)) return res.status(400).json({ error: 'That file type is not accepted.' });
      const ext = String(b.contentType).split('/')[1].replace('mpeg', 'mp3');
      const path = `${inv.case_id}/${inv.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      return res.status(200).json({ storagePath: path, uploadUrl: await signUpload('tribute-media', path), maxBytes: 15728640 });
    }
    if (b.action === 'submit') {
      if (b.consent !== true) return res.status(400).json({ error: 'Please confirm that you agree to share this with the family.' });
      if (!ALLOWED[b.mediaType] && b.mediaType !== 'written') return res.status(400).json({ error: 'Unknown media type.' });
      if (b.storagePath && !String(b.storagePath).startsWith(`${inv.case_id}/${inv.id}/`)) return res.status(400).json({ error: 'Invalid file reference.' });
      const [item] = await rest('tribute_items', {
        method: 'POST',
        body: {
          case_id: inv.case_id, invite_id: inv.id,
          contributor_name: String(b.contributorName || inv.recipient_name).slice(0, 120),
          contributor_relation: b.relation ? String(b.relation).slice(0, 80) : null,
          media_type: b.mediaType, storage_path: b.storagePath || null,
          caption: b.caption ? String(b.caption).slice(0, 300) : null,
          raw_transcript: b.text ? String(b.text).slice(0, 5000) : null,
          consent_given: true, status: 'pending'
        }
      });
      await rest(`tribute_invites?id=eq.${inv.id}`, { method: 'PATCH', body: { uploads_used: inv.uploads_used + 1, status: 'recorded' }, prefer: 'return=minimal' });
      await audit('family:' + inv.id, 'item.submit', inv.case_id, item.id, { mediaType: b.mediaType });
      return res.status(200).json({ ok: true, itemId: item.id, message: 'Thank you. The family will review this before it is shown.' });
    }
    return res.status(400).json({ error: 'Unknown action.' });
  } catch (e: any) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.', detail: String(e.message).slice(0, 120) });
  }
}
