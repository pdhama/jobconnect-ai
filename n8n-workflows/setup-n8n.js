#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up n8n for JobConnect AI...\n');

// Create n8n directory structure
const dirs = [
  'n8n-workflows',
  'n8n-workflows/logs',
  'n8n-workflows/credentials'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create .env.n8n file
const envContent = `# n8n Environment Configuration for JobConnect AI

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# SERP API Configuration
SERP_API_KEY=your_serp_api_key_here

# n8n Configuration
N8N_PORT=5678
N8N_HOST=localhost
N8N_PROTOCOL=http
N8N_USER_MANAGEMENT_DISABLED=false
N8N_BASIC_AUTH_ACTIVE=false

# Job Search Configuration
JOB_SEARCH_CRON="0 9 * * 1-5"  # 9 AM on weekdays only
LINKEDIN_RATE_LIMIT=10  # requests per minute
NAUKRI_RATE_LIMIT=15    # requests per minute
MAX_JOBS_PER_SEARCH=50
FRESHNESS_HOURS=24      # only jobs posted in last 24 hours

# Holiday Configuration (India & Pakistan)
HOLIDAYS_2025="2025-01-26,2025-08-15,2025-10-02,2025-01-01,2025-05-01,2025-03-23,2025-08-14,2025-09-06,2025-11-09"

# Logging
N8N_LOG_LEVEL=info
`;

fs.writeFileSync('n8n-workflows/.env.n8n', envContent);
console.log('✅ Created .env.n8n file');

// Create start script
const startScript = `#!/bin/bash
# Start n8n with JobConnect AI configuration

echo "🚀 Starting n8n for JobConnect AI..."

# Load environment variables
if [ -f .env.n8n ]; then
  export \$(cat .env.n8n | grep -v '^#' | xargs)
fi

# Start n8n
n8n start \\
  --port=\${N8N_PORT:-5678} \\
  --host=\${N8N_HOST:-localhost} \\
  --protocol=\${N8N_PROTOCOL:-http} \\
  --user-management=\${N8N_USER_MANAGEMENT_DISABLED:-false} \\
  --basic-auth=\${N8N_BASIC_AUTH_ACTIVE:-false}

echo "✅ n8n started successfully!"
echo "🌐 Access n8n at: http://localhost:\${N8N_PORT:-5678}"
`;

fs.writeFileSync('n8n-workflows/start-n8n.sh', startScript);
fs.chmodSync('n8n-workflows/start-n8n.sh', '755');
console.log('✅ Created start-n8n.sh script');

// Create import script
const importScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📥 Importing JobConnect AI workflows to n8n...\\n');

const workflowsDir = __dirname;
const workflowFiles = fs.readdirSync(workflowsDir)
  .filter(file => file.endsWith('.json'))
  .filter(file => file !== 'package.json');

console.log(\`Found \${workflowFiles.length} workflow files:\`);

workflowFiles.forEach(file => {
  console.log(\`  - \${file}\`);
});

console.log('\\n📋 To import these workflows:');
console.log('1. Start n8n: npm run n8n:start');
console.log('2. Open http://localhost:5678');
console.log('3. Go to Settings > Import/Export');
console.log('4. Import each workflow file manually');
console.log('\\n💡 Or use the n8n CLI:');
console.log('n8n import:workflow --input=job-discovery-workflow.json');
`;

fs.writeFileSync('n8n-workflows/import-workflows.js', importScript);
fs.chmodSync('n8n-workflows/import-workflows.js', '755');
console.log('✅ Created import-workflows.js script');

// Update package.json with n8n scripts
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['n8n:start'] = 'cd n8n-workflows && ./start-n8n.sh';
  packageJson.scripts['n8n:import'] = 'cd n8n-workflows && node import-workflows.js';
  packageJson.scripts['n8n:setup'] = 'node n8n-workflows/setup-n8n.js';
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with n8n scripts');
}

console.log('\n🎉 n8n setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update n8n-workflows/.env.n8n with your API keys');
console.log('2. Run: npm run n8n:start');
console.log('3. Import workflows in n8n UI');
console.log('4. Test the job discovery workflow');
console.log('\n🔧 Configuration files created:');
console.log('  - n8n-workflows/.env.n8n');
console.log('  - n8n-workflows/start-n8n.sh');
console.log('  - n8n-workflows/import-workflows.js');
console.log('  - n8n-workflows/job-discovery-workflow.json'); 