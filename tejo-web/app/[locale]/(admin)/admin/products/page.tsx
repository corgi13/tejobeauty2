"use client";
import useSWR from 'swr';
import { useState } from 'react';
import { UploadSigned } from '@/components/ui/UploadSigned';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

export default function AdminProducts() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data, mutate } = useSWR(`${api}/products?take=50`, fetcher);
  const [draft, setDraft] = useState<any>({ name: '', slug: '', price: 0, description: '', images: [] });
  async function create() {
    await fetch(`${api}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(draft) });
    setDraft({ name: '', slug: '', price: 0, description: '', images: [] });
    mutate();
  }
  return (
    <div>
      <h2 className="font-heading text-xl">Products</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Create</h3>
          <input placeholder="Name" className="mt-2 w-full rounded border p-2" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input placeholder="Slug" className="mt-2 w-full rounded border p-2" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <input placeholder="Price" className="mt-2 w-full rounded border p-2" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
          <textarea placeholder="Description" className="mt-2 w-full rounded border p-2" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <div className="mt-2">
            <UploadSigned onUploaded={(url) => setDraft({ ...draft, images: [...(draft.images || []), url] })} />
            <div className="mt-2 flex flex-wrap gap-2">
              {(draft.images || []).map((u: string) => (
                <img key={u} src={u} alt="img" className="h-16 w-16 rounded object-cover" />
              ))}
            </div>
          </div>
          <button onClick={create} className="mt-3 rounded bg-onyx px-4 py-2 text-white">Save</button>
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">List</h3>
          <ul className="mt-2 space-y-2">
            {(data || []).map((p: any) => (
              <li key={p.id} className="flex items-center justify-between rounded border p-2">
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


