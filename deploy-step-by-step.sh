#!/bin/bash
# QuickCart Deployment Steps

echo "==========================================="
echo "QuickCart Deployment - Step by Step"
echo "==========================================="
echo ""

# Step 1: Test SSH Connection
echo "Step 1: Testing SSH connection..."
timeout 15 ssh -i ~/.ssh/quickcart-key.pem -o StrictHostKeyChecking=no -o ConnectTimeout=10 ubuntu@98.85.243.234 'echo "✓ Connection successful"'

if [ $? -eq 0 ]; then
    echo ""
    echo "Step 2: Uploading updated docker-compose.yaml..."
    cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart
    scp -i ~/.ssh/quickcart-key.pem -o StrictHostKeyChecking=no docker-compose.yaml ubuntu@98.85.243.234:~/QuickCart/docker-compose.yaml
    
    echo ""
    echo "Step 3: Connecting to server and redeploying..."
    ssh -i ~/.ssh/quickcart-key.pem -o StrictHostKeyChecking=no ubuntu@98.85.243.234 << 'ENDSSH'
        echo "→ Navigating to QuickCart directory..."
        cd ~/QuickCart
        
        echo "→ Stopping existing containers..."
        sudo docker-compose down
        
        echo "→ Rebuilding and starting containers..."
        sudo docker-compose up -d --build
        
        echo ""
        echo "→ Checking running containers..."
        sudo docker ps
        
        echo ""
        echo "→ Waiting 10 seconds for containers to initialize..."
        sleep 10
        
        echo ""
        echo "→ Checking application logs..."
        sudo docker-compose logs --tail=30
        
        echo ""
        echo "==========================================="
        echo "✓ Deployment Complete!"
        echo "==========================================="
        echo "Access your application at:"
        echo "  Frontend: http://98.85.243.234:3000"
        echo "  Backend:  http://98.85.243.234:5000"
        echo "==========================================="
ENDSSH
else
    echo ""
    echo " SSH connection failed!"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check if instance is running:"
    echo "   aws ec2 describe-instances --instance-ids i-065c07ec7db8a353c --region us-east-1 --query 'Reservations[0].Instances[0].State.Name'"
    echo ""
    echo "2. Reboot the instance:"
    echo "   aws ec2 reboot-instances --instance-ids i-065c07ec7db8a353c --region us-east-1"
    echo ""
    echo "3. Wait 60 seconds and try this script again"
fi
