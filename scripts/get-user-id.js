// JobConnect AI - Get User ID Script
// This script helps you find your user ID from Supabase

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getUserInfo() {
  try {
    console.log('🔍 Fetching user information from Supabase...\n');

    // Get all users (you'll need to identify yours by email)
    const { data: users, error } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .limit(10);

    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return;
    }

    if (!users || users.length === 0) {
      console.log('⚠️ No users found in the database');
      console.log('Make sure you have signed up and the user exists in auth.users');
      return;
    }

    console.log('📋 Found users:');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });

    console.log('📝 Instructions:');
    console.log('1. Identify your user by email address');
    console.log('2. Copy the User ID (UUID format)');
    console.log('3. Use this ID in the setup-test-data.sql script');
    console.log('4. Update the n8n workflow with this user ID');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Alternative: Get user by email (if you know your email)
async function getUserByEmail(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}\n`);

    const { data: user, error } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .eq('email', email)
      .single();

    if (error) {
      console.error('❌ Error fetching user:', error.message);
      return;
    }

    if (!user) {
      console.log(`⚠️ No user found with email: ${email}`);
      return;
    }

    console.log('✅ Found your user:');
    console.log('─'.repeat(50));
    console.log(`User ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Created: ${new Date(user.created_at).toLocaleString()}`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Copy the User ID above');
    console.log('2. Update scripts/setup-test-data.sql with this ID');
    console.log('3. Update n8n workflow with this ID');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 JobConnect AI - User ID Finder');
  console.log('='.repeat(50));
  
  const email = process.argv[2];
  
  if (email) {
    await getUserByEmail(email);
  } else {
    await getUserInfo();
  }
}

main().catch(console.error); 