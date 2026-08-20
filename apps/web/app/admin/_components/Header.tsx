'use client';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/store/useAuth';
import { UserRole } from '@repo/types';
import {
    BellIcon,
    Calendar,
    ChevronDownIcon,
    LogOutIcon,
    SearchIcon,
    UserRoundIcon,
} from 'lucide-react';
import React from 'react';
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from '@/components/ui/input-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

const roleLabel: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'مدیر',
    [UserRole.USER]: 'کاربر',
};

export default function Header() {
    const date = new Date();
    const { user, isLoading, logout } = useAuth();

    return (
        <header className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="hidden md:flex"></SidebarTrigger>
                <InputGroup className="h-11 rounded-full hidden md:flex">
                    <InputGroupAddon>
                        <SearchIcon className="size-4 text-text-secondary"></SearchIcon>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="جستجو"></InputGroupInput>
                </InputGroup>
                <div className="flex md:hidden">
                    {isLoading ? (
                        <Skeleton className="rounded-full h-12 w-21"></Skeleton>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center justify-center gap-2 p-1 pe-2 rounded-full bg-elevated-surface">
                                    <Avatar size="lg">
                                        <AvatarFallback>
                                            {user!.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDownIcon className="size-6 text-text-secondary"></ChevronDownIcon>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
                                        <span className="text-sm font-medium text-text-primary">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-text-secondary">
                                            {roleLabel[user.role]}
                                        </span>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    render={<Link href="/admin/dashboard" />}
                                >
                                    <UserRoundIcon className="size-4 text-text-secondary" />
                                    حساب کاربری
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => logout()}
                                >
                                    <LogOutIcon className="size-4" />
                                    خروج
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Skeleton className="rounded-full h-12 w-21"></Skeleton>
                    )}
                </div>
            </div>
            <div className="flex flex-row-reverse items-center gap-3">
                <Button
                    variant="secondary"
                    size="icon-md"
                    className="rounded-full size-10"
                >
                    <BellIcon className="size-4" />
                </Button>
                <div className="bg-elevated-surface flex items-center justify-center p-1 pe-4 gap-2 h-10 rounded-full">
                    <div className="bg-border flex items-center justify-center rounded-full aspect-square h-full">
                        <Calendar className="size-4 text-text-secondary"></Calendar>
                    </div>
                    <span className="text-text-secondary text-xs">
                        {date.toLocaleDateString("fa-IR", { day: '2-digit' })}{' '}
                        {date.toLocaleDateString("fa-IR", { month: 'long' })}{' '}
                        {date.toLocaleDateString("fa-IR", { year: 'numeric' })}
                    </span>
                </div>
            </div>
        </header>
    );
}
