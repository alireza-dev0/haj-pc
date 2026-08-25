import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =============================== Query DTO ===============================
// zod schema with persian messages
export const ProductQuerySchema = z.object({
    search: z.string().trim().optional().default(''),
    categoryId: z.string().optional(),
    sort: z
        .enum(['newest', 'oldest'], { error: 'ترتیب نامعتبر است' })
        .optional()
        .default('newest'),
    page: z.coerce
        .number({ error: 'شماره صفحه باید عدد باشد' })
        .int('شماره صفحه باید عدد صحیح باشد')
        .min(1, 'شماره صفحه باید حداقل ۱ باشد')
        .optional()
        .default(1),
    pageSize: z.coerce
        .number({ error: 'تعداد آیتم در صفحه باید عدد باشد' })
        .int('تعداد آیتم در صفحه باید عدد صحیح باشد')
        .min(1, 'تعداد آیتم در صفحه باید حداقل ۱ باشد')
        .max(48, 'تعداد آیتم در صفحه حداکثر ۴۸ است')
        .optional()
        .default(12),
});

// dto class that made from zod schema with nestjs-zod
export class ProductDto_Query extends createZodDto(ProductQuerySchema) {}

// =============================== Response DTO ===============================

// maded with @nestjs/swagger with example and description
export class ProductCategoryDto_Response {
    @ApiProperty({ example: 'cat-1', description: 'شناسه دسته‌بندی' })
    id!: string;

    @ApiProperty({ example: 'پردازنده', description: 'نام دسته‌بندی' })
    name!: string;

    @ApiProperty({ example: 'cpu', description: 'اسلاگ دسته‌بندی' })
    slug!: string;
}

export class ProductDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه محصول' })
    id!: string;

    @ApiProperty({ example: 'پردازنده Intel Core i5-13400F', description: 'نام محصول' })
    name!: string;

    @ApiProperty({ example: 15000000, description: 'قیمت محصول' })
    price!: number;

    @ApiProperty({ example: 'https://example.com/product.png', description: 'تصویر شاخص محصول' })
    thumbnail!: string;

    @ApiProperty({ type: () => ProductCategoryDto_Response, description: 'دسته‌بندی محصول' })
    category!: ProductCategoryDto_Response;
}

export class ProductListDto_Response {
    @ApiProperty({ type: () => [ProductDto_Response], description: 'لیست محصولات' })
    items!: ProductDto_Response[];

    @ApiProperty({ example: 42, description: 'تعداد کل محصولات' })
    total!: number;
}
