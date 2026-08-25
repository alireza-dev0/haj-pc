import type { UserRole } from '@repo/types';
import { create } from 'zustand';

export type UsersRoleFilter = UserRole | 'all';

interface UsersFiltersState {
    q: string;
    role: UsersRoleFilter;
    page: number;
    limit: number;
    setQ: (q: string) => void;
    setRole: (role: UsersRoleFilter) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
}

const defaultState = {
    q: '',
    role: 'all' as UsersRoleFilter,
    page: 1,
    limit: 12,
};

export const useUsersFiltersStore = create<UsersFiltersState>((set) => ({
    ...defaultState,
    setQ: (q) => set({ q, page: 1 }),
    setRole: (role) => set({ role, page: 1 }),
    setPage: (page) => set({ page }),
    resetFilters: () => set(defaultState),
}));
