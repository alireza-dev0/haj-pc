import { IUser, UserRole } from '@repo/types';
import { create } from 'zustand';

interface UserPayload extends Pick<IUser, 'id' | 'email' | 'name' | 'role'> {}

interface AuthState {
    user: UserPayload | null;
    isLoading: boolean;
    setUser: (user: UserPayload | null) => void;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    setUser: (user) => set({ user }),
    login: async () => {
        set({ isLoading: true });

        set({
            user: {
                id: '1',
                email: 'test@test.com',
                name: 'Test User',
                role: "ADMIN",
            },
            isLoading: false,
        });
    },
    logout: async () => {
        set({ isLoading: true });

        set({
            user: null,
            isLoading: false,
        });
    },
}));
