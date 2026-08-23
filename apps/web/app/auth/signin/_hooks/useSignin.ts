'use client';

import { useRouter } from 'next/navigation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';
import { useAuth } from '@/store/useAuth';
import type { IUser } from '@repo/types';

export type SigninFormValues = {
    email: string;
    password: string;
};

type AuthUser = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type UseSigninReturn = UseFormReturn<SigninFormValues> & {
    onSubmit: ReturnType<UseFormReturn<SigninFormValues>['handleSubmit']>;
};

export function useSignin(): UseSigninReturn {
    const router = useRouter();
    const setUser = useAuth((s) => s.setUser);

    const form = useForm<SigninFormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const { data } = await clientApi.post<AuthUser>(
                '/auth/signin',
                values,
            );
            setUser(data);
            toast.success('ورود با موفقیت انجام شد');
            router.push('/');
        } catch (error) {
            const { message, fields } = getApiError(error);
            const hasFields = fields && Object.keys(fields).length > 0;

            if (hasFields) {
                for (const [name, messages] of Object.entries(fields)) {
                    if (name === 'email' || name === 'password') {
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
