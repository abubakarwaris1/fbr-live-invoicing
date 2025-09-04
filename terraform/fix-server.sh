#!/bin/bash

echo "🔧 Fixing server configuration..."

# Get server IP from terraform
SERVER_IP=$(terraform output -raw api_static_ip)
echo "📡 Server IP: $SERVER_IP"

# Check if private key exists
if [ ! -f "private_key.pem" ]; then
    echo "❌ private_key.pem not found!"
    echo "Run 'terraform apply' first to generate the SSH key"
    exit 1
fi

echo "🔑 SSH key found"

# Make sure private key has correct permissions
chmod 600 private_key.pem

echo "🔧 Applying firewall and Nginx fixes..."
ssh -i private_key.pem root@$SERVER_IP << 'EOL'
# Configure firewall to allow HTTP and HTTPS
echo "🔥 Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Configure Nginx as reverse proxy
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/fbr-live-invoicing << 'NGINX_EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # Frontend (React app)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API endpoints
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_EOF

# Enable the site and remove default
ln -sf /etc/nginx/sites-available/fbr-live-invoicing /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo "✅ Server configuration fixed!"
EOL

echo "✅ Server fixes applied!"
echo "🌐 Your server should now be accessible at:"
echo "   http://$SERVER_IP"
echo "   http://$SERVER_IP/api/health"
