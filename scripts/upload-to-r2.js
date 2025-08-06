const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// R2 bucket name from environment or default
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'pika-wiki-docs';

function uploadFile(filePath, key) {
  // Determine content type based on file extension
  const ext = path.extname(filePath);
  let contentType = 'application/octet-stream';
  
  if (ext === '.json') {
    contentType = 'application/json';
  } else if (ext === '.md') {
    contentType = 'text/markdown';
  }
  
  // Use --remote flag to upload to actual R2 bucket
  const command = `npx wrangler r2 object put ${BUCKET_NAME}/${key} --file="${filePath}" --content-type="${contentType}" --remote`;
  
  console.log(`Uploading: ${key}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Uploaded: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to upload ${key}:`, error.message);
    process.exit(1);
  }
}

function uploadDirectory(dirPath, prefix = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const key = prefix ? path.join(prefix, entry.name) : entry.name;
    
    if (entry.isDirectory()) {
      uploadDirectory(fullPath, key);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.json')) {
      uploadFile(fullPath, key);
    }
  }
}

console.log(`📦 Uploading to R2 bucket: ${BUCKET_NAME}`);
console.log('=====================================\n');

// Upload docs (public wiki content)
const docsDirectory = path.join(process.cwd(), 'docs');
if (fs.existsSync(docsDirectory)) {
  console.log('📚 Uploading documentation...');
  uploadDirectory(docsDirectory);
}

// Upload data (internal data like announcements)
const dataDirectory = path.join(process.cwd(), 'data');
if (fs.existsSync(dataDirectory)) {
  console.log('\n📊 Uploading data files...');
  uploadDirectory(dataDirectory, 'data');
}

console.log('\n✨ All files uploaded successfully!');