#!/bin/bash

# Start Express.js backend in the background
echo "Starting Express.js backend on port 3001..."
cd /app/server && node server.js &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start Nginx in the foreground
echo "Starting Nginx on port 3000..."
nginx -g "daemon off;"

# If Nginx exits, kill the backend
kill $BACKEND_PID
