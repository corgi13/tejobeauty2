"use client";
import { useState } from 'react';

export function UploadSigned({ onUploaded, folder = 'tejo' }: { onUploaded: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sign = await fetch(`${api}/uploads/sign?folder=${encodeURIComponent(folder)}`, { credentials: 'include' }).then((r) => r.json());
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sign.apiKey);
      form.append('timestamp', String(sign.timestamp));
      form.append('folder', sign.folder);
      form.append('signature', sign.signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`, { method: 'POST', body: form });
      const data = await res.json();
      if (data?.secure_url) onUploaded(data.secure_url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-2">
      <input type="file" onChange={onFile} className="hidden" accept="image/*" />
      {uploading ? 'Uploading…' : 'Upload Image'}
    </label>
  );
}


