#!/bin/bash

# JobConnect AI - Oracle Cloud Setup Script
# This script automates the setup of JobConnect AI on Oracle Cloud Infrastructure

set -e  # Exit on any error

echo "🚀 JobConnect AI - Oracle Cloud Setup"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated successfully"

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git build-essential python3 python3-pip htop
print_success "Essential packages installed"

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
print_success "Node.js installed"

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js version: $NODE_VERSION"
print_success "npm version: $NPM_VERSION"

# Install global npm packages
print_status "Installing global npm packages..."
npm install -g pm2
print_success "PM2 installed globally"

# Create project directory
PROJECT_DIR="/home/ubuntu/jobconnect-ai"
print_status "Setting up project directory: $PROJECT_DIR"

if [ -d "$PROJECT_DIR" ]; then
    print_warning "Project directory already exists, updating..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    print_status "Cloning JobConnect AI repository..."
    git clone https://github.com/pdhama/jobconnect-ai.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Install project dependencies
print_status "Installing project dependencies..."
npm install
print_success "Dependencies installed"

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating environment file..."
    cat > .env.local << EOF
# JobConnect AI Environment Variables
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration (Supabase)
# DATABASE_URL=your-supabase-url
# SUPABASE_URL=your-supabase-url
# SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Configuration (Ollama)
# OLLAMA_URL=http://localhost:11434

# Job Scraping Configuration
# SCRAPING_ENABLED=true
# RATE_LIMIT_DELAY=3000
EOF
    print_success "Environment file created"
else
    print_warning "Environment file already exists"
fi

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw allow 8080
sudo ufw --force enable
print_success "Firewall configured"

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
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
    max_memory_restart: '1G',
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

# Create startup script
print_status "Creating startup script..."
cat > /home/ubuntu/start-jobconnect.sh << 'EOF'
#!/bin/bash
cd /home/ubuntu/jobconnect-ai
git pull origin main
npm install
pm2 start ecosystem.config.js
echo "JobConnect AI started successfully!"
echo "Access the application at: http://$(curl -s ifconfig.me):3000"
EOF

chmod +x /home/ubuntu/start-jobconnect.sh
print_success "Startup script created"

# Create systemd service for auto-start
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/jobconnect-ai.service > /dev/null << EOF
[Unit]
Description=JobConnect AI Application
After=network.target

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

# Create monitoring script
print_status "Creating monitoring script..."
cat > /home/ubuntu/monitor-jobconnect.sh << 'EOF'
#!/bin/bash
echo "=== JobConnect AI System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""
echo "=== PM2 Status ==="
pm2 status
echo ""
echo "=== System Resources ==="
free -h
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== Application Logs (Last 50 lines) ==="
pm2 logs jobconnect-ai --lines 50
EOF

chmod +x /home/ubuntu/monitor-jobconnect.sh
print_success "Monitoring script created"

# Test the application
print_status "Testing application..."
npm run build
print_success "Application built successfully"

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup
print_success "Application started with PM2"

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me)
print_success "Setup completed successfully!"
echo ""
echo "🎉 JobConnect AI is now running on Oracle Cloud!"
echo ""
echo "📋 Access Information:"
echo "   - Application URL: http://$PUBLIC_IP:3000"
echo "   - PM2 Status: pm2 status"
echo "   - Logs: pm2 logs jobconnect-ai"
echo "   - Monitor: ./monitor-jobconnect.sh"
echo "   - Restart: pm2 restart jobconnect-ai"
echo ""
echo "🔧 Development Commands:"
echo "   - SSH into instance: ssh ubuntu@$PUBLIC_IP"
echo "   - Navigate to project: cd /home/ubuntu/jobconnect-ai"
echo "   - Start development: npm run dev"
echo ""
echo "📝 Next Steps:"
echo "   1. Configure your domain (optional)"
echo "   2. Set up SSL certificate (optional)"
echo "   3. Configure environment variables"
echo "   4. Connect Cursor for remote development"
echo ""
echo "🚀 Happy coding on Oracle Cloud!" 