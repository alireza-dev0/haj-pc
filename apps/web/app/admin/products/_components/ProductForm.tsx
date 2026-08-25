'use client';

import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getApiError } from '@/utils/api';
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
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { NumberStepper } from '@/components/ui/number-stepper';
import { useCategories } from '../_hooks/useCategories';
import type { ProductDetail, ProductWritePayload } from '../_hooks/useProduct';
import type { ProductFormValues } from '../_lib/product-form-values';
import {
    resolveProductImageUrls,
    revokeIfBlobUrl,
} from '../_lib/upload-image';
import ProductImagesField from './ProductImagesField';

const FORM_FIELDS = [
    'name',
    'categoryId',
    'price',
    'stock',
    'description',
    'images',
] as const;

export type { ProductFormValues };

export const emptyProductFormValues: ProductFormValues = {
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    images: [],
};

export function productToFormValues(product: ProductDetail): ProductFormValues {
    const images = [...(product.images ?? [])].sort(
        (a, b) => a.sortOrder - b.sortOrder,
    );

    return {
        name: product.name,
        categoryId: product.categoryId || product.category?.id || '',
        price: String(product.price),
        stock: String(product.stock),
        description: product.description ?? '',
        images: images.map((image) => ({
            url: image.url,
            isPrimary: image.isPrimary,
        })),
    };
}

function toPayload(values: ProductFormValues): ProductWritePayload {
    const filled = values.images.filter((image) => image.url.trim());
    const hasPrimary = filled.some((image) => image.isPrimary);

    const images = filled.map((image, index) => ({
        url: image.url.trim(),
        sortOrder: index,
        isPrimary: hasPrimary ? image.isPrimary : index === 0,
    }));

    const description = values.description.trim();

    return {
        name: values.name.trim(),
        categoryId: values.categoryId,
        price: Number(values.price),
        stock: Number(values.stock),
        ...(description ? { description } : {}),
        images,
    };
}

