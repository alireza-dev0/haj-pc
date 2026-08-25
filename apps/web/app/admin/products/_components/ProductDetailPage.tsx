'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PencilIcon, PackageIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct, type ProductImage } from '../_hooks/useProduct';
import ProductPageHeader from './ProductPageHeader';
import DeleteProductDialog from './DeleteProductDialog';

function formatJalaliDate(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        calendar: 'persian',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);

    const lookup: Record<string, string> = {};
    for (const part of parts) {
        lookup[part.type] = part.value;
    }

    const year = (lookup.year ?? '').replace(/\D/g, '');
    const month = lookup.month;
    const day = lookup.day;

    if (!year || !month || !day) {
        return '—';
    }

    return `${year}/${month}/${day}`;
}

function formatPrice(value: number) {
    return Intl.NumberFormat('en-US').format(value);
}

function sortImages(images: ProductImage[]) {
    return [...images].sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) {
            return a.isPrimary ? -1 : 1;
        }
        return a.sortOrder - b.sortOrder;
    });
}

export default function ProductDetailPage({ id }: { id: string }) {
    const router = useRouter();
    const { data, isLoading, isError } = useProduct(id);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const images = useMemo(
        () => sortImages(data?.images ?? []),
        [data?.images],
    );

    return (
        <div className="flex flex-col gap-8">
            <ProductPageHeader
                title={data?.name ?? 'جزئیات محصول'}
                description="مشاهده مشخصات، موجودی و تصاویر محصول"
                icon={PackageIcon}
                actions={
                    data ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                nativeButton={false}
                                render={
                                    <Link href={`/admin/products/${id}/edit`} />
                                }
                            >
                                <PencilIcon
                                    className="size-4"
                                    strokeWidth={1.5}
                                />
                                <span>ویرایش</span>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteOpen(true)}
                            >
                                <Trash2Icon
                                    className="size-4"
                                    strokeWidth={1.5}
                                />
                                <span>حذف</span>
                            </Button>
                        </div>
                    ) : undefined
                }
            />

            {isLoading && <ProductDetailSkeleton />}

            {isError && (
                <p className="py-10 text-center text-error">
                    خطا در دریافت محصول
                </p>
            )}

            {!isLoading && !isError && !data && (
                <p className="py-10 text-center text-text-secondary">
                    محصول یافت نشد
                </p>
            )}

            {!isLoading && !isError && data && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <Card>
                        <CardHeader>
                            <CardTitle>تصاویر محصول</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <ProductImageGallery
                                images={images}
                                alt={data.name}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>مشخصات</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <DetailRow label="دسته‌بندی">
                                    <Badge variant="default">
                                        {data.category?.name ?? '—'}
                                    </Badge>
                                </DetailRow>
                                <Separator />
                                <DetailRow label="قیمت">
                                    <span className="font-medium">
                                        <span
                                            dir="ltr"
                                            className="tabular-nums"
                                        >
                                            {formatPrice(data.price)}
                                        </span>{' '}
                                        تومان
                                    </span>
                                </DetailRow>
                                <Separator />
                                <DetailRow label="موجودی">
                                    {data.stock <= 0 ? (
                                        <Badge variant="warning">ناموجود</Badge>
                                    ) : (
                                        <span
                                            dir="ltr"
                                            className="tabular-nums font-medium"
                                        >
                                            {Intl.NumberFormat('en-US').format(
                                                data.stock,
                                            )}
                                        </span>
                                    )}
                                </DetailRow>
                                <Separator />
                                <DetailRow label="تاریخ ایجاد">
                                    <span dir="ltr" className="tabular-nums">
                                        {formatJalaliDate(data.createdAt)}
                                    </span>
                                </DetailRow>
                                <Separator />
                                <DetailRow label="آخرین ویرایش">
                                    <span dir="ltr" className="tabular-nums">
                                        {formatJalaliDate(data.updatedAt)}
                                    </span>
                                </DetailRow>
                                <div className="flex sm:hidden items-center gap-2 pt-2">
                                    <Button
                                        variant="secondary"
                                        className="grow"
                                        nativeButton={false}
                                        render={
                                            <Link
                                                href={`/admin/products/${id}/edit`}
                                            />
                                        }
                                    >
                                        ویرایش
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="grow"
                                        onClick={() => setIsDeleteOpen(true)}
                                    >
                                        حذف
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>توضیحات</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.description ? (
                                    <p className="text-base leading-relaxed text-text-primary whitespace-pre-wrap">
                                        {data.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-text-secondary">
                                        توضیحی ثبت نشده است
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {data ? (
                <DeleteProductDialog
                    productId={data.id}
                    productName={data.name}
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    onDeleted={() => router.push('/admin/products')}
                />
            ) : null}
        </div>
    );
}

function ProductImageGallery({
    images,
    alt,
}: {
    images: ProductImage[];
    alt: string;
}) {
    if (images.length === 0) {
        return (
            <div className="flex aspect-square max-h-80 items-center justify-center rounded-lg bg-elevated-surface">
                <PackageIcon
                    className="size-10 text-text-muted"
                    strokeWidth={1.5}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-elevated-surface"
                >
                    {/* User-provided remote URLs are not in next/image remotePatterns. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image.url}
                        alt={image.isPrimary ? `${alt} — تصویر اصلی` : alt}
                        className="size-full object-cover object-center"
                    />
                    {image.isPrimary ? (
                        <Badge className="absolute top-2 inset-s-2">
                            تصویر اصلی
                        </Badge>
                    ) : null}
                </div>
            ))}
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
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-text-secondary">{label}</span>
            {children}
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-24 rounded-md" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="aspect-square w-full rounded-lg"
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-24 rounded-md" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-5 w-full rounded-md"
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
