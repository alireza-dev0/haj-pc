'use client';

import { useQuery } from '@tanstack/react-query';
import type { IOrdersList } from '@repo/types';
import { clientApi } from '@/utils/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useOrdersFiltersStore } from '../_stores/useOrdersFiltersStore';

export const ADMIN_ORDERS_QUERY_KEY = ['admin-orders'] as const;

async function getOrders({
    q,
    status,
    page,
    pageSize,
}: {
    q: string;
    status: string;
    page: number;
    pageSize: number;
}): Promise<IOrdersList> {
    const { data } = await clientApi.get<IOrdersList>('/order', {
        params: {
            q: q || undefined,
            status: status === 'all' ? undefined : status,
            page,
            pageSize,
        },
    });
    return data;
}

export function useOrders() {
    const { q, status, page, pageSize } = useOrdersFiltersStore();
    const debouncedQ = useDebounce(q, 400);

    return useQuery({
        queryKey: [
            ...ADMIN_ORDERS_QUERY_KEY,
            { q: debouncedQ, status, page, pageSize },
        ],
        queryFn: () =>
            getOrders({
                q: debouncedQ,
                status,
                page,
                pageSize,
            }),
    });
}
