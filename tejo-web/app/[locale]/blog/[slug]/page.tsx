import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import { articleJsonLd } from '@/lib/seo';

async function getPost(slug: string) {
  const res = await api.get(`/blog/${slug}`);
  return res.data as { title: string; content: string; image?: string; createdAt?: string; updatedAt?: string };
}

export default async function BlogPostPage({ params }: { params: any }) {
  const post = await getPost(params.slug).catch(() => null);
  if (!post) return notFound();
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ld = articleJsonLd(post, site);
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="font-heading text-3xl">{post.title}</h1>
      <article className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}


