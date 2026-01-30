# 🚀 QuickCart AWS Deployment Guide - Complete DevOps Solution

**Status:** Production Ready ✅  
**Last Updated:** January 30, 2026  
**Platform:** AWS Free Tier + Terraform  
**Environment:** WSL Ubuntu (Windows)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [What Happens Behind the Scenes](#what-happens-behind-the-scenes)
6. [Troubleshooting](#troubleshooting)
7. [Cost Management](#cost-management)
8. [Next Steps - Jenkins Integration](#next-steps-jenkins-integration)

---

## 🎯 Overview

This guide provides a **professional DevOps solution** to deploy your fully Dockerized QuickCart application on AWS Free Tier using Infrastructure as Code (Terraform).

### What You Have
- ✅ React.js Frontend (Dockerized)
- ✅ Node.js/Express Backend (Dockerized)
- ✅ MongoDB Database (Dockerized)
- ✅ Docker Compose configuration
- ✅ Docker images on Docker Hub
- ✅ Jenkins CI/CD pipeline (for image building)
- ✅ AWS Free Tier account

### What This Deploys
- ✅ EC2 Instance (t3.micro - Free Tier)
- ✅ Complete application stack via Docker Compose
- ✅ Public access to your web application
- ✅ SSH access for management
- ✅ Automatic container startup
- ✅ Fixed public IP address

---

## 📦 Prerequisites

### 1. AWS Account
- AWS Free Tier account
- AWS Access Key ID
- AWS Secret Access Key

**To get AWS credentials:**
1. Log in to AWS Console
2. Navigate to: **IAM** → **Users** → **Your User**
3. Click: **Security credentials** tab
4. Click: **Create access key**
5. Choose: **Command Line Interface (CLI)**
6. Save: Access Key ID and Secret Access Key

### 2. Development Environment
- Windows with WSL (Ubuntu)
- VS Code
- Docker Hub account with images:
  - `sadanijayarathna/quickcart-frontend:latest`
  - `sadanijayarathna/quickcart-backend:latest`

### 3. Knowledge Level
- Basic understanding of Docker
- Familiarity with Linux commands
- Basic AWS concepts (optional but helpful)

---

## 🏗️ Architecture

### AWS Resources Created

```
┌─────────────────────────────────────────────────────┐
│                    AWS Cloud                         │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │         EC2 Instance (t3.micro)             │    │
│  │                                              │    │
│  │  ┌────────────────────────────────────┐    │    │
│  │  │     Docker Compose Stack           │    │    │
│  │  │                                     │    │    │
│  │  │  ┌──────────┐  ┌──────────┐       │    │    │
│  │  │  │ MongoDB  │  │ Backend  │       │    │    │
│  │  │  │  :27017  │  │  :5000   │       │    │    │
│  │  │  └──────────┘  └──────────┘       │    │    │
│  │  │                                     │    │    │
│  │  │       ┌──────────┐                 │    │    │
│  │  │       │ Frontend │                 │    │    │
│  │  │       │ :3000/:80│                 │    │    │
│  │  │       └──────────┘                 │    │    │
│  │  └────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────┘    │
│                       │                              │
│            ┌──────────┴──────────┐                  │
│            │   Elastic IP         │                  │
│            │   (Fixed Public IP)  │                  │
│            └──────────┬──────────┘                  │
│                       │                              │
│            ┌──────────┴──────────┐                  │
│            │  Security Group      │                  │
│            │  Ports: 22,80,3000,  │                  │
│            │        5000,27017    │                  │
│            └──────────────────────┘                  │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
              Internet Users
```

### Components Explained

#### 1️⃣ **EC2 Instance (t3.micro)**
- **What:** Virtual server in the cloud
- **Why:** Hosts your entire application
- **Free Tier:** 750 hours/month (enough for 24/7 operation)

#### 2️⃣ **Security Group**
- **What:** Virtual firewall
- **Why:** Controls who can access your server
- **Ports Opened:**
  - `22` → SSH (for management)
  - `80` → HTTP (web traffic)
  - `3000` → Frontend (React app)
  - `5000` → Backend API
  - `27017` → MongoDB (⚠️ restrict in production)

#### 3️⃣ **Elastic IP**
- **What:** Fixed public IP address
- **Why:** IP doesn't change on reboot
- **Free Tier:** Free if attached to running instance

#### 4️⃣ **SSH Key Pair**
- **What:** Secure access credentials
- **Why:** Allows you to SSH into the server
- **Created:** Automatically by Terraform

#### 5️⃣ **IAM Role**
- **What:** Permissions for the EC2 instance
- **Why:** Allows AWS Systems Manager access
- **Use:** Remote management without SSH

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare WSL Environment

Open WSL Ubuntu terminal:

```bash
# Navigate to project
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart

# Navigate to terraform directory
cd terraform
```

### Step 2: Setup AWS Credentials

Run the setup script:

```bash
# Make script executable
chmod +x setup-aws.sh

# Run setup
./setup-aws.sh
```

**What this does:**
- ✅ Installs AWS CLI
- ✅ Installs Terraform
- ✅ Configures AWS credentials
- ✅ Verifies connection to AWS

**You'll be prompted for:**
- AWS Access Key ID
- AWS Secret Access Key
- AWS Region (default: us-east-1)

### Step 3: Verify Configuration

Check the variables in `variables.tf`:

```bash
cat variables.tf
```

**Important variables:**
- `dockerhub_username` → Should be: `sadanijayarathna`
- `aws_region` → Should be: `us-east-1`
- `instance_type` → Should be: `t3.micro`

### Step 4: Deploy to AWS

Run the deployment script:

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**What happens:**
1. ✅ Verifies AWS credentials
2. ✅ Initializes Terraform
3. ✅ Validates configuration
4. ✅ Shows deployment plan
5. ✅ Asks for confirmation
6. ✅ Creates AWS resources
7. ✅ Displays access information

**Expected time:** 3-5 minutes

### Step 5: Access Your Application

After deployment completes, you'll see:

```
========================================
Access Information
========================================

🌐 Frontend URL: http://XX.XX.XX.XX
   Alternative: http://XX.XX.XX.XX:3000

🔌 Backend API: http://XX.XX.XX.XX:5000

🔑 SSH Access:
   ssh -i quickcart-key.pem ubuntu@XX.XX.XX.XX
========================================
```

**Wait 2-3 minutes** for Docker containers to start, then access:
- Frontend: `http://YOUR_PUBLIC_IP`
- Backend API: `http://YOUR_PUBLIC_IP:5000`

### Step 6: Verify Deployment

SSH into the server:

```bash
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
```

Check container status:

```bash
cd /opt/quickcart
docker compose ps
```

Expected output:
```
NAME                   IMAGE                                    STATUS
quickcart-backend      sadanijayarathna/quickcart-backend      Up
quickcart-frontend     sadanijayarathna/quickcart-frontend     Up
quickcart-mongodb      mongo:7.0                               Up (healthy)
```

View logs:

```bash
docker compose logs -f
```

---

## 🔍 What Happens Behind the Scenes

### Terraform Execution Flow

#### Phase 1: Infrastructure Provisioning
```
1. Creates SSH key pair (RSA 4096-bit)
   └─> Saves private key locally: quickcart-key.pem

2. Creates Security Group
   └─> Opens required ports (22, 80, 3000, 5000, 27017)

3. Creates IAM Role & Instance Profile
   └─> Grants EC2 access to Systems Manager

4. Launches EC2 Instance
   ├─> AMI: Ubuntu 22.04 LTS
   ├─> Type: t3.micro (Free Tier)
   ├─> Storage: 20GB gp2
   └─> Attaches Security Group & IAM role

5. Allocates Elastic IP
   └─> Associates with EC2 instance
```

#### Phase 2: User Data Script Execution

When EC2 boots up, the **user-data.sh** script runs automatically:

```bash
# 1. System Update
apt-get update && apt-get upgrade

# 2. Install Docker
- Adds Docker repository
- Installs Docker Engine
- Installs Docker Compose plugin

# 3. Install AWS SSM Agent
- Enables remote management

# 4. Setup Application
- Creates /opt/quickcart directory
- Generates docker-compose.yml with your Docker Hub images
- Sets environment variables (MONGO_URI, API_URL)

# 5. Pull Docker Images
docker pull sadanijayarathna/quickcart-backend:latest
docker pull sadanijayarathna/quickcart-frontend:latest
docker pull mongo:7.0

# 6. Create Startup Service
- Creates systemd service
- Enables auto-start on boot

# 7. Start Application
docker compose up -d
```

#### Phase 3: Container Orchestration

Docker Compose starts containers in order:

```
1. MongoDB starts first
   └─> Waits for health check

2. Backend starts after MongoDB is healthy
   └─> Connects to mongodb://mongodb:27017

3. Frontend starts after Backend
   └─> Configured with REACT_APP_API_URL

All containers connected via quickcart-network bridge
```

### Environment Variables Set

**Backend Container:**
```bash
MONGO_URI=mongodb://mongodb:27017/quickcart
PORT=5000
```

**Frontend Container:**
```bash
REACT_APP_API_URL=http://YOUR_PUBLIC_IP:5000
```

### Networking

**Docker Bridge Network:**
- Containers communicate via service names
- `backend` → connects to → `mongodb`
- `frontend` → calls API at → public IP (for browser access)

**Port Mapping:**
- Host:Container
- `80:3000` → Frontend accessible on port 80
- `3000:3000` → Alternative frontend access
- `5000:5000` → Backend API
- `27017:27017` → MongoDB

---

## 🐛 Troubleshooting

### Issue 1: Deployment Fails

**Error:** `Error creating EC2 instance`

**Solutions:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify Free Tier eligibility
aws ec2 describe-account-attributes --attribute-names supported-platforms

# Check service quotas
aws service-quotas get-service-quota \
  --service-code ec2 \
  --quota-code L-1216C47A
```

### Issue 2: Cannot Access Application

**Error:** Website not loading

**Diagnosis:**
```bash
# SSH into server
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP

# Check containers
docker compose ps

# Check logs
docker compose logs

# Check if ports are listening
sudo netstat -tlnp | grep -E '3000|5000|27017'
```

**Common fixes:**
```bash
# Restart containers
docker compose restart

# Rebuild and restart
docker compose down
docker compose pull
docker compose up -d

# Check EC2 user data logs
sudo cat /var/log/cloud-init-output.log
```

### Issue 3: Containers Not Starting

**Error:** Container exits immediately

**Solutions:**
```bash
# Check specific container logs
docker logs quickcart-frontend
docker logs quickcart-backend
docker logs quickcart-mongodb

# Check image availability
docker images

# Re-pull images
docker pull sadanijayarathna/quickcart-frontend:latest
docker pull sadanijayarathna/quickcart-backend:latest

# Verify docker-compose.yml
cat /opt/quickcart/docker-compose.yml
```

### Issue 4: SSH Connection Refused

**Error:** `Connection refused` or `Permission denied`

**Solutions:**
```bash
# Fix key permissions
chmod 400 quickcart-key.pem

# Verify Security Group allows SSH
aws ec2 describe-security-groups \
  --group-names quickcart-sg \
  --query 'SecurityGroups[0].IpPermissions'

# Check EC2 is running
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=quickcart-server" \
  --query 'Reservations[0].Instances[0].State.Name'
```

### Issue 5: High AWS Costs

**Error:** Unexpected billing

**Immediate actions:**
```bash
# Stop the deployment
terraform destroy

# Check billing
# AWS Console → Billing Dashboard → Bills

# Review Free Tier usage
# AWS Console → Billing → Free Tier
```

---

## 💰 Cost Management

### AWS Free Tier Limits (12 months)

| Resource | Free Tier Limit | After Free Tier |
|----------|----------------|-----------------|
| EC2 t3.micro | 750 hrs/month | ~$0.0104/hr (~$7.50/month) |
| EBS Storage | 30 GB | $0.10/GB/month |
| Data Transfer OUT | 15 GB/month | $0.09/GB |
| Data Transfer IN | Unlimited | Free |
| Elastic IP (attached) | Free | Free |
| Elastic IP (unattached) | $0.005/hr | $0.005/hr |

### Cost Saving Tips

1. **Always destroy when not needed:**
```bash
cd terraform
terraform destroy
```

2. **Monitor Free Tier usage:**
   - AWS Console → Billing → Free Tier

3. **Set up billing alerts:**
```bash
# Create billing alarm for $1
aws cloudwatch put-metric-alarm \
  --alarm-name billing-alert \
  --alarm-description "Alert when charges exceed $1" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 1.0 \
  --comparison-operator GreaterThanThreshold
```

4. **Stop (don't terminate) when testing:**
```bash
# Stop instance (keeps data, no compute charges)
aws ec2 stop-instances --instance-ids i-xxxxx

# Start again
aws ec2 start-instances --instance-ids i-xxxxx
```

### Estimated Monthly Costs

**Within Free Tier:** $0  
**After Free Tier:** ~$8-10/month

---

## 🔄 Managing Your Deployment

### Start Application
```bash
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
cd /opt/quickcart
docker compose up -d
```

### Stop Application
```bash
docker compose down
```

### Restart Application
```bash
docker compose restart
```

### Update Images
```bash
# Pull latest images from Docker Hub
docker compose pull

# Restart with new images
docker compose up -d
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mongodb
```

### Access MongoDB
```bash
docker exec -it quickcart-mongodb mongosh
use quickcart
db.products.find()
```

---

## 🔗 Next Steps - Jenkins Integration

### Automate Deployments with Jenkins

1. **Create Jenkins pipeline to:**
   - Build Docker images
   - Push to Docker Hub
   - SSH into EC2
   - Update containers

2. **Sample Jenkinsfile addition:**
```groovy
stage('Deploy to AWS') {
    steps {
        script {
            sshagent(['aws-ec2-key']) {
                sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                        cd /opt/quickcart
                        docker compose pull
                        docker compose up -d
                    '
                """
            }
        }
    }
}
```

3. **Setup SSH credentials in Jenkins:**
   - Copy `quickcart-key.pem` to Jenkins
   - Add as SSH credential
   - Use in pipeline

---

## 📚 Additional Commands

### Terraform Commands
```bash
# Initialize
terraform init

# Validate configuration
terraform validate

# Plan (preview changes)
terraform plan

# Apply (create resources)
terraform apply

# Destroy (delete everything)
terraform destroy

# Show current state
terraform show

# List resources
terraform state list

# Format code
terraform fmt
```

### Docker Commands on EC2
```bash
# List containers
docker compose ps

# View images
docker images

# Clean unused resources
docker system prune -a

# Monitor resources
docker stats

# Execute command in container
docker exec -it quickcart-backend sh
```

---

## 🎓 What You've Learned

✅ **Infrastructure as Code** - Terraform manages entire infrastructure  
✅ **Cloud Deployment** - AWS EC2, Security Groups, Elastic IP  
✅ **Container Orchestration** - Docker Compose in production  
✅ **DevOps Automation** - Automated provisioning and deployment  
✅ **Cost Management** - AWS Free Tier optimization  
✅ **Security** - SSH keys, Security Groups, IAM roles  

---

## 📞 Support

### If something doesn't work:

1. **Check logs:**
```bash
sudo cat /var/log/cloud-init-output.log  # EC2 startup
docker compose logs                       # Application logs
```

2. **Verify resources:**
```bash
terraform state list                      # Terraform resources
aws ec2 describe-instances               # EC2 status
```

3. **Common fixes:**
```bash
# Reboot EC2
sudo reboot

# Restart Docker
sudo systemctl restart docker

# Re-run user data script
sudo bash /var/lib/cloud/instance/scripts/part-001
```

---

## ✅ Success Checklist

- [ ] AWS credentials configured
- [ ] Terraform initialized
- [ ] Resources deployed successfully
- [ ] SSH access working
- [ ] All containers running
- [ ] Frontend accessible in browser
- [ ] Backend API responding
- [ ] MongoDB healthy
- [ ] Billing alerts configured
- [ ] Deployment documented

---

**🎉 Congratulations!** You've successfully deployed a production-ready Dockerized application on AWS using Infrastructure as Code!

---

**Author:** DevOps Solution for QuickCart  
**Version:** 1.0  
**Date:** January 30, 2026
