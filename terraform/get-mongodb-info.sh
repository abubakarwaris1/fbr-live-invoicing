#!/bin/bash

echo "🔍 Getting MongoDB connection information..."
echo ""

# Get the connection string
echo "�� MongoDB Connection String:"
echo "================================"
terraform output -raw database_connection_string
echo ""
echo ""

# Get individual components
echo "📋 Individual Components:"
echo "================================"
echo "Host: $(terraform output -raw database_host)"
echo "Port: $(terraform output -raw database_port)"
echo "Database: $(terraform output -raw database_name)"
echo "User: $(terraform output -raw database_user)"
echo "Password: $(terraform output -raw database_password)"
echo ""

# Get server IP
echo "📋 Server Information:"
echo "================================"
echo "Static IP: $(terraform output -raw api_static_ip)"
echo "Droplet IP: $(terraform output -raw droplet_ip)"
echo ""

echo "📝 Next Steps:"
echo "================================"
echo "1. Copy the MongoDB connection string above"
echo "2. Add it to GitHub Environment as 'MONGODB_URI'"
echo "3. SSH into server and update .env file:"
echo "   ssh -i private_key.pem root@$(terraform output -raw api_static_ip)"
echo "4. Update .env file with actual values"
echo "5. Restart application: docker-compose restart"
