'use client';
import React from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>{children}</TooltipProvider>
            </QueryClientProvider>
            <Toaster
                toastOptions={{
                    // style: {
                    //     "backgroundColor": "var(--color-background)"
                    // }
                    className: "bg-elevated-surface! text-text-primary! font-[shabnam]! border-none!"
                }}
                position="top-right"
            ></Toaster>
        </>
    );
}
