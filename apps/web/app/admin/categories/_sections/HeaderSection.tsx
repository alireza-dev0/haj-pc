'use client';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon, FolderIcon, FolderPlusIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type HeaderSectionProps = {
    title: string;
    description: string;
    showCreate?: boolean;
    backHref?: string;
    action?: React.ReactNode;
};

export default function HeaderSection({
    title,
    description,
    showCreate = false,
    backHref,
    action,
}: HeaderSectionProps) {
    return (
        <header className="w-full flex items-center justify-between gap-4">
            <section className="flex flex-col gap-3">
                {backHref ? (
                    <Link
                        href={backHref}
                        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
                    >
                        <ArrowRightIcon className="size-4" strokeWidth={1.5} />
                        بازگشت
                    </Link>
                ) : null}
                <div className="flex items-center gap-3">
                    <FolderIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-xl font-semibold">{title}</h1>
                </div>
                <div className="flex items-start gap-1.5">
                    <ArrowRightIcon
                        className="mt-0.75 size-4 text-text-secondary"
                        strokeWidth={1.5}
                    />
                    <p className="text-base text-text-secondary">{description}</p>
                </div>
            </section>
            <section className="flex flex-row-reverse items-center gap-2">
                {showCreate ? (
                    <Button
                        variant="primary"
                        className="hidden sm:inline-flex min-w-30"
                        render={({ children, ...props }) => (
                            <Link
                                href="/admin/categories/create"
                                className={props.className}
                            >
                                {children}
                            </Link>
                        )}
                    >
                        <FolderPlusIcon className="size-5" strokeWidth={1.5} />
                        <span>افزودن دسته‌بندی</span>
                    </Button>
                ) : null}
                {action}
            </section>
        </header>
    );
}
