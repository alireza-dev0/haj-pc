'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRightIcon } from 'lucide-react';

type ProductPageHeaderProps = {
    title: string;
    description?: string;
    icon: LucideIcon;
    actions?: ReactNode;
};

export default function ProductPageHeader({
    title,
    description,
    icon: Icon,
    actions,
}: ProductPageHeaderProps) {
    return (
        <header className="w-full flex items-start justify-between gap-4">
            <section className="flex flex-col gap-3">
                <Link
                    href="/admin/products"
                    className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
                >
                    <ArrowRightIcon className="size-4" strokeWidth={1.5} />
                    بازگشت
                </Link>
                <div className="flex items-center gap-3">
                    <Icon className="size-7 text-brand" strokeWidth={1.5} />
                    <h1 className="text-xl font-semibold leading-snug">
                        {title}
                    </h1>
                </div>
                {description ? (
                    <div className="flex items-start gap-1.5">
                        <ArrowRightIcon
                            className="mt-0.75 size-4 text-text-secondary"
                            strokeWidth={1.5}
                        />
                        <p className="text-base text-text-secondary leading-relaxed">
                            {description}
                        </p>
                    </div>
                ) : null}
            </section>
            {actions ? (
                <section className="hidden sm:flex flex-row-reverse items-center gap-2">
                    {actions}
                </section>
            ) : null}
        </header>
    );
}
