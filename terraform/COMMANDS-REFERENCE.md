# 📋 AWS Deployment Commands Reference

## 🚀 Complete Command Sequence

### Initial Setup (One-time)

```bash
# 1. Open WSL Ubuntu
wsl

# 2. Navigate to project
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# 3. Make scripts executable
chmod +x setup-aws.sh deploy.sh

# 4. Setup AWS credentials and tools
./setup-aws.sh
# Enter: AWS Access Key ID
# Enter: AWS Secret Access Key
# Enter: Region (or press Enter for us-east-1)
```

### Deploy Application

```bash
# 1. Run deployment script
./deploy.sh

# 2. Review plan, type 'yes' when prompted
# 3. Wait 3-5 minutes
# 4. Note the public IP address
```

### Verify Deployment

```bash
# SSH into server (replace XX.XX.XX.XX with your IP)
ssh -i quickcart-key.pem ubuntu@XX.XX.XX.XX

# Once logged in:
cd /opt/quickcart
docker compose ps
docker compose logs -f
```

---

## 🔧 Management Commands

### On Your WSL Machine

```bash
# Check Terraform state
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform show

# View outputs
terraform output

# Get specific output
terraform output instance_public_ip

# Destroy everything
terraform destroy
```

### On EC2 Server (after SSH)

```bash
# Navigate to app directory
cd /opt/quickcart

# Check container status
docker compose ps

# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs frontend
docker compose logs backend
docker compose logs mongodb

# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend

# Stop all services
docker compose down

# Start all services
docker compose up -d

# Pull latest images and restart
docker compose pull
docker compose up -d

# Check Docker images
docker images

# Check running containers
docker ps

# Check container resource usage
docker stats

# Access MongoDB shell
docker exec -it quickcart-mongodb mongosh
# Then: use quickcart
# Then: db.products.find()

# Access backend container
docker exec -it quickcart-backend sh

# Check system resources
free -h          # Memory
df -h            # Disk space
top              # CPU usage

# Check open ports
sudo netstat -tlnp

# View user-data logs (EC2 initialization)
sudo cat /var/log/cloud-init-output.log

# Reboot EC2
sudo reboot
```

---

## 🧪 Testing Commands

### Test Backend API

```bash
# From WSL or any terminal (replace XX.XX.XX.XX with your IP)

# Get products
curl http://XX.XX.XX.XX:5000/api/products

# Health check
curl http://XX.XX.XX.XX:5000/api/health

# Test with browser
# Open: http://XX.XX.XX.XX:5000/api/products
```

### Test Frontend

```bash
# Open in browser:
http://XX.XX.XX.XX
# or
http://XX.XX.XX.XX:3000
```

---

## 🐛 Troubleshooting Commands

### AWS Credential Issues

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check AWS CLI configuration
cat ~/.aws/credentials
cat ~/.aws/config

# Reconfigure AWS
aws configure
```

### Terraform Issues

```bash
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform

# Reinitialize Terraform
rm -rf .terraform
terraform init

# Validate configuration
terraform validate

# Format files
terraform fmt

# Check state
terraform state list

# Refresh state
terraform refresh

# Force unlock (if locked)
terraform force-unlock LOCK_ID
```

### Container Issues (on EC2)

```bash
# Check Docker daemon
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# View Docker daemon logs
sudo journalctl -u docker

# Clean up Docker
docker system prune -a  # WARNING: Removes everything

# Rebuild containers
docker compose down
docker compose pull
docker compose up -d --force-recreate

# Check specific container logs
docker logs quickcart-frontend
docker logs quickcart-backend
docker logs quickcart-mongodb

# Inspect container
docker inspect quickcart-backend

# Check container network
docker network ls
docker network inspect quickcart_quickcart-network
```

### Network Issues

```bash
# On EC2:

# Check firewall
sudo ufw status

# Check if ports are listening
sudo netstat -tlnp | grep 3000
sudo netstat -tlnp | grep 5000
sudo netstat -tlnp | grep 27017

# Test connectivity
curl localhost:3000
curl localhost:5000
curl localhost:27017

# Check DNS
nslookup google.com
ping 8.8.8.8

# From WSL, test EC2 ports:
nc -zv XX.XX.XX.XX 22
nc -zv XX.XX.XX.XX 3000
nc -zv XX.XX.XX.XX 5000
```

---

## 🔄 Update Workflow

### When Jenkins Pushes New Images

```bash
# Option 1: Manual update on EC2
ssh -i quickcart-key.pem ubuntu@XX.XX.XX.XX
cd /opt/quickcart
docker compose pull
docker compose up -d

