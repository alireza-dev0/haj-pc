'use client';

import * as React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';

type NumberStepperProps = {
    id?: string;
    name?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    'aria-invalid'?: boolean;
};

function parseInteger(value: string): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min?: number, max?: number) {
    let next = value;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return next;
}

export const NumberStepper = React.forwardRef<
    HTMLInputElement,
    NumberStepperProps
>(function NumberStepper(
    {
        id,
        name,
        value,
        onChange,
        onBlur,
        min = 0,
        max,
        step = 1,
        disabled,
        placeholder = '0',
        className,
        'aria-invalid': ariaInvalid,
    },
    ref,
) {
    const numeric = parseInteger(value);
    const atMin = min !== undefined && numeric <= min;
    const atMax = max !== undefined && numeric >= max;

    function commit(next: number) {
        onChange(String(clamp(next, min, max)));
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const raw = event.target.value;
        if (raw === '') {
            onChange('');
            return;
        }
        if (!/^\d+$/.test(raw)) {
            return;
        }
        onChange(raw);
    }

    function handleBlur() {
        if (value.trim() !== '') {
            commit(Math.trunc(parseInteger(value)));
        }
        onBlur?.();
    }

    return (
        <InputGroup dir="ltr" className={cn('w-full', className)}>
            <InputGroupAddon align="inline-start">
                <InputGroupButton
                    variant="ghost"
                    size="icon-sm"
                    aria-label="کاهش"
                    disabled={disabled || (value !== '' && atMin)}
                    onClick={() => commit(numeric - step)}
                >
                    <MinusIcon strokeWidth={1.5} />
                </InputGroupButton>
            </InputGroupAddon>
            <InputGroupInput
                ref={ref}
                id={id}
                name={name}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                dir="ltr"
                className="text-center tabular-nums"
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={disabled}
                placeholder={placeholder}
                aria-invalid={ariaInvalid}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    variant="ghost"
                    size="icon-sm"
                    aria-label="افزایش"
                    disabled={disabled || atMax}
                    onClick={() => commit(numeric + step)}
                >
                    <PlusIcon strokeWidth={1.5} />
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
});
