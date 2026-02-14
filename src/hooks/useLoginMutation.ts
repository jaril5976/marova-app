
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authLoginRequest } from '../imports/Auth/requests/authRequests';
import { AuthLoginRequestPayload, AuthLoginResponse } from '../imports/Auth/types/api';
import { transferGuestCart } from '../imports/Cart/requests/cartRequests';
import useAuthStore from '../zustand/useAuthStore';
import { useCartStore } from '../zustand/useCartStore';
import Toast from 'react-native-toast-message';

export function useLoginMutation() {
    const { setAuthToken, setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const { cart: guestCart, clearCart } = useCartStore();

    const loginMutation = useMutation({
        mutationFn: (payload: AuthLoginRequestPayload) => authLoginRequest(payload),
        onSuccess: async (response) => {
            const data = response.data;
            if (data?.token) {
                setAuthToken(data.token);
                setUser(data.user);

                // Transfer guest cart on successful login
                try {
                    await transferGuestCart(guestCart);
                    await queryClient.invalidateQueries({ queryKey: ['cart'] });
                } catch (error) {
                    console.error('Failed to transfer cart', error);
                }

                clearCart();
            }
        },
        onError: (error: any) => {
            console.error('Login failed', error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error?.response?.data?.message || 'Please check your credentials and try again.',
                position: 'top',
            });
        },
    });

    return { loginMutation };
}
