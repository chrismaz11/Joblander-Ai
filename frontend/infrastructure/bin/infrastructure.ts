#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { JobLanderStack } from '../lib/job-lander-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Development environment
new JobLanderStack(app, 'JobLanderDev', {
  env,
  stage: 'development',
  desiredCount: 1,
  cpu: 512,
  memory: 1024,
  enableAutoScaling: false,
});

// Staging environment
new JobLanderStack(app, 'JobLanderStaging', {
  env,
  stage: 'staging',
  desiredCount: 2,
  cpu: 1024,
  memory: 2048,
  enableAutoScaling: true,
});

// Production environment
new JobLanderStack(app, 'JobLanderProd', {
  env,
  stage: 'production',
  desiredCount: 3,
  cpu: 2048,
  memory: 4096,
  enableAutoScaling: true,
  hostedZoneId: process.env.HOSTED_ZONE_ID,
  domainName: process.env.DOMAIN_NAME,
});

app.synth();
