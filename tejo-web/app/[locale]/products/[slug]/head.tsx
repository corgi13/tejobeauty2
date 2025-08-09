import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { productJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await api.get(`/products/${params.slug}`).then((r) => r.data).catch(() => null);
  if (!p) return {};
  return {
    title: p.metaTitle?.en || p.name,
    description: p.metaDescription?.en || p.description?.slice(0, 160),
    other: {
      'script:ld+json': JSON.stringify(productJsonLd(p))
    }
  } as any;
}

export default function Head() { return null }

