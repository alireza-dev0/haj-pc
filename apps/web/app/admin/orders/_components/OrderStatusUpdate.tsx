'use client';

import { useState } from 'react';
import type { OrderStatus } from '@repo/types';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useUpdateOrderStatus } from '../_hooks/useUpdateOrderStatus';
import {
    getForwardStatuses,
    getNextStatus,
    orderStatusLabel,
} from '../_lib/status-labels';

export function OrderStatusUpdate({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: OrderStatus;
}) {
    const nextStatus = getNextStatus(currentStatus);
    const forwardStatuses = getForwardStatuses(currentStatus);
    const statusItems = forwardStatuses.map((status) => ({
        label: orderStatusLabel[status],
        value: status,
    }));
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>(
        nextStatus ?? '',
    );
    const { mutate, isPending } = useUpdateOrderStatus();

    if (!nextStatus) {
        return (
            <p className="text-sm text-text-secondary">
                این سفارش تحویل شده و وضعیت آن قابل تغییر نیست.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select
                    items={statusItems}
                    value={selectedStatus || null}
                    onValueChange={(value) =>
                        setSelectedStatus((value as OrderStatus) ?? '')
                    }
                    disabled={isPending}
                >
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="انتخاب وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {statusItems.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    variant="secondary"
                    disabled={!selectedStatus || isPending}
                    onClick={() => {
                        if (!selectedStatus) return;
                        mutate({ id: orderId, status: selectedStatus });
                    }}
                >
                    به‌روزرسانی وضعیت
                </Button>
            </div>
            <Button
                variant="primary"
                disabled={isPending}
                onClick={() => mutate({ id: orderId, status: nextStatus })}
            >
                انتقال به «{orderStatusLabel[nextStatus]}»
            </Button>
        </div>
    );
}
