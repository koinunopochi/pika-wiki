import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'docs');

export interface DocMeta {
  slug: string[];
  title: string;
  description?: string;
  order?: number;
}

export interface DocContent extends DocMeta {
  content: string;
}

export function getDocSlugs(dirPath: string = ''): string[][] {
  const fullPath = path.join(docsDirectory, dirPath);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  let slugs: string[][] = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subSlugs = getDocSlugs(path.join(dirPath, entry.name));
      slugs = slugs.concat(subSlugs);
    } else if (entry.name.endsWith('.md')) {
      const slug = path.join(dirPath, entry.name.replace(/\.md$/, ''));
      slugs.push(slug.split(path.sep));
    }
  }
  
  return slugs;
}

export async function getDocBySlug(slug: string[]): Promise<DocContent | null> {
  try {
    const fullPath = path.join(docsDirectory, ...slug) + '.md';
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug[slug.length - 1].replace(/-/g, ' '),
      description: data.description,
      order: data.order,
      content,
    };
  } catch {
    return null;
  }
}

interface TreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  title?: string;
  order?: number;
  children?: TreeItem[];
}

export function getDocsTree(): TreeItem[] {
  const buildTree = (dirPath: string = ''): TreeItem[] => {
    const fullPath = path.join(docsDirectory, dirPath);
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    
    const items: TreeItem[] = [];
    
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
          const fullPath = path.join(docsDirectory, ...fullSlug) + '.md';
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          
          items.push({
            name: slug,
            path: path.join(dirPath, slug),
            type: 'file',
            title: data.title || slug.replace(/-/g, ' '),
            order: data.order,
          });
        } catch {
          // Skip files that can't be read
        }
      }
    }
    
    return items.sort((a: TreeItem, b: TreeItem) => {
      // Sort by order if available, then by name
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });
  };
  
  return buildTree();
}