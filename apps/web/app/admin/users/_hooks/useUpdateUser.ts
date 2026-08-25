'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';
import type { IPublicUser, UserRole } from '@repo/types';
import { useUser } from './useUser';

export type UpdateUserFormValues = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

type UseUpdateUserReturn = UseFormReturn<UpdateUserFormValues> & {
    onSubmit: ReturnType<UseFormReturn<UpdateUserFormValues>['handleSubmit']>;
    isLoading: boolean;
    isError: boolean;
};

export function useUpdateUser(id: string): UseUpdateUserReturn {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user, isLoading, isError } = useUser(id);

    const form = useForm<UpdateUserFormValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'USER',
        },
    });

    useEffect(() => {
        if (!user) return;
        form.reset({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
    }, [user, form]);

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const payload: {
                name: string;
                email: string;
                role: UserRole;
                password?: string;
            } = {
                name: values.name,
                email: values.email,
                role: values.role,
            };

            if (values.password) {
                payload.password = values.password;
            }

            await clientApi.patch<IPublicUser>(`/users/${id}`, payload);
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            await queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
            toast.success('تغییرات با موفقیت ذخیره شد');
            router.push(`/admin/users/${id}`);
        } catch (error) {
            const { message, fields } = getApiError(error);
            const hasFields = fields && Object.keys(fields).length > 0;

            if (hasFields) {
                for (const [name, messages] of Object.entries(fields)) {
                    if (
                        name === 'name' ||
                        name === 'email' ||
                        name === 'password' ||
                        name === 'role'
                    ) {
                        form.setError(name, { message: messages[0] });
                    }
                }
            }

            if (message && !hasFields) {
                toast.error(message);
            }
        }
    });

    return { ...form, onSubmit, isLoading, isError };
}
