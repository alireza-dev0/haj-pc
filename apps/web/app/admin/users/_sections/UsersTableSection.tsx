'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EditIcon, EyeIcon, Trash2Icon } from 'lucide-react';
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
import { useAuth } from '@/store/useAuth';
import { useUsers } from '../_hooks/useUsers';
import { useUsersFiltersStore } from '../_stores/useUsersFiltersStore';
import { UserRoleBadge } from '../_components/UserRoleBadge';
import { DeleteUserDialog } from '../_components/DeleteUserDialog';

function getPageNumbers(currentPage: number, totalPages: number) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage]);

    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    return Array.from(pages).sort((a, b) => a - b);
}

export default function UsersTableSection() {
    const { data, isLoading, isError } = useUsers();
    const { page, limit, setPage } = useUsersFiltersStore();
    const currentUserId = useAuth((state) => state.user?.id);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-160 text-base">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                نام
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                ایمیل
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                نقش
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
                                        <Skeleton className="h-5 w-32" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-48" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </td>
                                    <td className="px-5 py-3">
                                        <Skeleton className="ms-auto h-8 w-24" />
                                    </td>
                                </tr>
                            ))}

                        {isError && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-error"
                                >
                                    خطا در دریافت کاربران
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && data?.items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-text-secondary"
                                >
                                    کاربری یافت نشد
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            !isError &&
                            data?.items.map((user) => {
                                const isSelf = user.id === currentUserId;

                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-border last:border-b-0 hover:bg-elevated-surface"
                                    >
                                        <td className="px-5 py-3 font-medium text-text-primary">
                                            {user.name}
                                        </td>
                                        <td className="px-5 py-3 text-text-secondary">
                                            <span
                                                dir="ltr"
                                                className="inline-block"
                                            >
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <UserRoleBadge role={user.role} />
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end gap-1">
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
                                                            href={`/admin/users/${user.id}`}
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    nativeButton={false}
                                                    aria-label="ویرایش"
                                                    render={({
                                                        children,
                                                        ...props
                                                    }) => (
                                                        <Link
                                                            href={`/admin/users/${user.id}/edit`}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </Link>
                                                    )}
                                                >
                                                    <EditIcon
                                                        className="size-4"
                                                        strokeWidth={1.5}
                                                    />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="text-error hover:text-error"
                                                    disabled={isSelf}
                                                    aria-label="حذف"
                                                    onClick={() =>
                                                        setDeleteTarget({
                                                            id: user.id,
                                                            name: user.name,
                                                        })
                                                    }
                                                >
                                                    <Trash2Icon
                                                        className="size-4"
                                                        strokeWidth={1.5}
                                                    />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {!isLoading && !isError && total > limit && (
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

            <DeleteUserDialog
                user={deleteTarget}
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
            />
        </div>
    );
}
