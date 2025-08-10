import { getTranslations } from 'next-intl/server';
import { RegisterClient } from './register-client';

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-onyx">{t('register.title')}</h1>
        <p className="mt-2 text-gray-600">{t('register.subtitle')}</p>
      </div>
      
      <RegisterClient />
    </main>
  );
}
