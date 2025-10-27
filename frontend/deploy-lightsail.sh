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
echo "🚀 Job-Lander AWS Lightsail Deployment"
echo "======================================"
echo ""

# Configuration
REGION="us-east-1"
SERVICE_NAME="job-lander"
CONTAINER_NAME="job-lander-app"

# Get account info
echo_step "Checking AWS configuration..."
aws sts get-caller-identity > /dev/null
echo_info "AWS CLI configured successfully"

# Step 1: Build the Docker image
echo_step "Building Docker image..."
docker build -t $SERVICE_NAME:latest .
echo_info "Docker image built successfully"

# Step 2: Create a deployment JSON for Lightsail
echo_step "Creating Lightsail container service configuration..."

cat > /tmp/lightsail-containers.json << EOF
{
    "$CONTAINER_NAME": {
        "image": "$SERVICE_NAME:latest",
        "ports": {
            "5000": "HTTP"
        },
        "environment": {
            "NODE_ENV": "production",
            "PORT": "5000"
        }
    }
}
EOF

cat > /tmp/lightsail-public-endpoint.json << EOF
{
    "containerName": "$CONTAINER_NAME",
    "containerPort": 5000,
    "healthCheck": {
        "healthyThreshold": 2,
        "unhealthyThreshold": 5,
        "timeoutSeconds": 10,
        "intervalSeconds": 30,
        "path": "/api/health",
        "successCodes": "200-299"
    }
}
EOF

# Step 3: Create Lightsail container service if it doesn't exist
echo_step "Creating Lightsail container service..."

if aws lightsail get-container-services --query "containerServices[?containerServiceName=='$SERVICE_NAME']" --output text | grep -q "$SERVICE_NAME"; then
    echo_warning "Container service $SERVICE_NAME already exists"
else
    echo_info "Creating new container service..."
    aws lightsail create-container-service \
        --service-name $SERVICE_NAME \
        --power micro \
        --scale 1 \
        --region $REGION
    
    echo_info "Waiting for container service to be ready..."
    aws lightsail wait container-service-deployed --service-name $SERVICE_NAME --region $REGION
fi

# Step 4: Push the container image to Lightsail
echo_step "Pushing container image to Lightsail..."
aws lightsail push-container-image \
    --service-name $SERVICE_NAME \
    --label $CONTAINER_NAME \
    --image $SERVICE_NAME:latest \
    --region $REGION

# Get the image URI
IMAGE_URI=$(aws lightsail get-container-images --service-name $SERVICE_NAME --region $REGION --query "containerImages[0].image" --output text)
echo_info "Image URI: $IMAGE_URI"

# Step 5: Update the container configuration with the actual image URI
cat > /tmp/lightsail-containers-final.json << EOF
{
    "$CONTAINER_NAME": {
        "image": "$IMAGE_URI",
        "ports": {
            "5000": "HTTP"
        },
        "environment": {
            "NODE_ENV": "production",
            "PORT": "5000"
        }
    }
}
EOF

# Step 6: Deploy the container
echo_step "Deploying container to Lightsail..."
aws lightsail create-container-service-deployment \
    --service-name $SERVICE_NAME \
    --containers file:///tmp/lightsail-containers-final.json \
    --public-endpoint file:///tmp/lightsail-public-endpoint.json \
    --region $REGION

echo_step "Waiting for deployment to complete..."
aws lightsail wait container-service-deployed --service-name $SERVICE_NAME --region $REGION

# Get the service URL
SERVICE_URL=$(aws lightsail get-container-services \
    --query "containerServices[?containerServiceName=='$SERVICE_NAME'].url" \
    --output text --region $REGION)

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo_info "Your Job-Lander app is now live at:"
echo "🌐 $SERVICE_URL"
echo ""
echo_warning "Next steps:"
echo "1. Set up a database (Neon recommended: https://neon.tech/)"
echo "2. Add environment variables to your container:"
echo "   - Go to AWS Lightsail Console"
echo "   - Find your '$SERVICE_NAME' container service"
echo "   - Click 'Modify your service'"
echo "   - Add these environment variables:"
echo "     • DATABASE_URL=postgresql://..."
echo "     • GEMINI_API_KEY=your_gemini_key"
echo "     • SESSION_SECRET=your_session_secret"
echo "     • JSEARCH_API_KEY=your_jsearch_key"
echo "     • WEB3_RPC_URL=your_rpc_url"
echo "     • PRIVATE_KEY=your_private_key"
echo "   - Deploy the updated configuration"
echo ""
echo_info "Cost: ~$7/month for the micro container (very reasonable!)"
echo_info "You can scale up to larger containers as needed."