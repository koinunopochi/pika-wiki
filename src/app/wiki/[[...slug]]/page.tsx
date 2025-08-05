import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import { getDocsTreeStatic } from '@/lib/docs-static';
import { markdownToHtml } from '@/lib/markdown';
import { WikiLayout } from '@/components/wiki-layout';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  
  // Include the index page and all document slugs
  const allParams = [
    { slug: undefined }, // for /wiki route
    { slug: [] }, // for /wiki route (alternative)
    ...slugs.map((slug) => ({
      slug,
    }))
  ];
  
  return allParams;
}

export default async function WikiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || ['index'];
  const doc = await getDocBySlug(slug);
  const tree = getDocsTreeStatic();

  if (!doc) {
    notFound();
  }

  const content = await markdownToHtml(doc.content);

  return (
    <WikiLayout tree={tree}>
      <div className="mx-auto max-w-4xl">
        <article className="prose prose-slate dark:prose-invert">
          <h1>{doc.title}</h1>
          {doc.description && (
            <p className="text-xl text-muted-foreground">{doc.description}</p>
          )}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </WikiLayout>
  );
}