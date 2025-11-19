# ✅ Manual Docker Image Verification Guide

Before pushing your images to Docker Hub, verify everything is working correctly.

---

## Quick Verification Commands

Run these commands in WSL one by one:

```bash
# 1. Navigate to project
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart

# 2. Build images
docker-compose build

# 3. Check images were created
docker images | grep quickcart

# 4. Start containers
docker-compose up -d

# 5. Check containers are running
docker ps

# 6. View logs
docker-compose logs

# 7. Test backend API
curl http://localhost:5000/api/products

# 8. Test frontend
curl http://localhost:3000
```

---

## Detailed Verification Checklist

### ✅ Step 1: Verify Images Exist

```bash
docker images
```

**You should see:**
- `quickcart-backend` or `quickcart_backend`
- `quickcart-frontend` or `quickcart_frontend`
- `mongo:7.0`

**Example output:**
```
REPOSITORY             TAG       IMAGE ID       CREATED         SIZE
quickcart-backend      latest    abc123def456   2 minutes ago   250MB
quickcart-frontend     latest    789ghi012jkl   2 minutes ago   450MB
mongo                  7.0       345mno678pqr   2 weeks ago     750MB
```

✅ **PASS**: All three images listed  
❌ **FAIL**: Missing images - rebuild with `docker-compose build`

---

### ✅ Step 2: Check Image Sizes

```bash
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

**Expected sizes:**
- Backend: ~200-350 MB (node:18-alpine based)
- Frontend: ~400-600 MB (includes React build)
- MongoDB: ~700-800 MB

⚠️ **Warning**: If images are much larger (>1GB), there might be unnecessary files included.

---

### ✅ Step 3: Verify Containers Start

```bash
docker-compose up -d
docker ps
```

**You should see 3 running containers:**

| NAME | STATUS | PORTS |
|------|--------|-------|
| quickcart-backend | Up | 0.0.0.0:5000->5000/tcp |
| quickcart-frontend | Up | 0.0.0.0:3000->3000/tcp |
| quickcart-mongodb | Up | 0.0.0.0:27017->27017/tcp |

✅ **PASS**: All 3 containers show "Up"  
❌ **FAIL**: Containers show "Restarting" or "Exited" - check logs

---

### ✅ Step 4: Check Container Logs

```bash
# Backend logs
docker logs quickcart-backend | tail -20
```

**Should contain:**
```
Server running on port 5000
Connected to MongoDB
```

```bash
# Frontend logs
docker logs quickcart-frontend | tail -20
```

**Should contain:**
```
webpack compiled successfully
Compiled with warnings
```

```bash
# MongoDB logs
docker logs quickcart-mongodb | tail -10
```

**Should contain:**
```
Waiting for connections
```

✅ **PASS**: No error messages, services started  
❌ **FAIL**: Contains errors - investigate specific errors

---

### ✅ Step 5: Test Backend API

```bash
curl http://localhost:5000/api/products
```

**Expected response:** JSON with product data
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "Fresh Milk",
      "price": 3.49,
      ...
    }
  ]
}
```

✅ **PASS**: Returns JSON with products  
❌ **FAIL**: Connection refused or error response

---

### ✅ Step 6: Test Frontend

```bash
curl -I http://localhost:3000
```

**Expected response:**
```
HTTP/1.1 200 OK
Content-Type: text/html
```

**Or visit in browser:** http://localhost:3000

✅ **PASS**: Status 200, page loads  
❌ **FAIL**: Connection refused or 404

---

### ✅ Step 7: Test Full Application

**Open in Windows browser:**

1. **Frontend**: http://localhost:3000
   - [ ] Home page loads
   - [ ] Products page shows items
   - [ ] Can navigate between pages

2. **Backend API**: http://localhost:5000/api/products
   - [ ] Returns JSON data
   - [ ] Shows product list

3. **Test User Flow**:
   - [ ] Can signup
   - [ ] Can login
   - [ ] Can add to cart
   - [ ] Can view cart
   - [ ] Can place order

✅ **PASS**: All features work  
❌ **FAIL**: Features broken - check logs and database

---

### ✅ Step 8: Verify Image Layers

```bash
# Check backend image layers
docker history quickcart-backend | head -10
```

**Should show:**
- FROM node:18-alpine
- WORKDIR /app
- COPY package files
- RUN npm install
- COPY source code
- EXPOSE 5000
- CMD ["node", "docker-startup.js"]

---

### ✅ Step 9: Check Resource Usage

```bash
docker stats --no-stream
```

