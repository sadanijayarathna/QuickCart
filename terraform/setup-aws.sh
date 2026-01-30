#!/bin/bash

# QuickCart AWS Credentials Setup Script
# Run this in WSL Ubuntu

echo "========================================="
echo "QuickCart AWS Setup - WSL Ubuntu"
echo "========================================="

# Install AWS CLI if not installed
if ! command -v aws &> /dev/null; then
    echo "📦 Installing AWS CLI..."
    sudo apt-get update
    sudo apt-get install -y unzip curl
    
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
    
    echo "✅ AWS CLI installed successfully"
else
    echo "✅ AWS CLI already installed"
fi

# Check AWS CLI version
echo ""
echo "📌 AWS CLI Version:"
aws --version

# Configure AWS credentials
echo ""
echo "========================================="
echo "AWS Credentials Configuration"
echo "========================================="
echo ""
echo "Please provide your AWS credentials:"
echo "(You can find these in your AWS Console → IAM → Users → Security credentials)"
echo ""

read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
read -p "Default region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

# Configure AWS CLI
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure set default.region "$AWS_REGION"
aws configure set default.output json

echo ""
echo "✅ AWS credentials configured successfully!"
echo ""

# Verify credentials
echo "========================================="
echo "Verifying AWS Credentials..."
echo "========================================="

if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS credentials are valid!"
    echo ""
    aws sts get-caller-identity
    echo ""
else
    echo "❌ Failed to verify AWS credentials"
    echo "Please check your Access Key ID and Secret Access Key"
    exit 1
fi

# Install Terraform if not installed
echo ""
echo "========================================="
echo "Checking Terraform Installation"
echo "========================================="

if ! command -v terraform &> /dev/null; then
    echo "📦 Installing Terraform..."
    
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt-get update
    sudo apt-get install -y terraform
    
    echo "✅ Terraform installed successfully"
else
    echo "✅ Terraform already installed"
fi

echo ""
echo "📌 Terraform Version:"
terraform version

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next Steps:"
echo "1. Navigate to terraform directory: cd terraform"
echo "2. Update variables.tf with your Docker Hub username"
echo "3. Run: terraform init"
echo "4. Run: terraform plan"
echo "5. Run: terraform apply"
echo ""
echo "========================================="
