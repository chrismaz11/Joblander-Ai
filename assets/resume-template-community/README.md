# ResumeLaunch

ResumeLaunch is a SaaS resume builder that combines editable premium templates, AI-assisted writing, and gated exports. Free members can draft and autosave resumes in the cloud, while paid tiers unlock watermark-free downloads, analytics, and interview resources.

## Architecture
- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind v4) deployed to Vercel Hobby.
- **Auth & Database**: Supabase (Postgres + Auth) with row-level security and autosave support.
- **Payments**: Stripe Checkout + Billing Portal for $1.99 trials, recurring subscriptions, and one-off export credits.
- **Exports**: `@react-pdf/renderer` (server actions/functions) with future fallbacks for DOCX.
- **State/Validation**: `zustand` for client stores, `react-hook-form` + `zod` for structured resume data.

## Pricing Baseline
| Plan | Price | Billing | Notes |
| --- | --- | --- | --- |
| Free | $0 | n/a | 1 cloud resume, autosave, 3 starter templates, branded preview exports |
| Pro Monthly | $11.99 | Every 4 weeks (after $1.99 7-day trial) | Unlimited resumes/templates, PDF/DOCX exports, AI suggestions, priority support |
| Pro Quarterly | $27.99 | Every 3 months | Adds ATS scoring, keyword insights, cover-letter generator |
| Pro Annual | $79.99 | Yearly | Adds interview prep workbook, expert review credit, early template drops |
| Resume Credit Pack | $4.99 | One-time | One premium export + 24 hours of template access |

## Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` for the marketing site. Sensitive routes (checkout/webhooks) require environment variables.

## Environment Variables
Copy `.env.example` to `.env.local` and populate the keys below. DO NOT commit `.env.local`.

### Supabase
1. Create a new Supabase project (free tier).
2. Go to **Project Settings → API**.
3. Copy values into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (used only in server actions; keep private).

### Authentication
- `NEXTAUTH_SECRET`: `openssl rand -base64 32` (required before enabling NextAuth routes).

### Stripe
1. Enable **Test Mode** in the Stripe Dashboard.
2. Create products/prices matching the table above. Capture the Price IDs and map them to:
   - `STRIPE_PRICE_PRO_MONTHLY`
   - `STRIPE_PRICE_PRO_QUARTERLY`
   - `STRIPE_PRICE_PRO_ANNUAL`
   - `STRIPE_PRICE_RESUME_CREDIT`
3. Copy API keys from **Developers → API keys**:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
4. Add a webhook endpoint pointing to `/api/stripe/webhook` with events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   Store the signing secret in `STRIPE_WEBHOOK_SECRET`.

### Optional Analytics
- `NEXT_PUBLIC_POSTHOG_KEY` from your PostHog or Sentry project (optional).

## Stripe Checkout Notes
- `/api/checkout` expects a `stripePriceEnv` hidden field matching one of the price env keys above.
- Missing env vars return a helpful 500 response rather than crashing the app.
- `/api/stripe/webhook` verifies signatures when `STRIPE_WEBHOOK_SECRET` is present and logs lifecycle events for now.

## Suggested Next Steps
1. Wire Supabase Auth (email magic links + OAuth providers) on `/login` and `/signup` routes.
2. Implement the resume editor workspace under `/app` with autosave + version history.
3. Build the PDF rendering pipeline and connect Stripe subscription states to feature gating.
4. Add integration tests (Playwright) covering checkout, paywall messaging, and export flow.
5. Harden policies (Terms/Privacy/Refund) with legal review before launch.

## Tooling
- `npm run dev` – start dev server
- `npm run lint` – run ESLint with Next.js config
- `npm run build` – production build (requires env vars)
