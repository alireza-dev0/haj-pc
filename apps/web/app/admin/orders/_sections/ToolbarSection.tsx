'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { useOrdersFiltersStore } from '../_stores/useOrdersFiltersStore';
import { ORDER_STATUS_FILTER_ITEMS } from '../_lib/status-labels';

export default function ToolbarSection() {
    const { q, status, setQ, setStatus } = useOrdersFiltersStore();

    return (
        <div className="w-full flex flex-col gap-3.5 md:flex-row-reverse md:items-center md:justify-between md:gap-0">
            <div className="w-full flex items-center gap-2.5 md:w-min">
                <Select
                    items={ORDER_STATUS_FILTER_ITEMS}
                    value={status}
                    onValueChange={(value) =>
                        setStatus(value as typeof status)
                    }
                >
                    <SelectTrigger
                        nativeButton={false}
                        render={({ children, className, ...props }) => (
                            <Button
                                size="md"
                                variant="secondary"
                                className={cn(
                                    'group/trigger w-full grow shrink text-sm md:w-44',
                                )}
                                {...props}
                            >
                                {children}
                            </Button>
                        )}
                    >
                        <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent
                        side="bottom"
                        sideOffset={4}
                        align="start"
                        alignOffset={0}
                        alignItemWithTrigger={false}
                    >
                        <SelectGroup>
                            {ORDER_STATUS_FILTER_ITEMS.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <InputGroup className="w-full md:max-w-72">
                <InputGroupAddon>
                    <SearchIcon className="size-5" strokeWidth={1.5} />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="جستجوی شماره سفارش یا مشتری"
                    className="grow shrink"
                    value={q}
                    onChange={(event) => setQ(event.target.value)}
                />
            </InputGroup>
        </div>
    );
}
