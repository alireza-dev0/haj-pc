'use client';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/store/useAuth';

export default function Providers({ children }: { children: React.ReactNode }) {
    const { login } = useAuth()


    useEffect(() => {
        login()
    }, [])

    return (
        <>
            <TooltipProvider>
                {children}
            </TooltipProvider>
            <Toaster
                toastOptions={{
                    className: 'bg-background text-text-primary font-inherit',
                }}
                position="top-right"
            ></Toaster>
        </>
    );
}
