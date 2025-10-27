// Blockchain configuration for Polygon Mumbai Testnet
export const BLOCKCHAIN_CONFIG = {
  // Contract will be deployed and address will be updated here
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  
  // Contract ABI for ResumeVerifier
  CONTRACT_ABI: [
    "event ResumeVerified(bytes32 indexed hash, address indexed sender, uint256 timestamp)",
    "event BatchVerified(bytes32[] hashes, address indexed sender, uint256 timestamp)",
    "function verifyResume(bytes32 resumeHash) external",
    "function checkVerification(bytes32 resumeHash) external view returns (bool verified, uint256 timestamp, address verifier)",
    "function batchVerify(bytes32[] calldata hashes) external",
    "function verifiedResumes(bytes32) external view returns (uint256)",
    "function verifiers(bytes32) external view returns (address)",
    "function totalVerifications() external view returns (uint256)",
    "function getMultipleVerifications(bytes32[] calldata hashes) external view returns (uint256[] memory timestamps, address[] memory verifierAddresses)"
  ],
  
  // Network configuration
  CHAIN_ID: 80001,
  NETWORK_NAME: "Polygon Mumbai",
  NETWORK_CONFIG: {
    chainId: "0x13881", // 80001 in hex
    chainName: "Mumbai Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: [
      "https://polygon-mumbai.g.alchemy.com/v2/demo",
      "https://rpc-mumbai.maticvigil.com",
      "https://polygon-mumbai-bor.publicnode.com"
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"]
  },
  
  // RPC URLs (fallback options)
  RPC_URLS: {
    primary: process.env.WEB3_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/demo",
    fallback: [
      "https://rpc-mumbai.maticvigil.com",
      "https://polygon-mumbai-bor.publicnode.com",
      "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"
    ]
  },
  
  // Explorer URL
  EXPLORER_URL: "https://mumbai.polygonscan.com",
  
  // Gas configuration
  GAS_CONFIG: {
    maxPriorityFeePerGas: "30000000000", // 30 Gwei
    maxFeePerGas: "50000000000", // 50 Gwei
    gasLimit: {
      verify: 100000,
      batchVerify: 500000,
      check: 50000
    }
  },
  
  // Faucet URLs for getting testnet MATIC
  FAUCET_URLS: [
    {
      name: "Polygon Faucet",
      url: "https://faucet.polygon.technology/",
      description: "Official Polygon faucet - 0.2 MATIC every 24 hours"
    },
    {
      name: "Alchemy Mumbai Faucet",
      url: "https://mumbaifaucet.com/",
      description: "Alchemy's Mumbai faucet - 0.5 MATIC daily"
    }
  ],
  
  // Retry configuration
  RETRY_CONFIG: {
    maxAttempts: 3,
    baseDelay: 1000, // ms
    maxDelay: 10000 // ms
  }
};

// Helper function to get RPC provider with fallback
export function getRpcUrl(): string {
  return BLOCKCHAIN_CONFIG.RPC_URLS.primary;
}

// Helper function to get block explorer URL for a transaction
export function getExplorerUrl(txHash: string): string {
  return `${BLOCKCHAIN_CONFIG.EXPLORER_URL}/tx/${txHash}`;
}

// Helper function to get block explorer URL for an address
export function getAddressExplorerUrl(address: string): string {
  return `${BLOCKCHAIN_CONFIG.EXPLORER_URL}/address/${address}`;
}

// Helper function to format hash for display
export function formatHash(hash: string): string {
  if (!hash) return "";
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

// Helper function to estimate gas cost in MATIC
export function estimateGasCost(gasLimit: number, gasPriceGwei: number = 30): {
  matic: string;
  usd: string;
} {
  const gasPrice = gasPriceGwei * 1e9; // Convert to Wei
  const costInWei = gasLimit * gasPrice;
  const costInMatic = costInWei / 1e18;
  
  // Approximate USD value (using ~$0.80 per MATIC for testnet estimation)
  const costInUsd = costInMatic * 0.8;
  
  return {
    matic: costInMatic.toFixed(6),
    usd: costInUsd.toFixed(4)
  };
}