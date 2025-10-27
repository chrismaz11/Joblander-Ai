#!/usr/bin/env node

/**
 * User Migration Script: MongoDB to Amazon Cognito
 * 
 * This script migrates existing user accounts from MongoDB to Amazon Cognito,
 * handling password migration, user attributes, and social login mapping.
 */

import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand, AdminUpdateUserAttributesCommand, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { MongoClient } from 'mongodb';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface MigrationConfig {
  mongoUri: string;
  dbName: string;
  userPoolId: string;
  batchSize: number;
  dryRun: boolean;
}

interface MongoUser {
  _id: string;
  email: string;
  password?: string; // Hashed password
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  socialLogins?: {
    google?: { id: string; email: string; };
    amazon?: { id: string; email: string; };
  };
  subscription?: {
    tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  };
  profile?: {
    jobTitle?: string;
    company?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  createdAt: Date;
  lastLoginAt?: Date;
}

interface MigrationStats {
  totalUsers: number;
  migratedUsers: number;
  skippedUsers: number;
  errorUsers: number;
  socialAccountsLinked: number;
  errors: Array<{ email: string; error: string; }>;
}

class UserMigrator {
  private config: MigrationConfig;
  private mongoClient: MongoClient;
  private cognitoClient: CognitoIdentityProviderClient;
  private stats: MigrationStats;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.mongoClient = new MongoClient(config.mongoUri);
    this.cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
    this.stats = {
      totalUsers: 0,
      migratedUsers: 0,
      skippedUsers: 0,
      errorUsers: 0,
      socialAccountsLinked: 0,
      errors: [],
    };
  }

  async connect() {
    console.log('🔗 Connecting to MongoDB...');
    await this.mongoClient.connect();
    console.log('✅ Connected to MongoDB');
  }

  async disconnect() {
    await this.mongoClient.close();
    console.log('🔌 Disconnected from MongoDB');
  }

  async migrateUsers() {
    console.log('👥 Starting user migration...');
    
    const db = this.mongoClient.db(this.config.dbName);
    const usersCollection = db.collection('users');
    
    const totalCount = await usersCollection.countDocuments();
    this.stats.totalUsers = totalCount;
    
    console.log(`Found ${totalCount} users to migrate`);
    
    const cursor = usersCollection.find({});
    const batch = [];
    let processed = 0;

    for await (const user of cursor) {
      batch.push(user as MongoUser);
      
      if (batch.length >= this.config.batchSize) {
        await this.processBatch(batch);
        processed += batch.length;
        console.log(`Processed ${processed}/${totalCount} users`);
        batch.length = 0;
      }
    }

    // Process remaining users
    if (batch.length > 0) {
      await this.processBatch(batch);
      processed += batch.length;
      console.log(`Processed ${processed}/${totalCount} users`);
    }
  }

  private async processBatch(users: MongoUser[]) {
    for (const user of users) {
      try {
        if (this.config.dryRun) {
          console.log(`[DRY RUN] Would migrate user: ${user.email}`);
          this.stats.migratedUsers++;
          continue;
        }

        await this.migrateUser(user);
        this.stats.migratedUsers++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error);
        this.stats.errorUsers++;
        this.stats.errors.push({
          email: user.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  private async migrateUser(user: MongoUser) {
    // Check if user already exists in Cognito
    const existingUser = await this.checkUserExists(user.email);
    if (existingUser) {
      console.log(`⏭️ User ${user.email} already exists in Cognito, skipping`);
      this.stats.skippedUsers++;
      return;
    }

    // Create user in Cognito
    const cognitoUser = await this.createCognitoUser(user);
    console.log(`✅ Created Cognito user: ${user.email}`);

    // Set password if available (for users with traditional login)
    if (user.password) {
      await this.setUserPassword(user.email, user.password);
      console.log(`🔐 Set password for user: ${user.email}`);
    }

    // Update user attributes
    await this.updateUserAttributes(user);
    console.log(`📝 Updated attributes for user: ${user.email}`);

    // Handle social logins
    if (user.socialLogins) {
      await this.linkSocialAccounts(user);
      this.stats.socialAccountsLinked++;
    }
  }

  private async checkUserExists(email: string): Promise<boolean> {
    try {
      await this.cognitoClient.send(new AdminGetUserCommand({
        UserPoolId: this.config.userPoolId,
        Username: email,
      }));
      return true;
    } catch (error: any) {
      if (error.name === 'UserNotFoundException') {
        return false;
      }
      throw error;
    }
  }

  private async createCognitoUser(user: MongoUser) {
    const userAttributes = [
      { Name: 'email', Value: user.email },
      { Name: 'email_verified', Value: user.isEmailVerified ? 'true' : 'false' },
    ];

    // Add optional attributes
    if (user.firstName) {
      userAttributes.push({ Name: 'given_name', Value: user.firstName });
    }
    if (user.lastName) {
      userAttributes.push({ Name: 'family_name', Value: user.lastName });
    }
    if (user.phoneNumber) {
      userAttributes.push({ Name: 'phone_number', Value: user.phoneNumber });
    }
    if (user.profilePicture) {
      userAttributes.push({ Name: 'picture', Value: user.profilePicture });
    }

    // Add custom attributes
    if (user.subscription?.tier) {
      userAttributes.push({ Name: 'custom:subscription_tier', Value: user.subscription.tier });
    }
    if (user.profile?.jobTitle) {
      userAttributes.push({ Name: 'custom:job_title', Value: user.profile.jobTitle });
    }
    if (user.profile?.company) {
      userAttributes.push({ Name: 'custom:company', Value: user.profile.company });
    }
    if (user.profile?.linkedinUrl) {
      userAttributes.push({ Name: 'custom:linkedin_url', Value: user.profile.linkedinUrl });
    }
    if (user.profile?.githubUrl) {
      userAttributes.push({ Name: 'custom:github_url', Value: user.profile.githubUrl });
    }

    const command = new AdminCreateUserCommand({
      UserPoolId: this.config.userPoolId,
      Username: user.email,
      UserAttributes: userAttributes,
      MessageAction: 'SUPPRESS', // Don't send welcome email during migration
      TemporaryPassword: this.generateTemporaryPassword(),
    });

    return await this.cognitoClient.send(command);
  }

  private async setUserPassword(email: string, hashedPassword: string) {
    // For security, we can't directly migrate hashed passwords
    // Instead, we'll set a temporary password and require users to reset
    // Alternatively, implement a password migration Lambda trigger
    
    const temporaryPassword = this.generateTemporaryPassword();
    
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.config.userPoolId,
      Username: email,
      Password: temporaryPassword,
      Permanent: false, // Force password change on first login
    });

    await this.cognitoClient.send(command);
  }

  private async updateUserAttributes(user: MongoUser) {
    const attributes = [];

    // Update any additional attributes that weren't set during creation
    if (user.lastLoginAt) {
      // Store last login as a custom attribute (Cognito doesn't have a built-in field)
      attributes.push({
        Name: 'custom:last_login',
        Value: user.lastLoginAt.toISOString(),
      });
    }

    if (attributes.length > 0) {
      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: this.config.userPoolId,
        Username: user.email,
        UserAttributes: attributes,
      });

      await this.cognitoClient.send(command);
    }
  }

