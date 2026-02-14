
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserAddress {
    id: string;
    type: string;
    street: string;
    city: string;
    zip: string;
}

export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    gender?: string;
    dateOfBirth?: string;
    addresses: UserAddress[];
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthStateValue {
    authToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    authHeaderSet: boolean;
    identifier: string | null; // For OTP flow

    setAuthToken: (authToken: string | null) => void;
    setUser: (user: User | null) => void;
    setAuthHeaderSet: (authHeaderSet: boolean) => void;
    setIdentifier: (identifier: string | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStateValue>()(
    persist(
        (set) => ({
            authToken: null,
            user: null,
            isAuthenticated: false,
            authHeaderSet: false,
            identifier: null,

            setAuthToken: (authToken) => {
                set({ authToken, isAuthenticated: !!authToken });
            },

            setUser: (user) => set({ user }),
            setAuthHeaderSet: (authHeaderSet) => set({ authHeaderSet }),
            setIdentifier: (identifier) => set({ identifier }),
            logout: () => set({ authToken: null, user: null, isAuthenticated: false, authHeaderSet: false, identifier: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAuthStore;
