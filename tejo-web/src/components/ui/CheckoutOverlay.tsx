"use client";
import { useState } from 'react';

export function CheckoutOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-sm">
      <div className="rounded-2xl border border-gold/40 bg-white/90 px-8 py-6 shadow-2xl">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-center text-neutral-700">Processing checkout, please wait…</p>
      </div>
    </div>
  );
}


