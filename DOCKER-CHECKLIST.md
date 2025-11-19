# ✅ QuickCart Docker Deployment Checklist

## 📋 Pre-Deployment Checklist

### Windows Environment
- [ ] Windows 10/11 Pro, Enterprise, or Education (for WSL2)
- [ ] WSL2 installed and configured
- [ ] Docker Desktop for Windows installed
- [ ] Docker Desktop is running
- [ ] WSL2 integration enabled in Docker Desktop settings
- [ ] Git installed (optional, for version control)

### Project Files
- [ ] QuickCart project files ready
- [ ] `docker-compose.yaml` exists in project root
- [ ] `backend/Dockerfile` exists
- [ ] `frontend/Dockerfile` exists
- [ ] `.dockerignore` files present in both backend and frontend

---

## 🚀 Step-by-Step Deployment

### Step 1: Open WSL Terminal
```bash
# From Windows PowerShell or CMD
wsl
```
- [ ] WSL terminal opened successfully

### Step 2: Navigate to Project
```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart
```
- [ ] Navigated to project directory
- [ ] Run `ls` to verify files are present

### Step 3: Verify Docker Installation
```bash
docker --version
docker-compose --version
docker ps
```
- [ ] Docker version displayed
- [ ] docker-compose version displayed
- [ ] Docker daemon is running (no errors from `docker ps`)

### Step 4: Stop Local Services
```bash
# Stop any running Node processes
pkill -f node

# Check ports are free
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :27017
```
- [ ] No processes running on port 3000
- [ ] No processes running on port 5000
- [ ] No processes running on port 27017

### Step 5: Make Scripts Executable
```bash
chmod +x docker-start.sh
chmod +x docker-push.sh
```
- [ ] Scripts are executable

### Step 6: Build Docker Images
```bash
# Option A: Use script
./docker-start.sh

# Option B: Manual build
docker-compose build
```
- [ ] Build started without errors
- [ ] Backend image built successfully
- [ ] Frontend image built successfully
- [ ] MongoDB image pulled successfully

Expected output:
```
Successfully built <image-id>
Successfully tagged quickcart-backend:latest
Successfully tagged quickcart-frontend:latest
```

### Step 7: Verify Images Created
```bash
docker images
```
- [ ] `quickcart-backend` image listed
- [ ] `quickcart-frontend` image listed
- [ ] `mongo:7.0` image listed

### Step 8: Start Containers
```bash
docker-compose up -d
```
- [ ] All containers started
- [ ] No error messages

### Step 9: Check Container Status
```bash
docker-compose ps
# or
docker ps
```
- [ ] `quickcart-mongodb` container running (port 27017)
- [ ] `quickcart-backend` container running (port 5000)
- [ ] `quickcart-frontend` container running (port 3000)
- [ ] All containers show "Up" status

### Step 10: View Container Logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```
- [ ] Backend shows "Server running on port 5000"
- [ ] Backend shows "Connected to MongoDB"
- [ ] Frontend compiled without errors
- [ ] MongoDB started successfully

### Step 11: Test Application Access
```bash
# Test backend API
curl http://localhost:5000/api/products

# Test frontend
curl http://localhost:3000
```
- [ ] Backend API returns product data (JSON)
- [ ] Frontend returns HTML content

### Step 12: Open in Browser
Open Windows browser and visit:
- http://localhost:3000 (Frontend)
- http://localhost:5000/api/products (Backend API)

- [ ] Frontend loads successfully
- [ ] Can see QuickCart home page
- [ ] Products page displays products
- [ ] Can signup/login
- [ ] Can add products to cart
- [ ] Can place orders (COD and Online)
- [ ] Orders appear in "My Orders"

---

## 🐳 Docker Hub Deployment

