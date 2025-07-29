# 🚀 Getting Started with JobConnect AI Job Search Automation

## 🎯 **What We've Built**

You now have a complete **job search automation system** with:

- ✅ **n8n Workflows** - Automated job scraping from LinkedIn & Naukri
- ✅ **Supabase Database** - Enhanced schema with relevancy scoring
- ✅ **Next.js APIs** - Job search and recommendations endpoints
- ✅ **Local Development** - Everything works locally until Oracle Cloud is ready

## 📋 **Quick Start Guide**

### **Step 1: Set Up Supabase (5 minutes)**

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and keys

2. **Run Database Schema:**
   ```bash
   # Copy your Supabase URL and keys to .env.local
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   
   # Run the enhanced schema in Supabase SQL Editor
   # Copy contents of supabase-schema-enhanced.sql
   ```

3. **Test Authentication:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/test-auth
   ```

### **Step 2: Configure n8n (10 minutes)**

1. **Update Environment Variables:**
   ```bash
   # Edit .env.n8n with your API keys
   nano .env.n8n
   ```

   **Required Keys:**
   ```bash
   # Get from https://serpapi.com (free tier: 100 calls/day)
   SERP_API_KEY=your_serp_api_key_here
   
   # Your Supabase credentials
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Import Workflows:**
   ```bash
   npm run n8n:import
   ```

3. **Start n8n:**
   ```bash
   npm run n8n:start
   # Access at http://localhost:5678
   # Login: admin / jobconnect2025
   ```

### **Step 3: Test the System (5 minutes)**

1. **Add Sample User Preferences:**
   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO user_job_preferences (user_id, keywords, location, experience_level, job_type, remote_preference) VALUES
   ('00000000-0000-0000-0000-000000000001', ARRAY['react', 'node.js'], 'Bangalore', 'mid', ARRAY['full-time'], 'hybrid');
   ```

2. **Test Job Search API:**
   ```bash
   # Test job search
   curl "http://localhost:3000/api/jobs?keywords=react&location=bangalore"
   
   # Test recommendations
   curl "http://localhost:3000/api/jobs/recommendations?userId=00000000-0000-0000-0000-000000000001"
   ```

## 🔧 **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │      n8n       │    │    Supabase     │
│   (Frontend)    │◄──►│  (Automation)   │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Job Search    │    │  Job Scraping   │    │  User Prefs     │
│   API Endpoints │    │   Workflows     │    │  & Job Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 **What Each Component Does**

### **1. n8n Workflows**
- **Job Discovery Workflow**: Runs 3x daily (6am, 12pm, 6pm IST)
- **SERP API Integration**: Scrapes LinkedIn & Naukri job listings
- **Relevancy Scoring**: Calculates job match scores (0-100)
- **Data Storage**: Saves jobs to Supabase with metadata

### **2. Supabase Database**
- **Enhanced Schema**: Jobs, user preferences, applications, etc.
- **Relevancy Functions**: SQL functions for scoring algorithms
- **Row Level Security**: Secure data access
- **Vector Search**: Future-ready for AI embeddings

### **3. Next.js APIs**
- **Job Search**: `/api/jobs` - Filter and search jobs
- **Recommendations**: `/api/jobs/recommendations` - Personalized suggestions
- **User Preferences**: Save and manage job search criteria

## 🎯 **Success Metrics (From PRD)**

| Goal | KPI | Target | Status |
|------|-----|--------|--------|
| Freshness | % of jobs ≤ 24h old | ≥ 90% | 🟡 Testing |
| Relevance | Avg. relevancy score | ≥ 70 | 🟡 Testing |
| Cost | Monthly bill | ₹ 0 | ✅ Free tiers |
| Compliance | Rate-limit violations | 0 | ✅ SERP API |
| Reliability | Workflow success rate | ≥ 99% | 🟡 Testing |

## 🚀 **Next Steps**

### **Phase 1: Testing & Validation (This Week)**
- [ ] Test job scraping workflows
- [ ] Validate relevancy scoring
- [ ] Test API endpoints
- [ ] Monitor execution logs

### **Phase 2: Frontend Integration (Next Week)**
- [ ] Connect job search to frontend
- [ ] Add user preference management
- [ ] Implement job recommendations
- [ ] Add application tracking

### **Phase 3: Production Ready (When Oracle Cloud Available)**
- [ ] Deploy to Oracle Cloud
- [ ] Set up monitoring
- [ ] Scale workflows
- [ ] Add AI features

## 🔍 **Testing Your Setup**

### **1. Test n8n Workflow**
```bash
# Start n8n
npm run n8n:start

# In n8n interface:
# 1. Go to Workflows
# 2. Find "JobConnect AI - Job Discovery Workflow"
# 3. Click "Execute Workflow"
# 4. Check execution logs
```

### **2. Test API Endpoints**
```bash
# Test job search
curl "http://localhost:3000/api/jobs?keywords=react&location=bangalore&limit=5"

# Test recommendations
curl "http://localhost:3000/api/jobs/recommendations?userId=00000000-0000-0000-0000-000000000001&limit=5"
```

### **3. Check Database**
```sql
-- In Supabase SQL Editor
SELECT * FROM jobs ORDER BY posted_time DESC LIMIT 10;
SELECT * FROM job_search_logs ORDER BY created_at DESC LIMIT 5;
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **n8n won't start:**
   ```bash
   # Check if n8n is installed
   n8n --version
   
   # Reinstall if needed
   sudo npm uninstall -g n8n
   sudo npm install -g n8n
   ```

2. **SERP API errors:**
   - Check your API key in `.env.n8n`
   - Verify quota at https://serpapi.com
   - Free tier: 100 calls/day

3. **Supabase connection errors:**
   - Verify credentials in `.env.n8n`
   - Check Row Level Security policies
   - Ensure database schema is applied

4. **Workflow import fails:**
   ```bash
   # Manual import
   n8n import:workflow --input=n8n-workflows/job-discovery-workflow.json
   ```

## 📚 **Documentation**

- **n8n Setup**: `n8n-setup.md`
- **Local Development**: `LOCAL_DEVELOPMENT_ROADMAP.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **API Documentation**: Check `src/app/api/` folders

## 🎉 **You're Ready!**

Your job search automation system is now set up and ready for:

1. **Local Development** - Test and iterate
2. **Oracle Cloud Migration** - When ready
3. **Production Deployment** - Scale when needed

**Start with testing the workflows and APIs, then integrate with your frontend!** 🚀

---

**Need help?** Check the troubleshooting section or review the documentation files. 