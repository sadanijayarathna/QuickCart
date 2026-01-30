# 🚀 QuickCart - WSL Docker Commands (Copy & Paste)

## Complete Command Sequence for WSL

Copy and paste these commands one by one in your WSL terminal.

---

## STEP 1: Open WSL and Navigate to Project

```bash
# Open WSL (run this in Windows PowerShell or CMD first)
wsl

# Navigate to your project
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart

# Verify you're in the right directory
pwd
ls -la
```

---

## STEP 2: Verify Docker is Running

```bash
# Check Docker installation
docker --version
docker-compose --version

# Test Docker daemon
docker ps
```

**If you get errors**: Start Docker Desktop on Windows and ensure WSL2 integration is enabled.

---

## STEP 3: Stop Any Running Local Services

```bash
# Kill any running Node processes
pkill -f node

# Verify ports are free
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :27017
```

---

## STEP 4: Make Scripts Executable

```bash
# Make the deployment scripts executable
chmod +x docker-start.sh
chmod +x docker-push.sh

# Verify
ls -l *.sh
```

---

## STEP 5: Build Docker Images

### Option A: Use the Quick Start Script (Recommended)
```bash
./docker-start.sh
```

### Option B: Manual Build
```bash
# Build all images
docker-compose build

# Or build individually
docker-compose build mongodb
docker-compose build backend
docker-compose build frontend
```

---

## STEP 6: View Created Images

```bash
# List all Docker images
docker images

# Filter QuickCart images only
docker images | grep quickcart
```

**You should see:**
- `quickcart-backend`
- `quickcart-frontend`
- `mongo:7.0`

---

## STEP 7: Start All Containers

```bash
# Start in detached mode (background)
docker-compose up -d

# Or start with logs visible
docker-compose up
```

---

## STEP 8: Verify Containers are Running

```bash
# Check container status
docker-compose ps

# Or use docker ps
docker ps

# Check specific container
docker ps | grep quickcart
```

**You should see 3 running containers:**
- `quickcart-mongodb` (port 27017)
- `quickcart-backend` (port 5000)
- `quickcart-frontend` (port 3000)

---

## STEP 9: View Container Logs

```bash
# View all logs
docker-compose logs

# View logs in follow mode (live)
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# View last 50 lines
docker-compose logs --tail=50 backend
```

**Press `Ctrl+C` to exit log viewing**

---

## STEP 10: Test Your Application

```bash
# Test backend API
curl http://localhost:5000/api/products

# Test frontend (should return HTML)
curl http://localhost:3000

# Test MongoDB
docker exec -it quickcart-mongodb mongosh --eval "db.adminCommand('ping')"
```

**Now open in Windows browser:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/products

---

## STEP 11: Tag Images for Docker Hub

**Replace `yourusername` with your actual Docker Hub username:**

```bash
# Set your Docker Hub username
export DOCKER_USER=yourusername

# Tag backend images
docker tag quickcart-backend $DOCKER_USER/quickcart-backend:latest
docker tag quickcart-backend $DOCKER_USER/quickcart-backend:v1.0

# Tag frontend images
docker tag quickcart-frontend $DOCKER_USER/quickcart-frontend:latest
docker tag quickcart-frontend $DOCKER_USER/quickcart-frontend:v1.0

# Verify tags
docker images | grep $DOCKER_USER
```

---

## STEP 12: Login to Docker Hub

```bash
# Login to Docker Hub
docker login

# Enter your Docker Hub username
# Enter your Docker Hub password
```

**Expected output:** `Login Succeeded`

---

## STEP 13: Push Images to Docker Hub

### Option A: Use the Push Script (Recommended)
```bash
./docker-push.sh
```

### Option B: Manual Push
```bash
# Push backend images
docker push $DOCKER_USER/quickcart-backend:latest
docker push $DOCKER_USER/quickcart-backend:v1.0

# Push frontend images
docker push $DOCKER_USER/quickcart-frontend:latest
docker push $DOCKER_USER/quickcart-frontend:v1.0
```

**This will take several minutes. Be patient!**

---

## STEP 14: Verify on Docker Hub

Open in browser: https://hub.docker.com/u/yourusername

You should see:
- `yourusername/quickcart-backend` repository
- `yourusername/quickcart-frontend` repository

---

