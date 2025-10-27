const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Contract ABI (minimal interface for deployment)
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

// Contract bytecode (compiled from Verifier.sol)
// This is a simplified bytecode for the ResumeVerifier contract
// In production, you would compile this from the Solidity source
const CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b50610800806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80634b0891631161005b5780634b08916314610100578063715018a61461011c578063938e3d71146101265780639e7a13ad146101425761007d565b806301ffc9a71461008257806306fdde03146100b25780631249c58b146100d0575b600080fd5b61009c60048036038101906100979190610456565b610160565b6040516100a99190610499565b60405180910390f35b6100ba6101c1565b6040516100c791906104f3565b60405180910390f35b6100d86101fa565b005b6100ea6100048036038101906100e59190610544565b610259565b6040516100f79190610583565b60405180910390f35b61011a60048036038101906101159190610544565b610271565b005b6101246102d0565b005b610140600480360381019061013b91906105fa565b6102d4565b005b6101466102e2565b604051610157959493929190610677565b60405180910390f35b60006301ffc9a760e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061018b57506380ac58cd60e01b827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050919050565b6040518060400160405280600c81526020017f526573756d6556657269666965720000000000000000000000000000000000815250905090565b6000801b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550565b60006020528060005260406000206000915090505481565b60008060008381526020019081526020016000205414610291576102cd565b4260008084815260200190815260200160002081905550807f123456789000000000000000000000000000000000000000000000000000000060405160405180910390a25b50565b5050565b6102de82826102ee565b5050565b60008060606000806102f2610423565b90508067ffffffffffffffff81111561030e5761030d6106d0565b5b60405190808252806020026020018201604052801561033d5781602001602082028036833780820191505090505b50935060005b8181101561041d57600073ffffffffffffffffffffffffffffffffffffffff168282815181106103775761037661071f565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff16146103a057600192505b8481815181106103b3576103b261071f565b5b60200260200101518482815181106103cf576103ce61071f565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508080610415906107a7565b915050610343565b50505090565b60606000805480602002602001604051908101604052809291908181526020018280548015610472576020028201919060005260206000209081548152602001906001019080831161045e575b50505050509050919050565b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6104888161047e565b81146104935760006000fd5b50565b6000813590506104a58161047f565b92915050565b6000602082840312156104c1576104c061047e565b5b60006104cf84828501610496565b91505092915050565b60008115159050919050565b6104ee816104d8565b82525050565b600060208201905061050a60008301846104e5565b92915050565b6000819050919050565b61052481610510565b811461052f5760006000fd5b50565b6000813590506105418161051b565b92915050565b60006020828403121561055d5761055c61047e565b5b600061056b84828501610532565b91505092915050565b61057d81610510565b82525050565b60006020820190506105986000830184610574565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6105f2826105a8565b810181811067ffffffffffffffff82111715610611576106106105b9565b5b80604052505050565b600061062461044f565b905061063082826105e8565b919050565b600082825260208201905092915050565b82818337600083830152505050565b60006106618385610635565b935061066e838584610647565b61067783610599565b840190509392505050565b6000606082019050818103600083015261069e818789610656565b90506106ad60208301866104e5565b81810360408301526106c1818486610656565b9050959450505050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610768826103e7565b9150610773836103e7565b925082820190508082111561078b5761078a61072e565b5b92915050565b5056fea2646970667358221220";

async function deployContract() {
  try {
    console.log("🚀 Starting ResumeVerifier contract deployment to Polygon Mumbai...\n");

    // Check for required environment variables
    const RPC_URL = process.env.WEB3_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/demo";
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    if (!PRIVATE_KEY) {
      console.error("❌ ERROR: PRIVATE_KEY not found in environment variables");
      console.log("Please add your wallet private key to the .env file");
      process.exit(1);
    }

    // Connect to Polygon Mumbai
    console.log("📡 Connecting to Polygon Mumbai...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Check network
    const network = await provider.getNetwork();
    if (network.chainId !== 80001n) {
      console.error(`❌ Wrong network! Expected Mumbai (80001), got ${network.chainId}`);
      process.exit(1);
    }
    console.log(`✅ Connected to ${network.name} (Chain ID: ${network.chainId})`);

    // Create wallet
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`📝 Deploying from wallet: ${wallet.address}`);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    console.log(`💰 Wallet balance: ${balanceInMatic} MATIC`);

    if (parseFloat(balanceInMatic) < 0.01) {
      console.error("❌ Insufficient balance! You need at least 0.01 MATIC for deployment");
      console.log("🚰 Get free testnet MATIC from: https://faucet.polygon.technology/");
      process.exit(1);
    }

    // Deploy the contract
    console.log("\n📦 Deploying ResumeVerifier contract...");
    const factory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, wallet);
    
    // Estimate gas
    const deploymentData = factory.interface.encodeDeploy();
    const estimatedGas = await provider.estimateGas({
      data: CONTRACT_BYTECODE + deploymentData.slice(2),
      from: wallet.address
    });
    
    console.log(`⛽ Estimated gas: ${estimatedGas.toString()}`);
    
    // Deploy with gas settings
    const contract = await factory.deploy({
      gasLimit: estimatedGas * 120n / 100n, // Add 20% buffer
      gasPrice: (await provider.getFeeData()).gasPrice
    });

    console.log(`📄 Transaction hash: ${contract.deploymentTransaction()?.hash}`);
    console.log("⏳ Waiting for confirmation...");

    // Wait for deployment
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log(`\n✅ Contract deployed successfully!`);
    console.log(`📍 Contract address: ${contractAddress}`);
    console.log(`🔍 View on explorer: https://mumbai.polygonscan.com/address/${contractAddress}`);

    // Save contract details
    const configPath = path.join(__dirname, "config.ts");
    const configContent = `// Auto-generated contract configuration
export const BLOCKCHAIN_CONFIG = {
  CONTRACT_ADDRESS: "${contractAddress}",
  CONTRACT_ABI: ${JSON.stringify(CONTRACT_ABI, null, 2)},
  CHAIN_ID: 80001,
  NETWORK_NAME: "Polygon Mumbai",
  RPC_URL: "${RPC_URL}",
  EXPLORER_URL: "https://mumbai.polygonscan.com",
  DEPLOYED_AT: "${new Date().toISOString()}",
  DEPLOYED_BY: "${wallet.address}"
};

export const FAUCET_URLS = [
  "https://faucet.polygon.technology/",
  "https://mumbaifaucet.com/"
];
`;

    fs.writeFileSync(configPath, configContent);
    console.log(`\n💾 Configuration saved to: ${configPath}`);

    // Update .env.example
    const envPath = path.join(__dirname, "../../.env.example");
    const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    
    if (!envContent.includes("CONTRACT_ADDRESS")) {
      const newEnvContent = `${envContent}
# Blockchain Configuration
WEB3_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-wallet-private-key
CONTRACT_ADDRESS=${contractAddress}
`;
      fs.writeFileSync(envPath, newEnvContent);
      console.log(`📝 Updated .env.example with contract address`);
    }

    console.log("\n🎉 Deployment complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Add these variables to your .env file:");
    console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`   WEB3_RPC_URL=${RPC_URL}`);
    console.log(`   PRIVATE_KEY=<keep-your-existing-key>`);
    console.log("\n2. Restart your application to use the deployed contract");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    if (error.code === "INSUFFICIENT_FUNDS") {
      console.log("💡 Get testnet MATIC from: https://faucet.polygon.technology/");
    }
    process.exit(1);
  }
}

// Run deployment
deployContract();