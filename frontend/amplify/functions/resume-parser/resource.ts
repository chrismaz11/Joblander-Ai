import { defineFunction } from '@aws-amplify/backend';

export const resumeParserFunction = defineFunction({
  name: 'resume-parser',
  entry: './handler.ts',
  environment: {
    BEDROCK_REGION: 'us-east-1',
  },
  runtime: 20,
  timeoutSeconds: 300,
  bundling: {
    externalModules: ['@aws-sdk/client-bedrock-runtime', '@aws-sdk/client-textract'],
  },
});
