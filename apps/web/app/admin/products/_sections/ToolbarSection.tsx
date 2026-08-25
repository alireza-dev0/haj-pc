'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilterIcon, PackagePlusIcon, SearchIcon } from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useFiltersStore } from '../_stores/useFiltersStore';
import { useCategories } from '../_hooks/useCategories';

const sortOptions = [
    { value: 'newest', label: 'جدید ترین' },
    { value: 'oldest', label: 'قدیمی ترین' },
] as const;

export default function ToolbarSection() {
    const {
        sort,
        search,
        categoryId,
        setSort,
        setSearch,
        setCategoryId,
        resetFilters,
    } = useFiltersStore();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { data: categories } = useCategories();
    const categoryItems = [
        { label: 'همه', value: 'all' },
        ...(categories ?? []).map((category) => ({
            label: category.name,
            value: category.id,
        })),
    ];

    return (
        <div className="w-full flex flex-col gap-3.5 md:flex-row-reverse md:items-center md:justify-between md:gap-0">
            <Button
                className="sm:hidden"
                variant="primary"
                render={({ children, ...props }) => (
                    <Link
                        href="/admin/products/create"
                        className={props.className}
                    >
                        {children}
                    </Link>
                )}
            >
                <PackagePlusIcon className="size-5" strokeWidth={1.5} />
                <span>افزودن محصول</span>
            </Button>
            <div className="w-full flex items-center gap-2.5 md:w-min">
                <Select
                    items={sortOptions}
                    value={sort}
                    onValueChange={(value) => setSort(value as typeof sort)}
                >
                    <SelectTrigger
                        render={({ children, className, ...props }) => (
                            <Button
                                size="md"
                                variant="secondary"
                                className={cn(
                                    'group/trigger w-full grow shrink text-sm',
                                )}
                                {...props}
                            >
                                {children}
                            </Button>
                        )}
                    >
                        <SelectValue placeholder="ترتیب بر اساس" />
                    </SelectTrigger>
                    <SelectContent
                        side="bottom"
                        sideOffset={4}
                        align="start"
                        alignOffset={0}
                        alignItemWithTrigger={false}
                    >
                        <SelectGroup>
                            {sortOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="h-10 px-3"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger
                        render={
                            <Button
                                size="md"
                                variant="secondary"
                                className="w-full grow shrink text-sm"
                            />
                        }
                    >
                        <FilterIcon className="size-5" strokeWidth={1.5} />
                        <span>فیلترها</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>فیلترها</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-text-secondary">
                                دسته‌بندی
                            </label>
                            <Select
                                items={categoryItems}
                                value={categoryId ?? 'all'}
                                onValueChange={(value) =>
                                    setCategoryId(
                                        value === 'all' ? null : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categoryItems.map((item) => (
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
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    resetFilters();
                                    setIsFilterOpen(false);
                                }}
                            >
                                پاک کردن فیلتر
                            </Button>
                            <Button onClick={() => setIsFilterOpen(false)}>
                                اعمال
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <InputGroup className="w-full md:max-w-60">
                <InputGroupAddon>
                    <SearchIcon className="size-5" strokeWidth={1.5} />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="جستجوی محصول"
                    className="grow shrink"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </InputGroup>
        </div>
    );
}
