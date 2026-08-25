'use client';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/store/useAuth';

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    const { login } = useAuth();

    useEffect(() => {
        login();
    }, []);

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
