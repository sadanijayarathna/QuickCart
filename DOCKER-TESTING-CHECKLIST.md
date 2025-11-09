# QuickCart Docker Testing Checklist

## ✅ Pre-Deployment Checklist

### 1. Docker Environment
- [ ] Docker Desktop is installed
- [ ] Docker Desktop is running
- [ ] Docker version check: `docker --version`
- [ ] Docker Compose available: `docker compose version`

### 2. Port Availability
Check these ports are free:
- [ ] Port 3000 (Frontend)
- [ ] Port 5000 (Backend)
- [ ] Port 27017 (MongoDB)

Check with:
```powershell
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5000"
netstat -ano | findstr ":27017"
```

### 3. Project Files
Verify all files exist:
- [ ] `docker-compose.yaml`
- [ ] `backend/Dockerfile`
- [ ] `backend/docker-startup.js`
- [ ] `backend/seedProducts.js`
- [ ] `frontend/Dockerfile`

## 🚀 Deployment Steps

### Step 1: Navigate to Project
```powershell
cd C:\Users\User\Desktop\QuickCart
```

### Step 2: Clean Previous Containers (if any)
```powershell
docker compose down -v
```

### Step 3: Build Images
```powershell
docker compose build
```

Expected output:
- Building backend...
- Building frontend...
- Successfully built...

### Step 4: Start Services
```powershell
docker compose up -d
```

### Step 5: Monitor Startup
```powershell
docker compose logs -f
```

Watch for these success indicators:
- [ ] MongoDB: "Waiting for connections"
- [ ] Backend: "Connected to MongoDB"
- [ ] Backend: "Database already has X products" OR "Seeding completed successfully"
- [ ] Backend: "Server running on port 5000"
- [ ] Frontend: "Compiled successfully!"

## 🧪 Functional Testing

### 1. Backend API Tests

#### Test 1: Products Endpoint
```powershell
curl http://localhost:5000/api/products
```
✅ Should return JSON with products array

#### Test 2: Search Functionality
```powershell
curl "http://localhost:5000/api/products?search=apple"
```
✅ Should return products matching "apple"

#### Test 3: Category Filter
```powershell
curl "http://localhost:5000/api/products?category=Fresh%20Fruits"
```
✅ Should return only Fresh Fruits category products

#### Test 4: Specific Product
```powershell
# Get a product ID from products list first, then:
curl http://localhost:5000/api/products/{PRODUCT_ID}
```
✅ Should return single product details

### 2. Frontend Tests (Browser)

#### Test 1: Home Page
- [ ] Open http://localhost:3000
- [ ] Page loads without errors
- [ ] Navbar displays with logo and links
- [ ] Hero section "Welcome to QuickCart" visible
- [ ] 7 category cards display with images
- [ ] Footer displays at bottom

#### Test 2: Authentication
- [ ] Click "Login" or navigate to root (/)
- [ ] Login form displays
- [ ] Click "Sign Up"
- [ ] Fill form: Name, Email, Password, Phone
- [ ] Click "Sign Up" button
- [ ] Success message: "Account created!"
- [ ] Redirects to login page
- [ ] Login with created credentials
- [ ] Success: Redirected to /home
- [ ] Profile icon appears in navbar

#### Test 3: Product Browsing
- [ ] Navigate to "All Products"
- [ ] All 38 products display in grid
- [ ] Product images load correctly
- [ ] Product names, prices, ratings visible
- [ ] Click a product card
- [ ] Redirects to product detail page
- [ ] Product details display correctly

#### Test 4: Search Functionality
- [ ] Type "milk" in search bar
- [ ] Press Enter or click search icon
- [ ] Navigates to products page
- [ ] Shows "Search Results for 'milk'"
- [ ] Displays matching products
- [ ] Try other searches: "bread", "apple", "juice"

#### Test 5: Category Filtering
- [ ] Go to home page
- [ ] Click "Shop Now" on a category (e.g., Fresh Fruits)
- [ ] Products page opens
- [ ] Shows only that category's products
- [ ] Page title shows category name

