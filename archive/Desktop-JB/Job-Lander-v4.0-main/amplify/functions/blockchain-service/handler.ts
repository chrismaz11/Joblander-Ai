import { KMSClient, SignCommand, GetPublicKeyCommand } from '@aws-sdk/client-kms';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { ethers } from 'ethers';
import crypto from 'crypto';
import type { APIGatewayProxyHandler } from 'aws-lambda';

const kms = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });
const cloudWatch = new CloudWatchClient({ region: process.env.AWS_REGION || 'us-east-1' });

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Contract ABI for ResumeVerifier
const CONTRACT_ABI = [
  "event ResumeVerified(bytes32 indexed hash, address indexed sender, uint256 timestamp)",
  "event BatchVerified(bytes32[] hashes, address indexed sender, uint256 timestamp)",
  "function verifyResume(bytes32 resumeHash) external",
  "function checkVerification(bytes32 resumeHash) external view returns (bool verified, uint256 timestamp, address verifier)",
  "function batchVerify(bytes32[] calldata hashes) external",
  "function verifiedResumes(bytes32) external view returns (uint256)",
  "function verifiers(bytes32) external view returns (address)",
  "function totalVerifications() external view returns (uint256)",
  "function getMultipleVerifications(bytes32[] calldata hashes) external view returns (uint256[] memory timestamps, address[] memory verifierAddresses)"
];

interface BlockchainConfig {
  contractAddress: string;
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
}

interface KMSWalletInfo {
  address: string;
  kmsKeyId: string;
}

// Cache for configuration and wallet info
let configCache: BlockchainConfig | null = null;
let walletCache: KMSWalletInfo | null = null;

class AWSBlockchainService {
  
  // Get blockchain configuration from Secrets Manager
  private async getBlockchainConfig(): Promise<BlockchainConfig> {
    if (configCache) {
      return configCache;
    }

    try {
      const secretName = process.env.BLOCKCHAIN_CONFIG_SECRET || 'job-lander/blockchain-config';
      const response = await secretsManager.send(new GetSecretValueCommand({
        SecretId: secretName
      }));

      if (!response.SecretString) {
        throw new Error('Blockchain configuration not found in Secrets Manager');
      }

      const config = JSON.parse(response.SecretString);
      
      configCache = {
        contractAddress: config.CONTRACT_ADDRESS,
        rpcUrl: config.RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo',
        chainId: config.CHAIN_ID || 80001,
        explorerUrl: config.EXPLORER_URL || 'https://mumbai.polygonscan.com'
      };

      return configCache;
    } catch (error) {
      console.error('Failed to get blockchain config:', error);
      // Fallback configuration
      configCache = {
        contractAddress: process.env.CONTRACT_ADDRESS || '',
        rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/demo',
        chainId: 80001,
        explorerUrl: 'https://mumbai.polygonscan.com'
      };
      return configCache;
    }
  }

  // Get KMS wallet information
  private async getKMSWallet(): Promise<KMSWalletInfo> {
    if (walletCache) {
      return walletCache;
    }

    try {
      const kmsKeyId = process.env.KMS_KEY_ID || 'alias/job-lander-blockchain-key';
      
      // Get public key from KMS to derive Ethereum address
      const publicKeyResponse = await kms.send(new GetPublicKeyCommand({
        KeyId: kmsKeyId
      }));

      if (!publicKeyResponse.PublicKey) {
        throw new Error('Unable to retrieve public key from KMS');
      }

      // Extract public key and derive Ethereum address
      const publicKeyBuffer = Buffer.from(publicKeyResponse.PublicKey);
      const address = this.deriveEthereumAddress(publicKeyBuffer);

      walletCache = {
        address,
        kmsKeyId
      };

      return walletCache;
    } catch (error) {
      console.error('Failed to get KMS wallet:', error);
      throw new Error('KMS wallet not configured');
    }
  }

