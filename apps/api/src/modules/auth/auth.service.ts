import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import type { IUser, UserRole } from '@repo/types';
import { PrismaService } from '../shared/prisma.service';

type signin_input = Pick<IUser, 'email' | 'password'>;
type signin_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type signup_input = Pick<IUser, 'email' | 'password' | 'name'>;
type signup_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

type refresh_input = Pick<IUser, 'id'>;
type refresh_output = Pick<IUser, 'id' | 'email' | 'name' | 'role'>;

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
