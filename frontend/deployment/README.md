# Deployment Guide for Job-Lander v4.0

This directory contains deployment automation scripts and configuration for Job-Lander v4.0, supporting safe deployments across development, staging, and production environments.

## Quick Start

```bash
# Deploy to development
npm run deploy:dev

# Deploy to staging  
npm run deploy:staging

# Deploy to production (requires --force flag)
npm run deploy:prod

# Rollback if needed
npm run rollback:prod --force
```

## Overview

### Deployment Architecture

Job-Lander uses AWS Amplify for hosting with supporting infrastructure:

- **Frontend**: React + Vite deployed to Amplify Hosting
- **Backend**: Node.js + Express deployed as Lambda functions
- **Database**: PostgreSQL with automated migrations
- **Blockchain**: Polygon Mumbai testnet for verification
- **Monitoring**: CloudWatch + custom metrics
- **Notifications**: Slack integration for deployment updates

### Directory Structure

```
deployment/
├── README.md                    # This file
├── scripts/
│   ├── deploy.ts               # Main deployment script
│   └── rollback.ts             # Rollback automation
├── rollback/                   # Backup files for rollbacks
├── artifacts/                  # Deployment packages
└── config/                     # Environment configurations
```

## Deployment Scripts

### deploy.ts - Main Deployment Script

Comprehensive deployment automation with:
- Environment validation
- Automated testing
- Database migrations  
- Health checks
- Automatic rollback on failure

#### Usage

```bash
# Basic deployment
npx tsx deployment/scripts/deploy.ts <environment>

# With options
npx tsx deployment/scripts/deploy.ts production --skip-tests --no-rollback

# Available environments
npx tsx deployment/scripts/deploy.ts development
npx tsx deployment/scripts/deploy.ts staging  
npx tsx deployment/scripts/deploy.ts production
```

#### Command Line Options

- `--skip-tests`: Skip test execution (not recommended for production)
- `--skip-migrations`: Skip database migrations
- `--no-rollback`: Disable automatic rollback on failure
- `--force`: Skip confirmation prompts

#### Example Output

```
🚀 Starting deployment to PRODUCTION
Configuration: {
  "environment": "production",
  "skipTests": false,
  "skipMigrations": false,
  "autoRollback": true
}

⏳ Record current deployment state...
✅ Record current deployment state completed in 1247ms

⏳ Validate environment configuration...
✅ Validate environment configuration completed in 856ms

⏳ Run test suite...
✅ Run test suite completed in 45231ms

⏳ Build application...
✅ Build application completed in 78945ms

🎉 Deployment completed successfully!
🔗 Application URL: https://app.joblander.com
```

### rollback.ts - Rollback Script

Safe rollback automation with:
- Backup validation
- Multi-method rollback (Amplify + Git)
- Database restoration
- Health verification
- Dry-run capability

#### Usage

```bash
# Basic rollback to most recent backup
npx tsx deployment/scripts/rollback.ts <environment>

# Rollback to specific deployment
npx tsx deployment/scripts/rollback.ts production --target=1234567890

# With database restoration
npx tsx deployment/scripts/rollback.ts production --restore-db --force

# Dry run (recommended first)
npx tsx deployment/scripts/rollback.ts production --dry-run
```

#### Command Line Options

- `--target=<timestamp>`: Rollback to specific deployment backup
- `--restore-db`: Also restore database from backup
- `--skip-health-checks`: Skip post-rollback health validation
- `--force`: Skip confirmation prompts (required for production)
- `--dry-run`: Show what would be done without making changes

#### Safety Features

- **Production Protection**: Requires `--force` flag for production rollbacks
- **Confirmation Prompts**: Interactive confirmation for destructive operations  
- **Backup Creation**: Creates checkpoint before rollback starts
- **Health Validation**: Verifies application health after rollback
- **Dry Run Mode**: Test rollback process without making changes

## Environment Setup

### Required Environment Variables

Copy `.env.example` to `.env` and configure:

#### Core Application
```bash
NODE_ENV=production                    # Environment mode
DATABASE_URL=postgresql://...          # PostgreSQL connection
AWS_REGION=us-east-1                  # AWS region
AMPLIFY_APP_ID=d1234567890abcdef      # Amplify app ID
```

