# AWS Deployment Quick Start

Get Job-Lander deployed to AWS in 3 steps.

## Prerequisites Checklist

- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Docker installed and running
- [ ] Node.js 18+ installed
- [ ] jq installed (`brew install jq`)

## 🚀 Quick Deploy

### Option 1: One-Command Deploy (Recommended)

```bash
# Deploy to development environment
STAGE=development bash scripts/deploy-to-aws.sh
```

This script will:
1. Prompt you for API keys
2. Set up AWS infrastructure
3. Build and deploy your application
4. Provide your deployment URL

**Expected time**: 15-20 minutes

### Option 2: Manual Deploy

```bash
# 1. Set up secrets
bash scripts/setup-aws-secrets.sh

# 2. Install CDK
cd infrastructure && npm install && cd ..

# 3. Bootstrap CDK (first time only)
cd infrastructure && npx cdk bootstrap && cd ..

# 4. Deploy
STAGE=development bash scripts/deploy-to-aws.sh
```

## 📝 Required API Keys

You'll need these API keys (get them from `.env` file or API providers):

- **GEMINI_API_KEY**: https://aistudio.google.com/app/apikey
- **JSEARCH_API_KEY**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- **WEB3_RPC_URL**: Alchemy, Infura, or QuickNode
- **PRIVATE_KEY**: Your blockchain wallet private key (testnet)

## 🌍 Environment Stages

```bash
# Development (cheaper, single instance)
STAGE=development bash scripts/deploy-to-aws.sh

# Staging (2 instances, auto-scaling)
STAGE=staging bash scripts/deploy-to-aws.sh

# Production (3 instances, auto-scaling, enhanced features)
STAGE=production bash scripts/deploy-to-aws.sh
```

## 🔍 After Deployment

### Get Your Application URL

```bash
# Get Load Balancer URL
aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text

# Get CloudFront URL (CDN)
aws cloudformation describe-stacks \
  --stack-name JobLanderDev \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text
```

### View Logs

```bash
# Live tail
aws logs tail /ecs/job-lander-development --follow

# Last hour
aws logs tail /ecs/job-lander-development --since 1h
```

### Check Service Status

```bash
aws ecs describe-services \
  --cluster JobLanderDev-JobLanderCluster \
  --services JobLanderDev-JobLanderService \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}'
```

## 🔄 Update Deployment

```bash
# Rebuild and redeploy
STAGE=development bash scripts/deploy-to-aws.sh

# Or just update code (skip secrets)
SKIP_SECRETS=true STAGE=development bash scripts/deploy-to-aws.sh
```

## 💰 Estimated Costs

| Environment | Cost/Month | Notes |
|-------------|------------|-------|
| Development | $50-80 | Single small instance |
| Staging | $150-200 | 2 instances + autoscaling |
| Production | $400-600 | 3 instances + monitoring |

**Save money in dev:**
```bash
# Stop when not in use
aws ecs update-service \
  --cluster JobLanderDev-JobLanderCluster \
  --service JobLanderDev-JobLanderService \
  --desired-count 0

# Restart
aws ecs update-service \
  --cluster JobLanderDev-JobLanderCluster \
  --service JobLanderDev-JobLanderService \
  --desired-count 1
```

## 🆘 Troubleshooting

### "Cannot connect to Docker daemon"
```bash
open /Applications/Docker.app
```

### "AWS CLI not configured"
```bash
aws configure
```

### View errors
```bash
aws logs tail /ecs/job-lander-development --filter-pattern "ERROR" --follow
```

### Destroy everything (⚠️ deletes all data!)
```bash
cd infrastructure
npx cdk destroy JobLanderDev
```

## 📚 Full Documentation

For detailed guides, see:
- **[AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Docker deployment
- **[README.md](README.md)** - Local development

## 🎯 Next Steps

1. **Custom Domain**: Set up Route 53 and SSL certificate
2. **CI/CD**: Configure GitHub Actions (see `.github/workflows/deploy.yml`)
3. **Monitoring**: Set up CloudWatch alarms
4. **Backup**: Configure RDS automated backups

## 💡 Pro Tips

1. **Use development environment** for testing - it's cheaper
2. **Set up CloudWatch alarms** for production
3. **Enable container insights** for better monitoring
4. **Use Fargate Spot** for dev environments (70% savings)
5. **Tag resources** for cost tracking

---

**Need Help?** Check the full [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) or logs:
```bash
aws logs tail /ecs/job-lander-development --follow
```
