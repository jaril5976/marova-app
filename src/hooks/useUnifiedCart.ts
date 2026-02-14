
import { useAuthCartStore } from '../zustand/useAuthCartStore';
import { useCartStore } from '../zustand/useCartStore';
import useAuthStore from '../zustand/useAuthStore';
import { useUserCartStore } from '../zustand/useUserCartStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart as addToCartApi, updateCartItem, removeCartItem } from '../imports/Cart/requests/cartRequests';
import { useEffect } from 'react';

export function useUnifiedCart() {
    const { isAuthenticated } = useAuthStore();
    const { cart: localCart, addToCart: addToCartLocal, updateQuantity: updateQuantityLocal, removeFromCart: removeFromCartLocal, clearCart: clearLocalCart } = useCartStore();
    const { cart: authCart, setCart: setAuthCart, addToCart: addToCartAuth, updateQuantity: updateAuthQuantity, removeFromCart: removeFromAuthCart, clearCart: clearAuthCart } = useAuthCartStore();
    const { cartId } = useUserCartStore();
    const queryClient = useQueryClient();

    // Fetch API cart when authenticated
    const { data: apiCart, isLoading: apiLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        enabled: isAuthenticated,
    });

    // Sync API cart to Auth Store
    useEffect(() => {
        if (isAuthenticated && apiCart) {
            setAuthCart(apiCart);
        }
    }, [apiCart, isAuthenticated, setAuthCart]);

    const addToCartMutation = useMutation({
        mutationFn: addToCartApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const updateQuantityMutation = useMutation({
        mutationFn: ({ cartId, productId, quantity }: { cartId: string, productId: string, quantity: number }) => updateCartItem(cartId, productId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const removeFromCartMutation = useMutation({
        mutationFn: ({ cartId, productId }: { cartId: string, productId: string }) => removeCartItem(cartId, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });

    const addToCart = async (item: any) => {
        if (!isAuthenticated) {
            addToCartLocal(item);
            return { success: true };
        } else {
            try {
                await addToCartMutation.mutateAsync(item);
                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!isAuthenticated) {
            // Local cart uses the generated 'id' which is passed as productId here or we need to handle mapping
            // But since localCart uses 'id' (guest_...) and Auth uses 'productId', let's be careful.
            // In My Screen implementation I pass the id.
            updateQuantityLocal(productId, quantity);
            return { success: true };
        } else {
            if (!cartId) return { success: false, error: 'No cartId' };
            try {
                await updateQuantityMutation.mutateAsync({ cartId, productId, quantity });
                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!isAuthenticated) {
            removeFromCartLocal(productId);
            return { success: true };
        } else {
            if (!cartId) return { success: false, error: 'No cartId' };
            try {
                await removeFromCartMutation.mutateAsync({ cartId, productId });
                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        }
    };

    const cart = isAuthenticated ? authCart : localCart;
    const isLoading = isAuthenticated ? apiLoading : false;

    return {
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        isAuthenticated,
    };
}
