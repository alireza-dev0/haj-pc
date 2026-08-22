import React from 'react';
import { KpiSectionSkeleton } from './_sections/KpiSection';

export default function loading() {
    return (
        <div className="w-full flex-col gap-8">
            <KpiSectionSkeleton />
        </div>
    );
}
