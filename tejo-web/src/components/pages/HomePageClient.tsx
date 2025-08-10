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
    <main className="overflow-hidden">
      {/* Hero Section - Luxury Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-cream-50 via-white to-blush-50 overflow-hidden">
        <BackgroundGradient variant="gold" size="xl" className="absolute inset-0" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-gold-200/30 to-transparent rounded-full blur-3xl"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blush-200/30 to-transparent rounded-full blur-3xl"
            animate={{ 
              y: [0, 30, 0],
              scale: [1, 0.9, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-cream-300/30 to-transparent rounded-full blur-3xl"
            animate={{ 
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex items-center">
          <ScrollRevealContainer className="text-center w-full">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gold-200 mb-6">
                <span className="text-gold-600 text-sm font-medium">✨ Premium prirodni proizvodi</span>
              </div>
            </motion.div>

            <motion.h1 
              className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-onyx mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="block">{translations.heroTitle}</span>
              <span className="block bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 bg-clip-text text-transparent">
                {translations.heroSubtitle}
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {translations.heroDescription}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <MovingBorder className="rounded-2xl">
                <Link
                  href="/categories"
                  className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-2xl font-semibold text-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-gold-500/25"
                >
                  {translations.exploreButton}
                  <motion.svg 
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </Link>
              </MovingBorder>

              <Link
                href="/about"
                className="group inline-flex items-center px-10 py-5 border-2 border-onyx text-onyx rounded-2xl font-semibold text-lg hover:bg-onyx hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {translations.learnMoreButton}
                <motion.svg 
                  className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Prirodno</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Certificirano</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Bez testiranja na životinjama</span>
              </div>
            </motion.div>
          </ScrollRevealContainer>
        </div>
      </section>

      {/* Categories Grid - Enhanced Design */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50/50 to-transparent"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="text-center mb-16">
            <h2 className="font-heading text-5xl font-bold text-onyx mb-6">
              {translations.categoriesTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Otkrijte naše premium kolekcije proizvoda za svaki dio vašeg tijela
            </p>
          </FadeInOnScroll>

          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                href: '/categories/face', 
                title: 'Lice', 
                description: 'Premium proizvodi za njegu lica', 
                icon: '✨',
                gradient: 'from-pink-100 to-rose-100',
                borderColor: 'border-pink-200',
                hoverColor: 'hover:border-pink-400'
              },
              { 
                href: '/categories/body', 
                title: 'Tijelo', 
                description: 'Nježna njega za vaše tijelo', 
                icon: '🧴',
                gradient: 'from-blue-100 to-indigo-100',
                borderColor: 'border-blue-200',
                hoverColor: 'hover:border-blue-400'
              },
              { 
                href: '/categories/hair', 
                title: 'Kosa', 
                description: 'Ljepota i zdravlje vaše kose', 
                icon: '💇‍♀️',
                gradient: 'from-purple-100 to-violet-100',
                borderColor: 'border-purple-200',
                hoverColor: 'hover:border-purple-400'
              },
              { 
                href: '/categories/wellness', 
                title: 'Wellness', 
                description: 'Dobrobit za um i tijelo', 
                icon: '🧘‍♀️',
                gradient: 'from-green-100 to-emerald-100',
                borderColor: 'border-green-200',
                hoverColor: 'hover:border-green-400'
              },
            ].map((category, index) => (
              <motion.div
                key={category.href}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group block p-8 bg-white rounded-3xl border-2 ${category.borderColor} ${category.hoverColor} hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-6xl mb-6 flex justify-center"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.div>
                  
                  <h3 className="font-heading text-2xl font-bold text-onyx mb-3 group-hover:text-onyx transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors">
                      Istraži proizvode
                    </span>
                    <motion.svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* Features Section - Luxury Presentation */}
      <section className="py-24 bg-gradient-to-br from-onyx-900 via-onyx-800 to-onyx-900 relative overflow-hidden">
        <BackgroundGradient variant="gold" size="lg" className="absolute inset-0 opacity-20" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="text-center mb-20">
            <h2 className="font-heading text-5xl font-bold text-white mb-6">
              {translations.featuresTitle}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Doživite razliku s našim premium prirodnim proizvodima
            </p>
          </FadeInOnScroll>

          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '🌿',
                title: '100% Prirodno',
                description: 'Svi naši proizvodi su napravljeni od prirodnih sastojaka bez štetnih kemikalija, parabena i sulfata.',
                features: ['Certificirano', 'Vegansko', 'Bez parfema']
              },
              {
                icon: '🚚',
                title: 'Premium dostava',
                description: 'Besplatna premium dostava za sve narudžbe iznad 50€ u cijeloj Hrvatskoj s brzim isporukom.',
                features: ['Besplatno', 'Brzo', 'Sigurno']
              },
              {
                icon: '💎',
                title: 'Luxury kvaliteta',
                description: 'Proizvodi najviše kvalitete koji su testirani i odobreni od stručnjaka za dermatologiju.',
                features: ['Testirano', 'Odobreno', 'Premium']
              },
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-3xl flex items-center justify-center text-4xl mb-8 mx-auto shadow-2xl group-hover:shadow-gold-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="font-heading text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {feature.features.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-sm font-medium border border-gold-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* Stats Section - Interactive */}
      <section className="py-24 bg-gradient-to-r from-cream-50 via-white to-blush-50 relative overflow-hidden">
        <BackgroundGradient variant="mesh" size="xl" className="absolute inset-0 opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScaleInOnScroll className="text-center mb-20">
            <h2 className="font-heading text-5xl font-bold text-onyx mb-6">
              {translations.statsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translations.statsDescription}
            </p>
          </ScaleInOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Zadovoljnih kupaca', icon: '😊', color: 'from-green-400 to-emerald-500' },
              { number: '500+', label: 'Prirodnih proizvoda', icon: '🌱', color: 'from-blue-400 to-cyan-500' },
              { number: '50+', label: 'Gradova dostave', icon: '🏙️', color: 'from-purple-400 to-violet-500' },
              { number: '24/7', label: 'Korisnička podrška', icon: '💬', color: 'from-pink-400 to-rose-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold text-onyx mb-3"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-onyx-900 to-onyx-800 relative overflow-hidden">
        <BackgroundGradient variant="gold" size="lg" className="absolute inset-0 opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeInOnScroll>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Ostanite u toku s najnovijim trendovima
              </h2>
              <p className="text-xl text-gray-300">
                Prijavite se na newsletter i dobijte ekskluzivne ponude i savjete za njegu
              </p>
            </motion.div>
            
            <NewsletterSignup />
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}