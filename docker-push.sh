#!/bin/bash

# QuickCart Docker Hub Push Script
# This script builds, tags, and pushes your images to Docker Hub

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🐳 ======================================"
echo "   QuickCart Docker Hub Push Script"
echo "========================================"
echo ""

# Get Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Docker Hub username is required${NC}"
    exit 1
fi

# Get version tag
read -p "Enter version tag (default: v1.0): " VERSION
VERSION=${VERSION:-v1.0}

echo ""
echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Username: $DOCKER_USERNAME"
echo "   Version:  $VERSION"
echo ""

# Confirm before proceeding
read -p "Continue with these settings? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Check Docker login
echo ""
echo -e "${BLUE}🔐 Checking Docker Hub login...${NC}"
if docker info | grep -q "Username: $DOCKER_USERNAME"; then
    echo -e "${GREEN}✅ Already logged in as $DOCKER_USERNAME${NC}"
else
    echo "Please login to Docker Hub:"
    docker login
fi

echo ""
echo -e "${BLUE}📦 Building images...${NC}"
docker-compose build
echo -e "${GREEN}✅ Build complete${NC}"

echo ""
echo -e "${BLUE}🏷️  Tagging images...${NC}"

# Tag backend images
echo "Tagging backend images..."
docker tag quickcart-backend $DOCKER_USERNAME/quickcart-backend:latest
docker tag quickcart-backend $DOCKER_USERNAME/quickcart-backend:$VERSION

# Tag frontend images
echo "Tagging frontend images..."
docker tag quickcart-frontend $DOCKER_USERNAME/quickcart-frontend:latest
docker tag quickcart-frontend $DOCKER_USERNAME/quickcart-frontend:$VERSION

echo -e "${GREEN}✅ Tagging complete${NC}"

echo ""
echo -e "${BLUE}☁️  Pushing images to Docker Hub...${NC}"
echo "This may take several minutes..."

# Push backend
echo ""
echo "Pushing backend:latest..."
docker push $DOCKER_USERNAME/quickcart-backend:latest
echo "Pushing backend:$VERSION..."
docker push $DOCKER_USERNAME/quickcart-backend:$VERSION

# Push frontend
echo ""
echo "Pushing frontend:latest..."
docker push $DOCKER_USERNAME/quickcart-frontend:latest
echo "Pushing frontend:$VERSION..."
docker push $DOCKER_USERNAME/quickcart-frontend:$VERSION

echo ""
echo -e "${GREEN}🎉 ======================================"
echo "   All Images Pushed Successfully!"
echo "======================================${NC}"
echo ""
echo -e "${BLUE}📦 Your Docker Hub images:${NC}"
echo "   Backend:  $DOCKER_USERNAME/quickcart-backend:latest"
echo "   Backend:  $DOCKER_USERNAME/quickcart-backend:$VERSION"
echo "   Frontend: $DOCKER_USERNAME/quickcart-frontend:latest"
echo "   Frontend: $DOCKER_USERNAME/quickcart-frontend:$VERSION"
echo ""
echo -e "${BLUE}🌐 View on Docker Hub:${NC}"
echo "   https://hub.docker.com/r/$DOCKER_USERNAME/quickcart-backend"
echo "   https://hub.docker.com/r/$DOCKER_USERNAME/quickcart-frontend"
echo ""
echo -e "${YELLOW}💡 Others can now pull your images with:${NC}"
echo "   docker pull $DOCKER_USERNAME/quickcart-backend:latest"
echo "   docker pull $DOCKER_USERNAME/quickcart-frontend:latest"
echo ""
