import { clientApi } from '@/utils/api';
import type { ProductImageFormValue } from './product-form-values';

export type StorageUploadResult = {
    url: string;
    path: string;
};

export async function uploadImageFile(file: File): Promise<StorageUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await clientApi.post<StorageUploadResult>(
        '/storage/upload',
        formData,
    );

    return data;
}

export async function resolveProductImageUrls(
    images: ProductImageFormValue[],
): Promise<ProductImageFormValue[]> {
    const resolved: ProductImageFormValue[] = [];

    for (const image of images) {
        if (image.file) {
            const { url } = await uploadImageFile(image.file);
            resolved.push({ url, isPrimary: image.isPrimary });
        } else {
            resolved.push({
                url: image.url,
                isPrimary: image.isPrimary,
            });
        }
    }

    return resolved;
}

export function revokeIfBlobUrl(url: string) {
    if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
}
