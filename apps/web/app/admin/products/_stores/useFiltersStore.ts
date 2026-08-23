import { create } from 'zustand';

export type ProductSort = 'newest' | 'oldest';

interface FiltersState {
    sort: ProductSort;
    search: string;
    categoryId: string | null;
    page: number;
    pageSize: number;
    setSort: (sort: ProductSort) => void;
    setSearch: (search: string) => void;
    setCategoryId: (categoryId: string | null) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
}

const defaultState = {
    sort: 'newest' as ProductSort,
    search: '',
    categoryId: null,
    page: 1,
    pageSize: 12,
};

export const useFiltersStore = create<FiltersState>((set) => ({
    ...defaultState,
    setSort: (sort) => set({ sort, page: 1 }),
    setSearch: (search) => set({ search, page: 1 }),
    setCategoryId: (categoryId) => set({ categoryId, page: 1 }),
    setPage: (page) => set({ page }),
    resetFilters: () => set(defaultState),
}));
