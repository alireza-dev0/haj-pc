'use client';

import { useRef, useState } from 'react';
import {
    useFieldArray,
    useWatch,
    type Control,
    type FieldErrors,
    type UseFormGetValues,
    type UseFormSetValue,
} from 'react-hook-form';
import { ImagePlusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { revokeIfBlobUrl } from '../_lib/upload-image';
import type { ProductFormValues } from '../_lib/product-form-values';

type ProductImagesFieldProps = {
    control: Control<ProductFormValues>;
    errors: FieldErrors<ProductFormValues>;
    getValues: UseFormGetValues<ProductFormValues>;
    setValue: UseFormSetValue<ProductFormValues>;
};

export default function ProductImagesField({
    control,
    errors,
    getValues,
    setValue,
}: ProductImagesFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [urlDraft, setUrlDraft] = useState('');
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'images',
    });
    const images = useWatch({ control, name: 'images' }) ?? [];

    function setPrimaryImage(index: number) {
        const current = getValues('images');
        current.forEach((_, imageIndex) => {
            setValue(`images.${imageIndex}.isPrimary`, imageIndex === index, {
                shouldDirty: true,
            });
        });
    }

    function removeImage(index: number) {
        const url = getValues(`images.${index}.url`);
        const wasPrimary = getValues(`images.${index}.isPrimary`);
        remove(index);
        revokeIfBlobUrl(url);
        if (wasPrimary) {
            const remaining = getValues('images');
            if (remaining[0]) {
                setValue('images.0.isPrimary', true, { shouldDirty: true });
            }
        }
    }

    function addFiles(fileList: FileList | File[]) {
        const files = Array.from(fileList).filter((file) =>
            file.type.startsWith('image/'),
        );

        if (files.length === 0) {
            toast.error('فقط فایل تصویر مجاز است');
            return;
        }

        const current = getValues('images');
        files.forEach((file, index) => {
            append({
                url: URL.createObjectURL(file),
                file,
                isPrimary: current.length === 0 && index === 0,
            });
        });
    }

    function addFromUrl() {
        const trimmed = urlDraft.trim();
        if (!trimmed) {
            return;
        }

        try {
            new URL(trimmed);
        } catch {
            toast.error('آدرس تصویر نامعتبر است');
            return;
        }

        const current = getValues('images');
        append({
            url: trimmed,
            isPrimary: current.length === 0,
        });
        setUrlDraft('');
    }

    return (
        <Field data-invalid={!!errors.images || undefined}>
            <FieldLabel>تصاویر محصول</FieldLabel>
            <FieldDescription>
                تصاویر مربعی هستند. تصویر اصلی به‌عنوان شاخص در فهرست محصولات
                نمایش داده می‌شود.
            </FieldDescription>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                    const selected = event.target.files;
                    if (selected?.length) {
                        addFiles(selected);
                    }
                    event.target.value = '';
                }}
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {fields.map((item, index) => {
                    const url = images[index]?.url?.trim() ?? '';
                    const isPrimary = Boolean(images[index]?.isPrimary);

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                'relative aspect-square overflow-hidden rounded-lg border bg-elevated-surface transition-colors duration-150 ease-out',
                                isPrimary ? 'border-brand' : 'border-border',
                            )}
                        >
                            {url ? (
                                // User-provided remote URLs are not in next/image remotePatterns.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={url}
                                    alt=""
                                    className="size-full object-cover object-center"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center">
                                    <ImagePlusIcon
                                        className="size-8 text-text-muted"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            )}
                            <button
                                type="button"
                                className="absolute inset-0 cursor-pointer focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-brand-soft"
                                onClick={() => setPrimaryImage(index)}
                                aria-pressed={isPrimary}
                                aria-label={
                                    isPrimary
                                        ? 'تصویر اصلی'
                                        : 'انتخاب به‌عنوان تصویر اصلی'
                                }
                            />
                            {isPrimary ? (
                                <Badge className="pointer-events-none absolute top-2 inset-s-2 z-10">
                                    تصویر اصلی
                                </Badge>
                            ) : null}
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                className="absolute top-2 inset-e-2 z-10"
                                onClick={() => removeImage(index)}
                                aria-label="حذف تصویر"
                            >
                                <Trash2Icon
                                    className="size-3.5"
                                    strokeWidth={1.5}
                                />
                            </Button>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-elevated-surface text-text-secondary transition-colors duration-150 ease-out hover:bg-card hover:text-text-primary focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand-soft"
                >
                    <PlusIcon className="size-5" strokeWidth={1.5} />
                    <span className="text-xs">افزودن تصویر</span>
                </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <Field className="min-w-0 flex-1">
                    <FieldLabel htmlFor="image-url-add">آدرس تصویر</FieldLabel>
                    <Input
                        id="image-url-add"
                        dir="ltr"
                        value={urlDraft}
                        placeholder="https://example.com/image.png"
                        onChange={(event) => setUrlDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                addFromUrl();
                            }
                        }}
                    />
                </Field>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={addFromUrl}
                    disabled={!urlDraft.trim()}
                >
                    افزودن
                </Button>
            </div>

            <FieldError
                errors={
                    errors.images && !Array.isArray(errors.images)
                        ? [errors.images]
                        : undefined
                }
            />
        </Field>
    );
}
