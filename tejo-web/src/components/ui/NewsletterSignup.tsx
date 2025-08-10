"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MovingBorder } from './moving-border';
import { BackgroundGradient } from './background-gradient';
import { AnimatePresence } from 'framer-motion';

export function NewsletterSignup() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
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
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-cream-200/30 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-blush-200/20 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gold-200 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-600 text-sm font-medium">✨ Ekskluzivne ponude</span>
          </motion.div>
          
          <motion.h2
            className="font-heading text-5xl md:text-6xl font-bold text-onyx mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="block">Ostanite u toku</span>
            <span className="block bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 bg-clip-text text-transparent">
              sa najnovijim trendovima
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Prijavite se na naš newsletter i budite prvi koji će saznati o novim proizvodima, 
            ekskluzivnim ponudama i savjetima za negu.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <MovingBorder
            rx={24}
            ry={24}
            duration={2000}
            className="p-[2px] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-[1.4rem] p-8 shadow-2xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-onyx mb-2">
                      Email adresa
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vasa@email.com"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-gold-400 focus:ring-4 focus:ring-gold-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-gold-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Prijavljivanje...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Prijavi se</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                </div>
                
                <motion.p
                  className="text-sm text-gray-500 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Možete se odjaviti u bilo kojem trenutku. Vaši podaci su sigurni.
                </motion.p>
              </form>
            </div>
          </MovingBorder>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-xl rounded-[1.4rem]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-onyx mb-2">Uspješno!</h3>
                <p className="text-gray-600">Hvala vam na prijavi na newsletter!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: "🎁",
              title: "Ekskluzivne ponude",
              description: "Prvi pristup sniženjima i posebnim akcijama"
            },
            {
              icon: "✨",
              title: "Najnoviji trendovi",
              description: "Informacije o najnovijim proizvodima i trendovima"
            },
            {
              icon: "💡",
              title: "Savjeti stručnjaka",
              description: "Korisni savjeti za negu i korištenje proizvoda"
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 5 }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="font-semibold text-onyx mb-2 text-lg">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
