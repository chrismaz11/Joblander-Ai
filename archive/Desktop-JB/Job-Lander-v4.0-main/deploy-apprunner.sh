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

echo ""
echo "🚀 Job-Lander AWS App Runner Deployment"
echo "========================================"
echo ""

# Configuration
REGION="us-east-1"
APP_NAME="job-lander"
ECR_REPO_NAME="job-lander-apprunner"
SERVICE_ROLE_NAME="AppRunnerInstanceRole"

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo_info "AWS Account: $ACCOUNT_ID"

# Step 1: Create ECR repository if it doesn't exist
echo_step "Setting up ECR repository..."
aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $REGION &> /dev/null || {
    echo_info "Creating ECR repository..."
    aws ecr create-repository --repository-name $ECR_REPO_NAME --region $REGION > /dev/null
}

ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}"
echo_info "ECR Repository: $ECR_URI"

# Step 2: Build and push Docker image
echo_step "Building and pushing Docker image..."

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI

# Build image
echo_info "Building Docker image..."
docker build -t $ECR_REPO_NAME:latest .

# Tag and push
docker tag $ECR_REPO_NAME:latest $ECR_URI:latest
docker push $ECR_URI:latest

echo_info "Image pushed: $ECR_URI:latest"

# Step 3: Create IAM role for App Runner if it doesn't exist
echo_step "Setting up IAM roles..."

# Check if role exists
if ! aws iam get-role --role-name $SERVICE_ROLE_NAME &> /dev/null; then
    echo_info "Creating App Runner service role..."
    
    # Create trust policy
    cat > /tmp/apprunner-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "tasks.apprunner.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

    # Create role
    aws iam create-role \
        --role-name $SERVICE_ROLE_NAME \
        --assume-role-policy-document file:///tmp/apprunner-trust-policy.json

    # Attach basic execution policy
    aws iam attach-role-policy \
        --role-name $SERVICE_ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
fi

ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$SERVICE_ROLE_NAME"
echo_info "Using IAM Role: $ROLE_ARN"

# Step 4: Set up database (Neon - free PostgreSQL)
echo_step "Database setup required..."
echo_warning "You'll need to set up a database. Here are the easiest options:"
echo ""
echo "1. Neon (Recommended - Free tier): https://neon.tech/"
echo "2. Supabase (Free tier): https://supabase.com/"
echo "3. AWS RDS (Paid): Use existing RDS setup"
echo ""
echo "After setting up your database, you'll get a DATABASE_URL like:"
echo "postgresql://user:password@host:5432/database"
echo ""

# Step 5: Create App Runner service
echo_step "Creating App Runner service..."

# Create service configuration
cat > /tmp/apprunner-service.json << EOF
{
    "ServiceName": "$APP_NAME",
    "SourceConfiguration": {
        "ImageRepository": {
            "ImageIdentifier": "$ECR_URI:latest",
            "ImageConfiguration": {
                "Port": "5000",
                "RuntimeEnvironmentVariables": {
                    "NODE_ENV": "production",
                    "PORT": "5000"
                }
            },
            "ImageRepositoryType": "ECR"
        },
        "AutoDeploymentsEnabled": false
    },
    "InstanceConfiguration": {
        "Cpu": "0.25 vCPU",
        "Memory": "0.5 GB",
        "InstanceRoleArn": "$ROLE_ARN"
    }
}
EOF

# Check if service already exists
if aws apprunner describe-service --service-arn "arn:aws:apprunner:$REGION:$ACCOUNT_ID:service/$APP_NAME" --region $REGION &> /dev/null; then
    echo_warning "App Runner service already exists. Updating..."
    # Update the service
    aws apprunner update-service \
        --service-arn "arn:aws:apprunner:$REGION:$ACCOUNT_ID:service/$APP_NAME" \
        --source-configuration file:///tmp/apprunner-service.json \
        --region $REGION > /tmp/apprunner-update.json
else
    echo_info "Creating new App Runner service..."
    # Create the service
    aws apprunner create-service \
        --cli-input-json file:///tmp/apprunner-service.json \
        --region $REGION > /tmp/apprunner-create.json
fi

echo ""
echo "✅ Deployment initiated!"
echo ""
echo_info "Next steps:"
echo "1. Set up your database (Neon/Supabase recommended)"
echo "2. Go to AWS Console > App Runner > Services > $APP_NAME"
echo "3. Add environment variables in the Configuration tab:"
echo "   - DATABASE_URL"
echo "   - GEMINI_API_KEY"
echo "   - SESSION_SECRET"
echo "   - CANVA_CLIENT_ID"
echo "   - CANVA_CLIENT_SECRET"
echo "   - JSEARCH_API_KEY"
echo "   - WEB3_RPC_URL"
echo "   - PRIVATE_KEY"
echo "4. Deploy the updated configuration"
echo ""
echo_warning "The service will take 3-5 minutes to deploy and be accessible."
echo_info "Check status with: aws apprunner describe-service --service-arn arn:aws:apprunner:$REGION:$ACCOUNT_ID:service/$APP_NAME"