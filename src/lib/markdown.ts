import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
    
  // Add target="_blank" to external links
  let htmlContent = result.toString();
  htmlContent = htmlContent.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );
  
  return htmlContent;
}