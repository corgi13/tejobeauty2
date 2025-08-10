import { getRequestConfig, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['hr', 'en', 'de', 'pt', 'es', 'it'] as const; // keep in sync with middleware
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
    // Set the request locale explicitly to allow static rendering
    unstable_setRequestLocale(locale);
    if (!locales.includes(locale as Locale)) notFound();
    const messages = (await import(`./src/messages/${locale}.json`)).default;
    return { locale, messages };
});
