-- Migration: Add Core Performance Indexes for Job-Lander v4.0
-- Created: 2024-01-13
-- Author: System
-- Purpose: Improve query performance for frequently accessed tables and common query patterns

-- =====================================================
-- UP MIGRATION (Applied during deployment)
-- =====================================================

BEGIN;

-- Resumes table indexes
-- Frequently queried by user_id for user dashboard
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_user_id 
ON resumes (user_id);

-- Often filtered by creation date for recent resumes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_created_at 
ON resumes (created_at DESC);

-- AI processing status for batch jobs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_ai_processed 
ON resumes (ai_processed, created_at) 
WHERE ai_processed = false;

-- Composite index for user resumes by date
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_user_created 
ON resumes (user_id, created_at DESC);

-- Jobs table indexes  
-- Geographic filtering is common
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_location 
ON jobs USING GIN (to_tsvector('english', location));

-- Salary range queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_salary_range 
ON jobs (min_salary, max_salary) 
WHERE min_salary IS NOT NULL AND max_salary IS NOT NULL;

-- Job search with text matching
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_search_text 
ON jobs USING GIN (
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '') || ' ' || 
        coalesce(company_name, '')
    )
);

-- Posted date for recent jobs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_posted_at 
ON jobs (posted_at DESC) 
WHERE posted_at IS NOT NULL;

-- Cover Letters table indexes
-- Linked to resumes and jobs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cover_letters_resume_id 
ON cover_letters (resume_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cover_letters_job_id 
ON cover_letters (job_id) 
WHERE job_id IS NOT NULL;

-- User activity tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cover_letters_user_created 
ON cover_letters (user_id, created_at DESC);

-- Blockchain Verification table indexes (if exists)
-- Hash lookups for verification
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blockchain_verifications_hash 
ON blockchain_verifications (document_hash) 
WHERE document_hash IS NOT NULL;

-- Transaction hash for blockchain queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blockchain_verifications_tx_hash 
ON blockchain_verifications (transaction_hash) 
WHERE transaction_hash IS NOT NULL;

-- Users table additional indexes
-- Email lookups (if not already unique)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_lower 
ON users (LOWER(email));

-- Account creation tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at 
ON users (created_at DESC);

-- Partial index for active users only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active 
ON users (id, email, created_at) 
WHERE deleted_at IS NULL;

-- Add database statistics update
-- This helps the query planner make better decisions
ANALYZE resumes;
ANALYZE jobs; 
ANALYZE cover_letters;
ANALYZE users;
-- Only analyze if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blockchain_verifications') THEN
        EXECUTE 'ANALYZE blockchain_verifications';
    END IF;
END $$;

-- Log successful completion
INSERT INTO migration_log (migration_name, applied_at, notes) 
VALUES ('2024-01-13_add_core_indexes', NOW(), 'Added performance indexes for core tables')
ON CONFLICT (migration_name) DO UPDATE SET 
    applied_at = NOW(),
    notes = 'Re-applied core performance indexes';

COMMIT;

-- =====================================================
-- ROLLBACK INFORMATION  
-- =====================================================

-- To rollback this migration manually:

-- 1. Connect to database:
--    psql $DATABASE_URL

-- 2. Drop the indexes (they can be recreated if needed):
--    DROP INDEX CONCURRENTLY IF EXISTS idx_resumes_user_id;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_resumes_created_at;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_resumes_ai_processed;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_resumes_user_created;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_jobs_location;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_jobs_salary_range;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_jobs_search_text;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_jobs_posted_at;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_cover_letters_resume_id;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_cover_letters_job_id;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_cover_letters_user_created;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_blockchain_verifications_hash;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_blockchain_verifications_tx_hash;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_lower;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_users_created_at;
--    DROP INDEX CONCURRENTLY IF EXISTS idx_users_active;

-- 3. Remove migration log entry:
--    DELETE FROM migration_log WHERE migration_name = '2024-01-13_add_core_indexes';

-- 4. Performance impact of rollback:
--    - Queries will be slower until indexes are recreated
--    - No data loss, only performance impact
--    - Application will continue to function normally

-- Note: Use CONCURRENTLY for both creation and deletion to avoid locking tables
-- This allows the application to continue running during index operations