#!/bin/bash

# FBR Live Invoicing Container Deployment Script
set -e

echo "🚀 Starting FBR Live Invoicing container deployment..."

# Check if required environment variables are set
if [ -z "$TF_VAR_DIGITALOCEAN_TOKEN" ]; then
    echo "❌ Error: TF_VAR_DIGITALOCEAN_TOKEN environment variable is not set"
    echo "Please set it with: export TF_VAR_DIGITALOCEAN_TOKEN=your_token_here"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and fill in your values"
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET not set in .env file"
    exit 1
fi

if [ -z "$FBR_ACCESS_TOKEN" ]; then
    echo "⚠️  Warning: FBR_ACCESS_TOKEN not set in .env file"
fi

echo "✅ Environment variables loaded"

# Build Docker image
echo "🔨 Building Docker image with nginx inside container..."
docker build -t fbr-live-invoicing:latest .

echo "✅ Docker image built successfully"

# Get server IP from terraform
cd terraform
SERVER_IP=$(terraform output -raw droplet_ip)
STATIC_IP=$(terraform output -raw api_static_ip)
cd ..

echo "📡 Server IP: $SERVER_IP"
echo "🌐 Static IP: $STATIC_IP"

# Copy application to server
echo "📤 Copying application to server..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.env' \
    --exclude='terraform/.terraform' \
    --exclude='terraform/terraform.tfstate*' \
    -e "ssh -i terraform/private_key.pem" \
    ./ root@$SERVER_IP:/opt/fbr-live-invoicing/

# Copy .env file separately
echo "📤 Copying environment file..."
scp -i terraform/private_key.pem .env root@$SERVER_IP:/opt/fbr-live-invoicing/

# Deploy on server
echo "🚀 Deploying on server..."
ssh -i terraform/private_key.pem root@$SERVER_IP << 'REMOTE_SCRIPT'
cd /opt/fbr-live-invoicing

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Remove old images
echo "🗑️  Cleaning up old images..."
docker image prune -f || true

# Start new containers
echo "🚀 Starting new containers..."
docker-compose up -d

# Wait for health check
echo "⏳ Waiting for application to be ready..."
sleep 30

# Check if application is running
echo "🔍 Checking application status..."
docker-compose ps

# Test health endpoint
echo "🏥 Testing health endpoint..."
curl -f http://localhost:3000/health || echo "❌ Health check failed"

echo "✅ Deployment completed on server"
REMOTE_SCRIPT

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Application Information:"
echo "=================================="
echo "🌐 Web Interface: http://$STATIC_IP:3000"
echo "🔗 API Base URL: http://$STATIC_IP:3000/api"
echo "🏥 Health Check: http://$STATIC_IP:3000/health"
echo "🔐 Auth Endpoint: http://$STATIC_IP:3000/api/auth"
echo "📄 Invoices API: http://$STATIC_IP:3000/api/gov-invoices"
echo ""
echo "🏛️  Government Integration Details:"
echo "=================================="
echo "Static IP Address: $STATIC_IP"
echo "Port: 3000"
echo "Base URL: http://$STATIC_IP:3000/api"
echo ""
echo "⚠️  IMPORTANT: This static IP will NOT change even if you destroy and recreate the server!"
echo "   You can safely provide this IP to government systems for integration."
echo ""
echo "📝 Architecture:"
echo "- Nginx runs inside container on port 3000"
echo "- Express.js backend runs on port 3001 (internal)"
echo "- No nginx proxy on DO server needed"
echo "- All requests handled by container nginx"
