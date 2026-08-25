'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/store/useAuth';
import { useUser } from '../_hooks/useUser';
import { UserRoleBadge } from './UserRoleBadge';
import { DeleteUserDialog } from './DeleteUserDialog';
import { formatJalaliDate } from '../_lib/format-date';

export function UserDetail({ id }: { id: string }) {
    const router = useRouter();
    const { data: user, isLoading, isError } = useUser(id);
    const currentUserId = useAuth((state) => state.user?.id);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                </CardContent>
            </Card>
        );
    }

    if (isError || !user) {
        return (
            <p className="py-10 text-center text-error">کاربر یافت نشد</p>
        );
    }

    const isSelf = user.id === currentUserId;

    return (
        <>
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <dt className="text-sm text-text-secondary">
                                ایمیل
                            </dt>
                            <dd className="text-text-primary">
                                <span dir="ltr" className="inline-block">
                                    {user.email}
                                </span>
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-sm text-text-secondary">نقش</dt>
                            <dd>
                                <UserRoleBadge role={user.role} />
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-sm text-text-secondary">
                                تاریخ ایجاد
                            </dt>
                            <dd>
                                <span dir="ltr" className="tabular-nums">
                                    {formatJalaliDate(user.createdAt)}
                                </span>
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-sm text-text-secondary">
                                آخرین به‌روزرسانی
                            </dt>
                            <dd>
                                <span dir="ltr" className="tabular-nums">
                                    {formatJalaliDate(user.updatedAt)}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-2">
                    <Button
                        variant="secondary"
                        render={({ children, ...props }) => (
                            <Link
                                href={`/admin/users/${user.id}/edit`}
                                className={props.className}
                            >
                                {children}
                            </Link>
                        )}
                    >
                        <EditIcon className="size-4" strokeWidth={1.5} />
                        ویرایش
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={isSelf}
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2Icon className="size-4" strokeWidth={1.5} />
                        حذف
                    </Button>
                </CardFooter>
            </Card>
            <DeleteUserDialog
                user={{ id: user.id, name: user.name }}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={() => router.push('/admin/users')}
            />
        </>
    );
}
