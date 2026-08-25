'use client';

import React, { useMemo, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { Button } from '@/components/ui/button';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { priceFormater } from '@/utils/price';
import {
    DASHBOARD_PERIOD_ITEMS,
    type DashboardPeriod,
    useDashboardStats,
} from '../_hooks/useDashboardStats';

const CATEGORY_COLORS = [
    'var(--color-chart-primary)',
    'var(--color-chart-label)',
    'var(--color-chart-secondary)',
    'var(--color-chart-tertiary)',
    'var(--color-chart-axis)',
    'var(--color-chart-grid)',
    'var(--color-chart-secondary)',
    'var(--color-chart-tertiary)',
] as const;

const chartConfig = {
    revenue: {
        label: 'درآمد',
        color: 'var(--color-chart-primary)',
    },
} satisfies ChartConfig;

export default function RevenueByCategoryChart({
    className,
}: React.ComponentProps<'article'>) {
    const [period, setPeriod] = useState<DashboardPeriod>('month');
    const { data, isLoading, isError, isPlaceholderData } =
        useDashboardStats(period);

    const chartData = useMemo(() => {
        const rows = data?.revenueByCategory ?? [];
        const total = rows.reduce((sum, item) => sum + item.revenue, 0);

        return rows.map((item, index) => ({
            category: item.category,
            revenue: item.revenue,
            fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
            percent: total > 0 ? Math.round((item.revenue / total) * 100) : 0,
        }));
    }, [data?.revenueByCategory]);

    const showSkeleton = isLoading && !isPlaceholderData;

    return (
        <article
            className={cn(
                'flex w-full min-w-0 flex-col gap-4 rounded-xl bg-card p-4',
                className,
            )}
        >
            <header className="flex w-full items-center justify-between gap-4">
                <h1 className="text-md font-medium leading-snug text-text-primary">
                    درآمد به تفکیک دسته
                </h1>
                <Select
                    items={DASHBOARD_PERIOD_ITEMS}
                    value={period}
                    onValueChange={(value) =>
                        setPeriod(value as DashboardPeriod)
                    }
                >
                    <SelectTrigger
                        render={({ children, className, ...props }) => (
                            <Button
                                className="group shrink-0"
                                variant="secondary"
                                size="sm"
                                {...props}
                            >
                                {children}
                            </Button>
                        )}
                    >
                        <SelectValue placeholder="انتخاب بازه" />
                    </SelectTrigger>
                    <SelectContent
                        side="bottom"
                        sideOffset={10}
                        align="end"
                        alignItemWithTrigger={false}
                    >
                        <SelectGroup>
                            {DASHBOARD_PERIOD_ITEMS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </header>
            <main className="flex min-h-0 flex-1 flex-col gap-4">
                {showSkeleton ? (
                    <>
                        <Skeleton className="mx-auto size-56 rounded-full" />
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </>
                ) : isError ? (
                    <p className="flex flex-1 items-center justify-center py-10 text-sm text-error">
                        خطا در دریافت درآمد دسته‌ها
                    </p>
                ) : chartData.length === 0 ? (
                    <p className="flex flex-1 items-center justify-center py-10 text-sm text-text-secondary">
                        داده‌ای برای این بازه نیست
                    </p>
                ) : (
                    <>
                        <div dir="ltr" className="mx-auto w-full max-w-56">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-square h-auto w-full"
                            >
                                <PieChart key={period}>
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="dot"
                                                nameKey="revenue"
                                                labelFormatter={(
                                                    _,
                                                    tooltipPayload,
                                                ) =>
                                                    tooltipPayload[0]?.payload
                                                        ?.category
                                                }
                                                formatter={(value) => (
                                                    <span
                                                        dir="ltr"
                                                        className="ms-auto font-medium tabular-nums text-text-primary"
                                                    >
                                                        {priceFormater(
                                                            Number(value ?? 0),
                                                        )}
                                                    </span>
                                                )}
                                            />
                                        }
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="revenue"
                                        nameKey="category"
                                        innerRadius="58%"
                                        outerRadius="88%"
                                        paddingAngle={3}
                                        cornerRadius={8}
                                        stroke="var(--color-card)"
                                        strokeWidth={2}
                                        isAnimationActive
                                    >
                                        {chartData.map((item) => (
                                            <Cell
                                                key={item.category}
                                                fill={item.fill}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
                            {chartData.map((item) => (
                                <li
                                    key={item.category}
                                    className="flex min-w-0 items-center gap-2"
                                >
                                    <span
                                        className="size-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span className="min-w-0 truncate text-xs text-text-secondary">
                                        {item.category}
                                    </span>
                                    <span
                                        dir="ltr"
                                        className="ms-auto shrink-0 text-xs font-medium tabular-nums text-text-primary"
                                    >
                                        {item.percent}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </article>
    );
}
