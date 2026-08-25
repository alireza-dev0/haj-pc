'use client';

import { useQuery } from '@tanstack/react-query';
import type { IPublicUser } from '@repo/types';
import { clientApi } from '@/utils/api';

async function getUser(id: string): Promise<IPublicUser> {
    const { data } = await clientApi.get<IPublicUser>(`/users/${id}`);
    return data;
}

export function useUser(id: string) {
    return useQuery({
        queryKey: ['admin-user', id],
        queryFn: () => getUser(id),
        enabled: !!id,
    });
}
