#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('📥 Importing n8n workflows...')

const workflowsDir = path.join(process.cwd(), 'n8n-workflows')
const workflowFiles = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'))

for (const file of workflowFiles) {
  const workflowPath = path.join(workflowsDir, file)
  const workflowName = path.basename(file, '.json')
  
  console.log(`Importing ${workflowName}...`)
  
  try {
    // Import workflow using n8n CLI
    execSync(`n8n import:workflow --input=${workflowPath}`, { 
      stdio: 'inherit',
      env: { ...process.env, N8N_BASIC_AUTH_USER: 'admin', N8N_BASIC_AUTH_PASSWORD: 'jobconnect2025' }
    })
    console.log(`✅ Successfully imported ${workflowName}`)
  } catch (error) {
    console.error(`❌ Failed to import ${workflowName}: ${error.message}`)
  }
}

console.log('\n🎉 Workflow import completed!')
console.log('\n📋 Next steps:')
console.log('1. Start n8n: n8n start')
console.log('2. Access n8n at: http://localhost:5678')
console.log('3. Login with: admin / jobconnect2025')
console.log('4. Activate your workflows')
