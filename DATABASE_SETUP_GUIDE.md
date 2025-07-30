# Database Setup Guide for JobConnect AI

## 🚀 **Quick Start**

### **1. Supabase Setup**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Navigate to **SQL Editor**
4. Copy and paste the entire `supabase-schema.sql` file
5. Click **Run**

### **2. Environment Variables**
Create `.env.local` file with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SERP API Configuration (for job discovery)
SERP_API_KEY=your_serp_api_key

# n8n Configuration (for automation)
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password
```

## 📋 **Schema Overview**

### **✅ Improved Schema Features:**

#### **1. Proper Foreign Key References**
```sql
-- Correctly references auth.users
user_id uuid not null references auth.users(id) on delete cascade
```

#### **2. Safe Idempotent Operations**
```sql
-- Safe drop/create pattern
drop table if exists profiles cascade;
create table profiles (...);
```

#### **3. Enhanced RLS Policies**
```sql
-- More specific and secure policies
create policy p_profiles_select on profiles
  for select using (auth.uid() = id);
```

#### **4. PostgreSQL Compliant Functions**
```sql
-- Proper variable declarations and syntax
declare
  kw text;
begin
  foreach kw in array user_keywords loop
    -- logic here
  end loop;
end;
```

## 🗄️ **Database Tables**

### **1. Profiles**
- User profile information
- Auto-created when user signs up
- Links to `auth.users` table

### **2. User Job Preferences**
- Job search preferences
- Keywords, location, experience level
- Multiple preferences per user

### **3. Jobs**
- Discovered job listings
- Relevance and freshness scores
- Platform tracking (LinkedIn, Naukri, Indeed)

### **4. Applications**
- Job application tracking
- Status management (applied, interviewing, etc.)
- Cover letters and resume versions

### **5. Resumes**
- User resume management
- Version control
- File storage integration

### **6. Cover Letters**
- Custom cover letter creation
- Company and job-specific letters
- Template management

### **7. Networking Contacts**
- Professional network tracking
- Contact status management
- LinkedIn integration

### **8. Job Search Logs**
- Search activity tracking
- Performance monitoring
- Error logging

## 🔐 **Security Features**

### **Row Level Security (RLS)**
- All tables have RLS enabled
- Users can only access their own data
- Public read access for job listings

### **Policies**
- `p_profiles_select` - Users can view own profile
- `p_prefs_all` - Users can manage own preferences
- `p_jobs_select` - Public read access for jobs
- `p_applications_all` - Users can manage own applications

## ⚡ **Functions & Triggers**

### **1. Auto Profile Creation**
```sql
-- Creates profile when user signs up
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

### **2. Updated Timestamps**
```sql
-- Auto-updates updated_at column
create trigger trg_profiles_upd
before update on profiles
for each row execute function public.update_updated_at_column();
```

### **3. Relevance Scoring**
```sql
-- Calculates job relevance based on user preferences
create function public.calculate_relevance_score(...)
```

### **4. Job Recommendations**
```sql
-- Gets personalized job recommendations
create function public.get_job_recommendations(...)
```

## 📊 **Indexes for Performance**

### **Key Indexes:**
- `idx_profiles_email` - Fast email lookups
- `idx_jobs_relevance` - Relevance score queries
- `idx_jobs_keywords` - GIN index for keyword search
- `idx_apps_user` - User application queries
- `idx_logs_created` - Time-based log queries

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. "column user_id does not exist"**
- ✅ **Fixed in new schema** - Proper foreign key references
- ✅ **Safe drop/create pattern** - No conflicts

#### **2. "function does not exist"**
- ✅ **Fixed in new schema** - Proper function declarations
- ✅ **Cascade drops** - Clean slate approach

#### **3. "policy already exists"**
- ✅ **Fixed in new schema** - Safe policy creation
- ✅ **Idempotent operations** - Can run multiple times

### **Verification Steps:**

1. **Check Tables Exist:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

2. **Check Functions Exist:**
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
```

3. **Check Policies Exist:**
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🚀 **Next Steps**

### **1. Test Authentication**
- Visit `/test-auth` to test Supabase connection
- Try signing up a new user
- Verify profile auto-creation

### **2. Test Database Operations**
- Visit `/test-simple` for basic database tests
- Visit `/test-enhanced` for advanced tests
- Check logs for any errors

### **3. Set Up n8n Automation**
- Follow the `N8N_SETUP_GUIDE.md`
- Import the job discovery workflow
- Configure SERP API integration

### **4. Deploy to Production**
- Follow the deployment guides
- Set up environment variables
- Configure domain and SSL

## 📚 **Additional Resources**

- [AUTHENTICATION_TROUBLESHOOTING.md](./AUTHENTICATION_TROUBLESHOOTING.md)
- [DATABASE_FIX_GUIDE.md](./DATABASE_FIX_GUIDE.md)
- [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md)
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

**✅ Schema Status: WORKING**  
**✅ Authentication: WORKING**  
**✅ RLS Policies: WORKING**  
**✅ Functions: WORKING**  
**✅ Triggers: WORKING** 