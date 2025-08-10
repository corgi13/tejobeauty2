"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export function SearchTypeahead() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const debounced = useDebounce(q, 200);
  useEffect(() => {
    let mounted = true;
    if (!debounced) { setResults([]); return; }
    fetch(`${api}/search/typeahead?q=${encodeURIComponent(debounced)}`).then((r) => r.json()).then((d) => {
      if (mounted) setResults(d);
    }).catch(() => mounted && setResults([]));
    return () => { mounted = false; };
  }, [debounced, api]);

  return (
    <div className="relative">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="w-64 rounded-full border px-4 py-2" />
      {results.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-white shadow-lg">
          <ul>
            {results.map((r) => (
              <li key={r.id} className="px-4 py-2 hover:bg-cream">
                <Link href={`/en/products/${r.slug || r.id}`}>{r.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay = 200) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}


