import { serverApi } from '@/lib/serverApi';
import { notFound } from 'next/navigation';
import AddToCartClient from './AddToCartClient';
import { Gallery } from '@/components/pdp/Gallery';
import { PdpTabs } from '@/components/pdp/Tabs';
import { breadcrumbJsonLd } from '@/lib/seo';

type Product = { id: string; name: string; slug: string; price: number; images: string[]; description?: string; howToUse?: string; ingredients?: string };

async function getProduct(slug: string) {
  return serverApi<Product>(`/products/${slug}`, undefined, ['products']);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug).catch(() => null as any as Product | null);
  if (!p) return notFound();
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: site },
    { name: 'Products', url: `${site}` },
    { name: p.name, url: `${site}/products/${p.slug}` },
  ]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Gallery images={p.images || []} />
        </div>
        <div>
          <h1 className="font-heading text-3xl">{p.name}</h1>
          <p className="mt-2 text-neutral-600">€{p.price}</p>
          <AddToCartClient product={p} />
          <PdpTabs description={p.description} howToUse={p.howToUse as any} ingredients={p.ingredients as any} />
        </div>
      </div>
    </main>
  );
}


