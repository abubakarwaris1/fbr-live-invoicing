#!/bin/bash

# Fix nginx proxy configuration on existing server
set -e

echo "🔧 Setting up nginx proxy on existing server..."

# Get server IP from terraform
SERVER_IP=$(terraform output -raw droplet_ip)
STATIC_IP=$(terraform output -raw api_static_ip)

echo "📡 Server IP: $SERVER_IP"
echo "🌐 Static IP: $STATIC_IP"

# Fix nginx proxy on server
ssh -i private_key.pem root@$STATIC_IP << 'REMOTE_SCRIPT'
set -e

echo "🔧 Installing and configuring nginx proxy..."

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    apt-get update
    apt-get install -y nginx
fi

# Configure nginx proxy
echo "🔧 Configuring nginx proxy..."
cat > /etc/nginx/sites-available/fbr-live-invoicing << 'NGINX_CONFIG'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # Proxy all requests to container on port 3000
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
NGINX_CONFIG

# Enable the site and remove default
ln -sf /etc/nginx/sites-available/fbr-live-invoicing /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

# Start and enable nginx
echo "🚀 Starting nginx..."
systemctl start nginx
systemctl enable nginx

# Update firewall to allow port 80
echo "🔧 Updating firewall..."
ufw allow 80/tcp

echo "✅ Nginx proxy configuration completed!"
echo "🌐 Application should now be accessible at:"
echo "   Frontend: http://$STATIC_IP/"
echo "   API: http://$STATIC_IP/api/"
echo "   Health: http://$STATIC_IP/health"
REMOTE_SCRIPT

echo "🎉 Nginx proxy setup completed!"
echo "📝 You can now access your application without port numbers:"
echo "   Frontend: http://$STATIC_IP/"
echo "   API: http://$STATIC_IP/api/"
