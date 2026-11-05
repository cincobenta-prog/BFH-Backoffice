/**
 * POST /api/tribute/invite   (staff only)
 * Creates (or updates) the tribute for a case and issues a private family link.
 * Body: { caseId, displayName, dateOfBirth?, dateOfDeath?, chapelName?, serviceSummary?, recipientName, recipientContact?, channel, personalNote?, expiresInDays? }
 * Returns the one-time magic link. Only the token hash is stored.
 */
import { configured, requireStaff, rest, sha256, newToken, body, audit } from '../_lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!configured()) return res.status(503).json({ error: 'Server is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).' });
  const staff = await requireStaff(req);
  if (!staff) return res.status(401).json({ error: 'Staff sign-in required.' });
  try {
    const b = body(req);
    if (!b.caseId || !b.displayName || !b.recipientName || !['sms', 'email', 'whatsapp'].includes(b.channel)) {
      return res.status(400).json({ error: 'caseId, displayName, recipientName and a valid channel are required.' });
    }
    await rest('tribute_cases?on_conflict=case_id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: {
        case_id: String(b.caseId), display_name: String(b.displayName).slice(0, 200),
        date_of_birth: b.dateOfBirth || null, date_of_death: b.dateOfDeath || null,
        chapel_name: b.chapelName || null, service_summary: b.serviceSummary || {}, updated_at: new Date().toISOString()
      }
    });
    const token = newToken();
    const days = Math.min(Math.max(Number(b.expiresInDays) || 14, 1), 60);
    const [inv] = await rest('tribute_invites', {
      method: 'POST',
      body: {
        case_id: String(b.caseId), recipient_name: String(b.recipientName).slice(0, 120),
        recipient_contact: b.recipientContact || null, channel: b.channel, token_hash: sha256(token),
        personal_note: b.personalNote ? String(b.personalNote).slice(0, 500) : null,
        expires_at: new Date(Date.now() + days * 86400000).toISOString(), created_by: staff.email
      }
    });
    await audit(staff.email, 'invite.create', String(b.caseId), undefined, { invite: inv.id, channel: b.channel });
    const base = process.env.TRIBUTE_PUBLIC_BASE_URL || 'https://tributes.e-bfh.com';
    return res.status(200).json({ inviteId: inv.id, link: `${base}/u/${token}`, expiresAt: inv.expires_at });
  } catch (e: any) {
    return res.status(500).json({ error: 'Could not create the invitation.', detail: String(e.message).slice(0, 160) });
  }
}
