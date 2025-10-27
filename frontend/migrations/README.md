# Database Migrations

This directory contains database migration files for Job-Lander v4.0. All schema changes should be handled through migrations to ensure consistency across environments.

## Migration Process

### Creating Migrations

1. **Naming Convention**: `YYYY-MM-DD_description.sql`
   - Use ISO date format (YYYY-MM-DD)
   - Use underscores for spaces in descriptions
   - Be descriptive but concise

2. **Examples**:
   - `2024-01-15_create_users_table.sql`
   - `2024-01-20_add_resume_indexes.sql`
   - `2024-02-01_alter_jobs_table_add_ai_score.sql`

### Migration Structure

Each migration file should contain:

```sql
-- Migration: [Description]
-- Created: [Date]
-- Author: [Your Name]
-- Purpose: [Brief explanation of why this change is needed]

-- =====================================================
-- UP MIGRATION (Applied during deployment)
-- =====================================================

BEGIN;

-- Your schema changes here
-- Always use IF EXISTS/IF NOT EXISTS for safety
-- Consider concurrent operations for production

COMMIT;

-- =====================================================
-- ROLLBACK INFORMATION
-- =====================================================

-- To rollback this migration manually:
-- 1. [Step by step rollback instructions]
-- 2. [Any data considerations]
-- 3. [Commands to reverse the changes]
```

### Safety Guidelines

#### For Production Migrations

1. **Always Use Transactions**: Wrap DDL operations in BEGIN/COMMIT blocks
2. **Concurrent Operations**: Use `CONCURRENTLY` for index creation when possible
3. **Check for Existence**: Use `IF EXISTS` and `IF NOT EXISTS` clauses
4. **Test First**: Always test migrations on staging environment
5. **Backup Strategy**: Database backups are automatically created before migrations

#### Non-Breaking Changes

✅ **Safe Operations** (can be done during production):
- Adding new tables
- Adding new columns (with defaults)
- Creating indexes concurrently
- Adding constraints that don't conflict with existing data

❌ **Dangerous Operations** (require maintenance window):
- Dropping columns or tables
- Changing column types
- Adding NOT NULL constraints without defaults
- Renaming columns or tables

### Running Migrations

Migrations are automatically executed during deployment via the deploy script:

```bash
# Manual migration execution (development)
npm run db:push

# With backup (production)
pg_dump $DATABASE_URL > backup-before-migration.sql
npm run db:push
```

### Rollback Process

#### Automatic Rollback
The deployment script automatically handles rollbacks if migrations fail.

#### Manual Rollback
If manual rollback is needed:

1. **Check Migration History**:
   ```sql
   SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 10;
   ```

2. **Restore from Backup** (if available):
   ```bash
   psql $DATABASE_URL < backup-before-migration.sql
   ```

3. **Follow Rollback Instructions** in the migration file

### Development Workflow

#### Local Development

1. **Make Schema Changes**: Modify your Drizzle schema files in `shared/schema.ts`
2. **Generate Migration**: 
   ```bash
   npx drizzle-kit generate:pg
   ```
3. **Review Generated Migration**: Check the generated SQL in `migrations/`
4. **Test Migration**: 
   ```bash
   npm run db:push
   ```
5. **Verify Changes**: Test your application with the new schema

#### Staging/Production Deployment

1. **Create Feature Branch**: `git checkout -b feature/database-changes`
2. **Commit Migration Files**: Include both schema and migration changes
3. **Test on Staging**: Deploy to staging environment first
4. **Code Review**: Have migrations reviewed by team members
5. **Deploy to Production**: Use deployment script with database backup

## Common Migration Patterns

### Adding Indexes Safely

```sql
-- Safe for production (non-blocking)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_user_id 
ON resumes (user_id);

-- Verify index was created
SELECT schemaname, tablename, indexname, indexdef 
FROM pg_indexes 
WHERE indexname = 'idx_resumes_user_id';
```

### Adding Columns with Defaults

```sql
-- Safe: Adding nullable column first
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS ai_score DECIMAL(3,2);

-- Safe: Set default for new rows
ALTER TABLE resumes 
ALTER COLUMN ai_score SET DEFAULT 0.0;

-- Safe: Update existing rows in batches (for large tables)
UPDATE resumes 
SET ai_score = 0.0 
WHERE ai_score IS NULL 
AND id IN (
    SELECT id FROM resumes 
    WHERE ai_score IS NULL 
    LIMIT 1000
);
```

### Creating Tables

```sql
-- Always use IF NOT EXISTS for safety
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes immediately (helps with constraints)
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id 
ON job_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id 
ON job_applications(job_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Data Migrations

```sql
-- For data transformations, use explicit batching
DO $$
DECLARE
    batch_size INTEGER := 1000;
    processed INTEGER := 0;
    total INTEGER;
BEGIN
    -- Get total count for progress tracking
    SELECT COUNT(*) INTO total FROM resumes WHERE some_field IS NULL;
    
    RAISE NOTICE 'Starting data migration for % records', total;
    
    LOOP
        -- Process in batches
        UPDATE resumes 
        SET some_field = 'default_value'
        WHERE id IN (
            SELECT id 
            FROM resumes 
            WHERE some_field IS NULL 
            LIMIT batch_size
        );
        
        -- Check if we're done
        EXIT WHEN NOT FOUND;
        
        processed := processed + batch_size;
        RAISE NOTICE 'Processed % of % records', processed, total;
        
        -- Brief pause to avoid overwhelming the database
        PERFORM pg_sleep(0.1);
    END LOOP;
    
    RAISE NOTICE 'Data migration completed';
END $$;
```

## Monitoring and Maintenance

### Check Migration Status

```sql
-- View migration history
SELECT filename, hash, created_at 
FROM drizzle.__drizzle_migrations 
ORDER BY created_at DESC;

-- Check for long-running operations
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state = 'active';
```

### Performance Impact

Monitor database performance after migrations:

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Emergency Procedures

### Failed Migration Recovery

1. **Stop Application**: Prevent new connections
2. **Assess Damage**: Check what was partially applied
3. **Restore from Backup**: If available and recent
4. **Manual Cleanup**: Remove partially applied changes
5. **Fix Migration**: Update migration file
6. **Re-test**: Test fixed migration on staging
7. **Re-deploy**: Deploy corrected version

### Large Table Migrations

For tables with millions of records:

1. **Schedule Maintenance Window**: Plan for downtime
2. **Create Backup**: Full database backup
3. **Monitor Resources**: Watch CPU, memory, disk I/O
4. **Use Batching**: Process in smaller chunks
5. **Monitor Progress**: Log progress regularly
6. **Have Rollback Plan**: Clear rollback steps

### Contact Information

- **Database Issues**: Contact DevOps team
- **Migration Questions**: See project documentation or team lead
- **Emergency**: Follow incident response procedures

---

**Remember**: When in doubt, test on staging first. Database migrations affect all users and should be treated with appropriate caution.