#### API Keys
```bash
GEMINI_API_KEY=your_gemini_key        # Google AI API key
JSEARCH_API_KEY=your_jsearch_key      # Job search API
```

#### Blockchain (Optional)
```bash
SETUP_BLOCKCHAIN=true                 # Enable blockchain features
WEB3_RPC_URL=https://polygon-mumbai... # Polygon RPC endpoint
PRIVATE_KEY=your_private_key          # Wallet private key (testnet)
CONTRACT_ADDRESS=0x1234...            # Deployed contract address
```

#### Monitoring & Notifications
```bash
AWS_ACCOUNT_ID=123456789012           # AWS account for CloudWatch
SLACK_WEBHOOK_URL=https://hooks.slack.com/... # Deployment notifications
```

#### Environment-Specific URLs
```bash
DEVELOPMENT_URL=http://localhost:5173
STAGING_URL=https://staging.joblander.com
PRODUCTION_URL=https://app.joblander.com
```

### AWS Configuration

Ensure AWS CLI is configured with appropriate permissions:

```bash
# Configure AWS credentials
aws configure

# Verify access
aws sts get-caller-identity
aws amplify get-app --app-id $AMPLIFY_APP_ID
```

#### Required AWS Permissions

The deployment user needs permissions for:
- Amplify app management
- Lambda function deployment
- CloudWatch metrics and logs
- KMS key access (for blockchain features)
- Secrets Manager (for configuration)

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "deploy:dev": "tsx deployment/scripts/deploy.ts development",
    "deploy:staging": "tsx deployment/scripts/deploy.ts staging", 
    "deploy:prod": "tsx deployment/scripts/deploy.ts production --force",
    "rollback:dev": "tsx deployment/scripts/rollback.ts development",
    "rollback:staging": "tsx deployment/scripts/rollback.ts staging",
    "rollback:prod": "tsx deployment/scripts/rollback.ts production",
    "build:backend": "tsc --project server/tsconfig.json",
    "db:push": "drizzle-kit push:pg"
  }
}
```

## Deployment Process

### Development Environment

Development deployments are straightforward with minimal safety checks:

```bash
npm run deploy:dev
```

**Features**:
- Basic tests only
- No migration backups
- Relaxed health checks
- Automatic rollback on failure

### Staging Environment  

Staging deployments include production-like safety measures:

```bash
npm run deploy:staging
```

**Features**:
- Full test suite execution
- Database migration testing
- Security scans
- Performance validation
- Health checks
- Slack notifications

### Production Environment

Production deployments require explicit confirmation and include all safety measures:

```bash
npm run deploy:prod
```

**Features**:
- Comprehensive testing (unit, integration, security)
- Database backups before migrations
- Blockchain resource setup
- Full health validation
- Monitoring dashboard updates
- Automatic rollback on failure
- Slack notifications
- Performance metrics

## Rollback Procedures

### When to Rollback

Consider rollback in these scenarios:
- Critical bugs discovered after deployment
- Performance degradation
- Failed health checks
- User-reported issues
- Database corruption

### Rollback Methods

#### 1. Application-Only Rollback

Rolls back application code without affecting database:

```bash
npm run rollback:prod --force
```

**Use when**:
- Application bugs without data changes
- Frontend issues
- Configuration problems

#### 2. Full Rollback with Database

Rolls back both application and database:

```bash
npx tsx deployment/scripts/rollback.ts production --restore-db --force
```

**Use when**:
- Database migration failures
- Data corruption issues
- Schema incompatibilities

⚠️ **Warning**: Database rollback overwrites current data

#### 3. Targeted Rollback

Roll back to a specific deployment:

```bash
npx tsx deployment/scripts/rollback.ts production --target=1673640000000 --force
```

**Use when**:
- Need to revert multiple deployments
- Specific known-good state exists
- Surgical precision required

### Rollback Safety

#### Pre-Rollback Checklist

1. **Assess Impact**: Understand what will be reverted
2. **Check Dependencies**: Verify external integrations
3. **Backup Current State**: Script automatically creates checkpoint
4. **Notify Team**: Communicate rollback to stakeholders
5. **Monitor Resources**: Ensure sufficient resources available

#### Production Rollback Process

1. **Dry Run First**:
   ```bash
   npx tsx deployment/scripts/rollback.ts production --dry-run
   ```

2. **Execute Rollback**:
   ```bash
   npx tsx deployment/scripts/rollback.ts production --force
   ```

3. **Verify Success**:
   - Check application health
   - Validate critical user flows
   - Monitor error rates
   - Confirm database integrity

4. **Post-Rollback Actions**:
   - Update monitoring dashboards
   - Notify users (if necessary)
   - Create incident report
   - Plan fix deployment

## Health Checks

Both deployment and rollback scripts include comprehensive health monitoring:

### Application Health Endpoints

Scripts automatically test these endpoints:
- `/api/health` - Basic application health
- `/api/health/db` - Database connectivity
- `/api/admin/llm/health` - AI service health
- `/api/blockchain/health` - Blockchain service health
- `/api/version` - Version information

### Critical User Flows

Automated testing of:
- Homepage accessibility
- API responsiveness
- Authentication flows (in CI/CD)
- Core feature availability

### Health Check Failure Response

If health checks fail:
1. **Development**: Warning logged, deployment continues
2. **Staging**: Deployment fails, automatic rollback triggered
3. **Production**: Deployment fails, automatic rollback triggered

## Monitoring and Alerting

### CloudWatch Metrics

Deployment scripts publish custom metrics:
- `JobLander/Deployments/DeploymentSuccess`
- `JobLander/Deployments/DeploymentDuration` 
- `JobLander/Deployments/RollbackExecuted`

### Slack Notifications

Configure `SLACK_WEBHOOK_URL` to receive:
- Deployment start/completion notifications
- Rollback alerts
- Health check failures
- Performance warnings

### Log Monitoring

Monitor these log streams:
- Application deployment logs
- Database migration logs
- Health check results
- Error rates and patterns

## Troubleshooting

### Common Issues

#### "AWS credentials not configured"
```bash
aws configure
# OR
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

