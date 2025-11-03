#!/bin/bash

echo "Setting up Supabase environment variables for Vercel production..."
echo

echo "1. Adding SUPABASE_URL to production..."
vercel env add SUPABASE_URL production

echo
echo "2. Adding SUPABASE_SERVICE_ROLE_KEY to production..."
vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo
echo "3. (Optional) Adding PRODUCTION_DOMAIN to production..."
read -p "Add PRODUCTION_DOMAIN? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel env add PRODUCTION_DOMAIN production
fi

echo
echo "Environment variables added. Now redeploy with:"
echo "  vercel --prod"
