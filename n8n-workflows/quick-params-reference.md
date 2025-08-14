# 📋 Quick Reference: SERP Search Parameters

## 🔗 **LinkedIn SERP Search Node**

**URL:** `https://serpapi.com/search.json`

**Parameters (Copy-Paste):**

```
engine: google
q: ={{ $json.query }}
api_key: ={{ $env.SERP_API_KEY }}
num: 10
gl: in
hl: en
location: ={{ $json.location }}
google_domain: google.co.in
```

---

## 🏢 **Naukri SERP Search Node**

**URL:** `https://serpapi.com/search.json`

**Parameters (Copy-Paste):**

```
engine: google
q: ={{ $json.query }}
api_key: ={{ $env.SERP_API_KEY }}
num: 10
gl: in
hl: en
location: ={{ $json.location }}
google_domain: google.co.in
```

---

## ⚙️ **Environment Variable**

**Add to n8n Environment Variables:**

```
SERP_API_KEY=your_actual_serp_api_key_here
```

---

## 🧪 **Test Data**

**Sample Input from Previous Node:**
```json
{
  "query": "React JavaScript TypeScript Frontend jobs Bangalore India site:linkedin.com/jobs",
  "location": "Bangalore, India",
  "platform": "linkedin"
}
```

**Expected Output:**
```json
{
  "search_metadata": {
    "status": "Success"
  },
  "organic_results": [
    {
      "title": "Senior React Developer - TechCorp India",
      "link": "https://linkedin.com/jobs/view/123456",
      "snippet": "We are looking for a React developer..."
    }
  ]
}
```

---

## ✅ **Quick Setup Steps**

1. **Set URL:** `https://serpapi.com/search.json`
2. **Enable:** "Send Query"
3. **Disable:** "Send Headers"
4. **Add Parameters:** Copy-paste from above
5. **Set Environment Variable:** `SERP_API_KEY`
6. **Test:** Execute node to verify

---

**🎯 Ready to configure!** 