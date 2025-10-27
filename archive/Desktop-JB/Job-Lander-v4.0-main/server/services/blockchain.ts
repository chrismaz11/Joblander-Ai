import { ethers } from "ethers";
import crypto from "crypto";
import { BLOCKCHAIN_CONFIG, getRpcUrl, getExplorerUrl, estimateGasCost } from "../blockchain/config";

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 10000);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Get provider with fallback RPC URLs
function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = getRpcUrl();
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Get wallet for transactions
function getWallet(provider: ethers.JsonRpcProvider): ethers.Wallet | null {
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.warn("⚠️  PRIVATE_KEY not configured - running in read-only mode");
    return null;
  }
  
  return new ethers.Wallet(privateKey, provider);
}

// Generate SHA-256 hash of resume data
export function generateResumeHash(resumeData: any): string {
  let dataString: string;
  
  if (Buffer.isBuffer(resumeData)) {
    // If it's a buffer (file upload), hash the buffer directly
    return "0x" + crypto.createHash('sha256').update(resumeData).digest('hex');
  } else if (typeof resumeData === 'string') {
    dataString = resumeData;
  } else {
    // If it's an object, stringify it
    dataString = JSON.stringify(resumeData);
  }
  
  return "0x" + crypto.createHash('sha256').update(dataString).digest('hex');
}

