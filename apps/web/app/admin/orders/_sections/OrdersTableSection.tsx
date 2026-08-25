'use client';

import React from 'react';
import Link from 'next/link';
import { EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useOrders } from '../_hooks/useOrders';
import { useOrdersFiltersStore } from '../_stores/useOrdersFiltersStore';
import { OrderStatusBadge } from '../_components/OrderStatusBadge';
import { formatJalaliDate, formatPrice, shortOrderId } from '../_lib/format';

function getPageNumbers(currentPage: number, totalPages: number) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage]);

    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    return Array.from(pages).sort((a, b) => a - b);
}

export default function OrdersTableSection() {
    const { data, isLoading, isError } = useOrders();
    const { page, pageSize, setPage } = useOrdersFiltersStore();

    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-200 text-base">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                شماره سفارش
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                مشتری
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                تاریخ
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                مبلغ
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                وضعیت
                            </th>
                            <th className="px-5 py-3 text-end text-sm font-medium text-text-secondary">
                                عملیات
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading &&
                            Array.from({ length: 6 }).map((_, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-border last:border-b-0"
                                >
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-24" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-32" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-24" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-28" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="ms-auto h-8 w-8" />
                                    </td>
                                </tr>
                            ))}

                        {isError && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-error"
                                >
                                    خطا در دریافت سفارش‌ها
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && data?.items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-text-secondary"
                                >
                                    سفارشی یافت نشد
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            !isError &&
                            data?.items.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-border last:border-b-0 hover:bg-elevated-surface"
                                >
                                    <td className="px-5 py-3 font-medium text-text-primary">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="hover:text-brand"
                                            title={order.id}
                                        >
                                            <span
                                                dir="ltr"
                                                className="tabular-nums"
                                            >
                                                #{shortOrderId(order.id)}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-text-primary">
                                                {order.user.name}
                                            </span>
                                            <span
                                                dir="ltr"
                                                className="inline-block text-sm text-text-secondary"
                                            >
                                                {order.user.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-text-secondary">
                                        <span
                                            dir="ltr"
                                            className="tabular-nums"
                                        >
                                            {formatJalaliDate(order.createdAt)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="font-medium">
                                            <span
                                                dir="ltr"
                                                className="tabular-nums"
                                            >
                                                {formatPrice(order.totalAmount)}
                                            </span>{' '}
                                            تومان
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <OrderStatusBadge
                                            status={order.status}
                                        />
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                nativeButton={false}
                                                aria-label="مشاهده"
                                                render={({
                                                    children,
                                                    ...props
                                                }) => (
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </Link>
                                                )}
                                            >
                                                <EyeIcon
                                                    className="size-4"
                                                    strokeWidth={1.5}
                                                />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {!isLoading && !isError && total > pageSize && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                text="قبلی"
                                className={
                                    page <= 1
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (page > 1) setPage(page - 1);
                                }}
                            />
                        </PaginationItem>

                        {pageNumbers.map((pageNumber, index) => {
                            const prevPage = pageNumbers[index - 1];
                            const showEllipsis =
                                prevPage !== undefined &&
                                pageNumber - prevPage > 1;

                            return (
                                <React.Fragment key={pageNumber}>
                                    {showEllipsis && (
                                        <PaginationItem>
                                            <span className="px-2 text-text-muted">
                                                ...
                                            </span>
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            isActive={pageNumber === page}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setPage(pageNumber);
                                            }}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                </React.Fragment>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                text="بعدی"
                                className={
                                    page >= totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (page < totalPages) setPage(page + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
