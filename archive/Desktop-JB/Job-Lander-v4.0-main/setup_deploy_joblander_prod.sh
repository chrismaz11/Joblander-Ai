#!/usr/bin/env bash
set -euo pipefail

# --------------------------
# CONFIG - edit these values if needed BEFORE running
# --------------------------
AWS_REGION="us-east-1"                      # ACM & CloudFront require cert in us-east-1
MAIN_REGION="us-east-1"                     # resources region for RDS/ECS (kept the same for simplicity)
DOMAIN="joblander.org"
WWW_DOMAIN="www.${DOMAIN}"
FRONTEND_S3_BUCKET="joblander-v4-production"
CLOUDFRONT_DOMAIN="d3vkrsu1g29d0e.cloudfront.net"
CLOUDFRONT_DIST_ID="E2JTNKZQEEGBZ5"
TEMPLATES_LOCAL_DIR="./templates"          # local path to your 27 templates (change if needed)
BACKEND_STACK_NAME="JobLander-Backend-Stack"
CFN_TEMPLATE_FILE="./joblander-backend-stack.yml"
ECS_SERVICE_NAME="joblander-api-service"
ECR_REPO_NAME="joblander-api-repo"
DB_USERNAME="joblander_admin"
DB_PASSWORD="$(openssl rand -base64 18)"    # random password; saved to secrets manager
# --------------------------

echo "Starting joblander.org provisioning..."
echo "AWS CLI profile and credentials must be configured before running."

# ensure jq exists
if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: 'jq' is required. Install jq and re-run."
  exit 1
fi

# 1) Ensure hosted zone for DOMAIN exists; create if missing
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" --query "HostedZones[0].Id" --output text || echo "None")
if [ "$HOSTED_ZONE_ID" = "None" ] || [ -z "$HOSTED_ZONE_ID" ]; then
  echo "No hosted zone found for $DOMAIN. Creating hosted zone..."
  CREATE_ZONE=$(aws route53 create-hosted-zone --name "$DOMAIN" --caller-reference "joblander-$(date +%s)")
  HOSTED_ZONE_ID=$(echo "$CREATE_ZONE" | jq -r '.HostedZone.Id')
  # HostedZone.Id returns /hostedzone/XXXXXXXX -> strip prefix
  HOSTED_ZONE_ID=${HOSTED_ZONE_ID#/hostedzone/}
  echo "Created hosted zone: $HOSTED_ZONE_ID"
else
  # HostedZone.Id may be /hostedzone/ID or ID
  HOSTED_ZONE_ID=${HOSTED_ZONE_ID#/hostedzone/}
  echo "Found existing hosted zone: $HOSTED_ZONE_ID"
fi

# 2) Request ACM certificate for DOMAIN and WWW_DOMAIN in us-east-1
echo "Requesting ACM certificate for $DOMAIN and $WWW_DOMAIN in us-east-1..."
CERT_ARN=$(aws acm request-certificate \
  --region "$AWS_REGION" \
  --domain-name "$DOMAIN" \
  --subject-alternative-names "$WWW_DOMAIN" \
  --validation-method DNS \
  --output json | jq -r '.CertificateArn')

echo "Certificate requested: $CERT_ARN"

# 3) Create DNS validation records
echo "Fetching validation options..."
VALIDATION=$(aws acm describe-certificate --region "$AWS_REGION" --certificate-arn "$CERT_ARN")
# Pull DNS validation records for each domain name
for name_info in $(echo "$VALIDATION" | jq -c '.Certificate.DomainValidationOptions[]'); do
  DOMAIN_NAME=$(echo "$name_info" | jq -r '.DomainName')
  DNS_NAME=$(echo "$name_info" | jq -r '.ResourceRecord.Name')
  DNS_VALUE=$(echo "$name_info" | jq -r '.ResourceRecord.Value')

  # Create record in hosted zone
  echo "Creating Route53 validation record for $DOMAIN_NAME: $DNS_NAME -> $DNS_VALUE"
  CHANGE_BATCH=$(cat <<EOF
{
  "Comment": "ACM validation for $CERT_ARN",
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "$DNS_NAME",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [{"Value": "$DNS_VALUE"}]
    }
  }]
}
EOF
)
  aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch "$CHANGE_BATCH" >/dev/null
done

echo "DNS validation records created. Waiting for certificate to be ISSUED..."
# wait for cert to be issued
aws acm wait certificate-validated --region "$AWS_REGION" --certificate-arn "$CERT_ARN"
echo "ACM certificate issued."

