import { defineFunction } from '@aws-amplify/backend';

export const pdfGeneratorFunction = defineFunction({
  name: 'pdf-generator',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 1024,
});
