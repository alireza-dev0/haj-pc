'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCategoryForm } from '../_hooks/useCategoryForm';
import type { CategoryPayload } from '../_hooks/useCategoryMutations';

type CategoryFormProps = {
    title: string;
    description: string;
    submitLabel: string;
    submittingLabel: string;
    cancelHref: string;
    defaultValues?: {
        name?: string;
        slug?: string;
        description?: string;
    };
    onSave: (payload: CategoryPayload) => Promise<unknown>;
};

export default function CategoryForm({
    title,
    description,
    submitLabel,
    submittingLabel,
    cancelHref,
    defaultValues,
    onSave,
}: CategoryFormProps) {
    const {
        register,
        onSubmit,
        formState: { errors, isSubmitting },
    } = useCategoryForm({ defaultValues, onSave });

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="category-form" onSubmit={onSubmit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.name || undefined}>
                            <FieldLabel htmlFor="name">نام</FieldLabel>
                            <Input
                                id="name"
                                autoComplete="off"
                                placeholder="مثلاً پردازنده"
                                aria-invalid={!!errors.name}
                                {...register('name', {
                                    required: 'نام الزامی است',
                                })}
                            />
                            <FieldError errors={[errors.name]} />
                        </Field>
                        <Field data-invalid={!!errors.slug || undefined}>
                            <FieldLabel htmlFor="slug">اسلاگ</FieldLabel>
                            <Input
                                id="slug"
                                dir="ltr"
                                autoComplete="off"
                                placeholder="cpu"
                                aria-invalid={!!errors.slug}
                                {...register('slug')}
                            />
                            <FieldDescription>
                                اگر خالی بماند، از روی نام ساخته می‌شود
                            </FieldDescription>
                            <FieldError errors={[errors.slug]} />
                        </Field>
                        <Field
                            data-invalid={!!errors.description || undefined}
                        >
                            <FieldLabel htmlFor="description">
                                توضیحات
                            </FieldLabel>
                            <Textarea
                                id="description"
                                rows={4}
                                placeholder="توضیح کوتاه درباره این دسته‌بندی"
                                aria-invalid={!!errors.description}
                                {...register('description')}
                            />
                            <FieldError errors={[errors.description]} />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    variant="secondary"
                    disabled={isSubmitting}
                    nativeButton={false}
                    render={<Link href={cancelHref} />}
                >
                    انصراف
                </Button>
                <Button
                    type="submit"
                    form="category-form"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? submittingLabel : submitLabel}
                </Button>
            </CardFooter>
        </Card>
    );
}
