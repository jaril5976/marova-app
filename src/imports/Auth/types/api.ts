import { User } from '../../../zustand/useAuthStore';

export interface AuthLoginRequestPayload {
    email?: string;
    phone?: string;
    password?: string; // Optional if only using OTP
    otp?: string;
}

export interface AuthLoginResponse {
    token: string;
    user: User;
}

export interface AuthRegisterRequestPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
}

export interface AuthRegisterResponse {
    token: string;
    user: User;
}

export interface AuthSendOtpRequestPayload {
    email?: string;
    phone?: string;
}

export interface AuthVerifyOtpRequestPayload {
    email?: string;
    phone?: string;
    otp: string;
}

export interface AuthVerifyOtpResponse {
    token: string;
    user: User;
}

