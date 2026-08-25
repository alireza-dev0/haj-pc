'use client';
import Image from 'next/image';
import React from 'react';
import { EditIcon, EyeIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
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

interface ProductCardProps extends Pick<IProduct, 'id' | 'name' | 'price' | 'thumbnail'> {
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
    return (
        <article
            key={id}
            className={cn(
                'relative w-full flex gap-3 p-3 rounded-xl bg-card',
                className,
            )}
            {...props}
        >
            <div className="relative aspect-square bg-elevated-surface w-1/3 min-w-26 rounded-lg overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={name}
                    fill
                    className='object-contain object-center'
                ></Image>
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
                            <DropdownMenuItem>
                                <EditIcon></EditIcon>
                                <span>ویرایش</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <EyeIcon></EyeIcon>
                                <span>مشاهده جزئیات</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                <Trash2Icon></Trash2Icon>
                                <span>حذف</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Link
                    href={`/admin/products/${id}`}
                    className="w-full text-wrap text-base font-medium text-text-primary hover:text-info-darker"
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
