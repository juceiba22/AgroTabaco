export function ArticleContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-neutral max-w-none font-serif prose-headings:font-sans prose-headings:font-bold prose-headings:text-brand-green-dark prose-a:text-brand-green-dark prose-blockquote:border-brand-olive prose-blockquote:text-foreground/80 prose-strong:text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
