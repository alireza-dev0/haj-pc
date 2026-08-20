import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 ease-out focus-visible:border-brand has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-error [&>svg]:pointer-events-none [&>svg]:size-2.5!',
    {
        variants: {
            variant: {
                default: 'bg-brand-soft text-brand [a]:hover:bg-brand/20',
                secondary:
                    'bg-elevated-surface text-text-secondary [a]:hover:text-text-primary',
                destructive: 'bg-error-soft text-error [a]:hover:bg-error/20',
                success: 'bg-success-soft text-success',
                warning: 'bg-warning-soft text-warning',
                info: 'bg-info-soft text-info',
                outline:
                    'border-border bg-transparent text-text-primary [a]:hover:bg-elevated-surface',
                ghost: 'hover:bg-elevated-surface hover:text-text-primary',
                link: 'text-brand underline-offset-4 hover:underline',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Badge({
    className,
    variant = 'default',
    render,
    ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
    return useRender({
        defaultTagName: 'span',
        props: mergeProps<'span'>(
            {
                className: cn(badgeVariants({ variant }), className),
            },
            props,
        ),
        render,
        state: {
            slot: 'badge',
            variant,
        },
    });
}

export { Badge, badgeVariants };
