# JobLander System Test Plan

## 1. Environment & Tooling Checklist
- Confirm `.env.local` is present with valid Supabase, Vercel, Stripe, and session secrets.
- Ensure PostgreSQL/Supabase schema matches `shared/schema.ts` (run `npm run db:push` if needed).
- Start dev stack: `npm run dev` (Vite frontend + Express backend).
- Seed baseline data (users, resumes, jobs) or verify Supabase tables are populated.
- Clear browser storage/cookies between auth scenarios.

## 2. Functional Test Areas

### Authentication & Session
- `/login` form submission and redirects.
- Session persistence across refresh and navigation.
- `/api/logout` clears session and header reflects logged-out state.

### Onboarding & Profile
- Automatic redirect to `/onboarding` for users without `onboarding_completed`.
- Profile update flow (`/profile`) saves to Supabase; avatar upload if available.

### Dashboard (`/dashboard`)
- Resume, job, cover letter, AI stats fetch from APIs for authenticated user.
- Tier badge, usage bar, and upgrade CTA logic (free vs paid tiers).
- Recent activity timeline merges resumes and cover letters chronologically.

### Resume Builder (`/resume-builder`)
- Existing resumes list with edit/delete, accurate timestamps/template labels.
- “Create from scratch” opens editor; saving persists to Supabase.
- Upload flow parses PDF/DOCX, pre-populates editor, and saves on confirm.
- AI assistance panel availability (stub vs actual integration) and graceful errors.

### Legacy Resume Wizard (`/create`)
- Multi-step form validation, parsing integration, template preview, and final generation.
- PDF/HTML export buttons work or fail gracefully with messaging.

### Job Search & Details (`/jobs`, `/jobs?id=123`)
- Filters (search, city, remote, employment type, salary range) update results.
- Semantic ranking toggle logic.
- Saved/applied job states persist across refresh.
- Job details view renders structured content.

### Cover Letters (`/cover-letter`)
- List existing letters, create via AI (all tones), edit/save, link to resume.
- Export/download actions (if available).

### Portfolio Builder (`/portfolio`)
- Template selection, font/theme pickers.
- Preview rendering and export/package generation.

### Verification (`/verify`)
- Upload hash, on-chain verification, batch verification flows.

### Billing & Tier Management (`/pricing`, `/upgrade`)
- Stripe checkout initiation, webhook handling (dev/test mode).
- Tier gating components (`TierGate`, `UsageTracker`) enforce limits.

### Admin & Health Pages
- `/admin-panel` access control (if restricted).
- `/health` dashboard displays system status and DB connectivity.

## 3. Cross-Cutting Concerns
- Responsive layout (mobile/desktop) for key pages.
- Accessibility: keyboard navigation, focus states, ARIA for dialogs/toasts.
- Error states: network failures, unauthorized responses, empty data.
- Loading skeletons and transitions appear appropriately.
- Analytics (gtag) fallbacks avoid runtime errors when disabled.
- PWA manifest and icons (logo usage) render correctly.

## 4. Automated Testing Opportunities
- Unit: Extract resume-mapping utilities, tier enforcement logic.
- Integration: React Testing Library for Dashboard stats, Resume list.
- API: Supertest for `/api/resumes`, `/api/cover-letters`, `/api/find-jobs`.
- E2E: Playwright smoke covering signup→resume→dashboard→logout.

## 5. Current Engineering To‑Dos
1. **Resolve TypeScript build failures** (`npm run check`):
   - Ad components (`AdBanner`, `AdComponent`) missing context props and `gtag` typing.
   - `EnhancedTemplateSelector` imports `generatePDF`/`downloadAsHTML` which are not exported.
   - `TierGate`, `WatermarkOverlay`, `UsageTracker` depend on absent auth context helpers.
   - `home-backup.tsx`, `templates-backup.tsx`, `portfolio.tsx` misuse React Query defaults.
   - `sidebar.tsx` references `collapsible` symbol; verify import or remove.
2. **Align routing**: decide between `/create` and `/resume-builder`, consolidate duplicate flows.
3. **Implement official brand assets**: replace temporary `public/logo.svg` with provided 192×192 icon (SVG/PNG variants) and update header, manifest, social previews.
4. **Supabase integration audit**:
   - Ensure `/api/resumes` writes include authenticated `userId`.
   - Confirm cover letter endpoints and saved jobs tables exist and align with frontend expectations.
5. **Error handling**: unify toast/message patterns for fetch failures across Dashboard, Resume Builder, Jobs, Cover Letters.
6. **Data seeding**: create scripts/fixtures for sample resumes/jobs to support local testing.
7. **Documentation**: update README with new routes, testing instructions, and environment setup.

## 6. Test Execution Log Template
- Date:
- Tester:
- Build hash / git commit:
- Environment:
- Summary:
- Issues found (link to tickets):
- Follow-up actions:

Keep this document updated as fixes land and new scenarios are added.
