"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations('nav');

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
    { href: '/categories', label: t('shop'), icon: '🛍️', hasSubmenu: true },
    { href: '/about', label: t('about'), icon: 'ℹ️' },
    { href: '/pro', label: t('pro'), icon: '💼' },
    { href: '/blog', label: t('blog'), icon: '📝' },
  ];

  const submenuItems = [
    { href: '/categories/face', label: 'Nega lica', icon: '✨', color: 'from-pink-100 to-rose-100' },
    { href: '/categories/body', label: 'Nega tijela', icon: '🧴', color: 'from-blue-100 to-indigo-100' },
    { href: '/categories/hair', label: 'Nega kose', icon: '💇‍♀️', color: 'from-purple-100 to-violet-100' },
    { href: '/categories/wellness', label: 'Wellness', icon: '🧘‍♀️', color: 'from-green-100 to-emerald-100' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-cream-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg" />
                <div className="flex flex-col">
                  <span className="font-heading text-xl font-bold bg-gradient-to-r from-onyx-800 to-onyx-600 bg-clip-text text-transparent">
                    Tejo-Beauty
                  </span>
                  <span className="text-xs text-gold-600 font-medium -mt-1">Premium Beauty</span>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-onyx hover:bg-gray-100 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-2 px-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {item.hasSubmenu ? (
                      <div className="space-y-2">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-50 to-cream-50 rounded-xl border border-gold-100">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-semibold text-onyx">{item.label}</span>
                              </div>
                              <ChevronRightIcon className="h-5 w-5 text-gold-500" />
                            </div>
                            
                            {/* Submenu */}
                            <div className="ml-6 space-y-2">
                              {submenuItems.map((subItem, subIndex) => (
                                <motion.div
                                  key={subItem.href}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: (index * 0.1) + (subIndex * 0.05) }}
                                >
                                  <Link
                                    href={subItem.href}
                                    onClick={onClose}
                                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                                  >
                                    <div className={`w-10 h-10 bg-gradient-to-br ${subItem.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                                      {subItem.icon}
                                    </div>
                                    <span className="font-medium text-onyx group-hover:text-gold-600 transition-colors">
                                      {subItem.label}
                                    </span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <span className="font-semibold text-onyx group-hover:text-gold-600 transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 px-6">
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Brze akcije
                  </h3>
                  
                  <Link
                    href="/search"
                    onClick={onClose}
                    className="flex items-center justify-center space-x-2 w-full p-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all duration-300 group"
                  >
                    <span>🔍</span>
                    <span>Pretraživanje</span>
                  </Link>
                  
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex items-center justify-center space-x-2 w-full p-4 bg-gradient-to-r from-onyx-600 to-onyx-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-onyx-500/25 transition-all duration-300 group"
                  >
                    <span>🛒</span>
                    <span>Košarica</span>
                  </Link>
                </motion.div>
              </div>

              {/* Contact Info */}
              <motion.div
                className="mt-8 px-6 pt-6 border-t border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    💬
                  </div>
                  <h3 className="font-semibold text-onyx mb-2">Potrebna pomoć?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Naš tim je tu da vam pomogne
                  </p>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="inline-flex items-center space-x-2 text-gold-600 hover:text-gold-700 font-medium transition-colors"
                  >
                    <span>Kontaktirajte nas</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


