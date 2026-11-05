/**
 * GET /api/tribute/public?slug=...
 * Public tribute page data. Returns nothing unless the director has published the tribute.
 * Only approved or featured items are returned, with 1-hour signed media URLs. No contact details, no consent flags.
 */
import { configured, rest, signDownload } from '../_lib/supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });
  if (!configured()) return res.status(503).json({ error: 'Server is not configured.' });
  try {
    const slug = String(req.query?.slug || '').toLowerCase();
    if (!/^[a-z0-9-]{3,60}$/.test(slug)) return res.status(404).json({ error: 'Not found.' });
    const [c] = await rest(`tribute_cases?public_slug=eq.${slug}&status=eq.published&select=case_id,display_name,date_of_birth,date_of_death,chapel_name,service_summary,theme,seconds_per_photo`);
    if (!c) return res.status(404).json({ error: 'Not found.' });
    const items = await rest(`tribute_items?case_id=eq.${encodeURIComponent(c.case_id)}&status=in.(approved,featured)&select=id,contributor_name,contributor_relation,media_type,storage_path,caption,raw_transcript,is_featured,include_in_slideshow&order=created_at.asc`);
    for (const it of items) { it.mediaUrl = it.storage_path ? await signDownload('tribute-media', it.storage_path) : null; delete it.storage_path; }
    res.setHeader('Cache-Control', 'public, max-age=60');
    const { case_id, ...pub } = c;
    return res.status(200).json({ tribute: pub, items });
  } catch {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
