#!/usr/bin/env node

/**
 * AWS Resource Setup Script for Blockchain Service
 * 
 * This script provisions the necessary AWS resources for the blockchain
 * verification service to work with AWS-managed infrastructure:
 * - KMS key for secure blockchain transaction signing
 * - Secrets Manager secrets for blockchain configuration
 * - CloudWatch log groups for monitoring
 */

import {
  KMSClient,
  CreateKeyCommand,
  CreateAliasCommand,
  DescribeKeyCommand,
  GetPublicKeyCommand,
  PutKeyPolicyCommand
} from "@aws-sdk/client-kms";
import {
  SecretsManagerClient,
  CreateSecretCommand,
  UpdateSecretCommand,
  DescribeSecretCommand
} from "@aws-sdk/client-secrets-manager";
import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  DescribeLogGroupsCommand,
  PutRetentionPolicyCommand
} from "@aws-sdk/client-cloudwatch-logs";
import { fromEnv } from "@aws-sdk/credential-providers";
import { ethers } from "ethers";
import * as crypto from "crypto";

// Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const PROJECT_NAME = 'job-lander';
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';

// Initialize AWS clients
const kmsClient = new KMSClient({ 
  region: AWS_REGION,
  credentials: fromEnv()
});

const secretsClient = new SecretsManagerClient({ 
  region: AWS_REGION,
  credentials: fromEnv()
});

const logsClient = new CloudWatchLogsClient({ 
  region: AWS_REGION,
  credentials: fromEnv()
});

interface SetupResult {
  kmsKeyId: string;
  kmsKeyAlias: string;
  secretArn: string;
  logGroupName: string;
  ethereumAddress: string;
}

class BlockchainAWSSetup {
  private keyAlias = `alias/${PROJECT_NAME}-blockchain-${ENVIRONMENT}`;
  private secretName = `${PROJECT_NAME}/blockchain/${ENVIRONMENT}`;
  private logGroupName = `/aws/lambda/${PROJECT_NAME}-blockchain-${ENVIRONMENT}`;

  async setupKMSKey(): Promise<{ keyId: string; ethereumAddress: string }> {
    console.log('🔐 Setting up KMS key for blockchain operations...');
    
    try {
      // Check if key already exists
      const existingKey = await this.getExistingKey();
      if (existingKey) {
        console.log(`✅ Using existing KMS key: ${existingKey.keyId}`);
        const ethereumAddress = await this.getEthereumAddressFromKMS(existingKey.keyId);
        return { keyId: existingKey.keyId, ethereumAddress };
      }

      // Create new KMS key for blockchain signing
      const keyPolicy = {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "EnableIAMRootPermissions",
            Effect: "Allow",
            Principal: { AWS: `arn:aws:iam::*:root` },
            Action: "kms:*",
            Resource: "*"
          },
          {
            Sid: "AllowBlockchainService",
            Effect: "Allow",
            Principal: { AWS: "*" },
            Action: [
              "kms:Sign",
              "kms:GetPublicKey",
              "kms:DescribeKey"
            ],
            Resource: "*",
            Condition: {
              StringEquals: {
                "aws:PrincipalTag/Service": "job-lander-blockchain"
              }
            }
          }
        ]
      };

      const createKeyCommand = new CreateKeyCommand({
        Description: `${PROJECT_NAME} blockchain signing key for ${ENVIRONMENT}`,
        KeyUsage: 'SIGN_VERIFY',
        KeySpec: 'ECC_SECG_P256K1', // secp256k1 for Ethereum compatibility
        Origin: 'AWS_KMS',
        Policy: JSON.stringify(keyPolicy),
        Tags: [
          { TagKey: 'Project', TagValue: PROJECT_NAME },
          { TagKey: 'Environment', TagValue: ENVIRONMENT },
          { TagKey: 'Service', TagValue: 'blockchain-verification' },
          { TagKey: 'Purpose', TagValue: 'ethereum-signing' }
        ]
      });

      const keyResponse = await kmsClient.send(createKeyCommand);
      const keyId = keyResponse.KeyMetadata!.KeyId!;
      
      console.log(`✅ Created KMS key: ${keyId}`);

      // Create alias for easier reference
      const createAliasCommand = new CreateAliasCommand({
        AliasName: this.keyAlias,
        TargetKeyId: keyId
      });

      await kmsClient.send(createAliasCommand);
      console.log(`✅ Created KMS alias: ${this.keyAlias}`);

