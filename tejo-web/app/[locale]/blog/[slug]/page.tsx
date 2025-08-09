import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  const res = await api.get(`/blog/${slug}`);
  return res.data as { title: string; content: string; image?: string };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug).catch(() => null);
  if (!post) return notFound();
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-heading text-3xl">{post.title}</h1>
      <article className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}


