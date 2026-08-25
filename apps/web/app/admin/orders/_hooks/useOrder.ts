'use client';

import { useQuery } from '@tanstack/react-query';
import type { IOrderDetail } from '@repo/types';
import { clientApi } from '@/utils/api';

export function adminOrderQueryKey(id: string) {
    return ['admin-order', id] as const;
}

async function getOrder(id: string): Promise<IOrderDetail> {
    const { data } = await clientApi.get<IOrderDetail>(`/order/${id}`);
    return data;
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: adminOrderQueryKey(id),
        queryFn: () => getOrder(id),
        enabled: Boolean(id),
    });
}
