# Rotation & Cleanup Helper (auto-generated)

This folder contains helper artifacts to safely rotate keys, update Vercel environment variables, and (optionally) purge secrets from Git history.

What I did for you:
- Scanned the repo for common secret names and patterns (SUPABASE, OPENAI, HF, JWT, DATABASE_URL, private keys). The scan found placeholders and docs, not obvious live service_role keys.
- Created a `replacements.txt` template you can populate if you must rewrite history.
- Added helper scripts for applying Supabase migrations and updating Vercel envs.
- Wrote a git-filter-repo plan describing safe steps to rewrite history (destructive) and how to coordinate with collaborators.

Important: I will NOT rewrite history or rotate remote keys for you. These steps must be run from your machine/environment and require credentials.

Quick checklist (manual steps you must perform):
1. Rotate Supabase service_role key in Supabase UI immediately if you believe it was exposed.
2. Update server-side environment variables in Vercel / your hosting with the new keys.
3. If a service_role or other secret was committed and you must remove it from history, update `replacements.txt`, backup your repo, and run git-filter-repo per the plan in `git_filter_repo_plan.md`. Coordinate with collaborators.
4. Apply Supabase migrations with the Supabase CLI or psql (see `apply_migrations.sh`).

Files in this folder:
- `replacements.txt` – template for git-filter-repo replacements.
- `apply_migrations.sh` – helper script for `supabase db push` or psql application of migrations.
- `update_vercel_envs.sh` – helper script to set/remove Vercel env vars using the `vercel` CLI.
- `git_filter_repo_plan.md` – step-by-step plan for history rewrite (backup, run filter-repo, force-push, coordinate).
- `scan_report.md` – a short scan summary showing where sensitive-named variables appear and whether they look like placeholders.

If you want, I can now:
- Fill `replacements.txt` with exact literals if you confirm which literal strings are secrets and allow me to write them into the replacements file (I will not run the rewrite).
- Walk you through running the scripts step-by-step in your terminal.
- Run a follow-up scan after you rotate keys to ensure no remaining leaked literal values exist in tracked files.
