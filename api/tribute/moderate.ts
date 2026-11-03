/**
 * Staff moderation.
 * GET  /api/tribute/moderate?caseId=...   (staff) -> items with short-lived signed media URLs, newest first
 * POST /api/tribute/moderate { itemId, status: 'approved'|'featured'|'archived'|'pending', includeInBook?, includeInSlideshow?, caption? } (staff)
 * POST /api/tribute/moderate { caseId, publish: true|false, publicSlug?, theme?, secondsPerPhoto? } (staff) -> publish or unpublish the tribute page
 */
import { configured, requireStaff, rest, body, signDownload, audit } from '../_lib/supabase';

export default async function handler(req: any, res: any) {
  if (!configured()) return res.status(503).json({ error: 'Server is not configured.' });
  const staff = await requireStaff(req);
  if (!staff) return res.status(401).json({ error: 'Staff sign-in required.' });
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '');
      if (!caseId) return res.status(400).json({ error: 'caseId is required.' });
      const items = await rest(`tribute_items?case_id=eq.${encodeURIComponent(caseId)}&select=*&order=created_at.desc`);
      for (const it of items) it.mediaUrl = it.storage_path ? await signDownload('tribute-media', it.storage_path) : null;
      return res.status(200).json({ items });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use GET or POST.' });
    const b = body(req);
    if (b.itemId) {
      if (!['pending', 'approved', 'featured', 'archived'].includes(b.status)) return res.status(400).json({ error: 'Invalid status.' });
      const patch: any = { status: b.status, is_featured: b.status === 'featured' };
      if (['approved', 'featured'].includes(b.status)) { patch.approved_at = new Date().toISOString(); patch.approved_by = staff.email; }
      if (typeof b.includeInBook === 'boolean') patch.include_in_book = b.includeInBook;
      if (typeof b.includeInSlideshow === 'boolean') patch.include_in_slideshow = b.includeInSlideshow;
      if (typeof b.caption === 'string') patch.caption = b.caption.slice(0, 300);
      const [row] = await rest(`tribute_items?id=eq.${encodeURIComponent(b.itemId)}`, { method: 'PATCH', body: patch });
      await audit(staff.email, 'item.' + b.status, row?.case_id, b.itemId);
      return res.status(200).json({ item: row });
    }
    if (b.caseId && typeof b.publish === 'boolean') {
      const patch: any = { status: b.publish ? 'published' : 'draft', updated_at: new Date().toISOString() };
      if (b.publish) {
        const slug = String(b.publicSlug || '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
        if (!slug) return res.status(400).json({ error: 'publicSlug is required to publish.' });
        patch.public_slug = slug;
      }
      if (['classic', 'evening', 'garden'].includes(b.theme)) patch.theme = b.theme;
      if (Number(b.secondsPerPhoto) >= 3 && Number(b.secondsPerPhoto) <= 10) patch.seconds_per_photo = Number(b.secondsPerPhoto);
      const [row] = await rest(`tribute_cases?case_id=eq.${encodeURIComponent(b.caseId)}`, { method: 'PATCH', body: patch });
      await audit(staff.email, b.publish ? 'case.publish' : 'case.unpublish', b.caseId);
      return res.status(200).json({ case: row });
    }
    return res.status(400).json({ error: 'Nothing to do.' });
  } catch (e: any) {
    return res.status(500).json({ error: 'Could not complete the request.', detail: String(e.message).slice(0, 120) });
  }
}
