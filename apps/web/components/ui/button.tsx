import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center border border-transparent font-medium whitespace-nowrap transition-colors duration-150 ease-out outline-none select-none disabled:pointer-events-none disabled:bg-elevated-surface disabled:text-text-muted disabled:border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                primary:
                    'bg-brand text-black hover:bg-brand-lighter',
                secondary:
                    'border-border bg-elevated-surface text-text-primary hover:bg-border',
                outline:
                    'border-border bg-transparent text-text-primary hover:bg-elevated-surface',
                ghost:
                    'bg-transparent text-text-secondary hover:bg-elevated-surface hover:text-text-primary',
                destructive:
                    'border-error bg-error-soft text-error hover:bg-error/20',
                link: 'bg-transparent text-info-darker underline-offset-4 hover:underline disabled:bg-transparent',
            },
            size: {
                sm: 'button--sm',
                md: 'button--md',
                'icon-sm': 'button--icon-sm',
                'icon-md': 'button--icon-md',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
