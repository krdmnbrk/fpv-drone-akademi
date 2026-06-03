import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { glossary } from '@/content/glossary';

interface GlossaryRow {
  key: string;
  head: string;
  sub?: string;
  definition: string;
}

export function GlossaryPage() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');

  const lng = i18n.resolvedLanguage || i18n.language || 'tr';
  const isEn = lng.startsWith('en');

  const rows = useMemo<GlossaryRow[]>(() => {
    const collator = isEn ? 'en' : 'tr';
    return glossary
      .map((entry) => {
        // In English mode the English term is the headword and the Turkish term
        // becomes the secondary label; both fall back gracefully.
        const head = isEn ? (entry.termEn ?? entry.en ?? entry.term) : entry.term;
        const sub = isEn
          ? entry.term !== (entry.termEn ?? entry.en ?? entry.term)
            ? entry.term
            : undefined
          : entry.en;
        const definition = isEn ? (entry.definitionEn ?? entry.definition) : entry.definition;
        return { key: entry.term, head, sub, definition };
      })
      .sort((a, b) => a.head.localeCompare(b.head, collator));
  }, [isEn]);

  const filtered = useMemo(() => {
    const collator = isEn ? 'en' : 'tr';
    const q = query.trim().toLocaleLowerCase(collator);
    if (!q) return rows;
    return rows.filter((row) =>
      `${row.head} ${row.sub ?? ''} ${row.definition}`.toLocaleLowerCase(collator).includes(q),
    );
  }, [query, rows, isEn]);

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white">{t('glossary.title')}</h1>
        <p className="mt-3 text-brand-200">{t('glossary.intro')}</p>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('glossary.search')}
          aria-label={t('glossary.search')}
          className="mt-6 w-full rounded-lg border border-white/15 bg-brand-900 px-3 py-2 text-brand-50 placeholder:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        />

        {filtered.length === 0 ? (
          <p className="mt-6 text-brand-300">{t('glossary.noResults')}</p>
        ) : (
          <dl className="mt-6 space-y-3">
            {filtered.map((row) => (
              <div key={row.key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="font-semibold text-white">
                  {row.head}
                  {row.sub && <span className="font-normal text-brand-300"> ({row.sub})</span>}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-brand-100">{row.definition}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Container>
  );
}
