"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MovingBorder } from './moving-border';
import { BackgroundGradient } from './background-gradient';

interface ProductSpec {
  name: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  specifications: ProductSpec[];
  isNew?: boolean;
  isPopular?: boolean;
  discount?: number;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Hidratantna krema s ceramidima',
    brand: 'Tejo-Beauty',
    price: '45.99€',
    originalPrice: '59.99€',
    image: '🧴',
    rating: 4.8,
    reviewCount: 1247,
    description: 'Intenzivno hidratantna krema s ceramidima i hijaluronskom kiselinom za suhu i osjetljivu kožu.',
    benefits: ['Duboka hidratacija', 'Obnavlja barijeru kože', 'Bez parfema', 'Prirodni sastojci'],
    ingredients: ['Ceramidi', 'Hijaluronska kiselina', 'Aloe vera', 'Vitamini E i C'],
    specifications: [
      { name: 'Količina', value: '50', unit: 'ml' },
      { name: 'Tip kože', value: 'Suha, osjetljiva', highlight: true },
      { name: 'Tekstura', value: 'Krema' },
      { name: 'Aroma', value: 'Bez arome' },
      { name: 'SPF', value: 'Nema' },
      { name: 'Testirano na životinjama', value: 'Ne' }
    ],
    isNew: true,
    discount: 23
  },
  {
    id: '2',
    name: 'Retinol serum 0.5%',
    brand: 'Tejo-Beauty',
    price: '67.99€',
    originalPrice: '79.99€',
    image: '✨',
    rating: 4.9,
    reviewCount: 892,
    description: 'Napredni anti-aging serum s retinolom i peptidima za smanjenje bora i obnavljanje kože.',
    benefits: ['Smanjuje bore', 'Obnavlja kožu', 'Poboljšava teksturu', 'Anti-aging efekti'],
    ingredients: ['Retinol 0.5%', 'Peptidi', 'Niacinamid', 'Vitamini A i E'],
    specifications: [
      { name: 'Količina', value: '30', unit: 'ml' },
      { name: 'Tip kože', value: 'Sve vrste', highlight: true },
      { name: 'Tekstura', value: 'Serum' },
      { name: 'Aroma', value: 'Bez arome' },
      { name: 'SPF', value: 'Nema' },
      { name: 'Testirano na životinjama', value: 'Ne' }
    ],
    isPopular: true,
    discount: 15
  }
];

interface ProductComparisonProps {
  className?: string;
  products?: Product[];
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  className = '',
  products = sampleProducts
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([products[0]?.id, products[1]?.id]);
  const [flippedCards, setFlippedCards] = useState(new Set<string>());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } else if (selectedProducts.length < 2) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => [prev[1], productId]);
    }
  };

  const toggleCard = (productId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectedProductObjects = products.filter(p => selectedProducts.includes(p.id));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const renderSpecificationRow = (specs: ProductSpec[], index: number) => {
    return (
      <motion.tr
        key={index}
        className="border-b border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <td className="py-3 px-4 text-sm font-medium text-gray-700 bg-gray-50">
          {specs[0]?.name}
        </td>
        {selectedProductObjects.map((product, productIndex) => (
          <td key={product.id} className="py-3 px-4 text-center">
            <span className={`text-sm ${specs[productIndex]?.highlight ? 'font-semibold text-gold' : 'text-gray-600'}`}>
              {specs[productIndex]?.value}
              {specs[productIndex]?.unit && <span className="text-xs text-gray-400 ml-1">{specs[productIndex].unit}</span>}
            </span>
          </td>
        ))}
      </motion.tr>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`} ref={containerRef}>
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
            🔍 Usporedi proizvode
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pronađite savršen proizvod za vašu kožu uspoređujući detalje i karakteristike
          </p>
        </motion.div>

        {/* Product Selection */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-heading text-xl font-semibold text-onyx mb-4">
            Odaberite proizvode za usporedbu (maksimalno 2)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <motion.button
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedProducts.includes(product.id)
                    ? 'border-gold bg-gold/10 shadow-lg'
                    : 'border-gray-200 hover:border-gold/50 bg-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">{product.image}</div>
                <div className="text-sm font-medium text-onyx truncate">{product.name}</div>
                <div className="text-xs text-gray-500">{product.brand}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Comparison Cards */}
        {selectedProductObjects.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {selectedProductObjects.map((product, index) => (
              <motion.div
                key={product.id}
                className="relative"
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <MovingBorder className="rounded-2xl">
                  <motion.div
                    className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer"
                    style={{
                      rotateX: springRotateX,
                      rotateY: springRotateY,
                      transformStyle: 'preserve-3d',
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => toggleCard(product.id)}
                  >
                    {/* Product Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-cream to-blush rounded-full flex items-center justify-center text-4xl mb-4 mx-auto"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {product.image}
                      </motion.div>
                      
                      <h3 className="font-heading text-xl font-semibold text-onyx mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{product.brand}</p>
                      
                      {/* Rating */}
                      <div className="flex justify-center items-center space-x-2 mb-3">
                        {renderStars(product.rating)}
                        <span className="text-sm text-gray-500">({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                        <span className="font-heading text-2xl font-bold text-gold">
                          {product.price}
                        </span>
                        {product.discount && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            -{product.discount}%
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex justify-center space-x-2">
                        {product.isNew && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            NOVO
                          </span>
                        )}
                        {product.isPopular && (
                          <span className="bg-gold text-white text-xs px-2 py-1 rounded-full">
                            POPULARNO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flip Instruction */}
                    <div className="text-center text-sm text-gray-500">
                      Kliknite za više detalja
                    </div>
                  </motion.div>
                </MovingBorder>

                {/* Back of Card */}
                <AnimatePresence>
                  {flippedCards.has(product.id) && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-2xl p-6 shadow-xl"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="text-center mb-4">
                        <h4 className="font-heading text-lg font-semibold text-onyx mb-2">
                          Detalji proizvoda
                        </h4>
                        <button
                          onClick={() => toggleCard(product.id)}
                          className="text-sm text-gold hover:text-gold/80"
                        >
                          ← Povratak
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 text-center">
                        {product.description}
                      </p>

                      {/* Benefits */}
                      <div className="mb-4">
                        <h5 className="font-medium text-onyx mb-2">Prednosti:</h5>
                        <ul className="space-y-1">
                          {product.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <span className="text-gold mr-2">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <h5 className="font-medium text-onyx mb-2">Sastojci:</h5>
                        <div className="flex flex-wrap gap-1">
                          {product.ingredients.map((ingredient, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Specifications Table */}
        {selectedProductObjects.length === 2 && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-gold to-pink-500 p-6">
              <h3 className="font-heading text-2xl font-bold text-white text-center">
                📊 Detaljna usporedba
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-4 text-left font-semibold text-onyx">
                      Karakteristika
                    </th>
                    {selectedProductObjects.map((product) => (
                      <th key={product.id} className="py-4 px-4 text-center font-semibold text-onyx">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedProductObjects[0]?.specifications.map((_, index) =>
                    renderSpecificationRow(
                      selectedProductObjects.map(p => p.specifications[index]),
                      index
                    )
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {selectedProductObjects.length > 0 && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={() => setSelectedProducts([])}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
            >
              Očisti odabir
            </button>
            <button
              onClick={() => window.location.href = '/products'}
              className="px-6 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-all duration-300"
            >
              Istraži sve proizvode
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};