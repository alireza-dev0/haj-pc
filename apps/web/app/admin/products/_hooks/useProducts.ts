'use client';

import { useQuery } from '@tanstack/react-query';
import type { ICategory, IProduct } from '@repo/types';
import { clientApi } from '@/utils/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useFiltersStore } from '../_stores/useFiltersStore';

export type AdminProduct = Pick<IProduct, 'id' | 'name' | 'price' | 'thumbnail'> & {
    category: Pick<ICategory, 'id' | 'name' | 'slug'>;
};

export type ProductsResult = {
    items: AdminProduct[];
    total: number;
};

type GetProductsParams = {
    search: string;
    categoryId: string | null;
    sort: 'newest' | 'oldest';
    page: number;
    pageSize: number;
};

async function getProducts({
    search,
    categoryId,
    sort,
    page,
    pageSize,
}: GetProductsParams): Promise<ProductsResult> {
    const { data } = await clientApi.get<ProductsResult>('/product', {
        params: {
            search: search || undefined,
            categoryId: categoryId || undefined,
            sort,
            page,
            pageSize,
        },
    });
    return data;
}

export function useProducts() {
    const { sort, search, categoryId, page, pageSize } = useFiltersStore();
    const debouncedSearch = useDebounce(search, 400);

    return useQuery({
        queryKey: [
            'admin-products',
            { sort, search: debouncedSearch, categoryId, page, pageSize },
        ],
        queryFn: () =>
            getProducts({
                sort,
                search: debouncedSearch,
                categoryId,
                page,
                pageSize,
            }),
    });
}
