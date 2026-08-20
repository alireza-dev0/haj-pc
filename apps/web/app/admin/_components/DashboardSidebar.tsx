'use client';
import LogoIcon from '@/components/LogoIcon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/store/useAuth';
import { UserRole } from '@repo/types';
import { ChevronsUpDownIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { adminNavItems } from './nav-items';

const roleLabel: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'مدیر سیستم',
    [UserRole.USER]: 'کاربر',
};

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    return (
        <Sidebar
            side="right"
            collapsible="icon"
        >
            <SidebarHeader className="w-full flex items-center justify-between">
                <LogoIcon className="w-full max-w-12 p-1.5" />
            </SidebarHeader>
            <SidebarContent className="p-3">
                <SidebarMenu className="space-y-1">
                    {adminNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                className="h-11 text-base text-text-muted [&_svg]:size-6 group-data-[collapsible=icon]:size-11! data-active:bg-elevated-surface data-active:hover:text-brand hover:not-data-active:text-text-primary hover:not-data-active:bg-transparent"
                                isActive={pathname === item.href}
                                render={(props) => (
                                    <Link
                                        href={item.href}
                                        {...props}
                                    >
                                        {props.children}
                                    </Link>
                                )}
                            >
                                <item.icon className=''/>
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className='p-3'>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg bg-elevated-surface p-2 text-start outline-none group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:bg-transparent">
                            <Avatar className="group-data-[collapsible=icon]:size-11">
                                <AvatarFallback>
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                                <p className="truncate text-sm font-medium leading-snug text-text-primary">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-text-secondary">
                                    {roleLabel[user.role]}
                                </p>
                            </div>
                            <ChevronsUpDownIcon className="size-4 shrink-0 text-text-muted group-data-[collapsible=icon]:hidden" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            align="start"
                            className="w-56"
                        >
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
                ) : null}
            </SidebarFooter>
        </Sidebar>
    );
}
