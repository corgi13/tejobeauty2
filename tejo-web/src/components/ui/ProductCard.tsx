"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { MovingBorder } from './moving-border';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, any>;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  stock: number;
  variants?: ProductVariant[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  showWishlist?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  showQuickView = true, 
  showWishlist = true,
  className = "" 
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addItem } = useCart();
  const { items: wishlistItems, add: addWish, remove: removeWish } = useWishlist();
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = selectedVariant?.price || product.price;
  const displayStock = selectedVariant?.stock || product.stock;
  const isOutOfStock = displayStock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    setIsLoading(true);
    try {
      addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        price: displayPrice,
        qty: 1,
        image: product.images[0],
        variantName: selectedVariant?.name,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeWish(product.id);
    } else {
      addWish({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        price: displayPrice,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
              <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <MovingBorder className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Novo
              </span>
            )}
            {product.isOnSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Akcija
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gold text-white text-xs px-2 py-1 rounded-full">
                Preporučeno
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                {isInWishlist ? (
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                ) : (
                  <Heart className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}
            
            {showQuickView && (
              <Link
                href={`/products/${product.slug}`}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Link>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Nedostupno</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs text-gray-500 hover:text-gold transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 mt-1 hover:text-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Variants */}
          {hasVariants && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {product.variants?.slice(0, 3).map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-gold bg-gold text-white'
                        : 'border-gray-300 hover:border-gold'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
                {product.variants && product.variants.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{product.variants.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-lg text-gray-900">
              {displayPrice.toFixed(2)} €
            </span>
            {product.comparePrice && product.comparePrice > displayPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.comparePrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className={`w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-onyx text-white hover:bg-onyx/90'
            }`}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? 'Nedostupno' : 'Dodaj u košaricu'}
              </>
            )}
          </button>
        </div>
      </div>
    </MovingBorder>
  );
}
