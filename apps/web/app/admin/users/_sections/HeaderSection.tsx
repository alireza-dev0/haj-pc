'use client';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function HeaderSection() {
    return (
        <header className="w-full flex items-center justify-between">
            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <UsersIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-xl font-semibold">کاربران</h1>
                </div>
                <div className="flex items-start gap-1.5">
                    <ArrowRightIcon
                        className="mt-0.75 size-4 text-text-secondary"
                        strokeWidth={1.5}
                    />
                    <p className="text-base text-text-secondary">
                        مدیریت حساب‌های کاربری، نقش‌ها و دسترسی‌ها
                    </p>
                </div>
            </section>
            <section className="flex flex-row-reverse items-center gap-2">
                <Button
                    variant="primary"
                    className="hidden sm:inline-flex min-w-30"
                    render={({ children, ...props }) => (
                        <Link
                            href="/admin/users/create"
                            className={props.className}
                        >
                            {children}
                        </Link>
                    )}
                >
                    <UserPlusIcon className="size-5" strokeWidth={1.5} />
                    <span>افزودن کاربر</span>
                </Button>
            </section>
        </header>
    );
}
