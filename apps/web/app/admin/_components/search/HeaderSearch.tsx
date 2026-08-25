'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import type { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { Popover, PopoverContent, PopoverTitle } from '@/components/ui/popover';
import {
    getFirstSearchHref,
    SEARCH_MIN_QUERY_LENGTH,
    useGlobalSearch,
} from '../../_hooks/useGlobalSearch';
import { SearchResultsList } from './SearchResultsList';

export function HeaderSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { data } = useGlobalSearch(query);

    const hasQuery = query.trim().length >= SEARCH_MIN_QUERY_LENGTH;

    function isFocusInSearchField() {
        const active = document.activeElement;
        if (!active) return false;
        return Boolean(
            anchorRef.current?.contains(active) || inputRef.current === active,
        );
    }

    function handleOpenChange(
        nextOpen: boolean,
        eventDetails: PopoverPrimitive.Root.ChangeEventDetails,
    ) {
        if (nextOpen) {
            if (!hasQuery) {
                eventDetails.cancel();
                return;
            }
            setOpen(true);
            return;
        }

        // Input lives outside the popup. Keep the popover open while the
        // field still has focus so typing does not dismiss it.
        if (eventDetails.reason === 'focus-out' && isFocusInSearchField()) {
            eventDetails.cancel();
            return;
        }

        if (eventDetails.reason === 'outside-press') {
            const target = eventDetails.event.target;
            if (
                target instanceof Node &&
                (anchorRef.current?.contains(target) ||
                    inputRef.current?.contains(target))
            ) {
                eventDetails.cancel();
                return;
            }
        }

        setOpen(false);
    }

    function handleQueryChange(value: string) {
        setQuery(value);
        setOpen(value.trim().length >= SEARCH_MIN_QUERY_LENGTH);
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const href = getFirstSearchHref(data);
        if (!href) {
            if (hasQuery) setOpen(true);
            return;
        }
        setOpen(false);
        router.push(href);
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
            <div ref={anchorRef} className="hidden w-64 md:block lg:w-80">
                <form onSubmit={handleSubmit}>
                    <InputGroup className="h-11 rounded-full">
                        <InputGroupAddon>
                            <SearchIcon className="size-4 text-text-secondary" />
                        </InputGroupAddon>
                        <InputGroupInput
                            ref={inputRef}
                            value={query}
                            onChange={(event) =>
                                handleQueryChange(event.target.value)
                            }
                            onFocus={() => {
                                if (
                                    query.trim().length >=
                                    SEARCH_MIN_QUERY_LENGTH
                                ) {
                                    setOpen(true);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape' && open) {
                                    event.preventDefault();
                                    setOpen(false);
                                }
                            }}
                            placeholder="جستجو"
                            autoComplete="off"
                            aria-label="جستجوی سراسری"
                            aria-expanded={open}
                            aria-autocomplete="list"
                            role="combobox"
                        />
                    </InputGroup>
                </form>
            </div>
            <PopoverContent
                anchor={anchorRef}
                align="start"
                side="bottom"
                sideOffset={8}
                initialFocus={false}
                finalFocus={false}
                className="w-(--anchor-width) max-h-96 gap-0 overflow-y-auto p-1.5"
            >
                <PopoverTitle className="sr-only">نتایج جستجو</PopoverTitle>
                <SearchResultsList
                    query={query}
                    onResultClick={() => setOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}
