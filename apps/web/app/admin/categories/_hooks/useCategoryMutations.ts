'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';
import {
    adminCategoriesQueryKey,
    adminCategoryQueryKey,
    type AdminCategory,
} from './useCategories';

export type CategoryPayload = {
    name: string;
    slug?: string;
    description?: string;
};

const productCategoriesQueryKey = ['product-categories'] as const;

function invalidateCategoryQueries(
    queryClient: ReturnType<typeof useQueryClient>,
    id?: string,
) {
    queryClient.invalidateQueries({ queryKey: adminCategoriesQueryKey });
    queryClient.invalidateQueries({ queryKey: productCategoriesQueryKey });
    if (id) {
        queryClient.invalidateQueries({ queryKey: adminCategoryQueryKey(id) });
    }
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CategoryPayload) => {
            const { data } = await clientApi.post<AdminCategory>(
                '/category',
                payload,
            );
            return data;
        },
        onSuccess: (category) => {
            invalidateCategoryQueries(queryClient, category.id);
        },
    });
}

export function useUpdateCategory(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CategoryPayload) => {
            const { data } = await clientApi.patch<AdminCategory>(
                `/category/${id}`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            invalidateCategoryQueries(queryClient, id);
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await clientApi.delete<{ ok: true }>(
                `/category/${id}`,
            );
            return data;
        },
        onSuccess: (_data, id) => {
            invalidateCategoryQueries(queryClient, id);
            queryClient.removeQueries({ queryKey: adminCategoryQueryKey(id) });
        },
    });
}
