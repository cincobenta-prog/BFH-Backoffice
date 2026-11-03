# Staff sign-in design (Supabase Auth)

Status: design for review. Nothing implemented or configured yet.

## Why
Today access control is entirely in the browser:
- The current role (`manager`, `director`, `family`, ...) is React state (`currentRole` in `src/App.tsx`) and the role switcher can change it.
- The "signed" session in `src/lib/storage/sessionAuth.ts` uses a 32-bit checksum with a hardcoded salt, so anyone with the page source can forge it.
- The manager PIN is checked in the browser and stored in localStorage.
(Confirm by trying the role switcher in a private window. This is from reading the code.)
Any server endpoint that returns family data therefore needs its own, real check. The Digi Tribute staff endpoints already expect a Supabase Auth token.

## Design
- **Identity:** Supabase Auth. Staff sign in with an email link (magic link) or email plus password. Managers add a second factor (authenticator app, TOTP).
- **Roles:** stored in `app_metadata.role` (`manager`, `director`, `staff`, `accounting`). `app_metadata` can only be set by the server (service role), never by the user. Do not use `user_metadata` for roles.
- **Family:** not a staff account. Families use private magic links (invite tokens) that reach only the family endpoints. No Supabase user is created for them.
- **Server check:** every staff endpoint calls `requireStaff` (exists in `api/_lib/supabase.ts`), plus a new `requireRole(['manager'])` for sensitive actions (payments, check issuing, contracts).
- **Database check:** when cases move to Supabase tables, row level security policies read `auth.jwt() -> 'app_metadata' ->> 'role'`, so even a leaked anon key cannot read case data.
- **PIN:** becomes a step-up confirmation for risky actions, verified on the server (`/api/auth/elevate`, rate limited, hashed PIN stored in a `staff_profiles` table), not in the browser.
- **Sessions:** short access tokens with refresh. Sign out after 30 minutes idle on the shared front-office and sanctuary tablets.

## Setup steps (Supabase dashboard and one SQL statement)
1. Authentication > Providers: enable Email. Disable "Allow new users to sign up" (invite staff only).
2. Authentication > URL configuration: set the site URL to the back office address, and allow the Vercel preview and production URLs.
3. Authentication > SMTP: add a real sender (the built-in email service is rate limited and not for production).
4. Invite your own email, then make it a manager:
   `update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"role":"manager"}' where email = '<your email>';`
5. Add `staff_profiles` (user_id, display_name, director_id, active, pin_hash) in a later migration.

## Rollout
1. Add a login screen behind a flag (`VITE_AUTH_MODE=supabase`). Pilot with one account. The old flow keeps working.
2. Send all new server endpoints (Digi Tribute, then others) through `requireStaff`.
3. Move cases and documents to Supabase tables with RLS. Remove SSN and other unneeded sensitive fields from anything synced.
4. Remove the role switcher, the client-signed session and the client PIN gate. Then turn the flag on for everyone.

## Not solved by this alone
- Data already in browsers' localStorage stays there until step 3 migrates and clears it.
- Staff devices still need screen locks and updates.
- Backups, retention and a privacy policy are separate tasks.
