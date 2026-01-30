# 🚀 QuickCart AWS Deployment Guide

## 📋 Current Status

### ✅ Completed Steps

1. **Prerequisites Verified**
   - ✅ Terraform v1.13.4 installed in WSL
   - ✅ AWS CLI v2.31.24 installed in WSL
   - ✅ Docker v28.4.0 installed in WSL
   - ✅ Docker Compose v2.39.4 installed in WSL

2. **Terraform Configuration Created**
   - ✅ `main.tf` - AWS infrastructure definition
   - ✅ `variables.tf` - Configuration variables
   - ✅ `outputs.tf` - Deployment outputs
   - ✅ `user-data.sh` - EC2 initialization script
   - ✅ `README.md` - Terraform documentation

3. **Docker Images Prepared**
   - ✅ Backend image built and pushed to Docker Hub
   - ✅ Frontend image built and pushed to Docker Hub
   - Images: `sadanijayarathna/quickcart-backend:latest`
   - Images: `sadanijayarathna/quickcart-frontend:latest`

4. **Terraform Initialized**
   - ✅ Providers downloaded (AWS v4.67.0, TLS v4.2.0, Local v2.6.2)
   - ✅ Configuration validated successfully

---

## ⚠️ ACTION REQUIRED: AWS Credentials

Your AWS credentials are currently **invalid or expired**. You need to update them before deployment.

### How to Get AWS Credentials

#### Option 1: AWS Academy / Learner Lab
1. Open AWS Academy and start your Learner Lab
2. Click on "AWS Details"
3. Click "Show" next to AWS CLI credentials
4. Copy the three lines (aws_access_key_id, aws_secret_access_key, aws_session_token)
5. Run the configuration script (see below)

#### Option 2: Regular AWS Account
1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Go to IAM → Users → Your User → Security Credentials
3. Create new access key (select CLI usage)
4. Copy Access Key ID and Secret Access Key
5. Run the configuration script (see below)

---

## 🔧 Step-by-Step Deployment Instructions

### Step 1: Configure AWS Credentials

Open WSL terminal and run:

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
./setup-aws-credentials.sh
```

This script will:
- Prompt you for AWS Access Key ID
- Prompt you for AWS Secret Access Key
- Prompt you for Default region (enter: `us-east-1`)
- Prompt you for Output format (press Enter for default)
- Test the credentials

**OR** manually configure:

```bash
aws configure
# Enter your credentials when prompted:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json
```

Verify credentials:
```bash
aws sts get-caller-identity
```

### Step 2: Review Terraform Plan

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform plan
```

This will show you what AWS resources will be created:
- EC2 Instance (t2.medium)
- Security Group (ports 22, 80, 443, 3000, 5000, 27017)
- Elastic IP (static public IP)
- SSH Key Pair
- 30GB EBS Volume

### Step 3: Deploy to AWS

```bash
terraform apply
```

Type `yes` when prompted to confirm.

**Deployment Time:** Approximately 5-7 minutes

What happens during deployment:
1. Terraform creates AWS resources
2. EC2 instance launches with Ubuntu 22.04
3. User data script installs Docker
4. Docker images are pulled from Docker Hub
5. Docker Compose starts all containers
6. Application becomes accessible

### Step 4: Access Your Application

After deployment completes, Terraform will display:

```
Outputs:

frontend_url = "http://YOUR_PUBLIC_IP"
backend_url = "http://YOUR_PUBLIC_IP:5000"
ssh_command = "ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP"
```

**Wait 2-3 minutes** after Terraform completes for containers to fully start.

Access the application:
- **Frontend**: http://YOUR_PUBLIC_IP
- **Backend API**: http://YOUR_PUBLIC_IP:5000
- **API Test**: http://YOUR_PUBLIC_IP:5000/api/products

### Step 5: Verify Deployment (Optional)

