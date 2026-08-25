'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { getApiError } from '@/utils/api';
import { useDeleteCategory } from '../_hooks/useCategoryMutations';

type DeleteCategoryDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId: string;
    categoryName: string;
    onDeleted?: () => void;
};

export default function DeleteCategoryDialog({
    open,
    onOpenChange,
    categoryId,
    categoryName,
    onDeleted,
}: DeleteCategoryDialogProps) {
    const deleteCategory = useDeleteCategory();

    async function handleDelete() {
        try {
            await deleteCategory.mutateAsync(categoryId);
            toast.success('دسته‌بندی حذف شد');
            onOpenChange(false);
            onDeleted?.();
        } catch (error) {
            const { message } = getApiError(error);
            toast.error(message ?? 'حذف دسته‌بندی ممکن نشد');
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>حذف دسته‌بندی</AlertDialogTitle>
                    <AlertDialogDescription>
                        آیا از حذف دسته‌بندی «{categoryName}» مطمئن هستید؟ اگر
                        این دسته محصولی داشته باشد حذف انجام نمی‌شود.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deleteCategory.isPending}
                        onClick={(event) => {
                            event.preventDefault();
                            void handleDelete();
                        }}
                    >
                        {deleteCategory.isPending ? 'در حال حذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function useDeleteCategoryDialog() {
    const [target, setTarget] = useState<{
        id: string;
        name: string;
    } | null>(null);

    return {
        target,
        open: target !== null,
        openDialog: setTarget,
        onOpenChange: (next: boolean) => {
            if (!next) setTarget(null);
        },
    };
}
