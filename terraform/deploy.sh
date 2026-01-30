#!/bin/bash

# QuickCart Complete Deployment Script
# Run this in WSL Ubuntu after AWS credentials are configured

set -e

echo "========================================="
echo "QuickCart AWS Deployment Script"
echo "========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in the terraform directory
if [ ! -f "main.tf" ]; then
    echo -e "${RED}❌ Error: main.tf not found${NC}"
    echo "Please run this script from the terraform/ directory"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}🔍 Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Please run: ./setup-aws.sh first"
    exit 1
fi
echo -e "${GREEN}✅ AWS credentials verified${NC}"
echo ""
aws sts get-caller-identity
echo ""

# Step 2: Terraform initialization (if needed)
echo "Step 2: Checking Terraform initialization..."
if [ ! -d ".terraform" ]; then
    echo "Initializing Terraform..."
    terraform init
    echo "✅ Terraform initialized"
else
    echo "✅ Terraform already initialized"
fi
echo ""

# Check Terraform installation
echo -e "${YELLOW}🔍 Checking Terraform installation...${NC}"
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform not found${NC}"
    echo "Please run: ./setup-aws.sh first"
    exit 1
fi
echo -e "${GREEN}✅ Terraform found: $(terraform version | head -n1)${NC}"

# Display current configuration
echo ""
echo "========================================="
echo "Current Configuration"
echo "========================================="
echo "Docker Hub Username: sadanijayarathna"
echo "AWS Region: us-east-1"
echo "Instance Type: t3.micro (Free Tier)"
echo ""

read -p "Continue with deployment? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled"
    exit 0
fi

# Initialize Terraform
echo ""
echo -e "${YELLOW}📦 Initializing Terraform...${NC}"
terraform init
echo -e "${GREEN}✅ Terraform initialized${NC}"

# Format Terraform files
echo ""
echo -e "${YELLOW}🎨 Formatting Terraform files...${NC}"
terraform fmt
echo -e "${GREEN}✅ Files formatted${NC}"

# Validate Terraform configuration
echo ""
echo -e "${YELLOW}✔️  Validating Terraform configuration...${NC}"
terraform validate
echo -e "${GREEN}✅ Configuration valid${NC}"

# Create execution plan
echo ""
echo -e "${YELLOW}📋 Creating execution plan...${NC}"
terraform plan -out=tfplan
echo -e "${GREEN}✅ Plan created${NC}"

# Show plan summary
echo ""
echo "========================================="
echo "Deployment Plan Summary"
echo "========================================="
echo "The following resources will be created:"
echo "  • VPC Security Group (Firewall rules)"
echo "  • SSH Key Pair (for EC2 access)"
echo "  • EC2 Instance (t3.micro - Free Tier)"
echo "  • Elastic IP (fixed public IP)"
echo "  • IAM Role & Instance Profile (for SSM)"
echo ""
echo "Estimated Monthly Cost: \$0 (Free Tier)"
echo ""

read -p "Apply this plan? (yes/no): " apply_confirm
if [ "$apply_confirm" != "yes" ]; then
    echo "Deployment cancelled"
    rm -f tfplan
    exit 0
fi

# Apply Terraform plan
echo ""
echo -e "${YELLOW}🚀 Deploying to AWS...${NC}"
echo "This may take 3-5 minutes..."
terraform apply tfplan

# Clean up plan file
rm -f tfplan

# Get outputs
echo ""
echo "========================================="
echo "🎉 Deployment Complete!"
echo "========================================="
terraform output -json > deployment_info.json

PUBLIC_IP=$(terraform output -raw instance_public_ip 2>/dev/null || echo "N/A")
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "N/A")
BACKEND_URL=$(terraform output -raw backend_url 2>/dev/null || echo "N/A")
SSH_COMMAND=$(terraform output -raw ssh_command 2>/dev/null || echo "N/A")

echo ""
echo -e "${GREEN}✅ QuickCart deployed successfully!${NC}"
echo ""
echo "========================================="
echo "Access Information"
echo "========================================="
echo ""
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "   Alternative: ${FRONTEND_URL}:3000"
echo ""
echo "🔌 Backend API: $BACKEND_URL"
echo ""
echo "🔑 SSH Access:"
echo "   $SSH_COMMAND"
echo ""
echo "========================================="
echo "Important Notes"
echo "========================================="
echo ""
echo "⏳ Wait 2-3 minutes for containers to start"
echo ""
echo "🔍 To check deployment status:"
echo "   $SSH_COMMAND"
echo "   Then run: docker compose ps"
echo ""
echo "📋 To view logs:"
echo "   docker compose logs -f"
echo ""
echo "🔄 To restart services:"
echo "   docker compose restart"
echo ""
echo "========================================="
echo "SSH Key Location"
echo "========================================="
echo ""
echo "Your private SSH key is saved at:"
echo "  $(pwd)/quickcart-key.pem"
echo ""
echo "Keep this file secure!"
echo ""
echo "========================================="
echo "Cost Monitoring"
echo "========================================="
echo ""
echo "⚠️  Free Tier Limits:"
echo "   • 750 hours/month of t2/t3.micro"
echo "   • 30 GB EBS storage"
echo "   • 15 GB data transfer out"
echo ""
echo "💡 To avoid charges:"
echo "   • Run: terraform destroy (when done)"
echo "   • Monitor AWS billing dashboard"
echo ""
echo "========================================="

# Save deployment info
cat > DEPLOYMENT_INFO.txt <<EOF
QuickCart AWS Deployment Information
Generated: $(date)

Frontend URL: $FRONTEND_URL
Backend URL: $BACKEND_URL
Public IP: $PUBLIC_IP

SSH Command:
$SSH_COMMAND

SSH Key Location:
$(pwd)/quickcart-key.pem

To destroy resources:
terraform destroy
EOF

echo ""
echo -e "${GREEN}✅ Deployment info saved to DEPLOYMENT_INFO.txt${NC}"
echo ""

