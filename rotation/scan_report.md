# Repo secrets scan report

Scanned for common secret names and secret-like patterns: SUPABASE keys, OPENAI/HUGGINGFACE keys, JWT secrets, DATABASE_URL (postgres), private keys, and 'api_key' strings.

Summary of findings (quick):
- No obvious live secrets (no long base64 tokens or private key blocks) were found. Matches are mostly placeholders or documentation examples.
- Files where sensitive-named variables appear (placeholders or examples):
  - `.env` (contains placeholders like `YOUR_PROJECT`, `env(...)`),
  - `vercel-env-setup.md` and `docs/rotation_and_cleanup.md` (documentation samples),
  - `supabase/migrations/*` (RLS migration comments referencing service_role usage),
  - `backend/services/careerAI.js`, `backend/services/aiService.js` (check for OPENAI/HF env usage; they look for env vars but do not store literal keys in repo),
  - `frontend/server.js` references `STRIPE_SECRET_KEY` env usage (ensure Stripe keys rotated if leaked),
  - Many files reference `JWT_SECRET` or `LEGACY_JWT_SECRET` as env var usage; these are environment references, not literal values.

Conclusion and recommended next steps:
- If you believe any of these env values were actually committed as literal long tokens, tell me which exact string(s) to place into `rotation/replacements.txt` (I will not rewrite history unless you explicitly ask).
- If no literal secrets were found (as is the case here), rotate keys in the remote services only if compromised — instructions are in `README_ROTATE_KEYS.md` and `git_filter_repo_plan.md` if you need history rewrite.
