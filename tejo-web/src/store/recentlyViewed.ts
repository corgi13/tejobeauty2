import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Item = { id: string; name: string; slug?: string; image?: string; viewedAt: number };

type State = {
  items: Item[];
  add: (i: Omit<Item, 'viewedAt'>) => void;
};

export const useRecentlyViewed = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (i) => {
        const now = Date.now();
        const next = [{ ...i, viewedAt: now }, ...get().items.filter((x) => x.id !== i.id)].slice(0, 20);
        set({ items: next });
      },
    }),
    { name: 'tejo-recent' }
  )
);


