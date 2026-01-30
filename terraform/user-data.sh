#!/bin/bash
set -e

echo "========================================="
echo "QuickCart AWS EC2 Setup Script"
echo "========================================="

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install AWS Systems Manager Agent
echo "Installing AWS Systems Manager Agent..."
sudo snap install amazon-ssm-agent --classic
sudo systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
sudo systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose standalone (backup)
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
echo "Creating application directory..."
sudo mkdir -p /opt/quickcart
sudo chown ubuntu:ubuntu /opt/quickcart
cd /opt/quickcart

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Public IP: $PUBLIC_IP"

# Create docker-compose.yml with proper variable substitution
echo "Creating docker-compose.yml..."
cat > /opt/quickcart/docker-compose.yml <<EOF
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: quickcart-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=quickcart
    networks:
      - quickcart-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/quickcart --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Service
  backend:
    image: ${dockerhub_username}/quickcart-backend:latest
    container_name: quickcart-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/quickcart
      - PORT=5000
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - quickcart-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/products"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Service
  frontend:
    image: ${dockerhub_username}/quickcart-frontend:latest
    container_name: quickcart-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "80:3000"
    environment:
      - REACT_APP_API_URL=http://$PUBLIC_IP:5000
    depends_on:
      - backend
    networks:
      - quickcart-network
    stdin_open: true

volumes:
  mongodb_data:
    driver: local

networks:
  quickcart-network:
    driver: bridge
EOF

# Create startup script
echo "Creating startup script..."
cat > /opt/quickcart/start.sh <<'STARTEOF'
#!/bin/bash
cd /opt/quickcart

echo "Starting QuickCart services..."

# Pull latest images with retries
echo "Pulling latest Docker images..."
for i in {1..3}; do
  docker compose pull && break || echo "Retry $i/3 failed, waiting..."
  sleep 5
done

# Start services
docker compose up -d

echo "QuickCart is starting..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Frontend: http://$PUBLIC_IP or http://$PUBLIC_IP:3000"
echo "Backend API: http://$PUBLIC_IP:5000"
echo ""
echo "Waiting for services to be ready..."
sleep 30

# Check status
docker compose ps
STARTEOF

chmod +x /opt/quickcart/start.sh

# Pull Docker images (must run as root since ubuntu user session not active yet)
echo "Pulling Docker images..."
cd /opt/quickcart
echo "Waiting for Docker daemon to be fully ready..."
sleep 10
docker pull ${dockerhub_username}/quickcart-backend:latest || echo "Warning: Failed to pull backend image"
docker pull ${dockerhub_username}/quickcart-frontend:latest || echo "Warning: Failed to pull frontend image"
docker pull mongo:7.0 || echo "Warning: Failed to pull mongodb image"

# Create systemd service for auto-start
echo "Creating systemd service..."
cat > /etc/systemd/system/quickcart.service <<'SERVICEEOF'
[Unit]
Description=QuickCart Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/quickcart
ExecStart=/opt/quickcart/start.sh
ExecStop=/usr/bin/docker compose down
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
SERVICEEOF

sudo systemctl daemon-reload
sudo systemctl enable quickcart.service

# Start the application
echo "Starting QuickCart application..."
sudo -u ubuntu /opt/quickcart/start.sh

echo "========================================="
echo "QuickCart Setup Complete!"
echo "========================================="
echo "Access your application at:"
echo "Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "Backend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000"
echo "========================================="
