#!/usr/bin/env node

/**
 * Migration Test Script
 * 
 * This script tests the migration setup and validates connectivity
 * to both MongoDB (if available) and AWS DynamoDB via Amplify.
 */

import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import type { Schema } from './amplify-schema.js';
import amplifyOutputs from '../amplify_outputs.json';

// Configure Amplify with the outputs
Amplify.configure(amplifyOutputs);
const client = generateClient<Schema>({
  authMode: 'apiKey',
});

async function testDynamoDBConnection() {
  console.log('🧪 Testing DynamoDB connection via Amplify GraphQL...');
  
  try {
    // Try to create a test resume record
    const testResume = {
      userId: 'test-user-' + Date.now(),
      content: JSON.stringify({
        personalInfo: {
          name: 'Test User',
          email: 'test@example.com',
        },
        experience: [],
        education: [],
        skills: ['Testing'],
      }),
    };

    const { data, errors } = await client.models.Resume.create(testResume);
    
    if (errors) {
      console.error('❌ GraphQL errors:', errors);
      return false;
    }

    console.log('✅ Successfully created test resume:', data?.id);
    
    // Clean up - delete the test record
    if (data?.id) {
      await client.models.Resume.delete({ id: data.id });
      console.log('🧹 Cleaned up test record');
    }
    
    return true;
  } catch (error) {
    console.error('❌ DynamoDB connection test failed:', error);
    return false;
  }
}

async function testUserSettings() {
  console.log('🧪 Testing UserSettings model...');
  
  try {
    const testSettings = {
      userId: 'test-user-' + Date.now(),
      preferences: JSON.stringify({
        theme: 'dark',
        notifications: true,
      }),
      subscriptionTier: 'FREE' as const,
      usage: JSON.stringify({
        resumesCreated: 0,
        aiQueriesUsed: 0,
      }),
    };

    const { data, errors } = await client.models.UserSettings.create(testSettings);
    
    if (errors) {
      console.error('❌ UserSettings errors:', errors);
      return false;
    }

    console.log('✅ Successfully created test user settings:', data?.id);
    
    // Clean up
    if (data?.id) {
      await client.models.UserSettings.delete({ id: data.id });
      console.log('🧹 Cleaned up test user settings');
    }
    
    return true;
  } catch (error) {
    console.error('❌ UserSettings test failed:', error);
    return false;
  }
}

async function testPortfolio() {
  console.log('🧪 Testing Portfolio model...');
  
  try {
    const testPortfolio = {
      userId: 'test-user-' + Date.now(),
      resumeId: 'test-resume-' + Date.now(),
      title: 'Test Portfolio',
      htmlContent: '<html><body><h1>Test Portfolio</h1></body></html>',
      isPublic: false,
    };

    const { data, errors } = await client.models.Portfolio.create(testPortfolio);
    
    if (errors) {
      console.error('❌ Portfolio errors:', errors);
      return false;
    }

    console.log('✅ Successfully created test portfolio:', data?.id);
    
    // Clean up
    if (data?.id) {
      await client.models.Portfolio.delete({ id: data.id });
      console.log('🧹 Cleaned up test portfolio');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Portfolio test failed:', error);
    return false;
  }
}

async function testJobApplication() {
  console.log('🧪 Testing JobApplication model...');
  
  try {
    const testJobApp = {
      userId: 'test-user-' + Date.now(),
      resumeId: 'test-resume-' + Date.now(),
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      jobDescription: 'A test job description',
      applicationStatus: 'APPLIED' as const,
      matchScore: 0.85,
    };

    const { data, errors } = await client.models.JobApplication.create(testJobApp);
    
    if (errors) {
      console.error('❌ JobApplication errors:', errors);
      return false;
    }

    console.log('✅ Successfully created test job application:', data?.id);
    
    // Clean up
    if (data?.id) {
      await client.models.JobApplication.delete({ id: data.id });
      console.log('🧹 Cleaned up test job application');
    }
    
    return true;
  } catch (error) {
    console.error('❌ JobApplication test failed:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting migration setup validation...\n');
  
  const results = {
    dynamodb: false,
    userSettings: false,
    portfolio: false,
    jobApplication: false,
  };
  
  // Test all models
  results.dynamodb = await testDynamoDBConnection();
  results.userSettings = await testUserSettings();
  results.portfolio = await testPortfolio();
  results.jobApplication = await testJobApplication();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('================================');
  console.log(`DynamoDB Connection: ${results.dynamodb ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`UserSettings Model: ${results.userSettings ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Portfolio Model: ${results.portfolio ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`JobApplication Model: ${results.jobApplication ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Migration setup is ready.');
    console.log('\nNext steps:');
    console.log('1. Configure your MongoDB Atlas connection in migration/.env');
    console.log('2. Run: cd migration && npx tsx database-migration.ts --dry-run');
    console.log('3. Review the dry run results');
    console.log('4. Run the actual migration: DRY_RUN=false npx tsx database-migration.ts');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error('🚨 Test execution failed:', error);
  process.exit(1);
});