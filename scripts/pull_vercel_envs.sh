#!/usr/bin/env bash
# Pull environment variables from Vercel into a local .env file
# Requires: vercel CLI logged in and project set (or use --scope/--token). See `vercel help env`.

set -euo pipefail

OUT_FILE=".env"
SCOPE=${1-}

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found. Install it: npm i -g vercel" >&2
  exit 1
fi

if [ -n "$SCOPE" ]; then
  echo "Pulling Vercel envs (scope: $SCOPE) to $OUT_FILE"
  vercel env pull "$OUT_FILE" --scope "$SCOPE"
else
  echo "Pulling Vercel envs to $OUT_FILE"
  vercel env pull "$OUT_FILE"
fi

echo "Done. Review $OUT_FILE and do not commit real secrets to git."
