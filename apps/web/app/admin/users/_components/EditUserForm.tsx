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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateUser } from '../_hooks/useUpdateUser';
import { ROLE_ITEMS } from '../_lib/role-labels';
import type { UserRole } from '@repo/types';

export function EditUserForm({ id }: { id: string }) {
    const {
        register,
        onSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        isLoading,
        isError,
    } = useUpdateUser(id);

    if (isLoading) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <p className="py-10 text-center text-error">کاربر یافت نشد</p>
        );
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>ویرایش کاربر</CardTitle>
                <CardDescription>
                    نام، ایمیل، نقش و در صورت نیاز رمز عبور جدید را ذخیره کنید
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="edit-user-form" onSubmit={onSubmit}>
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
                                dir="ltr"
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                                {...register('email', {
                                    required: 'ایمیل الزامی است',
                                })}
                            />
                            <FieldError errors={[errors.email]} />
                        </Field>
                        <Field data-invalid={!!errors.role || undefined}>
                            <FieldLabel htmlFor="role">نقش</FieldLabel>
                            <Select
                                items={ROLE_ITEMS}
                                value={watch('role')}
                                onValueChange={(value) =>
                                    setValue('role', value as UserRole, {
                                        shouldValidate: true,
                                    })
                                }
                            >
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="نقش را انتخاب کنید" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {ROLE_ITEMS.map((item) => (
                                            <SelectItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldError errors={[errors.role]} />
                        </Field>
                        <Field data-invalid={!!errors.password || undefined}>
                            <FieldLabel htmlFor="password">
                                رمز عبور جدید
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                dir="ltr"
                                autoComplete="new-password"
                                aria-invalid={!!errors.password}
                                {...register('password', {
                                    minLength: {
                                        value: 8,
                                        message:
                                            'رمز عبور باید حداقل ۸ کاراکتر باشد',
                                    },
                                })}
                            />
                            <FieldDescription>
                                در صورت خالی بودن، رمز عبور تغییر نمی‌کند
                            </FieldDescription>
                            <FieldError errors={[errors.password]} />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-2">
                <Button
                    type="submit"
                    form="edit-user-form"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
            </CardFooter>
        </Card>
    );
}
