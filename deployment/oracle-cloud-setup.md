# JobConnect AI - Oracle Cloud Deployment Guide

## 🎯 **Overview**
This guide will help you deploy JobConnect AI on Oracle Cloud Infrastructure (OCI) for continued development using Cursor.

## 📋 **Prerequisites**
- Oracle Cloud account (already created)
- SSH key pair for secure access
- Basic familiarity with Linux commands

## 🚀 **Step 1: Create OCI Compute Instance**

### **1.1 Access Oracle Cloud Console**
1. Go to [Oracle Cloud Console](https://cloud.oracle.com)
2. Sign in with your Oracle Cloud account
3. Navigate to **Compute** → **Instances**

### **1.2 Create Compute Instance**
```
Instance Details:
- Name: jobconnect-ai-dev
- Compartment: [Your compartment]
- Placement: [Select availability domain]
- Image: Canonical Ubuntu 22.04
- Shape: VM.Standard.A1.Flex (Always Free)
  - OCPU: 1
  - Memory: 6 GB
- Network: Create new VCN or use existing
- Subnet: Public subnet
- Public IP: Yes
```

### **1.3 Configure Security**
```
Security Lists:
- Ingress: SSH (22) from 0.0.0.0/0
- Ingress: HTTP (80) from 0.0.0.0/0
- Ingress: HTTPS (443) from 0.0.0.0/0
- Ingress: Custom TCP (3000) from 0.0.0.0/0 (for Next.js dev)
```

## 🔑 **Step 2: SSH Key Setup**

### **2.1 Generate SSH Key (if needed)**
```bash
# On your local machine
ssh-keygen -t rsa -b 2048 -C "your-email@example.com"
```

### **2.2 Add Public Key to OCI**
1. Copy your public key content
2. In OCI Console: **Compute** → **Instances** → **Create Instance**
3. Paste public key in "SSH public key" field

## 🌐 **Step 3: Connect to Instance**

### **3.1 Get Instance IP**
```bash
# From OCI Console or CLI
oci compute instance list --compartment-id [your-compartment-id]
```

### **3.2 SSH Connection**
```bash
ssh ubuntu@[your-instance-ip]
```

## 🛠️ **Step 4: Environment Setup**

### **4.1 Update System**
```bash
sudo apt update && sudo apt upgrade -y
```

### **4.2 Install Node.js and npm**
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### **4.3 Install Git**
```bash
sudo apt install git -y
git --version
```

### **4.4 Install Development Tools**
```bash
# Install build essentials
sudo apt install build-essential -y

# Install additional dependencies
sudo apt install python3 python3-pip -y
```

## 📦 **Step 5: Deploy JobConnect AI**

### **5.1 Clone Repository**
```bash
# Clone your repository
git clone https://github.com/pdhama/jobconnect-ai.git
cd jobconnect-ai

# Install dependencies
npm install
```

### **5.2 Environment Configuration**
```bash
# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### **5.3 Test Application**
```bash
# Start development server
npm run dev

# The app will be available at:
# http://[your-instance-ip]:3000
```

## 🔧 **Step 6: Cursor Remote Development**

### **6.1 Install Cursor on Local Machine**
1. Download Cursor from [cursor.sh](https://cursor.sh)
2. Install and open Cursor

### **6.2 Connect to Remote Instance**
1. In Cursor: **File** → **Open Folder**
2. Use SSH connection: `ssh://ubuntu@[your-instance-ip]/home/ubuntu/jobconnect-ai`
3. Or use Cursor's remote development feature

### **6.3 Alternative: VS Code Remote**
```bash
# Install VS Code Server on remote instance
curl -fsSL https://code.visualstudio.com/sha/download?build=stable&os=linux-x64-server | tar -xz

# Start VS Code Server
./code-server --bind-addr 0.0.0.0:8080 --auth password
```

## 🔒 **Step 7: Security Configuration**

### **7.1 Firewall Setup**
```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw allow 8080
sudo ufw enable
```

### **7.2 SSL Certificate (Optional)**
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot -y

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com
```

## 📊 **Step 8: Monitoring and Maintenance**

### **8.1 Process Management**
```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start npm --name "jobconnect-ai" -- run dev
pm2 startup
pm2 save
```

### **8.2 Logs and Monitoring**
```bash
# View application logs
pm2 logs jobconnect-ai

# Monitor resources
htop
```

## 🚀 **Step 9: Production Deployment**

### **9.1 Build for Production**
```bash
# Build the application
npm run build

# Start production server
npm start
```

### **9.2 Environment Variables**
```bash
# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=your-supabase-url
export OLLAMA_URL=your-ollama-url
```

## 📝 **Step 10: Development Workflow**

### **10.1 Daily Development**
1. SSH into your instance: `ssh ubuntu@[your-instance-ip]`
2. Navigate to project: `cd jobconnect-ai`
3. Pull latest changes: `git pull origin main`
4. Install new dependencies: `npm install`
5. Start development: `npm run dev`

### **10.2 Code Synchronization**
```bash
# Push changes from local to remote
git add .
git commit -m "Your changes"
git push origin main

# Pull changes on remote instance
git pull origin main
```

## 🔧 **Troubleshooting**

### **Common Issues**
1. **Port 3000 not accessible**: Check security lists and firewall
2. **Node.js version issues**: Use nvm for version management
3. **Memory issues**: Monitor with `htop` and optimize
4. **Git authentication**: Set up SSH keys or use personal access tokens

### **Useful Commands**
```bash
# Check system resources
free -h
df -h
htop

# Check application status
pm2 status
pm2 logs

# Restart application
pm2 restart jobconnect-ai

# Update system
sudo apt update && sudo apt upgrade -y
```

## 📞 **Support**
- Oracle Cloud Documentation: [docs.oracle.com](https://docs.oracle.com)
- Cursor Documentation: [cursor.sh/docs](https://cursor.sh/docs)
- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)

---

**Next Steps:**
1. Create your OCI compute instance
2. Follow the setup steps above
3. Connect Cursor to your remote instance
4. Continue development on Oracle Cloud!

Happy coding! 🚀 