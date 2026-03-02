
import { authRequired } from '../../../utils/request';

export interface CreateOrderPayload {
    appliedCoupon?: string | null;
    shippingCharge?: number;
    gstPercentage?: number;
    selectedAddressId?: string;
}

export interface CreateOrderResponse {
    success: boolean;
    orderId: string;
    // For SDK integration, we typically need these from the backend:
    data?: {
        base64Body: string;
        checksum: string;
    };
    // Fallback for transition
    redirectUrl?: string;
    totalAmount: number;
    amount: number;
}

export const createOrderRequest = async (payload: CreateOrderPayload) => {
    return authRequired.post<CreateOrderResponse>(`/order/create-order`, payload);
};
