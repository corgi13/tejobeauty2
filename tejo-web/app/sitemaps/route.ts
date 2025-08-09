import { NextResponse } from 'next/server';

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales = ['hr', 'en', 'de', 'pt', 'es', 'it'];
  const items = locales.map((l) => `<sitemap><loc>${site}/sitemaps/${l}</loc></sitemap>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>`;
  return new NextResponse(body, { headers: { 'Content-Type': 'application/xml' } });
}


