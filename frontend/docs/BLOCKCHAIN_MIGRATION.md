# Blockchain Migration to AWS

This document outlines the migration of Job-Lander's blockchain verification system from local private key management to AWS-native infrastructure using KMS, Lambda, and Secrets Manager.

## 🎯 Migration Overview

### What Changed
- **Before**: Blockchain operations used local private keys stored in environment variables
- **After**: Blockchain operations use AWS KMS for secure key management and signing
- **Infrastructure**: Migrated from Express.js endpoints to AWS Lambda functions
- **Configuration**: Moved from environment variables to AWS Secrets Manager
- **Monitoring**: Enhanced with CloudWatch logs and metrics

### Benefits
- ✅ **Enhanced Security**: Private keys never leave AWS HSMs
- ✅ **Scalability**: Serverless Lambda functions auto-scale
- ✅ **Compliance**: AWS KMS meets enterprise security requirements
- ✅ **Monitoring**: Comprehensive CloudWatch integration
- ✅ **Cost Optimization**: Pay-per-use serverless model

## 🏗️ Architecture

### AWS Services Used

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │    │  Amplify API     │    │ Lambda Function │
│                 ├────┤  Gateway         ├────┤ (Blockchain)    │
│ Resume Upload   │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────┬───────┘
                                                         │
                       ┌──────────────────┐              │
                       │   AWS KMS        │◄─────────────┘
                       │                  │
                       │ secp256k1 Key    │
                       │ Ethereum Signing │
                       └──────────────────┘
                                │
                       ┌────────▼──────────┐
                       │ Secrets Manager   │
                       │                   │
                       │ Blockchain Config │
                       │ Network Settings  │
                       └───────────────────┘
                                │
                       ┌────────▼──────────┐
                       │   CloudWatch      │
                       │                   │
                       │ Logs & Metrics    │
                       │ Alerts & Alarms   │
                       └───────────────────┘
```

### Lambda Function Features

- **KMS Integration**: Secure transaction signing using AWS KMS
- **Secrets Management**: Configuration stored in AWS Secrets Manager
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Monitoring**: CloudWatch metrics and structured logging
- **Health Checks**: Built-in health check endpoints
- **Performance**: Optimized for low-latency blockchain operations

## 🚀 Setup Instructions

### Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Node.js 18+** installed
3. **Amplify CLI** installed (`npm i -g @aws-amplify/cli`)
4. **Environment Variables** for blockchain network configuration

### Step 1: Install Dependencies

```bash
npm install
```

The required AWS SDK packages are already included in package.json:
- `@aws-sdk/client-kms`
- `@aws-sdk/client-secrets-manager` 
- `@aws-sdk/client-cloudwatch-logs`

### Step 2: Set Up AWS Resources

Run the blockchain resource setup script:

```bash
npm run setup:blockchain
```

This script will:
- ✅ Create a KMS key for Ethereum signing (secp256k1)
- ✅ Generate the Ethereum address from the KMS public key
- ✅ Set up Secrets Manager with blockchain configuration
- ✅ Create CloudWatch log groups for monitoring
- ✅ Output the configuration details

**Sample Output:**
```
🚀 Setting up blockchain AWS resources for job-lander (dev)

🔐 Setting up KMS key for blockchain operations...
✅ Created KMS key: a1b2c3d4-e5f6-7890-abcd-ef1234567890
✅ Created KMS alias: alias/job-lander-blockchain-dev
✅ Ethereum address: 0x742d35Cc6634C0532925a3b8D0aF9F62e9e1b2A5

🔒 Setting up Secrets Manager for blockchain configuration...
✅ Created secret: arn:aws:secretsmanager:us-east-1:123456789:secret:job-lander/blockchain/dev

📊 Setting up CloudWatch logs for monitoring...
✅ Created log group: /aws/lambda/job-lander-blockchain-dev
✅ Set log retention to 30 days

🎉 Blockchain AWS setup completed successfully!

📋 Setup Summary:
   KMS Key ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   KMS Alias: alias/job-lander-blockchain-dev
   Ethereum Address: 0x742d35Cc6634C0532925a3b8D0aF9F62e9e1b2A5
   Secret ARN: arn:aws:secretsmanager:us-east-1:123456789:secret:job-lander/blockchain/dev
   Log Group: /aws/lambda/job-lander-blockchain-dev

⚠️  Next Steps:
   1. Fund the Ethereum address with Mumbai testnet MATIC
   2. Deploy your smart contract and update the secret with the contract address
   3. Deploy the Amplify backend to activate the Lambda function
   4. Test the blockchain verification functionality
```

### Step 3: Fund the Wallet

The setup script generates a new Ethereum address. You'll need to fund it with Mumbai testnet MATIC:

1. **Get testnet MATIC** from [Mumbai Faucet](https://faucet.polygon.technology/)
2. **Send MATIC** to the generated address (shown in setup output)
3. **Verify balance** using a block explorer like [PolygonScan Mumbai](https://mumbai.polygonscan.com/)

### Step 4: Deploy Smart Contract (If Needed)

If you don't have a deployed contract yet:

```bash
# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Update Secrets Manager with contract address
aws secretsmanager update-secret \
  --secret-id job-lander/blockchain/dev \
  --secret-string '{"contract":{"address":"0xYourContractAddress","abi":[]}}'
