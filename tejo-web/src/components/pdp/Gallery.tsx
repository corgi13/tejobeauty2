"use client";
import { useState } from 'react';

export function Gallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const src = images?.[current];
  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
        {src && <img src={src} alt="product" className="h-full w-full object-cover" />}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images?.map((u, i) => (
          <button key={u} onClick={() => setCurrent(i)} className={`h-16 w-16 shrink-0 overflow-hidden rounded border ${i === current ? 'border-gold' : 'border-neutral-200'}`}>
            <img src={u} alt="thumb" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}


