# 1) List envs in Vercel for project
vercel env ls --project joblander-ai

# 2) Remove accidentally public env (example)
vercel env rm NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY production

# 3) Add server-only envs
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_URL production
vercel env add JWT_SECRET production

# 4) Redeploy production
vercel --prod

# 5) Verify Supabase from prod (replace with your domain or pulled .env.prod)
set -a; vercel env pull .env.prod --environment production; source .env.prod; set +a
curl -sS -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/resumes?select=*&limit=1" | jq .# 1) List envs in Vercel for project
vercel env ls --project joblander-ai

# 2) Remove accidentally public env (example)
vercel env rm NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY production

# 3) Add server-only envs
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_URL production
vercel env add JWT_SECRET production

# 4) Redeploy production
vercel --prod

# 5) Verify Supabase from prod (replace with your domain or pulled .env.prod)
set -a; vercel env pull .env.prod --environment production; source .env.prod; set +a
curl -sS -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/resumes?select=*&limit=1" | jq .# 1) List envs in Vercel for project
vercel env ls --project joblander-ai

# 2) Remove accidentally public env (example)
vercel env rm NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY production

# 3) Add server-only envs
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_URL production
vercel env add JWT_SECRET production

# 4) Redeploy production
vercel --prod

# 5) Verify Supabase from prod (replace with your domain or pulled .env.prod)
set -a; vercel env pull .env.prod --environment production; source .env.prod; set +a
curl -sS -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/resumes?select=*&limit=1" | jq .#!/usr/bin/env bash
# Production diagnostics helper
# WARNING: This script pulls production environment variables into a local file
# and will use them to run authenticated tests against provider APIs and your
# production deployment. Run only on a secure admin machine.

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
OUT_DIR="/tmp/prod-diagnostics"
ENV_FILE="$ROOT_DIR/.env.prod"

echo "PRODUCTION DIAGNOSTICS"
echo
echo "This script will:"
echo " 1) Optionally pull production envs from Vercel to $ENV_FILE"
echo " 2) Run tests: app health, OpenAI (Responses), Supabase REST, Stripe"
echo " 3) Save outputs to $OUT_DIR and show a short summary"

read -p "Proceed? This will access production secrets on your machine. Type 'YES' to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted by user."; exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found. Install it (npm i -g vercel) and log in, then re-run." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/*

echo "Pulling production envs from Vercel into $ENV_FILE (will overwrite)"
vercel env pull "$ENV_FILE" --environment production

echo "Sourcing envs into a subshell for tests (no export to your current shell)."
(
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a

  # Basic app health check
  echo "[TEST] App health" > "$OUT_DIR/summary.txt"
  if [ -z "${PRODUCTION_DOMAIN-}" ]; then
    # try to infer from VERCEL_URL or VERCEL_PROJECT
    PROD_HOST="${VERCEL_URL:-}" 
  else
    PROD_HOST="$PRODUCTION_DOMAIN"
  fi
  if [ -z "$PROD_HOST" ]; then
    echo "No PRODUCTION_DOMAIN or VERCEL_URL found in envs; please set PRODUCTION_DOMAIN in .env.prod or run curl against your domain manually." >> "$OUT_DIR/summary.txt"
  else
    echo "Health endpoint: https://$PROD_HOST/api/health" >> "$OUT_DIR/summary.txt"
    curl -sS -o "$OUT_DIR/health.json" -w "%{http_code}" "https://$PROD_HOST/api/health" > "$OUT_DIR/health.code" || true
    echo "Health HTTP code: $(cat "$OUT_DIR/health.code")" >> "$OUT_DIR/summary.txt"
    head -c 1000 "$OUT_DIR/health.json" >> "$OUT_DIR/summary.txt" || true
  fi

  # OpenAI test (Responses) - only if OPENAI_API_KEY present
  if [ -n "${OPENAI_API_KEY-}" ]; then
    echo "[TEST] OpenAI Responses" >> "$OUT_DIR/summary.txt"
    curl -sS https://api.openai.com/v1/responses \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"model":"gpt-4o-mini","input":"Say hello in one sentence"}' \
      -o "$OUT_DIR/openai.json" -w "%{http_code}" > "$OUT_DIR/openai.code" || true
    echo "OpenAI HTTP code: $(cat "$OUT_DIR/openai.code")" >> "$OUT_DIR/summary.txt"
    jq -r '.output[0].content[0].text // .output_text // .status' "$OUT_DIR/openai.json" 2>/dev/null | head -c 400 >> "$OUT_DIR/summary.txt" || true
  else
    echo "OPENAI_API_KEY not set in production envs." >> "$OUT_DIR/summary.txt"
  fi

  # Supabase REST test
  if [ -n "${SUPABASE_SERVICE_ROLE_KEY-}" ] && [ -n "${SUPABASE_URL-}" ]; then
    echo "[TEST] Supabase REST" >> "$OUT_DIR/summary.txt"
    curl -sS -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
      "$SUPABASE_URL/rest/v1/resumes?select=*&limit=1" -o "$OUT_DIR/supabase.json" -w "%{http_code}" > "$OUT_DIR/supabase.code" || true
    echo "Supabase HTTP code: $(cat "$OUT_DIR/supabase.code")" >> "$OUT_DIR/summary.txt"
    head -c 1000 "$OUT_DIR/supabase.json" >> "$OUT_DIR/summary.txt" || true
  else
    echo "SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL not set in production envs." >> "$OUT_DIR/summary.txt"
  fi

  # Stripe test
  if [ -n "${STRIPE_SECRET_KEY-}" ]; then
    echo "[TEST] Stripe" >> "$OUT_DIR/summary.txt"
    curl -s -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/charges?limit=1 -o "$OUT_DIR/stripe.json" -w "%{http_code}" > "$OUT_DIR/stripe.code" || true
    echo "Stripe HTTP code: $(cat "$OUT_DIR/stripe.code")" >> "$OUT_DIR/summary.txt"
    head -c 1000 "$OUT_DIR/stripe.json" >> "$OUT_DIR/summary.txt" || true
  else
    echo "STRIPE_SECRET_KEY not set in production envs." >> "$OUT_DIR/summary.txt"
  fi

)

echo
echo "Diagnostics complete. Summary saved to $OUT_DIR/summary.txt"
echo "Detailed files: $OUT_DIR/*.json and *.code"
echo "Please open $OUT_DIR/summary.txt, redact any secrets, and paste failing sections here — I will interpret them and give exact remediation steps."
