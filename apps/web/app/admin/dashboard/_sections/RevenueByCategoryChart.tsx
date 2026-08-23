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

const CATEGORIES = [
    'کارت گرافیک',
    'پردازنده',
    'مادربورد',
    'رم',
    'SSD',
    'کیس',
    'پاور',
    'HDD',
] as const;

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

const YEARLY_REVENUE = [
    52_800_000, 18_400_000, 14_200_000, 9_600_000, 7_800_000, 6_200_000,
    4_100_000, 3_400_000,
] as const;

const MONTHLY_REVENUE = [
    1_150_000, 3_620_000, 2_480_000, 2_040_000, 1_780_000, 920_000, 640_000,
    1_310_000,
] as const;

const DAILY_REVENUE = [
    42_000, 38_000, 55_000, 128_000, 146_000, 72_000, 64_000, 21_000,
] as const;

const REVENUE_BY_PERIOD: Record<Period, readonly number[]> = {
    yearly: YEARLY_REVENUE,
    monthly: MONTHLY_REVENUE,
    daily: DAILY_REVENUE,
};

const chartConfig = {
    revenue: {
        label: 'درآمد',
        color: 'var(--color-chart-primary)',
    },
} satisfies ChartConfig;

function createChartData(period: Period) {
    const revenues = REVENUE_BY_PERIOD[period];
    const total = revenues.reduce((sum, value) => sum + value, 0);

    return CATEGORIES.map((category, index) => {
        const revenue = revenues[index] ?? 0;

        return {
            category,
            revenue,
            fill: CATEGORY_COLORS[index],
            percent: Math.round((revenue / total) * 100),
        };
    });
}

export default function RevenueByCategoryChart({
    className,
}: React.ComponentProps<'article'>) {
    const [period, setPeriod] = useState<Period>('monthly');
    const data = useMemo(() => createChartData(period), [period]);

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
                    value={period}
                    onValueChange={(value) => setPeriod(value as Period)}
                    itemToStringLabel={(value) =>
                        PERIOD_LABELS[value as Period]
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
            <main className="flex min-h-0 flex-1 flex-col gap-4">
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
                                        labelFormatter={(_, tooltipPayload) =>
                                            tooltipPayload[0]?.payload?.category
                                        }
                                    />
                                }
                            />
                            <Pie
                                data={data}
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
                                {data.map((item) => (
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
                    {data.map((item) => (
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
            </main>
        </article>
    );
}