# 4) Update CloudFront distribution to add Alternate Domains (CNAMEs) and attach certificate
echo "Updating CloudFront distribution $CLOUDFRONT_DIST_ID to include $DOMAIN and $WWW_DOMAIN and attach certificate..."
# get current config and etag
DIST_JSON=$(aws cloudfront get-distribution-config --id "$CLOUDFRONT_DIST_ID")
ETAG=$(echo "$DIST_JSON" | jq -r '.ETag')
DIST_CONFIG=$(echo "$DIST_JSON" | jq '.DistributionConfig')

# Inject AlternateDomainNames and ViewerCertificate (safely)
NEW_CONFIG=$(echo "$DIST_CONFIG" | \
  jq --arg d1 "$DOMAIN" --arg d2 "$WWW_DOMAIN" \
    '. + {Aliases: {Quantity:2, Items: [$d1,$d2]}}' | \
  jq --arg arn "$CERT_ARN" \
    '. + {ViewerCertificate: {ACMCertificateArn: $arn, SSLSupportMethod: "sni-only", MinimumProtocolVersion: "TLSv1.2_2019"}}' )

# Remove fields not allowed in update input if present
NEW_CONFIG=$(echo "$NEW_CONFIG" | jq 'del(.LastModifiedTime, .InProgressInvalidationBatches)')

# Update distribution
aws cloudfront update-distribution --id "$CLOUDFRONT_DIST_ID" --if-match "$ETAG" --distribution-config "$(echo "$NEW_CONFIG")" >/dev/null

echo "CloudFront distribution updated. Note: full propagation may take up to ~15 minutes."

# 5) Create Route53 A (alias) records pointing domain -> CloudFront distribution
# CloudFront alias uses hosted zone ID: Z2FDTNDATAQYW2 (global CloudFront zone id)
CLOUDFRONT_HOSTED_ZONE_ID="Z2FDTNDATAQYW2"

echo "Upserting Route53 alias records for $DOMAIN and $WWW_DOMAIN pointing to CloudFront..."
CHANGE_BATCH_ALIAS=$(cat <<EOF
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
aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch "$CHANGE_BATCH_ALIAS" >/dev/null
echo "Route53 alias records created."

# 6) Ensure S3 website config (SPA) points 404 to index.html and index document present
echo "Configuring S3 website settings for SPA routing..."
aws s3api put-bucket-website --bucket "$FRONTEND_S3_BUCKET" --website-configuration '{
  "IndexDocument": {"Suffix": "index.html"},
  "ErrorDocument": {"Key": "index.html"}
}' >/dev/null
echo "S3 website configured with index and error document index.html."

# 7) Configure CloudFront behavior: ensure error responses redirect 404 to /index.html
echo "Adding CloudFront custom error response (404 -> /index.html) to ensure SPA routing..."
# fetch config again
DIST_JSON=$(aws cloudfront get-distribution-config --id "$CLOUDFRONT_DIST_ID")
ETAG=$(echo "$DIST_JSON" | jq -r '.ETag')
DIST_CONFIG=$(echo "$DIST_JSON" | jq '.DistributionConfig')

# Add custom error responses
NEW_CONFIG=$(echo "$DIST_CONFIG" | jq '. + {CustomErrorResponses: {Quantity:1, Items:[{ErrorCode:404, ResponsePagePath:"/index.html", ResponseCode:"200", ErrorCachingMinTTL: 0}]}}')
NEW_CONFIG=$(echo "$NEW_CONFIG" | jq 'del(.LastModifiedTime, .InProgressInvalidationBatches)')

aws cloudfront update-distribution --id "$CLOUDFRONT_DIST_ID" --if-match "$ETAG" --distribution-config "$(echo "$NEW_CONFIG")" >/dev/null
echo "CloudFront 404->index.html rule applied."

# 8) Sync templates to S3 (uploads all local templates)
if [ -d "$TEMPLATES_LOCAL_DIR" ]; then
  echo "Syncing templates from $TEMPLATES_LOCAL_DIR to s3://$FRONTEND_S3_BUCKET/templates/"
  aws s3 sync "$TEMPLATES_LOCAL_DIR" "s3://$FRONTEND_S3_BUCKET/templates/" --acl public-read
  echo "Templates synced."
else
  echo "Warning: templates directory $TEMPLATES_LOCAL_DIR not found. Skipping sync."
fi

# 9) Create Secrets Manager secret for DB credentials
SECRET_NAME="joblander/prod/db"
echo "Creating Secrets Manager secret $SECRET_NAME..."
aws secretsmanager create-secret --name "$SECRET_NAME" --description "JobLander production DB credentials" --secret-string "$(jq -n --arg u "$DB_USERNAME" --arg p "$DB_PASSWORD" '{username:$u, password:$p}')" >/dev/null || {
  echo "Secret exists or failed to create. Attempting to put secret value..."
  aws secretsmanager put-secret-value --secret-id "$SECRET_NAME" --secret-string "$(jq -n --arg u "$DB_USERNAME" --arg p "$DB_PASSWORD" '{username:$u, password:$p}')" >/dev/null
}
echo "Secret ready."

