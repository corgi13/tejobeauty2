export default async function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales = ['hr', 'en', 'de', 'pt', 'es', 'it'];
  const now = new Date();
  const base = locales.flatMap((l) => [
    { url: `${site}/${l}`, lastModified: now },
    { url: `${site}/${l}/about`, lastModified: now },
    { url: `${site}/${l}/pro`, lastModified: now },
    { url: `${site}/${l}/blog`, lastModified: now },
    { url: `${site}/${l}/categories/skincare`, lastModified: now },
  ]);
  return base as any;
}


