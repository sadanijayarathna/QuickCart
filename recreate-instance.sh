#!/bin/bash
# QuickCart - Recreate Instance with Correct Configuration

echo "==========================================="
echo "QuickCart Instance Recreation"
echo "==========================================="
echo ""
echo "This will:"
echo "1. Destroy the old instance (with SSH issues)"
echo "2. Create a new instance with correct configuration"
echo "3. Deploy your application automatically"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Navigate to terraform directory
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform || exit 1

echo ""
echo "Step 1: Destroying old instance..."
terraform destroy -auto-approve

if [ $? -ne 0 ]; then
    echo "❌ Error destroying instance. Please check Terraform installation."
    echo "Try running manually: cd terraform && terraform destroy"
    exit 1
fi

echo ""
echo "Step 2: Creating new instance with correct configuration..."
terraform apply -auto-approve

if [ $? -ne 0 ]; then
    echo "❌ Error creating instance. Please check Terraform configuration."
    exit 1
fi

echo ""
echo "Step 3: Waiting for instance to initialize (120 seconds)..."
sleep 120

# Get new instance IP
NEW_IP=$(terraform output -raw instance_public_ip 2>/dev/null)

if [ -z "$NEW_IP" ]; then
    echo "⚠️  Could not get instance IP. Check terraform outputs manually."
    terraform output
    exit 1
fi

echo ""
echo "==========================================="
echo "✅ Instance Recreation Complete!"
echo "==========================================="
echo ""
echo "New Instance IP: $NEW_IP"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://$NEW_IP:3000"
echo "   Backend:  http://$NEW_IP:5000"
echo ""
echo "🔐 SSH Access:"
echo "   ssh -i quickcart-key.pem ubuntu@$NEW_IP"
echo ""
echo "Note: Wait 2-3 minutes for Docker containers to fully start"
echo "==========================================="
