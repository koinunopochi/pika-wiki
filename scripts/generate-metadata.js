const fs = require('fs');
const path = require('path');

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

console.log('📦 Generating metadata...');

const metadata = buildTree(docsDirectory);

// Write metadata.json
const metadataPath = path.join(process.cwd(), 'metadata.json');
fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

console.log('✅ Metadata generated at:', metadataPath);
console.log('\nMetadata structure:');
console.log(JSON.stringify(metadata, null, 2));