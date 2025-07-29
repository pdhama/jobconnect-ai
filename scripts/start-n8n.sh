#!/bin/bash

echo "🚀 Starting n8n for JobConnect AI..."

# Load environment variables
if [ -f .env.n8n ]; then
  export $(cat .env.n8n | grep -v '^#' | xargs)
fi

# Start n8n
n8n start

echo "✅ n8n started successfully!"
echo "🌐 Access at: http://localhost:5678"
echo "👤 Login: admin / jobconnect2025"
