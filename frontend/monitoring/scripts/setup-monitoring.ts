#!/usr/bin/env node

/**
 * Monitoring Setup Script
 * 
 * Deploys CloudWatch dashboards, alarms, and SNS topics for comprehensive
 * application monitoring and alerting.
 */

import {
  CloudWatchClient,
  PutDashboardCommand,
  PutMetricAlarmCommand,
  DescribeAlarmsCommand
} from '@aws-sdk/client-cloudwatch';
import {
  SNSClient,
  CreateTopicCommand,
  SubscribeCommand,
  ListTopicsCommand
} from '@aws-sdk/client-sns';
import * as fs from 'fs';
import * as path from 'path';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;

if (!ACCOUNT_ID) {
  console.error('❌ AWS_ACCOUNT_ID environment variable is required');
  process.exit(1);
}

const cloudWatchClient = new CloudWatchClient({ region: AWS_REGION });
const snsClient = new SNSClient({ region: AWS_REGION });

interface SetupResult {
  dashboards: string[];
  alarms: string[];
  topics: string[];
  errors: string[];
}

class MonitoringSetup {
  private results: SetupResult = {
    dashboards: [],
    alarms: [],
    topics: [],
    errors: []
  };

  async setupDashboards() {
    console.log('📊 Setting up CloudWatch dashboards...');

    const dashboardPath = path.join(__dirname, '../dashboards/application-dashboard.json');
    
    try {
      const dashboardConfig = JSON.parse(fs.readFileSync(dashboardPath, 'utf-8'));
      
      const putDashboardCommand = new PutDashboardCommand({
        DashboardName: 'JobLander-Application-Dashboard',
        DashboardBody: JSON.stringify(dashboardConfig)
      });

      await cloudWatchClient.send(putDashboardCommand);
      
      this.results.dashboards.push('JobLander-Application-Dashboard');
      console.log('✅ Created application dashboard');

      // Create additional specialized dashboards
      await this.createPerformanceDashboard();
      await this.createSecurityDashboard();
      await this.createBusinessDashboard();
      
    } catch (error: any) {
      this.results.errors.push(`Dashboard setup: ${error.message}`);
      console.error('❌ Failed to setup dashboards:', error.message);
    }
  }

