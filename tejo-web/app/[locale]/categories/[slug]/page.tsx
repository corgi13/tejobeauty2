import Link from 'next/link';
import { api } from '@/lib/api';
import { cookies } from 'next/headers';

async function getProducts(slug: string, searchParams: Record<string,string | string[] | undefined>) {
  const page = Number(searchParams.page || '1');
  const take = 24;
  const skip = (page - 1) * take;
  const res = await api.get('/products', { params: { category: slug, skip, take, brand: searchParams.brand, priceMin: searchParams.min, priceMax: searchParams.max } });
  return res.data as Array<{ slug: string; name: string; price: string; images: string[] }>;
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const products = await getProducts(slug, sp).catch(() => []);
  const page = Number(sp.page || '1');
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-heading text-3xl capitalize">{slug}</h1>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <form className="flex gap-2">
          <input name="brand" placeholder="Brand" className="rounded border px-3 py-2" defaultValue={(sp.brand as string) || ''} />
          <input name="min" placeholder="Min €" className="w-24 rounded border px-3 py-2" defaultValue={(sp.min as string) || ''} />
          <input name="max" placeholder="Max €" className="w-24 rounded border px-3 py-2" defaultValue={(sp.max as string) || ''} />
          <button className="rounded bg-onyx px-4 py-2 text-white" type="submit">Filter</button>
        </form>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link href={`../products/${p.slug}`} key={p.slug} className="group rounded-xl border p-4 hover:shadow-lg transition">
            <div className="aspect-square w-full bg-neutral-100 rounded-lg" />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-medium group-hover:underline">{p.name}</span>
              <span>€{p.price}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Link href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).map(([k,v]) => [k, String(v||'')])) as any, page: String(Math.max(1, page-1)) })}`} className="rounded border px-3 py-2 disabled:opacity-50" aria-disabled={page<=1}>Prev</Link>
        <span>Page {page}</span>
        <Link href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).map(([k,v]) => [k, String(v||'')])) as any, page: String(page+1) })}`} className="rounded border px-3 py-2">Next</Link>
      </div>
    </main>
  );
}