#### Test 6: Shopping Cart
- [ ] Browse to any product
- [ ] Click "Add to Cart" button
- [ ] Toast notification appears: "Added to Cart!"
- [ ] Cart counter badge increments
- [ ] Click cart icon in navbar
- [ ] Product appears in cart
- [ ] Adjust quantity with +/- buttons
- [ ] Price updates correctly
- [ ] Click "Remove" button
- [ ] Product removed from cart
- [ ] Add multiple products
- [ ] Verify total calculation

#### Test 7: Contact Form
- [ ] Navigate to "Contact"
- [ ] Fill all fields: Name, Email, Subject, Message
- [ ] Click "Send Message"
- [ ] Success message appears: "Message sent successfully!"
- [ ] Form clears automatically

### 3. Database Verification

#### Check Products in MongoDB
```powershell
docker exec -it quickcart-mongodb mongosh
```

In MongoDB shell:
```javascript
use quickcart
db.products.countDocuments()  // Should return 38
db.products.find({category: "Fresh Fruits"})  // Should return 7 fruits
db.products.find({name: /apple/i})  // Should find Red Apple
```

#### Check Users Collection
```javascript
db.users.find().pretty()  // Should show registered users
```

#### Check Contacts Collection
```javascript
db.contacts.find().pretty()  // Should show contact form submissions
```

## 📊 Performance Checks

### Container Resource Usage
```powershell
docker stats
```
- [ ] CPU usage reasonable (<50% idle)
- [ ] Memory usage acceptable
- [ ] No containers restarting

### Container Health
```powershell
docker compose ps
```
All services should show "Up" status

## 🐛 Common Issues & Solutions

### Issue 1: Backend Container Exits Immediately
**Solution:**
```powershell
docker compose logs backend
```
Check for MongoDB connection errors. Ensure MongoDB container is running.

### Issue 2: Frontend Shows "Could not connect to server"
**Solution:**
- Verify backend is running: `docker compose ps`
- Check backend logs: `docker compose logs backend`
- Test backend directly: `curl http://localhost:5000/api/products`

### Issue 3: Products Not Seeding
**Solution:**
```powershell
# Manually seed
docker exec -it quickcart-backend node seedProducts.js
```

### Issue 4: Port Already in Use
**Solution:**
```powershell
# Find and kill process
netstat -ano | findstr ":5000"
taskkill /F /PID <PID>
```

### Issue 5: Container Won't Start
**Solution:**
```powershell
# Complete reset
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## 🎯 Success Criteria

All tests pass when:
- [x] All containers running and healthy
- [x] 38 products seeded in database
- [x] Frontend accessible at http://localhost:3000
- [x] Backend API responding at http://localhost:5000
- [x] User registration and login working
- [x] Product search and filtering working
- [x] Shopping cart functionality working
- [x] Contact form submissions saving to database
- [x] No error messages in browser console
- [x] No error messages in Docker logs

## 📝 Test Results Log

Date: _________________
Tester: _________________

| Test Category | Status | Notes |
|--------------|--------|-------|
| Docker Environment | ☐ Pass ☐ Fail | |
| Port Availability | ☐ Pass ☐ Fail | |
| Image Build | ☐ Pass ☐ Fail | |
| Container Startup | ☐ Pass ☐ Fail | |
| Database Seeding | ☐ Pass ☐ Fail | |
| Backend API | ☐ Pass ☐ Fail | |
| Authentication | ☐ Pass ☐ Fail | |
| Product Browsing | ☐ Pass ☐ Fail | |
| Search | ☐ Pass ☐ Fail | |
| Cart | ☐ Pass ☐ Fail | |
| Contact Form | ☐ Pass ☐ Fail | |

Overall Result: ☐ **PASS** ☐ **FAIL**

---

**Note:** Keep this checklist handy for testing after each Docker deployment!
