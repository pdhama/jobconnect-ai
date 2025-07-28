# 🚀 JobConnect AI - Oracle Cloud Quick Start Guide

## 📋 **Prerequisites Checklist**

Before starting, ensure you have:
- [ ] Oracle Cloud account created
- [ ] SSH key pair generated
- [ ] Cursor IDE installed locally
- [ ] Git repository access

## 🎯 **Step-by-Step Deployment**

### **Step 1: Create Oracle Cloud Instance**

1. **Log into Oracle Cloud Console**
   - Go to [cloud.oracle.com](https://cloud.oracle.com)
   - Navigate to **Compute > Instances > Create Instance**

2. **Configure Instance**
   ```
   Name: jobconnect-ai-dev
   Image: Canonical Ubuntu 24.04 LTS
   Shape: VM.Standard.A1.Flex
   OCPU: 4
   Memory: 24 GB
   Boot Volume: 200 GB
   ```

3. **Configure Security**
   ```
   Public IP: Yes
   Security Lists: Allow all traffic (temporarily)
   SSH Key: Upload your public key
   ```

4. **Launch Instance**
   - Click "Create"
   - Note your instance IP address

### **Step 2: Connect to Instance**

```bash
# Test SSH connection
ssh -i ~/.ssh/your-oracle-key.pem ubuntu@YOUR_INSTANCE_IP

# If successful, you'll see the Ubuntu welcome message
```

### **Step 3: Run Environment Setup**

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/pdhama/jobconnect-ai/main/deployment/environment-setup.sh | bash

# Or manually download and run
wget https://raw.githubusercontent.com/pdhama/jobconnect-ai/main/deployment/environment-setup.sh
chmod +x environment-setup.sh
./environment-setup.sh
```

### **Step 4: Configure SSH for Cursor**

```bash
# On your local machine, edit SSH config
nano ~/.ssh/config

# Add this configuration:
Host jobconnect-oracle
    HostName YOUR_INSTANCE_IP
    User ubuntu
    IdentityFile ~/.ssh/your-oracle-key.pem
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ForwardAgent yes
```

### **Step 5: Connect Cursor IDE**

1. **Open Cursor IDE**
2. **Install Remote-SSH Extension**
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Remote - SSH"
   - Install the extension

3. **Connect to Remote Host**
   - Press `Ctrl+Shift+P`
   - Type "Remote-SSH: Connect to Host"
   - Select "jobconnect-oracle"
   - Choose "Linux" platform

4. **Open Project**
   - Click "Open Folder"
   - Navigate to `/home/ubuntu/jobconnect-ai`
   - Open the folder

## 🚀 **Quick Start Commands**

### **Start All Services**
```bash
# On Oracle Cloud instance
~/start-jobconnect.sh
```

### **Monitor System**
```bash
# Check system status
~/monitor-jobconnect.sh

# View application logs
pm2 logs jobconnect-ai
```

### **Stop All Services**
```bash
# Stop all services
~/stop-jobconnect.sh
```

## 📊 **Access Your Applications**

After setup, access your services at:

- **JobConnect AI App**: `http://YOUR_INSTANCE_IP:3000`
- **n8n Dashboard**: `http://YOUR_INSTANCE_IP:5678`
  - Username: `admin`
  - Password: `jobconnect2024`
- **Supabase Studio**: `http://localhost:54323` (via SSH tunnel)
- **Ollama API**: `http://localhost:11434` (via SSH tunnel)

## 🔧 **Development Workflow**

### **Daily Development**
```bash
# Connect to remote instance
ssh jobconnect-oracle

# Navigate to project
cd /home/ubuntu/jobconnect-ai

# Start development
npm run dev

# The app will be available at:
# http://YOUR_INSTANCE_IP:3000
```

### **Using Cursor IDE**
```bash
# Quick connection command
cursor --remote ssh-remote+jobconnect-oracle /home/ubuntu/jobconnect-ai
```

### **File Synchronization**
```bash
# Sync from local to remote
rsync -avz --progress --exclude 'node_modules' --exclude '.next' \
  -e "ssh -i ~/.ssh/your-oracle-key.pem" \
  /path/to/your/local/jobconnect-ai/ \
  ubuntu@YOUR_INSTANCE_IP:/home/ubuntu/jobconnect-ai/
```

## 📝 **Environment Variables**

Edit `.env.local` on the remote instance:

```bash
# Database Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration
OLLAMA_HOST=http://localhost:11434

# External APIs
HUNTER_API_KEY=your_hunter_api_key
SERP_API_KEY=your_serp_api_key
```

## 🔒 **Security Configuration**

### **Firewall Setup**
```bash
# Configure firewall (already done by setup script)
sudo ufw status

# If needed, manually configure:
sudo ufw allow ssh
sudo ufw allow 3000  # Next.js
sudo ufw allow 5678  # n8n
sudo ufw allow 11434 # Ollama
sudo ufw allow 54321:54324/tcp # Supabase
sudo ufw enable
```

### **SSH Key Management**
```bash
# Generate new key if needed
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to Oracle Cloud instance
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@YOUR_INSTANCE_IP
```

## 📊 **Monitoring and Maintenance**

### **System Monitoring**
```bash
# Check system resources
htop
free -h
df -h

# Check running services
pm2 status
docker ps
ollama list
```

### **Backup and Recovery**
```bash
# Manual backup
~/backup-project.sh

# View backup files
ls -la ~/backups/

# Restore from backup
tar -xzf ~/backups/jobconnect_backup_YYYYMMDD_HHMMSS.tar.gz
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Issue 1: Connection Timeout**
```bash
# Check network connectivity
ping YOUR_INSTANCE_IP

# Test SSH connection
ssh -v jobconnect-oracle

# Check firewall
sudo ufw status
```

#### **Issue 2: Out of Memory**
```bash
# Check memory usage
free -h

# Increase swap if needed
sudo fallocate -l 8G /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

#### **Issue 3: Docker Permission Denied**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### **Issue 4: Services Not Starting**
```bash
# Check service status
pm2 status
docker ps

# Restart services
pm2 restart jobconnect-ai
cd ~/jobconnect-n8n && docker compose restart
```

## 📈 **Performance Optimization**

### **Oracle Cloud ARM Performance**
- **Node.js Development**: Excellent with 4 ARM cores
- **Ollama 70B Model**: ~15-20 tokens/second
- **Docker Services**: Comfortable with 24GB RAM
- **Concurrent Development**: Support for multiple developers

### **Resource Monitoring**
```bash
# Monitor CPU and memory
htop

# Monitor disk usage
df -h

# Monitor network
iftop
```

## 🎯 **Success Metrics**

### **Expected Performance**
- **Connection Speed**: < 2 seconds SSH
- **File Operations**: < 1 second saves
- **Build Time**: Comparable to local
- **Memory Usage**: < 80% of 24GB
- **Cost**: $0/month (Always Free tier)

### **Development Experience**
- **24/7 Access**: Available from anywhere
- **Full IDE Features**: Cursor with all extensions
- **Resource Utilization**: Full Oracle Cloud resources
- **Collaboration**: Multiple developers can connect

## 🚀 **Next Steps**

1. **Configure Domain** (Optional)
   - Set up custom domain
   - Configure SSL certificates

2. **Set Up CI/CD**
   - Configure GitHub Actions
   - Automated deployment

3. **Scale Services**
   - Add more instances
   - Load balancing

4. **Production Deployment**
   - Configure production environment
   - Set up monitoring and alerting

---

**🎉 Congratulations! Your JobConnect AI development environment is now running on Oracle Cloud!**

**Quick Reference:**
- **Instance IP**: `YOUR_INSTANCE_IP`
- **SSH Command**: `ssh jobconnect-oracle`
- **Cursor Command**: `cursor --remote ssh-remote+jobconnect-oracle /home/ubuntu/jobconnect-ai`
- **App URL**: `http://YOUR_INSTANCE_IP:3000`

Happy coding on Oracle Cloud! 🚀 