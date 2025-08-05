const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsDirectory = path.join(process.cwd(), 'docs');

// R2 bucket name from environment or default
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'pika-wiki-docs';

function uploadFile(filePath, key) {
  // Use --remote flag to upload to actual R2 bucket
  const command = `npx wrangler r2 object put ${BUCKET_NAME}/${key} --file="${filePath}" --content-type="text/markdown" --remote`;
  
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
    } else if (entry.name.endsWith('.md')) {
      uploadFile(fullPath, key);
    }
  }
}

// Create metadata file
function createMetadata() {
  const docsTree = require('../src/data/docs-tree.json');
  const metadataPath = path.join(process.cwd(), 'docs-metadata.json');
  
  fs.writeFileSync(metadataPath, JSON.stringify(docsTree, null, 2));
  
  // Upload metadata with --remote flag
  const command = `npx wrangler r2 object put ${BUCKET_NAME}/metadata.json --file="${metadataPath}" --content-type="application/json" --remote`;
  
  console.log('Uploading metadata...');
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Metadata uploaded');
  } catch (error) {
    console.error('❌ Failed to upload metadata:', error.message);
    process.exit(1);
  }
  
  // Cleanup
  fs.unlinkSync(metadataPath);
}

console.log(`📦 Uploading docs to R2 bucket: ${BUCKET_NAME}`);
console.log('=====================================\n');

// Upload all markdown files
uploadDirectory(docsDirectory);

// Upload metadata
createMetadata();

console.log('\n✨ All docs uploaded successfully!');