  private async linkSocialAccounts(user: MongoUser) {
    // Note: Social account linking in Cognito requires special handling
    // This would typically be done through the Cognito Identity Provider
    // For now, we'll log the social accounts that need to be linked manually
    
    if (user.socialLogins?.google) {
      console.log(`🔗 Google account needs linking for ${user.email}: ${user.socialLogins.google.id}`);
    }
    
    if (user.socialLogins?.amazon) {
      console.log(`🔗 Amazon account needs linking for ${user.email}: ${user.socialLogins.amazon.id}`);
    }
  }

  private generateTemporaryPassword(): string {
    // Generate a secure temporary password that meets Cognito requirements
    const length = 12;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure password has at least one of each required character type
    password += 'A'; // uppercase
    password += 'a'; // lowercase  
    password += '1'; // number
    password += '!'; // symbol
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  async run() {
    console.log('🚀 Starting User Migration to Cognito...');
    console.log(`Configuration:
- MongoDB URI: ${this.config.mongoUri.replace(/\/\/.*@/, '//***@')}
- Database: ${this.config.dbName}
- User Pool ID: ${this.config.userPoolId}
- Batch Size: ${this.config.batchSize}
- Dry Run: ${this.config.dryRun ? 'Yes' : 'No'}
    `);

    const startTime = Date.now();

    try {
      await this.connect();
      await this.migrateUsers();
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      this.printResults(duration);
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  private printResults(duration: number) {
    console.log(`
📊 User Migration Results:
============================
Total Users: ${this.stats.totalUsers}
✅ Migrated: ${this.stats.migratedUsers}
⏭️ Skipped: ${this.stats.skippedUsers}
❌ Errors: ${this.stats.errorUsers}
🔗 Social Accounts: ${this.stats.socialAccountsLinked}
⏱️ Duration: ${duration}s
🎯 Success Rate: ${((this.stats.migratedUsers / this.stats.totalUsers) * 100).toFixed(2)}%
============================
    `);

    if (this.stats.errors.length > 0) {
      console.log('🚨 Migration Errors:');
      this.stats.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.email}: ${error.error}`);
      });
    }

    if (!this.config.dryRun && this.stats.migratedUsers > 0) {
      console.log(`
📧 Post-Migration Steps:
1. Users will need to reset their passwords on first login
2. Social account linking may need to be done manually
3. Send welcome emails to migrated users (optional)
4. Update any hardcoded user IDs in the application
5. Test login flow with migrated users
      `);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  const config: MigrationConfig = {
    mongoUri: process.env.MONGODB_URI || args[0] || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || args[1] || 'jobLander',
    userPoolId: process.env.COGNITO_USER_POOL_ID || args[2] || '',
    batchSize: parseInt(process.env.BATCH_SIZE || args[3] || '10'),
    dryRun: process.env.DRY_RUN === 'true' || args.includes('--dry-run'),
  };

  if (!config.userPoolId) {
    console.error('❌ Error: COGNITO_USER_POOL_ID is required');
    console.log('Usage: npx tsx user-migration.ts [mongoUri] [dbName] [userPoolId] [batchSize] [--dry-run]');
    console.log('Or set environment variables: MONGODB_URI, DB_NAME, COGNITO_USER_POOL_ID, BATCH_SIZE, DRY_RUN');
    process.exit(1);
  }

  const migrator = new UserMigrator(config);
  await migrator.run();
}

// Export for use as module
export { UserMigrator, type MigrationConfig };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('User migration failed:', error);
    process.exit(1);
  });
}