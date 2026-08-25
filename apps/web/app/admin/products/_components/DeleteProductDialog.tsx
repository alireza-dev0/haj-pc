'use client';

import { toast } from 'sonner';
import { getApiError } from '@/utils/api';
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
import { useDeleteProduct } from '../_hooks/useDeleteProduct';

type DeleteProductDialogProps = {
    productId: string;
    productName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
};

export default function DeleteProductDialog({
    productId,
    productName,
    open,
    onOpenChange,
    onDeleted,
}: DeleteProductDialogProps) {
    const { mutateAsync, isPending } = useDeleteProduct();

    async function handleDelete() {
        try {
            await mutateAsync(productId);
            toast.success('محصول با موفقیت حذف شد');
            onOpenChange(false);
            onDeleted?.();
        } catch (error) {
            const { message } = getApiError(error);
            toast.error(message ?? 'حذف محصول ناموفق بود');
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>حذف محصول</AlertDialogTitle>
                    <AlertDialogDescription>
                        آیا از حذف «{productName}» مطمئن هستید؟ این عمل قابل
                        بازگشت نیست.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        انصراف
                    </AlertDialogCancel>
                    <AlertDialogAction
                        type="button"
                        variant="destructive"
                        disabled={isPending}
                        onClick={(event) => {
                            event.preventDefault();
                            void handleDelete();
                        }}
                    >
                        {isPending ? 'در حال حذف...' : 'حذف'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
