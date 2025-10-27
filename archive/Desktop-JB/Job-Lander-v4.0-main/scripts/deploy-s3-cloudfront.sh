#!/bin/bash

# ===========================================
# S3 + CloudFront Deployment Script (Fallback)
# ===========================================

set -e  # Exit on any error

echo "🚀 Starting S3 + CloudFront deployment for Job Lander v4.0..."

# Configuration
BUCKET_NAME=${1:-joblander-v4-production}
CLOUDFRONT_COMMENT="Job Lander v4.0 - AI Resume Builder"
REGION=${AWS_REGION:-us-east-1}
ENVIRONMENT=${2:-production}

echo "📋 Deployment Configuration:"
echo "   S3 Bucket: $BUCKET_NAME"
echo "   Region: $REGION"
echo "   Environment: $ENVIRONMENT"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Create S3 bucket if it doesn't exist
echo "🪣 Creating S3 bucket..."
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "✅ S3 bucket '$BUCKET_NAME' already exists"
else
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$REGION" \
        $([ "$REGION" != "us-east-1" ] && echo "--create-bucket-configuration LocationConstraint=$REGION")
    echo "✅ Created S3 bucket '$BUCKET_NAME'"
fi

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3api put-bucket-website \
    --bucket "$BUCKET_NAME" \
    --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Key": "index.html"}
    }'

# Set bucket policy for public read access
aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'"$BUCKET_NAME"'/*"
            }
        ]
    }'

echo "✅ S3 bucket configured for static hosting"

# Upload build files
echo "📦 Uploading build files to S3..."
aws s3 sync ./dist/public/ s3://$BUCKET_NAME/ \
    --delete \
    --cache-control "max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.json" \
    --exclude "service-worker.js"

# Upload HTML files with shorter cache
aws s3 sync ./dist/public/ s3://$BUCKET_NAME/ \
    --cache-control "max-age=3600" \
    --include "*.html" \
    --include "*.json" \
    --include "service-worker.js"

echo "✅ Build files uploaded to S3"

# Check if CloudFront distribution exists
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Comment=='$CLOUDFRONT_COMMENT'].Id" \
    --output text 2>/dev/null || echo "")

if [ -z "$DISTRIBUTION_ID" ]; then
    echo "☁️ Creating CloudFront distribution..."
    
    # Create distribution configuration
    cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "job-lander-v4-$(date +%s)",
    "Comment": "$CLOUDFRONT_COMMENT",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "Compress": true,
        "LambdaFunctionAssociations": {
            "Quantity": 0
        }
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "CustomErrorPages": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF

    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cloudfront-config.json \
        --query "Distribution.Id" --output text)
    
    echo "✅ Created CloudFront distribution: $DISTRIBUTION_ID"
    echo "⏳ Distribution is deploying (this may take 15-20 minutes)..."
else
    echo "✅ Found existing CloudFront distribution: $DISTRIBUTION_ID"
fi

# Get distribution domain name
DOMAIN_NAME=$(aws cloudfront get-distribution \
    --id "$DISTRIBUTION_ID" \
    --query "Distribution.DomainName" --output text)

# Wait for distribution to be deployed (optional)
echo "⏳ Checking distribution status..."
while true; do
    STATUS=$(aws cloudfront get-distribution \
        --id "$DISTRIBUTION_ID" \
        --query "Distribution.Status" --output text)
    
    if [ "$STATUS" = "Deployed" ]; then
        echo "✅ CloudFront distribution is deployed and ready"
        break
    else
        echo "⏳ Distribution status: $STATUS (waiting...)"
        sleep 30
    fi
done

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query "Invalidation.Id" --output text)

echo "✅ Cache invalidation started: $INVALIDATION_ID"

# Create deployment summary
cat > /tmp/s3-deployment-summary.json << EOF
{
    "deployment": {
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
        "environment": "$ENVIRONMENT",
        "bucket": "$BUCKET_NAME",
        "distributionId": "$DISTRIBUTION_ID",
        "domainName": "$DOMAIN_NAME",
        "invalidationId": "$INVALIDATION_ID",
        "region": "$REGION"
    },
    "urls": {
        "s3Website": "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
        "cloudfront": "https://$DOMAIN_NAME",
        "awsConsole": "https://console.aws.amazon.com/cloudfront/home?region=$REGION#distribution-settings:$DISTRIBUTION_ID"
    },
    "optimization": {
        "gzipEnabled": true,
        "cacheMaxAge": "31536000s (1 year for assets)",
        "htmlCacheMaxAge": "3600s (1 hour for HTML)",
        "spaRouting": "404 errors redirect to index.html"
    }
}
EOF

cp /tmp/s3-deployment-summary.json ./s3-deployment-summary.json

echo ""
echo "🎉 S3 + CloudFront deployment completed successfully!"
echo "📱 S3 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "🌐 CloudFront URL: https://$DOMAIN_NAME"
echo "🔧 AWS Console: https://console.aws.amazon.com/cloudfront/home?region=$REGION#distribution-settings:$DISTRIBUTION_ID"
echo "📊 Deployment summary saved to: s3-deployment-summary.json"
echo ""

# Test the deployment
echo "🔍 Testing deployment..."
if curl -f -s "https://$DOMAIN_NAME" > /dev/null; then
    echo "✅ Application is accessible via CloudFront"
else
    echo "⚠️  CloudFront may still be propagating. Try again in a few minutes."
fi

echo "✅ S3 + CloudFront deployment completed!"

# Cleanup temporary files
rm -f /tmp/cloudfront-config.json /tmp/s3-deployment-summary.json