  // Derive Ethereum address from public key
  private deriveEthereumAddress(publicKey: Buffer): string {
    try {
      // For secp256k1 keys, the public key is 65 bytes (04 + 32 + 32)
      // Skip the first byte (0x04) and take the next 64 bytes
      const publicKeyBytes = publicKey.slice(1, 65);
      
      // Create Keccak hash of the public key
      const hash = crypto.createHash('sha3-256').update(publicKeyBytes).digest();
      
      // Take the last 20 bytes and prepend 0x
      const address = '0x' + hash.slice(-20).toString('hex');
      
      return ethers.getAddress(address); // Checksum format
    } catch (error) {
      console.error('Error deriving Ethereum address:', error);
      throw new Error('Failed to derive Ethereum address');
    }
  }

  // Sign transaction using KMS
  private async signTransactionWithKMS(transaction: ethers.TransactionRequest, kmsKeyId: string): Promise<string> {
    try {
      // Serialize transaction for signing
      const serializedTx = ethers.Transaction.from(transaction).unsignedSerialized;
      const txHash = crypto.createHash('sha256').update(Buffer.from(serializedTx.slice(2), 'hex')).digest();

      // Sign with KMS
      const signResponse = await kms.send(new SignCommand({
        KeyId: kmsKeyId,
        Message: txHash,
        MessageType: 'DIGEST',
        SigningAlgorithm: 'ECDSA_SHA_256'
      }));

      if (!signResponse.Signature) {
        throw new Error('KMS signing failed');
      }

      // Convert KMS signature to Ethereum signature format
      const signature = this.convertKMSSignatureToEthereum(signResponse.Signature);
      
      // Create signed transaction
      const signedTx = ethers.Transaction.from({
        ...transaction,
        signature
      });

      return signedTx.serialized;
    } catch (error) {
      console.error('KMS signing error:', error);
      throw new Error('Failed to sign transaction with KMS');
    }
  }

  // Convert KMS signature format to Ethereum signature format
  private convertKMSSignatureToEthereum(kmsSignature: Uint8Array): ethers.Signature {
    try {
      // KMS returns ASN.1 DER format, need to extract r and s
      const signature = Buffer.from(kmsSignature);
      
      // Parse ASN.1 DER format (simplified)
      // This is a basic implementation - production should use proper ASN.1 parsing
      let offset = 3; // Skip sequence header
      const rLength = signature[offset];
      offset += 1;
      const r = signature.slice(offset, offset + rLength);
      offset += rLength + 1; // Skip to s length
      const sLength = signature[offset];
      offset += 1;
      const s = signature.slice(offset, offset + sLength);

      // Convert to hex strings
      const rHex = '0x' + r.toString('hex');
      const sHex = '0x' + s.toString('hex');

      // Recovery ID (v) needs to be calculated based on the transaction
      // For simplicity, we'll use a default value and let ethers handle recovery
      const v = 27; // This should be calculated properly in production

      return ethers.Signature.from({
        r: rHex,
        s: sHex,
        v: v
      });
    } catch (error) {
      console.error('Signature conversion error:', error);
      throw new Error('Failed to convert KMS signature');
    }
  }

  // Generate SHA-256 hash of resume data
  generateResumeHash(resumeData: any): string {
    let dataString: string;
    
    if (Buffer.isBuffer(resumeData)) {
      return "0x" + crypto.createHash('sha256').update(resumeData).digest('hex');
    } else if (typeof resumeData === 'string') {
      dataString = resumeData;
    } else {
      dataString = JSON.stringify(resumeData);
    }
    
    return "0x" + crypto.createHash('sha256').update(dataString).digest('hex');
  }

