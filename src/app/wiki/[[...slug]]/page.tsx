import { notFound } from 'next/navigation';
import { getDocFromR2, getDocsTreeFromR2 } from '@/lib/r2-docs';
import { markdownToHtml } from '@/lib/markdown';
import { WikiLayout } from '@/components/wiki-layout';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Dynamic rendering to fetch from R2
export const dynamic = 'force-dynamic';

export default async function WikiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || ['index'];
  
  const doc = await getDocFromR2(slug);
  const tree = await getDocsTreeFromR2();

  if (!doc) {
    notFound();
  }

  const content = await markdownToHtml(doc.content);

  return (
    <WikiLayout tree={tree}>
      <div className="mx-auto max-w-4xl">
        <article className="prose prose-slate dark:prose-invert">
          {doc.description && (
            <p className="text-xl text-muted-foreground">{doc.description}</p>
          )}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </WikiLayout>
  );
}