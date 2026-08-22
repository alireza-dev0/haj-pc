import React from 'react'
import KpiCard, { KpiCardSkeleton } from '../_components/KpiCard';
import { DollarSignIcon, PackageIcon, PackageXIcon, ShoppingCartIcon } from 'lucide-react';

export function KpiSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
        </div>
    );
};


export default function KpiSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
                title='تعداد شفارشات'
                label="شفارش"
                value={100}
                description='26 سفارش بیشتر از ماه گذشته'
                icon={ShoppingCartIcon}
            />
            <KpiCard
                title='درآمد'
                label="ریال"
                value={100000000}
                description='26 میلیون ریال بیشتر از ماه گذشته'
                icon={DollarSignIcon}
            />
            <KpiCard
                title='کمبود موجودی محصولات'
                label="محصول"
                value={11}
                description='موجودی زیر 5 عدد'
                icon={PackageXIcon}
            />
            <KpiCard
                title='تعداد محصولات'
                label="شفارش"
                value={100}
                description='تعداد شفارشات'
                icon={PackageIcon}
            />
        </div>
    );
};