  private async createPerformanceDashboard() {
    const performanceDashboard = {
      widgets: [
        {
          type: "metric",
          x: 0, y: 0, width: 24, height: 6,
          properties: {
            metrics: [
              ["AWS/Lambda", "Duration", "FunctionName", "job-lander-blockchain-dev"],
              ["JobLander/Performance", "APIResponseTime", "Endpoint", "/api/resumes"],
              ["JobLander/Performance", "PageLoadTime", "Page", "homepage"],
              ["JobLander/Performance", "DatabaseResponseTime", "Operation", "SELECT"]
            ],
            view: "timeSeries",
            stacked: false,
            region: AWS_REGION,
            title: "Response Time Trends",
            period: 300,
            stat: "Average",
            yAxis: { left: { min: 0 } }
          }
        },
        {
          type: "metric",
          x: 0, y: 6, width: 12, height: 6,
          properties: {
            metrics: [
              ["AWS/Lambda", "ConcurrentExecutions", "FunctionName", "job-lander-blockchain-dev"],
              [".", "Throttles", ".", "."],
              ["JobLander/Performance", "ConcurrentUsers"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Concurrency and Throttling",
            period: 300,
            stat: "Maximum"
          }
        },
        {
          type: "metric",
          x: 12, y: 6, width: 12, height: 6,
          properties: {
            metrics: [
              ["AWS/RDS", "ReadLatency", "DBInstanceIdentifier", "job-lander-db"],
              [".", "WriteLatency", ".", "."],
              [".", "ReadThroughput", ".", "."],
              [".", "WriteThroughput", ".", "."]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Database Performance",
            period: 300,
            stat: "Average"
          }
        }
      ]
    };

    const putDashboardCommand = new PutDashboardCommand({
      DashboardName: 'JobLander-Performance-Dashboard',
      DashboardBody: JSON.stringify(performanceDashboard)
    });

    await cloudWatchClient.send(putDashboardCommand);
    this.results.dashboards.push('JobLander-Performance-Dashboard');
    console.log('✅ Created performance dashboard');
  }

  private async createSecurityDashboard() {
    const securityDashboard = {
      widgets: [
        {
          type: "metric",
          x: 0, y: 0, width: 12, height: 6,
          properties: {
            metrics: [
              ["JobLander/Security", "FailedLoginAttempts", "Endpoint", "/api/auth/login"],
              [".", "RateLimitHits", ".", "."],
              [".", "SecurityViolations", ".", "."],
              [".", "SuspiciousActivity", ".", "."]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Security Incidents",
            period: 300,
            stat: "Sum"
          }
        },
        {
          type: "log",
          x: 12, y: 0, width: 12, height: 6,
          properties: {
            query: `SOURCE '/aws/lambda/job-lander-blockchain-dev'
| fields @timestamp, @message, sourceIP, userAgent, endpoint
| filter @message like /security|auth|login|failed/
| sort @timestamp desc
| limit 100`,
            region: AWS_REGION,
            title: "Security Events Log",
            view: "table"
          }
        },
        {
          type: "metric",
          x: 0, y: 6, width: 24, height: 6,
          properties: {
            metrics: [
              ["JobLander/Security", "AuthenticationSuccess", "Method", "email"],
              [".", "AuthenticationSuccess", "Method", "google"],
              [".", "AuthenticationSuccess", "Method", "amazon"],
              [".", "PasswordResets"],
              [".", "AccountLockouts"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Authentication Activity",
            period: 3600,
            stat: "Sum"
          }
        }
      ]
    };

    const putDashboardCommand = new PutDashboardCommand({
      DashboardName: 'JobLander-Security-Dashboard',
      DashboardBody: JSON.stringify(securityDashboard)
    });

    await cloudWatchClient.send(putDashboardCommand);
    this.results.dashboards.push('JobLander-Security-Dashboard');
    console.log('✅ Created security dashboard');
  }

  private async createBusinessDashboard() {
    const businessDashboard = {
      widgets: [
        {
          type: "metric",
          x: 0, y: 0, width: 8, height: 6,
          properties: {
            metrics: [
              ["JobLander/Business", "UserRegistrations"],
              [".", "ActiveUsers"],
              [".", "UserRetention"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "User Metrics",
            period: 86400,
            stat: "Sum"
          }
        },
        {
          type: "metric",
          x: 8, y: 0, width: 8, height: 6,
          properties: {
            metrics: [
              ["JobLander/Business", "ResumeUploads"],
              [".", "ResumeEnhancements"],
              [".", "ResumeDownloads"],
              [".", "TemplateUsage"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Resume Activity",
            period: 3600,
            stat: "Sum"
          }
        },
        {
          type: "metric",
          x: 16, y: 0, width: 8, height: 6,
          properties: {
            metrics: [
              ["JobLander/Business", "JobSearches"],
              [".", "JobApplications"],
              [".", "CoverLettersGenerated"],
              [".", "SuccessfulMatches"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Job Search Activity",
            period: 3600,
            stat: "Sum"
          }
        },
        {
          type: "metric",
          x: 0, y: 6, width: 12, height: 6,
          properties: {
            metrics: [
              ["JobLander/Business", "RevenueGenerated"],
              [".", "SubscriptionUpgrades"],
              [".", "ChurnRate"],
              [".", "LifetimeValue"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Business Metrics",
            period: 86400,
            stat: "Average"
          }
        },
        {
          type: "metric",
          x: 12, y: 6, width: 12, height: 6,
          properties: {
            metrics: [
              ["JobLander/Blockchain", "VerificationRequests"],
              [".", "SuccessfulVerifications"],
              [".", "VerificationCosts"],
              [".", "BlockchainUptime"]
            ],
            view: "timeSeries",
            region: AWS_REGION,
            title: "Blockchain Verification",
            period: 3600,
            stat: "Sum"
          }
        }
      ]
    };

    const putDashboardCommand = new PutDashboardCommand({
      DashboardName: 'JobLander-Business-Dashboard',
      DashboardBody: JSON.stringify(businessDashboard)
    });

    await cloudWatchClient.send(putDashboardCommand);
    this.results.dashboards.push('JobLander-Business-Dashboard');
    console.log('✅ Created business dashboard');
  }

  async setupSNSTopics() {
    console.log('📢 Setting up SNS topics for alerts...');

    const alarmsConfigPath = path.join(__dirname, '../alerts/cloudwatch-alarms.json');
    const alarmsConfig = JSON.parse(fs.readFileSync(alarmsConfigPath, 'utf-8'));

    // Get existing topics to avoid duplicates
    const existingTopics = await this.getExistingTopics();

    for (const topicConfig of alarmsConfig.sns_topics) {
      const topicArn = `arn:aws:sns:${AWS_REGION}:${ACCOUNT_ID}:${topicConfig.TopicName}`;
      
      if (existingTopics.includes(topicArn)) {
        console.log(`⏭️  Topic ${topicConfig.TopicName} already exists`);
        this.results.topics.push(topicConfig.TopicName);
        continue;
      }

      try {
        // Create topic
        const createTopicCommand = new CreateTopicCommand({
          Name: topicConfig.TopicName,
          DisplayName: topicConfig.DisplayName
        });

        const topicResult = await snsClient.send(createTopicCommand);
        console.log(`✅ Created SNS topic: ${topicConfig.TopicName}`);

        // Add subscriptions
        for (const subscription of topicConfig.Subscriptions) {
          try {
            const subscribeCommand = new SubscribeCommand({
              TopicArn: topicResult.TopicArn,
              Protocol: subscription.Protocol,
              Endpoint: subscription.Endpoint
            });

            await snsClient.send(subscribeCommand);
            console.log(`   📧 Added ${subscription.Protocol} subscription: ${subscription.Endpoint}`);
          } catch (error: any) {
            console.warn(`   ⚠️ Failed to add subscription: ${error.message}`);
          }
        }

        this.results.topics.push(topicConfig.TopicName);
      } catch (error: any) {
        this.results.errors.push(`SNS topic ${topicConfig.TopicName}: ${error.message}`);
        console.error(`❌ Failed to create topic ${topicConfig.TopicName}:`, error.message);
      }
    }
  }

  private async getExistingTopics(): Promise<string[]> {
    try {
      const listTopicsCommand = new ListTopicsCommand({});
      const response = await snsClient.send(listTopicsCommand);
      return response.Topics?.map(topic => topic.TopicArn!).filter(Boolean) || [];
    } catch (error) {
      return [];
    }
  }

  async setupCloudWatchAlarms() {
    console.log('🚨 Setting up CloudWatch alarms...');

    const alarmsConfigPath = path.join(__dirname, '../alerts/cloudwatch-alarms.json');
    const alarmsConfig = JSON.parse(fs.readFileSync(alarmsConfigPath, 'utf-8'));

    // Get existing alarms to avoid duplicates
    const existingAlarms = await this.getExistingAlarms();

    for (const alarmConfig of alarmsConfig.alarms) {
      if (existingAlarms.includes(alarmConfig.AlarmName)) {
        console.log(`⏭️  Alarm ${alarmConfig.AlarmName} already exists`);
        this.results.alarms.push(alarmConfig.AlarmName);
        continue;
      }

      try {
        // Replace ACCOUNT_ID placeholder
        const alarmActions = alarmConfig.AlarmActions.map((action: string) =>
          action.replace('ACCOUNT_ID', ACCOUNT_ID)
        );

        const putMetricAlarmCommand = new PutMetricAlarmCommand({
          AlarmName: alarmConfig.AlarmName,
          AlarmDescription: alarmConfig.AlarmDescription,
          ActionsEnabled: alarmConfig.ActionsEnabled,
          AlarmActions: alarmActions,
          MetricName: alarmConfig.MetricName,
          Namespace: alarmConfig.Namespace,
          Statistic: alarmConfig.Statistic,
          Dimensions: alarmConfig.Dimensions,
          Period: alarmConfig.Period,
          EvaluationPeriods: alarmConfig.EvaluationPeriods,
          Threshold: alarmConfig.Threshold,
          ComparisonOperator: alarmConfig.ComparisonOperator,
          TreatMissingData: alarmConfig.TreatMissingData
        });

        await cloudWatchClient.send(putMetricAlarmCommand);
        this.results.alarms.push(alarmConfig.AlarmName);
        console.log(`✅ Created alarm: ${alarmConfig.AlarmName}`);
      } catch (error: any) {
        this.results.errors.push(`Alarm ${alarmConfig.AlarmName}: ${error.message}`);
        console.error(`❌ Failed to create alarm ${alarmConfig.AlarmName}:`, error.message);
      }
    }
  }

  private async getExistingAlarms(): Promise<string[]> {
    try {
      const describeAlarmsCommand = new DescribeAlarmsCommand({
        AlarmNamePrefix: 'JobLander-'
      });
      const response = await cloudWatchClient.send(describeAlarmsCommand);
      return response.MetricAlarms?.map(alarm => alarm.AlarmName!).filter(Boolean) || [];
    } catch (error) {
      return [];
    }
  }

  generateSummaryReport() {
    console.log('\n📋 Monitoring Setup Summary');
    console.log('='.repeat(50));
    
    console.log(`📊 Dashboards: ${this.results.dashboards.length} created`);
    this.results.dashboards.forEach(dashboard => {
      console.log(`   ✅ ${dashboard}`);
    });
    
    console.log(`🚨 Alarms: ${this.results.alarms.length} created`);
    this.results.alarms.forEach(alarm => {
      console.log(`   ✅ ${alarm}`);
    });
    
    console.log(`📢 SNS Topics: ${this.results.topics.length} created`);
    this.results.topics.forEach(topic => {
      console.log(`   ✅ ${topic}`);
    });

    if (this.results.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.results.errors.length}`);
      this.results.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }

    console.log('\n🔗 Next Steps:');
    console.log('   1. Configure email addresses in SNS topic subscriptions');
    console.log('   2. Confirm email subscriptions for alert notifications');
    console.log('   3. Test alarms by triggering threshold conditions');
    console.log('   4. Customize dashboard widgets based on your specific metrics');
    console.log(`   5. View dashboards at: https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:`);
    
    return this.results;
  }

  async run() {
    try {
      console.log('🚀 Starting monitoring setup...\n');
      console.log(`Region: ${AWS_REGION}`);
      console.log(`Account ID: ${ACCOUNT_ID}\n`);

      await this.setupSNSTopics();
      await this.setupCloudWatchAlarms();
      await this.setupDashboards();

      return this.generateSummaryReport();
    } catch (error: any) {
      console.error('💥 Monitoring setup failed:', error.message);
      throw error;
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new MonitoringSetup();
  
  setup.run()
    .then((result) => {
      const hasErrors = result.errors.length > 0;
      process.exit(hasErrors ? 1 : 0);
    })
    .catch((error) => {
      console.error('Setup crashed:', error);
      process.exit(1);
    });
}

export { MonitoringSetup };