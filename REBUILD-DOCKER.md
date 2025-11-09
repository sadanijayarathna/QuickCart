# 🔄 Rebuild Docker Containers with All Features

## The Problem

Your Docker containers were built with the initial code (only login/signup). After adding new features (home page, products, search, cart, contact), the containers need to be rebuilt with the updated code.

## ✅ Quick Fix

### Option 1: Use the Rebuild Script (Easiest)
```batch
# Double-click this file:
docker-rebuild.bat
```

This will:
1. Stop existing containers
2. Remove old images
3. Rebuild with fresh code
4. Start all services
5. Show logs

### Option 2: Manual Commands
```powershell
# 1. Stop containers
docker compose down

# 2. Remove old images (force rebuild)
docker rmi quickcart-backend quickcart-frontend

# 3. Build with no cache
docker compose build --no-cache

# 4. Start services
docker compose up -d

# 5. View logs
docker compose logs -f
```

## 📋 What Will Be Rebuilt

### Frontend Container
All React components:
- ✅ Login.jsx
- ✅ SignUp.jsx
- ✅ Home.jsx (with hero and 7 categories)
- ✅ Products.jsx (with search and filtering)
- ✅ ProductDetail.jsx
- ✅ Cart.jsx
- ✅ Contact.jsx
- ✅ Navbar.jsx (with search bar)
- ✅ Footer.jsx

### Backend Container
All API endpoints:
- ✅ POST /api/signup
- ✅ POST /api/login
- ✅ GET /api/products (with search & filter)
- ✅ GET /api/products/:id
- ✅ POST /api/contact
- ✅ GET /api/contact

Plus:
- ✅ Auto-seeding of 38 products
- ✅ All models (User, Product, Contact)

## 🎯 After Rebuild

You will have access to:
1. **Login/Signup** - User authentication
2. **Home Page** - Hero section with 7 category cards
3. **All Products** - Browse 38 products
4. **Search** - Search products by name/category/description
5. **Product Details** - View individual product pages
6. **Shopping Cart** - Add/remove items, update quantities
7. **Contact Form** - Send messages saved to MongoDB
8. **Navbar** - With search functionality and cart counter
9. **Footer** - On all pages

## ⚠️ Important Notes

### Data Persistence
- **MongoDB data persists** - Your registered users and products will remain
- If you want to start completely fresh: `docker compose down -v`

### Build Time
- First rebuild: ~5-7 minutes
- Subsequent rebuilds: ~2-3 minutes

### Verify Success
After rebuild, check:
```powershell
# 1. All containers running
docker compose ps

# 2. Backend logs show seeding
docker compose logs backend

# 3. Frontend compiled
docker compose logs frontend

# 4. Test home page
# Open browser: http://localhost:3000/home
```

## 🧪 Testing After Rebuild

### Test Flow:
1. ✅ Open http://localhost:3000
2. ✅ Login with your existing account
3. ✅ Should redirect to `/home`
4. ✅ See hero section and categories
5. ✅ Click "All Products" in navbar
6. ✅ See all 38 products
7. ✅ Use search bar to search "apple"
8. ✅ Click a product to see details
9. ✅ Add to cart
10. ✅ Check cart icon counter
11. ✅ Visit contact page
12. ✅ All features working!

## 🐛 Troubleshooting

### Issue: Still seeing old version
**Solution:**
```powershell
# Hard reset everything
docker compose down -v
docker system prune -a --volumes
docker compose up --build
```

### Issue: Frontend not loading new components
**Solution:**
```powershell
# Check if files are in the image
docker exec -it quickcart-frontend ls /app/src/components

# Should show: Home.jsx, Products.jsx, etc.
```

### Issue: Backend missing new endpoints
**Solution:**
```powershell
# Check server.js in container
docker exec -it quickcart-backend cat server.js | grep "/api/products"

# Should show the search endpoint
```

### Issue: Port conflicts
**Solution:**
```powershell
# Stop local servers first
# Kill process on port 3000
netstat -ano | findstr ":3000"
taskkill /F /PID <PID>

# Kill process on port 5000
netstat -ano | findstr ":5000"
taskkill /F /PID <PID>

# Then rebuild Docker
```

## 📊 Rebuild Status Checklist

After running rebuild, verify:
- [ ] Backend container shows "Connected to MongoDB"
- [ ] Backend shows "Database already has X products" 
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend shows "Compiled successfully!"
- [ ] Can login and access /home
- [ ] Home page shows categories
- [ ] Products page shows all items
- [ ] Search functionality works
- [ ] Cart functionality works
- [ ] Contact form works

## 🎉 Success!

If all checkboxes above are checked, your Docker containers now have ALL features and your application is fully functional!

Access at: http://localhost:3000
