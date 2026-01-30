#!/bin/bash
# QuickCart Server Check Script

KEY_FILE=~/quickcart-key.pem
SERVER_IP=34.228.33.199

echo "========================================="
echo "Checking QuickCart Server Status"
echo "========================================="
echo ""

echo "1. Checking if server is reachable..."
if ping -c 1 $SERVER_IP &> /dev/null; then
    echo "   ✅ Server is online"
else
    echo "   ❌ Server not reachable"
fi
echo ""

echo "2. Checking Docker containers..."
ssh -o StrictHostKeyChecking=no -i $KEY_FILE ubuntu@$SERVER_IP 'docker ps'
echo ""

echo "3. Checking if QuickCart is running..."
ssh -o StrictHostKeyChecking=no -i $KEY_FILE ubuntu@$SERVER_IP 'cd /opt/quickcart && docker compose ps'
echo ""

echo "========================================="
echo "Application URLs:"
echo "Frontend: http://$SERVER_IP"
echo "Backend:  http://$SERVER_IP:5000"
echo "========================================="
