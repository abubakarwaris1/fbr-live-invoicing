#!/bin/bash

# FBR Live Invoicing Deployment Script
set -e

echo "🚀 Starting FBR Live Invoicing deployment..."

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
echo "🔨 Building Docker image..."
docker build -t fbr-live-invoicing:latest .

echo "✅ Docker image built successfully"

# Initialize Terraform
echo "🏗️  Initializing Terraform..."
cd terraform
terraform init

# Plan Terraform deployment
echo "📋 Planning Terraform deployment..."
terraform plan

# Ask for confirmation
read -p "Do you want to apply these changes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Applying Terraform configuration..."
    terraform apply -auto-approve
    
    echo "✅ Infrastructure deployed successfully!"
    
    # Get outputs
    echo ""
    echo "📊 Deployment Information:"
    echo "=================================="
    echo "🌐 Web Interface: $(terraform output -raw app_url)"
    echo "🔗 API Static IP: $(terraform output -raw api_static_ip)"
    echo "📡 API Base URL: $(terraform output -raw api_url)"
    echo "🏥 Health Check: $(terraform output -raw api_url)/api/health"
    echo "🔐 Auth Endpoint: $(terraform output -raw api_url)/api/auth"
    echo "📄 Invoices API: $(terraform output -raw api_url)/api/gov-invoices"
    echo ""
    echo "🏛️  Government Integration Details:"
    echo "=================================="
    echo "Static IP Address: $(terraform output -raw api_static_ip)"
    echo "Port: 3000"
    echo "Base URL: $(terraform output -raw api_url)"
    echo ""
    echo "⚠️  IMPORTANT: This static IP will NOT change even if you destroy and recreate the server!"
    echo "   You can safely provide this IP to government systems for integration."
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy your application code to the server"
    echo "2. Run the deployment script on the server"
    echo "3. Configure your domain (if using custom domain)"
    echo "4. Provide the static IP $(terraform output -raw api_static_ip) to government systems"
    
else
    echo "❌ Deployment cancelled"
    exit 1
fi
