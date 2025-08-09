"use client";
import useSWR from 'swr';
import { ProgressBar } from './ProgressBar';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data } = useSWR<{ freeShippingThreshold: number }>(`${apiBase}/settings/public`, fetcher);
  const threshold = data?.freeShippingThreshold ?? 0;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = threshold > 0 ? Math.min(100, Math.round((subtotal / threshold) * 100)) : 0;
  const label = remaining > 0 ? `Još €${remaining.toFixed(2)} do besplatne dostave` : 'Besplatna dostava osigurana!';
  return <ProgressBar value={pct} label={label} />;
}


