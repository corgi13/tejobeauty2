"use client";
import { useState } from 'react';

export function QuantityStepper({ min = 1, max = 99, onChange }: { min?: number; max?: number; onChange?: (v: number) => void }) {
  const [v, setV] = useState(min);
  function set(n: number) {
    const next = Math.max(min, Math.min(max, n));
    setV(next);
    onChange?.(next);
  }
  return (
    <div className="inline-flex items-center rounded-xl border bg-white">
      <button className="px-3 py-2" onClick={() => set(v - 1)} aria-label="Decrease">-</button>
      <span className="min-w-[3rem] text-center">{v}</span>
      <button className="px-3 py-2" onClick={() => set(v + 1)} aria-label="Increase">+</button>
    </div>
  );
}


