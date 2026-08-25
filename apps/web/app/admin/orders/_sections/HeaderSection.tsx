'use client';

import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react';
import React from 'react';

export default function HeaderSection() {
    return (
        <header className="w-full flex items-center justify-between">
            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <ShoppingCartIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-xl font-semibold">سفارش‌ها</h1>
                </div>
                <div className="flex items-start gap-1.5">
                    <ArrowRightIcon
                        className="mt-0.75 size-4 text-text-secondary"
                        strokeWidth={1.5}
                    />
                    <p className="text-base text-text-secondary">
                        مشاهده، بررسی و به‌روزرسانی وضعیت سفارش‌های فروشگاه
                    </p>
                </div>
            </section>
        </header>
    );
}
