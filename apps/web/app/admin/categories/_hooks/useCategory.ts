'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';
import {
    adminCategoryQueryKey,
    type AdminCategory,
} from './useCategories';

async function getCategory(id: string): Promise<AdminCategory> {
    const { data } = await clientApi.get<AdminCategory>(`/category/${id}`);
    return data;
}

export function useCategory(id: string) {
    return useQuery({
        queryKey: adminCategoryQueryKey(id),
        queryFn: () => getCategory(id),
        enabled: Boolean(id),
    });
}
