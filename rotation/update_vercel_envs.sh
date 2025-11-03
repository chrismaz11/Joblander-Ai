#!/usr/bin/env bash
# Helper to add/remove Vercel environment variables using vercel CLI
# Usage examples:
#  ./update_vercel_envs.sh set production SUPABASE_SERVICE_ROLE_KEY "<value>"
#  ./update_vercel_envs.sh rm production LEGACY_JWT_SECRET

set -euo pipefail
if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found. Install it first: npm i -g vercel" >&2
  exit 1
fi

ACTION=${1-}
ENVIRONMENT=${2-}
NAME=${3-}
VALUE=${4-}

case "$ACTION" in
  set)
    if [ -z "$ENVIRONMENT" ] || [ -z "$NAME" ] || [ -z "$VALUE" ]; then
      echo "Usage: $0 set <environment> <NAME> <VALUE>" >&2
      exit 1
    fi
    echo "Adding/updating vercel env var: $NAME ($ENVIRONMENT)"
    vercel env add "$NAME" "$ENVIRONMENT" --value "$VALUE"
    ;;
  rm|remove)
    if [ -z "$ENVIRONMENT" ] || [ -z "$NAME" ]; then
      echo "Usage: $0 rm <environment> <NAME>" >&2
      exit 1
    fi
    echo "Removing vercel env var: $NAME ($ENVIRONMENT)"
    vercel env rm "$NAME" "$ENVIRONMENT" --yes
    ;;
  *)
    echo "Unknown action. Usage: $0 set|rm <environment> ..." >&2
    exit 1
    ;;
esac
