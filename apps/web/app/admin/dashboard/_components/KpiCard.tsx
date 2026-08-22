import { Skeleton } from '@/components/ui/skeleton';
import { intlFormat } from 'date-fns';
import React, { SVGProps } from 'react';

export function KpiCardSkeleton() {
    return <Skeleton className="w-full h-[145px] md:h-[142px] lg:h-[123px]" />;
}

export interface KpiCardProps {
    title: string;
    label: string;
    value: number;
    description: string;
    icon: React.ComponentType<SVGProps<SVGSVGElement>>;
}

export default function KpiCard({
    title,
    label,
    value,
    description,
    icon: Icon,
    ...props
}: KpiCardProps) {
    return (
        <article
            className="bg-card rounded-xl p-4 flex flex-col gap-3 relative"
            {...props}
        >
            <h1 className="text-base text-text-secondary font-normal">
                {title}
            </h1>
            <div className="w-full flex-col gap-1">
                <div className="flex items-baseline flex-wrap gap-1 text-text-primary">
                    <span className="inline-block font-bold text-[41px] text-inherit lg:text-[28px]">
                        {Intl.NumberFormat("en-US").format(value)}
                    </span>
                    <span className="inline-block text-lg font-medium text-inherit">
                        {label}
                    </span>
                </div>
                <p className="text-sm text-text-secondary font-normal md:text-xs">
                    {description}
                </p>
            </div>
            <div className="flex absolute top-4 inset-e-4 rounded-full size-12 p-3.5 bg-brand-soft text-brand lg:size-11.5">
                <Icon className="w-full h-full text-inherit" />
            </div>
        </article>
    );
}
