"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { SearchTypeahead } from './SearchTypeahead';
import { MobileDrawer } from './MobileDrawer';
import { MovingBorder } from './MovingBorder';

export function Header() {
  const t = useTranslations('nav');
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlistItems.length;

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/categories', label: t('shop'), hasMegaMenu: true },
    { href: '/about', label: t('about') },
    { href: '/pro', label: t('pro') },
    { href: '/blog', label: t('blog') },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-cream"></div>
            <span className="font-heading text-xl font-bold text-onyx">Tejo-Beauty</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link 
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-onyx transition-colors hover:text-gold"
                >
                  {item.label}
                  <div className="absolute inset-0 rounded-lg bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
                
                {/* Mega Menu for Shop */}
                {item.hasMegaMenu && (
                  <div className="absolute top-full left-0 w-96 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-6">
                      <h3 className="font-heading text-lg font-semibold text-onyx mb-4">Kategorije</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Link href="/categories/face" className="group/item flex items-center space-x-3 p-3 rounded-lg hover:bg-cream/50 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blush to-gold"></div>
                          <div>
                            <div className="font-medium text-onyx group-hover/item:text-gold transition-colors">Lice</div>
                            <div className="text-xs text-gray-500">Nega lica</div>
                          </div>
                        </Link>
                        <Link href="/categories/body" className="group/item flex items-center space-x-3 p-3 rounded-lg hover:bg-cream/50 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cream to-blush"></div>
                          <div>
                            <div className="font-medium text-onyx group-hover/item:text-gold transition-colors">Tijelo</div>
                            <div className="text-xs text-gray-500">Nega tijela</div>
                          </div>
                        </Link>
                        <Link href="/categories/hair" className="group/item flex items-center space-x-3 p-3 rounded-lg hover:bg-cream/50 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-cream"></div>
                          <div>
                            <div className="font-medium text-onyx group-hover/item:text-gold transition-colors">Kosa</div>
                            <div className="text-xs text-gray-500">Nega kose</div>
                          </div>
                        </Link>
                        <Link href="/categories/wellness" className="group/item flex items-center space-x-3 p-3 rounded-lg hover:bg-cream/50 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blush to-cream"></div>
                          <div>
                            <div className="font-medium text-onyx group-hover/item:text-gold transition-colors">Wellness</div>
                            <div className="text-xs text-gray-500">Dobrobit</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchTypeahead />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-onyx hover:text-gold transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-onyx hover:text-gold transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-onyx hover:text-gold transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchTypeahead />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
