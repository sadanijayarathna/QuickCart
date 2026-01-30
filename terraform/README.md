# 🚀 QuickCart Terraform Deployment

**Status:** ✅ Fixed & Ready for Deployment  
**Platform:** AWS Free Tier  
**Environment:** WSL Ubuntu

---

## ⚡ Quick Start (2 Commands)

```bash
# 1. Setup AWS credentials (one-time)
./setup-aws.sh

# 2. Deploy to AWS
./deploy.sh
```

**Done!** Your app will be live in ~5 minutes.

---

## 📋 Prerequisites

Before deploying, ensure you have:

✅ **AWS Account** with Free Tier access  
✅ **AWS Access Keys** (Access Key ID + Secret Access Key)  
✅ **WSL Ubuntu** installed on Windows  
✅ **Docker images** on Docker Hub:
   - `sadanijayarathna/quickcart-backend:latest`
   - `sadanijayarathna/quickcart-frontend:latest`

---

## 🏗️ Infrastructure Components

### What Terraform Creates:
terraform init
```

### Step 3: Review Deployment Plan
```bash
terraform plan
```

### Step 4: Deploy to AWS
```bash
terraform apply
```
Type `yes` when prompted to confirm.

### Step 5: Access Your Application
After deployment (wait 2-3 minutes), access:
- **Frontend**: http://YOUR_PUBLIC_IP
- **Backend**: http://YOUR_PUBLIC_IP:5000

## 📁 Files Created

- `main.tf` - Main infrastructure configuration
- `variables.tf` - Configurable variables
- `outputs.tf` - Output values after deployment
- `user-data.sh` - EC2 initialization script
- `quickcart-key.pem` - SSH private key (auto-generated)

## 🔧 What Happens During Deployment

1. **Terraform Creates Resources**:
   - EC2 instance with Ubuntu 22.04
   - Security group with required ports
   - SSH key pair for access
   - Elastic IP for static address

2. **EC2 User Data Script Runs**:
   - Installs Docker and Docker Compose
   - Pulls QuickCart images from Docker Hub
   - Creates docker-compose.yml
   - Starts all containers (MongoDB, Backend, Frontend)
   - Sets up auto-start on reboot

3. **Application Starts**:
   - MongoDB on port 27017
   - Backend on port 5000
   - Frontend on ports 80 and 3000

## 🔑 SSH Access

```bash
# SSH into your server
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP

# Check container status
docker compose ps

# View logs
docker compose logs -f

# Restart application
cd /opt/quickcart
./start.sh
```

## 📊 Monitoring

```bash
# Check all containers
docker ps

# View specific service logs
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb

# Check resource usage
docker stats
```

## 🛑 Destroy Infrastructure

When you're done, remove all AWS resources:

```bash
terraform destroy
```
Type `yes` to confirm.

## 💰 Cost Estimation

- **EC2 t2.medium**: ~$0.0464/hour (~$33/month)
- **30GB EBS Storage**: ~$3/month
- **Elastic IP**: Free (when attached to running instance)
- **Data Transfer**: Variable based on usage

**Estimated Total**: ~$36-40/month

## 🔒 Security Notes

- Security group is configured for development
- In production, restrict SSH access to your IP
- Consider using HTTPS with SSL certificates
- MongoDB is accessible only within Docker network

## 🐛 Troubleshooting

### Application not accessible?
1. Wait 2-3 minutes for containers to start
2. Check security group allows ports 80, 3000, 5000
3. SSH and run: `docker compose ps`

### SSH connection refused?
1. Ensure .pem file has correct permissions: `chmod 400 quickcart-key.pem`
2. Check if instance is running in AWS Console
3. Verify security group allows SSH (port 22)

### Containers not running?
```bash
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
cd /opt/quickcart
docker compose down
docker compose up -d
docker compose logs -f
```

## 📝 Terraform Commands Reference

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Format files
terraform fmt

# Plan deployment
terraform plan

# Apply changes
terraform apply

# Show current state
terraform show

# List outputs
terraform output

# Destroy everything
terraform destroy
```

## 🎯 Next Steps After Deployment

1. **Test the Application**:
   - Visit http://YOUR_PUBLIC_IP
   - Create an account
   - Browse products
   - Test shopping cart

2. **Configure Domain** (Optional):
   - Point your domain to the Elastic IP
   - Set up SSL with Let's Encrypt

3. **Set Up Monitoring**:
   - CloudWatch for AWS metrics
   - Application logging

4. **Backup Strategy**:
   - Schedule MongoDB backups
   - Create AMI snapshots

## 📞 Support

If you encounter issues:
1. Check Terraform outputs: `terraform output`
2. Review EC2 logs: `/var/log/cloud-init-output.log`
3. Check Docker logs: `docker compose logs`
