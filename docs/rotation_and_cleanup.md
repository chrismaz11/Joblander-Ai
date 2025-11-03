# Key Rotation, Vercel updates, Git history cleanup, and RLS migration

This document contains step-by-step commands and guidance to (A) rotate Supabase keys, (B) update Vercel environment variables, (C) purge secrets from git history (optional/destructive), and (D) apply Supabase RLS migrations.

---

## A. Rotate Supabase keys (UI)
1. Go to https://app.supabase.com and sign in.
2. Select your project.
3. Settings → API.
4. Under "Project API keys" click the three-dot menu or the "Regenerate"/"Rotate" button next to the anon or service_role key.
5. Copy the new key(s) immediately and store them in your secret manager (Vercel env, etc.).

Notes:
- If a service_role key was exposed, rotate it immediately and treat it as a compromise.
- When rotating service_role, update any server-side environments that use it and any scheduled jobs.

---

## B. Update Vercel environment variables (UI)
1. Go to https://vercel.com -> your project -> Settings -> Environment Variables.
2. Add/Update variables:
   - `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` = `https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<new anon key>`
   - `SUPABASE_SERVICE_ROLE_KEY` = `<new service_role key>` (set as environment variable that is not exposed to client builds)
   - `JWT_SECRET` = `<new jwt secret>`
   - `LEGACY_JWT_SECRET` = `<old jwt secret>` (temporary, remove after migration)
3. Trigger a redeploy of your project (Vercel will usually redeploy automatically when env vars change).

CLI option:
```bash
# example: set production env var
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# to remove a var
vercel env rm LEGACY_JWT_SECRET production
```

---

## C. Purge secrets from git history (advanced, destructive)
Only do this if a service_role (or other sensitive) key was committed and you must remove it from history. This rewrites history and requires force-push.

Recommended: `git-filter-repo` (faster and better than BFG)

1. Install filter-repo (pip install git-filter-repo).
2. Create a replacements file `replacements.txt` with lines like:
```
===BEGIN===
OLD_SECRET==>REMOVED_IN_HISTORY
===END===
```
3. Make a bare mirror backup first:
```bash
git clone --mirror git@github.com:chrismaz11/Joblander-Ai.git backup-repo.git
```
4. Run filter-repo locally on your repo clone:
```bash
git filter-repo --replace-text replacements.txt
```
5. Force push cleaned history:
```bash
git push --force --all
git push --force --tags
```

Warning: This rewrites commits. All collaborators must re-clone or follow instructions to reset their remotes.

---

## D. Apply Supabase RLS migration (created in `supabase/migrations`)
You must run this from a machine with access to your Supabase project (supabase CLI or psql).

Using Supabase CLI:
```bash
# ensure you are logged in
supabase login
# from repo root
supabase db push
```

Using psql (direct SQL):
```bash
export SUPABASE_DB_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres"
psql "$SUPABASE_DB_URL" -f supabase/migrations/001-rls-resumes-coverletters-userusage.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/002-create-auth-audit.sql
```

Test after applying:
- Make requests with a user and verify they can only see their own `resumes` and `cover_letters`.
- Verify `auth_audit` table is created and viewable in Supabase Studio.

---

## E. Monitor legacy JWT usage
- We added `backend/middleware/verifyJwtDual.js` which logs legacy usage to `auth_audit` when available and writes a console warn. Monitor your server logs for `[auth] legacy JWT secret used for token verification` and check rows in `auth_audit` to know when it's safe to remove `LEGACY_JWT_SECRET`.

---

If you want, I can:
- Prepare a `replacements.txt` based on any found literal secrets (I can scan and suggest exact replacements). I will not rewrite history without explicit confirmation.
- Help you run `supabase db push` locally by listing the exact commands to run (I cannot run them for you).

