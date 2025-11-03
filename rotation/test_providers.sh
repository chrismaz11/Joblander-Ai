#!/usr/bin/env bash
# Quick provider tests for local validation. Do NOT run with production secrets in shared terminals.
set -euo pipefail

echo "== Provider test script =="

echo "Checking environment variables (will show if present but not values)..."
vars=(OPENAI_API_KEY HUGGINGFACE_API_KEY SUPABASE_SERVICE_ROLE_KEY SUPABASE_URL STRIPE_SECRET_KEY JWT_SECRET)
for v in "${vars[@]}"; do
  if [ -n "${!v-}" ]; then
    echo "  $v = SET"
  else
    echo "  $v = NOT SET"
  fi
done

echo
echo "OpenAI test (Responses endpoint). This will echo the status line and return a JSON body if key valid."
if [ -n "${OPENAI_API_KEY-}" ]; then
  curl -sS -o /tmp/ol_resp.json -w "%{http_code}" https://api.openai.com/v1/responses \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"gpt-4o-mini","input":"Say hello in one sentence"}' || true
  echo " => saved to /tmp/ol_resp.json (inspect with jq if installed)"
else
  echo "Skipping OpenAI test: OPENAI_API_KEY not set"
fi

echo
echo "Hugging Face test (inference endpoint)."
if [ -n "${HUGGINGFACE_API_KEY-}" ]; then
  curl -s -o /tmp/hf_resp.json -w "%{http_code}" -X POST https://api-inference.huggingface.co/models/gpt2 \
    -H "Authorization: Bearer $HUGGINGFACE_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"inputs":"Hello Hugging Face"}' || true
  echo " => saved to /tmp/hf_resp.json"
else
  echo "Skipping HF test: HUGGINGFACE_API_KEY not set"
fi

echo
echo "Supabase test: try a simple GET from REST (requires SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL)"
if [ -n "${SUPABASE_SERVICE_ROLE_KEY-}" ] && [ -n "${SUPABASE_URL-}" ]; then
  curl -s -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "$SUPABASE_URL/rest/v1/resumes?select=*&limit=1" -o /tmp/sb_resp.json || true
  echo " => saved to /tmp/sb_resp.json"
else
  echo "Skipping Supabase test: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL not set"
fi

echo
echo "Stripe test (list customers or charges)."
if [ -n "${STRIPE_SECRET_KEY-}" ]; then
  curl -s -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/charges -o /tmp/stripe_resp.json || true
  echo " => saved to /tmp/stripe_resp.json"
else
  echo "Skipping Stripe test: STRIPE_SECRET_KEY not set"
fi

echo
echo "Done. Inspect /tmp/*_resp.json (or change the script to print responses). Remember to delete these files when finished."
