#!/bin/bash

# ===========================================
# AWS Amplify Deployment Script
# ===========================================

set -e  # Exit on any error

echo "🚀 Starting AWS Amplify deployment for Job Lander v4.0..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Environment configuration
ENVIRONMENT=${1:-production}
REGION=${AWS_REGION:-us-east-1}
APP_NAME="job-lander-v4"
BRANCH=${2:-main}

echo "📋 Deployment Configuration:"
echo "   Environment: $ENVIRONMENT"
echo "   Region: $REGION"
echo "   App Name: $APP_NAME"
echo "   Branch: $BRANCH"
echo ""

# Check if Amplify app exists
APP_ID=$(aws amplify list-apps --region $REGION --query "apps[?name=='$APP_NAME'].appId" --output text 2>/dev/null || echo "")

if [ -z "$APP_ID" ]; then
    echo "📱 Creating new Amplify app..."
    
    # Create Amplify app
    aws amplify create-app \
        --name "$APP_NAME" \
        --description "AI-Powered Resume Builder with Blockchain Verification - Production Deployment" \
        --repository "https://github.com/your-username/job-lander-v4" \
        --platform "WEB" \
        --region $REGION \
        --enable-branch-auto-build \
        --enable-branch-auto-deletion \
        --enable-basic-auth false \
        --custom-rules '[
            {
                "source": "/<*>",
                "target": "/index.html",
                "status": "200",
                "condition": null
            },
            {
                "source": "/api/<*>",
                "target": "https://api.joblander.com/api/<*>",
                "status": "200",
                "condition": null
            }
        ]' > /tmp/amplify-app.json
    
    APP_ID=$(cat /tmp/amplify-app.json | grep -o '"appId":"[^"]*' | cut -d'"' -f4)
    echo "✅ Created Amplify app with ID: $APP_ID"
else
    echo "✅ Found existing Amplify app with ID: $APP_ID"
fi

# Environment variables for production
echo "🔧 Setting environment variables..."

aws amplify put-backend-environment \
    --app-id "$APP_ID" \
    --environment-name "$ENVIRONMENT" \
    --stack-name "$APP_NAME-$ENVIRONMENT" \
    --deployment-artifacts "$APP_NAME-$ENVIRONMENT-deployment" \
    --region $REGION || echo "Backend environment may already exist"

# Set environment variables
aws amplify update-app \
    --app-id "$APP_ID" \
    --environment-variables "
        NODE_ENV=production,
        VITE_APP_VERSION=4.0.0,
        VITE_API_URL=https://api.joblander.com,
        VITE_APP_URL=https://joblander.com,
        VITE_COGNITO_USER_POOL_ID=$VITE_COGNITO_USER_POOL_ID,
        VITE_COGNITO_CLIENT_ID=$VITE_COGNITO_CLIENT_ID,
        VITE_COGNITO_REGION=us-east-1,
        VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY,
        VITE_ENABLE_ANALYTICS=true,
        VITE_ENABLE_PWA=true,
        VITE_ENABLE_BLOCKCHAIN=true,
        VITE_ENABLE_DEBUG=false
    " \
    --region $REGION

echo "✅ Environment variables configured"

# Create or update branch
echo "🌿 Configuring branch '$BRANCH'..."

BRANCH_EXISTS=$(aws amplify list-branches --app-id "$APP_ID" --region $REGION --query "branches[?branchName=='$BRANCH'].branchName" --output text 2>/dev/null || echo "")

if [ -z "$BRANCH_EXISTS" ]; then
    aws amplify create-branch \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH" \
        --description "Production branch for Job Lander v4.0" \
        --enable-auto-build \
        --enable-basic-auth false \
        --enable-notification false \
        --enable-performance-mode \
        --enable-pull-request-preview false \
        --region $REGION
    echo "✅ Created branch '$BRANCH'"
else
    echo "✅ Branch '$BRANCH' already exists"
fi

# Start deployment
echo "🚀 Starting deployment..."

JOB_ID=$(aws amplify start-job \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH" \
    --job-type "RELEASE" \
    --region $REGION \
    --query "jobSummary.jobId" --output text)

echo "📦 Deployment started with Job ID: $JOB_ID"
echo "🔗 Monitor deployment at: https://console.aws.amazon.com/amplify/home?region=$REGION#/$APP_ID/$BRANCH/$JOB_ID"

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."

while true; do
    STATUS=$(aws amplify get-job \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH" \
        --job-id "$JOB_ID" \
        --region $REGION \
        --query "job.summary.status" --output text)
    
    case $STATUS in
        "SUCCEED")
            echo "✅ Deployment completed successfully!"
            break
            ;;
        "FAILED"|"CANCELLED")
            echo "❌ Deployment failed with status: $STATUS"
            # Get failure details
            aws amplify get-job \
                --app-id "$APP_ID" \
                --branch-name "$BRANCH" \
                --job-id "$JOB_ID" \
                --region $REGION \
                --query "job.steps[?status=='FAILED'].logUrl" --output table
            exit 1
            ;;
        *)
            echo "⏳ Deployment in progress... Status: $STATUS"
            sleep 30
            ;;
    esac
done

# Get the app URL
APP_URL=$(aws amplify get-app \
    --app-id "$APP_ID" \
    --region $REGION \
    --query "app.defaultDomain" --output text)

echo ""
echo "🎉 Deployment completed successfully!"
echo "📱 App ID: $APP_ID"
echo "🔗 URL: https://$BRANCH.$APP_URL"
echo "🔧 Console: https://console.aws.amazon.com/amplify/home?region=$REGION#/$APP_ID"
echo ""

# Run post-deployment verification
echo "🔍 Running post-deployment verification..."
curl -f -s "https://$BRANCH.$APP_URL" > /dev/null && echo "✅ Application is accessible" || echo "❌ Application may not be accessible yet"

echo "✅ AWS Amplify deployment completed!"