# 🔑 Get Your Database Password

## Step 1: Get Database Password
1. Go to: https://supabase.com/dashboard/project/cnxbjetktgfraaxkfuhk
2. Click **Settings** (gear icon in sidebar)
3. Click **Database** 
4. Scroll to **Connection string**
5. Copy the password from the connection string

## Step 2: Update Production Config
Once you have the password, run this command:

```bash
cd /Users/christopher/Projects/JobLander/backend
echo "DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.cnxbjetktgfraaxkfuhk.supabase.co:5432/postgres" > .env.production.local
```

Replace `YOUR_PASSWORD_HERE` with your actual password.

## Step 3: Test Production Connection
```bash
# Test production database
NODE_ENV=production npm run db:init

# If successful, you'll see: "✅ Database connected successfully"
```

## Quick Setup Script
Or run this and paste your password when prompted:

```bash
cd /Users/christopher/Projects/JobLander/backend
read -s -p "Enter your Supabase database password: " DB_PASS
echo "DATABASE_URL=postgresql://postgres:$DB_PASS@db.cnxbjetktgfraaxkfuhk.supabase.co:5432/postgres" > .env.production.local
echo "SUPABASE_URL=https://cnxbjetktgfraaxkfuhk.supabase.co" >> .env.production.local
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNueGJqZXRrdGdmcmFheGtmdWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY5NjQsImV4cCI6MjA3NzI0Mjk2NH0.Cy71aHIOCFhJ5-CMN-OJvRZmf2_iYCQfzcevpd5_szo" >> .env.production.local
echo "✅ Production config created!"
```
