#!/usr/bin/env node

/**
 * Database Migration Utility: MongoDB Atlas to AWS DynamoDB
 * 
 * This script helps migrate data from MongoDB Atlas to AWS DynamoDB
 * through the Amplify GraphQL API.
 */

import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import { MongoClient } from 'mongodb';
import type { Schema } from './amplify-schema.js';
import amplifyOutputs from '../amplify_outputs.json';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Amplify with current outputs
Amplify.configure(amplifyOutputs);
const client = generateClient<Schema>({
  authMode: 'apiKey',
});

interface MigrationConfig {
  mongoUri: string;
  dbName: string;
  batchSize: number;
  dryRun: boolean;
}

interface MigrationStats {
  totalRecords: number;
  migratedRecords: number;
  errorRecords: number;
  skippedRecords: number;
  startTime: Date;
  endTime?: Date;
}

class DatabaseMigrator {
  private config: MigrationConfig;
  private mongoClient: MongoClient;
  private stats: MigrationStats;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.mongoClient = new MongoClient(config.mongoUri);
    this.stats = {
      totalRecords: 0,
      migratedRecords: 0,
      errorRecords: 0,
      skippedRecords: 0,
      startTime: new Date(),
    };
  }

  async connect() {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await this.mongoClient.connect();
    console.log('✅ Connected to MongoDB Atlas');
  }

  async disconnect() {
    await this.mongoClient.close();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }

  async migrateResumes() {
    console.log('\n📄 Migrating Resumes...');
    const db = this.mongoClient.db(this.config.dbName);
    const collection = db.collection('resumes');
    
    const cursor = collection.find({});
    const totalCount = await collection.countDocuments();
    this.stats.totalRecords += totalCount;
    
    console.log(`Found ${totalCount} resume records to migrate`);
    
    const batch = [];
    let processed = 0;

    for await (const doc of cursor) {
      batch.push(doc);
      
      if (batch.length >= this.config.batchSize) {
        await this.processBatch('resume', batch);
        processed += batch.length;
        console.log(`Processed ${processed}/${totalCount} resumes`);
        batch.length = 0;
      }
    }

    // Process remaining records
    if (batch.length > 0) {
      await this.processBatch('resume', batch);
      processed += batch.length;
      console.log(`Processed ${processed}/${totalCount} resumes`);
    }
  }

  async migrateJobApplications() {
    console.log('\n💼 Migrating Job Applications...');
    const db = this.mongoClient.db(this.config.dbName);
    const collection = db.collection('jobApplications');
    
    const cursor = collection.find({});
    const totalCount = await collection.countDocuments();
    this.stats.totalRecords += totalCount;
    
    console.log(`Found ${totalCount} job application records to migrate`);
    
    const batch = [];
    let processed = 0;

    for await (const doc of cursor) {
      batch.push(doc);
      
      if (batch.length >= this.config.batchSize) {
        await this.processBatch('jobApplication', batch);
        processed += batch.length;
        console.log(`Processed ${processed}/${totalCount} job applications`);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await this.processBatch('jobApplication', batch);
      processed += batch.length;
    }
  }

  async migratePortfolios() {
    console.log('\n🎨 Migrating Portfolios...');
    const db = this.mongoClient.db(this.config.dbName);
    const collection = db.collection('portfolios');
    
    const cursor = collection.find({});
    const totalCount = await collection.countDocuments();
    this.stats.totalRecords += totalCount;
    
    console.log(`Found ${totalCount} portfolio records to migrate`);
    
    const batch = [];
    let processed = 0;

    for await (const doc of cursor) {
      batch.push(doc);
      
      if (batch.length >= this.config.batchSize) {
        await this.processBatch('portfolio', batch);
        processed += batch.length;
        console.log(`Processed ${processed}/${totalCount} portfolios`);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await this.processBatch('portfolio', batch);
      processed += batch.length;
    }
  }

  async migrateUserSettings() {
    console.log('\n⚙️ Migrating User Settings...');
    const db = this.mongoClient.db(this.config.dbName);
    const collection = db.collection('userSettings');
    
    const cursor = collection.find({});
    const totalCount = await collection.countDocuments();
    this.stats.totalRecords += totalCount;
    
    console.log(`Found ${totalCount} user settings records to migrate`);
    
    const batch = [];
    let processed = 0;

    for await (const doc of cursor) {
      batch.push(doc);
      
      if (batch.length >= this.config.batchSize) {
        await this.processBatch('userSettings', batch);
        processed += batch.length;
        console.log(`Processed ${processed}/${totalCount} user settings`);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await this.processBatch('userSettings', batch);
      processed += batch.length;
    }
  }

  private async processBatch(type: string, batch: any[]) {
    for (const doc of batch) {
      try {
        if (this.config.dryRun) {
          console.log(`[DRY RUN] Would migrate ${type}:`, doc._id);
          this.stats.migratedRecords++;
          continue;
        }

        switch (type) {
          case 'resume':
            await this.migrateResumeRecord(doc);
            break;
          case 'jobApplication':
            await this.migrateJobApplicationRecord(doc);
            break;
          case 'portfolio':
            await this.migratePortfolioRecord(doc);
            break;
          case 'userSettings':
            await this.migrateUserSettingsRecord(doc);
            break;
        }

        this.stats.migratedRecords++;
      } catch (error) {
        console.error(`❌ Error migrating ${type} record ${doc._id}:`, error);
        this.stats.errorRecords++;
      }
    }
  }

  private async migrateResumeRecord(doc: any) {
    const resumeData = {
      userId: doc.userId || doc.user_id || 'unknown',
      content: JSON.stringify(doc.content || doc),
      templateId: doc.templateId,
      pdfUrl: doc.pdfUrl,
      blockchainHash: doc.blockchainHash,
      verifiedAt: doc.verifiedAt ? new Date(doc.verifiedAt).toISOString() : undefined,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    };

    const { data } = await client.models.Resume.create(resumeData);
    return data;
  }

  private async migrateJobApplicationRecord(doc: any) {
    const jobAppData = {
      userId: doc.userId || doc.user_id || 'unknown',
      resumeId: doc.resumeId || doc.resume_id,
      jobTitle: doc.jobTitle || doc.job_title,
      company: doc.company,
      jobDescription: doc.jobDescription || doc.job_description,
      applicationStatus: doc.applicationStatus || doc.application_status || 'APPLIED',
      appliedAt: doc.appliedAt ? new Date(doc.appliedAt).toISOString() : undefined,
      notes: doc.notes,
      matchScore: doc.matchScore || doc.match_score,
      coverLetter: doc.coverLetter || doc.cover_letter ? JSON.stringify(doc.coverLetter || doc.cover_letter) : undefined,
    };

    const { data } = await client.models.JobApplication.create(jobAppData);
    return data;
  }

  private async migratePortfolioRecord(doc: any) {
    const portfolioData = {
      userId: doc.userId || doc.user_id || 'unknown',
      resumeId: doc.resumeId || doc.resume_id,
      title: doc.title,
      htmlContent: doc.htmlContent || doc.html_content || '',
      deploymentUrl: doc.deploymentUrl || doc.deployment_url,
      isPublic: doc.isPublic ?? doc.is_public ?? false,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    };

    const { data } = await client.models.Portfolio.create(portfolioData);
    return data;
  }

  private async migrateUserSettingsRecord(doc: any) {
    const settingsData = {
      userId: doc.userId || doc.user_id || 'unknown',
      preferences: JSON.stringify(doc.preferences || {}),
      subscriptionTier: doc.subscriptionTier || doc.subscription_tier || 'FREE',
      usage: JSON.stringify(doc.usage || {}),
    };

    const { data } = await client.models.UserSettings.create(settingsData);
    return data;
  }

  async run() {
    console.log('🚀 Starting database migration...');
    console.log(`Configuration:
- MongoDB URI: ${this.config.mongoUri.replace(/\/\/.*@/, '//***@')}
- Database: ${this.config.dbName}
- Batch Size: ${this.config.batchSize}
- Dry Run: ${this.config.dryRun ? 'Yes' : 'No'}
    `);

    try {
      await this.connect();
      
      await this.migrateResumes();
      await this.migrateJobApplications();
      await this.migratePortfolios();
      await this.migrateUserSettings();
      
      this.stats.endTime = new Date();
      this.printStats();
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  private printStats() {
    const duration = this.stats.endTime 
      ? (this.stats.endTime.getTime() - this.stats.startTime.getTime()) / 1000 
      : 0;

    console.log(`
📊 Migration Statistics:
================================
Total Records: ${this.stats.totalRecords}
✅ Migrated: ${this.stats.migratedRecords}
❌ Errors: ${this.stats.errorRecords}
⏭️ Skipped: ${this.stats.skippedRecords}
⏱️ Duration: ${duration}s
🎯 Success Rate: ${((this.stats.migratedRecords / this.stats.totalRecords) * 100).toFixed(2)}%
================================
    `);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const config: MigrationConfig = {
    mongoUri: process.env.MONGODB_URI || args[0] || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || args[1] || 'jobLander',
    batchSize: parseInt(process.env.BATCH_SIZE || args[2] || '10'),
    dryRun: process.env.DRY_RUN === 'true' || args.includes('--dry-run'),
  };

  const migrator = new DatabaseMigrator(config);
  await migrator.run();
}

// Export for use as module
export { DatabaseMigrator, type MigrationConfig, type MigrationStats };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}
