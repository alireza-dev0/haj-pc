'use client';

import { useQuery } from '@tanstack/react-query';
import type { ICategory } from '@repo/types';
import { clientApi } from '@/utils/api';

export type ProductCategory = Pick<ICategory, 'id' | 'name' | 'slug'>;

async function getCategories(): Promise<ProductCategory[]> {
    const { data } = await clientApi.get<ProductCategory[]>('/category');
    return data;
}

export function useCategories() {
    return useQuery({
        queryKey: ['product-categories'],
        queryFn: getCategories,
    });
}
