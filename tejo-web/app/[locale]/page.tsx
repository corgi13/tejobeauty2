import Link from 'next/link';
import { MovingBorder } from '@/components/ui/MovingBorder';
import { getTranslations } from 'next-intl/server';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(site)) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(site)) }} />
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight text-onyx">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <MovingBorder borderRadius={16} duration={7000}>
              <Link href={`/${locale}/categories/skincare`} className="moving-border inline-flex items-center justify-center rounded-[14px] bg-onyx px-6 py-3 text-white hover:bg-black transition">
                {t('hero.ctaPrimary')}
              </Link>
            </MovingBorder>
            <Link href={`/${locale}/pro`} className="inline-flex items-center justify-center rounded-xl border border-gold px-6 py-3 text-onyx hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] transition">
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Category grid, Featured, Why Tejo, Storytelling, Testimonials, IG, Newsletter — stubs */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-heading text-2xl">{t('sections.categories')}</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Skincare','Nails','Hair','Spa & Wellness','Make-up','Alati & uređaji','Higijena','Poklon setovi'].map((name, idx) => (
            <div key={name} className="rounded-xl border border-neutral-200 p-4 hover:shadow-lg transition">
              <span className="font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


