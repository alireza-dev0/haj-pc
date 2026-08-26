'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckIcon, CopyIcon, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useSignin } from '../_hooks/useSignin';

function CopyableValue({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timeout = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timeout);
    }, [copied]);

    async function copy() {
        await navigator.clipboard.writeText(value);
        setCopied(true);
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'کپی شد' : `کپی ${value}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-background/70 px-2 py-0.5 font-mono text-text-primary transition-colors hover:bg-background"
            dir="ltr"
        >
            {value}
            {copied ? (
                <CheckIcon className="size-3.5 text-success" />
            ) : (
                <CopyIcon className="size-3.5 text-info" />
            )}
        </button>
    );
}

export function SigninPage() {
    const {
        register,
        onSubmit,
        formState: { errors, isSubmitting },
    } = useSignin();

    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <Alert className="max-w-md border-info/40 bg-info-soft">
                <InfoIcon className="text-info" />
                <AlertTitle>حساب دمو</AlertTitle>
                <AlertDescription>
                    برای ورود آزمایشی از این مشخصات استفاده کنید:
                    <div className="mt-2 grid gap-1.5 text-text-primary">
                        <p className="flex flex-wrap items-center gap-2">
                            ایمیل:
                            <CopyableValue value="admin@gmail.com" />
                        </p>
                        <p className="flex flex-wrap items-center gap-2">
                            رمز عبور:
                            <CopyableValue value="password_1122" />
                        </p>
                    </div>
                </AlertDescription>
            </Alert>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>ورود</CardTitle>
                    <CardDescription>
                        برای ادامه وارد حساب کاربری شوید
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="signin-form" onSubmit={onSubmit}>
                        <FieldGroup>
                            <Field data-invalid={!!errors.email || undefined}>
                                <FieldLabel htmlFor="email">ایمیل</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    aria-invalid={!!errors.email}
                                    {...register('email', {
                                        required: 'ایمیل الزامی است',
                                    })}
                                />
                                <FieldError errors={[errors.email]} />
                            </Field>
                            <Field
                                data-invalid={!!errors.password || undefined}
                            >
                                <FieldLabel htmlFor="password">
                                    رمز عبور
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    {...register('password', {
                                        required: 'رمز عبور الزامی است',
                                    })}
                                />
                                <FieldError errors={[errors.password]} />
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-3">
                    <Button
                        type="submit"
                        form="signin-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'در حال ورود...' : 'ورود'}
                    </Button>
                    <p className="text-center text-sm text-text-secondary">
                        حساب ندارید؟{' '}
                        <Link
                            href="/auth/signup"
                            className="text-info-darker underline-offset-4 hover:underline"
                        >
                            ثبت‌نام
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
