import { IUser, UserRole } from '@repo/types';
import { create } from 'zustand';

interface UserPayload extends Pick<IUser, 'id' | 'email' | 'name' | 'role'> {}

interface AuthState {
    user: UserPayload | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    login: async () => {
        set({ isLoading: true });

        set({
            user: {
                id: '1',
                email: 'test@test.com',
                name: 'Test User',
                role: UserRole.ADMIN,
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
