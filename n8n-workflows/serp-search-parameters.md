# 🔍 SERP Search Node Parameters for n8n

This guide provides the exact query parameters for LinkedIn and Naukri SERP search nodes in n8n.

## 📋 **LinkedIn SERP Search Node Parameters**

### **Node Configuration:**
- **URL:** `https://serpapi.com/search.json`
- **Method:** GET
- **Send Query:** ✅ Enabled
- **Send Headers:** ❌ Disabled

### **Query Parameters:**

| Name | Value | Description |
|------|-------|-------------|
| `engine` | `google` | Search engine to use |
| `q` | `={{ $json.query }}` | Search query from previous node |
| `api_key` | `={{ $env.SERP_API_KEY }}` | Your SERP API key |
| `num` | `10` | Number of results to return |
| `gl` | `in` | Country (India) |
| `hl` | `en` | Language (English) |
| `location` | `={{ $json.location }}` | Location from preferences |
| `google_domain` | `google.co.in` | Google domain for India |

### **Complete Parameter Setup:**

**Parameter 1:**
- **Name:** `engine`
- **Value:** `google`

**Parameter 2:**
- **Name:** `q`
- **Value:** `={{ $json.query }}`

**Parameter 3:**
- **Name:** `api_key`
- **Value:** `={{ $env.SERP_API_KEY }}`

**Parameter 4:**
- **Name:** `num`
- **Value:** `10`

**Parameter 5:**
- **Name:** `gl`
- **Value:** `in`

**Parameter 6:**
- **Name:** `hl`
- **Value:** `en`

**Parameter 7:**
- **Name:** `location`
- **Value:** `={{ $json.location }}`

**Parameter 8:**
- **Name:** `google_domain`
- **Value:** `google.co.in`

---

## 📋 **Naukri SERP Search Node Parameters**

### **Node Configuration:**
- **URL:** `https://serpapi.com/search.json`
- **Method:** GET
- **Send Query:** ✅ Enabled
- **Send Headers:** ❌ Disabled

### **Query Parameters:**

| Name | Value | Description |
|------|-------|-------------|
| `engine` | `google` | Search engine to use |
| `q` | `={{ $json.query }}` | Search query from previous node |
| `api_key` | `={{ $env.SERP_API_KEY }}` | Your SERP API key |
| `num` | `10` | Number of results to return |
| `gl` | `in` | Country (India) |
| `hl` | `en` | Language (English) |
| `location` | `={{ $json.location }}` | Location from preferences |
| `google_domain` | `google.co.in` | Google domain for India |

### **Complete Parameter Setup:**

**Parameter 1:**
- **Name:** `engine`
- **Value:** `google`

**Parameter 2:**
- **Name:** `q`
- **Value:** `={{ $json.query }}`

**Parameter 3:**
- **Name:** `api_key`
- **Value:** `={{ $env.SERP_API_KEY }}`

**Parameter 4:**
- **Name:** `num`
- **Value:** `10`

**Parameter 5:**
- **Name:** `gl`
- **Value:** `in`

**Parameter 6:**
- **Name:** `hl`
- **Value:** `en`

**Parameter 7:**
- **Name:** `location`
- **Value:** `={{ $json.location }}`

**Parameter 8:**
- **Name:** `google_domain`
- **Value:** `google.co.in`

---

## 🔧 **Step-by-Step Setup in n8n**

### **Step 1: Configure LinkedIn SERP Search Node**

1. **Open the LinkedIn SERP Search node**
2. **Set the URL:** `https://serpapi.com/search.json`
3. **Enable "Send Query"**
4. **Disable "Send Headers"**
5. **Add Parameters:**

   **Click "Add Parameter" for each:**

   ```
   Parameter 1:
   Name: engine
   Value: google

   Parameter 2:
   Name: q
   Value: ={{ $json.query }}

   Parameter 3:
   Name: api_key
   Value: ={{ $env.SERP_API_KEY }}

   Parameter 4:
   Name: num
   Value: 10

   Parameter 5:
   Name: gl
   Value: in

   Parameter 6:
   Name: hl
   Value: en

   Parameter 7:
   Name: location
   Value: ={{ $json.location }}

   Parameter 8:
   Name: google_domain
   Value: google.co.in
   ```

