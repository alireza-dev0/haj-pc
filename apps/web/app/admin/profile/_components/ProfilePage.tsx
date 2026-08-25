'use client';

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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/store/useAuth';
import { ArrowRightIcon, UserRoundIcon } from 'lucide-react';
import { useUpdateProfile } from '../_hooks/useUpdateProfile';

export function ProfilePage() {
    const { user, isLoading } = useAuth();
    const {
        register,
        onSubmit,
        formState: { errors, isSubmitting },
    } = useUpdateProfile();

    return (
        <div className="flex flex-col gap-8">
            <header className="w-full flex items-center justify-between">
                <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <UserRoundIcon
                            className="size-7 text-brand"
                            strokeWidth={1.5}
                        />
                        <h1 className="text-xl font-semibold leading-snug">
                            حساب کاربری
                        </h1>
                    </div>
                    <div className="flex items-start gap-1.5">
                        <ArrowRightIcon
                            className="mt-0.75 size-4 text-text-secondary"
                            strokeWidth={1.5}
                        />
                        <p className="text-base text-text-secondary leading-relaxed">
                            نام، ایمیل و رمز عبور حساب خود را مدیریت کنید
                        </p>
                    </div>
                </section>
            </header>

            {isLoading && !user ? (
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>ویرایش پروفایل</CardTitle>
                        <CardDescription>
                            تغییرات روی حساب فعلی شما اعمال می‌شود
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="profile-form" onSubmit={onSubmit}>
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
                                <Field
                                    data-invalid={!!errors.email || undefined}
                                >
                                    <FieldLabel htmlFor="email">
                                        ایمیل
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        dir="ltr"
                                        aria-invalid={!!errors.email}
                                        {...register('email', {
                                            required: 'ایمیل الزامی است',
                                        })}
                                    />
                                    <FieldError errors={[errors.email]} />
                                </Field>
                                <p className="pt-2 text-sm font-medium leading-snug text-text-primary">
                                    تغییر رمز عبور
                                </p>
                                <Field
                                    data-invalid={
                                        !!errors.currentPassword || undefined
                                    }
                                >
                                    <FieldLabel htmlFor="currentPassword">
                                        رمز عبور فعلی
                                    </FieldLabel>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={!!errors.currentPassword}
                                        {...register('currentPassword', {
                                            validate: (value, formValues) => {
                                                if (
                                                    formValues.newPassword &&
                                                    !value
                                                ) {
                                                    return 'برای تغییر رمز عبور، رمز فعلی الزامی است';
                                                }
                                                return true;
                                            },
                                        })}
                                    />
                                    <FieldDescription>
                                        فقط در صورت تغییر رمز عبور لازم است
                                    </FieldDescription>
                                    <FieldError
                                        errors={[errors.currentPassword]}
                                    />
                                </Field>
                                <Field
                                    data-invalid={
                                        !!errors.newPassword || undefined
                                    }
                                >
                                    <FieldLabel htmlFor="newPassword">
                                        رمز عبور جدید
                                    </FieldLabel>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.newPassword}
                                        {...register('newPassword', {
                                            validate: (value) => {
                                                if (!value) return true;
                                                if (value.length < 8) {
                                                    return 'رمز عبور باید حداقل ۸ کاراکتر باشد';
                                                }
                                                return true;
                                            },
                                        })}
                                    />
                                    <FieldError errors={[errors.newPassword]} />
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            form="profile-form"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'در حال ذخیره...'
                                : 'ذخیره تغییرات'}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
