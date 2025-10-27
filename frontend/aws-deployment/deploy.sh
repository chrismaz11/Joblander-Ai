#!/bin/bash

# AWS Deployment Script for Job-Lander
set -e

# Configuration
REGION="us-east-1"  # Change this to your preferred region
CLUSTER_NAME="job-lander-cluster"
SERVICE_NAME="job-lander-service"
TASK_DEFINITION_FAMILY="job-lander-task"
ECR_REPOSITORY="job-lander"
ALB_NAME="job-lander-alb"
TARGET_GROUP_NAME="job-lander-tg"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed and configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo_info "Using AWS Account: $ACCOUNT_ID"
}

# Get or create VPC and subnets
setup_network() {
    echo_info "Setting up network infrastructure..."
    
    # Get default VPC
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region $REGION)
    
    if [ "$VPC_ID" == "None" ] || [ -z "$VPC_ID" ]; then
        echo_error "No default VPC found. Please create a VPC first."
        exit 1
    fi
    
    echo_info "Using VPC: $VPC_ID"
    
    # Get public subnets
    SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[?MapPublicIpOnLaunch==`true`].SubnetId' --output text --region $REGION)
    
    if [ -z "$SUBNET_IDS" ]; then
        echo_error "No public subnets found in the default VPC."
        exit 1
    fi
    
    echo_info "Using subnets: $SUBNET_IDS"
}

# Create ECR repository
create_ecr_repo() {
    echo_info "Creating ECR repository..."
    
    aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $REGION &> /dev/null || \
    aws ecr create-repository --repository-name $ECR_REPOSITORY --region $REGION
    
    ECR_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY"
    echo_info "ECR Repository: $ECR_URI"
}

# Build and push Docker image
build_and_push() {
    echo_info "Building and pushing Docker image..."
    
    # Get ECR login token
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
    
    # Build image
    echo_info "Building Docker image..."
    cd "$(dirname "$0")/.."
    docker build -t $ECR_REPOSITORY .
    
    # Tag and push
    docker tag $ECR_REPOSITORY:latest $ECR_URI:latest
    docker push $ECR_URI:latest
    
    echo_info "Image pushed to: $ECR_URI:latest"
}

# Create security group
create_security_group() {
    echo_info "Creating security groups..."
    
    # ALB Security Group
    ALB_SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=job-lander-alb-sg" --query 'SecurityGroups[0].GroupId' --output text --region $REGION 2>/dev/null || echo "None")
    
    if [ "$ALB_SG_ID" == "None" ]; then
        ALB_SG_ID=$(aws ec2 create-security-group --group-name job-lander-alb-sg --description "Job-Lander ALB Security Group" --vpc-id $VPC_ID --region $REGION --query 'GroupId' --output text)
        
        # Allow HTTP and HTTPS
        aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
        aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $REGION
    fi
    
    # ECS Security Group
    ECS_SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=job-lander-ecs-sg" --query 'SecurityGroups[0].GroupId' --output text --region $REGION 2>/dev/null || echo "None")
    
    if [ "$ECS_SG_ID" == "None" ]; then
        ECS_SG_ID=$(aws ec2 create-security-group --group-name job-lander-ecs-sg --description "Job-Lander ECS Security Group" --vpc-id $VPC_ID --region $REGION --query 'GroupId' --output text)
        
        # Allow traffic from ALB
        aws ec2 authorize-security-group-ingress --group-id $ECS_SG_ID --protocol tcp --port 5000 --source-group $ALB_SG_ID --region $REGION
    fi
    
    echo_info "Security Groups - ALB: $ALB_SG_ID, ECS: $ECS_SG_ID"
}

# Create Application Load Balancer
create_alb() {
    echo_info "Creating Application Load Balancer..."
    
    # Convert subnet IDs to array
    SUBNET_ARRAY=($(echo $SUBNET_IDS | tr ' ' '\n'))
    
    # Create ALB if it doesn't exist
    ALB_ARN=$(aws elbv2 describe-load-balancers --names $ALB_NAME --query 'LoadBalancers[0].LoadBalancerArn' --output text --region $REGION 2>/dev/null || echo "None")
    
    if [ "$ALB_ARN" == "None" ]; then
        ALB_ARN=$(aws elbv2 create-load-balancer \
            --name $ALB_NAME \
            --subnets ${SUBNET_ARRAY[@]} \
            --security-groups $ALB_SG_ID \
            --region $REGION \
            --query 'LoadBalancers[0].LoadBalancerArn' --output text)
    fi
    
    # Create target group if it doesn't exist
    TG_ARN=$(aws elbv2 describe-target-groups --names $TARGET_GROUP_NAME --query 'TargetGroups[0].TargetGroupArn' --output text --region $REGION 2>/dev/null || echo "None")
    
    if [ "$TG_ARN" == "None" ]; then
        TG_ARN=$(aws elbv2 create-target-group \
            --name $TARGET_GROUP_NAME \
            --protocol HTTP \
            --port 5000 \
            --vpc-id $VPC_ID \
            --target-type ip \
            --health-check-path /api/health \
            --region $REGION \
            --query 'TargetGroups[0].TargetGroupArn' --output text)
    fi
    
    # Create listener if it doesn't exist
    LISTENER_ARN=$(aws elbv2 describe-listeners --load-balancer-arn $ALB_ARN --query 'Listeners[0].ListenerArn' --output text --region $REGION 2>/dev/null || echo "None")
    
    if [ "$LISTENER_ARN" == "None" ]; then
        aws elbv2 create-listener \
            --load-balancer-arn $ALB_ARN \
            --protocol HTTP \
            --port 80 \
            --default-actions Type=forward,TargetGroupArn=$TG_ARN \
            --region $REGION
    fi
    
    # Get ALB DNS name
    ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text --region $REGION)
    echo_info "Load Balancer DNS: $ALB_DNS"
}

