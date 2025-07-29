#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 JobConnect AI Environment Setup')
console.log('=====================================\n')

const envPath = path.join(process.cwd(), '.env.local')
const envExamplePath = path.join(process.cwd(), 'env.example')

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists')
  console.log('📝 Current environment variables:')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  
  lines.forEach(line => {
    const [key] = line.split('=')
    console.log(`   ${key}`)
  })
} else {
  console.log('❌ .env.local not found')
  console.log('📝 Creating .env.local from template...')
  
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8')
    fs.writeFileSync(envPath, exampleContent)
    console.log('✅ Created .env.local')
  } else {
    console.log('❌ env.example not found')
    console.log('📝 Creating basic .env.local...')
    
    const basicEnv = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Development settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
`
    
    fs.writeFileSync(envPath, basicEnv)
    console.log('✅ Created basic .env.local')
  }
}

console.log('\n📋 Next Steps:')
console.log('1. Create a Supabase project at https://supabase.com')
console.log('2. Get your project URL and anon key from Settings → API')
console.log('3. Update .env.local with your Supabase credentials')
console.log('4. Run the database schema from supabase-schema.sql')
console.log('5. Configure Google OAuth in Supabase dashboard')
console.log('6. Test authentication at http://localhost:3000/test-auth')
console.log('\n📖 See SUPABASE_SETUP.md for detailed instructions') 