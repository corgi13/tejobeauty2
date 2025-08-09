import { serverApi } from '@/lib/serverApi';
import { notFound } from 'next/navigation';
import AddToCartClient from './AddToCartClient';
import { Gallery } from '@/components/pdp/Gallery';

async function getProduct(slug: string) {
  return serverApi(`/products/${slug}`, undefined, ['products']);
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug).catch(() => null);
  if (!p) return notFound();
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Gallery images={p.images || []} />
        </div>
        <div>
          <h1 className="font-heading text-3xl">{p.name}</h1>
          <p className="mt-2 text-neutral-600">€{p.price}</p>
          <AddToCartClient product={p} />
        </div>
      </div>
    </main>
  );
}


