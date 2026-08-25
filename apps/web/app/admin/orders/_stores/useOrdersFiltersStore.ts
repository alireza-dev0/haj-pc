import type { OrderStatus } from '@repo/types';
import { create } from 'zustand';

export type OrdersStatusFilter = OrderStatus | 'all';

interface OrdersFiltersState {
    q: string;
    status: OrdersStatusFilter;
    page: number;
    pageSize: number;
    setQ: (q: string) => void;
    setStatus: (status: OrdersStatusFilter) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
}

const defaultState = {
    q: '',
    status: 'all' as OrdersStatusFilter,
    page: 1,
    pageSize: 12,
};

export const useOrdersFiltersStore = create<OrdersFiltersState>((set) => ({
    ...defaultState,
    setQ: (q) => set({ q, page: 1 }),
    setStatus: (status) => set({ status, page: 1 }),
    setPage: (page) => set({ page }),
    resetFilters: () => set(defaultState),
}));
