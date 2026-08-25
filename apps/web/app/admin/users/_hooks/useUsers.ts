'use client';

import { useQuery } from '@tanstack/react-query';
import type { IUsersList } from '@repo/types';
import { clientApi } from '@/utils/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useUsersFiltersStore } from '../_stores/useUsersFiltersStore';

async function getUsers({
    q,
    role,
    page,
    limit,
}: {
    q: string;
    role: string;
    page: number;
    limit: number;
}): Promise<IUsersList> {
    const { data } = await clientApi.get<IUsersList>('/users', {
        params: {
            q: q || undefined,
            role: role === 'all' ? undefined : role,
            page,
            limit,
        },
    });
    return data;
}

export function useUsers() {
    const { q, role, page, limit } = useUsersFiltersStore();
    const debouncedQ = useDebounce(q, 400);

    return useQuery({
        queryKey: [
            'admin-users',
            { q: debouncedQ, role, page, limit },
        ],
        queryFn: () =>
            getUsers({
                q: debouncedQ,
                role,
                page,
                limit,
            }),
    });
}
