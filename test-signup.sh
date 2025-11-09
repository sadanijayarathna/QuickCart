#!/bin/bash
# Test signup and display MongoDB data

echo "=== Testing Signup API ==="
curl -s -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"WSL Test User","email":"wsltest@example.com","password":"testpass123","phone":"1112223333"}'

echo ""
echo ""
echo "=== All Users in Docker MongoDB ==="
sudo docker exec quickcart-mongodb mongosh --quiet quickcart --eval 'db.users.find().forEach(printjson)'

echo ""
echo "=== Total User Count ==="
sudo docker exec quickcart-mongodb mongosh --quiet quickcart --eval 'print("Total users:", db.users.countDocuments())'
