#!/bin/bash
# Script to redeploy QuickCart application with updated configuration

SERVER_IP="98.85.243.234"
SSH_KEY="~/.ssh/quickcart-key.pem"

echo "================================================"
echo "Redeploying QuickCart Application"
echo "================================================"

echo ""
echo "Step 1: Connecting to EC2 instance..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@$SERVER_IP << 'ENDSSH'

echo "Step 2: Navigating to application directory..."
cd ~/QuickCart || cd /home/ubuntu/QuickCart || cd /opt/QuickCart

echo "Step 3: Stopping existing containers..."
sudo docker-compose down

echo "Step 4: Pulling latest changes from repository..."
git pull origin main || echo "Skipping git pull - not a git repository"

echo "Step 5: Rebuilding and starting containers..."
sudo docker-compose up -d --build

echo "Step 6: Checking running containers..."
sudo docker ps

echo "Step 7: Checking application logs..."
sleep 5
sudo docker-compose logs --tail=50

echo ""
echo "================================================"
echo "Deployment Complete!"
echo "================================================"
echo "Access your application at:"
echo "  Frontend: http://98.85.243.234:3000"
echo "  Backend:  http://98.85.243.234:5000"

ENDSSH

echo ""
echo "Deployment script finished!"
