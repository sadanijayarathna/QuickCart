#!/bin/bash

# AWS Credentials Setup Script for QuickCart Deployment

echo "========================================="
echo "AWS Credentials Configuration"
echo "========================================="
echo ""
echo "Your current AWS credentials are invalid or expired."
echo "Please follow these steps to configure valid credentials:"
echo ""
echo "1. Log in to AWS Console: https://console.aws.amazon.com/"
echo "2. Go to IAM (Identity and Access Management)"
echo "3. Click on 'Users' in the left sidebar"
echo "4. Select your user or create a new one"
echo "5. Go to 'Security credentials' tab"
echo "6. Click 'Create access key'"
echo "7. Select 'Command Line Interface (CLI)'"
echo "8. Copy the Access Key ID and Secret Access Key"
echo ""
echo "========================================="
echo "Now configure AWS CLI:"
echo "========================================="
echo ""

aws configure

echo ""
echo "Testing AWS credentials..."
if aws sts get-caller-identity; then
    echo ""
    echo "✅ AWS credentials configured successfully!"
    echo ""
    echo "Account Information:"
    aws sts get-caller-identity
    echo ""
    echo "========================================="
    echo "Next Steps:"
    echo "========================================="
    echo "1. Navigate to terraform directory:"
    echo "   cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform"
    echo ""
    echo "2. Run Terraform plan:"
    echo "   terraform plan"
    echo ""
    echo "3. Deploy to AWS:"
    echo "   terraform apply"
    echo ""
else
    echo ""
    echo "❌ Credentials validation failed. Please try again."
    echo ""
fi
