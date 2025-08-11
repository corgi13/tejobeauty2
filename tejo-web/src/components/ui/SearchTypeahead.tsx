"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, Tag, FileText } from 'lucide-react';


interface SearchResult {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  type: 'product' | 'category' | 'article';
}

export function SearchTypeahead() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Real search function using our API
  const searchProducts = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];
    
    try {
      // Search products
      const productsResponse = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const productsData = await productsResponse.json();
      
      // Search blog posts
      const blogResponse = await fetch(`/api/blog/search?q=${encodeURIComponent(searchQuery)}&limit=3`);
      const blogData = await blogResponse.json();
      
      // Search categories
      const categoriesResponse = await fetch(`/api/categories/search?q=${encodeURIComponent(searchQuery)}&limit=2`);
      const categoriesData = await categoriesResponse.json();
      
      const results: SearchResult[] = [];
      
      // Add products
      if (productsData.data) {
        productsData.data.forEach((product: any) => {
          results.push({
            id: product.id,
            title: product.name,
            category: product.category?.name || 'Proizvodi',
            price: product.price,
            image: product.imageUrl || '/api/placeholder/60/60',
            type: 'product'
          });
        });
      }
      
      // Add categories
      if (categoriesData.data) {
        categoriesData.data.forEach((category: any) => {
          results.push({
            id: category.id,
            title: category.name,
            category: 'Kategorija',
            price: 0,
            image: category.imageUrl || '/api/placeholder/60/60',
            type: 'category'
          });
        });
      }
      
      // Add blog posts
      if (blogData.data) {
        blogData.data.forEach((post: any) => {
          results.push({
            id: post.id,
            title: post.title,
            category: 'Blog',
            price: 0,
            image: post.imageUrl || '/api/placeholder/60/60',
            type: 'article'
          });
        });
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);
      
      try {
        const searchResults = await searchProducts(query);
        setResults(searchResults);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
    
    switch (result.type) {
      case 'product':
        router.push(`/products/${result.id}`);
        break;
      case 'category':
        router.push(`/categories/${result.id}`);
        break;
      case 'article':
        router.push(`/blog/${result.id}`);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length >= 2 && results.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Pretražite proizvode, kategorije..."
            className="w-full pl-12 pr-12 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-onyx placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-100 transition-all duration-300 shadow-sm hover:shadow-md"
          />
          
          {query && (
            <motion.button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (results.length > 0 || isLoading) && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gold-500 rounded-full animate-spin" />
                  <span>Pretraživanje...</span>
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      index === selectedIndex 
                        ? 'bg-gold-50 border-l-4 border-l-gold-400' 
                        : 'hover:bg-gray-50'
                    } ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
                    onClick={() => handleResultClick(result)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          {result.type === 'product' && '🛍️'}
                          {result.type === 'category' && '📁'}
                          {result.type === 'article' && '📝'}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-onyx truncate">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {result.category}
                            </p>
                          </div>
                          
                          {result.type === 'product' && (
                            <div className="flex-shrink-0">
                              <span className="text-sm font-semibold text-gold-600">
                                {result.price.toFixed(2)} €
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            result.type === 'product' 
                              ? 'bg-gold-100 text-gold-800' 
                              : result.type === 'category'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {result.type === 'product' && 'Proizvod'}
                            {result.type === 'category' && 'Kategorija'}
                            {result.type === 'article' && 'Članak'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Search Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Koristite ↑↓ za navigaciju, Enter za odabir</span>
                <span>{results.length} rezultata</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


