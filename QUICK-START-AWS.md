# 🚀 QuickCart AWS Deployment - Quick Start

## ⚡ Fast Track Deployment (5 Minutes)

### Prerequisites Check
- ✅ WSL Ubuntu installed
- ✅ AWS Free Tier account created
- ✅ AWS Access Key ID and Secret Access Key ready
- ✅ Docker images on Docker Hub: `sadanijayarathna/quickcart-backend` & `quickcart-frontend`

---

## 🎯 3 Simple Steps

### Step 1: Setup AWS (One-time)

Open WSL Ubuntu terminal:

```bash
# Navigate to terraform directory
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# Make scripts executable
chmod +x setup-aws.sh deploy.sh

# Run AWS setup
./setup-aws.sh
```

**Enter when prompted:**
- AWS Access Key ID: `YOUR_ACCESS_KEY`
- AWS Secret Access Key: `YOUR_SECRET_KEY`
- AWS Region: `us-east-1` (or press Enter for default)

---

### Step 2: Deploy to AWS

```bash
# Run deployment
./deploy.sh
```

**What to expect:**
1. Script validates credentials ✅
2. Shows deployment plan
3. Asks for confirmation (type `yes`)
4. Creates AWS resources (3-5 minutes)
5. Displays access URLs

---

### Step 3: Access Your Application

After deployment, you'll see:

```
🌐 Frontend URL: http://XX.XX.XX.XX
🔌 Backend API: http://XX.XX.XX.XX:5000
```

**Wait 2-3 minutes** for containers to start, then:
- Open browser → `http://YOUR_PUBLIC_IP`
- Your QuickCart app is live! 🎉

---

## 🔍 Verify Deployment

```bash
# SSH into server
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP

# Check containers
docker compose ps

# View logs
docker compose logs -f
```

Expected output:
```
✅ quickcart-mongodb    Up (healthy)
✅ quickcart-backend    Up
✅ quickcart-frontend   Up
```

---

## 🛠️ Common Commands

### Check Status
```bash
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
cd /opt/quickcart
docker compose ps
```

### Restart Application
```bash
docker compose restart
```

### View Logs
```bash
docker compose logs -f
```

### Update Images (after Jenkins pushes new version)
```bash
docker compose pull
docker compose up -d
```

---

## 🧹 Cleanup (When Done)

**To avoid any charges:**

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform destroy
```

Type `yes` when prompted.

**This deletes everything!** All data will be lost.

---

## 💰 Cost Monitoring

**Within AWS Free Tier:** $0/month  
**After Free Tier:** ~$8-10/month

**Check Free Tier usage:**
- AWS Console → Billing → Free Tier

**Set billing alert:**
- AWS Console → CloudWatch → Billing Alarms

---

## ❌ Troubleshooting

### Application Not Loading?

```bash
# Wait 3 minutes after deployment, then:
ssh -i quickcart-key.pem ubuntu@YOUR_PUBLIC_IP
docker compose ps  # Check if all containers are Up
docker compose logs  # Check for errors
```

### SSH Permission Denied?

```bash
chmod 400 quickcart-key.pem
```

### Containers Not Running?

```bash
# On EC2 server:
cd /opt/quickcart
docker compose down
docker compose pull
docker compose up -d
```

---

## 📚 Full Documentation

For detailed information, see: **AWS-DEPLOYMENT-COMPLETE-GUIDE.md**

---

## ✅ Success Checklist

- [ ] AWS credentials configured
- [ ] Deployment script ran successfully
- [ ] Received public IP address
- [ ] Can SSH into server
- [ ] All 3 containers running
- [ ] Frontend accessible in browser
- [ ] Backend API responding

---

## 🎉 Next Steps

1. **Test your application** thoroughly
2. **Set up billing alerts** in AWS Console
3. **Configure Jenkins** to auto-deploy on code changes
4. **Monitor logs** regularly

---

**Need help?** Check the complete guide: `AWS-DEPLOYMENT-COMPLETE-GUIDE.md`

**Deployed successfully?** 🎊 Congratulations! Your app is live on AWS!
