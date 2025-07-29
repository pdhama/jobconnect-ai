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

async function fixDatabase() {
  console.log('🔧 Fixing JobConnect AI Database Issues')
  console.log('=======================================\n')

  try {
    // Test 1: Check if profiles table exists
    console.log('1. Checking profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message)
      console.log('⚠️  You need to apply the database schema manually')
      console.log('📋 Go to Supabase Dashboard → SQL Editor')
      console.log('📋 Copy and paste the contents of supabase-schema.sql')
      console.log('📋 Click "Run" to apply the schema')
      return
    }
    console.log('✅ Profiles table exists')

    // Test 2: Check RLS policies
    console.log('\n2. Checking RLS policies...')
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (rlsError && rlsError.message.includes('policy')) {
      console.log('✅ RLS policies are active (expected error for unauthenticated user)')
    } else {
      console.log('⚠️  RLS policies may not be configured correctly')
      console.log('📋 You need to apply the RLS policies manually')
    }

    // Test 3: Check trigger function
    console.log('\n3. Checking trigger function...')
    const { data: triggerTest, error: triggerError } = await supabase
      .rpc('handle_new_user', {})
    
    if (triggerError) {
      console.log('⚠️  Trigger function may not exist or be accessible')
      console.log('📋 You need to apply the trigger function manually')
    } else {
      console.log('✅ Trigger function accessible')
    }

    console.log('\n📋 Manual Steps Required:')
    console.log('1. Go to Supabase Dashboard → SQL Editor')
    console.log('2. Copy the entire contents of supabase-schema.sql')
    console.log('3. Paste it into the SQL Editor')
    console.log('4. Click "Run" to apply the schema')
    console.log('5. Run: npm run test:db')
    console.log('6. Test authentication: http://localhost:3000/test-simple')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

fixDatabase() 