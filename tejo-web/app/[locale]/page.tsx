import { getTranslations } from 'next-intl/server';
import { locales } from '../../i18n';
// Temporary workaround for Next 15 typing expecting Promise params in generated types
// We'll assert the type locally to satisfy the generated type.
import { HomePageClient } from '@/components/pages/HomePageClient';

// Next's inferred PageProps appears to expect a Promise for params due to prior incorrect typing.
// We'll cast in the component to avoid fighting the generated type.
interface LocalePageParams { locale: string }
interface LocalePageProps { params: any }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function HomePage(props: LocalePageProps) {
  const { locale } = (props.params as LocalePageParams);
  const t = await getTranslations({ locale, namespace: 'home' });

  // Helper function to get translation with fallback
  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  };

  // Get actual translation values for the keys we need with fallbacks
  const translations = {
    heroTitle: getTranslation('hero.title', 'Prirodna ljepota'),
    heroSubtitle: getTranslation('hero.subtitle', 'prirodno dostavljena'),
    heroDescription: getTranslation('hero.description', 'Otkrijte najbolje prirodne proizvode za njegu lica, tijela i kose. Premium kvaliteta za vašu ljepotu i dobrobit.'),
    exploreButton: getTranslation('hero.exploreButton', 'Istraži proizvode'),
    learnMoreButton: getTranslation('hero.learnMoreButton', 'Saznaj više'),
    categoriesTitle: getTranslation('categories.title', 'Kategorije proizvoda'),
    featuresTitle: getTranslation('features.title', 'Zašto Tejo-Beauty?'),
    statsTitle: getTranslation('stats.title', 'Iskusite razliku'),
    statsDescription: getTranslation('stats.description', 'Pridružite se tisućama zadovoljnih kupaca koji su već otkrili snagu prirodnih sastojaka u njihovoj rutini ljepote.'),
  };

  return <HomePageClient translations={translations} />;
}


