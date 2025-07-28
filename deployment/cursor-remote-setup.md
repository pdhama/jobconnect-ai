# Cursor IDE Remote Development Setup for Oracle Cloud

## 🎯 **Overview**
This guide will help you connect Cursor IDE to your Oracle Cloud instance for seamless remote development of JobConnect AI.

## 📋 **Prerequisites**
- Oracle Cloud instance created and running
- SSH key pair generated and configured
- Cursor IDE installed on your local machine

## 🔧 **Step 1: SSH Configuration**

### **1.1 Create SSH Config File**
```bash
# On your local machine, create/edit SSH config
nano ~/.ssh/config

# Add this configuration:
Host jobconnect-oracle
    HostName YOUR_INSTANCE_IP
    User ubuntu
    IdentityFile ~/.ssh/your-oracle-key.pem
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ForwardAgent yes
    Port 22
```

### **1.2 Test SSH Connection**
```bash
# Test the connection
ssh jobconnect-oracle

# Should connect without password prompt
# Type 'exit' to return to local machine
```

## 🖥️ **Step 2: Cursor IDE Setup**

### **2.1 Install Remote Development Extension**
1. Open Cursor IDE
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Remote - SSH"
4. Install the extension by Microsoft

### **2.2 Connect to Oracle Cloud Instance**
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Remote-SSH: Connect to Host"
3. Select "jobconnect-oracle"
4. Choose "Linux" as the platform
5. Wait for connection to establish

### **2.3 Open Your Project**
1. Once connected, click "Open Folder"
2. Navigate to `/home/ubuntu/jobconnect-ai`
3. Open the folder
4. Cursor will now work with files on the remote server

## 🔧 **Step 3: Install Essential Extensions**

### **3.1 Required Extensions for JobConnect AI**
Install these extensions on the remote server:

```bash
# Core Development
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- GitLens

# Productivity
- Prettier - Code formatter
- ESLint
- Error Lens
- Bracket Pair Colorizer

# Database & API
- REST Client
- SQLTools
- Supabase

# AI & Development
- GitHub Copilot (if available)
- Tabnine AI
```

### **3.2 Configure Extensions**
```json
// settings.json for remote development
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🚀 **Step 4: Development Workflow**

### **4.1 Daily Development Commands**
```bash
# In Cursor's integrated terminal (Ctrl+`)

# Navigate to project
cd /home/ubuntu/jobconnect-ai

# Start development server
npm run dev

# Install new dependencies
npm install package-name

# Git operations
git add .
git commit -m "Your changes"
git push origin main
```

### **4.2 File Synchronization**
```bash
# From local machine - sync changes
rsync -avz --progress -e "ssh -i ~/.ssh/your-oracle-key.pem" \
  /path/to/your/local/jobconnect-ai/ \
  ubuntu@YOUR_INSTANCE_IP:/home/ubuntu/jobconnect-ai/

# Exclude unnecessary files
rsync -avz --progress --exclude 'node_modules' --exclude '.next' \
  -e "ssh -i ~/.ssh/your-oracle-key.pem" \
  /path/to/your/local/jobconnect-ai/ \
  ubuntu@YOUR_INSTANCE_IP:/home/ubuntu/jobconnect-ai/
```

## 🔧 **Step 5: Advanced Configuration**

### **5.1 Port Forwarding**
```bash
# Forward local ports to remote for development
ssh -L 3000:localhost:3000 jobconnect-oracle  # Next.js dev server
ssh -L 5678:localhost:5678 jobconnect-oracle  # n8n
ssh -L 11434:localhost:11434 jobconnect-oracle  # Ollama
ssh -L 54321:localhost:54321 jobconnect-oracle  # Supabase
```

### **5.2 Multiple SSH Connections**
```bash
# Create additional SSH configs for different purposes
Host jobconnect-oracle-dev
    HostName YOUR_INSTANCE_IP
    User ubuntu
    IdentityFile ~/.ssh/your-oracle-key.pem
    LocalForward 3000 localhost:3000
    LocalForward 5678 localhost:5678

Host jobconnect-oracle-admin
    HostName YOUR_INSTANCE_IP
    User ubuntu
    IdentityFile ~/.ssh/your-oracle-key.pem
    LocalForward 8080 localhost:8080
