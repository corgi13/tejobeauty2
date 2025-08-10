"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations('nav');
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();

  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { href: '/', label: t('home'), icon: '🏠' },
    { href: '/categories', label: t('shop'), icon: '🛍️' },
    { href: '/about', label: t('about'), icon: 'ℹ️' },
    { href: '/pro', label: t('pro'), icon: '💼' },
    { href: '/blog', label: t('blog'), icon: '📝' },
  ];

  const categories = [
    { href: '/categories/face', label: 'Lice', icon: '✨' },
    { href: '/categories/body', label: 'Tijelo', icon: '🧴' },
    { href: '/categories/hair', label: 'Kosa', icon: '💇‍♀️' },
    { href: '/categories/wellness', label: 'Wellness', icon: '🧘‍♀️' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-cream"></div>
              <span className="font-heading text-xl font-bold text-onyx">Tejo-Beauty</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-onyx hover:text-gold transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Navigacija
                </h3>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg text-onyx hover:bg-cream/50 transition-colors"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Kategorije
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg text-onyx hover:bg-cream/50 transition-colors"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Brze akcije
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/wishlist"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg text-onyx hover:bg-cream/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">Lista želja</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg text-onyx hover:bg-cream/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <span className="font-medium">Košarica</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p>© 2024 Tejo-Beauty</p>
              <p className="mt-1">Prirodna ljepota</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


