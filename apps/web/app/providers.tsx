'use client';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/store/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
    const { login } = useAuth();

    const queryClient = new QueryClient();

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
                    className: 'bg-background text-text-primary font-inherit',
                }}
                position="top-right"
            ></Toaster>
        </>
    );
}
