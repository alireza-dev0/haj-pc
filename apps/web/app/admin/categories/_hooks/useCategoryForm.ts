'use client';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { getApiError } from '@/utils/api';
import type { CategoryPayload } from '../_hooks/useCategoryMutations';

export type CategoryFormValues = {
    name: string;
    slug: string;
    description: string;
};

type UseCategoryFormOptions = {
    defaultValues?: Partial<CategoryFormValues>;
    onSave: (payload: CategoryPayload) => Promise<unknown>;
};

type UseCategoryFormReturn = UseFormReturn<CategoryFormValues> & {
    onSubmit: ReturnType<UseFormReturn<CategoryFormValues>['handleSubmit']>;
};

export function useCategoryForm({
    defaultValues,
    onSave,
}: UseCategoryFormOptions): UseCategoryFormReturn {
    const form = useForm<CategoryFormValues>({
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            ...defaultValues,
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await onSave({
                name: values.name.trim(),
                slug: values.slug.trim() || undefined,
                description: values.description.trim(),
            });
        } catch (error) {
            const { message, fields } = getApiError(error);
            const hasFields = fields && Object.keys(fields).length > 0;

            if (hasFields) {
                for (const [name, messages] of Object.entries(fields)) {
                    if (
                        name === 'name' ||
                        name === 'slug' ||
                        name === 'description'
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
