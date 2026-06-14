import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
}

interface CartStore {
  activeUserId: string;
  userCarts: Record<string, CartItem[]>;
  items: CartItem[];
  setActiveUser: (userId: string) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      activeUserId: 'guest',
      userCarts: {},
      items: [],

      setActiveUser: (userId) => {
        set((state) => {
          if (state.activeUserId === userId) return state;
          
          const updatedCarts = { ...state.userCarts, [state.activeUserId]: state.items };
          let newItems = updatedCarts[userId] || [];

          // Khi đăng nhập: Gộp giỏ hàng khách vào tài khoản mới
          if (state.activeUserId === 'guest' && userId !== 'guest') {
            const guestItems = state.items;
            if (guestItems.length > 0) {
              const mergedItems = [...newItems];
              for (const gItem of guestItems) {
                const existingIdx = mergedItems.findIndex(i => i._id === gItem._id);
                if (existingIdx !== -1) {
                  mergedItems[existingIdx] = { 
                    ...mergedItems[existingIdx], 
                    quantity: mergedItems[existingIdx].quantity + gItem.quantity 
                  };
                } else {
                  mergedItems.push(gItem);
                }
              }
              newItems = mergedItems;
              updatedCarts['guest'] = []; // Xóa giỏ hàng khách sau khi gộp
            }
          }

          // Khi đăng xuất: Trả về giỏ hàng khách trống
          if (userId === 'guest') {
            newItems = [];
            updatedCarts['guest'] = [];
          }

          return {
            activeUserId: userId,
            userCarts: updatedCarts,
            items: newItems,
          };
        });
      },
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i._id === item._id);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
            );
          } else {
            newItems = [...state.items, item];
          }
          return { 
            items: newItems,
            userCarts: { ...state.userCarts, [state.activeUserId]: newItems }
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((i) => i._id !== id);
          return {
            items: newItems,
            userCarts: { ...state.userCarts, [state.activeUserId]: newItems }
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const newItems = state.items.map((i) =>
            i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          );
          return {
            items: newItems,
            userCarts: { ...state.userCarts, [state.activeUserId]: newItems }
          };
        });
      },

      clearCart: () => {
        set((state) => ({ 
          items: [],
          userCarts: { ...state.userCarts, [state.activeUserId]: [] }
        }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const priceToUse = item.discountPrice || item.price;
          return total + priceToUse * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'zcomputer-cart', // Lệnh lưu state vào localStorage
    }
  )
);