## 🎉 SUCCESS! You've completed Docker deployment!

---

## Useful Commands After Deployment

### Stop All Containers
```bash
docker-compose down
```

### Stop and Remove All Data (including volumes)
```bash
docker-compose down -v
```

### Restart Containers
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

### View Container Details
```bash
# Show running containers
docker ps

# Show all containers (including stopped)
docker ps -a

# Show container resource usage
docker stats

# Show detailed container info
docker inspect quickcart-backend
```

### Enter Container Shell
```bash
# Enter backend container
docker exec -it quickcart-backend sh

# Enter frontend container
docker exec -it quickcart-frontend sh

# Enter MongoDB container
docker exec -it quickcart-mongodb mongosh
```

### View and Manage Images
```bash
# List all images
docker images

# Remove specific image
docker rmi quickcart-backend

# Remove all unused images
docker image prune -a

# Show disk usage
docker system df
```

### Network Commands
```bash
# List networks
docker network ls

# Inspect network
docker network inspect quickcart-network
```

### Volume Commands
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect quickcart_mongodb_data

# Remove unused volumes
docker volume prune
```

### Clean Up Everything (Careful!)
```bash
# Remove everything (containers, images, volumes, networks)
docker system prune -a --volumes

# This will ask for confirmation before deleting
```

---

## Quick Test Suite

Run these commands to test everything is working:

```bash
# 1. Check containers are running
docker ps | grep quickcart

# 2. Test backend API
curl http://localhost:5000/api/products | jq

# 3. Test MongoDB connection
docker exec -it quickcart-mongodb mongosh --eval "use quickcart; db.products.count()"

# 4. View backend logs
docker-compose logs --tail=20 backend

# 5. View frontend logs
docker-compose logs --tail=20 frontend

# 6. Check container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Troubleshooting Commands

### If containers won't start:
```bash
# Stop everything
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Start again
docker-compose up -d

# Check logs
docker-compose logs -f
```

### If port is already in use:
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process (replace PID with actual process ID)
sudo kill -9 <PID>

# Or kill all node processes
pkill -f node
```

### If Docker daemon not running:
```bash
# Check Docker service
sudo service docker status

# Start Docker service
sudo service docker start

# Or restart Docker Desktop on Windows
```

### If permission denied:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
exit
wsl
```

---

## One-Line Commands for Common Tasks

```bash
# Full restart
docker-compose down && docker-compose up -d --build

# View logs of all services
docker-compose logs -f --tail=100

# Quick status check
docker-compose ps && docker images | grep quickcart

# Full cleanup and fresh start
docker-compose down -v && docker system prune -af && docker-compose up -d --build

# Push all images (after tagging)
docker images | grep quickcart | awk '{print $1":"$2}' | xargs -I {} docker push {}
```

---

## Environment Info

### Check your environment:
```bash
# WSL version
wsl --version

# Docker version
docker --version
docker-compose --version

# System info
uname -a
df -h
free -h

# Docker system info
docker info
docker system df
```

---

## 📋 Copy-Paste Complete Sequence

Here's the complete sequence to copy and paste:

```bash
# 1. Navigate to project
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart

# 2. Verify Docker
docker --version

# 3. Build images
docker-compose build

# 4. Start containers
docker-compose up -d

# 5. Check status
docker ps

# 6. View logs
docker-compose logs -f backend

# 7. Set your Docker Hub username (CHANGE THIS!)
export DOCKER_USER=yourusername

# 8. Tag images
docker tag quickcart-backend $DOCKER_USER/quickcart-backend:latest
docker tag quickcart-frontend $DOCKER_USER/quickcart-frontend:latest

# 9. Login to Docker Hub
docker login

# 10. Push images
docker push $DOCKER_USER/quickcart-backend:latest
docker push $DOCKER_USER/quickcart-frontend:latest

# Done! Check Docker Hub: https://hub.docker.com/u/yourusername
```

---

## 🎊 You're Done!

Your QuickCart application is now:
- ✅ Dockerized
- ✅ Running in containers
- ✅ Images created
- ✅ Pushed to Docker Hub
- ✅ Ready for deployment anywhere!

**Access your app**: http://localhost:3000

**View on Docker Hub**: https://hub.docker.com/u/yourusername

---

💡 **Tip**: Bookmark this file for quick reference!
