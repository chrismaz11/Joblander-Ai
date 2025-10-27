import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@job-lander-db.cufu8ooom2yl.us-east-1.rds.amazonaws.com:5432/job_lander',
  },
} satisfies Config;
