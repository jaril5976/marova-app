import { create } from 'zustand';
import { getProductCards } from '../../lib/quary';

export interface Product {
    _id: string;
    title: string;
    price: number;
    featuredImage: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
    isBestSeller: boolean;
    isNewArrival: boolean;
    images: string[];
    gender: string;
    sizes: string[];
    _createdAt: string;
    stockQuantity: number;
}

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    setProducts: (products: Product[]) => void;
    fetchProducts: () => Promise<void>;
    bestSelling: () => Product[];
    newArrivals: () => Product[];
}

const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    setProducts: (products) => set({ products }),

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            // Only fetch if products are empty to avoid re-fetching on every mount if we want cache-like behavior
            // But here we'll fetch always or check if existing? Let's fetch if empty or maybe just always for now to be safe.
            // The user's snippet showed: if (!products || products.length === 0) fetch...
            // We can move that logic to the component or keep it here.
            // Let's implement the fetch action.
            const products = await getProductCards();
            set({ products, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch products' });
            console.error('Error fetching products:', error);
        }
    },

    bestSelling: () => {
        return get().products.filter((item) => item.isBestSeller);
    },

    newArrivals: () => {
        return get().products.filter((item) => item.isNewArrival);
    },
}));

export default useProductStore;
