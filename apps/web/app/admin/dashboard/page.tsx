import { Metadata } from 'next';
import React from 'react';
import KpiSection from './_sections/KpiSection';
import RevenueByCategoryChart from './_sections/RevenueByCategoryChart';
import RevenueChart from './_sections/RevenueChart';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <KpiSection />
            <section className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_358px] md:gap-4">
                <RevenueChart className="min-w-0" />
                <RevenueByCategoryChart />
            </section>
        </div>
    );
}
