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
import { useCreateUser } from '../_hooks/useCreateUser';
import { ROLE_ITEMS } from '../_lib/role-labels';
import type { UserRole } from '@repo/types';

export function CreateUserForm() {
    const {
        register,
        onSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useCreateUser();

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>کاربر جدید</CardTitle>
                <CardDescription>
                    حساب کاربری را با نام، ایمیل، رمز عبور و نقش بسازید
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="create-user-form" onSubmit={onSubmit}>
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
                        <Field data-invalid={!!errors.password || undefined}>
                            <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                dir="ltr"
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
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-2">
                <Button
                    type="submit"
                    form="create-user-form"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'در حال ایجاد...' : 'ایجاد کاربر'}
                </Button>
            </CardFooter>
        </Card>
    );
}
