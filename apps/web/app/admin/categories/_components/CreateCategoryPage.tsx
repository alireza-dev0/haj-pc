'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CategoryForm from './CategoryForm';
import HeaderSection from '../_sections/HeaderSection';
import { useCreateCategory } from '../_hooks/useCategoryMutations';

export default function CreateCategoryPage() {
    const router = useRouter();
    const createCategory = useCreateCategory();

    return (
        <div className="flex flex-col gap-8">
            <HeaderSection
                title="افزودن دسته‌بندی"
                description="دسته‌بندی جدید برای محصولات فروشگاه بسازید"
                backHref="/admin/categories"
            />
            <CategoryForm
                title="اطلاعات دسته‌بندی"
                description="نام الزامی است. اسلاگ در صورت خالی بودن از روی نام ساخته می‌شود."
                submitLabel="ایجاد دسته‌بندی"
                submittingLabel="در حال ایجاد..."
                cancelHref="/admin/categories"
                onSave={async (payload) => {
                    const category = await createCategory.mutateAsync(payload);
                    toast.success('دسته‌بندی با موفقیت ایجاد شد');
                    router.push(`/admin/categories/${category.id}`);
                }}
            />
        </div>
    );
}
