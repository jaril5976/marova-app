import { NEXT_PUBLIC_BASE_URL } from '@env';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipNotFound?: boolean;
  }
}

export const request = axios.create();
export const authRequired = axios.create();

export const getBaseUrl = (): string => {
  return (NEXT_PUBLIC_BASE_URL as string) || '';
};

export const addRequestInterceptor = (
  interceptor: (
    request: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
): number => {
  return authRequired.interceptors.request.use(interceptor);
};

export const removeRequestInterceptor = (id: number): void => {
  authRequired.interceptors.request.eject(id);
};

export const addResponseInterceptor = (
  interceptor: (
    response: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>,
  error?: (error: AxiosError) => AxiosError | Promise<AxiosError>,
): number => {
  return authRequired.interceptors.response.use(
    interceptor,
    error ?? (err => Promise.reject(err)),
  );
};

export const removeResponseInterceptor = (id: number): void => {
  authRequired.interceptors.response.eject(id);
};

// Set base URLs
const DEFAULT_BASE_URL = getBaseUrl();
request.defaults.baseURL = DEFAULT_BASE_URL;
authRequired.defaults.baseURL = DEFAULT_BASE_URL;

/**
 * Global token storage for synchronous access in interceptors.
 * In React Native, favor setting this after successful login.
 */
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Add request interceptor for auth
authRequired.interceptors.request.use(
  config => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  error => {
    console.error('🚨 Request error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
authRequired.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const { response, config } = error;

    console.error('🚨 API Error:', {
      url: config?.url,
      method: config?.method?.toUpperCase(),
      status: response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  },
);

// Optional: Add basic interceptor for non-auth requests
request.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.error('🚨 Non-auth request failed:', error.message);
    return Promise.reject(error);
  },
);
