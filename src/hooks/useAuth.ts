
import { useCallback } from 'react';
import useAuthStore from '../zustand/useAuthStore';
import { useAuthCartStore } from '../zustand/useAuthCartStore';
import { useCartStore } from '../zustand/useCartStore';
import { useLoginMutation } from './useLoginMutation';
import { useSendOtpMutation } from './useSendOtpMutation';
import { useVerifyOtpMutation } from './useVerifyOtpMutation';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
    const queryClient = useQueryClient();
    const { user, authToken, isAuthenticated, authHeaderSet, setAuthHeaderSet, logout: storeLogout } = useAuthStore();
    const { clearCart: clearAuthCart } = useAuthCartStore();
    const { clearCart: clearGuestCart } = useCartStore();

    const { loginMutation } = useLoginMutation();
    const { sendOtpMutation } = useSendOtpMutation();
    const { verifyOtpMutation } = useVerifyOtpMutation();

    const login = useCallback(
        (payload: any) => {
            loginMutation.mutate(payload);
        },
        [loginMutation]
    );

    const sendOtp = useCallback(
        (payload: any) => {
            sendOtpMutation.mutate(payload);
        },
        [sendOtpMutation]
    );

    const verifyOtp = useCallback(
        (payload: any) => {
            verifyOtpMutation.mutate(payload);
        },
        [verifyOtpMutation]
    );

    const logout = useCallback(async () => {
        try {
            storeLogout();
            clearAuthCart();
            clearGuestCart();
            await queryClient.clear();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [storeLogout, clearAuthCart, clearGuestCart, queryClient]);

    return {
        user,
        authToken,
        isAuthenticated,
        authHeaderSet,
        setAuthHeaderSet,
        login,
        sendOtp,
        verifyOtp,
        logout,
        authLoginLoading: loginMutation.isPending,
        isSendingOtp: sendOtpMutation.isPending,
        isVerifyingOtp: verifyOtpMutation.isPending,
    };
}
