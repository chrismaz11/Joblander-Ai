-- 20251101090001_002-create-auth-audit.sql
-- Create auth_audit table to log legacy JWT verifications and related metadata

CREATE TABLE IF NOT EXISTS public.auth_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  used_at timestamptz DEFAULT now(),
  route text,
  ip text,
  method text,
  note text
);

-- Optional index to query recent legacy usage by user
CREATE INDEX IF NOT EXISTS auth_audit_user_idx ON public.auth_audit (user_id);
CREATE INDEX IF NOT EXISTS auth_audit_used_at_idx ON public.auth_audit (used_at DESC);

-- End of migration
