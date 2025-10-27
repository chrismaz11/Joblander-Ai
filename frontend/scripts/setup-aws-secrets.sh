#!/bin/bash

# AWS Secrets Setup Script for Job-Lander
# This script creates all required secrets in AWS Secrets Manager

set -e

# Configuration
REGION="${AWS_REGION:-us-east-1}"
STAGE="${STAGE:-development}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo_info "Setting up secrets for stage: $STAGE"
echo_info "Region: $REGION"
echo ""

# Function to create or update secret
create_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    # Check if secret exists
    if aws secretsmanager describe-secret --secret-id "$secret_name" --region "$REGION" &> /dev/null; then
        echo_warning "Secret $secret_name already exists. Updating..."
        aws secretsmanager put-secret-value \
            --secret-id "$secret_name" \
            --secret-string "$secret_value" \
            --region "$REGION" > /dev/null
    else
        echo_info "Creating secret: $secret_name"
        aws secretsmanager create-secret \
            --name "$secret_name" \
            --description "$description" \
            --secret-string "$secret_value" \
            --region "$REGION" > /dev/null
    fi
}

# Prompt for secrets
echo_info "Please provide the following values (press Enter to skip):"
echo ""

# Read secrets from user or environment
read -p "GEMINI_API_KEY: " GEMINI_API_KEY
GEMINI_API_KEY="${GEMINI_API_KEY:-${GEMINI_API_KEY_VALUE:-}}"

read -p "CANVA_CLIENT_ID: " CANVA_CLIENT_ID
CANVA_CLIENT_ID="${CANVA_CLIENT_ID:-${CANVA_CLIENT_ID_VALUE:-}}"

read -sp "CANVA_CLIENT_SECRET: " CANVA_CLIENT_SECRET
echo ""
CANVA_CLIENT_SECRET="${CANVA_CLIENT_SECRET:-${CANVA_CLIENT_SECRET_VALUE:-}}"

read -p "JSEARCH_API_KEY: " JSEARCH_API_KEY
JSEARCH_API_KEY="${JSEARCH_API_KEY:-${JSEARCH_API_KEY_VALUE:-}}"

read -p "WEB3_RPC_URL: " WEB3_RPC_URL
WEB3_RPC_URL="${WEB3_RPC_URL:-${WEB3_RPC_URL_VALUE:-}}"

read -sp "PRIVATE_KEY (Blockchain): " PRIVATE_KEY
echo ""
PRIVATE_KEY="${PRIVATE_KEY:-${PRIVATE_KEY_VALUE:-}}"

# Generate SESSION_SECRET if not provided
SESSION_SECRET=$(openssl rand -hex 32)

echo ""
echo_info "Creating secrets in AWS Secrets Manager..."
echo ""

# Create secrets
if [ -n "$GEMINI_API_KEY" ]; then
    create_secret "job-lander/gemini-api-key-${STAGE}" "$GEMINI_API_KEY" "Gemini AI API Key for Job-Lander ${STAGE}"
fi

if [ -n "$CANVA_CLIENT_ID" ]; then
fi

if [ -n "$CANVA_CLIENT_SECRET" ]; then
fi

if [ -n "$JSEARCH_API_KEY" ]; then
    create_secret "job-lander/jsearch-api-key-${STAGE}" "$JSEARCH_API_KEY" "JSearch API Key for Job-Lander ${STAGE}"
fi

if [ -n "$WEB3_RPC_URL" ]; then
    create_secret "job-lander/web3-rpc-url-${STAGE}" "$WEB3_RPC_URL" "Web3 RPC URL for Job-Lander ${STAGE}"
fi

if [ -n "$PRIVATE_KEY" ]; then
    create_secret "job-lander/private-key-${STAGE}" "$PRIVATE_KEY" "Blockchain Private Key for Job-Lander ${STAGE}"
fi

create_secret "job-lander/session-secret-${STAGE}" "$SESSION_SECRET" "Session Secret for Job-Lander ${STAGE}"

echo ""
echo_info "✓ Secrets setup completed successfully!"
echo ""
echo_warning "Note: The database connection string will be automatically created by CDK."
echo_warning "You can view your secrets in the AWS Console: https://console.aws.amazon.com/secretsmanager"
