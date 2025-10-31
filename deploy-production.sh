#!/bin/bash

# Production Deployment Script for JobLander
set -e

echo "🚀 Starting JobLander Production Deployment..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v20\. ]] && [[ ! "$NODE_VERSION" =~ ^v22\. ]]; then
    echo "❌ Error: Node.js 20+ required. Current: $NODE_VERSION"
    exit 1
fi

# Check environment variables
if [ ! -f "frontend/.env.local" ]; then
    echo "❌ Error: frontend/.env.local not found"
    echo "Copy frontend/.env.example to frontend/.env.local and configure"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend
npm ci

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run check || echo "⚠️  TypeScript warnings found (non-blocking)"

# Build application
echo "🏗️  Building application..."
npm run build

# Test build output
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - no output found"
    exit 1
fi

echo "✅ Build successful!"
echo "📊 Bundle analysis:"
ls -lh dist/assets/

echo ""
echo "🎉 Production build ready!"
echo "📁 Output directory: frontend/dist"
echo ""
echo "Next steps:"
echo "1. Deploy frontend/dist to Vercel"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Deploy backend to your preferred platform"
