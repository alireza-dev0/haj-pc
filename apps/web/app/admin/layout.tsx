import { Metadata } from 'next';
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './_components/DashboardSidebar';
import Header from './_components/Header';
import StickyFooter from './_components/StickyFooter';

export const metadata: Metadata = {
    title: 'Admin',
    description: 'Admin',
};

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
    return (
        <div className="w-full h-dvh">
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '240px',
                        '--sidebar-width-mobile': '20rem',
                        '--sidebar-width-icon': '68px',
                    } as React.CSSProperties
                }
            >
                <DashboardSidebar />
                <section className="w-full h-full flex flex-col gap-8 px-4 pt-5 pb-24 md:pb-5 lg:px-6">
                    <Header></Header>
                    <main className="w-full h-full grow shrink">
                        {children}
                    </main>
                    <StickyFooter />
                </section>
            </SidebarProvider>
        </div>
    );
}
