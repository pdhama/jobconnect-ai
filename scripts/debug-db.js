#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Simple function to load .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    lines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          process.env[key.trim()] = value
        }
      }
    })
  }
}

// Load environment variables
loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugDatabase() {
  console.log('🔍 Detailed Database Debug')
  console.log('==========================\n')

  try {
    // Test 1: Check if we can access the profiles table
    console.log('1. Testing profiles table access...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message)
      console.log('This suggests RLS is blocking access')
    } else {
      console.log('✅ Can access profiles table (RLS might be disabled)')
    }

    // Test 2: Check if RLS is actually enabled
    console.log('\n2. Testing RLS status...')
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (rlsError) {
      console.log('✅ RLS is active (expected error for unauthenticated user)')
      console.log('Error message:', rlsError.message)
    } else {
      console.log('⚠️  RLS might be disabled - this is a security issue!')
    }

    // Test 3: Check if trigger function exists
    console.log('\n3. Testing trigger function...')
    try {
      const { data: triggerTest, error: triggerError } = await supabase
        .rpc('handle_new_user', {})
      
      if (triggerError) {
        console.log('❌ Trigger function error:', triggerError.message)
        console.log('This means the trigger function is not accessible')
      } else {
        console.log('✅ Trigger function is accessible')
      }
    } catch (err) {
      console.log('❌ Trigger function does not exist or is not accessible')
      console.log('Error:', err.message)
    }

    // Test 4: Check if we can create a test user profile manually
    console.log('\n4. Testing manual profile creation...')
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        full_name: 'Test User'
      })
    
    if (insertError) {
      console.log('❌ Manual profile creation failed:', insertError.message)
      console.log('This confirms RLS is blocking inserts')
    } else {
      console.log('⚠️  Manual profile creation succeeded - RLS might be disabled')
      
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testUserId)
    }

    // Test 5: Check environment variables
    console.log('\n5. Checking environment variables...')
    console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
    
    // Test 6: Check if we're using the right project
    console.log('\n6. Checking project connection...')
    const { data: projectInfo, error: projectError } = await supabase
      .from('profiles')
      .select('count')
      .limit(0)
    
    if (projectError) {
      console.log('❌ Project connection issue:', projectError.message)
    } else {
      console.log('✅ Connected to correct project')
    }

    console.log('\n📋 DIAGNOSIS:')
    console.log('=============')
    
    if (rlsError && rlsError.message.includes('policy')) {
      console.log('✅ RLS is working correctly')
      console.log('❌ But the trigger function is missing')
      console.log('\n🔧 SOLUTION:')
      console.log('1. Go to Supabase Dashboard → SQL Editor')
      console.log('2. Run ONLY the trigger function part:')
      console.log('   CREATE OR REPLACE FUNCTION handle_new_user()...')
      console.log('   CREATE OR REPLACE TRIGGER on_auth_user_created...')
    } else if (!rlsError) {
      console.log('❌ RLS is disabled - this is a security issue')
      console.log('🔧 SOLUTION: Enable RLS on the profiles table')
    } else {
      console.log('❌ Multiple issues detected')
      console.log('🔧 SOLUTION: Apply the complete schema again')
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  }
}

debugDatabase() 