"use client";
import { useState, useRef } from 'react';

export function HoverPeek({ preview, children }: { preview: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative inline-block" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <div className="absolute left-1/2 z-50 mt-2 -translate-x-1/2 rounded-xl border bg-white p-3 shadow-lg">
          {preview}
        </div>
      )}
    </div>
  );
}


