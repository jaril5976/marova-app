
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authVerifyOtpRequest } from '../imports/Auth/requests/authRequests';
import { AuthVerifyOtpRequestPayload, AuthVerifyOtpResponse } from '../imports/Auth/types/api';
import { transferGuestCart } from '../imports/Cart/requests/cartRequests';
import useAuthStore from '../zustand/useAuthStore';
import { useCartStore } from '../zustand/useCartStore';
import Toast from 'react-native-toast-message';

export function useVerifyOtpMutation() {
    const { setAuthToken, setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const { cart: guestCart, clearCart } = useCartStore();

    const verifyOtpMutation = useMutation({
        mutationFn: (payload: AuthVerifyOtpRequestPayload) => authVerifyOtpRequest(payload),
        onSuccess: async (response) => {
            const data = response.data;
            if (data?.token) {
                setAuthToken(data.token);
                setUser(data.user);

                Toast.show({
                    type: 'success',
                    text1: 'Login Success',
                    text2: 'Welcome back! 👋',
                    position: 'top',
                });

                // Transfer guest cart
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
            console.error('OTP verification failed', error);
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error?.response?.data?.message || 'Invalid OTP. Please try again.',
                position: 'top',
            });
        },
    });

    return { verifyOtpMutation };
}
