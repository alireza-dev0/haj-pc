'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteCategoryDialog, {
    useDeleteCategoryDialog,
} from './DeleteCategoryDialog';
import HeaderSection from '../_sections/HeaderSection';
import { useCategory } from '../_hooks/useCategory';

function formatJalaliDate(iso?: string) {
    if (!iso) return '—';

    const parts = new Intl.DateTimeFormat('en-US', {
        calendar: 'persian',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date(iso));

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value?.replace(/\D/g, '') ??
        '';

    return `${get('year')}/${get('month')}/${get('day')}`;
}

export default function CategoryDetailPage({ id }: { id: string }) {
    const router = useRouter();
    const { data, isLoading, isError } = useCategory(id);
    const { target, open, openDialog, onOpenChange } =
        useDeleteCategoryDialog();

    return (
        <div className="flex flex-col gap-8">
            <HeaderSection
                title={data?.name ?? 'جزئیات دسته‌بندی'}
                description="مشاهده اطلاعات دسته‌بندی و تعداد محصولات مرتبط"
                backHref="/admin/categories"
                action={
                    data ? (
                        <div className="hidden sm:flex items-center gap-2">
                            <Button
                                variant="secondary"
                                render={({ children, ...props }) => (
                                    <Link
                                        href={`/admin/categories/${data.id}/edit`}
                                        className={props.className}
                                    >
                                        {children}
                                    </Link>
                                )}
                            >
                                <EditIcon className="size-4" strokeWidth={1.5} />
                                ویرایش
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    openDialog({
                                        id: data.id,
                                        name: data.name,
                                    })
                                }
                            >
                                <Trash2Icon className="size-4" strokeWidth={1.5} />
                                حذف
                            </Button>
                        </div>
                    ) : null
                }
            />

            {isLoading && (
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-5 w-1/2" />
                    </CardContent>
                </Card>
            )}

            {isError && (
                <p className="text-error">خطا در دریافت دسته‌بندی</p>
            )}

            {!isLoading && !isError && data && (
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <CardTitle>{data.name}</CardTitle>
                        <CardDescription>
                            شناسه و مشخصات این دسته‌بندی
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <DetailRow label="اسلاگ">
                            <span dir="ltr" className="tabular-nums">
                                {data.slug}
                            </span>
                        </DetailRow>
                        <DetailRow label="تعداد محصول">
                            <Badge variant="secondary">
                                <span dir="ltr" className="tabular-nums">
                                    {data.productCount ?? 0}
                                </span>
                            </Badge>
                        </DetailRow>
                        <DetailRow label="توضیحات">
                            {data.description?.trim()
                                ? data.description
                                : 'توضیحی ثبت نشده است'}
                        </DetailRow>
                        <DetailRow label="تاریخ ایجاد">
                            <span dir="ltr" className="tabular-nums">
                                {formatJalaliDate(data.createdAt)}
                            </span>
                        </DetailRow>
                        <DetailRow label="آخرین به‌روزرسانی">
                            <span dir="ltr" className="tabular-nums">
                                {formatJalaliDate(data.updatedAt)}
                            </span>
                        </DetailRow>
                        <div className="flex sm:hidden items-center gap-2 pt-2">
                            <Button
                                variant="secondary"
                                className="grow"
                                render={({ children, ...props }) => (
                                    <Link
                                        href={`/admin/categories/${data.id}/edit`}
                                        className={props.className}
                                    >
                                        {children}
                                    </Link>
                                )}
                            >
                                ویرایش
                            </Button>
                            <Button
                                variant="destructive"
                                className="grow"
                                onClick={() =>
                                    openDialog({
                                        id: data.id,
                                        name: data.name,
                                    })
                                }
                            >
                                حذف
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {target ? (
                <DeleteCategoryDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    categoryId={target.id}
                    categoryName={target.name}
                    onDeleted={() => router.push('/admin/categories')}
                />
            ) : null}
        </div>
    );
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-text-secondary">{label}</span>
            <div className="text-base text-text-primary leading-relaxed">
                {children}
            </div>
        </div>
    );
}