  // Record metrics to CloudWatch
  private async recordMetric(metricName: string, value: number, unit: string = 'Count'): Promise<void> {
    try {
      await cloudWatch.send(new PutMetricDataCommand({
        Namespace: 'JobLander/Blockchain',
        MetricData: [
          {
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date()
          }
        ]
      }));
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }

  // Verify resume on blockchain using KMS
  async verifyOnChain(resumeHash: string, metadata: any = {}): Promise<any> {
    const startTime = Date.now();
    
    try {
      const config = await this.getBlockchainConfig();
      const wallet = await this.getKMSWallet();
      
      if (!config.contractAddress || config.contractAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured');
      }

      // Create provider
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      
      // Check wallet balance
      const balance = await provider.getBalance(wallet.address);
      const balanceInMatic = ethers.formatEther(balance);
      
      if (parseFloat(balanceInMatic) < 0.001) {
        throw new Error(`Insufficient balance: ${balanceInMatic} MATIC`);
      }

      // Create contract instance
      const contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, provider);
      
      // Ensure hash is in correct format
      const formattedHash = resumeHash.startsWith('0x') ? resumeHash : `0x${resumeHash}`;
      if (formattedHash.length !== 66) {
        throw new Error("Invalid hash format - must be 32 bytes");
      }

      // Check if already verified
      const [verified, timestamp] = await contract.checkVerification(formattedHash);
      if (verified) {
        await this.recordMetric('AlreadyVerified', 1);
        return {
          success: true,
          alreadyVerified: true,
          transactionHash: null,
          timestamp: Number(timestamp) * 1000,
          explorerUrl: `${config.explorerUrl}/address/${config.contractAddress}`,
          network: "Polygon Mumbai (AWS-KMS)"
        };
      }

      // Prepare transaction
      const feeData = await provider.getFeeData();
      const transaction: ethers.TransactionRequest = {
        to: config.contractAddress,
        data: contract.interface.encodeFunctionData('verifyResume', [formattedHash]),
        gasLimit: 120000, // Buffer for gas estimation
        gasPrice: feeData.gasPrice || ethers.parseUnits("30", "gwei"),
        chainId: config.chainId,
        nonce: await provider.getTransactionCount(wallet.address),
        type: 2, // EIP-1559 transaction
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      };

      // Sign transaction with KMS
      const signedTx = await this.signTransactionWithKMS(transaction, wallet.kmsKeyId);
      
      // Send transaction
      const txResponse = await provider.broadcastTransaction(signedTx);
      console.log(`📝 Transaction sent: ${txResponse.hash}`);

      // Wait for confirmation
      const receipt = await txResponse.wait(1);
      
      if (!receipt || receipt.status !== 1) {
        throw new Error("Transaction failed");
      }

      const duration = Date.now() - startTime;
      await this.recordMetric('VerificationSuccess', 1);
      await this.recordMetric('VerificationDuration', duration, 'Milliseconds');
      await this.recordMetric('GasUsed', Number(receipt.gasUsed), 'Count');

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: Date.now(),
        gasUsed: ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || feeData.gasPrice || 0n)),
        gasPrice: ethers.formatUnits(receipt.gasPrice || feeData.gasPrice || 0n, "gwei"),
        explorerUrl: `${config.explorerUrl}/tx/${receipt.hash}`,
        network: "Polygon Mumbai (AWS-KMS)"
      };

    } catch (error: any) {
      console.error("❌ AWS Blockchain verification error:", error);
      
      const duration = Date.now() - startTime;
      await this.recordMetric('VerificationError', 1);
      await this.recordMetric('VerificationDuration', duration, 'Milliseconds');
      
      return {
        success: false,
        error: error.message || "Blockchain verification failed",
        network: "Polygon Mumbai (AWS-KMS)"
      };
    }
  }

  // Check if resume is verified on blockchain
  async checkVerification(resumeHash: string): Promise<any> {
    try {
      const config = await this.getBlockchainConfig();
      
      if (!config.contractAddress || config.contractAddress === '0x0000000000000000000000000000000000000000') {
        return {
          verified: false,
          error: 'Contract not configured',
          network: "Polygon Mumbai (AWS-KMS)"
        };
      }

      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, provider);
      
      const formattedHash = resumeHash.startsWith('0x') ? resumeHash : `0x${resumeHash}`;
      if (formattedHash.length !== 66) {
        throw new Error("Invalid hash format");
      }

      const [verified, timestamp, verifier] = await contract.checkVerification(formattedHash);

      if (verified) {
        await this.recordMetric('VerificationCheck', 1);
        const block = await provider.getBlock('latest');
        
        return {
          verified: true,
          timestamp: Number(timestamp) * 1000,
          verifier: verifier,
          blockNumber: block?.number,
          explorerUrl: `${config.explorerUrl}/address/${config.contractAddress}`,
          network: "Polygon Mumbai (AWS-KMS)"
        };
      }

      return {
        verified: false,
        network: "Polygon Mumbai (AWS-KMS)"
      };

    } catch (error: any) {
      console.error("❌ Verification check error:", error);
      await this.recordMetric('VerificationCheckError', 1);
      
      return {
        verified: false,
        error: error.message || "Failed to check verification",
        network: "Polygon Mumbai (AWS-KMS)"
      };
    }
  }

  // Get wallet info for monitoring
  async getWalletInfo(): Promise<any> {
    try {
      const config = await this.getBlockchainConfig();
      const wallet = await this.getKMSWallet();
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      
      const balance = await provider.getBalance(wallet.address);
      const balanceInMatic = ethers.formatEther(balance);
      const transactionCount = await provider.getTransactionCount(wallet.address);

      return {
        address: wallet.address,
        balance: balanceInMatic,
        transactionCount,
        network: "Polygon Mumbai",
        kmsKeyId: wallet.kmsKeyId.replace(/arn:.*\//, ''), // Remove ARN prefix for display
      };
    } catch (error: any) {
      console.error("❌ Wallet info error:", error);
      return {
        error: error.message || "Failed to get wallet info"
      };
    }
  }
}

