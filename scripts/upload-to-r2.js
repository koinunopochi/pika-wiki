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

// Generate and upload metadata
function generateAndUploadMetadata() {
  console.log('\n📋 Generating metadata...');
  
  const docsDirectory = path.join(process.cwd(), 'docs');
  
  function buildTree(dirPath, basePath = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const tree = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        // Skip announcements directory as it's internal data
        if (entry.name === 'announcements') continue;
        
        const children = buildTree(fullPath, relativePath);
        if (children.length > 0) {
          tree.push({
            name: entry.name,
            path: relativePath,
            type: 'directory',
            children: children
          });
        }
      } else if (entry.name.endsWith('.md')) {
        const name = entry.name.replace(/\.md$/, '');
        
        // Read file to extract title from first H1
        const content = fs.readFileSync(fullPath, 'utf-8');
        let title = name.replace(/-/g, ' ');
        
        // Try to extract title from first H1
        const h1Match = content.match(/^#\s+(.+)$/m);
        if (h1Match) {
          title = h1Match[1];
        }
        
        tree.push({
          name: name,
          path: relativePath.replace(/\.md$/, ''),
          type: 'file',
          title: title
        });
      }
    }
    
    // Sort directories first, then files
    tree.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    return tree;
  }
  
  const metadata = buildTree(docsDirectory);
  const metadataPath = path.join(process.cwd(), 'metadata.json');
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  // Upload metadata
  uploadFile(metadataPath, 'metadata.json');
  
  // Cleanup
  fs.unlinkSync(metadataPath);
  console.log('✅ Metadata generated and uploaded');
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

// Generate and upload metadata
generateAndUploadMetadata();

console.log('\n✨ All files uploaded successfully!');