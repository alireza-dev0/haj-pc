import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                primary:
                    'bg-brand text-black hover:bg-brand-lighter disabled:text-text-muted disabled:bg-[#313131]',
                outline:
                    'border-border hover:bg-elevated-surface/50 hover:text-text-primary disabled:text-text-muted disabled:border-text-muted',
                secondary:
                    'border border-border bg-elevated-surface text-text-primary hover:bg-border disabled:text-text-muted disabled:bg-[#313131]',
                destructive:
                    'bg-error text-black hover:bg-error-lighter  active:bg-error-darker disabled:text-text-muted disabled:bg-[#313131]',
                link: 'text-info-darker underline-offset-4 hover:underline disabled:text-text-muted',
            },
            size: {
                sm: "button--sm",
                md: "button--md",
                "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4.5",
                "icon-md": "size-11 [&_svg:not([class*='size-'])]:size-6",
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
