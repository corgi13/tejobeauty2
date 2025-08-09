"use client";
import { useState } from 'react';

export function TermsCheckbox({ onChange }: { onChange?: (v: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="group inline-flex cursor-pointer items-center gap-2">
      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded border border-gold/60 bg-white transition group-hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]">
        <input
          type="checkbox"
          className="peer absolute inset-0 opacity-0"
          checked={checked}
          onChange={(e) => { setChecked(e.target.checked); onChange?.(e.target.checked); }}
        />
        <span className="pointer-events-none h-3 w-3 scale-0 rounded-sm bg-gold transition peer-checked:scale-100" />
      </span>
      <span className="text-sm">Prihvaćam uvjete korištenja</span>
    </label>
  );
}


