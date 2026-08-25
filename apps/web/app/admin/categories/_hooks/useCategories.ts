'use client';

import { useQuery } from '@tanstack/react-query';
import type { ICategory } from '@repo/types';
import { clientApi } from '@/utils/api';

export type AdminCategory = ICategory;

export const adminCategoriesQueryKey = ['admin-categories'] as const;

export const adminCategoryQueryKey = (id: string) =>
    ['admin-category', id] as const;

async function getCategories(): Promise<AdminCategory[]> {
    const { data } = await clientApi.get<AdminCategory[]>('/category');
    return data;
}

export function useCategories() {
    return useQuery({
        queryKey: adminCategoriesQueryKey,
        queryFn: getCategories,
    });
}
