'use client';

import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@repo/types';
import { roleLabel } from '../_lib/role-labels';

export function UserRoleBadge({ role }: { role: UserRole }) {
    return (
        <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
            {roleLabel[role]}
        </Badge>
    );
}
