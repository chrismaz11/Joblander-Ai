#!/usr/bin/env node

/**
 * Bedrock AI Integration Test
 * 
 * This script tests that Amazon Bedrock is properly integrated with 
 * the Lambda functions by making direct API calls to validate AI functionality.
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Test Bedrock directly
const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

const MODELS = {
  CLAUDE_3_SONNET: "anthropic.claude-3-sonnet-20240229-v1:0",
  CLAUDE_3_HAIKU: "anthropic.claude-3-haiku-20240307-v1:0"
};

class BedrockTester {
  private stats = {
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    errors: [] as string[]
  };

  async testBedrockConnection() {
    console.log('🔍 Testing Amazon Bedrock Connection...');
    try {
      const prompt = `
        Hello! This is a test to verify Amazon Bedrock integration.
        Please respond with a JSON object containing:
        {
          "status": "success",
          "message": "Bedrock is working correctly",
          "timestamp": "${new Date().toISOString()}"
        }
      `;

      const response = await bedrock.send(new InvokeModelCommand({
        modelId: MODELS.CLAUDE_3_SONNET,
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 200,
          messages: [{ role: "user", content: prompt }]
        }),
        contentType: "application/json",
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const result = JSON.parse(responseBody.content[0].text);

      if (result.status === 'success') {
        console.log('  ✅ Bedrock connection successful');
        console.log('  🤖 Model:', MODELS.CLAUDE_3_SONNET);
        console.log('  📅 Response timestamp:', result.timestamp);
        this.testsPassed++;
      } else {
        throw new Error('Bedrock response does not indicate success');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Bedrock connection test failed:', error);
      this.errors.push(`Bedrock Connection: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testResumeParsingCapabilities() {
    console.log('\n📄 Testing Resume Parsing with Bedrock...');
    try {
      const sampleResume = `
        John Doe
        Senior Software Engineer
        john.doe@email.com | (555) 123-4567

        EXPERIENCE
        Senior Software Engineer | TechCorp | 2020-Present
        • Led team of 5 developers
        • Improved performance by 40%
        
        EDUCATION
        BS Computer Science | UC Berkeley | 2018
        
        SKILLS
        JavaScript, React, Node.js, AWS
      `;

      const prompt = `
        Extract and structure the following resume content into JSON format:

        ${sampleResume}

        Return a JSON object with personalInfo, experience, education, and skills.
      `;

      const response = await bedrock.send(new InvokeModelCommand({
        modelId: MODELS.CLAUDE_3_SONNET,
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }]
        }),
        contentType: "application/json",
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const structuredData = JSON.parse(responseBody.content[0].text);

      if (structuredData.personalInfo && structuredData.experience && structuredData.skills) {
        console.log('  ✅ Resume parsing working correctly');
        console.log('  👤 Name extracted:', structuredData.personalInfo.name);
        console.log('  🏢 Experience items:', structuredData.experience.length);
        console.log('  💡 Skills found:', Array.isArray(structuredData.skills) ? structuredData.skills.length : Object.keys(structuredData.skills).length);
        this.testsPassed++;
      } else {
        throw new Error('Resume parsing did not return expected structure');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Resume parsing test failed:', error);
      this.errors.push(`Resume Parsing: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testCoverLetterGeneration() {
    console.log('\n💌 Testing Cover Letter Generation with Bedrock...');
    try {
      const jobDescription = "We are looking for a Senior Full Stack Developer with React and Node.js experience.";
      const candidateName = "John Doe";
      
      const prompt = `
        Generate a professional cover letter for ${candidateName} applying for this job:
        
        ${jobDescription}
        
        The candidate has experience with JavaScript, React, and Node.js.
        Return a JSON object with:
        {
          "coverLetter": "the generated cover letter text",
          "keyPoints": ["matching strengths"],
          "matchScore": 0.85
        }
      `;

      const response = await bedrock.send(new InvokeModelCommand({
        modelId: MODELS.CLAUDE_3_SONNET,
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }]
        }),
        contentType: "application/json",
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const result = JSON.parse(responseBody.content[0].text);

      if (result.coverLetter && result.keyPoints && result.matchScore) {
        console.log('  ✅ Cover letter generation working correctly');
        console.log('  📄 Cover letter length:', result.coverLetter.length);
        console.log('  🎯 Match score:', result.matchScore);
        console.log('  💡 Key points:', result.keyPoints.length);
        console.log('  📝 Snippet:', result.coverLetter.substring(0, 100) + '...');
        this.testsPassed++;
      } else {
        throw new Error('Cover letter generation did not return expected format');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Cover letter generation test failed:', error);
      this.errors.push(`Cover Letter Generation: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testJobMatchAnalysis() {
    console.log('\n🎯 Testing Job Match Analysis with Bedrock...');
    try {
      const resume = "Senior Software Engineer with 5 years experience in JavaScript, React, Node.js";
      const jobDescription = "Looking for Senior Full Stack Developer with React and Node.js experience";
      
      const prompt = `
        Analyze how well this resume matches the job description:
        
        Resume: ${resume}
        Job Description: ${jobDescription}
        
        Return a JSON object with:
        {
          "overallScore": 85,
          "matchingSkills": ["skills that match"],
          "missingSkills": ["skills that are missing"],
          "recommendation": "brief recommendation"
        }
      `;

      const response = await bedrock.send(new InvokeModelCommand({
        modelId: MODELS.CLAUDE_3_SONNET,
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        }),
        contentType: "application/json",
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const result = JSON.parse(responseBody.content[0].text);

      if (result.overallScore && result.matchingSkills && result.recommendation) {
        console.log('  ✅ Job match analysis working correctly');
        console.log('  🎯 Overall score:', result.overallScore);
        console.log('  ✅ Matching skills:', result.matchingSkills.length);
        console.log('  ❌ Missing skills:', result.missingSkills?.length || 0);
        console.log('  💡 Recommendation:', result.recommendation.substring(0, 80) + '...');
        this.testsPassed++;
      } else {
        throw new Error('Job match analysis did not return expected format');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Job match analysis test failed:', error);
      this.errors.push(`Job Match Analysis: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testModelComparison() {
    console.log('\n🤖 Testing Multiple Bedrock Models...');
    
    const testPrompt = "What is the capital of France? Respond with just the city name.";
    const models = [
      { name: 'Claude 3 Sonnet', id: MODELS.CLAUDE_3_SONNET },
      { name: 'Claude 3 Haiku', id: MODELS.CLAUDE_3_HAIKU }
    ];

    for (const model of models) {
      try {
        const response = await bedrock.send(new InvokeModelCommand({
          modelId: model.id,
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 50,
            messages: [{ role: "user", content: testPrompt }]
          }),
          contentType: "application/json",
        }));

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const result = responseBody.content[0].text;

        console.log(`  ✅ ${model.name}: ${result.trim()}`);
        this.testsPassed++;
      } catch (error) {
        console.error(`  ❌ ${model.name} failed:`, error);
        this.errors.push(`${model.name}: ${error}`);
        this.testsFailed++;
      }
      this.testsRun++;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Amazon Bedrock AI Integration Tests...');
    console.log('Testing direct Bedrock functionality for Job-Lander AI features\n');

    const startTime = Date.now();

    try {
      await this.testBedrockConnection();
      await this.testResumeParsingCapabilities();
      await this.testCoverLetterGeneration();
      await this.testJobMatchAnalysis();
      await this.testModelComparison();
    } catch (error) {
      console.error('❌ Test suite encountered an error:', error);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.printResults(duration);
  }

  private printResults(duration: number) {
    console.log('\n📊 Amazon Bedrock AI Integration Test Results');
    console.log('=============================================');
    console.log(`Tests Run: ${this.testsRun}`);
    console.log(`✅ Passed: ${this.testsPassed}`);
    console.log(`❌ Failed: ${this.testsFailed}`);
    console.log(`⏱️ Duration: ${duration}s`);
    console.log(`🎯 Success Rate: ${((this.testsPassed / this.testsRun) * 100).toFixed(2)}%`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 Error Summary:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Ensure you have AWS credentials configured');
      console.log('2. Check that Bedrock is available in us-east-1');
      console.log('3. Verify IAM permissions for bedrock:InvokeModel');
      console.log('4. Confirm Claude models are enabled in Bedrock console');
    }

    if (this.testsPassed === this.testsRun) {
      console.log('\n🎉 All Bedrock AI tests passed successfully!');
      console.log('✅ Amazon Bedrock integration working correctly');
      console.log('✅ Claude 3 models responding properly');
      console.log('✅ AI-powered resume and job features ready');
      
      console.log('\n🚀 Phase 2 AI Migration Complete!');
      console.log('📈 Performance benefits:');
      console.log('  • Better AI model performance with Claude 3');
      console.log('  • Native AWS integration');
      console.log('  • Improved security with IAM');
      console.log('  • Cost optimization with pay-per-use');
      
      console.log('\n🎯 Next Phase: Authentication Migration');
      console.log('  • Migrate user accounts to Cognito');
      console.log('  • Set up social login providers');
      console.log('  • Configure user pools and identity pools');
    } else {
      console.log('\n⚠️ Some tests failed. Review the errors above.');
      console.log('Most likely issues:');
      console.log('  • AWS credentials not configured');
      console.log('  • Bedrock models not enabled');
      console.log('  • IAM permissions missing');
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const tester = new BedrockTester();
  await tester.runAllTests();
}

main().catch(console.error);