#!/usr/bin/env node

console.log('🔧 SIMPLE DATABASE FIX')
console.log('======================\n')

console.log('📋 The issue is simple:')
console.log('❌ The trigger function is missing')
console.log('❌ This causes "Database error saving new user"\n')

console.log('🔧 MINIMAL SOLUTION:')
console.log('===================\n')

console.log('1. Go to Supabase Dashboard:')
console.log('   https://supabase.com/dashboard\n')

console.log('2. Select your JobConnect AI project\n')

console.log('3. Click "SQL Editor" → "New query"\n')

console.log('4. Copy and paste ONLY this minimal fix:\n')

console.log('='.repeat(80))
console.log(`-- MINIMAL TRIGGER FUNCTION FIX
-- This will fix the "Database error saving new user" issue

-- Create the trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test it
SELECT 'Trigger created successfully' as result;`)
console.log('='.repeat(80))

console.log('\n5. Click "Run" (▶️)\n')

console.log('6. Wait 5 seconds\n')

console.log('7. Test immediately:')
console.log('   - Visit: http://localhost:3000/test-simple')
console.log('   - Try creating an account\n')

console.log('🎯 This minimal fix should work immediately!')
console.log('📞 If it doesn\'t work, run: npm run debug:db') 