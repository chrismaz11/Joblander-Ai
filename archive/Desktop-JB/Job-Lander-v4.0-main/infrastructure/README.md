# Job-Lander AWS CDK Infrastructure

AWS Cloud Development Kit (CDK) infrastructure for Job-Lander.

## Overview

This directory contains the Infrastructure as Code (IaC) using AWS CDK to deploy Job-Lander to AWS. The infrastructure includes:

- **ECS Fargate**: Containerized application hosting
- **RDS PostgreSQL**: Managed database
- **Application Load Balancer**: Traffic distribution
- **CloudFront CDN**: Global content delivery
- **S3**: Object storage for uploads
- **Secrets Manager**: Secure credential storage
- **CloudWatch**: Logging and monitoring

## Structure

```
infrastructure/
├── bin/
│   └── infrastructure.ts    # CDK app entry point
├── lib/
│   └── job-lander-stack.ts  # Main infrastructure stack
├── cdk.json                  # CDK configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## Quick Start

### Prerequisites

1. AWS CLI configured (`aws configure`)
2. Node.js 18+ installed
3. Docker running (for deployment)

### Install Dependencies

```bash
npm install
```

### Deploy

```bash
# Development environment
npm run deploy:dev

# Staging environment
npm run deploy:staging

# Production environment
npm run deploy:prod
```

## Available Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch for changes
npm run watch

# Show what will be deployed
npx cdk diff JobLanderDev

# Deploy specific stack
npx cdk deploy JobLanderDev

# Deploy all stacks
npx cdk deploy --all

# Synthesize CloudFormation template
npm run synth

# Destroy stack (⚠️ deletes all resources!)
npx cdk destroy JobLanderDev
```

## Environments

### Development (`JobLanderDev`)
- **Purpose**: Testing and development
- **CPU**: 512 (0.5 vCPU)
- **Memory**: 1024 MB (1 GB)
- **Instances**: 1
- **Auto-scaling**: Disabled
- **Cost**: ~$50-80/month

### Staging (`JobLanderStaging`)
- **Purpose**: Pre-production testing
- **CPU**: 1024 (1 vCPU)
- **Memory**: 2048 MB (2 GB)
- **Instances**: 2
- **Auto-scaling**: Enabled (2-6 tasks)
- **Cost**: ~$150-200/month

### Production (`JobLanderProd`)
- **Purpose**: Live application
- **CPU**: 2048 (2 vCPU)
- **Memory**: 4096 MB (4 GB)
- **Instances**: 3
- **Auto-scaling**: Enabled (3-9 tasks)
- **Cost**: ~$400-600/month

## Stack Configuration

### Environment Variables

Set these environment variables before deployment:

```bash
export CDK_DEFAULT_ACCOUNT="123456789012"  # Your AWS account ID
export CDK_DEFAULT_REGION="us-east-1"      # Your preferred region
```

For production with custom domain:
```bash
export HOSTED_ZONE_ID="Z1234567890ABC"     # Route 53 hosted zone ID
export DOMAIN_NAME="app.example.com"       # Your domain name
```

### Secrets

Before deploying, create secrets in AWS Secrets Manager:

```bash
# Run from project root
bash scripts/setup-aws-secrets.sh
```

Required secrets:
- `job-lander/gemini-api-key-{stage}`
- `job-lander/canva-client-id-{stage}`
- `job-lander/canva-client-secret-{stage}`
- `job-lander/jsearch-api-key-{stage}`
- `job-lander/web3-rpc-url-{stage}`
- `job-lander/private-key-{stage}`
- `job-lander/session-secret-{stage}`

## Stack Outputs

After deployment, the stack provides these outputs:

- **LoadBalancerDNS**: Direct ALB access URL
- **CloudFrontURL**: CDN distribution URL (recommended)
- **DatabaseEndpoint**: RDS endpoint for connections
- **ECRRepositoryURI**: Container registry URI
- **UploadsBucketName**: S3 bucket for uploads
- **ClusterName**: ECS cluster name
- **ServiceName**: ECS service name

