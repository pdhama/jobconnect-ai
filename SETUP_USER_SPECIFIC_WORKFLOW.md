# 🚀 User-Specific Job Discovery Workflow Setup

This guide will help you set up the user-specific job discovery workflow with your personal preferences and test data.

## 📋 **Step-by-Step Setup**

### **Step 1: Get Your User ID**

1. **Go to Supabase Dashboard**
   - Navigate to your Supabase project
   - Go to **Authentication > Users**
   - Find your user account
   - Copy your **User ID** (UUID format)

2. **Alternative: Run SQL Query**
   ```sql
   SELECT 
     id as user_id,
     email,
     created_at
   FROM auth.users 
   WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
   LIMIT 1;
   ```

### **Step 2: Insert Test Data**

1. **Open Supabase SQL Editor**
2. **Run the setup script** (`scripts/setup-test-data.sql`):
   - Replace `'your-email@example.com'` with your actual email
   - Replace `'USER_ID_HERE'` with your actual user ID
   - Execute the script

3. **Verify the data was inserted:**
   ```sql
   -- Check profiles
   SELECT COUNT(*) FROM profiles WHERE id = 'YOUR_USER_ID';
   
   -- Check job preferences
   SELECT COUNT(*) FROM user_job_preferences 
   WHERE user_id = 'YOUR_USER_ID' AND is_active = true;
   
   -- View your preferences
   SELECT * FROM user_job_preferences 
   WHERE user_id = 'YOUR_USER_ID' AND is_active = true;
   ```

### **Step 3: Update n8n Workflow**

1. **Import the user-specific workflow:**
   - Use `n8n-workflows/job-discovery-workflow-user-specific.json`

2. **Update the User ID:**
   - Open the **"Get User ID"** node
   - Replace `'YOUR_USER_ID_HERE'` with your actual user ID
   - Save the workflow

3. **Configure Credentials:**
   - Set up **Supabase credentials** in the Supabase nodes
   - Set up **SERP API credentials** in the HTTP Request nodes

### **Step 4: Test the Workflow**

1. **Test Individual Nodes:**
   - Execute **"Get User ID"** node
   - Execute **"Fetch User Job Preferences"** node
   - Verify data is being fetched correctly

2. **Test Full Workflow:**
   - Execute the entire workflow
   - Check each node for successful execution
   - Verify jobs are being stored in the database

## 🔧 **Workflow Configuration**

### **Node Configuration Details:**

#### **1. Get User ID Node**
```javascript
// Replace with your actual user ID
const userId = 'your-actual-user-id-here';
return [{ json: { user_id: userId } }];
```

#### **2. Fetch User Job Preferences Node**
```json
{
  "operation": "select",
  "table": "user_job_preferences",
  "additionalFields": {
    "selectConditions": {
      "conditions": [
        {
          "name": "user_id",
          "value": "={{ $json.user_id }}"
        },
        {
          "name": "is_active",
          "value": "true"
        }
      ]
    }
  }
}
```

#### **3. Generate Search URLs Node**
- Processes your preferences
- Creates search queries for LinkedIn and Naukri
- Passes user context to subsequent nodes

## 📊 **Test Data Structure**

### **Sample User Preferences:**
```json
{
  "id": "pref-uuid-1",
  "user_id": "your-user-id",
  "keywords": ["React", "JavaScript", "TypeScript", "Frontend"],
  "location": "Bangalore, India",
  "experience_level": "mid",
  "job_type": ["full-time"],
  "remote_preference": "hybrid",
  "salary_min": 600000,
  "salary_max": 1200000,
  "industries": ["Technology", "Software Development"],
  "skills": ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
  "is_active": true
}
```

### **Sample Job Results:**
```json
{
  "title": "Senior React Developer",
  "company": "TechCorp India",
  "location": "Bangalore, India",
  "job_url": "https://linkedin.com/jobs/...",
  "description": "We are looking for a React developer...",
  "platform": "linkedin",
  "keywords_matched": ["React", "JavaScript"],
  "relevance_score": 85,
  "freshness_score": 90,
  "user_id": "your-user-id"
}
```

## 🧪 **Testing Commands**

### **1. Test Database Connection:**
```sql
-- Check if your user exists
SELECT * FROM auth.users WHERE email = 'your-email@example.com';

-- Check if preferences exist
SELECT * FROM user_job_preferences 
WHERE user_id = 'your-user-id' AND is_active = true;
```

### **2. Test n8n Node Execution:**
1. **Execute "Get User ID"** - Should return your user ID
2. **Execute "Fetch User Job Preferences"** - Should return your preferences
3. **Execute "Generate Search URLs"** - Should create search queries

### **3. Test Full Workflow:**
1. **Execute entire workflow**
2. **Check jobs table** for new entries
3. **Verify job data** matches your preferences

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. "No preferences found"**
- **Solution:** Check if your user ID is correct
- **Solution:** Verify preferences are marked as `is_active = true`

#### **2. "Invalid UUID format"**
- **Solution:** Ensure user ID is a valid UUID
- **Solution:** Check for extra spaces or characters

#### **3. "No jobs found"**
- **Solution:** Check SERP API credentials
- **Solution:** Verify search queries are being generated correctly

#### **4. "Database connection error"**
- **Solution:** Verify Supabase credentials
- **Solution:** Check RLS policies allow access

### **Debug Steps:**

1. **Check User ID:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

2. **Check Preferences:**
   ```sql
   SELECT * FROM user_job_preferences 
   WHERE user_id = 'your-user-id';
   ```

3. **Check Jobs:**
   ```sql
   SELECT COUNT(*) FROM jobs WHERE user_id = 'your-user-id';
   ```

## 🎯 **Expected Results**

### **After Successful Setup:**

1. ✅ **User ID correctly identified**
2. ✅ **Preferences fetched from database**
3. ✅ **Search queries generated**
4. ✅ **Jobs discovered and stored**
5. ✅ **Workflow completes without errors**

### **Sample Output:**
```
🔍 Starting job discovery for user: your-user-id
✅ Found 3 active preferences
🔍 Generated 6 search URLs from 3 preferences
💼 Extracted 15 jobs from SERP results
🎉 Job discovery completed successfully!
📊 Total jobs found: 15
```

## 🚀 **Next Steps**

### **1. UI Integration**
- Create preference management interface
- Allow users to add/edit preferences
- Connect to workflow automatically

### **2. Automation**
- Set up scheduled execution
- Add email notifications
- Implement job recommendations

### **3. Scaling**
- Support multiple users
- Add more job platforms
- Implement advanced filtering

---

**✅ Status: READY FOR TESTING**  
**✅ Workflow: USER-SPECIFIC**  
**✅ Data: CONFIGURED** 