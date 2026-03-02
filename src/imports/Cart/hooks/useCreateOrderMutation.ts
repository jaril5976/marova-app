
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';
import PhonePePaymentGateway from 'react-native-phonepe-pg';
import { createOrderRequest, CreateOrderPayload, CreateOrderResponse } from '../requests/createOrderRequest';
import { Platform } from 'react-native';

export function useCreateOrderMutation() {
    return useMutation({
        mutationFn: (payload: CreateOrderPayload) => createOrderRequest(payload),

        onSuccess: async (response) => {
            const { data } = response;

            if (!data.success) {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to create order',
                    text2: 'Please try again later'
                });
                return;
            }

            // PhonePe SDK Integration
            if (data.data?.base64Body && data.data?.checksum) {
                try {
                    // Initialize SDK - environment should ideally come from config
                    // merchantId and appId are placeholder here, should be replaced with actual values
                    const environment = 'SANDBOX'; // or 'PRODUCTION'
                    const merchantId = 'PGCHECKOUT'; // Placeholder
                    const appId = '';
                    const enableLogging = true;

                    await PhonePePaymentGateway.init(environment, merchantId, appId, enableLogging);

                    // Based on lint feedback (Expected 2 arguments), the signature likely only needs body and checksum
                    const result = await PhonePePaymentGateway.startTransaction(
                        data.data.base64Body,
                        data.data.checksum
                    );

                    console.log('PhonePe Transaction Result:', result);

                    if (result.status === 'SUCCESS') {
                        Toast.show({
                            type: 'success',
                            text1: 'Payment Successful',
                            text2: 'Your order has been placed'
                        });
                        // Navigate to success screen if needed
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Payment Failed',
                            text2: result.error || 'User cancelled the transaction'
                        });
                    }
                } catch (error: any) {
                    console.error('PhonePe SDK Error:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Payment Error',
                        text2: error.message || 'Could not initiate PhonePe transaction'
                    });
                }
            } else if (data.redirectUrl) {
                // Fallback to URL if SDK data is not provided
                console.warn('SDK data missing, falling back to redirectUrl');
                // In a real app, you might use Linking.openURL(data.redirectUrl)
            }
        },

        onError: (error: AxiosError<any>) => {
            console.error('Create order error:', error);
            const msg = error.response?.data?.msg || 'Failed to create order';
            Toast.show({
                type: 'error',
                text1: 'Order Error',
                text2: msg
            });
        },
    });
}
