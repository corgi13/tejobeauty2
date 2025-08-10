"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
  isPopular?: boolean;
}

interface FloatingShowcaseProps {
  products: Product[];
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export const FloatingShowcase: React.FC<FloatingShowcaseProps> = ({
  products,
  className = '',
  autoRotate = true,
  rotationSpeed = 0.5
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

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

  const getProductPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 200;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(index * 0.5) * 50;
    
    return { x, y, z };
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        ★
      </motion.span>
    ));
  };

  return (
    <div className={`relative w-full h-[600px] perspective-1000 ${className}`} ref={containerRef}>
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
        }}
        animate={autoRotate ? { rotateY: 360 } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {products.map((product, index) => {
          const position = getProductPosition(index, products.length);
          const isHovered = hoveredProduct === product.id;
          const isSelected = selectedProduct === product.id;
          
          return (
            <motion.div
              key={product.id}
              className="absolute left-1/2 top-1/2 w-48 h-64 preserve-3d"
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
                transformStyle: 'preserve-3d',
              }}
              whileHover={{ 
                scale: 1.1,
                z: position.z + 50,
                transition: { duration: 0.3 }
              }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              onClick={() => setSelectedProduct(isSelected ? null : product.id)}
            >
              <motion.div
                className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
                style={{
                  transform: `rotateY(${index * (360 / products.length)}deg)`,
                  backfaceVisibility: 'hidden',
                }}
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Product Image */}
                <div className="relative h-32 bg-gradient-to-br from-cream to-blush">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-pink-500/20" />
                  {product.isNew && (
                    <motion.div
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      NOVO
                    </motion.div>
                  )}
                  {product.isPopular && (
                    <motion.div
                      className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      POPULARNO
                    </motion.div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {product.image}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <motion.h3 
                    className="font-heading text-lg font-semibold text-onyx mb-2 truncate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {product.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-sm text-gray-600 mb-3 line-clamp-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.description}
                  </motion.p>

                  {/* Rating */}
                  <motion.div 
                    className="flex items-center mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-500 ml-2">({product.rating})</span>
                  </motion.div>

                  {/* Price and Category */}
                  <div className="flex items-center justify-between">
                    <motion.span 
                      className="font-heading text-xl font-bold text-gold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {product.price}
                    </motion.span>
                    <motion.span 
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {product.category}
                    </motion.span>
                  </div>
                </div>

                {/* Hover Overlay */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      className="bg-gold text-white px-6 py-2 rounded-full font-medium hover:bg-gold/90 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Dodaj u košaricu
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center Info */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-32 h-32 bg-gradient-to-br from-gold/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-4xl">✨</span>
        </motion.div>
        <motion.p 
          className="mt-4 text-white font-heading text-lg font-semibold drop-shadow-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Istraži proizvode
        </motion.p>
      </motion.div>
    </div>
  );
};