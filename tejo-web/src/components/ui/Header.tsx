"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { SearchTypeahead } from './SearchTypeahead';
import { MobileDrawer } from './MobileDrawer';
import { MovingBorder } from './moving-border';
import { motion, AnimatePresence } from 'framer-motion';

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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 5 }}
              />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold bg-gradient-to-r from-onyx-800 to-onyx-600 bg-clip-text text-transparent">
                  Tejo-Beauty
                </span>
                <span className="text-xs text-gold-600 font-medium -mt-1">Premium Beauty</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div 
                key={item.href} 
                className="relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  href={item.href}
                  className="relative px-4 py-3 text-sm font-medium text-onyx transition-all duration-300 hover:text-gold-600 rounded-xl group-hover:bg-gold-50"
                >
                  {item.label}
                  <motion.div 
                    className="absolute inset-0 rounded-xl bg-gold-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={false}
                  />
                </Link>
                
                {/* Mega Menu for Shop */}
                {item.hasMegaMenu && (
                  <motion.div 
                    className="absolute top-full left-0 w-[500px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    initial={false}
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading text-xl font-semibold text-onyx">Kategorije proizvoda</h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { href: '/categories/face', title: 'Lice', description: 'Nega lica', icon: '✨', color: 'from-pink-100 to-rose-100' },
                          { href: '/categories/body', title: 'Tijelo', description: 'Nega tijela', icon: '🧴', color: 'from-blue-100 to-indigo-100' },
                          { href: '/categories/hair', title: 'Kosa', description: 'Nega kose', icon: '💇‍♀️', color: 'from-purple-100 to-violet-100' },
                          { href: '/categories/wellness', title: 'Wellness', description: 'Dobrobit', icon: '🧘‍♀️', color: 'from-green-100 to-emerald-100' },
                        ].map((category, catIndex) => (
                          <motion.div
                            key={category.href}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                          >
                            <Link 
                              href={category.href} 
                              className="group/item flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                            >
                              <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform duration-300`}>
                                {category.icon}
                              </div>
                              <div>
                                <div className="font-semibold text-onyx group-hover/item:text-gold-600 transition-colors">
                                  {category.title}
                                </div>
                                <div className="text-sm text-gray-500">{category.description}</div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <Link 
                          href="/categories" 
                          className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium transition-colors"
                        >
                          Pogledaj sve kategorije
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchTypeahead />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link href="/wishlist" className="relative p-3 text-onyx hover:text-gold-600 transition-all duration-300 hover:bg-gold-50 rounded-xl group">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Cart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Link href="/cart" className="relative p-3 text-onyx hover:text-gold-600 transition-all duration-300 hover:bg-gold-50 rounded-xl group">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 text-onyx hover:text-gold-600 hover:bg-gold-50 transition-all duration-300 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
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
