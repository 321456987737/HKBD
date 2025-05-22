import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const UseCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) =>
        set((state) => ({
          cartItems: [...state.cartItems, item],
        })),
      clearCart: () => set({ cartItems: [] }),
      removeFromCart: (id, size, color) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) =>
              item.id !== id ||
              item.size !== size ||
              item.color !== color
          ),
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default UseCartStore;
