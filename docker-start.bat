@echo off
REM QuickCart Docker Quick Start
echo ============================================
echo   QuickCart - Docker Quick Start
echo ============================================
echo.

cd /d "%~dp0"

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker is installed!
echo.
echo Building and starting QuickCart...
echo.

docker compose up --build -d

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start containers
    echo Check Docker Desktop is running
    pause
    exit /b 1
)

echo.
echo ============================================
echo   QuickCart is Starting!
echo ============================================
echo.
echo Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo Services Status:
docker compose ps

echo.
echo ============================================
echo   Application URLs:
echo ============================================
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   MongoDB:   mongodb://localhost:27017
echo ============================================
echo.
echo To view logs: docker compose logs -f
echo To stop:      docker compose down
echo.

pause
