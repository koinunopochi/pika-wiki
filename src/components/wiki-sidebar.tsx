'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';

interface DocItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  title?: string;
  children?: DocItem[];
}

interface WikiSidebarProps {
  tree: DocItem[];
}

export function WikiSidebar({ tree }: WikiSidebarProps) {
  const pathname = usePathname();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Initialize expanded directories from localStorage and current path
  useEffect(() => {
    if (!initialized) {
      // Load saved state from localStorage
      const saved = localStorage.getItem('wiki-expanded-dirs');
      const savedDirs = saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
      
      // Also expand parent directories of current file
      if (pathname.startsWith('/wiki/')) {
        const pathParts = pathname.replace('/wiki/', '').split('/');
        for (let i = 0; i < pathParts.length - 1; i++) {
          const dirPath = pathParts.slice(0, i + 1).join('/');
          savedDirs.add(dirPath);
        }
      }
      
      setExpandedDirs(savedDirs);
      setInitialized(true);
    }
  }, [pathname, initialized]);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('wiki-expanded-dirs', JSON.stringify(Array.from(expandedDirs)));
    }
  }, [expandedDirs, initialized]);

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const renderItem = (item: DocItem, level: number = 0) => {
    const isActive = pathname === `/wiki/${item.path}`;
    const isExpanded = expandedDirs.has(item.path);

    if (item.type === 'directory') {
      return (
        <div key={item.path}>
          <button
            onClick={() => toggleDir(item.path)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              "transition-colors"
            )}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
            {isExpanded ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            <span className="capitalize">{item.name.replace(/-/g, ' ')}</span>
          </button>
          {isExpanded && item.children && (
            <div>
              {item.children.map((child) => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={`/wiki/${item.path}`}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
          "transition-colors",
          isActive && "bg-accent text-accent-foreground font-medium"
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        <FileText className="h-4 w-4" />
        <span>{item.title || item.name.replace(/-/g, ' ')}</span>
      </Link>
    );
  };

  return (
    <div className="h-full bg-background">
      <ScrollArea className="h-full py-6">
        <div className="px-3">
          <h2 className="mb-4 px-3 text-lg font-semibold hidden md:block">Documentation</h2>
          <nav className="space-y-1">
            {tree.map((item) => renderItem(item))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}