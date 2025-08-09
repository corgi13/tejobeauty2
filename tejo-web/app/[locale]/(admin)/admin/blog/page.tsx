"use client";
import useSWR from 'swr';
import { useState } from 'react';
import { UploadSigned } from '@/components/ui/UploadSigned';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

export default function AdminBlog() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data, mutate } = useSWR(`${api}/blog?take=50`, fetcher);
  const [draft, setDraft] = useState<any>({ title: '', slug: '', excerpt: '', content: '' });
  async function create() {
    await fetch(`${api}/blog`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(draft) });
    setDraft({ title: '', slug: '', excerpt: '', content: '' });
    mutate();
  }
  return (
    <div>
      <h2 className="font-heading text-xl">Blog</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Create</h3>
          <input placeholder="Title" className="mt-2 w-full rounded border p-2" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <input placeholder="Slug" className="mt-2 w-full rounded border p-2" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <input placeholder="Excerpt" className="mt-2 w-full rounded border p-2" value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          <textarea placeholder="Content (HTML)" className="mt-2 w-full rounded border p-2" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          <div className="mt-2">
            <UploadSigned onUploaded={(url) => setDraft({ ...draft, image: url })} />
            {draft.image && <img src={draft.image} alt="cover" className="mt-2 h-20 w-20 rounded object-cover" />}
          </div>
          <button onClick={create} className="mt-3 rounded bg-onyx px-4 py-2 text-white">Save</button>
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">List</h3>
          <ul className="mt-2 space-y-2">
            {(data || []).map((p: any) => (
              <li key={p.id} className="flex items-center justify-between rounded border p-2">
                <span>{p.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


