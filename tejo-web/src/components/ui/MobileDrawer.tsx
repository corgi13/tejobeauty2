"use client";
import { useState } from 'react';
import Link from 'next/link';

export function MobileDrawer({ items }: { items: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md border px-3 py-2">Menu</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-80 bg-white/90 p-6 backdrop-blur" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="font-heading text-xl">Tejo-Beauty</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md border px-3 py-2">Close</button>
            </div>
            <nav className="mt-6 grid gap-2">
              {items.map((i) => (
                <Link key={i.href} href={i.href} className="rounded-lg px-3 py-2 hover:bg-cream" onClick={() => setOpen(false)}>
                  {i.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}


