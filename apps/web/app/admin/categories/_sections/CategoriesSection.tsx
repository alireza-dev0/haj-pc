'use client';

import React from 'react';
import Link from 'next/link';
import { EditIcon, EyeIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteCategoryDialog, {
    useDeleteCategoryDialog,
} from '../_components/DeleteCategoryDialog';
import { useCategories } from '../_hooks/useCategories';

export default function CategoriesSection() {
    const { data, isLoading, isError } = useCategories();
    const { target, open, openDialog, onOpenChange } =
        useDeleteCategoryDialog();

    return (
        <div className="w-full flex flex-col gap-4">
            <Button
                className="sm:hidden"
                variant="primary"
                render={({ children, ...props }) => (
                    <Link
                        href="/admin/categories/create"
                        className={props.className}
                    >
                        {children}
                    </Link>
                )}
            >
                افزودن دسته‌بندی
            </Button>

            <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-base">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                نام
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                اسلاگ
                            </th>
                            <th className="px-5 py-3 text-start text-sm font-medium text-text-secondary">
                                تعداد محصول
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
                                    <td className="px-5 py-4">
                                        <Skeleton className="h-5 w-28" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <Skeleton className="h-5 w-20" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <Skeleton className="h-5 w-10" />
                                    </td>
                                    <td className="px-5 py-4 text-end">
                                        <Skeleton className="h-8 w-8 rounded-md ms-auto" />
                                    </td>
                                </tr>
                            ))}

                        {isError && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-error"
                                >
                                    خطا در دریافت دسته‌بندی‌ها
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && data?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-text-secondary"
                                >
                                    دسته‌بندی‌ای یافت نشد
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            !isError &&
                            data?.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-b border-border last:border-b-0 hover:bg-elevated-surface"
                                >
                                    <td className="px-5 py-4">
                                        <Link
                                            href={`/admin/categories/${category.id}`}
                                            className="font-medium text-text-primary hover:text-info-darker"
                                        >
                                            {category.name}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            dir="ltr"
                                            className="text-sm text-text-secondary tabular-nums"
                                        >
                                            {category.slug}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge variant="secondary">
                                            <span
                                                dir="ltr"
                                                className="tabular-nums"
                                            >
                                                {category.productCount ?? 0}
                                            </span>
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4 text-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-md"
                                                    />
                                                }
                                            >
                                                <MoreVerticalIcon
                                                    className="size-5"
                                                    strokeWidth={1.5}
                                                />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="min-w-40">
                                                <DropdownMenuItem
                                                    render={
                                                        <Link
                                                            href={`/admin/categories/${category.id}`}
                                                        />
                                                    }
                                                >
                                                    <EyeIcon strokeWidth={1.5} />
                                                    <span>مشاهده جزئیات</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    render={
                                                        <Link
                                                            href={`/admin/categories/${category.id}/edit`}
                                                        />
                                                    }
                                                >
                                                    <EditIcon strokeWidth={1.5} />
                                                    <span>ویرایش</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        openDialog({
                                                            id: category.id,
                                                            name: category.name,
                                                        })
                                                    }
                                                >
                                                    <Trash2Icon strokeWidth={1.5} />
                                                    <span>حذف</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {target ? (
                <DeleteCategoryDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    categoryId={target.id}
                    categoryName={target.name}
                />
            ) : null}
        </div>
    );
}
