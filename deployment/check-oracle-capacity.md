# 🔍 Oracle Cloud Capacity Check Guide

## 🚨 **"Out of Capacity" Error Solutions**

### **Immediate Actions:**

#### **1. Try Different Availability Domain**
```
Current: AD-1 (out of capacity)
Try: AD-2, AD-3, AD-4
```

#### **2. Try Different Regions**
```
Recommended Regions with Better Availability:
- us-ashburn-1 (US East)
- us-phoenix-1 (US West)  
- uk-london-1 (UK South)
- eu-frankfurt-1 (Germany)
- ap-singapore-1 (Singapore)
- ap-tokyo-1 (Japan)
```

#### **3. Alternative Instance Configuration**
```
If VM.Standard.A1.Flex is unavailable:
- Try: VM.Standard.E2.1.Micro (1 OCPU, 1GB RAM)
- Try: VM.Standard.E2.1.Flex (1 OCPU, 6GB RAM)
- Try: VM.Standard.A1.Flex with 2 OCPU instead of 4
```

## 📋 **Step-by-Step Resolution**

### **Step 1: Change Availability Domain**
1. Go to **Create Instance**
2. In **Placement** section:
   - Change from **AD-1** to **AD-2**
   - If AD-2 fails, try **AD-3**
   - Remove **Fault Domain** selection if specified

### **Step 2: Change Region**
1. **Switch Region** in Oracle Cloud Console
2. **Recommended Order**:
   ```
   1. us-ashburn-1 (US East)
   2. us-phoenix-1 (US West)
   3. uk-london-1 (UK South)
   4. eu-frankfurt-1 (Germany)
   5. ap-singapore-1 (Singapore)
   ```

### **Step 3: Modify Instance Configuration**
```
Original Configuration:
- Shape: VM.Standard.A1.Flex
- OCPU: 4
- Memory: 24 GB

Alternative Configurations:
1. VM.Standard.A1.Flex (2 OCPU, 12GB RAM)
2. VM.Standard.E2.1.Flex (1 OCPU, 6GB RAM)
3. VM.Standard.E2.1.Micro (1 OCPU, 1GB RAM)
```

## 🔧 **Manual Region Switching**

### **Method 1: Console Region Switch**
1. **Click Region Selector** (top-right of console)
2. **Choose Different Region**
3. **Navigate to Compute > Instances**
4. **Try creating instance again**

### **Method 2: Direct URL**
```
Replace region in URL:
https://cloud.oracle.com/compute/instances?region=us-ashburn-1
https://cloud.oracle.com/compute/instances?region=us-phoenix-1
https://cloud.oracle.com/compute/instances?region=uk-london-1
```

## 📊 **Capacity Check Strategy**

### **Best Times to Try:**
- **Early Morning** (2 AM - 6 AM local time)
- **Late Night** (10 PM - 2 AM local time)
- **Weekends** (less business traffic)
- **Month End** (some users hit limits)

### **Region Availability Pattern:**
```
High Availability:
- us-ashburn-1 (US East)
- us-phoenix-1 (US West)

Medium Availability:
- uk-london-1 (UK South)
- eu-frankfurt-1 (Germany)

Variable Availability:
- ap-singapore-1 (Singapore)
- ap-tokyo-1 (Japan)
```

## 🚀 **Alternative Solutions**

### **Solution A: Use Different Shape**
```
If A1.Flex unavailable, try:
- VM.Standard.E2.1.Micro (Always Free)
- VM.Standard.E2.1.Flex (Always Free)
- VM.Standard.A1.Flex with 2 OCPU
```

### **Solution B: Wait and Retry**
```
Retry Schedule:
1. Wait 15 minutes, try AD-2
2. Wait 30 minutes, try AD-3
3. Wait 1 hour, try different region
4. Wait 2 hours, try original region
```

### **Solution C: Use CLI to Check Availability**
```bash
# Install Oracle Cloud CLI
curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh | bash

# Configure CLI
oci setup config

# Check available shapes in region
oci compute shape list --compartment-id YOUR_COMPARTMENT_ID --region us-ashburn-1
```

## 📝 **Instance Creation Checklist**

### **Before Creating Instance:**
- [ ] **Check Region** (switch if needed)
- [ ] **Check Availability Domain** (try AD-2, AD-3)
- [ ] **Remove Fault Domain** (if specified)
- [ ] **Use Correct SSH Key** (RSA format)
- [ ] **Verify Shape Availability**

### **Instance Configuration:**
```
Name: jobconnect-ai-dev
Image: Canonical Ubuntu 24.04 LTS
Shape: VM.Standard.A1.Flex (or alternative)
OCPU: 4 (or 2 if 4 unavailable)
Memory: 24 GB (or 12 GB if 24 unavailable)
Boot Volume: 200 GB
Public IP: Yes
SSH Key: Your RSA public key
```

## 🔍 **Troubleshooting Commands**

### **Check Current Region:**
```bash
# In Oracle Cloud Console, check URL
# Should show: cloud.oracle.com/compute/instances?region=REGION_NAME
```

### **Verify Shape Availability:**
```bash
# Use Oracle Cloud CLI
oci compute shape list --compartment-id YOUR_COMPARTMENT_ID
```

### **Check Instance Limits:**
```bash
# Check your account limits
oci limits resource-availability get --service-name compute --limit-name vm-standard-a1-flex-count
```

## 🎯 **Success Indicators**

### **Instance Creation Success:**
- ✅ **No "Out of Capacity" error**
- ✅ **Instance shows "Starting" status**
- ✅ **Public IP assigned**
- ✅ **SSH connection works**

### **If Still Failing:**
1. **Try different region**
2. **Try different availability domain**
3. **Wait 1-2 hours and retry**
4. **Contact Oracle Cloud support**

## 📞 **Support Options**

### **If All Solutions Fail:**
1. **Oracle Cloud Support** (if you have paid account)
2. **Community Forums** (check for similar issues)
3. **Try during off-peak hours**
4. **Consider alternative cloud providers** (temporarily)

---

**Quick Action Plan:**
1. **Switch to AD-2** in current region
2. **If fails, switch to us-ashburn-1 region**
3. **If still fails, try us-phoenix-1 region**
4. **Wait 30 minutes and retry original region**

**Remember:** Oracle Cloud Always Free tier is very popular, so capacity issues are common. Persistence usually pays off! 