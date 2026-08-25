import Link from 'next/link';
import { ShieldOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-svh items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-error-soft">
                        <ShieldOffIcon
                            className="size-5 text-error"
                            strokeWidth={1.5}
                        />
                    </div>
                    <CardTitle>دسترسی غیرمجاز</CardTitle>
                    <CardDescription>
                        شما اجازهٔ ورود به پنل مدیریت را ندارید. برای ادامه با
                        حساب مدیر وارد شوید یا به صفحه اصلی برگردید.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col items-stretch gap-3">
                    <Button
                        nativeButton={false}
                        render={<Link href="/auth/signin" />}
                    >
                        ورود به حساب
                    </Button>
                    <Button
                        variant="secondary"
                        nativeButton={false}
                        render={<Link href="/" />}
                    >
                        صفحه اصلی
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
