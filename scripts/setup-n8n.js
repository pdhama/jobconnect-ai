#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 JobConnect AI - n8n Setup Script')
console.log('=====================================\n')

// Create n8n directory
const n8nDir = path.join(process.cwd(), 'n8n')
if (!fs.existsSync(n8nDir)) {
  fs.mkdirSync(n8nDir, { recursive: true })
  console.log('✅ Created n8n directory')
}

// Create .env.n8n file
const envN8nPath = path.join(process.cwd(), '.env.n8n')
const envN8nContent = `# n8n Configuration for JobConnect AI

# n8n Basic Settings
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=jobconnect2025

# Database Configuration
N8N_DATABASE_TYPE=sqlite
N8N_DATABASE_SQLITE_DATABASE=./n8n/n8n.db

# Webhook URL (for local testing)
N8N_WEBHOOK_URL=http://localhost:5678/

# Supabase Configuration
SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url'}
SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key'}
SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key'}

# SERP API Configuration
SERP_API_KEY=your_serp_api_key_here

# Email Configuration (Optional)
SENDGRID_API_KEY=your_sendgrid_key_here

# LinkedIn API (Optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Development Settings
NODE_ENV=development
N8N_LOG_LEVEL=info
N8N_DIAGNOSTICS_ENABLED=false

# Security Settings
N8N_SECRETS_ENCRYPTION_KEY=your_encryption_key_here
N8N_USER_MANAGEMENT_DISABLED=false

# Performance Settings
N8N_MAX_EXECUTION_TIMEOUT=3600
N8N_EXECUTIONS_DATA_SAVE_ON_ERROR=all
N8N_EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
`

if (!fs.existsSync(envN8nPath)) {
  fs.writeFileSync(envN8nPath, envN8nContent)
  console.log('✅ Created .env.n8n file')
} else {
  console.log('✅ .env.n8n already exists')
}

// Create n8n credentials file
const credentialsPath = path.join(n8nDir, 'credentials.json')
const credentialsContent = {
  "supabaseApi": {
    "id": "supabase-credentials",
    "name": "Supabase Account",
    "type": "supabaseApi",
    "data": {
      "url": process.env.NEXT_PUBLIC_SUPABASE_URL || "your_supabase_url",
      "serviceRoleKey": process.env.SUPABASE_SERVICE_ROLE_KEY || "your_service_role_key"
    }
  }
}

if (!fs.existsSync(credentialsPath)) {
  fs.writeFileSync(credentialsPath, JSON.stringify(credentialsContent, null, 2))
  console.log('✅ Created n8n credentials file')
} else {
  console.log('✅ n8n credentials already exists')
}

// Create workflow import script
const importScriptPath = path.join(process.cwd(), 'scripts/import-n8n-workflows.js')
const importScriptContent = `#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('📥 Importing n8n workflows...')

const workflowsDir = path.join(process.cwd(), 'n8n-workflows')
const workflowFiles = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'))

for (const file of workflowFiles) {
  const workflowPath = path.join(workflowsDir, file)
  const workflowName = path.basename(file, '.json')
  
  console.log(\`Importing \${workflowName}...\`)
  
  try {
    // Import workflow using n8n CLI
    execSync(\`n8n import:workflow --input=\${workflowPath}\`, { 
      stdio: 'inherit',
      env: { ...process.env, N8N_BASIC_AUTH_USER: 'admin', N8N_BASIC_AUTH_PASSWORD: 'jobconnect2025' }
    })
    console.log(\`✅ Successfully imported \${workflowName}\`)
  } catch (error) {
    console.error(\`❌ Failed to import \${workflowName}: \${error.message}\`)
  }
}

console.log('\\n🎉 Workflow import completed!')
console.log('\\n📋 Next steps:')
console.log('1. Start n8n: n8n start')
console.log('2. Access n8n at: http://localhost:5678')
console.log('3. Login with: admin / jobconnect2025')
console.log('4. Activate your workflows')
`

if (!fs.existsSync(importScriptPath)) {
  fs.writeFileSync(importScriptPath, importScriptContent)
  fs.chmodSync(importScriptPath, '755')
  console.log('✅ Created workflow import script')
} else {
  console.log('✅ Workflow import script already exists')
}

// Create start script
const startScriptPath = path.join(process.cwd(), 'scripts/start-n8n.sh')
const startScriptContent = `#!/bin/bash

echo "🚀 Starting n8n for JobConnect AI..."

# Load environment variables
if [ -f .env.n8n ]; then
  export $(cat .env.n8n | grep -v '^#' | xargs)
fi

# Start n8n
n8n start

echo "✅ n8n started successfully!"
echo "🌐 Access at: http://localhost:5678"
echo "👤 Login: admin / jobconnect2025"
`

if (!fs.existsSync(startScriptPath)) {
  fs.writeFileSync(startScriptPath, startScriptContent)
  fs.chmodSync(startScriptPath, '755')
  console.log('✅ Created n8n start script')
} else {
  console.log('✅ n8n start script already exists')
}

// Create package.json scripts
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }
  
  packageJson.scripts['n8n:start'] = 'bash scripts/start-n8n.sh'
  packageJson.scripts['n8n:import'] = 'node scripts/import-n8n-workflows.js'
  packageJson.scripts['n8n:setup'] = 'node scripts/setup-n8n.js'
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
  console.log('✅ Added n8n scripts to package.json')
} else {
  console.log('⚠️  package.json not found, skipping script addition')
}

console.log('\n📋 Setup Summary:')
console.log('================')
console.log('✅ Created n8n directory')
console.log('✅ Created .env.n8n configuration')
console.log('✅ Created n8n credentials file')
console.log('✅ Created workflow import script')
console.log('✅ Created n8n start script')
console.log('✅ Added npm scripts')

console.log('\n🔧 Next Steps:')
console.log('==============')
console.log('1. Update .env.n8n with your API keys:')
console.log('   - SERP_API_KEY (get from https://serpapi.com)')
console.log('   - SUPABASE_URL and keys')
console.log('   - Other API keys as needed')
console.log('')
console.log('2. Import workflows:')
console.log('   npm run n8n:import')
console.log('')
console.log('3. Start n8n:')
console.log('   npm run n8n:start')
console.log('')
console.log('4. Access n8n at: http://localhost:5678')
console.log('   Login: admin / jobconnect2025')
console.log('')
console.log('5. Activate your workflows in the n8n interface')

console.log('\n📚 Documentation:')
console.log('=================')
console.log('📖 n8n Setup Guide: n8n-setup.md')
console.log('📖 Local Development: LOCAL_DEVELOPMENT_ROADMAP.md')
console.log('📖 Supabase Setup: SUPABASE_SETUP.md')

console.log('\n🎉 n8n setup completed successfully!') 