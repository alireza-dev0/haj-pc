'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteUser } from '../_hooks/useDeleteUser';

type DeleteUserDialogProps = {
    user: { id: string; name: string } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
};

export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
    onDeleted,
}: DeleteUserDialogProps) {
    const { mutate, isPending } = useDeleteUser();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
                    <AlertDialogDescription>
                        {user
                            ? `آیا از حذف «${user.name}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`
                            : 'آیا از حذف این کاربر مطمئن هستید؟'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        انصراف
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={!user || isPending}
                        onClick={() => {
                            if (!user) return;
                            mutate(user.id, {
                                onSuccess: () => {
                                    onOpenChange(false);
                                    onDeleted?.();
                                },
                            });
                        }}
                    >
                        {isPending ? 'در حال حذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
