#!/bin/bash

# QuickCart Docker Quick Start Script
# Run this script in WSL to build and start your Docker containers

set -e  # Exit on any error

echo "🐳 ======================================"
echo "   QuickCart Docker Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${BLUE}📋 Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
    echo "Please install Docker Desktop and enable WSL2 integration"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    echo "Please start Docker Desktop on Windows"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Check if docker-compose is available
echo -e "${BLUE}📋 Checking docker-compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  docker-compose not found, using 'docker compose' instead${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
    echo -e "${GREEN}✅ docker-compose is available${NC}"
fi
echo ""

# Stop any running containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
$DOCKER_COMPOSE down 2>/dev/null || true
echo ""

# Remove old images (optional)
read -p "🗑️  Do you want to remove old images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🗑️  Removing old images...${NC}"
    docker rmi quickcart-backend quickcart-frontend 2>/dev/null || true
fi
echo ""

# Build Docker images
echo -e "${BLUE}📦 Building Docker images...${NC}"
echo "This may take a few minutes on first run..."
$DOCKER_COMPOSE build
echo -e "${GREEN}✅ Images built successfully${NC}"
echo ""

# Start containers
echo -e "${BLUE}🚀 Starting containers...${NC}"
$DOCKER_COMPOSE up -d
echo -e "${GREEN}✅ Containers started${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to initialize...${NC}"
sleep 5

# Check container status
echo ""
echo -e "${BLUE}📊 Container Status:${NC}"
$DOCKER_COMPOSE ps
echo ""

# Show images
echo -e "${BLUE}🖼️  Docker Images:${NC}"
docker images | grep -E "quickcart|mongo" || docker images
echo ""

# Test services
echo -e "${BLUE}🔍 Testing services...${NC}"

# Test backend
if curl -s http://localhost:5000/api/products > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend might still be starting up...${NC}"
fi

# Test frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend might still be starting up...${NC}"
fi

# Success message
echo ""
echo -e "${GREEN}🎉 ======================================"
echo "   QuickCart Docker Deployment Complete!"
echo "======================================${NC}"
echo ""
echo -e "${BLUE}📱 Access your application:${NC}"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   MongoDB:   localhost:27017"
echo ""
echo -e "${BLUE}📝 Useful commands:${NC}"
echo "   View logs:       $DOCKER_COMPOSE logs -f"
echo "   Stop services:   $DOCKER_COMPOSE down"
echo "   Restart:         $DOCKER_COMPOSE restart"
echo ""
echo -e "${YELLOW}💡 Tip: Run 'docker-compose logs -f' to see live logs${NC}"
echo ""
