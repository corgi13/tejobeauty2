import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function ProPage({ params }: { params: any }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'pro' });
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-heading text-4xl">{t('title')}</h1>
      <p className="mt-4 text-neutral-700">{t('subtitle')}</p>
      <ul className="mt-6 list-disc pl-5 space-y-1 text-neutral-700">
        <li>{t('benefits.0')}</li>
        <li>{t('benefits.1')}</li>
        <li>{t('benefits.2')}</li>
        <li>{t('benefits.3')}</li>
      </ul>
      <div className="mt-8 rounded-xl border p-6">
        <h2 className="font-semibold">{t('contact.title')}</h2>
        <p className="mt-2">{t('contact.desc')}</p>
        <p className="mt-2"><a className="text-onyx underline" href="mailto:partneri@tejo-beauty.com">partneri@tejo-beauty.com</a></p>
        <Link href="#" className="mt-4 inline-flex rounded-lg bg-onyx px-4 py-2 text-white">{t('cta')}</Link>
      </div>
    </main>
  );
}


