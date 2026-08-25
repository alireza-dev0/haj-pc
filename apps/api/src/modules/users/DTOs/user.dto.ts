import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =============================== Query DTO ===============================
// zod schema with persian messages
export const UsersQuerySchema = z.object({
    q: z.string().trim().optional().default(''),
    role: z
        .enum(['ADMIN', 'USER'], { error: 'نقش نامعتبر است' })
        .optional(),
    page: z.coerce
        .number({ error: 'شماره صفحه باید عدد باشد' })
        .int('شماره صفحه باید عدد صحیح باشد')
        .min(1, 'شماره صفحه باید حداقل ۱ باشد')
        .optional()
        .default(1),
    limit: z.coerce
        .number({ error: 'تعداد آیتم در صفحه باید عدد باشد' })
        .int('تعداد آیتم در صفحه باید عدد صحیح باشد')
        .min(1, 'تعداد آیتم در صفحه باید حداقل ۱ باشد')
        .max(48, 'تعداد آیتم در صفحه حداکثر ۴۸ است')
        .optional()
        .default(12),
});

export class UsersDto_Query extends createZodDto(UsersQuerySchema) {}

// =============================== Request DTO ===============================

export const CreateUserSchema = z.object({
    name: z
        .string({ error: 'نام الزامی است' })
        .min(1, 'نام الزامی است'),
    email: z.email('ایمیل معتبر نیست'),
    password: z
        .string({ error: 'رمز عبور الزامی است' })
        .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
    role: z
        .enum(['ADMIN', 'USER'], { error: 'نقش نامعتبر است' })
        .optional()
        .default('USER'),
});

export class CreateUserDto_Request extends createZodDto(CreateUserSchema) {}

export const UpdateUserSchema = z.object({
    name: z
        .string({ error: 'نام الزامی است' })
        .min(1, 'نام الزامی است')
        .optional(),
    email: z.email('ایمیل معتبر نیست').optional(),
    password: z
        .string({ error: 'رمز عبور الزامی است' })
        .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
        .optional(),
    role: z
        .enum(['ADMIN', 'USER'], { error: 'نقش نامعتبر است' })
        .optional(),
});

export class UpdateUserDto_Request extends createZodDto(UpdateUserSchema) {}

// =============================== Response DTO ===============================

export class UserDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه کاربر' })
    id!: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    email!: string;

    @ApiProperty({ example: 'علی رضایی', description: 'نام کاربر' })
    name!: string;

    @ApiProperty({ example: 'USER', description: 'نقش کاربر', enum: ['USER', 'ADMIN'] })
    role!: 'USER' | 'ADMIN';

    @ApiProperty({ example: '2024-01-15T08:30:00.000Z', description: 'تاریخ ایجاد' })
    createdAt!: Date;

    @ApiProperty({ example: '2024-01-15T08:30:00.000Z', description: 'تاریخ به‌روزرسانی' })
    updatedAt!: Date;
}

export class UserListDto_Response {
    @ApiProperty({ type: () => [UserDto_Response], description: 'لیست کاربران' })
    items!: UserDto_Response[];

    @ApiProperty({ example: 42, description: 'تعداد کل کاربران' })
    total!: number;

    @ApiProperty({ example: 1, description: 'شماره صفحه' })
    page!: number;

    @ApiProperty({ example: 12, description: 'تعداد آیتم در صفحه' })
    limit!: number;
}