# Option 2: Automated (add to Jenkins)
# Jenkins pipeline stage:
# ssh ubuntu@EC2_IP 'cd /opt/quickcart && docker compose pull && docker compose up -d'
```

### Update Docker Compose Configuration

```bash
# On EC2:
cd /opt/quickcart
nano docker-compose.yml  # Edit file
docker compose down
docker compose up -d
```

---

## 💾 Backup Commands

### Backup MongoDB Data

```bash
# On EC2:
docker exec quickcart-mongodb mongodump \
  --db quickcart \
  --out /data/backup

# Copy backup to local
docker cp quickcart-mongodb:/data/backup ./backup
```

### Restore MongoDB Data

```bash
# On EC2:
docker exec quickcart-mongodb mongorestore \
  --db quickcart \
  /data/backup/quickcart
```

---

## 🔐 Security Commands

### Update SSH Key Permissions

```bash
# On WSL:
chmod 400 quickcart-key.pem
```

### View Security Group Rules

```bash
# On WSL:
aws ec2 describe-security-groups \
  --group-names quickcart-sg \
  --query 'SecurityGroups[0].IpPermissions'
```

### Check IAM Role

```bash
aws iam get-role --role-name quickcart-ssm-role
```

---

## 📊 Monitoring Commands

### Check AWS Resources

```bash
# List EC2 instances
aws ec2 describe-instances \
  --filters "Name=tag:Project,Values=quickcart" \
  --query 'Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress]'

# Check Elastic IPs
aws ec2 describe-addresses \
  --filters "Name=tag:Project,Values=quickcart"

# View Free Tier usage
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### On EC2 Server

```bash
# System monitoring
htop                    # Interactive process viewer
iostat                  # CPU and I/O stats
vmstat                  # Virtual memory stats
df -h                   # Disk space
free -m                 # Memory usage
uptime                  # System uptime and load

# Docker monitoring
docker stats            # Container resource usage
docker system df        # Docker disk usage
```

---

## 🧹 Cleanup Commands

### Stop Services (Keep Infrastructure)

```bash
# On EC2:
cd /opt/quickcart
docker compose down
```

### Stop EC2 (Keep for Later)

```bash
# From WSL:
aws ec2 stop-instances --instance-ids i-xxxxx
# No charges while stopped (except EBS storage)

# Start again:
aws ec2 start-instances --instance-ids i-xxxxx
```

### Destroy Everything

```bash
# From WSL:
cd /mnt/c/Users/User/Desktop/Devops/Devops/QuickCart/terraform
terraform destroy
# Type: yes

# This deletes:
# ❌ EC2 instance
# ❌ Elastic IP
# ❌ Security Group
# ❌ SSH Key Pair
# ❌ ALL DATA
```

---

## 📝 Log Files Locations

### On EC2

```bash
# Cloud-init (EC2 startup)
/var/log/cloud-init.log
/var/log/cloud-init-output.log

# Docker logs
/var/lib/docker/containers/

# Application logs
# Use: docker compose logs instead

# System logs
/var/log/syslog
/var/log/kern.log
```

---

## 🔄 CI/CD Integration

### Jenkins Pipeline Commands

```groovy
// Add to Jenkinsfile

stage('Deploy to AWS') {
    steps {
        sshagent(['aws-quickcart-key']) {
            sh """
                ssh -o StrictHostKeyChecking=no ubuntu@\${EC2_PUBLIC_IP} '
                    cd /opt/quickcart && \
                    docker compose pull && \
                    docker compose up -d && \
                    docker compose ps
                '
            """
        }
    }
}
```

### Manual Deploy After Jenkins Build

```bash
# After Jenkins pushes to Docker Hub:
ssh -i quickcart-key.pem ubuntu@XX.XX.XX.XX
cd /opt/quickcart
docker compose pull
docker compose up -d
```

---

## ⚡ Quick Reference

| Task | Command |
|------|---------|
| Deploy to AWS | `./deploy.sh` |
| SSH to server | `ssh -i quickcart-key.pem ubuntu@IP` |
| Check containers | `docker compose ps` |
| View logs | `docker compose logs -f` |
| Restart app | `docker compose restart` |
| Update images | `docker compose pull && docker compose up -d` |
| Destroy all | `terraform destroy` |
| Check AWS resources | `terraform show` |
| Get public IP | `terraform output instance_public_ip` |

---

## 🆘 Emergency Commands

### Application Down?

```bash
# Quick fix:
ssh -i quickcart-key.pem ubuntu@IP
cd /opt/quickcart
docker compose restart

# Full restart:
docker compose down
docker compose up -d

# Nuclear option:
sudo reboot
```

### High CPU/Memory?

```bash
# Check what's using resources:
docker stats
top

# Restart specific service:
docker compose restart backend
```

### Disk Full?

```bash
# Clean Docker:
docker system prune -a

# Clean old logs:
sudo journalctl --vacuum-time=1d
```

---

**💡 Pro Tip:** Bookmark this file for quick reference during deployment and troubleshooting!
