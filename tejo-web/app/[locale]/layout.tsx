import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/ui/Header';
import { locales, Locale } from '../../i18n';

// Let Next decide (remove forced static so dynamic locale detection works)
export const dynamic = 'auto';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!locales.includes(locale as Locale)) return {} as any;
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

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = params;
  // Allow static rendering for this locale
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


