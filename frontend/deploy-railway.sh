#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo ""
echo "🚀 Job-Lander Railway Deployment (Easiest Option!)"
echo "================================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo_step "Installing Railway CLI..."
    
    # Check if we're on macOS and have Homebrew
    if [[ "$OSTYPE" == "darwin"* ]] && command -v brew &> /dev/null; then
        echo_info "Using Homebrew to install Railway CLI..."
        brew install railway
    else
        echo_info "Installing Railway CLI via curl..."
        curl -fsSL https://railway.app/install.sh | sh
        
        # Add to PATH for this session
        export PATH="$HOME/.railway/bin:$PATH"
    fi
fi

echo_info "Railway CLI installed successfully!"

# Step 1: Check if user is logged in
echo_step "Checking Railway authentication..."

if ! railway auth &> /dev/null; then
    echo_warning "Not logged in to Railway. Let's authenticate..."
    echo_info "This will open a browser window for authentication."
    railway login
else
    echo_info "Already authenticated with Railway!"
fi

# Step 2: Initialize Railway project if not already done
echo_step "Setting up Railway project..."

# Check if we're already linked to a project
if ! railway status &> /dev/null; then
    echo_warning "Not linked to a Railway project. Creating new project..."
    railway init
else
    echo_info "Already linked to a Railway project!"
fi

# Step 3: Add a PostgreSQL database
echo_step "Adding PostgreSQL database..."
echo_info "This will create a free PostgreSQL database in Railway."

railway add --database postgres

echo_step "Getting database connection URL..."
sleep 5  # Wait for database to be ready

# Step 4: Set environment variables
echo_step "Setting up environment variables..."

echo_info "Setting NODE_ENV and PORT..."
railway variables --set NODE_ENV=production
railway variables --set PORT=5000

# Ask user for API keys
echo ""
echo_warning "Please provide your API keys. Press Enter to skip any:"
echo ""

read -p "GEMINI_API_KEY: " GEMINI_KEY
if [ -n "$GEMINI_KEY" ]; then
    railway variables --set GEMINI_API_KEY="$GEMINI_KEY"
fi

read -p "CANVA_CLIENT_ID: " CANVA_ID
if [ -n "$CANVA_ID" ]; then
    railway variables --set CANVA_CLIENT_ID="$CANVA_ID"
fi

read -p "CANVA_CLIENT_SECRET: " CANVA_SECRET
if [ -n "$CANVA_SECRET" ]; then
    railway variables --set CANVA_CLIENT_SECRET="$CANVA_SECRET"
fi

read -p "JSEARCH_API_KEY: " JSEARCH_KEY
if [ -n "$JSEARCH_KEY" ]; then
    railway variables --set JSEARCH_API_KEY="$JSEARCH_KEY"
fi

read -p "WEB3_RPC_URL: " WEB3_URL
if [ -n "$WEB3_URL" ]; then
    railway variables --set WEB3_RPC_URL="$WEB3_URL"
fi

read -p "PRIVATE_KEY (Blockchain): " PRIVATE_KEY
if [ -n "$PRIVATE_KEY" ]; then
    railway variables --set PRIVATE_KEY="$PRIVATE_KEY"
fi

# Generate session secret
SESSION_SECRET=$(openssl rand -base64 32)
railway variables --set SESSION_SECRET="$SESSION_SECRET"

echo_info "Environment variables set successfully!"

# Step 5: Deploy!
echo_step "Deploying to Railway..."
echo_info "This will build your Docker image and deploy it automatically."

railway up --detach

echo_step "Getting deployment URL..."
sleep 10  # Wait for deployment

RAILWAY_URL=$(railway domain)

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo_info "Your Job-Lander app is now live at:"
echo "🌐 $RAILWAY_URL"
echo ""
echo_info "What Railway provides:"
echo "✅ Automatic HTTPS"
echo "✅ Free PostgreSQL database"
echo "✅ Automatic scaling"
echo "✅ Free tier: $5/month credit"
echo "✅ GitHub integration for auto-deploys"
echo ""
echo_warning "Next steps:"
echo "1. Test your app at the URL above"
echo "2. Set up GitHub integration:"
echo "   - railway connect"
echo "   - Push to GitHub for automatic deploys"
echo "3. Monitor your app:"
echo "   - railway logs"
echo "   - railway status"
echo ""
echo_info "Need help? Run: railway --help"