'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { clientApi, getApiError } from '@/utils/api';
import { useAuth } from '@/store/useAuth';

type SigninValues = {
    email: string;
    password: string;
};

type AuthUser = {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
};

export function useSignin() {
    const router = useRouter();
    const setUser = useAuth((s) => s.setUser);

    const form = useForm<SigninValues>({
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

            if (fields) {
                for (const [name, messages] of Object.entries(fields)) {
                    if (name === 'email' || name === 'password') {
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
