#!/bin/bash

echo "🗄️  Setting up JobLander Database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

# Initialize Supabase project
echo "Initializing Supabase project..."
cd backend
supabase init

# Start local Supabase (for development)
echo "Starting local Supabase..."
supabase start

# Get local connection details
echo "📋 Local Database Details:"
echo "Database URL: $(supabase status | grep 'DB URL' | awk '{print $3}')"
echo "API URL: $(supabase status | grep 'API URL' | awk '{print $3}')"
echo "Anon Key: $(supabase status | grep 'anon key' | awk '{print $3}')"

echo ""
echo "✅ Next steps:"
echo "1. Copy the Database URL to your backend/.env file"
echo "2. Run 'npm run db:push' to create tables"
echo "3. Set up production database at supabase.com"
