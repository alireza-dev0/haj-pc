'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { clientApi } from '@/utils/api';

export type DashboardPeriod = 'week' | 'month' | 'year';

export const DASHBOARD_PERIOD_LABELS: Record<DashboardPeriod, string> = {
    year: 'سالانه',
    month: 'ماهانه',
    week: 'روزانه',
};

export const DASHBOARD_PERIOD_ITEMS = (
    Object.entries(DASHBOARD_PERIOD_LABELS) as [DashboardPeriod, string][]
).map(([value, label]) => ({ value, label }));

export type DashboardStats = {
    kpis: {
        totalRevenue: number;
        ordersCount: number;
        productsCount: number;
        lowStockCount: number;
    };
    revenueOverTime: { date: string; revenue: number }[];
    revenueByCategory: { category: string; revenue: number }[];
};

async function getDashboardStats(
    period: DashboardPeriod,
): Promise<DashboardStats> {
    const { data } = await clientApi.get<DashboardStats>('/dashboard/stats', {
        params: { period },
    });
    return data;
}

export function useDashboardStats(period: DashboardPeriod) {
    return useQuery({
        queryKey: ['admin-dashboard-stats', period],
        queryFn: () => getDashboardStats(period),
        placeholderData: keepPreviousData,
    });
}
