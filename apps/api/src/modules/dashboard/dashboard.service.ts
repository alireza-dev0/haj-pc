import { Injectable } from '@nestjs/common';
import { Prisma } from 'app/prisma/generated/client';
import { PrismaService } from '../shared/prisma.service';

export type DashboardPeriod = 'week' | 'month' | 'year';

type get_stats_output = {
    kpis: {
        totalRevenue: number;
        ordersCount: number;
        productsCount: number;
        lowStockCount: number;
    };
    revenueOverTime: { date: string; revenue: number }[];
    revenueByCategory: { category: string; revenue: number }[];
};

type RevenueBucketRow = { date: string; revenue: bigint | number };
type CategoryRevenueRow = { category: string; revenue: bigint | number };

function startOfUtcDay(date: Date): Date {
    return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
}

function getPeriodStart(period: DashboardPeriod, now: Date): Date {
    if (period === 'week') {
        const start = startOfUtcDay(now);
        start.setUTCDate(start.getUTCDate() - 6);
        return start;
    }

    if (period === 'month') {
        const start = startOfUtcDay(now);
        start.setUTCDate(start.getUTCDate() - 29);
        return start;
    }

    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
}

function buildBuckets(period: DashboardPeriod, from: Date, now: Date): string[] {
    if (period === 'year') {
        return Array.from({ length: 12 }, (_, index) => {
            const date = new Date(
                Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + index, 1),
            );
            return date.toISOString().slice(0, 10);
        });
    }

    const end = startOfUtcDay(now);
    const buckets: string[] = [];
    const cursor = new Date(from);

    while (cursor.getTime() <= end.getTime()) {
        buckets.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return buckets;
}

function toNumber(value: bigint | number | null | undefined): number {
    if (value == null) return 0;
    return Number(value);
}

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async getStats(period: DashboardPeriod): Promise<get_stats_output> {
        const now = new Date();
        const from = getPeriodStart(period, now);
        const buckets = buildBuckets(period, from, now);
        const truncSql =
            period === 'year' ? Prisma.sql`'month'` : Prisma.sql`'day'`;

        const [orderAgg, productsCount, lowStockCount, revenueRows, categoryRows] =
            await Promise.all([
                this.prisma.order.aggregate({
                    where: { createdAt: { gte: from } },
                    _sum: { totalAmount: true },
                    _count: { _all: true },
                }),
                this.prisma.product.count(),
                this.prisma.product.count({ where: { stock: { lte: 5 } } }),
                this.prisma.$queryRaw<RevenueBucketRow[]>`
                    SELECT to_char(
                        date_trunc(${truncSql}, o."createdAt" AT TIME ZONE 'UTC'),
                        'YYYY-MM-DD'
                    ) AS date,
                    COALESCE(SUM(o."totalAmount"), 0)::bigint AS revenue
                    FROM "Order" o
                    WHERE o."createdAt" >= ${from}
                    GROUP BY 1
                    ORDER BY 1
                `,
                this.prisma.$queryRaw<CategoryRevenueRow[]>`
                    SELECT c.name AS category,
                        COALESCE(SUM(oi.quantity * oi."priceAtOrder"), 0)::bigint AS revenue
                    FROM "OrderItem" oi
                    INNER JOIN "Order" o ON o.id = oi."orderId"
                    INNER JOIN "Product" p ON p.id = oi."productId"
                    INNER JOIN "Category" c ON c.id = p."categoryId"
                    WHERE o."createdAt" >= ${from}
                    GROUP BY c.name
                    HAVING SUM(oi.quantity * oi."priceAtOrder") > 0
                    ORDER BY revenue DESC
                `,
            ]);

        const revenueByDate = new Map(
            revenueRows.map((row) => [row.date, toNumber(row.revenue)]),
        );

        return {
            kpis: {
                totalRevenue: orderAgg._sum.totalAmount ?? 0,
                ordersCount: orderAgg._count._all,
                productsCount,
                lowStockCount,
            },
            revenueOverTime: buckets.map((date) => ({
                date,
                revenue: revenueByDate.get(date) ?? 0,
            })),
            revenueByCategory: categoryRows.map((row) => ({
                category: row.category,
                revenue: toNumber(row.revenue),
            })),
        };
    }
}