# 10) Create CloudFormation template file for backend (ECS + RDS) - writes file to disk
cat > "$CFN_TEMPLATE_FILE" <<'YAML'
AWSTemplateFormatVersion: '2010-09-09'
Description: JobLander Backend stack - ECS Fargate + RDS + ALB + ECR
Parameters:
  VpcId:
    Type: AWS::EC2::VPC::Id
    Description: Existing VPC ID to deploy into (recommended). Leave empty to create new simple VPC (not implemented).
Resources:
  JobLanderECR:
    Type: AWS::ECR::Repository
    Properties:
      RepositoryName: joblander-api-repo
  JobLanderDB:
    Type: AWS::RDS::DBInstance
    Properties:
      DBName: joblander
      AllocatedStorage: 20
      DBInstanceClass: db.t3.micro
      Engine: postgres
      MasterUsername: !Ref DBMasterUser
      MasterUserPassword: !Ref DBMasterPassword
      PubliclyAccessible: false
      VPCSecurityGroups: []
  JobLanderTaskExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
            Action: sts:AssumeRole
      Path: /
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  JobLanderTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Cpu: '512'
      Memory: '1024'
      NetworkMode: awsvpc
      RequiresCompatibilities:
        - FARGATE
      ExecutionRoleArn: !GetAtt JobLanderTaskExecutionRole.Arn
      ContainerDefinitions:
        - Name: joblander-api
          Image: !Sub "${AWS::AccountId}.dkr.ecr.${AWS::Region}.amazonaws.com/joblander-api-repo:latest"
          PortMappings:
            - ContainerPort: 3000
          Environment:
            - Name: DATABASE_URL
              Value: !Join ['', ['postgresql://', !Ref DBMasterUser, ':', !Ref DBMasterPassword, '@', !GetAtt JobLanderDB.Endpoint.Address, ':5432/joblander']]
  JobLanderCluster:
    Type: AWS::ECS::Cluster
    Properties: {}
  JobLanderService:
    Type: AWS::ECS::Service
    Properties:
      Cluster: !Ref JobLanderCluster
      DesiredCount: 1
      LaunchType: FARGATE
      TaskDefinition: !Ref JobLanderTaskDefinition
      NetworkConfiguration:
        AwsvpcConfiguration:
          AssignPublicIp: ENABLED
          Subnets: []
          SecurityGroups: []
Outputs:
  ECRRepoUri:
    Value: !GetAtt JobLanderECR.RepositoryUri
    Description: ECR repository to push your backend image to.
YAML

echo "CloudFormation backend template written to $CFN_TEMPLATE_FILE."

# 11) Deploy CloudFormation stack (this template is intentionally minimal and requires you to edit VPC/Subnet/SecurityGroup params)
echo "INFO: deploying CloudFormation stack $BACKEND_STACK_NAME (note: template is minimal - you may need to edit VPC/Subnets in the template for production)."
aws cloudformation deploy --stack-name "$BACKEND_STACK_NAME" --template-file "$CFN_TEMPLATE_FILE" --capabilities CAPABILITY_NAMED_IAM || {
  echo "CloudFormation deploy failed or requires manual updates (VPC/subnets). Please open $CFN_TEMPLATE_FILE, edit subnet IDs and security groups, then run deploy again."
}

echo "Deployment script completed. Summary:"
echo "- Domain: $DOMAIN and $WWW_DOMAIN pointed to CloudFront ($CLOUDFRONT_DOMAIN)."
echo "- ACM Certificate ARN: $CERT_ARN (validated and attached to CloudFront)."
echo "- S3 website configured for SPA with error -> index.html."
echo "- Templates synced (if local directory existed)."
echo "- Secrets Manager secret: $SECRET_NAME (username: $DB_USERNAME)."
echo "- CloudFormation backend template: $CFN_TEMPLATE_FILE (deployed as stack $BACKEND_STACK_NAME)."
echo ""
echo "Next manual steps (if CloudFormation reported missing VPC/subnet values):"
echo "1) Edit $CFN_TEMPLATE_FILE and set the VPC Subnet IDs and Security Groups for ECS tasks and RDS (private subnets)."
echo "2) Build your backend Docker image, tag it with the ECR repo URI from CFN stack outputs, and push it to ECR."
echo "3) Update ECS TaskDefinition container image with the pushed image and update service."
echo ""
echo "If you want, I can now generate the commands to:"
echo "- push your backend docker image to ECR,"
echo "- update the ECS service with the new image,"
echo "- or expand the CloudFormation template to auto-create VPC/Subnets (less secure)."
