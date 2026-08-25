'use client';

import { useQuery } from '@tanstack/react-query';
import type { IGlobalSearch } from '@repo/types';
import { clientApi } from '@/utils/api';
import { useDebounce } from '@/hooks/use-debounce';

export const ADMIN_GLOBAL_SEARCH_QUERY_KEY = ['admin-global-search'] as const;
export const SEARCH_MIN_QUERY_LENGTH = 1;
export const SEARCH_DEBOUNCE_MS = 300;

async function getGlobalSearch(q: string): Promise<IGlobalSearch> {
    const { data } = await clientApi.get<IGlobalSearch>('/search', {
        params: { q },
    });
    return data;
}

export function useGlobalSearch(q: string) {
    const trimmed = q.trim();
    const debouncedQ = useDebounce(trimmed, SEARCH_DEBOUNCE_MS);
    const enabled = debouncedQ.length >= SEARCH_MIN_QUERY_LENGTH;

    const query = useQuery({
        queryKey: [...ADMIN_GLOBAL_SEARCH_QUERY_KEY, debouncedQ],
        queryFn: () => getGlobalSearch(debouncedQ),
        enabled,
    });

    return {
        ...query,
        debouncedQ,
        isDebouncing:
            trimmed.length >= SEARCH_MIN_QUERY_LENGTH && trimmed !== debouncedQ,
    };
}

export function getFirstSearchHref(
    data: IGlobalSearch | undefined,
): string | null {
    const product = data?.products[0];
    if (product) return `/admin/products/${product.id}`;

    const user = data?.users[0];
    if (user) return `/admin/users/${user.id}`;

    const order = data?.orders[0];
    if (order) return `/admin/orders/${order.id}`;

    const category = data?.categories[0];
    if (category) return `/admin/categories/${category.id}`;

    return null;
}

export function hasSearchResults(data: IGlobalSearch | undefined): boolean {
    if (!data) return false;
    return (
        data.products.length > 0 ||
        data.users.length > 0 ||
        data.orders.length > 0 ||
        data.categories.length > 0
    );
}