export function ProductFormSkeleton() {
    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-10 w-full rounded-sm" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

type ProductFormProps = {
    mode: 'create' | 'edit';
    defaultValues?: ProductFormValues;
    cancelHref: string;
    onSubmit: (payload: ProductWritePayload) => Promise<void>;
};

export default function ProductForm({
    mode,
    defaultValues = emptyProductFormValues,
    cancelHref,
    onSubmit,
}: ProductFormProps) {
    const { data: categories, isLoading: isCategoriesLoading } =
        useCategories();
    const categoryItems = (categories ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));
    const form = useForm<ProductFormValues>({
        defaultValues,
    });

    const {
        register,
        control,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

    const submit = handleSubmit(async (values) => {
        try {
            const images = await resolveProductImageUrls(values.images);
            setValue('images', images);
            for (const image of values.images) {
                revokeIfBlobUrl(image.url);
            }
            await onSubmit(toPayload({ ...values, images }));
        } catch (error) {
            const { message, fields: fieldErrors } = getApiError(error);
            const hasFields =
                fieldErrors && Object.keys(fieldErrors).length > 0;

            if (hasFields) {
                for (const [name, messages] of Object.entries(fieldErrors)) {
                    if (
                        FORM_FIELDS.includes(
                            name as (typeof FORM_FIELDS)[number],
                        )
                    ) {
                        form.setError(name as keyof ProductFormValues, {
                            message: messages[0],
                        });
                    }
                }
            }

            if (message && !hasFields) {
                toast.error(message);
            }
        }
    });

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>
                    {mode === 'create' ? 'اطلاعات محصول' : 'ویرایش اطلاعات'}
                </CardTitle>
                <CardDescription>
                    {mode === 'create'
                        ? 'نام، دسته‌بندی، قیمت و تصاویر محصول را وارد کنید'
                        : 'تغییرات را اعمال کنید و ذخیره را بزنید'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="product-form" onSubmit={submit} autoComplete="off">
                    <FieldGroup>
                        <Field data-invalid={!!errors.name || undefined}>
                            <FieldLabel htmlFor="name">نام محصول</FieldLabel>
                            <Input
                                id="name"
                                placeholder="مثلاً پردازنده Intel Core i5"
                                aria-invalid={!!errors.name}
                                {...register('name', {
                                    required: 'نام محصول الزامی است',
                                    minLength: {
                                        value: 2,
                                        message: 'نام محصول خیلی کوتاه است',
                                    },
                                })}
                            />
                            <FieldError errors={[errors.name]} />
                        </Field>

                        <Field data-invalid={!!errors.categoryId || undefined}>
                            <FieldLabel htmlFor="categoryId">
                                دسته‌بندی
                            </FieldLabel>
                            <Controller
                                control={control}
                                name="categoryId"
                                rules={{
                                    required: 'انتخاب دسته‌بندی الزامی است',
                                }}
                                render={({ field }) => (
                                    <Select
                                        items={categoryItems}
                                        value={field.value || null}
                                        onValueChange={(value) =>
                                            field.onChange(value ?? '')
                                        }
                                        disabled={isCategoriesLoading}
                                    >
                                        <SelectTrigger
                                            id="categoryId"
                                            className="w-full"
                                            aria-invalid={!!errors.categoryId}
                                        >
                                            <SelectValue placeholder="انتخاب دسته‌بندی" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categoryItems.map((item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[errors.categoryId]} />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field data-invalid={!!errors.price || undefined}>
                                <FieldLabel htmlFor="price">قیمت</FieldLabel>
                                <Input
                                    id="price"
                                    type="number"
                                    inputMode="numeric"
                                    dir="ltr"
                                    min={0}
                                    step="1"
                                    placeholder="0"
                                    aria-invalid={!!errors.price}
                                    {...register('price', {
                                        required: 'قیمت الزامی است',
                                        validate: (value) => {
                                            if (value.trim() === '') {
                                                return 'قیمت الزامی است';
                                            }
                                            const parsed = Number(value);
                                            if (!Number.isFinite(parsed)) {
                                                return 'قیمت باید عدد باشد';
                                            }
                                            if (parsed < 0) {
                                                return 'قیمت نمی‌تواند منفی باشد';
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                <FieldError errors={[errors.price]} />
                            </Field>

                            <Field data-invalid={!!errors.stock || undefined}>
                                <FieldLabel htmlFor="stock">موجودی</FieldLabel>
                                <Controller
                                    control={control}
                                    name="stock"
                                    rules={{
                                        required: 'موجودی الزامی است',
                                        validate: (value) => {
                                            if (value.trim() === '') {
                                                return 'موجودی الزامی است';
                                            }
                                            const parsed = Number(value);
                                            if (!Number.isInteger(parsed)) {
                                                return 'موجودی باید عدد صحیح باشد';
                                            }
                                            if (parsed < 0) {
                                                return 'موجودی نمی‌تواند منفی باشد';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <NumberStepper
                                            ref={field.ref}
                                            id="stock"
                                            name={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            min={0}
                                            placeholder="0"
                                            aria-invalid={!!errors.stock}
                                        />
                                    )}
                                />
                                <FieldError errors={[errors.stock]} />
                            </Field>
                        </div>

                        <Field data-invalid={!!errors.description || undefined}>
                            <FieldLabel htmlFor="description">
                                توضیحات
                            </FieldLabel>
                            <Textarea
                                id="description"
                                rows={5}
                                placeholder="توضیحات محصول (اختیاری)"
                                aria-invalid={!!errors.description}
                                {...register('description')}
                            />
                            <FieldError errors={[errors.description]} />
                        </Field>

                        <ProductImagesField
                            control={control}
                            errors={errors}
                            getValues={getValues}
                            setValue={setValue}
                        />
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
                    form="product-form"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'در حال ذخیره...'
                        : mode === 'create'
                          ? 'ایجاد محصول'
                          : 'ذخیره تغییرات'}
                </Button>
            </CardFooter>
        </Card>
    );
}
