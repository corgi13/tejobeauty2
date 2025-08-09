import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Wish = { id: string; name: string; slug?: string; image?: string };

type State = {
  items: Wish[];
  add: (w: Wish) => void;
  remove: (id: string) => void;
};

export const useWishlist = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (w) => set({ items: [...get().items.filter((i) => i.id !== w.id), w] }),
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    }),
    { name: 'tejo-wishlist' }
  )
);