### Step 13: Prepare for Docker Hub
- [ ] Docker Hub account created (https://hub.docker.com)
- [ ] Know your Docker Hub username

### Step 14: Login to Docker Hub
```bash
docker login
```
- [ ] Enter Docker Hub username
- [ ] Enter Docker Hub password
- [ ] Login successful

### Step 15: Tag Images
```bash
# Replace 'yourusername' with your actual Docker Hub username
export DOCKER_USER=yourusername

docker tag quickcart-backend $DOCKER_USER/quickcart-backend:latest
docker tag quickcart-backend $DOCKER_USER/quickcart-backend:v1.0
docker tag quickcart-frontend $DOCKER_USER/quickcart-frontend:latest
docker tag quickcart-frontend $DOCKER_USER/quickcart-frontend:v1.0
```
- [ ] Backend images tagged
- [ ] Frontend images tagged

### Step 16: Verify Tagged Images
```bash
docker images | grep quickcart
```
- [ ] See images with your Docker Hub username

### Step 17: Push to Docker Hub
```bash
# Option A: Use script
./docker-push.sh

# Option B: Manual push
docker push $DOCKER_USER/quickcart-backend:latest
docker push $DOCKER_USER/quickcart-backend:v1.0
docker push $DOCKER_USER/quickcart-frontend:latest
docker push $DOCKER_USER/quickcart-frontend:v1.0
```
- [ ] Backend:latest pushed
- [ ] Backend:v1.0 pushed
- [ ] Frontend:latest pushed
- [ ] Frontend:v1.0 pushed

### Step 18: Verify on Docker Hub
Visit: https://hub.docker.com/u/yourusername

- [ ] quickcart-backend repository visible
- [ ] quickcart-frontend repository visible
- [ ] Images have correct tags (latest, v1.0)
- [ ] Image sizes shown
- [ ] Last pushed time is recent

---

## ✅ Final Verification

### Application Testing
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend API working at http://localhost:5000
- [ ] MongoDB data persists after container restart
- [ ] All features work correctly:
  - [ ] User signup
  - [ ] User login
  - [ ] Browse products
  - [ ] Search products
  - [ ] View product details
  - [ ] Add to cart
  - [ ] View cart
  - [ ] Proceed to checkout
  - [ ] Place COD order
  - [ ] Place online payment order
  - [ ] View my orders
  - [ ] Cancel order
  - [ ] Contact form

### Docker Verification
- [ ] All containers restart successfully after `docker-compose restart`
- [ ] Data persists after stopping/starting containers
- [ ] Logs show no errors
- [ ] Container resource usage is reasonable

### Docker Hub Verification
- [ ] Images visible on Docker Hub
- [ ] Images can be pulled by others
- [ ] Repository descriptions added (optional)
- [ ] README files added to repositories (optional)

---

## 📊 Resource Usage

Check resource usage:
```bash
docker stats
```

Expected approximate sizes:
- Backend image: ~200-300 MB
- Frontend image: ~400-500 MB
- MongoDB image: ~700-800 MB

---

## 🎯 Success Criteria

You have successfully dockerized QuickCart when:

### ✅ Build & Run
- [x] Docker images build without errors
- [x] All containers start successfully
- [x] Containers remain running (not restarting)
- [x] No errors in container logs

### ✅ Application Works
- [x] Frontend loads in browser
- [x] All pages navigate correctly
- [x] API endpoints return data
- [x] Database operations work
- [x] Orders can be placed and viewed

### ✅ Docker Hub
- [x] Images tagged correctly
- [x] Images pushed to Docker Hub
- [x] Images visible in Docker Hub dashboard
- [x] Others can pull your images

### ✅ Documentation
- [x] README updated with Docker instructions
- [x] Environment variables documented
- [x] Docker commands documented

---

## 📝 Useful Commands Reference

### Quick Commands
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker ps
```

---

## 🐛 Troubleshooting Checklist

If something doesn't work:

- [ ] Check Docker Desktop is running
- [ ] Check all containers are running (`docker ps`)
- [ ] Check logs for errors (`docker-compose logs`)
- [ ] Verify ports are not in use
- [ ] Try rebuilding images (`docker-compose build --no-cache`)
- [ ] Try removing volumes and starting fresh (`docker-compose down -v`)
- [ ] Check network connectivity between containers
- [ ] Verify environment variables in docker-compose.yaml

---

## 🎉 Congratulations!

If all checkboxes are checked, you have successfully:
- ✅ Dockerized your QuickCart application
- ✅ Created Docker images in WSL
- ✅ Pushed images to Docker Hub
- ✅ Made your application portable and deployable anywhere

### Next Steps:
1. Deploy to cloud (AWS, Azure, DigitalOcean, etc.)
2. Set up CI/CD pipeline
3. Configure domain and SSL
4. Add monitoring and logging
5. Implement backup strategy

---

## 📚 Additional Resources

- Docker Documentation: https://docs.docker.com
- Docker Hub: https://hub.docker.com
- Docker Compose: https://docs.docker.com/compose
- WSL2 Setup: https://docs.microsoft.com/en-us/windows/wsl

---

**Date Completed**: _______________

**Docker Hub Username**: _______________

**Image Tags Used**: _______________

**Notes**: 
_____________________________________________
_____________________________________________
_____________________________________________

---

🚀 **Your QuickCart application is now production-ready and cloud-deployable!**
