'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

function Switch({
    className,
    size = 'default',
    ...props
}: SwitchPrimitive.Root.Props & {
    size?: 'sm' | 'default';
}) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(
                'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors duration-150 ease-out outline-none focus-visible:ring-1 focus-visible:ring-brand-soft aria-invalid:border-error data-checked:bg-brand data-unchecked:bg-border data-disabled:cursor-not-allowed data-disabled:opacity-50',
                size === 'sm' ? 'switch--sm' : 'switch--md',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    'pointer-events-none block rounded-full bg-text-primary transition-transform duration-150 ease-out group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[size=default]/switch:data-checked:-translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[size=sm]/switch:data-checked:-translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 rtl:group-data-[size=default]/switch:data-unchecked:-translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 rtl:group-data-[size=sm]/switch:data-unchecked:-translate-x-0',
                    size === 'sm' ? 'switch--thumb-sm' : 'switch--thumb-md',
                )}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
