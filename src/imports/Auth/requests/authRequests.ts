
import { authRequired, getBaseUrl } from '../../../utils/request';
import {
    AuthLoginRequestPayload,
    AuthLoginResponse,
    AuthRegisterRequestPayload,
    AuthRegisterResponse,
    AuthSendOtpRequestPayload,
    AuthVerifyOtpRequestPayload,
    AuthVerifyOtpResponse,
} from '../types/api';

const path = getBaseUrl();


export const authLoginRequest = (payload: AuthLoginRequestPayload) => {
    return authRequired.post<AuthLoginResponse>(`${path}/user/login`, {
        ...payload,
    });
};

export const authSendOtpRequest = (payload: AuthSendOtpRequestPayload) => {
    const endpoint = payload.phone ? `${path}/user/send-otp` : `${path}/user/send-email-otp`;
    console.log(`[authSendOtpRequest] Calling: ${endpoint}`, 'Payload:', payload);
    return authRequired.post(endpoint, {
        ...payload,
    });
};

export const authVerifyOtpRequest = (payload: AuthVerifyOtpRequestPayload) => {
    const endpoint = payload.phone ? `${path}/user/verify-otp` : `${path}/user/verify-email-otp`;
    console.log(`[authVerifyOtpRequest] Calling: ${endpoint}`, 'Payload:', payload);
    return authRequired.post<AuthVerifyOtpResponse>(endpoint, {
        ...payload,
    });
};

export const updateUserRequest = (payload: any) => {
    return authRequired.post(`${path}/user/update-user`, payload);
};
