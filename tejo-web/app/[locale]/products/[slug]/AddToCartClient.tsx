"use client";
import { useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { useEffect } from 'react';
import { useRecentlyViewed } from '@/store/recentlyViewed';

export default function AddToCartClient({ product }: { product: any }) {
  const add = useCart((s) => s.addItem);
  const addWish = useWishlist((s) => s.add);
  const addRecent = useRecentlyViewed((s) => s.add);
  useEffect(() => { if (product?.id) addRecent({ id: product.id, name: product.name, slug: product.slug, image: product.images?.[0] }); }, [product?.id]);
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={() => add({ productId: product.id, name: product.name, price: Number(product.price), qty: 1, image: product.images?.[0] })}
        className="inline-flex rounded-xl bg-onyx px-6 py-3 text-white"
      >
        Add to cart
      </button>
      <button
        onClick={() => addWish({ id: product.id, name: product.name, slug: product.slug, image: product.images?.[0] })}
        className="inline-flex rounded-xl border border-gold px-6 py-3"
      >
        Wishlist
      </button>
    </div>
  );
}