SSH into the server:

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
chmod 400 quickcart-key.pem
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
```

Once connected, check containers:

```bash
cd /opt/quickcart
docker compose ps
docker compose logs -f
```

---

## 📦 What Gets Deployed

### AWS Resources
- **EC2 Instance**: t2.medium (2 vCPU, 4GB RAM)
- **Operating System**: Ubuntu 22.04 LTS
- **Storage**: 30GB SSD (gp3)
- **Network**: Public IP with Elastic IP
- **Security**: Security group with controlled access

### Application Stack
- **MongoDB**: Database (Port 27017)
- **Backend**: Express.js API (Port 5000)
- **Frontend**: React.js App (Ports 80, 3000)

### Pre-seeded Data
- 38 products across 7 categories
- Fully functional e-commerce application

---

## 💰 Cost Estimate

- **EC2 t2.medium**: ~$0.0464/hour (~$33/month)
- **30GB EBS Storage**: ~$3/month
- **Elastic IP**: Free (while attached)
- **Data Transfer**: Variable
- **Total**: ~$36-40/month

**Important**: Remember to destroy resources when not in use to avoid charges!

---

## 🛠️ Terraform Commands Reference

```bash
# Navigate to terraform directory
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# Initialize (already done)
terraform init

# Validate configuration
terraform validate

# See what will be created
terraform plan

# Deploy infrastructure
terraform apply

# View outputs
terraform output

# Show current state
terraform show

# Destroy all resources
terraform destroy
```

---

## 🔍 Troubleshooting

### Issue: Terraform apply fails with credentials error
**Solution**: Run `./setup-aws-credentials.sh` or `aws configure` again

### Issue: Can't access application after deployment
**Solution**: 
1. Wait 2-3 minutes for containers to start
2. Check security group allows your IP
3. SSH into server and run `docker compose logs`

### Issue: SSH permission denied
**Solution**: 
```bash
chmod 400 quickcart-key.pem
```

### Issue: Application not responding
**Solution**: SSH into server and restart:
```bash
cd /opt/quickcart
docker compose down
docker compose up -d
```

---

## 🧹 Cleanup (Destroy Resources)

When you're done testing or want to stop incurring AWS charges:

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform destroy
```

Type `yes` to confirm.

This will:
- Terminate the EC2 instance
- Delete the Elastic IP
- Remove the security group
- Delete the SSH key pair

**Note**: Your local files and Docker images on Docker Hub are NOT deleted.

---

## 📞 Next Steps After Successful Deployment

1. **Test the Application**
   - Create user accounts
   - Browse products
   - Add items to cart
   - Place orders

2. **Custom Domain** (Optional)
   - Point your domain to the Elastic IP
   - Set up HTTPS with Let's Encrypt

3. **Monitoring**
   - Set up CloudWatch alarms
   - Monitor application logs

4. **Backup**
   - Schedule MongoDB backups
   - Create AMI snapshots

---

## 📝 Files Created in terraform/ Directory

- `main.tf` - Infrastructure definition
- `variables.tf` - Configuration variables
- `outputs.tf` - Deployment outputs
- `user-data.sh` - EC2 initialization script
- `README.md` - Terraform documentation
- `setup-aws-credentials.sh` - Credentials helper
- `quickcart-key.pem` - SSH private key (created during apply)
- `.terraform/` - Terraform working directory
- `terraform.tfstate` - Current infrastructure state
- `tfplan` - Saved execution plan

---

## ✅ Deployment Checklist

- [ ] AWS credentials configured and verified
- [ ] Terraform initialized (`terraform init`)
- [ ] Configuration validated (`terraform validate`)
- [ ] Plan reviewed (`terraform plan`)
- [ ] Infrastructure deployed (`terraform apply`)
- [ ] Waited 2-3 minutes for containers to start
- [ ] Frontend accessible via browser
- [ ] Backend API responding
- [ ] Application tested successfully

---

## 🎯 Summary

**Current Status**: Ready to deploy - waiting for valid AWS credentials

**What You Need to Do**:
1. Configure AWS credentials using `./setup-aws-credentials.sh`
2. Run `terraform apply`
3. Wait 2-3 minutes
4. Access your application!

**Questions?** Check the troubleshooting section or review the logs.
