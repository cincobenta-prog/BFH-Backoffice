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

## Screens (added 2026-11-03)
- `src/components/family/FamilyUploadPage.tsx`: public page at `/u/<private token>` (no staff sign-in). Name, relation, memory text, photos/audio/video, consent box. Submits as PENDING. Wired in `src/main.tsx`.
- `src/components/family/TributeLiveServerPanel.tsx`: staff panel, new "Live Tribute" tab in the Digital Tribute Studio. Create a private family link, review and approve or hide contributions (photo, audio and video previews), publish or unpublish the page address.
- `src/lib/services/tributeApi.ts`: browser client for `api/tribute/*` plus tests.
The existing demo tabs (Share a Memory, Coffee Table Book, Funeral Admin, Cloud Sync) are unchanged and still use sample data.

### What still blocks real use
1. Apply the migration to Supabase and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TRIBUTE_PUBLIC_BASE_URL` as server env vars in Vercel.
2. `npm run dev` does not run the `api/` functions. Test locally with `vercel dev`, or on a Vercel preview deployment of this branch.
3. Sending the link by email or text is not automated yet. The panel shows the link to copy. (Twilio SMS can be added through the existing `/api/twilio/sms` function.)
4. The public tribute page `/t/<slug>` (reads `api/tribute/public.ts`) is not built yet.
5. Tested only with the server mocked. Not tested against a live database.
