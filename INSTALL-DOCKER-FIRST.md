# 🐳 Docker Installation & QuickCart Build Guide

## ⚠️ Docker is Not Installed

Docker Desktop is required to build and run Docker containers.

## 📥 Step 1: Install Docker Desktop

### Download & Install:

1. **Download Docker Desktop for Windows:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Or direct link: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe

2. **Run the Installer:**
   - Double-click the downloaded `Docker Desktop Installer.exe`
   - Follow the installation wizard
   - **Important:** Enable WSL 2 if prompted (recommended)
   - Restart your computer when prompted

3. **Start Docker Desktop:**
   - Find "Docker Desktop" in Start Menu
   - Launch the application
   - Wait for Docker engine to start (icon in system tray will stop animating)
   - Accept the terms if prompted

4. **Verify Installation:**
   ```powershell
   docker --version
   docker compose version
   ```
   You should see version numbers (e.g., Docker version 24.0.x)

---

## 🚀 Step 2: Build QuickCart Docker Images

Once Docker Desktop is installed and running:

### Option A: Using Batch Script (Easiest)

1. Make sure Docker Desktop is running (check system tray)
2. Navigate to: `C:\Users\User\Desktop\QuickCart`
3. **Double-click:** `docker-rebuild.bat`
4. Wait 5-7 minutes for build to complete

### Option B: Using PowerShell

```powershell
# Navigate to project
cd C:\Users\User\Desktop\QuickCart

# Build all images
docker compose build --no-cache

# Start all containers
docker compose up -d

# View logs
docker compose logs -f
```

### Option C: Using PowerShell Menu

```powershell
# Run the management script
.\docker-manage.ps1

# Choose option 11 (Rebuild with latest code)
```

---

## 📦 What Will Be Built

### 3 Docker Images:

1. **MongoDB** (mongo:7.0)
   - Official MongoDB image
   - ~700 MB download

2. **quickcart-backend**
   - Node.js 18 Alpine base
   - Your backend code
   - All API endpoints
   - Auto-seeding script
   - ~150 MB

3. **quickcart-frontend**
   - Node.js 18 Alpine base
   - React application
   - All components
   - ~500 MB

**Total Build Time:** ~5-7 minutes (first time)
**Total Size:** ~1.4 GB

---

## 🎯 Features Included in Docker Images

### Backend Container:
- ✅ User registration & login
- ✅ Product API (38 products)
- ✅ Search endpoint
- ✅ Category filtering
- ✅ Contact form endpoint
- ✅ Auto-database seeding
- ✅ MongoDB connection

### Frontend Container:
- ✅ Login/Signup pages
- ✅ Home page with hero & categories
- ✅ Products listing page
- ✅ Product detail pages
- ✅ Shopping cart
- ✅ Contact form
- ✅ Navbar with search
- ✅ Footer component
- ✅ All routing configured

### Database Container:
- ✅ MongoDB 7.0
- ✅ Persistent storage
- ✅ Auto-initialized

---

## 🔍 Build Process Explained

When you run the build:

```
Step 1: Download MongoDB image
  └─ Pulling official mongo:7.0 from Docker Hub

Step 2: Build Backend
  └─ FROM node:18-alpine
  └─ COPY package files
  └─ npm install (backend dependencies)
  └─ COPY all backend code
  └─ COPY models (User, Product, Contact)
  └─ COPY server.js
  └─ COPY seedProducts.js
  └─ COPY docker-startup.js
  └─ Set CMD to start with auto-seeding

Step 3: Build Frontend
  └─ FROM node:18-alpine
  └─ COPY package files
  └─ npm install (React + dependencies)
  └─ COPY all frontend code
  └─ COPY all components
  └─ COPY all contexts
  └─ COPY all styles
  └─ Set CMD to start React dev server

Step 4: Create Network
  └─ quickcart-network (bridge)

Step 5: Create Volume
  └─ mongodb_data (persistent storage)
```

---

## ✅ Verify Docker Installation

Before building, verify Docker is working:

```powershell
# Check Docker version
docker --version

# Check Docker is running
docker ps

# Check Docker Compose
docker compose version

# Test Docker with hello-world
docker run hello-world
```

If all commands work, Docker is ready!

---

## 🎬 After Building Images

Once build completes:

1. **Containers will auto-start:**
   - quickcart-mongodb (Port 27017)
   - quickcart-backend (Port 5000)
   - quickcart-frontend (Port 3000)

2. **Backend will auto-seed:**
   - Waits for MongoDB
   - Seeds 38 products
   - Starts API server

3. **Access your application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

4. **Test the application:**
   - Sign up a new account
   - Login
   - See home page with categories
   - Browse products
   - Use search
   - Add to cart
   - Submit contact form

---

## 🛠️ System Requirements

### Minimum:
- Windows 10/11 (64-bit)
- 4 GB RAM
- 20 GB free disk space
- Virtualization enabled in BIOS

### Recommended:
- Windows 11 (64-bit)
- 8 GB RAM
- 50 GB free disk space
- SSD drive

---

## ⚡ Quick Start Commands (After Docker Install)

```powershell
# Navigate to project
cd C:\Users\User\Desktop\QuickCart

# One-command build & start
docker compose up --build -d

# View what's running
docker compose ps

# View logs
docker compose logs -f

# Stop everything
docker compose down

# Start again (without rebuild)
docker compose up -d
```

---

## 🐛 Troubleshooting

### Docker Desktop won't start:
- Enable Virtualization in BIOS
- Enable Hyper-V in Windows Features
- Restart computer

### WSL 2 Error:
- Install WSL 2: `wsl --install`
- Restart computer
- Start Docker Desktop

### Build fails:
- Check internet connection
- Ensure ports 3000, 5000, 27017 are free
- Try: `docker system prune -a`
- Rebuild: `docker compose build --no-cache`

### Permission errors:
- Run PowerShell as Administrator
- Restart Docker Desktop

---

## 📚 Additional Resources

- Docker Desktop Docs: https://docs.docker.com/desktop/
- Docker Compose Docs: https://docs.docker.com/compose/
- WSL 2 Setup: https://docs.microsoft.com/en-us/windows/wsl/install

---

## 🎉 Next Steps

1. **Install Docker Desktop** (if not already)
2. **Wait for Docker to fully start**
3. **Run:** `docker-rebuild.bat`
4. **Wait 5-7 minutes**
5. **Open:** http://localhost:3000
6. **Enjoy your fully dockerized QuickCart!** 🚀

---

**Note:** Make sure Docker Desktop is running (green icon in system tray) before building!