// Verify resume on blockchain
export async function verifyOnChain(resumeHash: string, metadata: any): Promise<{
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: number;
  gasUsed?: string;
  gasPrice?: string;
  explorerUrl?: string;
  network?: string;
  error?: string;
}> {
  try {
    const provider = getProvider();
    const wallet = getWallet(provider);
    
    // Check if contract is deployed
    const contractAddress = BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS;
    if (contractAddress === "0x0000000000000000000000000000000000000000" || !contractAddress) {
      // Fallback mode - simulate blockchain verification
      console.log("⚠️  Contract not deployed - running in simulation mode");
      const simulatedHash = `0x${crypto.randomBytes(32).toString('hex')}`;
      return {
        success: true,
        transactionHash: simulatedHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 40000000,
        timestamp: Date.now(),
        explorerUrl: `https://mumbai.polygonscan.com/tx/${simulatedHash}`,
        network: "Polygon Mumbai (Simulated)",
        gasUsed: "0.0001",
        gasPrice: "30"
      };
    }
    
    if (!wallet) {
      throw new Error("Wallet not configured - cannot write to blockchain");
    }
    
    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    
    if (parseFloat(balanceInMatic) < 0.001) {
      throw new Error(`Insufficient balance: ${balanceInMatic} MATIC. Get testnet MATIC from faucet.`);
    }
    
    // Create contract instance
    const contract = new ethers.Contract(
      contractAddress,
      BLOCKCHAIN_CONFIG.CONTRACT_ABI,
      wallet
    );
    
    // Ensure hash is in correct format (bytes32)
    const formattedHash = resumeHash.startsWith('0x') ? resumeHash : `0x${resumeHash}`;
    if (formattedHash.length !== 66) { // 0x + 64 hex chars
      throw new Error("Invalid hash format - must be 32 bytes");
    }
    
    // Check if already verified
    const existingTimestamp = await contract.verifiedResumes(formattedHash);
    if (existingTimestamp > 0n) {
      // Already verified, return existing verification
      const block = await provider.getBlock('latest');
      return {
        success: true,
        transactionHash: `0x${crypto.randomBytes(32).toString('hex')}`, // Mock for existing
        blockNumber: block?.number,
        timestamp: Number(existingTimestamp) * 1000,
        explorerUrl: getExplorerUrl(contractAddress),
        network: "Polygon Mumbai",
        gasUsed: "0",
        gasPrice: "0",
        error: "Resume already verified on blockchain"
      };
    }
    
    // Estimate gas
    const estimatedGas = await contract.verifyResume.estimateGas(formattedHash);
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("30", "gwei");
    
    // Execute transaction with retry logic
    const tx = await retryWithBackoff(async () => {
      return await contract.verifyResume(formattedHash, {
        gasLimit: estimatedGas * 120n / 100n, // Add 20% buffer
        gasPrice: gasPrice,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas
      });
    });
    
    console.log(`📝 Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait(1); // Wait for 1 confirmation
    
    if (!receipt || receipt.status !== 1) {
      throw new Error("Transaction failed");
    }
    
    const gasUsed = receipt.gasUsed;
    const actualGasPrice = receipt.gasPrice || gasPrice;
    const gasCost = estimateGasCost(Number(gasUsed), Number(ethers.formatUnits(actualGasPrice, "gwei")));
    
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      timestamp: Date.now(),
      gasUsed: gasCost.matic,
      gasPrice: ethers.formatUnits(actualGasPrice, "gwei"),
      explorerUrl: getExplorerUrl(receipt.hash),
      network: "Polygon Mumbai"
    };
    
  } catch (error: any) {
    console.error("❌ Blockchain verification error:", error);
    
    // Provide helpful error messages
    if (error.message?.includes("Insufficient balance")) {
      return {
        success: false,
        error: "Insufficient MATIC balance. Visit https://faucet.polygon.technology/ to get free testnet MATIC."
      };
    }
    
    if (error.code === "NETWORK_ERROR") {
      return {
        success: false,
        error: "Network error. Please check your connection and try again."
      };
    }
    
    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      return {
        success: false,
        error: "Unable to estimate gas. The contract may not be deployed or accessible."
      };
    }
    
    return {
      success: false,
      error: error.message || "Blockchain verification failed"
    };
  }
}

// Check if resume is verified on blockchain
export async function checkVerification(resumeHash: string): Promise<{
  verified: boolean;
  transactionHash?: string;
  timestamp?: number;
  verifier?: string;
  blockNumber?: number;
  explorerUrl?: string;
  network?: string;
  error?: string;
}> {
  try {
    const provider = getProvider();
    const contractAddress = BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS;
    
    // Check if contract is deployed
    if (contractAddress === "0x0000000000000000000000000000000000000000" || !contractAddress) {
      console.log("⚠️  Contract not deployed - running in simulation mode");
      return {
        verified: false,
        network: "Polygon Mumbai (Simulated)"
      };
    }
    
    // Create contract instance (read-only)
    const contract = new ethers.Contract(
      contractAddress,
      BLOCKCHAIN_CONFIG.CONTRACT_ABI,
      provider
    );
    
    // Format hash
    const formattedHash = resumeHash.startsWith('0x') ? resumeHash : `0x${resumeHash}`;
    if (formattedHash.length !== 66) {
      throw new Error("Invalid hash format");
    }
    
    // Check verification with retry logic
    const result = await retryWithBackoff(async () => {
      return await contract.checkVerification(formattedHash);
    });
    
    const [verified, timestamp, verifier] = result;
    
    if (verified) {
      // Get current block for reference
      const block = await provider.getBlock('latest');
      
      return {
        verified: true,
        timestamp: Number(timestamp) * 1000, // Convert to milliseconds
        verifier: verifier,
        blockNumber: block?.number,
        explorerUrl: getExplorerUrl(contractAddress),
        network: "Polygon Mumbai"
      };
    }
    
    return {
      verified: false,
      network: "Polygon Mumbai"
    };
    
  } catch (error: any) {
    console.error("❌ Verification check error:", error);
    
    return {
      verified: false,
      error: error.message || "Failed to check verification",
      network: "Polygon Mumbai"
    };
  }
}

// Batch verify multiple resume hashes (gas-efficient)
export async function batchVerifyOnChain(resumeHashes: string[], metadata?: any[]): Promise<{
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  verifiedCount?: number;
  gasUsed?: string;
  explorerUrl?: string;
  error?: string;
}> {
  try {
    const provider = getProvider();
    const wallet = getWallet(provider);
    const contractAddress = BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS;
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract not deployed");
    }
    
    if (!wallet) {
      throw new Error("Wallet not configured");
    }
    
    if (resumeHashes.length === 0) {
      throw new Error("No hashes provided");
    }
    
    if (resumeHashes.length > 50) {
      throw new Error("Too many hashes (max 50 per batch)");
    }
    
    const contract = new ethers.Contract(
      contractAddress,
      BLOCKCHAIN_CONFIG.CONTRACT_ABI,
      wallet
    );
    
    // Format all hashes
    const formattedHashes = resumeHashes.map(hash => 
      hash.startsWith('0x') ? hash : `0x${hash}`
    );
    
    // Estimate gas for batch
    const estimatedGas = await contract.batchVerify.estimateGas(formattedHashes);
    const feeData = await provider.getFeeData();
    
    // Execute batch verification
    const tx = await contract.batchVerify(formattedHashes, {
      gasLimit: estimatedGas * 120n / 100n,
      gasPrice: feeData.gasPrice
    });
    
    const receipt = await tx.wait(1);
    
    if (!receipt || receipt.status !== 1) {
      throw new Error("Batch transaction failed");
    }
    
    const gasUsed = receipt.gasUsed;
    const gasCost = estimateGasCost(Number(gasUsed), Number(ethers.formatUnits(feeData.gasPrice || 0, "gwei")));
    
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      verifiedCount: resumeHashes.length,
      gasUsed: gasCost.matic,
      explorerUrl: getExplorerUrl(receipt.hash)
    };
    
  } catch (error: any) {
    console.error("❌ Batch verification error:", error);
    return {
      success: false,
      error: error.message || "Batch verification failed"
    };
  }
}

// Estimate gas cost for verification
export async function estimateVerificationGas(resumeHash: string): Promise<{
  gasLimit: number;
  gasPrice: string;
  estimatedCost: {
    matic: string;
    usd: string;
  };
  network: string;
}> {
  try {
    const provider = getProvider();
    const contractAddress = BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS;
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      // Return mock estimation
      return {
        gasLimit: 100000,
        gasPrice: "30",
        estimatedCost: {
          matic: "0.003",
          usd: "0.0024"
        },
        network: "Polygon Mumbai (Estimated)"
      };
    }
    
    const contract = new ethers.Contract(
      contractAddress,
      BLOCKCHAIN_CONFIG.CONTRACT_ABI,
      provider
    );
    
    const formattedHash = resumeHash.startsWith('0x') ? resumeHash : `0x${resumeHash}`;
    
    // Create a dummy signer for estimation
    const dummySigner = ethers.Wallet.createRandom().connect(provider);
    const contractWithSigner = contract.connect(dummySigner);
    
    // Estimate gas
    const estimatedGas = await contractWithSigner.verifyResume.estimateGas(formattedHash);
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("30", "gwei");
    
    const cost = estimateGasCost(
      Number(estimatedGas),
      Number(ethers.formatUnits(gasPrice, "gwei"))
    );
    
    return {
      gasLimit: Number(estimatedGas),
      gasPrice: ethers.formatUnits(gasPrice, "gwei"),
      estimatedCost: cost,
      network: "Polygon Mumbai"
    };
    
  } catch (error: any) {
    console.error("Gas estimation error:", error);
    
    // Return default estimation
    return {
      gasLimit: 100000,
      gasPrice: "30",
      estimatedCost: {
        matic: "0.003",
        usd: "0.0024"
      },
      network: "Polygon Mumbai (Estimated)"
    };
  }
}
