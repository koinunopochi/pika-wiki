'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { WikiSidebar } from './wiki-sidebar';
import { useState } from 'react';

interface MobileSidebarProps {
  tree: any[];
}

export function MobileSidebar({ tree }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Documentation</SheetTitle>
        </SheetHeader>
        <div className="h-full overflow-hidden">
          <WikiSidebar tree={tree} />
        </div>
      </SheetContent>
    </Sheet>
  );
}