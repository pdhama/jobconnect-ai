# 🔧 SSH Key Troubleshooting for Oracle Cloud

## 🚨 **Common SSH Key Issues**

### **Issue 1: "Invalid ssh public key type" Error**

This error occurs when Oracle Cloud doesn't recognize the SSH key format. Here are the solutions:

## ✅ **Solution 1: Generate RSA Key (Recommended)**

### **Step 1: Generate New RSA Key**
```bash
# Generate RSA key (Oracle Cloud prefers this format)
ssh-keygen -t rsa -b 2048 -C "your-email@example.com" -f ~/.ssh/oracle-cloud-key

# When prompted:
# - Enter passphrase: (leave empty for easier access)
# - Confirm passphrase: (leave empty)
```

### **Step 2: View the Public Key**
```bash
# Display the public key content
cat ~/.ssh/oracle-cloud-key.pub

# The output should look like:
# ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC+... your-email@example.com
```

### **Step 3: Copy the Entire Public Key**
```bash
# Copy the entire public key (including ssh-rsa and email)
cat ~/.ssh/oracle-cloud-key.pub | pbcopy
```

### **Step 4: Add to Oracle Cloud**
1. Go to Oracle Cloud Console
2. Navigate to **Compute > Instances > Create Instance**
3. In the "Add SSH Keys" section, paste the entire public key
4. Make sure to include the `ssh-rsa` prefix and your email

## ✅ **Solution 2: Convert Existing Key**

If you already have an SSH key, convert it to the correct format:

### **Step 1: Check Your Existing Key**
```bash
# Check if you have existing keys
ls -la ~/.ssh/

# View existing public key
cat ~/.ssh/id_rsa.pub
```

### **Step 2: Generate New Key if Needed**
```bash
# If your existing key doesn't work, generate a new one
ssh-keygen -t rsa -b 2048 -f ~/.ssh/oracle-cloud-key -N ""
```

## ✅ **Solution 3: Use OpenSSH Format**

### **Step 1: Ensure OpenSSH Format**
```bash
# Generate key in OpenSSH format
ssh-keygen -t rsa -b 2048 -m PEM -f ~/.ssh/oracle-cloud-key

# Convert existing key to PEM format (if needed)
ssh-keygen -p -f ~/.ssh/id_rsa -m PEM
```

### **Step 2: Verify Key Format**
```bash
# Check the key format
ssh-keygen -l -f ~/.ssh/oracle-cloud-key.pub

# Should show: 2048 SHA256:... your-email@example.com
```

## 🔧 **Alternative Solutions**

### **Solution A: Use Oracle Cloud CLI**
```bash
# Install Oracle Cloud CLI
curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh | bash

# Configure CLI
oci setup config

# Generate SSH key via CLI
oci compute instance launch \
  --availability-domain YOUR_AD \
  --compartment-id YOUR_COMPARTMENT_ID \
  --display-name jobconnect-ai-dev \
  --image-id YOUR_IMAGE_ID \
  --shape VM.Standard.A1.Flex \
  --subnet-id YOUR_SUBNET_ID \
  --ssh-authorized-keys-file ~/.ssh/oracle-cloud-key.pub
```

### **Solution B: Use Oracle Cloud Console Method**

1. **Generate Key in Console:**
   - Go to Oracle Cloud Console
   - Navigate to **Compute > Instances**
   - Click "Create Instance"
   - In SSH Keys section, click "Generate SSH Key Pair"
   - Download the private key

2. **Use Downloaded Key:**
   ```bash
   # Move downloaded key to SSH directory
   mv ~/Downloads/ssh-key-*.pem ~/.ssh/oracle-cloud-key
   chmod 600 ~/.ssh/oracle-cloud-key
   ```

## 🔍 **Troubleshooting Steps**

### **Step 1: Verify Key Format**
```bash
# Check if key is in correct format
ssh-keygen -l -f ~/.ssh/oracle-cloud-key.pub

# Expected output:
# 2048 SHA256:... your-email@example.com
```

