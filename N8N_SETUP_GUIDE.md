# 🚀 **n8n Job Search Automation Setup Guide**

This guide will help you set up the complete n8n workflow automation for JobConnect AI's intelligent job search system.

## 📋 **Prerequisites**

- ✅ Node.js installed
- ✅ n8n installed globally (`npm install -g n8n`)
- ✅ Supabase project configured
- ✅ SERP API key obtained
- ✅ Database schema applied

## 🔧 **Step-by-Step Setup**

### **Step 1: Configure Environment Variables**

1. **Update `n8n-workflows/.env.n8n`:**
   ```bash
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # SERP API Configuration
   SERP_API_KEY=your_serp_api_key
   
   # n8n Configuration
   N8N_PORT=5678
   N8N_HOST=localhost
   ```

2. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and service_role key

3. **Get your SERP API key:**
   - Visit [serpapi.com](https://serpapi.com)
   - Sign up and get your API key
   - The free tier includes 100 searches per month

### **Step 2: Apply Database Schema**

1. **Copy the schema to Supabase:**
   ```bash
   # Copy the content of supabase-schema.sql
   cat supabase-schema.sql
   ```

2. **Apply in Supabase SQL Editor:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Paste the entire schema content
   - Click "Run" to execute

3. **Verify tables created:**
   - Check that all tables exist: `profiles`, `user_job_preferences`, `jobs`, etc.
   - Verify RLS policies are active
   - Confirm triggers are working

### **Step 3: Start n8n**

```bash
# Start n8n with our configuration
npm run n8n:start

# Or manually:
cd n8n-workflows
./start-n8n.sh
```

**Access n8n at:** http://localhost:5678

### **Step 4: Import the Workflow**

1. **Open n8n in your browser**
2. **Import the workflow:**
   - Go to Settings > Import/Export
   - Click "Import from file"
   - Select `n8n-workflows/job-discovery-workflow.json`
   - Click "Import"

3. **Configure credentials:**
   - Set up Supabase credentials
   - Add your SERP API key
   - Test the connections

### **Step 5: Test the Workflow**

1. **Manual execution:**
   - Click on the workflow
   - Click "Execute Workflow"
   - Check the execution logs

2. **Verify data flow:**
   - Check Supabase for new jobs
   - Verify relevance scores are calculated
   - Confirm holiday/weekend logic works

## 🔄 **Workflow Overview**

### **Workflow Components:**

1. **Cron Trigger (Weekdays 9am)**
   - Runs daily at 9:00 AM
   - Only on weekdays (Monday-Friday)

2. **Holiday & Weekend Check**
   - Skips weekends (Saturday/Sunday)
   - Skips Indian and Pakistani holidays
   - Logs skip reasons

3. **Fetch Active User Preferences**
   - Retrieves user job preferences from Supabase
   - Filters for active preferences only

4. **Generate Search URLs**
   - Creates LinkedIn and Naukri search queries
   - Formats for SERP API

5. **LinkedIn SERP Search**
   - Searches LinkedIn jobs via Google SERP
   - Rate limited to 10 requests/minute

6. **Naukri SERP Search**
   - Searches Naukri jobs via Google SERP
   - Rate limited to 15 requests/minute

7. **Parse and Filter Jobs**
   - Extracts job information from SERP results
   - Filters for jobs posted in last 24 hours
   - Calculates freshness scores

8. **Calculate Relevance Scores**
   - Keyword matching (60% of score)
   - Location matching (20% of score)
   - Freshness scoring (20% of score)

9. **Store Jobs in Supabase**
   - Upserts jobs to prevent duplicates
   - Stores relevance and freshness scores

10. **Log Workflow Execution**
    - Records execution summary
    - Tracks performance metrics

## 📊 **API Endpoints**

### **Job Search API:**
```bash
GET /api/jobs?keywords=react,javascript&location=bangalore&page=1&limit=20
```

**Parameters:**
- `keywords`: Comma-separated keywords
- `location`: Job location
- `experience`: Experience level (entry/mid/senior/executive)
- `jobType`: Job type (full-time/part-time/contract)
- `remote`: Remote preference (true/false)
- `platform`: Platform filter (linkedin/naukri)
- `minScore`: Minimum relevance score
- `postedAfter`: Time filter (24h/7d/30d)
- `page`: Page number
- `limit`: Results per page

### **Job Recommendations API:**
```bash
GET /api/jobs/recommendations?userId=user-id&limit=10
```

**Parameters:**
- `userId`: User ID for personalized recommendations
- `limit`: Number of recommendations

## 🎯 **Key Features**

### **Intelligent Scheduling:**
- ✅ Runs only on weekdays (Monday-Friday)
- ✅ Skips weekends automatically
- ✅ Avoids national holidays (India & Pakistan)
- ✅ Configurable timing (currently 9 AM)

### **Smart Job Discovery:**
- ✅ Searches LinkedIn and Naukri simultaneously
- ✅ Uses SERP API for legal compliance
- ✅ Rate limiting to respect APIs
- ✅ Freshness filtering (24-hour jobs only)

### **Relevance Scoring:**
- ✅ Keyword matching (60% weight)
- ✅ Location matching (20% weight)
- ✅ Freshness scoring (20% weight)
- ✅ Scores range from 0-100

### **Data Management:**
- ✅ Automatic deduplication
- ✅ Relevance score calculation
- ✅ Freshness score tracking
- ✅ Comprehensive logging

## 🔍 **Monitoring & Debugging**

### **Check Workflow Status:**
1. **n8n Dashboard:**
   - View execution history
   - Check error logs
   - Monitor performance

2. **Supabase Logs:**
   ```sql
   SELECT * FROM job_search_logs 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

3. **Job Data:**
   ```sql
   SELECT * FROM jobs 
   ORDER BY posted_time DESC 
   LIMIT 20;
   ```

### **Common Issues:**

1. **SERP API Limit Exceeded:**
   - Check API usage in SERP dashboard
   - Consider upgrading plan
   - Reduce search frequency

2. **No Jobs Found:**
   - Verify user preferences exist
   - Check SERP API responses
   - Review parsing logic

3. **Database Errors:**
   - Verify RLS policies
   - Check table permissions
   - Confirm schema is applied

## 🚀 **Production Deployment**

### **Environment Setup:**
```bash
# Production environment variables
N8N_PORT=5678
N8N_HOST=0.0.0.0
N8N_PROTOCOL=https
N8N_USER_MANAGEMENT_DISABLED=false
N8N_BASIC_AUTH_ACTIVE=true
```

### **Security Considerations:**
- ✅ Use HTTPS in production
- ✅ Enable authentication
- ✅ Secure API keys
- ✅ Monitor rate limits
- ✅ Regular backups

### **Scaling:**
- Monitor SERP API usage
- Consider multiple n8n instances
- Implement job queuing
- Add error recovery

## 📈 **Success Metrics**

| Metric | Target | Current |
|--------|--------|---------|
| Freshness | ≥90% jobs ≤24h old | TBD |
| Relevance | ≥70 avg score | TBD |
| Cost | ₹0 (free tiers) | TBD |
| Reliability | ≥99% success rate | TBD |

## 🆘 **Troubleshooting**

### **Workflow Not Running:**
1. Check cron expression: `0 9 * * 1-5`
2. Verify n8n is running
3. Check holiday/weekend logic
4. Review execution logs

### **No Jobs Found:**
1. Verify user preferences exist
2. Check SERP API responses
3. Review parsing logic
4. Test with manual execution

### **Database Errors:**
1. Verify schema is applied
2. Check RLS policies
3. Confirm permissions
4. Review error logs

## 📞 **Support**

For issues or questions:
1. Check n8n execution logs
2. Review Supabase error logs
3. Verify API key validity
4. Test with manual workflow execution

---

**🎉 Congratulations!** Your n8n job search automation is now set up and ready to discover fresh, relevant jobs automatically every weekday at 9 AM. 