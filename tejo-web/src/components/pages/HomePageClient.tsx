"use client";

import Link from 'next/link';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';
import { 
  ScrollRevealContainer, 
  FadeInOnScroll, 
  ScaleInOnScroll, 
  StaggeredChildren 
} from '@/components/ui/scroll-reveal';
import { Spinner, LoadingOverlay } from '@/components/ui/loaders';
import { MovingBorder } from '@/components/ui/moving-border';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { motion } from 'framer-motion';

interface HomePageClientProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    exploreButton: string;
    learnMoreButton: string;
    categoriesTitle: string;
    featuresTitle: string;
    statsTitle: string;
    statsDescription: string;
  };
}

export function HomePageClient({ translations }: HomePageClientProps) {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream to-blush py-20 overflow-hidden">
        <BackgroundGradient className="absolute inset-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollRevealContainer className="text-center">
            <motion.h1 
              className="font-heading text-5xl md:text-6xl font-bold text-onyx mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {translations.heroTitle}
              <br />
              <span className="text-gold">{translations.heroSubtitle}</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {translations.heroDescription}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <MovingBorder className="rounded-xl">
                <Link
                  href="/categories"
                  className="inline-flex items-center px-8 py-4 bg-onyx text-white rounded-xl font-medium hover:bg-onyx/90 transition-all duration-300 hover:scale-105"
                >
                  {translations.exploreButton}
                </Link>
              </MovingBorder>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-onyx text-onyx rounded-xl font-medium hover:bg-onyx hover:text-white transition-all duration-300 hover:scale-105"
              >
                {translations.learnMoreButton}
              </Link>
            </motion.div>
          </ScrollRevealContainer>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-onyx">
              {translations.categoriesTitle}
            </h2>
          </FadeInOnScroll>
          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: '/categories/face', title: 'Lice', description: 'Nega lica', icon: '✨' },
              { href: '/categories/body', title: 'Tijelo', description: 'Nega tijela', icon: '🧴' },
              { href: '/categories/hair', title: 'Kosa', description: 'Nega kose', icon: '💇‍♀️' },
              { href: '/categories/wellness', title: 'Wellness', description: 'Dobrobit', icon: '🧘‍♀️' },
            ].map((category, index) => (
              <motion.div
                key={category.href}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-gold hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-onyx mb-2 group-hover:text-gold transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <NewsletterSignup />
          </FadeInOnScroll>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-onyx">
              {translations.featuresTitle}
            </h2>
          </FadeInOnScroll>
          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: '100% Prirodno',
                description: 'Svi naši proizvodi su napravljeni od prirodnih sastojaka bez štetnih kemikalija.',
              },
              {
                icon: '🚚',
                title: 'Besplatna dostava',
                description: 'Besplatna dostava za sve narudžbe iznad 50€ u cijeloj Hrvatskoj.',
              },
              {
                icon: '💎',
                title: 'Premium kvaliteta',
                description: 'Proizvodi najviše kvalitete koji su testirani i odobreni od stručnjaka.',
              },
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-heading text-xl font-semibold text-onyx mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* New Interactive Section */}
      <section className="py-16 bg-gradient-to-r from-gold/10 to-cream/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScaleInOnScroll className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-onyx mb-4">
              {translations.statsTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {translations.statsDescription}
            </p>
          </ScaleInOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: '10K+', label: 'Zadovoljnih kupaca' },
              { number: '500+', label: 'Prirodnih proizvoda' },
              { number: '50+', label: 'Gradova dostave' },
              { number: '24/7', label: 'Korisnička podrška' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-gold mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}