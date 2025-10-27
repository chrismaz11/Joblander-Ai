import { defineFunction } from '@aws-amplify/backend';

export const blockchainServiceFunction = defineFunction({
  name: 'blockchain-service',
  entry: './handler.ts',
  environment: {
    KMS_KEY_ID: 'alias/job-lander-blockchain-key',
    BLOCKCHAIN_CONFIG_SECRET: 'job-lander/blockchain-config',
  },
  runtime: 20,
  timeoutSeconds: 300,
  memoryMB: 1024, // Higher memory for blockchain operations
  bundling: {
    externalModules: [
      '@aws-sdk/client-kms',
      '@aws-sdk/client-secrets-manager',
      '@aws-sdk/client-cloudwatch',
      'ethers'
    ],
  },
});