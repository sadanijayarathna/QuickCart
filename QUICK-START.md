# 🚀 QuickCart AWS Deployment - Quick Reference

## ⚡ Quick Start (3 Steps)

### 1️⃣ Configure AWS Credentials
```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
./setup-aws-credentials.sh
```

### 2️⃣ Deploy to AWS
```bash
./deploy.sh
```
OR manually:
```bash
terraform apply
```

### 3️⃣ Access Your App
```
Frontend: http://YOUR_PUBLIC_IP
Backend:  http://YOUR_PUBLIC_IP:5000
```
**Wait 2-3 minutes after deployment for containers to start**

---

## 📋 Command Cheat Sheet

```bash
# Navigate to terraform directory
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# Check AWS credentials
aws sts get-caller-identity

# Configure credentials
./setup-aws-credentials.sh

# Automated deployment
./deploy.sh

# Manual terraform commands
terraform validate        # Check configuration
terraform plan           # Preview changes
terraform apply          # Deploy infrastructure
terraform output         # Show deployment info
terraform destroy        # Delete everything

# SSH into server
chmod 400 quickcart-key.pem
ssh -i quickcart-key.pem ubuntu@YOUR_IP

# On server - check containers
docker compose ps
docker compose logs -f
docker compose restart

# On server - restart app
cd /opt/quickcart
./start.sh
```

---

## 🎯 What Gets Created

✅ EC2 Instance (t2.medium, Ubuntu 22.04, 30GB)  
✅ Security Group (ports: 22, 80, 443, 3000, 5000, 27017)  
✅ Elastic IP (static public IP)  
✅ SSH Key Pair (quickcart-key.pem)  
✅ MongoDB Database (pre-seeded with 38 products)  
✅ Backend API (Express.js on port 5000)  
✅ Frontend App (React.js on ports 80 & 3000)  

---

## ⏱️ Timeline

- AWS Credentials: 2 min
- terraform apply: 5-7 min
- Container startup: 2-3 min
- **Total: ~10-12 min**

---

## 💰 Monthly Cost

~$36-40/month  
(EC2: $33 + Storage: $3 + Data: variable)

**Save money**: Run `terraform destroy` when not using!

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Invalid credentials | Run `./setup-aws-credentials.sh` |
| Can't access app | Wait 2-3 min, check http:// not https:// |
| SSH denied | Run `chmod 400 quickcart-key.pem` |
| Containers not running | SSH in and run `docker compose up -d` |

---

## 📁 Important Files

```
terraform/
├── deploy.sh                   ← Run this to deploy
├── setup-aws-credentials.sh    ← Configure AWS
├── main.tf                     ← Infrastructure code
├── quickcart-key.pem          ← SSH key (after deploy)
└── deployment-info.txt        ← URLs and access info
```

---

## 🎯 Status Check

✅ Prerequisites installed  
✅ Docker images ready  
✅ Terraform configured  
⚠️ **AWS credentials needed** ← Do this next  
⬜ Deploy to AWS  
⬜ Access application  

---

## 📞 Need Help?

Read detailed guides:
- `TERRAFORM-DEPLOYMENT-SUMMARY.md` - Complete summary
- `AWS-DEPLOYMENT-GUIDE.md` - Step-by-step guide
- `terraform/README.md` - Terraform documentation

---

**Ready? Run `./setup-aws-credentials.sh` then `./deploy.sh`!** 🚀
