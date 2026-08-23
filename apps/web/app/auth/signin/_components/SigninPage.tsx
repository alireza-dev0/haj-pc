'use client';

import Link from 'next/link';
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

export function SigninPage() {
    const {
        register,
        onSubmit,
        formState: { errors, isSubmitting },
    } = useSignin();

    return (
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
                        <Field data-invalid={!!errors.password || undefined}>
                            <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
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
    );
}
