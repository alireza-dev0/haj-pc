import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StorageDeleteQuerySchema = z.object({
    path: z
        .string({ error: 'مسیر فایل الزامی است' })
        .trim()
        .min(1, 'مسیر فایل الزامی است'),
});

export class StorageDto_DeleteQuery extends createZodDto(StorageDeleteQuerySchema) {}

export class StorageUploadDto_Response {
    @ApiProperty({
        example:
            'https://xyzcompany.supabase.co/storage/v1/object/public/products/products/uuid.webp',
        description: 'آدرس عمومی تصویر برای ذخیره در ProductImage.url',
    })
    url!: string;

    @ApiProperty({
        example: 'products/uuid.webp',
        description: 'مسیر فایل داخل باکت Storage',
    })
    path!: string;
}

export class StorageDeleteDto_Response {
    @ApiProperty({ example: true, description: 'نتیجه حذف فایل' })
    success!: boolean;
}