# Create ECS Cluster
create_ecs_cluster() {
    echo_info "Creating ECS cluster..."
    
    aws ecs describe-clusters --clusters $CLUSTER_NAME --region $REGION &> /dev/null || \
    aws ecs create-cluster --cluster-name $CLUSTER_NAME --capacity-providers FARGATE --region $REGION
    
    echo_info "ECS Cluster: $CLUSTER_NAME"
}

# Create IAM roles
create_iam_roles() {
    echo_info "Creating IAM roles..."
    
    # ECS Task Execution Role
    cat > /tmp/ecs-task-execution-role-trust.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
    
    aws iam get-role --role-name ecsTaskExecutionRole &> /dev/null || \
    aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file:///tmp/ecs-task-execution-role-trust.json
    
    aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    
    # Create policy for SSM parameter access
    cat > /tmp/ssm-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameters",
                "ssm:GetParameter"
            ],
            "Resource": "arn:aws:ssm:$REGION:$ACCOUNT_ID:parameter/job-lander/*"
        }
    ]
}
EOF
    
    aws iam put-role-policy --role-name ecsTaskExecutionRole --policy-name SSMParameterAccess --policy-document file:///tmp/ssm-policy.json
    
    # ECS Task Role
    aws iam get-role --role-name ecsTaskRole &> /dev/null || \
    aws iam create-role --role-name ecsTaskRole --assume-role-policy-document file:///tmp/ecs-task-execution-role-trust.json
    
    echo_info "IAM roles created successfully"
}

# Update task definition with actual values
update_task_definition() {
    echo_info "Updating task definition..."
    
    # Replace placeholders in task definition
    sed -e "s/YOUR_ACCOUNT_ID/$ACCOUNT_ID/g" \
        -e "s/YOUR_REGION/$REGION/g" \
        aws-deployment/task-definition.json > /tmp/task-definition-updated.json
    
    # Register task definition
    aws ecs register-task-definition --cli-input-json file:///tmp/task-definition-updated.json --region $REGION
    
    echo_info "Task definition registered"
}

# Create or update ECS service
create_ecs_service() {
    echo_info "Creating ECS service..."
    
    # Convert subnet IDs to array
    SUBNET_ARRAY=($(echo $SUBNET_IDS | tr ' ' '\n'))
    SUBNETS_JSON=$(printf '"%s",' "${SUBNET_ARRAY[@]}")
    SUBNETS_JSON="[${SUBNETS_JSON%,}]"
    
    # Check if service exists
    SERVICE_STATUS=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].status' --output text --region $REGION 2>/dev/null || echo "None")
    
    if [ "$SERVICE_STATUS" == "None" ]; then
        # Create service
        aws ecs create-service \
            --cluster $CLUSTER_NAME \
            --service-name $SERVICE_NAME \
            --task-definition $TASK_DEFINITION_FAMILY \
            --desired-count 2 \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=$SUBNETS_JSON,securityGroups=[$ECS_SG_ID],assignPublicIp=ENABLED}" \
            --load-balancers targetGroupArn=$TG_ARN,containerName=job-lander-app,containerPort=5000 \
            --region $REGION
    else
        # Update service
        echo_info "Service exists, updating..."
        aws ecs update-service \
            --cluster $CLUSTER_NAME \
            --service $SERVICE_NAME \
            --task-definition $TASK_DEFINITION_FAMILY \
            --region $REGION
    fi
    
    echo_info "ECS service created/updated successfully"
}

# Main deployment function
main() {
    echo_info "Starting AWS deployment for Job-Lander..."
    
    check_aws_cli
    setup_network
    create_ecr_repo
    build_and_push
    create_security_group
    create_alb
    create_ecs_cluster
    create_iam_roles
    update_task_definition
    create_ecs_service
    
    echo_info "Deployment completed successfully!"
    echo_info "Your application will be available at: http://$ALB_DNS"
    echo_warning "Please ensure your environment variables are set in AWS Systems Manager Parameter Store"
    echo_warning "Run the following command to set up your parameters:"
    echo "aws ssm put-parameter --name '/job-lander/database-url' --value 'YOUR_DATABASE_URL' --type SecureString --region $REGION"
}

# Run main function
main "$@"