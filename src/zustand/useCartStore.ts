
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id?: string;
    productId?: string;
    title?: string;
    price?: number;
    imageUrl?: string;
    quantity?: number;
    size?: string;
    color?: string;
    total?: number;
}

export interface CartState {
    cart: CartItem[];
    hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setCart: (cartData: CartItem[]) => void;
    addToCart: (item: Omit<CartItem, 'id' | 'total'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            hasHydrated: false,

            setHasHydrated: (state) => set({ hasHydrated: state }),

            setCart: (cartData) => set({ cart: cartData }),

            addToCart: (item) => {
                const { cart } = get();
                const { productId } = item;

                const generateId = () => `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                const existingIndex = cart.findIndex((i) => i.productId === productId && i.size === item.size);

                if (existingIndex > -1) {
                    const existing = cart[existingIndex];
                    const incomingQty = item.quantity ?? 1;
                    const newQty = (existing.quantity ?? 0) + incomingQty;
                    const updatedCart = cart.map((cartItem, index) =>
                        index === existingIndex
                            ? {
                                ...cartItem,
                                quantity: newQty,
                                total: (cartItem.price ?? 0) * newQty,
                            }
                            : cartItem
                    );
                    set({ cart: updatedCart });
                } else {
                    const qty = item.quantity ?? 1;
                    const newItem = {
                        ...item,
                        id: generateId(),
                        quantity: qty,
                        total: (item.price ?? 0) * qty,
                    };
                    set({ cart: [...cart, newItem] });
                }
            },

            removeFromCart: (id) =>
                set({
                    cart: get().cart.filter((i) => i.id !== id),
                }),

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    set({ cart: get().cart.filter((i) => i.id !== id) });
                } else {
                    set({
                        cart: get().cart.map((i) => (i.id === id ? { ...i, quantity, total: (i.price ?? 0) * quantity } : i)),
                    });
                }
            },

            clearCart: () => set({ cart: [] }),

            getCartTotal: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + (item.total ?? 0), 0);
            },

            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + (item.quantity ?? 0), 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
