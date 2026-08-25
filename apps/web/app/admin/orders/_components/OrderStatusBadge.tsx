'use client';

import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@repo/types';
import { orderStatusLabel } from '../_lib/status-labels';

const statusVariant: Record<
    OrderStatus,
    'warning' | 'info' | 'default' | 'success'
> = {
    PENDING: 'warning',
    PROCESSING: 'info',
    SHIPPED: 'default',
    DELIVERED: 'success',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <Badge variant={statusVariant[status]}>
            {orderStatusLabel[status]}
        </Badge>
    );
}
