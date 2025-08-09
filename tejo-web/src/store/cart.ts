import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  attributes?: Record<string, unknown>;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex((i) => i.productId === item.productId && i.variantId === item.variantId);
          if (idx >= 0) {
            const next = [...state.items];
            next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
            return { items: next };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({ items: state.items.filter((i) => !(i.productId === productId && i.variantId === variantId)) })),
      updateQty: (productId, variantId, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'tejo-cart' }
  )
);


