import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { MdxProvider } from '@/components/mdx';
import { getRegulationsDoc } from '@/content';

/** Renders the web-verified Türkiye SHGM/İHA regulations document (locale-aware). */
export function RegulationsPage() {
  // Subscribe to language changes so the English overlay swaps in/out.
  useTranslation();
  const Doc = getRegulationsDoc();

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <MdxProvider>
          <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-brand-300 prose-strong:text-white">
            {Doc ? <Doc /> : null}
          </article>
        </MdxProvider>
      </div>
    </Container>
  );
}
