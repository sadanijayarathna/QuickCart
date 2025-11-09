@echo off
REM QuickCart - Rebuild Docker with Latest Code
echo ============================================
echo   Rebuilding QuickCart with All Features
echo ============================================
echo.

cd /d "%~dp0"

echo Step 1: Stopping existing containers...
docker compose down

echo.
echo Step 2: Removing old images to force rebuild...
docker rmi quickcart-backend quickcart-frontend 2>nul

echo.
echo Step 3: Building fresh images with all features...
docker compose build --no-cache

echo.
echo Step 4: Starting all services...
docker compose up -d

echo.
echo Waiting for services to start...
timeout /t 20 /nobreak >nul

echo.
echo ============================================
echo   QuickCart Rebuilt Successfully!
echo ============================================
echo.
echo All features now available:
echo   - Login/Signup
echo   - Home Page with Categories
echo   - 38 Products
echo   - Search Functionality
echo   - Shopping Cart
echo   - Contact Form
echo.
echo Access your application:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ============================================
echo.
echo Viewing logs (Ctrl+C to exit)...
echo.
docker compose logs -f

pause
