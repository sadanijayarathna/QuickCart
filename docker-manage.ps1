# QuickCart Docker Management Script
# This script helps you manage your Docker containers easily

Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host "="*70 -ForegroundColor Green
Write-Host "  QuickCart Docker Management" -ForegroundColor Cyan
Write-Host "="*71 -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
function Test-Docker {
    try {
        $null = docker --version 2>$null
        return $true
    } catch {
        return $false
    }
}

if (-not (Test-Docker)) {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop from:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor Blue
    Write-Host ""
    exit 1
}

Write-Host "✅ Docker is installed" -ForegroundColor Green
Write-Host ""

# Menu
function Show-Menu {
    Write-Host "Choose an option:" -ForegroundColor Cyan
    Write-Host "1. Build and start all services" -ForegroundColor White
    Write-Host "2. Start all services" -ForegroundColor White
    Write-Host "3. Stop all services" -ForegroundColor White
    Write-Host "4. View logs (all services)" -ForegroundColor White
    Write-Host "5. View backend logs" -ForegroundColor White
    Write-Host "6. View frontend logs" -ForegroundColor White
    Write-Host "7. Check container status" -ForegroundColor White
    Write-Host "8. Restart all services" -ForegroundColor White
    Write-Host "9. Stop and remove all (including volumes)" -ForegroundColor White
    Write-Host "10. Seed database manually" -ForegroundColor White
    Write-Host "11. REBUILD with latest code (no cache)" -ForegroundColor Cyan
    Write-Host "0. Exit" -ForegroundColor Yellow
    Write-Host ""
}

$projectPath = "C:\Users\User\Desktop\QuickCart"
Set-Location $projectPath

do {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    Write-Host ""

    switch ($choice) {
        "1" {
            Write-Host "🏗️  Building and starting all services..." -ForegroundColor Cyan
            docker compose up --build -d
            Write-Host ""
            Write-Host "✅ Services started!" -ForegroundColor Green
            Write-Host "Frontend: http://localhost:3000" -ForegroundColor Blue
            Write-Host "Backend: http://localhost:5000" -ForegroundColor Blue
            Write-Host ""
        }
        "2" {
            Write-Host "🚀 Starting all services..." -ForegroundColor Cyan
            docker compose up -d
            Write-Host ""
            Write-Host "✅ Services started!" -ForegroundColor Green
            Write-Host ""
        }
        "3" {
            Write-Host "🛑 Stopping all services..." -ForegroundColor Cyan
            docker compose down
            Write-Host "✅ Services stopped!" -ForegroundColor Green
            Write-Host ""
        }
        "4" {
            Write-Host "📋 Viewing all logs (Ctrl+C to exit)..." -ForegroundColor Cyan
            docker compose logs -f
        }
        "5" {
            Write-Host "📋 Viewing backend logs (Ctrl+C to exit)..." -ForegroundColor Cyan
            docker compose logs -f backend
        }
        "6" {
            Write-Host "📋 Viewing frontend logs (Ctrl+C to exit)..." -ForegroundColor Cyan
            docker compose logs -f frontend
        }
        "7" {
            Write-Host "📊 Container Status:" -ForegroundColor Cyan
            docker compose ps
            Write-Host ""
        }
        "8" {
            Write-Host "🔄 Restarting all services..." -ForegroundColor Cyan
            docker compose restart
            Write-Host "✅ Services restarted!" -ForegroundColor Green
            Write-Host ""
        }
        "9" {
            Write-Host "⚠️  This will remove all data including the database!" -ForegroundColor Yellow
            $confirm = Read-Host "Are you sure? (yes/no)"
            if ($confirm -eq "yes") {
                Write-Host "🗑️  Stopping and removing everything..." -ForegroundColor Red
                docker compose down -v
                Write-Host "✅ Everything removed!" -ForegroundColor Green
            } else {
                Write-Host "Cancelled" -ForegroundColor Yellow
            }
            Write-Host ""
        }
        "10" {
            Write-Host "📦 Seeding database..." -ForegroundColor Cyan
            docker exec quickcart-backend node seedProducts.js
            Write-Host "✅ Database seeded!" -ForegroundColor Green
            Write-Host ""
        }
        "11" {
            Write-Host "🔄 REBUILDING with latest code..." -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Step 1: Stopping containers..." -ForegroundColor Yellow
            docker compose down
            Write-Host ""
            Write-Host "Step 2: Removing old images..." -ForegroundColor Yellow
            docker rmi quickcart-backend quickcart-frontend 2>$null
            Write-Host ""
            Write-Host "Step 3: Building with NO CACHE..." -ForegroundColor Yellow
            docker compose build --no-cache
            Write-Host ""
            Write-Host "Step 4: Starting services..." -ForegroundColor Yellow
            docker compose up -d
            Write-Host ""
            Write-Host "✅ Rebuild complete! All latest features included!" -ForegroundColor Green
            Write-Host ""
        }
        "0" {
            Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        }
        default {
            Write-Host "❌ Invalid choice. Please try again." -ForegroundColor Red
            Write-Host ""
        }
    }

    if ($choice -ne "0") {
        Read-Host "Press Enter to continue"
        Clear-Host
    }

} while ($choice -ne "0")
