import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs, getDocsTree } from '@/lib/docs';
import { markdownToHtml } from '@/lib/markdown';
import { WikiLayout } from '@/components/wiki-layout';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  
  // Include the index page
  const allParams = [
    { slug: [] }, // for /wiki route
    ...slugs.map((slug) => ({
      slug,
    }))
  ];
  
  return allParams;
}

export default async function WikiPage({ params }: PageProps) {
  const { slug: paramSlug } = await params;
  const slug = paramSlug || ['index'];
  const doc = await getDocBySlug(slug);
  const tree = getDocsTree();

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