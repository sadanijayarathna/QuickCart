# 🐳 QuickCart - Docker Deployment Guide for WSL

## Prerequisites
Before you start, ensure you have:
- ✅ WSL2 installed on Windows
- ✅ Docker Desktop for Windows (with WSL2 backend enabled)
- ✅ Your QuickCart project files accessible in WSL

---

## Step 1: Open WSL Terminal

1. Open Windows Terminal or PowerShell
2. Start WSL:
   ```bash
   wsl
   ```

---

## Step 2: Navigate to Your Project Directory

From WSL, navigate to your QuickCart project:

```bash
# If your project is in Windows file system
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart

# OR if you copied it to WSL home directory
cd ~/QuickCart
```

---

## Step 3: Verify Docker Installation

Check if Docker is running:

```bash
docker --version
docker-compose --version
```

If Docker is not recognized, start Docker Desktop on Windows and ensure WSL integration is enabled.

---

## Step 4: Stop Running Local Services

Before building Docker containers, stop any locally running services:

**On Windows (PowerShell):**
```powershell
# Stop MongoDB if running as service
Stop-Service MongoDB

# Stop Node processes
Get-Process node | Stop-Process -Force
```

**In WSL:**
```bash
# Kill any running node processes
pkill -f node

# Check if MongoDB is running
sudo systemctl stop mongod
```

---

## Step 5: Build Docker Images

### Option A: Build All Services at Once
```bash
docker-compose build
```

### Option B: Build Individual Services
```bash
# Build backend image
docker-compose build backend

# Build frontend image
docker-compose build frontend

# MongoDB uses official image (no build needed)
```

---

## Step 6: View Created Docker Images

List all Docker images:
```bash
docker images
```

You should see:
- `quickcart-backend` (or similar name)
- `quickcart-frontend` (or similar name)
- `mongo:7.0`

---

## Step 7: Start All Containers

Start the entire application:
```bash
docker-compose up -d
```

Flags:
- `-d` = detached mode (runs in background)

---

## Step 8: Verify Containers are Running

Check running containers:
```bash
docker-compose ps
```

or

```bash
docker ps
```

You should see 3 containers:
- `quickcart-mongodb` (port 27017)
- `quickcart-backend` (port 5000)
- `quickcart-frontend` (port 3000)

---

## Step 9: View Container Logs

### View all logs:
```bash
docker-compose logs -f
```

### View specific service logs:
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# MongoDB logs
docker-compose logs -f mongodb
```

Press `Ctrl+C` to exit logs.

---

## Step 10: Access Your Application

From Windows browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## Step 11: Tag Docker Images (For Docker Hub)

Tag your images before pushing:

```bash
# Replace 'yourusername' with your Docker Hub username

# Tag backend image
docker tag quickcart-backend yourusername/quickcart-backend:latest
docker tag quickcart-backend yourusername/quickcart-backend:v1.0

# Tag frontend image
docker tag quickcart-frontend yourusername/quickcart-frontend:latest
docker tag quickcart-frontend yourusername/quickcart-frontend:v1.0
```

---

## Step 12: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password.

---

## Step 13: Push Images to Docker Hub

```bash
# Push backend
docker push yourusername/quickcart-backend:latest
docker push yourusername/quickcart-backend:v1.0

# Push frontend
docker push yourusername/quickcart-frontend:latest
docker push yourusername/quickcart-frontend:v1.0
```

---

## Useful Docker Commands

### Stop All Containers
```bash
docker-compose down
```

### Stop and Remove All Data (including volumes)
```bash
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

### Enter Container Shell
```bash
# Backend container
docker exec -it quickcart-backend sh

# Frontend container
docker exec -it quickcart-frontend sh

# MongoDB container
docker exec -it quickcart-mongodb mongosh
```

### Remove All Unused Images
```bash
docker image prune -a
```

### View Docker Disk Usage
```bash
docker system df
```

### Clean Up Everything (careful!)
```bash
docker system prune -a --volumes
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

### Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
exit
wsl
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker exec -it quickcart-mongodb mongosh

# Inside mongosh, test connection
use quickcart
db.users.find()
```

---

## Project Structure

```
QuickCart/
├── backend/
│   ├── Dockerfile              ← Backend Docker config
│   ├── .dockerignore          ← Files to exclude from Docker
│   ├── docker-startup.js      ← Startup script with auto-seeding
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile              ← Frontend Docker config
│   ├── .dockerignore          ← Files to exclude from Docker
│   ├── package.json
│   └── src/
└── docker-compose.yaml         ← Orchestrates all services
```

---

## Environment Variables

The docker-compose.yaml already configures:
- **Backend**: `MONGO_URI=mongodb://mongodb:27017/quickcart`
- **Frontend**: `REACT_APP_API_URL=http://localhost:5000`
- **MongoDB**: `MONGO_INITDB_DATABASE=quickcart`

---

## Next Steps After Dockerization

1. ✅ Test all features (signup, login, products, cart, payment, orders)
2. ✅ Push images to Docker Hub
3. ✅ Deploy to cloud (AWS, Azure, DigitalOcean, etc.)
4. ✅ Set up CI/CD pipeline (GitHub Actions)
5. ✅ Configure domain and SSL certificate

---

## Quick Start Script

Save this as `docker-start.sh` in your project root:

```bash
#!/bin/bash

echo "🐳 Starting QuickCart Docker Containers..."

# Build images
echo "📦 Building Docker images..."
docker-compose build

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Show running containers
echo "✅ Running containers:"
docker-compose ps

echo ""
echo "🎉 QuickCart is ready!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop: docker-compose down"
```

Make it executable:
```bash
chmod +x docker-start.sh
./docker-start.sh
```

---

## Success Indicators

Your dockerization is successful when:
- ✅ All 3 containers are running (`docker ps`)
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend API responds at http://localhost:5000/api/products
- ✅ MongoDB has seeded data
- ✅ You can signup, login, browse products, add to cart, and place orders

---

🎉 **Congratulations!** Your QuickCart application is now fully dockerized and ready for deployment!
