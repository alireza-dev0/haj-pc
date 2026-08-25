'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { IOrderDetail, OrderStatus } from '@repo/types';
import { clientApi, getApiError } from '@/utils/api';
import { ADMIN_ORDERS_QUERY_KEY } from './useOrders';
import { adminOrderQueryKey } from './useOrder';
import { orderStatusLabel } from '../_lib/status-labels';

async function updateOrderStatus({
    id,
    status,
}: {
    id: string;
    status: OrderStatus;
}): Promise<IOrderDetail> {
    const { data } = await clientApi.patch<IOrderDetail>(
        `/order/${id}/status`,
        { status },
    );
    return data;
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: (data, { id, status }) => {
            queryClient.invalidateQueries({
                queryKey: ADMIN_ORDERS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
                queryKey: adminOrderQueryKey(id),
            });
            queryClient.setQueryData(adminOrderQueryKey(id), data);
            toast.success(
                `وضعیت سفارش به «${orderStatusLabel[status]}» تغییر کرد`,
            );
        },
        onError: (error) => {
            const { message } = getApiError(error);
            toast.error(message ?? 'خطا در به‌روزرسانی وضعیت سفارش');
        },
    });
}
