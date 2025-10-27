#!/usr/bin/env bash
set -euo pipefail

# --- Config (edit if any value differs) ---
AWS_REGION="us-east-1"
HOSTED_ZONE_ID="Z060042430DI8XF2XDW0Q"
CLOUDFRONT_DIST_ID="E2JTNKZQEEGBZ5"
CLOUDFRONT_DOMAIN="d3vkrsu1g29d0e.cloudfront.net"
CERT_ARN="arn:aws:acm:us-east-1:817977749885:certificate/0c61957a-eb9b-4154-aca7-56da2621d53d"
DOMAIN="joblander.org"
WWW_DOMAIN="www.${DOMAIN}"
FRONTEND_S3_BUCKET="joblander-v4-production"
TEMPLATES_LOCAL_DIR="./templates"
INVALIDATION_PATHS=("/*")

echo "=== Resume deploy: starting ==="

# 1) Ensure S3 website config (SPA)
echo "Configuring S3 website (SPA) for bucket: $FRONTEND_S3_BUCKET"
aws s3api put-bucket-website --bucket "$FRONTEND_S3_BUCKET" --website-configuration '{
  "IndexDocument": {"Suffix": "index.html"},
  "ErrorDocument": {"Key": "index.html"}
}' >/dev/null
echo "S3 website configured."

# 2) Sync site files (public build) - modify path to your build output (dist or build)
# If you use Vite -> typically `dist/` ; if create-react-app -> `build/`
# NOTE: replace ./dist with your actual build folder before running.
if [ -d "./dist" ]; then
  echo "Syncing frontend build ./dist -> s3://$FRONTEND_S3_BUCKET/"
  aws s3 sync ./dist "s3://$FRONTEND_S3_BUCKET/" --acl public-read --delete
else
  echo "WARNING: ./dist not found. Skipping full site sync. Ensure to upload your build directory manually or change script."
fi

# Sync templates if present
if [ -d "$TEMPLATES_LOCAL_DIR" ]; then
  echo "Syncing templates -> s3://$FRONTEND_S3_BUCKET/templates/"
  aws s3 sync "$TEMPLATES_LOCAL_DIR" "s3://$FRONTEND_S3_BUCKET/templates/" --acl public-read
else
  echo "Templates dir not found at $TEMPLATES_LOCAL_DIR; skipping template sync."
fi

# 3) Update CloudFront distribution config: add AlternateDomainNames and attach cert
echo "Fetching CloudFront distribution config..."
DIST_JSON=$(aws cloudfront get-distribution-config --id "$CLOUDFRONT_DIST_ID")
ETAG=$(echo "$DIST_JSON" | jq -r '.ETag')
DIST_CONFIG=$(echo "$DIST_JSON" | jq '.DistributionConfig')

# Add aliases (we'll upsert both)
NEW_CONFIG=$(echo "$DIST_CONFIG" \
  | jq --arg d1 "$DOMAIN" --arg d2 "$WWW_DOMAIN" \
      '.Aliases = {Quantity:2, Items: [$d1,$d2]}' \
  | jq --arg arn "$CERT_ARN" \
      '.ViewerCertificate = {ACMCertificateArn: $arn, SSLSupportMethod: "sni-only", MinimumProtocolVersion: "TLSv1.2_2019"}'
)

# Add CustomErrorResponses -> 404 -> /index.html (SPA routing)
NEW_CONFIG=$(echo "$NEW_CONFIG" | jq '.CustomErrorResponses = {Quantity:1, Items:[{ErrorCode:404, ResponsePagePath:"/index.html", ResponseCode:"200", ErrorCachingMinTTL: 0}]}')

# Remove fields not allowed in update input
NEW_CONFIG=$(echo "$NEW_CONFIG" | jq 'del(.LastModifiedTime, .InProgressInvalidationBatches)')

# Update distribution
echo "Updating CloudFront distribution to attach cert and aliases..."
aws cloudfront update-distribution --id "$CLOUDFRONT_DIST_ID" --if-match "$ETAG" --distribution-config "$(echo "$NEW_CONFIG")" >/dev/null
echo "CloudFront update requested. Note full propagation may take ~15 minutes."

# 4) Create Route53 alias A records to CloudFront distribution
CLOUDFRONT_HOSTED_ZONE_ID="Z2FDTNDATAQYW2"
echo "Creating Route53 alias records for $DOMAIN and $WWW_DOMAIN -> CloudFront ($CLOUDFRONT_DOMAIN)"
CHANGE_BATCH=$(cat <<EOF
{
  "Comment": "Alias record for CloudFront distribution",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$CLOUDFRONT_HOSTED_ZONE_ID",
          "DNSName": "$CLOUDFRONT_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$WWW_DOMAIN",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$CLOUDFRONT_HOSTED_ZONE_ID",
          "DNSName": "$CLOUDFRONT_DOMAIN",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
EOF
)
aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch "$CHANGE_BATCH" >/dev/null
echo "Route53 alias records upserted. Changes PENDING."

# 5) Invalidate CloudFront cache for preview/template updates
echo "Creating CloudFront invalidation..."
INV_JSON=$(aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DIST_ID" --paths "${INVALIDATION_PATHS[@]}")
INVALIDATION_ID=$(echo "$INV_JSON" | jq -r '.Invalidation.Id')
echo "Invalidation created: $INVALIDATION_ID"

# 6) Final check and print summary
echo "=== Done triggering updates ==="
echo "CloudFront distribution ID: $CLOUDFRONT_DIST_ID"
echo "Domain aliases: $DOMAIN, $WWW_DOMAIN"
echo "ACM Cert: $CERT_ARN"
echo "S3 bucket: $FRONTEND_S3_BUCKET"
echo "Templates synced: $( [ -d \"$TEMPLATES_LOCAL_DIR\" ] && echo 'yes' || echo 'no' )"
echo ""
echo "NOTE: CloudFront changes may take ~15 minutes to propagate. Visit: https://$DOMAIN"
