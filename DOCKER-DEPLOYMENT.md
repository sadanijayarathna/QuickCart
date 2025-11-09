# QuickCart - Docker Deployment Guide

## 🐳 Complete Application Dockerization

This guide covers deploying the complete QuickCart e-commerce application with all features using Docker.

## 📦 Features Included

All application features are fully dockerized:

- ✅ **Authentication**: User login and signup with bcrypt password hashing
- ✅ **Product Catalog**: 38 products across 7 categories
- ✅ **Search Functionality**: Search products by name, category, or description
- ✅ **Shopping Cart**: Add, remove, and manage cart items
- ✅ **Product Details**: Detailed product pages with ratings and reviews
- ✅ **Contact Form**: Contact form submissions saved to MongoDB
- ✅ **Category Filtering**: Browse products by category
- ✅ **Auto-Seeding**: Database automatically seeds with products on first run

## 🏗️ Architecture

The application consists of 3 Docker services:

1. **MongoDB** (Port 27017): Database service
2. **Backend** (Port 5000): Node.js/Express API server
3. **Frontend** (Port 3000): React application

All services are connected via a custom Docker bridge network.

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

### Build and Run

1. **Navigate to project directory:**
   ```bash
   cd C:\Users\User\Desktop\QuickCart
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

   Or run in detached mode:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### First Run

On the first run, the backend will automatically:
- Wait for MongoDB to be ready
- Check if the database is empty
- Seed 38 products across 7 categories
- Start the API server

This process takes about 10-15 seconds.

## 📋 Docker Commands

### Start Services
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (will delete database data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f backend
```

### Check Status
```bash
# View running containers
docker-compose ps

# View container details
docker ps
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Access Container Shell
```bash
# Backend container
docker exec -it quickcart-backend sh

# MongoDB container
docker exec -it quickcart-mongodb mongosh

# Frontend container
docker exec -it quickcart-frontend sh
```

## 🗄️ Database Management

### View Products in MongoDB
```bash
# Access MongoDB shell
docker exec -it quickcart-mongodb mongosh

# In MongoDB shell:
use quickcart
db.products.find().pretty()
db.products.countDocuments()
```

### Reseed Database
```bash
# Access backend container
docker exec -it quickcart-backend sh

# Run seed script
node seedProducts.js
```

### Clear Database
```bash
# Access MongoDB shell
docker exec -it quickcart-mongodb mongosh

# In MongoDB shell:
use quickcart
db.products.deleteMany({})
db.users.deleteMany({})
db.contacts.deleteMany({})
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://mongodb:27017/quickcart
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📊 Service Configuration

### MongoDB Service
- **Image**: mongo:7.0
- **Port**: 27017
- **Volume**: Persistent storage for database data
- **Network**: quickcart-network

### Backend Service
- **Build**: ./backend/Dockerfile
- **Port**: 5000
- **Features**:
  - Auto-connection to MongoDB
  - Automatic database seeding
  - All API endpoints (auth, products, search, contact)
- **Dependencies**: Requires MongoDB

### Frontend Service
- **Build**: ./frontend/Dockerfile
- **Port**: 3000
- **Features**:
  - React development server
  - Hot reload enabled
  - All components and features
- **Dependencies**: Requires Backend

## 🧪 Testing the Deployment

### 1. Test Backend API
```bash
# Check server health
curl http://localhost:5000/api/products

# Test search
curl "http://localhost:5000/api/products?search=apple"

# Test category filter
curl "http://localhost:5000/api/products?category=Fresh%20Fruits"
```

### 2. Test Frontend
- Open browser: http://localhost:3000
- Test login/signup
- Browse products
- Use search functionality
- Add items to cart
- Submit contact form

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /F /PID <PID>
```

### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Rebuild backend
docker-compose up --build backend
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Clear Docker cache and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Database Not Seeding
```bash
# Access backend container
docker exec -it quickcart-backend sh

# Manually run seed script
node seedProducts.js
```

## 🔄 Development vs Production

### Current Setup (Development)
- React development server with hot reload
- Source maps enabled
- Verbose logging

### For Production
Update frontend Dockerfile to use production build:
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📦 Volume Management

### View Volumes
```bash
docker volume ls
```

### Backup Database
```bash
# Create backup
docker exec quickcart-mongodb mongodump --out=/backup

# Copy backup from container
docker cp quickcart-mongodb:/backup ./backup
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backup quickcart-mongodb:/backup

# Restore
docker exec quickcart-mongodb mongorestore /backup
```

## 🎯 Complete Feature List

### Authentication
- User registration with password hashing
- User login with credential validation
- Session management with Context API

### Products
- 38 products across 7 categories
- Product images from multiple CDN sources
- Product details with ratings and reviews
- Stock management

### Search & Filter
- Real-time product search
- Search by name, category, description
- Case-insensitive search
- Category-based filtering

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart state
- Cart item counter

### Contact
- Contact form submission
- Messages saved to MongoDB
- Admin can retrieve all messages
- Status tracking (unread/read/responded)

### UI/UX
- Professional navbar with logo
- Responsive footer
- Toast notifications
- Loading states
- Error handling

## 📝 Notes

- MongoDB data persists in Docker volumes even after containers stop
- Use `docker-compose down -v` to completely reset the database
- Backend automatically waits for MongoDB before starting
- Products are seeded only once on first run
- All services restart automatically on failure

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs <service>`
2. Verify all containers are running: `docker-compose ps`
3. Ensure ports 3000, 5000, and 27017 are available
4. Try rebuilding: `docker-compose up --build`

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ "Connected to MongoDB" in backend logs
- ✅ "Database already has X products" or "Seeding completed successfully"
- ✅ "Server running on port 5000"
- ✅ "Compiled successfully!" in frontend logs
- ✅ Application accessible at http://localhost:3000

Happy Dockerizing! 🐳🚀