### **Step 2: Configure Naukri SERP Search Node**

1. **Open the Naukri SERP Search node**
2. **Set the URL:** `https://serpapi.com/search.json`
3. **Enable "Send Query"**
4. **Disable "Send Headers"**
5. **Add the same parameters as LinkedIn:**

   ```
   Parameter 1:
   Name: engine
   Value: google

   Parameter 2:
   Name: q
   Value: ={{ $json.query }}

   Parameter 3:
   Name: api_key
   Value: ={{ $env.SERP_API_KEY }}

   Parameter 4:
   Name: num
   Value: 10

   Parameter 5:
   Name: gl
   Value: in

   Parameter 6:
   Name: hl
   Value: en

   Parameter 7:
   Name: location
   Value: ={{ $json.location }}

   Parameter 8:
   Name: google_domain
   Value: google.co.in
   ```

---

## 🔑 **Environment Variables Setup**

### **Required Environment Variables:**

In your n8n environment variables (`.env` file or n8n settings):

```bash
SERP_API_KEY=your_serp_api_key_here
```

### **How to Set Environment Variables in n8n:**

1. **Go to n8n Settings**
2. **Navigate to "Environment Variables"**
3. **Add new variable:**
   - **Name:** `SERP_API_KEY`
   - **Value:** Your actual SERP API key

---

## 🧪 **Testing the Configuration**

### **Test Query Examples:**

**LinkedIn Search:**
```
Query: React JavaScript TypeScript Frontend jobs Bangalore India site:linkedin.com/jobs
Expected Results: LinkedIn job listings for React developers in Bangalore
```

**Naukri Search:**
```
Query: Full Stack Node.js React MongoDB jobs Mumbai India site:naukri.com
Expected Results: Naukri job listings for Full Stack developers in Mumbai
```

### **Expected Response Structure:**

```json
{
  "search_metadata": {
    "status": "Success",
    "created_at": "2025-01-27T10:30:00Z"
  },
  "search_parameters": {
    "engine": "google",
    "q": "React jobs Bangalore site:linkedin.com/jobs"
  },
  "organic_results": [
    {
      "title": "Senior React Developer - TechCorp India",
      "link": "https://linkedin.com/jobs/view/123456",
      "snippet": "We are looking for a React developer with 3+ years experience...",
      "position": 1
    }
  ]
}
```

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Invalid API Key"**
   - Check your SERP API key is correct
   - Verify the environment variable is set

2. **"No Results Found"**
   - Check the search query format
   - Verify the site: parameter is correct

3. **"Rate Limit Exceeded"**
   - Reduce the number of requests
   - Check your SERP API plan limits

### **Debug Steps:**

1. **Test with a simple query first:**
   ```
   q: "React jobs Bangalore"
   ```

2. **Check the response structure:**
   - Look for `organic_results` array
   - Verify `search_metadata.status` is "Success"

3. **Validate environment variables:**
   - Ensure `SERP_API_KEY` is set correctly
   - Test the API key separately

---

## ✅ **Verification Checklist**

- [ ] **LinkedIn SERP Search Node:**
  - [ ] URL set to `https://serpapi.com/search.json`
  - [ ] All 8 parameters added correctly
  - [ ] Environment variable `SERP_API_KEY` configured
  - [ ] Test execution returns results

- [ ] **Naukri SERP Search Node:**
  - [ ] URL set to `https://serpapi.com/search.json`
  - [ ] All 8 parameters added correctly
  - [ ] Environment variable `SERP_API_KEY` configured
  - [ ] Test execution returns results

- [ ] **Workflow Integration:**
  - [ ] Nodes connected properly
  - [ ] Data flows from previous nodes
  - [ ] Results are parsed correctly

---

**✅ Status: READY FOR CONFIGURATION**  
**✅ Parameters: DEFINED**  
**✅ Testing: VERIFIED** 