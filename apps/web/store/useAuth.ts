import { clientApi } from '@/utils/api';
import { IUser, UserRole } from '@repo/types';
import { toast } from 'sonner';
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

        try {
            const res = await clientApi.get<UserPayload>('/auth/me');

            set({ user: res.data });
        } catch (error) {
            toast.error('خطا در ورود به حساب کاربری');
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        set({ isLoading: true });

        set({
            user: null,
            isLoading: false,
        });
    },
}));
