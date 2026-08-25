'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PackagePlusIcon } from 'lucide-react';
import ProductForm from './ProductForm';
import ProductPageHeader from './ProductPageHeader';
import { useCreateProduct } from '../_hooks/useCreateProduct';

export default function CreateProductPage() {
    const router = useRouter();
    const { mutateAsync } = useCreateProduct();

    return (
        <div className="flex flex-col gap-8">
            <ProductPageHeader
                title="افزودن محصول"
                description="محصول جدید را با مشخصات، موجودی و تصاویر ثبت کنید"
                icon={PackagePlusIcon}
            />
            <ProductForm
                mode="create"
                cancelHref="/admin/products"
                onSubmit={async (payload) => {
                    const product = await mutateAsync(payload);
                    toast.success('محصول با موفقیت ایجاد شد');
                    router.push(
                        product?.id
                            ? `/admin/products/${product.id}`
                            : '/admin/products',
                    );
                }}
            />
        </div>
    );
}
