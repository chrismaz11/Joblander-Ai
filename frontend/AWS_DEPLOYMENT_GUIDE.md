# Job-Lander AWS Deployment Guide

Complete guide for deploying Job-Lander to AWS using AWS CDK, ECS Fargate, RDS PostgreSQL, and CloudFront.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Deployment Methods](#deployment-methods)
5. [Environment Management](#environment-management)
6. [Monitoring & Logging](#monitoring--logging)
7. [Troubleshooting](#troubleshooting)
8. [Cost Optimization](#cost-optimization)

---

## Architecture Overview

### AWS Services Used

- **ECS Fargate**: Serverless container orchestration for the application
- **RDS PostgreSQL**: Managed database service
- **ECR**: Container registry for Docker images
- **Application Load Balancer**: Traffic distribution and health checks
- **CloudFront**: CDN for global content delivery
- **S3**: Object storage for uploads and static assets
- **Secrets Manager**: Secure storage for API keys and credentials
- **CloudWatch**: Logging and monitoring
- **VPC**: Network isolation and security

### Architecture Diagram

```
Internet
    ↓
CloudFront CDN
    ↓
Application Load Balancer
    ↓
ECS Fargate Service (Auto-scaling)
    ↓
    ├─→ RDS PostgreSQL (Private Subnet)
    ├─→ S3 Bucket (Uploads)
    └─→ Secrets Manager (API Keys)
```

### Environment Tiers

| Environment | CPU  | Memory | Instances | Auto-scaling | Cost/Month* |
|-------------|------|--------|-----------|--------------|-------------|
| Development | 512  | 1 GB   | 1         | No           | ~$50-80     |
| Staging     | 1024 | 2 GB   | 2         | Yes          | ~$150-200   |
| Production  | 2048 | 4 GB   | 3         | Yes          | ~$400-600   |

*Estimated costs vary based on usage

---

## Prerequisites

### Required Software

1. **AWS CLI** (v2.x or higher)
   ```bash
   # Install AWS CLI (macOS)
   brew install awscli
   
   # Verify installation
   aws --version
   ```

2. **Docker** (20.x or higher)
   ```bash
   # Install Docker Desktop
   # Download from: https://www.docker.com/products/docker-desktop
   
   # Verify installation
   docker --version
   ```

3. **Node.js** (18.x or higher)
   ```bash
   # Already installed based on project requirements
   node --version
   ```

4. **jq** (for JSON parsing)
   ```bash
   # Install jq (macOS)
   brew install jq
   ```

### AWS Account Setup

1. **Create AWS Account** (if you don't have one)
   - Visit: https://aws.amazon.com/
   - Complete registration and billing setup

2. **Configure AWS CLI**
   ```bash
   aws configure
   ```
   
   Provide:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., `us-east-1`)
   - Default output format: `json`

3. **Verify AWS Configuration**
   ```bash
   aws sts get-caller-identity
   ```
   
   Should return your AWS account details.

### IAM Permissions Required

Your AWS user/role needs the following permissions:
- **ECS**: Full access (create clusters, services, tasks)
- **ECR**: Full access (create repositories, push images)
- **RDS**: Full access (create databases)
- **EC2**: VPC and security group management
- **ELB**: Create and manage load balancers
- **CloudFormation**: Full access (for CDK)
- **Secrets Manager**: Create and manage secrets
- **CloudWatch**: Create log groups
- **S3**: Create and manage buckets
- **CloudFront**: Create distributions
- **IAM**: Create roles and policies

**Recommended**: Use the `PowerUserAccess` or `AdministratorAccess` policy for initial setup.

---

## Initial Setup

### Step 1: Configure AWS Secrets

Create secrets for your API keys and credentials:

```bash
# Run the setup script
bash scripts/setup-aws-secrets.sh
```

The script will prompt you for:
- `GEMINI_API_KEY`: Google Gemini AI API key
- `JSEARCH_API_KEY`: Job search API key
- `WEB3_RPC_URL`: Blockchain RPC endpoint
- `PRIVATE_KEY`: Blockchain private key

**Manual Secret Creation** (alternative):
```bash
aws secretsmanager create-secret \
  --name job-lander/gemini-api-key-development \
  --description "Gemini AI API Key" \
  --secret-string "YOUR_API_KEY" \
  --region us-east-1
```

### Step 2: Install CDK Dependencies

```bash
cd infrastructure
npm install
cd ..
```

### Step 3: Bootstrap AWS CDK

First-time CDK setup in your AWS account:

```bash
cd infrastructure
npx cdk bootstrap
cd ..
```

This creates the necessary S3 bucket and IAM roles for CDK deployments.

---

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

The complete deployment script handles everything:

```bash
# Deploy to development
STAGE=development bash scripts/deploy-to-aws.sh

# Deploy to staging
STAGE=staging bash scripts/deploy-to-aws.sh

# Deploy to production
STAGE=production bash scripts/deploy-to-aws.sh
```

**What the script does:**
1. ✅ Prompts for secrets (if needed)
2. ✅ Installs CDK dependencies
3. ✅ Bootstraps CDK
4. ✅ Builds Docker image
5. ✅ Pushes to ECR
6. ✅ Deploys infrastructure with CDK
7. ✅ Waits for service stability
8. ✅ Runs database migrations
9. ✅ Provides deployment URLs

**Skip steps:**
```bash
# Skip secrets setup
SKIP_SECRETS=true STAGE=production bash scripts/deploy-to-aws.sh

# Skip Docker build (use existing image)
SKIP_BUILD=true STAGE=production bash scripts/deploy-to-aws.sh
```

### Method 2: Manual Step-by-Step Deployment

#### 1. Build and Push Docker Image

```bash
# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
STAGE=development

# Create ECR repository
aws ecr create-repository \
  --repository-name job-lander-${STAGE} \
  --region ${REGION}

# Login to ECR
aws ecr get-login-password --region ${REGION} | \
  docker login --username AWS --password-stdin \
  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build image
docker build -t job-lander-${STAGE}:latest .

# Tag image
docker tag job-lander-${STAGE}:latest \
  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/job-lander-${STAGE}:latest

# Push image
docker push \
  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/job-lander-${STAGE}:latest
```

#### 2. Deploy Infrastructure with CDK

```bash
cd infrastructure

# Preview changes
npx cdk diff JobLanderDev

# Deploy development
npx cdk deploy JobLanderDev --require-approval never

# Deploy staging
npx cdk deploy JobLanderStaging --require-approval never

# Deploy production
npx cdk deploy JobLanderProd --require-approval never

cd ..
```

#### 3. Run Database Migrations

```bash
# Get ECS cluster and service names from CloudFormation outputs
CLUSTER_NAME=$(aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs[?OutputKey==`ClusterName`].OutputValue' \
  --output text)

SERVICE_NAME=$(aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs[?OutputKey==`ServiceName`].OutputValue' \
  --output text)

# Get running task
TASK_ARN=$(aws ecs list-tasks \
  --cluster ${CLUSTER_NAME} \
  --service-name ${SERVICE_NAME} \
  --query 'taskArns[0]' \
  --output text)

# Run migrations
aws ecs execute-command \
  --cluster ${CLUSTER_NAME} \
  --task ${TASK_ARN} \
  --container JobLanderContainer \
  --interactive \
  --command "npm run db:push"
```

### Method 3: GitHub Actions CI/CD

The project includes a complete CI/CD pipeline in `.github/workflows/deploy.yml`.

#### Setup GitHub Secrets

Add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`
- `HOSTED_ZONE_ID` (optional, for custom domains)

#### Trigger Deployment

```bash
# Deploy to development
git push origin develop

# Deploy to staging
git push origin staging

# Deploy to production
git push origin main
```

**Workflow Features:**
- ✅ Runs tests before deployment
- ✅ TypeScript type checking
- ✅ Multi-platform Docker builds (amd64/arm64)
- ✅ Automatic ECS service updates
- ✅ Database migrations on production
- ✅ Deployment notifications

---

## Environment Management

### View Deployed Stacks

```bash
# List all CloudFormation stacks
aws cloudformation list-stacks --region us-east-1

# Get stack outputs
aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs'
```

### Update Environment Variables

To update non-secret environment variables, modify `infrastructure/lib/job-lander-stack.ts` and redeploy:

```bash
cd infrastructure
npx cdk deploy JobLanderDev
```

### Update Secrets

```bash
# Update a secret
aws secretsmanager put-secret-value \
  --secret-id job-lander/gemini-api-key-development \
  --secret-string "NEW_API_KEY"

# Restart ECS service to pick up new secrets
aws ecs update-service \
  --cluster JobLanderDev-JobLanderCluster \
  --service JobLanderDev-JobLanderService \
  --force-new-deployment
```

### Scale Services

```bash
# Scale development to 2 tasks
aws ecs update-service \
  --cluster JobLanderDev-JobLanderCluster \
  --service JobLanderDev-JobLanderService \
  --desired-count 2
```

### Database Access

#### Connect to RDS via Bastion Host

```bash
# Create EC2 bastion in the same VPC
# Then SSH tunnel:
ssh -L 5432:${RDS_ENDPOINT}:5432 ec2-user@${BASTION_IP}

# Connect locally
psql -h localhost -U postgres -d joblander
```

#### Connect from ECS Task

```bash
# Execute shell in running container
aws ecs execute-command \
  --cluster ${CLUSTER_NAME} \
  --task ${TASK_ARN} \
  --container JobLanderContainer \
  --interactive \
  --command "/bin/sh"
```

---

## Monitoring & Logging

### View Application Logs

```bash
# Tail logs (live)
aws logs tail /ecs/job-lander-development --follow

# View logs from last hour
aws logs tail /ecs/job-lander-development --since 1h

# Filter logs
aws logs tail /ecs/job-lander-development \
  --filter-pattern "ERROR" \
  --follow
```

### CloudWatch Metrics

View in AWS Console:
1. Navigate to **CloudWatch** → **Dashboards**
2. Key metrics to monitor:
   - ECS CPU Utilization
   - ECS Memory Utilization
   - ALB Target Response Time
   - RDS Database Connections
   - RDS CPU Utilization

### Set Up Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name job-lander-high-cpu \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### Access Service URLs

After deployment, get your service URLs:

```bash
# Load Balancer URL
aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text

# CloudFront URL
aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text
```

---

## Troubleshooting

### Common Issues

#### 1. Docker Build Fails

**Error**: "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop
open /Applications/Docker.app

# Wait for Docker to start
docker ps
```

#### 2. ECR Push Denied

**Error**: "denied: Your authorization token has expired"
```bash
# Re-authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com
```

#### 3. ECS Tasks Failing to Start

**Check task logs:**
```bash
aws ecs describe-tasks \
  --cluster ${CLUSTER_NAME} \
  --tasks ${TASK_ARN} \
  --query 'tasks[0].containers[0].reason'
```

**Common causes:**
- Missing secrets in Secrets Manager
- Insufficient memory/CPU
- Health check failing
- Database connection issues

**Solution**: Check CloudWatch logs:
```bash
aws logs tail /ecs/job-lander-development --since 5m
```

#### 4. Database Connection Timeout

**Check security groups:**
```bash
# Ensure ECS security group can access RDS on port 5432
# Verify in AWS Console: EC2 → Security Groups
```

**Test connection from ECS task:**
```bash
aws ecs execute-command \
  --cluster ${CLUSTER_NAME} \
  --task ${TASK_ARN} \
  --container JobLanderContainer \
  --interactive \
  --command "nc -zv ${RDS_ENDPOINT} 5432"
```

#### 5. CDK Bootstrap Issues

**Error**: "Need to perform AWS calls for account..."
```bash
# Bootstrap your account/region
cd infrastructure
npx cdk bootstrap aws://${ACCOUNT_ID}/${REGION}
```

#### 6. 502 Bad Gateway

**Causes:**
- Application not healthy
- Health check path incorrect
- Container port mismatch

**Debug:**
```bash
# Check target health
aws elbv2 describe-target-health \
  --target-group-arn ${TARGET_GROUP_ARN}

# Check application is running on correct port
aws logs tail /ecs/job-lander-development --since 5m | grep "PORT"
```

### Rollback Deployment

```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster ${CLUSTER_NAME} \
  --service ${SERVICE_NAME} \
  --task-definition job-lander-task-development:PREVIOUS_REVISION
```

### Destroy Infrastructure

**⚠️ Warning**: This will delete all resources and data!

```bash
cd infrastructure

# Destroy development
npx cdk destroy JobLanderDev

# Destroy all environments
npx cdk destroy --all
```

**Note**: RDS databases in production use snapshot retention and won't be permanently deleted immediately.

---

## Cost Optimization

### Development Environment

**Reduce costs for dev:**

1. **Use Fargate Spot** (50-70% savings):
   ```typescript
   // In infrastructure/lib/job-lander-stack.ts
   capacityProviderStrategies: [{
     capacityProvider: 'FARGATE_SPOT',
     weight: 1,
   }],
   ```

2. **Use smaller RDS instance**:
   - t3.micro (currently configured for dev)
   - Enable auto-pause for Aurora Serverless

3. **Stop services when not in use**:
   ```bash
   aws ecs update-service \
     --cluster JobLanderDev-JobLanderCluster \
     --service JobLanderDev-JobLanderService \
     --desired-count 0
   ```

4. **Delete CloudFront** (if not needed for dev):
   - Comment out CloudFront distribution in CDK stack

### Monitoring Costs

```bash
# View AWS Cost Explorer
# https://console.aws.amazon.com/cost-management/home

# Get current month costs by service
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### Cost Estimate Breakdown

**Development (~$50-80/month):**
- ECS Fargate: ~$15/month (1 task, 512 CPU, 1GB RAM)
- RDS t3.micro: ~$15/month
- ALB: ~$18/month
- CloudFront: ~$5/month (light usage)
- Data transfer: ~$5/month
- Secrets Manager: ~$2/month (7 secrets)

**Production (~$400-600/month):**
- ECS Fargate: ~$180/month (3 tasks, 2048 CPU, 4GB RAM)
- RDS t3.medium: ~$60/month
- ALB: ~$18/month
- CloudFront: ~$50/month (moderate usage)
- S3: ~$10/month
- Data transfer: ~$50/month
- CloudWatch: ~$15/month
- Backups: ~$20/month

---

## Additional Resources

### AWS Documentation
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [CDK Workshop](https://cdkworkshop.com/)

### Project-Specific
- See `DEPLOYMENT.md` for Docker-based deployment
- See `README.md` for local development setup
- See `WARP.md` for development commands

### Support
For issues or questions:
1. Check CloudWatch logs
2. Review GitHub Issues
3. Consult AWS Support (if you have a support plan)

---

**Last Updated**: October 2024
**CDK Version**: 2.115.0
**AWS CLI Version**: 2.x
