'use client';

import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';
import { useAuth } from '@/store/useAuth';
import type { IUser } from '@repo/types';

export type ProfileFormValues = {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
};

type AuthUser = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type UseUpdateProfileReturn = UseFormReturn<ProfileFormValues> & {
    onSubmit: ReturnType<UseFormReturn<ProfileFormValues>['handleSubmit']>;
};

export function useUpdateProfile(): UseUpdateProfileReturn {
    const user = useAuth((s) => s.user);
    const setUser = useAuth((s) => s.setUser);

    const form = useForm<ProfileFormValues>({
        defaultValues: {
            name: user?.name ?? '',
            email: user?.email ?? '',
            currentPassword: '',
            newPassword: '',
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!user) return;

        reset({
            name: user.name,
            email: user.email,
            currentPassword: '',
            newPassword: '',
        });
    }, [user, reset]);

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const payload: {
                name: string;
                email: string;
                currentPassword?: string;
                newPassword?: string;
            } = {
                name: values.name,
                email: values.email,
            };

            if (values.newPassword) {
                payload.currentPassword = values.currentPassword;
                payload.newPassword = values.newPassword;
            }

            const { data } = await clientApi.patch<AuthUser>(
                '/auth/profile',
                payload,
            );
            setUser(data);
            toast.success('پروفایل با موفقیت به‌روزرسانی شد');
            reset({
                name: data.name,
                email: data.email,
                currentPassword: '',
                newPassword: '',
            });
        } catch (error) {
            const { message, fields } = getApiError(error);
            const hasFields = fields && Object.keys(fields).length > 0;

            if (hasFields) {
                for (const [name, messages] of Object.entries(fields)) {
                    if (
                        name === 'email' ||
                        name === 'name' ||
                        name === 'currentPassword' ||
                        name === 'newPassword'
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
