'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';
import type { ProductCategory } from './useCategories';

export type ProductImage = {
    id: string;
    url: string;
    sortOrder: number;
    isPrimary: boolean;
};

export type ProductDetail = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    category: ProductCategory;
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;
};

export type ProductImageInput = {
    url: string;
    sortOrder?: number;
    isPrimary?: boolean;
};

export type ProductWritePayload = {
    name: string;
    categoryId: string;
    price: number;
    stock: number;
    description?: string;
    images?: ProductImageInput[];
};

export type ProductUpdatePayload = Partial<ProductWritePayload>;

export function adminProductQueryKey(id: string) {
    return ['admin-product', id] as const;
}

async function getProduct(id: string): Promise<ProductDetail> {
    const { data } = await clientApi.get<ProductDetail>(`/product/${id}`);
    return data;
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: adminProductQueryKey(id),
        queryFn: () => getProduct(id),
        enabled: Boolean(id),
    });
}
