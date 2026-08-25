import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import type { IUser, UserRole } from '@repo/types';
import { PrismaService } from '../shared/prisma.service';
import { ValidationException } from '../../common/exceptions/validation.exception';

type signin_input = Pick<IUser, 'email' | 'password'>;
type signin_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type signup_input = Pick<IUser, 'email' | 'password' | 'name'>;
type signup_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type refresh_input = Pick<IUser, 'id'>;
type refresh_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type updateProfile_input = {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
};
type updateProfile_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async signin(input: signin_input): Promise<signin_output> {
        const user = await this.prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
            throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
        }

        const passwordMatches = await bcrypt.compare(input.password, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
        }

        return this.toPublicUser(user);
    }

    async signup(input: signup_input): Promise<signup_output> {
        const existing = await this.prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existing) {
            throw new ConflictException('این ایمیل قبلاً ثبت شده است');
        }

        const password = await bcrypt.hash(input.password, 10);
        const user = await this.prisma.user.create({
            data: {
                id: randomUUID(),
                email: input.email,
                password,
                name: input.name,
                role: "USER",
            },
        });

        return this.toPublicUser(user);
    }

    async refresh(input: refresh_input): Promise<refresh_output> {
        const user = await this.prisma.user.findUnique({
            where: { id: input.id },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return this.toPublicUser(user);
    }

    async updateProfile(
        userId: string,
        input: updateProfile_input,
    ): Promise<updateProfile_output> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        if (input.email && input.email !== user.email) {
            const existing = await this.prisma.user.findUnique({
                where: { email: input.email },
            });

            if (existing) {
                throw new ConflictException('این ایمیل قبلاً ثبت شده است');
            }
        }

        let password: string | undefined;
        if (input.newPassword) {
            if (!input.currentPassword) {
                throw new ValidationException({
                    currentPassword: ['برای تغییر رمز عبور، رمز فعلی الزامی است'],
                });
            }

            const passwordMatches = await bcrypt.compare(
                input.currentPassword,
                user.password,
            );
            if (!passwordMatches) {
                throw new ValidationException({
                    currentPassword: ['رمز عبور فعلی اشتباه است'],
                });
            }

            password = await bcrypt.hash(input.newPassword, 10);
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(input.name !== undefined ? { name: input.name } : {}),
                ...(input.email !== undefined ? { email: input.email } : {}),
                ...(password !== undefined ? { password } : {}),
            },
        });

        return this.toPublicUser(updated);
    }

    private toPublicUser(user: {
        id: string;
        email: string;
        name: string;
        role: string;
    }): Pick<IUser, 'id' | 'email' | 'name' | 'role'> {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
        };
    }
}
