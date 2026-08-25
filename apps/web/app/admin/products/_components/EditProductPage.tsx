'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PencilIcon } from 'lucide-react';
import ProductForm, {
    ProductFormSkeleton,
    productToFormValues,
} from './ProductForm';
import ProductPageHeader from './ProductPageHeader';
import { useProduct } from '../_hooks/useProduct';
import { useUpdateProduct } from '../_hooks/useUpdateProduct';

export default function EditProductPage({ id }: { id: string }) {
    const router = useRouter();
    const { data, isLoading, isError } = useProduct(id);
    const { mutateAsync } = useUpdateProduct();

    return (
        <div className="flex flex-col gap-8">
            <ProductPageHeader
                title="ویرایش محصول"
                description={
                    data?.name
                        ? `در حال ویرایش «${data.name}»`
                        : 'مشخصات، موجودی و تصاویر محصول را به‌روزرسانی کنید'
                }
                icon={PencilIcon}
            />

            {isLoading && <ProductFormSkeleton />}

            {isError && (
                <p className="py-10 text-center text-error">
                    خطا در دریافت محصول
                </p>
            )}

            {!isLoading && !isError && !data && (
                <p className="py-10 text-center text-text-secondary">
                    محصول یافت نشد
                </p>
            )}

            {!isLoading && !isError && data && (
                <ProductForm
                    mode="edit"
                    defaultValues={productToFormValues(data)}
                    cancelHref={`/admin/products/${id}`}
                    onSubmit={async (payload) => {
                        await mutateAsync({ id, ...payload });
                        toast.success('محصول با موفقیت ویرایش شد');
                        router.push(`/admin/products/${id}`);
                    }}
                />
            )}
        </div>
    );
}
