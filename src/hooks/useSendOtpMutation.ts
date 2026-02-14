
import { useMutation } from '@tanstack/react-query';
import { authSendOtpRequest } from '../imports/Auth/requests/authRequests';
import { AuthSendOtpRequestPayload } from '../imports/Auth/types/api';
import Toast from 'react-native-toast-message';

export function useSendOtpMutation() {
    const sendOtpMutation = useMutation({
        mutationFn: (payload: AuthSendOtpRequestPayload) => authSendOtpRequest(payload),
        onSuccess: () => {
            console.log('OTP sent successfully');
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'OTP sent successfully 📩',
                position: 'top',
            });
        },
        onError: (error: any) => {
            console.error('Failed to send OTP', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.message || 'Failed to send OTP. Please try again.',
                position: 'top',
            });
        },
    });

    return { sendOtpMutation };
}
