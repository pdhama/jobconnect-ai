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

async function testDatabase() {
  console.log('🔍 Testing JobConnect AI Database Setup')
  console.log('=======================================\n')

  try {
    // Test 1: Check Supabase connection
    console.log('1. Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message)
      return
    }
    console.log('✅ Supabase connection successful')

    // Test 2: Check if profiles table exists and has correct structure
    console.log('\n2. Testing profiles table structure...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message)
      return
    }
    console.log('✅ Profiles table accessible')

    // Test 3: Check RLS policies
    console.log('\n3. Testing Row Level Security...')
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (rlsError && rlsError.message.includes('policy')) {
      console.log('✅ RLS policies are active (expected error for unauthenticated user)')
    } else {
      console.log('⚠️  RLS policies may not be configured correctly')
    }

    // Test 4: Check auth functions
    console.log('\n4. Testing auth functions...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth functions error:', authError.message)
    } else {
      console.log('✅ Auth functions working')
    }

    // Test 5: Check if trigger exists
    console.log('\n5. Testing database triggers...')
    const { data: triggerTest, error: triggerError } = await supabase
      .rpc('handle_new_user', {})
    
    if (triggerError) {
      console.log('⚠️  Trigger function may not exist or be accessible')
    } else {
      console.log('✅ Trigger function accessible')
    }

    console.log('\n🎉 Database setup appears to be working!')
    console.log('\n📋 Next steps:')
    console.log('1. Visit http://localhost:3000/test-simple')
    console.log('2. Try creating an account')
    console.log('3. Check the browser console for any errors')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testDatabase() 