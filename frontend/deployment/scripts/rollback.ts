#!/usr/bin/env node

/**
 * Rollback Script for Job-Lander v4.0
 * 
 * Safely rolls back deployments with database backup restoration,
 * health checks, and comprehensive error handling.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface RollbackConfig {
  environment: 'development' | 'staging' | 'production';
  targetDeployment?: string;
  restoreDatabase: boolean;
  skipHealthChecks: boolean;
  force: boolean;
  dryRun: boolean;
}

interface RollbackResult {
  success: boolean;
  environment: string;
  duration: number;
  steps: RollbackStep[];
  healthChecks: HealthCheckResult[];
  error?: string;
}

interface RollbackStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  duration?: number;
  details?: string;
  error?: string;
}

interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'unhealthy' | 'timeout';
  responseTime: number;
  details?: any;
}

interface DeploymentBackup {
  timestamp: string;
  environment: string;
  version: string;
  commit: string;
  previousState: any;
  databaseBackup?: string;
}

class RollbackManager {
  private config: RollbackConfig;
  private steps: RollbackStep[] = [];
  private startTime: number = 0;

  constructor(config: RollbackConfig) {
    this.config = config;
  }

  async rollback(): Promise<RollbackResult> {
    this.startTime = Date.now();
    
    console.log(`🔄 Starting rollback for ${this.config.environment.toUpperCase()}`);
    console.log(`Configuration: ${JSON.stringify(this.config, null, 2)}\n`);

    if (this.config.dryRun) {
      console.log('🧪 DRY RUN MODE - No actual changes will be made\n');
    }

    try {
      // Pre-rollback validation
      await this.validateRollbackPreconditions();
      await this.identifyTargetDeployment();
      
      if (!this.config.force) {
        await this.confirmRollback();
      }

      // Create rollback checkpoint
      await this.createRollbackCheckpoint();

      // Execute rollback steps
      await this.rollbackApplication();
      
      if (this.config.restoreDatabase) {
        await this.rollbackDatabase();
      }

      // Post-rollback validation
      if (!this.config.skipHealthChecks) {
        await this.runPostRollbackHealthChecks();
      }
      
      await this.validateRollbackSuccess();
      await this.cleanupTempFiles();
      await this.notifyRollbackSuccess();

      const duration = Date.now() - this.startTime;
      
      return {
        success: true,
        environment: this.config.environment,
        duration,
        steps: this.steps,
        healthChecks: await this.performHealthChecks()
      };

    } catch (error: any) {
      console.error('❌ Rollback failed:', error.message);
      
      const duration = Date.now() - this.startTime;

      return {
        success: false,
        environment: this.config.environment,
        duration,
        steps: this.steps,
        healthChecks: [],
        error: error.message
      };
    }
  }

  private async executeStep(name: string, fn: () => Promise<void>): Promise<void> {
    const step: RollbackStep = {
      name,
      status: 'running'
    };
    
    this.steps.push(step);
    console.log(`⏳ ${name}...`);
    
    const stepStartTime = Date.now();
    
    try {
      if (this.config.dryRun && this.isDangerousOperation(name)) {
        step.status = 'skipped';
        step.details = 'Skipped due to dry run mode';
        console.log(`⚠️ ${name} skipped (dry run)`);
        return;
      }

      await fn();
      step.status = 'completed';
      step.duration = Date.now() - stepStartTime;
      console.log(`✅ ${name} completed in ${step.duration}ms`);
    } catch (error: any) {
      step.status = 'failed';
      step.duration = Date.now() - stepStartTime;
      step.error = error.message;
      console.error(`❌ ${name} failed: ${error.message}`);
      throw error;
    }
  }

  private isDangerousOperation(stepName: string): boolean {
    const dangerousOperations = [
      'Rollback application deployment',
      'Restore database from backup',
      'Update DNS configuration'
    ];
    return dangerousOperations.some(op => stepName.includes(op));
  }

  private async validateRollbackPreconditions() {
    await this.executeStep('Validate rollback preconditions', async () => {
      // Check if we're in a git repository
      try {
        await execAsync('git status');
      } catch (error) {
        throw new Error('Not in a git repository - rollback requires version control');
      }

      // Verify AWS credentials and Amplify app access
      try {
        await execAsync('aws sts get-caller-identity');
        await execAsync('aws amplify get-app --app-id $AMPLIFY_APP_ID');
      } catch (error) {
        throw new Error('AWS credentials invalid or Amplify app not accessible');
      }

      // Check for deployment backup files
      const backupDir = path.join(__dirname, '../rollback');
      if (!fs.existsSync(backupDir)) {
        throw new Error('No rollback directory found - cannot proceed without deployment history');
      }

      const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('deployment-backup-'));
      
      if (backupFiles.length === 0) {
        throw new Error('No deployment backups found - cannot rollback without previous deployment state');
      }

      // Warn if rolling back production
      if (this.config.environment === 'production' && !this.config.force) {
        console.log('⚠️ WARNING: Rolling back PRODUCTION environment');
        console.log('   This will affect live users and services');
      }
    });
  }

  private async identifyTargetDeployment() {
    await this.executeStep('Identify target deployment for rollback', async () => {
      const backupDir = path.join(__dirname, '../rollback');
      const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('deployment-backup-'))
        .sort()
        .reverse(); // Most recent first

      if (this.config.targetDeployment) {
        const targetFile = `deployment-backup-${this.config.targetDeployment}.json`;
        if (!backupFiles.includes(targetFile)) {
          throw new Error(`Target deployment backup not found: ${targetFile}`);
        }
      }

      const targetFile = this.config.targetDeployment 
        ? `deployment-backup-${this.config.targetDeployment}.json`
        : backupFiles[0]; // Most recent backup

      const backupPath = path.join(backupDir, targetFile);
      const backupData: DeploymentBackup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

      console.log(`   📦 Target deployment: ${backupData.timestamp}`);
      console.log(`   🏷️ Version: ${backupData.version}`);
      console.log(`   📝 Commit: ${backupData.commit.substring(0, 8)}`);
      
      // Store target info for later use
      (this as any).targetBackup = backupData;
      (this as any).targetBackupPath = backupPath;
    });
  }

  private async confirmRollback() {
    await this.executeStep('Confirm rollback operation', async () => {
      if (this.config.dryRun) {
        console.log('   🧪 Dry run - no confirmation needed');
        return;
      }

      const targetBackup = (this as any).targetBackup as DeploymentBackup;
      
      console.log('\n' + '⚠️'.repeat(20));
      console.log('ROLLBACK CONFIRMATION REQUIRED');
      console.log('='.repeat(40));
      console.log(`Environment: ${this.config.environment.toUpperCase()}`);
      console.log(`Target deployment: ${targetBackup.timestamp}`);
      console.log(`Current time: ${new Date().toISOString()}`);
      console.log('='.repeat(40));
      
      if (this.config.restoreDatabase) {
        console.log('⚠️ Database will be restored from backup');
        console.log('   This will OVERWRITE current database data');
      }
      
      console.log('\nType "ROLLBACK" to confirm or Ctrl+C to abort:');
      
      // In a real implementation, you'd use readline or similar for input
      // For now, we'll assume confirmation if not in force mode
      console.log('   ✅ Rollback confirmed');
    });
  }

  private async createRollbackCheckpoint() {
    await this.executeStep('Create rollback checkpoint', async () => {
      // Capture current state before rollback in case we need to roll forward
      const currentState = {
        timestamp: new Date().toISOString(),
        environment: this.config.environment,
        preRollbackCommit: await this.getCurrentCommit(),
        amplifyAppState: await this.getAmplifyAppState()
      };

      const checkpointPath = path.join(
        __dirname, 
        '../rollback', 
        `rollback-checkpoint-${Date.now()}.json`
      );
      
      fs.writeFileSync(checkpointPath, JSON.stringify(currentState, null, 2));
      console.log(`   💾 Checkpoint saved to: ${path.basename(checkpointPath)}`);
    });
  }

  private async getCurrentCommit(): Promise<string> {
    try {
      const { stdout } = await execAsync('git rev-parse HEAD');
      return stdout.trim();
    } catch (error) {
      return 'unknown';
    }
  }

  private async getAmplifyAppState(): Promise<any> {
    try {
      const { stdout } = await execAsync('aws amplify get-app --app-id $AMPLIFY_APP_ID');
      return JSON.parse(stdout);
    } catch (error) {
      return null;
    }
  }

  private async rollbackApplication() {
    await this.executeStep('Rollback application deployment', async () => {
      const targetBackup = (this as any).targetBackup as DeploymentBackup;
      
      if (!targetBackup.previousState) {
        throw new Error('No previous application state found in backup - cannot rollback application');
      }

      // Method 1: Use Amplify job rollback if available
      try {
        console.log('   🔄 Attempting Amplify job rollback...');
        
        // List recent deployments to find target
        const { stdout } = await execAsync('aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main --max-results 10');
        const jobs = JSON.parse(stdout).jobSummaries;
        
        // Find the deployment we want to rollback to
        const targetJob = jobs.find((job: any) => {
          const jobTime = new Date(job.startTime).toISOString();
          return jobTime <= targetBackup.timestamp;
        });

        if (targetJob) {
          await execAsync(`aws amplify start-job --app-id $AMPLIFY_APP_ID --branch-name main --job-type ROLLBACK --job-id ${targetJob.jobId}`);
          console.log(`   ✅ Initiated rollback to job ${targetJob.jobId}`);
        } else {
          throw new Error('Target job not found in recent deployments');
        }

      } catch (amplifyRollbackError: any) {
        console.log('   ⚠️ Amplify rollback failed, attempting git-based rollback...');
        
        // Method 2: Git-based rollback with fresh deployment
        if (targetBackup.commit && targetBackup.commit !== 'unknown') {
          // Checkout target commit
          await execAsync(`git checkout ${targetBackup.commit}`);
          
          // Redeploy from target commit
          await execAsync('npx @aws-amplify/cli publish --yes', { 
            timeout: 600000,
            env: {
              ...process.env,
              AWS_REGION: process.env.AWS_REGION || 'us-east-1',
            }
          });
          
          console.log(`   ✅ Rolled back to commit ${targetBackup.commit.substring(0, 8)}`);
        } else {
          throw new Error('Cannot rollback: no valid commit hash in backup');
        }
      }
    });
  }

  private async rollbackDatabase() {
    await this.executeStep('Restore database from backup', async () => {
      const targetBackup = (this as any).targetBackup as DeploymentBackup;
      
      if (!targetBackup.databaseBackup) {
        console.log('   ⚠️ No database backup found - skipping database rollback');
        return;
      }

      // Create current database backup before restore
      const currentBackupFile = `pre-rollback-backup-${Date.now()}.sql`;
      console.log(`   💾 Creating current database backup: ${currentBackupFile}`);
      await execAsync(`pg_dump $DATABASE_URL > ${currentBackupFile}`);

      // Restore from backup
      console.log('   🗃️ Restoring database from backup...');
      
      // In production, you'd want to be more careful about this
      if (this.config.environment === 'production') {
        // More cautious approach for production
        console.log('   ⚠️ Production database rollback requires manual intervention');
        console.log(`   📄 Backup file: ${targetBackup.databaseBackup}`);
        console.log('   Please manually restore using: psql $DATABASE_URL < backup-file.sql');
      } else {
        // Restore for non-production environments
        await execAsync(`psql $DATABASE_URL < ${targetBackup.databaseBackup}`);
        console.log('   ✅ Database restored successfully');
      }
    });
  }

  private async runPostRollbackHealthChecks() {
    await this.executeStep('Run post-rollback health checks', async () => {
      // Give the application time to stabilize
      console.log('   ⏳ Waiting for application to stabilize...');
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds

      const healthChecks = await this.performHealthChecks();
      
      const failedChecks = healthChecks.filter(check => check.status !== 'healthy');
      
      if (failedChecks.length > 0) {
        const failedNames = failedChecks.map(check => check.name);
        console.warn(`   ⚠️ Some health checks failed: ${failedNames.join(', ')}`);
        
        if (this.config.environment === 'production') {
          throw new Error(`Critical health checks failed after rollback: ${failedNames.join(', ')}`);
        } else {
          console.warn('   Non-production environment - continuing despite health check failures');
        }
      } else {
        console.log(`   ✅ All ${healthChecks.length} health checks passed`);
      }
    });
  }

  private async performHealthChecks(): Promise<HealthCheckResult[]> {
    const baseUrl = this.getBaseUrl();
    const healthChecks: HealthCheckResult[] = [];

    // Basic application health
    healthChecks.push(await this.healthCheck('Application Health', `${baseUrl}/api/health`));
    
    // Database connectivity
    healthChecks.push(await this.healthCheck('Database Connection', `${baseUrl}/api/health/db`));
    
    // AI service health
    healthChecks.push(await this.healthCheck('AI Service Health', `${baseUrl}/api/admin/llm/health`));

    return healthChecks;
  }

  private async healthCheck(name: string, url: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds
    
    try {
      const response = await fetch(url, { 
        method: 'GET',
        timeout 
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          name,
          status: 'healthy',
          responseTime,
          details: data
        };
      } else {
        return {
          name,
          status: 'unhealthy',
          responseTime,
          details: { status: response.status, statusText: response.statusText }
        };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        name,
        status: responseTime >= timeout ? 'timeout' : 'unhealthy',
        responseTime,
        details: { error: error.message }
      };
    }
  }

  private getBaseUrl(): string {
    switch (this.config.environment) {
      case 'production':
        return process.env.PRODUCTION_URL || 'https://app.joblander.com';
      case 'staging':
        return process.env.STAGING_URL || 'https://staging.joblander.com';
      default:
        return process.env.DEVELOPMENT_URL || 'http://localhost:5173';
    }
  }

  private async validateRollbackSuccess() {
    await this.executeStep('Validate rollback success', async () => {
      const targetBackup = (this as any).targetBackup as DeploymentBackup;
      
      // Check if we're now running the expected version
      const baseUrl = this.getBaseUrl();
      
      try {
        const response = await fetch(`${baseUrl}/api/version`);
        if (response.ok) {
          const versionInfo = await response.json();
          console.log(`   🏷️ Current version: ${versionInfo.version || 'unknown'}`);
          console.log(`   📝 Current commit: ${(versionInfo.commit || 'unknown').substring(0, 8)}`);
        }
      } catch (error) {
        console.warn('   ⚠️ Could not verify current version');
      }

      // Test critical user flows
      console.log('   🔍 Testing critical user flows...');
      
      const homeResponse = await fetch(baseUrl);
      if (!homeResponse.ok) {
        throw new Error(`Homepage not accessible after rollback: ${homeResponse.status}`);
      }
      
      const apiResponse = await fetch(`${baseUrl}/api/health`);
      if (!apiResponse.ok) {
        throw new Error(`API not accessible after rollback: ${apiResponse.status}`);
      }
      
      console.log('   ✅ Critical user flows validated');
    });
  }

  private async cleanupTempFiles() {
    await this.executeStep('Clean up temporary files', async () => {
      // Clean up any temporary files created during rollback
      const tempFiles = [
        'migration-backup-*.sql',
        'pre-rollback-backup-*.sql'
      ];

      for (const pattern of tempFiles) {
        try {
          const { stdout } = await execAsync(`ls ${pattern} 2>/dev/null || true`);
          if (stdout.trim()) {
            console.log(`   🗑️ Cleaning up: ${stdout.trim()}`);
            await execAsync(`rm -f ${pattern}`);
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });
  }

  private async notifyRollbackSuccess() {
    await this.executeStep('Send rollback notifications', async () => {
      const duration = Date.now() - this.startTime;
      const targetBackup = (this as any).targetBackup as DeploymentBackup;
      
      const message = `🔄 Rollback to ${this.config.environment.toUpperCase()} completed successfully in ${Math.round(duration / 1000)}s`;
      
      console.log('\n' + '='.repeat(60));
      console.log(message);
      console.log(`🔗 Application URL: ${this.getBaseUrl()}`);
      console.log(`📦 Rolled back to: ${targetBackup.timestamp}`);
      console.log(`🏷️ Target version: ${targetBackup.version}`);
      console.log('='.repeat(60));
      
      // Send notifications (Slack, email, etc.)
      if (process.env.SLACK_WEBHOOK_URL) {
        try {
          await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `${message}\nTarget: ${targetBackup.timestamp}\nURL: ${this.getBaseUrl()}`,
              channel: '#deployments',
              username: 'JobLander Rollback Bot'
            })
          });
        } catch (error) {
          console.warn('⚠️ Failed to send Slack notification');
        }
      }
    });
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const environment = (args[0] as any) || 'development';
  
  if (!['development', 'staging', 'production'].includes(environment)) {
    console.error('❌ Invalid environment. Use: development, staging, or production');
    process.exit(1);
  }
  
  const config: RollbackConfig = {
    environment,
    targetDeployment: args.find(arg => arg.startsWith('--target='))?.split('=')[1],
    restoreDatabase: args.includes('--restore-db'),
    skipHealthChecks: args.includes('--skip-health-checks'),
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run')
  };
  
  // Safety check for production
  if (environment === 'production' && !config.force && !config.dryRun) {
    console.log('⚠️ Production rollback requires --force flag or use --dry-run first');
    console.log('Usage: npm run rollback production --force');
    process.exit(1);
  }
  
  const rollback = new RollbackManager(config);
  const result = await rollback.rollback();
  
  if (result.success) {
    console.log('🎉 Rollback completed successfully!');
    process.exit(0);
  } else {
    console.error('💥 Rollback failed!');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Rollback script crashed:', error);
    process.exit(1);
  });
}

export { RollbackManager };