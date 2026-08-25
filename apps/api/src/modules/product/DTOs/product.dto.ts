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

// =============================== Image DTO ===============================

export const ProductImageInputSchema = z.object({
    url: z.string({ error: 'آدرس تصویر الزامی است' }).trim().min(1, 'آدرس تصویر الزامی است'),
    sortOrder: z
        .number({ error: 'ترتیب تصویر باید عدد باشد' })
        .int('ترتیب تصویر باید عدد صحیح باشد')
        .optional(),
    isPrimary: z.boolean({ error: 'تصویر شاخص باید بولین باشد' }).optional(),
});

export class ProductImageDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه تصویر' })
    id!: string;

    @ApiProperty({ example: 'https://example.com/product.png', description: 'آدرس تصویر' })
    url!: string;

    @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
    sortOrder!: number;

    @ApiProperty({ example: true, description: 'تصویر شاخص' })
    isPrimary!: boolean;
}

export class ProductDetailDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه محصول' })
    id!: string;

    @ApiProperty({ example: 'پردازنده Intel Core i5-13400F', description: 'نام محصول' })
    name!: string;

    @ApiProperty({ example: 'پردازنده نسل ۱۳ اینتل', description: 'توضیحات محصول' })
    description!: string;

    @ApiProperty({ example: 15000000, description: 'قیمت محصول' })
    price!: number;

    @ApiProperty({ example: 10, description: 'موجودی' })
    stock!: number;

    @ApiProperty({ example: 'cat-1', description: 'شناسه دسته‌بندی' })
    categoryId!: string;

    @ApiProperty({ type: () => ProductCategoryDto_Response, description: 'دسته‌بندی محصول' })
    category!: ProductCategoryDto_Response;

    @ApiProperty({ type: () => [ProductImageDto_Response], description: 'تصاویر محصول' })
    images!: ProductImageDto_Response[];

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'تاریخ ایجاد' })
    createdAt!: Date;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'تاریخ به‌روزرسانی' })
    updatedAt!: Date;
}

export class ProductDeleteDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه محصول حذف‌شده' })
    id!: string;
}

// =============================== Create / Update DTO ===============================

export const CreateProductSchema = z.object({
    name: z.string({ error: 'نام محصول الزامی است' }).trim().min(1, 'نام محصول الزامی است'),
    categoryId: z
        .string({ error: 'دسته‌بندی الزامی است' })
        .trim()
        .min(1, 'دسته‌بندی الزامی است'),
    price: z
        .number({ error: 'قیمت باید عدد باشد' })
        .int('قیمت باید عدد صحیح باشد')
        .min(0, 'قیمت نمی‌تواند منفی باشد'),
    stock: z
        .number({ error: 'موجودی باید عدد باشد' })
        .int('موجودی باید عدد صحیح باشد')
        .min(0, 'موجودی نمی‌تواند منفی باشد'),
    description: z.string().optional(),
    images: z.array(ProductImageInputSchema).optional(),
});

export class CreateProductDto_Request extends createZodDto(CreateProductSchema) {}

export const UpdateProductSchema = z.object({
    name: z.string({ error: 'نام محصول الزامی است' }).trim().min(1, 'نام محصول الزامی است').optional(),
    categoryId: z
        .string({ error: 'دسته‌بندی الزامی است' })
        .trim()
        .min(1, 'دسته‌بندی الزامی است')
        .optional(),
    price: z
        .number({ error: 'قیمت باید عدد باشد' })
        .int('قیمت باید عدد صحیح باشد')
        .min(0, 'قیمت نمی‌تواند منفی باشد')
        .optional(),
    stock: z
        .number({ error: 'موجودی باید عدد باشد' })
        .int('موجودی باید عدد صحیح باشد')
        .min(0, 'موجودی نمی‌تواند منفی باشد')
        .optional(),
    description: z.string().optional(),
    images: z.array(ProductImageInputSchema).optional(),
});

export class UpdateProductDto_Request extends createZodDto(UpdateProductSchema) {}

