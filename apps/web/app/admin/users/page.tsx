import { Metadata } from 'next';
import React from 'react';
import HeaderSection from './_sections/HeaderSection';
import ToolbarSection from './_sections/ToolbarSection';
import UsersTableSection from './_sections/UsersTableSection';

export const metadata: Metadata = {
    title: 'کاربران',
    description: 'مدیریت کاربران',
};

export default function UsersPage() {
    return (
        <div className="flex flex-col gap-8">
            <HeaderSection />
            <main className="w-full flex flex-col gap-6">
                <ToolbarSection />
                <UsersTableSection />
            </main>
        </div>
    );
}
