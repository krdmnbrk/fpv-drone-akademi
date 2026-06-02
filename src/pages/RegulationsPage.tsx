import { Container } from '@/components/ui/Container';
import { MdxProvider } from '@/components/mdx';
import ShgmDoc from '@/content/regulations/shgm.mdx';

/** Renders the web-verified Türkiye SHGM/İHA regulations document. */
export function RegulationsPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <MdxProvider>
          <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-brand-300 prose-strong:text-white">
            <ShgmDoc />
          </article>
        </MdxProvider>
      </div>
    </Container>
  );
}
