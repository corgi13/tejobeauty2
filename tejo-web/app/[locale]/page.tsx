import { getTranslations } from 'next-intl/server';
import { locales } from '../../i18n';
// Temporary workaround for Next 15 typing expecting Promise params in generated types
// We'll assert the type locally to satisfy the generic constraint.
import Link from 'next/link';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

// Next's inferred PageProps appears to expect a Promise for params due to prior incorrect typing.
// We cast in the component to avoid fighting the generated type.
interface LocalePageParams { locale: string }
interface LocalePageProps { params: any }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function HomePage(props: LocalePageProps) {
  const { locale } = (props.params as LocalePageParams);
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream to-blush py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-onyx mb-6">
              Prirodna ljepota
              <br />
              <span className="text-gold">prirodno dostavljena</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Otkrijte najbolje prirodne proizvode za njegu lica, tijela i kose.
              Premium kvaliteta za vašu ljepotu i dobrobit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center px-8 py-4 bg-onyx text-white rounded-xl font-medium hover:bg-onyx/90 transition-colors"
              >
                Istraži proizvode
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-onyx text-onyx rounded-xl font-medium hover:bg-onyx hover:text-white transition-colors"
              >
                Saznaj više
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-onyx text-center mb-12">
            Kategorije proizvoda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: '/categories/face', title: 'Lice', description: 'Nega lica', icon: '✨' },
              { href: '/categories/body', title: 'Tijelo', description: 'Nega tijela', icon: '🧴' },
              { href: '/categories/hair', title: 'Kosa', description: 'Nega kose', icon: '💇‍♀️' },
              { href: '/categories/wellness', title: 'Wellness', description: 'Dobrobit', icon: '🧘‍♀️' },
            ].map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-gold hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-onyx mb-2 group-hover:text-gold transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-onyx text-center mb-12">
            Zašto Tejo-Beauty?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: '100% Prirodno',
                description: 'Svi naši proizvodi su napravljeni od prirodnih sastojaka bez štetnih kemikalija.',
              },
              {
                icon: '🚚',
                title: 'Besplatna dostava',
                description: 'Besplatna dostava za sve narudžbe iznad 50€ u cijeloj Hrvatskoj.',
              },
              {
                icon: '💎',
                title: 'Premium kvaliteta',
                description: 'Proizvodi najviše kvalitete koji su testirani i odobreni od stručnjaka.',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-onyx mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


