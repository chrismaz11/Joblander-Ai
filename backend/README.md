# JobLander AI – Recreated Experience

This repository now contains both the lightweight Express backend and a brand-new React/Vite client that recreates the JobLander AI experience described in the detailed project overview.

## Project layout

- `server.js` – Express server with CORS, JSON parsing, OpenAI client placeholder, and a JSON health endpoint (`/api/health`).
- `client/` – React 18 + TypeScript + Vite application with Tailwind styling, Radix UI primitives, Zustand state, and TanStack Query.
  - `src/pages/` – Feature-rich screens (Dashboard, Resume Builder, Job Search, Cover Letters, LinkedIn Optimizer, Interview Prep, Salary Negotiation, Networking Hub, Analytics, Admin Panel, Upgrade, Onboarding, Job Importer, Profile).
  - `src/data/` – Mock data reflecting resumes, jobs, cover letters, analytics, and AI activity drawn from the project overview.
  - `src/context/` – Persistent Zustand store for user/tier state and onboarding workflow.
  - `src/components/` – Re-usable UI primitives (Button, Card, Badge, Progress, Avatar) and shared helpers like the floating AI assistant dock.
  - `src/hooks/` – React Query integration (e.g., backend health check) and tier gating helpers.
  - `src/utils/` – Fetch wrapper for hooking into the Express API.

## Getting started

1. **Install dependencies**
   ```bash
   # backend
   npm install

   # frontend
   cd client
   npm install
   ```

2. **Configure environment**
   - Copy `client/.env.example` to `client/.env` and adjust `VITE_API_URL` if the backend runs on a different host/port.
   - Ensure `OPENAI_API_KEY` and other secrets referenced in the backend are set inside `.env` (already ignored).

3. **Run backend (port 4000 by default)**
   ```bash
   npm run dev
   ```

4. **Run frontend**
   ```bash
   cd client
   npm run dev
   ```
   Vite will launch on port `5173` and proxy requests to the API URL defined in `VITE_API_URL`.

## Highlights

- **Design language** – Responsive system with light/dark theming, premium typography, glassmorphism details, and a blue/gold accent palette.
- **Feature breadth** – Every major surface from the specification is represented: resume intelligence, job discovery, cover letters, LinkedIn optimizer, interview prep, salary negotiation, networking hub, analytics, admin, onboarding, pricing, and CSV importer.
- **AI-first framing** – Sections emphasize Gemini-powered enhancements, ATS scoring, compatibility analysis, negotiation playbooks, and automated outreach. A floating AI assistant dock demonstrates chat-style workflows.
- **Tier awareness** – Sidebar badges and gating logic highlight Pro/Enterprise features, while the Upgrade page surfaces plan benefits.
- **Backend touchpoint** – React Query polls the Express `/api/health` endpoint, letting the top bar display API status and providing a clear integration seam for future services.
- **Live job feed** – Imports the curated postings and filters from Job-Lander v4.0 so `/api/jobs`, `/api/jobs/cities`, and `/api/jobs/stats` drive the Job Search page via React Query.
- **Resume & cover letters** – Upload resumes for hybrid parsing, AI enhancement, template previews, and generate multi-tone cover letters via the new Express endpoints.

## Next steps (beyond this recreation)

1. **Real integrations**
   - Connect resume pipelines to storage + processing (Multer, object storage such as Supabase Storage or GCS, Gemini/GPT, PDF rendering).
   - Wire job search to JSearch or other job APIs with scheduled refresh.
   - Implement Stripe billing, webhook handling, and feature gating by tier.
   - Add Polygon Mumbai hash storage service for resume verification.
2. **Authentication & security**
   - Integrate Auth0, Supabase Auth, or another hosted identity provider.
   - Enforce route guards, RLS policies, and audit logging.
3. **Data persistence**
   - Replace mock arrays with Drizzle ORM backed by PostgreSQL.
   - Sync analytics to warehouse/BI tooling or Supabase/PostHog.
4. **Testing & CI/CD**
   - Add unit/integration tests, Playwright flows, and automated deployments to a non-AWS host (e.g., Vercel, Render, Fly.io).

This front-end recreation provides a polished, comprehensive UX that mirrors the original Base44 build while positioning the codebase for full production integrations. Let me know which integration or feature you want wired up next. 

## Supabase / Postgres integration (optional)

1. Create a Supabase project (free tier works) and copy the `DATABASE_URL` from Settings → Database → Connection string.
2. Add the URL to a `.env` file in this repo (`DATABASE_URL=...`). The backend automatically connects when the variable is present; otherwise it falls back to in-memory storage.
3. Generate migrations with Drizzle Kit:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```
4. Deploy database changes (or run the generated SQL in Supabase's SQL editor). Tables created: `resumes`, `cover_letters`, `user_usage`, `jobs`.

## Deployment (no AWS required)

- **Frontend** – Deploy the `client/` folder to Vercel (import the GitHub repo, set `VITE_API_URL` to your backend URL).
- **Backend** – Deploy the Express server to Render, Fly.io, or Railway. Set `DATABASE_URL`, `OPENAI_API_KEY`, and any future secrets in their dashboard.
- **Database & storage** – Use Supabase for Postgres, Auth, and file storage. Bucket uploads (resumes, exports) can live in Supabase Storage or any S3-compatible bucket.
- **Monitoring** – Enable Supabase logs + free Sentry or Logtail for application tracing.

The backend now checks for `DATABASE_URL` at runtime, so the same build runs locally (in-memory) or in production (Supabase) without code changes.

