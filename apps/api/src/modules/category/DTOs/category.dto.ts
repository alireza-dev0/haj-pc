import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =============================== Request DTO ===============================
// zod schema with persian messages
export const CategoryCreateSchema = z.object({
    name: z
        .string({ error: 'نام الزامی است' })
        .trim()
        .min(1, 'نام الزامی است'),
    slug: z.string({ error: 'اسلاگ نامعتبر است' }).trim().optional(),
    description: z.string().trim().optional(),
});

export class CategoryDto_Create extends createZodDto(CategoryCreateSchema) {}

export const CategoryUpdateSchema = z.object({
    name: z
        .string({ error: 'نام الزامی است' })
        .trim()
        .min(1, 'نام الزامی است')
        .optional(),
    slug: z.string({ error: 'اسلاگ نامعتبر است' }).trim().optional(),
    description: z.string().trim().optional(),
});

export class CategoryDto_Update extends createZodDto(CategoryUpdateSchema) {}

// =============================== Response DTO ===============================

// maded with @nestjs/swagger with example and description
export class CategoryDto_Response {
    @ApiProperty({ example: 'cat-1', description: 'شناسه دسته‌بندی' })
    id!: string;

    @ApiProperty({ example: 'پردازنده', description: 'نام دسته‌بندی' })
    name!: string;

    @ApiProperty({ example: 'cpu', description: 'اسلاگ دسته‌بندی' })
    slug!: string;

    @ApiProperty({ example: 'انواع پردازنده دسکتاپ', description: 'توضیحات دسته‌بندی' })
    description!: string;

    @ApiProperty({ example: 12, description: 'تعداد محصولات این دسته‌بندی' })
    productCount!: number;

    @ApiProperty({
        example: '2026-01-15T10:00:00.000Z',
        description: 'تاریخ ایجاد',
    })
    createdAt!: string;

    @ApiProperty({
        example: '2026-01-15T10:00:00.000Z',
        description: 'تاریخ به‌روزرسانی',
    })
    updatedAt!: string;
}
