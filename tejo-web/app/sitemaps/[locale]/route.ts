import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: any }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const l = params.locale;
  const [products, posts] = await Promise.all([
    fetch(`${api}/products?take=1000`).then((r) => r.json()).catch(() => []),
    fetch(`${api}/blog?take=1000`).then((r) => r.json()).catch(() => []),
  ]);
  const urls: string[] = [
    `/${l}`,
    `/${l}/about`,
    `/${l}/pro`,
    `/${l}/blog`,
    ...products.map((p: any) => `/${l}/products/${p.slug}`),
    ...posts.map((b: any) => `/${l}/blog/${b.slug}`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `<url><loc>${site}${u}</loc></url>`)
    .join('\n')}\n</urlset>`;
  return new NextResponse(body, { headers: { 'Content-Type': 'application/xml' } });
}


