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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Period = 'yearly' | 'monthly' | 'daily';

const PERIOD_LABELS: Record<Period, string> = {
    yearly: 'سالانه',
    monthly: 'ماهانه',
    daily: 'روزانه',
};

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

const DAILY_HOURS = [
    '06:00',
    '09:00',
    '12:00',
    '15:00',
    '18:00',
    '21:00',
] as const;

function formatAxisRevenue(value: number) {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(0)}M`;
    }

    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(0)}K`;
    }

    return value.toLocaleString('en-US');
}

function createYearlyData() {
    return PERSIAN_MONTHS.map((label, index) => ({
        label,
        revenue:
            32_000_000 +
            Math.round(Math.sin(index * 0.75) * 14_000_000) +
            index * 1_800_000,
    }));
}

function createMonthlyData() {
    return Array.from({ length: 30 }, (_, index) => {
        const day = index + 1;

        return {
            label: String(day),
            revenue:
                1_200_000 +
                Math.round(Math.cos(index * 0.45) * 650_000) +
                (index % 7) * 95_000,
        };
    });
}

function createDailyData() {
    return DAILY_HOURS.map((label, index) => ({
        label,
        revenue:
            420_000 +
            Math.round(Math.sin(index * 1.1) * 180_000) +
            index * 35_000,
    }));
}

const CHART_DATA: Record<Period, { label: string; revenue: number }[]> = {
    yearly: createYearlyData(),
    monthly: createMonthlyData(),
    daily: createDailyData(),
};

const chartConfig: ChartConfig = {
    revenue: {
        label: 'درآمد',
        color: 'var(--color-chart-primary)',
    },
};

export default function RevenueChart({
    className,
}: React.ComponentProps<'article'>) {
    const [period, setPeriod] = useState<Period>('monthly');

    const data = useMemo(() => CHART_DATA[period], [period]);

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
                    value={period}
                    onValueChange={(value) => setPeriod(value as Period)}
                    itemToStringLabel={(value) =>
                        PERIOD_LABELS[value as Period]
                    }
                >
                    <SelectTrigger
                        render={({ children, ...props }) => (
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
                        <SelectValue placeholder="انتخاب بازه">
                            {PERIOD_LABELS[period]}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                        side="bottom"
                        sideOffset={10}
                        align="end"
                        alignItemWithTrigger={false}
                    >
                        {(Object.keys(PERIOD_LABELS) as Period[]).map(
                            (value) => (
                                <SelectItem key={value} value={value}>
                                    {PERIOD_LABELS[value]}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
            </header>
            <main className="w-full min-w-0 overflow-x-auto max-w-full scrollbar-auto
            ">
                <div dir="ltr" className="w-full min-w-120">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-70 w-full"
                    >
                        <AreaChart
                            data={data}
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
                                    <ChartTooltipContent indicator="dot" />
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
            </main>
        </article>
    );
}
