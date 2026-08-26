'use client';
import React, { useState } from 'react';
import {
    EditIcon,
    EyeIcon,
    MoreVerticalIcon,
    PackageIcon,
    Trash2Icon,
} from 'lucide-react';
import type { ICategory, IProduct } from '@repo/types';
import Link from 'next/link';
import { priceFormater } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteProductDialog from './DeleteProductDialog';

export const ProductCardSkeleton = () => {
    return (
        <article className="relative w-full flex gap-3 p-3 rounded-xl bg-card">
            <Skeleton className="w-1/3 min-w-26 rounded-lg aspect-square" />
            <main className="w-full grow shrink flex flex-col items-start justify-between">
                <div className="w-full opacity-0"></div>
                <Skeleton className="w-1/3 h-5 rounded-md" />
                <div className="w-full flex items-center justify-between">
                    <Skeleton className="w-7 h-5 rounded-lg" />
                    <Skeleton className="w-7 h-5 rounded-lg" />
                </div>
            </main>
        </article>
    );
};

interface ProductCardProps extends Pick<
    IProduct,
    'id' | 'name' | 'price' | 'thumbnail'
> {
    category: Pick<ICategory, 'slug' | 'name'>;
}

export default function ProductCard({
    id,
    name,
    price,
    thumbnail,
    category,
    className,
    ...props
}: ProductCardProps & React.HTMLAttributes<HTMLDivElement>) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <article
            key={id}
            className={cn(
                'relative w-full flex gap-3 p-3 rounded-xl bg-card',
                className,
            )}
            {...props}
        >
            <div className="relative flex aspect-square w-1/3 min-w-26 items-center justify-center overflow-hidden rounded-lg bg-elevated-surface">
                {thumbnail ? (
                    // List thumbnails come from the primary image; URLs may be off-site.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={thumbnail}
                        alt={name}
                        className="size-full object-cover object-center"
                    />
                ) : (
                    <PackageIcon
                        className="size-8 text-text-muted"
                        strokeWidth={1.5}
                    />
                )}
            </div>
            <main className="w-full grow shrink flex flex-col items-start justify-between">
                <div className="w-full flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    className="p-0 absolute z-2 top-2 end-2 hover:bg-transparent"
                                />
                            }
                        >
                            <MoreVerticalIcon></MoreVerticalIcon>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-40">
                            <DropdownMenuItem
                                nativeButton={false}
                                render={
                                    <Link href={`/admin/products/${id}/edit`} />
                                }
                            >
                                <EditIcon></EditIcon>
                                <span>ویرایش</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                nativeButton={false}
                                render={<Link href={`/admin/products/${id}`} />}
                            >
                                <EyeIcon></EyeIcon>
                                <span>مشاهده جزئیات</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setIsDeleteOpen(true)}
                            >
                                <Trash2Icon></Trash2Icon>
                                <span>حذف</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <DeleteProductDialog
                    productId={id}
                    productName={name}
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                />
                <Link
                    href={`/admin/products/${id}`}
                    className="w-full text-wrap text-base font-medium text-text-primary hover:text-info-darker line-clamp-2"
                >
                    {name}
                </Link>
                <div className="w-full flex items-center justify-between">
                    <p className="text-sm font-bold text-text-secondary">
                        {priceFormater(price, 'IRT')}
                    </p>
                    <div className="flex flex-row-reverse gap-1.5">
                        <Badge variant="default">{category.name}</Badge>
                    </div>
                </div>
            </main>
        </article>
    );
}
