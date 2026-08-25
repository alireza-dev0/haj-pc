'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import {
    getFirstSearchHref,
    useGlobalSearch,
} from '../../_hooks/useGlobalSearch';
import { SearchResultsList } from './SearchResultsList';

type MobileSearchOverlayProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function MobileSearchOverlay({
    open,
    onOpenChange,
}: MobileSearchOverlayProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { data } = useGlobalSearch(query);

    useEffect(() => {
        if (!open) {
            setQuery('');
            return;
        }

        const frame = requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

        return () => cancelAnimationFrame(frame);
    }, [open]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const href = getFirstSearchHref(data);
        if (!href) return;
        onOpenChange(false);
        router.push(href);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                initialFocus={() => inputRef.current}
                className="inset-0 inset-s-0 inset-e-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-background p-0 shadow-none sm:max-w-none rtl:translate-x-0"
            >
                <DialogTitle className="sr-only">جستجو</DialogTitle>
                <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        onClick={() => onOpenChange(false)}
                        aria-label="بستن جستجو"
                    >
                        <XIcon className="size-4" />
                    </Button>
                    <form onSubmit={handleSubmit} className="min-w-0 flex-1">
                        <InputGroup className="h-11 rounded-full">
                            <InputGroupAddon>
                                <SearchIcon className="size-4 text-text-secondary" />
                            </InputGroupAddon>
                            <InputGroupInput
                                ref={inputRef}
                                id="admin-mobile-search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="جستجو"
                                autoComplete="off"
                                autoFocus
                                aria-label="جستجوی سراسری"
                            />
                        </InputGroup>
                    </form>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                    <SearchResultsList
                        query={query}
                        onResultClick={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
