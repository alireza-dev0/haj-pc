import { Metadata } from 'next';
import React from 'react';
import HeaderSection from './_sections/HeaderSection';
import CategoriesSection from './_sections/CategoriesSection';

export const metadata: Metadata = {
    title: 'دسته‌بندی‌ها',
    description: 'مدیریت دسته‌بندی محصولات',
};

export default function CategoriesPage() {
    return (
        <div className="flex flex-col gap-8">
            <HeaderSection
                title="دسته‌بندی‌ها"
                description="مدیریت دسته‌بندی محصولات فروشگاه"
                showCreate
            />
            <main className="w-full flex flex-col gap-6">
                <CategoriesSection />
            </main>
        </div>
    );
}
