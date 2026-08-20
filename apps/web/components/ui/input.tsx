import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
    'w-full min-w-0 border border-border bg-elevated-surface text-text-primary transition-colors duration-150 ease-out outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-text-secondary placeholder:text-text-muted focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error',
    {
        variants: {
            variant: {
                default: '',
            },
            size: {
                sm: 'input--sm file:h-9 file:text-xs',
                md: 'input--md file:h-11 file:text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

function Input({
    className,
    variant = 'default',
    size = 'md',
    type,
    ...props
}: Omit<InputPrimitive.Props, 'size'> & VariantProps<typeof inputVariants>) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(inputVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Input, inputVariants };
