"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { MovingBorder } from '@/components/ui/moving-border';
import { addConfetti } from '@/lib/confetti';

export function WishlistClient() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleAddToCart = async (product: any) => {
    setLoadingStates(prev => ({ ...prev, [product.id]: true }));
    
    try {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price || 0,
        image: product.images?.[0] || '',
        qty: 1,
        variantId: undefined,
      });
      
      addConfetti();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lista želja je prazna</h3>
        <p className="text-gray-500 mb-6">Dodajte proizvode koje volite u svoju listu želja.</p>
        <Link 
          href="/categories" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-onyx hover:bg-onyx/90 transition-colors"
        >
          Istraži proizvode
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <MovingBorder key={product.id} className="p-4">
          <div className="group relative">
            {/* Product Image */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-sm font-medium text-onyx group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-lg font-bold text-onyx">
                {product.price ? `${product.price.toFixed(2)} €` : 'Cijena na upit'}
              </p>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingStates[product.id]}
                  className="flex-1 bg-onyx text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-onyx/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingStates[product.id] ? 'Dodavanje...' : 'Dodaj u košaricu'}
                </button>
                
                <button
                  onClick={() => remove(product.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Ukloni iz liste želja"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </MovingBorder>
      ))}
    </div>
  );
}
