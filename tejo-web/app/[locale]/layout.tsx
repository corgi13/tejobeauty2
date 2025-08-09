import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  const siteName = 'Tejo-Beauty';
  return {
    title: {
      default: `${siteName} — ${t('defaultTitle')}`,
      template: `%s — ${siteName}`,
    },
    description: t('defaultDescription'),
    applicationName: siteName,
    alternates: {
      canonical: `/${locale}`,
    },
    icons: {
      icon: '/favicon.ico',
    },
  } as any;
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


