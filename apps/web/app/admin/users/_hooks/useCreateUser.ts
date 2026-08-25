'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';
import type { IPublicUser, UserRole } from '@repo/types';

export type CreateUserFormValues = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

type UseCreateUserReturn = UseFormReturn<CreateUserFormValues> & {
    onSubmit: ReturnType<UseFormReturn<CreateUserFormValues>['handleSubmit']>;
};

export function useCreateUser(): UseCreateUserReturn {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<CreateUserFormValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'USER',
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await clientApi.post<IPublicUser>('/users', values);
            await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('کاربر با موفقیت ایجاد شد');
            router.push('/admin/users');
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

    return { ...form, onSubmit };
}
