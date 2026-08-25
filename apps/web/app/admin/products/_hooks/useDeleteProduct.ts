'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useProducts';
import { adminProductQueryKey } from './useProduct';

async function deleteProduct(id: string): Promise<void> {
    await clientApi.delete(`/product/${id}`);
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({
                queryKey: ADMIN_PRODUCTS_QUERY_KEY,
            });
            queryClient.removeQueries({
                queryKey: adminProductQueryKey(id),
            });
        },
    });
}
