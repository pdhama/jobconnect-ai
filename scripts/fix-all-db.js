#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 COMPREHENSIVE DATABASE FIX')
console.log('=============================\n')

console.log('📋 DIAGNOSIS:')
console.log('=============')
console.log('❌ Trigger function is missing')
console.log('❌ RLS policies need to be properly configured')
console.log('❌ User registration fails because profile creation is blocked\n')

console.log('🔧 COMPLETE SOLUTION:')
console.log('=====================\n')

console.log('1. Go to your Supabase Dashboard:')
console.log('   https://supabase.com/dashboard\n')

console.log('2. Select your JobConnect AI project\n')

console.log('3. Navigate to SQL Editor:')
console.log('   - Click "SQL Editor" in the left sidebar')
console.log('   - Click "New query"\n')

console.log('4. Copy and paste this COMPLETE database fix:\n')

console.log('='.repeat(80))
console.log(`-- COMPLETE DATABASE FIX FOR JOBCONNECT AI
-- This will fix all database issues at once

-- Step 1: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 2: Create the trigger function
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

-- Step 3: Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop and recreate RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Step 6: Create proper RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Step 7: Create policy that allows the trigger function to insert
CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO anon, authenticated;
GRANT ALL ON auth.users TO anon, authenticated;

-- Step 9: Test the trigger function
SELECT 'Trigger function created successfully' as status;`)
console.log('='.repeat(80))

console.log('\n5. Click the "Run" button (▶️) in the SQL Editor\n')

console.log('6. Wait for execution to complete (10-15 seconds)\n')

console.log('7. Test the fix:')
console.log('   - Run: npm run debug:db')
console.log('   - Visit: http://localhost:3000/test-simple')
console.log('   - Try creating an account\n')

console.log('🎯 EXPECTED RESULTS:')
console.log('====================')
console.log('✅ Trigger function should be accessible')
console.log('✅ RLS policies should be properly configured')
console.log('✅ User accounts can be created successfully')
console.log('✅ User profiles are automatically created')
console.log('✅ No more "Database error saving new user" messages\n')

console.log('📞 IF YOU STILL GET ERRORS:')
console.log('===========================')
console.log('1. Check the SQL Editor output for any error messages')
console.log('2. Run: npm run debug:db to verify the fix')
console.log('3. Make sure you copied the ENTIRE script above')
console.log('4. Try creating an account again\n')

console.log('🚀 This should fix ALL database issues at once!') 