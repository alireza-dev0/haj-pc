'use client';

import { useRouter } from 'next/navigation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';
import { useAuth } from '@/store/useAuth';
import { IUser } from '@repo/types';

type SignupValues = {
    name: string;
    email: string;
    password: string;
};

type AuthUser = Pick<IUser, "id" | "name" | "email" | "role">

type UseSignupReturn = UseFormReturn<SignupValues> & {
    onSubmit: ReturnType<UseFormReturn<SignupValues>['handleSubmit']>;
};

export function useSignup(): UseSignupReturn {
    const router = useRouter();
    const setUser = useAuth((s) => s.setUser);

    const form = useForm<SignupValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const { data } = await clientApi.post<AuthUser>(
                '/auth/signup',
                values,
            );
            setUser(data);
            toast.success('ثبت‌نام با موفقیت انجام شد');
            router.push('/');
        } catch (error) {
            const { message, fields } = getApiError(error);

            if (fields) {
                for (const [name, messages] of Object.entries(fields)) {
                    if (
                        name === 'email' ||
                        name === 'password' ||
                        name === 'name'
                    ) {
                        form.setError(name, { message: messages[0] });
                    }
                }
            }

            const hasFields = fields && Object.keys(fields).length > 0;
            if (message && !hasFields) {
                toast.error(message);
            }
        }
    });

    return { ...form, onSubmit };
}
