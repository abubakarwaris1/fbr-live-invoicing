#!/bin/bash

echo "🚀 Setting up server manually..."

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

echo "📤 Uploading user_data.sh to server..."
scp -i private_key.pem user_data.sh root@$SERVER_IP:/tmp/

echo "�� Running setup script on server..."
ssh -i private_key.pem root@$SERVER_IP << 'EOL'
chmod +x /tmp/user_data.sh
/tmp/user_data.sh
EOL

echo "✅ Server setup complete!"
echo "🌐 Your server should now be accessible at:"
echo "   http://$SERVER_IP"
echo "   http://$SERVER_IP/api/health"
