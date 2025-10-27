# Next.js Marketing & App Shell Integration Plan

This document describes how the new **Next.js marketing + web app** (`apps/marketing-site`) fits alongside the existing Job Lander backend services. Use it as the source of truth while we phase out the legacy Vite UI.

## Current Layout

```
Job-Lander-v4.0-main/
├─ apps/
│  └─ marketing-site/        # New Next.js 16 SaaS shell (ResumeLaunch)
├─ lambda-backend/           # Lightweight API wrapper used for Amplify/Lambda
├─ lambda-full/              # Primary backend (AI, Supabase, Stripe integrations)
├─ src/, server/, shared/    # Legacy Vite frontend + support scripts
├─ docs/                     # Product & technical documentation (cleaned)
├─ archives/, logs/          # Historic assets moved out of the root
└─ ...
```

## Integration Objectives

1. **Single Monorepo** – Keep backend, infrastructure code, and the new Next.js experience together for easier CI/deploy orchestration.
2. **Gradual Cutover** – Run the new marketing shell in parallel while legacy Vite UI still loads from `src/` until the new experience fully replaces it.
3. **Shared Auth/Data** – Reuse the Supabase + Stripe stack that powers the backend (`lambda-full/services`).
4. **Clear Environments** – `.env.example` files live beside each app; never mix backend secrets with the marketing UI.

## Migration Roadmap

| Phase | Goal | Owner | Notes |
| --- | --- | --- | --- |
| 0 | ✅ Scaffold marketing site | Completed | Next.js app lives in `apps/marketing-site` with pricing + plan copy |
| 1 | Point Next.js API routes to backend | FE | Create fetch helpers that hit the deployed Lambda endpoints or Supabase REST/APIs |
| 2 | Supabase Auth UI | FE/BE | Replace placeholder `/signup` + `/login` with Supabase client, rely on backend policies |
| 3 | Stripe session handoff | Full-stack | `/api/checkout` already stubbed – wire to backend customer creation and ledger jobs |
| 4 | Editor parity | FE | Implement resume editor in React/Next, reuse core data models from backend shared package |
| 5 | Sunset Vite UI | PM | Freeze legacy app, migrate traffic via DNS or reverse proxy |

## Environment Variables

- Frontend specific variables live in `apps/marketing-site/.env.example`.
- Backend and shared services continue using the root `.env.example` and `lambda-full/.env.example` (if present).
- During CI, add a matrix step to install dependencies in `apps/marketing-site` and run `npm run lint` / `npm run build` separately from backend checks.
- The root `package.json` is now an npm workspace; use `npm run marketing:*` scripts to interact with the Next.js app.

## Deployment Strategy

1. **Preview builds** – deploy `apps/marketing-site` to Vercel (Hobby tier for now); add a GitHub workflow that runs `npm install && npm run build` inside that directory.
2. **Backend** – keep existing AWS Lambda/Supabase deployment scripts. Share environment IDs through GitHub secrets.
3. **Traffic Cutover** – once ready, point `app.joblander.ai` to Vercel and proxy API calls back to AWS (or expose new Next.js API routes).
4. **Monitoring** – reuse PostHog/Sentry keys by exposing them through `.env.local` once instrumentation is ready.

## Outstanding Questions

- Do we retire the Vite `src/` frontend entirely or keep it as an embedded widget?
- Should the Next.js app host both marketing pages and the editor experience, or stay as marketing + auth shell only?
- How do we handle multi-tenant theming and existing resume templates? (Consider pulling them into a shared package.)

Keep this plan updated as we close phases.
