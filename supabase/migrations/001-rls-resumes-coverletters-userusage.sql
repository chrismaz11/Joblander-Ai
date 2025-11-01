-- 001-rls-resumes-coverletters-userusage.sql
-- Enable Row Level Security and add policies for resumes, cover_letters, and user_usage
-- Adjust column names to match your schema if needed (user_id, resume_id, etc.)

-- Enable RLS
ALTER TABLE IF EXISTS public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_usage ENABLE ROW LEVEL SECURITY;

-- Resumes: allow authenticated users to SELECT their own resumes and INSERT/UPDATE/DELETE only for their records
DROP POLICY IF EXISTS "resumes_select_owner" ON public.resumes;
CREATE POLICY "resumes_select_owner" ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "resumes_manage_owner" ON public.resumes;
CREATE POLICY "resumes_manage_owner" ON public.resumes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Cover letters: similar policies
DROP POLICY IF EXISTS "cover_letters_select_owner" ON public.cover_letters;
CREATE POLICY "cover_letters_select_owner" ON public.cover_letters
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cover_letters_manage_owner" ON public.cover_letters;
CREATE POLICY "cover_letters_manage_owner" ON public.cover_letters
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_usage: allow owners to view/update their usage; administrative roles can manage via service role
DROP POLICY IF EXISTS "user_usage_select_owner" ON public.user_usage;
CREATE POLICY "user_usage_select_owner" ON public.user_usage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_usage_manage_owner" ON public.user_usage;
CREATE POLICY "user_usage_manage_owner" ON public.user_usage
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Optional: allow service_role (Supabase server role) to bypass RLS — keep as-is when using server-side service keys
-- Note: service_role has full DB privileges; avoid using it in client-side code.

-- End of migration
