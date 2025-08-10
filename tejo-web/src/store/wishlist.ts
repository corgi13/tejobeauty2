import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Wish {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  addedAt: Date;
  priceAlerts: PriceAlert[];
  notes?: string;
}

export interface PriceAlert {
  id: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface SharedWishlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareToken: string;
  createdAt: Date;
  items: Wish[];
}

type WishlistState = {
  items: Wish[];
  sharedLists: SharedWishlist[];
  
  // Basic wishlist actions
  add: (item: Omit<Wish, 'addedAt' | 'priceAlerts'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  
  // Price alert actions
  addPriceAlert: (productId: string, targetPrice: number) => void;
  removePriceAlert: (productId: string, alertId: string) => void;
  updatePriceAlert: (productId: string, alertId: string, targetPrice: number) => void;
  checkPriceAlerts: (productId: string, currentPrice: number) => PriceAlert[];
  
  // Notes functionality
  updateNotes: (productId: string, notes: string) => void;
  
  // Sharing functionality
  createSharedList: (name: string, description?: string, isPublic?: boolean) => SharedWishlist;
  addToSharedList: (listId: string, item: Omit<Wish, 'addedAt' | 'priceAlerts'>) => void;
  removeFromSharedList: (listId: string, productId: string) => void;
  deleteSharedList: (listId: string) => void;
  shareList: (listId: string) => string;
  
  // Utility functions
  getItem: (id: string) => Wish | undefined;
  getSharedList: (id: string) => SharedWishlist | undefined;
  getActivePriceAlerts: () => PriceAlert[];
  getItemsWithAlerts: () => Wish[];
  exportWishlist: () => string;
  importWishlist: (data: string) => void;
};

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const generateShareToken = () => Math.random().toString(36).substr(2, 15);

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      sharedLists: [],
      
      add: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.id === item.id);
        
        if (!existingItem) {
          const newItem: Wish = {
            ...item,
            addedAt: new Date(),
            priceAlerts: [],
          };
          set({ items: [...items, newItem] });
        }
      },
      
      remove: (id) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== id) });
      },
      
      clear: () => set({ items: [] }),
      
      // Price alert functionality
      addPriceAlert: (productId, targetPrice) => {
        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.id === productId) {
            const newAlert: PriceAlert = {
              id: generateId(),
              targetPrice,
              isActive: true,
              createdAt: new Date(),
            };
            return {
              ...item,
              priceAlerts: [...item.priceAlerts, newAlert],
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      
      removePriceAlert: (productId, alertId) => {
        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.id === productId) {
            return {
              ...item,
              priceAlerts: item.priceAlerts.filter(alert => alert.id !== alertId),
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      
      updatePriceAlert: (productId, alertId, targetPrice) => {
        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.id === productId) {
            return {
              ...item,
              priceAlerts: item.priceAlerts.map(alert =>
                alert.id === alertId
                  ? { ...alert, targetPrice }
                  : alert
              ),
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      
      checkPriceAlerts: (productId, currentPrice) => {
        const { items } = get();
        const item = items.find(i => i.id === productId);
        if (!item) return [];
        
        const triggeredAlerts: PriceAlert[] = [];
        const updatedItems = items.map(i => {
          if (i.id === productId) {
            const updatedAlerts = i.priceAlerts.map(alert => {
              if (alert.isActive && currentPrice <= alert.targetPrice) {
                triggeredAlerts.push(alert);
                return { ...alert, isActive: false, triggeredAt: new Date() };
              }
              return alert;
            });
            return { ...i, priceAlerts: updatedAlerts };
          }
          return i;
        });
        
        set({ items: updatedItems });
        return triggeredAlerts;
      },
      
      // Notes functionality
      updateNotes: (productId, notes) => {
        const { items } = get();
        const updatedItems = items.map(item =>
          item.id === productId ? { ...item, notes } : item
        );
        set({ items: updatedItems });
      },
      
      // Sharing functionality
      createSharedList: (name, description, isPublic = false) => {
        const { sharedLists } = get();
        const newList: SharedWishlist = {
          id: generateId(),
          name,
          description,
          isPublic,
          shareToken: generateShareToken(),
          createdAt: new Date(),
          items: [],
        };
        set({ sharedLists: [...sharedLists, newList] });
        return newList;
      },
      
      addToSharedList: (listId, item) => {
        const { sharedLists } = get();
        const updatedLists = sharedLists.map(list => {
          if (list.id === listId) {
            const existingItem = list.items.find(i => i.id === item.id);
            if (!existingItem) {
              const newItem: Wish = {
                ...item,
                addedAt: new Date(),
                priceAlerts: [],
              };
              return { ...list, items: [...list.items, newItem] };
            }
          }
          return list;
        });
        set({ sharedLists: updatedLists });
      },
      
      removeFromSharedList: (listId, productId) => {
        const { sharedLists } = get();
        const updatedLists = sharedLists.map(list =>
          list.id === listId
            ? { ...list, items: list.items.filter(item => item.id !== productId) }
            : list
        );
        set({ sharedLists: updatedLists });
      },
      
      deleteSharedList: (listId) => {
        const { sharedLists } = get();
        set({ sharedLists: sharedLists.filter(list => list.id !== listId) });
      },
      
      shareList: (listId) => {
        const { sharedLists } = get();
        const list = sharedLists.find(l => l.id === listId);
        if (!list) return '';
        
        // Generate share URL
        const shareUrl = `${window.location.origin}/wishlist/shared/${list.shareToken}`;
        return shareUrl;
      },
      
      // Utility functions
      getItem: (id) => {
        const { items } = get();
        return items.find(item => item.id === id);
      },
      
      getSharedList: (id) => {
        const { sharedLists } = get();
        return sharedLists.find(list => list.id === id);
      },
      
      getActivePriceAlerts: () => {
        const { items } = get();
        const allAlerts: PriceAlert[] = [];
        items.forEach(item => {
          item.priceAlerts.forEach(alert => {
            if (alert.isActive) {
              allAlerts.push(alert);
            }
          });
        });
        return allAlerts;
      },
      
      getItemsWithAlerts: () => {
        const { items } = get();
        return items.filter(item => item.priceAlerts.some(alert => alert.isActive));
      },
      
      exportWishlist: () => {
        const { items } = get();
        const exportData = {
          items: items.map(item => ({
            ...item,
            addedAt: item.addedAt.toISOString(),
            priceAlerts: item.priceAlerts.map(alert => ({
              ...alert,
              createdAt: alert.createdAt.toISOString(),
              triggeredAt: alert.triggeredAt?.toISOString(),
            })),
          })),
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importWishlist: (data) => {
        try {
          const importData = JSON.parse(data);
          if (importData.items && Array.isArray(importData.items)) {
            const importedItems: Wish[] = importData.items.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt),
              priceAlerts: item.priceAlerts?.map((alert: any) => ({
                ...alert,
                createdAt: new Date(alert.createdAt),
                triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
              })) || [],
            }));
            set({ items: importedItems });
          }
        } catch (error) {
          console.error('Failed to import wishlist:', error);
        }
      },
    }),
    { 
      name: 'tejo-wishlist',
      partialize: (state) => ({
        items: state.items,
        sharedLists: state.sharedLists,
      }),
    }
  )
);


