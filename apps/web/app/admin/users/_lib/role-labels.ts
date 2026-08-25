import type { UserRole } from '@repo/types';

export const roleLabel: Record<UserRole, string> = {
    ADMIN: 'ادمین',
    USER: 'کاربر',
};

export const ROLE_ITEMS = [
    { label: roleLabel.USER, value: 'USER' as const },
    { label: roleLabel.ADMIN, value: 'ADMIN' as const },
];

export const ROLE_FILTER_ITEMS = [
    { label: 'همه نقش‌ها', value: 'all' as const },
    { label: roleLabel.ADMIN, value: 'ADMIN' as const },
    { label: roleLabel.USER, value: 'USER' as const },
];