```

### Step 5: Deploy Amplify Backend

Deploy the updated backend with the new Lambda function:

```bash
npm run amplify:deploy
```

This will:
- ✅ Create the Lambda function with proper IAM permissions
- ✅ Set up API Gateway endpoints
- ✅ Configure environment variables and secrets access
- ✅ Enable CloudWatch logging and monitoring

### Step 6: Test the Migration

Run the comprehensive test suite:

```bash
npm run test:blockchain
```

The test suite validates:
- ✅ AWS Lambda function health
- ✅ KMS key access and signing
- ✅ Secrets Manager configuration retrieval
- ✅ Resume verification end-to-end flow
- ✅ Error handling and monitoring
- ✅ Performance and reliability

## 🔧 Configuration

### Environment Variables

Set these in your `.env` file or deployment environment:

```bash
# AWS Configuration (automatically detected by Lambda)
AWS_REGION=us-east-1

# Environment identifier (dev/staging/prod)
ENVIRONMENT=dev

# Blockchain Network (for local testing only)
WEB3_RPC_URL=https://rpc-mumbai.maticvigil.com
CONTRACT_ADDRESS=0xYourContractAddress
```

### AWS Secrets Manager Structure

The blockchain configuration is stored in AWS Secrets Manager with this structure:

```json
{
  "network": {
    "name": "polygon-mumbai",
    "rpcUrl": "https://rpc-mumbai.maticvigil.com",
    "chainId": 80001,
    "currency": "MATIC"
  },
  "contract": {
    "address": "0xYourContractAddress",
    "abi": []
  },
  "wallet": {
    "address": "0x742d35Cc6634C0532925a3b8D0aF9F62e9e1b2A5",
    "kmsKeyId": "alias/job-lander-blockchain-dev"
  },
  "monitoring": {
    "gasThreshold": 0.01,
    "failureThreshold": 3,
    "healthCheckInterval": 300
  }
}
```

## 📊 Monitoring & Observability

### CloudWatch Dashboards

The Lambda function automatically creates CloudWatch metrics:

- **Execution Metrics**: Duration, errors, throttles
- **Business Metrics**: Successful/failed transactions, gas usage
- **Performance Metrics**: Cold starts, memory usage

### Health Check Endpoints

- `GET /api/blockchain/health` - Service health and network status
- `GET /api/blockchain/metrics` - Transaction and performance metrics
- `GET /api/blockchain/config` - Configuration validation (non-sensitive)

### Alerts & Alarms

Recommended CloudWatch alarms:
- High error rate (> 5%)
- High gas usage (> configured threshold)
- Lambda function timeouts
- KMS signing failures

## 🔐 Security Best Practices

### KMS Key Security
- ✅ Keys never leave AWS HSMs
- ✅ IAM policies restrict access to Lambda execution role
- ✅ Key rotation is supported (manual)
- ✅ All signing operations are logged in CloudTrail

### Secrets Management
- ✅ Configuration stored in Secrets Manager
- ✅ Automatic rotation capability
- ✅ Fine-grained IAM permissions
- ✅ Encryption at rest and in transit

### Lambda Security
- ✅ Minimal IAM permissions (principle of least privilege)
- ✅ VPC isolation (optional)
- ✅ Environment variable encryption
- ✅ Runtime security monitoring

## 🚨 Troubleshooting

### Common Issues

**1. KMS Access Denied**
```
Error: AccessDeniedException: User is not authorized to perform: kms:Sign
```
**Solution**: Ensure the Lambda execution role has the `kms:Sign` permission for your KMS key.

**2. Secrets Manager Access Issues**
```
Error: AccessDeniedException: User is not authorized to perform: secretsmanager:GetSecretValue
```
**Solution**: Add `secretsmanager:GetSecretValue` permission to the Lambda execution role.

**3. Insufficient Gas**
```
Error: Transaction failed: insufficient funds for gas
```
**Solution**: Fund the KMS-generated Ethereum address with Mumbai testnet MATIC.

**4. Contract Not Found**
```
Error: Contract not deployed at address
```
**Solution**: Deploy your smart contract and update the Secrets Manager configuration.

### Debugging Commands

```bash
# Check AWS credentials
aws sts get-caller-identity

# Test KMS key access
aws kms describe-key --key-id alias/job-lander-blockchain-dev

# Check Secrets Manager
aws secretsmanager get-secret-value --secret-id job-lander/blockchain/dev

# View CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/job-lander

# Test Lambda function directly
aws lambda invoke --function-name job-lander-blockchain-dev --payload file://test-payload.json response.json
```

### Performance Optimization

**Cold Start Mitigation:**
- Use provisioned concurrency for production
- Optimize Lambda package size
- Use connection pooling for RPC calls

**Cost Optimization:**
- Monitor KMS usage costs
- Implement caching for configuration retrieval
- Use CloudWatch metrics to optimize memory allocation

## 🎯 Migration Checklist

### Pre-Migration
- [ ] AWS CLI configured with proper permissions
- [ ] Amplify CLI installed and authenticated
- [ ] Environment variables documented
- [ ] Backup current blockchain configuration

### Migration Steps
- [ ] Run `npm run setup:blockchain` 
- [ ] Fund the generated Ethereum address
- [ ] Deploy/update smart contract if needed
- [ ] Run `npm run amplify:deploy`
- [ ] Execute `npm run test:blockchain`
- [ ] Verify all tests pass (>80% success rate)

### Post-Migration
- [ ] Update frontend to use new API endpoints
- [ ] Monitor CloudWatch dashboards
- [ ] Set up alerting and alarms
- [ ] Update documentation and runbooks
- [ ] Train team on new monitoring tools

## 📚 Additional Resources

- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html)
- [AWS Lambda Performance Tuning](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Ethereum Signing with KMS](https://aws.amazon.com/blogs/database/part1-use-aws-kms-to-securely-manage-ethereum-identities/)
- [Amplify Function Development](https://docs.amplify.aws/react/build-a-backend/functions/)
- [Polygon Mumbai Testnet](https://wiki.polygon.technology/docs/develop/network-details/network/)

---

**Questions or Issues?** Check the troubleshooting section or create an issue in the repository.