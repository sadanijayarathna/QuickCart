# 🐳 Push QuickCart Docker Images to Docker Hub

## 📋 Current Docker Images:
- quickcart-backend (150MB)
- quickcart-frontend (435MB)

## 🔐 Step 1: Create Docker Hub Account (if you don't have one)

1. Go to: https://hub.docker.com/signup
2. Create a free account
3. Remember your Docker Hub username

## 🔑 Step 2: Login to Docker Hub

In PowerShell/WSL, run:

```powershell
wsl sudo docker login
```

Enter:
- Username: Your Docker Hub username
- Password: Your Docker Hub password

You should see: "Login Succeeded"

## 🏷️ Step 3: Tag Your Images

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```powershell
# Tag backend image
wsl sudo docker tag quickcart-backend YOUR_DOCKERHUB_USERNAME/quickcart-backend:latest

# Tag frontend image
wsl sudo docker tag quickcart-frontend YOUR_DOCKERHUB_USERNAME/quickcart-frontend:latest

# Optional: Also tag with version number
wsl sudo docker tag quickcart-backend YOUR_DOCKERHUB_USERNAME/quickcart-backend:v1.0
wsl sudo docker tag quickcart-frontend YOUR_DOCKERHUB_USERNAME/quickcart-frontend:v1.0
```

## 📤 Step 4: Push Images to Docker Hub

```powershell
# Push backend
wsl sudo docker push YOUR_DOCKERHUB_USERNAME/quickcart-backend:latest

# Push frontend
wsl sudo docker push YOUR_DOCKERHUB_USERNAME/quickcart-frontend:latest

# If you tagged with version, push those too:
wsl sudo docker push YOUR_DOCKERHUB_USERNAME/quickcart-backend:v1.0
wsl sudo docker push YOUR_DOCKERHUB_USERNAME/quickcart-frontend:v1.0
```

This will take several minutes depending on your internet speed.

## ✅ Step 5: Verify on Docker Hub

1. Go to: https://hub.docker.com/repositories
2. You should see:
   - YOUR_USERNAME/quickcart-backend
   - YOUR_USERNAME/quickcart-frontend

## 🎯 Example with Username "sadanijayarathna":

```powershell
# Login
wsl sudo docker login

# Tag images
wsl sudo docker tag quickcart-backend sadanijayarathna/quickcart-backend:latest
wsl sudo docker tag quickcart-frontend sadanijayarathna/quickcart-frontend:latest

# Push images
wsl sudo docker push sadanijayarathna/quickcart-backend:latest
wsl sudo docker push sadanijayarathna/quickcart-frontend:latest
```

## 📝 Step 6: Update docker-compose.yaml (Optional)

After pushing, update your docker-compose.yaml to use Docker Hub images:

```yaml
services:
  backend:
    image: YOUR_DOCKERHUB_USERNAME/quickcart-backend:latest
    # Remove the 'build' section if you want to use the pre-built image
    
  frontend:
    image: YOUR_DOCKERHUB_USERNAME/quickcart-frontend:latest
    # Remove the 'build' section if you want to use the pre-built image
```

## 🌐 Benefits of Pushing to Docker Hub:

✅ **Easy Deployment:** Anyone can pull and run your images
✅ **Version Control:** Track different versions of your images
✅ **CI/CD Integration:** Use in automated pipelines
✅ **Cloud Deployment:** Deploy to AWS, Azure, Google Cloud, etc.
✅ **Collaboration:** Share with team members easily

## 📊 Upload Time Estimates:

- Backend (150MB): ~2-5 minutes
- Frontend (435MB): ~5-10 minutes
- Total: ~10-15 minutes (depends on internet speed)

## 🔄 How Others Can Use Your Images:

After pushing, anyone can run:

```bash
# Pull images
docker pull YOUR_USERNAME/quickcart-backend:latest
docker pull YOUR_USERNAME/quickcart-frontend:latest

# Or just run docker-compose
docker compose up
```

Docker will automatically pull your images from Docker Hub!

## 🎨 Make Images Public or Private:

### Public (Free):
- Anyone can see and pull your images
- Good for open-source projects
- Default option

### Private (Limited Free):
- Only you can access
- Docker Hub free tier: 1 private repository
- Good for proprietary code

To make private:
1. Go to repository on Docker Hub
2. Click "Settings"
3. Change visibility to "Private"

## 🏷️ Tagging Best Practices:

```powershell
# Latest tag (always points to newest)
:latest

# Version tags
:v1.0
:v1.0.0

# Date tags
:2025-11-09

# Environment tags
:production
:staging
:development
```

## 🚀 Quick Commands Summary:

```powershell
# 1. Login
wsl sudo docker login

# 2. Tag (replace YOUR_USERNAME)
wsl sudo docker tag quickcart-backend YOUR_USERNAME/quickcart-backend:latest
wsl sudo docker tag quickcart-frontend YOUR_USERNAME/quickcart-frontend:latest

# 3. Push
wsl sudo docker push YOUR_USERNAME/quickcart-backend:latest
wsl sudo docker push YOUR_USERNAME/quickcart-frontend:latest

# 4. Verify
# Visit: https://hub.docker.com/repositories
```

## 🆘 Troubleshooting:

### "unauthorized: authentication required"
- Run: `wsl sudo docker login` again
- Ensure correct username/password

### "denied: requested access to the resource is denied"
- Check your Docker Hub username is correct
- Verify you're logged in: `wsl sudo docker info | grep Username`

### Upload is slow
- Normal for large images
- Docker uploads layers, not the entire image
- Subsequent pushes will be faster (only changed layers)

### "name invalid"
- Username must be lowercase
- No spaces or special characters

## 📖 After Pushing:

Your Docker Hub repositories will show:
- Image size
- Number of pulls
- Tags available
- Last updated date
- Dockerfile (if you want to include it)

Anyone can now deploy your QuickCart application with:

```bash
docker pull YOUR_USERNAME/quickcart-backend
docker pull YOUR_USERNAME/quickcart-frontend
docker compose up
```

---

**Ready to push? Start with Step 2 (Login) above!** 🚀
