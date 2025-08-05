const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const docsDirectory = path.join(process.cwd(), 'docs');
const outputPath = path.join(process.cwd(), 'src/data/docs-tree.json');

function buildTree(dirPath = '') {
  const fullPath = path.join(docsDirectory, dirPath);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  const items = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const children = buildTree(path.join(dirPath, entry.name));
      if (children.length > 0) {
        items.push({
          name: entry.name,
          path: path.join(dirPath, entry.name),
          type: 'directory',
          children,
        });
      }
    } else if (entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.md$/, '');
      const fullSlug = dirPath ? path.join(dirPath, slug).split(path.sep) : [slug];
      
      try {
        const filePath = path.join(docsDirectory, ...fullSlug) + '.md';
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        items.push({
          name: slug,
          path: path.join(dirPath, slug),
          type: 'file',
          title: data.title || slug.replace(/-/g, ' '),
          order: data.order,
        });
      } catch (err) {
        console.error(`Error reading ${entry.name}:`, err);
      }
    }
  }
  
  return items.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });
}

// Generate the tree
const tree = buildTree();

// Ensure the data directory exists
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write the tree to a JSON file
fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2));

console.log('✅ Docs tree generated at:', outputPath);
console.log('📄 Total items:', JSON.stringify(tree, null, 2).split('"type"').length - 1);