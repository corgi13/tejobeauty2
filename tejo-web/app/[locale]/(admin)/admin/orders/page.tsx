"use client";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

export default function AdminOrders() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data, mutate } = useSWR(`${api}/orders?take=50`, fetcher);
  async function simulate(orderId: string) {
    await fetch(`${api}/payments/simulate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ orderId, status: 'paid' }) });
    mutate();
  }
  return (
    <div>
      <h2 className="font-heading text-xl">Orders</h2>
      <div className="mt-4 divide-y rounded-xl border">
        {(data || []).map((o: any) => (
          <div key={o.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{o.id}</div>
              <div className="text-sm text-neutral-600">{o.status} • €{Number(o.total).toFixed(2)}</div>
            </div>
            <button onClick={() => simulate(o.id)} className="rounded border px-3 py-1">Simulate Paid</button>
          </div>
        ))}
      </div>
    </div>
  );
}