**Example output:**
```
NAME                  CPU %     MEM USAGE
quickcart-backend     0.5%      50MB
quickcart-frontend    1.2%      120MB
quickcart-mongodb     0.3%      80MB
```

⚠️ **Warning**: If CPU or memory usage is very high, investigate

---

### ✅ Step 10: Test Container Restart

```bash
# Restart all containers
docker-compose restart

# Wait 10 seconds
sleep 10

# Check all still running
docker ps
```

✅ **PASS**: All containers restart and stay running  
❌ **FAIL**: Containers exit after restart - check logs

---

## Final Pre-Push Checklist

Before pushing to Docker Hub, confirm:

- [ ] ✅ All 3 images built successfully
- [ ] ✅ All 3 containers start and stay running
- [ ] ✅ Backend logs show "Server running on port 5000"
- [ ] ✅ Backend logs show "Connected to MongoDB"
- [ ] ✅ Frontend logs show "webpack compiled"
- [ ] ✅ Backend API returns product data
- [ ] ✅ Frontend loads in browser
- [ ] ✅ Can login and use all features
- [ ] ✅ Containers restart successfully
- [ ] ✅ No error messages in logs
- [ ] ✅ Resource usage is reasonable
- [ ] ✅ Image sizes are appropriate

---

## If All Checks Pass ✅

Your images are ready! Proceed with:

```bash
# Option 1: Use automated script
./docker-push.sh

# Option 2: Manual push
docker tag quickcart-backend yourusername/quickcart-backend:latest
docker tag quickcart-frontend yourusername/quickcart-frontend:latest
docker login
docker push yourusername/quickcart-backend:latest
docker push yourusername/quickcart-frontend:latest
```

---

## If Any Check Fails ❌

### Common Issues & Fixes

**1. Images not built:**
```bash
docker-compose build --no-cache
```

**2. Containers won't start:**
```bash
docker-compose down -v
docker-compose up -d
docker-compose logs -f
```

**3. Backend can't connect to MongoDB:**
```bash
# Check MongoDB is running
docker logs quickcart-mongodb

# Restart everything
docker-compose restart
```

**4. Port already in use:**
```bash
# Find and kill process
sudo lsof -i :3000
sudo kill -9 <PID>
```

**5. Permission denied:**
```bash
sudo usermod -aG docker $USER
# Logout and login to WSL
```

**6. Frontend won't compile:**
```bash
# Check frontend logs
docker logs quickcart-frontend -f

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

---

## Quick Test Script

Save and run this in WSL:

```bash
#!/bin/bash
echo "Testing QuickCart Docker Images..."
echo ""

# Test 1: Images exist
echo "1. Checking images..."
docker images | grep -q "quickcart.*backend" && echo "✅ Backend image exists" || echo "❌ Backend image missing"
docker images | grep -q "quickcart.*frontend" && echo "✅ Frontend image exists" || echo "❌ Frontend image missing"

# Test 2: Containers running
echo ""
echo "2. Checking containers..."
docker ps | grep -q "quickcart.*backend" && echo "✅ Backend running" || echo "❌ Backend not running"
docker ps | grep -q "quickcart.*frontend" && echo "✅ Frontend running" || echo "❌ Frontend not running"
docker ps | grep -q "quickcart.*mongodb" && echo "✅ MongoDB running" || echo "❌ MongoDB not running"

# Test 3: API test
echo ""
echo "3. Testing API..."
curl -s http://localhost:5000/api/products > /dev/null && echo "✅ Backend API works" || echo "❌ Backend API fails"

# Test 4: Frontend test
echo ""
echo "4. Testing frontend..."
curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend works" || echo "❌ Frontend fails"

echo ""
echo "Done!"
```

---

## Automated Verification

For comprehensive verification, use the provided script:

```bash
chmod +x verify-docker-images.sh
./verify-docker-images.sh
```

This script will:
- Build all images
- Start all containers
- Test all endpoints
- Verify logs
- Check resource usage
- Provide detailed report

---

## Success Criteria

**Your images are ready to push when:**

1. ✅ `docker images` shows all 3 images
2. ✅ `docker ps` shows all 3 containers running
3. ✅ `docker-compose logs` shows no errors
4. ✅ http://localhost:3000 loads QuickCart
5. ✅ http://localhost:5000/api/products returns data
6. ✅ All application features work correctly

---

🎉 **Once verified, your images are production-ready and safe to push to Docker Hub!**

**Next step**: Run `./docker-push.sh` or follow the push commands in `WSL-DOCKER-COMMANDS.md`
