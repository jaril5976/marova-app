import { create } from 'zustand';
import { getProductCards } from '../../lib/quary';

export interface Product {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    salePrice?: number;
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
    category?: string;
    scentProfile?: string[];
    longevity?: string;
    projection?: string;
    season?: string[];
    accordionInfo?: {
        name: string;
        content: string;
    }[];
    averageRating?: number;
    reviewCount?: number;
}

export interface Filters {
    gender: string[];
    size: string[];
    price: [number, number];
}

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;

    filters: Filters;
    sortBy: string;
    pageSize: number;
    currentPage: number;
    totalPages: number;

    setProducts: (products: Product[]) => void;
    fetchProducts: () => Promise<void>;
    setFilters: (partial: Partial<Filters>) => void;
    setSortBy: (sortValue: string) => void;
    goToPage: (page: number) => void;

    filteredProducts: () => Product[];
    sortedProducts: () => Product[];
    paginatedProducts: () => Product[];
    updateTotalPages: () => void;
    bestSelling: () => Product[];
    newArrivals: () => Product[];
}

const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    filters: {
        gender: [],
        size: [],
        price: [0, 1500],
    },
    sortBy: 'newest',
    pageSize: 8,
    currentPage: 1,
    totalPages: 1,

    setProducts: (products) => {
        const total = Math.ceil(products.length / get().pageSize);
        set({
            products,
            totalPages: total,
            currentPage: 1,
            isLoading: false,
        });
    },

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const products = await getProductCards();
            get().setProducts(products);
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch products' });
            console.error('Error fetching products:', error);
        }
    },

    setFilters: (partial) => {
        set({
            filters: { ...get().filters, ...partial },
            currentPage: 1,
        });
        get().updateTotalPages();
    },

    setSortBy: (sortValue) => {
        set({ sortBy: sortValue, currentPage: 1 });
        get().updateTotalPages();
    },

    filteredProducts: () => {
        const { products, filters } = get();
        return products.filter((p) => {
            if (filters.gender.length && !filters.gender.includes(p.gender)) return false;

            if (filters.size.length) {
                const matchSize = p.sizes?.some((s) => filters.size.includes(s));
                if (!matchSize) return false;
            }

            const price = p.price;
            if (price < filters.price[0] || price > filters.price[1]) return false;

            return true;
        });
    },

    sortedProducts: () => {
        const list = [...get().filteredProducts()];
        const { sortBy } = get();

        switch (sortBy) {
            case 'price-low-to-high':
                return list.sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return list.sort((a, b) => b.price - a.price);
            case 'a-to-z':
                return list.sort((a, b) => a.title.localeCompare(b.title));
            case 'z-to-a':
                return list.sort((a, b) => b.title.localeCompare(a.title));
            case 'oldest':
                return list.sort((a, b) => new Date(a._createdAt ?? 0).getTime() - new Date(b._createdAt ?? 0).getTime());
            case 'newest':
            default:
                return list.sort((a, b) => new Date(b._createdAt ?? 0).getTime() - new Date(a._createdAt ?? 0).getTime());
        }
    },

    paginatedProducts: () => {
        const { sortedProducts, currentPage, pageSize } = get();
        const start = (currentPage - 1) * pageSize;
        return sortedProducts().slice(start, start + pageSize);
    },

    updateTotalPages: () => {
        const count = get().sortedProducts().length;
        const total = Math.ceil(count / get().pageSize);
        set({ totalPages: total });
    },

    goToPage: (page) => {
        const totalPages = get().totalPages;
        if (page >= 1 && page <= totalPages) set({ currentPage: page });
    },

    bestSelling: () => {
        return get().products.filter((item) => item.isBestSeller);
    },

    newArrivals: () => {
        return get().products.filter((item) => item.isNewArrival);
    },
}));

export default useProductStore;
