import { Metadata } from 'next';
import React from 'react';
import HeaderSection from './_sections/HeaderSection';
import ToolbarSection from './_sections/ToolbarSection';
import OrdersTableSection from './_sections/OrdersTableSection';

export const metadata: Metadata = {
    title: 'سفارش‌ها',
    description: 'مدیریت سفارش‌های فروشگاه',
};

export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-8">
            <HeaderSection />
            <main className="w-full flex flex-col gap-6">
                <ToolbarSection />
                <OrdersTableSection />
            </main>
        </div>
    );
}
