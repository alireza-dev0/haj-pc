import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ORDER_STATUSES = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

// =============================== Query DTO ===============================

export const OrderQuerySchema = z.object({
    q: z.string().trim().optional().default(''),
    status: z
        .enum(ORDER_STATUSES, { error: 'وضعیت سفارش نامعتبر است' })
        .optional(),
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

export class OrderDto_Query extends createZodDto(OrderQuerySchema) {}

// =============================== Request DTO ===============================

export const UpdateOrderStatusSchema = z.object({
    status: z.enum(ORDER_STATUSES, { error: 'وضعیت سفارش نامعتبر است' }),
});

export class UpdateOrderStatusDto_Request extends createZodDto(
    UpdateOrderStatusSchema,
) {}

// =============================== Response DTO ===============================

export class OrderUserDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه کاربر' })
    id!: string;

    @ApiProperty({ example: 'علی رضایی', description: 'نام کاربر' })
    name!: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    email!: string;
}

export class OrderItemProductDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه محصول' })
    id!: string;

    @ApiProperty({ example: 'پردازنده Intel Core i5-13400F', description: 'نام محصول' })
    name!: string;
}

export class OrderItemDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه آیتم' })
    id!: string;

    @ApiProperty({ example: 2, description: 'تعداد' })
    quantity!: number;

    @ApiProperty({ example: 15000000, description: 'قیمت در زمان سفارش' })
    priceAtOrder!: number;

    @ApiProperty({ type: () => OrderItemProductDto_Response, description: 'محصول' })
    product!: OrderItemProductDto_Response;
}

export class OrderListItemDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه سفارش' })
    id!: string;

    @ApiProperty({
        example: 'PENDING',
        description: 'وضعیت سفارش',
        enum: ORDER_STATUSES,
    })
    status!: OrderStatusValue;

    @ApiProperty({ example: 30000000, description: 'مبلغ کل' })
    totalAmount!: number;

    @ApiProperty({ type: () => OrderUserDto_Response, description: 'مشتری' })
    user!: OrderUserDto_Response;

    @ApiProperty({ example: 2, description: 'تعداد آیتم‌های سفارش' })
    itemsCount!: number;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'تاریخ ایجاد' })
    createdAt!: Date;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'تاریخ به‌روزرسانی' })
    updatedAt!: Date;
}

export class OrderListDto_Response {
    @ApiProperty({ type: () => [OrderListItemDto_Response], description: 'لیست سفارش‌ها' })
    items!: OrderListItemDto_Response[];

    @ApiProperty({ example: 42, description: 'تعداد کل سفارش‌ها' })
    total!: number;

    @ApiProperty({ example: 1, description: 'شماره صفحه' })
    page!: number;

    @ApiProperty({ example: 12, description: 'تعداد آیتم در صفحه' })
    pageSize!: number;
}

export class OrderDetailDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه سفارش' })
    id!: string;

    @ApiProperty({
        example: 'PENDING',
        description: 'وضعیت سفارش',
        enum: ORDER_STATUSES,
    })
    status!: OrderStatusValue;

    @ApiProperty({ example: 30000000, description: 'مبلغ کل' })
    totalAmount!: number;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه کاربر' })
    userId!: string;

    @ApiProperty({ type: () => OrderUserDto_Response, description: 'مشتری' })
    user!: OrderUserDto_Response;

    @ApiProperty({ type: () => [OrderItemDto_Response], description: 'آیتم‌های سفارش' })
    items!: OrderItemDto_Response[];

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'تاریخ ایجاد' })
    createdAt!: Date;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'تاریخ به‌روزرسانی' })
    updatedAt!: Date;
}

export class OrderDeleteDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه سفارش حذف‌شده' })
    id!: string;
}
