#!/bin/bash
# Start n8n with JobConnect AI configuration

echo "🚀 Starting n8n for JobConnect AI..."

# Load environment variables
if [ -f .env.n8n ]; then
  export $(cat .env.n8n | grep -v '^#' | xargs)
fi

# Start n8n
n8n start \
  --port=${N8N_PORT:-5678} \
  --host=${N8N_HOST:-localhost} \
  --protocol=${N8N_PROTOCOL:-http} \
  --user-management=${N8N_USER_MANAGEMENT_DISABLED:-false} \
  --basic-auth=${N8N_BASIC_AUTH_ACTIVE:-false}

echo "✅ n8n started successfully!"
echo "🌐 Access n8n at: http://localhost:${N8N_PORT:-5678}"
