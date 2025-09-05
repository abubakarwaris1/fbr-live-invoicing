#!/bin/bash

# Fix UFW firewall configuration on existing server
set -e

echo "🔧 Fixing UFW firewall configuration..."

# Get server IP from terraform
SERVER_IP=$(terraform output -raw droplet_ip)
STATIC_IP=$(terraform output -raw api_static_ip)

echo "📡 Server IP: $SERVER_IP"
echo "🌐 Static IP: $STATIC_IP"

# Fix firewall on server
ssh -i private_key.pem root@$STATIC_IP << 'REMOTE_SCRIPT'
set -e

echo "🔧 Fixing UFW firewall on server..."

# Reset UFW to clean state
ufw --force reset

# Set defaults
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (port 22) - ALLOW not LIMIT
echo "✅ Allowing SSH (port 22)..."
ufw allow 22/tcp

# Allow HTTP and HTTPS
echo "✅ Allowing HTTP (port 80)..."
ufw allow 80/tcp

echo "✅ Allowing HTTPS (port 443)..."
ufw allow 443/tcp

# Allow application port
echo "✅ Allowing application port (3000)..."
ufw allow 3000/tcp

# Enable firewall
echo "🔧 Enabling firewall..."
ufw --force enable

# Show final status
echo "📋 Final firewall status:"
ufw status

echo "✅ Firewall configuration fixed!"
echo "🔑 SSH should now work properly for GitHub Actions"
REMOTE_SCRIPT

echo "🎉 Firewall fix completed!"
echo "📝 You can now run your GitHub Actions deployment"
