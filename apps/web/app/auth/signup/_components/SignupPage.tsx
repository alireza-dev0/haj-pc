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
import { useSignup } from '../_hooks/useSignup';

export function SignupPage() {
    const {
        register,
        onSubmit,
        formState: { errors, isSubmitting },
    } = useSignup();

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>ثبت‌نام</CardTitle>
                <CardDescription>حساب کاربری جدید بسازید</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signup-form" onSubmit={onSubmit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.name || undefined}>
                            <FieldLabel htmlFor="name">نام</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                autoComplete="name"
                                aria-invalid={!!errors.name}
                                {...register('name', {
                                    required: 'نام الزامی است',
                                })}
                            />
                            <FieldError errors={[errors.name]} />
                        </Field>
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
                                autoComplete="new-password"
                                aria-invalid={!!errors.password}
                                {...register('password', {
                                    required: 'رمز عبور الزامی است',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'رمز عبور باید حداقل ۸ کاراکتر باشد',
                                    },
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
                    form="signup-form"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                </Button>
                <p className="text-center text-sm text-text-secondary">
                    حساب دارید؟{' '}
                    <Link
                        href="/auth/signin"
                        className="text-info-darker underline-offset-4 hover:underline"
                    >
                        ورود
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
