import { clientApi } from '@/utils/api';
import { IUser } from '@repo/types';
import { isAxiosError } from 'axios';
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
    isLoading: true,
    setUser: (user) => set({ user }),
    login: async () => {
        set({ isLoading: true });

        try {
            const res = await clientApi.get<UserPayload>('/auth/me');

            set({ user: res.data });
        } catch (error) {
            set({ user: null });

            const isUnauthorized =
                isAxiosError(error) && error.response?.status === 401;

            if (!isUnauthorized) {
                toast.error('خطا در ورود به حساب کاربری');
            }
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        set({ isLoading: true });

        try {
            await clientApi.post('/auth/logout');
        } catch {
            toast.error('خطا در خروج از حساب کاربری');
        } finally {
            set({
                user: null,
                isLoading: false,
            });
            window.location.assign('/auth/signin');
        }
    },
}));
