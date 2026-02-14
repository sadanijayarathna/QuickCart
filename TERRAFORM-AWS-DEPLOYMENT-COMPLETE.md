# 🚀 QuickCart AWS Free Tier Deployment Guide
## Complete DevOps Solution with Terraform

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [What Terraform Will Create](#what-terraform-will-create)
3. [Prerequisites Checklist](#prerequisites-checklist)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Behind the Scenes Explanation](#behind-the-scenes-explanation)
6. [Cost Management & Free Tier Tips](#cost-management--free-tier-tips)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AWS Cloud (Free Tier)                 │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              EC2 Instance (t3.micro)                │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │           Docker Containers                   │  │ │
│  │  │                                               │  │ │
│  │  │  ┌─────────────┐  ┌────────────┐  ┌────────┐│  │ │
│  │  │  │  Frontend   │  │  Backend   │  │MongoDB ││  │ │
│  │  │  │   :3000     │  │   :5000    │  │ :27017 ││  │ │
│  │  │  │   React     │  │ Node/Express│ │        ││  │ │
│  │  │  └─────────────┘  └────────────┘  └────────┘│  │ │
│  │  │                                               │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  └────────────────────────────────────────────────────┘ │
│           ↑                                              │
│  ┌────────────────┐     ┌──────────────────┐            │
│  │ Security Group │     │   Elastic IP     │            │
│  │  Ports: 22,    │     │  (Fixed IP)      │            │
│  │  80, 3000,     │     └──────────────────┘            │
│  │  5000          │                                      │
│  └────────────────┘                                      │
└─────────────────────────────────────────────────────────┘
           ↑
           │ Pull Images
           │
    ┌──────────────┐
    │  Docker Hub  │
    │  Your Images │
    └──────────────┘
```

---

## 🛠️ What Terraform Will Create

### 1️⃣ **AWS Provider Configuration**
- **What**: Terraform AWS provider setup
- **Why**: Enables Terraform to communicate with AWS using your credentials
- **Free Tier**: ✅ No cost

### 2️⃣ **EC2 Instance (t3.micro)**
- **What**: Virtual server to host your application
- **Why**: Runs Docker containers with your app
- **Free Tier**: ✅ 750 hours/month free (covers entire month)
- **Specs**: 
  - 2 vCPUs
  - 1 GB RAM
  - Ubuntu 22.04 LTS
  - 20 GB storage

### 3️⃣ **Security Group (Firewall Rules)**
- **What**: Controls network traffic to/from EC2
- **Why**: Exposes your application to the internet securely
- **Ports Opened**:
  - `22` → SSH (for remote access)
  - `80` → HTTP (web traffic)
  - `3000` → Frontend (React)
  - `5000` → Backend (API)
  - `27017` → MongoDB (internal)
- **Free Tier**: ✅ No cost

### 4️⃣ **SSH Key Pair**
- **What**: RSA 4096-bit key for secure server access
- **Why**: Allows you to SSH into EC2 from WSL
- **Generated**: Automatically by Terraform
- **Saved**: `terraform/quickcart-key.pem`
- **Free Tier**: ✅ No cost

### 5️⃣ **IAM Role & Instance Profile**
- **What**: AWS Systems Manager permissions
- **Why**: Enables browser-based access and monitoring
- **Free Tier**: ✅ No cost

### 6️⃣ **Elastic IP**
- **What**: Fixed public IP address
- **Why**: IP won't change if instance restarts
- **Free Tier**: ✅ Free while attached to running instance
- **⚠️ Important**: Costs $0.005/hour if instance is stopped

### 7️⃣ **User Data Script (Automated Setup)**
- **What**: Bash script that runs on first boot
- **Why**: Automatically installs:
  - Docker & Docker Compose
  - AWS Systems Manager
  - Pulls your images from Docker Hub
  - Starts your application
- **Free Tier**: ✅ No cost

### 8️⃣ **Terraform Outputs**
- **What**: Important information after deployment
- **Why**: Provides:
  - Public IP address
  - Frontend URL
  - Backend URL
  - SSH command
- **Free Tier**: ✅ No cost

---

## ✅ Prerequisites Checklist

### Required Information
- [ ] AWS Access Key ID
- [ ] AWS Secret Access Key
- [ ] AWS Region (e.g., `us-east-1`)
- [ ] Docker Hub username: `sadanijayarathna`
- [ ] Docker images available on Docker Hub:
  - `sadanijayarathna/quickcart-backend:latest`
  - `sadanijayarathna/quickcart-frontend:latest`

### System Requirements (WSL)
- [ ] Terraform installed
- [ ] AWS CLI installed
- [ ] Working inside WSL (Ubuntu)
- [ ] Internet connection

---

## 🚀 Step-by-Step Deployment

### **Step 1: Verify Docker Hub Images**
Your images must be available on Docker Hub before deployment.

```bash
# Check if images exist
docker pull sadanijayarathna/quickcart-backend:latest
docker pull sadanijayarathna/quickcart-frontend:latest
```

If these fail, push your images first:
```bash
docker push sadanijayarathna/quickcart-backend:latest
docker push sadanijayarathna/quickcart-frontend:latest
```

---

### **Step 2: Configure AWS Credentials in WSL**

```bash
# Install AWS CLI (if not already installed)
sudo apt update
sudo apt install awscli -y

# Configure AWS credentials
aws configure
```

You'll be prompted for:
```
AWS Access Key ID: [YOUR_ACCESS_KEY]
AWS Secret Access Key: [YOUR_SECRET_KEY]
Default region name: us-east-1
Default output format: json
```

**Verify credentials:**
```bash
aws sts get-caller-identity
```

---

### **Step 3: Navigate to Terraform Directory**

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
```

---

### **Step 4: Review Configuration**

Check your `variables.tf` to ensure Docker Hub username is correct:
```bash
cat variables.tf | grep dockerhub_username
```

Should show: `default = "sadanijayarathna"`

---

### **Step 5: Initialize Terraform**

```bash
terraform init
```

**What happens:**
- Downloads AWS provider plugin
- Downloads TLS and Local providers
- Creates `.terraform` directory
- Prepares backend

**Expected output:**
```
Terraform has been successfully initialized!
```

---

### **Step 6: Preview Infrastructure (Terraform Plan)**

```bash
terraform plan
```

**What happens:**
- Shows what will be created
- Validates configuration
- No actual changes made

**Expected output:**
```
Plan: 8 to add, 0 to change, 0 to destroy.
```

---

### **Step 7: Deploy to AWS (Terraform Apply)**

```bash
terraform apply
```

Type `yes` when prompted.

**What happens:**
1. Creates SSH key pair
2. Creates security group
3. Launches EC2 instance
4. Attaches Elastic IP
5. Runs user-data script (installs Docker, pulls images)
6. Starts containers

**Duration:** 3-5 minutes

**Expected output:**
```
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.

Outputs:

deployment_instructions = <<EOT

========================================
QuickCart Deployment Successful! 🎉
========================================

📍 Server Details:
   Instance ID: i-xxxxxxxxxxxxx
   Public IP: 3.xxx.xxx.xxx

🌐 Application URLs:
   Frontend: http://3.xxx.xxx.xxx
   Backend API: http://3.xxx.xxx.xxx:5000

🔑 SSH Access:
   ssh -i quickcart-key.pem ubuntu@3.xxx.xxx.xxx
   
========================================
EOT
```

---

### **Step 8: Wait for Application to Start**

Docker containers need 2-3 minutes to start.

**Check deployment status:**
```bash
# Get the public IP
PUBLIC_IP=$(terraform output -raw instance_public_ip)

# SSH into server
ssh -i quickcart-key.pem ubuntu@$PUBLIC_IP

# Once inside EC2, check Docker status
docker compose ps
docker compose logs -f
```

---

### **Step 9: Access Your Application**

Open browser and go to:
- **Frontend**: `http://YOUR_PUBLIC_IP`
- **Frontend (alternate)**: `http://YOUR_PUBLIC_IP:3000`
- **Backend API**: `http://YOUR_PUBLIC_IP:5000/api/products`

---

## 🔍 Behind the Scenes Explanation

### What Happens During Deployment?

#### **Phase 1: Terraform Execution (Local WSL)**
1. Terraform reads `.tf` files
2. Connects to AWS using your credentials
3. Creates infrastructure in this order:
   - Security Group (firewall rules)
   - SSH Key Pair
   - IAM Role & Instance Profile
   - EC2 Instance
   - Elastic IP

#### **Phase 2: EC2 Instance Boot**
1. Ubuntu 22.04 boots up
2. User data script runs automatically:
   ```
   System Update → Install Docker → Install Docker Compose 
   → Create /opt/quickcart → Pull Docker images → Start containers
   ```

#### **Phase 3: Container Startup**
1. MongoDB starts first
2. Backend waits for MongoDB health check
3. Frontend starts after backend
4. Application is ready

### How Traffic Flows

```
User Browser → Elastic IP (3.x.x.x)
              ↓
         Security Group (Allows port 3000)
              ↓
         EC2 Instance (3.x.x.x:3000)
              ↓
         Docker Container (frontend:3000)
              ↓
    API Calls → Backend Container (backend:5000)
              ↓
         MongoDB Container (mongodb:27017)
```

---

## 💰 Cost Management & Free Tier Tips

### ✅ What's Free Forever

| Resource | Free Tier Limit | Your Usage |
|----------|----------------|------------|
| EC2 t3.micro | 750 hours/month | ~730 hours/month ✅ |
| EBS Storage | 30 GB | 20 GB ✅ |
| Data Transfer Out | 15 GB/month | Depends on traffic |
| Elastic IP | Free if attached | Attached ✅ |

### ⚠️ Potential Costs

1. **Elastic IP when instance is stopped**
   - Cost: $0.005/hour = $3.60/month
   - **Solution**: Always terminate instead of stop

2. **Data transfer > 15 GB/month**
   - Cost: $0.09/GB
   - **Solution**: Monitor CloudWatch

3. **EBS snapshots**
   - Cost: $0.05/GB/month
   - **Solution**: Don't create snapshots unless needed

### 🛑 How to Avoid Charges

**1. Destroy infrastructure when not in use:**
```bash
terraform destroy
```

**2. Set up billing alerts:**
- Go to AWS Console → Billing → Budgets
- Create alert for $1 threshold

**3. Never stop, always terminate:**
- Stopped instances still charge for Elastic IP
- Terminated instances = $0 cost

**4. Monitor usage:**
```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-02-01,End=2026-02-05 \
  --granularity DAILY \
  --metrics BlendedCost
```

---

## 🐛 Troubleshooting

### Issue 1: Terraform Apply Fails

**Error**: `Error creating EC2 instance: UnauthorizedOperation`
**Cause**: AWS credentials not configured
**Solution**:
```bash
aws configure
aws sts get-caller-identity
```

---

### Issue 2: Cannot Access Application

**Error**: Browser shows "Connection refused"
**Cause**: Containers not started yet
**Solution**:
```bash
# Wait 3 minutes, then SSH and check
ssh -i quickcart-key.pem ubuntu@<PUBLIC_IP>
docker compose ps
docker compose logs
```

---

### Issue 3: Docker Pull Fails

**Error**: `manifest unknown: manifest unknown`
**Cause**: Images not on Docker Hub
**Solution**:
```bash
# Locally push images first
docker push sadanijayarathna/quickcart-backend:latest
docker push sadanijayarathna/quickcart-frontend:latest
```

---

### Issue 4: Frontend Shows API Error

**Error**: `Failed to fetch products`
**Cause**: Backend not reachable or REACT_APP_API_URL wrong
**Solution**:
```bash
# SSH into EC2
ssh -i quickcart-key.pem ubuntu@<PUBLIC_IP>

# Check backend logs
docker compose logs backend

# Verify environment variable
docker compose exec frontend env | grep REACT_APP_API_URL
```

---

### Issue 5: MongoDB Connection Error

**Error**: `MongoNetworkError: failed to connect`
**Cause**: MongoDB not ready
**Solution**:
```bash
# Check MongoDB status
docker compose logs mongodb

# Restart if needed
docker compose restart mongodb backend
```

---

## 🔄 Updating Your Application

### Update Backend Code
```bash
# 1. Build and push new image locally
docker build -t sadanijayarathna/quickcart-backend:latest ./backend
docker push sadanijayarathna/quickcart-backend:latest

# 2. SSH into EC2
ssh -i quickcart-key.pem ubuntu@<PUBLIC_IP>

# 3. Pull and restart
cd /opt/quickcart
docker compose pull backend
docker compose up -d backend
```

### Update Frontend Code
Same process, replace `backend` with `frontend`

---

## 🧹 Cleanup (Destroy Infrastructure)

**To completely remove everything and stop all costs:**

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform destroy
```

Type `yes` when prompted.

**What gets deleted:**
- EC2 instance
- Elastic IP
- Security Group
- SSH Key Pair (from AWS, local .pem remains)
- IAM Role

**Cost after cleanup:** $0.00

---

## 📊 Next Steps: Jenkins Integration

Once deployment works manually, integrate Jenkins:

1. **Create Jenkins Pipeline** to:
   - Pull code from GitHub
   - Build Docker images
   - Push to Docker Hub
   - SSH into EC2
   - Run `docker compose pull && docker compose up -d`

2. **Store secrets** in Jenkins credentials:
   - AWS Access Key
   - AWS Secret Key
   - SSH Private Key
   - Docker Hub credentials

3. **Automate with webhooks**:
   - GitHub push → Jenkins build → Deploy to AWS

---

## 📚 Additional Resources

- [AWS Free Tier Details](https://aws.amazon.com/free/)
- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

## ✅ Deployment Checklist

- [ ] AWS credentials configured
- [ ] Docker images on Docker Hub
- [ ] Terraform initialized
- [ ] Infrastructure deployed
- [ ] Application accessible
- [ ] Billing alerts set up
- [ ] SSH access tested
- [ ] Containers healthy

---

**🎉 Congratulations! Your QuickCart application is now live on AWS!**
