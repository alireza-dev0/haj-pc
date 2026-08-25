'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchIcon, UserPlusIcon } from 'lucide-react';
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
import { useUsersFiltersStore } from '../_stores/useUsersFiltersStore';
import { ROLE_FILTER_ITEMS } from '../_lib/role-labels';

export default function ToolbarSection() {
    const { q, role, setQ, setRole } = useUsersFiltersStore();

    return (
        <div className="w-full flex flex-col gap-3.5 md:flex-row-reverse md:items-center md:justify-between md:gap-0">
            <Button
                className="sm:hidden"
                variant="primary"
                render={({ children, ...props }) => (
                    <Link
                        href="/admin/users/create"
                        className={props.className}
                    >
                        {children}
                    </Link>
                )}
            >
                <UserPlusIcon className="size-5" strokeWidth={1.5} />
                <span>افزودن کاربر</span>
            </Button>
            <div className="w-full flex items-center gap-2.5 md:w-min">
                <Select
                    items={ROLE_FILTER_ITEMS}
                    value={role}
                    onValueChange={(value) =>
                        setRole(value as typeof role)
                    }
                >
                    <SelectTrigger
                        render={({ children, className, ...props }) => (
                            <Button
                                size="md"
                                variant="secondary"
                                className={cn(
                                    'group/trigger w-full grow shrink text-sm md:w-40',
                                )}
                                {...props}
                            >
                                {children}
                            </Button>
                        )}
                    >
                        <SelectValue placeholder="نقش" />
                    </SelectTrigger>
                    <SelectContent
                        side="bottom"
                        sideOffset={4}
                        align="start"
                        alignOffset={0}
                        alignItemWithTrigger={false}
                    >
                        <SelectGroup>
                            {ROLE_FILTER_ITEMS.map((item) => (
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
            <InputGroup className="w-full md:max-w-60">
                <InputGroupAddon>
                    <SearchIcon className="size-5" strokeWidth={1.5} />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="جستجوی نام یا ایمیل"
                    className="grow shrink"
                    value={q}
                    onChange={(event) => setQ(event.target.value)}
                />
            </InputGroup>
        </div>
    );
}
