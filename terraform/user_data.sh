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

# Configure firewall properly - ALLOW SSH, not LIMIT
echo "🔧 Configuring UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (port 22) - ALLOW not LIMIT
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow application port
ufw allow 3000/tcp

# Enable firewall
ufw --force enable

# Verify firewall status
echo "📋 Firewall status:"
ufw status

# Create application directory
mkdir -p /opt/fbr-live-invoicing
cd /opt/fbr-live-invoicing

# Create environment file with placeholders
cat > .env << EOL
NODE_ENV=production
PORT=3001
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
      - PORT=3001
      - MONGODB_URI=\${MONGODB_URI}
      - JWT_SECRET=\${JWT_SECRET}
      - FBR_ACCESS_TOKEN=\${FBR_ACCESS_TOKEN}
      - STATIC_IP=\${STATIC_IP}
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
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

# Create a flag file to indicate setup is complete
touch /opt/fbr-live-invoicing/setup-complete

echo "🚀 Server setup complete!"
echo "📝 Next steps:"
echo "1. Update .env file with actual values"
echo "2. Copy your application code to /opt/fbr-live-invoicing/"
echo "3. Run: docker-compose up -d"
echo "4. Check logs: docker-compose logs -f"
echo "✅ Firewall configured to ALLOW SSH (not LIMIT)"
echo "✅ Docker and Docker Compose installed"
echo "✅ No nginx proxy needed - handled inside container"
