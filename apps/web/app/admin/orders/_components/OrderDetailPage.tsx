'use client';

import Link from 'next/link';
import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrder } from '../_hooks/useOrder';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderStatusUpdate } from './OrderStatusUpdate';
import { formatJalaliDate, formatPrice, shortOrderId } from '../_lib/format';

export default function OrderDetailPage({ id }: { id: string }) {
    const { data, isLoading, isError } = useOrder(id);

    return (
        <div className="flex flex-col gap-8">
            <header className="w-full flex flex-col gap-3">
                <Link
                    href="/admin/orders"
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
                >
                    <ArrowRightIcon className="size-4" strokeWidth={1.5} />
                    بازگشت به سفارش‌ها
                </Link>
                <div className="flex items-center gap-3">
                    <ShoppingCartIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-xl font-semibold leading-snug">
                        {data ? (
                            <>
                                سفارش{' '}
                                <span dir="ltr" className="tabular-nums">
                                    #{shortOrderId(data.id)}
                                </span>
                            </>
                        ) : (
                            'جزئیات سفارش'
                        )}
                    </h1>
                </div>
                <div className="flex items-start gap-1.5">
                    <ArrowRightIcon
                        className="mt-0.75 size-4 text-text-secondary"
                        strokeWidth={1.5}
                    />
                    <p className="text-base text-text-secondary leading-relaxed">
                        مشاهده مشتری، اقلام و به‌روزرسانی وضعیت سفارش
                    </p>
                </div>
            </header>

            {isLoading && <OrderDetailSkeleton />}

            {isError && (
                <p className="py-10 text-center text-error">
                    خطا در دریافت سفارش
                </p>
            )}

            {!isLoading && !isError && !data && (
                <p className="py-10 text-center text-text-secondary">
                    سفارش یافت نشد
                </p>
            )}

            {!isLoading && !isError && data && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <Card>
                        <CardHeader>
                            <CardTitle>اقلام سفارش</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {data.items.length === 0 ? (
                                <p className="py-6 text-center text-sm text-text-secondary">
                                    آیتمی برای این سفارش ثبت نشده است
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-140 text-base">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="py-3 pe-4 text-start text-sm font-medium text-text-secondary">
                                                    محصول
                                                </th>
                                                <th className="px-4 py-3 text-start text-sm font-medium text-text-secondary">
                                                    تعداد
                                                </th>
                                                <th className="px-4 py-3 text-start text-sm font-medium text-text-secondary">
                                                    قیمت واحد
                                                </th>
                                                <th className="py-3 ps-4 text-start text-sm font-medium text-text-secondary">
                                                    جمع
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.map((item) => {
                                                const lineTotal =
                                                    item.quantity *
                                                    item.priceAtOrder;

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b border-border last:border-b-0"
                                                    >
                                                        <td className="py-3 pe-4 font-medium text-text-primary">
                                                            {item.product.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-text-secondary">
                                                            <span
                                                                dir="ltr"
                                                                className="tabular-nums"
                                                            >
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-text-secondary">
                                                            <span
                                                                dir="ltr"
                                                                className="tabular-nums"
                                                            >
                                                                {formatPrice(
                                                                    item.priceAtOrder,
                                                                )}
                                                            </span>{' '}
                                                            تومان
                                                        </td>
                                                        <td className="py-3 ps-4 font-medium">
                                                            <span
                                                                dir="ltr"
                                                                className="tabular-nums"
                                                            >
                                                                {formatPrice(
                                                                    lineTotal,
                                                                )}
                                                            </span>{' '}
                                                            تومان
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <Separator />
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-text-secondary">
                                    مبلغ کل
                                </span>
                                <span className="text-lg font-semibold">
                                    <span
                                        dir="ltr"
                                        className="tabular-nums"
                                    >
                                        {formatPrice(data.totalAmount)}
                                    </span>{' '}
                                    تومان
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>وضعیت سفارش</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-text-secondary">
                                        وضعیت فعلی
                                    </span>
                                    <OrderStatusBadge status={data.status} />
                                </div>
                                <Separator />
                                <OrderStatusUpdate
                                    key={data.status}
                                    orderId={data.id}
                                    currentStatus={data.status}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>مشتری</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <DetailRow label="نام">
                                    <span className="font-medium">
                                        {data.user.name}
                                    </span>
                                </DetailRow>
                                <Separator />
                                <DetailRow label="ایمیل">
                                    <span
                                        dir="ltr"
                                        className="inline-block text-text-secondary"
                                    >
                                        {data.user.email}
                                    </span>
                                </DetailRow>
                                <Separator />
                                <DetailRow label="تاریخ ثبت">
                                    <span
                                        dir="ltr"
                                        className="tabular-nums"
                                    >
                                        {formatJalaliDate(data.createdAt)}
                                    </span>
                                </DetailRow>
                                <Separator />
                                <DetailRow label="آخرین به‌روزرسانی">
                                    <span
                                        dir="ltr"
                                        className="tabular-nums"
                                    >
                                        {formatJalaliDate(data.updatedAt)}
                                    </span>
                                </DetailRow>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-text-secondary">{label}</span>
            {children}
        </div>
    );
}

function OrderDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-28 rounded-md" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-8 w-full rounded-md"
                        />
                    ))}
                </CardContent>
            </Card>
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-24 rounded-md" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Skeleton className="h-8 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-20 rounded-md" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-5 w-full rounded-md"
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
