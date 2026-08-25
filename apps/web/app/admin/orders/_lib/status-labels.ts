import type { OrderStatus } from '@repo/types';

export const ORDER_STATUSES: OrderStatus[] = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
];

export const orderStatusLabel: Record<OrderStatus, string> = {
    PENDING: 'در انتظار',
    PROCESSING: 'در حال پردازش',
    SHIPPED: 'ارسال شده',
    DELIVERED: 'تحویل شده',
};

export const ORDER_STATUS_ITEMS = ORDER_STATUSES.map((value) => ({
    label: orderStatusLabel[value],
    value,
}));

export const ORDER_STATUS_FILTER_ITEMS = [
    { label: 'همه وضعیت‌ها', value: 'all' as const },
    ...ORDER_STATUS_ITEMS,
];

export function getForwardStatuses(current: OrderStatus): OrderStatus[] {
    const index = ORDER_STATUSES.indexOf(current);
    if (index < 0) return [];
    return ORDER_STATUSES.slice(index + 1);
}

export function getNextStatus(current: OrderStatus): OrderStatus | null {
    return getForwardStatuses(current)[0] ?? null;
}
