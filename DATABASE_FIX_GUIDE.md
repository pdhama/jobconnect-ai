# 🔧 Database Error Fix Guide

## 🚨 **CRITICAL: "Database error saving new user"**

This error occurs because the database schema (RLS policies and trigger functions) has not been applied to your Supabase project.

## 📋 **Step-by-Step Fix**

### **Step 1: Apply Database Schema**

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your JobConnect AI project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy the Schema**
   - Open the file `supabase-schema.sql` in your project
   - Select ALL content (Ctrl+A / Cmd+A)
   - Copy it (Ctrl+C / Cmd+C)

4. **Paste and Run**
   - Paste the schema into the SQL Editor
   - Click the "Run" button (▶️)
   - Wait for it to complete (should take 10-30 seconds)

### **Step 2: Verify Schema Application**

Run this command to test if the schema was applied correctly:

```bash
npm run test:db
```

**Expected Output:**
```
✅ Supabase connection successful
✅ Profiles table accessible
✅ RLS policies are active
✅ Auth functions working
✅ Trigger function accessible
```

### **Step 3: Test Authentication**

1. **Visit the test page:** http://localhost:3000/test-simple
2. **Try creating an account** with email and password
3. **Check if the error is resolved**

## 🔍 **What the Schema Does**

The `supabase-schema.sql` file creates:

- ✅ **RLS Policies**: Allow users to manage their own profiles
- ✅ **Trigger Function**: Automatically creates profiles when users sign up
- ✅ **Database Tables**: All necessary tables for the application
- ✅ **Indexes**: Performance optimizations
- ✅ **Functions**: Job recommendation and relevance scoring

## 🚨 **If You Still Get Errors**

### **Error 1: "Permission denied"**
- Make sure you're using the correct Supabase project
- Check that your `.env.local` has the correct credentials

### **Error 2: "Function already exists"**
- This is normal, just continue with the execution
- The schema will update existing functions

### **Error 3: "Table already exists"**
- This is normal, just continue with the execution
- The schema will update existing tables

## 📞 **Need Help?**

If you're still getting errors after applying the schema:

1. **Check the SQL Editor output** for any error messages
2. **Run the test command again:** `npm run test:db`
3. **Try creating an account** at http://localhost:3000/test-simple

## 🎯 **Success Indicators**

After applying the schema, you should see:

- ✅ No "Database error saving new user" messages
- ✅ User accounts can be created successfully
- ✅ User profiles are automatically created
- ✅ Authentication works on all pages

---

**Once you've applied the schema, try creating an account again and let me know the result!** 🚀 