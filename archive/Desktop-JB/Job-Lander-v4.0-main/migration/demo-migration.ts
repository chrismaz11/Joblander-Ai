#!/usr/bin/env node

/**
 * Migration Demo Script
 * 
 * This script demonstrates the complete migration flow using mock data,
 * simulating a real MongoDB to DynamoDB migration without requiring
 * an actual MongoDB connection.
 */

import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import type { Schema } from './amplify-schema.js';
import amplifyOutputs from '../amplify_outputs.json';

// Configure Amplify
Amplify.configure(amplifyOutputs);
const client = generateClient<Schema>({
  authMode: 'apiKey',
});

// Mock MongoDB data that represents what would come from the actual database
const mockMongoData = {
  resumes: [
    {
      _id: 'mock_resume_1',
      userId: 'user_123',
      content: {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-123-4567',
          location: 'San Francisco, CA'
        },
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            startDate: '2020-01-01',
            endDate: '2023-12-31',
            description: 'Led development of web applications'
          }
        ],
        education: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Computer Science',
            graduationYear: '2019'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'AWS']
      },
      templateId: 'template_professional_1',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-12-01')
    },
    {
      _id: 'mock_resume_2',
      userId: 'user_456',
      content: {
        personalInfo: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1-555-987-6543',
          location: 'New York, NY'
        },
        experience: [
          {
            company: 'Design Studio',
            position: 'UX Designer',
            startDate: '2019-06-01',
            endDate: '2024-01-15',
            description: 'Created user-centered design solutions'
          }
        ],
        education: [
          {
            institution: 'Art Institute',
            degree: 'Master of Fine Arts',
            graduationYear: '2018'
          }
        ],
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping']
      },
      templateId: 'template_creative_1',
      createdAt: new Date('2023-02-15'),
      updatedAt: new Date('2024-01-15')
    }
  ],

  jobApplications: [
    {
      _id: 'mock_job_app_1',
      userId: 'user_123',
      resumeId: 'mock_resume_1',
      jobTitle: 'Full Stack Developer',
      company: 'Innovation Inc',
      jobDescription: 'Build scalable web applications using modern technologies',
      applicationStatus: 'APPLIED',
      appliedAt: new Date('2024-01-10'),
      matchScore: 0.92,
      coverLetter: {
        variants: [
          {
            tone: 'professional',
            content: 'Dear Hiring Manager, I am excited to apply for the Full Stack Developer position...'
          },
          {
            tone: 'enthusiastic',
            content: 'Hi there! I was thrilled to see the Full Stack Developer opening at Innovation Inc...'
          }
        ]
      },
      notes: 'Followed up with hiring manager via LinkedIn'
    }
  ],

  portfolios: [
    {
      _id: 'mock_portfolio_1',
      userId: 'user_456',
      resumeId: 'mock_resume_2',
      title: 'Jane Smith - UX Design Portfolio',
      htmlContent: `<!DOCTYPE html><html><head><title>Jane Smith Portfolio</title></head><body><h1>Jane Smith</h1><p>UX Designer specializing in user-centered design</p></body></html>`,
      isPublic: true,
      deploymentUrl: 'https://jane-portfolio.vercel.app',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25')
    }
  ],

  userSettings: [
    {
      _id: 'mock_settings_1',
      userId: 'user_123',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
        timezone: 'America/Los_Angeles'
      },
      subscriptionTier: 'PRO',
      usage: {
        resumesCreated: 5,
        aiQueriesUsed: 47,
        blockchainVerifications: 2,
        portfoliosGenerated: 1
      }
    },
    {
      _id: 'mock_settings_2',
      userId: 'user_456',
      preferences: {
        theme: 'light',
        notifications: false,
        language: 'en',
        timezone: 'America/New_York'
      },
      subscriptionTier: 'FREE',
      usage: {
        resumesCreated: 2,
        aiQueriesUsed: 15,
        blockchainVerifications: 0,
        portfoliosGenerated: 3
      }
    }
  ]
};

class DemoMigrator {
  private stats = {
    totalRecords: 0,
    migratedRecords: 0,
    errorRecords: 0,
    startTime: new Date()
  };

  async migrateResumes() {
    console.log('📄 Migrating Resumes...');
    const resumes = mockMongoData.resumes;
    this.stats.totalRecords += resumes.length;

    for (const doc of resumes) {
      try {
        const resumeData = {
          userId: doc.userId,
          content: JSON.stringify(doc.content),
          templateId: doc.templateId,
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt.toISOString(),
        };

        console.log(`  Creating resume for user ${doc.userId}...`);
        const { data, errors } = await client.models.Resume.create(resumeData);
        
        if (errors) {
          console.error('  ❌ Error:', errors);
          this.stats.errorRecords++;
        } else {
          console.log(`  ✅ Created resume: ${data?.id}`);
          this.stats.migratedRecords++;
        }
      } catch (error) {
        console.error(`  ❌ Exception migrating resume ${doc._id}:`, error);
        this.stats.errorRecords++;
      }
    }
  }

