import { getTranslations } from 'next-intl/server';
import { locales } from '../../i18n';
// Temporary workaround for Next 15 typing expecting Promise params in generated types
// We'll assert the type locally to satisfy the generic constraint.
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

  // Get actual translation values for the keys we need
  const translations = {
    heroTitle: await t('hero.title'),
    heroSubtitle: await t('hero.subtitle'),
    heroDescription: await t('hero.description'),
    exploreButton: await t('hero.exploreButton'),
    learnMoreButton: await t('hero.learnMoreButton'),
    categoriesTitle: await t('categories.title'),
    featuresTitle: await t('features.title'),
    statsTitle: await t('stats.title'),
    statsDescription: await t('stats.description'),
  };

  return <HomePageClient translations={translations} />;
}