Get outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs'
```

## Architecture

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       v
┌─────────────────┐
│   CloudFront    │  (CDN + HTTPS)
└────────┬────────┘
         │
         v
┌─────────────────┐
│      ALB        │  (Load Balancing + Health Checks)
└────────┬────────┘
         │
         v
┌─────────────────────────────────┐
│     ECS Fargate Service         │
│  ┌─────────┐  ┌─────────┐      │
│  │ Task 1  │  │ Task 2  │ ...  │
│  └─────────┘  └─────────┘      │
└────┬──────────────┬─────────────┘
     │              │
     v              v
┌────────────┐  ┌────────────┐
│ RDS PG     │  │ S3 Bucket  │
└────────────┘  └────────────┘
```

## Customization

### Modify Instance Sizes

Edit `bin/infrastructure.ts`:

```typescript
new JobLanderStack(app, 'JobLanderDev', {
  stage: 'development',
  desiredCount: 1,
  cpu: 1024,        // Change CPU
  memory: 2048,     // Change memory
  enableAutoScaling: false,
});
```

### Modify Database Configuration

Edit `lib/job-lander-stack.ts`:

```typescript
const database = new rds.DatabaseInstance(this, 'Database', {
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.SMALL  // Change size
  ),
  allocatedStorage: 50,     // Change storage
  // ... other options
});
```

### Add Environment Variables

Edit `lib/job-lander-stack.ts`:

```typescript
environment: {
  NODE_ENV: 'production',
  PORT: '5000',
  YOUR_NEW_VAR: 'value',  // Add here
},
```

### Add Auto-scaling Policies

Edit `lib/job-lander-stack.ts`:

```typescript
scaling.scaleOnRequestCount('RequestScaling', {
  targetRequestsPerMinute: 1000,
  scaleInCooldown: cdk.Duration.seconds(60),
  scaleOutCooldown: cdk.Duration.seconds(60),
});
```

## Troubleshooting

### CDK Bootstrap Required

**Error**: "This stack uses assets, so the toolkit stack must be deployed"

**Solution**:
```bash
npx cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Stack Rollback

If deployment fails and stack enters ROLLBACK state:

```bash
# Delete the stack
npx cdk destroy JobLanderDev

# Or in AWS Console: CloudFormation → Delete Stack

# Then retry deployment
npx cdk deploy JobLanderDev
```

### View CloudFormation Events

```bash
aws cloudformation describe-stack-events \
  --stack-name JobLanderDev \
  --max-items 20
```

### Synthesize CloudFormation Template

To see the generated CloudFormation template:

```bash
npx cdk synth JobLanderDev > template.yaml
```

## Cost Management

### View Estimated Costs

```bash
# Use AWS Cost Calculator
# https://calculator.aws/

# Or check AWS Cost Explorer
# https://console.aws.amazon.com/cost-management/home
```

### Reduce Development Costs

1. **Stop services when not in use**:
   ```bash
   aws ecs update-service \
     --cluster JobLanderDev-JobLanderCluster \
     --service JobLanderDev-JobLanderService \
     --desired-count 0
   ```

2. **Use Fargate Spot** (in `lib/job-lander-stack.ts`):
   ```typescript
   capacityProviderStrategies: [{
     capacityProvider: 'FARGATE_SPOT',
     weight: 1,
   }],
   ```

3. **Destroy when not needed**:
   ```bash
   npx cdk destroy JobLanderDev
   ```

## Security Best Practices

1. **Secrets Management**: All sensitive data stored in AWS Secrets Manager
2. **Database**: RDS in private subnet, not publicly accessible
3. **Network**: Security groups restrict access between services
4. **HTTPS**: CloudFront enforces HTTPS for all traffic
5. **Container Security**: ECR image scanning enabled
6. **Least Privilege**: IAM roles follow least privilege principle

## Monitoring

### CloudWatch Logs

```bash
# View application logs
aws logs tail /ecs/job-lander-development --follow

# View CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name JobLanderDev
```

### Set Up Alarms

Create CloudWatch alarms for:
- High CPU utilization (>80%)
- High memory utilization (>80%)
- Failed health checks
- High error rates
- Database connection issues

## Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/)
- [CloudFormation Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/)

## Support

For deployment issues:
1. Check CloudWatch logs
2. Review CloudFormation events
3. See [AWS_DEPLOYMENT_GUIDE.md](../AWS_DEPLOYMENT_GUIDE.md)
4. Check GitHub Issues

---

**Version**: 1.0.0  
**CDK Version**: 2.115.0  
**Last Updated**: October 2024
