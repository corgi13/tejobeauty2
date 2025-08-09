"use client";
import useSWR from 'swr';
import { ProgressBar } from './ProgressBar';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

export function LoyaltyBar() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data } = useSWR(`${api}/users/me/loyalty`, fetcher);
  const spend = data?.spend ?? 0;
  const next = data?.next;
  const remaining = data?.remaining ?? 0;
  const pct = next ? Math.min(100, Math.round((spend / next.threshold) * 100)) : 100;
  const label = next ? `${remaining} points to ${next.name}` : 'Top tier achieved!';
  return <ProgressBar value={pct} label={label} />;
}


