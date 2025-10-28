# 🗄️ Database Setup Guide

## Quick Setup (5 minutes)

### Option 1: Local Development (Fastest)
```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Start local Supabase
cd backend
supabase init
supabase start

# 3. Get connection details
supabase status

# 4. Copy Database URL to .env
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres" > .env

# 5. Create tables and add sample data
npm run setup
```

### Option 2: Production Database (Supabase Cloud)
```bash
# 1. Go to supabase.com and create project
# 2. Copy connection string from Settings > Database
# 3. Add to backend/.env:
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# 4. Create tables
npm run db:push
npm run db:init
```

## Test Database Connection
```bash
cd backend
npm run dev

# Should see: "Database connected successfully"
# Not: "Falling back to in-memory storage"
```

## Verify Setup
```bash
# Test API endpoints
curl http://localhost:4000/api/health
curl http://localhost:4000/api/jobs

# Should return real data, not empty arrays
```

## Troubleshooting

**"DATABASE_URL not provided"**
- Check .env file exists in backend/
- Verify DATABASE_URL is set correctly

**"Connection failed"**
- Ensure Supabase is running: `supabase status`
- Check firewall/network settings
- Verify connection string format

**"Tables don't exist"**
- Run: `npm run db:push`
- Check Supabase dashboard for tables

## Next Steps
Once database is working:
1. Set up authentication
2. Connect frontend to backend
3. Add real job API integration
