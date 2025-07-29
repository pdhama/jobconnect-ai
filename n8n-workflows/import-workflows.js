#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📥 Importing JobConnect AI workflows to n8n...\n');

const workflowsDir = __dirname;
const workflowFiles = fs.readdirSync(workflowsDir)
  .filter(file => file.endsWith('.json'))
  .filter(file => file !== 'package.json');

console.log(`Found ${workflowFiles.length} workflow files:`);

workflowFiles.forEach(file => {
  console.log(`  - ${file}`);
});

console.log('\n📋 To import these workflows:');
console.log('1. Start n8n: npm run n8n:start');
console.log('2. Open http://localhost:5678');
console.log('3. Go to Settings > Import/Export');
console.log('4. Import each workflow file manually');
console.log('\n💡 Or use the n8n CLI:');
console.log('n8n import:workflow --input=job-discovery-workflow.json');
