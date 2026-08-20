import {
    FolderIcon,
    HomeIcon,
    PackageIcon,
    ShoppingCartIcon,
    UsersIcon,
    type LucideIcon,
} from 'lucide-react';

export type AdminNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
    {
        label: 'داشبورد',
        href: '/admin/dashboard',
        icon: HomeIcon,
    },
    {
        label: 'محصولات',
        href: '/admin/products',
        icon: PackageIcon,
    },
    {
        label: 'دسته بندی ها',
        href: '/admin/categories',
        icon: FolderIcon,
    },
    {
        label: 'سفارشات',
        href: '/admin/orders',
        icon: ShoppingCartIcon,
    },
    {
        label: 'کاربران',
        href: '/admin/users',
        icon: UsersIcon,
    },
];
