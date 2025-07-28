#!/bin/bash

# JobConnect AI - Oracle Cloud Environment Setup Script
# Based on the comprehensive PRD for Oracle Cloud deployment

set -e  # Exit on any error

echo "🚀 JobConnect AI - Oracle Cloud Environment Setup"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

print_section() {
    echo -e "${CYAN}=== $1 ===${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Get instance IP
INSTANCE_IP=$(curl -s ifconfig.me)
print_success "Detected instance IP: $INSTANCE_IP"

print_section "Phase 1: System Preparation"

# Update system
print_step "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated successfully"

# Install essential packages
print_step "Installing essential packages..."
sudo apt install -y curl wget git htop nano vim build-essential python3 python3-pip unzip
print_success "Essential packages installed"

print_section "Phase 2: Swap File Setup"

# Create swap file for better performance
print_step "Creating 4GB swap file..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap
SWAP_SIZE=$(free -h | grep Swap | awk '{print $2}')
print_success "Swap file created: $SWAP_SIZE"

print_section "Phase 3: Node.js Installation"

# Install Node.js 20 LTS
print_step "Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js version: $NODE_VERSION"
print_success "npm version: $NPM_VERSION"

# Install global npm packages
print_step "Installing global npm packages..."
npm install -g pm2 supabase
print_success "Global packages installed"

print_section "Phase 4: Docker Installation"

# Install Docker
print_step "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt install -y docker-compose-v2

# Verify Docker installation
DOCKER_VERSION=$(docker --version)
COMPOSE_VERSION=$(docker compose version)
print_success "Docker version: $DOCKER_VERSION"
print_success "Docker Compose version: $COMPOSE_VERSION"

print_section "Phase 5: Project Setup"

# Create project directory
PROJECT_DIR="/home/ubuntu/jobconnect-ai"
print_step "Setting up project directory: $PROJECT_DIR"

if [ -d "$PROJECT_DIR" ]; then
    print_warning "Project directory already exists, updating..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    print_step "Cloning JobConnect AI repository..."
    git clone https://github.com/pdhama/jobconnect-ai.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Install project dependencies
print_step "Installing project dependencies..."
npm install
print_success "Dependencies installed"

print_section "Phase 6: Environment Configuration"

# Create environment file
print_step "Creating environment configuration..."
cat > .env.local << EOF
# JobConnect AI Environment Variables
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://$INSTANCE_IP:3000

# Database Configuration (Supabase)
# DATABASE_URL=your_supabase_project_url
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Local Development URLs (for Oracle Cloud instance)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key

# n8n Configuration
N8N_WEBHOOK_URL=http://$INSTANCE_IP:5678/webhook

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434

# External APIs
# HUNTER_API_KEY=your_hunter_api_key
# SERP_API_KEY=your_serp_api_key

# Google Services
# GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json

# Job Scraping Configuration
SCRAPING_ENABLED=true
RATE_LIMIT_DELAY=3000
EOF

print_success "Environment file created"

print_section "Phase 7: n8n Setup"

# Create n8n directory structure
print_step "Setting up n8n..."
mkdir -p ~/jobconnect-n8n/{data,postgres,redis}
cd ~/jobconnect-n8n

# Create Docker Compose configuration for n8n
cat > docker-compose.yml << EOF
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://$INSTANCE_IP:5678
      - GENERIC_TIMEZONE=Asia/Kolkata
      - N8N_DEFAULT_BINARY_DATA_MODE=filesystem
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=jobconnect2024
    volumes:
      - ./data:/home/node/.n8n
      - /var/run/docker.sock:/var/run/docker.sock
  
  postgres:
    image: postgres:13
    restart: unless-stopped
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n_user
      - POSTGRES_PASSWORD=n8n_password
    volumes:
      - ./postgres:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - ./redis:/data
EOF

print_success "n8n configuration created"

print_section "Phase 8: Ollama Setup"

# Install Ollama
print_step "Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

# Verify Ollama installation
OLLAMA_VERSION=$(ollama --version)
print_success "Ollama version: $OLLAMA_VERSION"

# Pull required models for JobConnect AI
print_step "Pulling AI models..."
ollama pull llama3.3:70b    # For resume generation
ollama pull qwen2.5:14b     # For email personalization  
ollama pull phi3:mini       # For quick tasks

# Check available models
print_step "Available models:"
ollama list

print_section "Phase 9: Supabase Local Setup"

# Navigate back to project directory
cd "$PROJECT_DIR"

# Initialize Supabase (if not already initialized)
print_step "Initializing Supabase..."
if [ ! -f "supabase/config.toml" ]; then
    supabase init
fi

print_success "Supabase initialized"

print_section "Phase 10: Security Configuration"

# Configure firewall
print_step "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 3000  # Next.js dev
sudo ufw allow 5678  # n8n
sudo ufw allow 11434 # Ollama
sudo ufw allow 54321:54324/tcp # Supabase
sudo ufw --force enable
print_success "Firewall configured"

print_section "Phase 11: PM2 Configuration"

# Create PM2 ecosystem file
print_step "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'jobconnect-ai',
    script: 'npm',
    args: 'run dev',
    cwd: '$PROJECT_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

print_success "PM2 configuration created"

print_section "Phase 12: Service Management Scripts"

# Create startup script
print_step "Creating service management scripts..."
cat > /home/ubuntu/start-jobconnect.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting JobConnect AI Development Environment..."

# Start Docker services (n8n)
echo "Starting n8n..."
cd ~/jobconnect-n8n
docker compose up -d

# Start Ollama service
echo "Starting Ollama..."
sudo systemctl start ollama

# Start Supabase
echo "Starting Supabase..."
cd ~/jobconnect-ai
supabase start

# Start Next.js application
echo "Starting Next.js application..."
pm2 start ecosystem.config.js

echo "✅ All services started successfully!"
echo ""
echo "📋 Access Information:"
echo "   - Next.js App: http://YOUR_INSTANCE_IP:3000"
echo "   - n8n: http://YOUR_INSTANCE_IP:5678 (admin/jobconnect2024)"
echo "   - Supabase Studio: http://localhost:54323"
echo "   - Ollama API: http://localhost:11434"
EOF

chmod +x /home/ubuntu/start-jobconnect.sh

# Create stop script
cat > /home/ubuntu/stop-jobconnect.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping JobConnect AI Development Environment..."

# Stop Next.js application
pm2 stop jobconnect-ai

# Stop Supabase
cd ~/jobconnect-ai
supabase stop

# Stop Docker services
cd ~/jobconnect-n8n
docker compose down

echo "✅ All services stopped."
EOF

chmod +x /home/ubuntu/stop-jobconnect.sh

# Create monitoring script
cat > /home/ubuntu/monitor-jobconnect.sh << 'EOF'
#!/bin/bash
echo "📊 JobConnect AI System Status"
echo "=============================="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""
echo "=== System Resources ==="
free -h
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== PM2 Status ==="
pm2 status
echo ""
echo "=== Docker Services ==="
docker ps
echo ""
echo "=== Ollama Models ==="
ollama list
echo ""
echo "=== Application Logs (Last 20 lines) ==="
pm2 logs jobconnect-ai --lines 20
EOF

chmod +x /home/ubuntu/monitor-jobconnect.sh

print_success "Service management scripts created"

print_section "Phase 13: Systemd Service Setup"

# Create systemd service for auto-start
print_step "Creating systemd service..."
sudo tee /etc/systemd/system/jobconnect-ai.service > /dev/null << EOF
[Unit]
Description=JobConnect AI Application
After=network.target docker.service

[Service]
Type=forking
User=ubuntu
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable jobconnect-ai.service
print_success "Systemd service configured"

print_section "Phase 14: Backup and Monitoring"

# Create backup script
print_step "Setting up backup system..."
mkdir -p ~/backups

cat > ~/backup-project.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf ~/backups/jobconnect_backup_$DATE.tar.gz ~/jobconnect-ai
find ~/backups -name "jobconnect_backup_*.tar.gz" -mtime +7 -delete
echo "Backup completed: jobconnect_backup_$DATE.tar.gz"
EOF

chmod +x ~/backup-project.sh

# Add to crontab for daily backup
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup-project.sh") | crontab -
print_success "Backup system configured"

print_section "Phase 15: Testing and Verification"

# Test the application
print_step "Testing application build..."
npm run build
print_success "Application built successfully"

# Start services for testing
print_step "Starting services for testing..."
cd ~/jobconnect-n8n
docker compose up -d

cd "$PROJECT_DIR"
pm2 start ecosystem.config.js

# Wait a moment for services to start
sleep 10

print_success "Setup completed successfully!"
echo ""
echo "🎉 JobConnect AI is now running on Oracle Cloud!"
echo ""
echo "📋 Access Information:"
echo "   - Next.js App: http://$INSTANCE_IP:3000"
echo "   - n8n Dashboard: http://$INSTANCE_IP:5678 (admin/jobconnect2024)"
echo "   - Supabase Studio: http://localhost:54323"
echo "   - Ollama API: http://localhost:11434"
echo ""
echo "🔧 Management Commands:"
echo "   - Start all services: ~/start-jobconnect.sh"
echo "   - Stop all services: ~/stop-jobconnect.sh"
echo "   - Monitor system: ~/monitor-jobconnect.sh"
echo "   - Backup project: ~/backup-project.sh"
echo ""
echo "📝 Next Steps:"
echo "   1. Configure your domain (optional)"
echo "   2. Set up SSL certificate (optional)"
echo "   3. Configure environment variables"
echo "   4. Connect Cursor for remote development"
echo ""
echo "🚀 Happy coding on Oracle Cloud!" 