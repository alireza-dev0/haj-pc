'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid2x2Icon, MenuIcon } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { adminNavItems } from './nav-items';

export default function StickyFooter() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden">
            <Drawer
                open={open}
                onOpenChange={setOpen}
                swipeDirection="down"
                showSwipeHandle
            >
                <div className="pointer-events-auto flex h-14 w-full max-w-70 items-center rounded-full border border-border bg-surface ps-5 pe-1.5 shadow-lg shadow-black/50">
                    <input
                        type="search"
                        placeholder="جستجو"
                        className="min-w-0 flex-1 bg-transparent text-md text-text-primary outline-none placeholder:text-text-muted"
                    />
                    <DrawerTrigger className="flex size-11 shrink-0 items-center justify-center rounded-full bg-elevated-surface text-text-primary">
                        <Grid2x2Icon className="size-5" />
                    </DrawerTrigger>
                </div>
                <DrawerContent className="max-w-110 mx-auto">
                    <nav className="flex flex-col gap-1 p-4 pt-3">
                        {adminNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <DrawerClose
                                    key={item.href}
                                    nativeButton={false}
                                    render={
                                        <Link
                                            href={item.href}
                                            className={
                                                isActive
                                                    ? 'flex h-11 items-center gap-3 rounded-lg bg-elevated-surface px-3 text-base text-brand'
                                                    : 'flex h-11 items-center gap-3 rounded-lg px-3 text-base text-text-muted hover:bg-elevated-surface hover:text-text-primary'
                                            }
                                        />
                                    }
                                >
                                    <item.icon className="size-5" />
                                    <span>{item.label}</span>
                                </DrawerClose>
                            );
                        })}
                    </nav>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
