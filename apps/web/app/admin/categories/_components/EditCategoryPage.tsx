'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CategoryForm from './CategoryForm';
import HeaderSection from '../_sections/HeaderSection';
import { useCategory } from '../_hooks/useCategory';
import { useUpdateCategory } from '../_hooks/useCategoryMutations';

export default function EditCategoryPage({ id }: { id: string }) {
    const router = useRouter();
    const { data, isLoading, isError } = useCategory(id);
    const updateCategory = useUpdateCategory(id);

    return (
        <div className="flex flex-col gap-8">
            <HeaderSection
                title="ویرایش دسته‌بندی"
                description="نام، اسلاگ و توضیحات این دسته‌بندی را به‌روز کنید"
                backHref={`/admin/categories/${id}`}
            />

            {isLoading && (
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            )}

            {isError && (
                <p className="text-error">خطا در دریافت دسته‌بندی</p>
            )}

            {!isLoading && !isError && data && (
                <CategoryForm
                    title="اطلاعات دسته‌بندی"
                    description="اسلاگ باید یکتا باشد."
                    submitLabel="ذخیره تغییرات"
                    submittingLabel="در حال ذخیره..."
                    cancelHref={`/admin/categories/${data.id}`}
                    defaultValues={{
                        name: data.name,
                        slug: data.slug,
                        description: data.description ?? '',
                    }}
                    onSave={async (payload) => {
                        await updateCategory.mutateAsync(payload);
                        toast.success('دسته‌بندی به‌روزرسانی شد');
                        router.push(`/admin/categories/${data.id}`);
                    }}
                />
            )}
        </div>
    );
}
