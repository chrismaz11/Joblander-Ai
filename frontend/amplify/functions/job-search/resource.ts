import { defineFunction } from '@aws-amplify/backend';

export const jobSearchFunction = defineFunction({
  name: 'job-search',
  entry: './handler.ts',
  environment: {
    JSEARCH_API_KEY: process.env.JSEARCH_API_KEY || '',
  },
  timeoutSeconds: 30,
  memoryMB: 512,
});
