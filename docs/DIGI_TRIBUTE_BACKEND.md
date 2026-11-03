# Digi Tribute backend (branch: digi-tribute-backend)

Status: draft, not deployed, database migration NOT applied.

## Files
- `supabase/migrations/20261103000000_digi_tribute.sql` tables `tribute_cases`, `tribute_invites`, `tribute_items`, `tribute_audit`, private bucket `tribute-media` (15 MB limit, restricted types). RLS on, no policies: only the server can read or write.
- `api/_lib/supabase.ts` server helpers (REST, signed URLs, staff check, audit).
- `api/tribute/invite.ts` staff creates a case tribute and a private family link (token stored as a hash).
- `api/tribute/family.ts` family upload by link: signed upload URL, then a PENDING item with consent.
- `api/tribute/moderate.ts` staff list, approve, feature, archive, publish.
- `api/tribute/public.ts` public page data for published tributes (approved items only).

## Before this can run
1. Review and apply the migration to the Supabase project.
2. Add server-only env vars in Vercel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TRIBUTE_PUBLIC_BASE_URL`.
3. Staff endpoints require a Supabase Auth access token whose `app_metadata.role` is `manager`, `director` or `staff`. The back office currently signs staff in with a PIN, not Supabase Auth, so staff sign-in must move to Supabase Auth (or a server-checked session) first.
4. Wire the existing Digital Tribute Studio screens to these endpoints (not done yet).

## Not tested
Written without running against a live database. Treat as a first draft for review.
