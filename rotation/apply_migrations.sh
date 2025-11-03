#!/usr/bin/env bash
# Helper to apply Supabase RLS / migration SQL created in repo
# Usage: ./apply_migrations.sh [--psql DATABASE_URL]

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
MIGRATIONS_DIR="$ROOT_DIR/supabase/migrations"

if command -v supabase >/dev/null 2>&1; then
  echo "supabase CLI found. Will attempt 'supabase db push' if you confirm."
  read -p "Run 'supabase db push' now? (requires supabase login and access) [y/N] " -r
  if [[ "$REPLY" =~ ^[Yy]$ ]]; then
    cd "$ROOT_DIR"
    supabase db push
    echo "supabase db push complete. Verify in Supabase Studio."
  else
    echo "Skipped supabase db push. You can run: (from repo root)"
    echo "  supabase db push"
  fi
else
  echo "supabase CLI not found. Falling back to psql SQL apply instructions."
  echo "Provide a DATABASE_URL (Postgres) via --psql or via env var SUPABASE_DB_URL."
  if [ "${1-}" = "--psql" ]; then
    DATABASE_URL="${2-}"
  else
    DATABASE_URL="${SUPABASE_DB_URL-}">
  fi
  if [ -z "$DATABASE_URL" ]; then
    echo "No DATABASE_URL provided. Example:" >&2
    echo "  ./apply_migrations.sh --psql \"postgresql://postgres:PASS@host:5432/postgres\"" >&2
    exit 1
  fi
  echo "Applying migrations with psql using DATABASE_URL=$DATABASE_URL"
  for f in "$MIGRATIONS_DIR"/*.sql; do
    echo "Applying $f"
    psql "$DATABASE_URL" -f "$f"
  done
  echo "Finished applying SQL files. Verify in Supabase Studio."
fi
