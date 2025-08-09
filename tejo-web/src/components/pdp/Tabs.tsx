"use client";
import { useState } from 'react';

export function PdpTabs({ description, howToUse, ingredients }: { description?: string; howToUse?: string; ingredients?: string }) {
  const tabs = [
    { key: 'desc', label: 'Opis', content: description || '' },
    { key: 'how', label: 'Kako koristiti', content: howToUse || '' },
    { key: 'ing', label: 'Sastojci', content: ingredients || '' },
    { key: 'rev', label: 'Recenzije', content: 'Recenzije uskoro.' },
  ];
  const [active, setActive] = useState('desc');
  const current = tabs.find(t => t.key === active)!;
  return (
    <div className="mt-8">
      <div className="flex gap-3 border-b">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActive(t.key)} className={`px-3 py-2 ${t.key===active?'border-b-2 border-onyx font-medium':''}`}>{t.label}</button>
        ))}
      </div>
      <div className="prose mt-4 whitespace-pre-line">
        {current.content}
      </div>
    </div>
  );
}