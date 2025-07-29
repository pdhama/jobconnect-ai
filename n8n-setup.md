# n8n Local Setup Guide for JobConnect AI

## 🚀 Quick Start

### 1. Install n8n Locally

```bash
# Install n8n globally
npm install -g n8n

# Or use Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. Start n8n

```bash
# Start n8n
n8n

# Access at: http://localhost:5678
```

## 📋 JobConnect AI Workflows to Build

### **1. Job Scraping Workflow**
**Purpose**: Automatically scrape job postings from multiple sources

**Triggers**:
- Schedule (every 6 hours)
- Manual trigger

**Steps**:
1. **HTTP Request** - Fetch job listings from APIs
2. **Code Node** - Parse and filter jobs
3. **Supabase** - Store jobs in database
4. **Notification** - Send alerts for new jobs

**Sources to Scrape**:
- LinkedIn Jobs API
- Indeed API
- Naukri.com
- Glassdoor
- Company career pages

### **2. Resume Optimization Workflow**
**Purpose**: AI-powered resume analysis and suggestions

**Triggers**:
- Webhook from frontend
- Manual trigger

**Steps**:
1. **Webhook** - Receive resume data
2. **AI Service** - Analyze resume (when AI is ready)
3. **Code Node** - Generate suggestions
4. **Supabase** - Store optimized resume
5. **Email** - Send results to user

### **3. Cover Letter Generator Workflow**
**Purpose**: Generate personalized cover letters

**Triggers**:
- Webhook from frontend
- Manual trigger

**Steps**:
1. **Webhook** - Receive job and user data
2. **Code Node** - Generate cover letter content
3. **Supabase** - Store cover letter
4. **Email** - Send to user

### **4. Networking Assistant Workflow**
**Purpose**: Find and connect with professionals

**Triggers**:
- Schedule (daily)
- Manual trigger

**Steps**:
1. **LinkedIn API** - Find relevant professionals
2. **Code Node** - Filter and rank contacts
3. **Supabase** - Store contacts
4. **Email** - Send connection requests

### **5. Application Tracking Workflow**
**Purpose**: Track job applications and send reminders

**Triggers**:
- Schedule (daily)
- Webhook from frontend

**Steps**:
1. **Supabase** - Get pending applications
2. **Code Node** - Check application status
3. **Email** - Send follow-up reminders
4. **Supabase** - Update application status

## 🔧 Local Development Setup

### **1. Environment Variables**

Create `.env.n8n`:
```bash
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password

# Database (SQLite for local)
N8N_DATABASE_TYPE=sqlite
N8N_DATABASE_SQLITE_DATABASE=./n8n.db

# Webhook URL (for local testing)
N8N_WEBHOOK_URL=http://localhost:5678/

# Supabase Integration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **2. API Keys Setup**

You'll need these API keys for the workflows:

```bash
# LinkedIn API
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Indeed API
INDEED_PUBLISHER_ID=your_indeed_publisher_id

# Email Service (SendGrid, Mailgun, etc.)
SENDGRID_API_KEY=your_sendgrid_key

# AI Services (when ready)
OPENAI_API_KEY=your_openai_key
```

### **3. Database Integration**

Create `n8n-supabase-integration.js`:
```javascript
// n8n Supabase integration helper
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {
  // Job operations
  async insertJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData);
    return { data, error };
  },

  // Application operations
  async getPendingApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'applied');
    return { data, error };
  },

  // Resume operations
  async updateResume(userId, resumeData) {
    const { data, error } = await supabase
      .from('resumes')
      .upsert({ user_id: userId, ...resumeData });
    return { data, error };
  }
};
```

## 📊 Workflow Templates

### **Job Scraping Template**

```json
{
  "name": "Job Scraping Workflow",
  "nodes": [
    {
      "id": "trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [6, "hours"]
        }
      }
    },
    {
      "id": "linkedin-jobs",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.linkedin.com/v2/jobs",
        "authentication": "oAuth2",
        "options": {
          "headers": {
            "X-Restli-Protocol-Version": "2.0.0"
          }
        }
      }
    },
    {
      "id": "process-jobs",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": `
          // Process and filter jobs
          const jobs = $input.all();
          const filteredJobs = jobs.filter(job => 
            job.location && 
            job.title && 
            !job.title.toLowerCase().includes('senior')
          );
          
          return filteredJobs.map(job => ({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            source_url: job.applicationUrl,
            is_active: true
          }));
        `
      }
    },
    {
      "id": "store-jobs",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{$env.SUPABASE_URL}}/rest/v1/jobs",
        "authentication": "headerAuth",
        "options": {
          "headers": {
            "apikey": "{{$env.SUPABASE_SERVICE_ROLE_KEY}}",
            "Authorization": "Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          }
        }
      }
    }
  ]
}
```

## 🚀 Next Steps

### **Phase 1: Basic Setup (This Week)**
1. ✅ Install n8n locally
2. ✅ Set up environment variables
3. ✅ Create basic job scraping workflow
4. ✅ Test with sample data

### **Phase 2: Integration (Next Week)**
1. 🔄 Connect to Supabase
2. 🔄 Set up webhook endpoints
3. 🔄 Create frontend integration
4. 🔄 Test end-to-end workflows

### **Phase 3: Advanced Features (When AI is Ready)**
1. 🤖 AI-powered resume analysis
2. 🤖 Smart job matching
3. 🤖 Automated networking
4. 🤖 Predictive analytics

## 🛠️ Development Tips

### **1. Local Testing**
```bash
# Start n8n with custom config
n8n start --tunnel

# Test webhooks locally
ngrok http 5678
```

### **2. Workflow Development**
- Start with simple HTTP requests
- Test each node individually
- Use the "Execute Workflow" feature
- Monitor execution logs

### **3. Error Handling**
- Add error handling nodes
- Use try-catch in code nodes
- Set up notifications for failures
- Log errors to Supabase

### **4. Performance Optimization**
- Use batch processing for large datasets
- Implement rate limiting
- Cache frequently accessed data
- Monitor execution times

## 📈 Monitoring & Analytics

### **1. Workflow Metrics**
- Execution frequency
- Success/failure rates
- Processing times
- Data volumes

### **2. Business Metrics**
- Jobs scraped per day
- Applications tracked
- User engagement
- Conversion rates

## 🔐 Security Considerations

### **1. API Key Management**
- Use environment variables
- Rotate keys regularly
- Monitor usage
- Set up alerts

### **2. Data Privacy**
- Encrypt sensitive data
- Implement data retention policies
- Follow GDPR guidelines
- Regular security audits

---

**Ready to start building automation!** 🚀 