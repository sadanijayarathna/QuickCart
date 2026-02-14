#!/bin/bash

echo "========================================="
echo "AWS Credentials Setup for QuickCart"
echo "========================================="
echo ""

# Prompt for AWS credentials
read -p "Enter AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -sp "Enter AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
echo ""
read -p "Enter AWS Region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

echo ""
echo "Configuring AWS CLI..."

# Configure AWS CLI
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure set region "$AWS_REGION"
aws configure set output json

echo ""
echo "✅ AWS CLI configured!"
echo ""
echo "Verifying credentials..."
aws sts get-caller-identity

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ AWS Credentials Successfully Configured!"
    echo "========================================="
    echo "Region: $AWS_REGION"
    echo ""
    echo "Next steps:"
    echo "1. cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform"
    echo "2. terraform init"
    echo "3. terraform plan"
    echo "4. terraform apply"
else
    echo ""
    echo "❌ Error: Failed to verify AWS credentials"
    echo "Please check your Access Key ID and Secret Access Key"
    exit 1
fi
