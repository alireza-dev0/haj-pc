import { Metadata } from 'next';
import React from 'react';
import ToolbarSection from './_sections/ToolbarSection';
import ProductsSection from './_sections/ProductsSection';
import HeaderSection from './_sections/HeaderSection';

export const metadata: Metadata = {
    title: 'products',
    description: 'products',
};

export default function ProductsPage() {
    return (
        <div className="flex flex-col gap-8">
            <HeaderSection></HeaderSection>
            <main className="w-full flex flex-col gap-6">
                <ToolbarSection />
                <ProductsSection></ProductsSection>
            </main>
        </div>
    );
}
