@echo off
REM QuickCart Docker Stop Script
echo Stopping QuickCart containers...
cd /d "%~dp0"
docker compose down
echo.
echo QuickCart stopped successfully!
pause
