#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker root
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx
apt-get install -y nginx

# Create application directory
mkdir -p /opt/fbr-live-invoicing
cd /opt/fbr-live-invoicing

# Create environment file with placeholders
cat > .env << EOL
NODE_ENV=production
PORT=3000
MONGODB_URI=PLACEHOLDER_MONGODB_URI
JWT_SECRET=$(openssl rand -base64 32)
FBR_ACCESS_TOKEN=PLACEHOLDER_FBR_ACCESS_TOKEN
STATIC_IP=PLACEHOLDER_STATIC_IP
EOL

# Create docker-compose file
cat > docker-compose.yml << EOL
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=\${MONGODB_URI}
      - JWT_SECRET=\${JWT_SECRET}
      - FBR_ACCESS_TOKEN=\${FBR_ACCESS_TOKEN}
      - STATIC_IP=\${STATIC_IP}
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOL

# Configure Nginx
cat > /etc/nginx/sites-available/fbr-live-invoicing << EOL
server {
    listen 80;
    server_name _;

    # Serve your application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/fbr-live-invoicing /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Create a flag file to indicate setup is complete
touch /opt/fbr-live-invoicing/setup-complete

echo "🚀 Server setup complete!"
echo "📝 Next steps:"
echo "1. Update .env file with actual values"
echo "2. Run: docker-compose up -d"
echo "3. Check logs: docker-compose logs -f"
