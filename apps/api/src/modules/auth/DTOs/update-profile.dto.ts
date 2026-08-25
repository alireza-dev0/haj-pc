import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =============================== Request DTO ===============================
// zod schema with persian messages
export const UpdateProfileSchema = z
    .object({
        name: z
            .string({ error: 'نام الزامی است' })
            .min(1, 'نام الزامی است')
            .optional(),
        email: z.email('ایمیل معتبر نیست').optional(),
        currentPassword: z.string().optional(),
        newPassword: z
            .string()
            .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
            .optional(),
    })
    .refine((data) => !data.newPassword || !!data.currentPassword, {
        path: ['currentPassword'],
        message: 'برای تغییر رمز عبور، رمز فعلی الزامی است',
    });

// dto class that made from zod schema with nestjs-zod
export class UpdateProfileDto_Request extends createZodDto(UpdateProfileSchema) {}

// =============================== Response DTO ===============================

// maded with @nestjs/swagger with example and description
export class UpdateProfileDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه کاربر' })
    id!: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    email!: string;

    @ApiProperty({ example: 'علی رضایی', description: 'نام کاربر' })
    name!: string;

    @ApiProperty({ example: 'USER', description: 'نقش کاربر', enum: ['USER', 'ADMIN'] })
    role!: 'USER' | 'ADMIN';
}
