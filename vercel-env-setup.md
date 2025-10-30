# Vercel Environment Variables Setup

## Required Environment Variables for Vercel

Add these in your Vercel dashboard under Settings > Environment Variables:

### Frontend Variables (for Vercel deployment)
```
VITE_SUPABASE_URL=https://cnxbjetktgfraaxkfuhk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNueGJqZXRrdGdmcmFheGtmdWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY5NjQsImV4cCI6MjA3NzI0Mjk2NH0.Cy71aHIOCFhJ5-CMN-OJvRZmf2_iYCQfzcevpd5_szo
VITE_API_URL=https://your-backend-url.com
```

### Backend Variables (if deploying backend to Vercel)
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
JWT_SECRET=your-jwt-secret-key-here
PORT=4000
```

## Steps to Fix:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable above with the exact names and values
3. Set Environment to "Production, Preview, Development" for all
4. Redeploy your project

## Alternative: Use Vercel CLI
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY  
vercel env add VITE_API_URL
```
