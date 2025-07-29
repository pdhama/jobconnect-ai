# 🔐 Authentication Troubleshooting Guide

## 🚨 **Common Issues & Solutions**

### **1. "Database error saving new user"**

**Cause:** Conflict between automatic profile creation trigger and manual profile creation.

**Solution:**
1. ✅ **Fixed in code** - Updated `signUp` function to work with database trigger
2. ✅ **Updated trigger** - Enhanced `handle_new_user()` function to handle all profile data
3. ✅ **Added error handling** - Better error logging and conflict resolution

**Test the fix:**
```bash
npm run test:auth
```

### **2. CSS Import Error**

**Error:** `@import rules must precede all rules aside from @charset and @layer statements`

**Solution:**
1. ✅ **Fixed** - Removed problematic `@import` line
2. ✅ **Cleared cache** - Run `rm -rf .next && npm run dev`

### **3. Google OAuth Configuration Error**

**Error:** "Invalid Origin: URIs must not contain a path or end with '/'"

**Solution:**
- **Authorized JavaScript origins** (no paths):
  ```
  https://xciulxfgcvjckhgvdzss.supabase.co
  http://localhost:3000
  ```
- **Authorized redirect URIs** (with paths):
  ```
  https://xciulxfgcvjckhgvdzss.supabase.co/auth/v1/callback
  http://localhost:3000/auth/callback
  ```

### **4. Supabase Schema Issues**

**If you get database errors:**

1. **Apply the updated schema:**
   ```sql
   -- Run this in Supabase SQL Editor
   -- Copy contents of supabase-schema.sql
   ```

2. **Check if tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **Verify triggers:**
   ```sql
   SELECT trigger_name FROM information_schema.triggers;
   ```

### **5. Environment Variables**

**Check your `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Test environment:**
```bash
npm run test:auth
```

## 🧪 **Testing Authentication**

### **Step 1: Run Diagnostic Test**
```bash
npm run test:auth
```

### **Step 2: Test in Browser**
1. Visit: `http://localhost:3000/test-auth`
2. Check authentication status
3. Try sign-in/sign-up

### **Step 3: Test User Registration**
1. Visit: `http://localhost:3000/auth/signin`
2. Click "Create Account"
3. Fill in details and submit
4. Check browser console for errors

## 🔧 **Debugging Steps**

### **1. Check Browser Console**
- Open Developer Tools (F12)
- Look for JavaScript errors
- Check Network tab for failed requests

### **2. Check Supabase Logs**
- Go to Supabase Dashboard
- Navigate to Logs → Database
- Look for failed queries

### **3. Test Database Connection**
```bash
# Test direct connection
curl "https://your-project-id.supabase.co/rest/v1/profiles?select=count" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"
```

### **4. Verify RLS Policies**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## 🛠️ **Common Fixes**

### **Fix 1: Reset Database Schema**
```sql
-- Drop and recreate tables (WARNING: This will delete data)
DROP TABLE IF EXISTS profiles CASCADE;
-- Then run the full schema from supabase-schema.sql
```

### **Fix 2: Clear Application Cache**
```bash
rm -rf .next
npm run dev
```

### **Fix 3: Reset Authentication State**
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### **Fix 4: Check Supabase Auth Settings**
1. Go to Supabase Dashboard → Authentication → Settings
2. Verify Site URL: `http://localhost:3000`
3. Check Redirect URLs include your domain

## 📊 **Expected Behavior**

### **✅ Successful Registration:**
1. User fills sign-up form
2. Profile created automatically by database trigger
3. User redirected to dashboard
4. No console errors

### **✅ Successful Sign-in:**
1. User enters credentials
2. Session established
3. Profile loaded
4. Redirected to dashboard

### **❌ Common Error Patterns:**
- **"Database error"** → Schema/trigger issue
- **"Invalid credentials"** → User doesn't exist
- **"Network error"** → Environment variables
- **"Policy violation"** → RLS configuration

## 🆘 **Getting Help**

### **1. Check Logs**
- Browser console errors
- Supabase database logs
- Application logs

### **2. Verify Setup**
```bash
npm run test:auth
```

### **3. Test Components**
- Visit `/test-auth` page
- Check authentication status
- Try sign-in/sign-up flow

### **4. Common Issues Checklist**
- [ ] Environment variables set correctly
- [ ] Supabase schema applied
- [ ] Google OAuth configured properly
- [ ] RLS policies active
- [ ] Database triggers working
- [ ] No CSS import errors
- [ ] Application cache cleared

## 🎯 **Quick Fix Commands**

```bash
# Clear cache and restart
rm -rf .next && npm run dev

# Test authentication
npm run test:auth

# Check environment
cat .env.local

# Test Supabase connection
curl "https://your-project-id.supabase.co/rest/v1/profiles?select=count" \
  -H "apikey: your_anon_key"
```

## 📞 **Support**

If you're still having issues:

1. **Run diagnostic test:** `npm run test:auth`
2. **Check browser console** for specific errors
3. **Verify Supabase setup** in dashboard
4. **Test with minimal data** to isolate issues

The authentication system should now work properly with the fixes applied! 🚀 