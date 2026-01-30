# 🆓 QuickCart AWS Free Tier Deployment Guide

## ✅ Free Tier Configuration Applied

Your QuickCart application is now configured for **AWS Free Tier**:

- ✅ **Instance Type**: t2.micro (Free Tier eligible)
- ✅ **Storage**: 20GB gp2 (Free Tier: up to 30GB)
- ✅ **Elastic IP**: 1 free (when attached to running instance)
- ✅ **Data Transfer**: 15GB/month outbound (Free Tier)
- ✅ **Duration**: 750 hours/month (enough for 24/7 operation)

---

## 📋 AWS Free Tier Requirements

### You Need an AWS Account

**Option 1: AWS Free Tier Account (Recommended)**
1. Go to https://aws.amazon.com/free/
2. Click "Create a Free Account"
3. Provide email, password, and credit card (required but won't be charged)
4. Complete phone verification
5. Select "Basic Support - Free"

**Option 2: AWS Academy Learner Lab (If you're a student)**
- You already have access through your educational institution
- Start your Learner Lab to get temporary credentials

---

## 🚀 Step-by-Step Deployment Instructions

### **STEP 1: Get Your AWS Credentials**

#### For AWS Free Tier Account:

1. **Login to AWS Console**: https://console.aws.amazon.com/
2. **Create IAM User** (Best Practice):
   - Go to **IAM** service
   - Click **Users** → **Add users**
   - Username: `quickcart-deployer`
   - Select: ✅ **Access key - Programmatic access**
   - Click **Next: Permissions**
   - Select: **Attach existing policies directly**
   - Search and select: `AdministratorAccess` (for deployment)
   - Click **Next** → **Next** → **Create user**
   - **IMPORTANT**: Copy the **Access Key ID** and **Secret Access Key**

#### For AWS Academy Learner Lab:

1. Open your AWS Academy course
2. Click **Modules** → **Learner Lab**
3. Click **Start Lab** (wait for AWS ● to turn green)
4. Click **AWS Details**
5. Click **Show** next to AWS CLI credentials
6. You'll see three values - you need all three

---

### **STEP 2: Configure AWS Credentials in WSL**

Open your **WSL terminal** (you can open it from VS Code or Windows Terminal) and run:

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
./setup-aws-credentials.sh
```

**When prompted, enter:**

#### For AWS Free Tier Account:
```
AWS Access Key ID: [paste your Access Key ID]
AWS Secret Access Key: [paste your Secret Access Key]
Default region name: us-east-1
Default output format: json
```

#### For AWS Academy Learner Lab:
You need to manually edit the credentials file:

```bash
# Open credentials file
nano ~/.aws/credentials
```

Paste this format (replace with your actual values from AWS Details):
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
aws_session_token = YOUR_SESSION_TOKEN
```

Press `Ctrl+O` to save, `Enter` to confirm, `Ctrl+X` to exit.

Then set region:
```bash
aws configure set region us-east-1
```

**Verify credentials:**
```bash
aws sts get-caller-identity
```

You should see your account information. ✅

---

### **STEP 3: Deploy to AWS Free Tier**

Now that credentials are configured, deploy:

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform apply
```

**What you'll see:**
1. Terraform shows the deployment plan
2. Review the resources to be created:
   - 1 EC2 instance (t2.micro)
   - 1 Security group
   - 1 Elastic IP
   - 1 SSH key pair
   - 1 20GB EBS volume

3. Type `yes` and press Enter to confirm

**Deployment time:** ~5-7 minutes

---

### **STEP 4: Wait for Application to Start**

After Terraform completes:

1. **Note the outputs** - Terraform will display:
   ```
   frontend_url = "http://YOUR_PUBLIC_IP"
   backend_url = "http://YOUR_PUBLIC_IP:5000"
   ssh_command = "ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP"
   ```

2. **Wait 2-3 minutes** for Docker containers to start
   - EC2 is installing Docker
   - Pulling images from Docker Hub
   - Starting MongoDB, Backend, Frontend

3. **Test the application:**
   - Open browser: `http://YOUR_PUBLIC_IP`
   - You should see QuickCart homepage ✅

---

### **STEP 5: Verify Deployment** (Optional)

SSH into your server to check status:

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
chmod 400 quickcart-key.pem
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
```

Once connected, check containers:

```bash
# Check if containers are running
docker compose ps

# View logs
cd /opt/quickcart
docker compose logs

# Check MongoDB has data
docker exec -it quickcart-mongodb mongosh quickcart --eval "db.products.countDocuments()"
# Should show: 38 (products)
```

---

## 💰 AWS Free Tier Limits

### ✅ What's Free (First 12 Months)

| Service | Free Tier Limit | QuickCart Usage |
|---------|----------------|-----------------|
| **EC2 t2.micro** | 750 hours/month | ✅ 730 hours (24/7) |
| **EBS Storage** | 30GB | ✅ 20GB |
| **Data Transfer** | 15GB outbound | ✅ Depends on usage |
| **Elastic IP** | 1 free (when attached) | ✅ 1 IP |

### ⚠️ Important Notes

1. **750 hours = 31.25 days** - Enough for one instance running 24/7
2. **After 12 months**: You'll be charged (~$8-10/month for t2.micro)
3. **Multiple instances**: If you run 2+ instances, hours add up
4. **Data transfer**: First 15GB outbound is free, then ~$0.09/GB

---

## 🔧 Managing Your Free Tier Instance

### Check Your Instance Status

```bash
# From WSL
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# View current infrastructure
terraform show

# Get outputs again
terraform output
```

### Stop Instance to Save Hours (Keep Infrastructure)

```bash
# SSH into instance
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP

# Stop all containers
cd /opt/quickcart
docker compose down

# Exit SSH
exit

# Stop EC2 instance from AWS Console or CLI
aws ec2 stop-instances --instance-ids $(terraform output -raw instance_id)
```

**Note**: Elastic IP charges $0.005/hour when instance is stopped. Better to destroy completely if not using.

### Restart Stopped Instance

```bash
# Start instance
aws ec2 start-instances --instance-ids $(terraform output -raw instance_id)

# Wait 2-3 minutes, then SSH and start containers
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
cd /opt/quickcart
docker compose up -d
```

### Completely Remove Everything (Stop All Charges)

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform destroy
```

Type `yes` to confirm. This removes:
- EC2 instance
- Elastic IP
- Security group
- EBS volume
- SSH key pair

**Your code and Docker images remain safe!** You can redeploy anytime.

---

## 📊 Monitor Free Tier Usage

### AWS Console Method

1. Login to AWS Console
2. Click your account name (top right)
3. Click **Billing Dashboard**
4. Click **Free Tier** in left menu
5. See your usage vs. limits

### AWS CLI Method

```bash
# Check EC2 instances
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,InstanceType,State.Name,PublicIpAddress]' --output table

# Check volumes
aws ec2 describe-volumes --query 'Volumes[].[VolumeId,Size,State]' --output table
```

---

## 🎯 What to Do After Deployment

### 1. **Test Your Application** (5 minutes)
   - Open `http://YOUR_PUBLIC_IP`
   - Create a user account
   - Browse products
   - Add items to cart
   - Place a test order

### 2. **Set Up Monitoring** (Optional)
   - AWS CloudWatch (Free Tier: 10 metrics)
   - Set up billing alerts

### 3. **Optimize for Free Tier** (If needed)
   - Monitor resource usage
   - Clear unused Docker images on server
   - Reduce log retention

### 4. **Plan for Production** (Future)
   - Add domain name
   - Set up HTTPS with Let's Encrypt
   - Use RDS for MongoDB (not in Free Tier)
   - Add load balancer

---

## 🚨 Common Issues & Solutions

### Issue: "Not eligible for Free Tier"
**Cause**: Your AWS account is over 12 months old  
**Solution**: You'll pay ~$8-10/month for t2.micro (still very cheap!)

### Issue: "Insufficient instance capacity"
**Cause**: AWS has no available t2.micro in that availability zone  
**Solution**: Try a different region:
```bash
# Edit variables.tf and change region
nano variables.tf
# Change: default = "us-west-2"  # or "eu-west-1"
```

### Issue: Application not accessible after 10 minutes
**Solution**: 
```bash
# SSH into server
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP

# Check cloud-init logs
sudo tail -f /var/log/cloud-init-output.log

# Manually start if needed
cd /opt/quickcart
sudo ./start.sh
```

### Issue: "Out of memory" errors
**Cause**: t2.micro has only 1GB RAM, Docker containers may struggle  
**Solution**: 
1. SSH into server
2. Create swap file:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## ✅ Free Tier Deployment Checklist

- [ ] AWS Free Tier account created (or Learner Lab started)
- [ ] IAM user created with credentials (or Learner Lab credentials copied)
- [ ] AWS credentials configured in WSL
- [ ] Credentials verified with `aws sts get-caller-identity`
- [ ] Terraform configuration updated for t2.micro ✅ (Already done!)
- [ ] Ran `terraform apply`
- [ ] Typed `yes` to confirm deployment
- [ ] Waited 5-7 minutes for deployment
- [ ] Waited 2-3 minutes for containers to start
- [ ] Accessed `http://YOUR_PUBLIC_IP` in browser
- [ ] Application is working! 🎉

---

## 💡 Pro Tips for Free Tier

1. **Set up billing alerts**: Get notified if you exceed Free Tier
   ```bash
   aws cloudwatch put-metric-alarm --alarm-name billing-alarm \
     --alarm-description "Alert when bill exceeds $1" \
     --metric-name EstimatedCharges --namespace AWS/Billing \
     --statistic Maximum --period 21600 --threshold 1 \
     --comparison-operator GreaterThanThreshold
   ```

2. **Use CloudWatch Logs** (Free Tier: 5GB)
   - Monitor application without SSH

3. **Tag Resources** for tracking:
   - All resources already tagged as "quickcart"

4. **Destroy when not using**:
   - Run `terraform destroy` to avoid charges
   - Redeploy takes only 10 minutes

5. **Backup important data**:
   - MongoDB data is in Docker volume
   - Export before destroying

---

## 📞 Quick Command Reference

```bash
# Navigate to terraform directory
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# Configure AWS credentials
./setup-aws-credentials.sh

# Deploy
terraform apply

# Get IP and URLs
terraform output

# SSH into server
chmod 400 quickcart-key.pem
ssh -i quickcart-key.pem ubuntu@$(terraform output -raw instance_public_ip)

# Destroy everything
terraform destroy
```

---

## 🎊 Summary

**You're now ready to deploy QuickCart on AWS Free Tier!**

**Current Status:**
- ✅ Terraform configured for t2.micro (Free Tier)
- ✅ Storage optimized to 20GB gp2 (Free Tier)
- ✅ All scripts ready
- ✅ Docker images ready

**Next Steps:**
1. Get AWS credentials (5 minutes)
2. Run `./setup-aws-credentials.sh` (2 minutes)
3. Run `terraform apply` (5-7 minutes)
4. Access your app! (http://YOUR_IP)

**Total time**: ~15-20 minutes  
**Cost**: $0 (Free Tier) for first 12 months

Let's deploy! 🚀
