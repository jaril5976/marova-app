import { create } from 'zustand';

interface AuthStore {
    token: string | null;
    identifier: string | null; // email or phone
    setToken: (token: string | null) => void;
    setIdentifier: (identifier: string | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    identifier: null,
    setToken: (token) => set({ token }),
    setIdentifier: (identifier) => set({ identifier }),
    logout: () => set({ token: null, identifier: null }),
}));

export default useAuthStore;
