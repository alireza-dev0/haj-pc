import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// =============================== Request DTO ===============================
// zod schema with persian messages
export const SigninSchema = z.object({
    email: z.email('ایمیل معتبر نیست'),
    password: z
        .string({ error: 'رمز عبور الزامی است' })
        .min(1, 'رمز عبور الزامی است'),
});

// dto class that made from zod schema with nestjs-zod
export class SigninDto_Request extends createZodDto(SigninSchema) {}

// =============================== Response DTO ===============================

// maded with @nestjs/swagger with example and description
export class SigninDto_Response {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'شناسه کاربر' })
    id!: string;

    @ApiProperty({ example: 'user@example.com', description: 'ایمیل کاربر' })
    email!: string;

    @ApiProperty({ example: 'علی رضایی', description: 'نام کاربر' })
    name!: string;

    @ApiProperty({ example: 'USER', description: 'نقش کاربر', enum: ['USER', 'ADMIN'] })
    role!: 'USER' | 'ADMIN';
}
