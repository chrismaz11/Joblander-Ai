# Local development: loading envs and starting the backend

This document explains the simplest, safe workflow to load environment variables locally (from Vercel), run quick provider checks, and start the backend for development.

Important: Do NOT commit `.env.local` or any files that contain real secrets. `.env.local` is created by the `vercel env pull` command and is added to `.gitignore` by that command.

Prerequisites
- `vercel` CLI installed and logged in (or manually copy values into `.env.local`).
- `node` (v16+) installed.
- `jq` (optional) for pretty JSON in tests.

Files & scripts added to the repo
- `scripts/pull_vercel_envs.sh` — wrapper that runs `vercel env pull .env.local` for you.
- `scripts/dev-start.sh` — sources `.env.local` and starts the backend with safe defaults (exports a dev `LEGACY_JWT_SECRET` if necessary).
- `rotation/test_providers.sh` — quick smoke tests for OpenAI/Hugging Face/Supabase/Stripe (saves responses to `/tmp` for inspection).

Quick workflow (recommended)

1) Pull environment variables from Vercel into `.env.local`

```bash
# ensure vercel CLI is installed and you are logged in
vercel login

# pull development envs to .env.local (the CLI will add it to .gitignore)
vercel env pull

# or use the helper (if you prefer):
chmod +x ./scripts/pull_vercel_envs.sh
./scripts/pull_vercel_envs.sh
```

2) Inspect `.env.local` (only names, not values) to confirm required vars exist

```bash
# show variable names only
grep -v '^\s*#' .env.local | sed -E 's/=.*$//'
```

Required server-side variables (examples):
- `SUPABASE_URL` (server)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `JWT_SECRET` (server)
- `OPENAI_API_KEY` (server)
- `STRIPE_SECRET_KEY` (server)

If `SUPABASE_URL` or `JWT_SECRET` are missing but `NEXT_PUBLIC_SUPABASE_URL` or `LEGACY_JWT_SECRET` exist, the `scripts/dev-start.sh`/server fallbacks will provide sensible local defaults.

3) Load `.env.local` into your shell and run provider tests

```bash
# export envs for the current session
set -a
source .env.local
set +a

# ensure a legacy jwt secret exists for local dev (the dev-start script also handles this)
export LEGACY_JWT_SECRET=${LEGACY_JWT_SECRET:-devsecret}

# run quick smoke tests
chmod +x rotation/test_providers.sh
./rotation/test_providers.sh

# Inspect any saved JSON responses in /tmp (if tests ran):
ls -l /tmp/*_resp.json || true
```

4) Start the backend (loads `.env.local` automatically)

```bash
chmod +x ./scripts/dev-start.sh
./scripts/dev-start.sh

# The server should log: "Server running on port 4000" (or the port you set in .env.local)
```

Notes and troubleshooting
- If a provider test returns 401/403, the key is missing/invalid or blocked. Check the specific provider docs for key scopes.
- If `SUPABASE_URL` is missing but `NEXT_PUBLIC_SUPABASE_URL` exists (client-side var), the server fallback copies it into `SUPABASE_URL`. This is intended for local dev convenience only — set the proper server env in Vercel for production.
- If JWT verification fails, verify the token was signed with the same `JWT_SECRET` set in `.env.local` or `JWT_SECRET` in Vercel.
- Never move server-only keys into `NEXT_PUBLIC_` or `VITE_` prefixed vars.

Want me to do this for you?
- I can commit the dev README to the repo (done) and help run any of these commands interactively if you paste failures.
- If you'd like, I can also open a PR with a more detailed developer onboarding doc and scripts to run migrations.

End of file
