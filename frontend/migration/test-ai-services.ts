#!/usr/bin/env node

/**
 * AI Services Migration Test
 * 
 * This script tests the Amazon Bedrock-powered AI services to ensure
 * they're working correctly after the migration from Gemini AI.
 */

import { Amplify } from 'aws-amplify';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import amplifyOutputs from '../amplify_outputs.json';

// Configure Amplify and Lambda client
Amplify.configure(amplifyOutputs);
const lambda = new LambdaClient({ region: 'us-east-1' });

// Test data
const testData = {
  sampleResumeText: `
John Doe
Senior Software Engineer
john.doe@email.com | (555) 123-4567 | San Francisco, CA
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced full-stack developer with 8+ years of expertise in JavaScript, React, Node.js, and AWS. 
Led development teams and delivered scalable applications for Fortune 500 companies.

EXPERIENCE
Senior Software Engineer | TechCorp Inc | 2020 - Present
• Led a team of 5 developers in building microservices architecture
• Improved application performance by 40% through optimization
• Implemented CI/CD pipelines reducing deployment time by 60%

Software Engineer | StartupXYZ | 2018 - 2020  
• Built React-based e-commerce platform serving 10K+ users
• Developed RESTful APIs handling 1M+ requests daily
• Collaborated with UX team to improve user experience

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2018

SKILLS
Programming: JavaScript, TypeScript, Python, Java
Frontend: React, Vue.js, Angular, HTML, CSS
Backend: Node.js, Express, Django, Spring Boot
Cloud: AWS, Docker, Kubernetes, Lambda
Databases: PostgreSQL, MongoDB, Redis

PROJECTS
E-Commerce Platform | 2019
Built full-stack e-commerce solution with React and Node.js
Technologies: React, Node.js, PostgreSQL, AWS
URL: github.com/johndoe/ecommerce

CERTIFICATIONS
AWS Certified Solutions Architect
Google Cloud Professional Cloud Architect
  `,

  sampleJobDescription: `
Full Stack Developer - Senior Level
Company: Innovation Labs
Location: San Francisco, CA

We are seeking a Senior Full Stack Developer to join our growing team. The ideal candidate will have:

REQUIREMENTS:
- 5+ years of experience in full-stack development
- Strong proficiency in JavaScript, React, and Node.js
- Experience with cloud platforms (AWS preferred)
- Knowledge of microservices architecture
- Experience with CI/CD pipelines
- Strong problem-solving skills and team collaboration

NICE TO HAVE:
- Experience with TypeScript
- Knowledge of containerization (Docker/Kubernetes)
- Database design experience
- Experience leading development teams

RESPONSIBILITIES:
- Design and develop scalable web applications
- Lead technical discussions and mentor junior developers
- Collaborate with product and design teams
- Implement best practices for code quality and testing
- Optimize application performance

We offer competitive salary, equity, and comprehensive benefits.
  `,

  sampleResumeData: {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe"
    },
    summary: "Experienced full-stack developer with 8+ years of expertise in JavaScript, React, Node.js, and AWS.",
    experience: [
      {
        company: "TechCorp Inc",
        position: "Senior Software Engineer",
        duration: "2020 - Present",
        location: "San Francisco, CA",
        responsibilities: [
          "Led a team of 5 developers in building microservices architecture",
          "Improved application performance by 40% through optimization",
          "Implemented CI/CD pipelines reducing deployment time by 60%"
        ]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduationDate: "2018"
      }
    ],
    skills: {
      technical: ["JavaScript", "TypeScript", "Python", "Java", "React", "Node.js", "AWS"],
      soft: ["Leadership", "Team Collaboration", "Problem Solving"],
      languages: ["English"],
      certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Cloud Architect"]
    },
    projects: [
      {
        name: "E-Commerce Platform",
        description: "Built full-stack e-commerce solution with React and Node.js",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
        link: "github.com/johndoe/ecommerce"
      }
    ]
  }
};

class AIServiceTester {
  private stats = {
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    errors: [] as string[]
  };

