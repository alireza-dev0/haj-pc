'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await clientApi.delete<{ ok: true }>(`/users/${id}`);
            return data;
        },
        onSuccess: async (_data, id) => {
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.removeQueries({ queryKey: ['admin-user', id] });
            toast.success('کاربر حذف شد');
        },
        onError: (error) => {
            const { message } = getApiError(error);
            toast.error(message ?? 'خطا در حذف کاربر');
        },
    });
}