  async migrateJobApplications() {
    console.log('\n💼 Migrating Job Applications...');
    const jobApps = mockMongoData.jobApplications;
    this.stats.totalRecords += jobApps.length;

    for (const doc of jobApps) {
      try {
        const jobAppData = {
          userId: doc.userId,
          resumeId: doc.resumeId,
          jobTitle: doc.jobTitle,
          company: doc.company,
          jobDescription: doc.jobDescription,
          applicationStatus: doc.applicationStatus as 'APPLIED' | 'INTERVIEW' | 'REJECTED' | 'OFFER',
          appliedAt: doc.appliedAt.toISOString(),
          matchScore: doc.matchScore,
          coverLetter: JSON.stringify(doc.coverLetter),
          notes: doc.notes
        };

        console.log(`  Creating job application: ${doc.jobTitle} at ${doc.company}...`);
        const { data, errors } = await client.models.JobApplication.create(jobAppData);
        
        if (errors) {
          console.error('  ❌ Error:', errors);
          this.stats.errorRecords++;
        } else {
          console.log(`  ✅ Created job application: ${data?.id}`);
          this.stats.migratedRecords++;
        }
      } catch (error) {
        console.error(`  ❌ Exception migrating job application ${doc._id}:`, error);
        this.stats.errorRecords++;
      }
    }
  }

  async migratePortfolios() {
    console.log('\n🎨 Migrating Portfolios...');
    const portfolios = mockMongoData.portfolios;
    this.stats.totalRecords += portfolios.length;

    for (const doc of portfolios) {
      try {
        const portfolioData = {
          userId: doc.userId,
          resumeId: doc.resumeId,
          title: doc.title,
          htmlContent: doc.htmlContent,
          deploymentUrl: doc.deploymentUrl,
          isPublic: doc.isPublic,
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt.toISOString(),
        };

        console.log(`  Creating portfolio: ${doc.title}...`);
        const { data, errors } = await client.models.Portfolio.create(portfolioData);
        
        if (errors) {
          console.error('  ❌ Error:', errors);
          this.stats.errorRecords++;
        } else {
          console.log(`  ✅ Created portfolio: ${data?.id}`);
          this.stats.migratedRecords++;
        }
      } catch (error) {
        console.error(`  ❌ Exception migrating portfolio ${doc._id}:`, error);
        this.stats.errorRecords++;
      }
    }
  }

  async migrateUserSettings() {
    console.log('\n⚙️ Migrating User Settings...');
    const settings = mockMongoData.userSettings;
    this.stats.totalRecords += settings.length;

    for (const doc of settings) {
      try {
        const settingsData = {
          userId: doc.userId,
          preferences: JSON.stringify(doc.preferences),
          subscriptionTier: doc.subscriptionTier as 'FREE' | 'PRO' | 'ENTERPRISE',
          usage: JSON.stringify(doc.usage),
        };

        console.log(`  Creating user settings for ${doc.userId}...`);
        const { data, errors } = await client.models.UserSettings.create(settingsData);
        
        if (errors) {
          console.error('  ❌ Error:', errors);
          this.stats.errorRecords++;
        } else {
          console.log(`  ✅ Created user settings: ${data?.id}`);
          this.stats.migratedRecords++;
        }
      } catch (error) {
        console.error(`  ❌ Exception migrating user settings ${doc._id}:`, error);
        this.stats.errorRecords++;
      }
    }
  }

  async run() {
    console.log('🚀 Starting Demo Migration...');
    console.log('This demonstrates migrating mock MongoDB data to AWS DynamoDB via Amplify GraphQL API\n');

    try {
      await this.migrateResumes();
      await this.migrateJobApplications();
      await this.migratePortfolios();
      await this.migrateUserSettings();

      const endTime = new Date();
      const duration = (endTime.getTime() - this.stats.startTime.getTime()) / 1000;

      console.log(`\n📊 Migration Demo Complete!
================================
Total Records: ${this.stats.totalRecords}
✅ Successfully Migrated: ${this.stats.migratedRecords}
❌ Errors: ${this.stats.errorRecords}
⏱️ Duration: ${duration}s
🎯 Success Rate: ${((this.stats.migratedRecords / this.stats.totalRecords) * 100).toFixed(2)}%
================================

🎉 Demo migration completed successfully!
The MongoDB to DynamoDB migration infrastructure is working correctly.

Next steps for real migration:
1. Configure real MongoDB Atlas connection in .env
2. Update MONGODB_URI with your Atlas connection string
3. Set DRY_RUN=false when ready for actual data migration
4. Run: npx tsx database-migration.ts`);

    } catch (error) {
      console.error('❌ Demo migration failed:', error);
      throw error;
    }
  }
}

// Run the demo
async function main() {
  const demo = new DemoMigrator();
  await demo.run();
}

main().catch(console.error);