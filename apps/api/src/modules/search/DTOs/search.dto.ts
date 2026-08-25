import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SEARCH_GROUP_LIMIT_DEFAULT = 5;
export const SEARCH_GROUP_LIMIT_MAX = 10;

export const SearchQuerySchema = z.object({
    q: z
        .string({ error: 'عبارت جستجو الزامی است' })
        .trim()
        .min(1, 'عبارت جستجو الزامی است'),
    limit: z.coerce
        .number({ error: 'تعداد نتایج باید عدد باشد' })
        .int('تعداد نتایج باید عدد صحیح باشد')
        .min(1, 'تعداد نتایج باید حداقل ۱ باشد')
        .max(SEARCH_GROUP_LIMIT_MAX, 'تعداد نتایج حداکثر ۱۰ است')
        .optional()
        .default(SEARCH_GROUP_LIMIT_DEFAULT),
});

export class SearchDto_Query extends createZodDto(SearchQuerySchema) {}

export class SearchProductDto_Response {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'شناسه محصول',
    })
    id!: string;

    @ApiProperty({ example: 'پردازنده Intel Core i5-13400F', description: 'نام محصول' })
    name!: string;

    @ApiPropertyOptional({
        example: 'https://example.com/product.png',
        description: 'تصویر شاخص محصول',
        nullable: true,
    })
    thumbnail?: string | null;
}

export class SearchUserDto_Response {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'شناسه کاربر',
    })
    id!: string;

    @ApiProperty({ example: 'علی رضایی', description: 'نام کاربر' })
    name!: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    email!: string;

    @ApiProperty({
        example: 'USER',
        description: 'نقش کاربر',
        enum: ['USER', 'ADMIN'],
    })
    role!: 'USER' | 'ADMIN';
}

export class SearchOrderUserDto_Response {
    @ApiProperty({ example: 'علی رضایی', description: 'نام مشتری' })
    name!: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل مشتری' })
    email!: string;
}

export class SearchOrderDto_Response {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'شناسه سفارش',
    })
    id!: string;

    @ApiProperty({
        example: 'PENDING',
        description: 'وضعیت سفارش',
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
    })
    status!: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

    @ApiProperty({ example: 30000000, description: 'مبلغ کل' })
    totalAmount!: number;

    @ApiPropertyOptional({
        type: () => SearchOrderUserDto_Response,
        description: 'مشتری',
    })
    user?: SearchOrderUserDto_Response;
}

export class SearchCategoryDto_Response {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'شناسه دسته‌بندی',
    })
    id!: string;

    @ApiProperty({ example: 'پردازنده', description: 'نام دسته‌بندی' })
    name!: string;

    @ApiProperty({ example: 'cpu', description: 'اسلاگ دسته‌بندی' })
    slug!: string;
}

export class SearchDto_Response {
    @ApiProperty({ type: () => [SearchProductDto_Response], description: 'محصولات' })
    products!: SearchProductDto_Response[];

    @ApiProperty({ type: () => [SearchUserDto_Response], description: 'کاربران' })
    users!: SearchUserDto_Response[];

    @ApiProperty({ type: () => [SearchOrderDto_Response], description: 'سفارش‌ها' })
    orders!: SearchOrderDto_Response[];

    @ApiProperty({
        type: () => [SearchCategoryDto_Response],
        description: 'دسته‌بندی‌ها',
    })
    categories!: SearchCategoryDto_Response[];
}
