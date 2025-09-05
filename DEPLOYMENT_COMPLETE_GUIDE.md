# Complete Deployment Guide

## 🚀 One-Command Deployment

This repository is now configured for **one-command deployment**. Once you have the infrastructure set up, you can deploy your application with a single push to the main branch.

## 📋 Prerequisites

### 1. GitHub Secrets Configuration
Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

```bash
STATIC_IP=144.126.251.143
SERVER_SSH_KEY=<your_private_key_content>
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
FBR_ACCESS_TOKEN=<your_fbr_token>
```

### 2. DigitalOcean Token
Set your DigitalOcean token:
```bash
export TF_VAR_DIGITALOCEAN_TOKEN=your_token_here
```

## 🏗️ Infrastructure Setup (One-time)

### Option 1: Clean Infrastructure Setup
```bash
cd terraform
terraform destroy  # If you have existing infrastructure
terraform apply    # Create new infrastructure
```

### Option 2: Fix Existing Infrastructure
```bash
cd terraform
./fix-nginx-proxy.sh  # Fix nginx proxy on existing server
```

## 🚀 Application Deployment

### Automatic Deployment (Recommended)
1. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy application"
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Run tests
   - Build the frontend
   - Deploy to server
   - Configure nginx proxy
   - Start the application

### Manual Deployment (If needed)
```bash
cd terraform
./fix-nginx-proxy.sh
```

## 🌐 Application URLs

After deployment, your application will be available at:

- **Frontend**: http://144.126.251.143/
- **API**: http://144.126.251.143/api/
- **Health Check**: http://144.126.251.143/health
- **API Health**: http://144.126.251.143/api/health

## 🏗️ Architecture

```
Internet → 144.126.251.143:80 (DO Server Nginx) → 127.0.0.1:3000 (Container Nginx) → {
  /api/* → Express.js (Port 3001)
  /* → React App (Static Files)
}
```

## 📁 Key Files

### Infrastructure
- `terraform/main.tf` - Infrastructure configuration
- `terraform/user_data.sh` - Server setup script
- `terraform/outputs.tf` - Output URLs

### Application
- `Dockerfile` - Container configuration with nginx
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Nginx configuration inside container
- `start.sh` - Container startup script

### CI/CD
- `.github/workflows/deploy.yml` - GitHub Actions deployment

## 🔧 Troubleshooting

### Check Container Status
```bash
ssh -i terraform/private_key.pem root@144.126.251.143 "cd /opt/fbr-live-invoicing && docker-compose ps"
```

### Check Logs
```bash
ssh -i terraform/private_key.pem root@144.126.251.143 "cd /opt/fbr-live-invoicing && docker-compose logs"
```

### Test Endpoints
```bash
curl http://144.126.251.143/health
curl http://144.126.251.143/api/health
```

## ✅ Verification Checklist

- [ ] Infrastructure created with `terraform apply`
- [ ] GitHub secrets configured
- [ ] Push to main branch triggers deployment
- [ ] Frontend accessible at http://144.126.251.143/
- [ ] API accessible at http://144.126.251.143/api/
- [ ] Health checks passing
- [ ] No port numbers required in URLs

## 🎉 Success!

Your FBR Live Invoicing application is now fully automated and can be deployed with a single push to the main branch!
