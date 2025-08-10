"use client";
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BackgroundGradient } from './background-gradient';

export function Footer() {
  const t = useTranslations('footer');

  const footerSections = [
    {
      title: 'Proizvodi',
      links: [
        { href: '/categories/face', label: 'Nega lica' },
        { href: '/categories/body', label: 'Nega tijela' },
        { href: '/categories/hair', label: 'Nega kose' },
        { href: '/categories/wellness', label: 'Wellness' },
        { href: '/categories', label: 'Sve kategorije' },
      ]
    },
    {
      title: 'Kompanija',
      links: [
        { href: '/about', label: 'O nama' },
        { href: '/blog', label: 'Blog' },
        { href: '/pro', label: 'Za profesionalce' },
        { href: '/contact', label: 'Kontakt' },
        { href: '/careers', label: 'Karijera' },
      ]
    },
    {
      title: 'Podrška',
      links: [
        { href: '/help', label: 'Pomoć' },
        { href: '/shipping', label: 'Dostava' },
        { href: '/returns', label: 'Povrat' },
        { href: '/faq', label: 'FAQ' },
        { href: '/size-guide', label: 'Vodič za veličine' },
      ]
    },
    {
      title: 'Pravno',
      links: [
        { href: '/privacy', label: 'Privatnost' },
        { href: '/terms', label: 'Uvjeti korištenja' },
        { href: '/cookies', label: 'Kolačići' },
        { href: '/gdpr', label: 'GDPR' },
        { href: '/accessibility', label: 'Pristupačnost' },
      ]
    }
  ];

  const socialLinks = [
    { href: '#', icon: '📘', label: 'Facebook' },
    { href: '#', icon: '📷', label: 'Instagram' },
    { href: '#', icon: '🐦', label: 'Twitter' },
    { href: '#', icon: '💼', label: 'LinkedIn' },
    { href: '#', icon: '📺', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-onyx-900 via-onyx-800 to-onyx-900 text-white overflow-hidden">
      <BackgroundGradient variant="gradient" size="xl" className="absolute inset-0 opacity-20" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-gold-400/20 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-cream-400/20 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg" />
                <div className="flex flex-col">
                  <span className="font-heading text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    Tejo-Beauty
                  </span>
                  <span className="text-sm text-gold-300 font-medium">Premium Beauty</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Vaš pouzdani partner za premium prirodne proizvode za negu. 
                Posvećeni smo vašoj ljepoti i dobrobiti kroz najkvalitetnije 
                sastojke i inovativne formule.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg hover:bg-gold-500 hover:scale-110 transition-all duration-300 border border-white/20"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-lg text-white mb-4 relative">
                  {section.title}
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></div>
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-gold-300 transition-colors duration-300 group flex items-center"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section */}
          <motion.div
            className="mt-16 pt-12 border-t border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="font-heading text-3xl font-bold text-white mb-4">
                Ostanite u toku
              </h3>
              <p className="text-gray-300 mb-6">
                Prijavite se na newsletter za ekskluzivne ponude i najnovije vijesti
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Vaš email"
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                />
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Prijavi se
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/20 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>&copy; 2024 Tejo-Beauty. Sva prava pridržana.</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Made with ❤️ in Croatia</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-gold-300 transition-colors">
                  Privatnost
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-gold-300 transition-colors">
                  Uvjeti
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-gold-300 transition-colors">
                  Kolačići
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}