import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { glossary } from '@/content/glossary';

export function GlossaryPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, 'tr'));
    const q = query.trim().toLocaleLowerCase('tr');
    if (!q) return sorted;
    return sorted.filter((entry) =>
      `${entry.term} ${entry.en ?? ''} ${entry.definition}`.toLocaleLowerCase('tr').includes(q),
    );
  }, [query]);

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
            {filtered.map((entry) => (
              <div key={entry.term} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="font-semibold text-white">
                  {entry.term}
                  {entry.en && <span className="font-normal text-brand-300"> ({entry.en})</span>}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-brand-100">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Container>
  );
}
