import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Github, Rocket, Package } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            Pika Wiki
          </h1>
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
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Pika Documentation
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground">
              Lightning-fast local file viewer with Markdown and Mermaid support.
              Zero configuration required.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/wiki">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Documentation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a
                  href="https://github.com/koinunopochi/pika"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t py-12 md:py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Features</h3>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-lg border p-4 md:p-6 bg-card">
                  <Rocket className="h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-3 text-primary" />
                  <h4 className="font-semibold mb-1 md:mb-2">Lightning Fast</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Instant file serving with minimal overhead
                  </p>
                </div>
                <div className="rounded-lg border p-4 md:p-6 bg-card">
                  <BookOpen className="h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-3 text-primary" />
                  <h4 className="font-semibold mb-1 md:mb-2">Markdown Support</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    GitHub-style markdown rendering with Mermaid diagrams
                  </p>
                </div>
                <div className="rounded-lg border p-4 md:p-6 bg-card sm:col-span-2 md:col-span-1">
                  <Github className="h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-3 text-primary" />
                  <h4 className="font-semibold mb-1 md:mb-2">Zero Config</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Works out of the box with no configuration required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-4 md:py-6">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>Built with Next.js and deployed on Cloudflare Workers</p>
        </div>
      </footer>
    </div>
  );
}