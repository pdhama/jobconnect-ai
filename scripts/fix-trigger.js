#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Trigger Function Fix')
console.log('=======================\n')

console.log('📋 The issue is that the trigger function is missing.')
console.log('The RLS policies are working, but the trigger function was not created.\n')

console.log('🔧 SOLUTION: Apply ONLY the trigger function')
console.log('===========================================\n')

console.log('1. Go to your Supabase Dashboard:')
console.log('   https://supabase.com/dashboard\n')

console.log('2. Select your JobConnect AI project\n')

console.log('3. Navigate to SQL Editor:')
console.log('   - Click "SQL Editor" in the left sidebar')
console.log('   - Click "New query"\n')

console.log('4. Copy and paste ONLY this trigger function code:\n')

console.log('='.repeat(80))
console.log(`-- Create function to handle user creation
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

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();`)
console.log('='.repeat(80))

console.log('\n5. Click the "Run" button (▶️) in the SQL Editor\n')

console.log('6. Wait for execution to complete (5-10 seconds)\n')

console.log('7. Test the fix:')
console.log('   - Run: npm run debug:db')
console.log('   - Visit: http://localhost:3000/test-simple')
console.log('   - Try creating an account\n')

console.log('🎯 Expected Results:')
console.log('   - Trigger function should be accessible')
console.log('   - User accounts can be created successfully')
console.log('   - User profiles are automatically created\n')

console.log('📞 If you still get errors:')
console.log('   - Check the SQL Editor output for error messages')
console.log('   - Run: npm run debug:db to verify the fix')
console.log('   - The trigger function should now exist\n') 