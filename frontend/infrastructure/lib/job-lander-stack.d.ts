import * as cdk from 'aws-cdk-lib';
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
export declare class JobLanderStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: JobLanderStackProps);
}