// Route handlers
const blockchainService = new AWSBlockchainService();

const verifyResumeHandler = async (event: any) => {
  const { resumeHash, metadata } = JSON.parse(event.body || '{}');
  
  if (!resumeHash) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Resume hash is required'
      })
    };
  }

  const result = await blockchainService.verifyOnChain(resumeHash, metadata);
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: result.success,
      data: result
    })
  };
};

const checkVerificationHandler = async (event: any) => {
  const resumeHash = event.queryStringParameters?.hash;
  
  if (!resumeHash) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Resume hash is required'
      })
    };
  }

  const result = await blockchainService.checkVerification(resumeHash);
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: result
    })
  };
};

const generateHashHandler = async (event: any) => {
  const { resumeData } = JSON.parse(event.body || '{}');
  
  if (!resumeData) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Resume data is required'
      })
    };
  }

  const hash = blockchainService.generateResumeHash(resumeData);
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: { hash }
    })
  };
};

const walletInfoHandler = async () => {
  const result = await blockchainService.getWalletInfo();
  
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: result
    })
  };
};

const healthHandler = async () => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        kms: 'available',
        secretsManager: 'available',
        cloudwatch: 'available',
        blockchain: 'aws-kms-enabled'
      }
    })
  };
};

// Main Lambda handler
export const handler: APIGatewayProxyHandler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const path = event.path;
  const method = event.httpMethod;

  try {
    switch (path) {
      case '/verify-resume':
        if (method === 'POST') return await verifyResumeHandler(event);
        break;
      case '/check-verification':
        if (method === 'GET') return await checkVerificationHandler(event);
        break;
      case '/generate-hash':
        if (method === 'POST') return await generateHashHandler(event);
        break;
      case '/wallet-info':
        if (method === 'GET') return await walletInfoHandler();
        break;
      case '/health':
        return await healthHandler();
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Endpoint not found'
          })
        };
    }
  } catch (error: any) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }

  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed'
    })
  };
};