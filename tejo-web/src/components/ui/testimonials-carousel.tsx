"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MovingBorder } from './moving-border';
import { BackgroundGradient } from './background-gradient';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  product: string;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana Marić',
    role: 'Kozmetičarka',
    avatar: '👩‍💼',
    rating: 5,
    content: 'Tejo-Beauty proizvodi su revolucionirali moju rutinu njegovanja kože. Kosa mi je nikad bolja, a koža sjaji prirodnim sjajem!',
    product: 'Serum za lice',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    name: 'Petra Novak',
    role: 'Studentica',
    avatar: '👩‍🎓',
    rating: 5,
    content: 'Konačno sam pronašla proizvode koji stvarno rade! Moja osjetljiva koža je postala puno zdravija i sjajnija.',
    product: 'Krema za osjetljivu kožu',
    date: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    name: 'Maja Kovač',
    role: 'Mama od 2',
    avatar: '👩‍👧‍👦',
    rating: 5,
    content: 'Kao mama, nemam puno vremena za komplicirane rutine. Tejo-Beauty proizvodi su jednostavni, učinkoviti i brzo se apsorbiraju!',
    product: 'Hidratantna krema',
    date: '2024-01-08',
    verified: true
  },
  {
    id: '4',
    name: 'Ivana Horvat',
    role: 'Fitness trenerica',
    avatar: '🏃‍♀️',
    rating: 5,
    content: 'Nakon treninga, moja koža je uvijek osvježena i hidratirana. Volim što su svi proizvodi prirodni i bez štetnih kemikalija.',
    product: 'Gel za čišćenje',
    date: '2024-01-05',
    verified: true
  },
  {
    id: '5',
    name: 'Sara Đurić',
    role: 'Blogerica',
    avatar: '📱',
    rating: 5,
    content: 'Kao blogerica o ljepoti, testiram puno proizvoda. Tejo-Beauty je definitivno u top 3! Kvaliteta je izvanredna.',
    product: 'Retinol serum',
    date: '2024-01-03',
    verified: true
  }
];

interface TestimonialsCarouselProps {
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  className = '',
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
      >
        ★
      </motion.span>
    ));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`} ref={containerRef}>
      <BackgroundGradient className="absolute inset-0" />
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-4xl font-bold text-onyx mb-4">
            💬 Što kažu naši kupci
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Otkrijte zašto tisuće zadovoljnih kupaca odabire Tejo-Beauty proizvode
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative h-[500px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              className="absolute inset-0 flex items-center justify-center"
              custom={direction}
              initial={{ 
                opacity: 0,
                x: direction > 0 ? 300 : -300,
                scale: 0.8,
                rotateY: direction > 0 ? 45 : -45
              }}
              animate={{ 
                opacity: 1,
                x: 0,
                scale: 1,
                rotateY: 0
              }}
              exit={{ 
                opacity: 0,
                x: direction > 0 ? -300 : 300,
                scale: 0.8,
                rotateY: direction > 0 ? -45 : 45
              }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              <MovingBorder className="rounded-3xl">
                <motion.div
                  className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto"
                  style={{
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Avatar and Rating */}
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-gold to-pink-500 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      {currentTestimonial.avatar}
                    </motion.div>
                    
                    <motion.div
                      className="flex justify-center mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {renderStars(currentTestimonial.rating)}
                    </motion.div>
                    
                    <motion.div
                      className="flex items-center justify-center space-x-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {currentTestimonial.verified && (
                        <span className="text-blue-500 text-sm">✓ Verificiran kupac</span>
                      )}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <motion.blockquote
                    className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    &ldquo;{currentTestimonial.content}&rdquo;
                  </motion.blockquote>

                  {/* Author Info */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h4 className="font-heading text-xl font-semibold text-onyx mb-1">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-gray-600 mb-2">{currentTestimonial.role}</p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span>📦 {currentTestimonial.product}</span>
                      <span>📅 {new Date(currentTestimonial.date).toLocaleDateString('hr-HR')}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </MovingBorder>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {showArrows && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-onyx hover:bg-white transition-all duration-300 z-20"
              onClick={goToPrevious}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ←
            </motion.button>
            
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-onyx hover:bg-white transition-all duration-300 z-20"
              onClick={goToNext}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              →
            </motion.button>
          </>
        )}

        {/* Dots Navigation */}
        {showDots && (
          <motion.div
            className="flex justify-center space-x-2 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gold scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => goToIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        )}

        {/* Auto-play Toggle */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAutoPlaying
                ? 'bg-gold text-white hover:bg-gold/90'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isAutoPlaying ? '⏸️ Pauziraj' : '▶️ Nastavi'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};