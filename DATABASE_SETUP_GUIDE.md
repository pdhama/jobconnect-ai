# 🗄️ Database Setup Guide

## 🚨 **Critical: Apply Database Schema**

The "Database error saving new user" error occurs because the database schema hasn't been properly applied. Follow these steps:

### **Step 1: Access Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar

### **Step 2: Apply the Schema**

1. **Copy the entire contents** of `supabase-schema.sql`
2. **Paste it** into the SQL Editor in Supabase
3. **Click "Run"** to execute the schema

### **Step 3: Verify the Schema**

Run this query in the SQL Editor to check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'jobs', 'applications', 'resumes', 'cover_letters', 'networking_contacts');
```

### **Step 4: Check Triggers**

Run this query to verify triggers exist:

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

You should see:
- `on_auth_user_created` trigger on `auth.users`

### **Step 5: Test the Setup**

```bash
# Test database connection
npm run test:db

# Test authentication
npm run test:auth
```

## 🔧 **Manual Schema Application**

If the automatic script doesn't work, manually apply these key parts:

### **1. Create Profiles Table**

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  preferred_industries TEXT[],
  salary_expectation INTEGER,
  job_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. Enable RLS**

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### **3. Create RLS Policies**

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### **4. Create Trigger Function**

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id, 
    email, 
    full_name,
    phone,
    location,
    experience_level,
    preferred_industries,
    salary_expectation,
    job_preferences
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'location',
    (NEW.raw_user_meta_data->>'experience_level')::TEXT,
    CASE 
      WHEN NEW.raw_user_meta_data->>'preferred_industries' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data->>'preferred_industries', ',')
      ELSE NULL
    END,
    (NEW.raw_user_meta_data->>'salary_expectation')::INTEGER,
    NEW.raw_user_meta_data->>'job_preferences'::JSONB
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **5. Create Trigger**

```sql
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 🧪 **Testing After Schema Application**

### **1. Test Database Connection**

```bash
npm run test:db
```

Expected output:
```
✅ Supabase connection successful
✅ Profiles table accessible
✅ RLS policies are active
✅ Auth functions working
✅ Trigger function accessible
```

### **2. Test Authentication**

```bash
npm run test:auth
```

### **3. Test User Registration**

1. Visit: `http://localhost:3000/test-simple`
2. Try creating an account
3. Check browser console for errors

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Trigger function may not exist"**

**Solution:**
- Apply the trigger function manually in SQL Editor
- Make sure the function has `SECURITY DEFINER`

### **Issue 2: "RLS policies may not be configured correctly"**

**Solution:**
- Apply the RLS policies manually
- Check that policies are enabled for the profiles table

### **Issue 3: "Database error saving new user"**

**Solution:**
- Ensure the trigger function exists and works
- Check that the profiles table has the correct structure
- Verify RLS policies allow user insertion

### **Issue 4: "Permission denied"**

**Solution:**
- Use the service role key for schema application
- Check that your Supabase project has the correct permissions

## 📋 **Complete Setup Checklist**

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] RLS policies created
- [ ] Trigger function created
- [ ] Database tests pass
- [ ] Authentication tests pass
- [ ] User registration works

## 🆘 **Getting Help**

If you're still having issues:

1. **Check Supabase logs** in the dashboard
2. **Run diagnostic tests**: `npm run test:db && npm run test:auth`
3. **Verify schema application** in SQL Editor
4. **Check browser console** for specific errors

The database setup is critical for authentication to work properly! 🚀 