#### "Amplify app not found"
```bash
# Verify app ID
aws amplify list-apps
export AMPLIFY_APP_ID=your_app_id
```

#### "Database connection failed"
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"
```

#### "Health checks failed"
```bash
# Check application logs
aws logs tail /aws/lambda/your-function-name
```

### Emergency Procedures

#### Complete Deployment Failure

1. **Stop traffic** (if possible):
   ```bash
   # Update DNS to maintenance page
   ```

2. **Immediate rollback**:
   ```bash
   npx tsx deployment/scripts/rollback.ts production --force
   ```

3. **Assess damage**:
   - Check application status
   - Verify database integrity
   - Review error logs

#### Database Migration Corruption

1. **Stop application**:
   ```bash
   # Scale down to prevent further damage
   ```

2. **Restore from backup**:
   ```bash
   # Find latest backup
   ls -la *.sql | head -5
   
   # Restore database
   psql $DATABASE_URL < backup-file.sql
   ```

3. **Verify data integrity**:
   ```sql
   -- Run validation queries
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM resumes;
   ```

### Support Contacts

- **Deployment Issues**: DevOps team
- **Database Problems**: Database administrator
- **Application Bugs**: Development team
- **Emergency**: Incident response team

## Security Considerations

### Secrets Management

- Never commit secrets to git
- Use AWS Secrets Manager for production secrets
- Rotate API keys regularly
- Use environment variables for configuration

### Access Control

- Limit deployment script access
- Use IAM roles with minimal permissions
- Require MFA for production operations
- Audit deployment activities

### Network Security

- Deploy to private subnets when possible
- Use security groups to restrict access
- Enable VPC flow logs
- Monitor unusual network activity

---

## Best Practices Summary

✅ **Do**:
- Always test deployments on staging first
- Use dry-run mode for rollbacks
- Monitor health checks closely
- Keep deployment logs
- Communicate changes to team
- Have rollback plan ready
- Backup before database changes

❌ **Don't**:
- Deploy directly to production without testing
- Skip health checks
- Ignore warning messages
- Deploy during high-traffic periods
- Make database changes without backups
- Deploy without proper AWS permissions
- Rush emergency fixes without proper testing

**Remember**: When in doubt, rollback and investigate. It's better to be safe than sorry with production deployments.