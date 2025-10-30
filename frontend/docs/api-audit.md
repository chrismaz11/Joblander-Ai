# Supabase & API Integration Audit

This checklist highlights the key server endpoints and the Supabase-backed data they touch. Use it while executing the system test plan to confirm production readiness.

## Authentication / Session
- `/api/login` / `/api/logout` / `/api/auth/user`: session-backed, relies on `storage.getUser` / `storage.upsertUser`.
- Verify Supabase `users` table contains `tier`, `profileImageUrl`, `stripeCustomerId`, etc.
- Confirm session cookie persistence across refresh and logout.

## Resume Workflows
- `POST /api/generate-resume`: writes to `resumes` table; enforces tiers via `usage_tracking`.
- `GET /api/resumes` / `PATCH /api/resumes/:id` / `DELETE /api/resumes/:id`: ensure `userId` matches session, data round-trips with new builder.
- `POST /api/parse-resume`: hybrid AI/OCR parse path, no DB write but prerequisite for builder.
- `POST /api/resumes` (manual create) and `/api/resumes/:id` update path: used by new `ResumeBuilder` UX.

### Tables to Inspect
- `resumes`: JSON fields `personalInfo`, `experience`, etc. Confirm default values & timestamps.
- `usage_tracking`: counts resume creation per user to enforce limits.

## Cover Letters
- `POST /api/generate-coverletter`: reads `resumes`, writes to `cover_letters` (variants JSON).
- `GET /api/cover-letters`: new endpoint returning user-scoped cover letters + resume title.
- Table: `cover_letters` with fields `tone`, `variants`, `jobDescription`.

## Jobs & Search
- `GET /api/find-jobs`: hybrid sample/JSearch feed; confirm filters and semantics.
- Saved/applied state still local—plan for Supabase persistence (future).

## Portfolio & Export
- `POST /api/generate-portfolio`, `POST /api/portfolio/export`: require resume + uses Drizzle to read.
- `GET /api/portfolio/themes|fonts|layouts`: served from service helpers.
- Smoke test downloads/instructions.

## Verification & Blockchain
- `/api/verify-on-chain`, `/api/check-verification/:hash`, `/api/verify-resume`, `/api/estimate-gas`: rely on storage for lookups; ensure environment contains chain credentials.

## Billing / Stripe
- `/api/create-subscription`, `/api/cancel-subscription`, `/api/stripe-webhook`: confirm Supabase `subscriptions` table updates and `users.tier` transitions.

## Required Environment Variables (sample)
- `DATABASE_URL` (Supabase / Postgres)
- `SESSION_SECRET`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- JSearch: `JSEARCH_API_KEY`
- Blockchain: credentials in `server/services/blockchain`

## Testing Notes
- Seed at least one user, resume, cover letter, job to validate dashboards.
- Watch for 401/403 responses; session misconfiguration blocks most API calls.
- Document each endpoint verification in the system test report.
