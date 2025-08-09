"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchTypeahead } from '@/components/ui/SearchTypeahead';
import { LoyaltyBar } from '@/components/ui/LoyaltyBar';
import { MobileDrawer } from '@/components/ui/MobileDrawer';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/en/categories/skincare', label: 'Shop' },
  { href: '/en/blog', label: 'Blog' },
  { href: '/en/pro', label: 'Pro' },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/" className="font-heading text-xl">Tejo-Beauty</Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => {
            const active = pathname === n.href || pathname?.startsWith(n.href + '/');
            return (
              <Link key={n.href} href={n.href} className="relative py-2">
                <span className="hover:text-onyx">{n.label}</span>
                {active && <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-gold animate-glow" />}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <SearchTypeahead />
          <MobileDrawer items={nav} />
        </div>
      </div>
      <div className="border-t bg-cream/50">
        <div className="mx-auto max-w-7xl px-6 py-1">
          <LoyaltyBar />
        </div>
      </div>
    </header>
  );
}


