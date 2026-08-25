'use client';

import React from 'react';
import KpiCard, { KpiCardSkeleton } from '../_components/KpiCard';
import {
    DollarSignIcon,
    PackageIcon,
    PackageXIcon,
    ShoppingCartIcon,
} from 'lucide-react';
import { useDashboardStats } from '../_hooks/useDashboardStats';

export function KpiSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
        </div>
    );
}

export default function KpiSection() {
    const { data, isLoading, isError, isPlaceholderData } = useDashboardStats(
        'month',
    );

    if (isLoading && !isPlaceholderData) {
        return <KpiSectionSkeleton />;
    }

    if (isError || !data) {
        return (
            <p className="py-10 text-center text-error">
                خطا در دریافت آمار داشبورد
            </p>
        );
    }

    const { kpis } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title="تعداد سفارش‌ها"
                label="سفارش"
                value={kpis.ordersCount}
                description="سفارش‌های ۳۰ روز گذشته"
                icon={ShoppingCartIcon}
            />
            <KpiCard
                title="درآمد"
                label="تومان"
                value={kpis.totalRevenue}
                description="مجموع مبلغ سفارش‌ها در ۳۰ روز گذشته"
                icon={DollarSignIcon}
            />
            <KpiCard
                title="کمبود موجودی محصولات"
                label="محصول"
                value={kpis.lowStockCount}
                description="موجودی ۵ عدد یا کمتر"
                icon={PackageXIcon}
            />
            <KpiCard
                title="تعداد محصولات"
                label="محصول"
                value={kpis.productsCount}
                description="کل محصولات فروشگاه"
                icon={PackageIcon}
            />
        </div>
    );
}
