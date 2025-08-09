"use client";
import { useEffect } from 'react';
import { addConfetti, clearConfetti } from '@/lib/confetti';
import Link from 'next/link';

export default function OrderSuccessPage() {
  useEffect(() => {
    addConfetti();
    return () => clearConfetti();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="font-heading text-4xl">Hvala! Narudžba je uspješna.</h1>
      <p className="mt-4 text-neutral-600">Uskoro šaljemo potvrdu e-poštom. U međuvremenu, nastavi istraživati.</p>
      <div className="mt-8">
        <Link href="/" className="inline-flex items-center rounded-xl bg-onyx px-6 py-3 text-white">Natrag u trgovinu</Link>
      </div>
    </main>
  );
}