### **Step 2: Test Key Locally**
```bash
# Test the key works locally
ssh -i ~/.ssh/oracle-cloud-key -o StrictHostKeyChecking=no ubuntu@localhost
```

### **Step 3: Check Key Permissions**
```bash
# Set correct permissions
chmod 600 ~/.ssh/oracle-cloud-key
chmod 644 ~/.ssh/oracle-cloud-key.pub
```

## 📋 **Complete SSH Setup Guide**

### **Step 1: Generate Proper SSH Key**
```bash
# Generate RSA key for Oracle Cloud
ssh-keygen -t rsa -b 2048 -C "your-email@example.com" -f ~/.ssh/oracle-cloud-key -N ""

# Verify the key
cat ~/.ssh/oracle-cloud-key.pub
```

### **Step 2: Configure SSH Config**
```bash
# Edit SSH config
nano ~/.ssh/config

# Add this configuration:
Host jobconnect-oracle
    HostName YOUR_INSTANCE_IP
    User ubuntu
    IdentityFile ~/.ssh/oracle-cloud-key
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ForwardAgent yes
    Port 22
```

### **Step 3: Test Connection**
```bash
# Test SSH connection
ssh jobconnect-oracle

# If successful, you'll see Ubuntu welcome message
```

## 🚨 **Common Error Messages and Solutions**

### **Error: "Invalid ssh public key type"**
**Solution:** Use RSA key format instead of Ed25519
```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/oracle-cloud-key
```

### **Error: "Permission denied (publickey)"**
**Solution:** Check key permissions and format
```bash
chmod 600 ~/.ssh/oracle-cloud-key
chmod 644 ~/.ssh/oracle-cloud-key.pub
```

### **Error: "No supported authentication methods available"**
**Solution:** Ensure key is properly added to Oracle Cloud
1. Copy entire public key (including ssh-rsa prefix)
2. Add to Oracle Cloud instance during creation
3. Wait for instance to fully boot

### **Error: "Connection timed out"**
**Solution:** Check security lists and network
1. Verify security list allows SSH (port 22)
2. Check if instance has public IP
3. Ensure instance is running

## 📊 **Key Format Reference**

### **Correct RSA Format:**
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC+... your-email@example.com
```

### **Correct Ed25519 Format:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... your-email@example.com
```

### **Incorrect Formats to Avoid:**
- Keys without email comment
- Keys with wrong algorithm
- Keys with extra spaces or characters

## 🔧 **Quick Fix Commands**

### **Generate New Key (Recommended)**
```bash
# Generate new RSA key
ssh-keygen -t rsa -b 2048 -C "your-email@example.com" -f ~/.ssh/oracle-cloud-key -N ""

# Display public key
cat ~/.ssh/oracle-cloud-key.pub

# Copy to clipboard (macOS)
cat ~/.ssh/oracle-cloud-key.pub | pbcopy

# Copy to clipboard (Linux)
cat ~/.ssh/oracle-cloud-key.pub | xclip -selection clipboard
```

### **Test Connection**
```bash
# Test SSH connection
ssh -i ~/.ssh/oracle-cloud-key ubuntu@YOUR_INSTANCE_IP

# Test with verbose output
ssh -v -i ~/.ssh/oracle-cloud-key ubuntu@YOUR_INSTANCE_IP
```

## 📝 **Next Steps After SSH Setup**

1. **Create Oracle Cloud Instance** with the new SSH key
2. **Test Connection** using the commands above
3. **Run Environment Setup** script
4. **Configure Cursor IDE** for remote development

## 🎯 **Success Indicators**

✅ **SSH Key Works When:**
- Key is in RSA format (ssh-rsa)
- Public key includes email comment
- Key is properly added to Oracle Cloud
- Instance has public IP and SSH port open
- Connection establishes without password prompt

---

**Need Help?** If you're still having issues, try:
1. Generate a completely new RSA key
2. Use Oracle Cloud Console's built-in key generator
3. Check Oracle Cloud documentation for latest requirements
4. Contact Oracle Cloud support if issues persist 