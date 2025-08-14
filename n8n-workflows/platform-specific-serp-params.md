# 🔍 Platform-Specific SERP Search Parameters

## 🚨 **Problem Identified:**
Both LinkedIn and Naukri SERP nodes are returning the same results because they're both searching Google with similar `site:` queries, which doesn't effectively target the specific job platforms.

## 🛠️ **Solution: Platform-Specific Search Strategies**

### **LinkedIn SERP Search Node - Enhanced Parameters**

**URL:** `https://serpapi.com/search.json`

**Parameters:**

| Name | Value | Description |
|------|-------|-------------|
| `engine` | `google` | Search engine |
| `q` | `={{ $json.query }}` | LinkedIn-specific query |
| `api_key` | `={{ $env.SERP_API_KEY }}` | SERP API key |
| `num` | `10` | Results count |
| `gl` | `in` | Country (India) |
| `hl` | `en` | Language |
| `location` | `={{ $json.location }}` | Location |
| `google_domain` | `google.co.in` | Indian Google |
| `tbm` | `nws` | News search (better for job listings) |
| `tbs` | `qdr:m` | Recent results (last month) |

**LinkedIn Query Format:**
```
"React developer jobs LinkedIn Bangalore India"
```

### **Naukri SERP Search Node - Enhanced Parameters**

**URL:** `https://serpapi.com/search.json`

**Parameters:**

| Name | Value | Description |
|------|-------|-------------|
| `engine` | `google` | Search engine |
| `q` | `={{ $json.query }}` | Naukri-specific query |
| `api_key` | `={{ $env.SERP_API_KEY }}` | SERP API key |
| `num` | `10` | Results count |
| `gl` | `in` | Country (India) |
| `hl` | `en` | Language |
| `location` | `={{ $json.location }}` | Location |
| `google_domain` | `google.co.in` | Indian Google |
| `tbm` | `nws` | News search |
| `tbs` | `qdr:m` | Recent results |

**Naukri Query Format:**
```
"Naukri.com React developer jobs Bangalore"
```

---

## 🔧 **Updated Query Generation Logic**

### **LinkedIn Query Generation:**
```javascript
// In your "Generate Search URLs" node
const linkedinQuery = `${keywords} developer jobs LinkedIn ${location} India`;
```

### **Naukri Query Generation:**
```javascript
// In your "Generate Search URLs" node  
const naukriQuery = `Naukri.com ${keywords} developer jobs ${location}`;
```

---

## 🎯 **Alternative: Direct API Approach**

### **Option 1: LinkedIn Jobs API (Recommended)**
```javascript
// LinkedIn Jobs API endpoint
const linkedinUrl = "https://api.linkedin.com/v2/jobs";
const linkedinParams = {
  keywords: keywords,
  location: location,
  limit: 10
};
```

### **Option 2: Naukri API (If Available)**
```javascript
// Naukri API endpoint (if they have one)
const naukriUrl = "https://api.naukri.com/v1/jobs";
const naukriParams = {
  keyword: keywords,
  location: location,
  limit: 10
};
```

---

## 🔍 **Enhanced Search Strategies**

### **Strategy 1: Multiple Search Queries per Platform**

**LinkedIn Searches:**
1. `"React developer jobs LinkedIn"`
2. `"React jobs site:linkedin.com"`
3. `"React developer Bangalore LinkedIn careers"`

**Naukri Searches:**
1. `"Naukri.com React developer jobs"`
2. `"React jobs site:naukri.com"`
3. `"React developer Bangalore Naukri"`

### **Strategy 2: Time-Based Filtering**

**Add these parameters:**
```
tbs: qdr:d (today)
tbs: qdr:w (this week)  
tbs: qdr:m (this month)
```

### **Strategy 3: Location-Specific Searches**

**LinkedIn:**
```
"React developer jobs LinkedIn Bangalore Karnataka India"
```

**Naukri:**
```
"Naukri.com React developer jobs Bangalore Karnataka"
```

---

## 🧪 **Testing Different Approaches**

### **Test 1: Basic Site Search**
```
LinkedIn: "site:linkedin.com/jobs React developer Bangalore"
Naukri: "site:naukri.com React developer Bangalore"
```

### **Test 2: Platform-Specific Keywords**
```
LinkedIn: "React developer jobs LinkedIn careers Bangalore"
Naukri: "Naukri.com React developer jobs Bangalore"
```

### **Test 3: Recent Job Listings**
```
LinkedIn: "React developer jobs LinkedIn Bangalore 2025"
Naukri: "Naukri.com React developer jobs Bangalore 2025"
```

---

## 📊 **Expected Results Comparison**

### **LinkedIn Results Should Include:**
- LinkedIn job posting URLs
- Company names from LinkedIn
- Job titles with "LinkedIn" context
- Recent postings (last 30 days)

### **Naukri Results Should Include:**
- Naukri.com job URLs
- Indian company names
- Job titles with "Naukri" context
- Salary information (if available)

---

## 🔧 **Implementation Steps**

### **Step 1: Update Query Generation**
Modify your "Generate Search URLs" node:

```javascript
// LinkedIn query
const linkedinQuery = `${keywords} developer jobs LinkedIn ${location} India`;

// Naukri query  
const naukriQuery = `Naukri.com ${keywords} developer jobs ${location}`;
```

### **Step 2: Add Time Filtering**
Add `tbs: qdr:m` parameter to both nodes for recent results.

### **Step 3: Test Each Platform Separately**
Execute each node individually to verify different results.

---

## ✅ **Verification Checklist**

- [ ] **LinkedIn node** returns LinkedIn-specific job URLs
- [ ] **Naukri node** returns Naukri.com job URLs  
- [ ] **Different job titles** and companies in results
- [ ] **Recent postings** (within last month)
- [ ] **Location-specific** results for Bangalore/Mumbai/Delhi

---

**🎯 Goal: Each platform should return unique, platform-specific job listings!** 