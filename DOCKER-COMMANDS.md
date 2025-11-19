# 🐳 QuickCart Docker - Quick Command Reference

## Essential Commands

### Start Everything
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

---

## Step-by-Step: Build and Push to Docker Hub

### 1. Open WSL
```bash
wsl
```

### 2. Navigate to Project
```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart
```

### 3. Make Scripts Executable
```bash
chmod +x docker-start.sh
chmod +x docker-push.sh
```

### 4. Build and Start Containers
```bash
./docker-start.sh
```

OR manually:
```bash
docker-compose build
docker-compose up -d
```

### 5. Verify Containers Running
```bash
docker ps
```

You should see 3 containers:
- quickcart-mongodb
- quickcart-backend  
- quickcart-frontend

### 6. View Docker Images
```bash
docker images
```

### 7. Tag Images for Docker Hub
```bash
# Replace 'yourusername' with your Docker Hub username
docker tag quickcart-backend yourusername/quickcart-backend:latest
docker tag quickcart-backend yourusername/quickcart-backend:v1.0
docker tag quickcart-frontend yourusername/quickcart-frontend:latest
docker tag quickcart-frontend yourusername/quickcart-frontend:v1.0
```

### 8. Login to Docker Hub
```bash
docker login
```

### 9. Push Images
```bash
# Push backend
docker push yourusername/quickcart-backend:latest
docker push yourusername/quickcart-backend:v1.0

# Push frontend
docker push yourusername/quickcart-frontend:latest
docker push yourusername/quickcart-frontend:v1.0
```

OR use the script:
```bash
./docker-push.sh
```

---

## Troubleshooting Commands

### Check Container Status
```bash
docker-compose ps
docker ps -a
```

### View Container Logs
```bash
docker logs quickcart-backend
docker logs quickcart-frontend
docker logs quickcart-mongodb
```

### Enter Container Shell
```bash
docker exec -it quickcart-backend sh
docker exec -it quickcart-frontend sh
docker exec -it quickcart-mongodb mongosh
```

### Check MongoDB Data
```bash
docker exec -it quickcart-mongodb mongosh
```
Then in mongosh:
```javascript
use quickcart
db.products.find()
db.users.find()
db.orders.find()
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove all unused images
docker image prune -a

# Clean everything (careful!)
docker system prune -a --volumes
```

### Port Issues
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

---

## Image Information

### List Images
```bash
docker images
```

### Remove Image
```bash
docker rmi quickcart-backend
docker rmi quickcart-frontend
```

### Image Size
```bash
docker images quickcart-backend
docker images quickcart-frontend
```

### Inspect Image
```bash
docker inspect quickcart-backend
```

---

## Network Commands

### List Networks
```bash
docker network ls
```

### Inspect Network
```bash
docker network inspect quickcart-network
```

---

## Volume Commands

### List Volumes
```bash
docker volume ls
```

### Inspect Volume
```bash
docker volume inspect quickcart_mongodb_data
```

### Remove Volume
```bash
docker volume rm quickcart_mongodb_data
```

---

## Docker Hub Commands

### Login
```bash
docker login
```

### Logout
```bash
docker logout
```

### Search Images
```bash
docker search quickcart
```

### Pull Image
```bash
docker pull yourusername/quickcart-backend:latest
```

---

## Testing After Deployment

### Test Backend API
```bash
curl http://localhost:5000/api/products
```

### Test Frontend
```bash
curl http://localhost:3000
```

### Test MongoDB Connection
```bash
docker exec -it quickcart-mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## Quick Start Script

Run this single command to build and start everything:
```bash
./docker-start.sh
```

Or push to Docker Hub:
```bash
./docker-push.sh
```

---

## Container Names

- `quickcart-mongodb` - MongoDB Database
- `quickcart-backend` - Node.js Backend API
- `quickcart-frontend` - React Frontend

---

## Common Issues & Fixes

### "Port already in use"
```bash
docker-compose down
# Then kill the process using the port
sudo lsof -i :3000
sudo kill -9 <PID>
```

### "Cannot connect to Docker daemon"
- Start Docker Desktop on Windows
- Enable WSL2 integration in Docker Desktop settings

### "Permission denied"
```bash
sudo usermod -aG docker $USER
# Logout and login to WSL again
```

### Containers won't start
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## Success Checklist

- [ ] WSL installed and running
- [ ] Docker Desktop running on Windows
- [ ] Docker commands work in WSL (`docker --version`)
- [ ] Project files accessible in WSL
- [ ] `docker-compose build` completes successfully
- [ ] `docker-compose up -d` starts all containers
- [ ] `docker ps` shows 3 running containers
- [ ] http://localhost:3000 opens QuickCart frontend
- [ ] http://localhost:5000/api/products returns product data
- [ ] Images tagged with your Docker Hub username
- [ ] Logged in to Docker Hub (`docker login`)
- [ ] Images pushed successfully to Docker Hub

---

🎉 **You're all set!** Your QuickCart application is fully dockerized!
