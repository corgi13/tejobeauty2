"use client";
import { useCart } from '@/store/cart';
import { FreeShippingBar } from '@/components/ui/FreeShippingBar';
import { useState } from 'react';
import { CheckoutOverlay } from '@/components/ui/CheckoutOverlay';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const total = subtotal();

  const [processing, setProcessing] = useState(false);
  const [accepted, setAccepted] = useState(false);
  async function checkout() {
    setProcessing(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiBase}/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else setProcessing(false);
  }

  return (
    <main className="relative mx-auto max-w-4xl px-6 py-12">
      <CheckoutOverlay show={processing} />
      <h1 className="font-heading text-3xl">Košarica</h1>
      <div className="mt-6"><FreeShippingBar subtotal={total} /></div>
      <div className="mt-8 divide-y rounded-xl border">
        {items.map((i) => (
          <div key={`${i.productId}:${i.variantId ?? ''}`} className="flex items-center justify-between gap-4 p-4">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-neutral-600">€{i.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(i.productId, i.variantId, Math.max(1, i.qty - 1))} className="rounded border px-2">-</button>
              <span>{i.qty}</span>
              <button onClick={() => updateQty(i.productId, i.variantId, i.qty + 1)} className="rounded border px-2">+</button>
              <button onClick={() => removeItem(i.productId, i.variantId)} className="text-red-600">Ukloni</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-medium">Ukupno: €{total.toFixed(2)}</span>
        <div className="flex items-center gap-4">
          <TermsCheckbox onChange={setAccepted} />
          <button disabled={!accepted} onClick={checkout} className="rounded-xl bg-onyx px-5 py-3 text-white disabled:opacity-50">Nastavi na plaćanje</button>
        </div>
      </div>
    </main>
  );
}


