import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';

export default function LogoIcon({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('size-12 relative', className)} {...props}>
            <Image
                src="/LogoVector.svg"
                alt="Logo"
                fill
                className="object-contain"
            />
        </div>
    );
}
