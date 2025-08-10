"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Search, 
  Heart, 
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { MovingBorder } from "./moving-border";
import { BackgroundGradient } from "./background-gradient";

interface NavbarProps {
  className?: string;
  transparent?: boolean;
  sticky?: boolean;
}

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
  featured?: boolean;
  description?: string;
  image?: string;
}

const mainMenuItems: MenuItem[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      {
        label: "Skincare",
        href: "/category/skincare",
        description: "Professional skincare solutions",
        image: "/images/categories/skincare.jpg",
        featured: true,
      },
      {
        label: "Nails",
        href: "/category/nails",
        description: "UV/LED lamps, gels, and tools",
        image: "/images/categories/nails.jpg",
        featured: true,
      },
      {
        label: "Hair",
        href: "/category/hair",
        description: "Styling tools and treatments",
        image: "/images/categories/hair.jpg",
      },
      {
        label: "Spa & Wellness",
        href: "/category/spa-wellness",
        description: "Relaxation and rejuvenation",
        image: "/images/categories/spa.jpg",
      },
      {
        label: "Make-up & Tools",
        href: "/category/makeup",
        description: "Professional makeup and brushes",
        image: "/images/categories/makeup.jpg",
      },
      {
        label: "Beauty Tools",
        href: "/category/beauty-tools",
        description: "Advanced beauty devices",
        image: "/images/categories/tools.jpg",
        featured: true,
      },
      {
        label: "Hygiene & Protection",
        href: "/category/hygiene",
        description: "Safety and sanitation",
        image: "/images/categories/hygiene.jpg",
      },
      {
        label: "Gift Sets",
        href: "/category/gift-sets",
        description: "Curated beauty collections",
        image: "/images/categories/gifts.jpg",
      },
    ],
  },
  {
    label: "For Professionals",
    href: "/pro",
    children: [
      {
        label: "Salon Partnership",
        href: "/pro/salon",
        description: "Exclusive benefits for salons",
        image: "/images/pro/salon.jpg",
        featured: true,
      },
      {
        label: "Beauty Schools",
        href: "/pro/schools",
        description: "Educational partnerships",
        image: "/images/pro/schools.jpg",
      },
      {
        label: "Wholesale",
        href: "/pro/wholesale",
        description: "Bulk pricing and volume discounts",
        image: "/images/pro/wholesale.jpg",
      },
      {
        label: "Training",
        href: "/pro/training",
        description: "Product training and certification",
        image: "/images/pro/training.jpg",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "Our Story",
        href: "/about/story",
        description: "The journey of Tejo-Beauty",
        image: "/images/about/story.jpg",
      },
      {
        label: "Doroteja's Vision",
        href: "/about/doroteja",
        description: "Beauty as a divine gift",
        image: "/images/about/doroteja.jpg",
        featured: true,
      },
      {
        label: "Values & Mission",
        href: "/about/values",
        description: "What drives us forward",
        image: "/images/about/values.jpg",
      },
      {
        label: "Press & Media",
        href: "/about/press",
        description: "Media kit and resources",
        image: "/images/about/press.jpg",
      },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    children: [
      {
        label: "Beauty Tips",
        href: "/blog/tips",
        description: "Professional beauty advice",
        image: "/images/blog/tips.jpg",
      },
      {
        label: "Product Reviews",
        href: "/blog/reviews",
        description: "Honest product insights",
        image: "/images/blog/reviews.jpg",
      },
      {
        label: "Industry News",
        href: "/blog/news",
        description: "Latest beauty trends",
        image: "/images/blog/news.jpg",
      },
      {
        label: "Tutorials",
        href: "/blog/tutorials",
        description: "Step-by-step guides",
        image: "/images/blog/tutorials.jpg",
        featured: true,
      },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  className,
  transparent = false,
  sticky = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-onyx-900 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-400" />
              <span>+385 1 234 5678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-400" />
              <span>info@tejo-beauty.com</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        className={cn(
          "relative z-50 transition-all duration-300",
          sticky && "sticky top-0",
          transparent && !isScrolled
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md shadow-lg",
          className
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="text-2xl font-bold text-onyx-800">
                Tejo-Beauty
              </Link>
            </motion.div>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainMenuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 py-2 text-onyx-700 hover:text-gold-600 transition-colors duration-200 font-medium",
                      activeDropdown === item.label && "text-gold-600"
                    )}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Glow underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeDropdown === item.label ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />

                  {/* Megamenu */}
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      className="absolute top-full left-0 w-screen max-w-4xl bg-white border border-cream-200 rounded-lg shadow-xl p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      style={{ left: '50%', transform: 'translateX(-50%)' }}
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {item.children.slice(0, 4).map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="group block p-3 rounded-lg hover:bg-cream-50 transition-colors duration-200"
                            >
                              <div className="flex items-center gap-3">
                                {child.image && (
                                  <img
                                    src={child.image}
                                    alt={child.label}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-onyx-800 group-hover:text-gold-600 transition-colors">
                                    {child.label}
                                  </div>
                                  {child.description && (
                                    <div className="text-sm text-onyx-600">
                                      {child.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        
                        <div className="space-y-4">
                          {item.children.slice(4).map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="group block p-3 rounded-lg hover:bg-cream-50 transition-colors duration-200"
                            >
                              <div className="flex items-center gap-3">
                                {child.image && (
                                  <img
                                    src={child.image}
                                    alt={child.label}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-onyx-800 group-hover:text-gold-600 transition-colors">
                                    {child.label}
                                  </div>
                                  {child.description && (
                                    <div className="text-sm text-onyx-600">
                                      {child.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button className="p-2 text-onyx-600 hover:text-gold-600 hover:bg-cream-50 rounded-lg transition-colors duration-200">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button className="p-2 text-onyx-600 hover:text-gold-600 hover:bg-cream-50 rounded-lg transition-colors duration-200 relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Cart */}
              <MovingBorder className="rounded-lg">
                <button className="p-2 text-onyx-600 hover:text-gold-600 hover:bg-cream-50 rounded-lg transition-colors duration-200 relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </MovingBorder>

              {/* User account */}
              <button className="p-2 text-onyx-600 hover:text-gold-600 hover:bg-cream-50 rounded-lg transition-colors duration-200">
                <User className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-onyx-600 hover:text-gold-600 hover:bg-cream-50 rounded-lg transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-onyx-800">Menu</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-onyx-600 hover:text-gold-600 hover:bg-cream-50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {mainMenuItems.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        className="block py-3 text-onyx-700 hover:text-gold-600 transition-colors duration-200 font-medium"
                        onClick={toggleMobileMenu}
                      >
                        {item.label}
                      </Link>
                      
                      {item.children && (
                        <div className="ml-4 space-y-2 border-l border-cream-200 pl-4">
                          {item.children.slice(0, 3).map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2 text-sm text-onyx-600 hover:text-gold-600 transition-colors duration-200"
                              onClick={toggleMobileMenu}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-cream-200">
                  <div className="space-y-3">
                    <Link
                      href="/pro"
                      className="block py-2 text-onyx-700 hover:text-gold-600 transition-colors duration-200 font-medium"
                      onClick={toggleMobileMenu}
                    >
                      For Professionals
                    </Link>
                    <Link
                      href="/contact"
                      className="block py-2 text-onyx-700 hover:text-gold-600 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};