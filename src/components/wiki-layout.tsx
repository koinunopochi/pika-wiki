import { WikiSidebar } from './wiki-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileSidebar } from './mobile-sidebar';
import { Github, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  title?: string;
  children?: DocItem[];
}

interface WikiLayoutProps {
  children: React.ReactNode;
  tree: DocItem[];
}

export function WikiLayout({ children, tree }: WikiLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background shrink-0">
        <WikiSidebar tree={tree} />
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="border-b px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileSidebar tree={tree} />
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              Pika Wiki
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://www.npmjs.com/package/@koinunopochi/pika"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on npm"
              >
                <Package className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/koinunopochi/pika"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="w-full py-6 md:py-8 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}