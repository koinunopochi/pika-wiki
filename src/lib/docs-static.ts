import docsTreeData from '@/data/docs-tree.json';

interface TreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  title?: string;
  order?: number;
  children?: TreeItem[];
}

export function getDocsTreeStatic(): TreeItem[] {
  return docsTreeData as TreeItem[];
}