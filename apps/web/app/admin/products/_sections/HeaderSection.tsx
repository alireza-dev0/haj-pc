"use client"
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, PackageIcon, PackagePlusIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


export default function HeaderSection() {
    return (
        <header className="w-full flex items-center justify-between">
            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <PackageIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    ></PackageIcon>
                    <h1 className="text-xl font-semibold">محصولات</h1>
                </div>
                <div className="flex items-start gap-1.5">
                    <ArrowRightIcon
                        className="mt-0.75 size-4 text-text-secondary"
                        strokeWidth={1.5}
                    ></ArrowRightIcon>
                    <p className="text-base text-text-secondary">
                        مدیریت، بررسی و کنترل موجودی محصولات فروشگاه در یک نگاه
                    </p>
                </div>
            </section>
            <section className="flex flex-row-reverse items-center gap-2">
                <Button
                    variant="primary"
                    className="hidden sm:inline-flex min-w-30"
                    render={({ children, ...props }) => (
                        <Link
                            href="/admin/products/create"
                            className={props.className}
                        >
                            {children}
                        </Link>
                    )}
                >
                    <PackagePlusIcon className="size-5" strokeWidth={1.5} />
                    <span>افزودن محصول</span>
                </Button>
            </section>
        </header>
    );
}