  async testResumeParser() {
    console.log('🔍 Testing Resume Parser Service...');
    try {
      const response = await invokeFunction({
        functionName: 'resume-parser',
        payload: {
          documentContent: testData.sampleResumeText,
          documentType: 'text',
          fileName: 'test-resume.txt',
          fileType: 'text/plain'
        }
      });

      console.log('Raw response:', JSON.stringify(response, null, 2));
      
      // Parse the response if it's a string
      let result;
      if (typeof response.payload === 'string') {
        result = JSON.parse(response.payload);
      } else {
        result = response.payload;
      }

      if (result.success && result.data.structuredData) {
        console.log('  ✅ Resume parser working correctly');
        console.log('  📄 Parsed personal info:', result.data.structuredData.personalInfo);
        console.log('  🏢 Experience count:', result.data.structuredData.experience?.length || 0);
        console.log('  🎓 Education count:', result.data.structuredData.education?.length || 0);
        console.log('  💡 Skills found:', result.data.structuredData.skills?.technical?.length || 0);
        this.testsPassed++;
      } else {
        throw new Error('Resume parser response invalid or unsuccessful');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Resume parser test failed:', error);
      this.errors.push(`Resume Parser: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testResumeEnhancement() {
    console.log('\n✨ Testing Resume Enhancement Service...');
    try {
      const response = await invokeFunction({
        functionName: 'ai-service',
        payload: {
          path: '/enhance-resume',
          httpMethod: 'POST',
          body: JSON.stringify({
            resumeData: testData.sampleResumeData,
            targetJob: 'Senior Full Stack Developer',
            tone: 'professional'
          })
        }
      });

      let result;
      if (typeof response.payload === 'string') {
        result = JSON.parse(response.payload);
      } else {
        result = response.payload;
      }

      if (result.success && result.data) {
        console.log('  ✅ Resume enhancement working correctly');
        console.log('  📝 Enhanced summary available:', !!result.data.summary);
        console.log('  💡 Suggestions provided:', !!result.data.suggestions);
        this.testsPassed++;
      } else {
        throw new Error('Resume enhancement response invalid or unsuccessful');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Resume enhancement test failed:', error);
      this.errors.push(`Resume Enhancement: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testCoverLetterGeneration() {
    console.log('\n💌 Testing Cover Letter Generation Service...');
    try {
      const response = await invokeFunction({
        functionName: 'ai-service',
        payload: {
          path: '/generate-cover-letter',
          httpMethod: 'POST',
          body: JSON.stringify({
            resumeData: testData.sampleResumeData,
            jobDescription: testData.sampleJobDescription,
            tone: 'professional',
            companyName: 'Innovation Labs'
          })
        }
      });

      let result;
      if (typeof response.payload === 'string') {
        result = JSON.parse(response.payload);
      } else {
        result = response.payload;
      }

      if (result.success && result.data) {
        console.log('  ✅ Cover letter generation working correctly');
        console.log('  📄 Cover letter length:', result.data.coverLetter?.length || 0);
        console.log('  🎯 Match score:', result.data.matchScore || 'N/A');
        console.log('  💡 Key points:', result.data.keyPoints?.length || 0);
        
        // Show a snippet of the generated cover letter
        if (result.data.coverLetter) {
          const snippet = result.data.coverLetter.substring(0, 150) + '...';
          console.log('  📝 Cover letter snippet:', snippet);
        }
        
        this.testsPassed++;
      } else {
        throw new Error('Cover letter generation response invalid or unsuccessful');
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
    console.log('\n🎯 Testing Job Match Analysis Service...');
    try {
      const response = await invokeFunction({
        functionName: 'ai-service',
        payload: {
          path: '/analyze-job-match',
          httpMethod: 'POST',
          body: JSON.stringify({
            resumeData: testData.sampleResumeData,
            jobDescription: testData.sampleJobDescription
          })
        }
      });

      let result;
      if (typeof response.payload === 'string') {
        result = JSON.parse(response.payload);
      } else {
        result = response.payload;
      }

      if (result.success && result.data) {
        console.log('  ✅ Job match analysis working correctly');
        console.log('  🎯 Overall match score:', result.data.overallScore || 'N/A');
        console.log('  ✅ Matching skills:', result.data.matchingElements?.skills?.length || 0);
        console.log('  ❌ Missing skills:', result.data.missingElements?.requiredSkills?.length || 0);
        console.log('  💡 Recommendations:', result.data.recommendations?.immediate?.length || 0);
        console.log('  🔍 ATS keywords:', result.data.atsKeywords?.length || 0);
        this.testsPassed++;
      } else {
        throw new Error('Job match analysis response invalid or unsuccessful');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Job match analysis test failed:', error);
      this.errors.push(`Job Match Analysis: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testPortfolioGeneration() {
    console.log('\n🎨 Testing Portfolio Generation Service...');
    try {
      const response = await invokeFunction({
        functionName: 'ai-service',
        payload: {
          path: '/generate-portfolio',
          httpMethod: 'POST',
          body: JSON.stringify({
            resumeData: testData.sampleResumeData,
            portfolioType: 'professional'
          })
        }
      });

      let result;
      if (typeof response.payload === 'string') {
        result = JSON.parse(response.payload);
      } else {
        result = response.payload;
      }

      if (result.success && result.data) {
        console.log('  ✅ Portfolio generation working correctly');
        console.log('  📝 Bio section:', !!result.data.bio || !!result.data.about);
        console.log('  💼 Skills showcase:', !!result.data.skills || !!result.data.skillsShowcase);
        console.log('  🏆 Projects section:', !!result.data.projects);
        this.testsPassed++;
      } else {
        throw new Error('Portfolio generation response invalid or unsuccessful');
      }

      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Portfolio generation test failed:', error);
      this.errors.push(`Portfolio Generation: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async testHealthEndpoints() {
    console.log('\n🏥 Testing Health Endpoints...');
    
    // Test resume parser health
    try {
      const resumeParserHealth = await invokeFunction({
        functionName: 'resume-parser',
        payload: {
          path: '/health',
          httpMethod: 'GET'
        }
      });

      let result;
      if (typeof resumeParserHealth.payload === 'string') {
        result = JSON.parse(resumeParserHealth.payload);
      } else {
        result = resumeParserHealth.payload;
      }

      if (result.success && result.status === 'healthy') {
        console.log('  ✅ Resume parser health check passed');
        console.log('  🤖 Services:', JSON.stringify(result.services));
        this.testsPassed++;
      } else {
        throw new Error('Resume parser health check failed');
      }
      this.testsRun++;
    } catch (error) {
      console.error('  ❌ Resume parser health check failed:', error);
      this.errors.push(`Resume Parser Health: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }

    // Test AI service health
    try {
      const aiServiceHealth = await invokeFunction({
        functionName: 'ai-service',
        payload: {
          path: '/health',
          httpMethod: 'GET'
        }
      });

      let result;
      if (typeof aiServiceHealth.payload === 'string') {
        result = JSON.parse(aiServiceHealth.payload);
      } else {
        result = aiServiceHealth.payload;
      }

      if (result.success && result.status === 'healthy') {
        console.log('  ✅ AI service health check passed');
        console.log('  🤖 Services:', JSON.stringify(result.services));
        console.log('  🧠 Available models:', Object.keys(result.models || {}).length);
        this.testsPassed++;
      } else {
        throw new Error('AI service health check failed');
      }
      this.testsRun++;
    } catch (error) {
      console.error('  ❌ AI service health check failed:', error);
      this.errors.push(`AI Service Health: ${error}`);
      this.testsFailed++;
      this.testsRun++;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting AI Services Migration Testing...');
    console.log('Testing Amazon Bedrock integration and AI functionality\n');

    const startTime = Date.now();

    try {
      await this.testHealthEndpoints();
      await this.testResumeParser();
      await this.testResumeEnhancement();
      await this.testCoverLetterGeneration();
      await this.testJobMatchAnalysis();
      await this.testPortfolioGeneration();
    } catch (error) {
      console.error('❌ Test suite encountered an error:', error);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.printResults(duration);
  }

  private printResults(duration: number) {
    console.log('\n📊 AI Services Migration Test Results');
    console.log('=====================================');
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
    }

    if (this.testsPassed === this.testsRun) {
      console.log('\n🎉 All AI services are working correctly!');
      console.log('✅ Amazon Bedrock migration successful');
      console.log('✅ Lambda functions properly configured');
      console.log('✅ AI-powered features ready for production');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Deploy the updated backend with IAM permissions');
      console.log('2. Update frontend to use new AI service endpoints');
      console.log('3. Configure Bedrock model access if needed');
      console.log('4. Monitor AI service costs and performance');
    } else {
      console.log('\n⚠️ Some tests failed. Review the errors above.');
      console.log('Check Lambda function logs and IAM permissions.');
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const tester = new AIServiceTester();
  await tester.runAllTests();
}

main().catch(console.error);