import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface SavedItem {
  productId: string;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  image?: string;
  savedAt: Date;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  minAmount?: number;
}

export interface GuestInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

type CartState = {
  items: CartItem[];
  savedItems: SavedItem[];
  coupon: Coupon | null;
  guestInfo: GuestInfo | null;
  isGuestCheckout: boolean;
  cartId: string;
  
  // Cart actions
  setCoupon: (c: Coupon) => void;
  clearCoupon: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clear: () => void;
  
  // Save for later actions
  saveForLater: (item: CartItem) => void;
  moveToCart: (savedItem: SavedItem) => void;
  removeSavedItem: (productId: string, variantId?: string) => void;
  clearSavedItems: () => void;
  
  // Guest checkout actions
  setGuestInfo: (info: GuestInfo) => void;
  setGuestCheckout: (isGuest: boolean) => void;
  generateCartId: () => void;
  
  // Calculations
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  itemCount: () => number;
  getItem: (productId: string, variantId?: string) => CartItem | undefined;
  getSavedItem: (productId: string, variantId?: string) => SavedItem | undefined;
  
  // Cart persistence
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
};

// Generate unique cart ID
const generateCartId = () => {
  return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      coupon: null,
      guestInfo: null,
      isGuestCheckout: false,
      cartId: generateCartId(),
      
      setCoupon: (c) => set({ coupon: c }),
      clearCoupon: () => set({ coupon: null }),
      
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map(i =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (productId, variantId) => {
        const { items } = get();
        set({
          items: items.filter(
            i => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },
      
      updateQty: (productId, variantId, qty) => {
        const { items } = get();
        if (qty <= 0) {
          get().removeItem(productId, variantId);
        } else {
          set({
            items: items.map(i =>
              i.productId === productId && i.variantId === variantId
                ? { ...i, qty }
                : i
            ),
          });
        }
      },
      
      clear: () => set({ items: [], coupon: null }),
      
      // Save for later functionality
      saveForLater: (item) => {
        const { items, savedItems } = get();
        
        // Remove from cart
        const updatedItems = items.filter(
          i => !(i.productId === item.productId && i.variantId === item.variantId)
        );
        
        // Add to saved items
        const savedItem: SavedItem = {
          productId: item.productId,
          variantId: item.variantId,
          variantName: item.variantName,
          name: item.name,
          price: item.price,
          image: item.image,
          savedAt: new Date(),
        };
        
        const existingSaved = savedItems.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );
        
        if (!existingSaved) {
          set({ 
            items: updatedItems,
            savedItems: [...savedItems, savedItem]
          });
        } else {
          set({ items: updatedItems });
        }
      },
      
      moveToCart: (savedItem) => {
        const { items, savedItems } = get();
        
        // Remove from saved items
        const updatedSavedItems = savedItems.filter(
          i => !(i.productId === savedItem.productId && i.variantId === savedItem.variantId)
        );
        
        // Add to cart
        const cartItem: CartItem = {
          productId: savedItem.productId,
          variantId: savedItem.variantId,
          variantName: savedItem.variantName,
          name: savedItem.name,
          price: savedItem.price,
          qty: 1,
          image: savedItem.image,
        };
        
        const existingItem = items.find(
          i => i.productId === savedItem.productId && i.variantId === savedItem.variantId
        );
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.productId === savedItem.productId && i.variantId === savedItem.variantId
                ? { ...i, qty: i.qty + 1 }
                : i
            ),
            savedItems: updatedSavedItems,
          });
        } else {
          set({
            items: [...items, cartItem],
            savedItems: updatedSavedItems,
          });
        }
      },
      
      removeSavedItem: (productId, variantId) => {
        const { savedItems } = get();
        set({
          savedItems: savedItems.filter(
            i => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },
      
      clearSavedItems: () => set({ savedItems: [] }),
      
      // Guest checkout functionality
      setGuestInfo: (info) => set({ guestInfo: info }),
      setGuestCheckout: (isGuest) => set({ isGuestCheckout: isGuest }),
      generateCartId: () => set({ cartId: generateCartId() }),
      
      // Calculations
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      discount: () => {
        const c = get().coupon;
        const sub = get().subtotal();
        if (!c) return 0;
        if (c.type === 'percent') return Math.round(((c.value || 0) / 100) * sub * 100) / 100;
        if (c.type === 'fixed') return Math.min(sub, c.value || 0);
        return 0;
      },
      total: () => Math.max(0, get().subtotal() - get().discount()),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      
      getItem: (productId, variantId) => {
        const { items } = get();
        return items.find(
          i => i.productId === productId && i.variantId === variantId
        );
      },
      
      getSavedItem: (productId, variantId) => {
        const { savedItems } = get();
        return savedItems.find(
          i => i.productId === productId && i.variantId === variantId
        );
      },
      
      // Server sync (for guest checkout persistence)
      syncWithServer: async () => {
        const { items, cartId, guestInfo } = get();
        try {
          // This would sync the cart with the server for guest users
          // Implementation depends on your backend API
          console.log('Syncing cart with server:', { cartId, items, guestInfo });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },
      
      loadFromServer: async () => {
        const { cartId } = get();
        try {
          // This would load the cart from the server for guest users
          // Implementation depends on your backend API
          console.log('Loading cart from server:', cartId);
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      },
    }),
    { 
      name: 'tejo-cart',
      partialize: (state) => ({
        items: state.items,
        savedItems: state.savedItems,
        coupon: state.coupon,
        guestInfo: state.guestInfo,
        isGuestCheckout: state.isGuestCheckout,
        cartId: state.cartId,
      }),
    }
  )
);


