"use client";
import { useState } from 'react';

export function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  if (!images || images.length === 0) return <div className="aspect-square w-full rounded-lg bg-neutral-100"/>;
  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt="product" className="h-full w-full object-cover cursor-zoom-in" onClick={() => setOpen(true)} />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.slice(0, 10).map((src, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="thumb" className={`aspect-square w-full rounded border object-cover cursor-pointer ${idx===active?'border-onyx':'border-neutral-200'}`} onClick={() => setActive(idx)} />
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[active]} alt="full" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}


