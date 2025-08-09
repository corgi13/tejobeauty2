import Link from 'next/link';
import { serverApi } from '@/lib/serverApi';

export default async function BlogListPage() {
  const posts = await serverApi<Array<{ slug: string; title: string; excerpt: string; image?: string }>>('/blog', undefined, ['blog']).catch(() => []);
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-heading text-4xl">Blog</h1>
      <div className="mt-8 grid gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={`./blog/${p.slug}`} className="rounded-xl border p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-neutral-600">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}


