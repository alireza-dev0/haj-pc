'use client';

import React, { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

const PERSIAN_MONTHS = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
] as const;

const chartConfig: ChartConfig = {
    revenue: {
        label: 'درآمد',
        color: 'var(--color-chart-primary)',
    },
};

function formatAxisRevenue(value: number) {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(0)}M`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(0)}K`;
    }

    return value.toLocaleString('en-US');
}

function formatChartLabel(isoDate: string, period: DashboardPeriod) {
    const date = new Date(`${isoDate}T00:00:00Z`);

    if (period === 'year') {
        const jalaliMonth =
            Number(
                date.toLocaleDateString('fa-IR-u-nu-latn', { month: 'numeric' }),
            ) - 1;
        const jalaliYear = date.toLocaleDateString('fa-IR-u-nu-latn', {
            year: 'numeric',
        });
        const monthName = PERSIAN_MONTHS[jalaliMonth] ?? isoDate;
        return `${monthName} ${jalaliYear}`;
    }

    return date.toLocaleDateString('fa-IR-u-nu-latn', {
        month: 'numeric',
        day: 'numeric',
    });
}

export default function RevenueChart({
    className,
}: React.ComponentProps<'article'>) {
    const [period, setPeriod] = useState<DashboardPeriod>('month');
    const { data, isLoading, isError, isPlaceholderData } =
        useDashboardStats(period);

    const chartData = useMemo(
        () =>
            (data?.revenueOverTime ?? []).map((point) => ({
                label: formatChartLabel(point.date, period),
                revenue: point.revenue,
            })),
        [data?.revenueOverTime, period],
    );

    const showSkeleton = isLoading && !isPlaceholderData;

    return (
        <article
            className={cn(
                'flex w-full flex-col gap-4 rounded-xl bg-card p-4',
                className,
            )}
        >
            <header className="flex w-full items-center justify-between gap-4">
                <h1 className="text-md font-medium text-text-primary">
                    نمودار درآمد
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
                                className="group"
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
            <main className="w-full min-w-0 overflow-x-auto max-w-full scrollbar-auto">
                {showSkeleton ? (
                    <Skeleton className="h-70 w-full rounded-lg" />
                ) : isError ? (
                    <p className="flex h-70 items-center justify-center text-sm text-error">
                        خطا در دریافت نمودار درآمد
                    </p>
                ) : (
                    <div dir="ltr" className="w-full min-w-120">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-70 w-full"
                        >
                            <AreaChart
                                data={chartData}
                                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient
                                        id="revenue-fill"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-chart-primary)"
                                            stopOpacity={0.28}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-chart-primary)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="4 4"
                                />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    minTickGap={24}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    width={44}
                                    tickFormatter={formatAxisRevenue}
                                />
                                <ChartTooltip
                                    cursor={true}
                                    content={
                                        <ChartTooltipContent
                                            indicator="dot"
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
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-chart-primary)"
                                    strokeWidth={2}
                                    fill="url(#revenue-fill)"
                                    fillOpacity={1}
                                    dot={false}
                                    activeDot={{
                                        r: 4,
                                        strokeWidth: 2,
                                        fill: 'var(--color-brand)',
                                    }}
                                    isAnimationActive
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                )}
            </main>
        </article>
    );
}
