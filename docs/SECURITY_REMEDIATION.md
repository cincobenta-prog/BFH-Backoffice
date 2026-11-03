# Security remediation plan (written 2026-11-03)

Do these before real family data goes into the system. Ordered by risk and effort.

## 1. Make the repository private (10 minutes)
GitHub > BFH-Backoffice > Settings > General > Danger Zone > Change repository visibility > Make private.
Vercel keeps deploying from private repos through its GitHub connection. Check the Vercel project still builds after the change.
Assume everything already in the public history has been seen. Do the next step.

## 2. Treat the hardcoded credentials in the code as exposed (1-2 hours)
Search results on the current tree show fallback "secret" strings in:
- `src/lib/services/stripePaymentService.ts` (secret key and webhook secret defaults)
- `src/lib/services/quickbooksService.ts` (client secret default)
- `src/lib/services/docusignService.ts` (integration key, account id, user id, client secret defaults)
- `scripts/set-stripe.cjs`
Most look like placeholders (Stripe-shaped strings that are not valid keys). The DocuSign values look like real UUIDs. For each service, check whether the value was ever real:
- If yes: rotate it in that provider's dashboard now, then store the new one only as a server-side Vercel environment variable.
- If it is a placeholder: delete it from the code anyway, so no real key is ever pasted next to it.
Then remove the defaults (use empty strings) and make "live" mode depend on a server check, not on a non-empty string.
Also scan git history: `git log -p -S'sk_live' --all` and `gitleaks detect` (free) to catch older values.
Good news checked today: the Vercel project `bfh-backoffice` has no environment variables set, so no VITE_ secrets are currently baked into the deployed site.

## 3. Move every server secret out of the browser (1-3 days)
Anything named `VITE_*` is compiled into the public JavaScript. Secrets currently read that way:
`VITE_TWILIO_AUTH_TOKEN`, `VITE_STRIPE_SECRET_KEY`, `VITE_STRIPE_WEBHOOK_SECRET`, `VITE_QBO_CLIENT_SECRET`, `VITE_DOCUSIGN_CLIENT_SECRET`, `VITE_DOCUSIGN_RSA_PRIVATE_KEY`, `VITE_AWS_SECRET_ACCESS_KEY`, `VITE_EDRS_HCS_TOKEN`.
Plan, one integration at a time (Twilio first, since `api/twilio/sms.ts` already exists):
1. Set the secret as a non-VITE Vercel variable (for example `TWILIO_AUTH_TOKEN`).
2. Change the client service to call the `/api/...` function only and never hold the secret.
3. Delete the `VITE_` variable, its entry in `src/vite-env.d.ts`, the `scripts/set-*.cjs` that write it, and the settings modals that let staff type it into the browser (those store secrets in localStorage).
Public identifiers (Stripe publishable key, Supabase URL, Supabase publishable/anon key) may stay `VITE_`.

## 4. Replace the fake "encryption" (2-3 days)
`src/lib/storage/persistence.ts` uses a hardcoded seed and a simple generator (FNV-1a and a linear congruential stream) and describes it as AES-256. It protects against casual viewing only. Anyone with the page source can decrypt it.
Fix in two layers:
- **Real protection is server-side.** Move cases and family data to Supabase with row level security and staff sign-in through Supabase Auth. Then the browser holds only what the signed-in staff member may see.
- **Local cache (offline use) gets real encryption.** Use the browser's Web Crypto API: AES-GCM with a non-extractable key per device, kept in IndexedDB and unlocked by the staff session. Write new data as `enc:v2:`; on read, decrypt old `enc:v1:` data and re-save it as v2 (migration). Remove the hardcoded seed. Rename the README claim until this ships.
Note: the current encrypt/decrypt functions are synchronous and used across the app. Web Crypto is asynchronous, so this change touches every caller. Do it as its own change with tests (`persistence.test.ts` exists).

## 5. Also recommended
- Staff sign-in: replace the PIN-only login with Supabase Auth (email link) plus roles in `app_metadata`. Needed for the Digi Tribute staff endpoints.
- Remove SSN and other sensitive fields from anything synced to the cloud unless it is encrypted and access-controlled.
- Turn on GitHub secret scanning and push protection in the repository settings.
- Add a short privacy policy and retention rule before families upload photos.
