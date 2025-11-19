#!/bin/bash

# QuickCart Docker Image Verification Script
# This script verifies all Docker images are built correctly before pushing to Docker Hub

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  QuickCart Docker Image Verification      ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Track verification status
VERIFICATION_PASSED=true

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
    VERIFICATION_PASSED=false
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Checking Docker Installation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi
print_success "Docker is installed"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi
print_success "Docker daemon is running"

# Check docker-compose
if command -v docker-compose &> /dev/null; then
    print_success "docker-compose is available"
    DOCKER_COMPOSE="docker-compose"
else
    print_info "Using 'docker compose' instead of 'docker-compose'"
    DOCKER_COMPOSE="docker compose"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Verifying Project Files${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Check if we're in the right directory
if [ ! -f "docker-compose.yaml" ] && [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yaml not found. Are you in the project root?"
    exit 1
fi
print_success "docker-compose.yaml found"

# Check Dockerfiles
if [ ! -f "backend/Dockerfile" ]; then
    print_error "backend/Dockerfile not found"
else
    print_success "backend/Dockerfile found"
fi

if [ ! -f "frontend/Dockerfile" ]; then
    print_error "frontend/Dockerfile not found"
else
    print_success "frontend/Dockerfile found"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3: Building Docker Images${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

print_info "Building images... This may take several minutes..."
if $DOCKER_COMPOSE build 2>&1 | tee /tmp/docker-build.log; then
    print_success "Docker images built successfully"
else
    print_error "Failed to build Docker images"
    echo ""
    echo -e "${YELLOW}Build log:${NC}"
    tail -20 /tmp/docker-build.log
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 4: Verifying Created Images${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Check if backend image exists
if docker images | grep -q "quickcart.*backend"; then
    BACKEND_IMAGE=$(docker images | grep "quickcart.*backend" | head -1 | awk '{print $1":"$2}')
    BACKEND_SIZE=$(docker images | grep "quickcart.*backend" | head -1 | awk '{print $7" "$8}')
    print_success "Backend image found: $BACKEND_IMAGE ($BACKEND_SIZE)"
else
    print_error "Backend image not found"
fi

# Check if frontend image exists
if docker images | grep -q "quickcart.*frontend"; then
    FRONTEND_IMAGE=$(docker images | grep "quickcart.*frontend" | head -1 | awk '{print $1":"$2}')
    FRONTEND_SIZE=$(docker images | grep "quickcart.*frontend" | head -1 | awk '{print $7" "$8}')
    print_success "Frontend image found: $FRONTEND_IMAGE ($FRONTEND_SIZE)"
else
    print_error "Frontend image not found"
fi

# Check if MongoDB image exists
if docker images | grep -q "mongo"; then
    MONGO_IMAGE=$(docker images | grep "^mongo" | head -1 | awk '{print $1":"$2}')
    MONGO_SIZE=$(docker images | grep "^mongo" | head -1 | awk '{print $7" "$8}')
    print_success "MongoDB image found: $MONGO_IMAGE ($MONGO_SIZE)"
else
    print_warning "MongoDB image not found (will be pulled when starting containers)"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 5: Detailed Image Information${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

echo ""
echo -e "${CYAN}All QuickCart Images:${NC}"
docker images | grep -E "REPOSITORY|quickcart|mongo" | head -10

echo ""
echo -e "${CYAN}Image Details:${NC}"
echo ""

# Backend image details
if docker images | grep -q "quickcart.*backend"; then
    echo -e "${GREEN}Backend Image:${NC}"
    docker images | grep "quickcart.*backend" | head -1
    BACKEND_ID=$(docker images | grep "quickcart.*backend" | head -1 | awk '{print $3}')
    echo "  Image ID: $BACKEND_ID"
    echo "  Created: $(docker inspect $BACKEND_ID --format='{{.Created}}' 2>/dev/null | cut -d'T' -f1)"
    echo ""
fi

# Frontend image details
if docker images | grep -q "quickcart.*frontend"; then
    echo -e "${GREEN}Frontend Image:${NC}"
    docker images | grep "quickcart.*frontend" | head -1
    FRONTEND_ID=$(docker images | grep "quickcart.*frontend" | head -1 | awk '{print $3}')
    echo "  Image ID: $FRONTEND_ID"
    echo "  Created: $(docker inspect $FRONTEND_ID --format='{{.Created}}' 2>/dev/null | cut -d'T' -f1)"
    echo ""
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 6: Testing Images (Starting Containers)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

print_info "Starting containers to verify images work..."
if $DOCKER_COMPOSE up -d 2>&1 | tee /tmp/docker-up.log; then
    print_success "Containers started successfully"
else
    print_error "Failed to start containers"
    exit 1
fi

echo ""
print_info "Waiting 10 seconds for services to initialize..."
sleep 10

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 7: Verifying Running Containers${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Check containers
echo ""
echo -e "${CYAN}Running Containers:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAME|quickcart"

echo ""

# Check backend container
if docker ps | grep -q "quickcart.*backend"; then
    print_success "Backend container is running"
    
    # Check backend logs
    if docker logs quickcart-backend 2>&1 | grep -q "Server running on port 5000"; then
        print_success "Backend server started successfully"
    else
        print_warning "Backend server may not be fully started yet"
    fi
else
    print_error "Backend container is not running"
fi

# Check frontend container
if docker ps | grep -q "quickcart.*frontend"; then
    print_success "Frontend container is running"
    
    # Check if frontend compiled
    if docker logs quickcart-frontend 2>&1 | grep -q "webpack compiled"; then
        print_success "Frontend compiled successfully"
    else
        print_warning "Frontend may still be compiling"
    fi
else
    print_error "Frontend container is not running"
fi

# Check MongoDB container
if docker ps | grep -q "quickcart.*mongodb"; then
    print_success "MongoDB container is running"
else
    print_error "MongoDB container is not running"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 8: Testing API Endpoints${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

echo ""
print_info "Testing Backend API..."
sleep 2

if curl -s http://localhost:5000/api/products > /dev/null 2>&1; then
    print_success "Backend API is responding"
    PRODUCT_COUNT=$(curl -s http://localhost:5000/api/products | grep -o '"products":\[' | wc -l)
    if [ "$PRODUCT_COUNT" -gt 0 ]; then
        print_success "Backend is returning product data"
    fi
else
    print_warning "Backend API not responding yet (may need more time to start)"
fi

print_info "Testing Frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is responding"
else
    print_warning "Frontend not responding yet (may need more time to compile)"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 9: Container Health Check${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

echo ""
echo -e "${CYAN}Container Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "NAME|quickcart"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 10: Image Layers Inspection${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

echo ""
if docker images | grep -q "quickcart.*backend"; then
    BACKEND_ID=$(docker images | grep "quickcart.*backend" | head -1 | awk '{print $3}')
    echo -e "${CYAN}Backend Image Layers:${NC}"
    docker history $BACKEND_ID --no-trunc | head -10
    echo ""
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Final Verification Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

echo ""
echo -e "${CYAN}📊 Image Summary:${NC}"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}" | grep -E "REPOSITORY|quickcart|mongo" | head -5

echo ""
echo -e "${CYAN}🐳 Container Summary:${NC}"
$DOCKER_COMPOSE ps

echo ""
echo -e "${CYAN}💾 Disk Space:${NC}"
docker system df

echo ""
echo "════════════════════════════════════════════════════"
if [ "$VERIFICATION_PASSED" = true ]; then
    echo -e "${GREEN}✅ ✅ ✅  ALL VERIFICATIONS PASSED  ✅ ✅ ✅${NC}"
    echo "════════════════════════════════════════════════════"
    echo ""
    echo -e "${GREEN}🎉 Your Docker images are ready to push to Docker Hub!${NC}"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "  1. Tag your images for Docker Hub:"
    echo "     docker tag quickcart-backend yourusername/quickcart-backend:latest"
    echo "     docker tag quickcart-frontend yourusername/quickcart-frontend:latest"
    echo ""
    echo "  2. Login to Docker Hub:"
    echo "     docker login"
    echo ""
    echo "  3. Push images:"
    echo "     docker push yourusername/quickcart-backend:latest"
    echo "     docker push yourusername/quickcart-frontend:latest"
    echo ""
    echo "  Or use the automated script:"
    echo "     ./docker-push.sh"
    echo ""
    echo -e "${BLUE}📱 Access your application:${NC}"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:5000"
    echo "   MongoDB:   localhost:27017"
    echo ""
else
    echo -e "${RED}❌ ❌ ❌  VERIFICATION FAILED  ❌ ❌ ❌${NC}"
    echo "════════════════════════════════════════════════════"
    echo ""
    echo -e "${YELLOW}Please fix the errors above before pushing to Docker Hub.${NC}"
    echo ""
    echo -e "${CYAN}Common fixes:${NC}"
    echo "  • Check Docker Desktop is running"
    echo "  • Review container logs: docker-compose logs"
    echo "  • Rebuild images: docker-compose build --no-cache"
    echo "  • Check ports are available: sudo lsof -i :3000"
    echo ""
    exit 1
fi
