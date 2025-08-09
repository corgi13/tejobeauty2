import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'seo' });
  const siteName = 'Tejo-Beauty';
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `${siteName} — ${t('defaultTitle')}`,
      template: `%s — ${siteName}`,
    },
    description: t('defaultDescription'),
    applicationName: siteName,
    alternates: {
      canonical: `/${params.locale}`,
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = await getMessages();
  return (
    <html lang={params.locale}>
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


