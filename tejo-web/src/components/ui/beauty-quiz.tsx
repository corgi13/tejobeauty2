"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovingBorder } from './moving-border';
import { BackgroundGradient } from './background-gradient';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    icon: string;
    value: string;
  }[];
}

interface QuizResult {
  skinType: string;
  concerns: string[];
  recommendations: string[];
  products: string[];
}

const questions: Question[] = [
  {
    id: 'skin-type',
    text: 'Kakva je vaša vrsta kože?',
    options: [
      { id: 'dry', text: 'Suha koža', icon: '🌵', value: 'dry' },
      { id: 'oily', text: 'Masna koža', icon: '💧', value: 'oily' },
      { id: 'combination', text: 'Mješovita koža', icon: '⚖️', value: 'combination' },
      { id: 'normal', text: 'Normalna koža', icon: '✨', value: 'normal' },
      { id: 'sensitive', text: 'Osjetljiva koža', icon: '🌸', value: 'sensitive' }
    ]
  },
  {
    id: 'concerns',
    text: 'Koje probleme s kožom želite riješiti?',
    options: [
      { id: 'acne', text: 'Akne i bubuljice', icon: '🔴', value: 'acne' },
      { id: 'aging', text: 'Bore i starenje', icon: '⏰', value: 'aging' },
      { id: 'pigmentation', text: 'Pigmentaciju', icon: '🌞', value: 'pigmentation' },
      { id: 'dryness', text: 'Suhoću', icon: '🏜️', value: 'dryness' },
      { id: 'redness', text: 'Crvenilo', icon: '🌹', value: 'redness' }
    ]
  },
  {
    id: 'lifestyle',
    text: 'Kako opisujete svoj životni stil?',
    options: [
      { id: 'active', text: 'Aktivan i sportski', icon: '🏃‍♀️', value: 'active' },
      { id: 'busy', text: 'Zauzet i u žurbi', icon: '⏱️', value: 'busy' },
      { id: 'relaxed', text: 'Opušten i opušten', icon: '🧘‍♀️', value: 'relaxed' },
      { id: 'outdoor', text: 'Vanjske aktivnosti', icon: '🌲', value: 'outdoor' },
      { id: 'indoor', text: 'Unutarnje aktivnosti', icon: '🏠', value: 'indoor' }
    ]
  },
  {
    id: 'budget',
    text: 'Koji je vaš proračun za njegu kože?',
    options: [
      { id: 'budget', text: 'Povoljno (do 50€)', icon: '💰', value: 'budget' },
      { id: 'mid', text: 'Srednje (50-150€)', icon: '💎', value: 'mid' },
      { id: 'premium', text: 'Premium (150€+)', icon: '👑', value: 'premium' }
    ]
  }
];

const getQuizResults = (answers: Record<string, string>): QuizResult => {
  const skinType = answers['skin-type'] || 'normal';
  const concerns = answers['concerns'] ? [answers['concerns']] : [];
  const lifestyle = answers['lifestyle'] || 'normal';
  const budget = answers['budget'] || 'mid';

  const recommendations: string[] = [];
  const products: string[] = [];

  // Skin type recommendations
  if (skinType === 'dry') {
    recommendations.push('Koristite hidratantne kreme bogate ceramidima');
    products.push('Hidratantna krema s ceramidima');
  } else if (skinType === 'oily') {
    recommendations.push('Koristite gelove i lagane teksture');
    products.push('Gel za čišćenje');
  } else if (skinType === 'sensitive') {
    recommendations.push('Izbjegavajte parfeme i alkohol');
    products.push('Krema za osjetljivu kožu');
  }

  // Concern-based recommendations
  if (concerns.includes('acne')) {
    recommendations.push('Koristite proizvode s salicilnom kiselinom');
    products.push('Serum s salicilnom kiselinom');
  }
  if (concerns.includes('aging')) {
    recommendations.push('Koristite retinol i antioksidanse');
    products.push('Retinol serum');
  }

  return {
    skinType,
    concerns,
    recommendations,
    products
  };
};

export const BeautyQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setSelectedOption(value);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }, 800);
  }, [currentQuestion]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedOption(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const results = getQuizResults(answers);
    
    return (
      <motion.div
        className="max-w-4xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackgroundGradient className="absolute inset-0" />
        <div className="relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-4xl font-bold text-onyx mb-4">
              🎉 Vaš personalizirani plan njegovanja!
            </h2>
            <p className="text-xl text-gray-600">
              Evo što smo otkrili o vašoj koži i kako je najbolje njegovati
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Results Summary */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-heading text-2xl font-semibold text-onyx mb-4">
                📊 Vaš profil
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-lg mr-3">🫂</span>
                  <span className="text-gray-700">Vrsta kože: <strong className="text-gold">{results.skinType}</strong></span>
                </div>
                {results.concerns.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🎯</span>
                    <span className="text-gray-700">Glavni problem: <strong className="text-gold">{results.concerns[0]}</strong></span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-heading text-2xl font-semibold text-onyx mb-4">
                💡 Preporuke
              </h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-gray-700">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Product Recommendations */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-gold/10 to-pink-500/10 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="font-heading text-2xl font-semibold text-onyx mb-4 text-center">
              🛍️ Preporučeni proizvodi
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {results.products.map((product, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-4 text-center shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2">✨</div>
                  <p className="font-medium text-onyx">{product}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <MovingBorder className="rounded-xl">
              <button
                onClick={resetQuiz}
                className="px-8 py-3 bg-onyx text-white rounded-xl font-medium hover:bg-onyx/90 transition-all duration-300"
              >
                Učini ponovno
              </button>
            </MovingBorder>
            <button
              onClick={() => window.location.href = '/products'}
              className="px-8 py-3 border-2 border-gold text-gold rounded-xl font-medium hover:bg-gold hover:text-white transition-all duration-300"
            >
              Istraži proizvode
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <BackgroundGradient className="absolute inset-0" />
      <div className="relative z-10">
        {/* Progress Bar */}
        <motion.div
          className="w-full bg-gray-200 rounded-full h-2 mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-r from-gold to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Question */}
        <motion.div
          key={question.id}
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold text-onyx mb-4">
            {question.text}
          </h2>
          <p className="text-gray-600">
            Pitanje {currentQuestion + 1} od {questions.length}
          </p>
        </motion.div>

        {/* Options */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {question.options.map((option, index) => (
              <motion.div
                key={option.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedOption === option.value ? 'scale-105' : 'hover:scale-102'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleAnswer(question.id, option.value)}
              >
                <MovingBorder className="rounded-xl">
                  <div className={`
                    p-6 bg-white rounded-xl border-2 transition-all duration-300
                    ${selectedOption === option.value 
                      ? 'border-gold bg-gold/5 shadow-lg' 
                      : 'border-gray-200 hover:border-gold/50'
                    }
                  `}>
                    <div className="flex items-center space-x-4">
                      <motion.span
                        className="text-3xl"
                        animate={selectedOption === option.value ? { rotate: 360 } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {option.icon}
                      </motion.span>
                      <span className="font-heading text-lg font-medium text-onyx">
                        {option.text}
                      </span>
                    </div>
                  </div>
                </MovingBorder>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};