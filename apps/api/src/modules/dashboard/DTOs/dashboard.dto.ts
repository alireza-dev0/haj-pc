import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DashboardPeriodSchema = z.enum(['week', 'month', 'year'], {
    error: 'بازه زمانی نامعتبر است',
});

export const DashboardStatsQuerySchema = z.object({
    period: DashboardPeriodSchema.optional().default('month'),
});

export class DashboardDto_Query extends createZodDto(DashboardStatsQuerySchema) {}

export class DashboardKpiDto_Response {
    @ApiProperty({ example: 185_000_000, description: 'مجموع مبلغ همه سفارش‌ها در بازه (ریال/تومان ذخیره‌شده)' })
    totalRevenue!: number;

    @ApiProperty({ example: 32, description: 'تعداد سفارش‌ها در بازه' })
    ordersCount!: number;

    @ApiProperty({ example: 22, description: 'تعداد کل محصولات' })
    productsCount!: number;

    @ApiProperty({ example: 5, description: 'تعداد محصولات با موجودی ۵ یا کمتر' })
    lowStockCount!: number;
}

export class DashboardRevenuePointDto_Response {
    @ApiProperty({ example: '2026-08-25', description: 'تاریخ باکت (YYYY-MM-DD)' })
    date!: string;

    @ApiProperty({ example: 12_500_000, description: 'درآمد این باکت' })
    revenue!: number;
}

export class DashboardCategoryRevenueDto_Response {
    @ApiProperty({ example: 'کارت گرافیک', description: 'نام دسته‌بندی' })
    category!: string;

    @ApiProperty({ example: 52_800_000, description: 'درآمد این دسته در بازه' })
    revenue!: number;
}

export class DashboardStatsDto_Response {
    @ApiProperty({ type: () => DashboardKpiDto_Response })
    kpis!: DashboardKpiDto_Response;

    @ApiProperty({ type: () => [DashboardRevenuePointDto_Response] })
    revenueOverTime!: DashboardRevenuePointDto_Response[];

    @ApiProperty({ type: () => [DashboardCategoryRevenueDto_Response] })
    revenueByCategory!: DashboardCategoryRevenueDto_Response[];
}
