"use client";
import clsx from 'clsx';

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-sm text-neutral-700">{label}</div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className={clsx('h-full bg-gold transition-[width] duration-700')}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}