      // Get the Ethereum address from the public key
      const ethereumAddress = await this.getEthereumAddressFromKMS(keyId);
      console.log(`✅ Ethereum address: ${ethereumAddress}`);

      return { keyId, ethereumAddress };
    } catch (error: any) {
      console.error('❌ Failed to setup KMS key:', error.message);
      throw error;
    }
  }

  private async getExistingKey(): Promise<{ keyId: string } | null> {
    try {
      const describeCommand = new DescribeKeyCommand({
        KeyId: this.keyAlias
      });
      const response = await kmsClient.send(describeCommand);
      return { keyId: response.KeyMetadata!.KeyId! };
    } catch (error: any) {
      if (error.name === 'NotFoundException') {
        return null;
      }
      throw error;
    }
  }

  private async getEthereumAddressFromKMS(keyId: string): Promise<string> {
    try {
      const getPublicKeyCommand = new GetPublicKeyCommand({
        KeyId: keyId
      });
      
      const response = await kmsClient.send(getPublicKeyCommand);
      const publicKey = response.PublicKey!;

      // Parse DER-encoded public key to get the raw coordinates
      const publicKeyHex = Buffer.from(publicKey).toString('hex');
      
      // For secp256k1, the uncompressed public key is 65 bytes (0x04 + 32 bytes x + 32 bytes y)
      // We need to skip the DER header and get the raw key
      const uncompressedKey = this.extractUncompressedPublicKey(publicKeyHex);
      
      // Calculate Ethereum address from public key
      const publicKeyBytes = Buffer.from(uncompressedKey.slice(2), 'hex'); // Remove 0x04 prefix
      const hash = crypto.createHash('sha3-256').update(publicKeyBytes).digest();
      const address = '0x' + hash.slice(-20).toString('hex');
      
      return ethers.getAddress(address); // Checksummed address
    } catch (error: any) {
      console.error('❌ Failed to derive Ethereum address:', error.message);
      throw error;
    }
  }

  private extractUncompressedPublicKey(derHex: string): string {
    // This is a simplified parser for secp256k1 DER-encoded public keys
    // In production, you might want to use a proper ASN.1 parser
    
    // Look for the uncompressed public key marker (0x04) followed by 64 bytes
    const uncompressedMarker = '04';
    const markerIndex = derHex.indexOf(uncompressedMarker);
    
    if (markerIndex === -1) {
      throw new Error('Could not find uncompressed public key in DER encoding');
    }
    
    // Extract 65 bytes (0x04 + 64 bytes of coordinates)
    const uncompressedKey = derHex.slice(markerIndex, markerIndex + 130);
    return '0x' + uncompressedKey;
  }

  async setupSecretsManager(ethereumAddress: string): Promise<string> {
    console.log('🔒 Setting up Secrets Manager for blockchain configuration...');
    
    try {
      // Check if secret already exists
      try {
        const describeCommand = new DescribeSecretCommand({
          SecretId: this.secretName
        });
        const existing = await secretsClient.send(describeCommand);
        console.log(`✅ Using existing secret: ${existing.ARN}`);
        
        // Update the existing secret with current config
        await this.updateSecret();
        return existing.ARN!;
      } catch (error: any) {
        if (error.name !== 'ResourceNotFoundException') {
          throw error;
        }
      }

      // Create blockchain configuration secret
      const secretValue = {
        network: {
          name: 'polygon-mumbai',
          rpcUrl: process.env.WEB3_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
          chainId: 80001,
          currency: 'MATIC'
        },
        contract: {
          address: process.env.CONTRACT_ADDRESS || '',
          abi: [], // Will be populated during deployment
        },
        wallet: {
          address: ethereumAddress,
          kmsKeyId: this.keyAlias
        },
        monitoring: {
          gasThreshold: 0.01, // Alert if gas exceeds 0.01 MATIC
          failureThreshold: 3, // Alert after 3 consecutive failures
          healthCheckInterval: 300 // 5 minutes
        }
      };

      const createSecretCommand = new CreateSecretCommand({
        Name: this.secretName,
        Description: `Blockchain configuration for ${PROJECT_NAME} ${ENVIRONMENT}`,
        SecretString: JSON.stringify(secretValue, null, 2),
        Tags: [
          { Key: 'Project', Value: PROJECT_NAME },
          { Key: 'Environment', Value: ENVIRONMENT },
          { Key: 'Service', Value: 'blockchain-verification' }
        ]
      });

      const response = await secretsClient.send(createSecretCommand);
      console.log(`✅ Created secret: ${response.ARN}`);
      
      return response.ARN!;
    } catch (error: any) {
      console.error('❌ Failed to setup Secrets Manager:', error.message);
      throw error;
    }
  }

  private async updateSecret(): Promise<void> {
    // Update existing secret with current environment variables
    const secretValue = {
      network: {
        name: 'polygon-mumbai',
        rpcUrl: process.env.WEB3_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
        chainId: 80001,
        currency: 'MATIC'
      },
      contract: {
        address: process.env.CONTRACT_ADDRESS || '',
        abi: []
      }
      // Note: Don't update wallet config as it contains the KMS key reference
    };

    const updateCommand = new UpdateSecretCommand({
      SecretId: this.secretName,
      SecretString: JSON.stringify(secretValue, null, 2)
    });

    await secretsClient.send(updateCommand);
    console.log('✅ Updated existing secret with current configuration');
  }

  async setupCloudWatchLogs(): Promise<string> {
    console.log('📊 Setting up CloudWatch logs for monitoring...');
    
    try {
      // Check if log group already exists
      const describeCommand = new DescribeLogGroupsCommand({
        logGroupNamePrefix: this.logGroupName
      });
      
      const response = await logsClient.send(describeCommand);
      const existingGroup = response.logGroups?.find(
        group => group.logGroupName === this.logGroupName
      );
      
      if (existingGroup) {
        console.log(`✅ Using existing log group: ${this.logGroupName}`);
        return this.logGroupName;
      }

      // Create log group
      const createLogGroupCommand = new CreateLogGroupCommand({
        logGroupName: this.logGroupName,
        tags: {
          Project: PROJECT_NAME,
          Environment: ENVIRONMENT,
          Service: 'blockchain-verification'
        }
      });

      await logsClient.send(createLogGroupCommand);
      console.log(`✅ Created log group: ${this.logGroupName}`);

      // Set retention policy (30 days for dev, 90 days for prod)
      const retentionDays = ENVIRONMENT === 'prod' ? 90 : 30;
      const putRetentionCommand = new PutRetentionPolicyCommand({
        logGroupName: this.logGroupName,
        retentionInDays: retentionDays
      });

      await logsClient.send(putRetentionCommand);
      console.log(`✅ Set log retention to ${retentionDays} days`);

      return this.logGroupName;
    } catch (error: any) {
      console.error('❌ Failed to setup CloudWatch logs:', error.message);
      throw error;
    }
  }

  async run(): Promise<SetupResult> {
    console.log(`🚀 Setting up blockchain AWS resources for ${PROJECT_NAME} (${ENVIRONMENT})\n`);

    try {
      // Setup KMS key and get Ethereum address
      const { keyId, ethereumAddress } = await this.setupKMSKey();
      
      // Setup Secrets Manager
      const secretArn = await this.setupSecretsManager(ethereumAddress);
      
      // Setup CloudWatch logs
      const logGroupName = await this.setupCloudWatchLogs();

      const result: SetupResult = {
        kmsKeyId: keyId,
        kmsKeyAlias: this.keyAlias,
        secretArn,
        logGroupName,
        ethereumAddress
      };

      console.log('\n🎉 Blockchain AWS setup completed successfully!');
      console.log('\n📋 Setup Summary:');
      console.log(`   KMS Key ID: ${result.kmsKeyId}`);
      console.log(`   KMS Alias: ${result.kmsKeyAlias}`);
      console.log(`   Ethereum Address: ${result.ethereumAddress}`);
      console.log(`   Secret ARN: ${result.secretArn}`);
      console.log(`   Log Group: ${result.logGroupName}`);
      
      console.log('\n⚠️  Next Steps:');
      console.log('   1. Fund the Ethereum address with Mumbai testnet MATIC');
      console.log('   2. Deploy your smart contract and update the secret with the contract address');
      console.log('   3. Deploy the Amplify backend to activate the Lambda function');
      console.log('   4. Test the blockchain verification functionality');
      
      return result;
    } catch (error: any) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the setup if called directly
if (require.main === module) {
  const setup = new BlockchainAWSSetup();
  setup.run().then((result) => {
    // Output the result as JSON for programmatic use
    console.log('\n📄 Configuration JSON:');
    console.log(JSON.stringify(result, null, 2));
  });
}

export { BlockchainAWSSetup };