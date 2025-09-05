#!/bin/bash

echo "🔍 Verifying FBR Live Invoicing Configuration..."

# Check if all required files exist
echo "📁 Checking required files..."
files=(
    "Dockerfile"
    "docker-compose.yml"
    "nginx.conf"
    "start.sh"
    "server/server.js"
    "terraform/main.tf"
    "terraform/user_data.sh"
    "terraform/outputs.tf"
    ".github/workflows/deploy.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check Dockerfile configuration
echo "�� Checking Dockerfile..."
if grep -q "nginx" Dockerfile && grep -q "start.sh" Dockerfile; then
    echo "✅ Dockerfile properly configured with nginx and start.sh"
else
    echo "❌ Dockerfile missing nginx or start.sh configuration"
    exit 1
fi

# Check docker-compose.yml
echo "🐳 Checking docker-compose.yml..."
if grep -q "3000:3000" docker-compose.yml && grep -q "PORT=3001" docker-compose.yml; then
    echo "✅ docker-compose.yml properly configured"
else
    echo "❌ docker-compose.yml missing proper port configuration"
    exit 1
fi

# Check nginx.conf
echo "🌐 Checking nginx.conf..."
if grep -q "listen 3000" nginx.conf && grep -q "proxy_pass http://localhost:3001" nginx.conf; then
    echo "✅ nginx.conf properly configured"
else
    echo "❌ nginx.conf missing proper configuration"
    exit 1
fi

# Check server.js
echo "🚀 Checking server.js..."
if grep -q "PORT = process.env.PORT || 3001" server/server.js; then
    echo "✅ server.js properly configured for port 3001"
else
    echo "❌ server.js not configured for port 3001"
    exit 1
fi

# Check terraform configuration
echo "🏗️ Checking terraform configuration..."
if grep -q "port_range.*80" terraform/main.tf && grep -q "proxy_pass http://127.0.0.1:3000" terraform/user_data.sh; then
    echo "✅ Terraform properly configured with nginx proxy"
else
    echo "❌ Terraform missing nginx proxy configuration"
    exit 1
fi

# Check GitHub workflow
echo "🔄 Checking GitHub workflow..."
if grep -q "STATIC_IP" .github/workflows/deploy.yml && grep -q "nginx" .github/workflows/deploy.yml; then
    echo "✅ GitHub workflow properly configured"
else
    echo "❌ GitHub workflow missing proper configuration"
    exit 1
fi

echo ""
echo "🎉 All configurations verified successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up GitHub secrets (STATIC_IP, SERVER_SSH_KEY, MONGODB_URI, JWT_SECRET, FBR_ACCESS_TOKEN)"
echo "2. Run: cd terraform && terraform apply"
echo "3. Push to main branch to trigger deployment"
echo ""
echo "🌐 Your application will be available at:"
echo "   Frontend: http://144.126.251.143/"
echo "   API: http://144.126.251.143/api/"
echo "   Health: http://144.126.251.143/health"
