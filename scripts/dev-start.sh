#!/usr/bin/env bash
# Dev runner: sources .env.local (created by `vercel env pull`) and starts the backend server
# Usage: ./scripts/dev-start.sh

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
ENV_FILE="$ROOT_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo ".env.local not found. Run 'vercel env pull' or create .env.local from .env.example" >&2
  exit 1
fi

echo "Loading $ENV_FILE"
set -a
source "$ENV_FILE"
set +a

# Provide a safe default for LEGACY_JWT_SECRET for local dev if not set
if [ -z "${LEGACY_JWT_SECRET-}" ] && [ -z "${JWT_SECRET-}" ]; then
  echo "No JWT_SECRET/LEGACY_JWT_SECRET found; exporting LEGACY_JWT_SECRET=devsecret for local dev"
  export LEGACY_JWT_SECRET=devsecret
fi

echo "Starting backend with environment vars loaded (non-persistent)."
echo "If you need to run a different command, edit this script."

cd "$ROOT_DIR"
node backend/server.js
