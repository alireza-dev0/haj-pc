import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { KpiSectionSkeleton } from './_sections/KpiSection';

export default function loading() {
    return (
        <div className="flex w-full flex-col gap-8">
            <KpiSectionSkeleton />
            <section className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_358px] md:gap-4">
                <Skeleton className="h-90 w-full rounded-xl" />
                <Skeleton className="h-90 w-full rounded-xl" />
            </section>
        </div>
    );
}
