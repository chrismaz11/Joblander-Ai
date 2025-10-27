#!/bin/bash

# Complete AWS Deployment Script for Job-Lander
# This script handles the full deployment pipeline

set -e

# Configuration
STAGE="${STAGE:-development}"
REGION="${AWS_REGION:-us-east-1}"
SKIP_SECRETS="${SKIP_SECRETS:-false}"
SKIP_BUILD="${SKIP_BUILD:-false}"

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

# Print banner
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   Job-Lander AWS Deployment Script    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo_info "Stage: $STAGE"
echo_info "Region: $REGION"
echo ""

# Check prerequisites
echo_step "Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo_error "Docker is not installed. Please install it first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo_error "Node.js is not installed. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo_info "AWS Account: $ACCOUNT_ID"

# Change to project root
cd "$(dirname "$0")/.."

# Step 1: Setup secrets
if [ "$SKIP_SECRETS" != "true" ]; then
    echo_step "Setting up AWS Secrets Manager..."
    echo_warning "This will prompt you for API keys and secrets."
    read -p "Do you want to set up secrets now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash scripts/setup-aws-secrets.sh
    else
        echo_warning "Skipping secrets setup. Make sure secrets are configured manually!"
    fi
else
    echo_warning "Skipping secrets setup (SKIP_SECRETS=true)"
fi

# Step 2: Install CDK dependencies
echo_step "Installing CDK dependencies..."
cd infrastructure
if [ ! -d "node_modules" ]; then
    npm install
else
    echo_info "Dependencies already installed"
fi
cd ..

# Step 3: Bootstrap CDK (if not already done)
echo_step "Bootstrapping AWS CDK..."
if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region $REGION &> /dev/null; then
    echo_info "CDK not bootstrapped yet. Running bootstrap..."
    cd infrastructure
    npx cdk bootstrap aws://$ACCOUNT_ID/$REGION
    cd ..
else
    echo_info "CDK already bootstrapped"
fi

# Step 4: Build Docker image and push to ECR
if [ "$SKIP_BUILD" != "true" ]; then
    echo_step "Building and pushing Docker image..."
    
    # Get or create ECR repository
    ECR_REPO_NAME="job-lander-${STAGE}"
    ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO_NAME}"
    
    # Create ECR repository if it doesn't exist
    if ! aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $REGION &> /dev/null; then
        echo_info "Creating ECR repository..."
        aws ecr create-repository --repository-name $ECR_REPO_NAME --region $REGION > /dev/null
    fi
    
    # Login to ECR
    echo_info "Logging in to ECR..."
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI
    
    # Build image
    echo_info "Building Docker image..."
    docker build -t $ECR_REPO_NAME:latest .
    
    # Tag and push
    echo_info "Pushing image to ECR..."
    docker tag $ECR_REPO_NAME:latest $ECR_URI:latest
    docker push $ECR_URI:latest
    
    echo_info "Image pushed: $ECR_URI:latest"
else
    echo_warning "Skipping Docker build (SKIP_BUILD=true)"
fi

# Step 5: Deploy infrastructure with CDK
echo_step "Deploying infrastructure with CDK..."
cd infrastructure

case $STAGE in
    development)
        STACK_NAME="JobLanderDev"
        ;;
    staging)
        STACK_NAME="JobLanderStaging"
        ;;
    production)
        STACK_NAME="JobLanderProd"
        ;;
    *)
        echo_error "Invalid STAGE: $STAGE (must be: development, staging, or production)"
        exit 1
        ;;
esac

echo_info "Deploying stack: $STACK_NAME"
npx cdk deploy $STACK_NAME --require-approval never

cd ..

# Step 6: Get deployment outputs
echo_step "Retrieving deployment information..."
OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs' \
    --output json)

# Extract key values
ALB_DNS=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="LoadBalancerDNS") | .OutputValue')
CLOUDFRONT_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontURL") | .OutputValue')
CLUSTER_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="ClusterName") | .OutputValue')
SERVICE_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="ServiceName") | .OutputValue')

# Step 7: Wait for service to be stable
echo_step "Waiting for ECS service to stabilize..."
aws ecs wait services-stable \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION

# Step 8: Run database migrations
echo_step "Running database migrations..."
echo_info "Getting ECS task ID..."
TASK_ARN=$(aws ecs list-tasks \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --region $REGION \
    --query 'taskArns[0]' \
    --output text)

if [ "$TASK_ARN" != "None" ] && [ -n "$TASK_ARN" ]; then
    echo_info "Running migrations on task: $TASK_ARN"
    aws ecs execute-command \
        --cluster $CLUSTER_NAME \
        --task $TASK_ARN \
        --container JobLanderContainer \
        --interactive \
        --command "npm run db:push" \
        --region $REGION || echo_warning "Could not run migrations automatically. Run them manually."
else
    echo_warning "No tasks found. Please run migrations manually after tasks start."
fi

# Success!
echo ""
echo "╔════════════════════════════════════════╗"
echo "║     Deployment Completed Successfully! ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo_info "Deployment Information:"
echo ""
echo "  Load Balancer:  http://$ALB_DNS"
echo "  CloudFront:     $CLOUDFRONT_URL"
echo "  ECS Cluster:    $CLUSTER_NAME"
echo "  ECS Service:    $SERVICE_NAME"
echo ""
echo_warning "Note: It may take a few minutes for the service to be fully available."
echo_warning "CloudFront distribution may take 15-20 minutes to fully deploy."
echo ""
echo_info "To view logs:"
echo "  aws logs tail /ecs/job-lander-${STAGE} --follow --region $REGION"
echo ""
echo_info "To view ECS service status:"
echo "  aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION"
echo ""
