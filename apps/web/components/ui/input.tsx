import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
    'w-full min-w-0 rounded-md px-3 h-11 text-sm/normal transition-colors outline-none file:inline-flex file:h-11 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-text-muted focus-visible:border focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-elevated-surface aria-invalid:border-error-darker aria-invalid:ring-2 aria-invalid:ring-error-darker/50',
    {
        variants: {
            variant: {
                default: 'bg-border text-text-primary',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Input({
    className,
    variant = 'default',
    type,
    ...props
}: InputPrimitive.Props & VariantProps<typeof inputVariants>) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(inputVariants({ variant, className }))}
            {...props}
        />
    );
}

export { Input, inputVariants };