```

## 📊 **Step 6: Performance Optimization**

### **6.1 Cursor Settings for Remote Development**
```json
{
  "remote.SSH.defaultExtensions": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ],
  "remote.SSH.connectTimeout": 60,
  "remote.SSH.serverInstallPath": "/home/ubuntu/.vscode-server",
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/dist/**": true
  }
}
```

### **6.2 Network Optimization**
```bash
# Optimize SSH connection for better performance
Host jobconnect-oracle
    HostName YOUR_INSTANCE_IP
    User ubuntu
    IdentityFile ~/.ssh/your-oracle-key.pem
    ServerAliveInterval 60
    ServerAliveCountMax 3
    Compression yes
    TCPKeepAlive yes
    ForwardAgent yes
```

## 🔒 **Step 7: Security Best Practices**

### **7.1 SSH Key Management**
```bash
# Generate new SSH key if needed
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to Oracle Cloud instance
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@YOUR_INSTANCE_IP

# Test key-based authentication
ssh ubuntu@YOUR_INSTANCE_IP
```

### **7.2 Firewall Configuration**
```bash
# On Oracle Cloud instance
sudo ufw allow from YOUR_LOCAL_IP to any port 22
sudo ufw allow 3000
sudo ufw allow 5678
sudo ufw allow 11434
sudo ufw allow 54321:54324/tcp
sudo ufw enable
```

## 🚀 **Step 8: Quick Start Commands**

### **8.1 Connect to Development Environment**
```bash
# Quick connection
cursor --remote ssh-remote+jobconnect-oracle /home/ubuntu/jobconnect-ai

# Or use Cursor's GUI:
# 1. File → Open Folder
# 2. Select "Open Folder on Remote..."
# 3. Choose "jobconnect-oracle"
# 4. Navigate to /home/ubuntu/jobconnect-ai
```

### **8.2 Development Commands**
```bash
# Start all services
~/start-jobconnect.sh

# Monitor system
~/monitor-jobconnect.sh

# View logs
pm2 logs jobconnect-ai

# Restart application
pm2 restart jobconnect-ai
```

## 🔧 **Troubleshooting**

### **Common Issues and Solutions**

#### **Issue 1: Connection Timeout**
```bash
# Check network connectivity
ping YOUR_INSTANCE_IP

# Test SSH connection
ssh -v jobconnect-oracle

# Check firewall settings
sudo ufw status
```

#### **Issue 2: Slow Performance**
```bash
# Optimize SSH connection
ssh -o Compression=yes -o TCPKeepAlive=yes jobconnect-oracle

# Check system resources
htop
free -h
df -h
```

#### **Issue 3: Extension Installation Fails**
```bash
# Clear VS Code Server cache
rm -rf ~/.vscode-server

# Reinstall extensions
# Go to Extensions panel and reinstall required extensions
```

#### **Issue 4: File Sync Issues**
```bash
# Check file permissions
ls -la /home/ubuntu/jobconnect-ai

# Fix permissions if needed
sudo chown -R ubuntu:ubuntu /home/ubuntu/jobconnect-ai
chmod -R 755 /home/ubuntu/jobconnect-ai
```

## 📝 **Step 9: Development Workflow Summary**

### **Daily Workflow:**
1. **Connect**: `cursor --remote ssh-remote+jobconnect-oracle /home/ubuntu/jobconnect-ai`
2. **Develop**: Use Cursor's full IDE features on remote files
3. **Test**: Access application at `http://YOUR_INSTANCE_IP:3000`
4. **Deploy**: Use git for version control and deployment
5. **Monitor**: Use PM2 and system monitoring tools

### **File Management:**
- **Local Development**: Use Cursor's remote features
- **Version Control**: Git push/pull from remote
- **Backup**: Regular rsync to local machine
- **Sync**: Automated scripts for file synchronization

## 🎯 **Success Metrics**

### **Performance Indicators:**
- **Connection Speed**: < 2 seconds to establish SSH
- **File Operations**: < 1 second for file saves
- **Extension Loading**: < 5 seconds for all extensions
- **Build Time**: Comparable to local development

### **Productivity Gains:**
- **24/7 Development**: Access from anywhere
- **Resource Utilization**: Full Oracle Cloud resources
- **Collaboration**: Multiple developers can connect
- **Cost Efficiency**: Free tier utilization

---

**Next Steps:**
1. Set up your Oracle Cloud instance
2. Configure SSH keys and connection
3. Connect Cursor IDE to remote instance
4. Start developing JobConnect AI on Oracle Cloud!

Happy remote development! 🚀 