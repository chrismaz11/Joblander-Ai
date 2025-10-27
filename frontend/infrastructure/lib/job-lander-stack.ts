import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as autoscaling from 'aws-cdk-lib/aws-applicationautoscaling';
import { Construct } from 'constructs';

export interface JobLanderStackProps extends cdk.StackProps {
  stage: string;
  desiredCount: number;
  cpu: number;
  memory: number;
  enableAutoScaling: boolean;
  hostedZoneId?: string;
  domainName?: string;
}

export class JobLanderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: JobLanderStackProps) {
    super(scope, id, props);


    const { stage, desiredCount, cpu, memory, enableAutoScaling } = props;

    // VPC - Use existing default VPC or create new one
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
    });

    // S3 Bucket for uploads and static assets
    const uploadsBucket = new s3.Bucket(this, 'UploadsBucket', {
      bucketName: `job-lander-uploads-${stage}-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(90),
          id: 'ExpireOldUploads',
        },
      ],
      removalPolicy: stage === 'production' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: stage !== 'production',
    });

    // RDS PostgreSQL Database
    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      secretName: `job-lander-db-secret-${stage}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for Job-Lander RDS instance',
      allowAllOutbound: true,
    });

    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_8,
      }),
      instanceType: stage === 'production'
        ? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)
        : ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'joblander',
      allocatedStorage: stage === 'production' ? 100 : 20,
      maxAllocatedStorage: stage === 'production' ? 500 : 100,
      storageType: rds.StorageType.GP3,
      securityGroups: [dbSecurityGroup],
      backupRetention: stage === 'production' ? cdk.Duration.days(7) : cdk.Duration.days(1),
      deleteAutomatedBackups: stage !== 'production',
      removalPolicy: stage === 'production' ? cdk.RemovalPolicy.SNAPSHOT : cdk.RemovalPolicy.DESTROY,
      enablePerformanceInsights: stage === 'production',
      publiclyAccessible: false,
    });


    // ECR Repository - Import existing repository
    const ecrRepository = ecr.Repository.fromRepositoryName(
      this,
      'Repository',
      `job-lander-${stage}`
    );

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'JobLanderCluster', {
      vpc,
      clusterName: `${id}-JobLanderCluster`,
      containerInsights: stage === 'production',
    });

    // Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
      loadBalancerName: `${id}-ALB`,
    });

    // CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/ecs/job-lander-${stage}`,
      retention: stage === 'production' ? logs.RetentionDays.ONE_MONTH : logs.RetentionDays.ONE_WEEK,
      removalPolicy: stage === 'production' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // ECS Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu,
      memoryLimitMiB: memory,
      family: `job-lander-task-${stage}`,
    });

    // Grant S3 permissions to task role
    uploadsBucket.grantReadWrite(taskDefinition.taskRole);

    // Add container to task definition
    const container = taskDefinition.addContainer('JobLanderContainer', {
      image: ecs.ContainerImage.fromEcrRepository(ecrRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'ecs',
        logGroup,
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '5000',
        AWS_REGION: this.region,
        S3_BUCKET_NAME: uploadsBucket.bucketName,
        DB_HOST: database.instanceEndpoint.hostname,
        DB_PORT: database.instanceEndpoint.port.toString(),
        DB_NAME: 'joblander',
        DB_USER: 'postgres',
      },
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
        GEMINI_API_KEY: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'GeminiSecret',
            `job-lander/gemini-api-key-${stage}`
          )
        ),
        SESSION_SECRET: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'SessionSecret',
            `job-lander/session-secret-${stage}`
          )
        ),
        CANVA_CLIENT_ID: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
          )
        ),
        CANVA_CLIENT_SECRET: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
          )
        ),
        JSEARCH_API_KEY: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'JSearchApiKey',
            `job-lander/jsearch-api-key-${stage}`
          )
        ),
        WEB3_RPC_URL: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'Web3RpcUrl',
            `job-lander/web3-rpc-url-${stage}`
          )
        ),
        PRIVATE_KEY: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'PrivateKey',
            `job-lander/private-key-${stage}`
          )
        ),
      },
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:5000/api/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
    });

    container.addPortMappings({
      containerPort: 5000,
      protocol: ecs.Protocol.TCP,
    });

    // Create security group for ECS service
    const ecsSecurityGroup = new ec2.SecurityGroup(this, 'ECSSecurityGroup', {
      vpc,
      description: 'Security group for Job-Lander ECS service',
      allowAllOutbound: true,
    });

    // Allow ALB to access ECS service
    ecsSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(alb.connections.securityGroups[0].securityGroupId),
      ec2.Port.tcp(5000),
      'Allow ALB to access ECS service'
    );

    // Allow ECS tasks to access RDS
    dbSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(ecsSecurityGroup.securityGroupId),
      ec2.Port.tcp(5432),
      'Allow ECS tasks to access RDS'
    );

    // ECS Fargate Service
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      serviceName: `${id}-JobLanderService`,
      desiredCount,
      assignPublicIp: true,
      securityGroups: [ecsSecurityGroup],
      healthCheckGracePeriod: cdk.Duration.seconds(60),
      circuitBreaker: {
        rollback: true,
      },
    });

    // Target Group
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      vpc,
      port: 5000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: '/api/health',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
      deregistrationDelay: cdk.Duration.seconds(30),
    });

    service.attachToApplicationTargetGroup(targetGroup);

    // ALB Listener
    const listener = alb.addListener('Listener', {
      port: 80,
      open: true,
      defaultTargetGroups: [targetGroup],
    });

    // Auto Scaling (if enabled)
    if (enableAutoScaling) {
      const scaling = service.autoScaleTaskCount({
        minCapacity: desiredCount,
        maxCapacity: desiredCount * 3,
      });

      scaling.scaleOnCpuUtilization('CpuScaling', {
        targetUtilizationPercent: 70,
        scaleInCooldown: cdk.Duration.seconds(60),
        scaleOutCooldown: cdk.Duration.seconds(60),
      });

      scaling.scaleOnMemoryUtilization('MemoryScaling', {
        targetUtilizationPercent: 80,
        scaleInCooldown: cdk.Duration.seconds(60),
        scaleOutCooldown: cdk.Duration.seconds(60),
      });
    }

    // CloudFront Distribution (for caching and CDN)
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.LoadBalancerV2Origin(alb, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      },
      additionalBehaviors: {
        '/assets/*': {
          origin: new origins.S3Origin(uploadsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
      description: 'Application Load Balancer DNS',
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
      description: 'RDS Database Endpoint',
    });

    new cdk.CfnOutput(this, 'ECRRepositoryURI', {
      value: ecrRepository.repositoryUri,
      description: 'ECR Repository URI',
    });

    new cdk.CfnOutput(this, 'UploadsBucketName', {
      value: uploadsBucket.bucketName,
      description: 'S3 Uploads Bucket Name',
    });

    new cdk.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName,
      description: 'ECS Cluster Name',
    });

    new cdk.CfnOutput(this, 'ServiceName', {
      value: service.serviceName,
      description: 'ECS Service Name',
    });
  }

}
