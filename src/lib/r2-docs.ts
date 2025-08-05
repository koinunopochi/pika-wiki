import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface DocMeta {
  slug: string[];
  title: string;
  description?: string;
  order?: number;
}

export interface DocContent extends DocMeta {
  content: string;
}

interface TreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  title?: string;
  order?: number;
  children?: TreeItem[];
}

// Get document from R2 with caching
export async function getDocFromR2(slug: string[]): Promise<DocContent | null> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      // Fallback to local development if no R2
      if (process.env.NODE_ENV === 'development') {
        const { getDocBySlug } = await import('./docs');
        return getDocBySlug(slug);
      }
      return null;
    }

    const key = slug.join('/') + '.md';
    
    // Note: Caching will be handled by Cloudflare's edge cache
    
    const object = await context.env.WIKI_DOCS.get(key);
    
    if (!object) {
      return null;
    }

    const content = await object.text();
    
    // Parse frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    let title = slug[slug.length - 1].replace(/-/g, ' ');
    let description: string | undefined;
    let order: number | undefined;
    let actualContent = content;
    
    if (match) {
      const frontmatter = match[1];
      actualContent = match[2];
      
      // Parse YAML-like frontmatter
      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      const descMatch = frontmatter.match(/description:\s*(.+)/);
      const orderMatch = frontmatter.match(/order:\s*(\d+)/);
      
      if (titleMatch) title = titleMatch[1].trim();
      if (descMatch) description = descMatch[1].trim();
      if (orderMatch) order = parseInt(orderMatch[1]);
    }
    
    const docData: DocContent = {
      slug,
      title,
      description,
      order,
      content: actualContent,
    };
    
    return docData;
  } catch (error) {
    console.error('Error fetching from R2:', error);
    return null;
  }
}

// Get docs tree from R2 metadata
export async function getDocsTreeFromR2(): Promise<TreeItem[]> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      // Fallback to local development if no R2
      if (process.env.NODE_ENV === 'development') {
        const { getDocsTree } = await import('./docs');
        return getDocsTree();
      }
      return [];
    }

    const object = await context.env.WIKI_DOCS.get('metadata.json');
    
    if (!object) {
      console.error('Metadata not found in R2');
      return [];
    }

    const metadata = await object.json() as TreeItem[];
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata from R2:', error);
    return [];
  }
}

// List all available doc slugs from R2
export async function listDocsFromR2(): Promise<string[][]> {
  try {
    const context = await getCloudflareContext();
    if (!context.env.WIKI_DOCS) {
      console.error('R2 bucket not configured');
      return [];
    }

    const listed = await context.env.WIKI_DOCS.list();
    const slugs: string[][] = [];
    
    for (const object of listed.objects) {
      if (object.key.endsWith('.md') && object.key !== 'metadata.json') {
        const slug = object.key
          .replace(/\.md$/, '')
          .split('/');
        slugs.push(slug);
      }
    }
    
    return slugs;
  } catch (error) {
    console.error('Error listing from R2:', error);
    return [];
  }
}