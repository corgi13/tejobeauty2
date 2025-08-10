"use client";
import { useCart } from '@/store/cart';
import { FreeShippingBar } from '@/components/ui/FreeShippingBar';
import { useState } from 'react';
import { CheckoutOverlay } from '@/components/ui/CheckoutOverlay';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, discount, total, setCoupon, clearCoupon, coupon } = useCart();
  const sub = subtotal();
  const disc = discount();
  const tot = total();

  const [processing, setProcessing] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState('');

  async function applyCoupon() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiBase}/coupons/validate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }), credentials: 'include' });
    const data = await res.json();
    if (data.valid) setCoupon({ code, type: data.type, value: data.value });
  }

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
      <div className="mt-6"><FreeShippingBar subtotal={sub} /></div>

      <div className="mt-6 flex items-center gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kupon" className="rounded border px-3 py-2" />
        <button onClick={applyCoupon} className="rounded border px-3 py-2">Primijeni</button>
        {coupon && <button onClick={clearCoupon} className="text-sm text-neutral-600 underline">Ukloni kupon {coupon.code}</button>}
      </div>

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

      <div className="mt-6 space-y-1 text-right">
        <div>Međuzbroj: €{sub.toFixed(2)}</div>
        {disc > 0 && <div>Popust: -€{disc.toFixed(2)}</div>}
        <div className="text-lg font-medium">Ukupno: €{tot.toFixed(2)}</div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-4">
          <TermsCheckbox onChange={setAccepted} />
          <button disabled={!accepted} onClick={checkout} className="rounded-xl bg-onyx px-5 py-3 text-white disabled:opacity-50">Nastavi na plaćanje</button>
        </div>
      </div>
    </main>
  );
}


