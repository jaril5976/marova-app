
import { create } from 'zustand';
import { CartItem } from './useCartStore';

interface AuthCartState {
    cart: CartItem[];
    setCart: (cartData: CartItem[]) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getTotalItems: () => number;
}

export const useAuthCartStore = create<AuthCartState>((set, get) => ({
    cart: [],

    setCart: (cartData) => set({ cart: cartData }),

    addToCart: (item) => {
        const { cart } = get();
        const { productId } = item;

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
            const size = item.size;

            const newItem = {
                ...item,
                id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                quantity: qty,
                total: (item.price ?? 0) * qty,
                sizes: size,
            };
            set({ cart: [...cart, newItem] });
        }
    },

    removeFromCart: (productId) =>
        set({
            cart: get().cart.filter((i) => i.productId !== productId),
        }),

    updateQuantity: (productId, quantity) => {
        const { cart } = get();

        if (quantity <= 0) {
            set({ cart: cart.filter((i) => i.productId !== productId) });
        } else {
            set({
                cart: cart.map((i) => (i.productId === productId ? { ...i, quantity, total: (i.price ?? 0) * quantity } : i)),
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
}));
