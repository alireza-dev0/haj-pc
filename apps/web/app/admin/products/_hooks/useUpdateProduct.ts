'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useProducts';
import {
    adminProductQueryKey,
    type ProductDetail,
    type ProductUpdatePayload,
} from './useProduct';

type UpdateProductVars = ProductUpdatePayload & { id: string };

async function updateProduct({
    id,
    ...payload
}: UpdateProductVars): Promise<ProductDetail> {
    const { data } = await clientApi.patch<ProductDetail>(
        `/product/${id}`,
        payload,
    );
    return data;
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({
                queryKey: ADMIN_PRODUCTS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
                queryKey: adminProductQueryKey(id),
            });
        },
    });
}
