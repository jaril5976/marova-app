
import { create } from 'zustand';

interface CartStore {
    cartId: string | null;
    setCartId: (id: string | null) => void;
    clearCartId: () => void;
}

export const useUserCartStore = create<CartStore>((set) => ({
    cartId: null,
    setCartId: (id) => set({ cartId: id }),
    clearCartId: () => set({ cartId: null }),
}));
