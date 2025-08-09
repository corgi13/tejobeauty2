import { getTranslations } from 'next-intl/server';

const TAGLINES = [
  'Because beauty is a gift.',
  'Inspired by a divine gift.',
  'Beauty, with meaning.',
  'From a gift — to every woman.',
  'Tejo-Beauty. A touch of divine.',
];

export default async function AboutPage({ params }: { params: any }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-heading text-4xl">{t('title')}</h1>
      <p className="mt-6 text-neutral-700 whitespace-pre-line">{t('fullText')}</p>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TAGLINES.map((s) => (
          <div key={s} className="rounded-xl border border-gold/50 bg-cream/40 p-4">
            <p className="font-medium">{s}</p>
          </div>
        ))}
      </div>
    </main>
  );
}


