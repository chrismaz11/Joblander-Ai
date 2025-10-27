import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { resumeParserFunction } from './functions/resume-parser/resource';
import { aiServiceFunction } from './functions/ai-service/resource';
import { blockchainServiceFunction } from './functions/blockchain-service/resource';
import { jobSearchFunction } from './functions/job-search/resource';
import { pdfGeneratorFunction } from './functions/pdf-generator/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add more resources
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  resumeParserFunction,
  aiServiceFunction,
  blockchainServiceFunction,
  jobSearchFunction,
  pdfGeneratorFunction,
});

// Add Bedrock permissions to Lambda functions
const bedrockPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'bedrock:InvokeModel',
    'bedrock:InvokeModelWithResponseStream',
    'bedrock:GetFoundationModel',
    'bedrock:ListFoundationModels',
  ],
  resources: [
    'arn:aws:bedrock:*:*:foundation-model/*',
    'arn:aws:bedrock:*:*:model/*',
  ],
});

// Add Textract permissions
const textractPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'textract:DetectDocumentText',
    'textract:AnalyzeDocument',
    'textract:GetDocumentAnalysis',
    'textract:GetDocumentTextDetection',
  ],
  resources: ['*'],
});

// Add Comprehend permissions
const comprehendPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'comprehend:DetectKeyPhrases',
    'comprehend:DetectSentiment',
    'comprehend:DetectEntities',
    'comprehend:DetectLanguage',
  ],
  resources: ['*'],
});

// Add S3 permissions for document storage
const s3Policy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  resources: [
    backend.storage.resources.bucket.bucketArn + '/*',
  ],
});

// Apply policies to Lambda functions
backend.resumeParserFunction.resources.lambda.addToRolePolicy(bedrockPolicy);
backend.resumeParserFunction.resources.lambda.addToRolePolicy(textractPolicy);
backend.resumeParserFunction.resources.lambda.addToRolePolicy(s3Policy);

backend.aiServiceFunction.resources.lambda.addToRolePolicy(bedrockPolicy);
backend.aiServiceFunction.resources.lambda.addToRolePolicy(textractPolicy);
backend.aiServiceFunction.resources.lambda.addToRolePolicy(comprehendPolicy);
backend.aiServiceFunction.resources.lambda.addToRolePolicy(s3Policy);

// Add KMS permissions for blockchain service
const kmsPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'kms:Sign',
    'kms:GetPublicKey',
    'kms:Describe*',
    'kms:List*',
  ],
  resources: [
    'arn:aws:kms:*:*:key/*',
    'arn:aws:kms:*:*:alias/job-lander-blockchain-key',
  ],
});

// Add Secrets Manager permissions for blockchain config
const secretsManagerPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'secretsmanager:GetSecretValue',
    'secretsmanager:DescribeSecret',
  ],
  resources: [
    'arn:aws:secretsmanager:*:*:secret:job-lander/blockchain-config*',
  ],
});

// Add CloudWatch permissions for blockchain monitoring
const cloudWatchPolicy = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'cloudwatch:PutMetricData',
    'logs:CreateLogGroup',
    'logs:CreateLogStream',
    'logs:PutLogEvents',
  ],
  resources: ['*'],
});

// Apply blockchain-specific policies
backend.blockchainServiceFunction.resources.lambda.addToRolePolicy(kmsPolicy);
backend.blockchainServiceFunction.resources.lambda.addToRolePolicy(secretsManagerPolicy);
backend.blockchainServiceFunction.resources.lambda.addToRolePolicy(cloudWatchPolicy);
backend.blockchainServiceFunction.resources.lambda.addToRolePolicy(s3Policy);

// Apply policies to job search function
backend.jobSearchFunction.resources.lambda.addToRolePolicy(secretsManagerPolicy);
backend.jobSearchFunction.resources.lambda.addToRolePolicy(cloudWatchPolicy);

// Apply policies to PDF generator function
backend.pdfGeneratorFunction.resources.lambda.addToRolePolicy(s3Policy);
backend.pdfGeneratorFunction.resources.lambda.addToRolePolicy(cloudWatchPolicy);
