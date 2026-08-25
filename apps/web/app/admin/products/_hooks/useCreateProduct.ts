'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useProducts';
import type { ProductDetail, ProductWritePayload } from './useProduct';

async function createProduct(
    payload: ProductWritePayload,
): Promise<ProductDetail> {
    const { data } = await clientApi.post<ProductDetail>('/product', payload);
    return data;
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ADMIN_PRODUCTS_QUERY_KEY,
            });
        },
    });
}
